### 2026-07-22 — UI Polish V4 ×10 PASS 4
- ADD-only touch/focus on Planering · Dagbok · MåBra · QuickCapture · Archive · KompassDiscovery
- Inget borttaget · `/dev` skipped · G85 visual: pending Pontus

### 2026-07-22 — UI Polish V4 ×10 PASS 3
- Samma förbättringsvågor igen (ADD-only) · UX GO · design-debt 0/0/2/62
- G85 visual: pending Pontus

### 2026-07-22 — Companion Kap. 6 ×10 + chip-rensning
- Status: **Done** · MOD-WIDGET re-locked · unlock legacy-chip-removal (`approved: yes`)
- Polish: web `--cw-*` deepen + Android companion capture/note/insight layouts (Gold Standard kap. 6)
- Bort: legacy chip `Compass` / `Hamn` / `Note` providers (dubbletter av Companion rich)
- Smoke: `smoke:companion-widgets` · `smoke:widgets` · `smoke:locked-ux` · `smoke:module-lock` **PASS**
- Nästa: Pontus G85 pin-test (visuell parity + Capture/Note/Tasks)

### 2026-07-22 — UI Polish V4 ×10 FULL RE-RUN
- Status: **kod Done** (andra varvet I1–I10) · UX guardian GO · smoke:predeploy:build PASS
- design-debt: btnPill 0 · dsBtn 0 · adHoc 2 · indexCssLoc 62 · DS 276 (`2026-07-22T08:26:34.625Z`)
- G85 visual: pending Pontus

### Design debt (2026-07-22) — UI Polish V4 ×10 end metrics
- btn-pill--: **0** · ds-btn--: **0** · ad-hoc dialog: **2** · index.css LOC: **62**
- DS imports: **276** · smoke:design-debt `2026-07-22T07:42:36.290Z`
- Circuit I1–I10 × W0–W11: **kod PASS** · G85 visual: pending Pontus

### Design debt (2026-07-22) — UI Polish V4 W0 baseline
- btn-pill--: **0** · ds-btn--: **0** · ad-hoc dialog: **2** · index.css LOC: **62**
- DS imports: **276** · smoke:design-debt `2026-07-22T07:34:04.186Z`
- calm-card-audit: **PASS**

## 2026-07-22 — UI Polish V4 W3–W11 deepen pass 3

- ADD-only a11y: `min-h-11` + `focus-visible:ring-accent/40` on Speglar, Inkast, Drogfrihet, Hamn/BIFF, Valv UI, Inställningar, Widgets routes, Arbetsliv, MabraFlow/Hub
- No tabs/modes/flows removed · `/dev` skipped · no WORM
- Verify: esbuild TSX batch PASS · zone focus-visible coverage 0 remaining gaps

## 2026-07-22 — UI Polish V4 W3–W9 deepen pass 2

- Zone a11y polish (Familjen/Valv/Projekt/Ekonomi/MåBra/Planering) — touch 44 + focus-visible + muted
- Gates: build + locked-ux + design-modules PASS

## 2026-07-22 — UI Polish V4 ×10

- Program: **UI Polish V4 ×10** under Fas 24 (parallel med G85 daily driver)
- Unlock: `docs/evaluations/2026-07-22-unlock-MOD-UI-POLISH-V4-X10.md` (`approved: yes`)
- Circuit: W0–W11 × I1–I10 (120 slots) — refine only
- Status: **Done (kod)** — I1–I10 × W0–W11 PASS smoke; G85 visual väntar Pontus
- Metrics: refresh via `smoke:design-debt` on W0 / end of each I

| Iter | Focus | Status |
|------|-------|--------|
| I1 | kontrast + 44px | **PASS** (kod+smoke) |
| I2 | focus-visible | **PASS** (kod+smoke) |
| I3 | focus-within | **PASS** (kod+smoke) |
| I4 | reduced-motion/transparency | **PASS** (kod+smoke) |
| I5 | aria-label | **PASS** (kod+smoke) |
| I6 | 320px scroll | **PASS** (kod+smoke) |
| I7 | token rhythm | **PASS** (kod+smoke) |
| I8 | empty/loading | **PASS** (kod+smoke) |
| I9 | motion tokens | **PASS** (kod+smoke) |
| I10 | micro-typography | **PASS** (kod+smoke) |

