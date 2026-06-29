# Chapter 09 — Glass System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [08-Elevation.md](./08-Elevation.md)  
> **Next chapter:** [10-Lighting.md](./10-Lighting.md)

---

## Purpose

This chapter specifies **frosted glass materials** in Livskompassen: backdrop blur ranges, translucent fills, `color-mix` borders, and the **top highlight line** (`::before`) that signals premium craft on dark navy.

Glass is the primary **material language** of Executive Midnight ([01-Vision.md](./01-Vision.md)). It separates chrome and cards from the ambient background without opaque boxes that feel like SaaS panels.

All production glass must use design tokens—never raw `rgba(255,255,255,0.1)` in feature modules ([03-Core-Principles.md](./03-Core-Principles.md)).

---

## Philosophy

Glass communicates **luxury through restraint** ([02-Design-Philosophy.md](./02-Design-Philosophy.md)):

- **Readable blur:** enough frost to imply depth; not so much that text smears.
- **Cold obsidian base:** surfaces mix from `--surface-2` / `--glass`, not warm brown gradients.
- **Gold rim, not gold fill:** borders use `color-mix(in srgb, var(--accent) N%, transparent)`.
- **Inner light:** a 1px top gradient (`::before`) simulates edge lighting—mandatory on primary cards.

Glass is not generic `backdrop-filter` on every div. Apply it to **named primitives**: `calm-card`, `glass-header-bar`, hub bento headers, dock rails.

---

## Visual Rules

### Backdrop blur scale

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-blur-md` | `12px` | Light executive cards, checklist strips |
| `--ds-blur-lg` | `16px` | Module toolbar `--bento`, satellite tiles |
| `--ds-blur-xl` | `24px` | **Primary:** `.calm-card`, `.glass-card`, app-shell reinforcement |
| Tailwind `backdrop-blur-xl` | maps to xl | Base class on `.calm-card` |

**Canonical range: 16–24px** for production cards and chrome. Values below 12px only for Nordic Precision override (`R-A-nordic-precision`: 8px).

Always pair with `-webkit-backdrop-filter` for Safari.

### Saturation

Header kanon variant: `blur(28px) saturate(165%)` on `.glass-header-bar`.  
Executive dock: `blur(20px) saturate(140%)` on `.exec-dock-bar`.  
Default DS glass saturate token: `--ds-glass-saturate: 145%`.

### Fill recipes

| Component | Background recipe |
|-----------|---------------------|
| `.calm-card` | `bg-surface-2/60` + `color-mix(in srgb, var(--surface-2) 60%, transparent)` in app-shell |
| `.calm-card-midnight` | Flat `#0c0c0e` — **no blur** (stricter midnight variant) |
| `.glass-hero` | `color-mix(in srgb, var(--glass-hero) 35%, rgba(2, 6, 23, 0.92))` |
| `.hub-page-shell__header--bento` | Multi-stop linear gradient 145deg + `blur(20px)` |
| `.exec-surface-card` | `color-mix(in srgb, var(--surface-2) 78%, transparent)` + `blur(10px)` |
| `.glass-header-bar` | `rgba(15, 23, 42, 0.52)` + `blur(28px)` |

### Borders via color-mix

```css
border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--glass-border));
border-color: color-mix(in srgb, var(--glass-border) 85%, transparent); /* bento-card */
```

Hover accent mix (bento):

```css
border-color: color-mix(in srgb, var(--accent) 30%, var(--glass-border));
```

Never hardcode `#d4af37` at 22% in modules—use `var(--accent)`.

### Top highlight line (`::before`)

Mandatory pattern on glass cards:

```css
.calm-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in srgb, var(--text) 10%, transparent),
    transparent
  );
  pointer-events: none;
  z-index: 1;
}
```

Stronger variant on `.glass-header-bar` and ember panel style: gold/white 10–14% center stop.

### Legacy aliases

`.glass-card` === `.calm-card` (same blur, shadow, highlight). Prefer **`calm-card`** in new code.

---

## Sizing

| Element | Border radius | Blur | Border width |
|---------|---------------|------|--------------|
| `.calm-card` | `rounded-3xl` (1.5rem) | 24px | 1px |
| `.hub-page-shell__header--bento` | `1.25rem` | 20px | 1px |
| `.module-shell__toolbar--bento` | `1.25rem` | 16px | 1px |
| `.glass-header-bar` | `rounded-2xl` | 28px | 1px |
| `.exec-dock-bar` | top `1.35rem` | 20px | 1px |
| `.glass-hero` | `rounded-3xl` | 24px (xl) | 1px |

Toolbar padding: `0.375rem` inner; header bento: `0.875rem 1rem`.

---

## Spacing

Glass chrome reserves **internal padding** so blur edges do not clip text:

| Shell | Padding |
|-------|---------|
| Bento hub header | `0.875rem 1rem` |
| Module toolbar | `0.375rem` |
| Glass header bar | `px-4`, height `3.75rem` (kanon `5rem`) |
| Calm card | Component-defined; respect `hub-view-lock` islands |

Glass-to-glass gap in hubs: `0.5rem` between toolbar and card stack minimum.

---

## States

| State | Glass behavior |
|-------|----------------|
| **Default** | Blur + 60–78% surface mix + top highlight |
| **Hover** | Border accent mix increases; optional `-2px` lift on bento |
| **Active** | Slight scale down; highlight line may shift to gold mix on pills |
| **Focus** | `--ds-focus-ring` on inputs inside glass; shell unchanged |
| **Disabled** | Reduce opacity; keep blur (do not remove material) |
| **Low capacity** | `.capacity-low` replaces glass with `surface 80%` flat mix, lighter blur |
| **Nordic Precision theme** | Reduced blur (8px), sharper `12px` radius |

