# Cursor YOLO v18 — START (ny chatt)

**Genererad:** 2026-07-14T14:00:12.629Z · **Efter:** v17 klar

**När klar denna våg:** `npm run cursor:yolo:v18 -- handoff`

---

```
# Uppdrag — YOLO v18 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v17-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v18 (P133→P142)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P133 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P134 | Baseline read-only | smoke:predeploy:build PASS |
| P135 | Auto-lock hygiene | smoke:module-lock PASS |
| P136 | Security read-only | eval security-v18.md |
| P137 | Locked UX re-snapshot | locked-ux PASS |
| P138 | Drift smokes | eval drift-v18.md |
| P139 | Design-debt guard | design-debt PASS |
| P140 | Agent-fortifikation v18 | smoke:governance PASS |
| P141 | Integration dry-run | seed --dry-run, aldrig --apply |
| P142 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P142: `npm run cursor:yolo:v18 -- handoff` → skriver prompt för v19.

## Orchestrering
- .orkester/cursor-yolo-queue-v18.json
- .orkester/cursor-yolo-state-v18.json
- docs/cursor-pipeline/yolo-v18/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v18

## Första steg
1. Kör P133 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P134→P142 autonomt
3. Commit om PASS · `npm run cursor:yolo:v18 -- handoff` (skriver prompt för v19)
```
