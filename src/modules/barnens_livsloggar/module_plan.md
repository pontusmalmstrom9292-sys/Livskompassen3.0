# barnens_livsloggar — module plan

## Overview

Den trygga hamnen — neutral WORM-logg för Kasper/Arvid. Route `/familjen`; redirect `/barnen`.

Canonical: `.context/modules/barnens_livsloggar.md` · Spec: `docs/specs/incoming/Barnen-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/FamiljenPage.tsx` | Kluster-wrapper |
| `components/BarnensPage.tsx` | PIN, flikar, orkestrator |
| `components/ChildSubLogPanel.tsx` | Livslogg per barn |
| `components/PhysiologicalControls.tsx` | Sömn, ångest, aptit 1–5 |
| `components/BalansMatare.tsx` | 7-dagars bar (ingen count-up) |
| `utils/balansIndex.ts` | Deterministisk aggregering — fysiologi only |
| `utils/exportBalansReport.ts` | JSON-export per barn |
| `constants.ts` | Kasper/Arvid, BALANS_WINDOW_DAYS=7 |
| `../core/firebase/firestore.ts` | `saveChildrenLog`, `getChildrenLogs` |

## Status

| Area | Status |
|------|--------|
| AuthGate `/familjen` | **done** |
| Separat PIN + visibilitychange lock | **done** |
| Kasper/Arvid tabs | **done** |
| Fysiologi → `children_logs` | **done** |
| Livslogg (kategori, observation, impact) | **done** |
| BalansMatare 7 dagar | **done** |
| Tidslinje per barn | **done** |
| WORM Firestore rules | **done** |
| JSON stabilitetsrapport | **done** |
| Wizard UX | **planned** |
| PDF juridisk + hash | **planned** (Dossier) |
| Incident → `reality_vault` (explicit + sourceRef) | **planned** |
| Tredjepartstagg | **planned** |
| Unmount cleanup | **planned** |
| Larmtrösklar (diskret) | **planned** |
| Dagbok Variant B | **planned** |

## Produktbeslut (låsta 2026-05)

1. Enkel PIN; lås vid visibilitychange; fel PIN = meddelande only
2. Incident→valv: explicit knapp + sourceRef — aldrig auto
3. Balans: fysiologi only, 7 dagar
4. Export: JSON klient; PDF/Dossier per barn senare
5. Dossier opt-in; tredjepart via kategori skola senare

## Security notes

- Separat PIN från valv (`CHILDREN_PIN_KEY`)
- **Known:** `executeKillSwitch` raderar barn-PIN-hash — dokumenterat i SPEC
- Grey Rock neutrality in stored observations
- Minimize PII; GDPR retention

## Nästa fas (implementera när användaren säger kör)

1. Knapp "Spara som bevis?" → `saveVaultLog` med `sourceRef`
2. PDF-export (klient print eller Dossier)
3. Wizard progressive disclosure
4. Unmount cleanup i BarnensPage / ChildSubLogPanel
