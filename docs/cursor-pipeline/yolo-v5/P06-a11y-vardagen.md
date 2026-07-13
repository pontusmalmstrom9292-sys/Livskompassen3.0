# P06 — A11y Vardagen

```
YOLO P6 — Tillgänglighetspolish i Vardagen-zonen (/vardagen).

Scope: src/modules/features/dailyLife/** och relaterade hubbar.
- aria-label på ikonknappar utan synlig text
- focus-visible enligt premium-polish.css
- prefers-reduced-motion där Framer Motion används
- min 44px touch targets på G85

Rör INTE Valv, Barnporten, Familjen locked flows.
Smoke: npm run smoke:design-modules && npm run smoke:locked-ux && npm run smoke:mabra

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän smoke PASS.
```
