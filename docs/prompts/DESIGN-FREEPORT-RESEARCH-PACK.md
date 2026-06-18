# DESIGN FREEPORT — RESEARCH PACK

**Start här.** Den här filen är din enda utgångspunkt för extern research.

| Steg | Vad du gör |
|------|------------|
| 1 | Välj prompt nedan |
| 2 | Kopiera hela prompt-blocket till rätt modell |
| 3 | Spara svaret i angiven fil under `docs/evaluations/research-raw/` |
| 4 | När alla 5 är klara — klistra in svaren i Cursor-chatt |

---

## Snabböversikt — filer du kommer använda

```
docs/
├── prompts/
│   └── DESIGN-FREEPORT-RESEARCH-PACK.md   ← DU ÄR HÄR
├── evaluations/
│   ├── 2026-06-18-design-freeport-research.md
│   ├── DESIGN-FREEPORT-IMPROVEMENT-BACKLOG.md
│   └── research-raw/
│       ├── README.md
│       ├── prompt-1-sonnet.md
│       ├── prompt-2-gpt55.md
│       ├── prompt-3-gemini.md
│       ├── prompt-4-opus.md
│       └── prompt-5-grok.md
└── design/
    └── CHAMELEON-SUPERMODULE-SPEC.md
```

---

## Modellmatris

| Prompt | Modell | Spara svar i |
|--------|--------|--------------|
| 1 Navigationsarkitekt | Claude Sonnet 4.6 | `research-raw/prompt-1-sonnet.md` |
| 2 Chameleon Supermodule | GPT-5.5 | `research-raw/prompt-2-gpt55.md` |
| 3 Tactile Mid-Depth | Gemini 3.1 Pro | `research-raw/prompt-3-gemini.md` |
| 4 Planering som mall | Opus 4.8 | `research-raw/prompt-4-opus.md` |
| 5 Evolution | Grok 4.20 Reasoning | `research-raw/prompt-5-grok.md` |

---

## Prompt 1 — Navigationsarkitekt

**Modell:** Claude Sonnet 4.6 | **Spara i:** `prompt-1-sonnet.md`

```
ROLL: Du är UX-arkitekt för en ADHD-vänlig Life OS-app (React PWA).

KONTEKST:
1. Appen har tre zoner: Hjärtat (dagbok/speglar), Vardagen (planering/måbra/ekonomi), Familjen (barn/BIFF).
2. Nuvarande problem: för många flikar och sidor — användaren går lätt vilse.
3. Målet är att varje zon ska ha EN «Chameleon Supermodule» där funktionen byts inuti modulen (inte ny sida).
4. Under supermodulen finns upptäcktskort (max 12) som styr till rätt läge i samma modul, filtrerat efter stressnivå.
5. Idag är Planeringssidan bäst: den har många moduler (listor, anteckningar, projekt, nedräkningar) och 8 olika hub-layouter.
6. Valvet är låst bakom PIN och får inte dyka upp i publikt läge av misstag.
7. Målgruppen är en neurodivergent förälder med ADHD, GAD och hög stress — så få steg som möjligt och låg visuell arousal.

UPPGIFT:
1. Föreslå en informationsarkitektur där användaren ALDRIG behöver mer än två klick från Hem till en vanlig handling.
2. Beskriv hur vi kan ersätta nuvarande flik-rader med zon-hub + Chameleon Supermodule per zon.
3. Ge tre navigationsmodeller (A, B, C) med för- och nackdelar för ADHD + hypervigilans.
4. Beskriv hur vi kan göra Valv/Barnlogg tillgängligt utan brus eller «farligt» att råka trycka på.

BEGRÄNSNINGAR:
- Ingen gamification. Tre silos: Kunskap, Valv (WORM), Barnen — ingen cross-RAG.
- Minimera sidor/rutter; fokus hubbar + supermoduler.

OUTPUT-FORMAT: Svenska, rubriker 1–4, max 800 ord, ASCII-skisser valfritt.
OSÄKERHET: Markera gissningar med «OSÄKER:».
```

---

## Prompt 2 — Chameleon Supermodule

**Modell:** GPT-5.5 | **Spara i:** `prompt-2-gpt55.md`

