#!/usr/bin/env bash
# Injects Master YOLO or orkester night-run context when env + state exist.
set -euo pipefail

if [[ "${MASTER_AUTORUN:-}" == "1" ]]; then
  MASTER_STATE=".orkester/master-state.json"
  if [[ -f "$MASTER_STATE" ]] && command -v jq >/dev/null 2>&1; then
    WAVE=$(jq -r '.nextWaveId // "doc-sync"' "$MASTER_STATE" 2>/dev/null)
    STATUS=$(jq -r '.status // "running"' "$MASTER_STATE" 2>/dev/null)
    if [[ "$STATUS" != "done" && -n "$WAVE" && "$WAVE" != "null" ]]; then
      cat <<EOF
{
  "additional_context": "Master YOLO autorun aktivt. status=${STATUS}, nextWaveId=${WAVE}. Läs docs/MASTER-YOLO-AUTORUN.md och .orkester/master-state.json. Fortsätt aktuell våg: build → smoke → commit → push → deploy. PMIR-stopp: SKIP + blocker.md. ORKESTER_AUTORUN=1 för stop-kedja."
}
EOF
      exit 0
    fi
  fi
fi

STATE=".orkester/state.json"
if [[ ! -f "$STATE" ]]; then
  exit 0
fi
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi
PHASE=$(jq -r '.nextPhase // "idle"' "$STATE" 2>/dev/null || echo "idle")
if [[ "$PHASE" == "idle" || "$PHASE" == "null" || -z "$PHASE" || "$PHASE" == "done" ]]; then
  exit 0
fi
cat <<EOF
{
  "additional_context": "Orkester nattpass aktivt. nextPhase=${PHASE}. Läs docs/ORKESTER-AUTORUN.md och .orkester/state.json. Fortsätt med orkester-conductor eller aktuell specialist."
}
EOF
