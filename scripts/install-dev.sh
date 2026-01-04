#!/bin/bash
set -e

# Build production version
bun run dev

# Create temp directory
rm -rf ../shikai-org
cp -r ./dist ../shikai-org

# Disable debug mode
cd ../shikai-org
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' index.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' app.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' modern.html
sed -i 's/window.__is_debug = true/window.__is_debug = false/g' monitor.html

# Install to system
cd ../
sudo rm -rf /usr/share/web-greeter/themes/shikai-org
sudo mv ./shikai-org /usr/share/web-greeter/themes/

# Set theme in config (only if not already set)
# sudo sed -i 's/^\(\s*theme:\s*\).*/\1shikai-org/' /etc/lightdm/web-greeter.yml

echo "Shikai-org theme installed successfully!"

echo 'To test this theme, run `sea-greeter --theme shikai-org`'