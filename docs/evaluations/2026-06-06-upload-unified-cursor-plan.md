# Upload Unified — cursor-plan (Fas 1)

**Datum:** 2026-06-06  
**Status:** Fas 1–3 **done** 2026-06-06 (smoke PASS)  
**Kanon:** [`K1-upload-konsolidering-svar.md`](../gemini-handoff/K1-upload-konsolidering-svar.md) · [`2026-06-06-inkast-lockdown.md`](./2026-06-06-inkast-lockdown.md)

## Slutsats

Bygg `CaptureSuperModule` + `InkastDirectPanel` som tunn router/extraktion. Ingen backend-ändring. Hem behåller båda ytorna till Fas 3.

## REASONS (kort)

| | |
|---|---|
| Requirements | EN direct-inkast implementation; variant-router för hubbar |
| Entities | InkastLiteCard, VaultInkastCompact, CapturePanel |
| Approach | Extract shared JSX → router component |
| Structure | `src/modules/capture/CaptureSuperModule.tsx`, `InkastDirectPanel.tsx` |
| Operations | `npm run smoke:inkast`, `smoke:inbox`, `smoke:locked-ux` |
| Norms | Obsidian Calm, inkast lockdown filer orörda (ConfirmPanel, TaggSelector) |
| Safeguards | Inga callable-ändringar; legacy exports behålls |

## Fas 1 — leverans

- [x] `InkastDirectPanel` — delad direct-submit UI
- [x] `CaptureSuperModule` — variant router
- [x] `InkastLiteCard` → thin wrapper
- [x] `VaultInkastCompact` → thin wrapper
- [x] `HomePage` → CaptureSuperModule imports
- [x] Smoke PASS (2026-06-06 Block A1)

## Fas 2 — leverans (done 2026-06-06)

- [x] `InboxReviewQueueLink` — Planering/Kunskap → länk till Valv Samla
- [x] Canonical mount kvar i `VaultSamlaHub`
- [x] `CaptureSuperModule` variant `kompass` — `HomeAdaptiveCompass` duplikat bort
- [x] Smoke PASS

## Fas 3 — leverans (done 2026-06-06)

- [x] Inloggad Hem: endast `hem-capture` + `ReviewQueuePanel` (lokal utkast — separat pipeline)
- [x] Utloggad Hem: endast `hem-inkast` (direct)
- [x] Ingen dubbel InkastLiteCard på Hem
