# Chapter 10 — Lighting

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [09-Glass-System.md](./09-Glass-System.md)  
> **Next chapter:** [11-Shadow-System.md](./11-Shadow-System.md)

---

## Purpose

This chapter defines **how light behaves** on Executive Midnight surfaces — top highlights, ambient gold rim, radial falloff, drop-shadow glow on the compass and ögat, and scenic background washes. Lighting creates depth on flat OLED screens without neon or gaming HUD aesthetics.

Lighting tokens bridge theme variables (`--accent`, `--accent-glow`, `--accent-light`) to stable DS aliases in `variables.css`. Prod theme is locked via `themeRegistry.ts` (`THEME_LOCKED`, Bästa design pack).

---

## Philosophy

### Moonlit gold, not stadium floodlights

Executive Midnight lighting communicates:

- **Depth** — inset top edge + bottom falloff mimics glass catching moonlight
- **Focus** — accent glow draws eye to compass, ögat, hero reflection — sparingly
- **Calm** — low-amplitude pulses (3.5–6s) never strobe
- **Deniability** — ambient layers stay `pointer-events: none`; they never compete with text contrast

From [02-Design-Philosophy.md](./02-Design-Philosophy.md): lighting supports **premium stillness**, not entertainment UI.

Forbidden: cyberpunk neon strips, high-frequency shimmer, pure white `#fff` bloom on body text backgrounds.

---

## Visual Rules

### Token layer (DS)

From `src/design-system/tokens/css/variables.css`:

| Token | Role |
|-------|------|
| `--ds-glass-highlight` | Top inset edge — `color-mix(text 10%)` |
| `--ds-glass-sheen` | Diagonal 135° gradient overlay on glass |
| `--ds-ambient-rim` | Accent-tinted rim glow — 12% accent mix |
| `--ds-ambient-falloff` | Shadow falloff base — 55% bg mix |
| `--ds-color-accent-glow` | Theme `--accent-glow` alias for halos |

Glass sheen definition:

```css
--ds-glass-sheen: linear-gradient(
  135deg,
  color-mix(in srgb, var(--ds-color-text) 14%, transparent) 0%,
  transparent 42%,
  transparent 100%
);
```

### Gradient vocabulary

Executive chrome (`src/styles/executive-chrome.css`) uses three gradient families:

1. **Linear 165° surface wash** — card backgrounds mixing `--accent` into `--surface-2`
2. **Linear 180° scenic veil** — `rgba(2, 6, 23, …)` navy scrim over photography
3. **Radial ellipse hotspots** — gold at 10–18% accent mix, transparent by 55–70%

Example hero card lighting:

```css
.home-layout-a--executive .home-layout-a__hero-card::before {
  background:
    radial-gradient(ellipse 80% 60% at 15% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 55%),
    linear-gradient(180deg, rgba(2, 6, 23, 0.15) 0%, rgba(2, 6, 23, 0.72) 100%);
}
```

### Drop-shadow vs box-shadow

| Technique | Use |
|-----------|-----|
| `box-shadow` + inset | Cards, dock, modals ([11-Shadow-System.md](./11-Shadow-System.md)) |
| `filter: drop-shadow()` | Compass glyph, ögat, floating icons — follows alpha shape |
| `text-shadow` | Cinzel home title — subtle gold halo `0 0 24px accent 45%` |

Compass float example:

```css
.exec-compass-float {
  filter: drop-shadow(0 0 16px color-mix(in srgb, var(--accent) 55%, transparent));
}
```

### Backdrop lighting

Glass panels combine **backdrop-filter** with lit borders:

- `backdrop-filter: blur(10px–20px) saturate(140%)`
- Border: `color-mix(in srgb, var(--accent) 20–32%, transparent)`
- Inset top: `color-mix(in srgb, var(--accent-light) 18%, transparent)`

Saturation token: `--ds-glass-saturate: 145%`.

### Ambient page lighting

Home executive scenic stack layers multiple radials:

```css
/* executive-chrome — resurser / scenic backgrounds */
radial-gradient(ellipse 120% 70% at 50% -10%, accent 16%, transparent 55%),
radial-gradient(ellipse 60% 45% at 0% 30%, accent 8%, transparent 50%),
radial-gradient(ellipse 55% 40% at 100% 25%, #6366f1 6%, transparent 48%),
radial-gradient(ellipse 80% 50% at 50% 100%, rgba(2, 6, 23, 0.95), transparent 60%);
```

Indigo secondary radial is **≤6%** — AI accent only, never dominant.

### Bento accent lighting (index.css)

Semantic tile washes:

```css
--bento-accent-gold-bg: linear-gradient(145deg, rgba(212, 175, 55, 0.14), rgba(20, 28, 43, 0.6));
--bento-accent-indigo-bg: linear-gradient(145deg, rgba(99, 102, 241, 0.16), rgba(20, 28, 43, 0.6));
--bento-accent-emerald-bg: linear-gradient(145deg, rgba(16, 185, 129, 0.14), rgba(20, 28, 43, 0.6));
```

145° diagonal matches glass sheen family for visual coherence.

---

## Sizing

Lighting **extent** is proportional to element role:

| Element | Typical hotspot size | Opacity cap |
|---------|---------------------|-------------|
| Hero card radial | ellipse 80% × 60% | accent 14–18% |
| Snabbstart hub glow | circle 55% radius | accent 22% center |
| Compass drop-shadow | 8–24px blur radius | accent 35–65% mix |
| Dock upward glow | 10–36px spread | accent 14–28% |
| Text-shadow title | 24px blur | accent 45% |
| Starfield dots | 0.5px radial | accent 15–25% |

 Larger blur = more important focal object (compass > dock icon > label).

