# Chapter 19 — Compass

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [18-Dock.md](./18-Dock.md)  
> **Next chapter:** [20-Buttons.md](./20-Buttons.md)


---


## Purpose

This chapter specifies **Livskompassens signaturkompass**—the hero rose that anchors navigation, brand, and emotional tone.

Implementation: `ExecutiveDecorCompass.tsx` (production) mounted inside `exec-dock-bar__compass`. The compass is a **product icon**, not a generic navigation glyph. DAD treats it as locked visual identity.

Related assets: `/design/kompass-dock-rose.svg` (hero), `/icons/b1-kanon-ros.svg` (dock texture).

Source of truth in code: `src/modules/core/ui/executive/ExecutiveDecorCompass.tsx`. Read alongside `design-calm.mdc` § KOMPASSEN and `premium-ui.mdc` § COMPASS before any visual change.

Reference still: `docs/design/galleri/KOMPASS-LOCKED-kanon.png`.

---

## Philosophy

The compass communicates **riktning** (direction) without gamification.

DAD rules (design-calm.mdc § KOMPASSEN):

- Larger than all other navigation elements.
- Breaks out of the dock vertically.
- Placed exactly in the horizontal center.
- Functions as visual anchor for the entire app.

The compass must never feel like a Lucide icon slapped on a tab bar. It is a **crafted metallic rose**—watch-jewelry quality, soft gold glow, deliberate depth.

When in doubt: choose the alternative that feels like an exklusiv personlig kompass, not a productivity app icon.

**Relationship to other marks:**

| Component | Role | Interchangeable? |
|-----------|------|------------------|
| ExecutiveDecorCompass | Hero rose in dock | No |
| LivskompassMark | Seal / wordmark in legacy dock + drawer | No |
| DrawerL2Icon | Hub zone glyphs in dock sides | No |
| Lucide Navigation | — | Forbidden for compass |

The compass is the only element allowed to break the dock's top edge silhouette. All other chrome stays inside the glass rail envelope.

---

## Visual Rules

| Size token | Render mode | Asset / output |
|------------|-------------|----------------|
| `hero` | Textured PNG/SVG img | `/design/kompass-dock-rose.svg` |
| `dock`, `dock-lg`, `lg` | Textured img | `/icons/b1-kanon-ros.svg` |
| `sm`, `md` | Inline SVG | Programmatic rose with token gradients |

**Textured path:** `exec-decor-compass--textured` + drop-shadow filter from executive-chrome.

**Hero in dock:** `.exec-decor-compass--hero` + `.exec-dock-bar__compass-mark` forced 4.85rem with dual drop-shadow glow.

**Inline SVG structure (small sizes):**

- Outer ring: gradient stroke `var(--accent-light)` → `var(--accent)` → deep mix.
- Cardinal rose paths with `feDropShadow` glow filter (unique `useId` per instance).
- Center gemstone: accent-light core + deep accent pit.

**Color:** always token-derived—never hardcoded hex in component (except color-mix fallbacks in SVG defs).

Forbidden: semicircle arc nav, Material FAB, replacing rose with Lucide `Navigation`, compass inside header bar (executive-premium).

---

## Sizing

| Size prop | Tailwind class | Use case |
|-----------|----------------|----------|
| `sm` | h-8 w-8 | Chips, compact badges |
| `md` | h-12 w-12 | Default inline, drawer mark fallback |
| `lg` | h-16 w-16 | Hub headers, marketing |
| `dock` | h-[2.65rem] | Legacy dock plate |
| `dock-lg` | h-[2.65rem] | Alias dock |
| `hero` | h-[5.15rem] | Production dock center (img scales to 4.85rem in CSS) |

Dock button wrapper (not the rose itself): 5.35rem × 5.85rem ellipse with border-radius `50% / 46%`.

Compass must remain **visually dominant**—minimum 2× side glyph optical weight.

**Executive-chrome overrides (ME-midnight-executive):**

- Hero mark filter stack intensified for mockup-skin shells.
- Reduced-motion media query may zero pulse on `.exec-dock-bar__compass--open`.
- Compass button hover scale preserved unless reduced-motion requests instant state.

**Sandbox duplicate:**

`src/modules/sandbox/components/exec/ExecutiveDecorCompass.tsx` exists for Design Freeport experiments. Production code must import from `src/modules/core/ui/executive/ExecutiveDecorCompass.tsx` only.

---

## Spacing

- Hero rose centered in compass button via flex center.
- `margin-top: -4.35rem` on compass button lifts rose above dock rail—do not reduce without layout review.
- Outer halo ring: `::after` inset -0.35rem on `.exec-dock-bar__compass`.
- Filter stack on hero: 8px + 18px accent drop-shadows (executive-chrome).
- Small SVG: viewBox `0 0 80 80`—scale via class only, preserve aspect ratio `object-contain` on imgs.

When compass appears outside dock (drawer brand uses `LivskompassMark`, not ExecutiveDecorCompass)—do not duplicate hero rose in header and dock at same size.

---

## States

| Context | Visual |
|---------|--------|
| Default | Gold ring border, soft outer glow |
| Home | `.exec-dock-bar__compass--home` theme hooks |
| Snabbstart open | `.exec-dock-bar__compass--open` + pulse shadow |
| Long-press / holding | `.exec-dock-bar__compass--holding` scale 1.08 |
| Hover | scale 1.03 on compass button |
| Fyren progress | Ring overlay from `FyrenProgressRing`—does not replace rose |

