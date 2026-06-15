# PHASE-04 — Frontend upload (alla Superhubs)

**Modell:** Claude Sonnet 4.6 (alt. Gemini 3 Flash)  
**SEKVENTIELL** — vänta CHECKPOINT-3  
**Repomix:** `gemini-pack-inkast.md` + backend-ändringar från PHASE-03

---

## Uppdrag

```
UPPDRAG: Frontend upload-unified enligt godkänd SPEC + backend från PHASE-03.

KOD:

1. CapturePanel.tsx
   - Slå ihop filväljare + AI-preview från InkastDirectPanel
   - Props: allowFiles, maxFiles, sourceModule

2. Återanvänd överallt:
   - InkastConfirmPanel, InkastManualEditForm, TaggSelector

3. Delegates — en ingest-väg:
   - Hem, Familjen, Planering, Ekonomi → CaptureSuperModule

4. Obsidian Calm — bg-surface, text-accent, chip--active/idle
   - INGA nya hex-färger

MUST NOT:
- Ta bort InkastDirectPanel förrän migration verifierad (kan deprecate med kommentar)
- Bryta locked UX smoke

VERIFY:
- npm run build
- npm run smoke:locked-ux

Avsluta med obligatorisk slutrad.
```

**→ CHECKPOINT-4** — kör snapshot `upload-unified` om LOCK.
