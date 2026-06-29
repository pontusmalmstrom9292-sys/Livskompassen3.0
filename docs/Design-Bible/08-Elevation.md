# Chapter 08 — Elevation

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [07-Border-Radius.md](./07-Border-Radius.md)  
> **Next chapter:** [09-Glass-System.md](./09-Glass-System.md)

---

## Purpose

This chapter defines **how Livskompassen stacks visual layers**—background, midground, foreground—and how **z-index** keeps chrome, content, and ambient effects in the correct order.

Elevation is not decoration. It encodes **orientation**: the user always knows what floats above what, where scroll ends, and that the compass and dock sit above page content without blocking reading flow.

Every surface must map to one of three depth bands aligned with [01-Vision.md](./01-Vision.md) (Foreground / Midground / Background) and respect tokenized z-index from `src/design-system/tokens/css/variables.css`.

---

## Philosophy

Executive Midnight treats depth as **calm hierarchy**, not 3D gimmicks.

| Band | Role | User feeling |
|------|------|--------------|
| **Background** | Ambient navy, scenic photo, blobs, compass rose watermark | Stable world; never steals focus |
| **Midground** | Scrollable hubs, cards, journal islands | Primary work surface |
| **Foreground** | Header, dock, compass breakout, modals, toasts | Persistent orientation chrome |

Philosophy from [02-Design-Philosophy.md](./02-Design-Philosophy.md): prefer **one clear stack** over overlapping competing panels. [03-Core-Principles.md](./03-Core-Principles.md) forbids flat SaaS layouts—cards must **float** above the ambient layer via shadow + glass, not sit flush on a single plane.

The dock exists to **carry the compass** above content; it is foreground chrome, not midground content ([01-Vision.md](./01-Vision.md)).

---

## Visual Rules

### Z-index scale (canonical tokens)

| Token | Value | Usage |
|-------|-------|-------|
| `--ds-z-base` | `0` | Ambient background, page base |
| `--ds-z-raised` | `10` | Sticky hub filters (e.g. Valvet desktop), in-card highlights |
| `--ds-z-header` | `30` | Header chrome (`ds-header`, app header variants) |
| `--ds-z-dock` | `40` | Bottom dock shell, Fyren-adjacent chrome |
| `--ds-z-overlay` | `50` | Full-screen overlays, `.dock-shell` production stack |
| `--ds-z-modal` | `60` | Dialogs, sheets |
| `--ds-z-toast` | `70` | Transient notifications |

Production note: legacy `.app-header` uses `z-[220]` in `index.css` for historical stacking above modals—new work should prefer `--ds-z-*` and consolidate during chrome refactors.

### Layer assignment

```
┌─────────────────────────────────────────────┐
│  FOREGROUND  z-40–70  Header · Dock · Modal │
├─────────────────────────────────────────────┤
│  MIDGROUND   z-1–10   Cards · Hub scroll     │
├─────────────────────────────────────────────┤
│  BACKGROUND  z-0 / -1 Ambient · scenic ::before│
└─────────────────────────────────────────────┘
```

| Element | Typical z-index | Layer |
|---------|-----------------|-------|
| `.ambient-bg` | `0` | Background |
| `.ambient-bg__compass-rose` | `1` | Background (decorative) |
| `.home-page--executive::before` | `-1` | Background (fixed gradient) |
| `.calm-card > *` | `2` (internal) | Midground content above card pseudo-layers |
| `.calm-card::before` (top highlight) | `1` | Midground (non-interactive) |
| `.exec-dock-bar__compass-slot` | `3` (within dock) | Foreground |
| `.dock-shell` | `50` | Foreground |
| `.valvet-route-page--desktop .valv-samla-filter-row` | `10` | Midground sticky |

### Card float

Cards **lift** from the surface using `--ds-elevation-card` (see [11-Shadow-System.md](./11-Shadow-System.md)). Hover adds `--ds-hover-lift: -2px` translateY on `.bento-card`—elevation change is paired with shadow token swap, never transform alone.

### Dock above content

- `.dock-shell` is `position: fixed; bottom: 0; z-index: 50`.
- Scrollable main uses `--app-dock-clearance` so midground never sits under the dock ([01-Vision.md](./01-Vision.md)).
- Compass slot (`exec-dock-bar__compass-slot`) uses `z-index: 3` **within** the dock grid so the hero compass paints above side icons while remaining part of foreground chrome.

