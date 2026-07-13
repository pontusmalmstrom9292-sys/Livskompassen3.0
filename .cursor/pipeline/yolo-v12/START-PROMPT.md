# Cursor YOLO v12 — START (ny chatt)

**Genererad:** 2026-07-13T17:09:11.657Z · **Efter:** v11 klar

**När klar denna våg:** `npm run cursor:yolo:v12 -- handoff`

---

```
# Uppdrag — YOLO v12 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v11-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v12 (P74→P83)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P74 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P75 | Baseline read-only | smoke:predeploy:build PASS |
| P76 | Auto-lock hygiene | smoke:module-lock PASS |
| P77 | Security read-only | eval security-v12.md |
| P78 | Locked UX re-snapshot | locked-ux PASS |
| P79 | Drift smokes | eval drift-v12.md |
| P80 | Design-debt guard | design-debt PASS |
| P81 | Agent-fortifikation v12 | smoke:governance PASS |
| P82 | Integration dry-run | seed --dry-run, aldrig --apply |
| P83 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P83: `npm run cursor:yolo:v12 -- handoff` → skriver prompt för v13.

## Orchestrering
- .orkester/cursor-yolo-queue-v12.json
- .orkester/cursor-yolo-state-v12.json
- docs/cursor-pipeline/yolo-v12/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v12

## Första steg
1. Kör P74 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P75→P83 autonomt
3. Commit om PASS · `npm run cursor:yolo:v12 -- handoff` (skriver prompt för v13)
```
