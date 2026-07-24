---
title: Unlock MOD-WIDGET + MOD-VARD-PLAN — QA Harden Tier A
modules:
  - MOD-WIDGET
  - MOD-VARD-PLAN
date: 2026-07-24
approved: yes
approver: Pontus
via: "fixa Tier A från qa:harden" (Cursor Agent)
---

# Unlock — QA Harden Tier A (bugfix + touch polish)

## Scope (tillåtet)

### MOD-VARD-PLAN
- `planeringInboxConnections.ts`: stabil snapshot-cache för `useSyncExternalStore`
  (stoppar React `getSnapshot should be cached` / max update depth)

### MOD-WIDGET
- `WidgetModulerAddForm.tsx`: checkbox tryckyta ≥44px + aria-label (Experimentera, Fäst på Hem)
- `WidgetStudioPage.tsx`: checkbox tryckyta ≥ `WidgetTouch.minDp` + aria-label (På / smarta lager)

## Forbidden (fortfarande)

- Ta bort Companion OS, Studio, HomeRail, WIS
- Ta bort Planering P3 Kanban / hybrid-låst UX
- Sacred `android/.../core/**`
- Deploy utan `OK deploy`

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:custom-modules
npm run smoke:planering-superhub
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:module-lock
```
