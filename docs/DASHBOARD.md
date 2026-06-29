> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.

# Premium UI Polish — Dashboard

**Version:** 1.2 | **Last updated:** 2026-06-29

**Rule:** Update this file after each merge wave. Do **not** use guessed progress % — use Status + metric columns.

**Status values:** Not Started | In Progress | Blocked | Done

---

## Program metrics (Phase 0 baseline — fill on kickoff)

| Metric | Baseline | Current | Target |
|--------|----------|---------|--------|
| btn-pill-- file count | ~195 (estimated) | **10** (2026-06-29) | 0 new after start |
| DS Modal/Sheet consumers | ~14 | TBD | All blocking overlays |
| ad-hoc role=dialog | ~14 | TBD | 0 undocumented |
| index.css LOC | 6816 | **6819** (2026-06-29) | ≤5000 (stretch) |
| smoke:design-modules | TBD | **PASS** (2026-06-29) | green |
| smoke:locked-ux | TBD | PASS (2026-06-28) | green |
| `zone-valv` route chunk (js) | 768.53 kB | 2.65 kB | keep route-entry small |
| `typecheck:core-strict` scope | core/shared/morning | core/shared/features/morning (PASS 2026-06-28) | features included |

Run `scripts/count_design_debt.mjs` when implemented (Phase 9).

---

## Delivery workflow hardening (2026-06-28)

- **Status:** Done
- **Scope:** Practical delivery plan + safe Git branch/merge routine added
- **Files:** `docs/DELIVERY_PLAN.md`, `docs/GIT_WORKFLOW.md`, `.github/workflows/pr-smoke-gate.yml`, `package.json`
- **Quality signal:** PR smoke gate now also runs `npm run test:agents-ui`

---

## Chrome (locked — polish only)

### Premium Header
- **Status:** Done
- **Priority:** Critical
- **Dependencies:** Phase 1 tokens
- **Files:** src/modules/core/components/AppHeaderBar.tsx, src/design-system/components/Header.tsx, src/styles/executive-chrome.css

### Premium Dock
- **Status:** Done
- **Priority:** Critical
- **Dependencies:** Tokens
- **Files:** src/modules/core/layout/ExecutiveDockBar.tsx, FloatingDock.tsx, src/design-system/components/Dock.tsx

### Premium Compass
- **Status:** Done
- **Priority:** Critical
- **Dependencies:** Dock
- **Files:** src/modules/core/home/HomeAdaptiveCompass.tsx, LivskompassMark.tsx, ExecutiveDecorCompass.tsx

### Navigation Drawer
- **Status:** Done
- **Priority:** High
- **Dependencies:** Chrome
- **Files:** src/modules/core/layout/NavigationDrawer.tsx

---

## Design system primitives

### Design Tokens
- **Status:** Done
- **Priority:** Critical
- **Dependencies:** —
- **Files:** src/design-system/tokens/**, variables.css

### Premium Polish CSS
- **Status:** In Progress
- **Priority:** Critical
- **Dependencies:** Tokens
- **Files:** src/design-system/styles/premium-polish.css

### Button System
- **Status:** In Progress
- **Priority:** Critical
- **Metric:** ~195 files with btn-pill--
- **Files:** src/design-system/components/Button.tsx, src/modules/shared/ui/Button.tsx

### Card / Bento System
- **Status:** In Progress
- **Priority:** High
- **Files:** Card.tsx, BentoCard.tsx, premium-polish card block

### Banner System
- **Status:** In Progress
- **Priority:** High
- **Files:** Banner.tsx, AlertBanner.tsx, ModuleSectionBanner.tsx

### Modal / Sheet
- **Status:** In Progress
- **Priority:** High
- **Metric:** ~14 DS vs ~14 ad-hoc
- **Files:** Modal.tsx, Sheet.tsx + feature overlays

### Input System
- **Status:** Not Started
- **Priority:** High
- **Files:** Input.tsx; journal, ekonomi, inkast forms

### Loading / Skeleton
- **Status:** Done (DS components exist; PageSkeleton alignment is Phase 5)
- **Priority:** Medium
- **Files:** src/design-system/components/Skeleton.tsx, src/design-system/components/Spinner.tsx

### Empty State
- **Status:** In Progress
- **Priority:** Medium
- **Files:** core/ui/EmptyState.tsx, JournalArchive.tsx, PlaneringQuickListPanel.tsx, ChildMomentStunderPanel.tsx, PositivaMinnesankare.tsx, FamiljenLivsloggTab.tsx

### Error Boundaries
- **Status:** In Progress
- **Priority:** Medium
- **Metric:** 5 variants → 1 ErrorFallback
- **Files:** HubErrorBoundary, PlaneringErrorBoundary, VaultErrorBoundary, RAGErrorBoundary, DagbokWizardErrorBoundary

### Motion System
- **Status:** Done
- **Priority:** Medium
- **Metric:** presets.ts + useDsReducedMotion.ts in src/design-system/motion/; ChameleonInputShell synced to --ds-duration-morph (2026-06-29)
- **Files:** src/design-system/motion/presets.ts, src/design-system/motion/useDsReducedMotion.ts

---

## Zones

### Hem / Home
- **Status:** Done
- **Priority:** Critical
- **Dependencies:** Chrome
- **Files:** HomePage.tsx, ExecutiveReflektionHero.tsx, executive cards
- **Notes:** ExecutiveReflektionHero and the executive card stack now share the premium home chrome treatment.

### Planering
- **Status:** In Progress
- **Priority:** High
- **Dependencies:** Button, Sheet
- **Files:** PlaneringPage, PlanningKanbanBoard, InkorgPreviewSheet, CognitiveGuard*, PlaneringFokusPanel, PlaneringInkorgPanel, PlaneringParalysEntry
- **Notes:** PlaneringPage, the Kanban board shell, the Inkorg panel shell, the preview sheet shell, and CognitiveGuard are polished; remaining planning panels stay open as separate passes.

### Valv
- **Status:** In Progress
- **Priority:** High
- **Dependencies:** Button, Banner
- **Files:** ValvSamlaZone, WeaverPendingVaultBanner, VaultErrorBoundary, VaultPage

### MåBra
- **Status:** Not Started
- **Priority:** High
- **Files:** MabraHubView, MabraLayout, flow views

### Ekonomi
- **Status:** Not Started
- **Priority:** Medium
- **Files:** Economy* panels, EkonomiInputSuperModule

### Familjen
- **Status:** Not Started
- **Priority:** High
- **Files:** FamiljenPage, tab panels, Barnfokus delegate

### Hjärtat / Dagbok
- **Status:** Not Started
- **Priority:** High
- **Files:** DagbokInputSuperModule, SpeglarSuperModule

### Widgets (11 routes)
- **Status:** Not Started
- **Priority:** High
- **Files:** src/modules/features/widgets/**

### Legacy CSS sunset
- **Status:** Not Started
- **Priority:** Low (stretch)
- **Files:** src/index.css

### Accessibility WCAG AA
- **Status:** Not Started
- **Priority:** Critical (cross-cutting)
- **Files:** All touched; see Completion-Criteria.md

---

## Cross-doc ownership

| Question | Primary doc |
|----------|-------------|
| What to do next? | TODO.md |
| When is it done? | Completion-Criteria.md |
| Why this order? | ROADMAP.md |
| What can break? | Risks.md |
| Fast tasks? | Quick-Wins.md |
| How to test? | Testing-Strategy.md |