### Isolation

Hub shells use `isolation: isolate` (`.hub-page-shell--obsidian-bento`) so internal stacking contexts do not leak pseudo-element highlights into sibling layers.

---

## Sizing

Elevation sizing governs **how far elements appear to float**, not pixel width.

| Concept | Token / value | Application |
|---------|---------------|-------------|
| Card rest elevation | `--ds-elevation-card` | Default `.calm-card`, `.exec-surface-card` |
| Card hover elevation | `--ds-elevation-card-hover` | `.bento-card:hover` |
| Dock elevation | `--ds-elevation-dock` | `.ds-dock`, `.exec-dock-bar` |
| Hover lift | `--ds-hover-lift: -2px` | Bento cards only (not locked compass) |
| Press scale | `--ds-press-scale: 0.985` | Executive cards; compass uses `scale(0.96)` on satellites only |
| Compass breakout | `margin-top: -4.35rem` on dock compass | Visual float above dock band |

Compass hero in dock: **5.35 rem × 5.85 rem** slot—must remain the tallest foreground element in the bottom third of the viewport ([01-Vision.md](./01-Vision.md)).

---

## Spacing

Elevation interacts with spacing via **clearance**, not padding alone.

| Token | Purpose |
|-------|---------|
| `--app-dock-clearance` | `calc(8.5rem + env(safe-area-inset-bottom) + 1.5rem)` default |
| `--app-dock-clearance` (reference dock) | `calc(5.5rem + safe-area)` — thinner executive dock |
| `.hub-view-lock max-height` | `100dvh - dock clearance - header band` |

Rules:

- Foreground chrome never reduces midground readable width—dock is centered, content uses full width above clearance.
- Sticky midground elements (Valvet filter row) sit at `z-index: 10` with a **gradient fade** behind them so scroll content does not flash through harshly.
- Safe-area insets apply to dock padding, not to ambient background (background is full-bleed).

---

## States

| State | Elevation behavior |
|-------|-------------------|
| **Default** | Cards at `--ds-elevation-card`; ambient at `z-0` |
| **Hover** | Bento cards: `-2px` lift + `--ds-elevation-card-hover` |
| **Active / press** | `translateY(1px)` on ghost pills; `scale(0.985)` on exec cards—**simulates** lower elevation without removing shadow |
| **Sticky hub header** | Toolbar stays in midground; does not jump to `z-header` |
| **Modal open** | Modal at `--ds-z-modal`; dock/header remain visible unless full-screen SOS |
| **Low capacity** (`.capacity-low`) | Reduced shadows (`0 4px 12px`); same z-order, less visual float |
| **Valvet desktop ≥640px** | Dock hidden; `--app-dock-clearance: 1.25rem` — midground expands downward |

Compass **open / holding** states increase glow shadow layers but do not change z-index—the compass stays in the dock slot ([18-Dock.md](./18-Dock.md)).

---

## Examples

### Example A — Three-band home stack

**Route:** `/` · `ME-midnight-executive`

1. **Background:** `.ambient-bg.ambient-bg--scenic` at `z-0`, gold blob, scenic photo stack.
2. **Midground:** `.executive-home-dashboard` scroll area with `.exec-home-card` surfaces.
3. **Foreground:** `.exec-dock-bar` fixed bottom, compass `margin-top: -4.35rem` breaking the band.

### Example B — Calm card internal stack

**Class:** `.calm-card.glow-bottom-gold`

| Layer | Pseudo / child | z-index |
|-------|----------------|---------|
| Bottom gradient | `::after` | `0` |
| Top highlight line | `::before` | `1` |
| Card content | `> *` | `2` |

Content always paints above decorative gradients.

### Example C — Hub bento header

**Class:** `.hub-page-shell__header--bento`

Sits in midground within `.hub-page-shell--obsidian-bento` (`isolation: isolate`). Glass blur reads as **elevated strip** inside the hub, not as app-level header (header remains `z-header`).

---

## Accessibility

