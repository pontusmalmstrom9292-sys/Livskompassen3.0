# Valv utkastad på Android — Zero Footprint blur — 2026-07-17

**Plattform:** Cursor · **Symptom:** utkastad inne i Valvet/Arkivet på G85

## Rotorsak

`useZeroFootprint` låste Valvet på `visibilitychange`/`pagehide` när WebView blev "gömd".
På Android händer det vid biometri, system-UI och andra korta pauser — utan att användaren lämnat appen.

## Fix

- Native (Capacitor): lås bara vid `App.appStateChange` (riktig bakgrund)
- Webb: behåll `visibilitychange` + `pagehide`
- Suppress under Fyren-upplåsning + 2,5 s grace (`vaultUnlockInFlight`)

## Verifiering

- `smoke:valv-security` PASS
- `typecheck:core-strict` PASS
- `smoke:android-platform` PASS

## Nästa steg för Pontus

`npm run build:web && npx cap sync android` → Android Studio Run (Clean om behövs).
