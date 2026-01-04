#!/bin/bash
set -e

# Build production version
bun run dev

# Create temp directory
rm -rf ../shikai-dev
cp -r ./dist ../shikai-dev

+# Disable debug mode
cd ../shikai-dev
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' index.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' app.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' modern.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' monitor.html

# Install to system
cd ../
sudo rm -rf /usr/share/web-greeter/themes/shikai-dev
sudo mv ./shikai-dev /usr/share/web-greeter/themes/

# Set theme in config (only if not already set)
# sudo sed -i 's/^\(\s*theme:\s*\).*/\1shikai-dev/' /etc/lightdm/web-greeter.yml

echo "Shikai-dev theme installed successfully!"

echo 'To test this theme, run `sea-greeter --theme shikai-dev`'