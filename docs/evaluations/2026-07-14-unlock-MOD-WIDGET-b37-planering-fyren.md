# Unlock — MOD-WIDGET b37 Planering + Fyren

**Datum:** 2026-07-14  
**Modul:** MOD-WIDGET  
**Wave:** v37 · PLANERING  
**Status:** unlocked  
approved: yes  
**Godkänd av:** YOLO v37 build scope (Planering P3: FyrenWidgetBar + Morgonkompassen)

---

## Syfte

Tillåt minimal diff i låsta Fyren-komponenter för Planering P3: snabbval till Handling (`/planering?tab=handling&picked=1`) och Morgonkompassen (`/morgon`).

## Scope (tillåtet)

- `FyrenWidgetBar.tsx` — tile **Morgon** → `/morgon` (hub: vardagen)
- `FyrenSideQuickDock.tsx` — quick actions **Planering** + **Morgon**
- `fyrenHomeQuickActions.ts` — **Morgon** i hem header-strip

## Utanför scope

- Ny route-zon eller AppRoutes-ändring (PMIR)
- Android widget providers
- Borttagning av befintliga Fyren-tiles

## DoD

- [x] Planering-tile oförändrad (`/planering?tab=handling&picked=1`)
- [x] Morgon-länkar i FyrenWidgetBar, SideQuickDock, hem snabbåtgärder
- [x] `smoke:widgets` PASS
- [x] `smoke:module-lock` PASS (via denna unlock-doc)

## Re-lock

Efter b37-vakt GO: behåll lås; diff är additiv och inom kanon.
