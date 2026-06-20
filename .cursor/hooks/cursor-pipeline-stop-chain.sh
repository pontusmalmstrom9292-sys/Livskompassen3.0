#!/usr/bin/env bash
# Cursor Pipeline stop-hook — fortsätter agent vid smoke/build FAIL när CURSOR_PIPELINE_AUTORUN=1.
set -euo pipefail

if [[ "${CURSOR_PIPELINE_AUTORUN:-}" != "1" ]]; then
  exit 0
fi

STATE=".cursor/pipeline/state.json"
FIX_BRIEF=".cursor/pipeline/fix-brief.md"

if [[ ! -f "$STATE" ]] || ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

PHASE=$(jq -r '.phase // empty' "$STATE" 2>/dev/null)
ATTEMPT=$(jq -r '.attempt // 1' "$STATE" 2>/dev/null)
MAX=$(jq -r '.maxAttempts // 5' "$STATE" 2>/dev/null)
NEXT_ACTION=$(jq -r '.nextAction // empty' "$STATE" 2>/dev/null)

if [[ "$PHASE" == "done" || "$NEXT_ACTION" == "idle" || "$NEXT_ACTION" == "PMIR required" ]]; then
  exit 0
fi

if [[ "$PHASE" != "fix" && "$NEXT_ACTION" != "read_fix_brief" ]]; then
  exit 0
fi

if [[ "$ATTEMPT" -ge "$MAX" ]]; then
  echo "[cursor-pipeline-stop] Max attempts ($MAX) nådd — stoppar loop." >&2
  exit 0
fi

NEXT_ATTEMPT=$((ATTEMPT + 1))
if command -v jq >/dev/null 2>&1; then
  TMP=$(mktemp)
  jq --argjson a "$NEXT_ATTEMPT" '.attempt = $a' "$STATE" > "$TMP" && mv "$TMP" "$STATE"
fi

PROMPT="Cursor Pipeline autorun — försök ${NEXT_ATTEMPT}/${MAX}. Läs ${FIX_BRIEF}. Fixa failande build/smoke med minsta diff. Vid strukturellt FAIL: delegera parallel-orchestrator. Kör: cd functions && npm run build && npm run build && npm run smoke:predeploy. Uppdatera .cursor/pipeline/state.json phase=done vid PASS."

cat <<EOF
{
  "followup_message": "${PROMPT} Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda."
}
EOF
