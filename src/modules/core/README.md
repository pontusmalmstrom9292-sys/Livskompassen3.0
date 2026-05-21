# core

> App-shell: layout, auth, Firebase-init, design tokens, delad UI och Zero Footprint.

## Syfte

Delad infrastruktur för alla feature-moduler — inte en produktmodul i sig. Innehåller `MainLayout`, `FloatingDock`, `AuthGate`, Firebase, Zustand-store, Obsidian Calm-komponenter och Kill Switch.

## Route och ingång

Ingen egen route. Wrappar hela appen via `MainLayout` och `AuthGate`.

| Ingång | Beteende |
|--------|----------|
| Fyren (3s long-press BookOpen) | WebAuthn → PIN → valv |
| Shake-to-Kill | Global nödutloggning (15 m/s²) |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `layout/MainLayout.tsx` | App shell, header, Kompis |
| `layout/FloatingDock.tsx` | Bottennavigation |
| `auth/AuthGate.tsx` | Skyddade routes |
| `auth/useZeroFootprint.ts` | RAM-rensning vid utloggning |
| `firebase/init.ts` | Firebase + Functions (europe-west1) |
| `firebase/firestore.ts` | Delade WORM-skrivningar (journal, valv, barnen) |
| `ui/` | BentoCard, PinGate, tokens, TimelineEntry, … |
| `routing/AppRoutes.tsx` | Route-register |
| `security/killSwitch.ts` | Shake-detektion |

## Data

Skriver/läser via delade helpers — inga egna collections. Se `types/firestore.ts`.

## Beror på

Externa: Firebase SDK, React Router, Zustand.

## Kopplingar

Alla moduler importerar från `core` (t.ex. `import { BentoCard } from '../core'`).

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | delade WORM helpers — inga egna collections |
| **RAG / chatt** | Nej |
| **PDF / samlad export** | — |
| **Planerat** | Zero Footprint + Kill Switch skyddar allt minne i RAM |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/core.md)
- [Core-SPEC](../../../docs/specs/incoming/Core-SPEC.md)
- [navigation-master](../../../docs/specs/navigation-master.md)
