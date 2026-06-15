# Superhub deep — Liv och göra

**Datum:** 2026-06-01  
**Shell:** `/liv` · **Domän-gate:** [`2026-06-01-superhub-domän-covert-narcissism.md`](2026-06-01-superhub-domän-covert-narcissism.md)

## Mappning

| Legacy hub | Tab under `/liv` | Redirect |
|------------|------------------|----------|
| Vardagen | `?tab=kompasser` | `/vardagen` → `/liv?tab=kompasser` |
| MåBra | `?tab=mabra` | `/mabra` → `/liv?tab=mabra` |
| Planering/Göra | `?tab=handling` | `/planering` → `/liv?tab=handling` |
| Arbetsliv | `?tab=arbetsliv` | `/arbetsliv` → `/liv?tab=arbetsliv` |

## Domän

- MåBra: ex/konflikt redirectas till Speglar (`mabraCoachGuard`) — **inte** Hamn här
- Planering P3 Kanban på `handling` — **låst**
- Capture: planering inkorg dual-write enligt wire-capture

## Diff-scope

- Ny: `src/modules/shell/LivShellPage.tsx`
- Ändra: `navTruth.ts` (liv parent + children), `AppRoutes.tsx`, `hubTabs.tsx` (`liv` DrawerHubId)
