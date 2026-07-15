# Livskompassen Android Development Notes

## Build & Deploy (Wave 5)
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
- `Captured widget path`: När en widget har tryckts på.
- `WebView already at ... (or equivalent)`: Indikerar att rutt-jämförelsen fungerar (Fas 2).
- `WebView requesting AUDIO_CAPTURE`: Begäran om mikrofonåtkomst i WebView (Fas 1).
- `Widget dispatch successful`: JS-eventet mottaget av web-lagret.

## Widget Test-checklista (Våg 5)
Verifiera att följande widgets landar på rätt rutt utan att gå via hem först:
- [ ] **Inspelning (WH1)**: `/widget/inspelning?autostart=1&discreet=1` (Begär RECORD_AUDIO vid klick)
- [ ] **Snabbanteckning (WH2)**: `/widget/anteckning`
- [ ] **Kompass (WH3)**: `/widget/kompass`
- [ ] **Hamn (WH4)**: `/widget/hamn`
- [ ] **Stämpel (WH6)**: "In" → `/widget/stampla?action=in`, "Ut" → `/widget/stampla?action=out`
- [ ] **Åtgärder (WH7)**: `/widget/aktioner`
- [ ] **Moduler (WH8)**: `/widget/moduler`

## ADB Widget Smoke Test
Testa widgets via terminalen (ersätt `/widget/*` med önskad path):
```bash
adb shell am start -n com.livskompassen.app/.MainActivity -e widget_path "/widget/inspelning?autostart=1&discreet=1"
adb shell am start -n com.livskompassen.app/.MainActivity -e widget_path "/widget/stampla?action=in"
```
Filter: `adb logcat -s Livskompassen`

## Google Sign-In & Firebase
- **SHA-1**: Debug-nyckelns SHA-1 måste matcha Firebase Console.
- **Pending Auth**: Hanteras via `singleTask` + `setIntent`.

## Säkerhet (Härdad)
- **FLAG_SECURE**: Aktivt (blockerar screenshots).
- **allowBackup**: FALSE. Konfigurerat i `AndroidManifest.xml`, `data_extraction_rules.xml` och `full_backup_content.xml`.
- **RECORD_AUDIO**: Krävs för WebView-inspelning. Beviljas automatiskt i WebView om Android-permission finns (Fas 1).
- **Exported Receivers**: Måste vara `true` för att systemet ska kunna skicka widget-uppdateringar.

## § Våg 5 NATTPASS — Rapport
- **FAS 1 (Fixat)**: `MainActivity` hanterar nu `WebChromeClient.onPermissionRequest` för `AUDIO_CAPTURE`. Beviljar åtkomst om appen har `RECORD_AUDIO`. Vid widget-tap på inspelning begärs även Android-permission proaktivt om den saknas.
- **FAS 2 (Fixat)**: Rutt-logik extraherad till `WidgetRouteMatcher`. 9 JUnit-tester implementerade och körda (`PASS`). Hanterar ordningsoberoende query-params och trailing slashes.
- **FAS 3 (Fixat)**: Widget-layouts granskade för touch-targets (48dp). `widget_stamp` in/ut knappar har säkrad minHeight.
- **FAS 4 (Fixat)**: `lintDebug` PASS. `assembleDebug` och `assembleRelease` PASS.
- **FAS 5 (Fixat)**: ADB-kommandon tillagda ovan.
- **FAS 6 (Granskat)**: Säkerhet verifierad. `exported=true` för receivers är korrekt. `FileProvider` och backup-regler är intakta.

## targetSdk 36
- Dokumenterat som medvetet val. Inga kritiska varningar.
