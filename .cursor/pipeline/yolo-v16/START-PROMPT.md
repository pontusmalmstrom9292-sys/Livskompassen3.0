# Cursor YOLO v16 — START (ny chatt)

**Genererad:** 2026-07-14T13:05:34.792Z · **Efter:** v15 klar

**När klar denna våg:** `npm run cursor:yolo:v16 -- handoff`

---

```
# Uppdrag — YOLO v16 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v15-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v16 (P113→P122)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P113 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P114 | Baseline read-only | smoke:predeploy:build PASS |
| P115 | Auto-lock hygiene | smoke:module-lock PASS |
| P116 | Security read-only | eval security-v16.md |
| P117 | Locked UX re-snapshot | locked-ux PASS |
| P118 | Drift smokes | eval drift-v16.md |
| P119 | Design-debt guard | design-debt PASS |
| P120 | Agent-fortifikation v16 | smoke:governance PASS |
| P121 | Integration dry-run | seed --dry-run, aldrig --apply |
| P122 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P122: `npm run cursor:yolo:v16 -- handoff` → skriver prompt för v17.

## Orchestrering
- .orkester/cursor-yolo-queue-v16.json
- .orkester/cursor-yolo-state-v16.json
- docs/cursor-pipeline/yolo-v16/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v16

## Första steg
1. Kör P113 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P114→P122 autonomt
3. Commit om PASS · `npm run cursor:yolo:v16 -- handoff` (skriver prompt för v17)
```
