#!/usr/bin/env bash
# Minimal lokal server så relativa img-sökvägar i preview.html alltid får rätt bas-URL.
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8765}"
echo "Öppna: http://127.0.0.1:${PORT}/preview.html"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
