# Terminal Agents Workflow

For scripts, CI bots, and one-shot shell agents without IDE integration.

## Start

```bash
node scripts/ai_preflight.mjs
cat docs/PROJECT_STATE.md
```

## During work

Follow `docs/AI-GOVERNANCE.md` §3–§4.

## End

```bash
npm run smoke:governance
# plus area smoke from PROJECT_STATE matrix
```

## Limitation

No automatic context injection — preflight script is the closest supported alternative.
