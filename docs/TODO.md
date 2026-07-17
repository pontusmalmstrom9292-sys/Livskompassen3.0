> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.

# Premium UI Polish — TODO

**Version:** 1.2 | **Last updated:** 2026-07-15

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
- [x] Sync prompt mirrors in `docs/prompts/*` with `functions/src/sharedRules.ts` to keep `smoke:prompts` green (2026-06-29)

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

- [x] Batch: Planering module (~15 files) (2026-06-29 migration)
- [x] Batch: Inkast/Capture (~15 files) (2026-06-29 migration)
- [x] Batch: Valv (~20 files) (2026-06-29 migration)
- [x] Batch: MåBra (~25 files) (2026-06-29 migration)
- [x] Batch: Familjen (~20 files) (2026-06-29 migration)
- [x] Batch: Hjärtat/Dagbok (~15 files) (2026-06-29 migration)
- [x] Batch: Widgets (~10 files) (2026-06-29 migration)
- [x] Batch: Core auth/settings (~10 files) (2026-06-29 migration)
- [x] Batch: Remainder + CSS definition cleanup (2026-07-10)
- [x] ESLint/smoke: no new btn-pill-- in modules (btnPillFiles: 0, 2026-07-11)

## Phase 3 — Primitives: Other

- [x] Input: JournalQuickMode, ReflectionEditor (våg 24)
- [x] Input: EconomyLogPanel, inkast forms (våg 24)
- [x] Input: PlaneringNotePinPanel, InboxRuleManager, JournalArchiveToolbar (våg 28)
- [x] Input: Ekonomi/MåBra/Arbetsliv batch (våg 29)
- [x] Banner: deprecate AlertBanner usages (våg 25 — DS Banner wrapper)
- [x] Banner: deprecate ModuleSectionBanner usages (våg 25)
- [x] Card: document BentoCard as sole module API (våg 31)
- [x] UiCard: restrict to /dev routes (våg 31 — KompisHubPage → glass-card)
- [x] Badge: map worm/locked/risk to ds-badge (våg 25 + inbox status våg 31)

---

## Phase 4 — Overlays

- [x] Migrate ZenModeOverlay → DS Modal (våg 23)
- [x] Migrate RecoveryUrgeSosModule dialog (våg 23)
- [x] Migrate AccountAuthMenu dialog (våg 22)
- [x] Migrate PlanningTaskDetail dialog (våg 19 — redan DS Modal)
- [x] Migrate DrogfrihetHubPage dialog section (våg 23)
- [x] Evaluate ImmersiveExperienceShell → Modal (våg 27)
- [x] Fix/rename WormSaveConfirmSheet (våg 27 — role=region dokumenterat)
- [x] Keyboard test each migrated overlay (våg 27 + 33 checklist i PROGRESS)

---

## Phase 5 — States

- [x] Create ErrorFallback component — already exists in DS (2026-06-29)
- [x] Migrate HubErrorBoundary (våg 12)
- [x] Migrate PlaneringErrorBoundary (våg 12 — HubErrorBoundary glow=gold)
- [x] Migrate VaultErrorBoundary (våg 12 + våg 30 glow=blue explicit)
- [x] Migrate RAGErrorBoundary (våg 12 — DS ErrorFallback)
- [x] Migrate DagbokWizardErrorBoundary (våg 12 — DS ErrorFallback glow=gold)
- [x] Align PageSkeleton with DS Skeleton (2026-06-29)
- [x] EmptyState token pass (core/ui/EmptyState.tsx)
- [x] Friendly empty-states for Dagbok, Planering, Familjen list views

---

## Phase 6 — Zone: Hem + Vardagen

- [x] HomePage depth pass (2026-06-29) — executive hero/card depth pass complete
- [x] ExecutiveReflektionHero polish
- [x] Executive home cards (Livslogg, etc.)
- [x] LivLauncherPage bento grid
- [x] ClusterGrid module-card CSS localization
- [x] ReviewQueue status badge CSS localization
- [x] PlaneringPage (complete in-flight)
- [x] PlanningKanbanBoard (in-flight)
- [x] PlaneringInkorgPanel (in-flight)
- [x] InkorgPreviewSheet (in-flight)
- [x] CognitiveGuardView + banner (in-flight)
- [x] PlaneringFokusPanel (in-flight)
- [x] PlaneringParalysEntry (in-flight)
- [x] MåBra MabraHubView + layout
- [x] MåBra flow views
- [x] Ekonomi panels (EconomyPage, log, budget)
- [x] Arbetsliv hub + delegates
- [x] MorningCompass polish