---

## Spacing

Lighting pseudo-elements use **`inset: 0`** on parent — no extra layout spacing. Ensure parent has `position: relative` and `overflow: hidden` when glow must clip to card radius (`--exec-card-radius: 1.25rem` executive home).

**Pointer-events: none** on all decorative lighting layers — mandatory gap between glow and interactive padding ([06-Spacing-System.md](./06-Spacing-System.md)).

---

## States

| State | Lighting change |
|-------|-----------------|
| **Rest** | Base radial + inset highlight |
| **Hover** | Border accent mix increases ~8–12%; optional +4px drop-shadow blur |
| **Active** | No flash — slight scale only |
| **Active dock / home compass** | Pulse keyframes increase glow opacity (see Animations) |
| **Focus-visible** | `--ds-focus-ring` — 2px accent 55%; not a glow bloom |
| **Reduced motion** | Pulses disabled; static lighting preserved |

Ögat breathe (`exec-eye-breathe`): filter drop-shadow oscillates — disabled when `prefers-reduced-motion` or `.exec-eye--static`.

---

## Examples

### Executive hub header scenic

`.executive-hub-header--scenic` — linear 165° gradient border at accent 28%, inner surface wash.

### Snabbstart glow field

`.exec-snabbstart-hub__glow` — triple radial accent field behind collapsible hub grid.

### Bästa design dock lit edge

```css
.dock-shell--basta-design .exec-dock-bar {
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--bd-accent) 28%, transparent),
    0 -10px 36px color-mix(in srgb, var(--bd-accent) 14%, transparent);
}
```

### Hero drift (slow ambient)

`.exec-hero-drift` — 20s background-position animation on gradient — ultra subtle.

---

## Accessibility

- **Contrast first** — lighting sits *behind* text; never reduce text below WCAG on `--surface` because of glow
- **Photosensitive** — pulse periods ≥3.5s; amplitude small; respect reduced motion
- **No color-only state** — active dock uses label + glyph color, not glow alone
- **Indigo accent** — secondary; never sole indicator for critical status

See [28-Accessibility.md](./28-Accessibility.md) and [04-Color-System.md](./04-Color-System.md).

---

## Animations

Executive chrome keyframes (`src/styles/executive-chrome.css`):

| Keyframe | Duration | Element |
|----------|----------|---------|
| `exec-compass-pulse` | 3.5s ease-in-out | Dock/home compass border glow |
| `exec-hub-pulse` | 6s ease-in-out | Snabbstart hub glow opacity |
| `exec-eye-breathe` | 5.5s ease-in-out | Ögat drop-shadow |
| `exec-hero-drift` | 20s ease-in-out | Hero background position |
| `exec-badge-breathe` | 5.5s ease-in-out | Badge halo |
| `bd-compass-pulse` | 3.5s | Bästa design compass |
| `resurser-slide-in` | 0.35s ease | Panel entrance (not loop) |

Reduced motion block:

```css
@media (prefers-reduced-motion: reduce) {
  .exec-compass-pulse, .exec-eye-breathe, … {
    animation: none !important;
  }
}
```

---

## Code Examples

### Theme accent glow variable

```ts
// themeRegistry.ts — typical pack entry
cssVars: {
  '--accent-glow': 'rgba(212, 175, 55, 0.18)',
  …
}
```

### DS ambient tokens

```css
--ds-ambient-rim: color-mix(in srgb, var(--ds-color-accent) 12%, transparent);
--ds-ambient-falloff: color-mix(in srgb, var(--ds-color-bg) 55%, transparent);
```

### Glass panel with blur + light border

```css
.exec-surface-card {
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}
```

### Compass pulse

```css
@keyframes exec-compass-pulse {
  0%, 100% { border-color: color-mix(in srgb, var(--accent-light) 42%, transparent); }
  50% { border-color: color-mix(in srgb, var(--accent-light) 58%, transparent); }
}
```

---

## Do

- Build lighting from `color-mix(in srgb, var(--accent) …)` — theme-safe
- Layer inset highlight before outer shadow on cards
- Keep ambient radials on `pointer-events: none` pseudo-elements
- Cap accent radial opacity ≤22% on large areas
- Disable pulse loops when `prefers-reduced-motion: reduce`

---

## Don't

- Don't use pure `#fff` outer glow on large backgrounds
- Don't exceed 6% indigo in ambient stacks unless AI-specific module
- Don't animate `filter` on full-screen layers — GPU cost on G85
- Don't rely on glow alone for selected state
- Don't hardcode prod hex in feature CSS — use theme vars

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Lighting token file** | `--ds-light-hotspot-sm/md/lg` presets |
| **Theme Lab lighting page** | Compare Bästa vs I-stone glow |
| **Unify pulse keyframes** | Single `--ds-pulse-compass` duration token |
| **Photo scenic pipeline** | Document scrim opacity for user backgrounds |
| **GPU budget doc** | Max concurrent blurred + animated layers on G85 |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Color / accent | [04-Color-System.md](./04-Color-System.md) |
| Glass blur & sheen | [09-Glass-System.md](./09-Glass-System.md) |
| Shadow pairing | [11-Shadow-System.md](./11-Shadow-System.md) |
| Pulse timing | [12-Animation-System.md](./12-Animation-System.md) |
| Elevation bands | [08-Elevation.md](./08-Elevation.md) |
| Dark mode scrims | [29-Dark-Mode.md](./29-Dark-Mode.md) |
