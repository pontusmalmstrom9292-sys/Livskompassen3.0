---
name: livskompassen-synapser-adk
description: ADK SynapseBus, driveIngestSynapse, journal_woven stubs, Zero Footprint synapse state. Use when wiring auto-ingest between modules and Minne.
---

# Synapser & ADK

## Scope

- [`functions/src/adk/synapses/synapseBus.ts`](../../functions/src/adk/synapses/synapseBus.ts)
- [`functions/src/adk/synapses/driveIngestSynapse.ts`](../../functions/src/adk/synapses/driveIngestSynapse.ts)
- [`functions/src/adk/stateStore.ts`](../../functions/src/adk/stateStore.ts) — `clearSynapseState`

## Triggers

| Trigger | Status |
|---------|--------|
| `drive_file_ingested` | **live** → `kb_docs` (via `notifyNewFile`) |
| `user_overwhelm` | **live** (Paralys-Brytaren) |
| `journal_woven` | **stub** (G7) |
| `dcap_alert` | **stub** |

## MUST

- Hash payloads in synapse state — no raw PII (`hashPayload`).
- Clear synapse state on logout (`clearSynapseState`).
- Drive ingest → `kb_docs` only (not `reality_vault` auto).

## MUST NOT

- Auto-ingest trauma/Kladd to `kampspar` without opt-in.

## Planerat

`journal_woven` → opt-in summary to `kampspar` (GAP G7).
