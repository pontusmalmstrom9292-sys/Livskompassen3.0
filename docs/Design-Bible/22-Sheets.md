# Chapter 22 — Sheets

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [21-Inputs.md](./21-Inputs.md)  
> **Next chapter:** [23-Modals.md](./23-Modals.md)


---


## Purpose

This chapter defines **overlay panels**—bottom sheets, centered dialogs, and the **NavigationDrawer** slide-in menu.

Primary implementation: `Sheet.tsx` in design-system (portal, glass panel, a11y). NavigationDrawer is the app-scale lateral sheet for global module navigation—locked core component.

Sheets carry secondary tasks; they must not replace hub shells for primary zone content.

---

## Philosophy

Overlays should feel like **glass layers floating above scenic depth**—not full page replacements.

Two families:

| Family | Component | Motion | Use |
|--------|-----------|--------|-----|
| Modal sheet | `Sheet` | bottom → center on sm+ | Forms, confirmations, editors |
| Nav drawer | `NavigationDrawer` | slide from left | Global module menu, Valv block |

Both use backdrop blur, token surfaces, Escape dismiss, body scroll lock.

Sheets respect progressive disclosure—one decision at a time for ADHD-safe flows (ai-cognitive-companion).

**Z-index and layering:**

| Layer | Class | Notes |
|-------|-------|-------|
| Backdrop | `.ds-overlay` | `--ds-z-modal` |
| Panel | `.ds-sheet-panel` | focus target on open |
| Drawer backdrop | `.nav-drawer__backdrop` | separate stack |
| Drawer panel | `.nav-drawer` | slides over content |

Only one primary overlay should capture focus at a time. Opening Sheet while drawer open is unsupported—close drawer first.

**NavigationDrawer lifecycle:**

1. Header menu sets `isMenuOpen` true in store.
2. Body class `nav-drawer-open` applied.
3. User navigates → effect closes drawer on route change.
4. Valv lock → `endVaultSession({ closeDrawer: true })` + navigate home.

---

## Visual Rules

**Sheet overlay:**

- `.ds-overlay` fixed inset, z-index `--ds-z-modal`
- Background: bg color 60% mix + blur sm
- Variant `--sheet`: align flex-end mobile; center on sm+
- Variant `--center`: always centered (modal)

**Sheet panel:**

- `.ds-sheet-panel` + `.ds-card` + `glow-bottom-gold`
- max-width 28rem default; glass blur xl; shadow xl
- `--tall`: max-w-2xl (42rem), 85vh, rounded top on mobile

**NavigationDrawer:**

- `.nav-drawer--obsidian-depth` scenic background layer
- `.nav-drawer__backdrop` dim + click dismiss
- Header: LivskompassMark + LIVSKOMPASSEN title + diamond ornament
- Rows: `.nav-drawer__row` flat list with icon, label, chevron
- Valv block: section title + lock panic button when vault open

Animation: `nav-drawer-in` 0.26s ease-out on drawer enter.

---

## Sizing

| Element | Dimension |
|---------|-----------|
| Default sheet max-width | 28rem |
| Tall sheet max-width | 42rem |
| Tall sheet max-height | 85vh |
| Overlay padding | `--ds-space-4` |
| Sheet panel padding | `--ds-space-5` |
| Drawer width | CSS nav-drawer (full mobile width ~ min(100vw, 22rem)) |
| Header title | display font lg |
| Row icon | h-4 w-4 |
| Close button | h-5 w-5 icon in 44px target |
| Swipe close threshold | 56px horizontal delta |

Tall sheets: use `SheetBody` flex-1 overflow-y-auto for scrollable editor content.

---

## Spacing

- Sheet header to body: `mt-[var(--ds-space-4)]` when header visible.
- SheetFooter: `mt-[var(--ds-space-5)]`, flex-wrap, gap `--ds-space-2`.
- Drawer header padding via nav-drawer CSS; calm-scroll region for list.
- Recent visits grid: chips with gap before Vardag section.
- Valv lock button: separated block below Valv rows with hint copy.

Hide header (`hideHeader`): supply `ariaLabel`; optional headerAction only.

---

## States

**Sheet:**

| Prop | Effect |
|------|--------|
| open false | render null |
| open true | portal mount, focus panel, lock scroll |
| placement sheet | bottom mobile / centered desktop |
| placement center | always centered |
| size tall | editor layout, rounded top mobile |
| hideHeader | aria-label on dialog |

**NavigationDrawer:**

| State | Behavior |
|-------|----------|
| closed | null render |
| open | body class `nav-drawer-open`, Escape closes |
| route change | auto-close on pathname/search/hash change |
| vault unlocked | Valv section + lock panic visible |
| swipe left | close if delta > 56px |
| recent visits | chips excluding current path |

Backdrop mousedown on Sheet overlay closes when target === currentTarget.

---

## Examples

