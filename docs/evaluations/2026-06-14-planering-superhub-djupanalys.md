# Planering — Universal Input Superhub (djupanalys)

**Datum:** 2026-06-14  
**Fas:** 9A (analys) → 9B (router) → 9C (delegater + skuggrutt)  
**Arbetspaket:** W1 (isolera — W2/W3 parallellt)  
**Kanon:** [`PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) § Planering · [`2026-06-06-planering-supermodul-research.md`](./2026-06-06-planering-supermodul-research.md)

---

## 1. Nuläge

Planering har idag **två supermodul-routers** — inte en Universal Input Hub:

| Komponent | Varianter | Mount |
|-----------|-----------|-------|
| `GoraSuperModule` | `handling` · `fokus` · `framsteg` | `?tab=handling/fokus/framsteg` |
| `PlaneringSuperModule` | `inkorg` · `capture` | `?tab=inkorg` |

Inmatning är **spridd**:

- **Kanban quick-add** — inline i `PlanningKanbanBoard` (P3 låst på `?tab=handling`)
- **Inkorg paste** — `PlaneringInkorgPanel` + `InkorgPreviewSheet` + `classifyPasteText`
- **G10 inkast** — `CaptureSuperModule variant="planering"` (i inkorg overview + `PlaneringSuperModule capture`)
- **Inköpslista** — `PlaneringQuickListPanel` på `?tab=inkop` (localStorage, ej Firestore)

Det finns **ingen** `?inputMode=`-konvention, ingen `/planering/input`-skuggrutt, och inget gemensamt lägesnav för snabb inmatning utan sidbyte.

---

## 2. Mål (Fas 9)

Introducera **`PlaneringInputSuperModule`** — tunn router med tre lägen som mappar till befintliga komponenter/API:er utan att duplicera affärslogik:

| Mode | Delegate | Underliggande | Write-target |
|------|----------|---------------|--------------|
| `task_quick` | `PlaneringTaskQuickDelegate` | `usePlanningTasks.addTask` | Firestore `planning_tasks` |
| `inkast` | `PlaneringInkastDelegate` | `CaptureSuperModule planering` | G10 review → task/arkiv |
| `quick_list` | `PlaneringQuickListDelegate` | `PlaneringQuickListPanel` | localStorage |

**Principer:**

1. Routern skriver **aldrig** direkt till Firestore — endast delegates.
2. P3 Kanban (`PlanningKanbanBoard`) förblir orörd på `?tab=handling`.
3. `tab` = sidans skal; `inputMode` = hub-läge (Familjen/MåBra-paritet).
4. Guld glow (`glow-bottom-gold`) — planeringszon enligt Obsidian Calm 2.0.

---

## 3. Befintliga beroenden (read-only i W1)

| Fil | Roll | W1-åtgärd |
|-----|------|-----------|
| `usePlanningTasks.ts` | CRUD-hook för tasks | Delegate anropar `addTask` |
| `planningTasksApi.ts` | Firestore API | **Ej ändrad** |
| `PlanningKanbanBoard.tsx` | P3 Kanban | **Ej ändrad** — quick-add logik speglas i delegate |
| `PlaneringInkorgPanel.tsx` | Inkorg + paste | **Ej ändrad** — paste-flöde kvar i inkorg; inkast via delegate |
| `PlaneringQuickListPanel.tsx` | Inköpslista | **Ej ändrad** — tunn wrapper |
| `CaptureSuperModule.tsx` | G10 router | **Ej ändrad** — `variant="planering"` |
| `inkastService.ts` | Capture draft | **Ej ändrad** |

---

## 4. Arkitektur (W1-leverans)

```
src/modules/features/admin/planning/
  supermodule/
    PlaneringInputSuperModule.tsx   ← router + lägesnav
    planeringInputModes.ts          ← union + parser
    index.ts
    delegates/
      PlaneringTaskQuickDelegate.tsx
      PlaneringInkastDelegate.tsx
      PlaneringQuickListDelegate.tsx
  routing/
    PlaneringInputRoutes.tsx        ← skuggrutt /planering/input (W3 wire)
```

**URL-exempel (efter W3-integration):**

- `/planering/input?inputMode=task_quick`
- `/planering/input?inputMode=inkast`
- `/planering/input?inputMode=quick_list`
- `/planering?tab=handling&inputMode=task_quick` (embedded variant, W3)

---

## 5. Avgränsning W1 vs W3

| W1 (detta paket) | W3 (integration) |
|------------------|------------------|
| SPEC + djupanalys | `AppRoutes.tsx` mount |
| Router + modes + delegater | `PlaneringPage` embed på relevant tab |
| `PlaneringInputRoutes` skelett | Nav-länkar i `GoraHubTabBar` / VerktygDrawer |
| `smoke_planering_superhub.mjs` | `package.json` script + orkester |

**Förbjudet i W1:** `PlaneringPage.tsx`, `AppRoutes.tsx`, Kanban-kolumner, firestore.rules.

---

## 6. Kapacitetsstyrning (framtida, ej W1)

`useCognitiveGuard` kan senare begränsa synliga lägen (Ekonomi-paritet: `minCapacityLevel`). W1 exponerar alla tre lägen via `ROUTER_VISIBLE_FAS9C`.

---

## 7. Risker

| Risk | Mitigation |
|------|------------|
| Dubbel quick-add (Kanban + hub) | Samma `addTask`-hook; UX-copy skiljer kontext |
| Inkorg paste vs inkast | Paste kvar i inkorg; hub `inkast` = G10 capture |
| localStorage inköpslista utan auth | Befintligt beteende i `PlaneringQuickListPanel` |
| Git-kollision W2 | Strikt filomfång W1 |

---

## 8. Verifiering

```bash
node scripts/smoke_planering_superhub.mjs
```

Statisk kontroll: filer, mode-export, router utan Firestore-skrivningar, skuggrutt-skelett.

---

## 9. Beslut

**Godkänn W1-leverans** som grund för Universal Input Hub i Planering-zonen. Integration (W3) sker separat utan att bryta P3 hybrid-lock eller `PlaneringSuperModule` (inkorg/capture).
