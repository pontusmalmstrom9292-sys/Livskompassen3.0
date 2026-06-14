# Planering — Universal Input Superhub (SPEC)

**Datum:** 2026-06-14  
**Status:** **W1 skelett (Fas 9A→9C)** — integration W3  
**Kanon:** [`PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)  
**Analys:** [`docs/evaluations/2026-06-14-planering-superhub-djupanalys.md`](../evaluations/2026-06-14-planering-superhub-djupanalys.md)  
**Referensmönster:** [`Familjen-INPUT-SUPERHUB-SPEC.md`](./Familjen-INPUT-SUPERHUB-SPEC.md) · [`Ekonomi-INPUT-SUPERHUB-SPEC.md`](./Ekonomi-INPUT-SUPERHUB-SPEC.md)

---

## 1. Syfte

Ersätta **spridd snabbinmatning** i Planering med en polymorf **Universal Input Hub** — `PlaneringInputSuperModule` — där användaren byter **läge** (`task_quick`, `inkast`, `quick_list`) **utan sidbyte**.

Hubben är **inmatnings-yta** för göra/uppgifter och inköpslistor — inte ersättning för P3 Kanban, Fokus/Framsteg, eller full Inkorg (`?tab=inkorg`).

---

## 2. Scope

### In scope (W1)

- Router + lägesväxlare (guld glow)
- Tre input-lägen med **tunna delegates** → befintliga komponenter/hooks
- Typer i `planeringInputModes.ts`
- Skuggrutt-skelett: `PlaneringInputRoutes` → `/planering/input`
- Smoke: `scripts/smoke_planering_superhub.mjs`

### Out of scope (W1)

- `AppRoutes.tsx` / `PlaneringPage.tsx` wiring (W3)
- Inkorg paste-flöde (stannar i `PlaneringInkorgPanel`)
- OAuth Gmail/Kalender
- LLM/RAG i planering
- Kapacitets-gating (`useCognitiveGuard`) — framtida Fas 9D

### MUST NOT

- Flytta eller modifiera P3 Kanban (`PlanningKanbanBoard`)
- Ersätta `PlaneringSuperModule` (inkorg/capture)
- Cross-RAG till Kunskap/Valv/Barnen
- Firestore-skrivningar i routern

---

## 3. Gränssnitt

### 3.1 Mode union

```typescript
export type PlaneringInputMode = 'task_quick' | 'inkast' | 'quick_list';
```

### 3.2 Mode metadata

```typescript
export type PlaneringInputModeMeta = {
  id: PlaneringInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  /** Skriver till planning_tasks via usePlanningTasks */
  writesPlanningTasks: boolean;
  /** Skriver till localStorage quick lists */
  writesLocalStorage: boolean;
  /** G10 HITL — ingen direkt Firestore från delegate */
  hitlCapture: boolean;
};
```

### 3.3 Lägestabell

| Mode ID | Label | Description | tier | writesPlanningTasks | writesLocalStorage | hitlCapture |
|---------|-------|-------------|------|---------------------|--------------------|-------------|
| `task_quick` | Snabb uppgift | Lägg till i Att göra / Väntar | primary | **true** | false | false |
| `inkast` | Smart inkast | Granska innan spar (G10) | primary | indirekt¹ | false | **true** |
| `quick_list` | Inköpslista | Lokal lista — ej Firestore | primary | false | **true** | false |

¹ Efter godkännande i review-kö kan capture skapa task — samma som idag via `CaptureSuperModule planering`.

### 3.4 Parser

```typescript
export const DEFAULT_PLANERING_INPUT_MODE: PlaneringInputMode = 'task_quick';

export function parsePlaneringInputMode(value: string | null | undefined): PlaneringInputMode;
export function isPlaneringInputMode(value: string | null | undefined): value is PlaneringInputMode;
export function getPlaneringInputModeMeta(mode: PlaneringInputMode): PlaneringInputModeMeta;
```

**URL:** `?inputMode=<mode>` — default mode utelämnas i URL.

---

## 4. Komponentkontrakt

### 4.1 `PlaneringInputSuperModule`

```typescript
export type PlaneringInputSuperModuleProps = {
  /** Valfri override (Storybook / test) */
  initialMode?: PlaneringInputMode;
  onSaved?: (mode: PlaneringInputMode) => void;
};
```

- Synkar `inputMode` med `useSearchParams`
- Renderar lägesnav + `PlaneringInputModeDelegate`
- **Inga** imports från `planningTasksApi` eller Firestore SDK

### 4.2 Delegates

| Delegate | Props | Implementation |
|----------|-------|----------------|
| `PlaneringTaskQuickDelegate` | `{ onSaved? }` | Form + `usePlanningTasks().addTask` |
| `PlaneringInkastDelegate` | `{ onSaved? }` | `<CaptureSuperModule variant="planering" compact onSaved={…} />` |
| `PlaneringQuickListDelegate` | `{ listId?: string }` | `<PlaneringQuickListPanel listId={listId} />` |

### 4.3 Routing (W3)

```tsx
// PlaneringInputRoutes.tsx (W1 skelett)
<Route path="input" element={<PlaneringInputSuperModule />} />
```

Monteras under `/planering/*` när W3 uppdaterar `AppRoutes.tsx`.

---

## 5. Design

- **Glow:** `BentoCard glow="gold"` / `glow-bottom-gold`
- **Typografi:** `font-display-serif`, `tracking-[0.2em]`, uppercase rubriker
- **Scroll:** `calm-scroll-island` på delegate-yta
- **Copy:** "Ett läge i taget" — kognitiv avlastning

---

## 6. Filstruktur

```
src/modules/features/admin/planning/supermodule/
  PlaneringInputSuperModule.tsx
  planeringInputModes.ts
  index.ts
  delegates/
    PlaneringTaskQuickDelegate.tsx
    PlaneringInkastDelegate.tsx
    PlaneringQuickListDelegate.tsx
src/modules/features/admin/planning/routing/
  PlaneringInputRoutes.tsx
scripts/
  smoke_planering_superhub.mjs
```

---

## 7. Smoke (W1)

```bash
node scripts/smoke_planering_superhub.mjs
```

Kontrollerar:

1. Alla W1-filer finns
2. `planeringInputModes.ts` exporterar tre lägen + parser
3. `PlaneringInputSuperModule.tsx` **saknar** direkta Firestore-skrivningar
4. Delegater importerar rätt underliggande moduler
5. `PlaneringInputRoutes.tsx` definierar `path="input"`

---

## 8. Faser efter W1

| Fas | Innehåll |
|-----|----------|
| 9D | Kapacitets-gating via `useCognitiveGuard` |
| 9E | Embed på `?tab=handling` + deep links från Fyren |
| 9F | Paste-delegate (extrahera från inkorg) som fjärde läge |
