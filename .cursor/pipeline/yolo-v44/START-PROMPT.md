# Cursor YOLO v44 — START (ny chatt)

**Genererad:** 2026-07-14T20:32:00.000Z · **Efter:** v43 klar (KOPPLINGAR-C GO)

**När klar denna våg:** `npm run sdk:yolo:wave-gate -- --version=44`

---

```
# Uppdrag — YOLO v44 PROJEKT-P1 (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-14-vakt-v43.md
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v44 — PROJEKT-P1

**Mål:** Repo hygiene + drift — journal-2d, mabra, valv smokes. Minimal fix om FAIL.

| Task | Agent | Exit |
|------|-------|------|
| b44-build | specialist-verifier | smoke:journal-2d + smoke:mabra + smoke:valv PASS |
| b44-gate | specialist-verifier | wave-gate + build-v44.md |
| b44-vakt | yolo-vakt | GO/NO-GO → handoff v45 |

## Exit-smoke (v44)
- `npm run smoke:journal-2d`
- `npm run smoke:mabra`
- `npm run smoke:valv`
```
