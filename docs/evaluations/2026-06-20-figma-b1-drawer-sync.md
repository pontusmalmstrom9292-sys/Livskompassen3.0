# Figma B1 — drawer sync (L1 Chrome)

**Datum:** 2026-06-20  
**Figma:** [Obsidian Calm Master](https://www.figma.com/design/ua5am9TPvb3wSGKfUJxIV5) · sida `01 — Chrome`  
**Kanon:** [`docs/design/references/MENU-DRAWER-KANON.md`](../design/references/MENU-DRAWER-KANON.md)

## Status: PASS (kod ↔ kanon ↔ Figma mocks)

| Check | Resultat |
|-------|----------|
| `NavigationDrawer.tsx` | Låst core — Vardag + Valv-block, swipe/Escape, panic lock |
| `drawerNav.ts` | `DRAWER_VARDAG_ITEMS` / `DRAWER_VALV_ITEMS` från `navTruth` |
| CSS `nav-drawer*` | Obsidian depth, ~68vw, guld aktiv rad (`text-accent`) |
| Publikt läge | Ingen Valv-sektion utan unlock |
| Valv läge | Vardag + Valv + `DrawerModeToggle` Vardag tillbaka |
| Smoke | `smoke:locked-ux` drawer-sektion PASS |

## Scope B1 (denna våg)

- Figma mocks **klar** (Vardag + Valv unlocked på sida 01).
- Kod **ingen strukturändring** — `NavigationDrawer.tsx` är PROTECTED.
- Nästa L1-steg: **B2 dock** (`figma-L1-dock`) enligt masterplan.

## Gate

```bash
npm run smoke:locked-ux
npm run smoke:design-modules
```
