# `/oversikt` vs `/dashboard` — eval (Fas 17.5) — 2026-06-15

**Status:** EVAL — ingen kod denna sprint

---

## Nuvarande routes

| Path | Komponent | Roll |
|------|-----------|------|
| `/oversigt` | Redirect / legacy hub | [`AppRoutes.tsx`](../../src/modules/core/routing/AppRoutes.tsx) |
| `/dashboard` | `NewDashboardHubPage` | Aktiv dashboard hub |
| `/` | `HomePage` | Hemkompass (primär ingång) |

---

## Beslut

**Behåll båda** med redirect `/oversikt` → `/dashboard` (redan i AppRoutes). Hem (`/`) förblir primär — dashboard är sekundär analytics-yta.

**Defer:** Full merge av dashboard in i Hem — produktbeslut, inte Fas 17 scope.

---

## Smoke

Nav-smoke via `smoke:locked-ux` + `smoke:superhub` — **PASS**
