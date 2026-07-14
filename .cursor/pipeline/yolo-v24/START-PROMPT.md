# Cursor YOLO v24 — START (ny chatt)

**Genererad:** 2026-07-14T16:57:47.589Z · **Efter:** v23 klar

**När klar denna våg:** `npm run cursor:yolo:v24 -- handoff`

---

```
# Uppdrag — YOLO v24 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v23-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v24 (P193→P202)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P193 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P194 | Baseline read-only | smoke:predeploy:build PASS |
| P195 | Auto-lock hygiene | smoke:module-lock PASS |
| P196 | Security read-only | eval security-v24.md |
| P197 | Locked UX re-snapshot | locked-ux PASS |
| P198 | Drift smokes | eval drift-v24.md |
| P199 | Design-debt guard | design-debt PASS |
| P200 | Agent-fortifikation v24 | smoke:governance PASS |
| P201 | Integration dry-run | seed --dry-run, aldrig --apply |
| P202 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P202: `npm run cursor:yolo:v24 -- handoff` → skriver prompt för v25.

## Orchestrering
- .orkester/cursor-yolo-queue-v24.json
- .orkester/cursor-yolo-state-v24.json
- docs/cursor-pipeline/yolo-v24/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v24

## Första steg
1. Kör P193 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P194→P202 autonomt
3. Commit om PASS · `npm run cursor:yolo:v24 -- handoff` (skriver prompt för v25)
```
