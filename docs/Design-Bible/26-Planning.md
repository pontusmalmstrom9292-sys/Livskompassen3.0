# Chapter 26 — Planning

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [25-Journal.md](./25-Journal.md)  
> **Next chapter:** [27-Dashboard.md](./27-Dashboard.md)

---

## Purpose

This chapter defines **Planering (planning) UI** in the Vardagen zone — structure without becoming a Trello clone.

Coverage:

- **Planering hybrid widget** — Handling (P3 Kanban) + Projekt flex
- **Fyren** — side widget bar for quick access
- **Hub toolbar bento** — PlaneringBentoShell + ExecutiveHubHeader
- **`/vardagen` planering** — Superhub tab + legacy routes

**Locked UX:** P3 Kanban on Handling and hybrid split are canonical. See `docs/design/PLANERING-PROJEKT-HYBRID.md`.

Primary files: `PlaneringPage.tsx`, `PlaneringInputSuperModule.tsx`, `FyrenWidgetBar.tsx`.

---

## Philosophy

| Locked rule | Meaning |
|-------------|---------|
| P3 Kanban on Handling | `/planering?tab=handling` — todo/waiting/done |
| Projekt flex | Lists, notes, images on `/projekt` |
| Hybrid ≠ one module | Handling fixed, Projekt flexible |
| One tool at a time | Hub collapsible — progressive disclosure |

Copy canon: «Ett läge i taget» · «Snabb uppgift, smart inkast eller inköpslista».

Hamn routing for ex/conflict → Trygg Hamn, **not** Handling Kanban.

---

## Visual Rules

### PlaneringInputSuperModule

**File:** `src/modules/features/admin/planning/supermodule/PlaneringInputSuperModule.tsx`

Chameleon hub for quick input:

| Mode | Delegate |
|------|----------|
| `task_quick` | PlaneringTaskQuickDelegate |
| `inkast` | PlaneringInkastDelegate |
| `quick_list` | PlaneringQuickListDelegate |

```tsx
<BentoCard glow="gold" className="overflow-hidden !p-4 sm:!p-5">
  <nav aria-label="Planeringsinmatningslägen">...</nav>
  <div className="calm-scroll-island max-h-[min(70vh,640px)] overflow-y-auto pr-1">
    <PlaneringInputModeDelegate ... />
  </div>
</BentoCard>
```

### PlaneringPage tab structure

- `tab=handling` — P3 Kanban primary (`PlanningKanbanBoard`)
- `tab=hub` — tool picker (`PlaneringHub`)
- `tab=start` — module picker (Gora)
- Embedded input hub when `inputMode` set on handling

**CalmCollapsible** for extra tools — same pattern as Valv A2.

### PlaneringBentoShell

```tsx
<div className="planering-bento-shell">
  <Compass className="planering-bg-compass-rose" aria-hidden />
  <div className="planering-bento-shell__content">
    <span className="planering-zone-pill">Planering</span>
    {children}
  </div>
</div>
```

Radial gradient background, weak compass rose (decorative), zone pill «PLANERING» for 3-zone orientation.

### FyrenWidgetBar

Floating side panel with quick actions:

```tsx
{ id: 'plan', label: 'Planering', to: '/planering?tab=handling&picked=1', hubId: 'planering' }
```

Design: `fyren-widget-bar`, progress ring, drawer L2 icons per hub.

Planering action navigates directly to Handling with `picked=1` (skips module picker).

### ExecutivePlaneringCard (home)

Mini-widget on executive home:

- Tabs: Handling · Projekt · Inkorg
- `exec-planering-task-row` — glass row to hub
- `pickHomeDaySteps(tasks, 3)` — max 3 steps shown

### Inkorg confirm

`InkorgPreviewSheet` — Sheet confirm before Kanban update (see Modals chapter).

---

## Sizing

| Element | Spec |
|---------|------|
| Input supermodule island | `max-h-[min(70vh,640px)]` |
| BentoCard padding | `!p-4 sm:!p-5` |
| Kanban columns | Equal flex; min-width in planering.css |
| Fyren tiles | Min 44px |
| Zone pill | Uppercase compact badge |
| ExecutivePlaneringCard tabs | Compact tablist |
| Home task rows | Full width glass row |

---

## Spacing

| Area | Rule |
|------|------|
| Mode nav | Horizontal gap between input modes |
| Island inner | `pr-1` for scrollbar gutter |
| Bento shell content | Padding from `planering-bento-shell__content` |
| Hub hint | `planering-hub__hint` margin below header |
| Kanban column gap | Defined in `planering.css` |
| Fyren widget stack | Vertical rhythm in `index.css` |
| Collapsible body | `CalmCollapsible` standard spacing |

---

## States

### PlaneringPage tabs

