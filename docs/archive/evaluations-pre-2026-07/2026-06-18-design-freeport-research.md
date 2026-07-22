# Design Freeport — Research syntes (SLUTGILTIG)

**Datum:** 2026-06-18 | **Status:** ✅ 5/5 prompter klara

---

## Executive summary

Research pekar entydigt mot **en navigationsmodell**, **ett UI-mönster**, **en estetik** och **ett evolutionssätt** — alla kompatibla med befintlig kod och budget (GRATIS/LÅG).

| Beslut | Rekommendation | Källa |
|--------|----------------|-------|
| Navigation | Modell A: Hem → zon → kort → chameleon (max 2 klick) | P1 |
| UI-mönster | Chameleon Supermodule + max 12 stressfiltrerade kort | P1, P2 |
| Estetik sandbox | **B** Varm koppar eller **C** Neutral krom (ej låst guld) | P3 |
| Hub-mall | Planering behåller 8 layouter; övriga zoner 3–5 | P4 |
| Evolution | Rotation utan streaks; koppla evolution_hub | P5 |

**Nästa steg:** Bygg `/dev/design-freeport` med Modell A + estetik B/C + riktiga InputModes.

---

## 1. Navigation (P1 Sonnet)

- **Modell A** (vertikal zonlista + upptäcktskort) — första val
- **DEFER:** B (modal), C (swipe)
- Valv/Barnlogg: dolda, långtryck + PIN, dämpad ikon

---

## 2. Chameleon Supermodule (P2 GPT — korrigerad)

### Fem regler
1. Konsekvent position
2. Seamless mode-byte (ingen sidladdning)
3. Zon-specifikt — ingen cross-import
4. Kort → rätt mode i samma modul
5. evolution_hub döljer modes vid låg kapacitet

### Modes (från KOD, inte GPT)
| Zon | Primära modes |
|-----|---------------|
| Hjärtat | reflektion, quick_mirror, arkiv |
| MåBra | checkin, vit_card, reflection_tool, emotional_memory |
| Familjen | barnfokus, livslogg_stund, fysiologi, inkast |
| Planering | task_quick, inkast, quick_list (+ hub-moduler) |

### Visuellt mode-byte
- Morph/fade 300–400 ms (P2 + P3)
- Opacitet/färgskiftning, ingen slide/zoom

---

## 3. Tactile Mid-Depth (P3 Gemini)

| ID | Profil | Accent | Test i freeport |
|----|--------|--------|-----------------|
| A | Kall glass | #4A90E2 | `tactile-cold` |
| **B** | **Varm koppar** | **#B36B3E** | **`tactile-warm` ⭐** |
| C | Neutral krom | #7D8A99 | `tactile-chrome` |

Gör: tokens, glas sparsamt, 2–3 färger, hörn 8–14px  
Gör inte: platt bento, neon, hårda animationer

---

## 4. Planering som mall (P4 Opus v2)

### Generiska modultyper (återanvänd skal)
Lista · Anteckning · Nedräkning/Timer · Innehållsflöde · Fokustavla · Kanban (P3 låst endast Planering)

### Layouter per app-zon
| Zon | Antal | Källa |
|-----|-------|-------|
| Planering | 8 | `planeringHubLayouts.ts` — KLAR |
| Hjärtat | 3–4 | NY sandbox |
| MåBra | 3–4 | NY sandbox |
| Familjen | 3–4 | NY sandbox |

---

## 5. Evolution utan gamification (P5 Grok)

### Kortrotation (implementera i HemV3DevelopmentRail)
1. Tematisk
2. Tidsbaserad (morgon/kväll)
3. Kontext + slump
4. Fördjupning (grund → mer, utan krav)
5. Användarstyrd

### Nytt läge
- Neutral intro, ingen badge/blink
- «Annan vy» — inte utmaning

### Koppling kod
- `evolution_hub` + `isLowHomeCapacity` + `filterDevelopmentCardsForPreset`
- `evolution_ledger` dual-write (Fas 19.5) vid mode-val

---

## Konsensus — Top 5 för freeport (prioritet)

1. **Modell A** navigation + chameleon shell
2. **Estetik B** (varm koppar) som default sandbox-tema
3. **Stressfiltrerade kort** (max 12, evolution_hub)
4. **Planering hub** som demo + MåBra som första nya zon-prototyp
5. **Kortrotation** tidsbaserad + kapacitetsfiltrerad

---

## Explicit NEJ-lista

| Förslag | Varför |
|---------|--------|
| GPT mode-listor (stress/sömn/träning) | Fel zon/kategori |
| Opus «zoner» Inkorg/Tid/Projekt | Fel abstraktionsnivå |
| Modal-nav (B) | Overlay-stress |
| Swipe-zon (C) | Rumslig desorientering |
| Streak/XP/badges | P5 + kanon |
| Vibration/ljud mode-byte | DEFER — arousal-risk |
| Ändra P3 Kanban | Locked UX |

---

## Budget

| Prioritet | Kostnad | Vad |
|-----------|---------|-----|
| Freeport scaffold | GRATIS | CSS, sandbox routes, chameleon UI |
| Kortrotation klient | GRATIS | HemV3DevelopmentRail logik |
| evolution_ledger log | LÅG | Dual-write Fas 19.5 |
| Ny callable/Vector | MEDEL/HÖG | Kräver Pontus-OK |

---

## Filer

- Råsvar: `docs/evaluations/research-raw/`
- Backlog: `docs/evaluations/DESIGN-FREEPORT-IMPROVEMENT-BACKLOG.md`
- Spec: `docs/design/CHAMELEON-SUPERMODULE-SPEC.md`
- Prompter: `docs/prompts/DESIGN-FREEPORT-RESEARCH-PACK.md`
