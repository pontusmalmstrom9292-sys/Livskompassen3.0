# Cursor YOLO v38 — START (ny chatt)

**Genererad:** 2026-07-14T19:40:00.000Z · **Efter:** v37 klar (PLANERING GO)

**När klar denna våg:** `npm run sdk:yolo:wave-gate -- --version=38`

---

```
# Uppdrag — YOLO v38 VALV (endast förbättra)

Du är Editorial Technical Architect för Livskompassen v2.
**Mandat:** ENDAST förbättra, stärka och verifiera — inget tas bort, inga refaktoreringar "för snyggt".

## Plattform
- Cursor Agent, YOLO på, EN chatt sekventiellt
- Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md, .cursor/index.mdc
- Föregående leverans: docs/evaluations/2026-07-14-vakt-v37.md
- Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.

## PMIR-STOPP
- firestore.rules, storage.rules, sharedRules.ts, AppRoutes struktur, Barnporten kanon-UI
- Live Kunskap-ingest (--apply), deploy rules/functions
- Hosting deploy: ENDAST efter separat "OK deploy"

## Vågplan v38 — VALV

**Mål:** Valv Z1: WORM evidence, Mönster/Orkester, plausible deniability. Ingen cross-RAG.

| Task | Agent | Exit |
|------|-------|------|
| b38-build | specialist-valv-builder | Valv evidence UI |
| b38-gate | specialist-verifier | smoke:valv + valv-security + plausible-deniability PASS |
| b38-vakt | yolo-vakt | GO/NO-GO → handoff v39 |

## Exit-smoke (v38)
- `npm run smoke:valv`
- `npm run smoke:valv-security`
- `npm run smoke:plausible-deniability`
```
