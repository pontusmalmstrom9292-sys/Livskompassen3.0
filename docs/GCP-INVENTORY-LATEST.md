# GCP / Firebase-inventering — LIVE (senast)

**Datum:** 2026-05-22 (U6 live audit · FAS4 steg 1–7 klart · Grunder GAP pass)  
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
| Legacy Python (0 fn kvar) | **avvecklad** | G4 **done** — steg 1–5 2026-05-22 |
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
| `journalWovenToKampspar` | v1 | ja |
| `childrenLogsQuery` | v2 | ja |
| `mabraCoach` | v1 | ja |
| `breakDownResponse` | v1 | ja |
| `getAgentRegistry` | v1 | ja |
| `invalidateSession` | v1 | ja |
| `notifyNewFile` | v1 | ja |
| `scheduledRetentionJob` | v1 | ja |

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
| Deployed index | `livskompassen_kv_deployed_v1` | synkad 2026-05-22T09:03:05Z |
| Vectors count | **102** | live |

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
| ~~`knowledge-base-bucket-gen-lang-client-0481875058`~~ | — | **raderad** legacy pass |
| ~~`knowledge-base-docs-gen-lang-client-0481875058`~~ | — | **raderad** legacy pass |
| ~~`gcf-v2-*` us-central1~~ | — | **raderad** legacy pass |
| ~~`1084026575972-us-central1-blueprint-config`~~ | — | **raderad** legacy pass |
| ~~`ekonomichefen`~~ | — | **raderad** steg 6 |
| ~~`helthcoach`~~ | — | **raderad** steg 6 |
| ~~`media-gen-lang-client-0481875058-0ebe`~~ | — | **raderad** steg 6 |
| ~~`ai-studio-bucket-1084026575972-europe-west2`~~ | — | **raderad** steg 7 (121 MB experiment) |
| ~~`cloud-ai-platform-365ee315-6b86-4041-b623-5121d5135266`~~ | — | **raderad** steg 7 (69 MB prompt-data) |
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
| ~~`django_admin_password-0ebe`~~ | — | **raderad** steg 6 |
| ~~`django_settings-0ebe`~~ | — | **raderad** steg 6 |

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
| G9–G14 | **open** |
| G15 | **done** | Injection-parity i `.context/security.md` 2026-05-22 |
| G16 | **done** | RSD-prompt + PA appendix + U5.5 barn routing **done** 2026-05-22 |
| V1 Genkit | **wait** |

---

## Nästa steg

1. **Grunder U1–U5 runtime klart** — U2.5 HITL + U5.5 routing + G7 journal_woven
2. **GCP legacy buckets städade** — 5 buckets borta (2026-05-22)
3. **G9 EntityProfile done** (2026-05-22) — nästa: G10–G14 enligt [`Arkiv-GAP-REGISTER.md`](specs/modules/Arkiv-GAP-REGISTER.md)
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
