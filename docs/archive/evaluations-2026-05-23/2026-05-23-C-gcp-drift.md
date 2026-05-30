# Systemkontroll — C — GCP live vs dokumentation — 2026-05-23

**Trigger:** Read-only drift-audit (dokument vs repo vs senaste inventering).

**Källor lästa:** `docs/GCP-INVENTORY-LATEST.md` (2026-05-22), `docs/GCP-KONSOLIDERING-BESLUT.md`, `docs/specs/modules/Arkiv-GAP-REGISTER.md`, `firebase.json`, `.firebaserc`, `functions/src/index.ts`, `functions/src/lib/vectorSearchClient.ts`.

**Metod:** Jämförelse mot senaste live-inventering (2026-05-22). Live `firebase functions:list` ej körd i denna session — drift baseras på dokument + export-lista i kod.

---

## Sammanfattning

Node-stack **europe-west1** matchar repo-exports. Legacy Python **0 fn** — konsolidering **done**. Vector Search west1 aktiv med kod-defaults. **Drift:** `GCP-INVENTORY-LATEST.md` summary-tabell markerar G9–G14 som **open** medan `Arkiv-GAP-REGISTER.md` och kod markerar **done**; vector count **102** (inventering) vs **54** (äldre smoke-rad i samma fil); `@cursor/sdk` **WAIT** korrekt.

---

## Functions — docs vs repo exports

| Function (inventering) | `index.ts` export | Status |
|------------------------|-------------------|--------|
| `knowledgeVaultQuery` | ja (v2 onCall) | **match** |
| `valvChatQuery` | ja | **match** |
| `childrenLogsQuery` | ja | **match** |
| `ingestKampsparEntry` | ja | **match** |
| `generateEmbedding` | ja | **match** |
| `analyzeMessage` | ja | **match** |
| `speglingsMirror` | ja | **match** |
| `generateDossier` | ja | **match** |
| `weaveJournalEntry` | ja | **match** |
| `journalWovenToKampspar` | ja | **match** |
| `mabraCoach` | ja | **match** |
| `breakDownResponse` | ja | **match** |
| `getAgentRegistry` | ja | **match** |
| `invalidateSession` | ja | **match** |
| `notifyNewFile` | ja | **match** |
| `scheduledRetentionJob` | ja | **match** |
| `getEntityProfileRegistry` | ja | **match** (G9) |
| `getInboxQueue` / `confirmInboxItem` / `dismissInboxItem` | ja | **match** (G10) |
| `previewInboxClassification` | ja | **match** |
| `getContextCacheStatus` | ja | **match** (G12) |
| `ingestKnowledgeDocument` | ja | **match** |
| `ingestWidgetRecording` | ja | **match** (widget — kan saknas i äldre inventeringstabell) |

**Python legacy:** Alla raderade steg 1–5 — **match** med beslut KEEP Node west1.

---

## GAP-register G1–G16 vs inventering

| ID | Arkiv-GAP-REGISTER | GCP-INVENTORY summary | Drift |
|----|-------------------|----------------------|-------|
| G1–G8 | done | done | **ingen** |
| G9–G14 | done | **open** (rad 143) | **JA — uppdatera GCP-INVENTORY** |
| G15–G16 | done | done | **ingen** |
| V1 | wait | wait | **ingen** |

---

## Secrets / env

| Namn | Secret Manager (inventering) | Kod | Drift |
|------|------------------------------|-----|-------|
| `GEMINI_API_KEY` | finns | används | **match** |
| `NOTIFY_WEBHOOK_SECRET` | finns | `notifyNewFile` | **match** |
| `VECTOR_SEARCH_*` | saknas | defaults i `vectorSearchClient.ts` | **match** (avsiktligt) |

---

## Vector Search

| Fält | GCP-INVENTORY (2026-05-22) | Äldre rad i samma fil | Drift |
|------|----------------------------|----------------------|-------|
| Index ID | `2686894156982255616` | — | — |
| Endpoint | `4956462078572363776` | — | — |
| Vectors | **102** (huvudrad) | **54** (G2/G3 verify) | **doc internt** — senaste gäller |
| north1 legacy | raderad | — | **match** |

---

## Drift-lista (explicit)

| # | Dokument säger | Kod/moln säger | Rekommendation |
|---|----------------|----------------|----------------|
| 1 | G9–G14 **open** i GCP-INVENTORY summary | G9–G14 **done** i register + exports | Uppdatera summary-tabell |
| 2 | Functions-lista 16 rader (äldre tabell) | 22+ exports inkl. inbox/entity/widget | Utöka inventeringstabell |
| 3 | Vectors 54 i verify-sektion | 102 i huvudsummary | Harmonera till 102 + datum |
| 4 | `src/modules/README.md` pekar arkiv-GCP | Live = `GCP-INVENTORY-LATEST.md` | Uppdatera README pekare |
| 5 | Planering `/planering` i drawer | Ingen route i `AppRoutes` | Produkt-GAP, ej moln-drift |

---

## Firebase config

| Fil | Projekt | Region | Status |
|-----|---------|--------|--------|
| `.firebaserc` | `gen-lang-client-0481875058` | — | **match** inventering |
| `firebase.json` | hosting + functions | west1 default | **match** |

---

## Rekommenderat nästa steg

**Dokument:** Uppdatera `GCP-INVENTORY-LATEST.md` G9–G14-rad till **done** och lägg till widget/inbox-callables — ingen deploy krävs.

---

## Blocker

Ingen moln-blockerare. Live re-inventering rekommenderas före nästa större deploy.
