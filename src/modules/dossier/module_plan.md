# dossier — module plan (stub)

## Overview

Dossier-Generator — Sacred Feature. Samlad WORM-export till PDF med hash + `dossier_snapshot`.

**Route:** `/dossier` (planerad) eller export från `/valv` / `/barnen`  
**Canonical:** `.context/modules/dossier.md` · Spec: `docs/specs/incoming/Dossier-SPEC.md`

## Relaterad kod idag (ej full Dossier)

| Path | Modul | Roll |
|------|-------|------|
| `verklighetsvalvet/utils/exportVaultRecord.ts` | Valv | `exportVaultRecordAsPdf` — en post, print-dialog |
| `verklighetsvalvet/components/VaultLogList.tsx` | Valv | PDF-knapp per rad |
| `barnens_livsloggar/utils/exportBalansReport.ts` | Barnen | `exportBalansReport` + `downloadBalansReportJson` |
| `barnens_livsloggar/components/BarnensPage.tsx` | Barnen | JSON-export-knapp |

Dessa utiliteter **ersätter inte** Dossier — de saknar aggregation, hash, `dossier_snapshot` och Genkit-agent.

## Files (planerade)

| Path | Role |
|------|------|
| `components/DossierPage.tsx` | Urval, förhandsgranskning, generering |
| `api/dossierService.ts` | `generateDossier` callable |
| `utils/buildDossierHash.ts` | Hash av källdokument |

## Status

| Area | Status |
|------|--------|
| Full Dossier UI | **planned** |
| `generateDossier` callable | **planned** |
| `dossier_snapshot` WORM | **planned** |
| Dossier-Agent (Genkit) | **planned** |
| Export-knappar i Valv/Barnen | **planned** |
| Valv per-post PDF (utskrift) | **done** — se `exportVaultRecord.ts` |
| Barnen JSON Balans-export | **done** (stub) — se `exportBalansReport.ts` |

## Källor (full Dossier)

- `reality_vault` (exkl. `vävaren_metadata` valfritt)
- `journal`
- `children_logs`

## Security notes

- Explicit användar-trigger — ingen auto-delning
- Zero Footprint efter nedladdning
- CMEK + hash som integritetsbevis

## Nästa fas (implementera när användaren säger kör)

1. Urvalskomponent + route eller modal från valv/barnen  
2. `generateDossier` + `dossier_snapshot`  
3. Genkit PDF med Editorial Technical Architect-prompt  
4. Ersätt/integreera inte `exportVaultRecord`/`exportBalansReport` — de kan finnas kvar som snabbexport
