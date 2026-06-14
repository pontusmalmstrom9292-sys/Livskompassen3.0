# Locked — Obsidian Depth (3D shell)

**Status:** Låst 2026-06-14. Ändring av skalet kräver explicit produktbeslut + uppdatering av denna fil och smoke.

## Vad som är låst

| Element | Kod / fil |
|---------|-----------|
| Theme ID | `OD-obsidian-depth` |
| 3D bento-kort | `.od-depth__bento-card*` i `obsidian-depth-mockup.css` |
| Taktil guld-CTA | `.od-depth__cta` |
| Flytande dock (mockup) | `.od-depth__dock*` |
| Interaktiv mockup | `/dev/obsidian-depth` → `ObsidianDepthMockupPage.tsx` |
| Kanonbilder | `docs/design/theme-lab/obsidian-depth-*.png` |
| Spec | `docs/design/themes/OBSIDIAN-DEPTH-SPEC.md` |

## Designregler (låsta)

1. **Guld endast** som accent i Obsidian Depth-skalet — ingen regnbåg, neon eller indigo som primär chrome.
2. **Glassmorphism + taktil 3D** på kort och primär CTA ska bevaras (inre highlight, mjuk skugga, grafit→obsidian).
3. **Cinzel** för zonrubriker/hälsning; **Inter** för bröd i mockup-skalet.

## Vad som INTE är låst (fortsatt förfiningsarbete)

- `btn-pill--*` i prod (sekundära knappar)
- `NavigationDrawer` / sidomeny
- `FloatingDock` / Fyren widget
- `AppHeaderBar` chrome
- Prod-default tema (`DEFAULT_THEME_ID` förblir `R-A-nordic-precision` tills separat beslut)

## Smoke

`npm run smoke:obsidian-depth` · ingår i `npm run smoke:locked-ux`

## MUST NOT

- Ta bort eller förenkla Obsidian Depth till platt Obsidian Calm utan godkännande
- Ersätta guld-only med silo-regnbåg i OD-skalet
- Radera mockup-rutt eller kanon-PNG utan uppdatering av register
