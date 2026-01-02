#!/bin/bash
set -e

# Build production version
bun run build

# Export CI build to a dedicated CI folder (does NOT change the active theme)
LIVE_DIR="/usr/share/web-greeter/themes/shikai-ci"
sudo mkdir -p "$LIVE_DIR"
# Sync built files
sudo rsync -a --delete dist/ "$LIVE_DIR/"

# Disable debug mode in the exported files
sudo sed -i 's/window.__is_debug = true/window.__is_debug = false/g' "$LIVE_DIR/index.html" || true
sudo sed -i 's/window.__is_debug = true/window.__is_debug = false/g' "$LIVE_DIR/app.html" || true
sudo sed -i 's/window.__is_debug = true/window.__is_debug = false/g' "$LIVE_DIR/modern.html" || true
sudo sed -i 's/window.__is_debug = true/window.__is_debug = false/g' "$LIVE_DIR/monitor.html" || true

echo "Shikai CI export created at $LIVE_DIR (does not change the active theme)"
