# Chapter 06 — Spacing System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [05-Typography.md](./05-Typography.md)  
> **Next chapter:** [07-Grid-System.md](./07-Grid-System.md)

---

## Purpose

This chapter defines **how far apart things sit** in Executive Midnight — padding, gaps, margins, touch targets, and dock clearance. Spacing is the primary tool for cognitive offloading: generous rhythm reduces visual noise on dark glass surfaces and keeps hubs scannable under fatigue.

Every layout decision must map to `--ds-space-*` tokens from `src/design-system/tokens/css/variables.css` or documented app-level aliases (`--app-dock-clearance`). Arbitrary pixel gaps in feature modules are technical debt.

---

## Philosophy

### Breath, not density

Livskompassen is not a data-dense dashboard. Spacing communicates:

- **Calm** — air between cards lets the eye rest on navy glass
- **Hierarchy** — tighter inner padding vs wider section gaps signal nesting
- **Touch safety** — Motorola G85 and ADHD-friendly targets require ≥44px hit areas
- **Chrome respect** — scroll regions must never collide with the dock or safe areas

### One rhythm, many surfaces

The scale uses a **4px base** (0.25rem steps). Half-steps (`--ds-space-0-5`, `--ds-space-1-5`, etc.) exist for fine-tuning chips and dock labels without breaking the grid.

Philosophy from [02-Design-Philosophy.md](./02-Design-Philosophy.md): prefer **one consistent rhythm** over per-screen improvisation. [03-Core-Principles.md](./03-Core-Principles.md) requires mobile-first touch targets — spacing and sizing are inseparable here.

---

## Visual Rules

### Canonical spacing scale

| Token | Value | px @ 16px root | Typical use |
|-------|-------|----------------|-------------|
| `--ds-space-0` | `0` | 0 | Reset |
| `--ds-space-px` | `1px` | 1 | Hairline offsets |
| `--ds-space-0-5` | `0.125rem` | 2 | Chip vertical padding |
| `--ds-space-1` | `0.25rem` | 4 | Icon–label micro gap |
| `--ds-space-1-5` | `0.375rem` | 6 | Compact button padding |
| `--ds-space-2` | `0.5rem` | 8 | Dock icon gap, inline clusters |
| `--ds-space-2-5` | `0.625rem` | 10 | Dense list rhythm |
| `--ds-space-3` | `0.75rem` | 12 | Header row gap, modal title gap |
| `--ds-space-3-5` | `0.875rem` | 14 | Input vertical padding |
| `--ds-space-4` | `1rem` | 16 | Card inner padding (default) |
| `--ds-space-5` | `1.25rem` | 20 | Hero card padding, modal body |
| `--ds-space-6` | `1.5rem` | 24 | Section separation |
| `--ds-space-7` | `1.75rem` | 28 | Rare — large section breaks |
| `--ds-space-8` | `2rem` | 32 | Page horizontal inset (tablet+) |
| `--ds-space-10` | `2.5rem` | 40 | Avatar / icon well sizes |
| `--ds-space-12` | `3rem` | 48 | Large icon wells |
| `--ds-space-16` | `4rem` | 64 | Max dock label width cap |
| `--ds-space-20` | `5rem` | 80 | Textarea min-height |

Source: `src/design-system/tokens/css/variables.css`, mirrored in `src/design-system/tokens/spacing.ts`.

### Touch target

| Token | Value | Rule |
|-------|-------|------|
| `--ds-touch-target` | `2.75rem` (44px) | Minimum interactive width/height for buttons, dock sides, header icons |

Tailwind alias: `spacing['ds-touch']` → `var(--ds-touch-target)`.

### Dock clearance

Scrollable hub content must clear fixed bottom chrome:

| Token | Definition | Source |
|-------|------------|--------|
| `--app-dock-clearance` | `calc(8.5rem + env(safe-area-inset-bottom, 0px) + 1.5rem)` | `src/index.css` |
| `--ds-space-dock-clearance` | Alias → `--app-dock-clearance` | `variables.css` |

Bästa design prod shell overrides:

```css
/* src/styles/basta-design.css */
--app-dock-clearance: calc(6.15rem + env(safe-area-inset-bottom, 0px) + 0.65rem);
```

