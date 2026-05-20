# verklighetsvalvet — module plan

## Overview

Sacred Feature: WORM evidence vault (Verklighetsvalvet). Route `/valv` via dold Fyren-åtkomst (Shield 3s + WebAuthn).

## Files

| Path | Role |
|------|------|
| `components/VaultPage.tsx` | Vault UI — PIN gate, WORM logs |
| `../core/layout/FloatingDock.tsx` | Fyren — 3s progress + biometri |
| `../core/auth/webauthn.ts` | Passkey-gate (client MVP) |
| `../core/hooks/useShakeToKill.ts` | 15 m/s² → kill switch + `/` |
| `../core/firebase/firestore.ts` | `assertWormPayload`, `saveVaultLog` |

## Status

| Area | Status |
|------|--------|
| Fyren 3s + progress ring | **done** |
| WebAuthn gate | **partial** — client MVP |
| WORM rules | **done** — Firestore append-only |
| WORM client guard | **done** — `assertWormPayload` |
| Shake-to-Kill | **done** — RAM + navigate home |
| Store integration | **partial** — vault gate via session |

## CMEK-verifiering (nästa steg)

1. Firebase Console → Firestore → Encryption → CMEK key ring
2. Bekräfta att `reality_vault` och `journal` omfattas
3. Cloud Audit Log: `Decrypt` + `Encrypt` events synliga
4. Crypto-shredding testplan: key disable → data oläslig

## Security notes

- Demo PIN endast för lokal utveckling — produktion via env/WebAuthn
- Zero Footprint: vault unlock rensas vid background/timeout/kill switch
- Evidence via Drive → `notifyNewFile` (se `docs/DRIVE_AUTOMATION.md`)