State is applied to **parent button**, not the `ExecutiveDecorCompass` component—keep rose asset stateless.

---

## Examples

1. **ExecutiveDockBar** — `<ExecutiveDecorCompass size="hero" className="exec-dock-bar__compass-mark" />`.
2. **ExecutiveDecorCompass** — switches textured vs SVG based on `TEXTURED_SIZES` set.
3. **Theme ME-midnight-executive** — CSS overrides for hero mark glow intensity.
4. **Sandbox exec** — duplicate under `src/modules/sandbox/` for Design Freeport only.
5. **KOMPASS-LOCKED-kanon.png** — reference still in `docs/design/galleri/`.
6. **LivskompassMark** — wordmark/seal for legacy Fyren center—not interchangeable with hero rose in reference dock.

**Asset decision tree:**

```
size in TEXTURED_SIZES?
  yes → hero? → kompass-dock-rose.svg : b1-kanon-ros.svg
  no  → inline SVG with useId gradients
```

**Gradient tokens in inline SVG:**

| Stop | Token |
|------|-------|
| Highlight | `var(--accent-light)` |
| Mid | `var(--accent)` |
| Deep | `color-mix(in srgb, var(--accent) 55–65%, #000)` |
| Glow flood | `var(--accent)` @ 0.22 opacity |

---

## Accessibility

- Decorative rose: `alt=""` and `aria-hidden` on img/SVG—meaning carried by parent button label.
- Parent compass button: Swedish labels describing Hamn, snabbstart, and 3s Valv hold.
- Do not embed actionable controls inside the SVG.
- Ensure sufficient contrast on gold ring against navy dock—AA on adjacent label text, not on decorative metal alone.
- Reduced motion: pulse animation on open state respects `prefers-reduced-motion` (static glow fallback).

Screen reader flow: user hears parent button label ("Hamn. Håll tre sekunder för Valv.")—rose adds no redundant announcement. When snabbstart opens, `aria-expanded` on compass button updates; snabbstart panel must own its own dialog labeling.

---

## Animations

- **Pulse (snabbstart open):** `exec-compass-pulse` keyframes modulate box-shadow 3.5s loop.
- **Hold scale:** 1.08 while `isHolding`.
- **Hover scale:** 1.03 on compass button.
- **Fyren ring:** independent progress animation—see dock chapter.

ExecutiveDecorCompass itself has **no internal animation**—keeps GPU layers stable; motion on wrapper only.

Inline SVG filters are static; avoid animating `feDropShadow` per frame.

**premium-ui.mdc alignment:**

- Custom SVG only—never icon library for compass rose.
- Metallic ring + tick marks + center gemstone in inline fallback.
- Soft glow via filter—not neon bloom.
- Luxury watch quality target for hero textured asset.

---

## Code Examples

```tsx
// ExecutiveDecorCompass.tsx — hero textured
const TEXTURED_SIZES = new Set(['dock', 'dock-lg', 'hero', 'lg']);
const src = size === 'hero' ? '/design/kompass-dock-rose.svg' : '/icons/b1-kanon-ros.svg';

<img
  src={src}
  alt=""
  aria-hidden
  className={clsx(SIZE_CLASS[size], 'exec-decor-compass--textured object-contain', className)}
/>

// Inline SVG — unique gradient ids per instance
const uid = useId().replace(/:/g, '');
const gold = `execGold-${uid}`;
```

DAD citation: `.cursor/rules/design-calm.mdc` — rose breaks **out** of dock; never same size as side icons.

---

## Do

- Use `size="hero"` in production reference dock.
- Keep textured kanon assets for dock and hero sizes.
- Generate unique SVG gradient IDs via `useId()` for inline variant.
- Apply glow via CSS filter on textured imgs—not extra DOM layers.
- Treat compass as read-only decoration inside interactive button shell.

---

## Don't

- Import compass rose from Lucide or Material symbols.
- Use semicircle or partial arc metaphors.
- Place compass in header quick toggle when executive-premium active.
- Animate rose paths with flashy spins or game-like particles.
- Replace `/design/kompass-dock-rose.svg` without Pontus + DAD review.
- Scale hero rose down to match 1.15rem side glyphs.
- Swap hero asset per theme pack without DAD review—rose is cross-theme constant.
- Use CSS mask tricks that clip the rose breakout above dock edge.

---

## Future Improvements

- Single Theme Lab page: all five sizes side-by-side with measurement overlay.
- Code Connect map: Figma compass component → ExecutiveDecorCompass props.
- Vector master in design repo with export pipeline to both SVG assets.
- Lottie-free subtle breathing glow optional layer (off by default, reduced-motion safe).
- Document relationship between LivskompassMark seal and ExecutiveDecorCompass rose.
- Automated visual regression on hero asset load (404 guard in smoke).
- Publish asset pipeline checklist when updating `/design/kompass-dock-rose.svg`.
- Compare filter performance: textured img vs inline SVG on low-end Android (G85).
- Add Figma measurement spec: hero rose diameter vs dock bar height ratio (target ~1.54×).
- Verify `object-contain` letterboxing does not clip rose points on narrow viewports.
- Snapshot test: ExecutiveDecorCompass hero renders 4.85rem in dock at 320px viewport width.
- Document export settings for SVG assets (viewBox, gradient preservation, no embedded fonts).
