# Claude Code Workflow

## Instruction source

`AGENTS.md` at repository root (Claude Code convention).

Also read: `docs/AI-GOVERNANCE.md`, `docs/PROJECT_STATE.md`.

## Preflight

```bash
node scripts/ai_preflight.mjs
```

## Limitations

- No `.mdc` glob rules
- No automatic Copilot-style repo file in all Claude surfaces
- Pass `docs/PROJECT_STATE.md` explicitly in headless/CI runs

## Validation

`npm run smoke:governance` before declaring governance work complete.
