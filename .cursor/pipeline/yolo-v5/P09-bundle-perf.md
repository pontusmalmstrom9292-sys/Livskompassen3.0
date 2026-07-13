# P09 — Bundle perf

```
YOLO P9 — Prestanda: dynamic imports INOM zoner (inte AppRoutes — MOD-CORE-NAV är låst).

Analysera vite build output. Hitta tunga synkrona imports i superhub delegates.
Lägg till dynamic import() på delegate-nivå — inte routing-fil.
Smoke: npm run build && npm run smoke:locked-ux

MUST NOT: ändra src/modules/core/routing/AppRoutes.tsx utan unlock-doc.
Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän build + smoke PASS.
```
