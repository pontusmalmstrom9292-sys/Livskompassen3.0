# PMIR — Native biometri challenge-attestation (v1)

**Datum:** 2026-06-19  
**Status:** Implementerad · **Fas 2 öppen** (Play Integrity)  
**Relaterad audit:** [`2026-06-19-security-hallucination-audit.md`](./2026-06-19-security-hallucination-audit.md)

---

## Problem (CRITICAL)

`issueVaultSessionViaBiometric` accepterade endast `{ platform: 'android' | 'ios' }` efter Firebase Auth.  
En autentiserad klient (skript/modifierad APK) kunde kringgå OS-biometri och få full Valv-session.

---

## Beslut

**Alternativ A — Server challenge-kedja (valt v1)**  
Two-step: `beginVaultBiometricChallenge` → OS-biometri på klient → `issueVaultSessionViaBiometric` med engångsbevis.

| För | Mot |
|-----|-----|
| Minimal diff, gratis tier | Modifierad APK kan fortfarande hoppa över biometri om challenge stjäls |
| Stoppar curl/skript direkt mot issue | Inte full hardware attestation |
| En gångs-token, 90 s TTL | |

**Alternativ B — Play Integrity / DeviceCheck (fas 2, rekommenderad prod)**  
Firebase App Check med Play Integrity (Android) + DeviceCheck/App Attest (iOS). Kräver Console + Pontus.

**Rekommendation:** A nu + B när App Check enforce aktiveras i prod.

---

## Implementation

### Backend

| Fil | Ändring |
|-----|---------|
| `functions/src/lib/vaultBiometricChallenge.ts` | Ny — nonce, SHA-256 proof, engångs consume |
| `functions/src/callables/valv.ts` | `beginVaultBiometricChallengeCallable` + issue kräver challenge |
| `functions/src/index.ts` | Export `beginVaultBiometricChallenge` |

Lagring: `users/{uid}/private/vault_biometric_challenge` (Admin SDK only).

### Klient

| Fil | Ändring |
|-----|---------|
| `vaultServerSession.ts` | `issueVaultSessionAfterNativeBiometric()` — begin → biometri → issue |
| `valvFyrenGate.ts` | Använder sammanslagen kedja (ingen dubbel biometri-dialog) |

### Oförändrat

- WebAuthn-kanal (`issueVaultSession`) — primär på webb
- WORM / `assertVaultSession` / Zero Footprint TTL
- `firestore.rules` — **ej ändrad**

---

## Smoke

```bash
npm run smoke:valv-security
npm run smoke:predeploy
cd functions && npm run build
```

---

## Deploy (efter merge)

```bash
cd functions && npm run build
firebase deploy --only functions:beginVaultBiometricChallenge,functions:issueVaultSessionViaBiometric
```

Frontend (Capacitor): `npm run build:web && npx cap sync android`

---

## Kvarstående risk (fas 2)

| Risk | Mitigation |
|------|------------|
| Modifierad APK skippar biometri men har challenge | Play Integrity + `APP_CHECK_ENFORCE=true` |
| Challenge replay inom 90 s | Engångs delete vid consume (OK) |

**Nästa PMIR-steg:** Aktivera App Check Play Integrity i Firebase Console — se [`docs/FIREBASE-AUTH-LATHUND.md`](../FIREBASE-AUTH-LATHUND.md).

---

*Godkänd implementation v1 — Pontus merge 2026-06-19.*
