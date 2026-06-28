# Chapter 11 — Shadow System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [10-Lighting.md](./10-Lighting.md)  
> **Next chapter:** [12-Animation-System.md](./12-Animation-System.md)

---


## Purpose

Defines **shadow tokens, layered stacks, accent glow, and interaction shadows** for Executive Midnight. Shadows ground glass surfaces and sell premium depth alongside lighting.

Coverage:

- `--ds-shadow-sm` through `--ds-shadow-xl`
- Accent glow shadows
- Inset vs outer shadow grammar
- Relationship to elevation chapter
- Tailwind `boxShadow` extensions

Files: `src/design-system/tokens/shadow.ts`, `variables.css`, `tailwind.config.js`, `obsidian-calm-2.css`, `executive-chrome.css`.

---

## Philosophy

| Principle | Shadow expression |
|-----------|---------------------|
| Layered | Inset highlight + inset depth + outer falloff + rim |
| Soft | Large blur, negative spread — not Material 2dp |
| Dark | Black/navy falloff — not gray fog on white |
| Accent tail | Gold glow on hover/hero only |
| Functional | Hover lift paired with shadow promotion |

One shadow layer feels **cheap**. Three+ feels **crafted**.

---

## Visual Rules

### Semantic shadow map

| Token | Aliases | Use |
|-------|---------|-----|
| `--ds-shadow-sm` | elevation-1 | Chips, tight elements |
| `--ds-shadow-md` | elevation-2 | Raised panels |
| `--ds-shadow-lg` | elevation-card | Default cards |
| `--ds-shadow-xl` | elevation-card-hover | Hover / peak |
| `--ds-shadow-accent-glow` | — | 0 0 16px accent-glow |
| `--ds-shadow-accent-glow-lg` | — | 0 0 32px accent-glow |

### Layer grammar (read bottom to top)

1. **Inset top highlight** — simulates light hit (`--ds-glass-highlight`)
2. **Inset bottom depth** — grounds panel into surface
3. **Hairline rim** — 1px accent or bg mix ring
4. **Outer ambient falloff** — large blur, negative spread
5. **Optional accent tail** — gold glow on hover/hero

Example elevation-card (from `variables.css`):

```css
--ds-elevation-card:
  inset 0 1px 0 var(--ds-glass-highlight),
  inset 0 -1px 0 color-mix(in srgb, var(--ds-color-bg) 28%, transparent),
  0 0 0 1px color-mix(in srgb, var(--ds-color-accent) 5%, transparent),
  0 12px 32px -10px var(--ds-ambient-falloff),
  0 4px 16px -6px color-mix(in srgb, var(--ds-color-bg) 70%, transparent);
```

### Dock shadow stack

```css
--ds-elevation-dock:
  inset 0 1px 0 color-mix(accent-light 22%),
  inset 0 -1px 0 color-mix(bg 35%),
  0 -8px 32px color-mix(accent 12%),
  0 16px 48px -10px color-mix(bg 58%),
  0 0 0 1px color-mix(accent 8%);
```

Upward gold spill + downward navy mass — dock floats.

### Drop-shadow vs box-shadow

| Tool | Use |
|------|-----|
| `box-shadow` | Cards, panels, dock capsule |
| `filter: drop-shadow()` | Compass SVG, irregular shapes |
| `text-shadow` | Wordmark only — sparingly |

Compass: `drop-shadow(0 0 16px accent 55%)` — not box-shadow on round SVG.

### Legacy fallbacks

`.calm-card` fallback: `0 10px 30px rgba(0,0,0,0.5)` if token missing.

`.calm-card-midnight`: simplified `0 4px 20px rgba(0,0,0,0.4)` — flat variant.

---

## Sizing

| Shadow | Blur | Spread | Offset Y |
|--------|------|--------|----------|
| sm outer | 14px | -6px | 4px |
| md outer | 24px | -8px | 8px |
| card outer | 32px | -10px | 12px |
| hover outer | 44px | -12px | 20px |
| dock up | 32px | 0 | -8px |
| accent glow sm | 16px | 0 | 0 |
| accent glow lg | 32px | 0 | 0 |

---

## Spacing

Shadow reach affects layout:

