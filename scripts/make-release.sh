#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(pwd -P)"

# make-release.sh
# Build the project, gather installable files and create a versioned ZIP release.

OUTPUT_DIR="./releases"
KEEP_TMP=false
ZIP_ONLY=false
OVERRIDE_VERSION=""

usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  -o DIR       Output directory for the zip (default: ./releases)
  -k           Keep temporary files (don't remove tmp dir)
  -z           Zip-only: skip building (use existing ./dist)
  -v VERSION   Override version (e.g., 1.6.0)
  -h           Show this help
EOF
}

while getopts ":o:zkv:h" opt; do
  case ${opt} in
    o) OUTPUT_DIR=${OPTARG} ;;
    k) KEEP_TMP=true ;;
    z) ZIP_ONLY=true ;;
    v) OVERRIDE_VERSION=${OPTARG} ;;
    h) usage; exit 0 ;;
    *) usage; exit 1 ;;
  esac
done

# Determine version
if [[ -n "$OVERRIDE_VERSION" ]]; then
  VERSION="$OVERRIDE_VERSION"
else
  if [[ -f package.json ]]; then
    VERSION=$(grep -m1 '"version"' package.json | sed -E 's/.*"version": *"([^"]+)".*/\1/')
  fi
  if [[ -z "${VERSION:-}" ]]; then
    echo "Error: could not detect version. Pass with -v VERSION." >&2
    exit 1
  fi
fi

echo "Creating release for version: $VERSION"

# Build
if [[ "$ZIP_ONLY" = false ]]; then
  echo "Building production bundle..."
  bun run build
else
  echo "Skipping build (zip-only). Using existing ./dist" 
fi

if [[ ! -d ./dist ]]; then
  echo "Error: ./dist not found. Build must produce a dist/ directory." >&2
  exit 1
fi

# Prepare temporary directory
TMPDIR=$(mktemp -d "${PWD}/shikai-release-XXXX")
RELEASE_DIR="$TMPDIR/shikai-$VERSION"
mkdir -p "$RELEASE_DIR"

# Copy dist contents
cp -r ./dist/* "$RELEASE_DIR/"

# Disable debug flags in HTML files (if present)
for f in index.html app.html modern.html monitor.html; do
  if [[ -f "$RELEASE_DIR/$f" ]]; then
    sed -i 's/window.__is_debug = true/window.__is_debug = false/g' "$RELEASE_DIR/$f" || true
  fi
done

# Copy packaging and metadata files
FILES_TO_INCLUDE=(README.md LICENSE CITATION.cff package.json CHANGELOG.md)
for file in "${FILES_TO_INCLUDE[@]}"; do
  if [[ -f "$file" ]]; then
    cp "$file" "$RELEASE_DIR/"
  fi
done

# # Copy install scripts
# if [[ -d scripts ]]; then
#   mkdir -p "$RELEASE_DIR/scripts"
#   cp -r scripts/install.sh scripts/install-dev.sh "$RELEASE_DIR/scripts/" 2>/dev/null || true
# fi

# # Copy AUR PKGBUILD
# if [[ -f aur/PKGBUILD ]]; then
#   mkdir -p "$RELEASE_DIR/aur"
#   cp aur/PKGBUILD "$RELEASE_DIR/aur/PKGBUILD"
#   # Update pkgver inside copied PKGBUILD to match v$VERSION
#   sed -i "s/^pkgver=.*/pkgver=v$VERSION/" "$RELEASE_DIR/aur/PKGBUILD" || true
# fi

# Resolve output dir absolute path and create it
if [[ "$OUTPUT_DIR" = /* ]]; then
  OUTPUT_DIR_ABS="$OUTPUT_DIR"
else
  OUTPUT_DIR_ABS="$PROJECT_ROOT/$OUTPUT_DIR"
fi
mkdir -p "$OUTPUT_DIR_ABS"
ZIP_NAME="shikai-v${VERSION}.zip"

# Prefer zip, fallback to python if not present
if command -v zip >/dev/null 2>&1; then
  (cd "$TMPDIR" && zip -r "$OUTPUT_DIR_ABS/$ZIP_NAME" "shikai-${VERSION}")
else
  echo "zip not found — falling back to python shutil.make_archive"
  python3 - "$OUTPUT_DIR_ABS/$ZIP_NAME" "$TMPDIR/shikai-${VERSION}" <<'PY'
import shutil, sys, os
base = sys.argv[1]
root = sys.argv[2]
if base.endswith('.zip'):
    base = base[:-4]
shutil.make_archive(base, 'zip', root)
PY
fi

echo "Release created: ${OUTPUT_DIR}/${ZIP_NAME}"

if [[ "$KEEP_TMP" = false ]]; then
  rm -rf "$TMPDIR"
else
  echo "Temporary directory kept at: $TMPDIR"
fi

exit 0
