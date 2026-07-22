# Design Freeport — Improvement Backlog

**Regel:** Inget förslag ignoreras.

| ID | Källa | Förslag | Typ | Silo OK? | Kostnad | Flow-alt? | Risk | Status |
|----|-------|---------|-----|----------|---------|-----------|------|--------|
| FP-001 | P1 Sonnet | Hem som zon-nav (3 zoner) + upptäcktskort → supermodul-läge, max 2 klick | UI/IA | Ja | GRATIS | — | Låg | IDÉ |
| FP-002 | P1 Sonnet | Modell A: vertikal zonlista + kort i huvudvy (standardnav) | UI/IA | Ja | GRATIS | — | Låg | IDÉ |
| FP-003 | P1 Sonnet | Max 12 kort per zon, filtrerade efter stress (evolution_hub) | Evolution | Ja | LÅG | Klient | Låg | IDÉ |
| FP-004 | P1 Sonnet | Chameleon supermodul — byt läge in-place, inga sidbyten | Modul | Ja | GRATIS | — | Låg | IDÉ |
| FP-005 | P1 Sonnet | Progressiv disclosure i supermodul (visa enkelt först) | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-006 | P1 Sonnet | Valv/Barnlogg dolda — långtryck/dubbeltryck + PIN | Säkerhet/UX | Ja | GRATIS | — | Låg | IDÉ |
| FP-007 | P1 Sonnet | Dämpad låsikon i Familjen eller «Fler funktioner» | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-008 | P1 Sonnet | Modell B: bottom nav + modal — **DEFER** (risk overlay) | UI/IA | Ja | GRATIS | — | Medel | DEFER |
| FP-010 | P2 GPT | Fem chameleon-regler (position, seamless, zon-spec, kort-nav, evolution) | Modul | Ja | GRATIS | — | Låg | IDÉ |
| FP-011 | P2 GPT | Mode-byte: morph/fade 300–400 ms, mild kontrast, shell står still | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-012 | P2 GPT | Självlärande: prioritera modes utan poäng + användar-transparens | Evolution | Ja | LÅG | Klient | Låg | IDÉ |
| FP-013 | P2 GPT | Vibration/ljud vid mode-byte | UI | Ja | GRATIS | — | Medel | DEFER |
| FP-014 | P2 GPT | GPT mode-listor (stress/sömn/träning…) — **NEJ**, använd *InputModes.ts | — | — | — | — | Hög | REJECTED |
| FP-016 | P3 Gemini | Riktning A — kall Obsidian glass (#4A90E2 accent) | Design | Ja | GRATIS | — | Låg | IDÉ |
| FP-017 | P3 Gemini | Riktning B — varm koppar (#B36B3E, ej guld) | Design | Ja | GRATIS | — | Låg | IDÉ |
| FP-018 | P3 Gemini | Riktning C — neutral krom (#7D8A99) | Design | Ja | GRATIS | — | Låg | IDÉ |
| FP-019 | P3 Gemini | Mode-byte via opacitet/färgskiftning (ingen slide/zoom) | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-020 | P3 Gemini | Delade design tokens för alla hub-layouter | Design | Ja | GRATIS | — | Låg | IDÉ |
| FP-021 | P3 Gemini | Max 2–3 färger, hörn 8–14px, inga >16px | Design | Ja | GRATIS | — | Låg | IDÉ |
| FP-023 | P4 Opus | Generiska modultyper: lista, anteckning, tid, inkast, fokus, reflektion | Modul | Ja | GRATIS | — | Låg | IDÉ |
| FP-024 | P4 Opus | 3–4 layouter per app-zon (Planering behåller 8) | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-025 | P4 Opus | Layout picker UI per zon (som HubLabPage) | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-026 | P4 Opus | P3 Kanban låst endast Planering — andra zoner utan Kanban | UX | Ja | GRATIS | — | Låg | IDÉ |
| FP-027 | P4 Opus | Opus zon-lista (Inkorg/Tid/Fokus) — **REJECTED**, fel abstraktionsnivå | — | — | — | — | Hög | REJECTED |
| FP-029 | P4 Opus v2 | Modultyper: Lista, Anteckning, Timer, Innehållsflöde, Fokustavla | Modul | Ja | GRATIS | — | Låg | IDÉ |
| FP-030 | P4 Opus v2 | 3–5 layouter/zon: lista, grid, kombination, fokus-kompakt | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-031 | P4 Opus v2 | UI-markering: vad är låst (P3) vs anpassningsbart | UX | Ja | GRATIS | — | Låg | IDÉ |
| FP-028 | P4+Kod | Porta planeringHubLayouts-mönster till Hjärtat/MåBra/Familjen sandbox | Modul | Ja | GRATIS | — | Låg | IDÉ |
| FP-022 | P3 Gemini | Merriweather serif i B — testa mot Cinzel i sandbox | Design | Ja | GRATIS | — | Låg | IDÉ |
| FP-015 | P2+Kod | Mappa chameleon till dagbokInputModes + familjenInputModes + MåBra | Modul | Ja | GRATIS | — | Låg | IDÉ |
| FP-009 | P1 Sonnet | Modell C: swipe-zonbyte — **DEFER** (rumslig orientering) | UI/IA | Ja | GRATIS | — | Medel | DEFER |

| FP-032 | P5 Grok | Kortrotation: tematisk, tidsbaserad, kontext, fördjupning, användarstyrd | Evolution | Ja | GRATIS | Klient | Låg | IDÉ |
| FP-033 | P5 Grok | Nytt läge: neutral intro, ingen badge/blink | UX | Ja | GRATIS | — | Låg | IDÉ |
| FP-034 | P5 Grok | Mognadsanpassning vuxen (parallell Barnporten brackets) | Evolution | Ja | LÅG | evolution_hub | Medel | IDÉ |
| FP-035 | P5 Grok | Lågmäld feedback: belysning/skugga, ej kvantifierat | UI | Ja | GRATIS | — | Låg | IDÉ |
| FP-036 | P5+Kod | Wire rotation till HemV3DevelopmentRail + lifeHubPresets | Evolution | Ja | LÅG | Befintlig | Låg | IDÉ |

### Kostnadsklasser
- **GRATIS** — frontend/CSS, befintlig Firestore
- **LÅG** — befintlig callable, evolution_hub-läsning
- **MEDEL/HÖG** — kräver Pontus-OK

### Status
`IDÉ` → `SANDBOX` → `VERIFIED` → `PMIR` → `DONE` / `DEFER`
