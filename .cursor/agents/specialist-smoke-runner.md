---
name: specialist-smoke-runner
model: inherit
description: Build + smoke orchestration. Kör functions build, frontend build, smoke:orkester och rapporterar exit codes.
---

# Specialist — Smoke Runner

## Kommandon (ordning)

```bash
cd functions && npm run build
cd .. && npm run build
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
3. Logga blocker i `.orkester/state.json` om Firebase/GCP saknas.

## Leverans

| Steg | Exit | Notering |
|------|------|----------|
| functions build | | |
| frontend build | | |
| smoke:orkester | | |
