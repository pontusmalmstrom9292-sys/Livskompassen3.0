# GCP / Firebase-inventering — LIVE (senast)

**Datum:** 2026-05-31 (live audit — doc-synk efter Vävaren HITL)  
**Projekt:** `gen-lang-client-0481875058` (number `1084026575972`)  
**Metod:** `firebase functions:list`, `gcloud ai indexes list`, `gcloud ai index-endpoints describe`  
**Beslut:** [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md)  
**Ersätter för beslut:** [`docs/archive/GCP-INVENTORY-2026-05-21.md`](archive/GCP-INVENTORY-2026-05-21.md)

---

## Sammanfattning

| Fynd | Status | Gap |
|------|--------|-----|
| `valvChatQuery` deployad (west1) | **done** | G1 |
| Vector endpoint + `livskompassen_kv_deployed_v1` | **done** | G2 **VERIFY PASS** |
| Index west1, **173 vectors** | **done** | G3 **VERIFY PASS** (sync 2026-05-31) |
| `NOTIFY_WEBHOOK_SECRET` | **finns** | G6 **done** — E2E kb_docs 2026-05-22 |
| Vävaren HITL callables | **deployade** | `approveWeaverMetadata`, `rejectWeaverMetadata` |
| Legacy Python (0 fn kvar) | **avvecklad** | G4 **done** — steg 1–5 2026-05-22 |
| Compute Engine VMs | **0** | — |
| `@cursor/sdk` | **saknas** | **WAIT** (Natt-CI) |

---

## Deployade Cloud Functions

**Totalt:** 33 functions · **europe-west1** · Node.js 20 · 0 Python legacy

### Callable / HTTP (urval grupperat)

| Function | Version | I repo | Silo / roll |
|----------|---------|--------|-------------|
| `knowledgeVaultQuery` | v2 | ja | Kunskap RAG |
| `valvChatQuery` | v2 | ja | Valv RAG |
| `childrenLogsQuery` | v2 | ja | Barnen RAG |
| `addEntityProfile` | v2 | ja | G9 entiteter |
| `getEntityProfileRegistry` | v2 | ja | G9 entiteter |
| `getInboxQueue` | v2 | ja | G10 inkorg |
| `confirmInboxItem` | v2 | ja | G10 inkorg |
| `dismissInboxItem` | v2 | ja | G10 inkorg |
| `previewInboxClassification` | v2 | ja | G10 inkorg |
| `getContextCacheStatus` | v2 | ja | G12 cache |
| `submitInkastLite` | v2 | ja | Inkast |
| `analyzeMessage` | v1 | ja | BIFF / Hamn |
| `approveWeaverMetadata` | v1 | ja | Vävaren HITL |
| `rejectWeaverMetadata` | v1 | ja | Vävaren HITL |
| `weaveJournalEntry` | v1 | ja | Vävaren async |
| `journalWovenToKampspar` | v1 | ja | G7 opt-in |
| `ingestKampsparEntry` | v1 | ja | Kunskap ingest |
| `ingestKnowledgeDocument` | v1 | ja | Kunskap ingest |
| `generateEmbedding` | v1 | ja | Vector |
| `generateDossier` | v1 | ja | Dossier |
| `generatePayslip` | v1 | ja | Arbetsliv |
| `speglingsMirror` | v1 | ja | Speglar |
| `journalQuickMirror` | v1 | ja | Dagbok |
| `mabraCoach` | v1 | ja | MåBra |
| `breakDownResponse` | v1 | ja | Kompis |
| `getAgentRegistry` | v1 | ja | A2A |
| `invalidateSession` | v1 | ja | Zero Footprint |
| `ingestWidgetRecording` | v1 | ja | WH1 → valv |
| `notifyNewFile` | v1 | ja | Drive webhook → synapse |
| `scheduledRetentionJob` | v1 | ja | G5 retention |
| `scheduledGeneratePayslip` | v1 | ja | Arbetsliv cron |

Full lista: `firebase functions:list --project gen-lang-client-0481875058`

### Python legacy — **DEPRECATED G4 (avvecklad steg 5)**

| Function | Region | Status |
|----------|--------|--------|
| ~~`knowledge-base-webhook`~~ | us-central1 | **raderad** steg 5 2026-05-22 |
| ~~`drive_sync_tool`~~ | us-central1 | **raderad** steg 3 |
| ~~`biff_generator_tool`~~ | us-central1 | **raderad** steg 1 |
| ~~`brusfiltret_tool`~~ | us-central1 | **raderad** steg 1 |

**Ersatt av:** Node stack (europe-west1). **Smoke steg 5:** `smoke:kunskap` + `smoke:dossier` **PASS** 2026-05-22.

