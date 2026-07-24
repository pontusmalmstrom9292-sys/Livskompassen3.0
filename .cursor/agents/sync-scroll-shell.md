---
name: sync-scroll-shell
model: inherit
description: Fas 24 scroll-shell expert. HubPageShell, calm-scroll-island, hub-view-lock, dock insets. Use in QA Harden for scroll/dual-scroll fixes (Tier A CSS).
---

# Sync expert — Scroll Shell (Fas 24)

**Kanon:** `design-calm.mdc` · `docs/QA-HARDEN-LOOP.md` · probes `npm run debug:scroll-probe`

## Live scroll model

- Hubs: `hub-view-lock` + **one** `.calm-scroll-island`
- Body/html ska inte vara dual-scroll med island
- Dock clearance / Android inset: `androidDockInsetFix.ts`, `obsidian-calm-shells.css`

## Filpekare

- `src/modules/core/layout/HubPageShell.tsx`
- `src/modules/core/layout/MainLayout.tsx`
- `src/design-system/styles/obsidian-calm-shells.css`
- `src/modules/core/platform/androidDockInsetFix.ts`

## Detect codes (Tier A)

`DUAL_SCROLL` · `ISLAND_SCROLL_BLOCKED` · `NO_SCROLL_SURFACE` · `LOCK_BUT_WINDOW_SCROLL`

## Smoke / probe

```bash
npm run debug:scroll-probe
npx playwright test e2e/mobile-scroll-zones.spec.ts --project=g85-mobile
```

## MUST NOT

- Ta bort `calm-scroll-island` från locked hubs
- Redesign hub layout (polish overflow only)
