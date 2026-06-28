# Chapter 18 — Dock

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [17-Header.md](./17-Header.md)  
> **Next chapter:** [19-Compass.md](./19-Compass.md)

---

## Purpose

This chapter specifies the **bottom dock** — Livskompassen's primary zone navigation and the physical stage for the locked compass. The dock exists to **carry the compass**, not compete with it.

All production chrome routes through `FloatingDock` → `ExecutiveDockBar` when the active theme uses reference-dock chrome (Midnight Executive, mockup themes, or design-pack chrome). Legacy Fyren band layout remains for non-executive themes only.

If a change makes the dock louder than the compass, thicker than glass capsule spec, or moves zone labels outside DAD order, it does not ship without PMIR + Pontus OK.

---

## Philosophy

### The dock is quiet infrastructure

The dock is **not** a tab bar from a productivity app. It is a thin, glass-based band that anchors the user in the three-zone Life OS while the compass holds visual and emotional center.

| Principle | Meaning |
|-----------|---------|
| **Compass first** | Side icons are subordinate; labels are small uppercase whispers |
| **Glass, not chrome** | Blur, inner highlight, gold lip — never flat Material tabs |
| **Zone truth** | Items map to life domains (Familjen, Hjärtat, Planering, Valv), not feature sprawl |
| **One center** | Compass slot is grid column 3 (extended) or column 2 (mix-E); never relocated |

### Two layout modes (Executive)

| Mode | Class | Zones | When |
|------|-------|-------|------|
| **extended** (default) | `exec-dock-bar--extended` | 6 slots: Anteckning · Familj · **Kompass** · Hjärtat · Inkast · Resurser | Default home layout; snabbstart on compass tap at `/` |
| **mix-E** | `exec-dock-bar--mix-e` | 4 slots: Familjen · **Kompass** · Valv · Planering | User preference via `homeLayoutPreference`; classic reduced chrome |

Mode is persisted in `localStorage` key `livskompassen_home_layout` and synced via `HOME_LAYOUT_CHANGED_EVENT`.

### FloatingDock orchestration

`FloatingDock.tsx` decides which dock renders:

- **referenceDock** (`ExecutiveDockBar` inside `dock-shell--reference-dock`) when theme is Midnight Executive, mockup, or design-pack chrome
- **Legacy Fyren band** (`dock-shell--fyren`, `floating-dock`, `LivskompassMark`) otherwise

The reference dock is the canonical Executive Midnight implementation per DAD.

---

## Visual Rules

### Glass capsule (exec-dock-bar)

The executive dock bar (`.exec-dock-bar`) is a **full-width glass capsule** flush to the bottom safe area:

| Layer | Implementation |
|-------|----------------|
| Body | `backdrop-filter: blur(20px) saturate(140%)`, gradient surface stack |
| Border | Top + sides: gold mix `color-mix(in srgb, var(--accent) 22%, transparent)`; bottom open |
| Top lip | `::before` — horizontal gold gradient hairline with glow |
| Bottom lip | `::after` — mirrors top at safe-area inset |
| Radius | `1.35rem 1.35rem 0 0` — rounded top corners only (sits on screen edge) |
| Shadow | Inset highlight + upward gold ambient + deep drop shadow |

The dock must read as **floating glass on obsidian**, not a solid toolbar.

### Side buttons (ExecDockSide)

Each side zone uses BEM block `exec-dock-bar__side`:

- Icon wrapper: `exec-dock-bar__icon` (min 2.75 rem hit area)
- Label: `exec-dock-bar__label` — 0.4 rem uppercase, gold-muted mix
- Glyph: Lucide icons at 1.15 rem (`strokeWidth={1.5}`) or `DrawerL2Icon` for Familjen in mix-E
- Active: `exec-dock-bar__side--active` — `var(--accent-light)` label + glyph glow

### Compass slot (locked geometry)

`.exec-dock-bar__compass-slot` is **always centered** in the grid:

- **extended:** 6-column grid; slot at column 3
- **mix-E:** 4-column grid; slot at column 2

The compass button (`.exec-dock-bar__compass`) breaks upward with negative margin (`margin-top: -4.35rem`) so the rose sits above the capsule — this is mandatory DAD behavior.

### Legacy floating-dock (non-executive)

When reference dock is off, `floating-dock` uses `dock-hub-band` rail with `LivskompassMark` — still center-weighted but without exec-dock-bar glass capsule. Do not extend legacy patterns into Executive themes.

---

## Sizing