---

## Phase 7 — Zone: Hjärtat + Familjen + Valv

- [x] DagbokInputSuperModule shell
- [x] Dagbok delegates (reflektion, tyst, burn)
- [x] SpeglarSuperModule
- [x] FamiljenPage + 6 tabs
- [x] FamiljenBarnfokusDelegate UI
- [x] Barnporten parent panels (not child fullscreen)
- [x] Trygg Hamn / Biff panels
- [x] VaultPage + zone tabs
- [x] ValvSamlaZone (in-flight)
- [x] WeaverPendingVaultBanner (in-flight)
- [x] VaultErrorBoundary (in-flight)
- [x] Remaining vault zones
- [x] DossierPage style-only pass
- [x] smoke:valv-security after Valv wave

---

## Phase 8 — Widgets + Android

- [x] WidgetShell polish
- [x] WidgetRecordPage
- [x] WidgetNotePage
- [x] WidgetCompassPage
- [x] WidgetHamnPage
- [x] WidgetFamiljenPage
- [x] WidgetStampPage
- [x] WidgetBarnportenPage
- [x] WidgetSnabbvalPage
- [x] WidgetVoiceVaultPage
- [x] WidgetProjektPage
- [x] WidgetActionDashboardPage
- [x] FyrenWidgetBar CSS localization into WidgetShell.css
- [x] smoke:widgets
- [x] WH1/WH2 Executive Midnight polish (discreet native + Inkast copy + WidgetShell panik 44px) — 2026-07-12
- [x] Våg 1 MOD-WIDGET polish — W1EdgeQuickDock executive + widget_bg_premium_panel + WH2 «Snabbanteckning» — 2026-07-14
- [x] G85 device re-verify WH1 tap→spara→Dölj nu + WH2 Inkast + W1 kant (Våg 2, Pontus) — 2026-07-14
- [x] Våg 3 W1 v2 kompakt strip — Theme Lab → prod (`/widget/projekt` + W1EdgeQuickDock) — 2026-07-14
- [x] Motorola G85 manual test pass

---

## Phase 9 — Testing infrastructure

- [x] Implement scripts/count_design_debt.mjs
- [x] Implement scripts/smoke_no_new_btn_pill.mjs
- [x] ESLint rule: warn btn-pill-- in modules
- [x] Optional: Playwright screenshot compare
- [x] Document results in Dashboard metrics

---

## Phase 10 — Legacy sunset (stretch)

- [x] Våg 35–42: Input batches Planering/Familjen/Hjärtat, Badge cleanup, titleHub/a11y, index sunset batch (2026-07-09)

