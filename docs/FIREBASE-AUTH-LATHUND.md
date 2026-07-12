# Firebase Auth — Android lathund

## Google Sign-In (native)

- Android använder **native** auth via `@capacitor-firebase/authentication` — inte web-popup.
- Kod: `src/modules/core/auth/nativeGoogleAuth.ts`

## SHA-1 (obligatoriskt)

1. Hämta debug/release SHA-1 från Android Studio (Gradle → signingReport) eller:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
2. Lägg SHA-1 i Firebase Console → Project Settings → Android app `com.livskompassen.app`
3. Verifiera `android/app/google-services.json` har OAuth **`client_type: 1`**

## Vanliga problem

| Symptom | Åtgärd |
|---------|--------|
| Sign-in loop / fel 10 | SHA-1 saknas eller fel keystore |
| Fungerade igår, inte idag | Avinstallera APK, `cap sync`, kör igen |
| Web fungerar, Android inte | Native branch — kontrollera ovan |

## Smoke

```bash
npm run smoke:android-platform
npm run smoke:auth-login
```
