# Chapter 11 — Shadow System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [10-Lighting.md](./10-Lighting.md)  
> **Next chapter:** [12-Animation-System.md](./12-Animation-System.md)

---

## Purpose

This chapter defines **shadow and elevation stacks** for Executive Midnight — layered inset highlights, ambient falloff, accent rim lines, and gold glow halos. Shadows make glass cards float above the navy ambient layer ([08-Elevation.md](./08-Elevation.md)) without Material Design elevation numbers or flat SaaS panels.

Semantic aliases `--ds-shadow-sm` through `--ds-shadow-xl` map to elevation recipes in `src/design-system/tokens/css/variables.css`. Tailwind exposes them via `boxShadow` in `tailwind.config.js`.

---

## Philosophy

### Layered glass, not drop shadow stickers

Executive Midnight shadows combine:

1. **Inset top highlight** — simulates light on glass edge ([10-Lighting.md](./10-Lighting.md))
2. **Inset bottom shade** — grounds the panel into surface
3. **Hairline accent ring** — 1px outer at 5–14% accent mix
4. **Ambient falloff** — large soft `-10px` vertical spread using `--ds-ambient-falloff`
5. **Optional accent glow** — hero, dock, CTA only

Philosophy: **one rest shadow + one hover shadow** per component class — no shadow soup on every div.

---

## Visual Rules

### Elevation scale (canonical)

| Level | Token | Alias | Typical use |
|-------|-------|-------|-------------|
| 0 | `--ds-elevation-0` | none | Flat inline chips |
| 1 | `--ds-elevation-1` | `--ds-shadow-sm` | Subtle chips, badges |
| 2 | `--ds-elevation-2` | `--ds-shadow-md` | Inputs, secondary panels |
| 3 | `--ds-elevation-3` | (internal) | Raised sticky rows |
| 4 | `--ds-elevation-4` | (internal) | Peak hover emphasis |
| Card rest | `--ds-elevation-card` | `--ds-shadow-lg` | `.calm-card`, `.ds-card`, `.exec-surface-card` |
| Card hover | `--ds-elevation-card-hover` | `--ds-shadow-xl` | `.bento-card:hover`, modal panels |
| Dock | `--ds-elevation-dock` | — | `.ds-dock`, `.exec-dock-bar` |

### Elevation-1 recipe (sm)

```css
--ds-elevation-1:
  inset 0 1px 0 var(--ds-glass-highlight),
  0 4px 14px -6px color-mix(in srgb, var(--ds-color-bg) 90%, transparent);
```

### Elevation-card recipe (lg)

```css
--ds-elevation-card:
  inset 0 1px 0 var(--ds-glass-highlight),
  inset 0 -1px 0 color-mix(in srgb, var(--ds-color-bg) 28%, transparent),
  0 0 0 1px color-mix(in srgb, var(--ds-color-accent) 5%, transparent),
  0 12px 32px -10px var(--ds-ambient-falloff),
  0 4px 16px -6px color-mix(in srgb, var(--ds-color-bg) 70%, transparent);
```

### Elevation-card-hover recipe (xl)

Adds brighter inset top, stronger accent ring (14%), deeper falloff, accent-glow tail at 65% mix — paired with `--ds-hover-lift: -2px` translateY.

### Accent glow shadows

| Token | Value |
|-------|-------|
| `--ds-shadow-accent-glow` | `0 0 16px var(--ds-color-accent-glow)` |
| `--ds-shadow-accent-glow-lg` | `0 0 32px var(--ds-color-accent-glow)` |
| Tailwind `indigo-glow` | `0 0 20px rgba(99, 102, 241, 0.15)` — AI-only, rare |

Hero cards may combine: `box-shadow: var(--ds-shadow-lg), var(--ds-shadow-accent-glow)`.

### Dock shadow (upward bias)

```css
--ds-elevation-dock:
  inset 0 1px 0 color-mix(in srgb, var(--ds-color-accent-light) 22%, transparent),
  inset 0 -1px 0 color-mix(in srgb, var(--ds-color-bg) 35%, transparent),
  0 -8px 32px color-mix(in srgb, var(--ds-color-accent) 12%, transparent),
  0 16px 48px -10px color-mix(in srgb, var(--ds-color-bg) 58%, transparent),
  0 0 0 1px color-mix(in srgb, var(--ds-color-accent) 8%, transparent);
```

Negative Y spread casts glow **upward** into content — dock feels lit from below.

### Legacy executive shadows

`executive-chrome.css` uses ad-hoc `rgba(0,0,0,0.35–0.45)` on hero cards — migrate toward `--ds-elevation-card` during polish passes.

---

## Sizing

Shadow **blur and spread** scale with role:

| Role | Blur range | Spread |
|------|------------|--------|
| sm | 14px | -6px (tight) |
| md | 24px | -8px |
| card | 32px | -10px falloff |
| card hover | 44px | -12px falloff |
| accent glow | 16–32px | 0 (omnidirectional) |
| dock up-glow | 32px | -8px upward |

Inset highlights are always **1px** — do not thicken on hover.

---

## Spacing