---

## 2026-07-22 — Interaktiva Companion Widgets (WIS)

- INTERACTIVE FIRST: overlay + broadcast (ingen full app för primär write/record/toggle)
- Skill + 5 underagenter · bible kap. 7 · unlock MOD-WIDGET companion-interact (`approved: yes`)
- Smoke: `smoke:companion-widgets` **PASS**
- Nästa: Pontus G85 manuell pin-test (Capture hold · Note skriv · Tasks bocka)

---

## 2026-07-22 — UI Polish v3 (alla zoner)

### Design debt (2026-07-22) — post QuickCapture Sheet
- btn-pill--: **0** · ds-btn--: **0** · ad-hoc dialog: **2** (CustomCategoryFlow + FetchContentPacksFlow; QuickCapture = Sheet) · index.css LOC: **61**
- DS imports: **276** · smoke:design-debt `2026-07-22T03:48:19.941Z`
- Unlock: `docs/evaluations/2026-07-22-unlock-MOD-UI-POLISH-V3.md`
- Smoke: locked-ux · design-modules · mabra · planering-superhub · children · widgets · module-lock **PASS**

---

## 2026-07-21 — Premium UI Phase 0 debt baseline (YOLO v8)

### Design debt (2026-07-21) — Fas 24.C baseline refresh
- btn-pill--: **0** · ds-btn--: **0** · ad-hoc dialog: **3** · index.css LOC: **61**
- DS imports: **268** · smoke:design-debt `2026-07-21T12:27:32.000Z`

## 2026-07-21 — Copilot YOLO improve waves (design-debt refresh)

### Design debt (2026-07-21) — polish-vågor + copy-audit PASS

- indexCssLoc: **61** (mål ≤120 ✓)
- btnPill: **0** · dsBtn: **0** · adHocDialog: **3** (home/dev×2 CustomCategoryFlow+FetchContentPacksFlow; QuickCaptureOverlay deferred — ResurserOverlay already Sheet)
- DS imports: **267** · smoke:design-debt `2026-07-21T11:25:32.666Z`
- copy-audit: **PASS** (KASAM → kvällscheck i proaktivt minneskort)
- YOLO: copy-audit-quickfixes PASS · fortsätter design-debt → session-log-v2 → …

## 2026-07-18 — Fas 24 förbättringsplan

- G85 7d started; App Check Valv paths expanded; a11y transparency fallback; Planering/Hjärtat → Done (sign-off waits).
- Eval: docs/evaluations/2026-07-18-appcheck-valv-kickout-fix.md

## 2026-07-17 — PROJECT_STATE v1.3 sync

- Fas 24: P0 G85 7-day **STARTED 2026-07-18**. Phase 10 visual sign-off väntar (Pontus).
- Marathon v40–v48 GO synkad; stubs borttagna (motsägelse bort).
- Eval: docs/PROJECT_STATE.md v1.3

---

### Design debt (2026-07-13) — v12 P80 guard PASS

> **2026-07-17:** Doc-städ säkerhetskanon — Device Clear + Fas 24/Phase 10 synk; FAS13–23 arkiverade. `smoke:governance` PASS.
- YOLO v12 P75–P83 GO · P74 deploy SKIP
- indexCssLoc: **61** (mål ≤120 ✓)
- btnPill: **0** · dsBtn: **0** · adHocDialog: **0**
- DS imports: **253** · smoke:design-debt `2026-07-13T17:13:26.333Z`
- copy-audit + calm-card-audit: **PASS** (v12 P80)
- Module-lock: **22/22 locked** · Hosting live (v9 deploy)



### Design debt (2026-07-13) — v11 P69 guard PASS
- YOLO v11 P64–P72 GO · P73 deploy SKIP

