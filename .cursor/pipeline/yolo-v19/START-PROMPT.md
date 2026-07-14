# Cursor YOLO v19 — START (ny chatt)

**Genererad:** 2026-07-14T14:24:35.792Z · **Efter:** v18 klar

**När klar denna våg:** `npm run cursor:yolo:v19 -- handoff`

---

```
# Uppdrag — YOLO v19 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v18-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v19 (P143→P152)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P143 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P144 | Baseline read-only | smoke:predeploy:build PASS |
| P145 | Auto-lock hygiene | smoke:module-lock PASS |
| P146 | Security read-only | eval security-v19.md |
| P147 | Locked UX re-snapshot | locked-ux PASS |
| P148 | Drift smokes | eval drift-v19.md |
| P149 | Design-debt guard | design-debt PASS |
| P150 | Agent-fortifikation v19 | smoke:governance PASS |
| P151 | Integration dry-run | seed --dry-run, aldrig --apply |
| P152 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P152: `npm run cursor:yolo:v19 -- handoff` → skriver prompt för v20.

## Orchestrering
- .orkester/cursor-yolo-queue-v19.json
- .orkester/cursor-yolo-state-v19.json
- docs/cursor-pipeline/yolo-v19/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v19

## Första steg
1. Kör P143 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P144→P152 autonomt
3. Commit om PASS · `npm run cursor:yolo:v19 -- handoff` (skriver prompt för v20)
```
