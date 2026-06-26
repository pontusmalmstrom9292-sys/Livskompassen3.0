---
PIPELINE PACKAGE: copilot-sync
LABEL: Copilot instructions sync
MODEL: composer-2.5-fast
SCOPE: docs-ci-only

REPOMIX CONTEXT: exports/cursor-pipeline/copilot-rules-pack.md

---

# Copilot Bridge — pipeline prompt

Du synkar GitHub Copilot Pro med Livskompassen kanon.

## Uppgift

1. Kör `npm run cursor:pipeline:pack:copilot` — validera att `.github/copilot-instructions.md` inte driftar från `.cursor/index.mdc`.
2. Om drift: uppdatera `.github/copilot-instructions.md` och path-specific `.github/instructions/*.instructions.md` (korta statements).
3. Triage öppna PR: Copilot review ≠ PASS — klassificera CRITICAL/WARN/NOISE.
4. Sacred diff → eskalera yolo-vakt. Icke-Sacred → smoke-kommando.

## MUST NOT

- Merge, force-push, prod-deploy
- Cloud agent på Sacred paths

## Verify

```bash
npm run cursor:pipeline:pack:copilot
npm run smoke:mdc
```


---
VERIFY before claiming done:
  - cd functions && npm run build
  - npm run build
  - npm run smoke:predeploy

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
