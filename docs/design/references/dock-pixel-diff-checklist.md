# Dock pixel-diff checklist — KOMPASS-LOCKED kanon

**Version:** 1.0 · **2026-07-09**  
**Referens:** [`docs/design/galleri/KOMPASS-LOCKED-kanon.png`](../galleri/KOMPASS-LOCKED-kanon.png) · [`dock-kanon-ref-2026-06-28.png`](./dock-kanon-ref-2026-06-28.png)

Kör visuell diff mot kanon efter varje dock-ändring. `NavigationDrawer.tsx` och kompass-placering är **låsta** — polish endast.

## Struktur (6 zoner)

| # | Zon | Kontroll |
|---|-----|----------|
| 1 | Anteckning | Ikon + etikett synlig, samma optiska vikt som Familj |
| 2 | Familj | Vänster par, inte dominerande |
| 3 | **KOMPASS** | Centrerad, större än övriga, bryter ut ur dock-pill |
| 4 | Hjärtat/Ventil | Höger par |
| 5 | Inkast | Höger par |
| 6 | Resurser | Ytterst höger |

## Kompass (kritisk)

- [ ] Kompassen sitter **exakt i mitten** — inte inuti pill som vanlig ikon
- [ ] Metallring + rosett syns (custom SVG, ej ikonbibliotek)
- [ ] Kompassen är **större** än dock-ikonerna (min ~1.4× optisk yta)
- [ ] Guld glow diskret — ingen neon/HUD
- [ ] Safe-area: clearance `var(--app-dock-clearance)` på hub-sidor

## Dock-pill (glas)

- [ ] Kapsel-form med guldkant (`dock-kanon-match.css` / `basta-dock-bar--v2`)
- [ ] Djup marin botten, transparent topp-gradient fade
- [ ] `min-height` ~2.75rem pill + kompass-stack ~6.5rem
- [ ] Ingen flat Material-bottom-nav

## Mobil (G85, 390×844)

- [ ] Touch targets ≥44px på alla zoner utom kompass-centrum
- [ ] Kompass tryckbar utan att klippas av safe-area
- [ ] Dock skymmer inte hub-innehåll (scroll-island clearance)

## Smoke (obligatoriskt)

```bash
npm run smoke:chrome-header
npm run smoke:locked-ux
npm run smoke:design-modules
```

## Kända undantag (ej regression)

- `ResurserOverlay.tsx` — locked chrome-flöde, ad-hoc dialog medvetet
- `NavigationDrawer.tsx` — exkluderad från design-debt-räknare
