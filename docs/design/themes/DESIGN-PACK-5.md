# Designpaket D1–D5 (helapp)

**Theme Lab:** http://localhost:5173/dev/theme-lab → **Designpaket — 5 helapp**

| ID | Rubrik | Referensbild |
|----|--------|----------------|
| `D1-hamn-kompass` | Hamn & kompass | `public/design/mockups/ref-hamn.png` |
| `D2-familjen-kort` | Familjen kort | `ref-familjen.png` |
| `D3-minnes-timeline` | Minnes tidslinje | `ref-minnes.png` |
| `D4-flat-luxe` | Flat luxe meny | scenic |
| `D5-aurora-glas` | Aurora glas | scenic + aurora |

## Vad som byts

- **Header** — centrerad Cinzel-rubrik + diamant (ersätter glass-header-bar)
- **Dock** — Familjen · Hamn (kompass + båge) · Valv
- **Kort** — `UiCard` / radlayout med guldikon
- **Bakgrund** — `--design-bg-image` per paket
- **Meny** — flat guld rader (D1–D4)

## Kod

- `src/modules/core/theme/themePackDesign.ts`
- `src/modules/core/design/designPackMeta.ts`
- `src/styles/design-packs.css`
- `html[data-design-pack="D1"]` … `D5`

## Vinnare

Skriv `VINNARE: D2-familjen-kort` i `docs/design/theme-lab/VARIANTS.md`.
