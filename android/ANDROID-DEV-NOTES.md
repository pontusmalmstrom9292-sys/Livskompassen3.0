# Livskompassen Android Development Notes

## Build & Deploy (Wave 7)
1. **Sync**: `npm run build:web && npx cap sync android`
2. **Gradle**: Öppna `android/` i Android Studio. Kör `Gradle Sync`.
3. **Run**: Använd Motorola G85 för test (Android 14/15).
4. **Release**: `assembleRelease` bygger en osignerad APK för verifiering.
5. **Tests**: `./gradlew :app:testDebugUnitTest` kör rutt-logik tester.
6. **Lint**: `./gradlew :app:lintDebug` för kvalitetskontroll.

## Felsökning (Logcat)
Använd följande filter i Android Studio Logcat:
`tag:Livskompassen`

Viktiga händelser:
- `Cold start override`: När en widget startar appen från dött läge (bypassar hem-flimmer).
- `Captured widget path`: När en widget har tryckts på. Nu med **Haptic Feedback**.
- `WebView already at ... (or equivalent)`: Indikerar att rutt-jämförelsen fungerar.
- `WebView requesting AUDIO_CAPTURE`: Begäran om mikrofonåtkomst i WebView.
- `Widget dispatch successful`: JS-eventet mottaget av web-lagret.

## Widget & Shortcut Test-checklista (Våg 7)
Verifiera att följande widgets och **App Shortcuts** (långtryck på ikonen) landar på rätt rutt:
- [ ] **Inspelning (WH1 / Shortcut)**: `/widget/inspelning?autostart=1&discreet=1`
- [ ] **Snabbanteckning (WH2 / Shortcut)**: `/widget/anteckning`
- [ ] **Kompass (WH3)**: `/widget/kompass`
- [ ] **Hamn (WH4)**: `/widget/hamn`
- [ ] **Stämpel (WH6 / Shortcut)**: `/widget/stampla`
- [ ] **Åtgärder (WH7)**: `/widget/aktioner`
- [ ] **Moduler (WH8)**: `/widget/moduler`

## ADB Widget Smoke Test
```bash
adb shell am start -n com.livskompassen.app/.MainActivity -e widget_path "/widget/inspelning?autostart=1&discreet=1"
```

## Säkerhet & Privacy (Härdad Våg 7)
- **FLAG_SECURE**: Aktivt (blockerar screenshots).
- **Haptic Feedback**: Ger omedelbar bekräftelse vid native-interaktion.
- **Themed Icons**: Stöd för Android 13+ monokroma ikoner.
- **Accessibility**: Förbättrad `contentDescription` för TalkBack i widgets.
- **Splash Animation**: Mjuk fade-out vid övergång till WebView.
- **Network Check**: Native Toast om nätverk saknas vid widget-start.
- **allowBackup**: FALSE. Konfigurerat via XML-regler.

## targetSdk 36
- Dokumenterat som medvetet val. Inga kritiska varningar.
