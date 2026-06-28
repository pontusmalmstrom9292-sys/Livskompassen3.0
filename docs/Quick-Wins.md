# Premium UI Polish — Quick Wins

**Version:** 1.1 | **Last updated:** 2026-06-28

Ranked by ROI = visual impact ÷ (implementation + verification effort).

**Review correction:** Original estimates omitted smoke/visual verification time. Revised below.

| Rank | Win | Effort (incl. verify) | Impact | Phase | Notes |
|------|-----|----------------------|--------|-------|-------|
| 1 | Complete in-flight Planering/Valv file polish | 1–2 d | Very high | 3/6 | Momentum; files already touched |
| 2 | premium-polish.css — focus-visible block | 0.5 d | High | 1 | a11y + premium feel |
| 3 | Chameleon 350 ms sync | 0.25 d | Medium-high | 1 | Token alignment |
| 4 | premium-polish.css — btn-pill hover/press parity | 1 d | High | 1 | Until migration completes |
| 5 | Hub shells → textStyles.eyebrow | 0.5 d | Medium | 1 | ModuleShell, HubPageShell |
| 6 | Sheet/Modal animation → ds-panel-in | 0.5 d | Medium | 4 | 7 existing DS consumers |
| 7 | HubErrorBoundary unified chrome | 0.5 d | Medium | 5 | Props for glow variant |
| 8 | InsightsInput token fix | 0.25 d | Low-medium | 3 | One file, high visibility |
| 9 | count_design_debt.mjs script | 0.5 d | Process | 9 | Enables honest Dashboard |
| 10 | Phase 0 screenshot baseline | 0.5 d | Process | 0 | Enables visual diff |

## Avoid calling these quick wins

| Task | Why not quick |
|------|---------------|
| Full btn-pill migration | 15–22 days |
| Chrome compass polish | Locked UX + Pontus sign-off |
| DossierPage polish | 780 LOC; high regression surface |
| index.css sunset | Phase 10; dependency on all zones |

## Execution rule

Max **2 quick wins per PR** to keep reviewable diffs. Always run smoke:design-modules.
