# Cursor YOLO v21 — START (ny chatt)

**Genererad:** 2026-07-14T15:07:39.051Z · **Efter:** v20 klar

**När klar denna våg:** `npm run cursor:yolo:v21 -- handoff`

---

```
# Uppdrag — YOLO v21 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v20-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v21 (P163→P172)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P163 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P164 | Baseline read-only | smoke:predeploy:build PASS |
| P165 | Auto-lock hygiene | smoke:module-lock PASS |
| P166 | Security read-only | eval security-v21.md |
| P167 | Locked UX re-snapshot | locked-ux PASS |
| P168 | Drift smokes | eval drift-v21.md |
| P169 | Design-debt guard | design-debt PASS |
| P170 | Agent-fortifikation v21 | smoke:governance PASS |
| P171 | Integration dry-run | seed --dry-run, aldrig --apply |
| P172 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P172: `npm run cursor:yolo:v21 -- handoff` → skriver prompt för v22.

## Orchestrering
- .orkester/cursor-yolo-queue-v21.json
- .orkester/cursor-yolo-state-v21.json
- docs/cursor-pipeline/yolo-v21/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v21

## Första steg
1. Kör P163 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P164→P172 autonomt
3. Commit om PASS · `npm run cursor:yolo:v21 -- handoff` (skriver prompt för v22)
```
