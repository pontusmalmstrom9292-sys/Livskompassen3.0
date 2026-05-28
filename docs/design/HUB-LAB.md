# Hub Lab — planeringshubbar

**Preview:** http://localhost:5173/dev/hub-lab  
**Prod-väljare:** http://localhost:5173/planering (överst när du är på hub)

## Åtta hubbar

| ID | Namn | Stil | Verktyg (urval) |
|----|------|------|-----------------|
| `verktygslada` | Verktygslåda | grid | inköp, handling, fokus, inkorg, projekt |
| `kompakt` | Kompakt | list | 8 moduler i tät lista |
| `bento-studio` | Bento Studio | bento | handling hero + tid, foton, … |
| `tid-arbete` | Tid & arbete | sections | tidtagning, kalender, handling, ekonomi |
| `foto-minne` | Foto & minne | tiles | foton, projekt, anteckning |
| `minimal-fokus` | Minimal fokus | minimal | fokus, handling, inköp |
| `foralder-vardag` | Förälder vardag | strip | inköp, rutiner, projekt |
| `orbit-guld` | Orbit guld | orbit | handling centrum |

**15 moduler** i katalogen (`planeringHubModules.ts`) — varje hub aktiverar en egen delmängd.

## Kod

| Fil | Roll |
|-----|------|
| `planeringHubLayouts.ts` | Layout-definitioner |
| `planeringHubModules.ts` | Modulkatalog |
| `usePlaneringHubLayout.ts` | localStorage-val |
| `HubLabPage.tsx` | Jämför alla |
| `PlaneringHubLayoutPicker.tsx` | Väljare på /planering |

## Godkännande

Skriv **`GODKÄND: <layout-id>`** i [`theme-lab/VARIANTS.md`](./theme-lab/VARIANTS.md) eller här när en layout ska bli default.
