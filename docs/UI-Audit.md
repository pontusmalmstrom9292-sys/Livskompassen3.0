# Premium UI Polish — UI Audit

**Version:** 1.1 | **Last updated:** 2026-06-28

Method: static analysis + route inventory + component grep. Severity: Critical | High | Medium | Low.

---

## Summary

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Visual / typography | 0 | 2 | 4 | 2 |
| Shadow / depth | 0 | 0 | 3 | 1 |
| Animation | 0 | 0 | 3 | 0 |
| Accessibility | 0 | 3 | 4 | 1 |
| Performance | 0 | 0 | 2 | 2 |
| Technical debt | 1 | 3 | 4 | 3 |
| **Total** | **1** | **8** | **20** | **9** |

---

## Visual / typography / spacing

| ID | Description | Severity | Recommendation | Effort |
|----|-------------|----------|----------------|--------|
| V-01 | Dual classes on cards: calm-card + ds-card + bento-card | High | Document bridge; sunset in Phase 10 | 2d |
| V-02 | Ad-hoc typography text-[10px] tracking-[0.22em] vs textStyles.eyebrow | Medium | Replace in hub shells first | 3d |
| V-03 | InsightsInput hardcoded bg-black/20 border-white/10 | Medium | Map to --ds-color-surface | 1h |
| V-04 | Three card APIs: Card, BentoCard, UiCard | High | BentoCard prod; UiCard dev-only | 2d |
| V-05 | module-bento-card--depth excludes hover intentionally | Low | Document in Design-System-Plan | 1h |
| V-06 | Mixed glow classes glow-bottom-gold vs ds elevation | Medium | Standardize on --ds-elevation-* | 2d |
| V-07 | Hub title sizes differ ModuleShell vs HubPageShell | Medium | textStyles.titleHub everywhere | 1d |
| V-08 | Arbitrary Tailwind spacing p-[13px] in older panels | Low | --ds-space-* on touch | 2d |

---

## Shadow / glass / depth

| ID | Description | Severity | Recommendation | Effort |
|----|-------------|----------|----------------|--------|
| S-01 | Flat panels without elevation tokens | Medium | premium-polish zone pass | 5d |
| S-02 | glass-card vs ds-glass-panel overlap | Medium | GlassPanel for toolbars | 1d |
| S-03 | Missing inner border on some calm-card variants | Medium | premium-polish ::after sheen | 4h |
| S-04 | Nested backdrop-filter stacks | Medium | Max 2 blur layers per viewport | 4h |

---

## Animation

| ID | Description | Severity | Recommendation | Effort |
|----|-------------|----------|----------------|--------|
| A-01 | Chameleon 300ms vs --ds-duration-morph 350ms | Medium | Sync ChameleonInputShell | 2h |
| A-02 | ~24 framer-motion files outside DS | Medium | design-system/motion presets | 1d |
| A-03 | Framer hooks missing useReducedMotion | Medium | Audit all motion files | 4h |

---

## Accessibility

| ID | Description | Severity | Recommendation | Effort |
|----|-------------|----------|----------------|--------|
| X-01 | Icon-only btn-pill without aria-label | High | Button migration + aria | 2d |
| X-02 | ~14 ad-hoc dialogs without DS focus trap | High | Phase 4 overlay migration | 3d |
| X-03 | Inconsistent focus-visible on ghost buttons | Medium | premium-polish.css block | 4h |
| X-04 | Touch targets < 44px in chip rows | Medium | min-h-[var(--ds-touch-target)] | 1d |
| X-05 | Gold on navy contrast not verified all states | High | Contrast audit disabled/hover | 1d |
| X-06 | prefers-reduced-transparency not handled | Medium | Fallback solid surfaces | 4h |
| X-07 | ModuleHelpHint popover keyboard | Medium | Migrate or add roving tabindex | 4h |
| X-08 | Native checkbox unstyled in forms | Low | Future Checkbox primitive | 2d |

---

## Performance

