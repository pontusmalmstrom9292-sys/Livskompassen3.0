# Definition of Done — Livskompassen v2

**Version:** 1.1 · **Last updated:** 2026-06-28  
**Cursor rule:** `.cursor/rules/ai-governance-definition-of-done.mdc`  
**PR checklist:** `.cursor/rules/20-pr-checklist.mdc` (merge description)

## Hierarchy

| Layer | Doc | When |
|-------|-----|------|
| **Universal (all tasks)** | This file | Every AI-assisted task |
| **Program-specific** | [`Completion-Criteria.md`](./Completion-Criteria.md) | Premium UI Polish release |
| **Merge / PR** | `.cursor/rules/20-pr-checklist.mdc` | Pull requests to main |

Program criteria **add to** universal criteria — never replace them.

---

## Universal DoD (every task)

### A. Scope & phase

- [ ] Matches `TODO.md` item for active **program** in `PROJECT_STATE.md`
- [ ] Stays inside active **system phase** (Fas N in `PROJECT_STATE.md`)
- [ ] No work ahead of roadmap; no functionality removal without PMIR

### B. Build & verification

- [ ] `npm run build` passes (`functions` build if backend touched)
- [ ] Relevant smoke green (matrix in `PROJECT_STATE.md`)
- [ ] Lint on touched files unless documented exception

### C. Architecture invariants (if code touched)

- [ ] WORM · tre silos · DCAP före LLM · Zero Footprint preserved

### D. AI self-review

- [ ] [`AI-GOVERNANCE.md` §6](./AI-GOVERNANCE.md) checklist passed

### E. Documentation (mandatory)

- [ ] `TODO.md`, `DASHBOARD.md`, `PROGRESS.md` updated
- [ ] `PROJECT_STATE.md` if system/program phase, blockers, or smoke changed
- [ ] `ROADMAP.md` if program phase boundaries or estimates changed

### F. Release / merge

- [ ] `npm run smoke:predeploy:build` before merge to main
- [ ] yolo-vakt GO + Pontus OK for prod deploy

---

## Sign-off

Implementing agent → self-review + docs. yolo-vakt → deploy. Pontus → phase changes + PMIR.
