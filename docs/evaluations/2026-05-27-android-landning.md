# Android-landning — 2026-05-27

**Git:** `main` @ `9c1a55b4` · **Orkester:** [`2026-05-26-orkester-natt.md`](./2026-05-26-orkester-natt.md) PASS

## Definition of done

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | `origin/main` — `google-services.json`, offline-policy, android-capacitor-minne, Modul-GAP | **PASS** |
| 2 | APK byggd med `npm run build:web && npx cap sync android` (bundlad `dist`) | **PASS** (agent 2026-05-27) |
| 3 | Google **Logga in** på telefon | **PASS** (användare verifierat) |
| 4 | Offline: dagbok OK, Valv/barn block, synk-chip | **Du** — flygplansläge enligt [`OFFLINE-ANDROID.md`](../OFFLINE-ANDROID.md) |
| 5 | `npm run orkester:night` | **PASS** |
| 6 | [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md) auth/android = verifierad | **PASS** |

## Din sista kvälls-check (om ej redan gjort)

Android Studio: **Sync Gradle → Clean → Run** → flygplansläge-test (dagbok spara, Valv ska ge fel).

Minne: [`.context/android-capacitor.md`](../../.context/android-capacitor.md)

## Nästa chatt

[`docs/prompts/MABRA-DAGLIG-MIX-PROMPT.md`](../prompts/MABRA-DAGLIG-MIX-PROMPT.md)
