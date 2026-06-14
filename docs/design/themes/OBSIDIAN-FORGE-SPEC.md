# Obsidian Forge — designspec (Theme Lab)

**Status:** **PROD-WIRE GODKÄND** 2026-06-15  
**Mockup:** `/dev/obsidian-forge`  
**Evolution av:** Obsidian Depth (`OD-obsidian-depth`) + fem referensmockups  
**Prod-wire:** `FORGE_PROD_WIRE_ENABLED = true` — syns på Hem när tema = `OD-obsidian-depth`

---

## Syntes från referenser

| Referens | Övertaget mönster | Utelämnat |
|----------|-------------------|-----------|
| Task-app | Horisontell chip-scroll; status-rad med count; progress-ring; sektionsrubriker | Regnbågsfärger |
| Fitness dark+gold | 2×2 bento, aktiv = guld fyllning; pill-chips; minimal dock | Vit panel, kalori-XP |
| Dark stacked | Lagerad 3D; flytande primär-CTA; bottom sheet (fas 2) | Orange accent |
| Mariposa | Hero med meta; widget-rad; progress i listkort | Ljust glas, lila FAB |
| Wealthmize | Hero-CTA; feature-grid; chevron-rader i meny | Lila gradient |

**Obsidian Forge** = ett steg i taget: **en** hero-CTA, **fyra** zonkort, **sekundärt** horisontellt scroll, **symmetrisk** chrome (meny + titel + Kompis).

---

## Tokens

| Token | Värde |
|-------|-------|
| Obsidian | `#020617` |
| Grafit | `#0a1019` |
| Surface | `#050b14` / `#09111e` / `#111b2d` |
| Guld | `#d4af37` |
| Guld ljus | `#e8c96a` |
| Guld dim | `#9a7b2f` |
| Guld glow | `rgba(212, 175, 55, 0.28)` |
| Glas | `rgba(9, 17, 30, 0.55)` + `blur(20px)` |
| Text | `#f1f5f9` |
| Muted | `#94a3b8` |

**MUST NOT:** indigo, teal, röd eller grön som primär chrome.

---

## Komponenter (`.od-forge__*`)

| Klass | Roll |
|-------|------|
| `od-forge__phone` | Telefonram (Theme Lab) |
| `od-forge__header` | Meny + Cinzel-titel + Kompis |
| `od-forge__hero` | Hälsning, tagline, profil/Närvaro, CTA |
| `od-forge__bento` / `__bento-card` | 2×2 zonkort |
| `od-forge__chips` / `__chip` | Horisontell snabbscroll |
| `od-forge__section` | Rubrik med ikon + innehåll |
| `od-forge__drawer` | Chevron-rader (preview) |
| `od-forge__dock` / `__fyren` | Fyren + 4 zoner |

---

## Filer

| Fil | Roll |
|-----|------|
| `src/styles/obsidian-forge-lab.css` | All Forge-CSS + bridge-hook |
| `src/modules/core/ui/forge/*.tsx` | React-komponenter |
| `src/modules/core/pages/ObsidianForgeLabPage.tsx` | Interaktiv preview |
| `scripts/smoke_obsidian_forge.mjs` | Statisk smoke |

---

## Låsningar (oförändrade)

- Drawer: Vardag + Valv (PIN), gold aktiv rad — `MENU-DRAWER-KANON.md`
- Fyren: 3s Valv, WH1/WH2 — `locked-ux-features.md`
- Ikoner D1/M2 — `locked-icons.md`
- Obsidian Depth 3D-skalet — **ersätts inte**; Forge är komplementär preview

---

## Fas 2 (efter godkännande)

1. Aktivera `html[data-theme='OD-obsidian-depth'] .od-forge-bridge` i prod
2. `HomeHeroKanon` → `OdForgeHeroCard` + `OdForgeBentoGrid` när flag/theme
3. `MainLayout` / `NavigationDrawer` / `FloatingDock` → forge chrome-klasser
4. `smoke:locked-ux` + deploy hosting

---

## Smoke

```bash
npm run smoke:obsidian-forge
```
