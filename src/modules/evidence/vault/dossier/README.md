# dossier

> Sacred Feature — Dossier-Generator. Formell WORM-sammanställning (PDF) för ombud/myndighet.

## Syfte

Aggregerar valv + barnen (+ valfritt journal) utan manuell omskrivning. Kanonisk hash, snapshot WORM, PDF Storage TTL ~24 h.

## Route och ingång

| | |
|---|---|
| **Route** | `/dossier` |
| **AuthGate** | ja + Fyren A |
| **Dock** | ingen ikon |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/DossierPage.tsx` | Wizard: period → källor → granska → generera |
| `api/dossierService.ts` | `generateDossier` callable |
| `utils/dossierCandidates.ts` | Kandidatfiltrering |

**Relaterad export (andra moduler):**

- `verklighetsvalvet/utils/exportVaultRecord.ts` — PDF per valv-post
- `barnens_livsloggar/utils/exportBalansReport.ts` — JSON Balans

## Data

| | |
|---|---|
| **Läser** | `reality_vault`, `children_logs`, opt-in `journal` |
| **Skriver** | `dossier_snapshots` (WORM), PDF i Storage (kortlivad) |

## Beror på

- `core` — auth, Fyren, layout
- `functions/` — pdf-lib PDF-generering

## Kopplingar

- **verklighetsvalvet** — primär beviskälla
- **barnens_livsloggar** — valfri källa
- **dagbok** — opt-in med varning i UI

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `dossier_snapshots` — WORM export-metadata |
| **RAG / chatt** | Nej — aggregerar valda källor |
| **PDF / samlad export** | **Ja** — närmast "hela arkivet + PDF" idag |
| **Planerat** | BBIC-mall, Kunskapskällor opt-in |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/evidence/vault/dossier.md)
- [Dossier-SPEC](../../../docs/specs/modules/Dossier-SPEC.md)
- [p2-flode](../../../docs/specs/p2-flode.md)
