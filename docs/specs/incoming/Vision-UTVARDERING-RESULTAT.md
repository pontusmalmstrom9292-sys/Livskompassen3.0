# Vision — utvärderingsresultat (A–D)

**Datum:** 2026-05-21  
**Källor:** [`Vision-UTVARDERING-UNDERAGENTER.md`](./Vision-UTVARDERING-UNDERAGENTER.md), [`Vision-AI-Native-Blueprint.md`](./Vision-AI-Native-Blueprint.md) S01–S23, hela Livskompassen2.0 repo (read-only)

---

## Slutrapport

### Stämmer med vision (5)

- **Tre silor + WORM** — `knowledgeVaultQuery`/`valvChatQuery` läser separata collections; Firestore rules append-only på `reality_vault`, `journal`, `children_logs`, `dossier_snapshots`.
- **Deterministisk orkestrering** — 10 AgentCards, 2 executors, `routeFromDcap` i `kompis-supervisor.ts`; DCAP före LLM.
- **Beviskedja delvis live** — server timestamps, Dossier SHA-256 (`dossierCanonicalHash.ts`), PDF export utan edit av WORM-källa.
- **Livs-Arkivarien korrekt scope** — `agent_livs_arkivarien` + Kunskap-RAG (`kampspar`, `kb_docs`); valv via Sannings-Analytikern/valvChat.
- **Infrastruktur catch-up** — `valvChatQuery` **deployad**; Vector endpoint **1 st** i west1 med deployed index (2026-05-21 kväll).

### Största GAP (prioritet)

1. **`.context/system-plan.md` föråldrad** — säger G1 ej deployad och 0 endpoints; moln har båda (C3 FAIL).
2. **ANN wire i prod** — env finns lokalt; verifiera att deployade functions använder Vector Search (G2–G3).
3. **EntityProfile / kontext-motorn (G9, S22)** — `NetworkMember` + seed finns; runtime `$context.variables` saknas.
4. **Synaps-stubs (G7)** — `journal_woven`, `dcap_alert` log-only; ingen auto journal→kampspar (korrekt policy, men vision S04/S10 delvis).
5. **Legacy Python stack (G4)** — 4 functions us-central1 parallellt med Node-repo; risk dubbel Drive/RAG-pipeline.

### Nästa steg för Pontus (ett kommando)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen2.0 && npm run smoke:kunskap && npm run smoke:valv
```

(Om `smoke:valv` saknas: anropa deployad `valvChatQuery` manuellt en gång och bekräfta citations JSON.)

---

## A — Silo & WORM

- **A1: PASS** — `kampsparQueryRag.ts` L76–89: endast `kampspar` + `kb_docs`; ingen `reality_vault`.
- **A2: PASS** — `valvChatAgent.ts` → `fetchVaultEvidenceForQuery` (`vaultRag.ts` L38+): endast `reality_vault`.
- **A3: PASS** — `firestore.rules` L24–72: `update, delete: if false` på `journal`, `reality_vault`, `children_logs`, `dossier_snapshots` m.fl.
- **A4: PASS** — `retentionJob.ts` L16: purge-lista `kampspar`, `interaction_logs`, `dcap_analysis_cache` — WORM-collections **exkluderade** (implicit allowlist; saknar explicit kommentar med `reality_vault`/`journal`/`children_logs`).
- **A5: PASS** — `driveIngestSynapse.ts` L31–40: `persistKbDocFromDrive` → `kb_docs`, inte `reality_vault`.

**Sammanfattning:** Silo-gränser och WORM rules håller i kod; retention skyddar WORM via exklusion, inte namngiven allowlist-kommentar.

---

## B — Orkester & agenter

- **B1: PASS** — 10 cards i `AvailableAgents` (`cards/index.ts` L235–246): ≥8 produktroller.
- **B2: PASS** — `EXECUTOR_AGENT_IDS`: `agent_livs_arkivarien`, `agent_grans_arkitekten`; `resolveExecutorId` mappar deterministiskt.
- **B3: PASS** — `kompis-supervisor.ts` L33: `routeFromDcap(dcapResult.riskScore, dcapResult.recommendedAction)`.
- **B4: PASS** — Grep `.prompt` i `functions/` = 0 (endast `request.data?.prompt` i index, ej Dotprompt-filer).
- **B5: PASS** — `synapseBus.ts`: `drive_file_ingested` + `user_overwhelm` live; `journal_woven` + `dcap_alert` stub (L17–23).

**Sammanfattning:** Runtime matchar vision A/B-agenter via ADK + cards; Genkit Flow/Dotprompt medvetet ej migrerat (V1/V2).

---

## C — Infrastruktur sanning

**Kommandon körda:** `firebase functions:list --project gen-lang-client-0481875058`, `gcloud ai index-endpoints list --region=europe-west1 --project=gen-lang-client-0481875058`

- **C1: PASS** — `valvChatQuery` v2 callable `europe-west1` i functions:list (uppdaterat vs archive-doc).
- **C2: PASS** — 1 index-endpoint west1: `livskompassen-kv-endpoint`, deployed index `livskompassen_kv_deployed_v1`.
- **C3: FAIL** — `.context/system-plan.md` L106–107: "0 endpoints", "`valvChatQuery` ej deployad" **strider** mot live moln och [`docs/GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md).
- **C4: PASS** — 4 legacy Python functions i `us-central1` noterade i functions:list.

