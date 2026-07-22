# Android-Kompis — post B1–B4 web polish (2026-06-19)

**Scope:** Verifiera Motorola G85 / Capacitor-readiness efter B1–B4 (app/favicon/Android-ikon polish) på `main`.  
**Agent:** Android-Kompis · **Miljö:** CI/Linux workspace (ej fysisk G85).

---

## Automatisk verifiering (denna körning)

| Steg | Kommando | Resultat |
|------|----------|----------|
| Web build + cap sync | `npm run build:web && npx cap sync android` | **PASS** (exit 0, sync ~0.24s) |
| Android platform smoke | `npm run smoke:android-platform` | **PASS** (8/8) |
| Auth lock smoke | `npm run smoke:auth-login` | **PASS** (AUTH-G1) |

### `cap sync` noteringar

- Web assets kopierade till `android/app/src/main/assets/public`.
- Plugins: `@aparajita/capacitor-biometric-auth`, `@capacitor-firebase/app-check`, `@capacitor-firebase/authentication`, `@capacitor/app`.
- **Varning (ej blockerande):** `@capacitor/core@8.4.0` ≠ `@capacitor/android@8.3.4` — överväg `npm install @capacitor/core@8.3.4` vid Gradle-strul.

---

## Statisk checklista (kod/repo)

| Kontroll | Status | Källa |
|----------|--------|-------|
| `nativeGoogleAuth.ts` finns | **PASS** | `src/modules/core/auth/nativeGoogleAuth.ts` — `@capacitor-firebase/authentication` + `skipNativeAuth: true` |
| `google-services.json` har Android OAuth (`client_type: 1`) | **PASS** | `android/app/google-services.json` — SHA-1 `9c84fa709960d01adf6e19375c4175e17a07c9d4`, paket `com.livskompassen.app` |
| `capacitor.config.ts` appId | **PASS** | `com.livskompassen.app`, `androidScheme: 'https'`, `allowMixedContent: false` |
| Prod build utan `VITE_GOOGLE_SIGNIN_REDIRECT` | **PASS** | Ej i `.github/workflows/firebase-hosting-main.yml` env; smoke kräver DEV-gate i `googleAuthProvider.ts` |
| Auth native branch i `authService` | **PASS** | `capacitorGoogleSignIn` (smoke) |
| App Check före React | **PASS** | `main.tsx` → `initAppCheck` |

### SHA-1 — Pontus manuellt (Firebase Console)

Repo innehåller **debug**-fingeravtryck i `google-services.json`. Om Google-inloggning ger `DEVELOPER_ERROR` på G85:

1. Mac: `cd android && ./gradlew signingReport` → kopiera **SHA-1** för debug (eller release om du signerar release-APK).
2. Firebase Console → Project settings → Android `com.livskompassen.app` → **Add fingerprint**.
3. Ladda ner ny `google-services.json` → `android/app/google-services.json`.
4. Kontrollera att `oauth_client` har **`client_type: 1`** (Android), inte bara `3` (web).
5. Kör om: `npm run build:web && npx cap sync android`.

**Nuvarande hash i repo:** `9c84fa709960d01adf6e19375c4175e17a07c9d4` — måste matcha den keystore du kör på telefonen.

---

## Pontus — Motorola G85 Run (Android Studio)

### Förutsättningar (en gång)

- [ ] **JDK 21** i Android Studio: Settings → Build Tools → Gradle → Gradle JDK → **temurin-21** (Capacitor 8).
- [ ] Firebase Console: Authorized domains inkl. `gen-lang-client-0481875058.web.app` · Google sign-in **Enabled** · Android SHA-1 (ovan).
- [ ] USB-debug på G85 · kabel till Mac.

### Efter varje web/auth-ändring på `main`

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build:web && npx cap sync android
```

### Android Studio (varje Run)

1. Öppna mappen **`android/`** (inte projektroten).
2. **File → Sync Project with Gradle Files**.
3. **Build → Clean Project**.
4. Välj enhet **Motorola G85** (USB).
5. **Run** (grön play).

### Första inloggning på telefon

- Använd fliken **Logga in** (inte Skapa konto).
- Google-väljaren ska vara **in-app** (native) — inte Chrome + vit skärm.
- Vid fel konto: logga ut i appen och välj rätt Google-konto.

### Om auth strular

1. **Avinstallera** Livskompassen på G85.
2. Kör `build:web && cap sync` igen.
3. Clean + Run i Android Studio.
4. Om fortfarande `DEVELOPER_ERROR`: verifiera SHA-1 i Firebase (se ovan).

### Prod-WebView vs bundlad APK

| Script | Beteende |
|--------|----------|
| `npm run cap:sync` | Bundlar `dist` i APK — **rekommenderat** för att testa senaste `main` utan Hosting-deploy |
| `npm run cap:sync:prod` | WebView laddar live från `https://gen-lang-client-0481875058.web.app` — kräver deployad Hosting |

Efter B1–B4 polish: testa med **`cap:sync`** (bundlad dist) så ikon/favicon-ändringar följer med utan väntan på Hosting.

---

## GO / NO-GO (Android readiness)

| Område | Bedömning |
|--------|-----------|
| Build + cap sync | **GO** |
| Platform smoke | **GO** |
| AUTH-G1 smoke | **GO** |
| `google-services.json` struktur | **GO** (client_type 1 närvarande) |
| Fysisk G85 Run | **Ej verifierat här** — kräver Pontus Run enligt checklista ovan |

**Sammanfattning:** Repo och automatiska smokes är **GO** för Android Studio Run. Nästa steg för Pontus: **Sync → Clean → Run** på G85 med bundlad `cap:sync`-build.

---

## Referenser

- `.context/android-capacitor.md`
- `docs/FIREBASE-AUTH-LATHUND.md`
- `docs/OFFLINE-ANDROID.md`
- `capacitor.config.ts`
