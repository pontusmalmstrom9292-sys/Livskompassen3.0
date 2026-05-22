---
name: grunder-u4-orkester
model: inherit
description: Read-only Grunder audit U4 — ADK, agent cards, sharedRules vs Genkit vision; slides 03/04/07. Trigger kör grunder U4.
readonly: true
---

# Grunder U4 — Orkester och agenter (read-only)

**Trigger:** `kör grunder U4`

Read-only. **Ej** Genkit/Dotprompt-migrering (G01, G28, G29 = vision-only).

## Regler

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)
- [`backend-agents.mdc`](../rules/backend-agents.mdc)

## Slide-mappar

- `docs/specs/modules/grunder-slides/03-multi-agent-vision/`
- `docs/specs/modules/grunder-slides/04-granssattning-mindmap/`
- `docs/specs/modules/grunder-slides/07-governance/`

## Kodfiler (läs)

| Fil | Syfte |
|-----|--------|
| `functions/src/agents/cards/index.ts` | `AvailableAgents`, `routeFromDcap`, `resolveExecutorId` |
| `functions/src/agents/kompis-supervisor.ts` | Supervisor → ADK |
| `functions/src/adk/orchestrator.ts` | ADK runtime |
| `functions/src/adk/executors/runExecutor.ts` | Gemini executor |
| `functions/src/sharedRules.ts` | `AGENT_IDS`, alla system prompts |

**Jämför ej duplicerat:** [`docs/archive/evaluations-2026-05/Vision-UTVARDERING-RESULTAT.md`](../../docs/archive/evaluations-2026-05/Vision-UTVARDERING-RESULTAT.md) § B — referera kort.

## Kontroller

| # | Kriterium | PASS om |
|---|-----------|---------|
| U4.1 | ≥8 produktroller | Räkna cards i `AvailableAgents` |
| U4.2 | Exakt 2 executors | `livs_arkivarien`, `grans_arkitekten` |
| U4.3 | Dedikerade prompts | Varje produktroll i `sharedRules.ts` (t.ex. `RSD_KYLAREN_SYSTEM_PROMPT`) |
| U4.4 | Inga `.prompt`-filer | `functions/` grep = 0 |
| U4.5 | Genkit/Dotprompt | **VISION** — dokumenterat, ej migrerat |

## Output

```markdown
## U4 — Orkester och agenter
- U4.1: PASS|FAIL — path:line
- U4.2: PASS|FAIL — path:line
- U4.3: PASS|FAIL — path:line
- U4.4: PASS|FAIL — path:line
- U4.5: VISION — Genkit ej runtime
- GAP-lista (prioriterad): [...]
- Sammanfattning: [1 mening]
```

Runtime-ändringar föreslås **endast** som GAP-punkter för `kör [GAP]` — implementera inte själv.

## Baseline

[`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](../../docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md)
