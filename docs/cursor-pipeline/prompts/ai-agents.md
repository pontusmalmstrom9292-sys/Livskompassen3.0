---
scope: backend-only
mustNot:
  - Fjärde RAG-silo
  - LLM som enda källa för silo/auth/WORM
  - Ta bort synapse handlers utan PMIR
verifyCommands:
  - cd functions && npm run build
  - npm run smoke:orkester
  - npm run smoke:agents-ui
  - npm run smoke:synapse-triggers
---

# AI-agents-paket — Cursor Pipeline

Du arbetar mot **ADK + SynapseBus + agent cards**-repomix.

## Uppgift

Verifiera ADK Orkestrator, SynapseBus handlers och agent cards. Stub vs live — kontrollera faktiska handlers i `synapseBus.ts`, inte bara docs.

## MUST

- `AdkOrchestrator` + AgentCards + `emitSynapse`
- Synapser: `driveIngestSynapse`, `dcapAlertSynapse`, `journalWovenSynapse` (optIn === true för journal)
- Tre executors utan cross-read mellan silor
- Agent cards: `functions/src/agents/cards/index.ts`
- Pipeline Studio FTD smoke per tool: `npm run pipeline:run-smoke -- <toolId>`

## READ FIRST

- `.context/agents.md`
- `AGENTS.md`
- `functions/src/adk/orchestrator.ts`
- `functions/src/adk/synapses/synapseBus.ts`
- `docs/pipeline-studio/tools/*.json`
