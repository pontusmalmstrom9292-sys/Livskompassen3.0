# Frontend GAP — 2026-06-26

**Plattform:** Cursor Agent · **Scope:** `src/`

## Sammanfattning

Produktions-UI lever i `src/modules/` med 3-zonsystem. Legacy-yta i `src/components/` och orphan `features/diary/` (ersatt av `lifeJournal/diary/`).

## Orphan (arkiv våg 2)

| Target | Signal |
|--------|--------|
| `src/modules/features/diary/` | Zero app-imports |
| `src/modules/features/economy/EconomyDashboard.tsx` | Inga importers |
| `src/components/LayoutShell.tsx`, `VaultOverview.tsx` | Self-only |
| `src/main.tsx.bak` | Skräp — radera |

## Smoke

`npm run smoke:locked-ux && npm run smoke:design-modules && npm run build`
