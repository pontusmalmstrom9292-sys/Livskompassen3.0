# Bästa design — Header + Dock (LÅST 2026-07-09)

**Status:** Prod-låst för `ME-basta-design` / `app-shell--basta-design`.  
**Referens:** `docs/bästa designv2/src/app/App.tsx` · kanon-PNG `docs/design/galleri/executive-dock-crop-prod.png`  
**Paritet:** [`BASTA-DESIGN-V2-PARITY.md`](BASTA-DESIGN-V2-PARITY.md)

**Ändring kräver:** explicit Pontus OK + uppdatera denna fil + `npm run smoke:basta-dock-lock` PASS.

---

## Header (MUST NOT bryta)

| Del | Krav |
|-----|------|
| **Layout** | 3-kolumns grid: `header-start` \| `header-brand` \| `header-actions` |
| **Vänster** | Meny + `BastaDesignResurserWidget` `placement="header"` i `basta-design__header-start` |
| **Center** | `Livskompassen` + ornament (diamant-linje) — större prod-typografi |
| **Höger** | Inställningar · konto · Kompis-öga (Valv) — **inte** Resurser här |
| **Overlay** | `ResurserOverlay` state endast i `BastaDesignHeader` |

**Förbjudet:** flytta Resurser till höger actions · ta bort grid/brand · byta till `AppHeaderBar` under basta-design.

---

## Dock (MUST NOT bryta)

| Del | Krav |
|-----|------|
| **Shell** | `dock-shell--basta-design dock-shell--basta-v2` |
| **Bar** | `BastaDesignDockBar` + `basta-dock-bar--v2` — full bredd (`width: 100%`, `margin-right: 0`) |
| **Zoner** | Anteckning · Familj · hero-kompass · Mentil · Inkast |
| **Kompass** | `BastaDesignDockCompass` ~7.25rem breakout · 3s long-press → Valv |
| **Scrim** | `.dock-shell--basta-v2::before` opaque — ingen bleed-through |

**Förbjudet:** Resurser i dock-raden · `ExecutiveDockBar` i prod · krympa dock för sidwidget.

---

## Hem (bästa designv2 paritet)

Prod: `BastaDesignHome` + `BastaDesignHero` när `ME-basta-design` och route `/`.

Sektioner (ordning): Dagens reflektion → Dagens fokus + Fråga livscoachen → Dagens ankar → Planering → Tidigare anteckningar.

---

## Skyddade filer

```
src/modules/core/layout/basta-design/BastaDesignHeader.tsx
src/modules/core/layout/basta-design/BastaDesignDock.tsx
src/modules/core/layout/basta-design/BastaDesignDockBar.tsx
src/modules/core/layout/basta-design/BastaDesignResurserWidget.tsx
src/modules/core/layout/basta-design/BastaDesignDockCompass.tsx
src/modules/core/home/basta-design/BastaDesignHome.tsx
src/modules/core/home/basta-design/BastaDesignHero.tsx
src/styles/dock-kanon-match.css
src/styles/basta-design.css (header--prod block)
```

---

## Verifiering

```bash
npm run smoke:basta-dock-lock
npm run smoke:locked-ux
```

Cursor: `.cursor/rules/basta-design-dock-lock.mdc` · register: `.context/locked-ux-features.md` §21