Shadows do not consume layout space — but **hover lift** `-2px` requires vertical breathing room in grids ([07-Grid-System.md](./07-Grid-System.md)) so lifted cards do not clip `overflow: hidden` parents.

Modal/sheet panels: shadow renders outside panel box — ensure overlay padding `var(--ds-space-4)` so blur is not clipped by viewport edge.

---

## States

| State | Shadow |
|-------|--------|
| **Rest** | `--ds-shadow-lg` on cards |
| **Hover** | `--ds-shadow-xl` + `translateY(-2px)` |
| **Active/pressed** | Revert toward rest or hold hover — never remove inset highlight |
| **Focus-visible** | `--ds-focus-ring` — not a box-shadow stack replacement |
| **Disabled** | Same shadow as rest — dim via opacity/color |
| **Loading skeleton** | `--ds-elevation-card` on fallback shell |

Transition (from `obsidian-calm-2.css`, `components.css`):

```css
transition:
  transform var(--ds-duration-normal) var(--ds-ease-premium),
  box-shadow var(--ds-duration-normal) var(--ds-ease-premium);
```

---

## Examples

### Bento card hover (premium-polish)

```css
.bento-card:not(.module-bento-card--depth):hover {
  transform: translateY(var(--ds-hover-lift));
  box-shadow: var(--ds-shadow-xl);
}
```

### DS card default

```css
.ds-card {
  box-shadow: var(--ds-shadow-lg);
}
```

### Bästa design dock

```css
box-shadow:
  inset 0 1px 0 color-mix(in srgb, var(--bd-accent) 28%, transparent),
  0 -10px 36px color-mix(in srgb, var(--bd-accent) 14%, transparent),
  0 14px 36px rgba(0, 0, 0, 0.58);
```

### Modal panel peak elevation

```css
.ds-modal-panel {
  box-shadow: var(--ds-elevation-card-hover);
}
```

---

## Accessibility

- **Focus ring separate** — do not depend on shadow alone for focus indication
- **Reduced motion** — shadow may snap on hover without transition when durations zeroed
- **Contrast** — inset highlights must not reduce text contrast; they sit on card border region
- **Low vision** — hover lift + shadow dual cue (not color-only)

---

## Animations

Animate **`box-shadow` and `transform` together** over `--ds-duration-normal` (250ms) with `--ds-ease-premium`.

Do **not** animate shadow on ambient background layers.

Skeleton pulse animates **opacity**, not shadow (`ds-skeleton-pulse` in `premium-polish.css`).

Compass dock uses **border-color pulse** more than box-shadow animation — see [12-Animation-System.md](./12-Animation-System.md).

---

## Code Examples

### variables.css stack

```css
--ds-shadow-sm: var(--ds-elevation-1);
--ds-shadow-md: var(--ds-elevation-2);
--ds-shadow-lg: var(--ds-elevation-card);
--ds-shadow-xl: var(--ds-elevation-card-hover);
```

### tailwind.config.js

```js
boxShadow: {
  'ds-sm': 'var(--ds-shadow-sm)',
  'ds-md': 'var(--ds-shadow-md)',
  'ds-lg': 'var(--ds-shadow-lg)',
  'ds-xl': 'var(--ds-shadow-xl)',
  'accent-glow': 'var(--ds-shadow-accent-glow)',
},
```

### TypeScript shadow tokens

```ts
// src/design-system/tokens/shadow.ts
export const dsShadow = {
  lg: 'var(--ds-shadow-lg)',
  xl: 'var(--ds-shadow-xl)',
  accentGlow: 'var(--ds-shadow-accent-glow)',
} as const;
```

### Calm card content stacking

```css
.calm-card > * {
  position: relative;
  z-index: 2; /* above ::before highlight layer */
}
```

---

## Do

- Use `--ds-shadow-lg` / `--ds-shadow-xl` for card rest/hover pairs
- Pair hover lift with shadow upgrade
- Use `--ds-elevation-dock` for dock shells
- Keep inset 1px top highlight on all glass cards
- Transition shadow over `--ds-duration-normal`

---

## Don't

- Don't use Tailwind `shadow-2xl` arbitrary in feature modules
- Don't stack more than 5 shadow layers without DS review
- Don't animate shadow on large fixed backgrounds
- Don't remove inset highlight to "flatten" design — violates Executive Midnight
- Don't use indigo-glow on non-AI surfaces

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Migrate executive rgba shadows** | Map hero cards to `--ds-elevation-card` |
| **Shadow Storybook** | Rest/hover/dock side-by-side |
| **elevation-3/4 aliases** | Expose md+ sticky if needed |
| **Perf audit** | Limit simultaneous blurred shadows on home |
| **Tailwind v4 token sync** | `@theme` block for shadows |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Z-index vs shadow | [08-Elevation.md](./08-Elevation.md) |
| Highlight / glow source | [10-Lighting.md](./10-Lighting.md) |
| Transition timing | [12-Animation-System.md](./12-Animation-System.md) |
| Card component | [16-Cards.md](./16-Cards.md) |
| Dock shell | [18-Dock.md](./18-Dock.md) |
| Glass surfaces | [09-Glass-System.md](./09-Glass-System.md) |
