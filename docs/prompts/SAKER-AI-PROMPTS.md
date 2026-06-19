# Säkra AI-prompter (governance)

**Registry:** `SAKER-AI-PROMPTS.json` · **Kanon:** `docs/governance/GUARD-REGLERBOK.md`

## Syfte

Governance-mallar för Cursor-agenter och manuell silo-klassificering. **Inte** runtime callables.

Prod använder `functions/src/sharedRules.ts` — ändring där kräver PMIR (`backend-agents.mdc`).

## Filer

| Fil | Roll |
|-----|------|
| `prompts/guardedAgentInstruction.json` | Agent-grundinstruktion (system) |
| `prompts/safeClassificationPrompt.json` | Dokument → silo (JSON-output) |
| `docs/prompts/SAKER-AI-PROMPTS.json` | Registry + korta mallar |

## Osäkerhetsfras (kanon)

- Kort: *Ej tillräckligt data*
- Utökad: *Ej tillräckligt data för bedömning.*

## Validering

```bash
npm run smoke:prompts
npm run smoke:guard
```

Kontrollerar JSON, WORM/silo/låsta flöden, utökad osäkerhetsfras, samt att `projectGuard.mdc`, `guard-regelbok.mdc` och `GUARD-REGLERBOK.md` finns.

## Användning

### Agent-säkerhet (system)

Klistra in mallen `ai-agent-sakerhetsinstruktion` från registry, eller använd hela `guardedAgentInstruction.json` → `systemInstruction`.

### Säker klassificering (user)

Ersätt `{{documentText}}` i mallen `saker-klassificering`. Vid osäkerhet → `review`, inte gissning.

## Korsreferenser

- `.cursor/rules/projectGuard.mdc` — index
- `.cursor/rules/guard-regelbok.mdc` — operativ
- `.cursor/rules/anti-hallucination.mdc`
- `.cursor/rules/grunder-kanon.mdc`
- `.cursor/rules/locked-ux-features.mdc`

## Produktion (runtime)

Inkast-klassificering: `INKORG_SORTERARE_SYSTEM_PROMPT` i `sharedRules.ts`. Håll semantik aligned via PMIR — inte ad hoc copy från governance JSON.