| ID | Description | Severity | Recommendation | Effort |
|----|-------------|----------|----------------|--------|
| P-01 | index.css 6816 LOC loaded in prod | Medium | Phase 10 sunset | 6d |
| P-02 | Lab theme CSS in main bundle | Medium | Route-split /dev packs | 2d |
| P-03 | backdrop-filter on many cards | Low | contain + G85 test | 4h |
| P-04 | Large monolith re-renders on polish | Low | Profile before memo | — |

---

## Technical / design debt

| ID | Description | Severity | Recommendation | Effort |
|----|-------------|----------|----------------|--------|
| D-01 | ~195 files reference btn-pill--* | **Critical** | Phase 3 batch migration | 15–22d |
| D-02 | 5 error boundary fallback UIs | Medium | ErrorFallback | 1d |
| D-03 | DS Input exported, unused in features | High | Form module standard | 3d |
| D-04 | WormSaveConfirmSheet not a Sheet | Low | Rename or wrap | 2h |
| D-05 | bästa design/ shadcn prototype confusion | Low | README pointer | 1h |
| D-06 | cn vs clsx direct import split | Low | Standardize cn | 2h |
| D-07 | Badge legacy worm/locked/risk classes | Medium | ds-badge modifiers | 1d |
| D-08 | No design-system README | Medium | Phase 1 doc | 2h |
| D-09 | ~140 @/shared vs ~22 @/design-system | High | Import policy + lint | ongoing |
| D-10 | Duplicate executiveHomeMotion / bastaDesignMotion | Medium | motion/ module | 4h |
| D-11 | ExamplePreviewCard uses planering-tool-card not DS | Low | Align or document exception | 2h |

---

## Route inventory (prod polish status)

Status key: NS=Not Started, IP=In Progress, DN=Done

| Route | Zone | Status | Notes |
|-------|------|--------|-------|
| / | Hem | NS | Executive hero |
| /vardagen | Vardagen | NS | LivLauncherPage |
| /planering | Vardagen | IP | Active polish |
| /planering/kalender | Vardagen | NS | |
| /planering/input | Vardagen | NS | SuperModule |
| /mabra/* | Vardagen | NS | Many sub-routes |
| /arbetsliv/* | Vardagen | NS | |
| /projekt/* | Vardagen | NS | |
| /morgon | Vardagen | NS | |
| /hjartat | Hjärtat | NS | |
| /hjartat/input | Hjärtat | NS | |
| /familjen | Familjen | NS | 6 tabs |
| /valvet | Valv | IP | Samla zone etc. |
| /valvet/installningar | Valv | NS | |
| /barnporten/* | Familjen | NS | Parent routes only in scope |
| /widget/* (11) | Widgets | NS | Phase 8 |
| /installningar | Core | NS | |
| /kompis | Valv-adj | NS | |

Dev routes (/dev/*) excluded from completion criteria.

---

## Overlay inventory

| File | Uses DS? | Action |
|------|----------|--------|
| InkorgPreviewSheet.tsx | Yes Sheet | Done pattern |
| ProjektPickerSheet.tsx | Yes | Done |
| MaterialPackEditorSheet.tsx | Yes | Done |
| IntakeTriageModal.tsx | Yes Modal | Done |
| MabraCheckinModal.tsx | Yes | Done |
| ZenModeOverlay.tsx | No | Migrate Phase 4 |
| RecoveryUrgeSosModule.tsx | No | Migrate |
| AccountAuthMenu.tsx | No | Migrate |
| PlanningTaskDetail.tsx | No inline dialog | Migrate |
| ImmersiveExperienceShell.tsx | No | Evaluate |
| AppUnlockGate.tsx | Custom CSS | Keep pattern |
| NavigationDrawer.tsx | Drawer | Keep |
| ResurserOverlay.tsx | Overlay | Keep |
| DrogfrihetHubPage.tsx | Inline | Migrate |

---

## Review notes (self-critique applied)

- Original audit claimed "~80 issues" but listed ~20 — this register has 46 tracked IDs
- Original "~150 btn-pill" understated — verified ~195 files
- Page inventory appendix was promised but missing — now included
- Accessibility lacked WCAG criterion mapping — added in Completion-Criteria
