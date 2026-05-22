# Databas och Kunskapsvalvet

Grunden för Livskompassen v2 är "Kunskapsvalvet" (The Knowledge Vault), implementerat för extrem säkerhet och snabb semantisk hämtning (RAG).

**Canonical arkiv:** [`.context/arkiv-minne.md`](./arkiv-minne.md) · **GCP live:** [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md)

## Tre silor (MUST NOT blandas)

| Silo | Firestore | RAG callable | Agent |
|------|-----------|--------------|-------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | Livs-Arkivarien |
| Valv | `reality_vault` | `valvChatQuery` | Sannings-Analytikern |
| Barnen | `children_logs` | — (Dossier read) | Plan: Mönster-Arkivarien |

## Databasarkitektur

- **Teknologi:** Cloud Firestore (appmoduler); Data Connect avvaktas för ekonomi.
- **Säkerhetskrav:** Customer-Managed Encryption Keys (CMEK) via Cloud KMS där bucket/Firestore policy kräver det (`scripts/setup_gcp_cmek.sh`, `gs://livskompassenv2`).
- **Permanent minne:** WORM collections (`children_logs`, `reality_vault`, `journal`, `dossier_snapshots`) — retention får **inte** radera dessa.

## Vektorsökning och RAG (repo vs GCP 2026-05-22)

| Lager | Repo | GCP |
|-------|------|-----|
| Retrieval (prod) | ANN + token-match fallback [`kampsparQueryRag.ts`](../functions/src/lib/kampsparQueryRag.ts) | Endpoint live west1 |
| Vector Search index | [`vectorSearchClient.ts`](../functions/src/lib/vectorSearchClient.ts) defaults | **west1 kanonisk**, 102 vectors |
| Embeddings | `generateEmbeddingInternal.ts` | Buckets `livskompassen-knowledge-vault-*` |
| Inbäddningsmodell | `text-embedding-004` | 768 dim |
| LLM syntes | `GEMINI_API_KEY` secret | Satt på `knowledgeVaultQuery` |

**Kanoniskt index (prod):**

- `projects/1084026575972/locations/europe-west1/indexes/2686894156982255616` (`livskompassen-kv-index`)
- Endpoint `4956462078572363776`, deployed `livskompassen_kv_deployed_v1`

**Avvecklas:** `kampspar_index` north1 (BATCH, 0 endpoints) — se [`GCP-KONSOLIDERING-BESLUT.md`](../docs/GCP-KONSOLIDERING-BESLUT.md).

**GAP:** G2/G3/G4 **done** (2026-05-22). Öppet: G7–G14 i [`Arkiv-GAP-REGISTER.md`](../docs/specs/modules/Arkiv-GAP-REGISTER.md).

## Kunskapsbank (blueprint → kod)

`firebase-blueprint.json`: `KnowledgeFolder`, `KnowledgeDoc`, `KnowledgeMedia` → runtime: `kb_docs` + Drive `folderId`, `driveFileId`.

## Kontextuell isolering

- Agenter läser endast sin silo (Valv-Chat ≠ Kunskap).
- Vävaren (`kampsparRag.ts`) läser journal+valv+kampspar för **metadata-tagging** — skild från användar-facing Kunskap-chat.
- Memory Management: ADK SynapseBus + Zero Footprint (`clearSynapseState`).

## Legacy (GCP, avvecklad)

Python functions `us-central1`: **0 kvar** (G4 **done** 2026-05-22). Se [`LEGACY-KB-MIGRATION-2026-05-22.md`](../docs/LEGACY-KB-MIGRATION-2026-05-22.md).
