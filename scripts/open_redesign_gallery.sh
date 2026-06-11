#!/usr/bin/env bash
# Öppnar redesign-galleriet i standardwebbläsare (kräver lokal http-server).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${GALLERY_PORT:-8765}"
URL="http://127.0.0.1:${PORT}/docs/design/redesign-proposals/gallery/previews.html"

if ! lsof -i ":${PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Startar lokal server på port ${PORT}…"
  (cd "$ROOT" && python3 -m http.server "$PORT" --bind 127.0.0.1) &
  sleep 0.8
fi

echo "Öppnar: ${URL}"
open "$URL"

# PNG i Preview som backup (fungerar alltid)
open "$ROOT/docs/design/redesign-proposals/gallery/previews/style-a-mockups.png" 2>/dev/null || true
