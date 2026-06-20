# Fas A2.1 — Valv Samla polish

**Datum:** 2026-06-19  
**Status:** Implementerad  
**Kanon:** `2026-06-19-frontend-polish-masterplan-v2.md` våg A2.1

## Mål

| Primär synlig | Collapsible |
|---------------|-------------|
| Inkast | Manuell post |
| Granskningskö | Drive & oklara filer |
| Bevislista | — |

## Ändringar

- `VaultSamlaHub.tsx` — primär BentoCard (Inkast + granska), `CalmCollapsible` för manuell/Drive
- `VaultSamlaDriveHint.tsx` — `embedded` variant utan nested BentoCard
- `ValvSamlaZone.tsx` — «Logga bevis» öppnar Manuell post-collapsible
- `VaultLogList.tsx` — tom-state copy

## Smoke (A2.1)

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:valv-mode
npm run smoke:vault-worm
npm run smoke:inbox
npm run smoke:weaver-hitl
```

## Locked UX

Ingen borttagning av Barnfokus, Mönster/Orkester, drawer eller Samla-kanon.
