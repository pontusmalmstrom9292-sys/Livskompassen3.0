# Core (app-shell)

Layout, FloatingDock, AuthProvider, Zero Footprint, tokens (`docs/specs/design-master.md`), AmbientBackground, BentoCard.

Navigation: [`docs/specs/navigation-master.md`](../docs/specs/navigation-master.md) · Kanon routes: [`navTruth.ts`](../../src/modules/core/navigation/navTruth.ts)

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| MainLayout, Dock, Fyren 3s, design tokens, Device Clear | Zero Footprint sign-out audit | BodySignalChip, WebGL bakgrund |

## Kladd 2026-05-21

- **Implementerat:** Obsidian Calm (ej grön/natur-UI); Fyren long-press.
- **Avvisat:** Stjärnbilder, gamification, Nordisk skymning grön.
- **Gap:** `resetState` audit vid utloggning; iOS PWA shake-test.

**Kill Switch (shake-to-kill):** borttagen 2026-06-01 — ersatt av Device Clear i Inställningar (`clearDeviceSession`).

**Spec:** [`docs/specs/modules/Core-SPEC.md`](../../docs/specs/modules/Core-SPEC.md)

Kod: `src/modules/core/` · Plan: [`src/modules/core/module_plan.md`](../../src/modules/core/module_plan.md)
