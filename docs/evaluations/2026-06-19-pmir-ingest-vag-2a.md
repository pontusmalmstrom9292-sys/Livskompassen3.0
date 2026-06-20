# PMIR — Ingest våg 2a-A (sourceRef-only)

**Datum:** 2026-06-19  
**Godkänd av:** Pontus ("godkänn 2a-A")

## Scope

Widget WH1 får stabil `storagePath` + WORM `sourceRef` vid låsning i Valvet.

## Ändrade filer

| Fil | Ändring |
|-----|---------|
| `functions/src/lib/wormPayload.ts` | `buildInboxSourceRef`, `storageInboxSourceRef` |
| `src/modules/core/firebase/inboxSourceRef.ts` | Klient-spegel |
| `src/modules/core/firebase/storage.ts` | `uploadDiscreetRecording` → `{ storagePath, downloadUrl }` |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | `sourceRef` på `saveVaultLog` |
| `scripts/smoke_locked_ux.mjs` | Statisk guard |

## Ej ändrat (medvetet)

- `firestore.rules`
- `ingestWidgetRecording` callable
- `routeInboxToWorm` / DCAP-kedja (→ våg 2b)
- Locked UX WH1/WH2

## Deploy

```bash
npm run build
firebase deploy --only hosting
```

## Rollback

Revert commit — inga schema- eller rules-ändringar.
