# Arkiv-GAP-REGISTER — implementation efter låsning

**Datum:** 2026-05-21 (konsoliderad)  
**Regel:** Implementera **inte** kod förrän användaren säger `kör [GAP]`.  
**Källor:** [`KONSOLIDERING-2026-05-21.md`](../../archive/repomix/KONSOLIDERING-2026-05-21.md), [`GCP-INVENTORY-2026-05-21.md`](../../archive/GCP-INVENTORY-2026-05-21.md), [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md).

---

## Prioritet 1 — Prod-gaps (blockerar hela arkivet)

### G1 — Deploy `valvChatQuery`

| | |
|---|---|
| **Problem** | Finns i `functions/src/index.ts`, **ej** i `firebase functions:list` |
| **Effekt** | Valv-Chat Sök fungerar inte i prod |
| **Åtgärd** | `firebase deploy --only functions:valvChatQuery` + smoke valv |
| **Säkerhet** | Endast `reality_vault`; Zero Footprint session |
| **Källa** | GCP inventory, alla Repomix-analyser |

### G2 — Vector Search endpoint + ANN wire

| | |
|---|---|
| **Problem** | 2 index i GCP, **0 endpoints**; kod stub |
| **Index (välj en)** | west1 `2686894156982255616` (STREAM) **rekommenderas** (samma region som Functions) |
| **Alternativ** | north1 `9094201410823651328` (BATCH) — skript pekar hit idag |
| **Produkt** | Vertex AI **Vector Search ANN** — **inte** Vertex AI Search Data Store (repomix-linjen) |
| **Åtgärd** | `gcloud ai index-endpoints create` + `deploy-index`; sätt env `VECTOR_SEARCH_INDEX_ID`, `VECTOR_SEARCH_ENDPOINT_ID` |
| **Kod** | `functions/src/lib/kampsparQueryRag.ts` — ANN query, fallback token-match |
| **Skript** | [`scripts/setup_vector_search.sh`](../../scripts/setup_vector_search.sh) (uppdatera region till west1 om kanonisk) |

### G3 — Embeddings live (`embeddingDim null`)

| | |
|---|---|
| **Problem** | `generateEmbeddingInternal.ts` / ingest — dimension null i smoke |
| **Åtgärd** | Verifiera Vertex Publisher API + modell `textembedding-gecko` eller `text-embedding-004` i `europe-west1` |
| **Koppling** | Upsert vectors till valt index vid `ingestKampsparEntry` |

---

## Prioritet 2 — Arkitekturhygien

### G4 — Legacy Python RAG (us-central1)

| Function | Action |
|----------|--------|
| `knowledge-base-webhook` | Kartlägg dataflöde → migrera till Node `notifyNewFile` eller avveckla |
| `drive_sync_tool` | Undvik dubbel Drive-ingest |
| `biff_generator_tool`, `brusfiltret_tool` | Ersatt av Node `analyzeMessage` |

**Kontext:** Repomix XML/cursor = Vertex AI Search + Cloud Run-linjen; GCP har **båda** stackarna live.

### G5 — Retention vs permanent minne

| | |
|---|---|
| **Problem** | `retentionJob.ts` purgar `users/{uid}/kampspar`; live data = top-level `kampspar` |
| **GCS** | `livskompassen-knowledge-vault-worm` har 30d retention |
| **Åtgärd** | Explicit allowlist: **aldrig** radera `children_logs`, `reality_vault`, `journal`, `dossier_snapshots`, top-level `kampspar` WORM |
| **Källa** | walkthrough legacy path ≠ prod; repomix output.txt T6 |

### G6 — Drive smoke end-to-end

| | |
|---|---|
| **Status** | `notifyNewFile` deployad; Apps Script + `NOTIFY_WEBHOOK_SECRET` okänd |
| **Åtgärd** | [`docs/DRIVE_AUTOMATION.md`](../../DRIVE_AUTOMATION.md) manuell verifiering |

### G11 — Mock `Kampspar`-typ vs `KampsparEntry`

| | |
|---|---|
| **Problem** | `src/modules/kompis/types/kompis.ts` har mock `Kampspar` (challenge/milestone/routine) identisk med repomix output.txt |
| **Risk** | Felkoppling till ingest — WORM-schema är `KampsparEntry` |
| **Åtgärd** | Isolera/renamna mock till UI-only; dokumentera i komponent; aldrig skicka till `ingestKampsparEntry` |
| **Källa** | ANALYS-repomix-output.txt T1/T2 |

---

## Prioritet 3 — Life OS utbyggnad

### G7 — `journal_woven` synaps

Stub i `synapseBus.ts` → opt-in sammanfattning till `kampspar` (policy).

### G8 — Familjen-RAG

Ny callable: `childrenLogsQuery` + Mönster-Arkivarien. **MUST NOT** route via `valvChatQuery`.

### G9 — EntityProfile / SystemSynapse

Blueprint (`firebase-blueprint.json`) → Firestore schema + agent grounding. Repomix hade `actors`, `VaultMap`, `KEY_ENTITIES`.

### G10 — Självsorterande inkorg

Kunskap-SPEC §12 — GCS/Vertex auto-tag. Repomix `SuperArchive`-koncept — **MUST NOT** spara bevis till `kb_docs`.

### G12 — Context Cache delad registry

| | |
|---|---|
| **Problem** | `vertexCache.ts` — TTL 1h, in-memory registry; deploy-status okänd |
| **Åtgärd** | Beslut: Firestore-backed vs in-memory; koppla till DCAP/RAG-kostnad |
| **Källa** | baseline backend-analys |

### G13 — Tidshjulet → `kampspar`-historik

UI (`Tidshjulet.tsx`) har "Dåtid (Kampspår)"-ring; repomix hade statiska noder. Wire till live `kampspar` + ev. Mönster-Arkivarien.

### G14 — Gräns-Arkitekten agent card

| | |
|---|---|
| **Problem** | Nämns i repomix `SYSTEM_MEMORY.md` + UI; **saknas** i `functions/src/agents/cards/` |
| **Beslut** | Nionde agent card **eller** merge med BIFF-Skölden / `analyzeMessage` |
| **Källa** | cursor.txt + walkthrough legacy |

---

## Dokumentation (konsolidering 2026-05-21)

- [x] `.context/arkiv-minne.md` — terminologifällor, legacy schema, G11–G14
- [x] `Arkiv-SPEC.md` — Appendix E/F, säkerhet, status
- [x] `Arkiv-GAP-REGISTER.md` — denna fil (G11–G14 tillagda)
- [x] `docs/archive/repomix/KONSOLIDERING-2026-05-21.md`
- [x] `system-plan.md` § Permanent minne
- [x] `system-plan.md` — uppdatera notifyNewFile/valvChat rader efter deploy (2026-05-21 multitask)

---

## Kommando-cheat sheet (när användaren säger kör)

```bash
# G1
firebase deploy --only functions:valvChatQuery
npm run smoke:valv

# G2 (efter endpoint skapad)
firebase functions:secrets:set VECTOR_SEARCH_INDEX_ID  # eller env i functions config
firebase deploy --only functions:knowledgeVaultQuery,functions:ingestKampsparEntry
npm run smoke:kunskap

# G11 (exempel — isolera mock)
# Granska src/modules/kompis/types/kompis.ts vs core/types/firestore.ts KampsparEntry
```
