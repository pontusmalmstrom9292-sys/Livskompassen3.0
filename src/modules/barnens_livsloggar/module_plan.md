# barnens_livsloggar — module plan

## Overview

Den trygga hamnen — neutral WORM-logg för Kasper/Arvid. Route `/familjen`; redirect `/barnen`.

Canonical: `.context/modules/barnens_livsloggar.md` · Spec: `docs/specs/incoming/Barnen-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/FamiljenPage.tsx` | Kluster-wrapper |
| `components/BarnensPage.tsx` | PIN, flikar, orkestrator |
| `components/ChildSubLogPanel.tsx` | Livslogg steg 1 + bevis-val |
| `components/SaveAsEvidencePrompt.tsx` | `saveVaultLog` + `sourceRef` |
| `utils/childLogEvidence.ts` | Vault-payload från livslogg |
| `components/PhysiologicalControls.tsx` | Sömn, ångest, aptit 1–5 |
| `components/BalansMatare.tsx` | 7-dagars bar (ingen count-up) |
| `utils/balansIndex.ts` | Deterministisk aggregering — fysiologi only |
| `utils/exportBalansReport.ts` | JSON-export per barn |
| `constants.ts` | Kasper/Arvid, BALANS_WINDOW_DAYS=7 |
| `../core/firebase/firestore.ts` | `saveChildrenLog`, `getChildrenLogs` |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Kasper/Arvid + fysio 1–5 | Grid Diary-lik logg | Ja | **done** |
| Balans 7 dagar | BBIC-underlag | Ja | **done** |
| Livslogg `skola` | Ann/Lena observationer | Ja | **done** |
| WORM + separat PIN | Isolerad från valv | Ja | **done** |
| 2026-03-12 skolincident | Beviskandidat + barnlogg | Manuell | **use now** |
| Incident → valv knapp | Kladd explicit bro | Ja | **done** |
| Tredjepart-tagg filter | BBIC-export | Ja | **done** |
| Livslogg steg 1 → bevis-val | Wizard-lätt | Ja | **partial** |
| Unmount cleanup | Zero Footprint | Ja | **done** |
| Bro → Dossier | Samlad export | Länk | **done** |
| PDF + Dossier | Juridisk rapport | Dossier MVP | **partial** |
| "Dåliga hemligheter" separat modul | Notebook | Nej | **rejected** → livslogg |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

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

1. ~~Knapp "Spara som bevis?"~~ → **done** (`SaveAsEvidencePrompt.tsx`)
2. PDF-export (klient print eller Dossier deep-link)
3. Wizard progressive disclosure (valfritt)
4. ~~Unmount cleanup~~ → **done**
5. Dossier deep-link med förvalda källor (`?child=Kasper`)
