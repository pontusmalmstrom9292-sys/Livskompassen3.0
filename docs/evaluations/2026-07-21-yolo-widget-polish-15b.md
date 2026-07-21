# YOLO Widget polish 15b — mockup elevation

Date: 2026-07-21  
Agent: `/specialist-widgets` (Cursor)  
Branch: `chore/widget-ui-polish-15`  
Unlock: `2026-07-21-unlock-ui-polish-waves.md` + `2026-07-21-unlock-MOD-WIDGET-companion-android-interact.md` (`approved: yes`)  
Deploy: SKIP · merge till main: kräver parent

## Scope

Mockup-elevation av Companion 10-pack (Capture/Note redan hero) + rail/Studio/§13/Fyren chrome. Ingest/Sacred/WORM orörda.

## Vågor

| # | Fokus | Status |
|---|--------|--------|
| 1 | CompassWidget — kompassros, guldring, intention-CTA | DONE |
| 2 | BeaconWidget — capacity-ring + Stabil, energi/fokus-rader | DONE |
| 3 | SafeHarborWidget — lotus/glow, 4 quick icons | DONE |
| 4 | JournalWidget — quote/smoke, mood, SKRIV-CTA | DONE |
| 5 | DailyTasksWidget — påminnelselista + badge | DONE + smoke |
| 6 | DailyAnchorWidget — hero ankare + Sätt intention | DONE |
| 7 | ChildFocusWidget — calm glass elevation (additiv) | DONE |
| 8 | InboxWidget — glass well + CTA parity | DONE |
| 9 | CompanionHomeRail — soft bloom, 44px | DONE |
| 10 | WidgetProgress/Mood/Material | DONE + smoke |
| 11 | companion-widgets.css — ambient glow, radius ~28, reduced-motion | DONE |
| 12 | Widget Studio preview — pack-hero frame, Pulse default off | DONE |
| 13 | Action Dashboard §13 chrome (tre kort kvar) | DONE |
| 14 | Fyren WidgetShell chrome (ingest orörd) | DONE |
| 15 | Final sweep + smoke locked-ux + eval | DONE |

## Smoke

```bash
npm run smoke:companion-widgets  # PASS (våg 5, 10, 15)
npm run smoke:widgets            # PASS
npm run smoke:locked-ux          # PASS (våg 15)
```

## MUST NOT (hållna)

- Companion 10-pack / HomeRail / Studio kvar
- Sacred `android/.../core/**` orörd
- WORM/rules/sharedRules orörda
- Ingen feature-flag som gömmer Companion
- Ingen native ingest utan session

## Nästa steg (Pontus)

Visuell OK i Companion Studio (`/installningar/widget-studio`) på Capture vs Compass/Beacon — sedan parent merge-beslut.