- Parent `overflow: hidden` clips shadows — avoid on hover cards
- Bottom margin ≥ 12px when hover promotes shadow
- Dock upward shadow needs content clearance (see spacing chapter)
- Grid gap 12px minimum so adjacent card shadows don't muddy

`isolation: isolate` on hub shell contains bleed without clipping children incorrectly.

---

## States

| State | Shadow |
|-------|--------|
| Rest | `--ds-shadow-lg` / elevation-card |
| Hover | `--ds-shadow-xl` + translateY -2px |
| Active | Slightly reduced blur — scale 0.985 |
| Focus | Focus ring independent of shadow |
| Hero | accent-glow-lg + elevation-4 tail |
| Modal | elevation-4 on panel; overlay separate |
| Disabled | Flatten to sm; no glow |
| `prefers-reduced-motion` | Hover may keep shadow without transform |

Module depth cards (`.module-bento-card--depth`): skip hover shadow transition.

---

## Examples

**Bento hover** (`obsidian-calm-2.css`):

```css
.bento-card:hover {
  box-shadow: var(--ds-elevation-card-hover, 0 15px 40px rgba(0,0,0,0.6));
  transform: translateY(var(--ds-hover-lift, -2px));
}
```

**Executive hero card**:

```css
box-shadow:
  0 1px 0 color-mix(accent 18%) inset,
  0 16px 40px rgba(0,0,0,0.45);
```

**Hub bento header**:

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.08),
  inset 0 -1px 0 rgba(0,0,0,0.32),
  0 8px 24px -8px rgba(0,0,0,0.65),
  0 0 0 1px rgba(212,175,55,0.06);
```

**Tailwind utility**:

```tsx
<div className="shadow-ds-lg hover:shadow-ds-xl transition-shadow duration-ds-normal" />
```

**Compass SVG**:

```css
filter: drop-shadow(0 0 18px color-mix(in srgb, var(--accent) 60%, transparent));
```

---

## Accessibility

- Shadows decorative — borders required for boundary perception
- High contrast mode: don't remove borders relying on shadow
- Focus ring must contrast independently
- No rapid shadow animation (vestibular)

---

## Animations

Card transition (250ms premium):

```css
transition: box-shadow var(--ds-duration-normal) var(--ds-ease-premium),
            transform var(--ds-duration-normal) var(--ds-ease-premium);
```

Shadow promotes smoothly with hover lift.

Accent glow may pulse on snabbstart (opacity layer — not shadow animation).

Reduced motion: transform disabled; shadow snap ok.

---

## Code Examples

```typescript
import { shadow } from '@/design-system/tokens/shadow';
// shadow.lg → var(--ds-shadow-lg)
// shadow.accentGlow → var(--ds-shadow-accent-glow)
```

```javascript
// tailwind.config.js
boxShadow: {
  'ds-sm': 'var(--ds-shadow-sm)',
  'ds-md': 'var(--ds-shadow-md)',
  'ds-lg': 'var(--ds-shadow-lg)',
  'ds-xl': 'var(--ds-shadow-xl)',
  'accent-glow': 'var(--ds-shadow-accent-glow)',
  'accent-glow-lg': 'var(--ds-shadow-accent-glow-lg)',
}
```

```tsx
<div style={{ boxShadow: 'var(--ds-elevation-dock)' }} className="dock-capsule" />
```

```css
.bento-icon-box {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 2px 8px -2px rgba(0,0,0,0.4);
}
```

---

## Do

- Use multi-layer `--ds-elevation-*` stacks
- Pair hover lift with shadow-xl promotion
- Use drop-shadow for SVG compass
- Keep accent glow for hero/compass/dock
- Test shadow clip on real devices

---

## Don't

- Single-layer gray shadows
- box-shadow on full-screen fixed bg
- Animated box-shadow loops
- Shadow as only focus indicator
- Neumorphism double inset only
- Hardcode rgba shadows in feature modules
- indigo-glow Tailwind except Kunskap accents

---

## Future Improvements

| Item | Notes |
|------|-------|
| Shadow lint | Flag single-layer in modules |
| Card `shadow` prop | design-system API |
| Shadow clip detector | overflow:hidden audit |
| Figma effect sync | Elevation + shadow unified export |
| Performance budget | Max shadow layers per viewport |

---

*Sources: shadow.ts, elevation.ts, variables.css, tailwind.config.js, obsidian-calm-2.css, executive-chrome.css.*
