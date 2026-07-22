# YOLO Audit — Android Studio våg 2026-07-12

**Plattform:** Cursor Agent  
**Beslut:** GO (lokal APK) — ingen prod-deploy  
**Budget:** smoke:cost-guard PASS — inga nya betaltjänster

## Ändringar

| Område | Fix |
|--------|-----|
| Inkorg-flik | TabBar touch-manipulation + pointerUp; GoraHubTabBar rensar query |
| Liv och göra | widgetSiloConfig + livLauncherRoutes redirects; hash→route |
| Mobilbredd | Android-scoped overflow/width i dock-kanon-match.css |
| Docs | OFFLINE-ANDROID, FIREBASE-AUTH-LATHUND, android-capacitor.md |

## Smoke (PASS)

- smoke:android-platform (+ viewport)
- smoke:planering-gora-e
- smoke:inkast-fas2
- smoke:locked-ux
- smoke:basta-dock-lock
- smoke:cost-guard
- smoke:module-lock
- npm run build
- npm run cap:sync

## Känd blocker (pre-existing)

- smoke:predeploy FAIL på validate-prompts (prompt-speglar ej synkade) — **ej introducerad av denna våg**

## Manuell acceptans (Pontus)

1. Android Studio Run på G85
2. /planering → Inkorg-flik ×5
3. Meny → Liv och göra
4. Kontrollera ingen horisontell avklippning

## Nästa steg

```bash
npm run cap:sync
# Gradle Sync → Clean → Run
```
