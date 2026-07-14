# Cursor YOLO v45 — START (ny chatt)

**Genererad:** 2026-07-14T18:37:47.000Z · **Efter:** v44 klar (PROJEKT-P1 GO)

**När klar denna våg:** `npm run sdk:yolo:wave-gate -- --version=45`

---

```
# Uppdrag — YOLO v45 EVOLUTION-LEDGER (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-14-vakt-v44.md
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v45 — EVOLUTION-LEDGER

**Mål:** Evolution ledger eval + smoke:evolution dry-run.

| Task | Agent | Exit |
|------|-------|------|
| b45-build | specialist-beslutsstod | smoke:evolution PASS |
| b45-gate | specialist-verifier | wave-gate + build-v45.md |
| b45-vakt | yolo-vakt | GO/NO-GO → handoff v46 |

## Exit-smoke (v45)
- `npm run smoke:evolution`
```
