# YOLO v14 — Liv och göra G85 debug

**Datum:** 2026-07-14  
**Status:** GO (predeploy:build PASS)

## Vågor genomförda

| Våg | Innehåll | Smoke |
|-----|---------|-------|
| P94 | Baseline eval + unlock docs | superhub, design-modules |
| P95 | Viewport scroll split + tab-lazy panels | design-modules, superhub, build |
| P96 | MabraHubView inlineHub, tab guards | mabra routing |
| P97 | Planering/Arbetsliv EB + catch-all | planering-gora-e, arbetsliv |
| P98 | tabRegistry mabra, /liv redirect, hubContextBar, CSS | locked-ux, modulvaljare |
| P99 | EB grid/intro/morgon | design-debt, copy-audit |
| P100 | e2e/vardagen-entry + smoke:e2e-vardagen tier2 | 30 passed, 1 skipped |
| P101 | yolo-vakt | smoke:predeploy:build PASS |

## Nyckeländringar

- `LivLauncherPage`: contentIsland=false, calm-scroll-island på main, lazy tab panels
- `MabraHubView`: inlineHub prop — ingen auto-navigate från ?project= inline
- `PlaneringInputRoutes` / `ArbetslivInputRoutes`: EB + skeleton + catch-all
- `tabRegistry`: mabra som VardagenTab
- `RedirectLivToVardagen`: /liv?tab=mabra fix
- `hubContextBar`: MåBra → /vardagen?tab=mabra

## G85 manuell verify (Pontus)

Kör efter `npm run build:web && npx cap sync android`:
1. Drawer → Liv och göra
2. Alla tre inline-flikar
3. Projekt + Arbetsliv-kort

## Deploy

P102 hosting SKIP — kräver Pontus OK.
