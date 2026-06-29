# GitHub Copilot Workflow

## Instruction source

`.github/copilot-instructions.md` — official repository instructions format.

## Supported

- Copilot in VS Code / Visual Studio / JetBrains (when repo instructions enabled)
- Copilot coding agent on GitHub (reads repo instructions)
- Pack validation: `npm run cursor:pipeline:pack:copilot`

## Before work

Copilot should load repo instructions automatically. If not, paste link to `docs/PROJECT_STATE.md`.

## Jules / cloud

Use `.github/ISSUE_TEMPLATE/copilot-jules-cloud.yml` and include phase from `PROJECT_STATE.md`.

## Limitation

Cannot enforce post-task doc updates — run `npm run smoke:governance` in CI or locally.
