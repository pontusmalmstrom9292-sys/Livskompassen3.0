# App Check Valv-kickout fix — 2026-07-18

## Symptom
G85: `beginVaultBiometricChallenge` → HTTP 400 (APP_CHECK_ENFORCE). App Check-fel i UI.

## Verifierat (live)
- `APP_CHECK_ENFORCE=true` på beginVaultBiometricChallenge
- `.env` debug-token `exchangeDebugToken` → HTTP 200
- 2 Android debug tokens registrerade i Firebase App Check API
- Ingen adb-enhet ansluten; `adb setprop` är ej beständig över reboot

## Fix (kod)
- `LkNativeBuildPlugin` exponerar BuildConfig-debugToken till JS (endast DEBUG)
- `appCheck.ts`: string-token till Capacitor + `awaitAppCheckReady` + warm retries
- `vaultServerSession.ts`: väntar App Check före Valv-callables
- `smoke:android-platform` uppdaterad — PASS
- `npm run build:web && npx cap sync android` — PASS

## Krävs av Pontus
Android Studio → **Run** (debug-APK) så ny native plugin + BuildConfig bakas in.

## Agent leverans (2026-07-18)

- Commit: App Check BuildConfig-token + await före Valv-session
- `npm run cap:sync` PASS · `assembleDebug` → `android/app/build/outputs/apk/debug/app-debug.apk` (55M)
- Våg 2b: `withVaultSessionPayloadReady` / `requireAppCheckReady` på Valv-callables; MainActivity deep-link efter kallstart
- **USB-enhet saknades** — ingen `adb install` denna session

### Pontus (ett steg)

Android Studio → **Run** (debug) på G85 → öppna Valvet → kort bakgrund (&lt;3 s) → ska inte sparka ut.
