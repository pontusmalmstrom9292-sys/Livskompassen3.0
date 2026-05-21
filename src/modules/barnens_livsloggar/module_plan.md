# barnens_livsloggar — module plan

## Overview

Den trygga hamnen — Kasper/Arvid sub-loggar, fysiologi, Balansmätare, juridisk export.

Route: `/barnen` · Canonical: `.context/modules/barnens_livsloggar.md` · Spec: `docs/specs/incoming/Barnen-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/BarnensPage.tsx` | PIN gate, barn-flikar, orkestrator |
| `components/ChildSubLogPanel.tsx` | Neutral livslogg per barn |
| `components/PhysiologicalControls.tsx` | Sömn, ångest, aptit (1–5) |
| `components/BalansMatare.tsx` | 7-dagars stabilitetsindex (bar, ingen count-up) |
| `utils/balansIndex.ts` | Deterministisk aggregering |
| `utils/exportBalansReport.ts` | JSON-export (juridisk stub) |
| `constants.ts` | Kasper/Arvid, BALANS_WINDOW_DAYS |
| `types.ts` | ChildrenLogEntry, BalansResult, signals |

## Status

| Area | Status |
|------|--------|
| AuthGate route | **done** |
| Separat PIN + lås vid visibilitychange | **done** |
| Kasper/Arvid tabs | **done** |
| Fysiologi → `children_logs` | **done** |
| Livslogg (kategori, observation, impact) | **done** |
| BalansMatare 7 dagar | **done** |
| Tidslinje per barn | **done** |
| WORM Firestore rules | **done** |
| JSON stabilitetsrapport | **done** (stub) |
| PDF juridisk rapport | **planned** |
| Steg-wizard (spec målbild) | **planned** |
| Formulär unmount cleanup | **planned** |
| Incident → reality_vault | **planned** |
| Dagbok-tagg Variant B | **planned** |
| Dossier-agent PDF (backend) | **planned** |

## Balansmätare

- `computeBalansIndex(logs, childAlias)` — 7-dagars fönster
- UI: horisontell bar, guld accent — **inte** count-up animation
- Export: `downloadBalansReportJson` — PDF saknas

## Security notes

- Child data: minimize PII, GDPR retention
- Grey Rock neutrality in stored observations
- Separat PIN från valv; Zero Footprint partial

## Nästa fas (implementera när användaren säger kör)

1. PDF-export (client print eller Cloud Function)  
2. Unmount cleanup i ChildSubLogPanel / BarnensPage  
3. "Skapa juridisk rapport"-knapp med hash-metadata  
4. Valfri bro till valv för allvarliga incidenter  
