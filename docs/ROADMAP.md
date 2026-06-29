> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.
> **Scope:** This is the **active program** roadmap (Premium UI Polish). System Fas is in [`PROJECT_STATE.md`](./PROJECT_STATE.md) (currently **Fas 24**).

# Premium UI Polish — Roadmap
> **Entry point:** [Premium-UI-Polish-INDEX.md](./Premium-UI-Polish-INDEX.md)


**Version:** 1.1 (post design review)  
**Last updated:** 2026-06-28  
**Authority:** Executive Midnight DAD v1.0 — `.cursor/rules/design-calm.mdc`  
**Mandate:** Refine, not redesign — `.cursor/rules/premium-ui.mdc`

## Document index

| Doc | Purpose |
|-----|---------|
| [TODO.md](./TODO.md) | Actionable checkbox tasks |
| [DASHBOARD.md](./DASHBOARD.md) | Live progress (update after each wave) |
| [UI-Audit.md](./UI-Audit.md) | Issue register with severity |
| [Design-System-Plan.md](./Design-System-Plan.md) | Tokens, components, rules |
| [Architecture-Review.md](./Architecture-Review.md) | Strengths, weaknesses, testing |
| [Testing-Strategy.md](./Testing-Strategy.md) | Verification gates (added in review) |
| [Risks.md](./Risks.md) | Ranked risk register |
| [Quick-Wins.md](./Quick-Wins.md) | ROI-ranked short tasks |
| [Completion-Criteria.md](./Completion-Criteria.md) | Definition of done |
| [PROGRESS.md](./PROGRESS.md) | Change log |

---

## Executive summary

Livskompassen has a **real but incomplete** design system (`src/design-system/`). Production UI runs on a **bridge architecture**: ~6 816 lines of legacy CSS in `src/index.css`, with `premium-polish.css` (469 lines) as a refinement layer.

**Verified metrics (2026-06-28):**

- ~195 TS/TSX files reference `btn-pill--*` (migration backlog)
- ~24 files import `framer-motion` outside design-system
- ~14 DS Modal/Sheet consumers vs ~14 ad-hoc `role="dialog"` implementations
- 3 Playwright e2e specs touch design/tokens

**Revised total effort:** 45–65 developer-days (9–13 weeks @ 5 days/week, one developer). Initial estimate understated btn-pill migration and mobile verification.

---

## Phase overview

| Phase | Name | Priority | Effort | Visual impact | Perf impact |
|-------|------|----------|--------|---------------|-------------|
| 0 | Baseline & governance | P0 | 2 d | Low | Neutral |
| 1 | Token & motion foundation | P0 | 4–5 d | Medium | Neutral |
| 2 | Chrome (Header/Dock/Kompass) | P0 | 4–6 d | Very high | Slight risk |
| 3 | Primitive consolidation | P0 | 15–22 d | High | Positive |
| 4 | Overlay system | P1 | 3–5 d | Medium | Neutral |
| 5 | Loading, error, empty states | P1 | 3–4 d | Medium | Positive |
| 6 | Zone polish — Hem + Vardagen | P1 | 7–10 d | High | Neutral |
| 7 | Zone polish — Hjärtat + Familjen + Valv | P1 | 10–14 d | High | Neutral |
| 8 | Widgets + Android verification | P1 | 4–6 d | Medium | G85 test |
| 9 | Testing & visual regression | P0 | 3–5 d | Low | Quality gate |
| 10 | Legacy CSS sunset | P2 | 6–10 d | Low | Positive |

Each phase below includes: Goal, Components affected, Estimated effort, Dependencies, Risks, Success criteria, Expected visual impact, Expected performance impact, Priority.

---

## Phase 0 — Baseline & governance

**Goal:** Measurable starting point; PR rules; no subjective progress percentages.

**Components affected:** Documentation; smoke scripts as baseline capture.

**Estimated effort:** 2 days | **Priority:** P0

**Dependencies:** None

**Risks:** Skipping baseline makes regressions undetectable.

**Success criteria:** smoke:design-modules + smoke:locked-ux green; screenshot set for 6 routes @ 390×844 and 1280×800; btn-pill count recorded (~195).

**Visual impact:** None | **Performance impact:** None

---

## Phase 1 — Token & motion foundation

**Goal:** Single source for visual values; shared motion presets; fix Chameleon 300 ms vs `--ds-duration-morph` 350 ms drift.

**Components affected:** `src/design-system/tokens/*`, new `src/design-system/motion/`, `ChameleonInputShell.tsx`, new Skeleton/Spinner primitives.

**Estimated effort:** 4–5 days | **Priority:** P0

**Dependencies:** Phase 0

