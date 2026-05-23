# ekonomi — module plan

**Canonical spec:** [`docs/specs/modules/Ekonomi-SPEC.md`](../../docs/specs/modules/Ekonomi-SPEC.md)

## Overview

Personal economy: Tid / Pengar / Logg i Vardagen. Valv (PIN) för frånvaro. No graphs, no LLM.

## UI (Fas 3)

| Flik | Innehåll |
|------|----------|
| **Tid** | `TimeAndPayPanel`, länk `/stampla` |
| **Pengar** | Saldo, period, lönespec, veckopeng, sparmål, profil, WORM-transaktioner |
| **Logg** | Ledger, fasta räkningar, senaste rader |

## Status

| Area | Status |
|------|--------|
| Fas 1 stämpel/flex | **done** |
| Fas 2 lön/skatt | **done** |
| Fas 3 Vardagen TID/PENGAR/LOGG | **done** |

## Security

- uid-scoped rules; WORM på `transactions` och `payslip_snapshots`
- Frånvaro kvar i Valv (PIN)
