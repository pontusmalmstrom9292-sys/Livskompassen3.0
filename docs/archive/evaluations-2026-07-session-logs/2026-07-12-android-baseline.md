# Android baseline — 2026-07-12

**Build:** `35bda95d2` (pre-fix)  
**Build-läge:** Lokal APK — `npm run cap:sync` → Android Studio Run  
**Enhet:** Motorola G85 (390×844) — manuell verifiering efter fix  
**Smoke:** `npm run smoke:android-platform` — PASS (statisk wiring)

## Rapporterade symtom

| Symtom | Route / UI | Sannolik rotorsak (kod) |
|--------|------------|-------------------------|
| Inkorg-fliken reagerar inte | `/planering` → GoraHubTabBar **Inkorg** | Touch vs horisontell scroll i `TabBar.tsx`; query `inputMode`/`picked` kan låsa Handling-vy |
| Liv och göra känns trasigt | Meny → `/vardagen`; widget post-save | Trasiga länkar `/vardagen?tab=inkast\|planering`; hash `/#inkast-lite` i Capacitor |
| Hela bredden syns inte | Hem, Planering, Vardagen | Header grid + `100vw`-element; `overflow-x: hidden` maskerar overflow |

## Statisk verifiering (pre-fix)

```
npm run smoke:android-platform — PASS (11/11)
```

Capacitor-config: `com.livskompassen.app`, `webDir: dist`, `androidScheme: https`.

## Acceptanskriterier (post-fix)

1. `/planering?tab=handling` → tryck **Inkorg** → panel "Samla, sortera, förbered" syns (5× i rad)
2. Meny → **Liv och göra** → `/vardagen` med launcher-kort
3. Ingen horisontell avklippning på G85 (390px)
4. `npm run smoke:predeploy:build` PASS

## Chrome Remote Debugging

Efter `cap:sync`: anslut telefon → `chrome://inspect` → WebView `com.livskompassen.app` → fånga konsol vid flikbyte.