- [x] Audit unused calm-card classes
- [x] Extract planering.css patterns to DS
- [x] Remove dead lab CSS from prod bundle
- [x] Reduce index.css toward 5000 LOC target (3837 LOC)
- [x] Deprecate shared/ui re-exports
- [x] Remove dead smart-bar / unlock-gate CSS from prod bundle
- [x] Remove dead nav-drawer calm-2 selector
- [x] Remove dead projekt-picker-sheet selectors
- [x] Remove dead ambient blob variants (indigo/white)
- [x] Remove dead btn-pill--primary selector
- [x] Remove dead pin-gate / input-glass--pin selectors
- [x] Remove dead glass-nav selector
- [x] Remove dead familjen-hub__aurora selectors
- [x] Remove dead mabra-vit-hub__quick selector
- [x] Remove dead dock-hub-band__context selector
- [x] Remove dead dock-hub-band__pad selector
- [x] Remove dead familjen-hub header/title/tabs selectors
- [x] Remove dead familjen-hub selector
- [x] Remove dead familjen-kunskap-panel selector
- [x] Remove dead kompis-hub-page__avatar selector
- [x] Remove dead kompis-hub-page__intro selector
- [x] Remove dead dock-center__label selector
- [x] Remove dead dock-classic__context-close selector
- [x] Remove dead dock-classic__context-title selector
- [x] Remove dead dock-classic__context-body selector
- [x] Remove dead dock-classic__context selector
- [x] Remove dead dock-classic__center:hover selector
- [x] Remove dead dock-classic__mark selector
- [x] Remove dead dock-classic__side--active label selector
- [x] Remove dead dock-classic__side--active selector
- [x] Remove dead dock-classic__side--active side-icon selector
- [x] Remove dead dock-classic__center--active selector
- [x] Remove dead dock-classic__center--holding selector
- [x] Remove dead dock-classic__center side-label selector
- [x] Remove dead dock-classic__center selector
- [x] Remove dead dock-classic__side-label selector
- [x] Remove dead dock-classic__side selector
- [x] Remove dead dock-classic__side-icon selector
- [x] Remove dead dock-classic selector
- [x] Remove dead dock-classic__plate selector
- [x] Remove dead hub-chrome-tile--side selector
- [x] Remove dead dock-nav-btn--active dock-nav-btn__chrome-v4 selector
- [x] Remove dead dock-nav-btn__glyph selector
- [x] Remove dead floating-dock__side-btn--planering selectors
- [x] Remove dead floating-dock__side-btn--dagbok selectors
- [x] Våg 111: legacy src/styles CSS stubs borttagna (design-packs, obsidian-calm-2, redesign-*, brushed-brass-neu)
- [x] Remove dead floating-dock__side-btn--vardag selectors
- [x] Remove dead dock-nav-btn__chrome-v5 selector from index.css

---

## Completion

- [ ] All Completion-Criteria.md sections checked
- [ ] Dashboard all prod zones Done
- [x] smoke:predeploy:build green (2026-07-11)
- [x] yolo-vakt GO (MOD-WIDGET våg 4 — 2026-07-14)
- [ ] Pontus sign-off
- [ ] Final PROGRESS.md entry

## 2026-07-12 — Android Studio YOLO våg
- Inkorg-flik touch + routing fix (GoraHubTabBar, TabBar)
- Liv och göra redirects (widgetSiloConfig, livLauncherRoutes, hemInkast)
- Android viewport CSS + smoke:android-viewport
- Docs: OFFLINE-ANDROID, FIREBASE-AUTH-LATHUND, .context/android-capacitor.md
- Smoke: android-platform, planering-gora-e, inkast-fas2, locked-ux, cost-guard PASS

- [x] MOD-WIDGET Standalone v1 — 5 vågor (skin, WH7, auth bypass) 2026-07-14
## 2026-07-14 — YOLO v41 GOVERNANCE sync
- [x] PROJECT_STATE synkad (v40 INTEGRATION GO + v41 governance)
- [x] LOCK-MANIFEST v1.17 — register ↔ entryFiles (22 moduler, 24 entryFiles)
- [x] `smoke:governance` + `smoke:module-lock` PASS
- [x] Eval: `docs/evaluations/2026-07-14-governance-v41.md`

## 2026-07-15 — Grok 4.5 Android App Check harden
- [x] Release nollställer debug-token (build.gradle) + BuildConfig.DEBUG bootstrap-gate
- [x] LkNativeBuildPlugin: JS aktiverar debug-provider endast när native DEBUG ∧ token
- [x] AppCheckDebugBootstrap: korrekt Firebase prefs-key + apply före WebView
- [x] smoke:android-platform utökad (release-clear, app-id-match, plugin, fail-closed)
- [x] Eval: `docs/evaluations/2026-07-15-grok45-android-appcheck-yolo.md`
- Smoke: `smoke:android-platform` PASS · `smoke:valv-security` PASS · `typecheck:core-strict` PASS
## 2026-07-17 — Valv kickout Android
- [x] Zero Footprint: native appStateChange + unlock-in-flight suppress
- [x] Eval: docs/evaluations/2026-07-17-valv-kickout-zero-footprint-android.md

## 2026-07-17 — G85 App Check live-harden
- [x] Vite prod strip + build assert mot debug-token i Hosting/APK-web
- [x] Release clearStaleDebugSecret (SharedPreferences)
- [x] appCheck debugTokenFromEnv DEV-only
- [x] smoke:android-platform: dist-leak + ZF appStateChange + vite-strip
- [x] Eval: docs/evaluations/2026-07-17-g85-appcheck-yolo.md

