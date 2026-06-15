# Superhub deep — Familj och gränser

**Datum:** 2026-06-01  
**Shell:** `/familj` · **Domän-gate:** [`2026-06-01-superhub-domän-covert-narcissism.md`](2026-06-01-superhub-domän-covert-narcissism.md)

## Mappning

| Legacy | Tab under `/familj` | Default |
|--------|---------------------|---------|
| Familjen reflektion | `?tab=reflektion` | **Ja** (Barnfokus) |
| Livslogg | `?tab=livslogg` | |
| Tillsammans | `?tab=tillsammans` | |
| Barnporten | `?tab=barnporten` | HITL |
| Hamn | `?tab=hamn` | BIFF/bevis |
| Drogfrihet | `?tab=drogfrihet` | |

Redirects: `/familjen`, `/hamn`, `/drogfrihet` → `/familj?tab=…`

## Domän

- Default **reflektion** — barn först, inte konflikt (`FamiljenPage` embedded)
- Hamn separat flik; capture `sourceModule: hamn` → bevis
- Barnporten inkorg → Valv HITL — **ingen** auto-promote

## Diff-scope

- Ny: `src/modules/shell/FamiljShellPage.tsx`
- Ändra: `navTruth.ts`, `AppRoutes.tsx`, `hubTabs.tsx` (`familj` DrawerHubId)
