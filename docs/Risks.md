# Premium UI Polish — Risks

**Version:** 1.1 | **Last updated:** 2026-06-28

Ranked register. Mitigations are actionable — see [Roadmap.md](./Roadmap.md) and [Testing-Strategy.md](./Testing-Strategy.md).

## Critical

| ID | Risk | Mitigation |
|----|------|------------|
| R-C1 | Break locked UX (compass/dock/header) | DAD checklist before PR; smoke:locked-ux; Pontus OK for structure |
| R-C2 | Valv PIN / plausible deniability UI regression | UI-only diffs; smoke:valv-security, smoke:plausible-deniability |
| R-C3 | Barnporten HITL / child safety UI | smoke:barn-epistemik; no flow changes |
| R-C4 | User perceives "redesign" (trust/RSD) | Zone-by-zone polish; Pontus spot-check; no layout shifts |

## High

| ID | Risk | Mitigation |
|----|------|------------|
| R-H1 | btn-pill migration breaks variants/touch | Legacy map in Button.tsx; min-h ds-touch; batch + screenshot |
| R-H2 | a11y regression (contrast, focus) | WCAG checklist per PR; axe on overlays |
| R-H3 | Scope creep into redesign | premium-ui.mdc; PR template; yolo-vakt before merge |
| R-H4 | Parallel agents cause merge hell | One active zone per wave; file ownership in Dashboard |
| R-H5 | Ad-hoc dialogs lose focus trap during migration | Migrate one at a time; keyboard test each |
| R-H6 | Android G85 blur/jank | Test Phase 8; reduced blur tier; prefers-reduced-transparency |

## Medium

| ID | Risk | Mitigation |
|----|------|------------|
| R-M1 | index.css merge conflicts | Prefer premium-polish.css; zone batches |
| R-M2 | Theme Lab vs prod drift | THEME_LOCKED; dev routes isolated |
| R-M3 | Framer bundle size | Lazy motion presets; CSS-first simple transitions |
| R-M4 | Cognitive overload (owner ADHD) | One zone at a time; Progress.md single next step |
| R-M5 | Unverified progress % misleads | Dashboard uses metrics not guesses (Phase 0) |
| R-M6 | Agent uses bästa design/ shadcn prototype | Canonical path in Design-System-Plan |
| R-M7 | Sacred features touched accidentally | locked-ux-features.mdc; smoke:locked-ux |

## Low

| ID | Risk | Mitigation |
|----|------|------------|
| R-L1 | Figma Code Connect drift | Update figma/connect on BentoCard change |
| R-L2 | Dev lab CSS removed too early | Phase 10 only after prod class audit |
| R-L3 | WormSaveConfirmSheet rename confusion | Changelog in Progress.md |

## Risk review cadence

- **Each PR:** R-C1, R-H1, R-H2 spot check
- **Each zone wave:** R-C2–C4 if Valv/Familjen/Barnporten
- **Pre-release:** Full register + yolo-vakt GO/NO-GO
