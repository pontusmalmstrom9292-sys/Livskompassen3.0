#!/usr/bin/env bash
# Generate Android mipmap launcher icons from design PNG (macOS sips).
# Source: docs/design/themes/app-icon-livskompassen.png

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$REPO_ROOT/docs/design/themes/app-icon-livskompassen.png}"
RES="$REPO_ROOT/android/app/src/main/res"
TMP="$REPO_ROOT/android/.icon-build"

if [[ ! -f "$SRC" ]]; then
  echo "Saknar källikon: $SRC"
  exit 1
fi

if ! command -v sips >/dev/null 2>&1; then
  echo "Kräver macOS sips."
  exit 1
fi

rm -rf "$TMP"
mkdir -p "$TMP"

# Center-crop to square, then resize per density
sips -c 1024 1024 "$SRC" --out "$TMP/square.png" >/dev/null

DENSITIES="mdpi:48:108 hdpi:72:162 xhdpi:96:216 xxhdpi:144:324 xxxhdpi:192:432"

for entry in $DENSITIES; do
  density="${entry%%:*}"
  rest="${entry#*:}"
  size="${rest%%:*}"
  fg="${rest#*:}"
  dir="$RES/mipmap-$density"
  mkdir -p "$dir"
  sips -z "$size" "$size" "$TMP/square.png" --out "$dir/ic_launcher.png" >/dev/null
  sips -z "$size" "$size" "$TMP/square.png" --out "$dir/ic_launcher_round.png" >/dev/null
  sips -z "$fg" "$fg" "$TMP/square.png" --out "$dir/ic_launcher_foreground.png" >/dev/null
  echo "  OK mipmap-$density (launcher ${size}px, fg ${fg}px)"
done

rm -rf "$TMP"
echo "Klart. Bakgrund: android/app/src/main/res/values/ic_launcher_background.xml (#0a0a0a)"
