# Arkiv-GAP-REGISTER — implementation efter låsning

**Datum:** 2026-05-21 (konsoliderad, live-synk)  
**Regel:** Implementera **inte** kod förrän användaren säger `kör [GAP]`.  
**Sanning (moln):** [`docs/GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md) — ersätter arkiv [`GCP-INVENTORY-2026-05-21.md`](../../archive/GCP-INVENTORY-2026-05-21.md).

| ID | Status | Notering |
|----|--------|----------|
| G1 | **done** | `valvChatQuery` deployad west1 |
| G2 | **verify** | Endpoint + deploy live; `VECTOR_SEARCH_*` ej i Secret Manager |
| G3 | **verify** | 4 vectors i index; smoke embeddingDim 768 PASS |
| G4 | **open** | 4 Python functions us-central1 |
| G5 | **done** | WORM allowlist retention |
| G6 | **open** | `NOTIFY_WEBHOOK_SECRET` saknas |
| G7–G14 | **open** | Life OS utbyggnad |
| V1 | **wait** | Genkit — ej migrera |

---

## Prioritet 1 — Prod-gaps (blockerar hela arkivet)

### G1 — Deploy `valvChatQuery` — **done**

| | |
|---|---|
| **Status** | **done** (2026-05-21 live inventering) |
| **Bevis** | `valvChatQuery` i `firebase functions:list`; `smoke:valv` PASS |
| **Säkerhet** | Endast `reality_vault`; Zero Footprint session |

### G2 — Vector Search endpoint + ANN wire — **verify**

| | |
|---|---|
| **Status** | **verify** — infra **done**, secrets optional |
| **Live** | Endpoint `4956462078572363776`; index `2686894156982255616`; deploy `livskompassen_kv_deployed_v1` |
| **Kvar** | Bekräfta prod function env om defaults i `vectorSearchClient.ts` räcker |
| **Kod** | `functions/src/lib/kampsparQueryRag.ts` — ANN + token-match fallback |

### G3 — Embeddings live — **verify**

| | |
|---|---|
| **Status** | **verify** — smoke PASS, 4 vectors i index |
| **Live** | `text-embedding-004`, `embeddingDim` 768 vid ingest |
| **Kvar** | Full ANN-prod smoke efter fler upserts |

---

## Prioritet 2 — Arkitekturhygien

### G4 — Legacy Python RAG (us-central1) — **open**

| Status | **open** — 4 functions fortfarande deployade |

| Function | Action |
|----------|--------|
| `knowledge-base-webhook` | Kartlägg dataflöde → migrera till Node `notifyNewFile` eller avveckla |
| `drive_sync_tool` | Undvik dubbel Drive-ingest |
| `biff_generator_tool`, `brusfiltret_tool` | Ersatt av Node `analyzeMessage` |

**Kontext:** Repomix XML/cursor = Vertex AI Search + Cloud Run-linjen; GCP har **båda** stackarna live.

### G5 — Retention vs permanent minne — **done**

| | |
|---|---|
| **Status** | **done** — WORM allowlist i `retentionJob.ts` |
| **Problem** | `retentionJob.ts` purgar `users/{uid}/kampspar`; live data = top-level `kampspar` |
| **GCS** | `livskompassen-knowledge-vault-worm` har 30d retention |
| **Åtgärd** | Explicit allowlist: **aldrig** radera `children_logs`, `reality_vault`, `journal`, `dossier_snapshots`, top-level `kampspar` WORM |
| **Källa** | walkthrough legacy path ≠ prod; repomix output.txt T6 |

### G6 — Drive smoke end-to-end — **open**

| | |
|---|---|
| **Status** | **open** — `NOTIFY_WEBHOOK_SECRET` saknas i Secret Manager (2026-05-21) |
| **Deploy** | `notifyNewFile` deployad west1 |
| **Åtgärd** | [`docs/DRIVE_AUTOMATION.md`](../../DRIVE_AUTOMATION.md) manuell verifiering |

### G11 — Mock `Kampspar`-typ vs `KampsparEntry` — **done**

| | |
|---|---|
| **Status** | **done** — `KompisUiKampsparTrack` UI-only |
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

UI (`Tidshjulet.tsx`) — Tidshjulet mot live `kampspar`; repomix hade statisk "Dåtid"-ring. Wire + ev. Mönster-Arkivarien.

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
