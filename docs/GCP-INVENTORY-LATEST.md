# GCP / Firebase-inventering — LIVE (senast)

**Datum:** 2026-05-22 (U6 live audit · FAS4 steg 1 klart)  
**Projekt:** `gen-lang-client-0481875058` (number `1084026575972`)  
**Metod:** `firebase functions:list`, `gcloud ai indexes/endpoints list`, `gcloud storage du`, `gcloud compute instances list`, `gcloud secrets list`  
**Beslut:** [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md)  
**Ersätter för beslut:** [`docs/archive/GCP-INVENTORY-2026-05-21.md`](archive/GCP-INVENTORY-2026-05-21.md)

---

## Sammanfattning

| Fynd | Status | Gap |
|------|--------|-----|
| `valvChatQuery` deployad (west1) | **done** | G1 |
| Vector endpoint + `livskompassen_kv_deployed_v1` | **done** | G2 **VERIFY PASS** |
| Index west1, **102 vectors** | **done** | G3 **VERIFY PASS** |
| `NOTIFY_WEBHOOK_SECRET` | **finns** | G6 **done** — E2E kb_docs 2026-05-22 |
| Legacy Python (2 fn kvar, us-central1) | **delvis avvecklad** | G4 — steg 1 **done** 2026-05-22 |
| Compute Engine VMs | **0** | — |
| `@cursor/sdk` | **saknas** | **WAIT** (Natt-CI) |

---

## Deployade Cloud Functions

### Node.js (repo — europe-west1) — **KEEP**

| Function | Version | I repo |
|----------|---------|--------|
| `knowledgeVaultQuery` | v2 | ja |
| `valvChatQuery` | v2 | ja |
| `ingestKampsparEntry` | v1 | ja |
| `generateEmbedding` | v1 | ja |
| `analyzeMessage` | v1 | ja |
| `speglingsMirror` | v1 | ja |
| `generateDossier` | v1 | ja |
| `weaveJournalEntry` | v1 | ja |
| `mabraCoach` | v1 | ja |
| `breakDownResponse` | v1 | ja |
| `getAgentRegistry` | v1 | ja |
| `invalidateSession` | v1 | ja |
| `notifyNewFile` | v1 | ja |
| `scheduledRetentionJob` | v1 | ja |

### Python legacy (ej i `functions/src/index.ts`) — **DEPRECATE G4**

| Function | Region | Runtime | Memory | Status |
|----------|--------|---------|--------|--------|
| `knowledge-base-webhook` | us-central1 | python312 | ~3.8 GB | aktiv |
| `drive_sync_tool` | us-central1 | python311 | ~244 MB | aktiv |
| ~~`biff_generator_tool`~~ | us-central1 | python311 | — | **raderad** steg 1 |
| ~~`brusfiltret_tool`~~ | us-central1 | python311 | — | **raderad** steg 1 |

**Ersatt av:** `analyzeMessage` (Node, europe-west1). **Smoke steg 1:** `smoke:valv` **PASS** 2026-05-22.

---

## Vertex AI Vector Search

### west1 — **KEEP (kanonisk)**

| Resurs | ID / namn | Status |
|--------|-----------|--------|
| Index | `2686894156982255616` (`livskompassen-kv-index`, STREAM, 768 dim) | aktiv |
| Endpoint | `4956462078572363776` (`livskompassen-kv-endpoint`) | aktiv |
| Deployed index | `livskompassen_kv_deployed_v1` | synkad 2026-05-22T09:03:05Z |
| Vectors count | **102** | live |

### north1 — **DEPRECATE**

| Resurs | ID | Status |
|--------|-----|--------|
| Index | `9094201410823651328` (`kampspar_index`, BATCH) | **0 endpoints**, inga vectors |
| Endpoints | — | 0 items |

**Repo defaults:** [`functions/src/lib/vectorSearchClient.ts`](../functions/src/lib/vectorSearchClient.ts)

---

## Cloud Storage (20 buckets)

| Bucket | Storlek (ca) | Beslut |
|--------|--------------|--------|
| `gen-lang-client-0481875058.firebasestorage.app` | 13 KB | **KEEP** |
| `livskompassen-knowledge-vault-embeddings` | 0 | **KEEP** |
| `livskompassen-knowledge-vault-worm` | 0 | **KEEP** |
| `livskompassenv2` | 0 | **KEEP** (CMEK) |
| `gcf-v2-*` europe-west1 | system | **KEEP** |
| `knowledge-base-bucket-gen-lang-client-0481875058` | 10 KB | **MIGRATE → DEPRECATE** |
| `knowledge-base-docs-gen-lang-client-0481875058` | 0 | **DEPRECATE** |
| `gcf-v2-*` us-central1` | 9 KB | **DEPRECATE** |
| `1084026575972-us-central1-blueprint-config` | 4 MB | **DEPRECATE** |
| `ekonomichefen` | 0 | **DEPRECATE** |
| `helthcoach` | 0 | **DEPRECATE** |
| `media-gen-lang-client-0481875058-0ebe` | 0 | **DEPRECATE** |
| `ai-studio-bucket-1084026575972-europe-west2` | **121 MB** | **VERIFY** |
| `cloud-ai-platform-365ee315-6b86-4041-b623-5121d5135266` | **69 MB** | **VERIFY** |
| `gen-lang-client-0481875058` | 20 KB | **KEEP** |
| `gen-lang-client-0481875058_cloudbuild` | — | **KEEP** (system) |

---

## Compute Engine

**0 instances** — inga VMs att stänga.

---

## Secret Manager (namn endast)

| Secret | Status | Beslut |
|--------|--------|--------|
| `GEMINI_API_KEY` | finns | **KEEP** |
| `NOTIFY_WEBHOOK_SECRET` | finns | **KEEP** |
| `django_admin_password-0ebe` | finns | **DEPRECATE** (legacy) |
| `django_settings-0ebe` | finns | **DEPRECATE** (legacy) |

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
| G4 | **open** — 2 Python fn kvar (steg 1 done: biff/brusfiltret borta) |
| G5 | **done** |
| G6 | **done** | E2E kb_docs PASS 2026-05-22 |
| G7–G14 | **open** |
| G15–G16 | **open** — Grunder U1–U5 ([`GRUNDER-UTVARDERING-RESULTAT.md`](specs/incoming/GRUNDER-UTVARDERING-RESULTAT.md)) |
| V1 Genkit | **wait** |

---

## Nästa steg

1. **FAS4 steg 1 klart** — `biff_generator_tool` + `brusfiltret_tool` raderade; `smoke:valv` PASS
2. **Nästa:** `OK steg 3` — avveckla `drive_sync_tool` ([`GCP-FAS4-RUNBOOK.md`](GCP-FAS4-RUNBOOK.md))
3. **Grunder:** [`GRUNDER-UTVARDERING-RESULTAT.md`](specs/incoming/GRUNDER-UTVARDERING-RESULTAT.md)
4. **`@cursor/sdk`:** **WAIT** — [`docs/NATT-CI.md`](NATT-CI.md)

---

## Uppdateringskommando

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen2.0
firebase functions:list --project gen-lang-client-0481875058
gcloud ai indexes list --region=europe-west1 --project=gen-lang-client-0481875058
gcloud ai index-endpoints list --region=europe-west1 --project=gen-lang-client-0481875058
gcloud storage ls --project=gen-lang-client-0481875058
gcloud compute instances list --project=gen-lang-client-0481875058
gcloud secrets list --project=gen-lang-client-0481875058
```
