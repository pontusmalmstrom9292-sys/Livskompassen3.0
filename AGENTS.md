# AGENTS.md — Livskompassen v2

For Claude Code, OpenAI Codex/CLI, Gemini CLI, terminal agents.

## Phase hierarchy

- **System phase:** `docs/PROJECT_STATE.md` (Fas 24) — wins on conflict
- **Active program:** `docs/ROADMAP.md` (Premium UI Polish Phase 0)

## Every session — read in order

1. `docs/PROJECT_STATE.md`
2. `docs/ROADMAP.md`
3. `docs/TODO.md`
4. `docs/DASHBOARD.md`
5. `docs/AI-GOVERNANCE.md`

Preflight: `node scripts/ai_preflight.mjs`

## Rules

WORM · tre silos · DCAP · Zero Footprint · Locked UX · PMIR gates  
After task: update TODO, DASHBOARD, PROGRESS, ROADMAP (if needed), PROJECT_STATE (if needed)  
Validate: `npm run smoke:governance` · merge: `npm run smoke:predeploy:build`

Cursor → `.cursor/rules/ai-governance-entry.mdc`  
Copilot → `.github/copilot-instructions.md`  
DoD → `docs/DEFINITION-OF-DONE.md`
