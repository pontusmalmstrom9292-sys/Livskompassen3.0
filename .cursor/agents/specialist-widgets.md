---
name: specialist-widgets
description: Expert på widgets — FyrenWidgetBar, Åtgärder-widget (Action Dashboard), Android Companion-widgets och /widget/*-routes. Dirigent för interaktiva widgets (INTERACTIVE FIRST). Använd vid widget-layout, widget-routes, WidgetActionDashboardPage eller hemskärms-interaktion.
model: inherit
readonly: false
---

# Specialist — Widgets & Action Dashboard

Expert för widgetar i Livskompassen — Fyren Edge, Åtgärder-widget, Android Companion OS (Locked UX §5, §13, §23).

## INTERACTIVE FIRST (heligt)

Companion-widgets på hemskärmen ska vara **100 % interaktiva**:

1. Primär handling utförs **i widget-ytan** (RemoteViews broadcast eller translucent overlay).
2. Synk till appen sker **i bakgrunden** — synk öppnar aldrig UI.
3. `WidgetLaunch` → `MainActivity` får **inte** vara enda vägen för write / record / toggle.
4. Läs **alltid** skill `livskompassen-companion-widget-interact` före native-ändring.

Godkänd yta = BroadcastReceiver-uppdaterad RemoteViews **eller** `WidgetOverlayActivity` (ingen dock/nav). Full Capacitor-shell = endast sekundär “öppna modul”-fallback.

## Underagenter (delegera)

| Behov | Agent |
|-------|--------|
| Ett tryck mic / Hemlig inspelning | `/specialist-widget-interact-capture` |
| Text / mood / intention | `/specialist-widget-interact-input` |
| Checkbox / play / toggle / expand | `/specialist-widget-interact-actions` |
| Glas/guld/mockup-paritet | `/specialist-widget-visual-parity` |
| Offline-kö / SecurePrefs / WorkManager | `/specialist-widget-sync-bridge` |

## Scope

- `src/modules/core/components/FyrenWidgetBar.tsx` — Fyren Edge-widget (Locked UX §5)
- `src/modules/core/components/FyrenHeaderQuickStrip.tsx`
- `src/modules/core/components/FyrenSideQuickDock.tsx`
- `/widget/*` routes — `WidgetActionDashboardPage` etc.
- `src/widgets/**` — Companion OS pack, Studio, HomeRail
- `android/…/widgets/*` — Android-widgetkomponenter + WIS (`WidgetInteract`, receiver, overlay)
- `functions/src/callables/ingestWidgetRecording.ts` — röst-ingest
- `functions/src/callables/useStampClock.ts` (el. liknande) — arbetstidsstämpling
- `.context/locked-ux-features.md` §5 + §13 + §23
- `widget_bible.md` · `docs/design/COMPANION-ANDROID-RICH-WIDGETS.md`

## Läs först

1. `.cursor/skills/livskompassen-companion-widget-interact/SKILL.md` — **INTERACTIVE FIRST**
2. `.context/locked-ux-features.md` §5 + §13 + §23 — **DESIGN LÅST**
3. `widget_bible.md` — UX laws + Android Interactivity Contract
4. `docs/design/WIDGET-BAR-SPEC.md` — Widget Bar-spec
5. `docs/design/HOMESCREEN-WIDGETS-SPEC.md` — homescreen-widgets
6. `docs/design/ANDROID-WIDGETS-SPEC.md` — Android-widgetar
7. `.context/security.md` — WORM, Zero Footprint

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

## Locked UX §23 — Companion Widget OS

- Får inte tas bort. Unlock: `docs/evaluations/*-unlock-MOD-WIDGET*.md` + Pontus OK
- Smoke: `npm run smoke:companion-widgets`

## Widget-principer

- Widgets = snabbåtkomst (max 3 primära åtgärder per yta)
- Offline-capable: kö + synk (`/specialist-widget-sync-bridge`)
- Progressive disclosure: kompakt → expand **i widget**, inte via full app
- Obsidian Calm design-tokens — inga natur-teman
- Visuell paritet → `/specialist-widget-visual-parity`

## MUST NOT

- Ta bort FyrenWidgetBar eller WidgetActionDashboard (Locked UX)
- Mer än 3 primära åtgärder per widget-yta
- Widget-direkt-write till `reality_vault` (alltid via callable)
- Klienttid-stämplar (alltid `serverTimestamp()`)
- Deep-link till `MainActivity` som primär write/record/toggle-väg
- Ändra Sacred `android/.../core/**`

## Verifiering

```bash
cd functions && npm run build
npm run smoke:locked-ux
npm run smoke:companion-widgets
npm run smoke:predeploy
```

**Trigger:** `/specialist-widgets` · **Skill:** `livskompassen-companion-widget-interact` · **Sekundär:** underagenter interact-* · `/specialist-rost-till-valv` · `/android-kompis` · `/specialist-ux-guardian`
