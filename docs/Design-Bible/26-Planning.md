# Chapter 26 — Planning

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [25-Journal.md](./25-Journal.md)  
> **Next chapter:** [27-Dashboard.md](./27-Dashboard.md)


---

## Purpose

This chapter defines **planning input and task surfaces** — `PlaneringInputSuperModule`, mode switching, G10 inkast HITL, and local quick lists.

Planering lives in **Vardagen** (`/vardagen?tab=planering`). Hub communicates **ett läge i taget** — snabb uppgift, smart inkast, inköpslista — without Kanban paralysis at evolution Nivå 1.

| File | Responsibility |
|------|----------------|
| `PlaneringInputSuperModule.tsx` | thin router |
| `planeringInputModes.ts` | mode metadata |
| Delegates | task / inkast / list UI + writes |
| `PlaneringPage.tsx` | hub host |
| `ChameleonLive` | home executive embed |

Router file must not call Firestore directly.
---

## Philosophy

Planering Supermodule (Fas 9) mirrors Dagbok architecture:

1. **Thin router** — parse URL, render picker + delegate.
2. **Three primary modes** — `PLANERING_INPUT_MODES_PRIMARY` only in nav; "Mer…" tier for expansion.
3. **HITL inkast** — G10 capture review before Firestore promote.
4. **Local lists stay local** — explicit copy about device scope.
5. **Capacity gate** — Kanban hidden Nivå 1 (infinite-evolution.mdc).

| Mode | Writes | Cloud |
|------|--------|-------|
| task_quick | planning_tasks | Firestore |
| inkast | review queue | HITL only |
| quick_list | localStorage | device until export |

Planning is logistics (10%), not emotional processing — keep copy neutral and short.
---

## Visual Rules

| Region | Classes |
|--------|---------|
| Shell | `BentoCard glow="gold" overflow-hidden !p-4 sm:!p-5` |
| Eyebrow | `font-display-serif text-xs uppercase tracking-[0.2em] text-accent` |
| Title | `text-base uppercase tracking-[0.2em] text-text` — "Ett läge i taget" |
| Lead | `text-xs text-text-dim` |
| Help | `ModuleHelpFromRegistry moduleId="planering" mode={activeMode}` |
| Mode nav | `rounded-xl border border-border bg-surface-2 p-1 flex flex-wrap gap-2 mb-5` |
| Active pill | `border-accent/40 bg-surface-3 text-accent rounded-lg px-3 py-2` |
| Inactive pill | `border-transparent text-text-muted hover:border-border hover:bg-surface-3` |
| Viewport | `calm-scroll-island max-h-[min(70vh,640px)] overflow-y-auto pr-1` |

Mode button: bold label + 10px dim description stacked.

Executive home: `chameleon-shell__exec-mode-pill--on` parallels hub pills.
### ModuleHelpFromRegistry

Header help button pulls contextual copy per `moduleId="planering"` and active mode — ensures planning help stays synchronized with mode delegate without duplicating strings in JSX.

### CaptureSuperModule embed

Inkast delegate hosts G10 capture UI — compact variant when inside supermodule. Visual weight must stay below mode nav — user always sees which mode is active.

### planering-bento-card (page grid)

Separate from input supermodule: page-level bento tiles for week view / widgets use `planering.css` spacing. Do not copy supermodule segmented nav into page tiles.
---

## Sizing

| Element | Spec |
|---------|------|
| Mode buttons | px-3 py-2, text-xs, ≥44px touch |
| Header block | mb-4 |
| Mode nav | mb-5 |
| Scroll max | min(70vh, 640px) |
| Task input | full width single column |
| Help icon | shrink-0 in header row |

Planering page bento grid (`planering-bento-card`) is separate from input supermodule — do not merge CSS families.
---

## Spacing

- Header stack: `space-y-1` for eyebrow/title/lead trio.
- Help icon: `flex items-start justify-between gap-3` in header row.
- Delegate quick list: `space-y-3` header → `PlaneringQuickListPanel`.
- Inkast delegate: inherits CaptureSuperModule compact spacing.
- Note pin mode (delegate variant): own header spacing — same shell.

Aligns with Dagbok shell padding for cross-zone muscle memory.
---

## States

| Mode | Delegate | Persistence |
|------|----------|-------------|
| task_quick | PlaneringTaskQuickDelegate | planning_tasks |
| inkast | PlaneringInkastDelegate | G10 HITL |
| quick_list | PlaneringQuickListDelegate | localStorage |
| URL default | task_quick when param absent | — |
| Saving | delegate spinner/disabled | toast |
| Inkast routed | review-queue-status--routed | visible in queue |
| Empty list | panel CTA | add first item |

`aria-pressed={isActive}` on mode buttons.
### Metadata flags per mode

From `planeringInputModes.ts`:

- `writesPlanningTasks` — task_quick only
- `writesLocalStorage` — quick_list only
- `hitlCapture` — inkast only

