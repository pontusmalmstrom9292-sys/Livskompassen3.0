# K2 — Meny (Cursor-granskat svar)

**Datum:** 2026-06-06

## Gap-tabell

| Del | Beslut | Skäl |
|-----|--------|------|
| Drawer «Liv och göra» | KEEP | navTruth uppdaterad |
| Liv-launcher + fullsid routes | KEEP | `/mabra`, `/planering`, `/arbetsliv` |
| LivBackLink på undersidor | **KEEP** | Fas 1 — MåBra, Planering, Arbetsliv |
| hubContextBar legacy ?tab= | **MERGE** | Uppdaterad till direktroutes 2026-06-06 |
| GoraHubTabBar → /planering | KEEP | Fas 2 upload |

## Fas 1 levererat

- `LivBackLink.tsx`
- `hubContextBar.ts` synkad med launcher
- `GoraHubTabBar` → `/planering?tab=…`
