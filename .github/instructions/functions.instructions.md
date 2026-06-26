---
applyTo: "functions/**"
---

# Backend / Cloud Functions

- Callable auth via existing guards — do not add unauthenticated LLM endpoints.
- Ingest: heuristic before LLM (`heuristicInboxClassify` → `classifyInboxDocument` → `routeInboxToWorm`).
- `bevis` → `reality_vault` only; **never** `kb_docs`.
- `barnen` / trauma without opt-in → `inbox_queue` (HITL).
- Synapse handlers: hash payloads, no raw PII in state (`hashPayload`, `clearSynapseState` on logout).
- Before changing agents, synapses, or callables, reread `.context/system-plan.md`, `.context/security.md`, and `.context/arkiv-minne.md` to preserve WORM, silo, and Zero Footprint invariants.
- Runtime prompts stay in `functions/src/sharedRules.ts`; if prompt mirrors drift, run `npm run prompts:sync` and verify with `npm run smoke:prompts`.
- Prefer `/specialist-verifier` before manual smoke for agent/synapse work; local preflight shortcut: `npm run validate:agents-local`.
- Build: `cd functions && npm run build`
- Smoke: `npm run smoke:synapse-triggers`, `npm run smoke:dcap-routing`, `npm run smoke:inkast`
