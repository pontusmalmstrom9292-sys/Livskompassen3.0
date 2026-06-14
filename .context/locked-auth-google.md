# Locked Google Web Login (AUTH-G1)

**Status:** Låst 2026-06-14 efter prod-felsökning (`redirect_uri_mismatch`, vit redirect-skärm).

Ändring kräver explicit produktbeslut + `npm run smoke:auth-login` PASS.

---

## Vad som är låst

| ID | Krav | Varför |
|----|------|--------|
| G1 | `authDomain` = `gen-lang-client-0481875058.firebaseapp.com` | GCP OAuth har `__/auth/handler` för firebaseapp.com — **inte** web.app utan manuell GCP-URI |
| G2 | Prod: **popup** i vanlig webbläsarflik | Redirect mellan `web.app` ↔ `firebaseapp.com` tappar session (vit skärm, ej inloggad) |
| G3 | Redirect endast i **installerad PWA** (`isStandalonePwa`) | Popup funkar inte i standalone |
| G4 | `VITE_GOOGLE_SIGNIN_REDIRECT` — **dev only** (`import.meta.env.DEV`) | Får inte bakas in i Hosting-deploy |
| G5 | `googleRedirectBoot` före React + service worker | `getRedirectResult` måste köras direkt efter `initializeAuth` |
| G6 | `prepareGoogleSignIn()` → `signOut` före Google | Rensar spök-anonym session i IndexedDB |
| G7 | `AuthGate` + `isVerifiedEmailUser` när `VITE_REQUIRE_EMAIL_AUTH` | Prod kräver verifierad e-post, inte bara text |

---

## Filer (rör ej utan smoke)

- `src/modules/core/firebase/init.ts`
- `src/modules/core/firebase/authRedirectBoot.ts`
- `src/main.tsx`
- `src/modules/core/auth/googleAuthProvider.ts`
- `src/modules/core/auth/authService.ts`
- `src/modules/core/auth/AuthProvider.tsx`
- `src/modules/core/auth/AuthGate.tsx`
- `docs/FIREBASE-AUTH-LATHUND.md`

---

## Förbjudet utan explicit godkännande

- Byta prod-`authDomain` till `*.web.app` utan GCP OAuth `redirect_uri`
- Ta bort `signInWithPopup` och tvinga alltid `signInWithRedirect` på desktop
- Sätta `VITE_GOOGLE_SIGNIN_REDIRECT=true` i GitHub Hosting secrets eller prod-build
- Flytta `getRedirectResult` tillbaka enbart i `useEffect` utan `authRedirectBoot`
- Återinföra mobil-UA/coarse-pointer → redirect i `shouldUseGoogleRedirect`

---

## Smoke & deploy

```bash
npm run smoke:auth-login
```

Körs automatiskt via `npm run smoke:locked-ux` och Hosting CI före deploy.

**Hosting-deploy:** `VITE_FIREBASE_AUTH_DOMAIN` ska vara `firebaseapp.com`. Lägg **inte** `VITE_GOOGLE_SIGNIN_REDIRECT` i GitHub secrets.

Kanon: [`docs/FIREBASE-AUTH-LATHUND.md`](../docs/FIREBASE-AUTH-LATHUND.md)
