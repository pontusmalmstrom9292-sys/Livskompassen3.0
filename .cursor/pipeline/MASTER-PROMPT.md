# Cursor Pipeline — MASTER PROMPT

Kör **parallellt** (Task tool, en subagent per paket):

- **backend** (Backend + systemplan): läs `.cursor/pipeline/jobs/backend-brief.md`, modell `composer-2.5-fast`, starta Task-subagent parallellt.
- **ui-design** (UI / Obsidian Calm): läs `.cursor/pipeline/jobs/ui-design-brief.md`, modell `composer-2.5-fast`, starta Task-subagent parallellt.
- **security** (Säkerhet + WORM + silos): läs `.cursor/pipeline/jobs/security-brief.md`, modell `claude-4.6-sonnet-medium-thinking`, starta Task-subagent parallellt.
- **ai-agents** (ADK + SynapseBus + agent cards): läs `.cursor/pipeline/jobs/ai-agents-brief.md`, modell `composer-2.5-fast`, starta Task-subagent parallellt.

## Ordning efter agent-jobb

1. `cd functions && npm run build`
2. `npm run build`
3. `npm run smoke:predeploy`
4. Om FAIL: läs `.cursor/pipeline/fix-brief.md` och fixa minsta diff.

## MUST NOT (hard NO-GO)

- Ändra `firestore.rules` / `storage.rules` utan PMIR
- Cross-RAG mellan Kunskap / Valv / Barnen
- Ta bort Locked UX (Barnfokus, Valv Mönster/Orkester, drawer plausible deniability)
- LLM-skriv till WORM utan explicit användarval

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
