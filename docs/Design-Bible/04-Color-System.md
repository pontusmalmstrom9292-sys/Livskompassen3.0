# Chapter 04 — Color System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [03-Core-Principles.md](./03-Core-Principles.md)  
> **Next chapter:** [05-Typography.md](./05-Typography.md)

---

## Purpose

This chapter defines **how color is used, not merely which hex values exist**. Executive Midnight communicates safety, calm, and premium craft through a restrained obsidian-and-gold palette. Every surface, border, glow, and semantic state must resolve through tokens — never ad-hoc hex in feature code.

Color in Livskompassen is **semantic first**: backgrounds recede, text reads clearly, gold marks importance without shouting, and zone/silo accents orient the user without cross-contaminating knowledge silos.

---

## Philosophy

### Color communicates feeling, not category

Livskompassen is used under cognitive load. Color must:

- **Reduce anxiety** — dark, stable bases; no flashing or saturated fills
- **Guide attention** — gold draws the eye to one primary action per surface
- **Encode domain** — silo bento accents (gold, indigo, emerald) hint at zone context without neon HUD aesthetics
- **Preserve trust** — WORM evidence and journal surfaces feel archival, not gamified

### Executive Midnight is not Material Design

We do not use Material's primary/secondary/on-surface naming or elevation-tinted surfaces. We use **obsidian depth stacks**, **glass materials**, and **warm gold accents** inspired by luxury instruments — watch dials, compass bezels, vault interiors.

### Forbidden palette directions

| Forbidden | Why |
|-----------|-----|
| Neon cyan, magenta, lime | Gaming / cyberpunk — breaks calm |
| Pure `#00ff00` / `#ff00ff` accents | Sci-fi HUD — competes with compass |
| Material 3 tonal surfaces | Generic SaaS — not Livskompassen |
| High-saturation brand fills on large areas | Overwhelms ADHD/GAD users |
| Rainbow gradients on chrome | Breaks premium restraint |

Gold opacity tints (`--color-gold-05` … `--color-gold-40`) replace loud fills. Subtle is premium.

---

## Visual Rules

### Canonical base stack (I-stone / Executive Midnight default)

Runtime values come from `themeRegistry.ts` (I-stone pack) and `:root` in `src/index.css`. Production agents must alias through `--ds-color-*` or Tailwind semantic classes.

| Token | I-stone value | Role |
|-------|---------------|------|
| `--bg` | `#0a0a0a` | Deepest canvas — app shell, scroll backdrop |
| `--bg-dusk` | `#121212` | Secondary depth — scenic gradients, dusk layers |
| `--surface` | `#111111` | Primary elevated plane |
| `--surface-2` | `#1a1a1a` | Cards, panels, calm-card fill base |
| `--surface-3` | `#222222` | Nested inset, tertiary chrome |
| `--text` | `#f8fafc` | Primary readable copy |
| `--text-muted` | `#94a3b8` | Secondary copy, metadata |
| `--text-dim` | `#64748b` | Labels, eyebrows, de-emphasized hints |
| `--accent` | `#d4af37` | Primary gold — CTAs, compass ring, key icons |
| `--accent-light` | `#e8d48a` | Highlights, hover sheen on gold chrome |
| `--accent-secondary` | `#f59e0b` (I-stone) / `#6366f1` (E-skymning) | Secondary accent — use sparingly |
| `--accent-glow` | `rgba(212, 175, 55, 0.18)` | Ambient gold bloom — shadows, focus halos |
| `--success` | `#6b8f71` (I-stone) / `#10b981` (E-skymning) | Confirmation, wellbeing positive states |
| `--warning` | `#f59e0b` | Caution banners — not error |
| `--danger` | `#ef4444` | Destructive / critical — rare, never decorative |
| `--glass` | `rgba(8, 8, 8, 0.72)` | Standard glass panel background |
| `--glass-hero` | `rgba(8, 8, 8, 0.85)` | Hero cards — Dagens Reflektion, dock capsule |
| `--border` | `rgba(212, 175, 55, 0.12)` | Default hairline — gold-tinted |
| `--border-strong` | `rgba(212, 175, 55, 0.45)` (I-stone) | Active/focused borders |
| `--glass-border` | `rgba(212, 175, 55, 0.25)` | Glass panel rim |

### Gold opacity scale

Defined in `src/index.css`. Use for washes, rims, and hover states — **never** as full-screen backgrounds.

| Token | Value | Typical use |
|-------|-------|-------------|
| `--color-gold-05` | `rgba(212, 175, 55, 0.05)` | Zone gradient whisper (Valv bottom-left) |
| `--color-gold-06` | `rgba(212, 175, 55, 0.06)` | Vardagen / Valv ambient blob |
| `--color-gold-10` | `rgba(212, 175, 55, 0.1)` | Hjärtat zone gradient accent |
| `--color-gold-15` | `rgba(212, 175, 55, 0.15)` | Panel tint, badge wash |
| `--color-gold-18` | `rgba(212, 175, 55, 0.18)` | Matches `--accent-glow`; icon box inner light |
| `--color-gold-30` | `rgba(212, 175, 55, 0.3)` | Hover border mix on bento cards |
| `--color-gold-35` | `rgba(212, 175, 55, 0.35)` | Chip hover, snabbval emphasis |
| `--color-gold-40` | `rgba(212, 175, 55, 0.4)` | Maximum gold wash before solid accent |

Alias tokens: `--color-accent-gold-15`, `--color-accent-gold-18`, `--color-accent-gold-30`, `--color-accent-gold-35`.

### Semantic color mapping (design-system)

`src/design-system/tokens/colors.ts` exports stable names that bridge to CSS:

