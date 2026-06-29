# Gemini CLI Workflow

## Instruction sources

- `GEMINI.md` (pointer)
- `AGENTS.md`
- `docs/PROJECT_STATE.md`

## Optional context upload

```bash
npm run sync:system
```

Upload `docs/system_sync/*_CURRENT.*` for architecture snapshots.

## Limitations

- No native repository rules or `.mdc`
- Must pass project state every session
- Cannot auto-run smoke — user/agent runs `npm run smoke:governance`
