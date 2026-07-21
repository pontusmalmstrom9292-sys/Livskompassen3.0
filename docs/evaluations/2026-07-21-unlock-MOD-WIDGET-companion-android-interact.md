# Unlock — MOD-WIDGET Companion Android interaktivitet + mockup-elevation

Date: 2026-07-21
approved: yes
Pontus OK: Cursor-chatt «lös det vad som än krävs» + «de är inte interaktiva heller … lös det också noggrant» 2026-07-21

## Modules

| Modul | Scope |
|-------|--------|
| MOD-WIDGET | Android Companion Capture/Note rich RemoteViews (multi PendingIntent, Stamp-mönster); `WidgetLaunch` unik data-URI; web `?autostart=1` startar QuickCapture; mockup CSS/markup i `src/widgets/**` |
| MOD-CORE-CHROME | Endast om CompanionHomeRail polish (additiv) |

## Syfte

1. Hemskärms-chips ska inte bara öppna hem — deep-link + focus/autostart ska nå rätt yta.
2. Capture/Note: multi-action knappar (mic → autostart, recent/focus, photo/voice) via app-session (WebView).
3. Visuell elevation mot Pontus mockups (glass/guld/waveform) utan att ta bort §23-ytor.

## MUST NOT

- Native ingest/inspelning utan app-session (Sacred/App Check/ZF)
- Ändra `android/.../core/**` (WidgetNavigator orörd — redan wired)
- Ta bort Companion providers / 10-pack / HomeRail / Studio
- Cross-RAG via widget-transport
- `setInterval` idle i WidgetSync

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:widgets
npm run smoke:locked-ux
npm run smoke:module-lock
```

## Efter merge

Re-lock MOD-WIDGET om den satts till developing. Companion §23 förblir låst mot borttagning.
