# Unlock — Hel-app revisionsplan Batch D

**Datum:** 2026-07-20  
**Godkänd av:** Pontus (explicit: implementera hel-app revisionsplan FAS 2)  
approved: yes

## Syfte

Lågrisk stabilitet/a11y-fixar från revisionsplanen Batch D:
- Speech recognition cleanup (Inkast/capture)
- MåBra: goal confirm error handling + Suspense/catch-all routes
- Dagbok: route catch-all
- Planering/Arbetsliv/Barnporten: Suspense skeleton (inte null)
- Familjen/Dagbok burn: timer cleanup

## Moduler

| ID | Status före | Status under arbete |
|----|-------------|---------------------|
| MOD-VALV-INKAST | locked | developing |
| MOD-VARD-MABRA | locked | developing |
| MOD-HJ-INPUT | locked | developing |
| MOD-HJ-DAGBOK | locked | developing |
| MOD-VARD-PLAN | locked | developing |
| MOD-VARD-ARB | locked | developing |
| MOD-FAM-BPORT | locked | developing |
| MOD-FAM-HUB | locked | developing |
| MOD-FAM-BARN | locked | developing |

## MUST NOT

- Ändra Locked UX-beteende (Barnfokus, Valv Mönster/Orkester, dock)
- Arkitektur/WORM/silos

## Re-lock

Efter grön smoke per modul: `node scripts/lock_module.mjs MOD-XXX --smoke …`
