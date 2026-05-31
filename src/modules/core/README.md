# core

> App-shell: layout, auth, Firebase-init, design tokens, delad UI och Draft Layer.

## Syfte

Delad infrastruktur för alla feature-moduler — inte en produktmodul i sig. Innehåller `MainLayout`, `FloatingDock`, `AuthGate`, Firebase, Zustand-store, Obsidian Calm-komponenter och Device Clear.

## Route och ingång

Ingen egen route. Wrappar hela appen via `MainLayout` och `AuthGate`.

| Ingång | Beteende |
|--------|----------|
| Fyren (3s long-press BookOpen) | WebAuthn → PIN → valv |
| Inställningar → Rensa enheten | `clearDeviceSession` — lokal rensning (ersätter Kill Switch) |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `layout/MainLayout.tsx` | App shell, header, Kompis |
| `layout/FloatingDock.tsx` | Bottennavigation |
| `auth/AuthGate.tsx` | Skyddade routes |
| `auth/useZeroFootprint.ts` | Valv idle timeout (1 h) |
| `firebase/init.ts` | Firebase + Functions (europe-west1) |
| `firebase/firestore.ts` | Delade WORM-skrivningar (journal, valv, barnen) |
| `ui/` | BentoCard, PinGate, tokens, TimelineEntry, … |
| `routing/AppRoutes.tsx` | Route-register |
| `security/clearDeviceSession.ts` | Frivillig enhetsrensning |
| `security/ClearDevicePanel.tsx` | Inställningar UI |

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
| **Lokal session** | Draft Layer (IndexedDB) + Device Clear |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/core.md)
- [Core-SPEC](../../../docs/specs/modules/Core-SPEC.md)
- [navigation-master](../../../docs/specs/navigation-master.md)
