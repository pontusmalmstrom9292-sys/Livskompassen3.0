> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.

# Premium UI Polish — TODO

**Version:** 1.1 | **Last updated:** 2026-06-28

Each item is independently completable. Link files in Dashboard when done.

---

## Phase 0 — Baseline

- [ ] Record smoke:design-modules output in PROGRESS.md
- [ ] Record smoke:locked-ux output in PROGRESS.md
- [ ] Screenshot baseline: / @ 390×844 and 1280×800
- [ ] Screenshot baseline: /vardagen
- [ ] Screenshot baseline: /planering
- [ ] Screenshot baseline: /valvet
- [ ] Screenshot baseline: /familjen
- [ ] Screenshot baseline: /hjartat
- [ ] Record btn-pill file count in Dashboard metrics
- [ ] Add PR checklist to team workflow (Testing-Strategy.md)

---

## Phase 1 — Tokens & motion

- [ ] Audit hardcoded hex in src/index.css :root (document, do not break theme)
- [ ] Add focus.ts tokens (--ds-focus-ring)
- [ ] Add zIndex.ts tokens
- [ ] Create src/design-system/motion/presets.ts
- [ ] Create useDsReducedMotion hook
- [ ] Sync ChameleonInputShell to --ds-duration-morph
- [ ] Create DS Skeleton component
- [ ] Create DS Spinner component
- [ ] Write src/design-system/README.md
- [ ] Verify tailwind.config.js ds-* bridge
- [ ] Run validate:session after token changes

---

## Phase 2 — Chrome

- [ ] Premium Header — glass, float, hierarchy (AppHeaderBar)
- [ ] Premium Header — BastaDesignHeader parity
- [ ] Premium Dock — capsule, inner glow (ExecutiveDockBar)
- [ ] Premium Dock — FloatingDock fallback theme
- [ ] Premium Compass — SVG polish (HomeAdaptiveCompass)
- [ ] Premium Compass — LivskompassMark stroke/glow
- [ ] NavigationDrawer — gold active row (visual only)
- [ ] AmbientBackground — depth layers
- [ ] executive-chrome.css token pass
- [ ] smoke:locked-ux after chrome batch
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

- [ ] Create ErrorFallback component
- [ ] Migrate HubErrorBoundary
- [ ] Migrate PlaneringErrorBoundary
- [ ] Migrate VaultErrorBoundary
- [ ] Migrate RAGErrorBoundary
- [ ] Migrate DagbokWizardErrorBoundary
- [ ] Align PageSkeleton with DS Skeleton
- [ ] EmptyState token pass (core/ui/EmptyState.tsx)

---

## Phase 6 — Zone: Hem + Vardagen

- [ ] HomePage depth pass
- [ ] ExecutiveReflektionHero polish
- [ ] Executive home cards (Livslogg, etc.)
- [ ] LivLauncherPage bento grid
- [ ] PlaneringPage (complete in-flight)
- [ ] PlanningKanbanBoard (in-flight)
- [ ] PlaneringInkorgPanel (in-flight)
- [ ] InkorgPreviewSheet (in-flight)
- [ ] CognitiveGuardView + banner (in-flight)
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
