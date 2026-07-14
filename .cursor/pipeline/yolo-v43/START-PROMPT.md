# Cursor YOLO v43 — START (ny chatt)

**Genererad:** 2026-07-14T20:18:00.000Z · **Efter:** v42 klar (SLUTGATE GO)

**När klar denna våg:** `npm run sdk:yolo:wave-gate -- --version=43`

---

```
# Uppdrag — YOLO v43 KOPPLINGAR-C (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-14-vakt-v42.md
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v43 — KOPPLINGAR-C

**Mål:** Kopplingar batch C — synapser, journal_woven optIn, drive ingest dry-run.

| Task | Agent | Exit |
|------|-------|------|
| b43-build | specialist-adk-weaver | smoke:orkester + smoke:dcap-routing PASS |
| b43-gate | specialist-verifier | wave-gate + build-v43.md |
| b43-vakt | yolo-vakt | GO/NO-GO → handoff v44 |

## Exit-smoke (v43)
- `npm run smoke:orkester`
- `npm run smoke:dcap-routing`
```
