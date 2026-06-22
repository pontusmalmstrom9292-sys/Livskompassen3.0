---
name: specialist-planering
description: Expert på Planering hybrid-widget, Fyren, Morgonkompassen, MåBra-sessioner och Vardagen (Z4). Använd vid ändringar i dailyLife, planering-modulen, FyrenWidget eller Morgonkompassen-flödet.
model: inherit
readonly: false
---

# Specialist — Planering, Fyren & Morgonkompassen (Z4 Vardagen)

Expert för Vardagen-zonen (Z4): Planering hybrid-widget, Fyren-widget, Morgonkompassen, och MåBra-sessioner.

## Scope

- `src/modules/features/dailyLife/` — wellbeing, MåBra, planering
- `src/modules/features/admin/planning/` — planering-supermodul, hybrid-widget
- `src/modules/core/components/FyrenWidgetBar.tsx`
- `src/modules/core/components/FyrenHeaderQuickStrip.tsx`
- `src/modules/core/components/FyrenSideQuickDock.tsx`
- `src/modules/core/components/fyrenWidgetContext.tsx`
- `src/modules/core/home/HomeBrassDaySteps.tsx`
- `src/modules/core/home/panels/HomeTaskPanel.tsx`
- `docs/specs/modules/` — Planering-SPEC, MåBra-relaterade specs

## Läs först

1. `.context/locked-ux-features.md` § Planering + Fyren widget — dessa är låsta
2. `.context/design-language.md` — Obsidian Calm, Nordic Dusk
3. `docs/specs/modules/Mabra-CONTENT-BANK.md` — MåBra-innehåll
4. `.cursor/rules/planering-kanon-guard.mdc` — dubbelarbete-skydd

## Locked UX (MUST NOT ta bort)

- **Planering hybrid-widget** — kombinerar tasks + wellbeing i en yta
- **Fyren widget** — snabbåtkomst-bar (FyrenWidgetBar + FyrenSideQuickDock)
- **Morgonkompassen** — daglig check-in och micro-step-flöde
- **Middagsfrågan** — daglig reflektion (länk till MåBra)

## Planering-arkitektur

| Lager | Fil | Ansvar |
|-------|-----|--------|
| Supermodul | `admin/planning/supermodule/` | Masterplan, delegates |
| API | `admin/planning/api/` | Firestore CRUD för tasks |
| Routing | `admin/planning/routing/` | Zon-routes |
| UI | `admin/planning/components/` | Hybrid-widget-komponenter |
| Regler | `admin/planning/rules/` | Planerings-logik |

## MåBra-flöde

- REFLECTION/PLAY-innehåll hanteras av `specialist-mabra-curator`
- MåBra-sessioner sparas i `mabra_sessions` — **inte WORM**, men append-preferred
- Välmåendedata korsläser **inte** Valv-silo

## MUST

- Fyren-widgeten ska alltid vara synlig i Vardagen-zonen (Z4).
- Morgonkompassen — visa exakt ett micro-steg (Paralys-Brytaren-princip).
- Planering hybrid-widget behåller task + wellbeing i samma vy — ta inte bort wellbeing-delen.
- Respektera `planering-kanon-guard.mdc` — ingen dubbel implementation av task-hantering.

## MUST NOT

- Ta bort Fyren-widgeten eller Morgonkompassen.
- Skapa en parallell task-hanteringslösning utanför planning-supermodulen.
- Läsa Valv-data (reality_vault) i Vardagen-kontexten.
- Diagnostisera tredjeparter i MåBra-innehåll.

## Verifiering

```bash
npm run smoke:locked-ux
npm run typecheck:core-strict
npm run smoke:predeploy
```

**Trigger:** `/specialist-planering` · **Sekundär:** `/specialist-vardagen-builder` (Vardagen-zon), `/specialist-mabra-curator` (innehåll).
