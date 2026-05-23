---
name: livskompassen-synapser-adk
description: ADK SynapseBus, G10 ingest, journal_woven, dcap_alert, Zero Footprint state. Use when wiring auto-ingest between modules and Minne.
---

# Synapser & ADK

## Scope

| File | Role |
|------|------|
| [`functions/src/adk/synapses/synapseBus.ts`](../../../functions/src/adk/synapses/synapseBus.ts) | Static handler map + `emitSynapse` |
| [`functions/src/adk/synapses/driveIngestSynapse.ts`](../../../functions/src/adk/synapses/driveIngestSynapse.ts) | G10 Drive → klassificering → silo |
| [`functions/src/adk/synapses/journalWovenSynapse.ts`](../../../functions/src/adk/synapses/journalWovenSynapse.ts) | G7 opt-in → `kampspar` |
| [`functions/src/adk/synapses/dcapAlertSynapse.ts`](../../../functions/src/adk/synapses/dcapAlertSynapse.ts) | U2.5 WORM `dcap_alerts` |
| [`functions/src/adk/synapses/paralysBrytarenSynapse.ts`](../../../functions/src/adk/synapses/paralysBrytarenSynapse.ts) | Mikrosteg (orchestrator + bus) |
| [`functions/src/adk/stateStore.ts`](../../../functions/src/adk/stateStore.ts) | In-memory mutations; `clearSynapseState` |

## ADK state ≠ Firestore `system_synapses` (G9)

- **ADK:** `stateStore.ts` — hashed payloads, cleared on logout.
- **Firestore:** `system_synapses` — WORM grounding via Admin SDK (`entityProfileStore.ts`). **Not** the same schema as ADK events.

## Triggers

| Trigger | Handler | Status | Emitter |
|---------|---------|--------|---------|
| `drive_file_ingested` | `handleDriveIngest` | **PASS** G10 | `notifyNewFile` → `index.ts` ~248 |
| `journal_woven` | `handleJournalWoven` | **PASS** G7 | `journalWovenToKampspar` → `index.ts` ~622 |
| `dcap_alert` | `handleDcapAlert` | **PASS** U2.5 | `kompis-supervisor.ts` ~59 |
| `user_overwhelm` | `applyParalysBreak` via bus | **PASS** | `breakDownResponse` → `emitSynapse` |

**Separate path (not bus):** Kompis heavy replies use `AdkOrchestrator` inline `applyParalysBreak` (`orchestrator.ts`).

## G10 routing (Drive)

**MUST NOT** save evidence to `kb_docs`. G10 routes:

- Bevis → `reality_vault` / `inbox_queue` (HITL)
- Kunskap → `kb_docs`
- Barnen → `children_logs`
- Trauma/oklar → `inbox_queue` unless `optInTrauma`

See [`Arkiv-GAP-REGISTER.md`](../../../docs/specs/modules/Arkiv-GAP-REGISTER.md) G10 **done**.

## G7 / G9 (done)

- **G7:** `journal_woven` only with `optIn === true`; idempotent per `journalEntryId`.
- **G9:** `entity_profiles` + `system_synapses` seeded server-side; metadata to agents — **MUST NOT** cross-silo RAG.

## MUST

- `hashPayload` in synapse state and DCAP alerts — no raw PII in ADK state.
- `clearSynapseState` on logout (`invalidateSession` → supervisor `clearContext`).
- Webhook `notifyNewFile`: fail-closed without `NOTIFY_WEBHOOK_SECRET` in prod; `ownerId` from `DRIVE_INGEST_OWNER_UID` only (ignore body ownerId).

## MUST NOT

- Auto-ingest trauma/Kladd to `kampspar` without opt-in.
- Share synapse state across silos (Kunskap / Valv / Barnen).
- Hardcode prompts — kanon = `functions/src/sharedRules.ts`.

## Related skills

- [`livskompassen-synapse-connections`](../livskompassen-synapse-connections/SKILL.md) — module graph + wiring checklist
- [`livskompassen-worm-lock`](../livskompassen-worm-lock/SKILL.md) — WORM, callables, Kill Switch
- [`livskompassen-dcap-kompis`](../livskompassen-dcap-kompis/SKILL.md) — DCAP before LLM
