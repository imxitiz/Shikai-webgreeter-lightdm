#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="$(pwd)"
DIST_DIR="$SRC_DIR/dist"
LIVE_DIR="/usr/share/web-greeter/themes/shikai-live"

DEV_USER="${SUDO_USER:-$USER}"

# Detect inotify availability; we'll fall back to a polling loop if missing
USE_INOTIFY=true
if ! command -v inotifywait >/dev/null 2>&1; then
  echo "inotifywait not found: will fall back to a polling loop (install inotify-tools for better performance)."
  USE_INOTIFY=false
fi

# Ensure the development folder exists and grant write access if possible
if [ ! -d "$LIVE_DIR" ]; then
  echo "$LIVE_DIR does not exist. Creating and attempting to grant $DEV_USER write access..."
  if command -v setfacl >/dev/null 2>&1; then
    sudo mkdir -p "$LIVE_DIR"
    sudo chown root:lightdm "$LIVE_DIR" || true
    sudo setfacl -R -m u:"$DEV_USER":rwx "$LIVE_DIR" || true
    sudo setfacl -d -m u:"$DEV_USER":rwx "$LIVE_DIR" || true
    echo "Granted ACL write perms to $DEV_USER on $LIVE_DIR"
  else
    echo "Please create $LIVE_DIR and grant write perms to $DEV_USER, e.g.:
      sudo mkdir -p $LIVE_DIR
      sudo chown -R $DEV_USER:lightdm $LIVE_DIR"
    exit 1
  fi
fi

# Start a watch build (bun supports --watch)
# Use the watch script from package.json for faster incremental builds
bun run watch &
BUILD_PID=$!
trap 'kill $BUILD_PID; exit' INT TERM

# Wait for first build to create dist
while [ ! -d "$DIST_DIR" ]; do sleep 0.2; done
# Use rsync without preserving owner/group to avoid permission errors when running as non-root
if ! rsync -a --no-o --no-g --delete --chmod=ugo=rwX "$DIST_DIR/" "$LIVE_DIR/"; then
  echo "Warning: initial rsync failed (permission issue). Trying a sudo rsync..."
  sudo rsync -a --delete --chmod=ugo=rwX "$DIST_DIR/" "$LIVE_DIR/" || echo "sudo rsync also failed: check permissions on $LIVE_DIR"
fi
echo "Initial sync complete to $LIVE_DIR"

# Watch for changes in dist and sync incrementally (debounced)
if [ "$USE_INOTIFY" = true ]; then
  echo "Watching for changes in $DIST_DIR (inotify with debounce)..."
  # Debounce strategy: wait for first event, then wait until no further events for QUIET_PERIOD seconds
  QUIET_PERIOD=0.3
  while true; do
    # Wait for at least one event (timeout 1s to allow loop to be interruptible)
    if inotifywait -r -e close_write,create,delete -t 1 "$DIST_DIR" >/dev/null 2>&1; then
      # Keep consuming events until quiet period observed
      while inotifywait -r -e close_write,create,delete -t "$QUIET_PERIOD" "$DIST_DIR" >/dev/null 2>&1; do
        : # keep looping while events are still coming
      done

      echo "Change(s) detected -> syncing to $LIVE_DIR"
      if ! rsync -a --no-o --no-g --delete --chmod=ugo=rwX "$DIST_DIR/" "$LIVE_DIR/"; then
        echo "Warning: incremental rsync failed; retrying with sudo..."
        sudo rsync -a --delete --chmod=ugo=rwX "$DIST_DIR/" "$LIVE_DIR/" || echo "sudo rsync failed; check permissions on $LIVE_DIR"
      fi
    else
      # no event within timeout, continue (allows graceful handling of interrupts)
      sleep 0.1
    fi
  done
else
  # Fallback polling: watch file mtimes and sync when something changed
  # Create a marker to compare against
  touch "$DIST_DIR/.last_sync"
  while true; do
    if find "$DIST_DIR" -type f -newer "$DIST_DIR/.last_sync" -print -quit >/dev/null 2>&1; then
      echo "Change detected (poll) -> syncing to $LIVE_DIR"
      if ! rsync -a --no-o --no-g --delete --chmod=ugo=rwX "$DIST_DIR/" "$LIVE_DIR/"; then
        echo "Warning: poll rsync failed; attempting sudo rsync..."
        sudo rsync -a --delete --chmod=ugo=rwX "$DIST_DIR/" "$LIVE_DIR/" || echo "sudo rsync failed; check permissions on $LIVE_DIR"
      fi
      touch "$DIST_DIR/.last_sync"
    fi
    sleep 0.5
  done
fi
