> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.

# Premium UI Polish — TODO

**Version:** 1.2 | **Last updated:** 2026-06-29

Each item is independently completable. Link files in Dashboard when done.

---

## Phase 0 — Baseline

- [x] Record smoke:design-modules output in PROGRESS.md (2026-06-29)
- [x] Record smoke:locked-ux output in PROGRESS.md
- [x] Vite bundle split wave: lazy route-entry for `/valvet` + `/familjen` and verify build smoke (2026-06-28)
- [x] SAFE YOLO v2: expand `typecheck:core-strict` scope över `src/modules/features/` (2026-06-28)
- [x] Screenshot baseline: / @ 390×844 and 1280×800 (2026-06-29)
- [x] Screenshot baseline: /vardagen (2026-06-29)
- [x] Screenshot baseline: /planering (2026-06-29)
- [x] Screenshot baseline: /valvet (2026-06-29)
- [x] Screenshot baseline: /familjen (2026-06-29)
- [x] Screenshot baseline: /hjartat (2026-06-29)
- [x] Record btn-pill file count in Dashboard metrics (2026-06-29)
- [x] Add PR checklist to team workflow (Testing-Strategy.md)
- [x] Add delivery + safe git workflow docs (`DELIVERY_PLAN.md`, `GIT_WORKFLOW.md`)

---

## Phase 1 — Tokens & motion

- [x] Audit hardcoded hex in src/index.css :root (document, do not break theme) — root theme colors are intentional; no theme change made (2026-06-29)
- [x] Add focus.ts tokens (--ds-focus-ring) — already exists (2026-06-29)
- [x] Add zIndex.ts tokens — already exists (2026-06-29)
- [x] Create src/design-system/motion/presets.ts — already exists (2026-06-29)
- [x] Create useDsReducedMotion hook — already exists (2026-06-29)
- [x] Sync ChameleonInputShell to --ds-duration-morph (2026-06-29)
- [x] Create DS Skeleton component — already exists (2026-06-29)
- [x] Create DS Spinner component — already exists (2026-06-29)
- [x] Write src/design-system/README.md — already exists (2026-06-29)
- [x] Verify tailwind.config.js ds-* bridge — complete (2026-06-29)
- [x] Run validate:session after token changes (2026-06-29)

---

## Phase 2 — Chrome

- [x] Premium Header — glass, float, hierarchy (AppHeaderBar) (2026-06-29)
- [x] Premium Header — BastaDesignHeader parity (2026-06-29)
- [x] Premium Dock — capsule, inner glow (ExecutiveDockBar) (2026-06-29)
- [x] Premium Dock — FloatingDock fallback theme (2026-06-29)
- [x] Premium Compass — SVG polish (HomeAdaptiveCompass) (2026-06-29)
- [x] Premium Compass — LivskompassMark stroke/glow (2026-06-29)
- [x] NavigationDrawer — gold active row (visual only) (2026-06-29)
- [x] AmbientBackground — depth layers (2026-06-29)
- [x] executive-chrome.css token pass (2026-06-29)
- [x] smoke:locked-ux after chrome batch (2026-06-29)
- [ ] Pontus visual sign-off compass

---

## Phase 3 — Primitives: Button migration

- [ ] Batch: Planering module (~15 files)
- [ ] Batch: Inkast/Capture (~15 files)
- [ ] Batch: Valv (~20 files)
- [ ] Batch: MåBra (~25 files)
- [ ] Batch: Familjen (~20 files)
- [ ] Batch: Hjärtat/Dagbok (~15 files)
- [ ] Batch: Widgets (~10 files)
- [ ] Batch: Core auth/settings (~10 files)
- [ ] Batch: Remainder + CSS definition cleanup
- [ ] ESLint/smoke: no new btn-pill-- in modules

## Phase 3 — Primitives: Other

- [ ] Input: JournalQuickMode, ReflectionEditor
- [ ] Input: EconomyLogPanel, inkast forms
- [ ] Banner: deprecate AlertBanner usages
- [ ] Banner: deprecate ModuleSectionBanner usages
- [ ] Card: document BentoCard as sole module API
- [ ] UiCard: restrict to /dev routes
- [ ] Badge: map worm/locked/risk to ds-badge

---

## Phase 4 — Overlays

