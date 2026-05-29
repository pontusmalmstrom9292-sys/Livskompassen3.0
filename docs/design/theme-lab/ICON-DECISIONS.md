# Theme Lab — ikonbeslut

**Stilguide:** [`ICON-STYLE-GUIDE.md`](../ICON-STYLE-GUIDE.md)  
**Låst:** [`.context/locked-icons.md`](../../../.context/locked-icons.md) · smoke: `npm run smoke:locked-icons`  
**Master:** [`IKON-WIDGET-MASTER.md`](../IKON-WIDGET-MASTER.md) · **v4 preview:** [`icons-proposals/2026-05-26-v4-round2-dna/`](../icons-proposals/2026-05-26-v4-round2-dna/) — rad 1 = v2 **B1/D1/M2** ankare + 9 varianter × chrome. `npm run icons:proposals-v4`  
**v3 (5 stilar):** [`icons-proposals/2026-05-26-v3-chassis/`](../icons-proposals/2026-05-26-v3-chassis/) — `npm run icons:proposals-v3`  
**Äldre enkla:** [`icons-proposals/2026-05-26-remaining/`](../icons-proposals/2026-05-26-remaining/) (3 varianter)

## Låsta (MUST NOT ändra utan produktbeslut)

| ID | Plats | Fil | Status |
|----|-------|-----|--------|
| **B1** Kanon ros | App / favicon / PWA | `public/favicon.svg` | LÅST |
| **D1** Gold stack | Header lockup, dock, hero | `LivskompassMark.tsx` · `LivskompassBrandLockup.tsx` | LÅST 2026-05-29 |
| **M2** Orakelöga | Kompis-avatar | `KompisMark.tsx` | LÅST |

## Chrome v5 (G1 prod, 2026-05-29)

| Plats | Val | Asset |
|-------|-----|-------|
| Dock / drawer / hero orbit | **G1 wire** | `public/icons/chrome/v5-g1-{kategori}.svg` |
| BIFF | **hamnBiff** | `v5-g1-hamnBiff.svg` |
| Kompis (meny) | **kompis** stjärna | M2 avatar orörd |

`npm run icons:proposals-v5` · preview: `docs/design/icons-proposals/2026-05-29-gold-hub-v5/preview.html`

## Chrome — legacy v4 (ersatt i prod av v5)

## Chrome — inbyggt (v4 rad 1, 2026-05-27)

| Plats | Val | Asset / komponent |
|-------|-----|-------------------|
| Meny Familjen + dock | **F1** | `public/icons/chrome/v4-familjen.svg` · `ChromeV4Icon` |
| Meny Hamn + dock | **H1** | `v4-hamn.svg` |
| Meny Valv (hub) + bevis | **V1** | `v4-valv.svg` |
| Meny + dock Dagbok | **J1** | `v4-dagbok.svg` |
| Meny Planering + dock | **P1** | `v4-planering.svg` |
| Meny MåBra + dock | **A1** | `v4-mabra.svg` |
| Hero rutiner | **R1** | `v4-rutiner.svg` · `HeroOrbitIcons` |
| Hero ekonomi | **E1** | `v4-ekonomi.svg` |
| Hero utveckling | **U1** | `v4-utveckling.svg` |
| Hero kunskap | **Kn1** | `v4-kunskap.svg` |

Byt rad: säg t.ex. `F3, H2, … — byt in chrome` (uppdatera `public/icons/chrome/` + `ChromeV4Icon` SRC).

Stil: D1-skiva (guld, ticks, ringar) + **unik glyph** — inte samma ikon som kompass-mark.

## Övrigt (Lucide OK tills vidare)

| Plats | Nu | Notering |
|-------|-----|----------|
| Meny Hem hub | Compass | Egen “hem”-ikon valfritt — ej samma som D1 |
| Meny Arbetsliv | Clock | P1 Lucide |
| Valv underflikar | BarChart3, Network, … | Följer hub V* när valt |
| Loader / chevron / stäng | Lucide | Tillåtet enligt stilguide |

**Kanon:** [`MENU-DRAWER-KANON.png`](../references/MENU-DRAWER-KANON.png)
