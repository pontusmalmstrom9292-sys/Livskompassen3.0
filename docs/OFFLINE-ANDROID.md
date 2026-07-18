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

## USER-pass checklist (G85)

Kör en gång under Fas 24 daily driver:

1. Sätt telefonen i **flygplansläge**.
2. Öppna **Dagbok** — navigering ska fungera (läsa redan laddade vyer).
3. Försök spara i **Valvet** — ska **blockeras** (WORM offline).
4. Slå på nätet igen — normal sparning ska fungera.
5. Kryssa av i `docs/SMOKE_RESULTS.md` raden Offline flygplansläge.

Agent-prep 2026-07-18: policy + smoke:android-platform offline asserts PASS.
