# OpenAI Codex / CLI Workflow

## Instruction sources

- `AGENTS.md`
- `docs/AI-GOVERNANCE.md`
- Explicit file paths in prompt: `@docs/PROJECT_STATE.md`

## Preflight script

```bash
node scripts/ai_preflight.mjs
```

Prints mandatory read list for copy-paste into CLI session.

## Limitations

- No repository rule auto-load — must pass governance docs each session
- Cannot enforce doc updates — run `npm run smoke:governance` after work
