# Module Map — Livskompassen v2

Function-based frontend under `src/modules/`. **Kanoniska produktmoduler** ligger i `features/`; **core** (shell, navigation, auth) och **shared** (UI, hooks, utils) är plattformslager.

Backend (Cloud Functions): **`functions/`** — anropas via Firebase callables.

**Arkiv / permanent minne:** [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) · [`Arkiv-SPEC.md`](../../docs/specs/modules/Arkiv-SPEC.md)

**Register:** [`docs/MODUL-FUNKTIONS-REGISTER.md`](../../docs/MODUL-FUNKTIONS-REGISTER.md)

## Mappstruktur (2026-06-01 — refactor)

```
src/modules/
├── core/                 # App shell, routing, navigation registry, auth
├── shared/               # Button, Card, BentoCard, hooks, dateHelpers
├── shell/                # LivShellPage, FamiljShellPage
├── capture/              # Inkast / capture flows
├── features/
│   ├── lifeJournal/      # Hjärtat — diary, evidence (valv, kompis, vaultChat)
│   ├── dailyLife/        # Vardagen — wellbeing, arbetsliv, drogfrihet
│   ├── family/           # Familjen — children, safeHarbor
│   ├── admin/            # Planering, projekt, stämpel
│   ├── widgets/          # Fyren WH1–WH4
│   └── onboarding/       # Barnporten
├── inkast/, valv_ekonomi/  # (kvar vid rot tills vidare flytt)
└── (legacy shims)        # diary/, evidence/, wellbeing/, … → @/features/*
```

Navigation: [`navigationRegistry.ts`](./core/navigation/navigationRegistry.ts) · [`navTruth.ts`](./core/navigation/navTruth.ts) · [`TAB-REGISTRY.md`](../docs/design/TAB-REGISTRY.md)

## Kluster (hubbar)

| Kluster | Route | Feature barrel |
|---------|-------|------------------|
| **Hjärtat** | `/dagbok` | `@/features/lifeJournal` |
| **Vardagen** | `/vardagen` | `@/features/dailyLife` |
| **Familjen** | `/familjen` | `@/features/family` |

## Import convention (ny)

```tsx
import { BentoCard, formatDateLocal } from '@/shared';
import { VaultPage } from '@/features/lifeJournal/evidence/vault';
import { VardagenPage } from '@/features/dailyLife/wellbeing/compasses';
import { BarnensPage } from '@/features/family/children';
import { useStore } from '@/core';
```

Path aliases: `tsconfig.json` + `vite.config.ts` — `@/*`, `@/core`, `@/shared`, `@/features`, `@/types`.

## Migration (legacy → features)

| Gammal import | Ny import |
|---------------|-----------|
| `@/modules/evidence/vault` | `@/features/lifeJournal/evidence/vault` |
| `@/modules/diary/diary` | `@/features/lifeJournal/diary/diary` |
| `@/modules/wellbeing/compasses` | `@/features/dailyLife/wellbeing/compasses` |
| `@/modules/family/children` | `@/features/family/children` |
| `@/modules/admin/planning` | `@/features/admin/planning` |
| `modules/core/ui/BentoCard` | `@/shared/ui/BentoCard` |

Rot-shims (`src/modules/diary/index.ts`, m.fl.) finns kvar med `@deprecated` tills alla call sites är migrerade.

## Moduler (snabbindex)

| Område | README |
|--------|--------|
| core | [core/README.md](./core/README.md) |
| shared | [shared/README.md](./shared/README.md) |
| lifeJournal / valv | [features/lifeJournal/evidence/vault/README.md](./features/lifeJournal/evidence/vault/README.md) |
| dagbok | [features/lifeJournal/diary/diary/README.md](./features/lifeJournal/diary/diary/README.md) *(om finns)* |
| kompasser | [features/dailyLife/wellbeing/compasses/README.md](./features/dailyLife/wellbeing/compasses/README.md) |
| barnen | [features/family/children/README.md](./features/family/children/README.md) |
| planering | [features/admin/planning/module_plan.md](./features/admin/planning/module_plan.md) |

## Kopiera en modul

1. Kopiera `src/modules/features/<cluster>/…` + README / `module_plan.md`.
2. Kopiera `.context/modules/…` om produktkontext behövs.
3. Data i Firestore — exportera via appen, inte filsystem.
4. Kräver `core/` + `shared/` (eller mock).
