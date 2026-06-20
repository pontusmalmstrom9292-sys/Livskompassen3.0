#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="$ROOT/docs/evaluations/integration-night.log"
mkdir -p "$(dirname "$LOG")"
{
  echo "=== integration:night $(date -Iseconds) ==="
  npm run integration:night
  echo "=== PASS $(date -Iseconds) ==="
} >> "$LOG" 2>&1 || {
  echo "=== FAIL $(date -Iseconds) ===" >> "$LOG"
  exit 1
}
