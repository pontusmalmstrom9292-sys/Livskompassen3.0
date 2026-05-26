# Theme Pack J — åtta hubb-teman (2026-05-25)

**Status:** Spec + runtime i `themeRegistry.ts` · **Default prod:** oförändrat `I-stone`  
**Preview:** `/dev/themes` · **Auto per hub:** `moduleThemeMap.ts` (när Auto-modul är på)

Bygger på **Theme Pack I** (I-stone, alchemical, skymning, hamn, glass), **G-varm-hamn**, **F/H**-mockups och **COLOR-POLICY** (guld/amber/rose-gold — ingen turkos som global accent).

---

## Översikt — ett tema per nav-hub + widget

| # | ID | Label | Primär hubb(r) | Fyren / hemskärm |
|---|-----|-------|----------------|------------------|
| 1 | `J-fyren-hem` | Fyren Hem | `/` Hem Kompass | W1 kant + WH3 Kompass |
| 2 | `J-valv-pansar` | Valv Pansar | `/dagbok`, `/valv` | WH1 Inspelning (diskret) |
| 3 | `J-planering-fyren` | Planering Fyren | `/planering`, `/projekt` | +Projekt, Kalender, lista |
| 4 | `J-familjen-varm` | Familjen Varm | `/familjen`, `/barnen` | WH5 Familjen snabb rad |
| 5 | `J-hamn-greyrock` | Hamn Grey Rock | `/hamn`, `/speglar` | WH4 Hamn SMS → BIFF |
| 6 | `J-mabra-lavendel` | MåBra Lavendel | `/mabra` | In-app coach (ingen WH) |
| 7 | `J-barnporten-ljus` | Barnporten Ljus | `/barnporten` *(plan)* | CB1–CB4 *(barn, ej förälder-W1)* |
| 8 | `J-vardagen-orbit` | Vardagen Orbit | `/vardagen`, `/arbetsliv`, `/kunskap`, `/kompasser`, `/ekonomi` | WH2 Anteckning |

**Sidomeny (alla):** aktiv rad **guld** — [`MENU-DRAWER-KANON.md`](../references/MENU-DRAWER-KANON.md)  
**Dock:** Familjen · Kompass · Valv — oförändrad triad.

---

## 1 — `J-fyren-hem` (Hem + smart widget)

**Bas:** I-stone · **Känsla:** Scenic obsidian, maximal guld glow på Fyren-kanten.

| Token | Värde |
|-------|--------|
| `--bg` | `#0a0a0a` |
| `--accent` | `#d4af37` |
| `--accent-glow` | `rgba(212, 175, 55, 0.28)` |
| `background` | `texture-stone` |

**Hem:** Kompakt tvåkolumn (mockup `compact/00-hem-kompakt.png`) — kompass L1 + kort höger.  
**Fyren W1:** 3px guld-prick → strip → expanded klocka (som `00-smart-widget-expanded.png`).  
**WH3:** Minimal kompass-check-in, samma tokens.

---

## 2 — `J-valv-pansar` (Valv + tyst inspelning)

**Bas:** F-guld-pansar · **Känsla:** Juridisk tyngd, WORM-banner, tjockare guldrand.

| Token | Värde |
|-------|--------|
| `--bg` | `#080808` |
| `--accent` | `#c9a227` |
| `--border-strong` | `rgba(201, 162, 39, 0.55)` |
| `background` | `texture-stone` |

**Valv:** Mönster + Orkester-flikar — guld only.  
**WH1:** Diskret våg/dot, **ingen** röd REC · expanded = mörk glass + guld titel efter ingest.

---

## 3 — `J-planering-fyren` (Planering + Projekt)

**Bas:** I-alchemical + tactical amber · **Känsla:** Kanban P3 låst, widget v2 kompakt.

| Token | Värde |
|-------|--------|
| `--accent` | `#e8c547` |
| `--accent-secondary` | `#f59e0b` |
| `--compass-disk` | `#1a1510` |
| `background` | `texture-marble` |

**Planering:** todo / waiting / done — guld kolumnrubriker.  
**Widget:** +Projekt, Kalender → `/planering` · mockup `galleri/widget/v2/W1-kompakt-projekt.png`.

---

## 4 — `J-familjen-varm` (Familjen + Barnfokus)

**Bas:** G-varm-hamn · **Känsla:** Espresso, rose-gold, trygg värme.

| Token | Värde |
|-------|--------|
| `--bg` | `#1a1410` |
| `--accent-secondary` | `#c9a87c` |
| `--accent-glow` | `rgba(201, 168, 124, 0.2)` |
| `background` | `texture-stone` |

**Familjen:** Barnfokus-frågor, Middagsfrågan-lås, optimistisk sparning.  
**WH5:** En rad barnfokus → `children_logs` (neutral kategori).

