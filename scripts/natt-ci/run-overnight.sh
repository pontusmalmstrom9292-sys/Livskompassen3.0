#!/usr/bin/env bash
# Overnight: build + eslint + full smoke — log for morning review.
# See docs/NATT-CI.md · Trigger: npm run natt-ci:overnight
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LOG="${ROOT}/docs/evaluations/overnight-$(date +%Y-%m-%d)-log.txt"
mkdir -p "$(dirname "$LOG")"

exec > >(tee -a "$LOG") 2>&1
echo "=== Overnight start $(date -Iseconds) ==="
echo "Repo: $ROOT"
cd "$ROOT"

run() {
  echo ""
  echo "▶ $1"
  shift
  if "$@"; then
    echo "✓ $1"
  else
    echo "✗ $1 failed (exit $?)"
    exit 1
  fi
}

run "natt-ci byggpass" npm run natt-ci
run "smoke:all (remaining)" npm run smoke:all

echo ""
echo "=== Overnight PASS $(date -Iseconds) ==="
echo "Log: $LOG"
