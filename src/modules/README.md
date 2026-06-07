# Module Map — Livskompassen v2

Function-based frontend under `src/modules/`. **Kanoniska produktmoduler** ligger i `features/`; **core** (shell, navigation, auth) och **shared** (UI, hooks, utils) är plattformslager.

Backend (Cloud Functions): **`functions/`** — 32 callables, se [`docs/GCP-INVENTORY-LATEST.md`](../../docs/GCP-INVENTORY-LATEST.md).

**Arkiv / permanent minne:** [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) · [`Arkiv-SPEC.md`](../../docs/specs/modules/Arkiv-SPEC.md)

**Register:** [`docs/MODUL-FUNKTIONS-REGISTER.md`](../../docs/MODUL-FUNKTIONS-REGISTER.md)

## Mappstruktur (2026-06-06 — features-first)

```
src/modules/
├── core/                 # App shell, routing, navigation registry, auth
├── shared/               # Button, Card, BentoCard, hooks, dateHelpers
├── shell/                # LivShellPage, FamiljShellPage, LivLauncherPage
├── capture/              # Inkast / capture flows
├── inkast/               # Inkast UI + inbox review queue
├── valv_ekonomi/         # Valv-side ekonomi-panel (PIN)
├── features/
│   ├── lifeJournal/      # Hjärtat — diary, mirror, evidence (valv, kompis, vaultChat)
│   ├── dailyLife/        # Vardagen — wellbeing, arbetsliv, drogfrihet
│   ├── family/           # Familjen — children, safeHarbor
│   ├── admin/            # Planering, projekt, stämpel
│   ├── widgets/          # Fyren WH1–WH4
│   └── onboarding/       # Barnporten
```

**Inga rot-shims** (`diary/`, `evidence/`, `wellbeing/` m.fl.) — borttagna efter P0/P1. Importera alltid via `@/features/*` eller `@/core` / `@/shared`.

Navigation: [`navigationRegistry.ts`](./core/navigation/navigationRegistry.ts) · [`navTruth.ts`](./core/navigation/navTruth.ts) · [`TAB-REGISTRY.md`](../docs/design/TAB-REGISTRY.md)

## Kluster (hubbar)

| Kluster | Kanonisk route | Feature barrel |
|---------|----------------|----------------|
| **Hjärtat** | `/hjartat` (`?tab=reflektion` \| `?tab=speglar`) | `@/features/lifeJournal` |
| **Valvet** | `/valvet` (`?vaultTab=…`, PIN) | `@/features/lifeJournal/evidence/vault` |
| **Vardagen** | `/vardagen` | `@/features/dailyLife` + `@/shell/LivLauncherPage` |
| **Arbetsliv** | `/arbetsliv` | `@/features/dailyLife/arbetsliv` |
| **Familjen** | `/familjen` | `@/features/family` |
| **MåBra** | `/mabra` | `@/features/dailyLife/wellbeing/mabra` |
| **Planering** | `/planering` | `@/features/admin/planning` |
| **Projekt** | `/projekt` | `@/features/admin/projects` |
| **Barnporten** | `/barnporten` (barn-PWA) | `@/features/onboarding/barnporten` |

Legacy-redirects (behålls): `/dagbok` → `/hjartat` eller `/valvet`; `/liv` → `/vardagen`; `/hamn` → `/familjen?tab=hamn`; `/valv` → `/valvet`.

## Import convention

```tsx
import { BentoCard, formatDateLocal } from '@/shared';
import { VaultPage } from '@/features/lifeJournal/evidence/vault';
import { LivLauncherPage } from '@/modules/shell/LivLauncherPage';
import { BarnensPage } from '@/features/family/children';
import { useStore } from '@/core';
```

Path aliases: `tsconfig.json` + `vite.config.ts` — `@/*`, `@/core`, `@/shared`, `@/features`, `@/types`.

## Moduler (snabbindex)

| Område | README / plan |
|--------|---------------|
| core | [core/README.md](./core/README.md) |
| shared | [shared/README.md](./shared/README.md) |
| lifeJournal / valv | [features/lifeJournal/evidence/vault/README.md](./features/lifeJournal/evidence/vault/README.md) |
| dagbok | [features/lifeJournal/diary/diary/module_plan.md](./features/lifeJournal/diary/diary/module_plan.md) |
| kompasser | [features/dailyLife/wellbeing/compasses/README.md](./features/dailyLife/wellbeing/compasses/README.md) |
| barnen | [features/family/children/README.md](./features/family/children/README.md) |
| barnporten | [features/onboarding/barnporten/module_plan.md](./features/onboarding/barnporten/module_plan.md) |
| planering | [features/admin/planning/module_plan.md](./features/admin/planning/module_plan.md) |

Produktkontext per modul: [`.context/modules/`](../.context/modules/)

## Kopiera en modul

1. Kopiera `src/modules/features/<cluster>/…` + README / `module_plan.md`.
2. Kopiera `.context/modules/…` om produktkontext behövs.
3. Data i Firestore — exportera via appen, inte filsystem.
4. Kräver `core/` + `shared/` (eller mock).