---

## Vertex AI Vector Search

### west1 — **KEEP (kanonisk)**

| Resurs | ID / namn | Status |
|--------|-----------|--------|
| Index | `2686894156982255616` (`livskompassen-kv-index`, STREAM, 768 dim) | aktiv |
| Endpoint | `4956462078572363776` (`livskompassen-kv-endpoint`) | aktiv |
| Deployed index | `livskompassen_kv_deployed_v1` | synkad 2026-05-31T00:19:07Z |
| Vectors count | **173** | live (2026-05-31) |

### north1 — **avvecklad steg 6**

| Resurs | ID | Status |
|--------|-----|--------|
| ~~Index~~ | ~~`9094201410823651328`~~ (`kampspar_index`) | **raderad** 2026-05-22 |
| Endpoints | — | 0 (oförändrat) |

**Repo defaults:** [`functions/src/lib/vectorSearchClient.ts`](../functions/src/lib/vectorSearchClient.ts)

---

## Cloud Storage (10 buckets efter legacy-städ 2026-05-22)

| Bucket | Storlek (ca) | Beslut |
|--------|--------------|--------|
| `gen-lang-client-0481875058.firebasestorage.app` | 13 KB | **KEEP** |
| `livskompassen-knowledge-vault-embeddings` | 0 | **KEEP** |
| `livskompassen-knowledge-vault-worm` | 0 | **KEEP** |
| `livskompassenv2` | 0 | **KEEP** (CMEK) |
| `gcf-v2-*` europe-west1 | system | **KEEP** |
| `gen-lang-client-0481875058` | 20 KB | **KEEP** |
| `gen-lang-client-0481875058_cloudbuild` | — | **KEEP** (system) |

Legacy buckets raderade steg 6–7 (2026-05-22) — se arkiv [`GCP-INVENTORY-2026-05-21.md`](archive/GCP-INVENTORY-2026-05-21.md).

---

## Compute Engine

**0 instances** — inga VMs att stänga.

---

## Secret Manager (namn endast)

| Secret | Status | Beslut |
|--------|--------|--------|
| `GEMINI_API_KEY` | finns | **KEEP** |
| `NOTIFY_WEBHOOK_SECRET` | finns | **KEEP** |

---

## SDK / npm (repo)

| Paket | Beslut |
|-------|--------|
| `@cursor/sdk` | **WAIT** — Natt-CI, ej installerad |
| `@dataconnect/generated` | **WAIT** |
| `@google-cloud/notebooks` | **DEPRECATE** (0 imports) |

---

## GAP-status

| ID | Status |
|----|--------|
| G1–G3 | **done** |
| G4 | **done** | All legacy Python borta (steg 1–5) |
| G5 | **done** |
| G6 | **done** | E2E kb_docs PASS 2026-05-22 |
| G7 | **done** | `journal_woven` opt-in 2026-05-22 |
| G8 | **done** | `childrenLogsQuery` Familjen-RAG 2026-05-22 |
| G9 | **done** | EntityProfile / SystemSynapse (2026-05-22) |
| G10 | **done** | Självsorterande inkorg (2026-05-22) |
| G11 | **done** | Mock Kampspar UI-only (2026-05-22) |
| G12 | **done** | Context Cache registry (2026-05-22) |
| G13 | **done** | Tidshjulet → kampspar (2026-05-22) |
| G14 | **done** | Gräns-Arkitekten (2026-05-22) |
| G15 | **done** | Injection-parity i `.context/security.md` 2026-05-22 |
| G16 | **done** | RSD-prompt + PA appendix + U5.5 barn routing **done** 2026-05-22 |
| V1 Genkit | **wait** |

Ny backlog utanför G-serien: [`MODUL-GAP-OVERSIKT.md`](MODUL-GAP-OVERSIKT.md)

---

## Nästa steg (underhåll)

1. **Periodisk refresh** — kör kommandon nedan efter större deploy
2. **Manuell smoke i app** — [`SMOKE_RESULTS.md`](SMOKE_RESULTS.md) **Current truth**
3. **`@cursor/sdk`:** **WAIT** — [`docs/NATT-CI.md`](NATT-CI.md)

---

## Uppdateringskommando

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase functions:list --project gen-lang-client-0481875058
gcloud ai indexes list --region=europe-west1 --project=gen-lang-client-0481875058
gcloud ai index-endpoints describe 4956462078572363776 --region=europe-west1 --project=gen-lang-client-0481875058
gcloud storage ls --project=gen-lang-client-0481875058
gcloud compute instances list --project=gen-lang-client-0481875058
gcloud secrets list --project=gen-lang-client-0481875058
```