```
ROLL: Du är produktdesigner för «Chameleon Supermodule» i en terapeutisk Life OS-app.

KONTEKST:
1. En visuell container som alltid ligger på samma plats i zonen.
2. Mode-växlare byter delegate utan sidladdning.
3. Varje zon har egen supermodul — vi blandar aldrig kategorier.
4. Kort under modulen leder till rätt mode i samma modul.
5. Planering har inputMode + 8 hub-layouter som referens.
6. evolution_hub kan dölja modes vid låg kapacitet.

UPPGIFT:
1. Fem regler för chameleon-mönstret.
2. Primära modes per zon (Hjärtat, MåBra, Familjen) — max 5 + «Mer…».
3. Hur mode-byte ska kännas visuellt (lugnt, tydligt).
4. Självlärande utan gamification.

BEGRÄNSNINGAR: Ingen gamification. Subtil morph/fade, inte flash.
OUTPUT-FORMAT: Svenska, numrerat 1–4, ASCII-wireframe valfritt.
OSÄKERHET: Markera med «OSÄKER:».
```

---

## Prompt 3 — Tactile Mid-Depth

**Modell:** Gemini 3.1 Pro | **Spara i:** `prompt-3-gemini.md`

```
ROLL: UI-designer för «Tactile Mid-Depth» — mörk Life OS-app.

KONTEKST:
1. Obsidian Calm + guld känns låst.
2. Undvik: platt bento OCH neon/game UI.
3. Önskat: fyllig taktil 3D, glas, mörk bas, fri accent.
4. Låg visuell arousal viktigare än wow.
5. Obsidian Depth som referens — inte låst till guld.

UPPGIFT:
1. Tre riktningar A/B/C (färg, skugga, typografi, hörn).
2. Mode-byte visuellt tydligt utan hårda animationer.
3. Fem gör / fem gör inte (ADHD).
4. Hub-layouter delar samma design tokens.

BEGRÄNSNINGAR: Ingen naturbakgrund. Inga regnbågar/neon.
OUTPUT-FORMAT: Svenska, tokens i text, ingen kod.
OSÄKERHET: Markera med «OSÄKER:».
```

---

## Prompt 4 — Planering som mall

**Modell:** Opus 4.8 | **Spara i:** `prompt-4-opus.md`

```
ROLL: Produktarkitekt — generalisera Planering-hub till andra zoner.

KONTEKST:
1. Planering: 8 layouter, moduler handling/projekt/anteckning/inköp/tid/inkorg/fokus.
2. Användaren vill listor, anteckningar, nedräkning i olika stilar.
3. P3 Kanban (todo/väntar/klart) är LÅST.
4. Varje zon har egen kategori.

UPPGIFT:
1. 4–6 generiska modultyper per zon utan kategori-blandning.
2. Layout picker per zon — hur många layouter?
3. Tabell: zon → tillåtna layouter → undvik.
4. P3 Kanban låst + flex runt omkring.

OUTPUT-FORMAT: Svenska, minst en tabell.
OSÄKERHET: Markera med «OSÄKER:».
```

---

## Prompt 5 — Evolution

**Modell:** Grok 4.20 Reasoning | **Spara i:** `prompt-5-grok.md`

```
ROLL: Produktfilosof — levande app utan gamification.

KONTEKST:
1. evolution_hub + evolution_ledger (append-only).
2. Supermoduler + kort ska kännas levande utan streaks/poäng.
3. Känslig för stress och dopaminfällor.
4. Barnporten har ålderssegment — samma tänk för vuxen.

UPPGIFT:
1. Lära sig hjälpsamma modes utan tråkighet.
2. Fem sätt att rotera kort (variation, inte belöning).
3. «Nytt läge» utan dopamin-fällor.
4. Parallell till Barnporten för vuxenzoner.

BEGRÄNSNINGAR: Ingen gamification. Ingen auto-promote barn→valv.
OUTPUT-FORMAT: Klinisk ton, svenska, max 600 ord.
OSÄKERHET: Markera med «OSÄKER:».
```

---

## VERIFY-prompt (vid tvivel)

**Modell:** Opus 4.8 + Gemini 3.1 Pro | **Spara i:** `verify-[ämne].md`

```
ROLL: Teknisk granskare för Firebase/React Life OS.

FÖRSLAG FRÅN ANNAN AI:
[KLIPP IN HÄR]

PROJEKTFAKTA:
- Tre silos, ingen cross-RAG. React PWA. Firebase, begränsad budget.
- PlaneringInputSuperModule med inputMode + 8 hub-layouter.

UPPGIFT:
1. Rimligt? JA/DELVIS/NEJ
2. Bryter silos/WORM?
3. Kostnad: GRATIS/LÅG/MEDEL/HÖG
4. Billigare alternativ (klient, Flow, callable)?
5. Vad måste verifieras i kod?
6. OSÄKER-punkter

OUTPUT: Svenska, 1–6, max 500 ord.
```
