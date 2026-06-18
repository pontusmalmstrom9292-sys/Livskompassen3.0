# PHASE-02 — Upload-konsolidering SPEC

**Modell:** Claude Opus 4.8  
**Parallellt OK:** Grok 4.20 — synapse-flödesdiagram (analys only)  
**Repomix:** `exports/gemini-handoff/konsolidering-upload/00-gemini-pack-konsolidering.md`

---

## Uppdrag

```
UPPDRAG: UPLOAD-UNIFIED-SPEC — konsolidera alla uppladdnings-/inkast-flöden till ETT mönster.

BAKGRUND (verifiera i repomix):
- Ytor: CapturePanel, InkastDirectPanel, InkastLite, VaultInkastCompact, HemCapture
- Pipelines: submitInkastLite (G10), ingestKnowledgeDocument (Kunskap), uploadVaultEvidence (WORM direkt)
- InboxReviewQueue på flera ställen

MÅL:
1. Gap-tabell: varje yta → callable → silo → kan slås ihop?
2. EN canonical frontend (CaptureSuperModule modes: text, files, preview, confirm)
3. EN canonical backend entry (submitInkastLite + ev. Storage onFinalize)
4. Behåll tre silos (U1), HITL, SaveAsEvidencePrompt, Zero Footprint
5. Migrering i 3 steg (min risk först)

LEVERANS: UPLOAD-UNIFIED-SPEC.md
- Varje rad: KEEP / MERGE / DELETE med skäl
- INGEN färdig prod-kod — Cursor granskar vid CHECKPOINT-2

DESIGN-HYGIEN (kort): vilka docs/design-mockups är irrelevanta efter beslut? → lista ARCHIVE-kandidater.

Avsluta med obligatorisk slutrad.
```

**→ CHECKPOINT-2** — godkänn SPEC innan PHASE-03.
