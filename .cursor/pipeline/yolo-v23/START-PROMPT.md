# Cursor YOLO v23 — START (ny chatt)

**Genererad:** 2026-07-14T16:40:32.688Z · **Efter:** v22 klar

**När klar denna våg:** `npm run cursor:yolo:v23 -- handoff`

---

```
# Uppdrag — YOLO v23 Auto-Lock & Fortifikation (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-13-cursor-yolo-v22-leverans.md
- Hosting live: https://gen-lang-client-0481875058.web.app
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v23 (P183→P192)

| Fas | Uppdrag | Exit |
|-----|---------|------|
| P183 | (Valfritt) Hosting deploy | Pontus "OK deploy" |
| P184 | Baseline read-only | smoke:predeploy:build PASS |
| P185 | Auto-lock hygiene | smoke:module-lock PASS |
| P186 | Security read-only | eval security-v23.md |
| P187 | Locked UX re-snapshot | locked-ux PASS |
| P188 | Drift smokes | eval drift-v23.md |
| P189 | Design-debt guard | design-debt PASS |
| P190 | Agent-fortifikation v23 | smoke:governance PASS |
| P191 | Integration dry-run | seed --dry-run, aldrig --apply |
| P192 | yolo-vakt slutgate | smoke:predeploy:build PASS |

Efter P192: `npm run cursor:yolo:v23 -- handoff` → skriver prompt för v24.

## Orchestrering
- .orkester/cursor-yolo-queue-v23.json
- .orkester/cursor-yolo-state-v23.json
- docs/cursor-pipeline/yolo-v23/MASTER-SEQUENTIAL.md
- npm run cursor:yolo:v23

## Första steg
1. Kör P183 deploy ENDAST om Pontus skrev "OK deploy" — annars SKIP
2. Kör P184→P192 autonomt
3. Commit om PASS · `npm run cursor:yolo:v23 -- handoff` (skriver prompt för v24)
```
