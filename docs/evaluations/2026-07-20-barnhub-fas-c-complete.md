# Barnhub Fas C — complete

**Datum:** 2026-07-20  
**Status:** BYGGD (lokal) — ej deploy  
**Godkänd av:** Pontus («ok fas c»)

## Leverans

1. **Milstolpar** — lokal Grey Rock/BIFF-checklista + streak (`parentMilestones.ts`)
2. **Mer-panel** — progressive disclosure på Reflektion (`ParentMerPanel`)
3. **Kuratorexport** — avidentifierad JSON/PDF (`exportCuratorChildReport`, Barn 1/2)
4. **Redirect** — `/barnhub` + `/barnhubben` → `/familjen?tab=reflektion`

## Medvetet uppskjutet

- `childAlias`-fältkryptering (egen PMIR)
- Barnen-vektor / Flash i molnet
- Separat Barnhub-produkt

## Smoke

- smoke:child-incident PASS
- smoke:locked-ux PASS
- smoke:cost-guard PASS
- MOD-FAM-INCIDENT · MOD-FAM-HUB · MOD-CORE-NAV re-locked
