# TACTILE INSPIRATION — Specialist Research Pack

**Syfte:** Samla idéer, för-/nackdelar och funktionsförslag från **specialister** — utan att låsa frontend.  
**Sandbox:** `/dev/design-freeport` · prod orörd tills PMIR + ditt OK.

| Steg | Vad du gör |
|------|------------|
| 1 | Välj prompt (specialist eller öppen inspiration) |
| 2 | Kör i Cursor subagent **eller** klistra i extern modell |
| 3 | Spara svar i `docs/evaluations/research-raw/tactile-inspiration/` |
| 4 | När klart — säg till i Cursor: «syntes tactile inspiration» |

---

## Regler (viktigt)

| Gäller | Låst? |
|--------|-------|
| **Estetik, 3D, layout, animation, typografi** i `/dev/*` | **NEJ — öppet** |
| WORM, tre silos, Valv PIN, locked UX-flöden | **JA** |
| Gamification (streak, XP) | **NEJ** |
| Prod-wire utan smoke + PMIR | **NEJ** |

**Inget förslag ignoreras.** Allt → `TACTILE-INSPIRATION-BACKLOG.md` med status `IDÉ`.

---

## Filer

```
docs/
├── prompts/
│   └── TACTILE-INSPIRATION-SPECIALIST-RESEARCH-PACK.md   ← DU ÄR HÄR
├── evaluations/
│   ├── 2026-06-18-tactile-inspiration-research.md   (syntes — fylls av agent)
│   ├── TACTILE-INSPIRATION-BACKLOG.md
│   └── research-raw/tactile-inspiration/
│       ├── README.md
│       ├── S1-theme-lab.md
│       ├── S2-ux-guardian.md
│       ├── S3-hjartat-inkast.md
│       ├── S4-vardagen.md
│       ├── S5-familjen-hamn.md
│       ├── S6-mabra-curator.md
│       ├── S7-security-auditor.md
│       ├── S8-master-architect.md
│       ├── S9-open-inspiration-gemini.md      (valfri — ren moodboard)
│       └── S10-open-inspiration-opus.md         (valfri — struktur + tokens)
```

---

## Specialistmatris

| ID | Specialist / modell | Fokus | Spara i |
|----|---------------------|-------|---------|
| S1 | `specialist-theme-lab` | 3D, Tactile Mid-Depth, material, tokens | `S1-theme-lab.md` |
| S2 | `specialist-ux-guardian` | Locked UX vs fri sandbox, IA | `S2-ux-guardian.md` |
| S3 | `specialist-hjartat-inkast-builder` | Hjärtat chameleon + inkast i djup UI | `S3-hjartat-inkast.md` |
| S4 | `specialist-vardagen-builder` | Planering-mall, hub-layouter, MåBra | `S4-vardagen.md` |
| S5 | `specialist-familjen-hamn-builder` | Barnfokus, Hamn, Familjen-zon | `S5-familjen-hamn.md` |
| S6 | `specialist-mabra-curator` | Innehåll i rikare UI utan fluff | `S6-mabra-curator.md` |
| S7 | `specialist-security-auditor` | Deniability + Valv i ny chrome | `S7-security-auditor.md` |
| S8 | `livskompassen-master-architect` | Budget, feasibility, prioritering | `S8-master-architect.md` |
| S9 | Gemini 3.1 Pro (valfri) | **Öppen** visuell inspiration, inga lås | `S9-open-inspiration-gemini.md` |
| S10 | Opus 4.8 (valfri) | Öppen inspiration → token-tabell | `S10-open-inspiration-opus.md` |

**Kör S1–S8 först.** S9–S10 när du vill ren moodboard utan projektfakta.

---

## S1 — Theme Lab (`specialist-theme-lab`)

