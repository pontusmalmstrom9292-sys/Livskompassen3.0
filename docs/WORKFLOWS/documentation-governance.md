# Documentation Governance

Who updates what, when, and how. Part of [`docs/AI-GOVERNANCE.md`](../AI-GOVERNANCE.md) §7.

## Phase hierarchy (documentation)

| Doc | Tracks |
|-----|--------|
| `PROJECT_STATE.md` | System Fas (e.g. Fas 24) + which program is active |
| `ROADMAP.md` | Active **program** phases (e.g. Premium UI 0–10) |
| `.context/system-plan.md` | Full historical Fas log (canonical archive) |

When Fas changes: update system-plan → PROJECT_STATE → ROADMAP intro if program changes.

## Who updates documentation

| Actor | Responsibility |
|-------|----------------|
| **Implementing AI agent** | TODO, DASHBOARD, PROGRESS after every task |
| **Implementing AI agent** | PROJECT_STATE when phase/blockers/smoke changes |
| **Pontus** | Approves new system phases (Fas N) |
| **Architect agent** | system-plan, ROADMAP phase sections, governance structure |
| **yolo-vakt** | evaluations/ audit files before prod deploy |

## When

- **Same session as code** — before marking task complete
- **Before merge to main** — PROGRESS entry + smoke results
- **Before deploy** — PROJECT_STATE last verified + yolo audit

## How

1. Edit markdown in `docs/`
2. Use PROGRESS template (newest first)
3. Run `npm run smoke:governance`
4. Commit docs with code (or immediately after in same PR)

## How new system phases are created (Fas N)

1. Evaluation doc in `docs/evaluations/YYYY-MM-DD-*.md`
2. Pontus approves scope
3. Update `.context/system-plan.md` — mark previous Fas complete, new **AKTIV**
4. Update `docs/PROJECT_STATE.md` — agents read this first
5. If a new implementation program starts: add section to `docs/ROADMAP.md`
6. Populate `docs/TODO.md` for new work

## How new program phases are created (e.g. Premium UI Phase 1)

Update `ROADMAP.md`, `TODO.md`, `DASHBOARD.md` only — system Fas unchanged.

## How new features are planned

1. Check `docs/MODUL-FUNKTIONS-REGISTER.md` and Arkiv-GAP-REGISTER
2. PMIR if locked UX, WORM, sacred, or new route
3. Add TODO items **before** coding (`ide-till-kod.mdc`)
4. UI features: check DESIGN-BIBLE and Completion-Criteria

## How releases are prepared

1. Complete DoD (`docs/DEFINITION-OF-DONE.md`)
2. `npm run smoke:predeploy:build`
3. yolo-vakt audit → GO/NO-GO → `docs/evaluations/YYYY-MM-DD-yolo-audit.md`
4. Pontus OK
5. Deploy via `livskompassen-deploy` skill / documented runbook
6. Update PROJECT_STATE last verified dates
