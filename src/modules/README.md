# Module Map — Livskompassen v2

Function-based frontend modules under `src/modules/`. Varje modul har en **README** (ingång), **module_plan.md** (implementation) och ofta motsvarande fil i `.context/modules/`.

Delad infrastruktur: **`core/`**. Backend (Cloud Functions, Agent Cards): **`functions/`** — anropas via Firebase callables från modulernas `api/`.

**Hela arkivet / permanent minne:** [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) · [`Arkiv-SPEC.md`](../../docs/specs/modules/Arkiv-SPEC.md) · live GCP [`GCP-INVENTORY-LATEST.md`](../../docs/GCP-INVENTORY-LATEST.md)

**Sammanställd register (Del B):** [`docs/MODUL-FUNKTIONS-REGISTER.md`](../../docs/MODUL-FUNKTIONS-REGISTER.md)

## Mappstruktur (2026-05-28)

```
src/modules/
├── core/
├── evidence/           ← Valv + Kunskap + Valv-chatt
│   ├── vault/         (verklighetsvalvet + dossier)
│   ├── knowledge/     (Valv-panel)
│   ├── kompis/        (Kunskapsbank + RAG)
│   └── vaultChat/
├── diary/             ← Dagbok + Speglar
│   ├── diary/
│   └── mirror/
├── wellbeing/         ← MåBra + Kompasser
│   ├── mabra/
│   ├── compasses/
│   └── economy/       (Vardagen-flik ekonomi)
├── admin/             ← Planering + Projekt
│   ├── planning/
│   ├── projects/
│   └── stampla/
├── family/
│   ├── children/
│   └── safeHarbor/    (Trygg hamn `/hamn`)
├── shared/            (README — tom tills behov)
└── (rot)              ← arbetsliv, drogfrihet, inkast, widgets, legacy-shims
```

Legacy-import: använd kanoniska klusterpaths (`evidence/vault`, `diary/diary`, …). Rot-shims borttagna 2026-05-28.

Flikar: [`tabRegistry.ts`](./core/navigation/tabRegistry.ts) · [`TAB-REGISTRY.md`](../docs/design/TAB-REGISTRY.md) · [`navTruth.ts`](./core/navigation/navTruth.ts).

## Moduler (index)

| Modul | Route | README | Kontext |
|-------|-------|--------|---------|
| **core** | (app-shell) | [core/README.md](./core/README.md) | [.context/modules/core.md](../../.context/modules/core.md) |
| **kompis** | Valv `kunskapsbank` (`/dagbok?tab=bevis&vaultTab=kunskapsbank`) | [kompis/README.md](./evidence/kompis/README.md) | [kompis.md](../../.context/modules/evidence/kompis.md) |
| **verklighetsvalvet** | `/dagbok?tab=bevis` | [verklighetsvalvet/README.md](./evidence/vault/README.md) | [verklighetsvalvet.md](../../.context/modules/evidence/vault.md) |
| **valv_chatt** | Bevis → Sök-flik | [valv_chatt/README.md](./evidence/vaultChat/README.md) | [valv_chatt.md](../../.context/modules/evidence/vaultChat.md) |
| **valv_ekonomi** | Valv → Forensik | (paneler) | — |
| **kompasser** | `/vardagen` | [kompasser/README.md](./wellbeing/compasses/README.md) | [kompasser.md](../../.context/modules/wellbeing/compasses.md) |
| **safe_harbor** | `/hamn` | [safe_harbor/README.md](./family/safeHarbor/README.md) | [safe_harbor.md](../../.context/modules/family/safeHarbor.md) |
| **ekonomi** | `/vardagen?tab=ekonomi` | [ekonomi/README.md](./wellbeing/economy/README.md) | [ekonomi.md](../../.context/modules/wellbeing/economy.md) |
| **dagbok** | `/dagbok` | [dagbok/README.md](./diary/diary/README.md) | [dagbokshubben.md](../../.context/modules/diary/diaryshubben.md) |
| **speglings_system** | `/dagbok?tab=speglar` | [speglings_system/README.md](./diary/mirror/README.md) | [speglingssystemet.md](../../.context/modules/speglingssystemet.md) |
| **barnens_livsloggar** | `/familjen` | [barnens_livsloggar/README.md](./family/children/README.md) | [barnens_livsloggar.md](../../.context/modules/family/children.md) |
| **mabra** | `/mabra` | [wellbeing/mabra/README.md](./wellbeing/mabra/README.md) | [mabra_sidan.md](../../.context/modules/wellbeing/mabra_sidan.md) |
| **drogfrihet** | `/drogfrihet` | — | — |
| **planering** | `/planering` | [planering/module_plan.md](./admin/planning/module_plan.md) | — |
| **projekt** | `/projekt` | [projekt/components/ProjektHubPage.tsx](./admin/projects/components/ProjektHubPage.tsx) | — |
| **arbetsliv** | `/arbetsliv` | [arbetsliv/module_plan.md](./arbetsliv/module_plan.md) | — |
| **stampla** | `/arbetsliv?tab=stampla` | [stampla/module_plan.md](./admin/stampla/module_plan.md) | — |
| **inkast** | Hem `#inkast-lite` | `inkast/` | — |
| **barnporten** | (PWA plan) | [barnporten/module_plan.md](./barnporten/module_plan.md) | agents: `barnportenAgents.ts` |
| **widgets** | `/widget/*` | `src/modules/widgets/` | WH1 i core/Fyren |
| **dossier** | `/dossier` | [evidence/vault/dossier/README.md](./evidence/vault/dossier/README.md) | [dossier.md](../../.context/modules/evidence/vault/dossier.md) |

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
import { KompisAvatar, KnowledgeVaultChat } from './modules/evidence/kompis';
import { VaultPage } from './modules/evidence/vault';
```

## Backend (not in src/modules)

Cloud Functions, Agent Cards, and DCAP live in `functions/` — frontend modules call them via Firebase callable functions (e.g. `evidence/kompis/api/`, `family/safeHarbor/api/biffService.ts`).
