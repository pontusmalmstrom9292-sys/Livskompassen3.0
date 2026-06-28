# Chapter 22 — Sheets

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [21-Inputs.md](./21-Inputs.md)  
> **Next chapter:** [23-Modals.md](./23-Modals.md)

---

## Purpose

This chapter defines **overlay surfaces** — bottom sheets, centered panels, the design-system `Sheet` component, and the app-level **NavigationDrawer** (left menu). These patterns handle secondary workflows without breaking the calm chrome hierarchy.

Sheets are for focused tasks (pick preset, confirm WORM save, project picker). The navigation drawer is for zone traversal and Valv menu — not a replacement for the dock.

---

## Philosophy

### Sheets vs drawer vs routes

| Pattern | Component | Use when |
|---------|-----------|----------|
| **Bottom sheet** | `Sheet` (`placement="sheet"`) | Mobile-first pickers, confirmations, short forms |
| **Center panel** | `Sheet` (`placement="center"`) | Desktop-friendly dialogs, preset pickers |
| **Navigation drawer** | `NavigationDrawer` | Global menu, Valv block, recent nav |
| **Full route** | React Router | Primary hub content — not sheet |

Progressive disclosure: show sheet before pushing a new route when the task is **≤2 steps** and returns to context.

### Glass continuity

Sheets use the same Executive Midnight vocabulary as cards:

- Token glass background (`--ds-color-surface-2` mix)
- Blur backdrop on overlay
- Gold bottom glow optional via `glow-bottom-gold` on panel
- Rounded `var(--ds-radius-2xl)` (tall variant: top-only radius on mobile)

---

## Visual Rules

### Design-system Sheet

File: `src/design-system/components/Sheet.tsx`

| Part | Class | Role |
|------|-------|------|
| Backdrop | `ds-overlay` + `ds-overlay--sheet` or `--center` | Fixed inset, blurred scrim |
| Panel | `ds-sheet-panel` (+ `ds-card`, `glow-bottom-gold`) | Glass dialog body |
| Tall editor | `ds-sheet-panel--tall` | 85 vh max, flex column, sm+ full radius |
| Header | Built-in title (Cinzel accent) or `hideHeader` + `ariaLabel` |
| Body | `SheetBody` — scroll region |
| Footer | `SheetFooter` — button row |

Default `portal={true}` renders via `createPortal` to `document.body`.

### Overlay placement

```css
.ds-overlay--sheet {
  align-items: flex-end;  /* bottom on mobile */
}
@media (min-width: 640px) {
  .ds-overlay--sheet { align-items: center; }
}
```

### NavigationDrawer (separate system)

File: `src/modules/core/layout/NavigationDrawer.tsx` — **locked core component**.

| Part | Class |
|------|-------|
| Backdrop | `nav-drawer__backdrop` |
| Panel | `nav-drawer nav-drawer--obsidian-depth` |
| Scenic bg | `nav-drawer__scenic` |
| Scroll | `nav-drawer__calm-scroll` |

Opens from header menu; slides from left; swipe-to-close threshold 56 px. Uses `DRAWER_VARDAG_ITEMS` / `DRAWER_VALV_ITEMS` config — data separated from presentation.

**Not** the same as `Sheet` — do not merge without PMIR.

---

## Sizing

| Element | Spec |
|---------|------|
| Sheet default max-width | `28rem` |
| Sheet tall max-width | `42rem` |
| Sheet tall max-height | `85vh` |
| Overlay padding | `var(--ds-space-4)` |
| Nav drawer width | Full viewport mobile; defined in `index.css` nav-drawer block |
| z-index | `var(--ds-z-modal)` for sheets; drawer uses nav stack |

---

## Spacing

| Area | Rule |
|------|------|
| Panel padding | `var(--ds-space-5)` default |
| Title → body | `mt-[var(--ds-space-4)]` when header shown |
| Footer gap | `var(--ds-space-2)` flex wrap |
| Tall sheet body | `SheetBody` flex-1 overflow-y-auto |
| Drawer sections | Header, quick grid, mode toggle, recent, Valv block — vertical rhythm in CSS |

---

## States

### Sheet

| State | Behavior |
|-------|----------|
| Closed | `open={false}` — renders null |
| Open | Focus moves to panel; body scroll locked if `lockScroll` |
| Dismiss | Escape, backdrop mousedown, close handler |
| hideHeader | Requires `ariaLabel` for dialog name |

### NavigationDrawer

| State | Behavior |
|-------|----------|
| Closed | `isMenuOpen` false — null render |
| Open | `body.nav-drawer-open`, Escape closes |
| Route change | Auto-close on pathname/search/hash change |
| Vault mode | Shows Valv block when `isVaultUnlocked` or gate |
| Swipe | Left swipe > 56 px closes |

### ResurserOverlay

