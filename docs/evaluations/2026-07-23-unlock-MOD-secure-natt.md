# Unlock — Secure Natt / Titanium Aura WIP

Date: 2026-07-23
approved: yes
Pontus OK: natt-fail fix — unlock for local Secure Natt WIP (2026-07-23)

Modules: MOD-CORE-UTV, MOD-VALV-INKAST, MOD-WIDGET

## Scope (tillåtet)

- `ShortcutManager.java` — circadian contextual shortcuts (Våg 130)
- `inkastService.ts` — native MindAura analyze hook on submitInkastLite (non-blocking)
- `WidgetViews.java` — circadian accent on Companion Capture/Harbor/Check-in titles

## Utanför scope (kräver ny PMIR)

- firestore.rules / storage.rules / WORM
- Locked UX removals (Barnfokus, Valv Mönster/Orkester, Planering widget)
- SacredLockManager biometric bypass

## DoD

- [ ] `npm run smoke:predeploy` PASS med denna unlock
- [ ] Sacred core remaining dirty → Fas C Pontus OK separat innan commit/deploy
