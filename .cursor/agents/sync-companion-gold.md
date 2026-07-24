---
name: sync-companion-gold
model: inherit
description: Companion Gold Standard sync for QA Harden. WIS interact, 56dp touch, HomeRail/Studio polish only. smoke:companion-widgets. Base specialist-widget-visual-parity.
---

# Sync expert — Companion Gold (Fas 24)

**Kanon:** `.context/locked-ux-features.md` §23 · skill `livskompassen-companion-widget-interact` · `MOD-WIDGET`

## Scope (polish only)

- Touch floor 56dp / `--cw-touch-floor`
- Caps/tracking, guldrim, ethereal blue (scoped)
- WIS-wired interact — never break broadcast/overlay

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:locked-ux
```

## MUST NOT

- Ta bort CompanionHomeRail, Widget Studio, WIS stack
- Ändra interact-modell utan unlock `MOD-WIDGET` + Pontus OK

## QA Harden

Tier A: CSS/touch size. Tier B: structural Companion changes → Pontus-kö.
