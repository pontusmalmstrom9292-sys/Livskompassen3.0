# Unlock — MOD-WIDGET standalone v3

**Datum:** 2026-07-14  
**Modul:** MOD-WIDGET  
**Status:** developing  
**Bas:** v2 locked @ `28e309ecd`
approved: yes

## Syfte

v3 kopplar `HomeWidgetRenderer` + `subscribeUserWidgets` till en fristående widget-route (`/widget/moduler`) med standalone-skin (WidgetDashboardSection, WidgetButton). Ingen iOS WidgetKit (PMIR).

## Scope

- `HomeWidgetRenderer` — WidgetDashboardSection, inga BentoCard
- `WidgetModulerBoard` + `WidgetModulerPage` + route
- Smoke + re-lock

## Ej i scope

- `firestore.rules` / `functions/`
- iOS WidgetKit
- Huvudapp Hem — pinnedToHome förblir datamodell, UI endast på widget-route
