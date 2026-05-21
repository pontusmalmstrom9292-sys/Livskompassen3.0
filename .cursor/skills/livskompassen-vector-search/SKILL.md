---
name: livskompassen-vector-search
description: Vertex AI Vector Search for Livskompassen Minne — indexes, endpoints, embeddings, VECTOR_SEARCH_* env. Use when wiring ANN or GCP provisioning.
---

# Vector Search

## GCP inventory (gen-lang-client-0481875058)

| Index | Region | ID suffix |
|-------|--------|-----------|
| `livskompassen-kv-index` | europe-west1 | `2686894156982255616` |
| `kampspar_index` | europe-north1 | `9094201410823651328` |

**Endpoints:** 0 deployed (2026-05-21) — ANN blocked until deploy.

## Repo files

- [`scripts/setup_vector_search.sh`](../../scripts/setup_vector_search.sh)
- [`functions/src/lib/generateEmbeddingInternal.ts`](../../functions/src/lib/generateEmbeddingInternal.ts)
- [`functions/src/lib/kampsparQueryRag.ts`](../../functions/src/lib/kampsparQueryRag.ts) — wire ANN here

## MUST

- Prefer **europe-west1** index (same region as Functions).
- Fallback to token-match if ANN fails.
- Store `embeddingDim` on ingest when embeddings succeed.

## MUST NOT

- Deploy two live ANN paths without documenting canonical index.

## Env vars

See `.env.example`: `VECTOR_SEARCH_INDEX_ID`, `VECTOR_SEARCH_ENDPOINT_ID`, `VECTOR_SEARCH_DEPLOYED_INDEX_ID`.

## GAP

See [`Arkiv-GAP-REGISTER.md`](../../docs/specs/incoming/Arkiv-GAP-REGISTER.md) G2, G3.