- [ ] Migrate ZenModeOverlay → DS Modal
- [ ] Migrate RecoveryUrgeSosModule dialog
- [ ] Migrate AccountAuthMenu dialog
- [ ] Migrate PlanningTaskDetail dialog
- [ ] Migrate DrogfrihetHubPage dialog section
- [ ] Evaluate ImmersiveExperienceShell → Modal
- [ ] Fix/rename WormSaveConfirmSheet
- [ ] Keyboard test each migrated overlay

---

## Phase 5 — States

- [x] Create ErrorFallback component — already exists in DS (2026-06-29)
- [ ] Migrate HubErrorBoundary
- [ ] Migrate PlaneringErrorBoundary
- [ ] Migrate VaultErrorBoundary
- [ ] Migrate RAGErrorBoundary
- [ ] Migrate DagbokWizardErrorBoundary
- [x] Align PageSkeleton with DS Skeleton (2026-06-29)
- [x] EmptyState token pass (core/ui/EmptyState.tsx)
- [x] Friendly empty-states for Dagbok, Planering, Familjen list views

---

## Phase 6 — Zone: Hem + Vardagen

- [x] HomePage depth pass (2026-06-29) — executive hero/card depth pass complete
- [x] ExecutiveReflektionHero polish
- [x] Executive home cards (Livslogg, etc.)
- [ ] LivLauncherPage bento grid
- [x] PlaneringPage (complete in-flight)
- [ ] PlanningKanbanBoard (in-flight)
- [ ] PlaneringInkorgPanel (in-flight)
- [ ] InkorgPreviewSheet (in-flight)
- [x] CognitiveGuardView + banner (in-flight)
- [ ] PlaneringFokusPanel (in-flight)
- [ ] PlaneringParalysEntry (in-flight)
- [ ] MåBra MabraHubView + layout
- [ ] MåBra flow views
- [ ] Ekonomi panels (EconomyPage, log, budget)
- [ ] Arbetsliv hub + delegates
- [ ] MorningCompass polish

---

## Phase 7 — Zone: Hjärtat + Familjen + Valv

- [ ] DagbokInputSuperModule shell
- [ ] Dagbok delegates (reflektion, tyst, burn)
- [ ] SpeglarSuperModule
- [ ] FamiljenPage + 6 tabs
- [ ] FamiljenBarnfokusDelegate UI
- [ ] Barnporten parent panels (not child fullscreen)
- [ ] Trygg Hamn / Biff panels
- [ ] VaultPage + zone tabs
- [ ] ValvSamlaZone (in-flight)
- [ ] WeaverPendingVaultBanner (in-flight)
- [ ] VaultErrorBoundary (in-flight)
- [ ] Remaining vault zones
- [ ] DossierPage style-only pass
- [ ] smoke:valv-security after Valv wave

---

## Phase 8 — Widgets + Android

- [ ] WidgetShell polish
- [ ] WidgetRecordPage
- [ ] WidgetNotePage
- [ ] WidgetCompassPage
- [ ] WidgetHamnPage
- [ ] WidgetFamiljenPage
- [ ] WidgetStampPage
- [ ] WidgetBarnportenPage
- [ ] WidgetSnabbvalPage
- [ ] WidgetVoiceVaultPage
- [ ] WidgetProjektPage
- [ ] WidgetActionDashboardPage
- [ ] smoke:widgets
- [ ] Motorola G85 manual test pass

---

## Phase 9 — Testing infrastructure

- [ ] Implement scripts/count_design_debt.mjs
- [ ] Implement scripts/smoke_no_new_btn_pill.mjs
- [ ] ESLint rule: warn btn-pill-- in modules
- [ ] Optional: Playwright screenshot compare
- [ ] Document results in Dashboard metrics

---

## Phase 10 — Legacy sunset (stretch)

- [ ] Audit unused calm-card classes
- [ ] Extract planering.css patterns to DS
- [ ] Remove dead lab CSS from prod bundle
- [ ] Reduce index.css toward 5000 LOC target
- [ ] Deprecate shared/ui re-exports

---

## Completion

- [ ] All Completion-Criteria.md sections checked
- [ ] Dashboard all prod zones Done
- [ ] smoke:predeploy:build green
- [ ] yolo-vakt GO
- [ ] Pontus sign-off
- [ ] Final PROGRESS.md entry