| Requirement | Elevation impact |
|-------------|------------------|
| **Focus order** | DOM order matches visual stack; do not `z-index` trap focus behind glass |
| **Sticky + scroll** | Sticky filters must not cover focused inputs; maintain `scroll-padding-bottom` ≥ dock clearance |
| **Reduced depth cues** | Low-capacity mode reduces shadow contrast—do not rely on shadow alone for affordance |
| **Screen readers** | Decorative ambient layers use `aria-hidden`; z-index does not affect SR tree |
| **Touch targets** | Foreground dock icons remain ≥44px despite compass overlap |

See [28-Accessibility.md](./28-Accessibility.md) for full patterns.

---

## Animations

Elevation changes animate with **premium easing**, never bounce:

| Property | Duration | Easing |
|----------|----------|--------|
| `transform` (hover lift) | `--ds-duration-normal` (250ms) | `--ds-ease-premium` |
| `box-shadow` (card hover) | `--ds-duration-normal` | `--ds-ease-premium` |
| Compass dock hover | `0.2s` | `ease` |
| Compass pulse (open) | `3.5s` | `ease-in-out` — glow only, not z-index |

`prefers-reduced-motion`: disable compass pulse and hero drift; **keep** z-index stack unchanged ([12-Animation-System.md](./12-Animation-System.md)).

---

## Code Examples

### Z-index tokens

```css
/* src/design-system/tokens/css/variables.css */
--ds-z-base: 0;
--ds-z-raised: 10;
--ds-z-header: 30;
--ds-z-dock: 40;
--ds-z-overlay: 50;
--ds-z-modal: 60;
--ds-z-toast: 70;
```

### Ambient background layer

```css
/* src/index.css */
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
```

### Dock above content

```css
/* src/index.css */
.dock-shell {
  @apply pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center;
}
```

### Card content above pseudo-layers

```css
/* src/styles/obsidian-calm-2.css */
.calm-card > *,
.glass-card > * {
  position: relative;
  z-index: 2;
}
```

### Compass slot within dock

```css
/* src/styles/executive-chrome.css */
.exec-dock-bar__compass-slot {
  z-index: 3;
  align-self: end;
}
```

### DS dock shell

```css
/* src/design-system/styles/components.css */
.ds-dock {
  position: fixed;
  z-index: var(--ds-z-dock);
  box-shadow: var(--ds-elevation-dock);
}
```

---

## Do

- Assign every new fixed/sticky element a `--ds-z-*` token before shipping
- Keep ambient and scenic layers at `z ≤ 0` with `pointer-events: none`
- Pair hover lift with shadow token upgrade on cards
- Use `--app-dock-clearance` for all hub scroll regions
- Let compass break out vertically while staying in the dock stacking context
- Use `isolation: isolate` on hub shells with multiple pseudo-layers

---

## Don't

- Don't stack modals below the dock (`z-index` < 50) without explicit design review
- Don't use arbitrary z-index (`z-[9999]`) in feature modules
- Don't animate `z-index`—use opacity/transform for motion
- Don't place interactive content at `z-0` on the ambient layer
- Don't remove dock clearance when hiding dock on desktop—update the token instead
- Don't flatten cards to `z-0` on the same plane as background scenic photos

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Unify app-header z-index** | Migrate `z-[220]` to `--ds-z-header` + modal layering spec |
| **Elevation Storybook** | Visual z-index ladder in Theme Lab |
| **CSS `@layer` audit** | Map `components` layer vs legacy `index.css` conflicts |
| **Fyren bar elevation** | Document stack order: widget bar vs dock vs compass |
| **iOS safe-area matrix** | Table of clearance values per device class |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Vision depth bands | [01-Vision.md](./01-Vision.md) |
| Decision framework | [02-Design-Philosophy.md](./02-Design-Philosophy.md) |
| Non-negotiable rules | [03-Core-Principles.md](./03-Core-Principles.md) |
| Color on dark stacks | [04-Color-System.md](./04-Color-System.md) |
| Glass blur surfaces | [09-Glass-System.md](./09-Glass-System.md) |
| Ambient lighting | [10-Lighting.md](./10-Lighting.md) |
| Shadow tokens | [11-Shadow-System.md](./11-Shadow-System.md) |
| Motion on hover lift | [12-Animation-System.md](./12-Animation-System.md) |
| Dock geometry | [18-Dock.md](./18-Dock.md) |
| Compass breakout | [19-Compass.md](./19-Compass.md) |