### Design debt (2026-07-13) — v10 P59 guard PASS
- indexCssLoc: **61** (mål ≤120 ✓)
- btnPill: **0** · dsBtn: **0** · adHocDialog: **0**
- DS imports: **253** (v11 P69) · smoke:design-debt `2026-07-13T16:54:59.066Z`
- copy-audit + calm-card-audit: **PASS** (v10 P59)
- Module-lock: **22/22 locked** · Hosting live (v9 deploy)

> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.

# Premium UI Polish — Dashboard

**Version:** 1.4 | **Last updated:** 2026-07-21

**Rule:** Update this file after each merge wave. Do **not** use guessed progress % — use Status + metric columns.

**Status values:** Not Started | In Progress | Blocked | Done

---

## Program metrics (Phase 0 baseline — fill on kickoff)

| Metric | Baseline | Current | Target |
|--------|----------|---------|--------|
| btn-pill-- file count | ~195 (estimated) | **0** (2026-07-21, smoke:design-debt) | 0 new after start |
| ds-btn-- file count | ~202 (estimated) | **0** (2026-07-21, smoke:design-debt) | 0 new after start |
| calm-card variant audit | not tracked | **PASS** (2026-06-29, smoke:calm-card-audit) | no unused variants |
| DS import files (`@/design-system`) | ~14 | **268** (2026-07-21, smoke:design-debt) | All blocking overlays migrated |
| ad-hoc role=dialog | ~14 | **3** (2026-07-21 — home/dev×2 + QuickCaptureOverlay defer; ResurserOverlay=Sheet) | ≤3 documented |
| index.css LOC | 6816 | **61** (2026-07-21, smoke:design-debt) | ≤120 ✓ |
| smoke:design-modules | TBD | **PASS** (2026-07-09, våg 35–42) | green |
| smoke:locked-ux | TBD | **PASS** (2026-07-09) | green |
| smoke:freeport-premium-compare | TBD | **PASS** (2026-06-29) | visual compare green |
| `zone-valv` route chunk (js) | 768.53 kB | 2.65 kB | keep route-entry small |
| `typecheck:core-strict` scope | core/shared/morning | core/shared/features/morning (PASS 2026-06-28) | features included |

Baseline recorded via `npm run smoke:design-debt` (2026-06-29). **Refresh 2026-07-21T12:41:36.311Z** (YOLO v9 adhoc-dialog-audit): btnPill **0**, dsBtn **0**, adHocDialog **3** (CustomCategoryFlow, FetchContentPacksFlow, QuickCaptureOverlay — ResurserOverlay already DS Sheet; NavigationDrawer excluded/locked), indexCssLoc **61**, DS imports **268**. Re-run before each merge wave.



### Kontrast-audit navy/glass (YOLO v9 · 2026-07-21)

Stickprov Completion **1.4.3**: body/lead på glass `text-text-dim` → `text-text-muted` i TryggHamnHub, BiffTriage, Hem-kort (AdaptiveMemory/Superhub/Brass/VaultLearning/Ankare/DevelopmentBento), EvidenceMediaAttach, ActCalibration. Micro-eyebrows lämnade dim.

### Ad-hoc dialog audit (YOLO v9 · 2026-07-21)

| Fil | Status |
|-----|--------|
| `src/modules/core/navigation/ResurserOverlay.tsx` | **Done** — DS `Sheet` (ej ad-hoc) |
| `src/modules/core/home/dev/CustomCategoryFlow.tsx` | **Defer** — sandbox/dev |
| `src/modules/core/home/dev/FetchContentPacksFlow.tsx` | **Defer** — sandbox/dev |
| `src/modules/features/voiceToVault/components/QuickCaptureOverlay.tsx` | **Done** — DS `Sheet` (UI Polish v3 2026-07-22) |
| `NavigationDrawer.tsx` | **Excluded** — locked; ingen ombyggnad |


---

## Delivery workflow hardening (2026-06-28)

