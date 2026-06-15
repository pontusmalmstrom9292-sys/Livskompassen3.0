# Fas 13 — våg 5 final-gate — 2026-06-15

**Status:** PASS

| Gate | Resultat |
|------|----------|
| `smoke:plausible-deniability` | PASS |
| `npm run smoke:all` | PASS |
| `npm run typecheck:core-strict` | PASS (0 fel) |
| `npm run build` | PASS |

## Smoke-härdning (denna sprint)

Prod-smokes använder nu `SEED_FIREBASE_EMAIL` där WORM/sensitive auth krävs:
- `smoke_vault_worm.mjs`
- `smoke_inkast_lockdown.mjs`
- `smoke_valv_chat.mjs`
- `smoke_mabra.mjs`
- `smoke_children_logs.mjs`

## Deploy

Kör när du är redo:

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase deploy --only hosting
```

Functions (vid behov): named deploy endast — t.ex. `firebase deploy --only functions:generateDossier`
