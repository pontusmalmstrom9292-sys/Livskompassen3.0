# Module Map — Livskompassen v2

Function-based frontend modules under `src/modules/`. Varje modul har en **README** (ingång), **module_plan.md** (implementation) och ofta motsvarande fil i `.context/modules/`.

Delad infrastruktur: **`core/`**. Backend (Cloud Functions, Agent Cards): **`functions/`** — anropas via Firebase callables från modulernas `api/`.

**Hela arkivet / permanent minne:** [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) · [`Arkiv-SPEC.md`](../../docs/specs/modules/Arkiv-SPEC.md) · live GCP [`GCP-INVENTORY-LATEST.md`](../../docs/GCP-INVENTORY-LATEST.md)

**Sammanställd register (Del B):** [`docs/MODUL-FUNKTIONS-REGISTER.md`](../../docs/MODUL-FUNKTIONS-REGISTER.md)

## Logisk modulcluster (målbild — fysiska mappar platta tills path-alias)

| Kluster | Moduler (`src/modules/`) |
|---------|--------------------------|
| **loggar** | `dagbok`, `barnens_livsloggar`, `inkast` |
| **valv** | `verklighetsvalvet`, `valv_chatt`, `valv_ekonomi`, `dossier` |
| **vardag** | `kompasser`, `ekonomi`, `mabra` |
| **livsstod** | `safe_harbor`, `drogfrihet` |
| **livsos** | `planering`, `projekt`, `arbetsliv`, `stampla` |
| **övrigt** | `core`, `kompis`, `speglings_system`, `widgets`, `barnporten` |

Flikar i hubbar härleds från [`navTruth.ts`](./core/navigation/navTruth.ts) via [`hubTabs.tsx`](./core/navigation/hubTabs.tsx) + [`useHubTab`](./core/navigation/hooks/useHubTab.ts) (synkad `?tab=` med drawer).

## Moduler (index)

| Modul | Route | README | Kontext |
|-------|-------|--------|---------|
| **core** | (app-shell) | [core/README.md](./core/README.md) | [.context/modules/core.md](../../.context/modules/core.md) |
| **kompis** | Valv `kunskapsbank` (`/dagbok?tab=bevis&vaultTab=kunskapsbank`) | [kompis/README.md](./kompis/README.md) | [kompis.md](../../.context/modules/kompis.md) |
| **verklighetsvalvet** | `/dagbok?tab=bevis` | [verklighetsvalvet/README.md](./verklighetsvalvet/README.md) | [verklighetsvalvet.md](../../.context/modules/verklighetsvalvet.md) |
| **valv_chatt** | Bevis → Sök-flik | [valv_chatt/README.md](./valv_chatt/README.md) | [valv_chatt.md](../../.context/modules/valv_chatt.md) |
| **valv_ekonomi** | Valv → Forensik | (paneler) | — |
| **kompasser** | `/vardagen` | [kompasser/README.md](./kompasser/README.md) | [kompasser.md](../../.context/modules/kompasser.md) |
| **safe_harbor** | `/hamn` | [safe_harbor/README.md](./safe_harbor/README.md) | [safe_harbor.md](../../.context/modules/safe_harbor.md) |
| **ekonomi** | `/vardagen?tab=ekonomi` | [ekonomi/README.md](./ekonomi/README.md) | [ekonomi.md](../../.context/modules/ekonomi.md) |
| **dagbok** | `/dagbok` | [dagbok/README.md](./dagbok/README.md) | [dagbokshubben.md](../../.context/modules/dagbokshubben.md) |
| **speglings_system** | `/dagbok?tab=speglar` | [speglings_system/README.md](./speglings_system/README.md) | [speglingssystemet.md](../../.context/modules/speglingssystemet.md) |
| **barnens_livsloggar** | `/familjen` | [barnens_livsloggar/README.md](./barnens_livsloggar/README.md) | [barnens_livsloggar.md](../../.context/modules/barnens_livsloggar.md) |
| **mabra** | `/mabra` | [mabra/README.md](./mabra/README.md) | [mabra_sidan.md](../../.context/modules/mabra_sidan.md) |
| **drogfrihet** | `/drogfrihet` | — | — |
| **planering** | `/planering` | [planering/module_plan.md](./planering/module_plan.md) | — |
| **projekt** | `/projekt` | [projekt/components/ProjektHubPage.tsx](./projekt/components/ProjektHubPage.tsx) | — |
| **arbetsliv** | `/arbetsliv` | [arbetsliv/module_plan.md](./arbetsliv/module_plan.md) | — |
| **stampla** | `/arbetsliv?tab=stampla` | [stampla/module_plan.md](./stampla/module_plan.md) | — |
| **inkast** | Hem `#inkast-lite` | `inkast/` | — |
| **barnporten** | (PWA plan) | [barnporten/module_plan.md](./barnporten/module_plan.md) | agents: `barnportenAgents.ts` |
| **widgets** | `/widget/*` | `src/modules/widgets/` | WH1 i core/Fyren |
| **dossier** | `/dossier` | [dossier/README.md](./dossier/README.md) | [dossier.md](../../.context/modules/dossier.md) |

## Kluster (navigation)

| Kluster | Moduler |
|---------|---------|
| **Hjärtat** (`/dagbok`) | dagbok, verklighetsvalvet, speglings_system, valv_chatt |
| **Vardagen** (`/vardagen`) | kompasser, ekonomi |
| **Familjen** (`/familjen`) | barnens_livsloggar |

## Kopiera en modul till annat program

1. Kopiera hela mappen under `src/modules/<namn>/` (inkl. denna README + `module_plan.md`).
2. Kopiera motsvarande `.context/modules/<namn>.md` om du behöver produkt-/säkerhetskontext.
3. **Data** (loggar, bevis) ligger i Firestore — exportera via appen (t.ex. JSON/PDF), inte via filsystemet.
4. Modulkod **beror på** `core/` — fristående körning kräver core eller mock.

## Import convention

```tsx
import { MainLayout, BentoCard, useStore } from './modules/core';
import { KompisAvatar, KnowledgeVaultChat } from './modules/kompis';
import { VaultPage } from './modules/verklighetsvalvet';
```

## Backend (not in src/modules)

Cloud Functions, Agent Cards, and DCAP live in `functions/` — frontend modules call them via Firebase callable functions (e.g. `kompis/api/`, `safe_harbor/api/biffService.ts`).
