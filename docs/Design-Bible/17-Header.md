# Chapter 17 — Header

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [16-Cards.md](./16-Cards.md)  
> **Next chapter:** [18-Dock.md](./18-Dock.md)


---

## Purpose

This chapter specifies the **app crown header**—the top chrome housing menu, identity, and primary Eye action.

The header is locked by DAD (design-calm.mdc). It is not a toolbar. Implementation centers on `AppHeaderBar` → `DesignPackCenterHeader` with `executive-premium` variant for production Executive Midnight.

---

## Philosophy

Visual hierarchy is **binding**:

1. **LIVSKOMPASSEN** — identity
2. **Ögat (Eye)** — primary function
3. **All other actions** — secondary (shield, compass toggle, avatar)

The header floats in glass/plate material above scenic ambient. It never accumulates tabs, breadcrumbs, or search fields. Complexity stays in hub shells (Chapter 15), not the crown.

Structure (DAD):

```
[Meny]  LIVSKOMPASSEN  ◇ ◇ ◇  [Skydd] [Ögat] [Sekundär]
```

---

## Visual Rules

| Layer | Class | When |
|-------|-------|------|
| Shell (design pack) | `.app-header-bar--design-pack` | `designPackActive \|\| executivePremium` |
| Shell (legacy) | `.glass-header-bar--kanon` | fallback |
| Inner | `.design-pack-header` | always via DesignPackCenterHeader |
| Premium variant | `.design-pack-header--executive-premium` | `headerVariant="executive-premium"` |

**Title:** Cinzel/Outfit, uppercase, tracking `0.14em`, accent-light with gold text-shadow.

**Ornament:** three diamond spans below title—never replace with icons.

**executive-premium:** title locked to `LIVSKOMPASSEN` (not route title); `centerAction` in actions row; **no** headerQuickToggle compass in bar (compass lives in dock, Chapter 19).

---

## Sizing

| Element | Size |
|---------|------|
| Header min-height | 4rem (`design-pack-header`) |
| Menu / action chrome btn | 2.75rem × 2.75rem circle |
| Title | 13px bold uppercase |
| Ornament diamonds | 1.5rem / 2rem center |
| Max width | `min(100vw - 1rem, 26rem)` centered grid |

Legacy glass header bar follows `index.css` kanon spacing when design pack inactive.

---

## Spacing

- Grid: `auto | minmax(0,1fr) | auto` with `gap 0.35rem`.
- Center column: `gap-1.5` between title and ornament.
- Actions: `gap-1.5` flex row on right rail.
- App shell: `app-header__inner` px-3 pt-2 pb-1 under design pack.

---

## States

| State | Behavior |
|-------|----------|
| Menu collapsed | `aria-expanded={false}` on menu button |
| Menu expanded | `aria-expanded={true}` |
| Default variant | Route title from `useDesignPackCenterTitle` except premium |
| executive-premium | Title hardcoded LIVSKOMPASSEN; eye in actions |
| Design pack off | Glass header bar kanon wrapper |

`data-header-variant="executive-premium"` on shell for theme CSS hooks.

---

## Examples

1. **AppHeaderBar.tsx** — chooses design-pack shell vs glass; passes `headerVariant`, `centerAction`, `headerQuickToggle`.
2. **DesignPackCenterHeader.tsx** — 3-column grid, menu glyph, title, ornament, actions.
3. **ME-midnight-executive** theme overrides in `executive-chrome.css` for premium header eye slot sizing.
4. **MainLayout** — supplies actions (shield, eye, secondary) as `actions` ReactNode.

Route-specific titles (e.g. zone name) appear in **hub** headers, not replacing LIVSKOMPASSEN in executive-premium.

---

## Accessibility

- Header element: `aria-label={title}` on `<header>`.
- Menu: `aria-label="Öppna meny"`, `aria-expanded` bound to drawer.
- Icon actions: Swedish labels on each chrome button.
- Title is visible `<h1>`—do not duplicate h1 in page body on same view.
- Touch targets 44px on all header chrome buttons.

---

## Animations

- Menu/action hover: `translateY(-1px)` on chrome buttons.
- No title morphing or crossfade between routes in executive-premium (title static).
- Header background: gradient fade to transparent under design pack—no scroll-hide animation.

Reduced motion: keep opacity-only feedback if hover translate disabled.

---

## Code Examples

```tsx
// AppHeaderBar.tsx
<AppHeaderBar
  menuExpanded={menuExpanded}
  onMenuClick={toggleDrawer}
  actions={<HeaderActions />} // shield, eye, secondary
  headerVariant="executive-premium"
  centerAction={optionalCenter}
/>

// DesignPackCenterHeader — title lock
const title = executivePremium ? 'LIVSKOMPASSEN' : routeTitle;

<header className={clsx('design-pack-header', executivePremium && 'design-pack-header--executive-premium')}>
  <h1 className="design-pack-header__title">{title}</h1>
  <div className="design-pack-header__ornament" aria-hidden>...</div>
</header>
```

Authority: `.cursor/rules/design-calm.mdc` § HEADER (LÅST).

---

## Do

- Keep hierarchy: LIVSKOMPASSEN > Eye > other actions.
- Use `executive-premium` for Midnight Executive prod home shell.
- Center the title + ornament; flanking menu and actions symmetrically.
- Route wayfinding in HubPageShell / ExecutiveHubHeader below crown.

---

## Don't

- Add search bars, tabs, or fourth hierarchy level to header.
- Replace LIVSKOMPASSEN with module names in executive-premium.
- Move compass into header bar in premium variant (dock only, DAD locked).
- Let icons compete with logotype size or glow.
- Redesign header more complex without new DAD + Pontus OK.

---

## Future Improvements

- Single header story in Theme Lab showing default vs executive-premium diff.
- Extract `HeaderChromeButton` token docs linking to Chapter 20 buttons.
- Automated smoke: assert executive-premium title text + ornament present.
- Document Eye action wiring (Fyren / quick toggle) separately from visual spec.
