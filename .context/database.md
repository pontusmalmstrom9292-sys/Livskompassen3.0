# Databas och Kunskapsvalvet

Grunden för Livskompassen v2 är "Kunskapsvalvet" (The Knowledge Vault), implementerat för extrem säkerhet och snabb semantisk hämtning (RAG).

**Canonical arkiv:** [`.context/arkiv-minne.md`](./arkiv-minne.md) · **GCP live:** [`docs/archive/GCP-INVENTORY-2026-05-21.md`](../docs/archive/GCP-INVENTORY-2026-05-21.md)

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

## Vektorsökning och RAG (repo vs GCP 2026-05-21)

| Lager | Repo | GCP |
|-------|------|-----|
| Retrieval (prod) | Token-match [`kampsparQueryRag.ts`](../functions/src/lib/kampsparQueryRag.ts) | — |
| Vector Search index | Stub env `VECTOR_SEARCH_INDEX_ID` | **2 index**, **0 endpoints** |
| Embeddings | `generateEmbeddingInternal.ts` | Buckets `livskompassen-knowledge-vault-*` |
| Inbäddningsmodell | `textembedding-gecko` / `text-embedding-004` | 768 dim i index metadata |
| LLM syntes | `GEMINI_API_KEY` secret | Satt på `knowledgeVaultQuery` |

**Kanoniska index (välj vid wire):**

- `projects/1084026575972/locations/europe-west1/indexes/2686894156982255616` (`livskompassen-kv-index`)
- `projects/1084026575972/locations/europe-north1/indexes/9094201410823651328` (`kampspar_index`)

**GAP:** Deploy endpoint + wire ANN — se [`Arkiv-GAP-REGISTER.md`](../docs/specs/incoming/Arkiv-GAP-REGISTER.md) G2.

## Kunskapsbank (blueprint → kod)

`firebase-blueprint.json`: `KnowledgeFolder`, `KnowledgeDoc`, `KnowledgeMedia` → runtime: `kb_docs` + Drive `folderId`, `driveFileId`.

## Kontextuell isolering

- Agenter läser endast sin silo (Valv-Chat ≠ Kunskap).
- Vävaren (`kampsparRag.ts`) läser journal+valv+kampspar för **metadata-tagging** — skild från användar-facing Kunskap-chat.
- Memory Management: ADK SynapseBus + Zero Footprint (`clearSynapseState`).

## Legacy (GCP, ej i aktiv repo)

Python functions `us-central1`: `knowledge-base-webhook`, `drive_sync_tool` — kartlägg/avveckla (GAP G4).