Chameleon morph ([12-Animation-System.md](./12-Animation-System.md)): viewport fades `opacity` + `blur-[2px]` at 350ms—glass shell wrapper stays mounted.

---

## Examples

### Example A — Hub calm card

```html
<div class="calm-card bento-card glow-bottom-gold">
  <!-- content z-index 2 -->
</div>
```

Scenic background bleeds through 60% surface mix; gold bottom glow is **separate** from glass fill (see silo glow classes).

### Example B — Glass header bar

Production header capsule: frosted slate, 28px blur, inset top highlight, multi-layer shadow ([11-Shadow-System.md](./11-Shadow-System.md)).

### Example C — Executive dock glass

`.exec-dock-bar`: gradient fill + `blur(20px) saturate(140%)` + gold top rule on `::before` + ambient up-shadow.

---

## Accessibility

| Concern | Mitigation |
|---------|------------|
| **Text contrast on glass** | Body text uses `--text` / `--text-muted`; never rely on background photo alone |
| **Blur + readability** | Keep fill ≥55% surface opacity on text-heavy cards |
| **Reduced transparency** | iOS/Android high-contrast: future media query to flatten glass |
| **Focus visibility** | `--ds-focus-ring` must clear glass border |
| **Motion blur in Chameleon** | `blur-[2px]` is decorative; respect `prefers-reduced-motion` |

---

## Animations

Glass surfaces transition **border-color**, **box-shadow**, and **background** together:

```css
transition:
  transform var(--ds-duration-normal) var(--ds-ease-premium),
  border-color var(--ds-duration-normal) var(--ds-ease-premium),
  box-shadow var(--ds-duration-normal) var(--ds-ease-premium);
```

Chameleon viewport:

```tsx
style={{
  transitionDuration: `${morphMs}ms`, /* 350 */
  transitionTimingFunction: 'var(--ds-ease-premium)',
}}
```

No animated backdrop-filter values—GPU cost and visual noise.

---

## Code Examples

### calm-card (canonical)

```css
/* src/styles/obsidian-calm-2.css */
.calm-card {
  @apply relative overflow-hidden rounded-3xl border border-border/30
         bg-surface-2/60 backdrop-blur-xl;
  box-shadow: var(--ds-elevation-card, 0 10px 30px rgba(0, 0, 0, 0.5));
  -webkit-backdrop-filter: blur(24px);
}
```

### App-shell reinforcement

```css
.app-shell .calm-card {
  background: color-mix(in srgb, var(--surface-2) 60%, transparent);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
```

### glass-header-bar

```css
/* src/index.css */
.glass-header-bar {
  backdrop-filter: blur(28px) saturate(165%);
  -webkit-backdrop-filter: blur(28px) saturate(165%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 12px 40px rgba(2, 6, 23, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Bento header glass

```css
.hub-page-shell__header--bento {
  backdrop-filter: blur(20px);
  border: 1px solid color-mix(in srgb, var(--accent) 22%, var(--glass-border));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.32),
    0 8px 24px -8px rgba(0, 0, 0, 0.65);
}
```

### DS glass tokens

```css
--ds-glass-blur: var(--ds-blur-xl);
--ds-glass-highlight: color-mix(in srgb, var(--ds-color-text) 10%, transparent);
--ds-glass-saturate: 145%;
```

---

## Do

- Use `calm-card` / DS glass primitives for all new hub cards
- Keep blur in **16–24px** band for production Executive Midnight
- Apply `::before` top highlight on every primary glass surface
- Use `color-mix` with `var(--accent)` and `var(--glass-border)` for borders
- Include `-webkit-backdrop-filter` alongside `backdrop-filter`
- Set `pointer-events: none` on decorative pseudo-elements

---

## Don't

- Don't use opaque white cards on home or hubs
- Don't add glass to every nested div—one shell per logical panel
- Don't exceed 28px blur except header/dock chrome
- Don't hardcode hex borders in `src/modules/features/**`
- Don't remove top highlight to "simplify"—it is part of DAD material language
- Don't use `backdrop-filter` without a semi-transparent fill (illegible text)

---

## Future Improvements

| Item | Notes |
|------|-------|
| **`GlassPanel` primitive** | Single React component wrapping calm-card rules |
| **Contrast automation** | Script: warn when glass fill opacity < 55% with body text |
| **Theme Lab glass matrix** | Compare 16 / 20 / 24px on G85 photo |
| **Flatten for high-contrast OS** | `@media (prefers-contrast: more)` recipe |
| **Migrate rgba borders** | Replace legacy `rgba(255,255,255,0.12)` with tokens |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Vision · glass material | [01-Vision.md](./01-Vision.md) |
| Premium craft | [02-Design-Philosophy.md](./02-Design-Philosophy.md) |
| Token-only colors | [03-Core-Principles.md](./03-Core-Principles.md) · [04-Color-System.md](./04-Color-System.md) |
| Elevation stack | [08-Elevation.md](./08-Elevation.md) |
| Ambient light behind glass | [10-Lighting.md](./10-Lighting.md) |
| Shadow pairing | [11-Shadow-System.md](./11-Shadow-System.md) |
| Chameleon morph | [12-Animation-System.md](./12-Animation-System.md) |
| Header chrome | [17-Header.md](./17-Header.md) |
