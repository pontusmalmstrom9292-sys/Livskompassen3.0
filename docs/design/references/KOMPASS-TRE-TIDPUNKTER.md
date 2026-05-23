# Tre kompasser — tid på dygnet (sammanhängande familj)

**Bas (solnedgång):** [`KOMPASS-SOLNEDGANG-BAS.png`](./KOMPASS-SOLNEDGANG-BAS.png)  
**Familj:** Samma geometriska kompassros — olika **himmel + glöd** per läge.

| ID | Tid | Bakgrund | Kompass-glöd | App-ikon |
|----|-----|----------|--------------|----------|
| **K1 — Kväll** | 17–21 | Djup blå, sol precis under horisont | Varm amber, stjärnor täta | `kompass-tid-kvall-appicon.png` |
| **K2 — Skymning/gryning** | 21–05 / 05–07 | Teal-skog + mörkblå (Tema E hem) | Guld `#d4af37`, subtila stjärnor | `kompass-tid-skymning-appicon.png` |
| **K3 — Soluppgång** | 05–09 | Rosa-orange horisont, kall blå upptill | Guld med ljus kant, få stjärnor | `kompass-tid-soluppgang-appicon.png` |

Hub-mockups (kompass på hemskärm): `references/kompass-tid/`

---

## Kompass-hub — inga ord på skivan

| Före | Efter |
|------|--------|
| Pill `budget` | **Bort** — diskret **mynt-stack**-ikon (L1 emboss), ingen text |
| Pill `rutiner` | Kvar |
| Pill `personlig utveckling` | Kvar (ev. kortare «utveckling» på smal skärm) |

---

## Dock & «Hamn»

| Plats | Beslut |
|-------|--------|
| **Dock mitten** | **Endast kompass-ikon** — ingen text (varken Hamn eller Hem) |
| `aria-label` | **`Hem`** (skärmläsare) |
| **Sidomeny** | **Trygg hamn** (modulnamn) — inte bara «Hamn»; route `/hamn` oförändrad |
| Route `/hamn` | Behåll internt — produkt «Trygg hamn» i UI |

Se [`DOCK-KANON.md`](./DOCK-KANON.md).

---

## Implementation

- `LivskompassHero` väljer kompass-asset via `getCompassThemeByTime()` → K1/K2/K3
- `public/icons/app-icon-{kvall,skymning,soluppgang}.png` eller en dynamisk PWA-ikon (senare)
- Mynt: SVG emboss, opacity 0.85, **ingen** label
