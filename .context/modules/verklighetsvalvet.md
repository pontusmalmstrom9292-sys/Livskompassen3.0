# Verklighetsvalvet

**Sacred Feature.** WORM-bevisvalv — append-only, CMEK, Zero Footprint.

## WORM
- Collection: `reality_vault` — create only, no update/delete
- `VaultLog`: userId, action, truth, category, isLocked, serverTimestamp

## Fyren (3s long-press)
- Shield i FloatingDock → WebAuthn biometri → vault gate → `/valv` → PIN

## Shake-to-Kill
- `useShakeToKill` — 15 m/s² → `executeKillSwitch()` (Zustand, sessionStorage, PIN, passkey)

## Kod
- `src/modules/verklighetsvalvet/`
- `src/modules/core/auth/webauthn.ts`
- `src/modules/core/hooks/useShakeToKill.ts`
