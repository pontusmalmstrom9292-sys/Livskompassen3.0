# Livskompassen Android Development Notes

## Build & Deploy (Wave 4)
1. **Sync**: `npm run build:web && npx cap sync android`
2. **Gradle**: Öppna `android/` i Android Studio. Kör `Gradle Sync`.
3. **Run**: Använd Motorola G85 för test (Android 14/15).
4. **Release**: `assembleRelease` bygger en osignerad APK för verifiering.

## Felsökning (Logcat)
Använd följande filter i Android Studio Logcat:
`tag:Livskompassen`

Viktiga händelser:
- `Cold start override`: När en widget startar appen från dött läge (bypassar hem-flimmer).
- `Captured widget path`: När en widget har tryckts på.
- `WebView already at ... (or equivalent)`: Indikerar att rutt-jämförelsen fungerar.
- `Widget dispatch successful`: JS-eventet mottaget av web-lagret.

## Widget Test-checklista (Våg 4)
Verifiera att följande widgets landar på rätt rutt utan att gå via hem först (Cold start = PASS):
- [ ] **Inspelning (WH1)**: `/widget/inspelning?autostart=1&discreet=1`
- [ ] **Snabbanteckning (WH2)**: `/widget/anteckning`
- [ ] **Kompass (WH3)**: `/widget/kompass`
- [ ] **Hamn (WH4)**: `/widget/hamn`
- [ ] **Stämpel (WH6)**: "In" → `/widget/stampla?action=in`, "Ut" → `/widget/stampla?action=out`
- [ ] **Åtgärder (WH7)**: `/widget/aktioner`
- [ ] **Moduler (WH8)**: `/widget/moduler`

## Google Sign-In & Firebase
- **SHA-1**: Debug-nyckelns SHA-1 (finns i `google-services.json` client_type 1) måste matcha lokala `debug.keystore`.
- **Pending Auth**: `MainActivity` använder `singleTask` och `setIntent(intent)` för att hantera auth-callback vid bakgrundning.

## Säkerhet (Härdad)
- **FLAG_SECURE**: Aktivt (blockerar screenshots/skärminspelning).
- **allowBackup**: SATT TILL FALSE. Exkludering sker via `data_extraction_rules.xml` (Android 12+) och `full_backup_content.xml`.
- **RECORD_AUDIO**: Behålls (krävs för WebView-inspelning).

## System-UI & Edge-to-edge
- Transparent statusbar med mörkt tema (#0D0B09).
- Safe-areas (env-variabler) hanteras i CSS i `src/`.

## targetSdk 36
- Dokumenterat som medvetet val. Inga kritiska Lint-varningar vid bygge.
