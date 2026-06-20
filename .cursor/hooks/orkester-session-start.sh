#!/usr/bin/env bash
# Injects autorun context, integration hub rules, stale pack warnings.
set -euo pipefail

ALWAYS_RULES="Always apply: livskompassen-core.mdc, grunder-kanon.mdc, anti-hallucination.mdc. Integration: docs/external-ai/INTEGRATION-SAFETY-MANIFEST.md"

STALE_MSG=""
if [[ -f "scripts/integration_stale_check.mjs" ]]; then
  if ! node scripts/integration_stale_check.mjs 2>/dev/null; then
    STALE_MSG=" Extern-AI packs stale (>24h) — kör npm run integration:sync:all."
  fi
fi

DIRTY_MSG=""
if command -v git >/dev/null 2>&1 && [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
  if [[ "${ORKESTER_AUTORUN:-}" == "1" || "${MASTER_AUTORUN:-}" == "1" || "${CURSOR_PIPELINE_AUTORUN:-}" == "1" ]]; then
    DIRTY_MSG=" VARNING: dirty git tree under autorun."
  fi
fi

inject() {
  cat <<EOF
{
  "additional_context": "${ALWAYS_RULES}${STALE_MSG}${DIRTY_MSG} $1"
}
EOF
}

if [[ "${FAS19_AUTORUN:-}" == "1" ]]; then
  FAS19_STATE=".orkester/fas19-state.json"
  if [[ -f "$FAS19_STATE" ]] && command -v jq >/dev/null 2>&1; then
    WAVE=$(jq -r '.nextWaveId // "baseline"' "$FAS19_STATE" 2>/dev/null)
    STATUS=$(jq -r '.status // "running"' "$FAS19_STATE" 2>/dev/null)
    if [[ "$STATUS" != "done" && -n "$WAVE" && "$WAVE" != "null" ]]; then
      inject "Fas 19 autorun. nextWaveId=${WAVE}. Läs docs/FAS19-SPRINT-AUTORUN.md."
      exit 0
    fi
  fi
fi

if [[ "${MASTER_AUTORUN:-}" == "1" ]]; then
  MASTER_STATE=".orkester/master-state.json"
  if [[ -f "$MASTER_STATE" ]] && command -v jq >/dev/null 2>&1; then
    WAVE=$(jq -r '.nextWaveId // "doc-sync"' "$MASTER_STATE" 2>/dev/null)
    STATUS=$(jq -r '.status // "running"' "$MASTER_STATE" 2>/dev/null)
    if [[ "$STATUS" != "done" && -n "$WAVE" && "$WAVE" != "null" ]]; then
      inject "Master YOLO autorun. nextWaveId=${WAVE}. Läs docs/MASTER-YOLO-AUTORUN.md."
      exit 0
    fi
  fi
fi

STATE=".orkester/state.json"
if [[ -f "$STATE" ]] && command -v jq >/dev/null 2>&1; then
  PHASE=$(jq -r '.nextPhase // "idle"' "$STATE" 2>/dev/null || echo "idle")
  if [[ "$PHASE" != "idle" && "$PHASE" != "null" && -n "$PHASE" && "$PHASE" != "done" ]]; then
    inject "Orkester nattpass. nextPhase=${PHASE}. Läs docs/ORKESTER-AUTORUN.md."
    exit 0
  fi
fi

if [[ -n "$STALE_MSG" || -n "$DIRTY_MSG" ]]; then
  inject ""
fi
