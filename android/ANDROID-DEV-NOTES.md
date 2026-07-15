# Livskompassen Android Development Notes

## Build & Deploy (Wave 3)
1. **Sync**: `npm run build:web && npx cap sync android`
2. **Gradle**: Öppna `android/` i Android Studio. Kör `Gradle Sync`.
3. **Run**: Använd Motorola G85 för test (Android 14/15).

## Felsökning (Logcat)
Använd följande filter i Android Studio Logcat:
`tag:Livskompassen`

Viktiga händelser:
- `Cold start override`: När en widget startar appen från dött läge.
- `Captured widget path`: När en widget har tryckts på.
- `WebView already at ... skipping loadUrl`: Indikerar att URL-jämförelsen fungerar (sparar batteri/prestanda).
- `Widget dispatch successful`: JS-eventet mottaget av web-lagret.

## Widget Test-checklista
Verifiera att följande widgets landar på rätt rutt utan att gå via hem först:
- [ ] **Inspelning (WH1)**: `/widget/inspelning?autostart=1&discreet=1`
- [ ] **Snabbanteckning (WH2)**: `/widget/anteckning`
- [ ] **Kompass (WH3)**: `/widget/kompass`
- [ ] **Hamn (WH4)**: `/widget/hamn`
- [ ] **Stämpel (WH6)**: "In" → `/widget/stampla?action=in`, "Ut" → `/widget/stampla?action=out`
- [ ] **Åtgärder (WH7)**: `/widget/aktioner`
- [ ] **Moduler (WH8)**: `/widget/moduler`

## Google Sign-In & Firebase
- **SHA-1**: Säkerställ att debug-nyckelns SHA-1 är registrerad i Firebase Console.
- **Pending Auth**: `MainActivity` använder `singleTask` och `setIntent(intent)` för att hantera auth-resultat efter att appen bakgrundats.
- **App Check**: Verifiera att anrop inte blockeras i Firebase Console.

## System-UI & Edge-to-edge
- Appen använder mörkt system-UI (#0D0B09) för att matcha Executive Midnight.
- Safe areas hanteras i CSS (web), men native statusbar är transparent/mörk.

## Versionering
- **versionCode**: Öka vid varje Play Store release.
- **versionName**: Följ `major.minor.patch` (synka med `package.json`).

## Säkerhet
- `FLAG_SECURE`: Aktivt i `MainActivity` (blockerar skärmdumpar).
- `allowBackup`: Sannolikt bör detta sättas till `false` i produktion för att förhindra extrahering av lokal data.
