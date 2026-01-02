#!/usr/bin/env bash
set -euo pipefail

# dev-ci: interactive dev flow
# - ensures dev folder exists
# - switches greeter theme to shikai-live
# - runs dev-sync in foreground
# - on exit, reverts theme back to shikai

# require scripts to be executable from repo root
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

SUDO_CMD=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO_CMD="sudo"
fi

# Prepare dev folder and ACLs
$SUDO_CMD ./scripts/symlink.sh

# Switch greeter to dev theme
$SUDO_CMD ./scripts/theme-switch.sh shikai-live

echo "Dev CI environment started. Theme set to shikai-live. (Press Ctrl+C to stop and revert)"
# Optional: auto-launch sea-greeter debug while dev-ci runs
# Usage: ./scripts/dev-ci.sh --launch-greeter
LAUNCH_GREETER=false
if [ "${1:-}" = "--launch-greeter" ]; then
  LAUNCH_GREETER=true
fi

# If requested, try to launch sea-greeter -d as the lightdm user
GREETER_PID=""
if [ "$LAUNCH_GREETER" = true ]; then
  echo "Auto-launch requested: attempting to start 'sudo -u lightdm sea-greeter -d'"
  if pgrep -u lightdm -f "sea-greeter" >/dev/null 2>&1; then
    echo "A sea-greeter process is already running under user 'lightdm'."
    read -p "Kill existing sea-greeter and start a fresh debug instance? [y/N] " ans
    if [[ "$ans" =~ ^[Yy]$ ]]; then
      sudo pkill -u lightdm -f "sea-greeter" || true
    else
      echo "Leaving existing greeter running; it may not pick up the theme change until restarted."
    fi
  fi

  # Start debug greeter in background (may require an X/Wayland session active)
  sudo -u lightdm sea-greeter -d &
  GREETER_PID=$!
  echo "Started sea-greeter (debug) with PID $GREETER_PID"
fi

# If inotifywait is missing, offer to auto-install on Arch (interactive)
if ! command -v inotifywait >/dev/null 2>&1; then
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    if echo "${ID:-} ${ID_LIKE:-}" | grep -q -E "arch|manjaro"; then
      read -p "inotify-tools not found. Install via 'sudo pacman -S inotify-tools' now? [Y/n] " ans
      ans="${ans:-Y}"
      if [[ "$ans" =~ ^[Yy]$ ]]; then
        echo "Installing inotify-tools..."
        $SUDO_CMD pacman -Syu --noconfirm inotify-tools || echo "Installation failed or interrupted; continuing with polling fallback."
      else
        echo "Continuing without inotify; using polling fallback (less efficient)."
      fi
    else
      echo "inotify-tools not found. Continuing without it and using a polling fallback (less efficient)."
    fi
  fi
fi

revert() {
  echo "Stopping dev CI: reverting theme to shikai..."
  $SUDO_CMD ./scripts/theme-switch.sh shikai || true

  if [ -n "${GREETER_PID:-}" ]; then
    echo "Stopping auto-launched sea-greeter (PID $GREETER_PID)"
    sudo kill "$GREETER_PID" >/dev/null 2>&1 || true
  fi
}

trap revert EXIT

# Run dev-sync (foreground). When it exits (ctrl+c), trap runs and reverts the theme.
./scripts/dev-sync.sh
