# Chapter 10 — Lighting

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [09-Glass-System.md](./09-Glass-System.md)  
> **Next chapter:** [11-Shadow-System.md](./11-Shadow-System.md)

---


## Purpose

Defines **ambient lighting, gradients, glow, and rim effects** that give Executive Midnight its premium atmosphere — the sense of a compass illuminated in a dark room.

Coverage:

- Ambient background gradients
- Radial accent glows (hero, snabbstart, compass)
- Inset highlights and sheen
- Silo bottom-glow accents
- Lighting + shadow + glass interaction

Files: `variables.css`, `index.css`, `executive-chrome.css`, `obsidian-calm-2.css`, `themePackBastaDesign.ts`.

---

## Philosophy

| Principle | Lighting expression |
|-----------|---------------------|
| Ambient not spotlight | Soft radial pools — not stage lights |
| Gold as light source | Accent glow suggests warmth |
| Depth | Background darker than foreground |
| Calm | Slow pulse max — no strobe |
| Nordic restraint | One primary light direction per view |

Lighting sells **"exklusiv personlig kompass"** — not disco.

---

## Visual Rules

### Background ambient (`index.css`)

App shell gradient:

```css
background: radial-gradient(
  ellipse 120% 80% at 50% -20%,
  var(--bg-dusk) 0%,
  var(--bg) 55%
);
```

Simulates sky glow above horizon — static, no animation.

Prod hero scenic: `--design-bg-image: url(/design/home-hero-scenic.png)` on bästa design pack.

### Hero card lighting (executive)

`.home-layout-a__hero-card::before`:

```css
background:
  radial-gradient(ellipse 80% 60% at 15% 0%, accent 14%, transparent 55%),
  linear-gradient(180deg, rgba(2,6,23,0.15) 0%, rgba(2,6,23,0.72) 100%);
```

Top-left gold pool + vertical falloff to deep navy.

### Snabbstart hub lighting

**Stage glow layer** (`.exec-snabbstart-hub__glow`):

```css
background:
  radial-gradient(circle at 50% 50%, accent 22%, transparent 55%),
  radial-gradient(circle at 20% 80%, accent 8%, transparent 40%),
  radial-gradient(circle at 80% 20%, accent 8%, transparent 40%);
animation: exec-hub-pulse 6s ease-in-out infinite;
```

**Core compass ring**:

```css
box-shadow:
  0 0 0 3px color-mix(accent 8%),
  0 0 28px color-mix(accent 32%);
filter: drop-shadow(0 0 18px accent 60%);
```

### Silo bottom glow (obsidian-calm-2)

`.glow-bottom-gold`: 2px bottom border accent 70% — reads as light under card.

Variants: `glow-bottom-blue`, `glow-bottom-green` for zone coding.

### Token-level lighting

```css
--ds-ambient-rim: color-mix(accent 12%, transparent);
--ds-ambient-falloff: color-mix(bg 55%, transparent);
--ds-glass-highlight: color-mix(text 10%, transparent);
--ds-glass-sheen: linear-gradient(135deg, text 14%, transparent 42%);
```

Used inside elevation shadow stacks.

---

## Sizing

| Effect | Typical reach |
|--------|---------------|
| Background radial | 120% width, 80% height |
| Hero accent pool | 80% × 60% ellipse |
| Accent glow box-shadow | 28–48px blur |
| Compass drop-shadow | 16–18px |
| Wordmark text-shadow | 24px accent 45% |
| Bottom glow border | 2px only |

---

## Spacing

Lighting respects layout:

- Radial centers anchored to component geometry (15% 0% = top-left hero)
- Glow layers use `pointer-events: none; position: absolute; inset: 0`
- Don't extend lighting pseudo-elements beyond parent `overflow: hidden` without intent

Margin between lit components: allow 16px for outer glow not to clip.

---

## States

| State | Lighting |
|-------|----------|
| Default | Ambient + static inset highlight |
| Hover | Slightly stronger accent rim (38% vs 20%) |
| Open snabbstart | Pulse animation active on glow layer |
| Focus | Focus ring — separate from ambient |
| Reduced motion | Pulse opacity frozen at 0.65 |
| Crisis / SOS | Flat high-contrast — disable decorative glow |

Wordmark `text-shadow` always on — identity lighting.

---

## Examples

**Home hero scenic + gradient** — bästa design theme vars:

```typescript
'--home-hero-gradient-top': '#15233a',
'--home-hero-gradient-mid': '#0d1728',
'--home-hero-gradient-bot': '#07101d',
```

**Glass hero accent bloom**:

```css
.glass-hero { box-shadow: 0 0 48px var(--accent-glow); }
```

**Hub header inset light**:

```css
inset 0 1px 0 rgba(255,255,255,0.08);
```

**Compass float home**:

```css
filter: drop-shadow(0 0 16px color-mix(accent 55%));
```

---

## Accessibility

- Decorative glows: `aria-hidden` on pure visual layers
- Don't use lighting flicker — seizure risk
- Pulse capped 6s — opacity only
- Crisis flows: strip decorative lighting
- Contrast unaffected — lighting is additive dark/gold, not white flash

---

## Animations

**exec-hub-pulse**:

```css
@keyframes exec-hub-pulse {
  0%, 100% { opacity: 0.65; }
  50% { opacity: 1; }
}
```

6s ease-in-out infinite — only on snabbstart glow layer.

Home stagger: opacity fade — not lighting change.

Theme morph 350ms: gradient stops may cross-fade.

Reduced motion: `@media (prefers-reduced-motion: reduce)` disables pulse + short-circuits duration tokens.

---

## Code Examples

```css
:root {
  --ds-ambient-rim: color-mix(in srgb, var(--ds-color-accent) 12%, transparent);
  --ds-glass-sheen: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ds-color-text) 14%, transparent) 0%,
    transparent 42%
  );
}
```

```tsx
<div className="relative overflow-hidden">
  <div className="exec-snabbstart-hub__glow pointer-events-none absolute inset-0" aria-hidden />
  ...
</div>
```

```css
.home-layout-a--executive .home-header-area h1 {
  text-shadow: 0 0 24px color-mix(in srgb, var(--accent) 45%, transparent);
}
```

---

## Do

- Use radial gradients for ambient pools
- Keep gold glow scarce and purposeful
- Set `pointer-events: none` on glow overlays
- Respect reduced motion for pulse
- Anchor light direction consistently (top-left)

---

## Don't

- Animated gradient backgrounds on hub pages
- Multiple pulsing glows on one screen
- White specular hotspots (breaks midnight)
- Neon bloom / HDR bloom filters
- Lighting as only depth cue — pair with shadow
- Strobe or <3s pulse loops

---

## Future Improvements

| Item | Notes |
|------|-------|
| Unified lighting module | CSS custom props per zone |
| Time-of-day Fyren tie-in | Subtle shift — PMIR required |
| GPU profiling G85 | Measure drop-shadow + blur stack |
| Print stylesheet | Strip all glow |
| Theme Lab lighting presets | Document per pack |

---

*Sources: variables.css, index.css, executive-chrome.css, obsidian-calm-2.css, themePackBastaDesign.ts, executiveHomeMotion.ts.*
