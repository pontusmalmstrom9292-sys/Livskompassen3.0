# Chapter 06 — Spacing System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [05-Typography.md](./05-Typography.md)  
> **Next chapter:** [07-Grid-System.md](./07-Grid-System.md)

---


## Purpose

Defines the **spatial rhythm** of Livskompassen — padding, gaps, touch targets, and dock clearance. Spacing creates calm through predictable 4px-base increments.

Coverage:

- `--ds-space-*` scale (0 → 20)
- Touch target `--ds-touch-target` (44px)
- Dock clearance `--ds-space-dock-clearance`
- Tailwind spacing aliases
- Module patterns: hub shell, bento cards, executive home

Files: `src/design-system/tokens/spacing.ts`, `variables.css`, `tailwind.config.js`, `index.css`, `obsidian-calm-2.css`.

---

## Philosophy

| Principle | Spacing expression |
|-----------|-------------------|
| Predictability | 4px base — no arbitrary 13px gaps |
| Touch-first | 44px minimum interactive targets (G85) |
| Breathing room | Cards need internal air — cramped = anxiety |
| Dock respect | Content never hides under floating dock |
| Progressive density | Low-capacity days reduce gap, not compass |

Spacing is **cognitive offloading** — the eye learns one rhythm across Hjärtat, Vardagen, Familjen.

### Base unit

**4px (0.25rem)** — all spacing tokens are multiples.

---

## Visual Rules

### Scale reference

| Token | rem | px | Typical use |
|-------|-----|-----|-------------|
| `--ds-space-1` | 0.25 | 4 | Tight inline gap |
| `--ds-space-2` | 0.5 | 8 | Icon-text gap |
| `--ds-space-3` | 0.75 | 12 | Compact padding |
| `--ds-space-4` | 1 | 16 | Standard padding |
| `--ds-space-5` | 1.25 | 20 | Section inner |
| `--ds-space-6` | 1.5 | 24 | Card padding |
| `--ds-space-8` | 2 | 32 | Section gap |
| `--ds-space-10` | 2.5 | 40 | Large section |
| `--ds-space-12` | 3 | 48 | Hero vertical |
| `--ds-space-16` | 4 | 64 | Page section |
| `--ds-space-20` | 5 | 80 | Rare hero margin |

Tailwind: `p-4` maps to standard; prefer `p-ds-*` when DS utilities exist.

### Dock clearance

```css
--app-dock-clearance: calc(8.5rem + env(safe-area-inset-bottom, 0px) + 1.5rem);
--ds-space-dock-clearance: var(--app-dock-clearance);
```

All scrollable hub content must include bottom padding ≥ dock clearance.

### Touch targets

`--ds-touch-target: 2.75rem` (44px) — minimum height/width for buttons, dock items, compass tap area.

Executive snabbstart toggle: min-height 36px (compact chrome exception — label only, paired with larger core 5.75rem).

---

## Sizing

Spacing tokens ARE sizing for layout gaps. Component-specific:

| Component | Key dimensions |
|-----------|----------------|
| Bento icon box | 2.25rem × 2.25rem |
| Hub header padding | 0.875rem 1rem |
| Module toolbar | 0.375rem inner |
| Exec card radius context | padding + 1.25rem radius |
| Compass float | 4.25rem (home layout) |
| Snabbstart core | 5.75rem diameter |

---

## Spacing

### Hub page shell

- Top bar gap: 0.5rem (`hub-page-shell__header-aside`)
- Header margin-bottom executive: 0.75rem
- Content horizontal: 1rem mobile, scales at sm+

### Bento cards

- Internal padding: 1rem–1.25rem standard
- Gap between cards in grid: 0.75rem–1rem
- Icon box to title: 0.5rem–0.75rem

### Executive home (`home-layout-a--executive`)

- Hero card: implicit padding via hero component
- Section label to cards: 0.5rem
- Snabbstart stage: 1rem vertical padding, 0.25rem horizontal

### Forms / inputs

- Label to field: `--ds-space-2`
- Field to field: `--ds-space-4`
- Form section break: `--ds-space-8`

---

## States

| State | Spacing behavior |
|-------|------------------|
| Default | Standard scale |
| Compact / low capacity | Reduce gap one step (8→6), never touch target |
| Expanded snabbstart | Stage min-height 9.5rem |
| Modal | Padding `--ds-space-6`; footer actions gap `--ds-space-3` |
| Sheet | Bottom safe-area + `--ds-space-4` |
| Keyboard open (mobile) | Dock clearance still applies to scroll container |

---

## Examples

**Hub header bento** — padding 0.875rem 1rem, border-radius 1.25rem.

**Module toolbar** — padding 0.375rem, gap between pills 0.5rem.

**Calm card content** — p-4 or p-5 (16–20px).

**Dock satellite buttons** — gap 0.45rem icon to label, min-height 5.5rem column.

**Fyren widget bar** — respects dock clearance on peek panel scroll.

---

## Accessibility

- 44px touch targets (WCAG 2.5.5 target size)
- Focus outline offset `--ds-focus-offset: 2px` — don't clip with negative margin
- Spacing between stacked links ≥ 8px to prevent mis-tap
- Screen reader order matches visual order — no CSS reorder without aria
- Zoom 200%: rem-based spacing reflows

Motorola G85 reference device — test thumb reach on dock + compass.

---

## Animations

Spacing animates rarely:

- Snabbstart chevron rotate 0.25s on open
- Hover lift `--ds-hover-lift: -2px` on bento cards (transform, not margin)
- Press scale `--ds-press-scale: 0.985` — no layout reflow

Morph transitions (Chameleon): 350ms — padding may cross-fade but shouldn't jump >8px.

Reduced motion: no animated margin/padding changes.

---

## Code Examples

```typescript
import { spacing } from '@/design-system/tokens/spacing';
// spacing[4] → var(--ds-space-4)
// spacing.dockClearance → var(--ds-space-dock-clearance)
```

```tsx
<main className="pb-ds-dock-clearance px-4 space-y-4">
  <section className="p-6 gap-4 flex flex-col">...</section>
</main>
```

```css
:root {
  --app-dock-clearance: calc(8.5rem + env(safe-area-inset-bottom, 0px) + 1.5rem);
  --ds-touch-target: 2.75rem;
}
```

```tsx
<button className="min-h-ds-touch min-w-ds-touch px-4">OK</button>
```

---

## Do

- Use `--ds-space-*` or Tailwind rem scale
- Include dock clearance on scroll regions
- Keep 44px touch targets
- Use 4px multiples
- Reduce gap (not target size) for compact mode

---

## Don't

- Magic numbers (13px, 17px) in module CSS
- Negative margin to "fix" dock overlap
- Shrink touch targets on mobile
- Different spacing systems per zone
- px-based padding in new components
- Forget safe-area-inset-bottom on iOS/Android

---

## Future Improvements

| Item | Notes |
|------|-------|
| Spacing smoke | Detect px padding in modules |
| Capacity-aware token | `--ds-space-density-factor` |
| Tablet breakpoints | Document 768+ spacing shifts |
| Widget clearance spec | Fyren + dock combined calc |
| Storybook spacing page | Visual scale reference |

---

*Sources: spacing.ts, variables.css, tailwind.config.js, index.css, obsidian-calm-2.css, executive-chrome.css.*
