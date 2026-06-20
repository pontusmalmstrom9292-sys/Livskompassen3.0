---
applyTo: "functions/src/adk/**,functions/src/triggers/**"
---

# ADK / SynapseBus

Handlers live in `functions/src/adk/synapses/`. Triggers include `drive_file_ingested`, `journal_woven`, `dcap_alert`, `user_overwhelm`.

## Silo rules (MUST NOT violate)

- Bevis → `reality_vault` only, NEVER `kb_docs`
- Kunskap → `kb_docs` (FACT, no PII)
- Trauma/LVU without optIn → `inbox_queue`
- Drive ingest: `allowBarnenAutoPersist: false` for barnen

## Order (DCAP-first)

1. `heuristicInboxClassify`
2. Gemini LLM only if heuristic returns null
3. `applyInkastConfidenceGate`
4. `routeInboxToWorm`

Smoke: `npm run smoke:synapse-triggers`, `npm run smoke:dcap-routing`

Cursor skill: `.cursor/skills/livskompassen-synapser-adk/SKILL.md`
