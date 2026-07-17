# Fas 22 — Android & manuella gates

**Kanon:** [fas20-manual-pontus-gates](evaluations/2026-06-18-fas20-manual-pontus-gates.md) · våg 22.9

## Automatisk verify (agent)

```bash
npm run smoke:android-platform
npm run smoke:auth-login
```

## Pontus manuellt (ej i kod)

1. Play Integrity — `docs/PLAY-INTEGRITY-ANDROID.md`
2. App Check Enforce — `docs/APP-CHECK-ENFORCE-RUNBOOK.md`
3. Offline Motorola — `docs/OFFLINE-ANDROID.md` § Test

## Efter web-deploy

```bash
npm run build:web && npx cap sync android
```