```ts
colors.accent   → var(--ds-color-accent)   → var(--accent)
colors.surface2 → var(--ds-color-surface-2) → var(--surface-2)
colors.border   → var(--ds-color-border)   → var(--border)
```

Legacy `DESIGN` export in `src/modules/core/ui/tokens.ts` maps the same values for older modules.

### Silo & zone bento accents

| Silo / zone | Class | Accent token | Role |
|-------------|-------|--------------|------|
| Hjärtat / reflection | `.bento-icon-box--gold` | `--bento-accent-gold` (`#d4af37`) | Warm gold |
| Kunskap / Valv | `.bento-icon-box--indigo` | `--bento-accent-indigo` (`#818cf8`) | Cool indigo |
| MåBra / wellbeing | `.bento-icon-box--emerald` | `--bento-accent-emerald` (`#10b981`) | Muted green |

Supporting: `--bento-accent-gold-dim` `rgba(212,175,55,0.2)`, `--bento-accent-gold-bg` gradient, indigo/emerald dim at 22%.

Zone shells: `--zone-gradient-hjartat`, `--zone-gradient-valv`, `--zone-gradient-vardagen`, `--zone-gradient-familjen`, `--zone-gradient-mabra` — obsidian base + ≤10% silo tint.

### Glass & depth color rules

1. Glass backgrounds use `--glass` or `--glass-hero`.
2. Inner highlights: `rgba(255,255,255,0.07–0.12)` top edge only.
3. Shadow color is ambient obsidian; colored glow only for compass/focus.
4. `color-mix(in srgb, var(--accent) N%, transparent)` over new hex literals.

---

## Sizing

| Surface type | Max gold coverage | Notes |
|--------------|-------------------|-------|
| Full viewport | 0% solid gold | Gradients ≤10% opacity only |
| Card face | ≤5% accent area | Icons, labels, one CTA |
| Primary button | 100% accent fill OK | One primary per region |
| Border / rim | 1px hairline | `--border` or `--glass-border` |
| Glow halo | ≤32px spread | `--ds-shadow-accent-glow` |

Icon boxes: `2.25rem × 2.25rem` (36px).

---

## Spacing

- Hub bento header: `padding: 0.875rem 1rem`, `border-radius: 1.25rem`, border `--accent` at 22% mix.
- Card inner glow rim: 1px top highlight.
- **8px minimum** between adjacent gold-bordered elements.

---

## States

| State | Background | Border | Text | Glow |
|-------|------------|--------|------|------|
| Default | `--surface-2` @ 60% + blur | `--border` | `--text` | none |
| Hover | +gold wash optional | accent 30% mix | `--accent` on icons | `--ds-elevation-card-hover` |
| Active | `--surface-3` | `--border-strong` | `--text` | reduced |
| Focus | unchanged | `--ds-focus-ring` | unchanged | 2px offset |
| Disabled | `--surface` @ 40% | `--border` @ 50% | `--text-dim` | none |
| Success | `--color-emerald-08` | emerald dim | `--success` | none |
| Warning | ember panel | `--warning` @ 30% | `--warning` | none |
| Danger | `--danger` @ 8% | `--danger` @ 40% | `--danger` | never glow |

---

## Examples

**Home hero:** obsidian gradient stack, `--glass-hero` card, gold section label at 18% tracking.

**Hub bento header:** gradient `rgba(20,28,43,0.72)` → `rgba(2,6,23,0.82)`, gold 22% border mix.

**Hjärtat zone:** `--zone-gradient-hjartat`, calm-card modules, gold bento icon boxes.

**Primary CTA:** `ds-btn--accent` — one per panel.

---

## Accessibility

- `--text` on `--bg`: ≥7:1 (`#f8fafc` / `#0a0a0a` ≈ 18:1).
- `--text-muted` on glass: verify ≥4.5:1 at 60% surface opacity.
- Never rely on gold vs indigo alone — add icon + label.
- Focus: `--ds-focus-ring` at accent 55%.

---

## Animations

| Property | Duration | Easing |
|----------|----------|--------|
| border-color | 250ms | `--ds-ease-premium` |
| background-color | 150–250ms | ease / premium |
| box-shadow | 250ms | premium |

No pulsing neon. `prefers-reduced-motion` zeroes durations in `variables.css`.

---

## Code Examples

```tsx
<div className="bg-surface-2/60 border border-border/30 text-text">
  <span className="text-accent">Dagens Reflektion</span>
  <p className="text-text-muted">Secondary copy</p>
</div>
```

```css
.panel {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  box-shadow: var(--ds-elevation-card);
}
.panel:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, var(--glass-border));
}
```

```tsx
import { colors } from '@/design-system';
```

```tsx
<div className="bento-icon-box bento-icon-box--gold"><Icon /></div>
```

---

## Do

- Use `--ds-color-*`, Tailwind semantic colors, gold opacity scale
- Match silo bento accent to zone
- Test contrast on glass surfaces
- Import from `@/design-system` or `DESIGN`

## Don't

- Hardcode hex in `src/modules/features/**`
- Introduce neon, Material containers, rainbow chrome gradients
- Fill large areas with solid gold
- Encode security by color alone

---

## Future Improvements

1. Theme-pack parity audit (E-skymning vs I-stone hierarchy)
2. `prefers-contrast: more` token overrides
3. Consolidate `--color-gold-*` and `--color-accent-gold-*`
4. Extend `midnight-gold-tokens.json` with opacity scale
5. Automated contrast CI in smoke pipeline
6. Explicit `--accent-on-accent` for CTA label contrast

---

*End of Chapter 04*
