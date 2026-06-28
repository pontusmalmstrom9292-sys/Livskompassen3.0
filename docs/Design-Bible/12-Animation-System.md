# Chapter 12 — Animation System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [11-Shadow-System.md](./11-Shadow-System.md)  
> **Next chapter:** [13-Icons.md](./13-Icons.md)

---

## Purpose

This chapter defines **motion vocabulary** for Executive Midnight — duration tokens, easing curves, Framer Motion presets, CSS keyframes for compass/ögat pulses, Chameleon morph timing, and reduced-motion policy. Motion confirms actions and guides attention; it never entertains or bounces.

All animation must trace to `--ds-duration-*` and `--ds-ease-*` in `src/design-system/tokens/css/variables.css`, with JS mirrors in `src/design-system/motion/presets.ts` and home-specific `executiveHomeMotion.ts`.

---

## Philosophy

### Calm confirmation, not circus

Livskompassen users operate under cognitive load and hypervigilance. Motion rules:

- **Slow enough to read** — default 250ms; hero stagger 520ms item duration
- **No bounce** — `dsEasePremium` is symmetric ease; spring curve is tight, not playful
- **One motion per gesture** — fade-up OR scale OR border pulse — not all three
- **Respect reduced motion** — durations zero to instant; loops disabled

Chameleon principle ([chameleon-ui-modularity.mdc](../../.cursor/rules/chameleon-ui-modularity.mdc)): modes morph over **~350ms** (`--ds-duration-morph`) — shell stays, delegate swaps.

Forbidden: Material overshoot, parallax scroll on hubs, confetti, shake on error.

---

## Visual Rules

### Duration scale

| Token | Value | Use |
|-------|-------|-----|
| `--ds-duration-instant` | `0ms` | Reduced motion fallback |
| `--ds-duration-fast` | `150ms` | Button press, dock icon color |
| `--ds-duration-normal` | `250ms` | Card hover, overlay fade |
| `--ds-duration-morph` | `350ms` | Chameleon mode crossfade |
| `--ds-duration-slow` | `520ms` | Home stagger item, skeleton pulse period |

Tailwind: `duration-ds-fast`, `duration-ds-normal`, `duration-ds-morph`, `duration-ds-slow`.

### Easing curves

| Token | cubic-bezier | Character |
|-------|--------------|-------------|
| `--ds-ease-premium` | `(0.45, 0, 0.55, 1)` | Default — calm symmetric |
| `--ds-ease-enter` | `(0.16, 1, 0.3, 1)` | Panels entering — soft decel |
| `--ds-ease-exit` | `(0.45, 0, 0.55, 1)` | Exit matches premium |
| `--ds-ease-spring` | `(0.34, 1.2, 0.64, 1)` | Button press only — subtle |

Tailwind: `ease-ds-premium`, `ease-ds-enter`.

### Transition shorthand (TS)

```ts
// src/design-system/tokens/animation.ts
export const dsTransition = {
  fast: `var(--ds-duration-fast) var(--ds-ease-premium)`,
  normal: `var(--ds-duration-normal) var(--ds-ease-premium)`,
  morph: `var(--ds-duration-morph) var(--ds-ease-enter)`,
  slow: `var(--ds-duration-slow) var(--ds-ease-premium)`,
};
```

### Transform vocabulary

| Token | Value | Use |
|-------|-------|-----|
| `--ds-hover-lift` | `-2px` | Card hover translateY |
| `--ds-press-scale` | `0.985` | Default active scale |
| `--ds-press-scale-strong` | `0.96` | Strong press (rare) |

Panel enter: `translateY(8px) scale(0.985)` → `0, 1` (`ds-panel-in`).

### Property allowlist

**May animate:** `opacity`, `transform`, `border-color`, `box-shadow`, `background-color`, `filter` (small elements only)

**Must not animate:** `width`, `height`, `padding`, `grid-template-*`, `top/left` layout

---

## Sizing

Motion **distance** scales with element size:

| Pattern | Distance | Duration |
|---------|----------|----------|
| Stagger item fade-up | `y: 14px → 0` | 520ms slow |
| Panel in | `y: 8px`, scale 0.985 | 250ms normal |
| Hover lift | 2px | 250ms |
| Resurser slide-in | full slide | 350ms ease |
| Compass pulse | border-color only | 3.5s loop |

Stagger timing: `staggerChildren: 0.08`, `delayChildren: 0.04` — from `presets.ts` and `executiveHomeMotion.ts`.

---

## Spacing

Motion must not alter **layout spacing** — use transform only. Chameleon morph keeps shell padding fixed; inner delegate crossfades.

Home grid stagger animates children inside fixed cells ([07-Grid-System.md](./07-Grid-System.md)).

---

## States

| State | Motion |
|-------|--------|
| **Enter (page)** | Stagger fade-up on home modules |
| **Enter (modal)** | Overlay opacity + panel `ds-panel-in` |
| **Hover** | Lift + shadow 250ms |
| **Active** | Scale to 0.985, 150ms spring optional |
| **Exit** | Panel reverse — fast duration |
| **Loading** | Skeleton opacity pulse 520ms infinite |
| **Reduced motion** | All durations 0ms; keyframes `animation: none` |
| **Static compass** | `.exec-eye--static`, compass holding — no breathe |

`useReducedMotion()` from Framer Motion gates `executiveHomeMotion` stagger props.

---

## Examples

### Executive home stagger