**Risks:** Breaking THEME_LOCKED prod pack; Framer bundle growth.

**Success criteria:** validate:session passes; Chameleon uses `--ds-duration-morph`; all motion hooks use useReducedMotion().

**Visual impact:** Medium (consistency) | **Performance impact:** Neutral

---

## Phase 2 — Chrome polish

**Goal:** Header floats; dock capsule with gold ring; compass luxury SVG — structure unchanged per DAD.

**Components affected:** executive-chrome.css, AppHeaderBar, ExecutiveDockBar, HomeAdaptiveCompass, NavigationDrawer (visual only), DS Header/Dock.

**Estimated effort:** 4–6 days | **Priority:** P0

**Dependencies:** Phase 1

**Risks:** CRITICAL locked UX; Android backdrop-filter jank.

**Success criteria:** smoke:locked-ux + smoke:design-modules; visual match KOMPASS-LOCKED-kanon.png; Pontus OK.

**Visual impact:** Very high | **Performance impact:** Monitor blur; prefers-reduced-transparency fallback

---

## Phase 3 — Primitive consolidation

**Goal:** Migrate btn-pill--* to Button; raw inputs to Input; unify Banner APIs.

**Components affected:** ~195 files (batched — see TODO.md).

**Estimated effort:** 15–22 days | **Priority:** P0

**Dependencies:** Phases 1–2

**Risks:** Touch targets; variant map gaps; merge conflicts.

**Success criteria:** Zero new btn-pill-- in modules after phase start; hub shells use DS Banner only.

**Visual impact:** High | **Performance impact:** Positive

---

## Phase 4 — Overlay system

**Goal:** Blocking UI uses DS Modal/Sheet (focus trap, Escape, scroll lock).

**Components affected:** ZenModeOverlay, RecoveryUrgeSosModule, AccountAuthMenu, PlanningTaskDetail, DrogfrihetHubPage dialog, WormSaveConfirmSheet rename/wrap.

**Estimated effort:** 3–5 days | **Priority:** P1

**Dependencies:** Phase 3

**Risks:** Auth focus trap; WORM confirm UX.

**Success criteria:** All overlays mapped in UI-Audit appendix; keyboard pass each dialog.

**Visual impact:** Medium | **Performance impact:** Neutral

---

## Phase 5 — Loading, error, empty states

**Goal:** Unified ErrorFallback; DS Skeleton/Spinner; EmptyState tokens.

**Estimated effort:** 3–4 days | **Priority:** P1

**Dependencies:** Phase 3

**Success criteria:** Single ErrorFallback with variants; Suspense uses DS Skeleton.

**Visual impact:** Medium | **Performance impact:** Positive

---

## Phase 6 — Zone: Hem + Vardagen

**Routes:** /, /vardagen, /planering/*, /mabra/*, /arbetsliv/*, /morgon

**Estimated effort:** 7–10 days | **Priority:** P1

**Dependencies:** Phases 2–3 | **Risks:** Planering W1 locked layout

---

## Phase 7 — Zone: Hjärtat + Familjen + Valv

**Routes:** /hjartat/*, /familjen/*, /valvet/*, barnporten parent routes

**Estimated effort:** 10–14 days | **Priority:** P1

**Dependencies:** Phases 3–5 | **Risks:** CRITICAL Valv PIN, Barnporten HITL, WORM UI

---

## Phase 8 — Widgets + Android

**Estimated effort:** 4–6 days | **Priority:** P1 (production entry points)

**Success criteria:** smoke:widgets; manual G85 pass

---

## Phase 9 — Testing (continuous)

See [Testing-Strategy.md](./Testing-Strategy.md). Runs during every phase, not only at end.

**Estimated effort:** 3–5 days setup + ongoing | **Priority:** P0 cross-cutting

---

## Phase 10 — Legacy CSS sunset

**Goal:** Reduce index.css; code-split lab CSS.

**Estimated effort:** 6–10 days | **Priority:** P2 — optional post-release sprint

**Success criteria:** index.css ≤ 5000 LOC OR documented exceptions

---

## Recommended order

Phase 0 → in-flight Planering/Valv polish → Phase 1 → Phase 9 setup → Phase 2 chrome → Phase 3 batches → Phases 4–5 → Phases 6–7 → Phase 8 → completion audit → Phase 10 optional

**Do not** combine Phase 2 chrome and full Phase 3 migration in one PR.

---

## Assumptions

- Fas 24 in system-plan.md: **unverified**
- docs/design/*.md: use HTML/PNG galleries if md unreadable
- No redesign of navigation or workflows
- Polish is frontend-only (no firestore.rules changes)
