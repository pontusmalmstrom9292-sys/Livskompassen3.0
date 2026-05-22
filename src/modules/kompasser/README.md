# kompasser

> De 3 Kompasserna — dygnsrytm (morgon/dag/kväll), ett mikrosteg i taget.

## Syfte

ADHD/GAD-stöd: Morgon (intention), Dag (puls + Paralys-Brytaren), Kväll (KASAM + crazymaking-bro). **Skriver inte** auto till Valv.

## Route och ingång

| | |
|---|---|
| **Route** | `/vardagen` (kompasser-flik) |
| **Redirect** | `/kompasser` → `/vardagen` |
| **AuthGate** | ja |
| **Dock** | Sprout |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/VardagenPage.tsx` | Vardagen + Kunskap-flikar |
| `components/DashboardPage.tsx` | Kompasser-orkestrator |
| `components/ParalysPanel.tsx` | Paralys-Brytaren |
| `components/KasamEvening.tsx` | Kväll KASAM 3 steg |
| `api/compassService.ts` | `saveCheckIn`, `breakDownResponse` |
| `utils/compassTime.ts` | Tids-default vid öppning |

## Data

| Collection | Innehåll |
|------------|----------|
| `checkins` | WORM — morgon/dag/kväll, `taskNote` för KASAM JSON |

## Beror på

- `core` — layout, auth, UI
- `functions/` — Paralys callable

## Kopplingar

- **kompis** — Kunskap-flik i Vardagen
- **speglings_system**, **verklighetsvalvet**, **mabra**, **barnens_livsloggar** — crazymaking-broar
- **dagbok** — skild (ingen auto-write)

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `checkins` — WORM |
| **RAG / chatt** | Nej |
| **PDF / samlad export** | — |
| **Planerat** | opt-in sammanfattning → `kampspar` |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/kompasser.md)
- [De-3-Kompasserna-SPEC](../../../docs/specs/modules/De-3-Kompasserna-SPEC.md)

**Smoke:** `npm run smoke:compass`
