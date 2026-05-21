# GCP / Firebase-inventering — gen-lang-client-0481875058

**Datum:** 2026-05-21  
**Projekt:** `gen-lang-client-0481875058` (project number `1084026575972`)  
**Metod:** `gcloud`, Firebase MCP, `firebase functions:list`  
**Syfte:** Live-sanning för Hela arkivet / Kunskapsvalv — jämför mot repo och Repomix.

---

## Sammanfattning (kritiska fynd)

| Fynd | Status | Konsekvens |
|------|--------|------------|
| **2 Vector Search-index** finns i GCP | Index skapade, **0 endpoints deployade** | ANN kan inte anropas — appen kör token-match |
| `VECTOR_SEARCH_INDEX_ID` | **Saknas** på `knowledgeVaultQuery` | Kod-stub i `kampsparRag.ts` / `kampsparQueryRag.ts` |
| `valvChatQuery` | Finns i **repo**, **ej deployad** | Valv-Chat RAG fungerar inte i prod tills deploy |
| Legacy Python RAG (`us-central1`) | **4 functions deployade** | Parallell stack — ej i aktiv `functions/` repo |
| `notifyNewFile` | **Deployad** (europe-west1) | Motstrider äldre system-plan — webhook-secret status okänd |
| WORM GCS bucket | `livskompassen-knowledge-vault-worm` | 30 dagars retention policy — **inte** samma som Firestore WORM |
| Kunskap RAG smoke | PASS | `knowledgeVaultQuery` + `ingestKampsparEntry` + `GEMINI_API_KEY` |

---

## Firebase-miljö

| | |
|---|---|
| **Aktivt projekt** | `gen-lang-client-0481875058` |
| **Auth user** | pontus.malmstrom9292@gmail.com |
| **Billing** | Enabled |
| **Hosting** | https://gen-lang-client-0481875058.web.app |
| **Functions region (Node)** | `europe-west1` |

---

## Deployade Cloud Functions

### Node.js (Livskompassen2.0 repo — europe-west1)

| Function | Trigger | Deployed | I repo |
|----------|---------|----------|--------|
| `knowledgeVaultQuery` | callable v2 | ja | ja |
| `ingestKampsparEntry` | callable v1 | ja | ja |
| `generateEmbedding` | callable v1 | ja | ja |
| `analyzeMessage` | callable v1 | ja | ja |
| `speglingsMirror` | callable v1 | ja | ja |
| `generateDossier` | callable v1 | ja | ja |
| `weaveJournalEntry` | callable v1 | ja | ja |
| `mabraCoach` | callable v1 | ja | ja |
| `breakDownResponse` | callable v1 | ja | ja |
| `getAgentRegistry` | callable v1 | ja | ja |
| `invalidateSession` | callable v1 | ja | ja |
| `notifyNewFile` | https v1 | ja | ja |
| `scheduledRetentionJob` | scheduled v1 | ja | ja |
| **`valvChatQuery`** | callable v2 | **nej** | **ja** |

### Python (legacy / Google Solution — us-central1)

| Function | Runtime | Trolig källa |
|----------|---------|--------------|
| `knowledge-base-webhook` | python312 | Generative AI Knowledge Base solution |
| `drive_sync_tool` | python311 | Drive → knowledge base |
| `biff_generator_tool` | python311 | Tidig agent-prototyp |
| `brusfiltret_tool` | python311 | Tidig agent-prototyp |

**Notering:** Dessa är **inte** i nuvarande `functions/src/index.ts`. Risk för dubbel RAG/Drive-pipeline om båda aktiva.

---

## Vertex AI Vector Search

### Index (finns)

| displayName | Region | Index ID (suffix) | updateMethod | dimensions |
|-------------|--------|-------------------|--------------|------------|
| `kampspar_index` | europe-north1 | `9094201410823651328` | BATCH_UPDATE | 768 |
| `livskompassen-kv-index` | europe-west1 | `2686894156982255616` | STREAM_UPDATE | 768 |

Fulla resursnamn:

```
projects/1084026575972/locations/europe-north1/indexes/9094201410823651328
projects/1084026575972/locations/europe-west1/indexes/2686894156982255616
```

### Endpoints (saknas)

```
gcloud ai index-endpoints list --region=europe-north1  → 0 items
gcloud ai index-endpoints list --region=europe-west1   → 0 items
```

**GAP:** Index utan endpoint = ingen live ANN-sökning. Kör deploy-steg i `scripts/setup_vector_search.sh` eller motsvarande för vald region.

### Function env

`knowledgeVaultQuery` (gen2):

- `GEMINI_API_KEY` — secret version 1 (satt)
- **`VECTOR_SEARCH_INDEX_ID`** — **saknas**
- **`VECTOR_SEARCH_ENDPOINT_ID`** — **saknas**

---

## Cloud Storage (arkiv-relevant)

| Bucket | Region | Syfte |
|--------|--------|-------|
| `livskompassen-knowledge-vault-embeddings` | europe-north1 | Embeddings för Kunskapsvalv |
| `livskompassen-knowledge-vault-worm` | europe-north1 | WORM-lager (30d retention policy) |
| `knowledge-base-bucket-gen-lang-client-0481875058` | us-central1 | Google Solution: generative-ai-knowledge-base |
| `knowledge-base-docs-gen-lang-client-0481875058` | us-central1 | Google Solution: dokument |
| `gen-lang-client-0481875058.firebasestorage.app` | us-east1 | Firebase Storage (valv-media) |
| `livskompassenv2` | EU multi | CMEK bucket (setup_gcp_cmek) |

---

## Aktiverade API:er (urval)

- `aiplatform.googleapis.com`
- `cloudfunctions.googleapis.com`
- `cloudscheduler.googleapis.com`
- `firestore.googleapis.com`

---

## Repo vs moln — gap-register (kort)

| # | Gap | Prioritet |
|---|-----|-----------|
| G1 | Deploy `valvChatQuery` | Hög |
| G2 | Deploy index → endpoint → wire ANN i `kampsparQueryRag.ts` | Hög |
| G3 | Sätt `VECTOR_SEARCH_INDEX_ID` (+ endpoint) på functions | Hög |
| G4 | Fixa `embeddingDim null` (textembedding-gecko/gecko i prod) | Medel |
| G5 | Kartlägg/avveckla legacy Python RAG (us-central1) | Medel |
| G6 | Align retention: GCS WORM 30d vs Firestore permanent minne | Medel |
| G7 | `journal_woven` synaps (stub → riktig) | Planerat |
| G8 | Familjen-RAG callable (ej Valv-Chat) | Planerat |

Full lista: [`docs/specs/incoming/Arkiv-GAP-REGISTER.md`](../specs/incoming/Arkiv-GAP-REGISTER.md)  
Konsolidering: [`docs/archive/repomix/KONSOLIDERING-2026-05-21.md`](repomix/KONSOLIDERING-2026-05-21.md)

---

## Uppdateringsinstruktion

Kör om inventering efter större deploy:

```bash
gcloud config set project gen-lang-client-0481875058
gcloud ai indexes list --region=europe-north1
gcloud ai indexes list --region=europe-west1
gcloud ai index-endpoints list --region=europe-west1
firebase functions:list
```