| Token / element | Value | Notes |
|-----------------|-------|-------|
| `--dock-stack-height` | `5.85rem` | Reference dock shell |
| `--app-dock-clearance` | `calc(5.5rem + env(safe-area-inset-bottom))` | Reference dock content padding |
| `.exec-dock-bar` min-height | `3.15rem` | Capsule band |
| `.exec-dock-bar` top padding | `2.35rem` | Room for compass breakout |
| Side touch target | min `2.5rem × 2.5rem` | Icon area ≥ 2.75 rem |
| Compass button | `5.35rem × 5.85rem` | Circular/oval hit target |
| Side glyph | `1.15rem` | Lucide; L2 icon `1.4rem` in mix-E |
| Side label font | `0.4rem` | Uppercase, wide tracking |

Motorola G85 baseline: all side targets meet or exceed 44 px via icon wrapper padding.

---

## Spacing

```css
/* executive-chrome.css — reference dock shell */
.dock-shell.dock-shell--reference-dock {
  --dock-stack-height: 5.85rem;
  --app-dock-clearance: calc(5.5rem + env(safe-area-inset-bottom, 0px));
  padding: 0 !important;
  background: transparent !important;
}
```

| Rule | Spec |
|------|------|
| Grid gap | Implicit via `repeat(6|4, minmax(0, 1fr))` |
| Side padding | `0.35rem` horizontal on bar |
| Safe area | `padding-bottom: calc(0.35rem + env(safe-area-inset-bottom))` |
| Content clearance | All scrollable main areas use `--app-dock-clearance` |
| Fyren widget bar | Stacks above dock when enabled — additional clearance on widget routes |

Hub pages (`hub-view-lock`) must include dock clearance in their bottom padding.

---

## States

### Side button states

| State | Class / behavior |
|-------|------------------|
| Default | Gold-muted label and glyph |
| Active route | `exec-dock-bar__side--active` |
| Press | `transform: scale(0.96)` |
| Resurser open | `resurserOpen` drives active on Resurser side (overlay, not route) |

### Compass button states

| State | Class | Behavior |
|-------|-------|----------|
| Home | `exec-dock-bar__compass--home` | At `/` |
| Snabbstart open | `exec-dock-bar__compass--open` | Extended mode only; pulse animation |
| Long-press hold | `exec-dock-bar__compass--holding` | Scale 1.08; Fyren ring shows progress |
| Fyren progress | CSS var `--dock-hold` | 0–100% during 3 s Valv hold |

### Interaction matrix (center button)

| Context | Short tap | Long press (3 s) |
|---------|-----------|------------------|
| Extended + home | Toggle snabbstart | Open Valv via Fyren gate |
| Extended + not home | Navigate `/` | Open Valv |
| mix-E | Navigate `/` | Open Valv |
| Legacy dock | Navigate `/` | Open Valv |

`FyrenProgressRing` renders when `progress > 0` during hold.

### Resurser overlay

Tapping **Resurser** opens `ResurserOverlay` — a drawer-style overlay, not a route change. Side button shows active while open.

---

## Examples

### Example A — Extended dock (production default)

**Route:** any with `ME-midnight-executive`  
**Component chain:** `MainLayout` → `FloatingDock` → `ExecutiveDockBar` (`dockVariant="extended"`)

Visible order left → right:

```
Anteckning | Familj | [KOMPASS ↑] | Hjärtat | Inkast | Resurser
```

Compass uses `ExecutiveDecorCompass size="hero"`. At home, compass tap toggles snabbstart drawer.

### Example B — mix-E dock

**Trigger:** `setExecutiveHomeLayoutMode('mix-e')` or user preference UI

```
Familjen | [KOMPASS ↑] | Valv | Planering
```

Four columns; Familjen uses `DrawerL2Icon`. No Anteckning/Inkast/Resurser on dock — those accessed elsewhere.

### Example C — Legacy Fyren band

**Theme:** non-executive, non-mockup

Uses `LivskompassMark`, `dock-hub-band`, `FyrenDockHandle`. Keep for backward compatibility; do not copy into Executive Midnight.

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Landmark | `<nav aria-label="Huvudnavigation">` on `ExecutiveDockBar` |
| Side buttons | `aria-label={label}`, `aria-current="page"` when active |
| Compass | Dynamic `aria-label` — includes snabbstart + Valv hold hint |
| Snabbstart | `aria-expanded` when open (extended + home) |
| Focus | Visible focus on all dock buttons; compass is real `<button>` |
| Touch | Min 44 px targets on side icons and compass |
| Motion | `exec-compass-pulse` respects reduced motion via global CSS policy |
| Screen reader | Labels in Swedish: Familj, Hjärtat, Hamn, etc. |

