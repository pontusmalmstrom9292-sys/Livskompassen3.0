# barnens_livsloggar

> Den trygga hamnen — neutral livslogg för Kasper och Arvid (BBIC-orienterat).

## Syfte

Grey Rock-dokumentation av barnens basbehov. Skild från dagbok, valv och vuxenkonflikt. Fysiologi och livslogg som separata WORM-poster.

## Route och ingång

| | |
|---|---|
| **Route** | `/familjen` (redirect `/barnen`) |
| **AuthGate** | ja |
| **Dock** | Heart |
| **Kluster** | Familjen — innehåll Livsloggar |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/FamiljenPage.tsx` | Kluster-wrapper |
| `components/BarnensPage.tsx` | PIN, flikar, orkestrator |
| `components/PhysiologicalControls.tsx` | Sömn, ångest, aptit 1–5 |
| `components/ChildSubLogPanel.tsx` | Livslogg + kategori |
| `components/BalansMatare.tsx` | 7-dagars bar |
| `components/SaveAsEvidencePrompt.tsx` | Incident → valv |
| `utils/balansIndex.ts` | Aggregering (fysiologi only) |
| `utils/exportBalansReport.ts` | JSON-export per barn |
| `constants.ts` | Kasper/Arvid, kategorier |

**Firestore:** `core/firebase/firestore.ts` — `saveChildrenLog`, `getChildrenLogs`

## Data

| Collection | Innehåll |
|------------|----------|
| `children_logs` | `action`: `fysiologi` \| `livslogg`, childAlias, observation, category — WORM |

**Export:** JSON per barn (klient). PDF via Dossier (opt-in).

## Beror på

- `core` — PinGate, firestore, UI, auth

## Kopplingar

- **verklighetsvalvet** — explicit bro vid incident (sourceRef)
- **dossier** — opt-in aggregering
- **dagbok** — ingen auto-koppling

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `children_logs` — allt du sparar ska finnas kvar |
| **RAG / chatt** | Nej — Valv-Chat och Kunskap söker **inte** här |
| **PDF / samlad export** | Dossier (valfri period); JSON balans = kort fönster |
| **Planerat** | Frågor i naturligt språk (Mönster-Arkivarien, ej Valv-Chat) |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/family/children.md)
- [Barnen-SPEC](../../../docs/specs/modules/Barnen-SPEC.md)

**Kopiera modulen:** denna mapp + länkade kontextfiler ovan räcker för översikt; data exporteras från appen (JSON).
