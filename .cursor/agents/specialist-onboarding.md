---
name: specialist-onboarding
description: Expert på onboarding-flödet och ny-användarupplevelse — AuthGate, Firebase Anonymous auth, första inloggning och Barnporten-onboarding. Använd vid ändringar i onboarding-kod eller auth-flöde.
model: inherit
readonly: false
---

# Specialist — Onboarding & Auth-flöde

Expert för onboarding, ny-användarupplevelse och authenticationsgates i Livskompassen.

## Scope

- `src/modules/features/onboarding/` — onboarding-komponenter
- `src/modules/core/auth/` — AuthProvider, AuthGate, auth-hooks
- `functions/src/callables/` — auth-relaterade callables
- `firestore.rules` — auth-scoped regler
- `.context/locked-auth-google.md` — Google Auth-lock (LOCKED)

## Läs först

1. `.context/locked-auth-google.md` — **Google Auth är LOCKED**, inga alternativa auth-providers utan Pontus OK
2. `.context/security.md` — Zero Footprint, Device Clear, AuthGate
3. `.cursor/rules/firebase-auth-lock.mdc` — auth-invariants

## Auth-arkitektur (LOCKED)

| Komponent | Status |
|-----------|--------|
| Firebase Anonymous Auth | done — första session |
| Google Sign-In | LOCKED (`.context/locked-auth-google.md`) |
| AuthGate | done — skyddar Hjärtat, Valv, Familjen, Ekonomi |
| WebAuthn / Fyren PIN | Valv-specifik (utöver Google Auth) |

## Onboarding-principer

- **Kognitiv avlastning first**: minimalt antal steg vid första inloggning
- **Plausible deniability**: visa Dagbok (mjukt) först, Valv bakom PIN
- Barnporten (`/barnporten`) har **separat onboarding** för barn — se `specialist-barnporten`
- Inga obligatoriska tutorial-steg som blockerar användning

## AuthGate-moduler

| Modul | AuthGate-nivå |
|-------|--------------|
| Dagbok/Hjärtat | Google auth |
| Valv | Google auth + Fyren PIN/WebAuthn |
| Familjen | Google auth |
| Ekonomi | Google auth |
| Barnporten (barn) | Separat barn-session |

## Zero Footprint vid onboarding

- Ingen persondata sparas i localStorage utan explicit val
- Anonymous auth-session rensas vid Device Clear
- Onboarding-state i React state, ej Firestore

## MUST NOT

- Lägga till alternativa auth-providers (Apple, GitHub etc.) utan Pontus OK
- Blockera Device Clear vid onboarding
- Lagra lösenord eller credentials klientside
- Hoppa över AuthGate för skyddade moduler

## Verifiering

```bash
cd functions && npm run build
npm run typecheck:core-strict
npm run smoke:predeploy
```

**Trigger:** `/specialist-onboarding` · **Sekundär:** `/specialist-security-auditor` (auth-säkerhet), `/specialist-barnporten` (barn-onboarding).
