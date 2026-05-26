# Android / Capacitor — projektminne

**Senast verifierat:** 2026-05 — native Google-inloggning fungerar på telefon efter SHA-1.

## Build före Run (påminn användaren)

Innan **Run** i Android Studio efter frontend- eller auth-ändringar:

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build:web && npx cap sync android
```

Sedan i Android Studio: **Sync Project with Gradle Files** → **Build → Clean Project** → **Run**. Vid auth-strul: avinstallera appen på telefonen och installera om.

| Script | Beteende |
|--------|----------|
| `npm run cap:sync` | Bundlar `dist` i APK (bra för lokal test) |
| `npm run cap:sync:prod` | WebView laddar live från `gen-lang-client-0481875058.web.app` — kräver deployad Hosting |

## Google-inloggning (Mac vs telefon)

| Miljö | Flöde |
|-------|--------|
| Mac / `npm run dev` | Web: popup eller redirect (`authService.ts`) |
| Capacitor Android/iOS | **Native** via `@capacitor-firebase/authentication` → `nativeGoogleAuth.ts` |

**SHA-1 krävs** för native Google på Android:

1. `cd android && ./gradlew signingReport` → kopiera **SHA-1** (debug)
2. Firebase Console → Project settings → Android `com.livskompassen.app` → Add fingerprint
3. Ladda ner ny `google-services.json` → `android/app/google-services.json`
4. Kontroll: `oauth_client` med **`client_type: 1`** (Android), inte bara `3` (web)

**Konto:** fliken **Logga in** (inte Skapa konto) för samma Google-konto som på Mac.

## Relaterade docs

- [`docs/FIREBASE-AUTH-LATHUND.md`](../docs/FIREBASE-AUTH-LATHUND.md)
- [`docs/OFFLINE-ANDROID.md`](../docs/OFFLINE-ANDROID.md)
- [`capacitor.config.ts`](../capacitor.config.ts) — `appId: com.livskompassen.app`
