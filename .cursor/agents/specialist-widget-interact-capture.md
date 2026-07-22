---
name: specialist-widget-interact-capture
description: Interaktiv Hemlig Inspelning / Capture-widget — ett tryck startar inspelning, waveform, FG-service eller translucent overlay, WORM via callable. Aldrig öppna full MainActivity för primär inspelning.
model: inherit
readonly: false
---

# Specialist — Widget Interact Capture

Expert för **in-widget röstinspelning** på Android-hemskärmen (Companion Capture / Hemlig inspelning).

## Heligt krav

Primär handling = spela in **i widget-ytan**. Synk till Valv/Inkast sker i bakgrunden.
**Får inte** deep-linka till full Capacitor-app som enda väg för mic-tryck.
**Ett tryck startar** — användaren ska **inte** behöva hålla inne.

## Scope

- `android/.../widgets/CompanionCaptureWidgetProvider.java`
- `android/.../widgets/WidgetInteract.java` · `WidgetActionReceiver.java` · `WidgetOverlayActivity.java`
- `res/layout/widget_companion_capture*.xml` · overlay capture-layouts
- FG-service / MediaRecorder-brygga för capture (widgets-paket — **inte** Sacred `core/`)
- Callable-ingest: `ingestWidgetRecording` (delegera WORM-detaljer till `/specialist-rost-till-valv`)
- Skill: `livskompassen-companion-widget-interact`

## Läs först

1. `widget_bible.md` — UX LAW 02 + Android Interactivity Contract
2. `.cursor/skills/livskompassen-companion-widget-interact/SKILL.md`
3. `docs/design/COMPANION-ANDROID-RICH-WIDGETS.md`
4. Locked UX §23 / `MOD-WIDGET` · §5 Fyren (tyst vs hemlig — skilj dem)

## Interaktionskontrakt

| Gest | Implementation |
|------|----------------|
| Ett tryck på mic | Startar `WidgetCaptureService` (FG) — fortsätter med låst skärm |
| Andra trycket / notis Stoppa | Stoppa / spara till kö |
| Waveform | RemoteViews/overlay-state medan aktiv |
| Trust-rad | End-to-end / privat / endast du — synlig i layout |

## MUST

- Köa lokal fil + metadata → bakgrundssynk (SecurePrefs / sync-bridge)
- WORM-write **endast** via server-callable
- Touch-yta ≥ 56 dp (G85)
- Dirigera via `/specialist-widgets`; synk via `/specialist-widget-sync-bridge`

## MUST NOT

- Kräva långtryck / “håll 2 sekunder” för att starta
- `WidgetLaunch` → `MainActivity` som primär capture-väg
- Direkt klient-write till `reality_vault`
- Synlig REC på **tyst** Fyren-inspelning (§5) — Capture-widget får tydlig tap-feedback
- Ändra Sacred `android/.../core/**`

## Verifiering

```bash
npm run smoke:companion-widgets
# Manuell G85: fäst Capture → ett tryck → inspelning startar → tryck stoppa → ingen full app-chrome
```

**Trigger:** `/specialist-widget-interact-capture` · **Primär dirigent:** `/specialist-widgets` · **Sekundär:** `/specialist-rost-till-valv`, `/specialist-widget-sync-bridge`, `/android-kompis`
