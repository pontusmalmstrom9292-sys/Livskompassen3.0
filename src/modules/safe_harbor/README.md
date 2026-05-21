# safe_harbor

> Sacred Feature — Hamn. BIFF + Grey Rock för ex-kommunikation utan JADE.

## Syfte

Känslomässig brandvägg: Brusfilter → BIFF-svar. Kognitiv avlastning vid högkonflikt. Zero Footprint i UI (inget sparas utan explicit val).

## Route och ingång

| | |
|---|---|
| **Route** | `/hamn` |
| **AuthGate** | ja |
| **Dock** | Anchor |
| **Bro** | `/speglar` med `prefilledMessage` |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/SafeHarborPage.tsx` | Textarea, generera, kopiera |
| `api/biffService.ts` | `analyzeMessage` + `extractGreyRockReply` |

## Data

| Lagring | Standard |
|---------|----------|
| Hamn UI | Zero Footprint — inget sparas |
| "Spara som bevis" | `reality_vault` (`action: hamn_biff`), WORM |

**Callable:** `analyzeMessage` (KompisSupervisor + DCAP)

## Beror på

- `core` — layout, auth
- `functions/` — BIFF/Brusfilter-agenter

## Kopplingar

- **speglings_system** — bro vid gaslighting
- **verklighetsvalvet** — valfri WORM-export

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | Zero Footprint UI; valfri → `reality_vault` |
| **RAG / chatt** | Nej |
| **PDF / samlad export** | — |
| **Planerat** | — |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/safe_harbor.md)
- [SafeHarbor-SPEC](../../../docs/specs/incoming/SafeHarbor-SPEC.md)
