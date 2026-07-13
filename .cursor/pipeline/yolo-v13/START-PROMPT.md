# Cursor YOLO v13 — START (ny chatt)

**Genererad:** 2026-07-13T17:15:33.911Z · **Efter:** v12 klar

**När klar denna våg:** `npm run cursor:yolo:v13 -- handoff`

---

```
# Uppdrag — YOLO v13 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v12-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v13 (P84→P93)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P84 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P85 | Baseline read-only | smoke:predeploy:build PASS |
| P86 | Auto-lock hygiene | smoke:module-lock PASS |
| P87 | Security read-only | eval security-v13.md |
| P88 | Locked UX re-snapshot | locked-ux PASS |
| P89 | Drift smokes | eval drift-v13.md |
| P90 | Design-debt guard | design-debt PASS |
| P91 | Agent-fortifikation v13 | smoke:governance PASS |
| P92 | Integration dry-run | seed --dry-run, aldrig --apply |
| P93 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P93: `npm run cursor:yolo:v13 -- handoff` → skriver prompt för v14.

## Orchestrering
- .orkester/cursor-yolo-queue-v13.json
- .orkester/cursor-yolo-state-v13.json
- docs/cursor-pipeline/yolo-v13/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v13

## Första steg
1. Kör P84 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P85→P93 autonomt
3. Commit om PASS · `npm run cursor:yolo:v13 -- handoff` (skriver prompt för v14)
```
