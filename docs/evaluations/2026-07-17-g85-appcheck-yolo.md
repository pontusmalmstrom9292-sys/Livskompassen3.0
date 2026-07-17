# G85 App Check live-harden — YOLO — 2026-07-17

**Plattform:** Cursor · **Modell:** Grok 4.5 · **Läge:** YOLO  
**Fas:** 24 AKTIV · **Scope:** App Check + Capacitor Android (ingen deploy / ingen Enforce)

## Mål

1. Release/live får inte köra App Check debug-provider  
2. Prod Hosting/APK-web får inte bädda in debug-token från `.env`  
3. Release rensar stale debug-secret från tidigare debug-install  
4. Smoke fångar regressioner (inkl. Zero Footprint Android kickout-gate)

## Gaps (före denna våg)

| Gap | Risk |
|-----|------|
| Live Hosting + lokal `dist/` bäddade in `VITE_APP_CHECK_DEBUG_TOKEN` i JS | Debug-token offentlig; live G85 med `cap:sync:prod` exponerar den |
| Release rensade inte SharedPreferences DEBUG_SECRET | Stale secret kvar efter upgrade debug→release |
| Smoke saknade prod-dist-leak + ZF appStateChange + vite-strip | Regressioner tysta |

**Redan mergat (behålls):** LkNativeBuild gate, bootstrap prefs-key, release BuildConfig clear, Valv ZF `appStateChange`.

## Ändringar (minsta säkra diff)

| Fil | Ändring |
|-----|---------|
| `vite.config.ts` | Prod: nollställ env + `define` + generateBundle-assert mot token-leak |
| `src/modules/core/firebase/appCheck.ts` | `debugTokenFromEnv` DEV-only |
| `AppCheckDebugBootstrap.java` | Release: `clearStaleDebugSecret` |
| `scripts/smoke_android_platform.mjs` | Gates: DEV-guard, clear-stale, vite-strip, dist-leak, ZF appStateChange |

**Gjorde inte:** firebase deploy, App Check Enforce, rules, Sacred/Locked UX, `cap:sync:prod` (lokal shell utan prod-url — medvetet).

## Verifiering

| Check | Resultat |
|-------|----------|
| `npm run build:web` | **PASS** (token strip + generateBundle assert) |
| `npm run smoke:android-platform` | **PASS** |
| `npm run smoke:valv-security` | **PASS** · `typecheck:core-strict` **PASS** |
| `npm run smoke:android-prod-sync` | SKIP — lokal assets utan `server.url` (kör efter `cap:sync:prod`) |

## Pontus nästa (manuellt)

1. Merge PR → Hosting deploy (workflow_dispatch) så live slutar läcka token  
2. Firebase Console → App Check → rotera/ta bort gammal debug-token som legat i publika bundles  
3. G85: `npm run build:web && npx cap sync android` → Clean → Run (debug) eller `cap:sync:prod` efter deploy  

## Status

**GO** för commit + PR. **NO-GO** för prod Enforce. **Deploy SKIP** tills Pontus OK i chatt.
