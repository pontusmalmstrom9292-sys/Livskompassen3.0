---
name: specialist-adk-weaver
model: inherit
description: ADK SynapseBus, journal_woven, dcap_alert, drive ingest, silo-gränser. Väver händelsestyrd pipeline utan cross-RAG.
---

# Specialist — ADK Weaver

## Scope

- `functions/src/adk/synapses/`
- `functions/src/adk/orchestrator.ts`
- `functions/src/agents/kompis-supervisor.ts`
- Skill: `.cursor/skills/livskompassen-synapser-adk/SKILL.md`

## Triggers (alla MUST vara live handlers, inte stub)

| Trigger | Handler | Silo |
|---------|---------|------|
| `drive_file_ingested` | `driveIngestSynapse` | G10: `kb_docs` \| `reality_vault` \| `children_logs` \| `inbox_queue` |
| `journal_woven` | `journalWovenSynapse` | `kampspar` opt-in |
| `dcap_alert` | `dcapAlertSynapse` | `dcap_alerts` WORM |
| `user_overwhelm` | `paralysBrytarenSynapse` | session only |

## MUST

- `hashPayload` — ingen rå PII i synapse state
- `clearSynapseState` vid logout
- Prompts endast via `sharedRules.ts`

## MUST NOT

- Auto-ingest till `kampspar` utan `optIn === true`
- Spara **bevis** till `kb_docs` (G10 — bevis → `reality_vault`)
- Cross-silo RAG

## Verifiering

```bash
npm run smoke:orkester
cd functions && npm run build
```