---

## Animations

| Animation | Trigger | Spec |
|-----------|---------|------|
| Side press | `:active` | `scale(0.96)`, 150 ms ease |
| Compass hover | `:hover` | `scale(1.03)` |
| Compass hold | `--holding` | `scale(1.08)` |
| Snabbstart open | `--open` | `exec-compass-pulse` 3.5 s infinite ease-in-out |
| Fyren ring | long-press progress | SVG ring driven by `progress` prop |

No bounce easing on dock chrome. Pulse is subtle gold glow only — not attention-grabbing neon.

---

## Code Examples

### ExecutiveDockBar (extended excerpt)

```tsx
// src/modules/core/layout/ExecutiveDockBar.tsx
<nav className="exec-dock-bar exec-dock-bar--extended" aria-label="Huvudnavigation">
  <ExecDockSide label="Anteckning" active={pathname.startsWith('/widget/anteckning')} onClick={onAnteckning}>
    <PenLine className="exec-dock-bar__glyph" strokeWidth={1.5} />
  </ExecDockSide>
  {/* … Familj … */}
  <div className="exec-dock-bar__compass-slot">
    <button
      type="button"
      className={clsx(
        'exec-dock-bar__compass',
        isHome && 'exec-dock-bar__compass--home',
        snabbstartOpen && 'exec-dock-bar__compass--open',
        isHolding && 'exec-dock-bar__compass--holding',
      )}
      aria-label="Hamn. Håll tre sekunder för Valv."
      {...centerHoldHandlers}
    >
      {showFyrenRing ? <FyrenProgressRing progress={progress} /> : null}
      <ExecutiveDecorCompass size="hero" className="exec-dock-bar__compass-mark" />
    </button>
  </div>
  {/* … Hjärtat · Inkast · Resurser … */}
</nav>
```

### FloatingDock reference path

```tsx
// src/modules/core/layout/FloatingDock.tsx
<div className="dock-shell dock-shell--reference-dock">
  <ExecutiveDockBar
    dockVariant={mixEDock ? 'mix-e' : 'extended'}
    pathname={pathname}
    isHome={isHome}
    /* … */
  />
</div>
```

### Glass capsule CSS anchor

```css
/* src/styles/executive-chrome.css */
.exec-dock-bar {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  backdrop-filter: blur(20px) saturate(140%);
  border-radius: 1.35rem 1.35rem 0 0;
  /* … */
}
.exec-dock-bar--mix-e {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
```

---

## Do

- Use `ExecutiveDockBar` + `exec-dock-bar` for all Executive Midnight dock work
- Keep compass in `exec-dock-bar__compass-slot` at grid center
- Preserve glass capsule layers (`::before`, `::after`, blur, gold border mix)
- Wire new zone actions through `FloatingDock` props — not parallel dock components
- Respect `HOME_LAYOUT_CHANGED_EVENT` when reading layout mode
- Run `npm run smoke:locked-ux` after dock changes
- Keep `@locked DOCK_ZONES` comment in `FloatingDock.tsx` for smoke tests

---

## Don't

- Don't flatten the dock to equal-width tabs without compass breakout
- Don't move compass off center column or into header-only navigation
- Don't add a seventh zone to extended dock without PMIR
- Don't use semicircle arc dock patterns (legacy `floating-dock__arc`) in executive themes
- Don't hardcode hex colors in dock TSX — use CSS tokens in `executive-chrome.css`
- Don't remove long-press Valv gate from compass button
- Don't make dock background opaque solid navy — glass is mandatory

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Unified dock token file** | Extract `--dock-*` custom properties to design-system tokens |
| **mix-E discoverability** | In-app explainer when switching from extended to mix-E |
| **Reduced motion audit** | Explicit `@media (prefers-reduced-motion)` for compass pulse |
| **Basta Design dock** | `BastaDesignDock` parity check against exec-dock-bar spec |
| **Widget clearance matrix** | Document combined Fyren + dock clearance per route |

---

### Related chapters

| Topic | Chapter |
|-------|---------|
| Compass asset & sizes | [19-Compass.md](./19-Compass.md) |
| Header chrome | [17-Header.md](./17-Header.md) |
| Motion tokens | [12-Motion.md](./12-Motion.md) |
| Locked UX | `.cursor/rules/locked-ux-features.mdc` |
| Theme / executive chrome | `src/styles/executive-chrome.css` |
| Vision & gaze order | [01-Vision.md](./01-Vision.md) |

---

*End of Chapter 18 — Dock*
