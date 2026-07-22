# PMIR — MåBra B1 hub progressive disclosure

**Datum:** 2026-06-19  
**Våg:** Frontend polish B1  
**Scope:** `MabraHubView` — primär pelare + näring, sekundärt i fold

## Beslut

| Alternativ | För | Emot | Rekommendation |
|------------|-----|------|----------------|
| A. VitHub först + näring primär + «Mer»-fold | M3.0-C synlig; samma A2-mönster | En extra fold-nivå | **Ja** |
| B. Full `MabraNutritionPanel` inline | Mer data på hub | Tungt för ADHD-hub | Nej |
| C. Näring endast i pelarkort | Minimal diff | M3.0-C dold | Nej |

## Ändringar

- `MabraNutritionHubPrimary` — snabb logg + länk till full vy
- `MabraVitHub` flyttad före folds
- Daglig mix, Mål, Kurser, Projekt, Historik → `Mer på hubben` fold
- Low-energy: VitHub + Historik fold endast

## Risk

| Risk | Bedömning |
|------|-----------|
| Locked UX (hybrid-8) | Låg — pelare kvar |
| Nutrition cloud sync | Oförändrad — QuickLog + full vy |
| PMIR-stopp | Ej triggad |

## Verifiering

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
```

## Deploy

`firebase deploy --only hosting` efter merge.
