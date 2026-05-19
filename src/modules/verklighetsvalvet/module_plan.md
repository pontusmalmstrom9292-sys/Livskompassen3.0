# verklighetsvalvet — module plan

## Overview

Sacred Feature: immutable evidence vault (WORM). UI placeholder with PIN unlock; full flow requires 3s long-press + biometrics per system plan.

## Files

| Path | Role |
|------|------|
| `components/VaultPage.tsx` | Bento card — PIN gate, unlock message |

## Status

| Area | Status |
|------|--------|
| VaultPage UI | **partial** — demo PIN (`6469`), no long-press |
| WORM storage | **backend** — Firestore `reality_vault`, rules TBD |
| Store integration | **missing** — local `useState`, not `useStore.isVaultUnlocked` |

## Dependencies

- `core/ui/BentoCard`
- `core/types/firestore` (`VaultLog`, `FIRESTORE_COLLECTIONS.reality_vault`)

## Next steps

1. Implement 3-second long-press on Fyren/Shield dock icon.
2. Replace hardcoded PIN with secure gate + biometrics.
3. Connect to Firestore vault logs; enforce WORM (append-only) in rules.
4. Sync unlock state with `useStore.setVaultUnlocked`.

## Security notes

- **Never** ship production PIN in client code — remove demo PIN before release.
- Vault access must be Zero Footprint: clear unlock flag on background/timeout.
- Evidence uploads via Drive → `notifyNewFile` webhook (see `docs/DRIVE_AUTOMATION.md`).