Apply to: `.hub-scroll-region`, `.calm-scroll-island`, any `overflow-y: auto` main column.

### Padding conventions (DS components)

From `src/design-system/styles/components.css`:

| Component | Padding / gap |
|-----------|---------------|
| `.ds-card` | `var(--ds-space-5)` |
| `.ds-button` | `var(--ds-space-2) var(--ds-space-5)` |
| `.ds-button--sm` | `var(--ds-space-1-5) var(--ds-space-4)` |
| `.ds-input` | `var(--ds-space-2) var(--ds-space-3)` |
| `.ds-header` | `var(--ds-space-3) var(--ds-space-4)` |
| `.ds-dock` | `var(--ds-space-2) var(--ds-space-3)`, gap `var(--ds-space-2)` |
| `.ds-modal-panel` | `var(--ds-space-5)` |
| Modal footer actions | `gap: var(--ds-space-2)`, `mt: var(--ds-space-5)` |

---

## Sizing

Spacing tokens double as **dimensional anchors** where width/height derive from rhythm:

| Use | Token | Notes |
|-----|-------|-------|
| Icon well sm | `--ds-space-8` | 32×32 px wells |
| Icon well md | `--ds-space-10` | 40×40 px |
| Icon well lg | `--ds-space-12` | 48×48 px |
| Textarea min-height | `--ds-space-20` | DS Input component |
| Dock label max-width | `--ds-space-16` | Prevents label overflow |
| Focus ring offset | `--ds-focus-offset: 2px` | Paired with focus ring |

**Press scale** (not spacing, but affects perceived size): `--ds-press-scale: 0.985`, `--ds-press-scale-strong: 0.96`.

---

## Spacing

### Vertical rhythm on hubs

Recommended stack (mobile-first):

1. **Page top inset** — `var(--ds-space-4)` below header safe area
2. **Section label → content** — `var(--ds-space-2)` to `var(--ds-space-3)`
3. **Card → card** — `var(--ds-space-3)` to `var(--ds-space-4)` in bento grids
4. **Section → section** — `var(--ds-space-6)` minimum
5. **Last block → dock** — `padding-bottom: var(--app-dock-clearance)`

### Horizontal rhythm

- **Phone:** `padding-inline: var(--ds-space-4)` on hub shells
- **Tablet+:** increase to `var(--ds-space-5)` or `var(--ds-space-6)` when max-width container allows
- **Executive home hero:** `1.15rem 1.35rem` inner padding on scenic header (legacy executive-chrome — migrate toward `--ds-space-5`)

### Gap vs margin rule

- **Flex/grid children:** use `gap: var(--ds-space-*)` — avoids margin collapse on glass cards
- **Stack utilities:** prefer DS gap tokens over chained `mb-*` when building new components
- **Legacy index.css:** many `@apply gap-*` Tailwind classes — new work uses CSS variables

---

## States

Spacing does not change dramatically per state, but **hit area expansion** does:

| State | Spacing behavior |
|-------|------------------|
| **Default** | `--ds-touch-target` minimum on all tappable chrome |
| **Hover** | No shrink — maintain target size (premium-polish forbids hover-only critical actions) |
| **Active / pressed** | Visual scale via `--ds-press-scale`; padding unchanged |
| **Focus-visible** | `--ds-focus-offset: 2px` ring outside border — ensure parent does not clip |
| **Disabled** | Same dimensions — do not shrink touch targets |
| **Compact mode** | Only Theme Lab / sandbox — not prod Executive Midnight |

Dock **active** side icons keep full `--ds-touch-target` even when label is `0.5625rem` Cinzel microtype.

---

## Examples

### Hub scroll with dock clearance

```css
/* src/index.css pattern */
.hub-scroll-region {
  padding-bottom: var(--app-dock-clearance);
  scroll-padding-bottom: var(--app-dock-clearance);
}
```

### DS card padding

```tsx
<GlassPanel padded /> /* → p-[var(--ds-space-4)] */
```

### Modal action row

```tsx
<ModalFooter className="mt-[var(--ds-space-5)] flex flex-wrap gap-[var(--ds-space-2)]" />
```