1. **ResurserOverlay** — sheet or overlay pattern from dock Resurser button.
2. **Settings sheet** — default size, title + SheetFooter buttons.
3. **Project editor** — `size="tall"` + SheetBody scroll.
4. **NavigationDrawer** — menu from header; DrawerModeToggle for Valv shell.
5. **PIN modal** — centered placement, hideHeader optional.
6. **Drawer recent chips** — quick revisit without full scroll.

NavigationDrawer is **PROTECTED CORE**—do not remove UI elements without architectural review.

**Drawer vs Sheet decision matrix:**

| Need | Use |
|------|-----|
| Global module list | NavigationDrawer |
| Contextual form / confirm | Sheet |
| Full-width editor | Sheet `size="tall"` |
| Resource grid from dock | ResurserOverlay (overlay family) |
| Valv panic lock | NavigationDrawer lock row |

**NavigationDrawer row data:**

- Vardag rows: `DRAWER_VARDAG_ITEMS` from `drawerNav.ts`
- Valv rows: `DRAWER_VALV_ITEMS` when vault session open
- Recent: `useDrawerRecentNav()` chips, excludes current path
- Active detection: `isVardagDrawerRowActive`, `isDrawerLinkActive`

**Sheet prop reference:**

| Prop | Default | Purpose |
|------|---------|---------|
| portal | true | Mount to body |
| placement | sheet | Bottom mobile / center desktop |
| size | default | 28rem; tall for editors |
| lockScroll | true | Body overflow hidden |
| hideHeader | false | Requires ariaLabel if true |

---

## Accessibility

**Sheet:**

- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` from title id; `aria-describedby` when description prop set
- hideHeader: `aria-label` required
- Escape key dismiss; focus moves to panel on open (`tabIndex={-1}`)
- lockScroll prevents background scroll

**NavigationDrawer:**

- `role="dialog"`, `aria-label` Swedish menu / Valv variant
- Backdrop button `aria-label="Stäng meny"`
- Close X `aria-label="Stäng"`
- Lock button explains panic action in visible hint text
- Row buttons: full row clickable; active state via `--active` class

Focus trap: drawer rows sequential; return focus to menu button on close (parent responsibility).

---

## Animations

| Surface | Animation |
|---------|-----------|
| Sheet overlay | `ds-overlay-in` via premium-polish.css |
| Sheet panel | inherits overlay enter |
| Nav drawer | `nav-drawer-in` 0.26s ease-out |
| Backdrop | opacity fade (CSS) |

No slide-up spring on sheet panel beyond overlay enter—calm motion only.

Reduced motion: shorten or remove translate on drawer; keep instant opacity.

Route-change drawer close is instant—no exit animation required (prevents flash on navigate).

---

## Code Examples

```tsx
// Sheet.tsx
<Sheet
  open={open}
  onClose={() => setOpen(false)}
  title="Spara ändringar?"
  description="Dina ändringar sparas lokalt tills du synkar."
  placement="sheet"
>
  <SheetBody>{children}</SheetBody>
  <SheetFooter>
    <Button variant="ghost" onClick={onClose}>Avbryt</Button>
    <Button variant="accent" onClick={onConfirm}>Spara</Button>
  </SheetFooter>
</Sheet>

// NavigationDrawer — portal pattern
return createPortal(
  <>
    <button type="button" className="nav-drawer__backdrop" aria-label="Stäng meny" onClick={onClose} />
    <aside className="nav-drawer nav-drawer--obsidian-depth" role="dialog" aria-modal="true">
      {/* header, DrawerModeToggle, rows */}
    </aside>
  </>,
  document.body,
);
```

Tall editor:

```tsx
<Sheet open={open} onClose={onClose} size="tall" title="Redigera projekt">
  <SheetBody className="px-[var(--ds-space-5)]">{editor}</SheetBody>
</Sheet>
```

---

## Do

- Portal sheets to `document.body` default.
- Use SheetFooter for button pairs; accent + ghost hierarchy.
- Close drawer on navigation automatically (already in NavigationDrawer).
- Provide Swedish aria labels on all dismiss targets.
- Use `size="tall"` for editors exceeding default panel height.

---

## Don't

- Stack multiple modal sheets without z-index plan.
- Put primary hub content only inside sheets—hubs use HubPageShell.
- Modify NavigationDrawer structure without locked UX approval.
- Remove swipe-to-close or Escape handlers.
- Use sheets for full-zone navigation—use 3-zone routes instead.
- Leave body overflow hidden after sheet unmount (Sheet cleanup restores).

---

## Future Improvements

- Unified overlay z-index scale doc linking Sheet, drawer, ResurserOverlay.
- Focus return hook shared between Sheet and NavigationDrawer.
- Exit animation for drawer matching enter (optional, reduced-motion off).
- Storybook: sheet placements × tall × hideHeader matrix.
- Migrate legacy bespoke modals to Sheet component.
- Document ResurserOverlay relationship in navigation spec appendix.
- Smoke test: Escape closes open sheet in e2e harness.
- Audit z-index stacking when Sheet opens above NavigationDrawer.
- Extract shared `useOverlayFocusReturn` for menu button focus restoration.
