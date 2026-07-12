# Offline på Android (Capacitor)

**Plattform:** Lokal APK · WebView laddar bundlad `dist/` (`https://localhost`).

## Vad fungerar offline

- Navigering i redan laddade vyer (React Router)
- Lokal cache via Firestore persistence (om aktiverad)
- Widget-routes under `/widget/*`

## Vad blockeras offline (WORM)

Enligt `offlineWritePolicy.ts`:

- `reality_vault` — inga skrivningar offline
- `children_logs` — inga skrivningar offline

Användaren ser nätverkschip om Firestore är offline.

## Efter kodändring

```bash
npm run build:web && npx cap sync android
```

Android Studio: Gradle Sync → Clean → Run.

## Felsökning

1. Avinstallera APK och kör igen (auth-cache)
2. Kontrollera att `dist/` synkats till `android/app/src/main/assets/public`
3. `npm run smoke:android-platform`
