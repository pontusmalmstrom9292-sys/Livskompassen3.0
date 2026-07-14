# Cursor YOLO v17 — START (ny chatt)

**Genererad:** 2026-07-14T13:39:44.096Z · **Efter:** v16 klar

**När klar denna våg:** `npm run cursor:yolo:v17 -- handoff`

---

```
# Uppdrag — YOLO v17 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v16-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v17 (P123→P132)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P123 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P124 | Baseline read-only | smoke:predeploy:build PASS |
| P125 | Auto-lock hygiene | smoke:module-lock PASS |
| P126 | Security read-only | eval security-v17.md |
| P127 | Locked UX re-snapshot | locked-ux PASS |
| P128 | Drift smokes | eval drift-v17.md |
| P129 | Design-debt guard | design-debt PASS |
| P130 | Agent-fortifikation v17 | smoke:governance PASS |
| P131 | Integration dry-run | seed --dry-run, aldrig --apply |
| P132 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P132: `npm run cursor:yolo:v17 -- handoff` → skriver prompt för v18.

## Orchestrering
- .orkester/cursor-yolo-queue-v17.json
- .orkester/cursor-yolo-state-v17.json
- docs/cursor-pipeline/yolo-v17/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v17

## Första steg
1. Kör P123 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P124→P132 autonomt
3. Commit om PASS · `npm run cursor:yolo:v17 -- handoff` (skriver prompt för v18)
```
