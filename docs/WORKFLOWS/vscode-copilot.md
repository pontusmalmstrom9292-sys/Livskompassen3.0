# VS Code Copilot Chat Workflow

## How repository instructions are consumed

1. **Repository instructions:** VS Code Copilot reads `.github/copilot-instructions.md` when:
   - Workspace is the git repository root
   - Setting *GitHub > Copilot: Code Generation: Use Instruction Files* is enabled (default in recent versions)
2. **Workspace context:** `@workspace` queries index — pin `docs/PROJECT_STATE.md` for phase accuracy
3. **No `.mdc` support:** Cursor-specific rules are **not** loaded in VS Code

## Recommended session start

1. Open `docs/PROJECT_STATE.md` in editor (Copilot sees open files)
2. Chat: "Read PROJECT_STATE, ROADMAP, TODO, DASHBOARD, AI-GOVERNANCE before any change"
3. For UI work, add: "Follow design-calm and premium-ui — refine not redesign"

## Closest equivalent to Cursor always-on rules

| Cursor | VS Code equivalent |
|--------|-------------------|
| `.cursor/index.mdc` | `.github/copilot-instructions.md` |
| `ai-governance-entry.mdc` | Manual pre-flight prompt + open PROJECT_STATE |
| Glob rules | Copilot Instructions + explicit @file references |

## Limitation

Cannot auto-update docs after tasks. Agent must edit markdown files manually; verify with `npm run smoke:governance`.
