# GitHub Copilot — Repository Instructions

**Repository:** Livskompassen v2  
**Format:** [GitHub repository custom instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)  
**Last updated:** 2026-07-17

## Phase hierarchy (do not confuse)

| Level | File | Current |
|-------|------|---------|
| **System phase** | `docs/PROJECT_STATE.md` | **Fas 24** AKTIV |
| **Active program** | `docs/ROADMAP.md` | Premium UI Polish Phase 10 |

System phase wins on conflict. Never guess — read `PROJECT_STATE.md` first.

## Mandatory pre-flight (before code changes)

1. `docs/PROJECT_STATE.md`
2. `docs/ROADMAP.md` (program phases, not Fas number)
3. `docs/TODO.md`
4. `docs/DASHBOARD.md`
5. `docs/AI-GOVERNANCE.md`

## Architecture invariants

- **WORM:** Append-only evidence; behaviour + date — never diagnose counterpart
- **Tre silos:** No cross-RAG (Kunskap · Valv · Barnen)
- **DCAP before LLM:** `routeFromDcap`, `classifyInboxDocument` — not the model
- **Zero Footprint:** Clear session on logout/blur/panic
- **Locked UX:** Barnfokus, Valv Pansaret, Planering P3, Barnporten HITL — PMIR before changes

## During work

Stay in active system phase and program (`PROJECT_STATE.md`). Minimal diff. Reuse design-system. No redesign. No work ahead.

## PMIR hard stops (Pontus OK required)

`firestore.rules` · `storage.rules` · `sharedRules.ts` · locked UX removal · mass delete · prod deploy

## After every task

Update `TODO.md`, `DASHBOARD.md`, `PROGRESS.md`, `ROADMAP.md` (if program phase changed), `PROJECT_STATE.md` (if system phase changed). **Incomplete without docs.**

## Definition of Done

`docs/DEFINITION-OF-DONE.md` — universal DoD. Premium UI: `docs/Completion-Criteria.md`.

## Smoke

`npm run smoke:predeploy:build` (merge) · `smoke:locked-ux` · `smoke:design-modules` · `smoke:prompts` · `smoke:governance`

## Design

Executive Midnight DAD — refine not redesign. **Lead UI Engineer** mandate. No new `btn-pill--` in modules.

## Deploy

`smoke:predeploy` PASS → yolo-vakt GO → Pontus OK.

See `docs/AI-GOVERNANCE.md`, `docs/governance/GUARD-REGLERBOK.md`, `AGENTS.md`.
