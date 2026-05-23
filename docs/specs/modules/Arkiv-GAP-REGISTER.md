# Arkiv-GAP-REGISTER — implementation efter låsning

**Datum:** 2026-05-21 (konsoliderad, live-synk)  
**Regel:** Implementera **inte** kod förrän användaren säger `kör [GAP]`.  
**Sanning (moln):** [`docs/GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md) — ersätter arkiv [`GCP-INVENTORY-2026-05-21.md`](../../archive/GCP-INVENTORY-2026-05-21.md).

| ID | Status | Notering |
|----|--------|----------|
| G1 | **done** | `valvChatQuery` deployad west1 |
| G2 | **done** | VERIFY PASS 2026-05-22 — endpoint live, kod-defaults, 54 vectors |
| G3 | **done** | VERIFY PASS 2026-05-22 — embeddingDim 768, indexSync under ingest |
| G4 | **done** | All legacy Python borta (steg 1–5 2026-05-22) |
| G5 | **done** | WORM allowlist retention |
| G6 | **done** | Drive E2E → `kb_docs` 2026-05-22 — [`GCP-FAS4-RUNBOOK.md`](../../GCP-FAS4-RUNBOOK.md) steg 2 |
| G7 | **done** | `journal_woven` opt-in → `kampspar` + `journalWovenToKampspar` (2026-05-22) |
| G8 | **done** | `childrenLogsQuery` + Mönster-Arkivarien Barnen (2026-05-22) |
| G9 | **done** | EntityProfile / SystemSynapse (2026-05-22) |
| G10 | **done** | Självsorterande inkorg (2026-05-22) |
| G11 | **done** | Mock Kampspar UI-only (2026-05-22) |
| G12 | **done** | Context Cache registry (2026-05-22) |
| G13 | **done** | Tidshjulet → kampspar (2026-05-22) |
| G14 | **done** | Gräns-Arkitekten (2026-05-22) |
| G15–G16 | **done** | G15 + G16 + U5.5 **done** 2026-05-22 |
| V1 | **wait** | Genkit — ej migrera |

---

## Prioritet 1 — Prod-gaps (blockerar hela arkivet)

### G1 — Deploy `valvChatQuery` — **done**

| | |
|---|---|
| **Status** | **done** (2026-05-21 live inventering) |
| **Bevis** | `valvChatQuery` i `firebase functions:list`; `smoke:valv` PASS |
| **Säkerhet** | Endast `reality_vault`; Zero Footprint session |

### G2 — Vector Search endpoint + ANN wire — **done**

| | |
|---|---|
| **Status** | **done** — VERIFY PASS 2026-05-22 |
| **Live** | Endpoint `4956462078572363776`; index `2686894156982255616`; deploy `livskompassen_kv_deployed_v1`; **54 vectors** |
| **Secrets** | `VECTOR_SEARCH_*` saknas i Secret Manager — kod-defaults i `vectorSearchClient.ts` räcker |
| **Kod** | `functions/src/lib/kampsparQueryRag.ts` — ANN + token-match fallback |

### G3 — Embeddings live — **done**

| | |
|---|---|
| **Status** | **done** — VERIFY PASS 2026-05-22 |
| **Live** | `text-embedding-004`, `embeddingDim` 768 vid ingest; indexSync 2026-05-22T00:57:43Z |
| **Bevis** | Smoke + seed 47 poster; vectorsCount 54 i gcloud |

---

## Prioritet 2 — Arkitekturhygien

### G4 — Legacy Python RAG (us-central1) — **done**

| Status | **done** — 0 Python functions kvar (FAS4 steg 1–5 **done** 2026-05-22) |

| Function | Legacy roll | Node-motsvarighet | Status |
|----------|-------------|-------------------|--------|
| ~~`knowledge-base-webhook`~~ | Vertex AI Search KB webhook | `notifyNewFile` → `kb_docs` + Vector ANN | **raderad** steg 5 |
| ~~`drive_sync_tool`~~ | Drive → legacy KB | `notifyNewFile` (Node) | **raderad** steg 3 |
| ~~`biff_generator_tool`~~ | HTTP BIFF-prototyp | `analyzeMessage` | **raderad** steg 1 |
| ~~`brusfiltret_tool`~~ | HTTP brusfilter | `analyzeMessage` | **raderad** steg 1 |

**Smoke steg 5:** `smoke:kunskap` + `smoke:dossier` **PASS** 2026-05-22.

### G5 — Retention vs permanent minne — **done**

| | |
|---|---|
| **Status** | **done** — WORM allowlist i `retentionJob.ts` |
| **Problem** | `retentionJob.ts` purgar `users/{uid}/kampspar`; live data = top-level `kampspar` |
| **GCS** | `livskompassen-knowledge-vault-worm` har 30d retention |
| **Åtgärd** | Explicit allowlist: **aldrig** radera `children_logs`, `reality_vault`, `journal`, `dossier_snapshots`, top-level `kampspar` WORM |
| **Källa** | walkthrough legacy path ≠ prod; repomix output.txt T6 |

### G6 — Drive smoke end-to-end — **done** 2026-05-22

| | |
|---|---|
| **Status** | **done** — webhook → `kb_docs` · docId `irQNlDTYgcr15DFIuA3w` · `smoke:kunskap` PASS |
| **Fix** | `documentAgent.ts` export för Google Docs; `await emitSynapse`; `gemini-2.5-flash` |
| **Deploy** | `notifyNewFile` west1 — se [`GCP-FAS4-RUNBOOK.md`](../../GCP-FAS4-RUNBOOK.md) steg 2 |

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

### G7 — `journal_woven` synaps — **done** 2026-05-22

`journalWovenSynapse.ts` + callable `journalWovenToKampspar` + opt-in checkbox i Dagbok ConfirmStep. **MUST NOT** auto-ingest.

### G8 — Familjen-RAG — **done** 2026-05-22

`childrenLogsQuery` + `childrenLogsQueryRag` + `ChildrenLogsChat` i Familjen. **MUST NOT** route via `valvChatQuery`.

### G9 — EntityProfile / SystemSynapse — **done** 2026-05-22

`entity_profiles` + `system_synapses` (WORM, owner-bound), idempotent seed (`KEY_ENTITY_SEEDS`), `loadEntityProfileBundle` injiceras i valv/kunskap/barn-agenter (metadata — **MUST NOT** cross-RAG), callable `getEntityProfileRegistry`, UI `EntityRegistryCard` i Kunskap.

### G10 — Självsorterande inkorg — **done** 2026-05-22

`INKORG_SORTERARE` + `classifyInboxDocument` i `driveIngestSynapse`: bevis → `reality_vault`, kunskap → `kb_docs`, barnen → `children_logs`, trauma/oklar → `inbox_queue` (HITL). **MUST NOT** spara bevis till `kb_docs`. Callables: `getInboxQueue`, `confirmInboxItem`, `previewInboxClassification`. UI `InboxQueueCard`.

### G12 — Context Cache delad registry — **done** 2026-05-22

`context_cache_registry` (Firestore, delad mellan instanser), `contentHash` för RAG-invalidering, `invalidateCachesForUser` vid Kill Switch, `purgeExpiredRegistryEntries` i retention. Callable `getContextCacheStatus`. Best-effort Vertex cache create (fail-open).

### G13 — Tidshjulet → `kampspar`-historik — **done** 2026-05-22

Live `subscribeKampsparEntries`, ringar Dåtid/Nutid/Framtid via `eventDate`, klickbara noder, `TidshjulDetailCard`, deterministisk Mönster-hint. Citation → Tidshjulet för `kampspar`.

### G14 — Gräns-Arkitekten agent card

| | |
|---|---|
| **Status** | **done** — 2026-05-22 |
| **Leverans** | `GransArkitektenCard`, `gransArkitektenAgent.ts`, Kompis-routing (DCAP + `module: safe_harbor`), Hamn-UI (Brusfilter + BIFF), `npm run smoke:grans` |
| **Beslut** | Nionde produktroll = Gräns-Arkitekten (executor `agent_grans_arkitekten`); BIFF/Brusfiltret som produktkort kvar i A2A-registret |
| **Källa** | cursor.txt + walkthrough legacy |

### G15 — Grunder: injection-parity kanon (U1.5)

| | |
|---|---|
| **Status** | **done** — `.context/security.md` § injection-parity (2026-05-22) |
| **Källa** | [`GRUNDER-UTVARDERING-RESULTAT.md`](GRUNDER-UTVARDERING-RESULTAT.md) U1.5 |

### G16 — Grunder: RSD-prompt + Barnen-routing (U4.3, U5.3, U5.5)

| | |
|---|---|
| **Status** | **done** — RSD-prompt + PA appendix + U5.5 Kompis routing **done** 2026-05-22 |
| **Källa** | [`GRUNDER-UTVARDERING-RESULTAT.md`](GRUNDER-UTVARDERING-RESULTAT.md) |

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
