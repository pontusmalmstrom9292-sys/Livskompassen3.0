---
title: Unlock MOD-WIDGET — Companion Android Interact (WIS)
module: MOD-WIDGET
locked_ux: §23
date: 2026-07-22
approved: yes
approver: Pontus
via: plan-implementation-request Interaktiva Companion Widgets
---

# Unlock — Companion Widget Interact (WIS)

## Scope

Tillåt att Companion Android-widgets byter primär interaktionsväg från `WidgetLaunch` → `MainActivity` till **Widget Interaction Surface**:

1. `WidgetActionReceiver` (Broadcast) — in-place RemoteViews
2. `WidgetOverlayActivity` (translucent) — text / mood / hold-to-record
3. Bakgrundssynk via SecurePrefs-kö + `WidgetUpdateManager` / WidgetSync

## Why

UX LAW 02 i `widget_bible.md`: ett tryck ska räcka utan att öppna hela appen. Nuvarande deep-links bryter kravet.

## Allowed changes

- Nya filer under `android/.../widgets/` (Interact, Receiver, Overlay, layouts)
- Omkoppling av PendingIntents i `WidgetViews` Companion-metoder
- Skill + underagenter + bible kap. 7
- Smoke-assertions för WIS-filer

## Forbidden (fortfarande)

- Ta bort Companion OS / 10-pack / Studio / HomeRail
- Sacred `android/.../core/**` omstrukturering
- Direkt klient-write till `reality_vault`
- Cross-RAG via widget-transport

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:locked-ux
```

## Rollback

Återställ `WidgetViews` till `WidgetLaunch.pendingIntent` och inaktivera overlay/receiver i manifest om regression upptäcks.
