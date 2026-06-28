# Chapter 07 — Grid System

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [06-Spacing-System.md](./06-Spacing-System.md)  
> **Next chapter:** [08-Elevation.md](./08-Elevation.md)

---


## Purpose

Defines **layout grids and spatial composition** for Livskompassen — how content columns, bento tiles, home layout, and dock-centered structures align under Executive Midnight.

Coverage:

- Mobile-first single column → bento 2-col
- Home Layout A (executive)
- Snabbstart hub 3-column stage
- Hub page shells and module grids
- Dock-centered 5-column mental model

Files: `executive-chrome.css`, `obsidian-calm-2.css`, `Card.tsx`, `VardagenBentoShell.tsx`, `index.css`.

---

## Philosophy

| Principle | Grid expression |
|-----------|-----------------|
| Compass anchor | Center column reserved for compass / hero |
| Calm density | Max 2 columns on mobile bento — not 3+ |
| Content first | Grid serves cards, not dashboard widgets |
| One primary column | Journal and forms stay single column |
| Dock symmetry | Flanking columns balance around center FAB |

Grids must feel **composed**, not **templated**. Avoid Bootstrap 12-col sameness.

---

## Visual Rules

### Breakpoint strategy

| Viewport | Grid behavior |
|----------|---------------|
| 320–479px | Single column; full-width cards |
| 480–767px | 2-col bento where cards are peers |
| 768px+ | 2-col bento + wider gutters; hub max-width container |
| 1440px | Content max-width ~1200px; ambient bg full bleed |

Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px.

### Home Layout A (executive)

Structure (visual hierarchy, not equal grid):

```
[ Header / Wordmark ]
[ Hero — Dagens Reflektion ]
[ Snabbstart hub — 3-col stage ]
[ Section cards — 1 or 2 col ]
[ Dock clearance padding ]
```

Class: `.home-layout-a--executive` — flat layout, no bridge chrome.

### Snabbstart hub grid

```css
grid-template-columns: 1fr auto 1fr;
align-items: center;
gap: 0.5rem;
min-height: 9.5rem;
```

- Column 1: left satellite (Anteckning)
- Column 2: compass core (5.75rem circle)
- Column 3: right satellite (Familj / etc.)

Satellites: `justify-self: end/start`, slight negative margin overlap toward core.

### Bento module grid

Standard hub modules:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
  <Card>...</Card>
</div>
```

`VardagenBentoShell` wraps vardagen-specific spacing — same 1→2 col pattern.

### Dock mental model (5 slots)

Conceptual grid (not CSS grid on dock):

```
[ Slot 1 ] [ Slot 2 ] [ COMPASS ] [ Slot 4 ] [ Slot 5 ]
```

Compass breaks dock baseline — larger, centered, floats above capsule.

---

## Sizing

| Region | Width / height |
|--------|----------------|
| Snabbstart stage | min-height 9.5rem |
| Compass core | 5.75rem circle |
| Compass SVG home | 4.25rem float |
| Satellite column | min-height 5.5rem |
| Bento icon box | 2.25rem in 2-col cell |
| Hub max content | ~100% - 2rem horizontal pad |

Card aspect: prefer natural height — no forced square tiles except icon boxes.

---

## Spacing

- Bento grid gap: 0.75rem (gap-3) mobile, 1rem (gap-4) md+
- Snabbstart internal gap: 0.5rem
- Section stack gap: 1rem–1.5rem between major bands
- Hero to snabbstart: 0.75rem executive header margin

Grid gutters align with `--ds-space-4` baseline.

---

## States

| State | Grid behavior |
|-------|---------------|
| Snabbstart collapsed | Grid hidden; toggle only |
| Snabbstart open | Full 3-col stage visible |
| Low capacity | Single column even on sm+ |
| Modal open | Underlying grid inert; no reflow |
| Landscape phone | Maintain 2-col max; reduce min-heights |

---

## Examples

**Vardagen hub bento**:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Card glow="gold">MåBra</Card>
  <Card glow="blue">Planering</Card>
</div>
```

**Executive snabbstart** (CSS):

```css
.exec-snabbstart-hub__stage {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}
```

**Hub page shell**: top bar full width; content grid below header bento strip.

**Familjen Barnfokus**: single column question cards — no multi-col on child-facing flows.

---

## Accessibility

- DOM order matches visual order (especially snabbstart satellites)
- Single column for long forms — no side-by-side fields on 320px
- Compass remains reachable — not only via grid center tap on all breakpoints
- Grid gaps ≥ 8px between interactive cells
- No horizontal scroll on 320px width

Test home + vardagen hub at 320, 360, 412, 768 widths.

---

## Animations

Snabbstart expand: grid fades in; chevron rotates 180deg 0.25s.

Home stagger (`executiveHomeMotion.ts`): grid children animate opacity/y — not layout reflow.

Bento hover lift: translateY -2px — grid gap unchanged.

Reduced motion: instant show/hide snabbstart; no stagger.

---

## Code Examples

```tsx
<section className="home-layout-a home-layout-a--executive px-4 pb-ds-dock-clearance">
  <div className="home-layout-a__hero-card">...</div>
  <div className="exec-snabbstart-hub">...</div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">...</div>
</section>
```

```tsx
import { Card } from '@/design-system/components/Card';
<Card className="bento-card" glow="gold" depth />
```

```css
.exec-snabbstart-hub__satellite--left {
  grid-column: 1;
  justify-self: end;
}
.exec-snabbstart-hub__core { grid-column: 2; }
```

---

## Do

- Mobile-first 1 col → sm 2 col bento
- Keep compass in center column mentally and visually
- Use gap-3/gap-4 from spacing scale
- Single column for journal/WORM forms
- Test 320px width

---

## Don't

- 3+ column bento on mobile
- CSS grid on dock that shrinks compass
- Equal-height forced squares for all cards
- Horizontal scroll layouts
- Dashboard-style 12-col admin grids
- Reorder DOM for visual effect without aria

---

## Future Improvements

| Item | Notes |
|------|-------|
| Grid smoke at 320/768 | Playwright snapshots |
| Tablet 3-col bento | Only if Pontus OK — currently 2 max |
| CSS subgrid | When browser support sufficient |
| HEM-LAYOUT-A kanon link | Cross-ref design/references |
| Capacity-aware col count | Hook-driven 1-col override |

---

*Sources: executive-chrome.css, obsidian-calm-2.css, Card.tsx, VardagenBentoShell.tsx, executiveHomeMotion.ts.*
