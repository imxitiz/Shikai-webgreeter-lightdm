#!/usr/bin/env bash
set -euo pipefail

# Create and prepare development folder `/usr/share/web-greeter/themes/shikai-live`
LIVE_DIR="/usr/share/web-greeter/themes/shikai-live"

if [ "$(id -u)" -ne 0 ]; then
  echo "This script requires sudo/root. Run: sudo $0"
  exit 1
fi

DEV_USER="${SUDO_USER:-$USER}"
mkdir -p "$LIVE_DIR"

# Ensure group and default perms and grant write access to the dev user via ACL (if available)
if command -v setfacl >/dev/null 2>&1; then
  sudo chown root:lightdm "$LIVE_DIR" || true
  sudo setfacl -R -m u:"$DEV_USER":rwx "$LIVE_DIR" || true
  sudo setfacl -d -m u:"$DEV_USER":rwx "$LIVE_DIR" || true
  echo "Created $LIVE_DIR and granted write access to $DEV_USER (via ACL)."
else
  echo "Created $LIVE_DIR. To allow your user to write, run e.g.:
  sudo chown -R $DEV_USER:lightdm $LIVE_DIR
  OR
  sudo chmod -R g+w $LIVE_DIR"
fi

echo "Development folder ready: $LIVE_DIR (this does not change the active theme)"
