#!/usr/bin/env bash
# Injects orkester night-run context when state exists.
set -euo pipefail
STATE=".orkester/state.json"
if [[ ! -f "$STATE" ]]; then
  exit 0
fi
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi
PHASE=$(jq -r '.nextPhase // "idle"' "$STATE" 2>/dev/null || echo "idle")
if [[ "$PHASE" == "idle" || "$PHASE" == "null" || -z "$PHASE" ]]; then
  exit 0
fi
cat <<EOF
{
  "additional_context": "Orkester nattpass aktivt. nextPhase=${PHASE}. Läs docs/ORKESTER-AUTORUN.md och .orkester/state.json. Fortsätt med orkester-conductor eller aktuell specialist."
}
EOF
