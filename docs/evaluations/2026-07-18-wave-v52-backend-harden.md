# Build v52 — BACKEND-HARDEN

Date: 2026-07-18
approved: yes (Weaver U1 behavior — Pontus OK via improvement-waves plan)
Wave: v52 BACKEND-HARDEN
Agent: specialist-adk-weaver

## Changes

1. **Weaver U1 split** — `fetchWeaverRagContext` uses only `journal` + `reality_vault`. Kunskap via separate `fetchKnowledgeRagContext` (not called from Vävaren).
2. **`SynapseTrigger`** in `functions/src/adk/manifest.ts` includes `kasam_aggregation`.
3. **`notifyNewFile`** — production requires `ownerId` (fail-closed). Drive ACL bind = follow-up (PMIR).
4. **functions:list vs index.ts** — live Firebase list deferred (needs auth); source exports inventoried in this eval / runbook.

## Smoke

- smoke:manifest PASS
- smoke:dcap-routing PASS
- smoke:synapse-triggers PASS
- smoke:valv-security PASS
- functions `tsc` PASS

## Deploy

SKIP — väntar Pontus `OK deploy` for functions (weaver + notifyNewFile).

## MUST NOT touched

firestore.rules · storage.rules · sharedRules.ts
