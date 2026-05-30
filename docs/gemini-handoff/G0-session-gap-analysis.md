# G0 — Gemini session: gap-analys (2026-05-30)

Källa: Gemini full session → integrerad i Cursor.

## Gap vs kod (verifierat)

| Komponent | Gemini | Verklighet | Cursor-åtgärd |
|-----------|--------|------------|---------------|
| `NavigationDrawer.tsx` | Har `<DrawerQuickActions />` | **Fel** — monteras inte (smoke:locked-ux) | Ingen ändring |
| `CompassHubOrb.tsx` | Synlig text Hjärtat/Kompass | **Stämde** | Synlig etikett borttagen — endast `aria-label` |
| `DrawerHubAccordion.tsx` | Guld aktiv rad | **KEEP** | CSS låst till `#d4af37` |

## M1 — drawer L2

- SVG i `public/icons/drawer-l2/` + `docs/gemini-handoff/M1-drawer-icons/`
- Prod: `createDrawerL2Icon()` i `drawerNav.ts`

## M2 — Valv copy

| groupId | Gemini | Integrerat |
|---------|--------|------------|
| `valv_grp_samla` | KEEP hint | Ja — `navTruth.ts` |
| `valv_grp_analysera` | KEEP hint | Ja — `navTruth.ts` |
| `valv_grp_kunskap` | DEFER label Fakta | **Nej** — behåller Kunskapsbank |
| `valv_grp_exportera` | REJECT label Dossier | **Nej** — behåller Exportera |
| `valv_grp_forensik` | DEFER label Arkiv | **Nej** — behåller Forensik |

Se [`M2-valv-drawer-copy.md`](./M2-valv-drawer-copy.md).
