#!/usr/bin/env bash
# Suggests next orkester phase when ORKESTER_AUTORUN=1 and state has pending work.
set -euo pipefail
STATE=".orkester/state.json"
if [[ "${ORKESTER_AUTORUN:-}" != "1" ]]; then
  exit 0
fi
if [[ ! -f "$STATE" ]] || ! command -v jq >/dev/null 2>&1; then
  exit 0
fi
NEXT=$(jq -r '.nextPhase // empty' "$STATE" 2>/dev/null)
if [[ -z "$NEXT" || "$NEXT" == "done" || "$NEXT" == "idle" ]]; then
  exit 0
fi
PHASE_LABEL="$NEXT"
case "$NEXT" in
  ux) PROMPT="Kör specialist-ux-guardian: npm run smoke:locked-ux && smoke:design-modules. Uppdatera .orkester/state.json." ;;
  adk) PROMPT="Kör specialist-adk-weaver: verifiera synapseBus handlers + npm run smoke:orkester. Fixa GAP om FAIL." ;;
  security) PROMPT="Kör specialist-security-auditor: Sacred Features + silos read-only audit." ;;
  smoke) PROMPT="Kör specialist-smoke-runner: functions build, npm run build, smoke:orkester." ;;
  report) PROMPT="Skriv docs/evaluations/$(date +%Y-%m-%d)-orkester-natt.md från .orkester/state.json." ;;
  *) PROMPT="Fortsätt orkester-fas: ${NEXT}. Läs docs/ORKESTER-AUTORUN.md." ;;
esac
cat <<EOF
{
  "followup_message": "Orkester autorun — nästa fas: ${PHASE_LABEL}. ${PROMPT} Jämför mot hela projektets kontext. Arbeta autonomt tills fasen är PASS eller blocker dokumenterad."
}
EOF
