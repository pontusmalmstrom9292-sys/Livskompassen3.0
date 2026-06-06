# Valv-säkerhet — session hardening (done 2026-06-06)

**Scope:** WORM-valv upplåsning — server-session sync, Zero Footprint stängning, Fyren fail-closed.

---

## Levererat

| Punkt | Detalj |
|-------|--------|
| `vaultSessionLifecycle.ts` | `endVaultSession` · `ensureVaultSessionReady` — en teardown-väg |
| `ensureVaultServerSession` | Återställer token efter refresh om client-gate finns |
| `VaultPage` | Synkar server-session vid mount; **Stäng** anropar full teardown |
| `openValvViaFyren` | Fail-closed om `issueVaultSession` misslyckas |
| `useZeroFootprint` | Idle 1 h → `endVaultSession` (client + server) |
| Copy | `VaultLockedGate` — biometri (ej vilseledande PIN-text) |

---

## Test

```bash
npm run smoke:valv-security
npm run smoke:valv-gate
npm run smoke:plausible-deniability
npm run smoke:locked-ux
npm run build
```

**Manuell:** Fyren 3s → biometri → Valv öppet → Stäng → drawer utan Valv-sektion · hard refresh med gate → session synkas.

**Deploy:** `firebase deploy --only hosting` (frontend). Backend `issueVaultSession` redan deployad.

---

## Ej scope

- Duress-PIN
- CMEK drift-verifiering
- Klickbara citations i ValvChat
