# Inkorg — Dagens frågekort (Valvet) + Känslokompassen

**Status:** **Analyserad** — lås intent **behålls**, bygg ut (F-V10)  
**Datum:** 2026-05-23  
**Källa:** Användare (skärmdumpar + chatt)  
**Skärmdumpar:** [`artifacts/screenshots-inkorg-2026-05-23/17-fragekort-valvet-baksida.png`](./artifacts/screenshots-inkorg-2026-05-23/17-fragekort-valvet-baksida.png) · [`18-fragekort-valvet-framsida.png`](./artifacts/screenshots-inkorg-2026-05-23/18-fragekort-valvet-framsida.png)

---

## Användarens intent

> Frågekort som ger **nya och spännande frågor** från Valvet. Funktionen ska **låsas** (krav) men **byggas ut** (implementation efter analys).

---

## Skärmindex

| # | Fil | Vy |
|---|-----|-----|
| 17 | `17-fragekort-valvet-baksida.png` | Kort baksida — hjärnikon, **TRYCK FÖR ATT VÄNDA** |
| 18 | `18-fragekort-valvet-framsida.png` | Kort framsida — dagens reflektionsfråga + refresh-ikon |

**Exempelfråga (skärmdump):** *"Vilken liten sak gjorde dig stolt över dig själv idag, oavsett hur obetydlig den verkar?"*

---

## UI-sektioner (mock)

| Sektion | Innehåll | Beteende |
|---------|----------|----------|
| **KÄNSLOKOMPASSEN** | Tre val: TUNGT / OKEJ / BRA (ansiktsikoner) | Snabb humörmarkering före/efter kort |
| **DAGENS FRÅGEKORT** | Vändbart kort, lila accent, refresh | Tap = vänd; refresh = ny fråga |
| **KOGNITIVA LEKAR** | Lista (t.ex. 5-4-3-2-1 Grounding, Perspektiv-Skiftet) | GO-knapp → övning |

**Design (mock):** mörk lila/navy — **ej låst**. Repo: **Obsidian Calm** (`design-master.md`).

---

## Utkast funktionslås (F-V10 — väntar specialistpass)

| ID | Krav | Detalj |
|----|------|--------|
| F-V10.1 | Dagligt frågekort | Minst en reflektionsfråga per dag; roterande pool — **nya** frågor över tid |
| F-V10.2 | Vänd-interaktion | Baksida neutral (ingen fråga synlig); framsida visar fråga efter explicit tap (progressive disclosure) |
| F-V10.3 | Ny fråga | Refresh utan att tvinga svar; sparar **inte** automatiskt WORM |
| F-V10.4 | Känslokompassen | Valfritt humör (TUNGT/OKEJ/BRA) kopplat till samma session — **ingen** prestationsgraf |
| F-V10.5 | Kognitiva lekar | Länk/lista till befintliga övningar (`GroundingExercise`, Måbra) — **inte** ny monolit |
| F-V10.6 | Silo | Frågekort = **reflektion** (Lager 1 / yttre lugnet) om frågorna är helande; **inte** blandat med forensisk valv-copy på samma vy utan Fyren |

**Öppen fråga (analys):** Användaren säger *"från Valvet"* — specialist ska avgöra om kortet sitter på `/dagbok?tab=reflektion`, `/mabra`, eller efter Fyren under Bevis. Se [`ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md).

---

## Snabb GAP mot repo (ej verifierad — analyskö)

| Mock | Repo idag | Label |
|------|-----------|-------|
| Dagens frågekort + flip | Ingen dedikerad komponent | **GAP** |
| Frågepool / rotering | Delvis `AdaptiveMemoryCards`, KASAM | **DELVIS** |
| Känslokompassen 3-val | Humör i dagbok/Måbra — annat UI | **DELVIS** |
| 5-4-3-2-1 Grounding | `GroundingExercise.tsx` | **PASS** |
| Refresh ny fråga | — | **GAP** |

---

## Relaterat

- Master-inkorg: [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)
- Yttre lugnet / Valv: [`ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md)
- Valv-spec: [`Verklighetsvalvet-SPEC.md`](../specs/modules/Verklighetsvalvet-SPEC.md)

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll** | F-V10.1–F-V10.6, bild 17–18, alla krav i tabellen ovan |
| **Placering låst** | **Lager 1 → `/mabra`** (ej Valv `bevis`) — se [`2026-05-23-UX-navigation-analys.md`](./2026-05-23-UX-navigation-analys.md) § F-V10 |
| **PASS** | `GroundingExercise.tsx:9` |
| **GAP** | Flip-kort, känslokompass 3-val, frågepool + refresh |

**Nästa bygg:** P0 #6 i analys — komponent under Måbra + Obsidian Calm (ej lila mock).
