---
name: livskompassen-dcap-kompis
description: DCAP before LLM and Kompis supervisor routing — analyzeDcap, routeFromDcap, dcap_alert. Use when editing kompis-supervisor, DCAP, or cards routing.
---

# DCAP & Kompis skill

## When to use

- Changes to `functions/src/agents/kompis-supervisor.ts`
- `functions/src/agents/DCAP.ts`
- `functions/src/agents/cards/index.ts` (`routeFromDcap`, `resolveExecutorId`)
- `dcap_alert` synapse / HITL

## Flow (MUST preserve order)

```
User message → analyzeDcap (deterministic) → routeFromDcap → ADK / executor
```

**DCAP runs before LLM orchestration** (U1.1).

## High risk

| Signal | Routing |
|--------|---------|
| ALERT / `riskScore >= 70` | BIFF / Grey Rock intent (U1.2, U2.1) |
| HITL threshold | `dcapAlertSynapse` → WORM `dcap_alerts` |

## Files

| File | Role |
|------|------|
| `functions/src/agents/DCAP.ts` | Risk analysis |
| `functions/src/agents/kompis-supervisor.ts` | Supervisor entry |
| `functions/src/agents/cards/index.ts` | Cards + routing |
| `functions/src/adk/synapses/dcapAlertSynapse.ts` | HITL WORM |
| `functions/src/sharedRules.ts` | Prompts only here |

## MUST NOT

- Let LLM decide auth, ownership, or WORM
- Add prompts outside `sharedRules.ts`
- Skip DCAP for “faster” replies on sensitive paths

## Related

- Rules: `backend-agents.mdc`, `anti-hallucination.mdc`
- Agent: `.cursor/agents/grunder-u1-hotvektorer`, `grunder-u2-systemforsvar`
- Skill: `livskompassen-synapser-adk` for `dcap_alert` bus wiring
