# Chapter 07 — Grid System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [06-Spacing-System.md](./06-Spacing-System.md)  
> **Next chapter:** [08-Elevation.md](./08-Elevation.md)

---

## Purpose

This chapter defines **how content columns and rows align** across Executive Midnight — home bento layouts, hub tiles, dock slot grids, calendar weeks, and launcher matrices. Grids encode hierarchy without extra chrome: the compass column is wider, hero tiles span rows, and hub content reflows at documented breakpoints.

All new layout work should use **CSS Grid** or **flex with tokenized gap** from [06-Spacing-System.md](./06-Spacing-System.md). Float-based or absolute-positioned column hacks are legacy only.

---

## Philosophy

### Structure without spreadsheet aesthetics

Grids serve neuroadapted scanning:

- **Predictable columns** — user learns once per surface (home bento, dock, hub)
- **Hero span** — tall tiles and center compass break symmetry intentionally ([01-Vision.md](./01-Vision.md))
- **Mobile collapse** — single column first; complexity emerges at `min-width` breakpoints
- **No infinite masonry** — bento grids have fixed row semantics, not Pinterest chaos

Executive Midnight home hierarchy ([design-calm.mdc](../../.cursor/rules/design-calm.mdc)): Livskompassen → Ögat → Dagens Reflektion → Kompass → övrigt. Grid placement reinforces that order.

---

## Visual Rules

### Breakpoint philosophy

Livskompassen uses **content-driven breakpoints**, not a rigid Material 12-column system:

| Breakpoint | Typical behavior | Example source |
|------------|------------------|----------------|
| `≤520px` | Single column, span resets | `home-layout-a--calm` |
| `≥521px` | 2-column bento, asymmetric fr | `1.15fr 0.85fr` calm home |
| `≥768px` | 3–4 column launcher / module grids | `liv-launcher-grid`, index.css |
| Desktop hub | Sticky filter rows, wider gutters | Valvet desktop |

Prefer `minmax(0, 1fr)` on columns to prevent grid blowout from long unbroken strings.

### Canonical grid patterns

#### 1. Home layout A (calm / executive)

```css
/* src/styles/obsidian-calm-2.css */
.home-layout-a--calm .home-layout-a__grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  grid-template-rows: auto auto;
  gap: 0.55rem;
}
.home-layout-a--calm .home-layout-a__tile--tall {
  grid-row: span 2;
}
@media (max-width: 520px) {
  .home-layout-a--calm .home-layout-a__grid {
    grid-template-columns: 1fr;
  }
  .home-layout-a--calm .home-layout-a__tile--tall {
    grid-row: span 1;
  }
}
```

**Meaning:** left column slightly dominant; tall tile occupies two rows on tablet+; phone stacks vertically.

#### 2. Prod dock bar (5-slot + hero compass)

```css
/* src/styles/basta-design.css — exec-dock-bar grid */
grid-template-columns: repeat(5, minmax(0, 1fr));
```

Center slot hosts breakout compass (`exec-dock-bar__compass`) with negative margin-top — grid assigns column, compass breaks vertical bounds via absolute sizing ([08-Elevation.md](./08-Elevation.md)).

#### 3. Compass rose micro-grid (3×3)

```css
/* src/index.css — decorative compass grid */
grid-template-columns: 3.1rem 4.65rem 3.1rem;
grid-template-rows: 3.1rem 4.65rem 3.1rem;
/* compact variant */
grid-template-columns: 2.35rem 3.65rem 2.35rem;
grid-template-rows: 2.35rem 3.65rem 2.35rem;
```

Center cell is largest — visual anchor for compass glyph geometry.

#### 4. Launcher grid (responsive module matrix)

```css
/* src/styles/obsidian-calm-2.css */
.liv-launcher-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 1024px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
```

#### 5. Module bento (3→4 columns)

```css
/* src/index.css */
grid-template-columns: repeat(3, 1fr);
@media (min-width: …) {
  grid-template-columns: repeat(4, 1fr);
}
```

#### 6. Calendar week row

```css
/* src/index.css */
grid-template-columns: repeat(7, minmax(0, 1fr));
```

#### 7. Hjärtat bento shell

`HjartatBentoShell.tsx` wraps content in `.hjartat-bento-shell` — scroll island + inner content grid; follows hub-page-shell bento header pattern from `premium-polish.css`.

---

## Sizing

Grid **track sizing** uses `fr`, fixed `rem`, or `minmax(0, 1fr)` — not percentage widths inside nested flex.

| Surface | Column spec | Rationale |
|---------|-------------|-----------|
| Home calm | `1.15fr 0.85fr` | Subtle asymmetry — hero/reflection bias left |
| Dock | `repeat(5, minmax(0, 1fr))` | Equal zones except compass overflow |
| Launcher | 1 / 2 / 3 cols | Progressive disclosure by viewport |
| Bento module | 3 or 4 equal | Square-ish tiles with `aspect-ratio` optional |
| Calendar | 7 equal | Week alignment |

**Tile minimum heights:** calm icon tiles `min-height: 58px` — below touch target but full-row tap area via grid cell padding.

---

## Spacing

Grid **gap** should align with spacing tokens ([06-Spacing-System.md](./06-Spacing-System.md)):

