# Chrome Ember — låst färgkanon (header + dock)

**Beslut:** 2026-05-29 · **Status:** LÅST för prod  
**Godkänd av:** produkt (skärmdump Projekt + Hem — guld på obsidian, header och dock matchar)

Ändra **inte** flat `chrome-strip-surface` (svart glas) på dock/header utan explicit beslut och uppdatering av denna fil + `npm run smoke:design-modules`.

---

## Aktivering

| Env | Värde | Effekt |
|-----|-------|--------|
| `VITE_HEADER_PANEL_STYLE` | **`ember`** (standard om saknas) | `AppHeaderBar` + `DockHubBand` får `data-panel-style="ember"` |

Kod: `src/modules/core/layout/headerPanelStyle.ts` · CSS: `src/index.css` (`.glass-header-bar--kanon[data-panel-style='ember']` + `.dock-hub-band[data-panel-style='ember']`).

---

## Kärnpalett (tokens)

| Token | Värde | Användning |
|-------|-------|------------|
| `--text-gold` | `#d4af37` | Kant, ikoner, accent |
| `--accent-light` | `#e8d48a` | Titlar, banner-text |
| `--bg` / skal | `#0a1614` → obsidian `#020617` gradient | App-bakgrund |
| Guld kant (ember) | `rgba(212, 175, 55, 0.42)` | 2px panelram header + dock-rail |
| Topp-highlight | `#fff3c4` → `#d4af37` @ 50% | `::before` linje på panel |
| Panel-gradient topp | `rgba(42, 34, 22, 0.94)` | Varm brons |
| Panel-gradient botten | `rgba(6, 8, 18, 0.88)` | Kall obsidian |

---

## 3D-knappar (`header-chrome-btn`)

Dock-ikoner och header (meny, konto, Kompis, kompass-mitt) delar samma knappchrome:

- Kant: `color-mix(in srgb, var(--accent) 42%, transparent)` · 1.5px  
- Gradient: `rgba(58, 48, 32)` → `rgba(8, 10, 16)`  
- Inset highlight: `rgba(255, 243, 210, 0.18)`  
- Glyph glow: `drop-shadow` + `rgba(212, 175, 55, 0.32)`

---

## Komponenter (sanning i kod)

| Yta | Klass / komponent |
|-----|-------------------|
| Header panel | `glass-header-bar--kanon` + `data-panel-style` |
| Dock rail | `dock-hub-band__rail` + samma `data-panel-style` |
| Dock hub-pill | `dock-hub-band__banner-text` (ember-gradient) |
| Mitt kompass | `LivskompassMark` (D1) i `header-chrome-btn--logo` |

---

## Får inte (utan ny PMIR)

- Byta dock till platt `rgba(10, 10, 10, 0.55)` medan header är ember 3D  
- Olika `data-panel-style` på header vs dock  
- Indigo/lila global accent (design-language förbud)

---

## Smoke

`npm run smoke:design-modules` — verifierar fil + wiring.  
Visuellt: jämför header och dock på `/` och `/projekt` efter ändring.