| Tab | Primary content |
|-----|-----------------|
| handling | P3 Kanban + optional embedded input hub |
| hub | PlaneringHub tool bento |
| start | Gora module picker |

### Input modes

URL: `?inputMode=` on handling tab. Delegate swaps inside Chameleon shell.

### Fyren + Planering

| State | Behavior |
|-------|----------|
| Plan action | Navigate `/planering?tab=handling&picked=1` |
| Valv locked | Shows «Lås upp» when vault gate closed |
| Desktop Valv | Fyren hidden ≥640px with dock |

### InkorgPreviewSheet

| State | Behavior |
|-------|----------|
| Preview open | Sheet center with dl preview |
| routeToHamn | Confirm disabled — wrong silo guard |
| Confirm | Creates Kanban task after explicit OK |

### Hub layout picker

`usePlaneringHubLayout` — user-selected bento layout persisted in preferences.

### Error boundary

`PlaneringErrorBoundary` — graceful fallback without breaking Vardagen tab.

---

## Examples

### Example A — Quick task input mode

```tsx
<PlaneringInputSuperModule initialMode="task_quick" />
```

### Example B — Fyren → Handling shortcut

```tsx
// FyrenWidgetBar action
navigate('/planering?tab=handling&picked=1')
```

### Example C — Executive home planering card

```tsx
<ExecutivePlaneringCard
  tasks={pickHomeDaySteps(tasks, 3)}
  onNavigate={navigate}
/>
```

### Example D — PlaneringHub progressive disclosure

```tsx
<p className="planering-hub__hint">
  Starta projekt högst upp. Öppna en kategori nedan — en i taget.
</p>
<PlaneringHubBody layout={hubLayout} />
```

### Example E — HOME_SUPERHUB_ROUTES

```ts
planeringHub    // executive home → planering
planeringInkast // quick inkast start
```

Used by `HomeExecutiveSnabbstart` and `ExecutivePlaneringCard`.

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Kanban columns | Clear column headings |
| Tab list | `role="tablist"` / `aria-selected` (ExecutivePlaneringCard) |
| Fyren actions | `aria-label` on tiles, min 44px |
| Module picker | One step at a time — not all panels open |
| Error boundary | Readable fallback message |
| Input mode nav | `aria-label="Planeringsinmatningslägen"` |
| Inkorg sheet | Descriptive title + consequence copy |

---

## Animations

| Surface | Animation | Spec |
|---------|-----------|------|
| Bento compass rose | static decorative | no spin |
| CalmCollapsible | height transition | calm ease |
| Kanban drag | native / library | no bounce |
| Fyren progress ring | subtle stroke | reduced-motion safe |
| Hub layout switch | cross-fade panels | ~300ms |

No gamified task completion animations.

---

## Code Examples

### HubPageShell wiring

```tsx
<HubPageShell
  lockViewport
  fitViewport
  executiveHeader={isMidnightExecutiveTheme}
>
  <PlaneringPage />
</HubPageShell>
```

### 3-zone routing

- **Vardagen** `/vardagen` — MåBra, Planering, Ekonomi, Arbetsliv
- Legacy `/planering` redirect preserved for bookmarks
- Drawer: `DRAWER_VARDAG_ITEMS` in `navTruth.ts`

### Lazy supermodules

- **Gora** — göra flow, module picker
- **PlaneringSuperModule** — extended planning

### File index

| File | Role |
|------|------|
| `PlaneringPage.tsx` | Main page |
| `PlaneringInputSuperModule.tsx` | Input hub |
| `PlaneringBentoShell.tsx` | Bento background |
| `PlaneringHub.tsx` | Tool picker |
| `FyrenWidgetBar.tsx` | Fyren widget |
| `ExecutivePlaneringCard.tsx` | Home widget |
| `planering.css` | Zone CSS |
| `PLANERING-PROJEKT-HYBRID.md` | Locked spec |

---

## Do

- Keep P3 Kanban on Handling tab
- Use PlaneringInputSuperModule for quick input
- Apply bento shell + zone pill for orientation
- Route Fyren → `/planering?tab=handling&picked=1`
- Confirm inbox paste via InkorgPreviewSheet
- Use `calm-scroll-island` for input delegate scroll

---

## Don't

- Move Kanban to Projekt-only
- Remove hybrid (Handling + Projekt)
- Auto-create tasks without InkorgPreviewSheet
- Add nested scroll outside calm-scroll-island
- Create new `/planering` parallel routes without PMIR
- Route Hamn/conflict items to Handling Kanban

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Kanban mobile columns** | Horizontal snap columns on G85 |
| **Fyren ↔ dock sync** | Unified quick-action registry |
| **Projekt preview sheet** | Confirm before cross-linking Handling ↔ Projekt |
| **Hub layout presets** | Executive Midnight default bento for new users |
| **Inkast → Planering analytics** | Local-only routing stats (Zero Footprint) |
