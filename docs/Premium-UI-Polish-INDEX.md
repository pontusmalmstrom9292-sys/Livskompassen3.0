# Premium UI Polish — Master Index

**Version:** 1.0 | **Status:** READY FOR IMPLEMENTATION | **Last updated:** 2026-06-28

Single entry point for the polish sprint. Start here.

---

## One-paragraph summary

Livskompassen is ~90% visually correct (Executive Midnight DAD). This sprint **refines, not redesigns**: unify design tokens and primitives, polish locked chrome (header/dock/compass), migrate ~195 files off legacy `btn-pill--*` to DS `Button`, consolidate overlays and error states, then polish zone-by-zone. Legacy `index.css` (~6816 LOC) sunsets last (optional stretch). Total effort: **45–65 developer-days**.

---

## All documents (12)

| # | Document | Purpose |
|---|----------|---------|
| 1 | [Premium-UI-Polish-INDEX.md](./Premium-UI-Polish-INDEX.md) | This file — master index |
| 2 | [Roadmap.md](./Roadmap.md) | 11 phases with goals, effort, risks |
| 3 | [TODO.md](./TODO.md) | Checkbox task list (~120 items) |
| 4 | [Dashboard.md](./Dashboard.md) | Live metrics and zone status |
| 5 | [UI-Audit.md](./UI-Audit.md) | 46 tracked issues + route inventory |
| 6 | [Design-System-Plan.md](./Design-System-Plan.md) | Tokens, components, rules, migration |
| 7 | [Architecture-Review.md](./Architecture-Review.md) | Strengths, weaknesses, perf, testing |
| 8 | [Testing-Strategy.md](./Testing-Strategy.md) | Smoke, e2e, manual matrix, PR checklist |
| 9 | [Risks.md](./Risks.md) | Ranked risk register (16 items) |
| 10 | [Quick-Wins.md](./Quick-Wins.md) | ROI-ranked short tasks |
| 11 | [Completion-Criteria.md](./Completion-Criteria.md) | Definition of done (v1 release) |
| 12 | [Progress.md](./Progress.md) | Change log — update after each wave |

**External authority:** `.cursor/rules/design-calm.mdc`, `premium-ui.mdc`, `locked-ux-features.mdc`

---

## All phases (11)

| Phase | Name | Priority | Effort | Depends on |
|-------|------|----------|--------|------------|
| 0 | Baseline & governance | P0 | 2 d | — |
| 1 | Token & motion foundation | P0 | 4–5 d | 0 |
| 2 | Chrome (Header/Dock/Kompass) | P0 | 4–6 d | 1 |
| 3 | Primitive consolidation | P0 | 15–22 d | 1, 2 |
| 4 | Overlay system (Modal/Sheet) | P1 | 3–5 d | 3 |
| 5 | Loading, error, empty states | P1 | 3–4 d | 3 |
| 6 | Zone polish — Hem + Vardagen | P1 | 7–10 d | 2, 3 |
| 7 | Zone polish — Hjärtat + Familjen + Valv | P1 | 10–14 d | 3, 5 |
| 8 | Widgets + Android (G85) | P1 | 4–6 d | 2 |
| 9 | Testing & visual regression | P0 | 3–5 d setup + ongoing | 0 |
| 10 | Legacy CSS sunset | P2 (stretch) | 6–10 d | 3–7 |

**Cross-cutting:** Phase 9 runs during every phase, not only at the end.

**First implementation action:** Phase 0 (baseline smoke + screenshots + metrics).

---

## All dependencies

### Phase dependency chain

```
0 (baseline)
 ├─→ 9 (testing setup, parallel)
 └─→ 1 (tokens/motion)
      └─→ 2 (chrome)
           ├─→ 8 (widgets/android)
           └─→ 3 (primitives)
                ├─→ 4 (overlays)
                ├─→ 5 (states)
                ├─→ 6 (hem+vardagen) ← also needs 2
                └─→ 7 (hjärtat+familjen+valv) ← also needs 5
                     └─→ 10 (legacy sunset, optional)
```

### Technical dependencies

