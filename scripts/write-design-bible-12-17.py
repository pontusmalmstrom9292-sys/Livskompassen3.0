#!/usr/bin/env python3
"""Write Design Bible chapters 12–17 (Executive Midnight). Does not delete existing files."""

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "docs" / "Design-Bible"

SECTIONS = """
## Purpose

## Philosophy

## Visual Rules

## Sizing

## Spacing

## States

## Examples

## Accessibility

## Animations

## Code Examples

## Do

## Don't

## Future Improvements
""".strip().split("\n\n")

CHAPTERS = {
    "12-Animation-System.md": {
        "num": 12,
        "title": "Animation System",
        "prev": "11-Layout.md",
        "next": "13-Icons.md",
        "body": r'''# Chapter 12 — Animation System

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
''',
    },
    "13-Icons.md": {
        "num": 13,
        "title": "Icons",
        "prev": "12-Animation-System.md",
        "next": "14-Illustrations.md",
        "body": r'''# Chapter 13 — Icons

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [12-Animation-System.md](./12-Animation-System.md)  
> **Next chapter:** [14-Illustrations.md](./14-Illustrations.md)

---

## Purpose

This chapter defines **iconography rules** for Executive Midnight — one optical family, consistent stroke, and clear separation between UI glyphs (Lucide) and brand marks (custom SVG compass, Kompis avatar).

Coverage:

- `Icon` wrapper from `@/design-system/components/Icon.tsx`
- Lucide as the sole icon library for UI chrome
- Custom SVG exceptions (compass, header glyphs, Kompis mark)
- Size tokens (`ds-icon--sm|md|lg`)
- Silo accent colours on icon boxes in cards

Primary files: `src/design-system/components/Icon.tsx`, `src/design-system/styles/components.css`, `src/modules/core/ui/HeaderChromeGlyphs.tsx`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Unity | One stroke weight (1.5) across all Lucide icons |
| Restraint | Icons support labels — rarely stand alone without `aria-label` |
| Hierarchy | Gold accent for primary; silo tints for module context |
| Brand sacred | Compass and logotype are NOT Lucide — custom SVG only |
| Calm | No filled emoji-style icons in production chrome |

Icons communicate **function**, not personality. The compass communicates **identity**.

DAD rule: Ögat (eye) is primary header function — its glyph must remain visually dominant among action icons but never compete with the LIVSKOMPASSEN wordmark.

---

## Visual Rules

### Lucide wrapper (`Icon`)

```tsx
export const DS_ICON_STROKE = 1.5;
```

| Size class | Token | Dimensions |
|------------|-------|------------|
| `sm` | `ds-icon--sm` | 16px (`--ds-space-4`) |
| `md` | `ds-icon--md` | 20px (`--ds-space-5`) |
| `lg` | `ds-icon--lg` | 24px (`--ds-space-6`) |

Wrapper: `display: inline-flex`, `flex-shrink: 0`, centres SVG.

### Custom SVG exceptions

| Asset | Location | Rule |
|-------|----------|------|
| Compass rose | Dock centre, widget routes | Custom SVG — never Lucide `Compass` |
| Header menu glyph | `HeaderChromeGlyphs.tsx` | Bespoke stroke matching 1.5 weight |
| Kompis avatar mark | `KompisAvatar.tsx` | Embedded SVG; header variant `--header-chrome` |
| Shield / vault | WORM confirm sheets | Lucide `Shield` acceptable |

### Icon boxes (card headers)

`CardHeader` maps glow to box class:

| Glow | Class | Silo hint |
|------|-------|-----------|
| `gold` | `bento-icon-box bento-icon-box--gold` | Default / Vardagen |
| `blue` / `indigo` | `bento-icon-box bento-icon-box--indigo` | Kunskap / Valv |
| `green` | `bento-icon-box bento-icon-box--emerald` | MåBra / wellbeing |

Boxes carry inner highlight shadow from `premium-polish.css` — subtle depth, not flat squares.

### Colour application

- Default icon colour: inherit from parent (`text-accent`, `text-text-dim`)
- Active dock satellite: silo-specific (`--indigo`, lavender, emerald, gold)
- Destructive: `text-danger` on Lucide — never recolour custom brand SVGs
- Disabled: `opacity-50` on parent button — do not grey individual paths

---

## Sizing

| Context | Icon size | Touch target |
|---------|-----------|--------------|
| Header chrome button | 20px glyph (`h-5 w-5`) | 44px (`--ds-touch-target`) |
| Dock satellite | ~18px (`h-[1.15rem]`) | 48px glass plate |
| Card header box | 20–24px inside padded box | n/a |
| Inline list row | `sm` (16px) | full row 44px min |
| Bento tile | `md` | entire tile clickable |
| Kompis header embed | enlarged mark, no extra ring | 44px button |

Optical alignment: centre SVG in flex container; avoid manual `margin-top` hacks.

---

## Spacing

| Pattern | Gap / padding |
|---------|---------------|
| Icon + label (header button) | `gap-2` inside `.ds-btn` |
| CardHeader icon + text | `gap-2.5` (10px) |
| Dock satellite icon + label | `gap-1`, label `text-[8px]` uppercase |
| Icon box internal padding | defined by `bento-icon-box` (approx `--ds-space-2`) |
| Inline icon in banner | `mr-2` before title text |

Icons in buttons: always `aria-hidden` on decorative spans; label on button element.

---

## States

| State | Visual |
|-------|--------|
| **Default** | Stroke 1.5, inherited colour |
| **Hover** (button) | Parent `header-chrome-btn` glow — icon unchanged |
| **Active** | Parent scale press — icon follows |
| **Selected / active nav** | Silo accent colour on `.dock-hub-sat__icon` |
| **Disabled** | Parent `opacity-50 pointer-events-none` |
| **Focus-visible** | Ring on button wrapper — not on SVG |
| **Live Kompis** | `.kompis-avatar--live` pulse on mark — subtle |

Never animate icon stroke width. Never swap icon families between states.

---

## Examples

### Design-system Icon

```tsx
import { Icon } from '@/design-system';
import { Shield } from 'lucide-react';

<Icon icon={Shield} size="md" label="Skydd" />
```

### Header chrome (production)

`DesignPackCenterHeader.tsx`:

```tsx
<HeaderMenuGlyph className="header-chrome-btn__glyph h-5 w-5 text-accent" />
```

Menu button: round chrome, 44px, gold glyph.

### Card with icon box

```tsx
<BentoCard
  title="Veckopeng"
  description="Ekonomi"
  glow="gold"
  icon={<Icon icon={Wallet} size="sm" />}
>
  …
</BentoCard>
```

### Dock satellite

Lucide icon inside `.dock-hub-sat__glass` — colour from silo modifier class.

### WORM confirm

Shield icon inline with copy — static, no spin animation.

---

## Accessibility

- Decorative icons: `aria-hidden={true}` on wrapper (default when no `label`)
- Functional standalone icons: `label` prop → `aria-label` on SVG
- Never rely on icon shape alone — pair with visible text or `aria-label` on button
- Touch targets minimum **44px** — use `HeaderButton` / `header-chrome-btn`
- Contrast: gold on navy meets AA when icon is `text-accent` on `--ds-color-bg`
- Screen reader order: button label first, not icon description

---

## Animations

Icons themselves do not animate independently in Executive Midnight.

| Context | Allowed |
|---------|---------|
| Parent button hover | translateY on chrome, not icon morph |
| Dock fan reveal | opacity + scale on satellite container |
| Kompis live | subtle mark glow — container level |
| Loading | use `Spinner` component — not rotating arbitrary icons |

Do not rotate Lucide icons for refresh. Use `Spinner` or static text.

Reduced motion: dock fan instant; no spinners that rotate (replace with static "Laddar…").

---

## Code Examples

### Import pattern

```tsx
import { Icon, DS_ICON_STROKE } from '@/design-system';
import { Eye, Shield, Menu } from 'lucide-react';
```

### Header action button

```tsx
<HeaderButton aria-label="Öppna skydd">
  <Icon icon={Shield} size="md" />
</HeaderButton>
```

### Planering bento icon box (legacy class)

```tsx
<div className="planering-bento-icon-box planering-bento-icon-box--amber">
  <Icon icon={CalendarDays} size="sm" />
</div>
```

Prefer migrating to `CardHeader` + `bento-icon-box--*` where touched.

### CSS size tokens

```css
.ds-icon--md {
  width: var(--ds-space-5);
  height: var(--ds-space-5);
}
```

---

## Do

- Import Lucide icons tree-shaken per file
- Use `Icon` wrapper for all Lucide glyphs in new code
- Keep `DS_ICON_STROKE = 1.5` — override only with design approval
- Match silo glow on card icon boxes to module zone
- Use custom SVG for compass and brand marks
- Provide `aria-label` on icon-only buttons

---

## Don't

- Do not mix Lucide with Heroicons, Phosphor, or emoji in chrome
- Do not use filled icon variants unless Lucide default is fill-based
- Do not shrink icons below 16px in interactive contexts
- Do not apply rainbow gradients to icon strokes
- Do not replace compass with Lucide `Compass` in dock
- Do not add icon animation loops (pulse, spin) without functional reason
- Do not hardcode icon colours with hex — use `text-accent`, `text-text-dim`

---

## Future Improvements

- Icon catalogue page in Theme Lab with all approved Lucide glyphs
- Codemod: replace raw `<LucideIcon size={…} strokeWidth={…}>` with `Icon`
- SVG sprite audit for custom marks (compass v2, eye, shield)
- Automatic contrast check on silo-tinted dock icons
- Export `DS_ICON_STROKE` to Figma design tokens
- Lint rule: block `lucide-react` import outside `Icon.tsx` and approved exceptions
''',
    },
    "14-Illustrations.md": {
        "num": 14,
        "title": "Illustrations",
        "prev": "13-Icons.md",
        "next": "15-Banners.md",
        "body": r'''# Chapter 14 — Illustrations

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [13-Icons.md](./13-Icons.md)  
> **Next chapter:** [15-Banners.md](./15-Banners.md)

---

## Purpose

This chapter defines **illustrative and atmospheric visuals** in Executive Midnight — hero photography, empty states, decorative overlays, and sandbox mockups. Livskompassen is not illustration-heavy; visuals serve reflection, depth, and calm — not mascot branding.

Coverage:

- Basta Design hero imagery (`basta-design__hero-*`)
- `EmptyState` text-first pattern
- Module hero overlays and gradient bands
- Sandbox vs production illustration boundaries
- Photography treatment (dark overlay, gold title glow)

Primary files: `src/modules/core/home/basta-design/BastaDesignHome.tsx`, `src/styles/basta-design.css`, `src/modules/core/ui/EmptyState.tsx`, `src/design-system/styles/premium-polish.css`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Restraint | Illustration supports mood — never dominates UI |
| Text-first | Empty states use calm copy, not clipart |
| Depth | Hero photos sit behind glass overlays and gradients |
| Safety | No cartoon mascots, no gamified characters in prod |
| Reflection | Home hero asks one question — visual quiet around it |

Livskompassen illustrations answer: *Where am I emotionally?* — not *Look at this cute character*.

Sandbox (`/dev/theme-lab`, `obsidian-forge-lab`) may experiment; production routes must pass DAD calm test.

---

## Visual Rules

### Hero photography (Basta Design)

Structure in `BastaDesignHome.tsx`:

```
.basta-design__hero
  ├── img.basta-design__hero-img
  ├── .basta-design__hero-overlay (gradient scrim)
  └── .basta-design__hero-content
        ├── .basta-design__hero-main (title + lead)
        └── .basta-design__hero-aside (reflection prompt)
```

Overlay gradient (`premium-polish.css`):

- Top: 15% bg mix — image visible
- Mid: 55% — readable text zone
- Bottom: 92% — merges into `--bd-bg`

Title treatment: `text-shadow` with gold glow + deep falloff — `.basta-design__hero-title`.

### Empty states

`EmptyState.tsx` — **no illustration asset**:

- Rounded glass panel: `border-border/30 bg-surface-2/35`
- Muted copy: `text-sm text-text-muted`
- Optional action slot — single CTA max
- `role="status"` + `aria-live="polite"`

Copy tone: neutral, no guilt ("Inga poster ännu." not "Du har missat…").

### Modal gradient bands

`MabraCheckinModal` uses a subtle top gradient band (accent → accent-ai) — modal-only decoration, not full illustration.

### Error and fallback

`ErrorFallback` from design-system — icon + message in card with silo glow. No comic illustrations.

### Sandbox illustrations

`obsidian-forge-lab.css`, `obsidian-depth-mockup.css` — experimental bento art direction. Do not promote to prod without PMIR.

---

## Sizing

| Asset | Dimensions | Notes |
|-------|------------|-------|
| Hero image | `object-cover`, full bleed width | Lazy-loaded |
| Hero content max | container padding | Mobile stack |
| Hero aside | ~30% width desktop | Below main on mobile |
| Empty state | full container width | min height auto — no forced 200px |
| Modal gradient band | 4–6px height top edge | subtle |
| Kompis avatar (illustrative mark) | 32–40px header embed | SVG vector |

Hero image must not exceed viewport height on mobile — use `max-h` constraints from `basta-design.css`.

---

## Spacing

| Region | Padding / gap |
|--------|---------------|
| Hero content | `--ds-space-5` to `--ds-space-8` |
| Hero aside labels | uppercase tracking wide, `mt-2` between labels |
| Empty state | `px-4 py-4`, `space-y-3` |
| Hero overlay | inset 0 — no padding |
| Reflection footnote | `mt-3` from prompt |

Maintain `--app-dock-clearance` below hero scroll content.

---

## States

| State | Treatment |
|-------|-----------|
| **Hero loaded** | Image visible through scrim; title gold glow |
| **Hero loading** | Skeleton or dark placeholder — no flash of white |
| **Empty list** | EmptyState panel — static |
| **Empty search** | Different copy — same visual treatment |
| **Error** | ErrorFallback card — glow matches silo |
| **Crisis (Akut)** | No illustrative photography — solid surface |
| **Reduced motion** | Hero image static — disable Ken Burns if present |

Never use illustration to indicate loading progress bars with cartoon characters.

---

## Examples

### Home hero (production)

`BastaDesignHome.tsx` — motion stagger on hero section, photographic background, reflection aside with one question.

### Journal empty archive

`JournalArchive.tsx`:

```tsx
<EmptyState message="Inga poster ännu." />
<EmptyState message="Inga träffar — prova ett annat sökord eller filter." />
```

### Vault panels

`VaultAktorskartaPanel.tsx` — EmptyState with actionable copy when no persons exist.

### Familjen gate

`FamiljenPage.tsx` — EmptyState when logged out — no lock illustration.

### Sandbox BastaDesignApp

Mirror of home hero for `/dev` routes — same CSS classes, may use alternate copy.

---

## Accessibility

- Hero images: meaningful `alt` if informative; `alt=""` if purely decorative with text equivalent nearby
- Empty states: `role="status"` so screen readers announce when list clears
- Do not embed text inside hero JPG — always HTML text overlay
- Contrast on hero: overlay must guarantee AA for title and lead
- Crisis flows: zero decorative imagery that could feel trivializing
- Reduced motion: no autoplay video backgrounds

---

## Animations

| Element | Motion |
|---------|--------|
| Hero section | stagger fade-up via `useExecutiveHomeMotion` |
| Hero image | static in prod; sandbox may animate — disable in prod |
| Empty state | none |
| Gradient band (modal) | optional subtle pulse — disabled under reduced motion |
| Overlay scrim | static gradient |

`.basta-design__hero-img` animation disabled in `prefers-reduced-motion` block.

---

## Code Examples

### Hero structure

```tsx
<motion.div className="basta-design__hero" {...staggerChild}>
  <img src={heroSrc} alt="" className="basta-design__hero-img" />
  <div className="basta-design__hero-overlay" />
  <div className="basta-design__hero-content">
    <h2 className="basta-design__hero-title">{greeting}</h2>
    <p className="basta-design__hero-lead">{lead}</p>
  </div>
</motion.div>
```

### Empty state

```tsx
import { EmptyState } from '@/core/ui/EmptyState';

<EmptyState
  message="Inga kuvert ännu. Skapa ett nedan."
  action={<Button variant="accent">Nytt kuvert</Button>}
/>
```

### CSS overlay token

```css
.basta-design__hero-overlay {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--bd-bg) 15%, transparent) 0%,
    color-mix(in srgb, var(--bd-bg) 55%, transparent) 48%,
    color-mix(in srgb, var(--bd-bg) 92%, transparent) 100%
  );
}
```

---

## Do

- Use photography with dark scrim for emotional home hero
- Keep empty states text-first and low-affect
- Lazy-load hero images
- Match illustration glow to Executive Midnight gold/navy palette
- Test hero readability at 320px width
- Use SVG for scalable brand marks (compass, Kompis)

---

## Don't

- Do not add mascot characters to production modules
- Do not use stock illustrations with bright white backgrounds
- Do not embed guilt language in empty state copy
- Do not autoplay video loops on home
- Do not promote sandbox forge art to prod without PMIR
- Do not use illustrations as the only empty-state signal — always include text
- Do not place illustrative elements behind critical tap targets

---

## Future Improvements

- Curated hero image rotation tied to time-of-day (single asset, low bandwidth)
- Optional abstract SVG texture layer (noise) at 3% opacity for depth
- EmptyState variant with single Lucide line icon (opt-in, not default)
- Theme Lab gallery documenting approved vs rejected illustration styles
- WebP/AVIF pipeline for hero assets with blur placeholder
- Illustration audit script flagging raster images > 200KB in `src/modules/features`
''',
    },
    "15-Banners.md": {
        "num": 15,
        "title": "Banners",
        "prev": "14-Illustrations.md",
        "next": "16-Cards.md",
        "body": r'''# Chapter 15 — Banners

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [14-Illustrations.md](./14-Illustrations.md)  
> **Next chapter:** [16-Cards.md](./16-Cards.md)

---

## Purpose

This chapter defines **banner and section header strips** in Executive Midnight — inline alerts, module intros, and hub section labels. Banners orient the user without adding another navigation layer.

Coverage:

- `Banner` component from `@/design-system/components/Banner.tsx`
- Variants: `info`, `warning`, `danger`, `section`
- Legacy `module-section-banner` depth treatment
- Planering guard bars and snabbstart banners
- Alert semantics for crisis and WORM messaging

Primary files: `src/design-system/components/Banner.tsx`, `src/design-system/styles/components.css`, `src/styles/obsidian-depth-mockup.css`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Orientation | Banner answers "where am I in this module?" |
| Calm alerts | Danger uses muted rose tint — not screaming red fill |
| Hierarchy | Eyebrow → title → lead — progressive disclosure |
| Brevity | One banner per viewport section — no stacking |
| Action clarity | `aside` slot for single secondary action max |

Banners are **signposts**, not billboards. They should feel like embossed glass strips, not Bootstrap alerts.

Section banners (`variant="section"`) replace legacy page titles inside hub scroll islands.

---

## Visual Rules

### Design-system banner (alert/info)

Class: `.ds-banner` + modifier:

| Variant | Class | Border / background |
|---------|-------|---------------------|
| `info` | `ds-banner--info` | Gold-tinted border (22% accent mix) |
| `warning` | `ds-banner--warning` | Warning colour 35% border, 8% tint fill |
| `danger` | `ds-banner--danger` | Danger 35% border, 8% tint fill; `role="alert"` |

Shared styling:

- Radius: `--ds-radius-xl`
- Glass gradient background (145deg surface mix)
- Backdrop blur: `--ds-blur-lg`
- Shadow: `--ds-shadow-md`
- Padding: `--ds-space-3-5` × `--ds-space-4`

### Section banner (in-module)

Classes: `module-section-banner module-section-banner--depth`

- Deeper elevation (`--ds-elevation-2` in zone polish)
- Title: `.module-section-banner__title` — display font, wide tracking
- Lead: `.module-section-banner__lead` — muted body
- With action: `module-section-banner--with-aside` flex wrap

### Typography slots

| Slot | Style token |
|------|-------------|
| Eyebrow | `textStyles.eyebrow` |
| Title (alert) | `textStyles.titleSection` |
| Title (section) | `module-section-banner__title` |
| Lead | body / `module-section-banner__lead`, `text-text-muted` |

### Planering-specific

`planering-snabbstart-banner`, `planering-guard-bar` — card elevation, hover polish from `premium-polish.css`. Treat as specialised section banners inside Planering zone.

---

## Sizing

| Element | Size |
|---------|------|
| Banner min height | content-driven — no fixed 80px |
| Title (section) | `--ds-font-size-sm` to `--ds-font-size-lg` |
| Eyebrow | `--ds-font-size-2xs` uppercase |
| Aside action button | min 44px touch |
| Max width | inherits hub container (`max-w-*` on parent) |
| Guard bar | full hub width inside scroll island |

Banners never span wider than their hub column.

---

## Spacing

| Pattern | Value |
|---------|-------|
| Internal padding | 14px × 16px (`3.5` × `4` space tokens) |
| Eyebrow → title | `mt-1` |
| Title → lead | `mt-1` |
| Aside gap | `gap-3` flex wrap |
| Banner → content below | `mb-4` to `mb-6` (module convention) |
| Stacked sections | minimum `space-y-6` between banner and next card grid |

Do not nest banners inside cards — sibling relationship only.

---

## States

| State | Behaviour |
|-------|-----------|
| **Info** | Default gold border — informational only |
| **Warning** | Amber border tint — reversible situation |
| **Danger** | Rose tint + `role="alert"` — requires acknowledgment or action |
| **Section** | No alert role — structural heading |
| **With aside** | Action right-aligned desktop; wraps below on narrow |
| **Dismissible** | Not built-in — use Sheet/Modal for persistent dismiss |
| **Disabled action** | Aside button `disabled:opacity-50` |

Danger banners in crisis (SOS) stay low-affect — copy from `AKUT_LANDING_COPY`, not red flashing strip.

---

## Examples

### Info banner with slots

```tsx
<Banner
  variant="info"
  eyebrow="Vardagen"
  title="MåBra"
  lead="En check-in i taget."
/>
```

### Section banner in Valv

```tsx
<Banner
  variant="section"
  title="Mönster"
  lead="Frekvens över tid — inga diagnoser."
  aside={<Button variant="ghost" size="sm">Exportera</Button>}
/>
```

### Warning (planering guard)

Planering guard bar when integration missing — warning tint, single repair action.

### Danger (WORM reminder)

Short copy before irreversible save — prefer inline `WormSaveConfirmSheet` over banner for final confirm.

### Hub page intro

Module hub uses section banner at top of `calm-scroll-island` before bento grid.

---

## Accessibility

- `variant="danger"` sets `role="alert"` on `<header>`
- Info/warning/section: no alert role — avoid crying wolf
- Headings: use `title` prop → renders `<h2>` for section variant
- Colour not sole indicator — warning/danger include text label
- Aside actions: explicit `aria-label` if icon-only
- Contrast: danger tint 8% still meets text AA on `--ds-color-text-muted`
- Screen reader order: eyebrow, title, lead, then aside

---

## Animations

Banners are **static** in Executive Midnight.

| Interaction | Motion |
|-------------|--------|
| Banner mount | none — instant |
| Aside button | standard button press/hover |
| Section depth hover | none on banner itself |
| Guard bar | border/shadow transition on planering hover (container) |

Do not slide banners in from top — use opacity fade on parent page stagger if needed.

---

## Code Examples

### Import

```tsx
import { Banner } from '@/design-system';
```

### Planering snabbstart pattern

```tsx
<header className="planering-snabbstart-banner module-section-banner--depth">
  <p className="text-xs uppercase tracking-wide text-text-dim">Snabbstart</p>
  <h2 className="module-section-banner__title">Vad behöver din dag?</h2>
</header>
```

Prefer migrating to `<Banner variant="section" … />` when touching file.

### CSS core

```css
.ds-banner {
  border-radius: var(--ds-radius-xl);
  backdrop-filter: blur(var(--ds-blur-lg));
  padding: var(--ds-space-3-5) var(--ds-space-4);
}
```

### Danger alert

```tsx
<Banner variant="danger" title="Osparade ändringar" lead="Spara innan du lämnar." />
```

---

## Do

- Use `Banner` from design-system for new module intros
- Limit one primary banner per hub viewport
- Use `section` variant for wayfinding, `info/warning/danger` for status
- Put single optional action in `aside`
- Keep copy short — eyebrow + title often sufficient
- Match planering/valv polish classes when inside those zones

---

## Don't

- Do not stack multiple danger banners
- Do not use banners for long-form help text — link to Kunskap
- Do not use bright solid red `#ef4444` fills — 8% tint only
- Do not animate banner border pulse
- Do not replace page-level `<h1>` in app header with banner title
- Do not hide critical WORM confirm inside dismissible banner
- Do not add fourth variant without design-system PR

---

## Future Improvements

- `Banner dismiss` prop with WORM-safe persistence rules
- Unified `HubSectionHeader` alias wrapping `Banner variant="section"`
- Storybook matrix: all variants × light/dark × narrow/wide
- Auto-smoke: danger banners must include visible text > 10 chars
- Migrate `planering-snabbstart-banner` to DS Banner entirely
- Optional icon slot left of title (Lucide via `Icon` wrapper)
''',
    },
    "16-Cards.md": {
        "num": 16,
        "title": "Cards",
        "prev": "15-Banners.md",
        "next": "17-Header.md",
        "body": r'''# Chapter 16 — Cards

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [15-Banners.md](./15-Banners.md)  
> **Next chapter:** [17-Header.md](./17-Header.md)

---

## Purpose

This chapter defines **card surfaces** in Executive Midnight — the primary content container across all three zones. Cards carry glass depth, silo glow, and calm hover feedback. They are the main unit of progressive disclosure.

Coverage:

- `Card`, `CardHeader`, `CardBody` from `@/design-system`
- `BentoCard` re-export with depth default
- Legacy `calm-card` parity classes
- Glow variants: gold, blue, green, indigo
- Hero cards, modal panels, and module bento grids

Primary files: `src/design-system/components/Card.tsx`, `src/design-system/styles/components.css`, `src/modules/shared/ui/BentoCard.tsx`, `src/design-system/styles/premium-polish.css`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Depth mandatory | No flat rectangles — layered shadow + top highlight |
| Glass | Backdrop blur + semi-transparent surface-2 |
| Silo hint | Bottom glow colour maps to zone/knowledge silo |
| Calm interaction | Hover lift 2px — not bounce |
| One idea per card | Title + short description + focused content |

Cards are **jewel cases** for content — premium, restrained, tactile.

DAD: cards must never feel like Material tiles or Bootstrap panels.

---

## Visual Rules

### Base card (`.ds-card`)

| Layer | Implementation |
|-------|----------------|
| Background | `surface-2` 60% mix + `--ds-glass-blur` |
| Border | `border` 30% mix |
| Top highlight | `::before` 1px gradient sheen |
| Shadow | `--ds-shadow-lg` (`--ds-elevation-card`) |
| Radius | `--ds-radius-card` (default `--ds-radius-2xl`) |

### Variants

| Prop | Class | Use |
|------|-------|-----|
| `variant="default"` | `.ds-card` | Standard modules |
| `variant="hero"` | `.ds-card--hero .glass-hero` | Home hero, featured |
| `interactive={true}` | `.ds-card--interactive` | Hover lift + shadow upgrade |
| `bare={true}` | skips `--padding` | Custom inner layout |
| `depth={true}` | `module-bento-card--depth` | 3D bento treatment |
| `glow="gold"` | `glow-bottom-gold` | Vardagen / default |
| `glow="blue"` | `glow-bottom-blue` | Valv / Kunskap |
| `glow="green"` | `glow-bottom-green` | MåBra / wellbeing |

### CardHeader

- Icon box optional — `bento-icon-box--{gold|indigo|emerald}`
- Title: display font, sm, semibold, `text-accent`
- Description: 2xs uppercase wide tracking, `text-text-dim`

### Legacy alias

Many modules still use `calm-card` + glow classes directly. New code should use `Card` / `BentoCard` — visual parity maintained via shared CSS.

### Modal/Sheet panels

`Modal.tsx` panel: `ds-modal-panel ds-card glow-bottom-gold` — card rules apply to overlays.

---

## Sizing

| Context | Padding | Radius |
|---------|---------|--------|
| Default card | `--ds-space-5` (20px) | `--ds-radius-2xl` |
| SuperModule shell | `p-4 sm:p-5` | `rounded-2xl` |
| Bento grid tile | equal height columns | `!rounded-[14px]` in discovery deck |
| Hero card | larger shadow, hero bg | `--ds-radius-3xl` optional |
| Inline list item card | `p-3` | `rounded-2xl` |

Min touch: entire interactive card should be tappable when `interactive` — min height 44px content area.

Grid: bento layouts use CSS grid with `gap-4` standard.

---

## Spacing

| Region | Token |
|--------|-------|
| Card padding (default) | `--ds-space-5` |
| Header → body | `mb-3` on header |
| Icon box → text | `gap-2.5` |
| Card grid gap | `--ds-space-4` |
| Stack of cards | `space-y-4` |
| Card inside hub | respect hub horizontal `px-4` |

Nested cards: avoid — use sections inside one card instead.

---

## States

| State | Visual |
|-------|--------|
| **Default** | elevation-card, static |
| **Hover** (interactive) | translateY(-2px), `--ds-shadow-xl`, accent border 30% |
| **Active** | scale `--ds-press-scale` on exec surfaces |
| **Focus-within** | child input shows focus ring — card border may bloom |
| **Disabled** | `opacity-60 pointer-events-none` on wrapper |
| **Selected** (bento) | `border-accent/20 border-2` — KompassDiscoveryDeck |
| **Error** | ErrorFallback card — glow matches silo |
| **Loading** | skeleton inside card body — card shell static |
| **Reduced motion** | no hover transform |

`noHover` on BentoCard maps to `interactive={false}`.

---

## Examples

### BentoCard (preferred)

```tsx
<BentoCard
  title="Dagbok"
  description="Hjärtat"
  glow="blue"
  icon={<Icon icon={BookOpen} size="sm" />}
>
  <p className="text-sm text-text-muted">Skriv en rad i lugn takt.</p>
</BentoCard>
```

### Legacy calm-card (existing modules)

```tsx
<div className="calm-card glow-bottom-gold overflow-hidden rounded-2xl border border-border/30 bg-surface-2/70 p-4 sm:p-5">
  …
</div>
```

Migrate when touching file — not mandatory bulk refactor.

### Ekonomi supermodule shell

`EkonomiInputSuperModule.tsx` — gold glow card wrapping Chameleon delegates.

### Valv list row

`valv-log-row` — inset highlight, hover elevation upgrade (card-like row).

### Archive calendar

`ArchiveCalendarView.tsx` — blue glow calm-card with backdrop blur.

---

## Accessibility

- Use semantic `<section>` (Card renders `<section>`)
- Card title in `CardHeader` → `<h3>` — maintain heading order
- Interactive cards: if whole card clickable, use `<button>` or `<a>` wrapper with label
- Focus visible on actionable elements inside card
- Contrast: `text-text-muted` on surface-2 meets AA for body copy
- Do not convey state by glow colour alone — include text status

---

## Animations

| Interaction | Motion |
|-------------|--------|
| Hover lift | translateY(-2px), 250ms premium ease |
| Press | scale 0.985 on exec-surface-card |
| Mount | optional stagger via parent — not per-card |
| Glow | static gradient pseudo — no pulse |
| Depth module | shadow transition on hover 250ms |

Reduced motion disables transform on `.ds-card--interactive:hover` and bento hover.

---

## Code Examples

### Design-system Card API

```tsx
import { Card, CardHeader, CardBody } from '@/design-system';

<Card glow="green" variant="hero" interactive>
  <CardHeader title="MåBra" description="Check-in" glow="green" icon={…} />
  <CardBody>…</CardBody>
</Card>
```

### CSS elevation tokens

```css
.ds-card {
  box-shadow: var(--ds-shadow-lg);
  transition:
    transform var(--ds-duration-normal) var(--ds-ease-premium),
    box-shadow var(--ds-duration-normal) var(--ds-ease-premium);
}
```

### Glow bottom (legacy index.css)

Cards with `glow-bottom-gold` receive bottom accent gradient via `::after` — silo visual cue.

### Error fallback

```tsx
<ErrorFallback glow="blue" title="Något gick fel" message="Försök igen om en stund." />
```

---

## Do

- Use `BentoCard` / `Card` for new feature surfaces
- Apply silo-appropriate glow (`gold` Vardagen, `blue` Valv, `green` MåBra)
- Enable `depth` on hub bento tiles
- Keep one primary action per card
- Use `CardHeader` for consistent title/description/icon layout
- Preserve glass + top highlight — never flat `bg-surface` only

---

## Don't

- Do not create new `btn-pill--*` card variants in modules
- Do not hardcode hex shadows — use `--ds-elevation-*`
- Do not disable blur for "performance" without measuring on G85
- Do not nest clickable cards
- Do not use card grids with > 6 tiles above fold without progressive disclosure
- Do not remove `glow-bottom-*` without silo alternative
- Do not mix flat white cards from external templates

---

## Future Improvements

- Deprecate `calm-card` alias with codemod to `Card`
- `Card` `asChild` polymorphic wrapper for link cards
- Elevation token preview in Theme Lab
- Auto lint: block `bg-white` / `#fff` in module cards
- Snapshot tests for glow variants per silo
- Card density prop (`compact` | `comfortable`) for list-heavy views
''',
    },
    "17-Header.md": {
        "num": 17,
        "title": "Header",
        "prev": "16-Cards.md",
        "next": "18-Dock.md",
        "body": r'''# Chapter 17 — Header

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [16-Cards.md](./16-Cards.md)  
> **Next chapter:** [18-Dock.md](./18-Dock.md)

---

## Purpose

This chapter defines **top chrome / app header** behaviour in Executive Midnight. The header is the app's crown — identity, primary protection actions, and menu access — not a SaaS toolbar.

Coverage:

- Locked DAD hierarchy: LIVSKOMPASSEN → Ögat → secondary actions
- `AppHeaderBar` + `DesignPackCenterHeader` production shell
- `Header` / `HeaderButton` design-system primitives
- `header-chrome-btn` glass buttons
- Executive premium variant (`headerVariant="executive-premium"`)

Primary files: `src/modules/core/components/AppHeaderBar.tsx`, `src/modules/core/design/DesignPackCenterHeader.tsx`, `src/design-system/components/Header.tsx`, `src/index.css` (header-chrome-btn), `src/styles/executive-chrome.css`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Crown | Header floats above content — glass, not solid bar |
| Identity | LIVSKOMPASSEN wordmark centred — Cinzel chrome font |
| Primary action | Ögat (eye) dominates right cluster |
| Restraint | Three-column symmetry — no cluttered icon row |
| Locked UX | No future redesign may add complexity (DAD) |

Header communicates **who you are in the app** and **how you protect yourself** — not every possible shortcut.

Executive premium: compass moves to dock only; header holds sköld + öga + optional center action.

---

## Visual Rules

### DAD structure (locked)

```
[Meny]     LIVSKOMPASSEN     ◇ ◇ ◇     [Skydd] [Ögat] [Sekundär]
```

- Left: menu button (round chrome)
- Centre: title + ornamental divider (three diamonds)
- Right: actions cluster + optional quick toggle (non-premium)

### Production components

| Layer | Component | Wrapper class |
|-------|-----------|---------------|
| Shell | `AppHeaderBar` | `app-header-bar--design-pack` or `glass-header-bar--kanon` |
| Inner | `DesignPackCenterHeader` | `design-pack-header--executive-premium` |
| DS primitive | `Header` | `ds-header` slot grid |

### Chrome button (`.header-chrome-btn`)

- Glass plate with pseudo-element sheen (`::before`, `::after`)
- Round variant: `header-chrome-btn--round` — 44px touch
- Glyph: `header-chrome-btn__glyph` — 20px, `text-accent`
- Hover: border gold bloom, soft outer glow
- Active: translateY(1px) scale press
- Focus: `--ds-focus-ring`

### Title typography

`.design-pack-header__title` / `.ds-header__title`:

- Font: `--ds-font-chrome` (Cinzel / Outfit fallback)
- Size: `--ds-font-size-sm`
- Weight: bold
- Tracking: `--ds-letter-spacing-wider`
- Case: uppercase
- Colour: `--ds-color-accent`

### Ornament

Three spans in `.design-pack-header__ornament` — decorative diamonds, `aria-hidden`.

### Glass shell

`.ds-header`:

- Sticky top, `z-index: --ds-z-header` (30)
- Backdrop blur md, 97% glass bg mix
- Bottom border: `--ds-color-border`

---

## Sizing

| Element | Dimension |
|---------|-----------|
| Header vertical padding | `--ds-space-3` (12px) |
| Horizontal padding | `--ds-space-4` (16px) |
| Chrome button touch | 44px (`--ds-touch-target`) |
| Menu glyph | 20px (`h-5 w-5`) |
| Title max width | centre column auto — truncate if needed |
| Kompis header avatar | embed variant, no double ring |
| Executive premium actions | flex row, gap-2 |

Header total height ≈ 56–64px including safe-area — do not exceed 72px.

---

## Spacing

| Region | Value |
|--------|-------|
| Grid columns | `1fr auto 1fr` (`ds-header__inner`) |
| Column gap | `--ds-space-3` |
| Actions cluster gap | `gap-2` |
| Title → ornament | defined in executive-chrome.css |
| Header → scroll content | hub provides top padding — no double spacer |
| Safe area | respect `env(safe-area-inset-top)` on native |

Menu button aligns start; actions align end; centre stays true centre regardless of side widths.

---

## States

| State | Behaviour |
|-------|-----------|
| **Default** | Glass bar sticky, title visible |
| **Menu open** | `aria-expanded={true}` on menu button |
| **Executive premium** | Fixed title LIVSKOMPASSEN; route title suppressed |
| **Design pack active** | `app-header-bar--design-pack` shell |
| **Scroll** | header stays sticky — no hide-on-scroll |
| **Focus** | chrome buttons show gold focus ring |
| **Live Kompis** | avatar subtle live indicator |
| **Zen mode** | header may hide — see ZenModeOverlay |

Never disable menu button without alternative navigation path.

---

## Examples

### MainLayout wiring

```tsx
<AppHeaderBar
  menuExpanded={menuOpen}
  onMenuClick={toggleMenu}
  actions={headerActions}
  headerVariant="executive-premium"
  centerAction={optionalCenter}
/>
```

### Design-system Header (slots)

```tsx
<Header
  title="LIVSKOMPASSEN"
  left={<HeaderButton aria-label="Meny">…</HeaderButton>}
  right={<HeaderButton aria-label="Öga">…</HeaderButton>}
/>
```

### Fyren quick toggle (non-premium)

`FyrenSideQuickDock` injects compass toggle via `headerQuickToggle` when not executive-premium.

### Kompis in header

`KompisAvatar` with `kompis-avatar--header-chrome` — larger mark, minimal ring.

### Widget shell header

`.widget-shell__header` — lighter blur variant for `/widget/*` routes; title gold text-shadow.

---

## Accessibility

- Header element: `aria-label={title}` on `<header>`
- Menu: `aria-label="Öppna meny"`, `aria-expanded` synced
- Icon-only actions: descriptive `aria-label` each (Skydd, Öga, …)
- Focus order: menu → centre (skip ornament) → actions left-to-right
- Contrast: gold title on glass navy — verified AA
- Touch: all chrome buttons ≥ 44px
- Do not use colour alone for live Kompis — include screen reader status elsewhere

---

## Animations

Header chrome is **mostly static**.

| Element | Motion |
|---------|--------|
| Chrome button hover | border/glow transition 250ms |
| Chrome button active | press scale |
| Menu expand | drawer handles motion — not header slide |
| Title | no crossfade on route change in premium mode |
| Ornament | static |

Reduced motion: press transform disabled on par with global rules.

---

## Code Examples

### HeaderButton

```tsx
import { Header, HeaderButton } from '@/design-system';
import { Icon } from '@/design-system';
import { Eye } from 'lucide-react';

<HeaderButton aria-label="Öppna öga">
  <Icon icon={Eye} size="md" />
</HeaderButton>
```

### Route-aware title (default variant)

```tsx
const routeTitle = useDesignPackCenterTitle(pathname) ?? 'LIVSKOMPASSEN';
const title = executivePremium ? 'LIVSKOMPASSEN' : routeTitle;
```

### CSS chrome hover

```css
.header-chrome-btn:hover {
  border-color: color-mix(in srgb, var(--ds-color-accent) 28%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--ds-color-accent) 12%, transparent);
}
```

### Panel style data attribute

```tsx
<div className="app-header-bar" data-panel-style={panelStyle}>
```

Used by theme packs for subtle chrome variations.

---

## Do

- Use `AppHeaderBar` + `DesignPackCenterHeader` in production layout
- Keep LIVSKOMPASSEN centred in executive-premium
- Place Ögat as primary right action
- Use `header-chrome-btn` for all header icon buttons
- Maintain 44px touch targets
- Respect DAD locked hierarchy

---

## Don't

- Do not add fourth column or secondary toolbar row
- Do not shrink title below readable sm size
- Do not move compass into header in executive-premium
- Do not use flat white header background
- Do not hide Skydd/Ögat without PMIR + Pontus OK
- Do not animate title morph on every route change
- Do not import legacy `glass-header-bar` patterns in new modules

---

## Future Improvements

- Consolidate `glass-header-bar--kanon` and `design-pack-header` into single DS Header story
- Header height CSS variable for hub scroll offset calculation
- Visual regression snapshot: executive-premium vs default
- Widget route header parity audit
- Optional breadcrumb slot behind feature flag (likely rejected by DAD)
- Theme Lab live preview of header variants with token editor
''',
    },
}


def verify_sections(content: str, filename: str) -> None:
    for section in SECTIONS:
        heading = section.strip()
        if heading not in content:
            raise ValueError(f"{filename} missing section: {heading}")
    line_count = content.count("\n") + 1
    if line_count < 150 or line_count > 350:
        raise ValueError(f"{filename} has {line_count} lines (expected 150-350)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for filename, data in CHAPTERS.items():
        path = OUT / filename
        content = data["body"].strip() + "\n"
        verify_sections(content, filename)
        path.write_text(content, encoding="utf-8")
        lines = content.count("\n") + 1
        print(f"Wrote {path.name}: {lines} lines")


if __name__ == "__main__":
    main()
