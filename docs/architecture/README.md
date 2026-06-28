# Architecture — Livskompassen v2

**Governance:** [`docs/AI-GOVERNANCE.md`](../AI-GOVERNANCE.md)  
**System phase:** [`docs/PROJECT_STATE.md`](../PROJECT_STATE.md)  
**Live plan:** [`.context/system-plan.md`](../../.context/system-plan.md)

## Files in this folder

| File | Purpose |
|------|---------|
| [`systemteknisk-analys-kanon.md`](./systemteknisk-analys-kanon.md) | Technical analysis canon |
| [`MASTER-INTEGRATION-MANIFEST.md`](./MASTER-INTEGRATION-MANIFEST.md) | Integration manifest |
| [`INFINITE_EVOLUTION.md`](./INFINITE_EVOLUTION.md) | Evolution architecture notes |
| [`module_plan.md`](./module_plan.md) | Module planning |

## Layers (code)

`src/` frontend · `functions/` backend · `firestore.rules` / `storage.rules` (PMIR) · ADK `functions/src/adk/`

## Key docs (outside folder)

- `docs/Architecture-Review.md`
- `docs/MODUL-FUNKTIONS-REGISTER.md`
- `docs/specs/modules/Arkiv-GAP-REGISTER.md`
- `docs/system_sync/system_architecture_summary.md`

## Invariants

WORM · tre silos · DCAP före LLM · Zero Footprint

## Zones

`/hjartat` · `/vardagen` · `/familjen`

Verify: `npm run smoke:predeploy:build`
