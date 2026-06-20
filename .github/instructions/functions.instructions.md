---
applyTo: "functions/**"
---

# Backend / Cloud Functions

- Callable auth via existing guards — do not add unauthenticated LLM endpoints.
- Ingest: heuristic before LLM (`heuristicInboxClassify` → `classifyInboxDocument` → `routeInboxToWorm`).
- `bevis` → `reality_vault` only; **never** `kb_docs`.
- `barnen` / trauma without opt-in → `inbox_queue` (HITL).
- Synapse handlers: hash payloads, no raw PII in state (`hashPayload`, `clearSynapseState` on logout).
- Build: `cd functions && npm run build`
- Smoke: `npm run smoke:synapse-triggers`, `npm run smoke:dcap-routing`, `npm run smoke:inkast`