```ts
// executiveHomeMotion.ts
export function useExecutiveHomeMotion() {
  const reduced = useReducedMotion() ?? false;
  return {
    reduced,
    staggerRoot: reduced ? {} : {
      variants: execHomeStaggerContainer,
      initial: 'hidden',
      animate: 'visible',
    },
    staggerChild: reduced ? {} : { variants: execHomeStaggerItem },
  };
}
```

### DS fade-up preset

```ts
// presets.ts
export const dsFadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: dsMotionDuration.normal, ease: dsEasePremium },
  },
};
```

### Card transition (obsidian-calm-2)

```css
.calm-card {
  transition:
    transform var(--ds-duration-normal) var(--ds-ease-premium),
    border-color var(--ds-duration-normal) var(--ds-ease-premium),
    box-shadow var(--ds-duration-normal) var(--ds-ease-premium);
}
```

### Executive compass pulse

```css
animation: exec-compass-pulse 3.5s ease-in-out infinite;
```

### Spin slow (Tailwind)

```js
animation: { 'spin-slow': 'spin 12s linear infinite' }
```

Decorative only — disable under reduced motion.

---

## Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --ds-duration-fast: 0ms;
    --ds-duration-normal: 0ms;
    --ds-duration-morph: 0ms;
    --ds-duration-slow: 0ms;
  }
}
```

Executive chrome:

```css
@media (prefers-reduced-motion: reduce) {
  .exec-compass-pulse, .exec-eye-breathe, .exec-hero-drift {
    animation: none !important;
  }
}
```

- **`useReducedMotion()`** — required for Framer Motion trees on home and modals
- **No vestibular triggers** — no zoom, spin, or parallax on hub scroll
- **Pause loops** — compass pulse is decorative; must stop when reduced motion set

See [28-Accessibility.md](./28-Accessibility.md).

---

## Animations

### CSS keyframe inventory

| Name | File | Loop | Purpose |
|------|------|------|---------|
| `exec-compass-pulse` | executive-chrome.css | yes | Compass border breathe |
| `exec-hub-pulse` | executive-chrome.css | yes | Snabbstart glow |
| `exec-eye-breathe` | executive-chrome.css | yes | Ögat drop-shadow |
| `exec-hero-drift` | executive-chrome.css | yes | Hero gradient drift |
| `exec-badge-breathe` | executive-chrome.css | yes | Badge halo |
| `bd-compass-pulse` | basta-design.css | yes | Prod compass |
| `resurser-slide-in` | executive-chrome.css | no | Panel enter |
| `ds-skeleton-pulse` | premium-polish.css | yes | Loading |
| `ds-overlay-in` | premium-polish.css | no | Modal scrim |
| `ds-panel-in` | premium-polish.css | no | Modal/sheet body |

### Framer Motion inventory

| Preset | Location |
|--------|----------|
| `dsStaggerContainer` / `dsFadeUpItem` | motion/presets.ts |
| `dsPanelIn` | motion/presets.ts |
| `execHomeStaggerContainer` | executiveHomeMotion.ts |

---

## Code Examples

### Button transition stack

```css
.ds-button {
  transition:
    transform var(--ds-duration-fast) var(--ds-ease-spring),
    box-shadow var(--ds-duration-fast) var(--ds-ease-premium),
    background var(--ds-duration-fast) var(--ds-ease-premium);
}
```

### Modal animations

```css
.ds-overlay {
  animation: ds-overlay-in var(--ds-duration-normal) var(--ds-ease-enter);
}
.ds-modal-panel {
  animation: ds-panel-in var(--ds-duration-normal) var(--ds-ease-enter);
}
```

### tailwind.config.js bridge

```js
transitionDuration: {
  'ds-fast': 'var(--ds-duration-fast)',
  'ds-normal': 'var(--ds-duration-normal)',
  'ds-morph': 'var(--ds-duration-morph)',
  'ds-slow': 'var(--ds-duration-slow)',
},
transitionTimingFunction: {
  'ds-premium': 'var(--ds-ease-premium)',
  'ds-enter': 'var(--ds-ease-enter)',
},
```

### Chameleon morph (conceptual)

SuperModule shell holds layout; mode change triggers 350ms opacity crossfade on delegate — align with `--ds-duration-morph` + `--ds-ease-enter`.

---

## Do

- Use `--ds-duration-*` and `--ds-ease-*` for all new transitions
- Gate Framer stagger with `useReducedMotion()`
- Pair hover lift (2px) with shadow transition at normal duration
- Use enter easing for overlays and panels
- Disable infinite loops when reduced motion is active

---

## Don't

- Don't use default Tailwind `bounce` or `spring` animations
- Don't animate layout properties
- Don't exceed 520ms for interactive feedback (except decorative loops)
- Don't run multiple infinite animations on same viewport without review
- Don't ignore `prefers-reduced-motion` in executive-chrome keyframes

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Motion Storybook** | Duration/easing visual matrix in Theme Lab |
| **Unified pulse token** | `--ds-animation-compass-period: 3.5s` |
| **Framer lazy features** | Code-split motion on low-end G85 |
| **Chameleon morph audit** | Verify all SuperModules use morph duration |
| **spin-slow governance** | Document allowed decorative spins |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Hover lift + shadow | [11-Shadow-System.md](./11-Shadow-System.md) |
| Glow pulses | [10-Lighting.md](./10-Lighting.md) |
| Grid stagger context | [07-Grid-System.md](./07-Grid-System.md) |
| Glass blur transitions | [09-Glass-System.md](./09-Glass-System.md) |
| a11y policy | [28-Accessibility.md](./28-Accessibility.md) |
| Performance budget | [30-Performance.md](./30-Performance.md) |
| Icon micro-motion | [13-Icons.md](./13-Icons.md) |
