# Cursor Workflow

## Instruction sources

1. `.cursor/index.mdc` (always-on invariants)
2. `.cursor/rules/ai-governance-entry.mdc` (**alwaysApply: true** — governance pre-flight)
3. Domain rules auto-attach by glob (security, UI, ADK, etc.)

## Phase model

- **System Fas:** `docs/PROJECT_STATE.md` (e.g. Fas 24)
- **Program:** `docs/ROADMAP.md` (e.g. Premium UI Phase 0)

## Before work

Read PROJECT_STATE → ROADMAP → TODO → DASHBOARD → AI-GOVERNANCE per `ai-governance-entry.mdc`.

## Limitations

- User must open correct workspace root
- Ask mode may not load all rules
- `.context/system-plan.md` may be cursorignored — use `docs/PROJECT_STATE.md`

## Validation

`npm run smoke:governance` · `npm run smoke:mdc-rules`
