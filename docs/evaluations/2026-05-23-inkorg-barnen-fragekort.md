# Inkorg — Barnen: slumpade frågor → svar → låst logg

**Status:** **Analyserad** — F-B11 **behålls**, bygg ut  
**Datum:** 2026-05-23 (skärmdump korrigerad samma dag)  
**Källa:** Användare (skärmdump + chatt)  
**Skärmdump:** [`artifacts/screenshots-inkorg-2026-05-23/19-barnen-livsloggar-fragekort.png`](./artifacts/screenshots-inkorg-2026-05-23/19-barnen-livsloggar-fragekort.png)  
**Modul:** `/familjen` · `children_logs` · [`Barnen-SPEC.md`](../specs/modules/Barnen-SPEC.md)

**Korrigering:** Fel bild (Valv Svart på Vitt) borttagen — ersatt med **Barnens Livs-Loggar**-mock.

---

## Användarens intent

> Frågor till barnen i deras loggar/modul. Funktionen ska **låsas** men **byggas ut**: **slumpa fram olika frågor**, skriva in **svar**, sedan **låsa/spara** i permanent minne.

---

## Skärmdump — Barnens Livs-Loggar (kanonisk mock)

| UI-del | Innehåll |
|--------|----------|
| Header | **MODUL · Barnens Livs-Loggar** (baby-ikon) |
| Barnval | **Arvid** \| **Kasper** (aktiv) |
| Kategori-chips | Vitals · Citat · Milstolpe · **Lek** (aktiv) |
| Frågekort | Etikett t.ex. **DAGENS MIDDAGSFRÅGA** + kursiv fråga |
| Exempelfråga | *"Om du fick bygga ett hus av vilken mat som helst, vad skulle du bygga det av?"* |
| Svarsfält | Placeholder: *"Logga ett roligt svar eller en lek ni gjorde idag…"* |
| Spara | **+ Spara till Kaspers logg** (dynamisk copy per valt barn) |

**Design (mock):** mörk + lila accent — **ej låst**. Repo: **Obsidian Calm** + Barnen-tokens (`Barnen-SPEC` §4).

---

## Utkast funktionslås (F-B11 — väntar specialistpass)

| ID | Krav | Detalj |
|----|------|--------|
| F-B11.1 | Frågepool | Slumpad/roterande fråga; etikett kan vara kontextuell (t.ex. middagsfråga) — pool per kategori-chip eller global |
| F-B11.2 | Barnval | **Arvid** / **Kasper** — fråga + sparning bunden till `childAlias`; sparaknapp visar barnnamn |
| F-B11.3 | Kategori-chips | Vitals, Citat, Milstolpe, Lek — mappas mot `LIVSLOGG_CATEGORIES` eller utökad enum |
| F-B11.4 | Svarsfält | Ett textfält under frågekortet |
| F-B11.5 | Lås vid spara | **Spara** → WORM `children_logs` — ingen redigering efteråt |
| F-B11.6 | Ton | Neutral, glada vardagsögonblick — **ingen** vuxenkonflikt i standardfrågor |
| F-B11.7 | Ny fråga | Ny slump utan att skriva över osparad text (bekräftelse vid behov) |

---

## Silo — viktigt (användaren sa "kunskap")

| Användarens ord | Korrekt arkitektur (kanon) |
|-----------------|----------------------------|
| "låsa in i kunskap" | **Permanent minne** = `children_logs` (Barnen-silo), WORM append-only |
| **Ej** automatiskt | `kampspar` / `kb_docs` (Kunskapsvalvet) — **MUST NOT** blanda silor |

Se [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) § Tre kunskapsytor.

---

## Relation till övrig inkorg

| Relaterat | Koppling |
|-----------|----------|
| F-04–F-06 (Gemini dashboard) | Barnprofilkort, minnesankare |
| F-V10 (vuxen frågekort) | **Separat** frågepool — inte barnfrågor |

---

## Snabb GAP mot repo (ej verifierad — analyskö)

| Krav | Repo idag | Label |
|------|-----------|-------|
| Frågekort + etikett | — | **GAP** |
| Slumpad fråga | — | **GAP** |
| Kategori-chips Lek/Vitals/… | Delvis `LIVSLOGG_CATEGORIES` | **DELVIS** |
| Spara WORM per barn | `BarnensPage` livslogg | **DELVIS** |
| Dynamisk "Spara till X logg" | — | **GAP** |

---

## Relaterat

- **Barnfokus profilkort (kod):** [`2026-05-23-inkorg-barnfokus-profiler.md`](./2026-05-23-inkorg-barnfokus-profiler.md) → [`gemini-child-focus-ChildFocus.tsx`](./artifacts/gemini-child-focus-ChildFocus.tsx)  
- Master-inkorg: [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)  
- Vuxen frågekort: [`2026-05-23-inkorg-fragekort-valvet.md`](./2026-05-23-inkorg-fragekort-valvet.md)

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll** | F-B11.1–F-B11.7, bild 19, silo `children_logs` (ej Kunskap) |
| **PASS** | Barnval, WORM — `BarnensPage.tsx:49`, `firestore.rules:49-52` |
| **GAP** | Frågepool, slump, mock-chips (utöka `LIVSLOGG_CATEGORIES`, ta inte bort befintliga) |
| **DELVIS** | `ChildSubLogPanel` → lägg frågekort ovanför fält |

**Nästa bygg:** P0 #3 i [`2026-05-23-UX-navigation-analys.md`](./2026-05-23-UX-navigation-analys.md).
