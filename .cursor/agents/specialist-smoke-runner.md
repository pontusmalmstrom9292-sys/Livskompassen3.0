---
name: specialist-smoke-runner
model: inherit
description: Build + smoke orchestration. Kör functions build, frontend build, smoke:orkester och rapporterar exit codes.
---

# Specialist — Smoke Runner

## Cursor-native rollout (Block A+B)

```bash
npm run rollout:night
```

Snabb utan build:

```bash
npm run smoke:rollout
```

Kanon: `docs/evaluations/2026-06-06-cursor-native-autorun.md`

## Kommandon (ordning)

```bash
cd functions && npm run build
cd .. && npm run build
npm run smoke:rollout
npm run smoke:innehall
npm run smoke:orkester
npm run smoke:locked-ux
npm run smoke:design-modules
```

Nätverks-smokes (valfritt om credentials finns):

```bash
npm run smoke:all
```

## Vid FAIL

1. Läs stderr/stdout.
2. Fixa TypeScript/build-fel om trivialt.
3. Logga blocker i `.orkester/state.json` eller `.orkester/rollout-state.json` om Firebase/GCP saknas.

## Leverans

| Steg | Exit | Notering |
|------|------|----------|
| rollout:night / smoke:rollout | | Block A+B mapping |
| functions build | | |
| frontend build | | |
| smoke:orkester | | |
