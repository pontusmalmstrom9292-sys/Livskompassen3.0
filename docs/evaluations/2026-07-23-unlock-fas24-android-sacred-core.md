# Unlock — Fas 24 Android Sacred core hygiene (v65–v68)

Date: 2026-07-23
approved: yes
Pontus OK: Cursor Agent «Implement the plan» Fas24 Companion Waves 2026-07-23 (PMIR for Sacred Lock / Panic / Ghost / Edge AI)

## Scope

SacredLockManager deep-lock countdown + orphan fix; PanicTile SecurePrefs; ForensicGuard; ShakeDetector; Ghost Mode exit-after-unlock; NativeInterface escapeJs + Intelligence/Aura bridges; AppNotificationManager VISIBILITY_PRIVATE; IconManager stealth aliases; Manifest aliases; ML Kit language-id + entity-extraction; nativeMindAura / breathing / AuraFlow.

## MUST NOT

- Bypass biometric SacredLock
- Device Clear wipe via panic (lock only)
- Wire KeyRecovery StrongBox to Valv decrypt without biometri
- Delete core pillar files
- Change firestore.rules / storage.rules / sharedRules

## Smoke

```bash
cd android && ./gradlew verifySecurityComponents :app:compileDebugJavaWithJavac
npm run smoke:android-platform
npm run smoke:valv-security
npm run smoke:inbox
```
