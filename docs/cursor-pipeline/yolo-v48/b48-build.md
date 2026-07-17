# B48 — Post-main-sync verify

## Mål

Efter PR #226 (App Check live-harden + Valv kickout debounce) på `main`:

1. Bekräfta att smoke-gates fortfarande fångar regressioner
2. Minimal fix **bara** om något FAIL:ar
3. Skriv kort eval: `docs/evaluations/2026-07-17-yolo-v48-g85-live-verify.md`

## Kör

```bash
npm run smoke:android-platform
npm run smoke:valv-security
npm run smoke:predeploy:build
```

## Scope

- Android App Check / Valv ZF / widget deep-link om smoke pekar dit
- Ingen Enforce, ingen hosting utan Pontus OK

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
