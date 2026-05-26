# Chrome-policy — dock, widget, sidfötter

**Version:** 2026-05-26 · **Sanning:** `src/modules/core/navigation/navTruth.ts`  
**Ikoner:** låst B1/D1/M3 — [`ICON-STYLE-GUIDE.md`](./ICON-STYLE-GUIDE.md) · övriga: [`icons-proposals/2026-05-26-remaining/`](./icons-proposals/2026-05-26-remaining/)

## Lager (botten → topp)

| Lager | Komponent | Var | Policy |
|-------|-----------|-----|--------|
| 1 | **FloatingDock** | `DockClassicTriad` | Alltid på `MainLayout` — Familjen · Kompass · Valv ([DOCK-KANON](references/DOCK-KANON.md)) |
| 2 | **FyrenSmartWidgetBar** | `FyrenSmartWidgetBar.tsx` | Kanonisk W1–W4; dold på `/widget/*` |
| 3 | **Hem snabbåtgärder** | `DrawerHomeQuickActions.tsx` i `NavigationDrawer` | **Endast `/`** — öppnas via hamburger (ej separat strip i header) |
| 4 | **NavigationDrawer** | Portal vänster | 8 rader från `navTruth` / `drawerNav` |
| 5 | **Modul-footer** | `HubPageShell.footerSlot` | Valfri diskret rad — inte tredje fast bar |

## Modul-footer (P1)

| Hub | Footer |
|-----|--------|
| Familjen | `ParentReminderFooter` på fliken Reflektion (`footerSlot`) |
| MåBra, Planering | Ingen modul-footer i P1 |

## Ej i P1

- `FyrenWidgetBar` (legacy, ej monterad)
- `PlaneringSubNav` (galleri-spec — flikar via `TabBar` idag)

## Scroll-padding

`MainLayout` `main` använder `pb-24` så innehåll inte döljs under dock + widget.
