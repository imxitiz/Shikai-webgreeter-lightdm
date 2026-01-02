#!/usr/bin/env bash
set -euo pipefail

LIVE_DIR="/usr/share/web-greeter/themes/shikai-live"

# Build and deploy fast (for CI / manual deploy)
bun run build

sudo mkdir -p "$LIVE_DIR"
sudo rsync -a --delete dist/ "$LIVE_DIR/"

# Disable debug flags
sudo sed -i 's/window.__is_debug = true/window.__is_debug = false/g' "$LIVE_DIR"/*.html || true

echo "Deployed to $LIVE_DIR"