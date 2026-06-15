# Fas 18a — Android cap sync + Motorola-smoke

**Status:** Agent **PASS** 2026-06-15 — USER Motorola väntar  
**Git:** `main` @ `35dfda590`  
**Agent:** specialist-ux-guardian  
**Kanon:** [`.context/android-capacitor.md`](../../.context/android-capacitor.md) · [`OFFLINE-ANDROID.md`](../OFFLINE-ANDROID.md) · [`2026-06-15-fas13-vag-6-user-signoff.md`](./2026-06-15-fas13-vag-6-user-signoff.md)

---

## Agent-verifiering

| # | Kontroll | Bevis | Status |
|---|----------|-------|--------|
| 1 | `npm run build:web` | Vite build exit 0 · ~10s · PWA precache 127 entries | **PASS** |
| 2 | `npx cap sync android` | exit 0 · 4 plugins · web assets → `android/app/src/main/assets/public` | **PASS** |
| 3 | `google-services.json` `client_type: 1` | `android/app/google-services.json:18` — Android OAuth för `com.livskompassen.app` | **PASS** |
| 4 | SHA-1 i Firebase | `certificate_hash`: `9c84fa709960d01adf6e19375c4175e17a07c9d4` (debug) registrerad i json | **PASS** |
| 5 | Capacitor plugins | `@capacitor-firebase/authentication@8.2.0`, `@aparajita/capacitor-biometric-auth@10.0.0`, `@capacitor-firebase/app-check@8.3.0`, `@capacitor/app@8.1.0` | **PASS** |
| 6 | Säkerhetsgränser | Inga ändringar i `firestore.rules`, callables eller locked UX-kärna | **PASS** |

### Varning (ej blocker)

`@capacitor/core@8.4.0` ≠ `@capacitor/android@8.3.4` — cap sync lyckades ändå. Överväg `npm install @capacitor/core@8.3.4` vid nästa Capacitor-underhåll.

---

## Auth — om inloggning misslyckas på Motorola

1. Avinstallera appen på telefonen.
2. Android Studio: **Sync Gradle → Clean → Run** (efter cap sync).
3. Använd fliken **Logga in** (inte Skapa konto).
4. Om fortfarande fel: `cd android && ./gradlew signingReport` → jämför SHA-1 med Firebase Console → `com.livskompassen.app` → Add fingerprint → ladda ner ny `google-services.json`.

**Registrerad SHA-1 (debug, i json):** `9C:84:FA:70:99:60:D0:1A:DF:6E:19:37:5C:41:75:E1:7A:07:C9:D4`

---

## Motorola-checklista (USER — ~15 min)

Kör på Motorola efter Android Studio **Run**. Svara **"user signoff klar"** i chatten när klart.

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | **Install** — avinstallera gammal APK om auth-strul → Run från Studio | App startar utan vit skärm | ☐ USER |
| 2 | **Native Google** — fliken **Logga in** (samma konto som Mac) | uid synlig · inga auth-fel i logcat | ☐ USER |
| 3 | **Valv (#3)** — Fyren → biometri/PIN → spara bevispost | Post i `reality_vault` · ingen edit-knapp (WORM) | ☐ USER |
| 4 | **Barnporten (#4)** — Familjen → Barnporten → QR-pairing → logg | `children_logs` skapas | ☐ USER |
| 5 | **Offline** — flygplansläge → spara dagbok/planering | OK lokalt · chip visar offline · Valv-sparning blockeras | ☐ USER |
| 6 | **Logout** — Konto → logga ut | Zero Footprint · valv-session borta · inga bevis i drawer publikt läge | ☐ USER |

---

## Nästa steg (Pontus)

1. Öppna Android Studio → **Sync Project with Gradle Files** → **Build → Clean Project** → **Run** på Motorola.
2. Kör tabellen ovan rad för rad.
3. Vid PASS: svara **"user signoff klar"** → uppdatera [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md) USER-rader.

**Ej i scope:** `firestore.rules`, backend deploy, `cap:sync:prod` (kräver hosting deploy först).
