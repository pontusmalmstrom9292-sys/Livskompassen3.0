# Chapter 12 — Animation System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [11-Layout.md](./11-Layout.md)  
> **Next chapter:** [13-Icons.md](./13-Icons.md)

---

## Purpose

This chapter defines **motion and transition behaviour** for Executive Midnight — the calm, premium layer that makes the app feel alive without demanding attention. Motion must support neuro-adaptive use: one clear change at a time, no bounce, no gaming HUD energy.

Coverage:

- CSS token durations and easings (`--ds-duration-*`, `--ds-ease-*`)
- Framer Motion presets in `@/design-system/motion`
- `useDsReducedMotion` / `prefers-reduced-motion` fallbacks
- Chameleon morph timing (`--ds-duration-morph`)
- Module-specific patterns (home stagger, dock fan, skeleton pulse)

Primary files: `src/design-system/tokens/animation.ts`, `src/design-system/motion/presets.ts`, `src/design-system/styles/premium-polish.css`, `src/modules/core/home/executive/executiveHomeMotion.ts`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Calm | Slow, confident easing — never elastic bounce |
| Clarity | Motion reveals hierarchy; it never decorates for its own sake |
| Safety | Reduced-motion users get instant state changes |
| Premium | Opacity + translateY + subtle scale — layered, not flashy |
| Performance | CSS transitions first; Framer Motion only where orchestration helps |

Motion in Livskompassen is **physiological regulation**, not entertainment. A parent in hypervigilance should feel the interface settle — not perform.

The DAD explicitly rejects neon, sci-fi HUD, and gamified bounce. Every animation must pass the question: *Does this reduce cognitive load?*

---

## Visual Rules

### Token hierarchy

All motion values flow from `src/design-system/tokens/css/variables.css`:

| Token | Value | Use |
|-------|-------|-----|
| `--ds-duration-instant` | `0ms` | Reduced-motion fallback |
| `--ds-duration-fast` | `150ms` | Press, focus ring, micro-feedback |
| `--ds-duration-normal` | `250ms` | Hover lift, panel enter, card border |
| `--ds-duration-morph` | `350ms` | Chameleon mode switch, layout morph |
| `--ds-duration-slow` | `520ms` | Home stagger items, hero settle |
| `--ds-ease-premium` | `cubic-bezier(0.45, 0, 0.55, 1)` | Default — symmetric calm |
| `--ds-ease-enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | Overlays, panels arriving |
| `--ds-ease-exit` | `cubic-bezier(0.45, 0, 0.55, 1)` | Dismiss — no snap |
| `--ds-ease-spring` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | Reserved — use sparingly |

TypeScript mirror: `animation` and `transitions` exports in `tokens/animation.ts`.

### Allowed properties

| Property | Allowed | Notes |
|----------|---------|-------|
| `opacity` | Yes | Primary reveal |
| `transform: translateY` | Yes | Max 14px for list items |
| `transform: scale` | Yes | Press `--ds-press-scale` (0.985) only |
| `transform: translateX` | Rare | Sheet slide only |
| `filter: blur` | Rare | Overlay backdrop — not content |
| `box-shadow` | Yes | Elevation transition on hover |
| `border-color` | Yes | Accent bloom on interactive surfaces |
| `background-position` | No | Avoid shimmer loops in prod |
| `rotate` | No | Except compass decorative SVG (static) |

### Framer Motion presets

`src/design-system/motion/presets.ts` exports canonical variants:

- `dsStaggerContainer` — opacity root, `staggerChildren: 0.08`
- `dsFadeUpItem` — `y: 14 → 0`, duration normal
- `dsPanelIn` — overlay panel enter/exit with scale 0.985

Executive home uses `executiveHomeMotion.ts` — same stagger values, `dsMotionDuration.slow` for items.

### CSS keyframe animations

Defined in `premium-polish.css`:

- `ds-skeleton-pulse` — loading placeholder (slow duration)
- `ds-overlay-in` — backdrop fade
- `ds-panel-in` — modal/sheet translateY(8px) + scale

---

## Sizing

Motion does not have pixel sizing, but **distance caps** apply:

| Pattern | Max displacement | Duration |
|---------|------------------|----------|
| List item fade-up | `14px` Y | normal (250ms) |
| Panel enter | `8px` Y + scale 0.985 | normal |
| Card hover lift | `translateY(-2px)` | normal |
| Button press | `translateY(1px) scale(0.985)` | fast |
| Dock satellite fan | scale 0.35 → 1 | 380ms custom |
| Chameleon morph | opacity crossfade | morph (350ms) |

Stagger delay between siblings: **80ms** (`staggerChildren: 0.08`). Delay before first child: **40ms**.

Never exceed 3 levels of nested stagger — cognitive overload.

---

## Spacing

Motion timing aligns with spacing rhythm (4px base):

- Fast interactions align with `--ds-space-2` (8px) perceived movement
- Panel enter distance equals roughly `--ds-space-2` (8px)
- Stagger gap mirrors `--ds-space-2` timing ratio

Transition shorthand helpers:

```ts
transitions.fast   // 150ms premium
transitions.normal // 250ms premium
transitions.morph  // 350ms enter
transitions.slow   // 520ms premium
```

When animating layout, preserve `--app-dock-clearance` — content must not jump under the dock.

---

## States

| State | Motion behaviour |
|-------|------------------|
| **Default** | Static — no idle animation |
| **Hover** | Lift -2px, shadow elevation upgrade, border accent bloom |
| **Active / Press** | Scale `--ds-press-scale`, translateY(1px) |
| **Focus-visible** | Instant ring — no animation delay |
| **Enter** | Fade + slight rise, ease-enter |
| **Exit** | Faster fade, same ease-premium |
| **Loading** | Skeleton pulse only — no spinner bounce |
| **Reduced motion** | All durations → 0ms; transforms disabled on hover |
| **Busy / disabled** | No press animation; opacity 50% |

`useDsReducedMotion()` returns boolean; `dsMotionOrInstant(reduced, full, instant)` strips transitions.

Root CSS zeroes durations under `@media (prefers-reduced-motion: reduce)`.

---

## Examples

### Home screen stagger

`BastaDesignHome.tsx` and executive layout use `useExecutiveHomeMotion()`:

1. Container mounts with stagger root variants
2. Hero, cards, and aside each fade up 14px over 520ms
3. When reduced motion: empty props — instant render

### Modal and sheet enter

`Modal.tsx` / `Sheet.tsx` panels use `.ds-panel-in` keyframe — matches `dsPanelIn` Framer variant numerically.

### Dock hub fan

`index.css` dock satellites: opacity 0 → 1, scale 0.35 → 1, `cubic-bezier(0.22, 1, 0.36, 1)` over 380ms. Reduced motion: `transition-duration: 0.01ms`.

### Breathing exercise (MåBra)

`BreathingExercise.tsx` uses Framer Motion scale on a circle — functional, not decorative. Must respect reduced motion (check `useReducedMotion` before looping).

### Chameleon morph

`ChameleonInputShell` crossfades delegates over `--ds-duration-morph` — one mode visible at a time, no slide carousel.

---

## Accessibility

- **Mandatory:** honour `prefers-reduced-motion` at token level AND component level
- Never use motion as the only indicator of state change (pair with color/text)
- Avoid parallax on scroll — vestibular sensitivity
- Looping animations limited to skeleton and breathing (functional)
- Focus rings appear instantly — no transition delay on `:focus-visible`
- `aria-live` regions must not animate height in ways that confuse screen readers

Test: enable "Reduce motion" in macOS System Settings → verify home, modals, dock fan, cards.

---

## Animations

This chapter IS the animation reference. Quick decision tree:

```
Need orchestrated list reveal?
  → Framer stagger (dsStaggerContainer + dsFadeUpItem)
