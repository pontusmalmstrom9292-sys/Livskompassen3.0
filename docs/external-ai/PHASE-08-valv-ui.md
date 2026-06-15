# PHASE-08 — Valv UI (Körfält B1)

**Modell chatt 1:** Claude Opus 4.8 (vision + död kod)  
**Modell chatt 2:** Claude Sonnet 4.6 (SPEC + wireframes)  
**Ny chatt:** Ja (max 2 parallellt — olika fokus)  
**Cursor:** CHECKPOINT + implementation Fas 1A–1E

**Bifoga filer (i ordning):**
1. `exports/repomix-valv/repomix-valv-komplett-2026-06-15.md` (eller kör `npm run repomix:valv-komplett`)
2. `docs/specs/modules/VALVET_SUPERMODULE_PLAN.md`
3. `docs/external-ai/UI-WAVE-ROADMAP.md`

---

## Steg 1 — Master-prompt

Klistra hela blocket från [`CHATBOT-MASTER-PROMPT.md`](./CHATBOT-MASTER-PROMPT.md) **plus** [`UI-DESIGN-MASTER-PROMPT.md`](./UI-DESIGN-MASTER-PROMPT.md) (Körfält B-regler).

---

## Steg 2 — Chatt 1 (Opus) — Vision + inventering

```
UPPDRAG: READ-ONLY analys av Valv-repomix.

Leverera tre dokument (markdown):

1. VALV-VISION-BESLUT.md
   - Tre pelare: mönster/bevis, egen utveckling (vit), kunskapsbank/arkiv
   - Dold kärna (plausible deniability) — Fyren/PIN, inga publika ord
   - Koppling Inkast → granska → WORM (HITL)

2. VALV-UI-DESIGN-LOCK.md
   - Obsidian Calm 2.0: calm-card, glow-bottom-blue, font-display-serif
   - Progressive disclosure: primära lägen + «Mer…»
   - Förbjudet: streak/XP, nature themes, turkos aktiv chrome

3. DÖD-KOD-LISTA (kort tabell)
   - LIVE vs @deprecated vs orphan i vault/

Rör INTE prod-kod. Svenska, lågaffektivt.
```

Spara leverans → `leveranser/ui-design/2026-06-15-b1-valv-vision.md`

---

## Steg 3 — Chatt 2 (Sonnet) — SuperModule SPEC

```
UPPDRAG: VALV-SUPERMODULE-SPEC för Fas 1A–1C enligt VALVET_SUPERMODULE_PLAN.md.

Inkludera:
- Wireframe (text) per zon: samla, analysera, kunskap, vit, exportera, forensik
- Primär lägesväljare: Inkast | Granska | Analysera | Kunskap + Mer… (vit, rapporter, mer)
- URL-kontrakt valvMode ↔ vaultTab (tabell)
- Fil-lista per fas (1A–1E)
- Manuell checklista §7 från planen
- Locked panels som MÅSTE bevaras

Ingen backend. Ingen firestore.rules.
```

Spara leverans → `leveranser/ui-design/2026-06-15-b1-valv-spec.md`

---

## Steg 4 — Cursor CHECKPOINT

Säg i Cursor Agent:

```
CHECKPOINT B1 — granska leveranser/ui-design/2026-06-15-b1-*.md
Spara godkända beslut i docs/evaluations/
Implementera Fas 1A först. Kör smoke:locked-ux + smoke:valv.
```

---

## Smoke (B1 klar)

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:valv
npm run smoke:entities
npm run smoke:orkester
```

---

## Nästa våg

Efter B1 LOCK → [`UI-WAVE-ROADMAP.md`](./UI-WAVE-ROADMAP.md) B2 Hjärtat.
