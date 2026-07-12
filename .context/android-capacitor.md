# Android / Capacitor — snabbkanon

**App ID:** `com.livskompassen.app`  
**Web dir:** `dist/`  
**Scheme:** `https` (localhost i lokal APK)

## Dagligt flöde

```bash
npm run build:web && npx cap sync android
npm run android:open   # Android Studio → Run
```

Live reload (valfritt):

```bash
npm run dev            # terminal 1
npm run android:live   # terminal 2
```

## Prod-lik (Firebase Hosting UI)

```bash
npm run cap:sync:prod
npm run smoke:android-prod-sync
```

## Smoke

- `npm run smoke:android-platform` (inkl. viewport + redirects)
- Ingår i `smoke:tier2`

## Docs

- [`docs/OFFLINE-ANDROID.md`](../docs/OFFLINE-ANDROID.md)
- [`docs/FIREBASE-AUTH-LATHUND.md`](../docs/FIREBASE-AUTH-LATHUND.md)
- Regel: [`.cursor/rules/android-capacitor.mdc`](../.cursor/rules/android-capacitor.mdc)

## Widget deep-links

Native widgets → `/widget/*` via `MainActivity.java` + `WidgetDeepLinkBridge.tsx`.
