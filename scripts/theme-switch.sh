#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script with sudo to modify greeter config: sudo $0 [shikai|shikai-live]"
  exit 1
fi

TARGET=${1:-}
if [ -z "$TARGET" ]; then
  echo "Usage: sudo $0 [shikai|shikai-live]"
  exit 2
fi

# Candidate config files to update (web-greeter and sea-greeter common locations)
CONFIG_FILES=(
  "/etc/lightdm/web-greeter.yml"
)

UPDATED=false
for cfg in "${CONFIG_FILES[@]}"; do
  if [ -f "$cfg" ]; then
    # Show previous theme line (if any)
    PREV_LINE=$(grep -n "^\s*theme:\s*" "$cfg" | head -n1 || true)

    if grep -q "^\s*theme:\s*" "$cfg"; then
      # Replace all theme: occurrences (preserve leading whitespace)
      sed -E -i "s/^([[:space:]]*)theme:[[:space:]]*.*/\1theme: $TARGET/" "$cfg" || true
      NEW_LINE=$(grep -n "^\s*theme:\s*" "$cfg" | head -n1 || true)
      echo "Updated $cfg"
      echo "  before: ${PREV_LINE:-(none)}"
      echo "  after:  ${NEW_LINE:-(none)}"
      UPDATED=true
    else
      # Attempt to add under a top-level `branding:` if exists
      if grep -q "^\s*branding:\s*" "$cfg"; then
        # insert theme: under branding (respect indentation) if no theme exists
        if ! grep -q "^\s*branding:[^\n]*\n[[:space:]]*theme:" "$cfg"; then
          awk -v tgt="$TARGET" '{
            print
            if ($0 ~ /^[[:space:]]*branding:[[:space:]]*$/) {
              print "  theme: " tgt
            }
          }' "$cfg" > "$cfg.tmp" && mv "$cfg.tmp" "$cfg"
          NEW_LINE=$(grep -n "^\s*theme:\s*" "$cfg" | head -n1 || true)
          echo "Inserted theme under branding in $cfg"
          echo "  after: ${NEW_LINE:-(none)}"
          UPDATED=true
        fi
      else
        # No branding or theme key found: append a theme key at end (best-effort)
        echo "\n# Added by shikai scripts" >> "$cfg"
        echo "theme: $TARGET" >> "$cfg"
        echo "Appended 'theme: $TARGET' to $cfg (no existing theme key found)"
        UPDATED=true
      fi
    fi
  fi
done

if [ "$UPDATED" = false ]; then
  echo "No greeter config files updated. Please ensure you are using web-greeter or sea-greeter and that the config files exist under /etc/."
  exit 1
fi

# Inform user about greeter restart
echo "Note: many greeters read configuration only at startup; if the greeter is already running, restart it or start in debug mode to pick up the new theme."

exit 0
