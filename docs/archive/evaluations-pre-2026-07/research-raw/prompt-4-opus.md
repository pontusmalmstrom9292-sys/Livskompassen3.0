# Prompt 4 — Planering som mall

**Modell:** Claude Opus 4.8  
**Status:** ✅ Klar (v2 — bättre än v1)  
**Datum:** 2026-06-18

---

## Råsvar v2 (Opus omkörning)

### Utgångspunkt (korrekt)
- Planering: 8 layouter, moduler handling/projekt/anteckning/inköp/tid/inkorg/fokus
- Flexibla listor, anteckningar, nedräkning i olika stilar
- P3 Kanban låst
- Varje zon egen kategori — ingen blandning

### 1. Generiska modultyper (BRA — behåll)

| Modultyp | Beskrivning |
|----------|-------------|
| Lista | Punktlista, numrerad, kollapsbar |
| Anteckning | Text + formatering/bilagor |
| Nedräkning/Timer | Nedräkning eller tidsspårning |
| Status/Kanban | P3 låst där den finns |
| Innehållsflöde | Händelser/uppdateringar i zonen |
| Fokustavla/Översikt | Widgets för snabba åtgärder |

### 2. Layout picker (BRA)
- 3–5 layouter per zon
- Lista, modulär grid, kombination, komprimerad fokus-vy

### 3. Tabell zoner (DELVIS FEL)
Opus listar fortfarande Planering-underområden som «zoner»:
Planering, Projekt, Inköp, Tid, Inkorg — **inte** Hjärtat/MåBra/Familjen.

### 4. P3 Kanban (BRA)
- Oförändrad i Planering
- Andra moduler flexibla runt omkring
- Zoner utan Kanban: status-layouter som inte är låsta
- Tydliggör vad som är låst vs anpassningsbart

---

## Jämförelse v1 vs v2

| Aspekt | v1 | v2 |
|--------|----|----|
| Förstår 8 Planering-layouter | Nej | Ja ✅ |
| Generiska modultyper | Per fel «zon» | Abstrakt tabell ✅ |
| App-zoner (Hjärtat/MåBra/Familjen) | Nej | Nej ❌ |
| P3-lås förklarat | Delvis | Tydligare ✅ |
| Layout antal | 2–4 per fel zon | 3–5 ✅ |

**Slutsats:** v2 är **bättre** — behåll modultyper + layout picker + P3-regler. Ignorera zon-tabellen; använd Cursor-korrigering nedan.

---

## Cursor-korrigering — modultyper → app-zoner

| Modultyp | Planering | Hjärtat | MåBra | Familjen |
|----------|-----------|---------|-------|----------|
| Lista | inkop, priolista | — | — | vardagsstruktur |
| Anteckning | anteckning | reflektion | exercise_note | — |
| Nedräkning/Timer | deadline, tidtagning | — | — | livslogg_stund |
| Status/Kanban | handling (P3 LÅST) | — | — | — |
| Innehållsflöde | inkorg | arkiv | emotional_memory | livslogg_observation |
| Fokustavla | fokus, mikrofokus | quick_mirror | checkin, vit_card | barnfokus |

### Layout picker (app-zoner)

| App-zon | Layouter | Antal |
|---------|----------|-------|
| Planering | 8 befintliga (planeringHubLayouts.ts) | 8 |
| Hjärtat | minimal, list, sections, orbit | 3–4 |
| MåBra | grid, strip, minimal, pelare | 3–4 |
| Familjen | navigator, list, bento | 3–4 |
