# PMIR-B — P4 capacity-aware MåBra parafras

**Datum:** 2026-06-18 · **Status:** IMPLEMENTERAD (deterministisk)

## Filer

- `functions/src/lib/mabraCapacityParafras.ts` (NY)
- `functions/src/callables/agents.ts` (wire)
- `scripts/smoke_mabra.mjs` (guards)

## API-utökning

`mabraCoach` returnerar vid bank_parafras / deterministic coach:
`capacityBand`, valfritt `microSteps`.

## Smoke

`npm run smoke:mabra`
