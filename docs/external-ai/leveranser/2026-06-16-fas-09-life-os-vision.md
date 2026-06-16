# Fas 09 — Life OS vision (gap + wave-2 wireframes)

**Datum:** 2026-06-16  
**Källor:** `chatbot-pack-life-os-vision.md`, `gap-matrix-2026-06-16.md`, GPT-mockup PNG  
**Modell:** Opus 4.8 (ChatBox) · syntetiserad i Cursor  
**PHASE-09:** Klar — [steg1](./2026-06-16-fas-09-gap-steg1.md) · [steg2](./2026-06-16-fas-09-gap-steg2-wave2-polish.md) · [steg3](./2026-06-16-fas-09-gap-steg3-leverans.md)

---

## Sammanfattning

~85 % av GPT Life OS-arkitekturen finns redan i repo. Gapet är polish, routing-hygien (Våg 3) och tokenisering — inte plattformsbyte.

---

## KEEP (lås)

- 4 zoner + Fyren bakgrundsmotor (ej femte dock-tab)
- InputSuperModule-mönster (7 hubs)
- Obsidian `#020617`–`#050b14`, guld `#d4af37`, Cinzel hub-rubriker
- P3 Kanban, Valv B1, tre silos, Barnfokus, Hamn BIFF

---

## BUILD (ordning)

| # | Våg | Status 2026-06-16 |
|---|-----|-------------------|
| 1 | Nav H1–H4 | **Implementerad** — se [`2026-06-16-nav-vag3-pmir.md`](../../evaluations/2026-06-16-nav-vag3-pmir.md) |
| 2 | Fas 19.3 hex→tokens | **Våg 1 klar** — hub zon-tokens i `index.css` |
| 3 | Supermodule wave-2 polish | **Påbörjad** — `.supermodule-hub-chrome` |
| 4 | Upload unified steg 2 | WIP |
| 5 | Life OS copy-loop (Start→Reflect) | SPEC defer |

---

## DEFER

- Hem `/` → Hjärtat merge
- Fyren global kapacitetsmotor
- M3.0-C Fitness/Näring
- Flutter/RN

---

## REJECT

- Teal/indigo som primär chrome
- 5-tab bottom nav
- Cross-RAG, streak/XP

---

## Wave-2 wireframes (text — per zon)

### B2 Hjärtat

- Hub: `DagbokInputSuperModule` — eyebrow «Universal Input», mode-picker ovanför viewport
- Speglar: separat flik, Zero Footprint copy synlig
- Polish: `border-border`, `bg-surface-2/70`, max-h viewport scroll island

### B3 Familjen

- `FamiljenInputSuperModule` — od-depth chrome med token-border (ej hårdkodad rgba)
- Barnfokus-delegate oförändrad (locked §12)

### B4 Vardagen

- MåBra/Ekonomi/Planering/Arbetsliv — enhetlig `calm-card` + glow per silo
- Ekonomi nås endast via `/vardagen?tab=ekonomi` efter Våg 3

### B1 Valv

- **LOCK** — endast visuell förfining med explicit snapshot

---

## Nästa CHECKPOINT

1. Fas 19.3 hex→tokens (BUILD #2)  
2. Supermodule wave-2b polish enligt [steg2](./2026-06-16-fas-09-gap-steg2-wave2-polish.md) — **ej** REJECT-rader (teal gradient, D1-rotation)  
3. Theme Lab granskning (ingen prod-deploy utan VARIANTS.md)  
4. `LIFE-OS-BUILD-STATE` uppdatera efter tokens PASS
