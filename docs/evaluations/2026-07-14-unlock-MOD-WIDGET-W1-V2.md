# Unlock — MOD-WIDGET W1 v2 kompakt strip

**Datum:** 2026-07-14  
**Modul:** MOD-WIDGET — W1 kompakt projekt-rail (Theme Lab → prod)  
**Status:** unlocked  
approved: yes  
**Godkänd av:** Pontus (via «kör våg 3»)

---

## Scope (tillåtet)

- Extrahera `w1-lab-rail` från Theme Lab till prod `W1KompaktProjektRail`
- Koppla till `/widget/projekt` + `W1EdgeQuickDock` (Executive Fyren kant)
- Prod-CSS (tokens, ej theme-lab-only)
- Smoke-uppdateringar för rail wiring
- Theme Lab preview importerar prod-rail (paritet)

## Utanför scope

- Ny route-zon eller hub-redesign
- Native Android W1 provider (framtida våg)
- Locked UX-ändringar

## DoD

- [x] Rail på `/widget/projekt` med riktiga widget-routes
- [x] W1EdgeQuickDock expanderar kompakt strip (Fyren executive)
- [x] `smoke:widgets`, `smoke:design-modules`, `smoke:locked-ux` PASS

## Re-lock

Efter smoke PASS: uppdatera MOD-WIDGET lock + eval-logg.
