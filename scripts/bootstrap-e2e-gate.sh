#!/usr/bin/env bash
# Hämtar E2E locked-UX gate från origin/main utan full git pull.
# Rör INTE Kunskap-CONTENT-SEED eller andra lokala filer.
#
# Mac — ett kommando:
#   git fetch origin main && git show origin/main:scripts/bootstrap-e2e-gate.sh | bash
#
# Eller om scriptet redan finns:
#   bash scripts/bootstrap-e2e-gate.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "[bootstrap-e2e] fetch origin/main…"
git fetch origin main

FILES=(
  e2e/locked-ux-public.spec.ts
  e2e/obsidian-calm-tokens.spec.ts
  playwright.config.ts
  scripts/smoke_e2e_locked_ux.mjs
  scripts/bootstrap-e2e-gate.mjs
)

echo "[bootstrap-e2e] checkout E2E-filer från origin/main…"
git checkout origin/main -- "${FILES[@]}"

has_script() {
  node -e "const p=require('./package.json'); process.exit(p.scripts?.['smoke:e2e-locked-ux']?0:1)" 2>/dev/null
}

if ! has_script; then
  echo "[bootstrap-e2e] package.json saknar smoke:e2e-locked-ux på denna branch."
  if [[ "${BOOTSTRAP_E2E_OVERWRITE_PACKAGE:-}" == "1" ]]; then
    echo "[bootstrap-e2e] BOOTSTRAP_E2E_OVERWRITE_PACKAGE=1 — checkout package.json från main…"
    git checkout origin/main -- package.json package-lock.json
  else
    echo "[bootstrap-e2e] installerar endast @playwright/test (behåller din package.json)…"
    npm install "@playwright/test@^1.61.0" --save-dev --legacy-peer-deps
    node scripts/smoke_e2e_locked_ux.mjs
    exit 0
  fi
fi

echo "[bootstrap-e2e] npm install…"
if ! npm ci 2>/dev/null; then
  npm install --legacy-peer-deps
fi

npm run smoke:e2e-locked-ux 2>/dev/null || node scripts/smoke_e2e_locked_ux.mjs
echo "[bootstrap-e2e] PASS"
