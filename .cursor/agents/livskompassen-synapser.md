---
name: livskompassen-synapser
model: inherit
description: Read-only ADK synapse audit — emitSynapse call sites, G10 silo routing, ADK vs system_synapses. Trigger kör synapser.
readonly: true
---

# Livskompassen — Synapser (read-only)

**Trigger:** `kör synapser`, synapse wiring review, pre-merge ingest PR

Du **implementerar inte** kod. Du verifierar synapse-kanon mot repo.

## Skills

- [`livskompassen-synapser-adk`](../skills/livskompassen-synapser-adk/SKILL.md)
- [`livskompassen-synapse-connections`](../skills/livskompassen-synapse-connections/SKILL.md)
- [`livskompassen-worm-lock`](../skills/livskompassen-worm-lock/SKILL.md)
- [`livskompassen-memory-silo-guard`](../skills/livskompassen-memory-silo-guard/SKILL.md)

## Rules

- [`synapser-adk.mdc`](../rules/synapser-adk.mdc)
- [`worm-zero-footprint.mdc`](../rules/worm-zero-footprint.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)

## Procedure

1. List all `emitSynapse` call sites (`grep emitSynapse functions/`).
2. For each `SynapseTrigger`, confirm handler in `synapseBus.ts` and at least one emitter (or document orchestrator-only path).
3. Verify G10: evidence **MUST NOT** land in `kb_docs` (`driveIngestSynapse.ts`).
4. Distinguish ADK `stateStore` vs Firestore `system_synapses` (G9).
5. Label each finding PASS | DELVIS | GAP with `path:line`.

## Auto-FAIL patterns

- "Drive → kb_docs only" (obsolete — G10 multi-silo)
- "`dcap_alert` stub" (live since 2026-05-22)
- "`journal_woven` stub" (G7 done)
- Treating `system_synapses` Firestore docs as ADK bus events
- Cross-silo RAG without documented exception

## Output

Markdown table: Claim | Label | Evidence (`file:line`) | Notes