| Pattern | Gap | Token equivalent |
|---------|-----|------------------|
| Home calm bento | `0.55rem` | ~`--ds-space-2` (migrate) |
| Bento cards (Tailwind) | `gap-1.5` (0.375rem) | `--ds-space-1-5` |
| DS stack layouts | `var(--ds-space-4)` | components.css |
| Dock internal | `var(--ds-space-2)` | ds-dock |

Use consistent gap inside a grid — do not mix `0.55rem` and `var(--ds-space-3)` on the same surface without reason.

---

## States

| State | Grid behavior |
|-------|---------------|
| **Default** | Full column template active |
| **Collapsed hub** (Snabbstart) | Grid hidden; toggle reveals — no column reflow on page |
| **Active dock zone** | Column unchanged; accent on cell content only |
| **Loading skeleton** | Preserve grid template — skeleton cells match tile spans |
| **Empty state** | Single column centered within grid area; do not collapse grid container |
| **Reduced motion** | No layout animation; instant column switch at breakpoints |

**Chameleon morph:** SuperModule delegates swap content inside fixed grid shell — grid definition stays in shell, not delegate.

---

## Examples

### Executive home (flat layout A)

`.home-layout-a--executive` sets `--exec-card-radius: 1.25rem` and stacks hero + surface cards without bridge layout. Hero card spans full width; secondary cards follow bento or vertical stack depending on home layout preference (`homeLayoutPreference.ts`).

### Bento card tile

```css
/* src/index.css @apply pattern */
.bento-card {
  /* flex column center — sits inside grid cell */
  @apply flex cursor-pointer flex-col items-center justify-center gap-1.5 p-3.5;
}
```

### Valvet desktop sticky filter

Filter row uses `z-index: 10` (`--ds-z-raised`) within hub scroll — grid is one column; sticky is row-level, not column split.

### Theme registry note

`themeRegistry.ts` maps hub themes (J-pack, I-stone, etc.) — grid structure is **theme-agnostic**; only accent surfaces change. `THEME_LOCKED = true` → prod uses Bästa design tokens; grids remain stable.

---

## Accessibility

- **DOM order = visual order** on mobile single-column collapse — do not reorder with CSS Grid `order` for primary navigation
- **Keyboard grid** — dock cells remain focusable in DOM order left-to-right
- **Zoom reflow** — `minmax(0, 1fr)` prevents horizontal overflow at 200% zoom
- **Touch targets** — grid cell padding expands hit area even when glyph is smaller ([06-Spacing-System.md](./06-Spacing-System.md))

---

## Animations

Grid templates **must not animate** (`grid-template-columns` transitions forbidden).

Allowed motion inside cells:

- Stagger fade-up on home items (`executiveHomeMotion.ts` — `staggerChildren: 0.08`)
- Tile hover lift on `.bento-card` (transform only)
- Snabbstart expand — height/auto animation on container, not column count

At `prefers-reduced-motion: reduce`, stagger becomes instant opacity or no animation.

---

## Code Examples

### Framer stagger on home grid children

```ts
// src/modules/core/home/executive/executiveHomeMotion.ts
export const execHomeStaggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};
export const execHomeStaggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: EXEC_HOME_ITEM_TRANSITION },
};
```

### Hjärtat bento shell

```tsx
// src/modules/features/lifeJournal/diary/components/HjartatBentoShell.tsx
<div className={clsx('hjartat-bento-shell', className)}>
  <div className="hjartat-bento-shell__content">{children}</div>
</div>
```

### Responsive launcher

```css
.liv-launcher-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: var(--ds-space-3, 0.75rem);
}
```

### Dock five-column

```css
.exec-dock-bar {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: end;
}
```

---

## Do

- Use CSS Grid for bento, dock, launcher, and calendar layouts
- Collapse to single column on narrow viewports before shrinking text
- Keep compass center column in dock grid even when glyph overflows vertically
- Use `minmax(0, 1fr)` on flexible columns
- Match skeleton loaders to final grid spans

---

## Don't

- Don't use tables for layout
- Don't animate `grid-template-columns` or `grid-template-rows`
- Don't reorder primary navigation with CSS `order`
- Don't create new 12-column Bootstrap-style grids — use documented patterns
- Don't put unbounded flex children inside grid cells without `min-width: 0`

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Unified bento token** | `--ds-grid-gap-bento`, `--ds-grid-cols-home` |
| **Grid Storybook** | Home / dock / launcher at 360 / 412 / 768 widths |
| **Migrate calm gap** | `0.55rem` → `--ds-space-2` |
| **08-Elevation prev link** | Update to point here instead of legacy Border Radius doc |
| **Grid lint** | Smoke test for dock 5-col + compass breakout |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Gap & padding tokens | [06-Spacing-System.md](./06-Spacing-System.md) |
| Layer stacking in cells | [08-Elevation.md](./08-Elevation.md) |
| Card surfaces in tiles | [09-Glass-System.md](./09-Glass-System.md) |
| Tile accent gradients | [10-Lighting.md](./10-Lighting.md) |
| Card shadow in grid | [11-Shadow-System.md](./11-Shadow-System.md) |
| Stagger motion | [12-Animation-System.md](./12-Animation-System.md) |
| Bento card spec | [16-Cards.md](./16-Cards.md) |
| Dock spec | [18-Dock.md](./18-Dock.md) |
| Compass grid | [19-Compass.md](./19-Compass.md) |
