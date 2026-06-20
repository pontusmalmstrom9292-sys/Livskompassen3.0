---
PIPELINE PACKAGE: backend
LABEL: Backend + systemplan
MODEL: composer-2.5-fast
SCOPE: backend-only

REPOMIX CONTEXT: exports/repomix/karnkod-systemplan.md

---

---
scope: backend-only
mustNot:
  - Cross-RAG mellan Kunskap, Valv och Barnen
  - LLM-skriv till WORM (reality_vault, children_logs)
  - Genkit V1 migration utan PMIR
  - Ändra firestore.rules / storage.rules utan PMIR
verifyCommands:
  - cd functions && npm run build
  - npm run pipeline:validate
  - npm run smoke:orkester
---

# Backend-paket — Cursor Pipeline

Du arbetar mot **backend + systemplan**-repomix. Läs repomix-filen som primär kontext.

## Uppgift

Verifiera och underhåll callables, schemas och ADK-wiring enligt kanon. Minsta diff — inget beteendebyte om inte uttryckligen krävs.

## MUST

- Tre silos (U1): Kunskap (`kampspar`), Valv (`reality_vault`), Barnen (`children_logs`)
- DCAP före LLM-routing (`routeFromDcap`, `resolveExecutorId`)
- Scheman i `functions/src/schemas/` — callables importerar därifrån
- Pipeline Studio FTD: `npm run pipeline:validate`
- Runtime-prompter endast i `functions/src/sharedRules.ts`

## READ FIRST

- `.context/system-plan.md`
- `docs/MODUL-FUNKTIONS-REGISTER.md`
- `functions/src/index.ts`
- `docs/pipeline-studio/tools/*.json`


---
VERIFY before claiming done:
  - cd functions && npm run build
  - npm run build
  - npm run smoke:predeploy

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
