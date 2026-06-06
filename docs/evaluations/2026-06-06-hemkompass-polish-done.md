# Hemkompass polish — done (2026-06-06)

**Scope:** Adaptiv Hemkompass (Obsidian Calm 2.0) på `/` och `/vardagen?tab=kompasser`.

## Levererat

| Funktion | Implementation |
|----------|------------------|
| Paralys-Brytaren | `ParalysPanel` embedded → `breakDownResponse` callable |
| Kväll KASAM | `KasamEvening` embedded — 3 steg + broar Speglar/Bevis/MåBra |
| Kompassråd | `KompassradPanel` ovanför check-in-kort |
| Fasväljare | Morgon · Dag · Kväll (fri navigering, SPEC §3) |
| Preset snabbval | `materialEnabled(preset, 'home_snabbval')` |
| CompassModuleStrip | `forcedFlow` → `DashboardPage` → `HomeAdaptiveCompass` |
| Hero städning | Dekorativa pager-dots borttagna |

## Filer

- `src/modules/core/home/HomeAdaptiveCompass.tsx`
- `src/modules/core/home/homeCompassPhase.ts`
- `src/modules/core/lifeOs/lifeHubPresets.ts`
- `src/modules/features/.../ParalysPanel.tsx` (`embedded`)
- `src/modules/features/.../KasamEvening.tsx` (`embedded`)
- `src/modules/features/.../DashboardPage.tsx`

## Smoke

- `npm run smoke:design-modules` — guards ParalysPanel, KasamEvening, KompassradPanel
- `npm run smoke:compass` — backend Paralys + checkins
- `npm run smoke:locked-ux` — oförändrat PASS

## USER (valfritt)

1. Öppna `/` — byt fas manuellt, testa «Hjälp mig börja» (dag)
2. Kväll — spara KASAM, kontrollera bro-länkar
