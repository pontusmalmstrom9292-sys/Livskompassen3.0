# features/

Product modules grouped by **hub cluster**. Each top-level folder has an `index.ts` public barrel.

| Folder | Hub | Barrel export (examples) |
|--------|-----|---------------------------|
| `lifeJournal/` | Hjärtat `/dagbok` | `HjartatPage`, `VaultPage`, `KompisHubPage` |
| `dailyLife/` | Vardagen `/vardagen` | `VardagenPage`, `MabraPage`, `ArbetslivHubPage` |
| `family/` | Familjen `/familjen` | `BarnensPage`, `SafeHarborPage` |
| `admin/` | `/planering`, `/projekt` | `PlaneringPage`, `ProjektHubPage` |
| `widgets/` | `/widget/*` | `WidgetRoutes` |
| `onboarding/` | Barnporten | `BarnportenPage` |

Import: `@/features/<cluster>/…` — see [../README.md](../README.md) migration table.
