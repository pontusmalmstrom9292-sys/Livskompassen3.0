# MODULE-LOCK-REGISTER

Maskinläsbart register: [`.context/module-lock-register.json`](module-lock-register.json)

## Tillstånd

| Status | Betydelse |
|--------|-----------|
| `developing` | Aktiv utveckling |
| `review` | Kod klar, väntar sign-off |
| `locked` | 100 % felfri — PMIR vid ändring |

## Upplåsning

1. Skriv `docs/evaluations/YYYY-MM-DD-unlock-MOD-XXX.md` med `approved: yes`
2. Sätt `status: developing` i JSON
3. Ändra → smoke → `node scripts/lock_module.mjs MOD-XXX --smoke …`

## Verifiering

```bash
npm run smoke:module-lock
```

Regel: [`.cursor/rules/module-lock-guard.mdc`](../.cursor/rules/module-lock-guard.mdc)

## MOD-VALV-SAMLA (2026-07-22)

Valv Samla — Inkast + Arkivlista + Sök. Locked UX §2b. Globs: `vault/supermodule/**`, `ValvSamlaZone`, `ValvSuperModule`, `VaultSamlaHub`, `VaultLogList`. Smoke: `smoke:locked-ux` · `smoke:valv-mode`. Unlock: `docs/evaluations/2026-07-22-unlock-MOD-VALV-SAMLA.md`.
