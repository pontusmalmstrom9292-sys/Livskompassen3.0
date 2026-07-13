# Cursor YOLO v14 — START (ny chatt)

**Genererad:** 2026-07-13T19:16:00.691Z · **Efter:** v13 klar

**När klar denna våg:** `npm run cursor:yolo:v14 -- handoff`

---

```
# Uppdrag — YOLO v14 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v13-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v14 (P94→P103)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P94 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P95 | Baseline read-only | smoke:predeploy:build PASS |
| P96 | Auto-lock hygiene | smoke:module-lock PASS |
| P97 | Security read-only | eval security-v14.md |
| P98 | Locked UX re-snapshot | locked-ux PASS |
| P99 | Drift smokes | eval drift-v14.md |
| P100 | Design-debt guard | design-debt PASS |
| P101 | Agent-fortifikation v14 | smoke:governance PASS |
| P102 | Integration dry-run | seed --dry-run, aldrig --apply |
| P103 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P103: `npm run cursor:yolo:v14 -- handoff` → skriver prompt för v15.

## Orchestrering
- .orkester/cursor-yolo-queue-v14.json
- .orkester/cursor-yolo-state-v14.json
- docs/cursor-pipeline/yolo-v14/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v14

## Första steg
1. Kör P94 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P95→P103 autonomt
3. Commit om PASS · `npm run cursor:yolo:v14 -- handoff` (skriver prompt för v15)
```
