# Premium UI Polish — Completion Criteria

**Version:** 1.1 | **Last updated:** 2026-06-28

Project is **complete for v1 polish release** when all sections below pass. 
### Phase 10 våg 105–110 — obsidian/executive/index CSS sunset (2026-07-10)
- [x] Våg 105: `obsidian-calm-glass.css` (calm-card, glass-card, bento, glow)
- [x] Våg 106: `obsidian-calm-shells.css` (hub-view-lock, app chrome)
- [x] Våg 107: `design-packs-chrome.css` (D1–D5)
- [x] Våg 108: `exec-home-chrome.css` (hem executive, snabbstart)
- [x] Våg 109: `exec-header-chrome.css` (header, resurser overlay)
- [x] Våg 110: `theme-mockup-overrides.css`, `dim-mode.css`, `typography-utils.css` + alt theme packs
- [x] `index.css` import-only + stub-kommentarer; legacy stubs behållna
- [x] Dock/reference-dock oförändrat i `executive-chrome.css` + `dock-kanon-match.css`
- [x] indexCssLoc: **66** (mål ≤120 ✓)
- [x] smoke:locked-ux, smoke:chrome-header, smoke:basta-dock-lock, smoke:design-debt, smoke:design-modules, smoke:predeploy:build

### Phase 10 våg 99–104 — tokens/primitives CSS sunset (2026-07-10)
- [x] 7 nya filer i `src/design-system/styles/` (theme-tokens-core, theme-tokens-zones, theme-pack-base, btn-pill-bridge, legacy-primitives, planering-routines, mabra-collapsible)
- [x] våg 93–98-filer återställda (ambient, nav-drawer, dagbok, mabra, kompis m.fl.)
- [x] `@import` i `index.css` efter kompis-hub.css, före basta-design.css
- [x] Stub-kommentarer; M-mockup overrides + html.dim-mode kvar i index.css
- [x] indexCssLoc: **142** (mål ≤400 ✓)
- [x] smoke:locked-ux, smoke:chrome-header, smoke:basta-dock-lock, smoke:design-debt, smoke:design-modules, smoke:predeploy:build

### Phase 10 våg 92 — dock/hub CSS sunset (2026-07-10)
- [x] 6 filer i `src/design-system/styles/` (hub-chrome-tile, dock-hub-band, floating-dock, dock-orbit-hub, dock-compass-hub, hub-adaptive-shell)
- [x] `@import` i `index.css` utan dubletter
- [x] Stub-kommentarer per block i `index.css`
- [x] `.btn-pill*` kvar i `index.css` (ej denna våg)
- [x] indexCssLoc: **2155** (superseded by våg 99–104 → 142)
- [x] smoke:locked-ux, smoke:chrome-header, smoke:basta-dock-lock, smoke:design-modules, smoke:predeploy:build

Phase 10 (legacy CSS sunset) is **optional stretch** — not blocking.

## 1. Visual & UX (no redesign)

- [x] Layout, navigation, and information hierarchy unchanged vs pre-polish baseline
- [x] Executive Midnight DAD preserved — compass centered, dock structure, header hierarchy
- [ ] Pontus sign-off: "feels more premium, not a different app" (per zone)
- [x] smoke:locked-ux + smoke:design-modules + smoke:locked-icons green

## 2. Responsive

- [ ] 320px–1440px without horizontal scroll on prod routes
- [x] Dock clearance: `--ds-space-dock-clearance` / `--app-dock-clearance` respected
- [x] Widget routes usable at phone widget sizes
- [ ] Android G85 manual pass documented in Progress.md

## 3. Accessibility (WCAG 2.1 AA target)

- [x] **1.4.3** Contrast — text ≥ 4.5:1; large text ≥ 3:1 on navy/glass surfaces *(UI Polish v3 zon-pass text-dim→muted 2026-07-22; stickprov)*
- [x] **2.4.7** Focus visible on prod hub batches — partial global; Planering/Dagbok/TabBar covered (våg 40)
- [x] **2.5.5** Touch targets ≥ 44×44px — TabBar/chip + ModuleHelpHint (våg 40) + Hem/widgets v3
- [ ] **4.1.2** Name/role/value — icon buttons have aria-label
- [x] Keyboard: Tab order, Escape on overlays, Enter/Space on buttons *(QuickCapture Sheet Escape/focus trap)*
- [x] prefers-reduced-motion: zero/transform-none on animations (premium-polish + tokens)
- [x] prefers-reduced-transparency: fallback surfaces where blur used (premium-polish cards/dock 2026-07-18; BIFF bait 2026-07-22)

## 4. Design system adoption

- [x] Zero **new** btn-pill-- classes in src/modules/** after project start date (smoke:design-debt btnPillFiles=0)
- [ ] All hub shells use DS Banner (not AlertBanner / ModuleSectionBanner)
- [x] New overlays use DS Modal or Sheet *(QuickCaptureOverlay → Sheet 2026-07-22; adHocDialog=2)*
- [ ] Skeleton/Spinner exported from design-system
- [ ] motion/ module used for new Framer animations
- [ ] No new hardcoded hex/rgb in src/modules/** (excl. sandbox, /dev)

## 5. Typography & spacing

- [ ] Hub eyebrows use textStyles.eyebrow or Tailwind text-eyebrow
- [ ] Component padding uses --ds-space-* tokens
- [ ] 4px rhythm — no arbitrary p-[13px] in touched files

## 6. Animation

- [ ] CSS durations from --ds-duration-*
- [ ] Framer hooks use useReducedMotion()
- [ ] Chameleon morph = --ds-duration-morph (350ms)

## 7. Zone coverage

- [ ] All prod routes in Dashboard.md marked Done (excl. /dev/*)
- [ ] 11 widget routes Done
- [ ] Error boundaries use unified ErrorFallback

## 8. Testing & release

- [x] npm run smoke:predeploy:build green (2026-07-09, våg 42)
- [ ] validate:session (Playwright tokens) green
- [ ] Phase 0 vs final screenshot comparison (6 routes) — no unintended layout shift
- [ ] yolo-vakt GO documented
- [ ] Progress.md final entry with files changed summary

## 9. Stretch goals (Phase 10 — not blocking)

- [ ] index.css ≤ 5000 LOC
- [ ] Lab CSS loaded only on /dev routes
- [ ] @/shared/ui deprecated; direct @/design-system imports

## Sign-off

| Role | Name | Date |
|------|------|------|
| Product owner | Pontus | |
| YOLO gate | yolo-vakt | |
| Lead UI | Agent/PR author | |

## 10. Cognitive UX (product owner profile)

- [ ] Max one primary action per panel (progressive disclosure)
- [ ] No new menu levels or navigation paths
- [ ] Hub shells: eyebrow + title + one lead — no wall of badges
- [ ] Error messages: short, actionable, no blame language
- [ ] Loading: skeleton over blank screen; no infinite spinners without text
- [ ] Polish must not increase visible choices on existing screens
