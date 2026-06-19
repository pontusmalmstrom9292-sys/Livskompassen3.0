---
name: livskompassen-memory-agents
description: Memory-related agents — Livs-Arkivarien, Mönster-Arkivarien, Sannings-Analytikern, agent cards, sharedRules. Use when editing agent routing or prompts for archive/RAG.
---

# Memory Agents

## Central prompts

**Only** [`functions/src/sharedRules.ts`](../../functions/src/sharedRules.ts) — no hardcoded prompts elsewhere.

## U1 — Tre silos (aldrig cross-RAG)

| Silo | Collections | Callable | Produktroll | sharedRules prompt |
|------|-------------|----------|-------------|-------------------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | Livs-Arkivarien | `LIVS_ARKIVARIEN_SYSTEM_PROMPT` |
| Valv | `reality_vault` | `valvChatQuery` | Sannings-Analytikern | `SANNING_ANALYTIKERN_SYSTEM_PROMPT` |
| Barnen | `children_logs` | `childrenLogsQuery` | Mönster-Arkivarien (barn) | `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` |

**Sanning GAP:** [`docs/specs/modules/Arkiv-GAP-REGISTER.md`](../../docs/specs/modules/Arkiv-GAP-REGISTER.md) — G1–G16 **done** (inkl. `valvChatQuery`, G8 `childrenLogsQuery`).

## Runtime executors (A2A)

| Executor ID | Callable / agent backing | Ephemeral vs RAG |
|-------------|--------------------------|------------------|
| `agent_livs_arkivarien` | `knowledgeVaultQuery`, Minne-rutiner | Kunskap-silo |
| `agent_grans_arkitekten` | `analyzeMessage`, BIFF/Brusfiltret | Hamn — **ingen** WORM-RAG |

Produktroll → executor: `resolveExecutorId()` i [`functions/src/agents/cards/index.ts`](../../functions/src/agents/cards/index.ts).

## Cards & routing

- [`functions/src/agents/cards/index.ts`](../../functions/src/agents/cards/index.ts) — `AvailableAgents`, `routeFromDcap`, `resolveExecutorId`
- [`functions/src/agents/kompis-supervisor.ts`](../../functions/src/agents/kompis-supervisor.ts) — DCAP före LLM
- [`functions/src/adk/orchestrator.ts`](../../functions/src/adk/orchestrator.ts) — ADK A2A dispatch

**DCAP routing:** `routeFromDcap(riskScore, recommendedAction)` — ALERT/≥70 → Gräns-Arkitekten; COACHING/≥30 → analys; annars Livs-Arkivarien.

## MUST

- Strict JSON for forensic agents (Sannings-Analytikern, Brusfiltret).
- Deterministic routing — LLM does not decide auth, silo, or WORM.
- New product role → Card in `cards/index.ts` **and** prompt export in `sharedRules.ts`.

## MUST NOT

- Cross-RAG between silos (U1).
- Hardcode agent prompts outside `sharedRules.ts`.
- Add product roles without Card + sharedRules entry.
- Use LLM output as source of truth for authorization or immutable evidence.

## Deploy & smoke

| Callable | Source | Smoke |
|----------|--------|-------|
| `knowledgeVaultQuery` | `functions/src/callables/knowledge.ts` | `npm run smoke:kunskap` |
| `valvChatQuery` | `functions/src/callables/valv.ts` | `npm run smoke:valv` |
| `childrenLogsQuery` | `functions/src/callables/knowledge.ts` | `npm run smoke:children` |

After callable changes: `cd functions && npm run build` → `firebase deploy --only functions:<namn>`.