---

## 5 — `J-hamn-greyrock` (Trygg hamn + BIFF)

**Bas:** H-grafit-greyrock · **Känsla:** Max läsbarhet, lågaffektiv, Grey Rock.

| Token | Värde |
|-------|--------|
| `--bg` | `#1c1c1e` |
| `--surface` | `#2c2c2e` |
| `--accent` | `#d4af37` (enda färgaccent) |
| `background` | `texture-stone` |

**Hamn:** Kompis + SMS-triage.  
**WH4:** Klistra SMS → kort BIFF-svar (Speglar/Hamn guard — ej MåBra-bank).

---

## 6 — `J-mabra-lavendel` (MåBra / Vit zon)

**Bas:** I-skymning utan mint · **Känsla:** REFLECTION/PLAY, lavendel-guld (ingen turkos).

| Token | Värde |
|-------|--------|
| `--bg` | `#141018` |
| `--accent` | `#b8a9c9` |
| `--accent-secondary` | `#d4af37` |
| `--accent-light` | `#e8dff5` |
| `background` | `texture-stone` |

**MåBra:** Transformatorn, frågekort från bank (`bankId`).  
**Widget:** Ej WH — coach i modul; Fyren dold eller peek-only på `/mabra`.

---

## 7 — `J-barnporten-ljus` (Barnporten PWA)

**Bas:** G-varm + högre cream-kontrast · **Känsla:** Barn PWA, 2×2 stora kort, förälder-HITL.

| Token | Värde |
|-------|--------|
| `--bg` | `#1e1814` |
| `--text` | `#faf6f0` |
| `--accent` | `#e8c547` |
| `--success` | `#7ba383` |
| `background` | `nautical` (mjuk, ej militär) |

**Barnporten:** Prata · Skriv · Humör · Bara för mig — [`BARNPORTEN-SPEC.md`](../BARNPORTEN-SPEC.md).  
**Widgets CB1–CB4:** Barn-specifika (ej förälderns tyst inspelning W1).

---

## 8 — `J-vardagen-orbit` (Arbetsliv · Kunskap · Kompasser)

**Bas:** I-alchemical · **Känsla:** Orbit-rutiner, kunskapsvalv, ekonomi.

| Token | Värde |
|-------|--------|
| `--bg` | `#050508` |
| `--accent` | `#e8c547` |
| `--accent-light` | `#f5dfa0` |
| `background` | `texture-marble` |

**Vardagen-flikar:** kompasser, kunskap, ekonomi, arbetsliv/stämpla.  
**WH2:** En rad → Valv `widget_anteckning`.

---

## Fyren Widget Bar (gemensamt beteende)

Alla J-teman delar **W1**-gestaltning från [`WIDGET-BAR-SPEC.md`](../WIDGET-BAR-SPEC.md):

| Gest | Beteende |
|------|----------|
| Kollapsad | 3px prick — färg = `--accent` per tema |
| Enkeltryck | Vertikal strip (guldikoner) |
| Dubbeltryck | Tyst inspelning start/stopp |
| Long-press 3s | Fyren → Valv |

**Tema-specifik strip:** `J-fyren-hem` starkast glow · `J-hamn-greyrock` tunnast (1px känsla) · `J-valv-pansar` bredare peek för WH1.

---

## Hemskärms-widgets (WH) — tema-default

| WH | Route | Rekommenderat J-tema |
|----|-------|----------------------|
| WH1 Inspelning | `/widget/inspelning` | `J-valv-pansar` |
| WH2 Anteckning | `/widget/anteckning` | `J-vardagen-orbit` |
| WH3 Kompass | `/widget/kompass` | `J-fyren-hem` |
| WH4 Hamn | `/widget/hamn` | `J-hamn-greyrock` |
| WH5 Familjen | `/widget/familjen` | `J-familjen-varm` |

Vid öppning från PWA-genväg: `resolveThemeForPath` + ev. query `?theme=` (P2).

---

## Implementation

```text
src/modules/core/theme/themeRegistry.ts   ← 8× ThemePack
src/modules/core/theme/moduleThemeMap.ts  ← auto per prefix
docs/design/themes/THEME-COMPARISON.md    ← tabell
```

**Godkännande prod:** Skriv `GODKÄND: J-<id>` i [`theme-lab/VARIANTS.md`](../theme-lab/VARIANTS.md) — byt inte `DEFAULT_THEME_ID` utan explicit OK.

---

## Oförändrat (alla J-teman)

- Locked UX: Barnfokus, Valv Mönster/Orkester, Planering P3 Kanban
- Ingen natur-tapet · ingen turkos aktiv meny-rad
- WORM / Kill switch / Zero Footprint
