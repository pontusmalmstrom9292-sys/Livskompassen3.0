---
name: livskompassen-vector-search
description: Vertex AI Vector Search for Livskompassen Minne — indexes, endpoints, embeddings, VECTOR_SEARCH_* env. Use when wiring ANN or GCP provisioning.
---

# Vector Search

## GCP inventory (gen-lang-client-0481875058) — live 2026-05-22

| Index | Region | ID suffix | Status |
|-------|--------|-----------|--------|
| `livskompassen-kv-index` | europe-west1 | `2686894156982255616` | **KANONISK** — STREAM, 102 vectors |
| `kampspar_index` | europe-north1 | `9094201410823651328` | **DEPRECATE** — BATCH, 0 endpoints |

**Endpoint (west1):** `4956462078572363776` (`livskompassen-kv-endpoint`)  
**Deployed index:** `livskompassen_kv_deployed_v1`

Live sanning: [`docs/GCP-INVENTORY-LATEST.md`](../../docs/GCP-INVENTORY-LATEST.md)

## Repo files

- [`scripts/setup_vector_search_west1.sh`](../../scripts/setup_vector_search_west1.sh)
- [`functions/src/lib/vectorSearchClient.ts`](../../functions/src/lib/vectorSearchClient.ts)
- [`functions/src/lib/generateEmbeddingInternal.ts`](../../functions/src/lib/generateEmbeddingInternal.ts)
- [`functions/src/lib/kampsparQueryRag.ts`](../../functions/src/lib/kampsparQueryRag.ts) — ANN + token-match fallback

## MUST

- Use **europe-west1** index (same region as Functions).
- Fallback to token-match if ANN fails.
- Store `embeddingDim` on ingest when embeddings succeed.

## MUST NOT

- Deploy two live ANN paths without documenting canonical index.
- Wire north1 `kampspar_index` as prod (west1 is kanon).

## Env vars

Optional in Secret Manager; kod-defaults i `vectorSearchClient.ts` räcker (verifierat 2026-05-22).

## GAP

G2/G3 **done**. north1-index avveckling — se [`GCP-KONSOLIDERING-BESLUT.md`](../../docs/GCP-KONSOLIDERING-BESLUT.md) steg 6.
