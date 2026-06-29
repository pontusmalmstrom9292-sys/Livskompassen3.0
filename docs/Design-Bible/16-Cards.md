# Chapter 16 — Cards

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [15-Banners.md](./15-Banners.md)  
> **Next chapter:** [17-Header.md](./17-Header.md)


---

## Purpose

This chapter is the canonical reference for **card surfaces** in Executive Midnight—glass bento tiles, flat midnight panels, and executive home modules.

Cards are the primary content containers across hubs, home, and settings. Every card must deliver depth, legibility, and calm interaction without flat SaaS rectangles.

---

## Philosophy

Cards are **crafted objects** resting in ambient light (Chapters 08–11).

Two production families serve different energy levels:

- **Glass bento** (`calm-card`, `bento-card`, `BentoCard`) — reflective glass, hover lift, optional silo glow.
- **Flat midnight** (`calm-card-midnight`) — stricter, lower glare for executive settings and dense lists.
- **Executive surface** (`exec-surface-card`) — home grid modules with bronze border mix and soft blur.

Choose flat midnight when cognitive load must drop; choose glass bento when exploration and delight are appropriate.

---

## Visual Rules

| Class / component | Surface | Border | Shadow | Motion |
|-------------------|---------|--------|--------|--------|
| `.calm-card` | `bg-surface-2/60`, blur 24px | `border-border/30` | `--ds-elevation-card` | optional glow |
| `.bento-card` | extends calm-card | accent mix on hover | hover elevation | translateY lift |
| `.calm-card-midnight` | `#0c0c0e` solid | `rgba(255,255,255,0.05)` | soft 4px spread | minimal |
| `.exec-surface-card` | surface-2 78% + blur | accent 20% mix | 8px 28px black | hover border brighten |
| `BentoCard` | `@/design-system` Card | via `glow` prop | `module-bento-card--depth` optional | `interactive` |

**Top highlight:** `calm-card::before` 1px gradient ridge (obsidian-calm-2.css).

**Legacy alias:** `.glass-card` maps to calm-card parity.

---

## Sizing

| Token | Value |
|-------|-------|
| calm-card radius | `rounded-3xl` (1.5rem) |
| calm-card-midnight | `rounded-[2rem]` |
| exec-surface-card radius | `var(--exec-card-radius, 1.25rem)` |
| BentoCard padding | `ds-card--padding` from design-system |
| Hero card (home executive) | full width column, min-height content-driven |

Interactive cards: maintain 44px min touch height on primary rows.

---

## Spacing

- Bento grids: `gap-4` standard in hub shells and home layout A.
- Card header to body: design-system `CardHeader` + `CardBody` stack.
- Nested midnight cards (ExecutiveSettingsList): `p-1` group wrapper, rows inside.
- Planering bento: module-specific `planering-bento-card` spacing in planering.css.

---

## States

| State | calm-card / bento | calm-card-midnight | exec-surface |
|-------|-------------------|--------------------|--------------|
| Default | glass + ridge | flat dark | bronze border |
| Hover | lift + accent border | optional subtle | accent border 38% |
| Active | scale 0.99 | scale 0.99 | scale 0.985 |
| Disabled | opacity + no hover | same | same |
| Glow variant | `glow-bottom-gold/blue/green` | rarely used | N/A |

`BentoCard`: `interactive={false}` or deprecated `noHover` for static tiles.

---

## Examples

1. **BentoCard.tsx** — wraps design-system `Card`, maps title/description/icon to `CardHeader`.
2. **HomeLayoutA** — applies `calm-card-midnight` to executive tiles.
3. **ExecutiveSettingsList** — `calm-card-midnight p-1` grouping.
4. **home-layout-a--executive** — hero card gradient stack + `exec-surface-card` siblings.
5. **DagbokReflektionDelegate** — clickable midnight row with hover border accent.

---

## Accessibility

- Interactive cards: use `<button>` or clickable row with keyboard focus ring.
- Static cards: `<section>` semantics via design-system Card.
- Do not nest multiple primary buttons without headings—CardHeader title provides context.
- Contrast on midnight `#0c0c0e` requires `text-text` / `text-text-muted`, not dim gray on dim bg.

---

## Animations

- bento hover: `transform` + `box-shadow` over `--ds-duration-normal` with `--ds-ease-premium`.
- exec-surface: `border-color 0.2s`, `transform 0.15s` on active.
- Respect reduced motion: disable lift/scale (premium-polish.css pairs with motion tokens).

Home hero card uses gradient overlays—not animated shimmer.

---

## Code Examples

```tsx
// BentoCard — preferred module API
import { BentoCard } from '@/modules/shared/ui/BentoCard';

<BentoCard title="Dagens fokus" glow="gold" depth interactive>
  {children}
</BentoCard>

// Midnight flat panel
<section className="calm-card-midnight p-4">...</section>

// Executive home module
<div className="exec-surface-card p-4">...</div>
```

CSS source: `src/styles/obsidian-calm-2.css`, `src/styles/executive-chrome.css`, `src/design-system/components/Card.tsx`.

---

## Do

- Use `BentoCard` for new hub tiles needing title/icon/body.
- Use `calm-card-midnight` on executive home and settings for calmer surfaces.
- Apply `module-bento-card--depth` when Obsidian depth treatment is active.
- Pass `glow` prop for silo-aligned bottom accents (gold default for neutral).

---

## Don't

- Create new card CSS classes in feature folders without design-system review.
- Flat `#000` rectangles without border, shadow, or ridge highlight.
- Inline `boxShadow` or hex backgrounds in features.
- Mix `calm-card` glass with executive flat on same row without hierarchy reason.
- Remove `calm-card::before` highlight ridge when extending calm-card.

---

## Future Improvements

- Consolidate `glass-card` usages to `calm-card` alias removal.
- Card primitive Storybook / Theme Lab matrix for glow × depth × interactive.
- Tokenize `#0c0c0e` midnight background to `--surface-midnight` CSS var.
- Auto-select midnight vs glass via capacity score (paired with Chapter 15 gates).
