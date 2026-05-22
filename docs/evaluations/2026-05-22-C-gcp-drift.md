# Systemkontroll — C — 2026-05-22

**Trigger:** Byggpass GCP drift  
**Källor:** `docs/GCP-INVENTORY-LATEST.md`, `firebase.json`, `.firebaserc`, `functions/src/index.ts` exports

## Sammanfattning

Repo-exports (22) stämmer i stort med GCP-inventering (2026-05-22). Legacy Python **0 kvar**. Vector Search west1 **VERIFY PASS** (102 vectors). Drift: inventering listar 16 functions men repo har fler callables (inbox, entity, cache) — inventering bör uppdateras.

## 1) Functions docs vs kod

| Export i `index.ts` | I GCP-INVENTORY |
|-------------------|-----------------|
| 22 exports | 16 listade — **mismatch** |
| `getEntityProfileRegistry`, `getInboxQueue`, `confirmInboxItem`, `dismissInboxItem`, `previewInboxClassification`, `getContextCacheStatus` | Saknas i inventeringstabell |

**Rekommendation:** Uppdatera `docs/GCP-INVENTORY-LATEST.md` med G9–G10 callables.

## 2) GAP G1–G14 vs inventering

| ID | Register | Live (2026-05-22) |
|----|----------|-------------------|
| G1–G8 | **done** | PASS |
| G9–G14 | Tabell **open**, detalj **done** | **Drift** |
| G15–G16 | **done** | PASS |
| G6 | **done** E2E kb_docs | PASS |

## 3) Secrets/env

| Secret | Status |
|--------|--------|
| `NOTIFY_WEBHOOK_SECRET` | Finns — G6 done |
| `VECTOR_SEARCH_*` | Saknas i Secret Manager — kod-defaults OK |

## 4) Drift-lista

| Dokument säger | Kod/moln säger |
|----------------|----------------|
| G9–G14 **open** (tabell) | G9–G14 **done** i detaljsektioner |
| U5.5 **open** i security.md | `barnenModuleRouteGuard.ts` **done** |
| Natt-CI blocker G6 **open** | G6 **done** 2026-05-22 |
| system-plan notify E2E kvar | G6 PASS i GCP-FAS4 |
| visibilitychange Zero Footprint | Borttagen i `useZeroFootprint.ts` |

## 5) Rekommenderat steg

Uppdatera `docs/GCP-INVENTORY-LATEST.md` med alla 22 exports + timestamp.

## Blocker

`firebase functions:list` ej körd i denna session (CLI optional). Jämförelse mot kod + senaste inventering.
