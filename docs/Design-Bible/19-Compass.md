# Chapter 19 — Compass

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [18-Dock.md](./18-Dock.md)  
> **Next chapter:** [20-Buttons.md](./20-Buttons.md)

---

## Purpose

This chapter defines **Livskompassen's signature compass** — the product icon, not a generic navigation glyph. The compass is the central symbol of the Life OS: direction, reflection, and calm authority.

Implementation lives in `ExecutiveDecorCompass.tsx`. Production dock uses the **hero textured asset**; smaller contexts use inline SVG or dock texture asset.

Any proposal to replace the compass with a Lucide icon, shrink it to side-icon size, or move it off-center fails DAD and does not ship.

---

## Philosophy

### The compass is not navigation chrome

| Wrong mental model | Correct mental model |
|--------------------|----------------------|
| "Home button in tab bar" | Product signature — like watch crown |
| "One icon among equals" | Dominates dock; ≥2× side icon visual weight |
| "Replaceable with logo mark" | Paired with but not replaced by `LivskompassMark` |

DAD rules (binding):

- Larger than all other navigation elements
- Breaks out of the dock vertically
- Placed **exactly in the center**
- Functions as visual anchor for the entire app

The compass may never be hidden behind hamburger-only navigation or demoted to header-only without PMIR.

---

## Visual Rules

### Asset strategy (textured vs SVG)

`ExecutiveDecorCompass` chooses render path by `size`:

| Size bucket | Render | Asset |
|-------------|--------|-------|
| `dock`, `dock-lg`, `hero`, `lg` | `<img>` textured | See table below |
| `sm`, `md` | Inline SVG | Token gradients `--accent`, `--accent-light` |

Constants in source:

```typescript
const HERO_ASSET = '/design/kompass-dock-rose.svg';
const DOCK_ASSET = '/icons/b1-kanon-ros.svg';
```

| Size prop | Asset used | Class |
|-----------|------------|-------|
| `hero` | `HERO_ASSET` | `exec-decor-compass--hero` |
| `dock`, `dock-lg` | `DOCK_ASSET` | `exec-decor-compass--textured` |
| `lg` | `DOCK_ASSET` | textured |
| `sm`, `md` | Inline SVG | programmatic gold gradients |

**Never use icon library compass glyphs in production chrome.**

### Textured presentation

Textured sizes get:

- `object-contain` sizing from `SIZE_CLASS`
- `exec-decor-compass--textured` filter: gold drop-shadow
- Hero override in dock: `.exec-decor-compass--hero` forced to `4.85rem` in `executive-chrome.css` with double drop-shadow stack

### Inline SVG (small sizes)

Programmatic SVG includes:

- Outer ring with gold linear gradient (`execGold-*`)
- Cardinal rose paths with glow filter
- Center gemstone (light + deep accent mix)

All fills/strokes use CSS variables — no hardcoded hex in component logic except `color-mix` fallbacks.

### Locked center position

In `ExecutiveDockBar`, compass is **always** inside `exec-dock-bar__compass-slot`:

- Grid column **3** (extended 6-zone)
- Grid column **2** (mix-E 4-zone)

Wrapped by `exec-dock-bar__compass` button with negative top margin so the rose floats above the glass capsule. This geometry is locked — see [18-Dock.md](./18-Dock.md).

---

## Sizing

`SIZE_CLASS` map in `ExecutiveDecorCompass.tsx`:

| Size | Tailwind class | Approx. dimension | Primary use |
|------|----------------|-------------------|-------------|
| `sm` | `h-8 w-8` | 32 px | Inline marks, tight UI |
| `md` | `h-12 w-12` | 48 px | Header decor, cards |
| `lg` | `h-16 w-16` | 64 px | Feature hero accents |
| `dock` | `h-[2.65rem] w-[2.65rem]` | ~42 px | Compact dock contexts |
| `dock-lg` | `h-[2.65rem] w-[2.65rem]` | ~42 px | Alias of dock |
| `hero` | `h-[5.15rem] w-[5.15rem]` | ~82 px | **Production dock** |

Production dock CSS may override hero to `4.85rem` for optical alignment with compass button ring — both values are canonical layers (component vs chrome).

**Rule:** Dock hero compass diameter ≥ 2× adjacent side glyph box (~1.15 rem icon in ~2.75 rem wrapper).

---

## Spacing

| Context | Rule |
|---------|------|
| Dock slot | `exec-dock-bar__compass-slot` flex-centers; `z-index: 3` |
| Breakout | Compass button `margin-top: -4.35rem` — rose clears capsule |
| Header decor | `exec-header-compass-mark` — separate from dock; smaller `md`/`lg` |
| Content | No extra padding inside compass SVG — spacing is chrome responsibility |

Compass must not collide with Fyren widget bar; dock stack height accounts for overlap.

---

## States

Compass **imagery** is static; **interaction states** belong to the parent button in dock:

| Parent class | Visual effect on compass |
|--------------|-------------------------|
| Default | Textured gold glow |
| `--home` | Standard home anchor |
| `--open` | Pulse on button ring; compass scales with button |
| `--holding` | Button `scale(1.08)`; Fyren ring overlays compass |

