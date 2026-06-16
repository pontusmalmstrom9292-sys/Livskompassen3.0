# Ikoner v4 — 10 varianter × 13 familjer (130 SVG)

**Ankare (rad 1):** exakt [`2026-05-26-v2-premium`](../2026-05-26-v2-premium/) — **B1** Kanon ros · **D1** Helros · **M2** Orakelöga (+ referens-PNG i `reference/`).

| Rad | App | Kompass | Kompis | Chrome (meny/hero) |
|-----|-----|---------|--------|-------------------|
| **1** | `B1-b1-kanon-ros-v2.svg` | `D1-d1-helros-v2.svg` | `M1-m2-orakel-v2.svg` | `F1-d1-helros-chrome.svg` … |
| 2–10 | Variationer | samma | samma | samma suffix |

**Chrome (meny + dock + hero):** rad 1 = D1-skiva + **egen symbol** per kategori (familj, hamn, valv, …) — **inte** samma kompass-ros som D1. Rad 2–10 = samma symbol med extra stil-lager (3D, eldnål, aurora, …).

Prod (låst) ändras **inte** här — bara förslag tills du säger «byt in».

## Förhandsvisa

```bash
cd docs/design/icons-proposals/2026-05-26-v4-round2-dna
./serve-preview.sh
```

→ http://127.0.0.1:8766/preview.html

**Cursor:** Live Preview på `preview.html`.

## Regenerera

```bash
npm run icons:proposals-v4
```

Källa: [`scripts/generate_icon_proposals_v4.mjs`](../../../scripts/generate_icon_proposals_v4.mjs) läser v2 `B1-kanon-ros.svg`, `D1-helros.svg`, `M2-orakeloga.svg`.

## Välja

Exempel: `App 1, Kompass 1, Kompis 1, F1 V1 …` (rad 1 = v2) eller blandat `App 1, Kompass 3, Kompis 7, F2 …`.
