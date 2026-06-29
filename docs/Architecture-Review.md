# Premium UI Polish — Architecture Review

**Version:** 1.1 | **Last updated:** 2026-06-28

Review scope: frontend UI architecture only. No backend/Firestore changes in polish sprint.

---

## Strengths

1. **3-zone routing** — navTruth.ts + AppRoutes.tsx; legacy redirects preserve bookmarks
2. **Chameleon SuperModule** — Logic/Shell/Skin separation allows polish without flow changes
3. **Three-layer tokens** — :root runtime → --ds-* → TS tokens; theme packs via themeRegistry
4. **premium-polish.css loads last** — correct strangler-fig layering
5. **Smoke harness** — smoke:predeploy, smoke:design-modules, smoke:locked-ux, tier1/tier2
6. **Figma Code Connect** — src/figma/connect/BentoCard.figma.tsx
7. **Locked UX registry** — .context/locked-ux-features.md + MDC rules
8. **Executive Midnight DAD** — clear visual authority reduces design debate

---

## Weaknesses

| Area | Issue | Impact |
|------|-------|--------|
| CSS | index.css ~6816 LOC monolith | Parse cost, merge conflicts, agent confusion |
| Imports | @/shared vs @/design-system vs @/core/ui/BentoCard | Inconsistent adoption |
| Adoption | ~22 direct @/design-system vs ~140+ @/shared | DS bypass |
| Motion | ~24 framer files, no shared module | Duplicated easing/duration |
| Components | 5 error boundaries, 3 banner APIs, 3 card APIs | Visual inconsistency |
| Buttons | ~195 files btn-pill--* | Highest migration cost |
| Overlays | ~14 ad-hoc dialogs | a11y gaps (focus trap) |
| Inputs | DS Input exported, rarely used | Mixed input-glass, raw Tailwind |
| Monoliths | DossierPage 780 LOC, CapturePanel 700 | Polish scope creep risk |
| Docs | No design-system README | Agent onboarding friction |
| Prototype | bästa design/ shadcn tree | Wrong canonical source for agents |

---

## Large files (polish caution)

| File | LOC | Guidance |
|------|-----|----------|
| DossierPage.tsx | 780 | Style-only diffs; no split in polish sprint |
| ThemeLabPage.tsx | 721 | Dev route — lower priority |
| CapturePanel.tsx | 700 | Batch with Inkast zone |
| ActionDashboard.tsx | 666 | Widget zone Phase 8 |
| BiffPublicPanel.tsx | 641 | Familjen/Hamn Phase 7 |
| AppRoutes.tsx | 599 | Do not restructure routes |

---

## Duplicate components (consolidation targets)

| Pattern | Locations | Target |
|---------|-----------|--------|
| Button | DS Button, shared wrapper, btn-pill CSS | DS Button + legacy map |
| Card | Card, BentoCard, UiCard | BentoCard for modules; GlassPanel for strips |
| Banner | Banner, AlertBanner, ModuleSectionBanner | DS Banner variants |
| Error UI | 5 error boundaries | ErrorFallback |
| Loading | HubPanelSkeleton, PageSkeleton, inline pulse | DS Skeleton |
| Modal | DS Modal/Sheet vs 14 ad-hoc | DS only |

---

## State management (UI-relevant)

- **Theme:** themeRegistry, applyTheme, THEME_LOCKED — do not unlock for polish
- **Pansar:** GlobalPansarView replaces shell — polish must not break gate
- **Vault PIN:** VaultZoneGate, AppUnlockGate — visual-only changes
- **No Redux-style global UI store** — local/component state; lower rerender risk for polish

**Recommendation:** memo() on chrome components (Header, Dock) if polish adds re-renders; profile before optimizing.

---

## Performance considerations

| Concern | Action |
|---------|--------|
| index.css size | Phase 10 sunset; defer lab CSS from prod |
| backdrop-filter | Limit nested blur; G85 test; prefers-reduced-transparency |
| Framer bundle | Lazy import motion presets; CSS for simple fades |
| Lazy routes | Already in AppRoutes — preserve |
| Images | Optimize hero/scenic assets if touched |
| Lighthouse | Manual spot-check home + planering; no automated budget v1 |

**Target (guidance, not gate):** LCP < 2.5s on home @ 4G; no new blocking CSS imports.

---

## Testing strategy

See [Testing-Strategy.md](./Testing-Strategy.md) for full detail.

**Architecture-specific gates:**
- Token changes → validate:session
- Chrome → smoke:locked-ux + smoke:design-modules
- Valv/Familjen → smoke:valv-security, smoke:barn-epistemik
- Release → smoke:predeploy:build

**Gap:** No visual regression CI — Phase 0 screenshots + manual diff until Playwright compare added.

---

## Recommendations (behaviour unchanged)

1. Add src/design-system/README.md with import policy and component decision tree
2. Implement count_design_debt.mjs for Dashboard honesty
3. ESLint warn on btn-pill-- in src/modules/**
4. One zone active per wave (parallel-orchestrator pattern)
5. Do not split monolith pages during polish
6. Keep shared/ui re-exports until Phase 10; document deprecation path
7. All new Framer via design-system/motion/
8. UiCard restricted to theme-lab / dev routes only

---

## Architecture diagram (UI layers)

```
themeRegistry (:root --bg, --accent)
        ↓
variables.css (--ds-*)
        ↓
index.css legacy + premium-polish.css + components.css
        ↓
design-system React primitives
        ↓
shared/ui compat re-exports
        ↓
core/ui app chrome (Chameleon, EmptyState, executive/*)
        ↓
feature modules (*Page, *Panel, *Delegate)
```
