---
name: livskompassen-vector-search
description: Firestore Native Vector Search (findNearest) for Livskompassen Kunskap Minne — embeddings 768, kampspar/kb_docs ANN + lexical hybrid. Vertex is DECOMMISSIONED.
---

> **Register:** `docs/prompts/PROMPTER-SKILLS-FUNKTIONER-REGISTER.md` · Runtime-prompter: `npm run prompts:sync`

# Vector Search — Firestore Native (Evigt Minne)

**Status 2026-07-18:** Vertex AI Vector Search / Matching Engine / `aiplatform` = **DECOMMISSIONED forever**.  
Canonical path: **Firestore `findNearest` COSINE** on `kampspar` + `kb_docs` (dim **768**) + Gemini embeddings + lexical hybrid (RRF).

## MUST

- Use [`functions/src/lib/kampsparQueryRag.ts`](../../functions/src/lib/kampsparQueryRag.ts) for Kunskap RAG.
- Use [`functions/src/lib/generateEmbeddingInternal.ts`](../../functions/src/lib/generateEmbeddingInternal.ts) (768-dim).
- Keep token/lexical path as hybrid partner — not ANN-only.
- Respect three silos — never fuse Valv/Barnen into Kunskap RAG.
- Cost-guard: `aiplatform.googleapis.com` stays in **blockedApis**.

## MUST NOT

- Re-enable Vertex / IndexEndpoint / Matching Engine.
- Run `scripts/setup_vector_search*.sh` (stubs exit 1).
- Import or recreate `vectorSearchClient.ts`.
- Cross-RAG or “sök allt”.
- Soft-delete Minne docs.

## Indexes

See `firestore.indexes.json` — composite `ownerId` + `embedding` vectorConfig 768 for `kampspar` and `kb_docs`.

## Runbooks

- [`docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md`](../../docs/runbooks/VECTOR-SEARCH-DECOMMISSION.md)
- Evigt Minne YOLO: `npm run minne:yolo:build` (auto v55–v60)

## GAP

Vertex revival = PMIR hard NO-GO. Embedding model migration stays at 768 dims.
