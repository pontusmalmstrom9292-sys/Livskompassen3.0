# Låsta ikoner (produkt — 2026-05-29)

**Status:** D1 + M2 låsta. App-ikon: **P7** (vault-sacred-3d, prod 2026-05-29) · P6 · P8-alpha.

| ID | Plats | Komponent / fil | Status |
|----|-------|-----------------|--------|
| **D1** Gold stack | Header lockup, dock-mitt, hero-centrum, drawer-mark | `LivskompassMark.tsx` · `LivskompassBrandLockup.tsx` | LÅST |
| **M2** Orakelöga | Kompis-avatar (header) | `KompisMark.tsx` | LÅST |
| **WH1** Inspelning | Fyren strip + PWA shortcut | `FyrenShortcutMicIcon.tsx` · `drawer-inspelning.svg` · `wh-inspelning.svg` | LÅST 2026-06-14 |
| **WH2** Anteckning | Fyren strip + hub-kontext + PWA | `FyrenShortcutNoteIcon.tsx` · `drawer-anteckning.svg` · `wh-anteckning.svg` | LÅST 2026-06-14 |
| ~~**B1**~~ | Legacy | `d1-helros-2026-05-26-archive` | Arkiverad |

## Hub chrome v5 (G1 default)

- Generator: `npm run icons:proposals-v5`
- Prod: `public/icons/chrome/v5-g1-*.svg` · `ChromeV5Icon`
- Stilar G1–G5: Theme Lab (`lk.chromeIconStyle`)

## Telefonikoner

| ID | Fil |
|----|-----|
| **P7** | `vault-sacred-3d-2026-05-source.png` → `P7-vault-sacred-1024.png` (**prod**) |
| **P7-alpha** | `P7-vault-sacred-alpha-1024.png` (transparent) |
| **P6** | `P6-gold-emboss-1024.png` |
| **P8-alpha** | `P8-orbit-hub-alpha-1024.png` |

`npm run icons:phone-export` · `npm run android:icons:phone`

## Fyren WH1 / WH2 (glyph-lås)

- **WH1:** mikrofon (kapsel + båge + ställ), **ingen REC-prick** — `WIDGET-BAR-SPEC.md`
- **WH2:** dokument + vikt hörn + penna
- **Fyren in-app:** inline `FyrenShortcutMicIcon` / `FyrenShortcutNoteIcon` i `FyrenWidgetBar.tsx` (`widgetIcon: 'mic' | 'note'`) — **inte** extern `shortcutSrc` till gamla D1-placeholders
- **PWA/hemskärm:** `public/icons/shortcuts/wh-*.svg` (48px, samma glyph)

## Smoke

`npm run smoke:locked-icons` · `npm run smoke:locked-ux`
