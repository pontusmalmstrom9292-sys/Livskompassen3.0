---
name: livskompassen-synapser-adk
description: ADK SynapseBus, driveIngestSynapse (G10 multi-silo), journal_woven, dcap_alert, Zero Footprint synapse state. Use when wiring auto-ingest between modules and Minne.
---

# Synapser & ADK

## Scope

- [`functions/src/adk/synapses/synapseBus.ts`](../../functions/src/adk/synapses/synapseBus.ts)
- [`functions/src/adk/synapses/driveIngestSynapse.ts`](../../functions/src/adk/synapses/driveIngestSynapse.ts)
- [`functions/src/adk/stateStore.ts`](../../functions/src/adk/stateStore.ts) — `clearSynapseState`

## Triggers

| Trigger | Status |
|---------|--------|
| `drive_file_ingested` | **live** (G10) → `kb_docs` \| `reality_vault` \| `children_logs` \| `inbox_queue` via `notifyNewFile` |
| `user_overwhelm` | **live** (Paralys-Brytaren) |
| `journal_woven` | **live** → opt-in `kampspar` (G7) |
| `dcap_alert` | **live** → WORM `dcap_alerts` (U2.5 HITL) |

## MUST

- Hash payloads in synapse state — no raw PII (`hashPayload`).
- Clear synapse state on logout (`clearSynapseState`).
- Drive ingest (G10) → rätt silo; bevis **MUST** `reality_vault`, **MUST NOT** `kb_docs`; trauma utan optIn → `inbox_queue`.

## MUST NOT

- Auto-ingest trauma/Kladd to `kampspar` without opt-in.
- Spara bevis till `kb_docs` (G10 — se `driveIngestSynapse.ts` L9–12).
