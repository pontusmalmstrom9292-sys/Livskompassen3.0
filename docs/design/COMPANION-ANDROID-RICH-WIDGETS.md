# Companion Android — rich RemoteViews (Capture + Note)

Date: 2026-07-21  
Scope: `android/.../widgets/` only — **no** Sacred `core/**`

## Problem

Companion chips used `WidgetViews.chip()` → `widget_dock_tile` with a **single** root `PendingIntent`. Tapping only opened the app; recording/note actions did not start until the user tapped again in WebView.

## Target (StampWidget pattern)

| Widget | Layout | Intents |
|--------|--------|---------|
| Capture | `widget_companion_capture.xml` | Mic + root → `?autostart=1` (web starts `MediaRecorder`); Senaste → `?focus=1` |
| Note | `widget_companion_note.xml` | Compose/+ → `?focus=1`; Foto → `?photo=1`; Röst → `?voice=1` |

Web host: `WidgetCompanionSurfacePage` → `QuickCaptureWidget({ autostart })` / `QuickNoteWidget({ autoVoice, autoPhoto })`.

## Remaining gaps (for android-kompis)

1. Other Companion chips (inbox, harbor, compass, …) still use single-root `chip()`.
2. Capture cannot record **inside** RemoteViews (no MediaRecorder on home screen) — deep-link autostart is the correct model.
3. Note `+` opens focus (save happens in WebView after text) — cannot POST from RemoteViews without a BroadcastReceiver + Capacitor bridge.
4. Optional: waveform ImageView / gold glow drawables for closer mockup parity on home screen.
5. Re-pin widgets after APK install so new layouts replace dock tiles.

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:widgets
npm run smoke:locked-ux
```
