# Premium UI Polish — Testing Strategy

**Version:** 1.0 | **Last updated:** 2026-06-28

Cross-referenced from [Roadmap.md](./Roadmap.md) Phase 9 and [Architecture-Review.md](./Architecture-Review.md).

## Testing pyramid

1. **PR self-check** — keyboard, focus, no layout shift (every PR)
2. **Smoke scripts** — design-modules, locked-ux, widgets (automated)
3. **Playwright e2e** — 3 specs (token + locked UX)
4. **Manual zone sign-off** — Pontus + 6-route visual diff

## Mandatory automated gates

| Script | When |
|--------|------|
| npm run smoke:design-modules | Any UI/CSS change |
| npm run smoke:locked-ux | Chrome, nav, Familjen, Valv, Planering |
| npm run smoke:locked-icons | Icon changes |
| npm run validate:session | Token/theme changes |
| npm run smoke:widgets | Widget routes |
| npm run smoke:predeploy:build | Release candidate |

**E2E:** e2e/obsidian-calm-tokens.spec.ts, e2e/locked-ux-public.spec.ts, e2e/freeport-premium-gallery.spec.ts

## Proposed Phase 9 additions

- scripts/smoke_no_new_btn_pill.mjs — fail on new btn-pill in diff (4h)
- scripts/count_design_debt.mjs — metrics for Dashboard (4h)
- Playwright screenshot compare vs Phase 0 baseline (1–2d)
- ESLint local rule: warn btn-pill-- in src/modules/** (4h)

## Manual matrix (15 min per zone wave)

| Check | WCAG |
|-------|------|
| Tab order | 2.4.3 |
| Focus visible | 2.4.7 |
| Escape closes overlays | — |
| aria-label on icon buttons | 4.1.2 |
| No scroll @ 320px | 1.4.10 |
| Touch ≥ 44px | 2.5.5 |

**Routes:** /, /vardagen, /planering, /hjartat, /familjen, /valvet, /widget/kompass

## Android (Phase 8)

Motorola G85: safe-area, blur perf, touch targets. Build → Capacitor sync → debug APK.

## PR checklist

- [ ] Refine only — no layout/workflow change
- [ ] smoke:design-modules + locked-ux (if chrome)
- [ ] No new btn-pill--
- [ ] Tokens only in features
- [ ] prefers-reduced-motion respected
- [ ] Dashboard.md updated if zone done

## Out of scope

Backend/WORM logic, IE11, full Lighthouse automation, AI visual diff at scale.