- **Status:** Done
- **Scope:** Practical delivery plan + safe Git branch/merge routine added
- **Files:** `docs/DELIVERY_PLAN.md`, `docs/GIT_WORKFLOW.md`, `.github/workflows/pr-smoke-gate.yml`, `package.json`
- **Quality signal:** PR smoke gate now also runs `npm run test:agents-ui`
- **2026-06-29 note:** `smoke:prompts` drift fixed by syncing `docs/prompts/*` mirrors with `sharedRules.ts` (PR smoke gate root cause).

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
- **Status:** Done
- **Priority:** High
- **Dependencies:** Button, Sheet
- **Files:** PlaneringPage, PlanningKanbanBoard, InkorgPreviewSheet, CognitiveGuard*, PlaneringFokusPanel, PlaneringInkorgPanel, PlaneringParalysEntry
- **Notes:** Shells and panels polished for Fas 24; Pontus visual sign-off still open (program Phase 10).

### Valv
- **Status:** Done
- **Priority:** High
- **Dependencies:** Button, Banner
- **Files:** ValvSamlaZone, WeaverPendingVaultBanner, VaultErrorBoundary, VaultPage
- **Notes:** VaultPage, the Samla zone, Weaver pending banner, the error boundary, the remaining vault zone shells, and Dossier now share the calmer Valv frame.

### MåBra
- **Status:** Done
- **Priority:** High
- **Files:** MabraHubView, MabraLayout, flow views, LivLauncherPage
- **Notes:** MåBra now shares the calmer hub shell, launcher surface, and flow-card treatment.

### Ekonomi
- **Status:** Done
- **Priority:** Medium
- **Files:** EconomyPage, EconomyBudgetTab, EconomyLogPanel, EconomyOverviewPanel
- **Notes:** Ekonomi now uses the calmer page shell and the budget/log panels share the same restrained frame.

### Familjen
- **Status:** Done
- **Priority:** High
- **Files:** FamiljenPage, tab panels, Barnfokus delegate
- **Notes:** FamiljenPage, the universal input hub, the Barnfokus/reflektion/tillsammans surfaces, the child-moment tabs, the mönster/kunskap/känslotemplet surfaces, and the parent-facing Hamn/Barnporten panels now share a calmer frame.

### Hjärtat / Dagbok
- **Status:** Done
- **Priority:** High
- **Files:** DagbokInputSuperModule, SpeglarSuperModule
- **Notes:** SuperModule shells and delegates share premium frame; Pontus visual sign-off still open (program Phase 10).

