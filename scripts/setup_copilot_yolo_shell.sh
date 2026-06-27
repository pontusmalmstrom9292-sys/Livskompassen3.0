#!/usr/bin/env bash
# Installerar globala kommandon: yolo + lk-copilot
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN_DIR="${HOME}/.local/bin"
mkdir -p "$BIN_DIR"
chmod +x "$ROOT/scripts/bin/yolo" "$ROOT/scripts/bin/lk-copilot"
ln -sf "$ROOT/scripts/bin/yolo" "$BIN_DIR/yolo"
ln -sf "$ROOT/scripts/bin/lk-copilot" "$BIN_DIR/lk-copilot"
echo "[setup] yolo → $BIN_DIR/yolo"
echo "[setup] lk-copilot → $BIN_DIR/lk-copilot"
if ! echo ":$PATH:" | grep -q ":${BIN_DIR}:"; then
  echo ""
  echo "Lägg till i ~/.zshrc:"
  echo '  export PATH="$HOME/.local/bin:$PATH"'
fi
echo ""
echo "Test: yolo status"
