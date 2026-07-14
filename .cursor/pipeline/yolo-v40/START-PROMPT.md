# Cursor YOLO v40 — START (ny chatt)

**Genererad:** 2026-07-14T17:52:00.000Z · **Efter:** v39 klar (FAMILJEN GO)

**När klar denna våg:** `npm run sdk:yolo:wave-gate -- --version=40`

---

```
# Uppdrag — YOLO v40 INTEGRATION (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-14-vakt-v39.md
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v40 — INTEGRATION

**Mål:** Integration dry-run — innehåll + seed. Aldrig --apply.

| Task | Agent | Exit |
|------|-------|------|
| b40-build | livskompassen-arkiv-master | Integration preflight + content-waves |
| b40-gate | specialist-verifier | smoke:innehall + content-waves PASS |
| b40-vakt | yolo-vakt | GO/NO-GO → handoff v41 |

## Exit-smoke (v40)
- `npm run smoke:innehall`
- `npm run smoke:content-waves`
```
