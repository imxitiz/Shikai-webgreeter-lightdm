#!/usr/bin/env bash
set -euo pipefail

# This script updates license lines in files changed in the last commit.
# It is robust to variations in spacing/punctuation and preserves the comment prefix.

# Config
NEW_OWNER="imxitiz"
NEW_YEAR="2026"
Copyright (c) 2026, imxitiz.

# Get list of new and modified files from git (A = added, M = modified)
NEW_FILES=$(git diff --name-status HEAD~1 | awk '/^A/ {print $2}')
MODIFIED_FILES=$(git diff --name-status HEAD~1 | awk '/^M/ {print $2}')

# Replace the first copyright line in a file with a canonical line (preserves comment prefix)
replace_copyright_line() {
  local file="$1"
  # Use awk to replace the first copyright-looking line with the canonical one, preserving leading comment prefix and trailing comment end
  awk -v new="${NEW_COPYLINE}" '
    BEGIN{done=0}
    {
      if(!done && tolower($0) ~ /copyright/){
        # capture leading non-alnum chars (comment prefix)
        match($0,/^[ \t]*[^A-Za-z0-9]*/);
        prefix = substr($0, RSTART, RLENGTH);
        # capture trailing comment end like */ to preserve
        end="";
        if(match($0, /[ \t]*\*\/\s*$/)) { end = substr($0, RSTART, RLENGTH) }
        print prefix new end;
        done=1
      } else {
        print $0
      }
    }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

# Append new owner to existing copyright lines that mention TheWisker but do not mention the new owner yet
append_owner_to_existing() {
  local file="$1"
  if grep -qi 'thewisker' "$file" && ! grep -qi "$NEW_OWNER" "$file"; then
    # On the first copyright line mentioning TheWisker, trim trailing punctuation and append ", <owner>."
    awk -v owner="$NEW_OWNER" '
      BEGIN{ done=0 }
      {
        line_l=tolower($0)
        if(!done && line_l ~ /copyright/ && line_l ~ /thewisker/){
          line=$0
          sub(/[[:space:].,;:]+$/,"",line)
          print line ", " owner "."
          done=1
        } else {
          print $0
        }
      }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
}

# Add copyright if missing (inserts a sensible comment prefix)
add_copyright_if_missing() {
  local file="$1"

  # If the file has an HTML-style comment header, insert inside it (after the opening <!--)
  if head -n 10 "$file" | grep -q '^<!--'; then
    # insert after the opening <!-- line so it matches existing doc header format
    sed -n '1,10p' "$file" | sed -n '/^<!--/=' | head -n1 >/tmp/line.num.$$ || true
    if [ -f /tmp/line.num.$$ ]; then
      ln=$(cat /tmp/line.num.$$)
      awk -v ln="$ln" -v new="$NEW_COPYLINE" 'NR==ln{print; print " " new; next} {print}' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
      rm -f /tmp/line.num.$$ || true
      return
    fi
  fi

  # fallback: choose a comment style based on file extension
  local prefix="# "
  local suffix=""
  case "${file##*.}" in
    js|jsx|ts|tsx|css|scss)
      prefix="/* "
      suffix=" */"
      ;;
    sh|bash)
      prefix="# "
      suffix=""
      ;;
  esac

  if ! grep -qi 'copyright' "$file"; then
    # insert after shebang if present
    if head -n1 "$file" | grep -q '^#!'; then
      sed -i "1a${prefix}${NEW_COPYLINE}${suffix}" "$file"
    else
      sed -i "1i${prefix}${NEW_COPYLINE}${suffix}" "$file"
    fi
  fi
}

# Process new files
for file in $NEW_FILES; do
  [ -z "$file" ] && continue
  # If file has any copyright line, replace the first one; otherwise insert a new one
  if grep -qi 'copyright' "$file"; then
    replace_copyright_line "$file"
  else
    add_copyright_if_missing "$file"
  fi
done

# Process modified files
for file in $MODIFIED_FILES; do
  [ -z "$file" ] && continue
  append_owner_to_existing "$file"
done
