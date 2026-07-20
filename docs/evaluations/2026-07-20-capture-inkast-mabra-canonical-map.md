# Capture / Inkast + MåBra — canonical map (first cut)

**Date:** 2026-07-20 · **Wave:** B04 · **Scope:** docs + safe barrels only (no mass-delete)

## Summary

| Concept | Canonical path | Role |
|---------|----------------|------|
| **Inkast API** | `src/modules/inkast/` | `submitInkastLite`, review queue, HITL bridges, mime/tags |
| **Capture UI shell** | `src/modules/capture/` | Chameleon delegates, draft queue, offline flush, `CaptureSuperModule` |
| **MåBra hub** | `src/modules/features/dailyLife/wellbeing/mabra/` | Routes, hub view, coach, history, supermodule |
| **MåBra recovery slice** | `src/modules/features/mabra/` | Drogfrihet / recovery widgets (banner, SOS, 12-step) |
| **Legacy MåBra chrome** | `src/components/mabra/` | `MabraCheckinModal` only (2 prod importers) |

**Default rule:** API → `@/modules/inkast`. UI shell → `@/modules/capture`. Hub → `@/features/dailyLife/wellbeing/mabra`.

---

## Dual trees — capture vs inkast

### `src/modules/capture/` (UI + draft pipeline)

| File / area | Purpose |
|-------------|---------|
| `CaptureSuperModule.tsx` | Chameleon shell; routes to `InkastDirectPanel` |
| `CapturePanel.tsx` | Hem / generic capture surface |
| `InkastDirectPanel.tsx` | Valv direct-submit UI (**calls inkast API**) |
| `ReviewQueuePipelinePanel.tsx` | Planering inkorg pipeline |
| `draftQueue.ts`, `captureDraftSync.ts` | Offline draft WORM-adjacent queue |
| `submitCaptureDraft.ts` | Dual-write helper (planering ↔ capture) |
| `index.ts` | Barrel (UI exports only) |

### `src/modules/inkast/` (API + review components)

| File / area | Purpose |
|-------------|---------|
| `api/inkastService.ts` | **`submitInkastLite`**, classification preview, tags |
| `components/InboxReviewQueue.tsx` | Valv granskningskö |
| `components/Inkast*Bridge.tsx` | Barnen / dagbok weave bridges |
| `planeringInboxItem.ts` | Planering inbox sorting |
| `index.ts` | Barrel (API + review UI) |

### Cross-imports today (expected)

- `capture/InkastDirectPanel.tsx` → `@/modules/inkast/api/inkastService`
- `capture/ReviewQueuePipelinePanel.tsx` → inkast service + planering inbox
- `inkast/inboxReviewQueueCopy.ts` → `@/modules/capture/reviewQueuePipeline` (display helpers)

**First-cut redirect policy:** Do **not** re-export inkast API from `capture/index.ts` (avoids circular confusion). Importers should use `@/modules/inkast` for API.

---

## Dual trees — MåBra

### Canonical hub — `features/dailyLife/wellbeing/mabra/` (~113 files)

- Entry: `routing/MabraRoutes.tsx`, `views/MabraHubView.tsx`
- Shell: `supermodule/MabraInputSuperModule.tsx`
- Prod route: `/vardagen?tab=mabra` via `LivMabraTabPanel` → `MabraHubView`

### Recovery slice — `features/mabra/` (4 files)

| Component | Importers |
|-----------|-----------|
| `MabraRecoveryBanner` | `MabraHubView` |
| `RecoveryUrgeSosModule` | `RecoverySosView`, `DrogfrihetHubPage` |
| `RecoveryRealityCheckForm` | `DrogfrihetHubPage` |
| `RecoveryTwelveStepJournal` | `DrogfrihetHubPage` |

**Barrel added:** `src/modules/features/mabra/index.ts`

### Legacy — `src/components/mabra/` (3 files)

| File | Status |
|------|--------|
| `MabraCheckinModal.tsx` | **Active** — `ChameleonLive`, `FreeportChameleonLive` |
| `MabraHub.tsx` | **Orphan** — no importers; superseded by `MabraHubView` |
| `MabraActionPanel.tsx` | **Orphan** — only used by orphan `MabraHub` |

**Barrel added:** `src/components/mabra/index.ts` (re-export modal only)

### Future consolidation (not this wave)

1. Move `MabraCheckinModal` → `wellbeing/mabra/components/`; update 2 importers.
2. Delete orphan `MabraHub.tsx` + `MabraActionPanel.tsx` after smoke + Pontus OK.
3. Optionally move recovery slice under `wellbeing/mabra/recovery/` (same silo).

---

## First cut — concrete file list (redirects / dead re-exports)

### Done (code)

| Action | File |
|--------|------|
| Add barrel | `src/modules/features/mabra/index.ts` |
| Add barrel | `src/components/mabra/index.ts` |

### Deferred (docs-only — next wave)

| Action | Files |
|--------|-------|
| Point importers at barrels | `ChameleonLive.tsx`, `FreeportChameleonLive.tsx` → `@/components/mabra` |
| Point recovery imports at barrel | `MabraHubView.tsx`, `DrogfrihetHubPage.tsx`, `RecoverySosView.tsx` |
| Remove orphans (PMIR) | `src/components/mabra/MabraHub.tsx`, `MabraActionPanel.tsx` |
| Extend canonical barrel | `wellbeing/mabra/index.ts` — export hub view + recovery re-exports |
| Normalize deep capture paths | ~15 importers using `@/modules/capture/<file>` → `@/modules/capture` barrel |

### Do NOT (this wave)

- Merge `capture/` into `inkast/` or vice versa
- Move `InkastDirectPanel` without MOD-VALV-INKAST unlock
- Cross-RAG or silo changes

---

## Verification

- Barrels are type-only re-exports; no runtime behaviour change.
- `npm run build` recommended after importer updates (none required for first cut).
