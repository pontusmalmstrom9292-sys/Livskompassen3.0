# Ikoner v4 — 10 stilar × 13 familjer (130 SVG)

**Mål:** Premium som **hem-bakgrundskompassen** — rund/square, mycket detalj, guld + eld, flat **och** 3D-skugga.

## Stil-DNA (v2 andra omgången — ej nuvarande prod)

| Roll | v2 referens | Nu i app (fel enligt dig?) |
|------|-------------|----------------------------|
| Kompass | **D3** Eldnål | D1 Helros |
| App | **B2** Aurora ring | B1 Kanon ros |
| Kompis | **M1** Stjärnkompis | M3 Fyrens själ |

I chatten skrevs `d1 b1 m3` — om du menade **andra** ID (t.ex. D3 B2 M1), skriv det vid val så byter vi prod.

## 10 stilar (per kategori)

| # | ID | Flat/3D |
|---|-----|---------|
| 1 | helros-flat | flat |
| 2 | helros-3d | 3D |
| 3 | eldnal-flat | flat |
| 4 | eldnal-3d | 3D |
| 5 | aurora-flat | flat |
| 6 | aurora-3d | 3D |
| 7 | stjarn-flat | flat |
| 8 | stjarn-3d | 3D |
| 9 | sacred-flat | flat |
| 10 | obsidian-3d | 3D |

**Kärn:** `core/app/B1…B10`, `core/kompass/D1…D10`, `core/kompis/M1…M10`  
**Chrome:** Familjen, Hamn, Valv, Dagbok, Planering, MåBra, Hero R/E/U/Kn — samma 1–10.

## Förhandsvisa

```bash
cd docs/design/icons-proposals/2026-05-26-v4-round2-dna
./serve-preview.sh
```

→ http://127.0.0.1:8766/preview.html (jämför med hero-bild överst)

**Cursor:** Live Preview på `preview.html` visar alla ikoner i panel.

## Regenerera

```bash
npm run icons:proposals-v4
```

## Välja & bygga in

Exempel:

`App 6, Kompass 4, Kompis 8, F3 H2 V5 J1 P7 A4 R2 E6 U3 Kn9 — byt in + android:icons`

Då uppdaterar vi `favicon`, `LivskompassMark`, `KompisMark`, Android mipmap och låser nya ID i `.context/locked-icons.md`.
