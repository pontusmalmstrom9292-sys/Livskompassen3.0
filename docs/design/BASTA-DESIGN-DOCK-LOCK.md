# Bästa design — Dock + Header (LÅST 2026-07-09)

**Status:** Prod-låst för `ME-basta-design` / `app-shell--basta-design`.  
**Ändring kräver:** explicit Pontus OK + uppdatera denna fil + `npm run smoke:basta-dock-lock` PASS.

Referens: `docs/bästa designv2/` · kanon-PNG `docs/design/galleri/executive-dock-crop-prod.png`

---

## Arkitektur (MUST NOT bryta)

| Del | Plats | Komponent / CSS |
|-----|-------|-----------------|
| **Header** | Topp | `BastaDesignHeader.tsx` |
| **Resurser** | **Endast header** — `BastaDesignResurserWidget` `placement="header"` | **Får inte** ligga i dock-shell |
| **Resurser overlay** | Header state | `ResurserOverlay` i `BastaDesignHeader`, inte i `BastaDesignDock` |
| **Dock shell** | Botten | `BastaDesignDock.tsx` → `dock-shell--basta-design dock-shell--basta-v2` |
| **Dock bar** | 5 kolumner | `BastaDesignDockBar.tsx` — **4 zoner + hero-kompass** |
| **Kompass** | Mitt, breakout | `BastaDesignDockCompass.tsx` (~7.25rem) |
| **Stilar** | v2 kanon | `src/styles/dock-kanon-match.css` |

---

## Dock-zoner (låsta etiketter)

| Position | Etikett (UI) | Route / beteende |
|----------|--------------|------------------|
| Vänster 1 | **Anteckning** | `/widget/anteckning` |
| Vänster 2 | **Familj** | `/familjen` |
| Center | **Kompass** (ingen text under) | Kort tryck → `/` · 3s long-press → Valv via Fyren |
| Höger 1 | **Mentil** | `/hjartat` (label Mentil, inte Hjärtat) |
| Höger 2 | **Inkast** | `/planering/input?inputMode=inkast` |

**Förbjudet utan OK:** lägga Resurser som sjätte zon i dock-raden · byta till `ExecutiveDockBar` i prod · ta bort `basta-dock-bar--v2`.

---

## Resurser-widget (låst beteende)

- Tab i **header-start** (vänster, efter meny-knappen): ikon + text **Resurser**
- Panel fälls **nedåt** från header (`basta-resurser-widget--header`)
- Snabblänkar + **Alla resurser** → `ResurserOverlay`
- **Får inte** åter flyttas till `dock-shell` högerkant

---

## CSS-invariants (`dock-kanon-match.css`)

- Dock bar: `width: 100%` · `margin-right: 0` (full bredd — ingen reserverad widget-spalt)
- Sidozoner: min-width ~3.35rem · icon-well ~2.35rem · etiketter synliga
- Kompass-slot: `minmax(7.35rem, …)` · kompass ~7.25rem breakout
- Opaque scrim: `.dock-shell--basta-v2::before` (ingen bleed-through från innehåll)

---

## Skyddade filer

```
src/modules/core/layout/basta-design/BastaDesignHeader.tsx
src/modules/core/layout/basta-design/BastaDesignDock.tsx
src/modules/core/layout/basta-design/BastaDesignDockBar.tsx
src/modules/core/layout/basta-design/BastaDesignResurserWidget.tsx
src/modules/core/layout/basta-design/BastaDesignDockCompass.tsx
src/styles/dock-kanon-match.css
```

`MainLayout.tsx` är redan PROTECTED — byt inte header/dock-wiring utan PMIR.

---

## Verifiering

```bash
npm run smoke:basta-dock-lock
npm run smoke:design-modules
npm run smoke:locked-ux
```

Cursor-regel: `.cursor/rules/basta-design-dock-lock.mdc`
