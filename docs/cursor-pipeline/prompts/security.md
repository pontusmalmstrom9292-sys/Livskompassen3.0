---
scope: security-audit
mustNot:
  - Mock-WORM eller fake CMEK
  - Bypass vault session gate
  - Auto-promote barnlogg → Valv
  - Ändra firestore.rules / storage.rules (read-only audit)
verifyCommands:
  - npm run smoke:valv-security
  - npm run smoke:plausible-deniability
  - npm run smoke:vault-worm
  - npm run smoke:epistemic-guard
---

# Säkerhetspaket — Cursor Pipeline

Du arbetar mot **säkerhet + synapser**-repomix. Read-only audit om inget explicit fix-uppdrag.

## Uppgift

Granska WORM, tre silos, Zero Footprint och vault session gate. Rapportera GAP — fixa endast uppenbara säkerhetsbrister inom scope.

## MUST

- WORM: append-only på `reality_vault`, `children_logs`, `journal`, `evolution_ledger`
- Zero Footprint: rensa session/synapse vid logout, blur, panic
- Vault: PIN/WebAuthn via Fyren — plausible deniability i publikt läge
- Callable guards: `callableGuards.ts`, `vaultSessionGate.ts`
- YOLO gate: `npm run smoke:predeploy` minimum

## READ FIRST

- `.context/security.md`
- `.context/arkiv-minne.md`
- `firestore.rules` (audit only)
- `functions/src/adk/synapses/synapseBus.ts`