**Sammanfattning:** Molnet har hunnit före system-plan; uppdatera `.context/system-plan.md` och verifiera ANN-smoke. **Ej BLOCKED** — inventering lyckades.

**Env (inga värden loggade):** `functions/.env.gen-lang-client-0481875058` innehåller `VECTOR_SEARCH_INDEX_ID`, `VECTOR_SEARCH_ENDPOINT_ID`, `VECTOR_SEARCH_DEPLOYED_INDEX_ID`.

---

## D — Röda tråden i Cursor rules

- **D1: PASS** — `.cursor/rules/livskompassen-core.mdc`: `alwaysApply: true`.
- **D2: PASS** — `.cursor/rules/synapser-adk.mdc` **skapad** (glob `functions/src/adk/**`).
- **D3: PASS** — `.cursor/rules/memory-silo.mdc` **skapad** (glob `*Rag*`, valv/knowledge agents).
- **D4: FAIL** — `AGENTS.md` § Skills pekar bara på `.context/`; länkar **inte** till `.cursor/skills/livskompassen-rag-retrieval`, `livskompassen-memory-silo-guard`, `livskompassen-synapser-adk`.
- **D5: PASS** — `.context/arkiv-minne.md` L176 länkar `Vision-AI-Native-Blueprint.md` (text säger S01–S14 — bör uppdateras till S01–S23).

**Saknade regler (före denna körning):** `synapser-adk.mdc`, `memory-silo.mdc` — **nu skapade**.

**Vision § Röda tråden vs rules:**

| Punkt | I rules/skills? |
|-------|-----------------|
| Absolut isolering | `memory-silo.mdc`, skill silo-guard |
| DCAP före LLM | `backend-agents.mdc`, `livskompassen-core.mdc` |
| WORM / Zero Footprint | `security-firestore.mdc`, `livskompassen-core.mdc` |
| Deterministisk orkestrering | `backend-agents.mdc`, `synapser-adk.mdc` |
| sharedRules kanon | `backend-agents.mdc`, `AGENTS.md` hard rule |
| Vision-doc S15–S23 | Ej i alwaysApply — docs only |

**Rekommendation:** Uppdatera `AGENTS.md` § Skills med tabell (RAG / silo / synapser / vector) — **ej gjort** (utanför steg 5 scope om tid).

---

## Relaterade filer (denna körning)

| Fil | Åtgärd |
|-----|--------|
| `docs/specs/incoming/Vision-AI-Native-Blueprint.md` | S15–S23 + vision-agent-tabell |
| `docs/specs/incoming/vision-slides/README.md` | S01–S23 index |
| `docs/specs/incoming/MIND-SAFE-vs-Livskompassen-DIFF.md` | S15–S23, utvärderingsstatus |
| `docs/GCP-INVENTORY-LATEST.md` | **Ny** live-inventering |
| `.cursor/rules/synapser-adk.mdc` | **Ny** |
| `.cursor/rules/memory-silo.mdc` | **Ny** |

**BLOCKED:** Inget — steg 1–5 klara.
