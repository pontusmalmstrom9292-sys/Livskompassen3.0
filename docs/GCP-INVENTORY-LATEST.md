# GCP / Firebase-inventering — LIVE (senast)

**Datum:** 2026-05-22  
**Projekt:** `gen-lang-client-0481875058` (number `1084026575972`)  
**Metod:** `firebase functions:list`, `gcloud ai index-endpoints list`, `gcloud secrets list`, nattpass smoke 2026-05-22  
**Ersätter för beslut:** [`docs/archive/GCP-INVENTORY-2026-05-21.md`](archive/GCP-INVENTORY-2026-05-21.md) (föråldrad: 0 endpoints, valv ej deployad)

---

## Sammanfattning

| Fynd | Status | Gap |
|------|--------|-----|
| `valvChatQuery` deployad (west1) | **done** | G1 |
| Vector endpoint + deployed index `livskompassen_kv_deployed_v1` | **done** | G2 **VERIFY PASS** 2026-05-22 |
| Index `2686894156982255616`, **54 vectors** | **done** | G3 **VERIFY PASS** 2026-05-22 |
| `NOTIFY_WEBHOOK_SECRET` | **finns** — bunden på `notifyNewFile` (401 utan header) | G6 E2E Apps Script kvar |
| Legacy Python (4 fn, us-central1) | **aktiv** | G4 |
| `GEMINI_API_KEY` secret | **finns** | — |

---

## Deployade Cloud Functions

### Node.js (repo — europe-west1)

| Function | I repo | Deployad | Notering |
|----------|--------|----------|----------|
| `knowledgeVaultQuery` | ja | ja (v2) | |
| `valvChatQuery` | ja | ja (v2) | G1 **done** |
| `ingestKampsparEntry` | ja | ja (v1) | |
| `generateEmbedding` | ja | ja (v1) | |
| `analyzeMessage` | ja | ja (v1) | |
| `speglingsMirror` | ja | ja (v1) | |
| `generateDossier` | ja | ja (v1) | |
| `weaveJournalEntry` | ja | ja (v1) | |
| `mabraCoach` | ja | ja (v1) | |
| `breakDownResponse` | ja | ja (v1) | |
| `getAgentRegistry` | ja | ja (v1) | |
| `invalidateSession` | ja | ja (v1) | |
| `notifyNewFile` | ja | ja (v1) | Secret **saknas** → fail-closed |
| `scheduledRetentionJob` | ja | ja (v1) | G5 allowlist i kod |

### Python legacy (ej i aktiv `functions/src/index.ts`)

| Function | Region | Status |
|----------|--------|--------|
| `knowledge-base-webhook` | us-central1 | deployad — G4 |
| `drive_sync_tool` | us-central1 | deployad — G4 |
| `biff_generator_tool` | us-central1 | deployad — G4 |
| `brusfiltret_tool` | us-central1 | deployad — G4 |

---

## Vertex AI Vector Search (west1)

| Resurs | ID / namn | Status |
|--------|-----------|--------|
| Index | `2686894156982255616` (`livskompassen-kv-index`, STREAM, 768 dim) | aktiv |
| Endpoint | `4956462078572363776` (`livskompassen-kv-endpoint`) | aktiv |
| Deployed index | `livskompassen_kv_deployed_v1` | synkad 2026-05-21 |
| Vectors count | 4 | G3 — verifiera ingest/smoke |

**Repo defaults:** [`functions/src/lib/vectorSearchClient.ts`](../functions/src/lib/vectorSearchClient.ts) matchar ovan IDs.  
**Lokal env:** [`functions/.env.gen-lang-client-0481875058`](../functions/.env.gen-lang-client-0481875058)

**VERIFY:** `VECTOR_SEARCH_*` finns **inte** i `gcloud secrets list` — ANN i prod kan använda kod-defaults eller sakna secret-bindning på gen2 functions.

---

## Secret Manager (namn endast)

| Secret | Status |
|--------|--------|
| `GEMINI_API_KEY` | finns |
| `NOTIFY_WEBHOOK_SECRET` | **finns** (2026-05-21) — bunden; POST utan header → 401 |
| `VECTOR_SEARCH_INDEX_ID` | **saknas** (ej blockerande — kod-defaults verifierade 2026-05-22) |

