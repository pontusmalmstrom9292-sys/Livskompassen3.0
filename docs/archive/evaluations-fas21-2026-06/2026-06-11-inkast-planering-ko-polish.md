# Inkast increment — Planering kö-polish (2026-06-11)

**Scope:** Smart Inkast roadmap — G10-kö på Planering + HITL «→ Handling» till Kanban.

## Varför

- Föregående slice: Dagbok weave opt-in (`2026-06-11-inkast-dagbok-weave.md`)
- Defer-not: «Planering kö-polish»
- Planering capture (`planering_inkorg`) går till review — användaren behöver tydlig väg till Handling utan ny WORM-silo

## Levererat

| Yta | Beteende |
|-----|----------|
| `InboxReviewQueue` | Ny knapp **→ Handling** — skapar `planning_tasks` + avvisar kö-post |
| `planeringInboxItem.ts` | `isPlaneringInboxItem`, pasteClassifier-återanvändning, sortering |
| `reviewQueuePipeline` | Status «planering · granska» för planering-taggade poster |
| `ReviewQueuePipelinePanel` | `prioritizePlanering` — planering först + CTAs |
| `CapturePanel` | Planering: ankare «Se kö nedan» efter queued inkast |

## Filer

- `src/modules/inkast/planeringInboxItem.ts` (ny)
- `src/modules/inkast/components/InboxReviewQueue.tsx`
- `src/modules/capture/reviewQueuePipeline.ts`
- `src/modules/capture/ReviewQueuePipelinePanel.tsx`
- `src/modules/capture/CaptureSuperModule.tsx`
- `src/modules/capture/CapturePanel.tsx`
- `src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx`
- `src/modules/inkast/api/inkastService.ts`
- `scripts/smoke_inkast_fas2.mjs`, `scripts/smoke_inkast_lockdown.mjs`

## Deploy

**Hosting only** (UI + client-side planning_tasks create):

```bash
npm run build && firebase deploy --only hosting
```

## Smoke

- `npm run build`
- `npm run smoke:inkast-fas2`
- `npm run smoke:inkast`
- `npm run smoke:locked-ux`

## USER (manuell)

1. `/planering?tab=inkorg` → Smart Inkast → spara → se kö med «planering · granska»
2. Valv → Samla → granskningskö → **→ Handling** → uppgift i Kanban
3. Ex-brus (konflikt) → felmeddelande, inte Handling

## Defer (nästa)

- Inline HITL i Hem (canonical kvar Valv Samla)
- Gmail OAuth
- Backend `routing: planering` (idag client-side + dismiss)
