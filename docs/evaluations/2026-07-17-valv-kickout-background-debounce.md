# Valv kickout Android — sustained background lock — 2026-07-17

**Symptom:** Fortfarande utkastad i Valvet på G85 efter App Check live-harden + ZF appStateChange.

## Rotorsak

1. `appStateChange(isActive:false)` låste **direkt** — även vid biometri/system-UI.
2. `WebView.pauseTimers()` i `MainActivity.onPause` frös JS-timers → opålitlig debounce.

## Fix

- Native: lås först efter **3 s** sustained bakgrund (timer + resume-check).
- Unlock-grace 2,5 s → 5 s.
- Ta bort `pauseTimers`/`resumeTimers` i MainActivity.

## Verifiering

- `smoke:valv-security` PASS
- `smoke:android-platform` PASS
- `typecheck:core-strict` PASS
- `cap sync android` körd lokalt

## Pontus

Android Studio → **Run** på G85 (APK läser bundlad `assets/public`, inte bara Hosting).
