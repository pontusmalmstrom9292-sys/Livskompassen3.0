# Chapter 14 — Illustrations

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [13-Icons.md](./13-Icons.md)  
> **Next chapter:** [15-Banners.md](./15-Banners.md)


---

## Purpose

This chapter specifies **photographic and vector illustration assets** that establish atmosphere for Executive Midnight—without turning Livskompassen into a marketing landing page.

Illustrations provide depth, warmth, and brand recognition behind glass UI. They never replace functional UI or carry critical information alone.

---

## Philosophy

Illustrations answer: *Where am I emotionally in this app?*

The scenic home hero evokes calm horizon and reflection—not hustle culture stock photography. The compass rose SVG is jewelry-grade product identity, not a clip-art shortcut.

Theme pack previews in Theme Lab are **selection thumbnails**, not alternate art direction. Production remains anchored to `home-hero-scenic.png` and `kompass-dock-rose.svg` unless a new DAD explicitly replaces them.

---

## Visual Rules

| Asset | Path | Role |
|-------|------|------|
| Scenic home hero | `/design/home-hero-scenic.png` | Ambient background, hero cards, executive home |
| Compass rose | `/design/kompass-dock-rose.svg` | Dock center, decor compass, HERO_ASSET |
| Theme pack preview | per `ThemePack.preview` | Theme Lab picker only |
| Kanon reference | `/docs/design/galleri/KOMPASS-LOCKED-kanon.png` | Design authority reference—not runtime |

**Treatment:** Photos always sit **behind** gradient scrims (`ambient-bg--scenic`, executive hero overlays). Never raw full-bleed photo with text directly on bright areas.

**Compass SVG:** Full rose, metallic ring, center gem—see Chapter 19. No semicircle or arc variants in prod dock.

---

## Sizing

| Asset | Display size | File guidance |
|-------|--------------|---------------|
| `home-hero-scenic.png` | Full viewport cover | Optimized PNG in `public/design/` |
| `kompass-dock-rose.svg` | sm 3rem → hero 6rem+ | Vector; `ExecutiveDecorCompass` sizes |
| Theme preview thumbs | ~160×90 in Theme Lab grid | PNG from pack meta |
| Executive hub scenic band | `executive-hub-header--scenic` padding 1.15rem | CSS background layers |

Background position varies by context: `center 22%` (index.css ambient), `center bottom` (design-pack scenic).

---

## Spacing

Illustrations do not introduce layout spacing—they live in **background layers**:

- `ambient-bg--scenic`: gradient stack over photo; blobs at reduced opacity (0.2 under design-pack).
- Hero cards: inner content uses normal card padding; photo visible only in masked regions.
- Compass float: dock clearance from Chapter 18; illustration does not reduce safe-area padding.

---

## States

| Context | Default | Active / focus |
|---------|---------|----------------|
| Scenic bg | Fixed cover, gradient veil | No user state |
| Hero card scenic mask | Gradient overlay | Hover lifts card, not photo |
| Compass SVG | Rest glow | Dock press scale on container |
| Theme Lab preview | Static thumb | Selected ring from Theme Lab UI |

Low capacity / reduced motion: no parallax or Ken Burns on scenic assets.

---

## Examples

1. **Midnight Executive theme** — `'--design-bg-image': 'url(/design/home-hero-scenic.png)'` in `themePackMidnightExecutive.ts`.
2. **AmbientBackground** — `ambient-bg--scenic` with design-pack gradient stack.
3. **Executive home hero** — `execJournalUtils` gradient + scenic URL for journal card backdrop.
4. **Theme Lab** — previews: scenic, `E-home-hero-kanon.png`, pack-specific mockups (`themePackDesign`, `themePackMockup`).
5. **BastaDesignHome** — direct `<img src="/design/home-hero-scenic.png" />` in experimental layout (prod executive uses CSS layers).

---

## Accessibility

- Scenic backgrounds are decorative: `aria-hidden` on wrapper; never sole carrier of meaning.
- Compass in dock has text alternative via adjacent nav labels and route context.
- Theme previews include text labels (`ThemePack.label`)—not image-only selection.
- Maintain text contrast on scrimmed regions (AA per Chapter 28).

---

## Animations

Illustrations are static. Motion applies to **containers**:

- Card hover lift (Chapter 12 easing).
- Compass container `drop-shadow` pulse on home executive float—not SVG morphing.

No animated GIFs, Lottie loops, or video backgrounds in prod Executive Midnight.

---

## Code Examples

```ts
// themePackMidnightExecutive.ts
'--design-bg-image': 'url(/design/home-hero-scenic.png)',

// ExecutiveDecorCompass.tsx
const HERO_ASSET = '/design/kompass-dock-rose.svg';

// design-packs.css scenic stack
html[data-design-pack] .ambient-bg.ambient-bg--scenic {
  background: linear-gradient(...), var(--design-bg-image, url(/design/home-hero-scenic.png)) center bottom / cover no-repeat;
}
```

---

## Do

- Use `home-hero-scenic.png` for Executive Midnight ambient and hero treatments.
- Use `kompass-dock-rose.svg` for all compass illustration needs.
- Cover photos with navy/gold scrims before placing text.
- Optimize PNG assets; lazy-load non-critical preview grids in Theme Lab only.

---

## Don't

- Place body text directly on unscrimsed bright sky regions of scenic photo.
- Replace compass rose with Lucide or raster PNG in dock.
- Ship new full-bleed illustration themes to prod without DAD + PMIR.
- Use theme pack preview art as runtime background without token mapping.
- Add illustrative mascots, 3D renders, or neon sci-fi art.

---

## Future Improvements

- WebP/AVIF variants of scenic hero with PNG fallback.
- Themed seasonal scrims (same photo, deeper gradient) for reflection periods—Pontus OK only.
- Unified `designPackMeta.bgImage` documentation in Theme Lab.
- Authoring guide for hub preview PNGs aligned with Drawer L2 icon set.
