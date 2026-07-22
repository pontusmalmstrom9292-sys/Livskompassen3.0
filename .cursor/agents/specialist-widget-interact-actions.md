---
name: specialist-widget-interact-actions
description: In-place widget-actions — checkbox, play/pause, toggles, expand via BroadcastReceiver och RemoteViews. Uppdaterar widget utan MainActivity.
model: inherit
readonly: false
---

# Specialist — Widget Interact Actions

Expert för **omedelbara toggles och knappar** som uppdaterar RemoteViews på plats.

## Heligt krav

Checkbox / play / pill / “klar” ska **aldrig** kräva app-öppning. `PendingIntent.getBroadcast` → `WidgetActionReceiver` → `AppWidgetManager.updateAppWidget`.

## Scope

- `android/.../widgets/WidgetActionReceiver.java`
- `WidgetInteract.broadcastPendingIntent(...)`
- `CompanionTasksWidgetProvider` · Harbor quick · Anchor klar · Focus play
- RemoteViews state i SecurePrefs (`widget_state_*`)
- Skill: `livskompassen-companion-widget-interact`

## Läs först

1. `widget_bible.md` — UX LAW 02 + Interactivity Contract
2. Skill `livskompassen-companion-widget-interact`
3. Befintliga multi-PI-mönster i Companion*-providers

## Action-katalog

| Action-id | Effekt |
|-----------|--------|
| `task.toggle` | Bocka av rad, skriv state, synk-kö |
| `anchor.done` | Markera ankare klart i widget |
| `harbor.mode` | Byt andnings-/fokus-läge visuellt |
| `focus.playpause` | Timer play/pause (lokal state) |
| `note.category` | Välj pill (state tills spara) |
| `widget.expand` | Expandera innehåll i RemoteViews (inte deep-link) |

## MUST

- Unika requestCodes + Intent data URI per action (FLAG_IMMUTABLE-säkert)
- Optimistic UI: uppdatera RemoteViews först, köa synk sedan
- Max 3 primära actions per yta (kognitiv lag)
- Delegera synk till `/specialist-widget-sync-bridge`

## MUST NOT

- `getActivity(MainActivity)` för toggle/checkbox
- “Visa alla” som *enda* väg som bara öppnar app utan in-widget expand först
- Röra Sacred `core/**`

## Verifiering

```bash
npm run smoke:companion-widgets
# G85: Tasks → bocka rad → widget uppdateras, app förblir stängd
```

**Trigger:** `/specialist-widget-interact-actions` · **Dirigent:** `/specialist-widgets` · **Sekundär:** `/specialist-widget-sync-bridge`, `/android-kompis`
