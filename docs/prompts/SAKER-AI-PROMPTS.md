# Säkra AI-prompter (governance)

**Registry:** `SAKER-AI-PROMPTS.json` v3 · **Master-register:** `PROMPTER-SKILLS-FUNKTIONER-REGISTER.md`

## Tre lager

| Lager | Källa | Kommando |
|-------|-------|----------|
| Runtime (prod) | `functions/src/sharedRules.ts` | PMIR + functions deploy |
| Speglar (läsbar) | `docs/prompts/*-PROMPT.md` | `npm run prompts:sync` |
| Governance | `prompts/*.json` + denna mapp | `npm run smoke:prompts` |

## Kanoniska governance-filer

| Fil | Roll |
|-----|------|
| `prompts/guardedAgentInstruction.json` | Agent-grundinstruktion (system) |
| `prompts/safeClassificationPrompt.json` | Dokument → silo |
| `docs/prompts/EXPERT-AGENT-DIRECTIVES.json` | 8 paste-ready Cursor-specialister |

`SAKER-AI-PROMPTS.json` **refererar** till root JSON — duplicera inte text manuellt.

## Osäkerhetsfras

`Ej tillräckligt data för bedömning.`

## Borttagna dubletter (2026-06-25)

- `BARA-LYSSNA-LAGET-PROMPT.md` → ersatt av `SPEGLINGSCOACHEN-PROMPT.md`
- `BIFF-SKOLDEN-PROMPT.md` → ersatt av `GRANS-ARKITEKTEN-PROMPT.md` + `BIFF-REWRITE-DRAFT-PROMPT.md`
