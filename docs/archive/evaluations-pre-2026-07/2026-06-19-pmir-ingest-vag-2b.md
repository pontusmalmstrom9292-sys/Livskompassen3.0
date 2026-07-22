# PMIR — Ingest våg 2b (widget DCAP)

**Datum:** 2026-06-19  
**Godkänd av:** Pontus ("godkänn 2b")

## Scope

Widget WH1 commit går via `classifyInboxDocument` → `routeInboxToWorm` i stället för direkt `saveVaultLog`.

## Ändringar

| Fil | Ändring |
|-----|---------|
| `inboxClassifier.ts` | `widget_recording` heuristik; HCF före kunskap-keywords |
| `inboxPersist.ts` | Generisk `sourceRef` + vault overrides i `routeInboxToWorm` |
| `widgetRecordingCommit.ts` | Server truth-builder + kunskap-block |
| `agents.ts` | `ingestWidgetRecording` commit-läge |
| `widgetVaultRecording.ts` | Callable commit + `withVaultSessionPayload` |
| `useWidgetVaultRecording.ts` | Hantera queued/persisted |
| `WidgetRecordPage.tsx` | Kö-copy vid queued |
| `smoke_widget_ingest.mjs` | Ny statisk gate |

## Routingpolicy (widget)

- Default: `bevis` → `reality_vault`
- Barnsignal: `barnen` → `inbox_queue` (ingen auto-persist)
- `kunskap`: blockeras → `bevis`
- Trauma/osäker: `review` → `inbox_queue`

## Deploy

```bash
cd functions && npm run build
firebase deploy --only functions:ingestWidgetRecording
npm run build && firebase deploy --only hosting
```

## Rollback

Revert commit; redeploy functions + hosting.
