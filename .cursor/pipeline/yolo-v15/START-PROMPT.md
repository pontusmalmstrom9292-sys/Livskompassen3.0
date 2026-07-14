# Cursor YOLO v15 — START (ny chatt)

**Genererad:** 2026-07-14T12:37:57.101Z · **Efter:** v14 klar

**När klar denna våg:** `npm run cursor:yolo:v15 -- handoff`

---

```
# Uppdrag — YOLO v15 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v14-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v15 (P103→P112)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P103 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P104 | Baseline read-only | smoke:predeploy:build PASS |
| P105 | Auto-lock hygiene | smoke:module-lock PASS |
| P106 | Security read-only | eval security-v15.md |
| P107 | Locked UX re-snapshot | locked-ux PASS |
| P108 | Drift smokes | eval drift-v15.md |
| P109 | Design-debt guard | design-debt PASS |
| P110 | Agent-fortifikation v15 | smoke:governance PASS |
| P111 | Integration dry-run | seed --dry-run, aldrig --apply |
| P112 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P112: `npm run cursor:yolo:v15 -- handoff` → skriver prompt för v16.

## Orchestrering
- .orkester/cursor-yolo-queue-v15.json
- .orkester/cursor-yolo-state-v15.json
- docs/cursor-pipeline/yolo-v15/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v15

## Första steg
1. Kör P103 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P104→P112 autonomt
3. Commit om PASS · `npm run cursor:yolo:v15 -- handoff` (skriver prompt för v16)
```
