# Play Integrity — Android runbook

**App:** `com.livskompassen.app` · **Kanon:** `.context/android-capacitor.md`

1. Firebase Console → App Check → Android → Play Integrity
2. Debug: `VITE_APP_CHECK_DEBUG_TOKEN` + Console debug token
3. Kod: `src/modules/core/firebase/appCheck.ts` (native CustomProvider)
4. Smoke: `npm run smoke:android-platform`
5. Manuell: Motorola offline — `docs/OFFLINE-ANDROID.md`
