# Grok 4.5 · YOLO — Android App Check harden — 2026-07-15

**Plattform:** Cursor · **Modell:** Grok 4.5 · **Läge:** YOLO  
**Fas:** 24 AKTIV · **Scope:** App Check + Capacitor Android (ingen deploy / ingen Enforce)

---

## Mål

1. Release får inte köra App Check debug-provider  
2. Web (`appCheck.ts`) och native (`AppCheckDebugBootstrap` / `MainActivity`) konsistenta  
3. `smoke:android-platform` fångar regressioner  
4. Gratis-tier, noll scope creep, Zero Footprint-respekt (ingen ny GCP-tjänst)

---

## Gaps (före)

| Gap | Risk |
|-----|------|
| JS aktiverade `debugToken: true` om `VITE_APP_CHECK_DEBUG_TOKEN` fanns i Vite-bundle | Release-APK efter `cap sync` med lokal `.env` kunde installera Debug provider |
| Fel SharedPreferences-nyckel / key (WIP redan delvis) | Telefon genererade egen secret ≠ Console-token |
| Bootstrap-ordning vs WebView | Race mot tidig `getToken` |
| Smoke saknade release-clear + BuildConfig-gate + app-id-match | Regressioner tysta |

---

## Ändringar (minsta säkra diff)

| Fil | Ändring |
|-----|---------|
| `LkNativeBuildPlugin.java` *(ny)* | Cap-plugin: `useDebugProvider = BuildConfig.DEBUG ∧ token` |
| `MainActivity.java` | `registerPlugin` före bridge; `applyIfDebug` **före** `super.onCreate` |
| `AppCheckDebugBootstrap.java` | Korrekt prefs-key (`DEBUG_SECRET` + urlEncode persistenceKey); sync `commit`; DEBUG-gate |
| `android/app/build.gradle` | Release nollställer `FIREBASE_APP_CHECK_DEBUG_TOKEN` (kvar från WIP) |
| `src/modules/core/firebase/appCheck.ts` | Native debug endast via `LkNativeBuild` gate; `debugToken: true` boolean; fail-closed |
| `scripts/smoke_android_platform.mjs` | Gates: release-clear, BuildConfig.DEBUG, app-id-match, plugin, bootstrap-ordning |

**Gjorde inte:** firebase deploy, App Check Enforce, rules, Sacred/Locked UX, push.

---

## Verifiering

| Check | Resultat |
|-------|----------|
| `npm run smoke:android-platform` | **PASS** |
| `npm run smoke:valv-security` | **PASS** |
| `npm run typecheck:core-strict` | **PASS** |
| `npm run smoke:governance` | **PASS** |

---

## Nollställning / risk

- Debug-APK: kräver `VITE_APP_CHECK_DEBUG_TOKEN` i `.env` → BuildConfig + Console → Manage debug tokens.  
- Release: Play Integrity i Firebase Console för `com.livskompassen.app` (befintligt; ej Enforce i denna våg).  
- Efter kodändring: `npm run build:web && npx cap sync android` → Gradle Sync → Clean → Run (android-capacitor-regeln).

---

## Status

**GO** för commit + lokal Android sync. **NO-GO** för prod Enforce utan Pontus OK.