The `ExecutiveDecorCompass` component itself is decorative (`aria-hidden` on img/svg). All semantics live on the wrapping button.

---

## Examples

### Example A — Production dock hero

```tsx
<ExecutiveDecorCompass size="hero" className="exec-dock-bar__compass-mark" />
```

Loads `/design/kompass-dock-rose.svg`. User sees metallic rose with tick marks — reference: `docs/design/galleri/KOMPASS-LOCKED-kanon.png`.

### Example B — Header accent

```tsx
<ExecutiveDecorCompass size="md" className="exec-header-compass-mark" />
```

Inline SVG or small textured depending on theme header variant.

### Example C — Rejected patterns

- Lucide `Compass` icon in dock center
- Semicircle arc behind mark (`floating-dock__arc` in executive themes)
- Same 1.15 rem size as side glyphs

---

## Accessibility

| Topic | Spec |
|-------|------|
| Decorative mark | `aria-hidden` on compass img/svg |
| Name | Parent button `aria-label` — e.g. "Hamn. Håll tre sekunder för Valv." |
| Snabbstart | `aria-expanded` on parent when applicable |
| Reduced motion | Textured asset static; pulse is on button box-shadow only |
| Contrast | Gold on navy meets AA for decorative; interactive contrast on button ring |
| Alt text | Empty `alt=""` — meaning conveyed by button label |

---

## Animations

Compass artwork does not animate independently. Allowed motion on parent:

| Effect | Duration | Easing |
|--------|----------|--------|
| Hover scale | 200 ms | ease |
| Hold scale | 200 ms | ease |
| Open pulse | 3.5 s | ease-in-out infinite |
| Fyren ring | tied to long-press | linear progress |

Chameleon morph does not apply to compass — only input shells morph.

---

## Code Examples

### ExecutiveDecorCompass core

```tsx
// src/modules/core/ui/executive/ExecutiveDecorCompass.tsx
const HERO_ASSET = '/design/kompass-dock-rose.svg';
const DOCK_ASSET = '/icons/b1-kanon-ros.svg';

const TEXTURED_SIZES = new Set<Size>(['dock', 'dock-lg', 'hero', 'lg']);

export function ExecutiveDecorCompass({ className = '', size = 'md' }: Props) {
  if (TEXTURED_SIZES.has(size)) {
    const src = size === 'hero' ? HERO_ASSET : DOCK_ASSET;
    return (
      <img
        src={src}
        alt=""
        aria-hidden
        className={clsx(
          SIZE_CLASS[size],
          'exec-decor-compass--textured object-contain',
          size === 'hero' && 'exec-decor-compass--hero',
          className,
        )}
      />
    );
  }
  return (/* inline SVG with var(--accent) gradients */);
}
```

### Chrome override

```css
/* src/styles/executive-chrome.css */
.exec-dock-bar__compass-mark,
.exec-decor-compass--hero {
  width: 4.85rem !important;
  height: 4.85rem !important;
  filter:
    drop-shadow(0 0 8px color-mix(in srgb, var(--accent) 62%, transparent))
    drop-shadow(0 0 18px color-mix(in srgb, var(--accent) 32%, transparent));
}
```

---

## Do

- Use `ExecutiveDecorCompass` for all compass visuals in production
- Use `size="hero"` on dock; `sm`/`md` in headers and cards
- Keep `HERO_ASSET` path stable — update SVG asset, not component path, when art changes
- Preserve token-based SVG gradients for small sizes
- Treat compass as locked UX — run `smoke:locked-ux` on changes

---

## Don't

- Don't use Lucide, Material, or emoji compass icons in chrome
- Don't move compass off center grid column
- Don't shrink hero compass to side-icon scale
- Don't add semicircle arc "compass" shapes per premium-ui forbidden list
- Don't embed compass only in drawer/hamburger — dock center is mandatory
- Don't hardcode `#d4af37` in TSX — use `var(--accent)` in SVG/CSS

---

## Future Improvements

| Item | Notes |
|------|-------|
| **SVG sprite consolidation** | Single optimized rose with size variants |
| **Dark/light asset pair** | Only if new DAD — Executive Midnight is dark-only |
| **High-DPI asset** | `@2x` textured PNG/SVG for large tablets |
| **Theme pack overrides** | Document which packs may tint compass glow |
| **Static smoke snapshot** | Visual regression on `kompass-dock-rose.svg` hash |

---

### Related chapters

| Topic | Chapter |
|-------|---------|
| Dock geometry & glass capsule | [18-Dock.md](./18-Dock.md) |
| Icons (non-compass) | [21-Inputs.md](./21-Inputs.md) · Lucide family for side glyphs |
| DAD compass rules | `.cursor/rules/design-calm.mdc` |
| Reference image | `docs/design/galleri/KOMPASS-LOCKED-kanon.png` |
| Vision gaze order | [01-Vision.md](./01-Vision.md) |

---

*End of Chapter 19 — Compass*
