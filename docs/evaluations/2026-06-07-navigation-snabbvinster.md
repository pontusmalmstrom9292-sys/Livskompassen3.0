# Navigations-snabbvinster — done (2026-06-07)

**Scope:** Klickbar Kompis → Valv Kunskapsbank, TabBar-synk (zon-getters), drawer «Senast besökt». Ingen ny backend · ingen publik Kunskap-route.

## Levererat

| Punkt | Implementation |
|-------|----------------|
| **A — Kompis kort tryck** | `KompisHeaderVaultButton` → `valvetNavigateTarget('kunskapsbank')`. Låst = `VaultLockedGate` (PIN/Fyren). 3s håll oförändrat (`openValvViaFyren`). |
| **B — Valv TabBar** | Zon-TabBar + zon-specifika getters (`getSamlaVaultTabBarItems` …) — samma ordning som `getMainVaultTabBarItems` / drawer Pansaret. Smoke utökad med `getMainVaultTabBarItems`. |
| **C — Senast besökt** | `drawerRecentNav.ts` + `useDrawerRecentNav` — max 3, `sessionStorage`, rad i `NavigationDrawer`. |

## Filer

- `src/modules/core/components/KompisHeaderVaultButton.tsx`
- `src/modules/core/layout/MainLayout.tsx`
- `src/modules/core/navigation/drawerRecentNav.ts`
- `src/modules/core/navigation/hooks/useDrawerRecentNav.ts`
- `src/modules/core/layout/NavigationDrawer.tsx`
- `scripts/smoke_locked_ux.mjs`

## Smoke

- `npm run build`
- `npm run smoke:locked-ux`
- `npm run smoke:design-modules`

## MUST NOT (bevarat)

- Long-press 3s → Valv (Sacred)
- Mönster / Orkester / Kunskapsbank / Aktörskarta oförändrade
- Ingen `/kunskap` publik RAG — kort tryck går till `/valvet?vaultTab=kunskapsbank`

## USER (Motorola)

1. **Valv låst:** Kort tryck Kompis-öga → ser upplåsningsprompt (inte publik kunskap)
2. **Valv upplåst (3s håll först):** Kort tryck → Kunskapsbank direkt
3. **Drawer:** Besök 2–3 sidor → öppna meny → «Senast besökt» visar piller