Need overlay?
  → CSS ds-overlay-in + ds-panel-in
Need hover feedback?
  → CSS transition on transform/box-shadow (ds-card--interactive)
Need mode switch?
  → morph duration (350ms) opacity crossfade
Need loading?
  → ds-skeleton-pulse only
User prefers reduced motion?
  → useDsReducedMotion / dsMotionOrInstant / CSS media query
```

**Never:** bounce springs, 360° spins, confetti, shake-on-error, infinite gradient shifts on cards.

---

## Code Examples

### Token usage in CSS

```css
.ds-card {
  transition:
    transform var(--ds-duration-normal) var(--ds-ease-premium),
    border-color var(--ds-duration-normal) var(--ds-ease-premium),
    box-shadow var(--ds-duration-normal) var(--ds-ease-premium);
}
```

### Framer preset import

```tsx
import { dsStaggerContainer, dsFadeUpItem } from '@/design-system/motion';
import { useDsReducedMotion, dsMotionOrInstant } from '@/design-system/motion/useDsReducedMotion';

const reduced = useDsReducedMotion();

<motion.div
  {...dsMotionOrInstant(reduced, {
    variants: dsStaggerContainer,
    initial: 'hidden',
    animate: 'show',
  })}
>
  <motion.div variants={dsFadeUpItem}>…</motion.div>
</motion.div>
```

### Executive home hook

```tsx
import { useExecutiveHomeMotion } from '@/modules/core/home/executive/executiveHomeMotion';

const { reduced, staggerRoot, staggerChild } = useExecutiveHomeMotion();

<motion.section {...(reduced ? {} : staggerRoot)}>
  <motion.div {...staggerChild}>…</motion.div>
</motion.section>
```

### Reduced-motion CSS guard

```css
@media (prefers-reduced-motion: reduce) {
  .ds-card--interactive:hover {
    transform: none;
  }
}
```

---

## Do

- Use `--ds-duration-*` and `--ds-ease-*` tokens exclusively
- Import presets from `@/design-system/motion` before writing custom variants
- Call `useDsReducedMotion()` in any Framer Motion screen
- Keep enter animations under 520ms
- Match panel CSS keyframes with Framer `dsPanelIn` when mixing layers
- Lazy-load `framer-motion` — Vite splits `vendor-motion` chunk
- Test dock clearance after animated layout shifts

---

## Don't

- Do not use default Material bounce or `type: 'spring'` with high stiffness
- Do not animate `width`/`height` on large containers — use opacity crossfade
- Do not add idle floating/pulsing to cards or headers
- Do not bypass reduced-motion with JavaScript timers
- Do not import animation libraries beyond Framer Motion without PMIR
- Do not use motion to draw attention to destructive actions (danger = static clarity)
- Do not stack more than one animated overlay

---

## Future Improvements

- Central `MotionProvider` exposing reduced-motion context without per-hook calls
- Storybook motion gallery at `/dev/theme-lab` showing all presets side-by-side
- Unified `dsMotionTokens` JSON export for Figma motion specs
- Performance budget: log frames dropped during home stagger on G85
- Auto-smoke test asserting `prefers-reduced-motion` zeroes `--ds-duration-normal`
- Document Chameleon morph in dedicated animation timeline diagram
