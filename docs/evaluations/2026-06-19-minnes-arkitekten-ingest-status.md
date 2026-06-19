# 2026-06-19 — Minnes-Arkitekten ingest status

## Scope

Read-only audit of the automatic ingest chain requested by the user:

- `.cursor/rules/backend-ingest-logic.mdc`
- `functions/src/adk/synapses/synapseBus.ts`
- `functions/src/adk/synapses/driveIngestSynapse.ts`
- `functions/src/adk/synapses/journalWovenSynapse.ts`
- `functions/src/lib/submitInkastLite.ts`
- `functions/src/lib/inboxClassifier.ts`
- `functions/src/lib/inboxPersist.ts`
- `functions/src/callables/agents.ts`
- `functions/src/callables/inbox.ts`
- `functions/src/triggers/inkastStorageOnFinalize.ts`
- `functions/src/sharedRules.ts`

Build verification:

```bash
cd functions && npm run build
```

Result: **PASS** on 2026-06-19.

## Executive status

| Check | Status | Evidence |
|---|---|---|
| `drive_file_ingested` handler wired in SynapseBus | PASS | `functions/src/adk/synapses/synapseBus.ts:14-18` |
| `journal_woven` handler wired in SynapseBus | PASS | `functions/src/adk/synapses/synapseBus.ts:19-22` |
| DCAP/deterministic routing before LLM | PASS | `functions/src/lib/inboxClassifier.ts:75-76`, `functions/src/lib/inboxClassifier.ts:287-293` |
| LLM prompt comes from `sharedRules.ts` | PASS | `functions/src/lib/inboxClassifier.ts:1`, `functions/src/lib/inboxClassifier.ts:303-313`, `functions/src/sharedRules.ts:54-67` |
| HITL on uncertain / trauma / vault-gated ingest | PASS | `functions/src/lib/inboxClassifier.ts:351-359`, `functions/src/lib/inboxPersist.ts:304-328` |
| `bevis` routes to `reality_vault`, not `kb_docs` | PASS | `functions/src/lib/inboxPersist.ts:330-340` |
| Cross-RAG inside audited ingest path | PASS | `functions/src/lib/inboxPersist.ts:330-438`, `functions/src/adk/manifest.ts:158-170` |
| `kunskap` from Drive/Inkast lands in `kb_docs` | GAP | Live branch writes to `kampspar`: `functions/src/lib/inboxPersist.ts:428-438`; separate `kb_docs` helper exists at `functions/src/lib/persistKbDoc.ts:16-47` |

## Live vs stub table

| Chain | Status | Live path | Current outcome |
|---|---|---|---|
| Drive webhook -> SynapseBus | **Live** | `functions/src/callables/agents.ts:144-199` -> `functions/src/adk/synapses/synapseBus.ts:14-18` -> `functions/src/adk/synapses/driveIngestSynapse.ts:24-83` | File is analyzed, classified, then routed through `routeInboxToWorm`. |
| Drive G10 routing | **Live** | `functions/src/adk/synapses/driveIngestSynapse.ts:34-56` -> `functions/src/lib/inboxPersist.ts:282-438` | `bevis` -> `reality_vault`; `barnen` -> queue unless HITL; `dagbok` -> `journal`; `planning` -> `planning_tasks`; `kunskap` -> `kampspar`. |
| Journal opt-in -> `kampspar` | **Live** | `functions/src/callables/agents.ts:253-286` -> `functions/src/adk/synapses/journalWovenSynapse.ts:23-94` | Hard-blocks unless `optIn === true`; writes to `kampspar` and upserts vector. |
| Inkast callable routing | **Live** | `functions/src/callables/inbox.ts:142-235` -> `functions/src/lib/submitInkastLite.ts:375-462` -> `functions/src/lib/inboxPersist.ts:282-438` | Same routing matrix as Drive; verified/vault-sensitive branches queue safely. |
| Direct Storage inkast files | **Live** | `functions/src/triggers/inkastStorageOnFinalize.ts:20-107` | Auto-classifies uploaded evidence file and routes with same `routeInboxToWorm` guardrail. |
| `kb_docs` helper for G10 kunskap | **Helper present, not in audited live chain** | `functions/src/lib/persistKbDoc.ts:16-47` and wrapper `functions/src/lib/inboxPersist.ts:247-257` | Audit found no audited Drive/Inkast path that reaches this helper; live `kunskap` branch currently writes to `kampspar`. |

## Key findings

### 1) DCAP before LLM is live

`classifyInboxDocument()` runs `heuristicInboxClassify()` first and returns immediately on deterministic hits, only falling through to Gemini when the heuristic returns `null` (`functions/src/lib/inboxClassifier.ts:287-305`). Both Drive and Inkast call this shared classifier before persistence (`functions/src/adk/synapses/driveIngestSynapse.ts:34-49`, `functions/src/lib/submitInkastLite.ts:293-314`, `functions/src/lib/submitInkastLite.ts:344-364`).

### 2) HITL is enforced for uncertainty and sensitive routes

- Trauma/LVU or low-confidence cases are forced to review via `requiresHumanReview()` (`functions/src/lib/inboxClassifier.ts:351-359`).
- `bevis` queues when Vault is not open, and sensitive routes queue when the account is not verified (`functions/src/lib/inboxPersist.ts:304-328`).
- `barnen` does not auto-persist unless there is explicit HITL/override (`functions/src/lib/inboxPersist.ts:352-385`).

### 3) No cross-RAG was found in the audited ingest path

`routeInboxToWorm()` branches to one destination and returns; it does not fan out across silos (`functions/src/lib/inboxPersist.ts:330-438`). Backend silo isolation is also enforced by `assertBackendSiloIsolation()` which throws on isolated-silo cross-reads (`functions/src/adk/manifest.ts:158-170`).

### 4) Main live-vs-doc mismatch: `kunskap` is not going to `kb_docs`

The audited live path for `routing=kunskap` currently calls `ingestKampsparForUser()` and returns `collection: 'kampspar'` (`functions/src/lib/inboxPersist.ts:428-438`). A dedicated `kb_docs` persistence helper exists (`functions/src/lib/persistKbDoc.ts:16-47`), but it is not part of the audited Drive/Inkast live chain.

This means:

- `bevis -> reality_vault` is correct and enforced.
- `kb_docs` is **not** the live sink for audited G10 `kunskap` ingest today.
- The current mismatch is documentation/architecture drift, not a broken handler stub.

## Safe small improvement implemented

Updated the misleading comment in `functions/src/adk/synapses/driveIngestSynapse.ts` so the file now states the real live behavior: `kunskap` currently persists through the shared `kampspar` branch, while the `kb_docs` helper exists separately.

## Recommended next ingest wave

**One step only:** align the G10 `kunskap` destination in code with canon by routing audited Drive/Inkast `routing=kunskap` through `persistKunskapFromInbox()` / `persistKbDocFromDrive()` instead of the current `kampspar` branch.