### Widgets (11 routes)
- **Status:** Done (våg 1–3 code complete)
- **Priority:** High
- **Files:** src/modules/features/widgets/**
### MOD-WIDGET WH1/WH2 (2026-07-14)
- **Status:** Våg 1–3 PASS — W1 kompakt rail i prod 2026-07-14
- **Native:** widget_bg_premium_panel + guldkrets; WH1 discreet; WH2 «Snabbanteckning» + Inkast subtitle
- **In-app:** W1EdgeQuickDock → kompakt projekt-strip (7 val); `/widget/projekt` med rail; widget-route utan chrome
- **Smoke:** widgets, widget-ingest, locked-icons, locked-ux, design-modules PASS
- **Sync:** build:web + cap sync android PASS · MOD-WIDGET re-locked 2026-07-14


### Legacy CSS sunset
- **Status:** In Progress
- **Priority:** Low (stretch)
- **Files:** src/index.css
- **Notes:** Planering card shell polish lives in premium-polish; lab CSS and widget/core chrome moved to route/layout chunks, trimming the global bundle.

### shared/ui re-exports
- **Status:** Done
- **Priority:** Low (stretch)
- **Files:** src/modules/shared/ui/index.ts, src/modules/shared/ui/README.md, src/modules/README.md
- **Notes:** The barrel now stays local to shared primitives; design-system re-exports were removed.

### Accessibility WCAG AA
- **Status:** In Progress
- **Priority:** Critical (cross-cutting)
- **Files:** premium-polish.css (focus-visible, reduced-motion, reduced-transparency cards)
- **Notes:** Foundation pass 2026-07-18 — focus ring + reduced-transparency card/glass fallback. 2026-07-20: Planering/Valv reduced-transparency fallback + Valv PDF export aria-label + Valv contrast/keyboard sweep (Escape i zonväljare) + MåBra vit-hub polish (focus-visible, touch-target, contrast) + app-wide Wave 1 i DS-lagret (small-button touch-target, badge contrast, input/chip focus-visible) + app-wide Wave 2 (Button/ButtonLink icon `aria-label` fallback via `title`) + app-wide Wave 3 (drawer/dock focus-visible + touch-target + small-label contrast) + app-wide Wave 4 (nav-drawer sections, Planering routines, MåBra collapsible, Reflektion panel contrast/focus/touch-target) + app-wide Wave 5 (dock hub/compass, Dagbok mode/handoff, adaptive-card focus/touch-target/contrast) + app-wide Wave 6 (executive home/header + Obsidian shell/glass focus-visible, touch-target, contrast). 2026-07-21: app-wide Wave 7 med dock center-label hardening (`floating-dock__center-label`) och selector-säker core-chrome polish. 2026-07-21: app-wide Wave 8 med Home Layout A keyboard focus-visible polish för snabbval/tile/step/link/strip i `obsidian-calm-shells.css`. 2026-07-21: app-wide Wave 9 med Home Layout A hero-inset `:focus-visible` ring/contrast polish i `obsidian-calm-shells.css`. 2026-07-21: app-wide Wave 10 med Home Layout A `:focus-within` polish för hero-card/tile i `obsidian-calm-shells.css`. 2026-07-21: app-wide Wave 11 med Home Layout A reduced-motion polish (`prefers-reduced-motion`: inga transitions på snabbval/tile/step/link). 2026-07-21: app-wide Wave 12 med Home Layout A transition-token polish (går från hårdkodad 0.15/ease till DS duration/ease tokens för snabbval/tile/link). 2026-07-21: app-wide Wave 13 med transition-token + reduced-motion-täckning även för Home Layout A strip (`home-layout-a__strip`). 2026-07-21: app-wide Wave 14 med transition-token polish för Home Layout A step-button (`home-layout-a__step-btn`). 2026-07-21: SAFE YOLO `ui-polish-v2-vardagen` — Vardagen/MåBra/Planering polish i `mabra.css`, `planering.css`, `compasses.css`, `vardagen.css` (focus-visible, 44px touch-target där relevant, reduced-motion/transparency fallback, depth + typografi), utan flödesändring. 2026-07-21 (autopilot): verifierad med full våg 2-kedja (`build`, `smoke:locked-ux`, `smoke:design-modules`, `smoke:mabra`, `smoke:predeploy:build`) PASS. Remaining: bred icon aria-label sweep och kontrast-audit i övriga zoner.

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

## 2026-07-12 — Android Studio YOLO våg
- Inkorg-flik touch + routing fix (GoraHubTabBar, TabBar)
- Liv och göra redirects (widgetSiloConfig, livLauncherRoutes, hemInkast)
- Android viewport CSS + smoke:android-viewport
- Docs: OFFLINE-ANDROID, FIREBASE-AUTH-LATHUND, .context/android-capacitor.md
- Smoke: android-platform, planering-gora-e, inkast-fas2, locked-ux, cost-guard PASS

## 2026-07-14 — MOD-WIDGET våg 4 YOLO
- W1EdgeQuickDock + W1KompaktProjektRail (7 val)
- smoke:predeploy:build + governance PASS
- YOLO GO — merge-ready, deploy SKIP

| MOD-WIDGET Standalone v1 | 2026-07-14 | WH1–WH7 + prod skin + auth bypass | locked |

## 2026-07-15 — Android App Check harden (Grok 4.5 YOLO)
- Native debug-provider gated by BuildConfig.DEBUG via LkNativeBuildPlugin
- smoke:android-platform PASS (expanded regressions)
- Eval: docs/evaluations/2026-07-15-grok45-android-appcheck-yolo.md

## 2026-07-17 — G85 App Check live-harden
- Prod Hosting/APK-web: debug-token strip + build refuse on leak
- Release clears stale App Check debug SharedPreferences
- smoke:android-platform expanded (dist-leak, ZF appStateChange)
- Eval: docs/evaluations/2026-07-17-g85-appcheck-yolo.md
