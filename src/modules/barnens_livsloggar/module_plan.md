# barnens_livsloggar — module plan

## Overview

Den trygga hamnen — Kasper/Arvid sub-loggar, fysiologi, Balansmätare.

Route: `/barnen`

## Files

| Path | Role |
|------|------|
| `components/BarnensPage.tsx` | PIN gate, tabs, export |
| `components/ChildSubLogPanel.tsx` | Neutral livslogg per barn |
| `components/PhysiologicalControls.tsx` | Sömn, ångest, aptit |
| `components/BalansMatare.tsx` | 7-dagars stabilitetsindex |
| `utils/balansIndex.ts` | Rullande medelvärde |
| `utils/exportBalansReport.ts` | JSON export stub |

## Status

| Area | Status |
|------|--------|
| Kasper/Arvid tabs | **done** |
| Fysiologi → `children_logs` | **done** |
| BalansMatare 7 dagar | **done** |
| Design #818CF8 / #FDE68A | **done** |
| JSON export | **done** (stub) |
| PDF juridisk rapport | **planned** |

## Juridisk stabilitetsrapport (krav)

- Format: PDF + JSON (WORM-export från Firestore snapshot)
- Innehåll: 7/30-dagars Balansindex, fysiologi-trend, tidsstämplade observationer
- Metadata: hash + createdAt (integritet)
- Ingen auto-delning till motpart — explicit användar-export
- Nästa: PDF-generering client-side eller Cloud Function

## Security notes

- Child data: minimize PII, GDPR retention
- Grey Rock neutrality in stored observations
- Separate PIN, Zero Footprint on visibility change
