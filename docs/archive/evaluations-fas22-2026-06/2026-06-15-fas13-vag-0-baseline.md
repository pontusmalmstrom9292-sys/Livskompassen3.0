# Fas 13 — våg 0 baseline — 2026-06-15

**Status:** PASS

## Utfört

| Steg | Resultat |
|------|----------|
| `npm install` (devDeps, isolerad cache) | PASS — typescript/vite återställda |
| `uploadProjectImage` alias i `storage.ts` | PASS — `smoke:design-modules` |
| `typecheck:core-strict` | PASS — 0 fel |
| `npm run build` | PASS |
| `npm run orkester:night` | PASS (ESLint SKIP_FAIL optional) |

## Kodändringar

- `src/modules/core/firebase/storage.ts` — `uploadProjectImage` alias
- `scripts/lib/firebaseAdmin.mjs` — resolve admin från `functions/node_modules`
- `scripts/orkester_capability_gate.mjs` — använder firebaseAdmin helper
- `scripts/orkester_wiring.mjs` — använder firebaseAdmin helper
- `docs/FAS13-SPRINT-AUTORUN.md` — sprint-kö skapad
- `.orkester/fas13-state.json` — state initierad

## Nästa våg

`security-12c` — vault-gate på `weeklySummary` + `compass`