| Dependency | Required for | Notes |
|------------|--------------|-------|
| `--ds-*` tokens | All UI polish | Phase 1 |
| `THEME_LOCKED` / ME-basta-design | Prod visuals | Do not unlock theme |
| `shared/ui/Button.tsx` legacy map | btn-pill migration | Until Phase 3 complete |
| `premium-polish.css` loads last | Global depth | index.css order |
| smoke:locked-ux | Chrome, nav, Valv, Familjen | Every chrome PR |
| smoke:design-modules | All UI PRs | Mandatory |
| smoke:valv-security | Valv zone | Phase 7 |
| smoke:barn-epistemik | Barnporten/Familjen | Phase 7 |
| validate:session | Token/theme changes | Playwright |
| Pontus visual OK | Compass/chrome | Phase 2 gate |
| yolo-vakt GO | Release | Final gate |

### Document dependencies

| Before starting | Read |
|-----------------|------|
| Any work | This INDEX + Roadmap Phase N |
| Component change | Design-System-Plan decision tree |
| Chrome change | design-calm.mdc (DAD) |
| PR | Testing-Strategy checklist |
| Zone wave | UI-Audit route table + Dashboard |

---

## All blockers

### Blockers to START implementation — NONE

Documentation pack is complete. Phase 0 is the first task, not a precondition failure.

### Blockers during implementation (watch list)

| ID | Blocker | When | Mitigation |
|----|---------|------|------------|
| B-1 | Locked UX violation | Phase 2 | smoke:locked-ux; Pontus OK |
| B-2 | Valv/WORM UI regression | Phase 7 | UI-only diffs; security smokes |
| B-3 | btn-pill variant mismatch | Phase 3 | Legacy map in Button.tsx |
| B-4 | Merge conflicts (195 files) | Phase 3 | One zone per wave |
| B-5 | Android blur jank | Phase 8 | G85 test; reduced blur |
| B-6 | Scope creep / redesign feel | All | premium-ui.mdc; Pontus zone sign-off |
| B-7 | Parallel agent conflicts | All | One active zone (Dashboard ownership) |

### Resolved blockers

| Blocker | Resolution |
|---------|------------|
| Docs not in docs/ | Created 2026-06-28 |
| No testing strategy | Testing-Strategy.md added |
| Unrealistic estimates | Revised to 45–65 d |
| Fake progress % | Dashboard uses metrics TBD → fill Phase 0 |

---

## Time estimates

| Scope | Days | Calendar @ 5 d/wk |
|-------|------|-------------------|
| Minimum (1 dev, focused) | 45 | ~9 weeks |
| Expected | 55 | ~11 weeks |
| Maximum (risks materialize) | 65 | ~13 weeks |
| Phase 10 stretch (optional) | +6–10 | Post v1 |

**Parallelization:** Zone batches after Phase 3 can overlap if file ownership is strict — may reduce calendar to ~7–9 weeks with coordination cost.

---

## Completion percentages (2026-06-28)

### A. Planning & documentation pack

| Item | % |
|------|---|
| Required documents written | **100%** (12/12) |
| Review pass applied | **100%** |
| Phase 0 baseline executed | **0%** (first impl task) |
| **Documentation ready for implementation** | **100%** |

### B. Premium UI polish (product work)

| Area | % | Basis |
|------|---|-------|
| Design tokens / DS foundation | 70% | tokens exist; motion/Skeleton missing |
| premium-polish.css | 40% | Partial global layer |
| Chrome (header/dock/compass) | 15% | Structure exists; polish not done |
| Button migration (~195 files) | 5% | ~22 DS imports; most btn-pill remain |
| Overlays unified | 35% | ~14 DS vs ~14 ad-hoc |
| Zone polish | 10% | Planering/Valv in-flight only |
| Widgets | 15% | Shell exists |
| Testing infra (scripts) | 0% | Proposed, not built |
| Legacy CSS sunset | 5% | Not started |
| **Overall polish sprint** | **~15%** | Weighted by Roadmap effort |

### C. v1 release (Completion-Criteria.md)

**~15%** — matches product work above; release requires 100% Completion-Criteria.

---

## Implementation start checklist

- [x] All documents created and reviewed
- [x] Phases, dependencies, risks documented
- [x] Effort estimates revised
- [x] Testing strategy defined
- [x] Definition of done defined
- [ ] Phase 0 baseline run (first implementation step)
- [ ] Pontus acknowledges plan (recommended)

---

## Recommended first three steps

1. **Phase 0:** Run `npm run smoke:design-modules` + `smoke:locked-ux`; record in Progress.md; capture 6 screenshots.
2. **Continue in-flight:** Planering + Valv modified files (Quick-Wins #1).
3. **Phase 1:** Chameleon 350ms sync + focus-visible block + design-system README.