### Home calm bento gap

```css
/* src/styles/obsidian-calm-2.css */
.home-layout-a--calm .home-layout-a__grid {
  gap: 0.55rem; /* ≈ --ds-space-2 + hairline — prefer token migration */
}
```

### Executive checklist touch row

Executive settings rows use `min-height: 36px` in chrome CSS — **below** DS touch target; acceptable for secondary settings only, not primary navigation.

---

## Accessibility

- **44px minimum** — `--ds-touch-target` satisfies WCAG 2.5.5 target size for primary controls
- **Safe areas** — always include `env(safe-area-inset-bottom)` inside `--app-dock-clearance`
- **Scroll padding** — pair `padding-bottom` with `scroll-padding-bottom` so focused inputs scroll above dock
- **Zoom 200%** — rem-based scale preserves spacing proportionally
- **Reduced motion** — spacing unchanged when durations zero out (see [12-Animation-System.md](./12-Animation-System.md))

---

## Animations

Spacing tokens are **not animated directly**. Motion that affects layout:

- **Hover lift** `--ds-hover-lift: -2px` — translateY only; padding constant
- **Press scale** — transform scale, not margin collapse
- **Chameleon morph** — 350ms crossfade; shell padding stable (`--ds-duration-morph`)

Never animate `padding` or `gap` on hub cards — causes layout thrash and vestibular discomfort.

---

## Code Examples

### Token definition

```css
/* src/design-system/tokens/css/variables.css */
--ds-space-4: 1rem;
--ds-touch-target: 2.75rem;
--ds-space-dock-clearance: var(--app-dock-clearance);
```

### Tailwind bridge

```js
// tailwind.config.js
spacing: {
  'ds-touch': 'var(--ds-touch-target)',
  'ds-dock-clearance': 'var(--ds-space-dock-clearance)',
},
```

### TypeScript export

```ts
// src/design-system/tokens/spacing.ts
export const dsSpacing = {
  4: 'var(--ds-space-4)',
  touchTarget: 'var(--ds-touch-target)',
  dockClearance: 'var(--ds-space-dock-clearance)',
} as const;
```

### Inline gap in Navigation

```tsx
// src/design-system/components/Navigation.tsx
<nav className="flex items-end justify-center gap-[var(--ds-space-2)]" />
```

---

## Do

- Use `--ds-space-*` for all new padding, gap, and margin in design-system components
- Apply `--app-dock-clearance` to every scrollable hub main column
- Keep primary controls at or above `--ds-touch-target`
- Use `gap` on flex/grid instead of ad-hoc child margins
- Document exceptions when legacy px values remain (executive-chrome migration list)

---

## Don't

- Don't invent `p-[13px]` or `gap-3.5` without mapping to a token
- Don't reduce dock icon hit areas below 44px for aesthetic tightness
- Don't omit safe-area-inset from dock clearance calculations
- Don't use negative margins to overlap cards — use elevation and z-index instead
- Don't shrink textarea below `--ds-space-20` min-height on journal inputs

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Migrate executive-chrome px** | Replace `0.55rem`, `1.15rem` gaps with nearest `--ds-space-*` |
| **Spacing Storybook** | Visual ruler page in Theme Lab |
| **Tailwind spacing extend** | Map full `--ds-space-*` scale to `spacing.ds-*` utilities |
| **Dock clearance matrix** | Single source for basta vs legacy clearance values |
| **Compact accessibility audit** | Flag secondary rows below 44px |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Typography line rhythm | [05-Typography.md](./05-Typography.md) |
| Bento gaps & columns | [07-Grid-System.md](./07-Grid-System.md) |
| Z-index & clearance stack | [08-Elevation.md](./08-Elevation.md) |
| Glass inner padding | [09-Glass-System.md](./09-Glass-System.md) |
| Shadow depth (paired with lift) | [11-Shadow-System.md](./11-Shadow-System.md) |
| Motion on press/hover | [12-Animation-System.md](./12-Animation-System.md) |
| Dock geometry | [18-Dock.md](./18-Dock.md) |
| Accessibility targets | [28-Accessibility.md](./28-Accessibility.md) |
