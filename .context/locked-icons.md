# Låsta ikoner (produkt — 2026-05-26, B1 upplåst 2026-05-29)

**Status:** D1 + M2 låsta. **B1 är inte längre designmall** — app/favicon/Android får bytas fritt (t.ex. `docs/design/themes/phone-icon-variants/PREVIEW.md`).

| ID | Plats | Komponent / fil | Status |
|----|-------|-----------------|--------|
| ~~**B1**~~ Kanon ros | Hemskärm, PWA, favicon, Android | `public/favicon.svg` · legacy `app-icon-b1-kanon-ros-1024.png` | **Upplåst** — ej obligatorisk mall |
| **D1** Helros | Header, dock-mitt, hero-centrum, drawer-mark | `src/modules/core/ui/LivskompassMark.tsx` | LÅST |
| **M2** Orakelöga | Kompis-avatar (header) | `src/modules/kompis/components/KompisMark.tsx` | LÅST |

## Regler

- **App-ikon:** välj från telefonvarianter P1–P5 eller ny design — **inte** tvingad till B1 Kanon ros.
- Ersätt **inte** D1/M2 med Lucide, Vite-default eller generisk kompass utan beslut.
- Nya chrome-ikoner i appen ska följa [`docs/design/ICON-STYLE-GUIDE.md`](../docs/design/ICON-STYLE-GUIDE.md) (D1/M2-nivå, inte B1-ros som mall).

## Smoke

`npm run smoke:locked-icons` (D1 + M2; ingår i `smoke:locked-ux`).