Use these flags in analytics and help registry — not duplicated boolean checks in JSX.

### Kanban gate

At evolution Nivå 1, Kanban board UI hidden — supermodule still allows micro task capture. Document this in help copy to prevent user confusion.
---

## Examples

**Snabb uppgift:** Pick Att göra/Väntar → one line → `usePlanningTasks` save.

**Smart inkast:** Paste plan → DCAP → review card → user approves → task created.

**Inköpslista:** Checkboxes local → footer explains cloud export path.

**Home Chameleon:** Vardagen zone → mode pills → exec viewport delegate swap.

**Module help:** Context help button changes copy per `activeMode` via registry.
### PlaneringPage host

Page renders supermodule as primary input column — Kanban and calendar are secondary panels gated by flags.

### Quick list export path

Copy in delegate: *"Lokal lista på enheten — sparas inte i molnet förrän du väljer Spara som projekt."* — mandatory per data honesty rule.

### Note pin variant

`PlaneringQuickListDelegate mode="note"` shows `PlaneringNotePinPanel` — local pin, same localStorage family as lists.
---

## Accessibility

- Nav `aria-label="Planeringsinmatningslägen"`.
- Mode buttons: `aria-pressed` reflects selection.
- Help button: accessible name from registry.
- Inkast review: textual status pills (Chapter 24).
- Scroll region: consider tying to header via id for `aria-labelledby`.
- Task inputs: associated labels visible — not placeholder-only.
---

## Animations

- Mode switch: instant delegate swap inside scroll island — no route animation.
- Pill hover: `transition-colors` only.
- Chameleon executive morph: 350ms shared with journal.
- Save: button text "Sparar…" — no confetti/gamification.

Respect reduced motion on any future list item slide-in.
---

## Code Examples

```tsx
import { PlaneringInputSuperModule } from '@/features/admin/planning/supermodule/PlaneringInputSuperModule';
import {
  PLANERING_INPUT_MODES_PRIMARY,
  DEFAULT_PLANERING_INPUT_MODE,
} from './planeringInputModes';

<PlaneringInputSuperModule onSaved={(mode) => refresh(mode)} />

<nav aria-label="Planeringsinmatningslägen" className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1">
  {PLANERING_INPUT_MODES_PRIMARY.map((mode) => (
    <button
      key={mode.id}
      type="button"
      aria-pressed={activeMode === mode.id}
      onClick={() => setActiveMode(mode.id)}
      className={activeMode === mode.id ? 'border border-accent/40 bg-surface-3 text-accent rounded-lg px-3 py-2 text-xs' : '...'}
    >
      <span className="block font-medium">{mode.label}</span>
      <span className="block text-[10px] text-text-dim">{mode.description}</span>
    </button>
  ))}
</nav>
```

Smoke: `npm run smoke:planering_superhub`.
```tsx
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';

<header className="mb-4 flex items-start justify-between gap-3">
  <div className="min-w-0 flex-1 space-y-1">{/* eyebrow, title, lead */}</div>
  <ModuleHelpFromRegistry moduleId="planering" mode={activeMode} />
</header>
```

Callable boundaries: inkast delegate triggers DCAP classify — never direct `planning_tasks` write without review approval.
---

## Do

- Keep supermodule a thin router — writes in delegates/services.
- Show G10 review UI for inkast with review-queue-status classes.
- State local-only scope in quick list header copy verbatim.
- Register per-mode help in module help registry.
- Hide Kanban at evolution Nivå 1.
- Use replace URL param pattern for mode changes.
- Run planering superhub smoke after delegate edits.
---

## Don't

- Add 4th primary mode without disclosure review.
- Promote inkast to Firestore without HITL approval.
- Auto-sync inköpslista to cloud.
- New standalone `/planering` routes outside Vardagen tab.
- Show full project Gantt on low capacity.
- Mix planering-bento-card styles into supermodule shell.
- Use gamified streaks on task completion in planning hub.
---

## Future Improvements

- Paralys-panel micro-step at Nivå 1 (single next action).
- Kanban P3 unlock via `planning_kanban` flag + executive board chrome.
- Promote note-pin mode to primary picker when stable.
- Calendar hybrid widget without breaking one-mode shell.
- Capacity-auto mode suggesting task_quick only.
- Export quick list → planning project explicit flow UI.
- Unified planning + inkast morph in Chameleon vardagen zone.
- Planning widget on home executive dashboard deep-linking to supermodule mode via URL.
- Shared segmented nav primitive with Dagbok picker for visual parity audit.
- Economy week-budget list rows reusing Chapter 24 list patterns at Nivå 2 unlock.
- Integration with Fyren morning compass prompt → task_quick prefill.
---

Smoke gate reference: `npm run smoke:planering_superhub` · `npm run smoke:locked-ux` when planering home widgets touched.