```
ROLL: specialist-theme-lab — UI-designer för «Tactile Mid-Depth» (mellan platt bento och game UI).

KONTEKST:
1. Livskompassen v2 — React PWA, mörk bas, ADHD/GAD, låg visuell arousal.
2. Prod idag: Obsidian Calm + guld — användaren vill testa **mer 3D, fylligare, snyggare** i sandbox.
3. Freeport finns: `/dev/design-freeport` med varm koppar, krom, kall glas.
4. Referens: Obsidian Depth v1/v2, Planering 8 hub-layouter, Hem v3 kort.
5. Vi låser INTE frontend i sandbox — prod orörd.
6. Ingen neon, regnbåge, streak/XP.
7. Chameleon supermodul: mode-byte in-place, morph ~350ms.

UPPGIFT:
1. Beskriv **3–5 konkreta visuella riktningar** (namn, accent, skugga, glas, typografi, hörn 8–16px).
2. För varje riktning: **3 för** + **3 nackdelar** för ADHD-hypervigilans.
3. Hur ska **supermodulen** kännas taktil (djup, kant, hover) utan animation overload?
4. Föreslå **delade CSS-tokens** (`--fp-*` eller nytt `--tk-*`) som alla hub-layouter kan dela.
5. Ge **2 ASCII-wireframes** (Hem v3 + chameleon) — valfritt.

BEGRÄNSNINGAR:
- Endast sandbox `/dev/*` tills godkännande.
- Bryt inte WORM/silo — detta är ren UI.

OUTPUT-FORMAT: Svenska, tabeller + numrerade listor, max 1000 ord.
OSÄKERHET: «OSÄKER:» + vad som behöver verifieras.
SPECIALIST-TAGG: FP-TI-S1
```

---

## S2 — UX Guardian (`specialist-ux-guardian`)

```
ROLL: specialist-ux-guardian — granskar vad som är LÅST vs vad vi fritt får experimentera med.

KONTEKST:
1. Locked UX: Barnfokus, Valv Mönster/Orkester, Planering P3 Kanban, Fyren widget, Barnporten HITL.
2. Mål: ny 3D/taktil estetik + färre flikar — **utan** att ta bort sacred flows.
3. Design Freeport + Chameleon spec finns i repo.
4. Modell A: Hem → zon → kort → supermodul (max 2 klick).

UPPGIFT:
1. Lista **vad som MÅSTE bevaras** (funktionellt) vs **vad som får bytas** (chrome, färg, layout).
2. Föreslå **3 sätt** att dölja/visa Valv och Barnlogg i ny navigation utan brus.
3. Risker om vi byter bottennav/Fyren i sandbox — och hur vi testar säkert.
4. Minst **5 idéer** för färre sidor med chameleon — med för/nackdel vardera.

BEGRÄNSNINGAR:
- Radera inte locked flows; föreslå sandbox-alternativ först.
- Ingen prod-wire i förslagen.

OUTPUT-FORMAT: Svenska, tabell «Låst | Fri», max 900 ord.
OSÄKERHET: markera «OSÄKER:».
SPECIALIST-TAGG: FP-TI-S2
```

---

## S3 — Hjärtat + Inkast (`specialist-hjartat-inkast-builder`)

```
ROLL: specialist-hjartat-inkast-builder — Hjärtat (dagbok, speglar, arkiv) + Smart Inkast.

KONTEKST:
1. Modes: reflektion, quick_mirror, arkiv (`dagbokInputModes.ts`).
2. Inkast: DCAP före LLM, manuell routing, Zero Footprint där det gäller.
3. Chameleon: en yta, byte delegate in-place.
4. Användaren vill **fylligare 3D UI** i sandbox — inte platt bento.

UPPGIFT:
1. Skissa **Hjärtat-hub** med 3–4 layouter (som Planering har 8) — beskriv moduler per layout.
2. Hur ska **Inkast** synas i samma chameleon utan att kännas som «ännu en flik»?
3. Speglar: hur presentera Zero Footprint-visuellt i taktil UI?
4. Minst **4 funktionsidéer** med för/nackdel + kostnad (GRATIS/LÅG/MEDEL).

BEGRÄNSNINGAR:
- Ingen cross-RAG. Speglar utan persistent RAG.
- WORM journal oförändrat.

OUTPUT-FORMAT: Svenska, tabell layouter, max 900 ord.
SPECIALIST-TAGG: FP-TI-S3
```

---

## S4 — Vardagen (`specialist-vardagen-builder`)

```
ROLL: specialist-vardagen-builder — Planering, MåBra, Ekonomi, Arbetsliv, Drogfrihet.

KONTEKST:
1. Planering = förebild: 8 hub-layouter, inputMode delegates.
2. P3 Kanban (todo/waiting/done) är **LÅST**.
3. evolution_hub styr kapacitet — låg kapacitet = färre verktyg.
4. Mål: generalisera Planering-mönster till **taktil 3D hub** per delzon.

UPPGIFT:
1. Föreslå **3–5 hub-layouter** för MåBra och **3–4** för Ekonomi (beskriv modultyper).
2. Hur ska **en Vardagen-chameleon** växla Planering ↔ MåBra utan kategori-blandning?
3. Paralys-panel / låg kapacitet: hur ser det ut i fyllig 3D utan skrämmande detaljer?
4. **5 idéer** från andra appar (namnge app + vad vi lånar + risk).

BEGRÄNSNINGAR:
- Kanban P3 kvar i Planering.
- Ingen gamification.

OUTPUT-FORMAT: Svenska, tabeller, max 1000 ord.
SPECIALIST-TAGG: FP-TI-S4
```

---

## S5 — Familjen + Hamn (`specialist-familjen-hamn-builder`)

```
ROLL: specialist-familjen-hamn-builder — Barnfokus, livslogg, Trygg Hamn/BIFF.

KONTEKST:
1. Barnfokus-frågor är locked UX (`FamiljenBarnfokusDelegate`).
2. Hamn: Grey Rock/BIFF, ephemeral — spara till Valv manuellt.
3. Barnlogg WORM — erbjud Valv-kopia, aldrig auto-promote.
4. Ny estetik ska kännas trygg, inte «lekstuga» eller hotfull.

UPPGIFT:
1. Beskriv **Familjen-chameleon** med modes från `familjenInputModes.ts` i taktil UI.
2. Hur ska **Hamn** kännas visuellt distinkt från Dagbok men i samma designsystem?
3. Barnfokus + 12 kort: hur placera kort **under** supermodul utan clutter?
4. **4 idéer** för långtryck/PIN till Valv i ny chrome — för/nackdel.

BEGRÄNSNINGAR:
- Inga barnloggar auto till Valv.
- BIFF-coaching inte i Kunskap-RAG.

OUTPUT-FORMAT: Svenska, max 900 ord.
SPECIALIST-TAGG: FP-TI-S5
```

---

## S6 — MåBra-kurator (`specialist-mabra-curator`)

```
ROLL: specialist-mabra-curator — REFLECTION/PLAY innehåll, inte terapi-fluff.

KONTEKST:
1. MåBra = checkin, frågekort, reflektion (`mabraInputModes.ts`).
2. U6: ingen FACT utan bank; ingen gamification.
3. Rikare 3D UI riskerar «välmående-app»-känsla — vi vill undvika det.

UPPGIFT:
1. Hur presentera **frågekort och check-in** i taktil hub utan att kännas som Duolingo/Habitica?
2. **5 gör / 5 gör inte** för MåBra i Mid-Depth estetik.
3. Föreslå **mikro-animationer** som är lugna (max 3) — med ADHD-motivering.
4. **3 innehållsidéer** (REFLECTION) som passar ny UI — med `content_class` notering.

BEGRÄNSNINGAR:
- Ingen ny FACT i prod utan INNEHALL-REGISTER.
- Ingen streak/XP.

OUTPUT-FORMAT: Svenska, max 800 ord.
SPECIALIST-TAGG: FP-TI-S6
```

---

## S7 — Security Auditor (`specialist-security-auditor`)

```
ROLL: specialist-security-auditor — WORM, plausible deniability, Valv.

KONTEKST:
1. Valv ord «bevis/valv» får inte synas publikt utan PIN-session.
2. Ny navigation med 3D-kort riskerar accidental exposure.
3. Sandbox testar fri estetik — säkerhetsbeteende oförändrat.

UPPGIFT:
1. **Risklista** (minst 6 punkter) om vi byter Hem/nav till Modell A + taktil UI.
2. För varje risk: **mitigering** i sandbox vs prod.
3. Får **upptäcktskort** nämna «bevis» eller «Valv»? JA/NEJ + alternativ copy.
4. Granska om **fylligare UI** ökar shoulder-surfing — förslag.

BEGRÄNSNINGAR:
- Ändra inte firestore.rules i förslagen.
- Zero Footprint för Speglar kvar.

OUTPUT-FORMAT: Svenska, tabell risk|mitigering, max 800 ord.
SPECIALIST-TAGG: FP-TI-S7
```

---

## S8 — Master Architect (`livskompassen-master-architect`)

```
ROLL: livskompassen-master-architect — syntes, budget, prioritering.

KONTEKST:
1. Få GCP-krediter — GRATIS/LÅG först.
2. Freeport Våg B byggd: chameleon delegates, Hem v3, standalone route.
3. Användaren vill **mer inspiration, mer 3D** — öppen för det mesta i sandbox.
4. Backlog FP-001–036 finns från Design Freeport research.

UPPGIFT:
1. Efter att du läst **hypotetiska** S1–S7-svar: prioritera **top 10** idéer för nästa freeport-våg.
2. Markera kostnad GRATIS/LÅG/MEDEL/HÖG per idé.
3. Vilka idéer är **DEFER** (för risk/brus) trots att de är snygga?
4. Föreslå **en** «north star»-estetik (1 stycke) — inte tre.
5. Nästa **ett** konkret byggsteg i `/dev/design-freeport`.

BEGRÄNSNINGAR:
- Ingen prod-wire utan PMIR.
- Anti-hallucination: markera vad som kräver kodläsning.

OUTPUT-FORMAT: Svenska, numrerad top-10, max 700 ord.
SPECIALIST-TAGG: FP-TI-S8
```

---

## S9 — Öppen inspiration (Gemini 3.1 Pro) — VALFRIT

**Ingen projektlåsning.** Ren moodboard för att hitta känsla.

```
ROLL: Senior UI-designer — öppen visuell utforskning 2026.

UPPGIFT:
1. Beskriv **5 app-/designriktningar** som känns «taktil, mörk, premium, lugn» — inte game UI.
2. För varje: palett (hex), skuggor, typografi, ett referensord (t.ex. «japandi noir»).
3. **Vad vi ska undvika** för ADHD (max 5 punkter).
4. En **imaginär Hem-skärm** i ren prosa (8–12 meningar).

SPRÅK: Svenska. Max 600 ord. Inga kodkrav.
SPECIALIST-TAGG: FP-TI-S9
```

---

## S10 — Öppen inspiration → tokens (Opus 4.8) — VALFRIT

```
ROLL: Design systems architect.

UPPGIFT:
1. Översätt «Tactile Mid-Depth premium dark» till **20 design tokens** (namn + värde).
2. Tabell: token | värde | användning | ADHD-notering.
3. **3 hub-layout-arketyper** (lista, grid, fokus) med samma tokens.
4. För/nackdel: CSS-only vs liten Three.js accent i sandbox.

SPRÅK: Svenska. Max 700 ord.
SPECIALIST-TAGG: FP-TI-S10
```

---

## VERIFY (vid tvivel)

Kör samma VERIFY-block som i `DESIGN-FREEPORT-RESEARCH-PACK.md` i Opus + Gemini.  
Spara i `research-raw/tactile-inspiration/verify-[ämne].md`.

---

## Backlog-regel

Varje förslag med `FP-TI-S*` → rad i `TACTILE-INSPIRATION-BACKLOG.md`:

| ID | Källa | Förslag | Typ | Kostnad | För | Emot | Status |

**Status:** `IDÉ` → `SANDBOX` → `VERIFIED` → `PMIR` → `DONE` / `DEFER`

---

## Nästa steg (ett steg)

Kör **S1** i Cursor: `/specialist-theme-lab` med prompt-blocket ovan.  
Spara svaret i `docs/evaluations/research-raw/tactile-inspiration/S1-theme-lab.md`.
