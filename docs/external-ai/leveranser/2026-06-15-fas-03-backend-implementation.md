# PHASE-03 — Backend upload (Cursor-implementering)

**Datum:** 2026-06-15  
**CHECKPOINT:** CP-3 **PASS**  
**ChatBox-leverans:** `2026-06-15-fas-03-backend.md.rtf` (anteckningar only — kod skrevs i Cursor)

## Genomfört

| Punkt | Fil(er) | Status |
|-------|---------|--------|
| Allowlist `ekonomi_inkast`, `voiceToVault` | `functions/src/lib/inkastSourceModule.ts` | ✅ |
| Audio MIME (webm, mpeg, mp4, m4a, wav) | `inkastConstants.ts`, `submitInkastLite.ts`, `inkastMimeTypes.ts` | ✅ |
| Audio → transkript → G10 | `transcribeInkastAudio.ts`, `extractAnalysisFromBuffer` | ✅ |
| Storage onFinalize `vault_evidence/{uid}/inkast/*` | `triggers/inkastStorageOnFinalize.ts` | ✅ |
| Skip dubbel-routing (`source=inkast_lite`) | `uploadInkastEvidence.ts` + trigger guard | ✅ |
| Enhetlig confidence **0.75** | `applyInkastConfidenceGate` i `inboxClassifier.ts`; Drive + Lite + Storage | ✅ |
| Export trigger | `functions/src/index.ts` → `onInkastEvidenceFinalized` | ✅ |

## Smoke

```
cd functions && npm run build          → PASS
npm run smoke:inkast                   → PASS
npm run smoke:inbox                    → PASS (App Check init tillagd i smoke-skript)
```

## Deploy (prod)

```bash
cd functions && npm run build
firebase deploy --only functions:onInkastEvidenceFinalized,functions:submitInkastLite
```

`submitInkastLite` behöver deploy om audio/transkript redan ska fungera i prod.

## Nästa

**PHASE-04** — frontend: slå ihop filväljare i `CapturePanel` (ny ChatBox-chatt, Claude Sonnet 4.6).