Opened from dock **Resurser** — overlay pattern sibling to drawer; not documented as Sheet but follows same dismiss semantics.

---

## Examples

### Example A — Bottom sheet (WORM confirm)

```tsx
import { Sheet, SheetBody, SheetFooter, Button } from '@/design-system';

<Sheet open={open} onClose={onClose} title="Bekräfta sparning">
  <SheetBody>
    <p className="text-sm text-text-muted">Beviset låses permanent (WORM).</p>
  </SheetBody>
  <SheetFooter>
    <Button variant="ghost" onClick={onClose}>Avbryt</Button>
    <Button variant="accent" onClick={onConfirm}>Spara</Button>
  </SheetFooter>
</Sheet>
```

### Example B — Center preset picker

```tsx
// HubPresetSheet.tsx pattern
<Sheet
  open={open}
  onClose={onClose}
  ariaLabel="Välj hub"
  hideHeader
  placement="center"
  panelClassName="max-w-md rounded-[2rem] …"
>
  <LifeHubPresetPicker … />
</Sheet>
```

### Example C — NavigationDrawer

```tsx
// Store-driven — opened from AppHeaderBar menu
const open = useStore((s) => s.ui.isMenuOpen);
// NavigationDrawer portals backdrop + aside with drawer nav matrices
```

---

## Accessibility

| Requirement | Sheet | Nav drawer |
|-------------|-------|------------|
| Role | `role="dialog"`, `aria-modal="true"` | `role="dialog"` on aside |
| Name | `aria-labelledby` or `aria-label` | `aria-label` Swedish menu title |
| Focus trap | Panel `tabIndex={-1}` + initial focus | Close button first |
| Escape | Closes | Closes |
| Scroll lock | `document.body.overflow hidden` | `nav-drawer-open` class |
| Backdrop | Click to dismiss | `nav-drawer__backdrop` button |

---

## Animations

| Surface | Animation | Spec |
|---------|-----------|------|
| Sheet overlay | `ds-overlay-in` | `var(--ds-duration-normal)`, `--ds-ease-enter` |
| Sheet panel | premium-polish entrance | subtle translate/fade |
| Nav drawer | `nav-drawer-in` | 0.26 s ease-out |
| Reduced motion | Global CSS | Instant or opacity-only |

No bouncy sheet springs. Drawer slide is short and calm.

---

## Code Examples

### Sheet component API

```tsx
export type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  placement?: 'sheet' | 'center';
  size?: 'default' | 'tall';
  hideHeader?: boolean;
  ariaLabel?: string;
  lockScroll?: boolean;
};
```

### Overlay CSS

```css
.ds-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--ds-z-modal);
  background: color-mix(in srgb, var(--ds-color-bg) 60%, transparent);
  backdrop-filter: blur(var(--ds-blur-sm));
}
.ds-sheet-panel {
  max-width: 28rem;
  border-radius: var(--ds-radius-2xl);
  backdrop-filter: blur(var(--ds-blur-xl));
  padding: var(--ds-space-5);
}
```

### Drawer swipe threshold

```typescript
// NavigationDrawer.tsx
const SWIPE_CLOSE_THRESHOLD_PX = 56;
```

---

## Do

- Use `Sheet` from `@/design-system` for new overlays
- Prefer `SheetFooter` + `Button` variants for actions
- Use `placement="sheet"` on mobile-first flows; center for pickers
- Keep NavigationDrawer data in `drawerNav.ts` matrices
- Close drawer on navigation — already wired
- Run `smoke:design-modules` when adding new sheet flows

---

## Don't

- Don't build custom full-screen modals with hardcoded rgba scrims
- Don't modify NavigationDrawer UI structure — file is locked
- Don't use sheets for primary hub content that belongs on routes
- Don't stack multiple modal layers without z-index plan
- Don't block SOS/critical chrome behind undismissable sheets
- Don't embed Firestore writes directly in Sheet — use parent handlers

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Sheet drag handle** | Swipe-down dismiss on mobile bottom sheets |
| **Unified overlay z-index map** | Sheet vs drawer vs Resurser vs Valv PIN |
| **Focus trap library** | Optional focus-trap-react for Sheet |
| **Drawer Storybook** | Visual states vault open/closed |

---

### Related chapters

| Topic | Chapter |
|-------|---------|
| Buttons in footers | [20-Buttons.md](./20-Buttons.md) |
| Cards (panel glass) | [16-Cards.md](./16-Cards.md) |
| Header (menu trigger) | [17-Header.md](./17-Header.md) |
| Dock Resurser overlay | [18-Dock.md](./18-Dock.md) |
| Accessibility | [28-Accessibility.md](./28-Accessibility.md) |
| Drawer config | `src/modules/core/navigation/drawerNav.ts` |

---

*End of Chapter 22 — Sheets*
