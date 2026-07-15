# Livskompassen Android Development Notes

## Build & Deploy
1. **Sync**: `npx cap sync android`
2. **Gradle**: Öppna `android/` i Android Studio. Kör `Gradle Sync`.
3. **Build**: `npm run build:web` sedan `npx cap copy android`.
4. **Run**: Använd Motorola G85 för test (Android 14/15).

## Felsökning (Logcat)
Använd följande filter i Android Studio Logcat för att se app-specifika loggar:
`tag:Livskompassen`

Viktiga händelser att bevaka:
- `MainActivity onCreate`: App-start.
- `Captured widget path`: När en widget har tryckts på.
- `Loading URL for widget`: När WebView navigerar direkt till en widget-rutt.
- `Widget dispatch successful`: När JS-eventet har tagits emot av web-lagret.

## Widget Test-checklista
Vid varje release, verifiera att följande widgets landar på rätt rutt:
- [ ] **Inspelning (WH1)**: Ska gå till `/widget/inspelning?autostart=1&discreet=1`.
- [ ] **Snabbanteckning (WH2)**: Ska gå till `/widget/anteckning`.
- [ ] **Kompass (WH3)**: Ska gå till `/widget/kompass`.
- [ ] **Hamn (WH4)**: Ska gå till `/widget/hamn`.
- [ ] **Stämpel (WH6)**: Prova både "In" och "Ut" knappar.
- [ ] **Åtgärder (WH7)**: Ska gå till `/widget/aktioner`.
- [ ] **Moduler (WH8)**: Ska gå till `/widget/moduler`.

## Säkerhet
- **FLAG_SECURE**: Är aktivt i `MainActivity`. Skärmdumpar och skärminspelning är blockerade för att skydda användarens integritet.
- **Biometri**: Kräver `USE_BIOMETRIC` permission (finns i Manifest).
- **App Check**: Aktiverat via Firebase för att motverka missbruk.
