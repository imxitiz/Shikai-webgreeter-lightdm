#!/bin/bash
set -e

# Build production version
NO_BUILD=false

usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  -b, --no-build     Skip the build step and use existing ./dist
  -h, --help         Show this help
EOF
}

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--no-build) NO_BUILD=true; shift ;;
    -h|--help) usage; exit 0 ;;
    --) shift; break ;;
    -*) echo "Unknown option: $1"; usage; exit 1 ;;
    *) break ;;
  esac
done

# Build production version (unless skipped)
if [[ "$NO_BUILD" = false ]]; then
  echo "Building production version..."
  bun run build
else
  echo "Skipping build as requested. Using existing ./dist"
fi

# Create temp directory
rm -rf ../shikai
cp -r ./dist ../shikai

# Disable debug mode
cd ../shikai
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' index.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' app.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' modern.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' monitor.html

# Install to system
cd ../
sudo rm -rf /usr/share/web-greeter/themes/shikai
sudo mv ./shikai /usr/share/web-greeter/themes/

# Set theme in config (only if not already set)
sudo sed -i 's/^\(\s*theme:\s*\).*/\1shikai/' /etc/lightdm/web-greeter.yml || true

echo "Shikai theme installed successfully!"