---

## SDK / npm (repo)

| Paket | Plats | Roll planerad | Gör idag | Beslut |
|-------|-------|---------------|----------|--------|
| `firebase` | root | Klient Auth/Firestore/callables | Aktiv | **ACTIVE** |
| `firebase-admin` + `firebase-functions` | functions | Server | Aktiv | **ACTIVE** |
| `@google-cloud/vertexai` | functions | Vertex/Gemini | Installerad | **ACTIVE** (granska vs genai) |
| `@google/genai` | functions | Gemini | `genaiClient.ts`, knowledgeVault | **ACTIVE** |
| `@google/generative-ai` | functions | Legacy Gemini | Endast `docs/archive/server-legacy` | **DEPRECATE** (ej prod) |
| `@google-cloud/aiplatform` | functions | Vector ANN | `vectorSearchClient.ts` | **ACTIVE** |
| `googleapis` | functions | Drive | `driveIngestSynapse` | **ACTIVE** |
| `@google-cloud/firestore` | functions | Retention job | `retentionJob.ts` only | **ACTIVE** (behåll) |
| `@dataconnect/generated` | root | Framtida DC | Ej importerad i app | **WAIT** |
| `@google-cloud/notebooks` | root | — | 0 imports i src | **DEPRECATE** (ta bort vid cleanup) |
| `@cursor/sdk` | — | Natt-CI | Saknas | **WAIT** |

---

## GCP-tjänster (konsol)

| Tjänst | Beslut | Notering |
|--------|--------|----------|
| Firestore + WORM rules | **ACTIVE** | |
| Firebase Auth | **ACTIVE** | |
| Firebase Hosting | **ACTIVE** | |
| Cloud Functions Node west1 | **ACTIVE** | Lista matchar repo |
| Cloud Functions Python us-central1 | **DEPRECATE** | G4 |
| Vertex Vector Search | **ACTIVE** | Endpoint deployad |
| Vertex/Gemini API | **ACTIVE** | GEMINI secret |
| Cloud Storage | **ACTIVE** | WORM/embedding buckets |
| Secret Manager | **VERIFY** | NOTIFY saknas |
| Cloud Scheduler | **ACTIVE** | retention job |
| Data Connect | **WAIT** | example only |
| Firebase MCP (Cursor) | **ACTIVE** | plugin i `.cursor/settings.json` |

---

## GAP-status (synkad 2026-05-21)

| ID | Status | Bevis |
|----|--------|-------|
| G1 | **done** | `valvChatQuery` i `firebase functions:list` |
| G2 | **done** | VERIFY PASS 2026-05-22 — 54 vectors, defaults |
| G3 | **done** | VERIFY PASS 2026-05-22 — embeddingDim 768, indexSync |
| G4 | **open** | 4 Python functions live — kartlagt nattpass |
| G5 | **done** | Kod allowlist (multitask) |
| G6 | **open** | Secret finns; Apps Script E2E kvar |
| G7–G14 | **open** | Se [`Arkiv-GAP-REGISTER.md`](specs/incoming/Arkiv-GAP-REGISTER.md) |
| V1 Genkit Flow | **wait** | Vision — ej migrera |
| V2 Dotprompt | **n/a** | Kanon = `sharedRules.ts` |

---

## Uppdateringskommando

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen2.0
firebase functions:list --project gen-lang-client-0481875058
gcloud ai index-endpoints list --region=europe-west1 --project=gen-lang-client-0481875058
gcloud secrets list --project=gen-lang-client-0481875058
```

---

## Nästa steg (efter grund-låsning)

1. **Manuellt:** `firebase functions:secrets:set NOTIFY_WEBHOOK_SECRET` + Drive smoke → [`docs/SMOKE_RESULTS.md`](SMOKE_RESULTS.md)
2. **`kör G4`** — kartlägg/avveckla legacy Python (separat session)
3. **`kör G7`** — `journal_woven` synaps (separat session)
