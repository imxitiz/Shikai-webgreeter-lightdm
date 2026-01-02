#!/bin/bash
set -e

# Build production version
bun run build

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
sudo sed -i 's/^\(\s*theme:\s*\).*/\1shikai/' /etc/lightdm/web-greeter.yml

echo "Shikai theme installed successfully!"