#!/usr/bin/env bash
# Usage: ./scripts/figma-open-capture.sh <captureId> <path-with-query>
# Example: ./scripts/figma-open-capture.sh abc-123 "/vardagen?tab=kompasser"
set -euo pipefail
CAPTURE_ID="${1:?captureId required}"
PATH_PART="${2:-/}"
ENCODED_ENDPOINT="$(python3 -c "import urllib.parse; print(urllib.parse.quote('https://mcp.figma.com/mcp/capture/${CAPTURE_ID}/submit', safe=''))")"
URL="http://localhost:5173${PATH_PART}#figmacapture=${CAPTURE_ID}&figmaendpoint=${ENCODED_ENDPOINT}&figmadelay=5000"
echo "Opening: ${URL}"
open "${URL}"
