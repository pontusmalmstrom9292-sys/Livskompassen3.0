# P05 — Ad-hoc dialoger → DS Modal

```
YOLO P5 — Migrera ad-hoc dialoger till design-system Modal/Sheet.

Målfiler:
- src/modules/sandbox/widget/W1ProjektNyPickerPreview.tsx (först)
- src/modules/sandbox/components/FreeportResurserOverlay.tsx
- src/modules/core/navigation/ResurserOverlay.tsx (endast om smoke:locked-ux PASS efter sandbox)

Byt role="dialog"-mönster till DS Modal/Sheet. Behåll exakt samma UX och flöden.
Smoke: npm run smoke:design-modules && npm run smoke:locked-ux && npm run smoke:orkester
PMIR-stopp: ändra inte NavigationDrawer.tsx.

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän smoke PASS.
```
