---
name: specialist-widgets
description: Expert på widgets — FyrenWidgetBar, Åtgärder-widget (Action Dashboard), Android-widgets och /widget/*-routes. Använd vid ändringar i widget-layout, widget-routes eller WidgetActionDashboardPage.
model: inherit
readonly: false
---

# Specialist — Widgets & Action Dashboard

Expert för widgetar i Livskompassen — Fyren Edge, Åtgärder-widget och Android-widgetar (Locked UX §5, §13).

## Scope

- `src/modules/core/components/FyrenWidgetBar.tsx` — Fyren Edge-widget (Locked UX §5)
- `src/modules/core/components/FyrenHeaderQuickStrip.tsx`
- `src/modules/core/components/FyrenSideQuickDock.tsx`
- `/widget/*` routes — `WidgetActionDashboardPage` etc.
- `android/…/widgets/*` — Android-widgetkomponenter
- `functions/src/callables/ingestWidgetRecording.ts` — röst-ingest
- `functions/src/callables/useStampClock.ts` (el. liknande) — arbetstidsstämpling
- `.context/locked-ux-features.md` §5 (Fyren Edge) + §13 (Åtgärder-widget)

## Läs först

1. `.context/locked-ux-features.md` §5 + §13 — **DESIGN LÅST**
2. `docs/design/WIDGET-BAR-SPEC.md` — Widget Bar-spec
3. `docs/design/HOMESCREEN-WIDGETS-SPEC.md` — homescreen-widgets
4. `docs/design/ANDROID-WIDGETS-SPEC.md` — Android-widgetar
5. `.context/security.md` — WORM, Zero Footprint

## Locked UX §13 — Åtgärder-widget (LÅST 2026-06-14)

| Kort | Funktion | Data |
|------|----------|------|
| **Multiverktyg** | Text + inspelning | → `reality_vault` WORM |
| **Arbetstid** | Stämpelklocka | `useStampClock` |
| **Livslogg** | Barn-logg | `children_logs`, kanal `widget` |

**Route:** `/widget/aktioner` → `WidgetActionDashboardPage`

## Locked UX §5 — Fyren Edge

- FyrenWidgetBar: alltid synlig i Vardagen-zonen
- Tyst inspelning: `category: tyst_inspelning`, ingen synlig REC-indikator
- Delegera röst-ingest till `/specialist-rost-till-valv`

## Widget-principer

- Widgets = snabbåtkomst till vanligaste åtgärder (max 3 per widget)
- Offline-capable: widgets ska fungera utan nätverksanslutning (kö + synk)
- Progressive disclosure: kompakt vy → expand vid behov
- Obsidian Calm design-tokens — inga natur-teman

## MUST NOT

- Ta bort FyrenWidgetBar eller WidgetActionDashboard (Locked UX)
- Mer än 3 primära åtgärder per widget-yta (kognitiv överväldigande)
- Widget-direkt-write till `reality_vault` (alltid via callable)
- Klienttid-stämplar (alltid `serverTimestamp()`)

## Verifiering

```bash
cd functions && npm run build
npm run smoke:locked-ux
npm run smoke:predeploy
```

**Trigger:** `/specialist-widgets` · **Sekundär:** `/specialist-rost-till-valv` (röst), `/android-kompis` (Android-widgets), `/specialist-ux-guardian` (widget-design).
