# K1 — Upload & Inkast-konsolidering (Gemini-uppdrag)

**Pack:** `npm run gemini:pack` → `exports/gemini-handoff/konsolidering-upload/`

---

## Steg i Gemini

1. Ny chatt på gemini.google.com
2. Klistra in **Master-prompt** från `docs/google-ai-pro/PROMPTS.md` (första kodblocket)
3. Bifoga eller klistra in hela `00-gemini-pack-konsolidering.md`
4. Klistra in **Uppdrag** nedan

---

## Uppdrag (klistra in efter repomix)

```
UPPDRAG: Kartlägg och föreslå konsolidering av alla uppladdnings-/inkast-flöden i Livskompassen till ETT enhetligt mönster.

BAKGRUND:
- Fyra G10-ytor: InkastLiteCard, CapturePanel, HomeAdaptiveCompass, VaultInkastCompact
- Tre backend-pipelines: submitInkastLite (G10), ingestKnowledgeDocument (Kunskap), uploadVaultEvidence (WORM direkt)
- InboxReviewQueue monteras på 4 ställen
- Hem visar både Capture och Inkast (transitional duplication)

MÅL:
1. Gap-tabell: varje upload-yta → callable → silo/collection → kan den slås ihop?
2. Föreslå EN canonical frontend-komponent (props för kontext: public / valv-PIN / kompass / planering)
3. Föreslå EN canonical review-kö (cloud inbox_queue vs local draftQueue — vad behålls?)
4. Behåll tre silos (U1) och WORM — INGEN cross-RAG
5. Behåll locked UX: SaveAsEvidencePrompt HITL, Barnporten, Valv Samla, Zero Footprint

LEVERANS:
- Markdown SPEC-utkast: UPLOAD-UNIFIED-SPEC.md
- Migreringsordning i 3 faser (min risk först)
- Varje rad: KEEP / MERGE / DELETE med skäl
- INGEN färdig prod-kod — Cursor granskar

Fråga mig INTE om godkännande — leverera utkast direkt.
```
