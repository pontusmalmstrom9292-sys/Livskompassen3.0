# Superhub deep — Hem + Capture

**Datum:** 2026-06-01  
**Route:** `/` · **Domän-gate:** [`2026-06-01-superhub-domän-covert-narcissism.md`](2026-06-01-superhub-domän-covert-narcissism.md)

## Mappning

| Ingång | Mål |
|--------|-----|
| Hem hero + check-in | Oförändrat |
| `CapturePanel` | Ovanför/ersätter `InkastLiteCard` gradvis |
| Dagbok reflektion/speglar | `/dagbok` via Fyren/dagbok-länkar (ej drawer root) |
| DraftQueue IndexedDB | `pending` → submitInkastLite → `synced`/`review`/`failed` |

## Autosort (domän)

- Ex-meddelande → `bevis`
- Barnobservation → `barnen`
- Trauma/LVU → `review`
- `sourceModule` skickas till callable

## Diff-scope

- Ny: `src/modules/capture/` (draftQueue, CapturePanel, ReviewQueuePanel)
- Ändra: `HomePage.tsx`, `inkastService.ts` (sourceModule), `submitInkastLite.ts` (backend)
