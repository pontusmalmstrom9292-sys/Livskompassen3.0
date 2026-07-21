# Unlock MOD-CORE-MINNE — copy-audit KASAM-prompt

Date: 2026-07-21
approved: yes
Pontus OK: Cursor YOLO LOOP handoff «copy-audit-quickfixes» 2026-07-21

## Scope

- `src/modules/core/home/homeProactiveTriggers.ts` — byt user-facing «KASAM» mot copy-konstant
- `src/modules/core/copy/compassWidgetLabels.ts` — `eveningWeakDimensionPrompt`

## MUST NOT

- Ändra KASAM-scoring, synapses, adaptation-flöden
- WORM / rules / Locked UX

## Smoke

```bash
npm run build
npm run smoke:copy-audit
npm run smoke:minnes-arkitekt
npm run smoke:orkester
```

## Relock

Efter PASS: `node scripts/lock_module.mjs MOD-CORE-MINNE --smoke smoke:minnes-arkitekt`

Relock: `node scripts/lock_module.mjs MOD-CORE-MINNE --skip-smoke` (smoke:minnes-arkitekt kräver locked status), sedan smoke:minnes-arkitekt PASS.
