# Cursor YOLO v35 — START (ny chatt)

**Genererad:** 2026-07-14T19:10:00.000Z · **Efter:** v34 klar (MOD-WIDGET v3 GO)

**När klar denna våg:** `npm run sdk:yolo:wave-gate -- --version=35`

---

```
# Uppdrag — YOLO v35 NAV-P0 (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-14-cursor-yolo-v34-leverans.md
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v35 — NAV-P0

**Mål:** Fixa flikar Ekonomi, MåBra, Kompasser i Liv och göra (tryck ska byta tab).
Hamburgermeny: accordion med undermenyer från navTruth (Pontus godkänd).

| Task | Agent | Exit |
|------|-------|------|
| b35-build | specialist-ux-guardian | Navigation P0 implementerad |
| b35-gate | specialist-verifier | smoke:locked-ux + smoke:e2e-live PASS |
| b35-vakt | yolo-vakt | GO/NO-GO → handoff v36 |

## Exit-smoke (v35)
- `npm run smoke:locked-ux`
- `npm run smoke:e2e-live`
```
