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
