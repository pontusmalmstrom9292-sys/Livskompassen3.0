# V0 Baseline — produktkomplett körplan

**Datum:** 2026-06-18 · **Status:** PASS (lokal smoke)

## Orkester:night

`npm run orkester:night` → PASS (rollout/eslint SKIP_FAIL valfritt).

## Deploy-verify (OPS.1)

| Artefakt | Lokal | Prod |
|----------|-------|------|
| `functions:invalidateSession` | Finns | Kräver named deploy + Pontus OK |
| Hosting | `npm run build` PASS | `firebase deploy --only hosting` |

## Nästa manuella steg

```bash
cd functions && npm run build && cd ..
firebase deploy --only functions:invalidateSession,hosting
```
