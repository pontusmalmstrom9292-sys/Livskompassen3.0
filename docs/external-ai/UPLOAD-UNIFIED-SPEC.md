# UPLOAD-UNIFIED-SPEC (godkänd CHECKPOINT-2)

**Datum:** 2026-06-15 · **Status:** Godkänd · **Källa:** ChatBox PHASE-02

Se full text: [`leveranser/2026-06-15-fas-02-upload-spec.md`](./leveranser/2026-06-15-fas-02-upload-spec.md)

## Beslut (kort)

| Beslut | Vad |
|--------|-----|
| **KEEP** | `submitInkastLite` (canonical backend), `VaultInkastCompact`, `uploadVaultEvidence`, InboxReviewQueue callables |
| **MERGE** | CapturePanel, InkastDirectPanel, InkastLite, HemCapture → CaptureSuperModule (PHASE-04) |
| **DELETE** | `ingestKnowledgeDocument` — **efter** migration steg 3, inte i PHASE-03 |

## PHASE-03 scope (backend only)

1. `inkastSourceModule` allowlist
2. Audio MIME + transkribering → G10
3. Storage `onFinalize` → samma routing som driveIngestSynapse
4. Confidence 0.75 enhetlig

## PHASE-04 scope (frontend)

CaptureSuperModule modes: text | files | preview | confirm

## Granskning mot inkast-lockdown

- G10 `InkastManualEditForm`, `TaggSelector`, HITL — **oförändrade** (utöka, radera inte)
- Valv separat flöde — **KEEP** enligt SPEC
- Tre silos + SaveAsEvidencePrompt — **behålls**
