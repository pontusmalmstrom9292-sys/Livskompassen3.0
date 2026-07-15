# Livskompassen Android Development Notes

## Build & Deploy (Final Wave 30)
1. **Sync**: `npm run build:web && npx cap sync android`
2. **Gradle**: Öppna `android/` i Android Studio. Kör `Gradle Sync`.
3. **Run**: Använd Motorola G85 för test (Android 14/15).
4. **Release**: `assembleRelease` bygger en osignerad APK för verifiering.
5. **Tests**: `./gradlew :app:testDebugUnitTest` (Rutt-logik PASS).
6. **Lint**: `./gradlew :app:lintDebug` (Felfritt PASS).

## Felsökning (Logcat)
Använd filter: `tag:Livskompassen`
- `Cold start override`: Widget-start bypassar hem-flimmer (Fas 3).
- `Captured widget path`: Widget-tap händelse med **Haptic Feedback** (Våg 6).
- `WebView already at ...`: Indikerar att rutt-jämförelsen sparar resurser (Våg 2).
- `JS Console`: Hybrid-loggar från WebView syns i Logcat (Våg 12).
- `AUDIO_CAPTURE`: Mikrofon-hantering för inspelning (Våg 5/9).

## Widget & Shortcut Checklista (G85)
Verifiera rutter (inga omvägar via hem/):
- [ ] **Inspelning (WH1 / Shortcut)**: `/widget/inspelning?autostart=1&discreet=1` (Audio Focus PASS)
- [ ] **Snabbanteckning (WH2 / Shortcut)**: `/widget/anteckning` (Copy: "En rad -> Inkast")
- [ ] **Kompass (WH3)**: `/widget/kompass` (Vektorikoner PASS)
- [ ] **Hamn (WH4)**: `/widget/hamn`
- [ ] **Stämpel (WH6 / Shortcut)**: `/widget/stampla` (48dp ytor PASS)
- [ ] **Åtgärder (WH7)**: `/widget/aktioner`
- [ ] **Moduler (WH8)**: `/widget/moduler`

## UI & Portal Polish (G85)
- **VisualViewport**: Rullgardiner (`HubDropdownNav`) och hjälptexter (`ModuleHelpHint`) är nu resistenta mot tangentbordet.
- **No-Flash**: Bakgrunden i WebView är låst till `#0D0B09` för att matcha Splash.
- **Double Back to Exit**: Tryck 2 gånger inom 2s för att stänga (förhindrar session-förlust).

## Säkerhet & Premium UX
- **FLAG_SECURE**: Screenshots spärrade.
- **allowBackup**: FALSE. Säkrad via XML-regler.
- **Valvet Storage**: Dedikerade `/valvet/` och `/export/` mappar.
- **Audio Focus**: Inspelning pausar automatiskt Spotify/media.
- **Network Resilience**: Native Toast om nätverk saknas vid start.
- **Themed Icons**: Stöd för monokroma ikoner på Android 13+.

## targetSdk 36
Medvetet val för att stödja Android 15+. Inga kritiska bygger- eller lint-fel.
