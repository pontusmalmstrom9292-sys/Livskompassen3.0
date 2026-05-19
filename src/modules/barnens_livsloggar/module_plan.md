# barnens_livsloggar — module plan

## Overview

Children's life logs — structured observations for co-parenting documentation (parallel parenting, "trygga hamnen"). No frontend code yet; vault types include `childrenImpact`.

## Files

| Path | Role |
|------|------|
| _(none yet)_ | Planned: per-child timeline, neutral factual logs |

## Status

| Area | Status |
|------|--------|
| UI | **missing** |
| Data model | **partial** — `VaultLog.childrenImpact`, archival agents in backend |
| WORM evidence | **backend** — via Verklighetsvalvet pipeline |

## Dependencies

- `verklighetsvalvet` for locked evidence
- `core/types/firestore`
- Agent: Mönster-Arkivarien / Livs-Arkivarien (`functions/src/agents/cards/`)

## Next steps

1. Define child entity schema (ids, aliases — no full names in client if possible).
2. Build timeline UI with factual-only prompts (no emotional venting in stored logs).
3. Optional export to vault as WORM entries.

## Security notes

- Child data: minimize PII, GDPR/parental authority considerations.
- Logs may become legal evidence — WORM + timestamp integrity required.
- Never sync to shared/co-parent channels without explicit user action.
