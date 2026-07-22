---
name: livskompassen-companion-widget-interact
description: >-
  Forces 100% in-widget interactivity for Livskompassen Companion OS on Android.
  Use when building/editing homescreen widgets, RemoteViews, WidgetOverlay,
  tap-to-record capture, in-widget text/mood/checkbox, or when a widget currently
  deep-links into MainActivity. Sync must stay in background.
---

# Companion Widget Interact

**@locked MOD-WIDGET** — låst modul; unlock via `docs/evaluations/*-unlock-MOD-WIDGET*.md`

**Locked UX:** §23 / `MOD-WIDGET` · **Bible:** `widget_bible.md` · **Dirigent:** `/specialist-widgets`

## INTERACTIVE FIRST

Companion homescreen widgets are **100 % interaktiva**. Primary write/record/toggle must not open full Capacitor `MainActivity` as the only path.

## When to use

- Hemskärms-widget (Companion 10-pack eller legacy chips)
- “Interaktiv widget”, “öppna inte appen”, RemoteViews, overlay
- Capture tap-to-record, Quick Note text, Tasks checkbox, mood check-in
- Bakgrundssynk SecurePrefs / WidgetCache / WorkManager

## When NOT to use

- Endast web Studio-preview utan Android-pin → `/specialist-widgets` + visual-parity
- Sacred `android/.../core/**` ändringar
- Fyren Edge tyst inspelning UI-lås (§5) → `/specialist-rost-till-valv`

## Definition — 100 % interaktiv

Användaren utför primär handling **i widget-ytan**. Data synkas i bakgrunden.
Full Capacitor-shell (dock/nav/`MainActivity` WebView) är **förbjuden** som primär väg för write / record / toggle.

Godkänd widget-yta:

1. **RemoteViews + BroadcastReceiver** — checkbox, play/pause, pills, expand
2. **Translucent `WidgetOverlayActivity`** — text, mood, intention, hold-to-record UI
3. **Foreground service** — inspelning utan UI-chrome

## Gesture → teknik

| Gest / behov | Teknik | Agent |
|--------------|--------|-------|
| Toggle / checkbox / play | `WidgetInteract.broadcast` → `WidgetActionReceiver` | `/specialist-widget-interact-actions` |
| Text / mood / intention | `WidgetInteract.overlay` → `WidgetOverlayActivity` | `/specialist-widget-interact-input` |
| Tap mic (ett tryck) | Overlay startar WidgetCaptureService; inspelning fortsätter med låst skärm; andra trycket / notis Stoppa sparar | `/specialist-widget-interact-capture` |
| Bakgrundssynk | Kö → SecurePrefs / WidgetSync → callables | `/specialist-widget-sync-bridge` |
| Glas/guld/parity | Layouts + drawables + pack CSS | `/specialist-widget-visual-parity` |

## Sync pipeline

```text
Action / Overlay save
  → WidgetCache or SecurePrefs queue (widget_draft_*, widget_state_*, widget_queue_*)
  → WidgetSync / companionWidgetBridge / WidgetRefreshWorker
  → Firestore or ingest callable (WORM only via server)
  → last_action_* / state keys refresh RemoteViews
```

Sync **öppnar aldrig** UI.

## MUST

- Läs denna skill före native widget-ändring
- Touch ≥ 56 dp (G85)
- Optimistic RemoteViews-uppdatering före nät
- WORM endast via callable
- Bevara Locked UX §5 / §13 / §23

## MUST NOT

- `WidgetLaunch` → `MainActivity` som enda lösning för write/record/toggle
- EditText / React inuti RemoteViews (osäkert / omöjligt) — använd overlay
- Direkt klient-write till `reality_vault`
- Röra Sacred `core/**`
- Kontinuerlig bakgrundspoll (`setInterval`) — idle/online/heartbeat only

## Canonical files

| Path | Role |
|------|------|
| `android/.../widgets/WidgetInteract.java` | broadcast / overlay / legacy deep-link |
| `android/.../widgets/WidgetActionReceiver.java` | in-place actions |
| `android/.../widgets/WidgetOverlayActivity.java` | translucent input surface |
| `android/.../widgets/WidgetLaunch.java` | **legacy** deep-link only |
| `src/widgets/core/WidgetSync.ts` · `WidgetCache.ts` | web kö |
| `widget_bible.md` | UX laws + Interactivity Contract |

## Smoke

```bash
npm run smoke:companion-widgets
```

### Manuell G85-checklista

1. Fäst Capture → **ett tryck** → inspelning i bakgrund (låst skärm OK) → tryck mic/notis Stoppa → kö OK  
2. Note → skriv i overlay → Spara → widget/state uppdateras  
3. Tasks → bocka rad → RemoteViews uppdateras med appen stängd  
4. Airplane → spara → online → data syns i appen utan att “öppna widget-flödet” i shell  

## Underagenter

Dirigent: `/specialist-widgets`  
Capture · Input · Actions · Visual · Sync-bridge — se `.cursor/agents/specialist-widget-interact-*.md`
