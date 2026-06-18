# PHASE-03 — Backend upload + Storage

**Modell:** GPT-5.5 (alt. Gemini 3.1 Pro för multimodal)  
**SEKVENTIELL** — vänta CHECKPOINT-2 godkänd  
**Repomix:** `exports/gemini-handoff/repomix/gemini-pack-inkast.md` + UPLOAD-UNIFIED-SPEC från PHASE-02

---

## Uppdrag

```
UPPDRAG: Implementera backend-del av UPLOAD-UNIFIED-SPEC (godkänd vid CHECKPOINT-2).

KOD (fullständiga filer eller tydliga diff-block):

1. functions/src/lib/inkastSourceModule.ts
   - Lägg till ekonomi_inkast, voiceToVault i allowlist

2. src/modules/inkast/constants/inkastMimeTypes.ts
   - audio/webm, audio/mpeg, audio/mp4 med storleksgräns

3. Audio pipeline
   - Transkribera audio → text → submitInkastLite / classifyInboxDocument (samma G10)
   - Återanvänd analyzeUploadForKnowledge-mönster

4. Storage onFinalize (förslag)
   - vault_evidence/{uid}/inkast/* → samma routing som driveIngestSynapse
   - ALDRIG direkt till fel silo; confidence < 0.75 → inbox_queue

5. Enhetlig confidence-tröskel 0.75 mellan submitInkastLite och driveIngestSynapse

MUST NOT:
- Bryta WORM, tre silos, locked Inkast UX
- Auto-promote barn → Valv

VERIFY (lista kommandon):
- cd functions && npm run build
- npm run smoke:inkast
- npm run smoke:inbox

Avsluta med obligatorisk slutrad.
```

**→ CHECKPOINT-3**
