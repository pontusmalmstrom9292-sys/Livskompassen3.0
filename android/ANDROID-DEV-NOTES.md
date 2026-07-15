# Livskompassen Android Development Notes

## Build & Deploy
1. **Sync**: `npm run build:web && npx cap sync android`
2. **Gradle**: Öppna `android/` i Android Studio. Kör `Gradle Sync`.
3. **Run**: Använd Motorola G85 för test (Android 14/15).
4. **Release**: `assembleRelease` bygger en osignerad APK för verifiering.
5. **Tests**: `./gradlew :app:testDebugUnitTest` kör rutt-logik tester.
6. **Lint**: `./gradlew :app:lintDebug` för kvalitetskontroll.

## Felsökning (Logcat)
Använd filter: `tag:Livskompassen`
- `Cold start override`: Widget-start bypassar hem-flimmer.
- `Captured widget path`: Widget-tap händelse (inkl. Haptic Feedback).
- `JS Console`: Hybrid-loggar från WebView syns nu i Logcat.
- `WebView requesting AUDIO_CAPTURE`: Mikrofon-hantering.

## Widget & Shortcut Checklista
Verifiera rutter (inga omvägar via hem/):
- [ ] **Inspelning (WH1 / Shortcut)**: `/widget/inspelning?autostart=1&discreet=1` (Audio Focus + Permission)
- [ ] **Snabbanteckning (WH2 / Shortcut)**: `/widget/anteckning`
- [ ] **Kompass (WH3)**: `/widget/kompass` (Ny Vektor-ikon)
- [ ] **Hamn (WH4)**: `/widget/hamn` (Ny Vektor-ikon)
- [ ] **Stämpel (WH6 / Shortcut)**: `/widget/stampla` (48dp targets + Ny Vektor-ikon)
- [ ] **Åtgärder (WH7)**: `/widget/aktioner`
- [ ] **Moduler (WH8)**: `/widget/moduler`

## ADB Widget Smoke Test
```bash
adb shell am start -n com.livskompassen.app/.MainActivity -e widget_path "/widget/inspelning?autostart=1&discreet=1"
```

## Säkerhet & Premium UX (Våg 1-13)
- **FLAG_SECURE**: Screenshots spärrade.
- **allowBackup**: FALSE. Säkrad via `data_extraction_rules.xml`.
- **Valvet Storage**: Dedikerade `/valvet/` och `/export/` mappar i `file_paths.xml`.
- **Haptic Feedback**: Vibration vid varje native tryck.
- **Themed Icons**: Stöd för monokroma ikoner (Android 13+).
- **Splash Animation**: 400ms fade-out vid övergång till web.
- **Hybrid Logging**: JS `console.log` skickas till Logcat.
- **Audio Focus**: Inspelning pausar annan media (t.ex. Spotify).
- **Offline Resilience**: Native Toast om nätverk saknas vid widget-start.

## targetSdk 36
Dokumenterat val för att stödja senaste funktionerna (Android 15+).
