# Freeport — dock & snabbstart (före/efter sandbox)

Datum: 2026-06-18  
Scope: `/dev/design-freeport` → **Hem (Modell A)**  
Status: implementerad i sandbox (ej prod)

## Sammanfattning

Användaren ville tillbaka till **Fyren-känslan** från prod och **Våg C**-docken: snabbstart som **fälls upp** (alla genvägar synliga), **konfigurerbar**, och **LivskompassMark (D1)** i mitten av docken — men med executive chrome v3 (djupare, snyggare).

## Evolution (kronologi)

| Era | Dock | Snabbstart | Center FAB |
|-----|------|------------|------------|
| **Prod** | `FloatingDock` — 4 zoner | `FyrenWidgetBar` — **4×2 rutnät**, ihopfällt, öppnas uppåt | Ingen center-FAB; Fyren-flik växlar widget-strip |
| **Sandbox Våg C** (`051290353`) | Hem · Hjärtat · **D1** · Vardagen · Familjen | Inline 2×2 i scroll | FAB → supermodul Kompass |
| **FP-TI pivot** | `ExecutiveExactBottomNav` (ref-pixel: Inkorg/Mer) | Horisontella chips i dock-widget | DecorCompass endast i kort |
| **Modell A (nu)** | Återställd **zon-dock + D1** | **4×N rutnät** ovanför dock, `localStorage` | FAB växlar snabbstart |

## Prod-referenser (kanon att bevara semantiskt)

- `src/modules/core/ui/FyrenWidgetBar.tsx` — 4-kolumns grid, backdrop, transform från botten
- `src/index.css` — `.fyren-widget-bar__strip` (grid-cols-4, scale/opacity)
- `docs/design/WIDGET-BAR-SPEC.md` — WH1/WH2, tap/hold/double-tap
- `FloatingDock` — zon-IA, guld aktiv rad

## Beslut i sandbox

1. **Ingen horisontell scroll** — `FreeportSnabbstartPanel` använder `grid-template-columns: repeat(4, 1fr)` (Fyren-lik).
2. **Konfiguration** — `freeportSnabbstartConfig.ts`, nyckel `lk:freeport:snabbstart:v1`, redigeringsläge via kugghjul.
3. **Modell A dock** — `FreeportModellADock` återanvänder `.design-freeport__bottom-nav` från Våg C + fördjupad chrome.
4. **FAB** — `LivskompassMark` togglar panel (inte Mer/Inkorg-IA).
5. **Chameleon** — varje genväg mappar till `FreeportChameleonTarget` via bridge (samma som kort/supermod).

## Nya filer

| Fil | Roll |
|-----|------|
| `freeportSnabbstartConfig.ts` | Katalog, defaults, persist |
| `FreeportSnabbstartPanel.tsx` | Uppfällbar panel + anpassa |
| `FreeportModellADock.tsx` | Zon-nav + D1 FAB |
| `FreeportModellAPhoneShell.tsx` | Phone + panel + dock |

## Kvar för pixel-gate (Pontus)

- [ ] Känns FAB-höjden rätt mot ref-bild?
- [ ] 8 default-genvägar eller färre (4 som Fyren)?
- [ ] Ska FAB dubbel-tap öppna Kompass-morph direkt (prod Fyren-semantik)?
- [ ] PMIR innan prod-ersättning av `FloatingDock`/`FyrenWidgetBar`

## Smoke

`npm run smoke:design-freeport` — kontrollerar Modell A dock + snabb-panel + config.
