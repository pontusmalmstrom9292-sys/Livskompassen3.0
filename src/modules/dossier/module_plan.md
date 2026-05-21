# dossier — module plan

## Overview

Dossier-Generator — Sacred Feature. Samlad WORM-export till PDF med hash + `dossier_snapshots`.

**Route:** `/dossier` (AuthGate + Fyren A) · **Canonical:** [`docs/specs/incoming/Dossier-SPEC.md`](../../../docs/specs/incoming/Dossier-SPEC.md), `.context/modules/dossier.md`

## Låsta beslut (#1–#4)

Se Dossier-SPEC tabell. Fyren A, backend PDF, snapshot WORM evigt, hela dokument i granskning.

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Wizard + period/källor | Ombud/soc export | Ja | **done** |
| `generateDossier` + hash | Sacred Feature | Ja | **done** |
| `dossier_snapshots` WORM | Evigt snapshot | Ja | **done** |
| BBIC `reportType` | §I.4 öppen | Nej | **planned** |
| Bro från Valv/Barnen | Kladd | Nej | **planned** |
| Vävaren försätt opt-in | AI endast försätt | Nej | **planned** |
| Async `dossier_jobs` | Lång kö | Nej | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Files

| Path | Role | Status |
|------|------|--------|
| `components/DossierPage.tsx` | Wizard: period → källor → granskning → generera | **done** (UI) |
| `types.ts` | Input/result types | **done** |
| `utils/dossierCandidates.ts` | Filter, kandidatlista | **done** |
| `api/dossierService.ts` | `generateDossier` callable | **done** |
| `functions/src/lib/generateDossierInternal.ts` | Hash, PDF, snapshot, signed URL | **done** |

## Relaterad kod (snabbexport)

| Path | Roll |
|------|------|
| `verklighetsvalvet/utils/exportVaultRecord.ts` | Per-post print-PDF |
| `barnens_livsloggar/utils/exportBalansReport.ts` | JSON Balans |

## Deploy

```bash
firebase deploy --only firestore:rules,storage,functions:generateDossier
```

## Nästa fas

1. Bro *Skapa Dossier* i Valv/Barnen
2. Async `dossier_jobs` om PDF > ~10 s
3. Vävaren opt-in försätt (AI)
4. BBIC `reportType`

## Security

Fyren A, explicit trigger, Zero Footprint on unmount/Klar, ingen auto-delning.
