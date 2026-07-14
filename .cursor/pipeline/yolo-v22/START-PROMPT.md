# Cursor YOLO v22 — START (ny chatt)

**Genererad:** 2026-07-14T16:19:35.609Z · **Efter:** v21 klar

**När klar denna våg:** `npm run cursor:yolo:v22 -- handoff`

---

```
# Uppdrag — YOLO v22 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v21-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v22 (P173→P182)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P173 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P174 | Baseline read-only | smoke:predeploy:build PASS |
| P175 | Auto-lock hygiene | smoke:module-lock PASS |
| P176 | Security read-only | eval security-v22.md |
| P177 | Locked UX re-snapshot | locked-ux PASS |
| P178 | Drift smokes | eval drift-v22.md |
| P179 | Design-debt guard | design-debt PASS |
| P180 | Agent-fortifikation v22 | smoke:governance PASS |
| P181 | Integration dry-run | seed --dry-run, aldrig --apply |
| P182 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P182: `npm run cursor:yolo:v22 -- handoff` → skriver prompt för v23.

## Orchestrering
- .orkester/cursor-yolo-queue-v22.json
- .orkester/cursor-yolo-state-v22.json
- docs/cursor-pipeline/yolo-v22/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v22

## Första steg
1. Kör P173 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P174→P182 autonomt
3. Commit om PASS · `npm run cursor:yolo:v22 -- handoff` (skriver prompt för v23)
```
