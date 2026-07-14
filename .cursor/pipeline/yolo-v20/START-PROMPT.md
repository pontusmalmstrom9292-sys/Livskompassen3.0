# Cursor YOLO v20 — START (ny chatt)

**Genererad:** 2026-07-14T14:46:25.872Z · **Efter:** v19 klar

**När klar denna våg:** `npm run cursor:yolo:v20 -- handoff`

---

```
# Uppdrag — YOLO v20 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v19-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v20 (P153→P162)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P153 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P154 | Baseline read-only | smoke:predeploy:build PASS |
| P155 | Auto-lock hygiene | smoke:module-lock PASS |
| P156 | Security read-only | eval security-v20.md |
| P157 | Locked UX re-snapshot | locked-ux PASS |
| P158 | Drift smokes | eval drift-v20.md |
| P159 | Design-debt guard | design-debt PASS |
| P160 | Agent-fortifikation v20 | smoke:governance PASS |
| P161 | Integration dry-run | seed --dry-run, aldrig --apply |
| P162 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P162: `npm run cursor:yolo:v20 -- handoff` → skriver prompt för v21.

## Orchestrering
- .orkester/cursor-yolo-queue-v20.json
- .orkester/cursor-yolo-state-v20.json
- docs/cursor-pipeline/yolo-v20/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v20

## Första steg
1. Kör P153 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P154→P162 autonomt
3. Commit om PASS · `npm run cursor:yolo:v20 -- handoff` (skriver prompt för v21)
```
