# P07 — Copy audit

```
YOLO P7 — Copy audit fixes.

1. Kör npm run smoke:copy-audit — fixa alla FAIL.
2. Flytta förbjudna strängar till src/modules/core/copy/ enligt befintligt mönster.
3. Endast text/copy — ingen logik-, route- eller WORM-ändring.

Smoke: npm run smoke:copy-audit && npm run smoke:locked-ux
Uppdatera docs/PROGRESS.md.

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän smoke:copy-audit PASS.
```
