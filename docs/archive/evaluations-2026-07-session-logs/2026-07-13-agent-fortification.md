# Agent fortification — YOLO v7 P29

**Datum:** 2026-07-13

## Levererat

- `docs/governance/LOCK-MANIFEST.md` — copy-paste PMIR, 22 MOD-ID, smokes, unlock, CI §, förbud
- `docs/external-ai/INTEGRATION-SAFETY-MANIFEST.md` — timestamp v7 P31
- `.orkester/cursor-yolo-queue-v7.json` + state
- `npm run cursor:yolo:v7` i package.json

## Agent-regler (sammanfattning)

1. Läs `LOCK-MANIFEST` + `PROJECT_STATE` före kod
2. Module-lock: unlock-doc före locked glob
3. Trippel-gate efter UX-kod
4. yolo-vakt read-only före deploy
5. Hosting: vänta Pontus "OK deploy"

**P29 PASS** — dokumentation only, ingen rules-ändring.
