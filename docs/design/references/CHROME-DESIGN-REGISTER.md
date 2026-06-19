# Chrome & hem — designregister (parallella godkända mönster)

**Status:** levande register · uppdateras när Pontus godkänner nytt utan att ersätta tidigare val.

Regeln: **lägg till, radera inte.** Flera chrome-lösningar får coexist — olika zoner/skärmar.

| ID | Namn | Prod / lab | Kanon |
|----|------|------------|--------|
| **H1** | Hem Layout A — Ankare + rutnät | `HomeBrassLayoutA` (Brushed Brass hem) | [HEM-LAYOUT-A-KANON.md](./HEM-LAYOUT-A-KANON.md) |
| **C1** | FloatingDock — mittkompass D1 | `FloatingDock.tsx` | [DOCK-KANON.md](./DOCK-KANON.md) · `.dock-hub-band__center` |
| **C2** | Fyren header-snabbpanel (kompass i header) |  `FyrenHeaderQuickProvider`, `FyrenHeaderQuickToggle` i `FyrenSideQuickDock.tsx`  | Nedfällbar panel under header · andning + 4 genvägar · *Snabbåtkomst dold* · ersätter sidodock + SOS-knapp (2026-06-19) |
| **C3** | Fyren panel + handtag | `FyrenWidgetBar`, `FyrenDockHandle` | [WIDGET-BAR-SPEC.md](../WIDGET-BAR-SPEC.md) |
| **B1** | Brusfiltret supermodul (Variant B lab) | `/dev/theme-lab/brusfiltret-supermodule` | [BRUSFILTRET-MODUL-KANON.md](./BRUSFILTRET-MODUL-KANON.md) |

## Sandbox / historik

| Källa | Innehåll |
|-------|----------|
| [01-home-variants.html](../../design-sandbox/mockups/01-home-variants.html) | Variant **A ★ vinnare** → H1 |
| `docs/design/references/hem-layout-a-prod-ref.png` | Pontus godkänd prod-skärmdump 2026-06-19 |

## Agent MUST

- Implementera **H1** på hem (`/`) när tema = Brushed Brass — inte ersätta med generisk kompass-hub utan produkt-OK.
- Behåll **C1 + C2 + C3** samtidigt i `MainLayout` — C2 toggle i header, C3 längst ned.
- Finjustera placering senare; registrera ändring i respektive kanon, inte wholesale-delete.

## Agent MUST NOT

- Slå ihop H1-rutnät med header-snabbpanel eller ta bort mittkompassen "för enklare dock".
- Ersätta teal Anteckning/Röst-knappar på hem med flytande FAB utan PMIR.
