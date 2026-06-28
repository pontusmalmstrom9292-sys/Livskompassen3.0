#!/usr/bin/env python3
"""Generate Design Bible chapters 18–22. Run once; does not delete existing files."""
from pathlib import Path

BASE = Path(__file__).resolve().parent

def header(num: int, title: str, prev_file: str, next_file: str) -> str:
    return f"""# Chapter {num} — {title}

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [{prev_file}](./{prev_file})  
> **Next chapter:** [{next_file}](./{next_file})


---

"""

CHAPTERS: dict[str, str] = {}

CHAPTERS["18-Dock.md"] = header(18, "Dock", "17-Header.md", "19-Compass.md") + """
## Purpose

This chapter defines the **bottom dock**—Livskompassen's primary zone navigation and the physical stage for the hero compass (Chapter 19).

Production Executive Midnight uses the **reference dock** (`ExecutiveDockBar` inside `dock-shell--reference-dock`). Legacy themes fall back to `FloatingDock` with `dock-hub-band` / Fyren handle. Both implementations share long-press Valv gate, Resurser overlay, and safe-area clearance.

Authority: `.cursor/rules/design-calm.mdc` § BOTTOM DOCK (LÅST).

---

## Philosophy

The dock exists to **carry the compass**, not compete with it (DAD).

Design values:

| Value | Dock expression |
|-------|-----------------|
| Calm | Thin glass bar; side icons whisper |
| Premium | Gold hairlines, blur, layered shadows |
| Clarity | Six-zone extended layout; labels always visible |
| Direction | Center compass breaks upward—visual anchor |

The dock is **never** the app's loudest element. Side buttons are secondary chrome. Users should feel the compass first, then discover zone shortcuts along the rail.

Two layout modes serve different home preferences:

- **extended** (default) — six zones: Anteckning, Familj, KOMPASS, Hjärtat, Inkast, Resurser.
- **mix-e** — four zones: Familjen, KOMPASS, Valv, Planering (executive home layout preference).

---

## Visual Rules

| Layer | Class / component | Role |
|-------|-------------------|------|
| Shell | `.dock-shell--reference-dock` | Transparent wrapper; sets `--app-dock-clearance` |
| Bar | `.exec-dock-bar` | 6-column glass grid, flat bottom edge |
| Variant | `.exec-dock-bar--extended` | Full six-zone kanon |
| Variant | `.exec-dock-bar--mix-e` | 4-column compact grid |
| Side btn | `.exec-dock-bar__side` | Icon + micro-label column |
| Active side | `.exec-dock-bar__side--active` | Accent-light label + glyph glow |
| Compass slot | `.exec-dock-bar__compass-slot` | Grid column 3; z-index lift |
| Compass btn | `.exec-dock-bar__compass` | Hero breakout button |
| Legacy band | `.floating-dock` / `.dock-hub-band` | Pre-reference Fyren dock |

**Material:** gradient surface-2 → surface, `backdrop-filter: blur(20px) saturate(140%)`, accent border top only (no bottom—flush with screen).

**Hairlines:** `::before` gold center highlight on top edge; `::after` bottom safe-area accent line.

**Icons:** Lucide stroke 1.5; Familjen uses `DrawerL2Icon` hub glyph at `--l2` size in mix-e.

Forbidden (DAD): flat Material bottom nav, tab bar labels larger than compass, moving compass off-center.

---

## Sizing

| Element | Dimension |
|---------|-----------|
| Dock min-height | 3.15rem (+ top padding for compass breakout) |
| Dock top padding | 2.35rem (room for hero compass overlap) |
| Side icon hit area | 2.75rem × 2.75rem min |
| Side label | 0.4rem uppercase, tracking 0.08em |
| Glyph (standard) | 1.15rem |
| Glyph (L2 hub) | 1.4rem |
| Compass button | 5.35rem × 5.85rem |
| Compass mark (hero) | 4.85rem × 4.85rem |
| Compass negative margin-top | -4.35rem (floats above bar) |
| mix-e grid | 4 equal columns |
| extended grid | 6 equal columns |
| `--dock-stack-height` | 5.85rem |
| `--app-dock-clearance` | 5.5rem + safe-area-inset-bottom |

Legacy `floating-dock__center` follows Fyren plate sizing in executive-chrome when reference dock inactive.

---

## Spacing

- Horizontal bar padding: `0.35rem` sides; bottom includes `env(safe-area-inset-bottom)`.
- Side column gap (icon → label): `0.28rem`.
- Side bottom padding: `0.2rem`.
- Compass slot: centered column 3 (extended) or column 2 (mix-e).
- App shell reserves clearance via `--app-dock-clearance` so scroll islands never hide under dock.
- Legacy outer groups: `pr-1` / `pl-1` on side groups; Inkast + Resurser in outer-right cluster.

Grid column mapping (extended):

```
[1 Anteckning] [2 Familj] [3 COMPASS] [4 Hjärtat] [5 Inkast] [6 Resurser]
```

mix-e:

```
[1 Familjen] [2 COMPASS] [3 Valv] [4 Planering]
```

---

## States

| State | Class / behavior |
|-------|------------------|
| Route active (side) | `.exec-dock-bar__side--active` |
| Home (compass) | `.exec-dock-bar__compass--home` |
| Snabbstart open | `.exec-dock-bar__compass--open` + pulse animation |
| Long-press hold | `.exec-dock-bar__compass--holding` + scale 1.08 |
| Fyren ring visible | `FyrenProgressRing` when `progress > 0` |
| CSS var hold | `--dock-hold: N%` on compass during 3s Valv gate |
| Resurser overlay | Side active when `resurserOpen` |
| Inkast active | pathname `/planering/input` prefix |

**Interactions (`FloatingDock.tsx`):**

- **Tap compass (home, extended):** toggle snabbstart via `ExecutiveHomeChromeContext`.
- **Tap compass (not home):** navigate `/`.
- **Long-press compass (3s):** `openValvViaFyren` → Valv gate.
- **mix-e:** compass tap navigates home; no snabbstart toggle on home.

Side buttons: `aria-current="page"` when active; compass `aria-expanded` when snabbstart open.

---

## Examples

1. **ExecutiveDockBar.tsx** — pure presentation; receives route flags and handlers from parent.
2. **FloatingDock.tsx** — theme fork: `referenceDock` → ExecutiveDockBar; else legacy Fyren band.
3. **ResurserOverlay** — opened from Resurser side; not inline in dock DOM.
4. **HOME_LAYOUT_CHANGED_EVENT** — syncs mix-e vs extended when user changes executive home layout.
5. **Widget route** — Anteckning navigates `/widget/anteckning`.
6. **Inkast** — `/planering/input?inputMode=inkast` with Chameleon supermodule (Chapter 21).

Smoke: `@locked DOCK_ZONES` comment in FloatingDock for static zone tests—do not remove.

**Theme routing (`FloatingDock.tsx`):**

| Condition | Dock rendered |
|-----------|---------------|
| `isMidnightExecutiveTheme(themeId)` | reference dock |
| `isMockupTheme(themeId)` | reference dock |
| `themeUsesDesignPackChrome(getTheme(themeId))` | reference dock |
| else | legacy Fyren `dock-hub-band` |

**Nav paths wired from dock:**

| Side | Target |
|------|--------|
| Anteckning | `/widget/anteckning` |
| Familj / Familjen | `NAV_PATHS.FAMILJEN` |
| Hjärtat | `NAV_PATHS.HJARTAT` |
| Inkast | `/planering/input?inputMode=inkast` |
| Valv (mix-e) | `valvetNavigateTarget()` |
| Planering (mix-e) | `/planering` |
| Resurser | opens `ResurserOverlay` state |

---

## Accessibility

- Root: `<nav aria-label="Huvudnavigation">`.
- Each side: `aria-label` on button + visible micro-label (do not rely on icon alone).
- Compass: dynamic Swedish `aria-label`—snabbstart open/close, Hamn, hold-for-Valv hint.
- Touch targets: 44px minimum on side icons and compass.
- Focus: visible ring on all dock buttons; compass is primary landmark—tab order after main content skip link.
- Reduced motion: disable `exec-compass-pulse` when `prefers-reduced-motion`.
- Color: active state uses accent-light—not color alone; label weight + glow reinforce state.

Long-press is **supplemental**—Valv must remain reachable without hold (drawer, other gates).

---

## Animations

| Motion | Spec |
|--------|------|
| Side press | `scale(0.96)` 0.15s ease |
| Compass hover | `scale(1.03)` |
| Compass holding | `scale(1.08)` |
| Snabbstart open | `exec-compass-pulse` 3.5s infinite ease-in-out |
| Fyren ring | Progress arc tied to `--dock-hold` |
| Side color | 0.15s ease on active transition |

No bounce, no slide-in dock on route change—the bar is persistent chrome.

Premium polish (`premium-polish.css`) may add subtle hover lift on side buttons in basta-design shell.

---

## Code Examples

```tsx
// FloatingDock.tsx — reference dock branch
<div className="dock-shell dock-shell--reference-dock">
  <ExecutiveDockBar
    dockVariant={mixEDock ? 'mix-e' : 'extended'}
    isHome={isHome}
    snabbstartOpen={snabbstartOpen}
    centerHoldHandlers={centerHoldHandlers}
    progress={progress}
    onVentil={() => navigate(NAV_PATHS.HJARTAT)}
  />
</div>

// ExecutiveDockBar.tsx — side slot pattern
<ExecDockSide label="Familj" active={isFamiljen} onClick={onFamiljen}>
  <Users className="exec-dock-bar__glyph" strokeWidth={1.5} />
</ExecDockSide>

// Long-press wiring
const centerPress = useLongPress({
  onLongPress: fyrenToValv,
  onClick: () => { /* home snabbstart or navigate / */ },
  delayMs: 3000,
});
```

CSS authority: `src/styles/executive-chrome.css` § Referensdock.

---

## Do

- Use `ExecutiveDockBar` for Midnight Executive, mockup themes, and design-pack chrome themes.
- Keep compass in column center with negative margin breakout.
- Preserve six-zone extended kanon for default executive home.
- Wire safe-area on bottom padding and `--app-dock-clearance`.
- Pass strokeWidth 1.5 on Lucide dock glyphs for optical parity.
- Close Resurser overlay on backdrop; keep dock visible underneath.

---

## Don't

- Move compass into header or drawer (DAD locked).
- Shrink compass to side-icon size.
- Add seventh dock zone without PMIR + DAD amendment.
- Remove DOCK_ZONES smoke anchor comment.
- Use flat opaque Material3 navigation bar.
- Make dock taller than necessary—cognitive weight belongs to content above.
- Duplicate dock implementations in feature modules—import from core layout.

---

## Future Improvements

- Theme Lab side-by-side: extended vs mix-e vs legacy Fyren dock.
- Extract `ExecDockSide` to design-system with token docs cross-link Chapter 20.
- Unified story for `--dock-hold` progress ring across compass and Fyren widget bar.
- Automated smoke: assert six zone labels in extended mode + compass hero asset present.
- Document snabbstart sheet content separately; dock chapter stays navigation-only.
- Consider haptic feedback on long-press complete (Capacitor)—behind feature flag, Android only.
- Consolidate legacy `floating-dock` CSS into executive-chrome when Fyren theme retires.
- Document `themeUsesDesignPackChrome` fork that enables reference dock on design-pack themes.
- Align mix-e Valv side icon (Vault Lucide) with drawer Valv branding—optical weight audit.
"""

CHAPTERS["19-Compass.md"] = header(19, "Compass", "18-Dock.md", "20-Buttons.md") + """
## Purpose

This chapter specifies **Livskompassens signaturkompass**—the hero rose that anchors navigation, brand, and emotional tone.

Implementation: `ExecutiveDecorCompass.tsx` (production) mounted inside `exec-dock-bar__compass`. The compass is a **product icon**, not a generic navigation glyph. DAD treats it as locked visual identity.

Related assets: `/design/kompass-dock-rose.svg` (hero), `/icons/b1-kanon-ros.svg` (dock texture).

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
"""

CHAPTERS["20-Buttons.md"] = header(20, "Buttons", "19-Compass.md", "21-Inputs.md") + """
## Purpose

This chapter documents **pill buttons**—primary CTAs, secondary glass actions, and ghost dismissals across Executive Midnight.

Production styling lives in `index.css` as `.btn-pill` and variants. The design-system wrapper `Button.tsx` maps to `.ds-btn` which `@apply`s the same btn-pill modifiers for visual parity.

No new `btn-pill--*` variants in feature modules (governance self-review rule).

---

## Philosophy

Buttons should feel **pressed metal and glass**—not flat Bootstrap rectangles.

Hierarchy:

| Tier | Variant | When |
|------|---------|------|
| Primary action | `accent` / `btn-pill--accent` | One gold CTA per view max |
| Secondary | `secondary` / `btn-pill--secondary` | Alternate confirm, continue |
| Tertiary | `ghost` | Cancel, back, low commitment |
| Success | `success` | Save complete, WORM confirm |
| Danger | `danger` | Destructive (design-system) |

Typography: uppercase, wide tracking, xs size—premium jewelry label, not sentence case SaaS.

Touch-first: min 44px height via `--ds-touch-target` on ds-btn.

**Implementation stack:**

```
Feature module → Button (design-system)
              → buttonClassName()
              → .ds-btn + .ds-btn--{variant}
              → @apply btn-pill--{variant}  (components.css)
              → index.css gradient/shadow definitions
```

Legacy call sites may still use `btn-pill--*` classes directly—migrate to `Button` on touch.

**Danger variant:** maps to `@apply btn-pill--danger` in components.css—use for irreversible actions only; never for navigation.

---

## Visual Rules

**Base `.btn-pill`:**

- `inline-flex`, gap-2, `rounded-full`, border, px-5 py-2.
- text-xs, uppercase, tracking-widest.
- disabled: opacity 50%.

**`.btn-pill--accent` (gold CTA):**

- Vertical gold gradient (light → accent → deep).
- Inset highlights + lip shadow + gold glow + ambient drop shadow.
- Text: `--cta-gold-text` (dark on gold for AA).
- Hover: brighter gradient, expanded glow.
- Active: `translateY(2px)`, compressed inset shadow—tactile press.

**`.btn-pill--ghost`:**

- Glass gradient navy panels, blur 12px.
- Muted text → full text on hover; accent border hint on hover.
- Active: deep inset shadow.

**`.btn-pill--secondary`:**

- Glass panel with gold border mix; blur 14px.
- Hover: accent-light text + subtle gold outer glow.

**`.btn-pill--primary` (legacy tailwind shorthand):**

- `border-accent/50 bg-accent/15 text-accent-light`—use sparingly; prefer accent gold for hero CTAs.

**Design-system mapping:**

```
ds-btn--accent    → btn-pill--accent
ds-btn--secondary → btn-pill--secondary
ds-btn--ghost     → btn-pill--ghost
ds-btn--success   → btn-pill--success
```

---

## Sizing

| Token | Value |
|-------|-------|
| Default min-height | `var(--ds-touch-target)` (44px) |
| Default padding | `--ds-space-2` × `--ds-space-5` |
| Font | `--ds-font-size-xs` |
| sm variant | min-height `--ds-space-8`; smaller padding + `--ds-font-size-2xs` |
| icon variant | square touch target; padding `--ds-space-2` |
| Border (ghost/secondary) | 0.5px hairline |

Do not shrink below 44px on mobile primary actions (Motorola G85 kanon).

---

## Spacing

- Icon + label gap: 0.5rem (gap-2) in btn-pill base.
- Sheet footers: `SheetFooter` uses `gap-[var(--ds-space-2)]` between buttons.
- Button groups: flex-wrap; primary right or full-width on narrow screens per hub pattern.
- Dock side labels are **not** buttons—do not reuse btn-pill typography for dock micro-labels.

Maintain one primary accent button per sheet/modal footer—secondary/ghost flank it.

---

## States

| State | Behavior |
|-------|----------|
| default | Rest shadows per variant |
| hover | Brighten gradient / border; ghost lifts text contrast |
| active | accent translates Y+2px; ghost/secondary inset crush |
| focus-visible | 2px accent outline, offset 2px |
| disabled | opacity 50%; no pointer events on ds-btn |

Loading states: use `disabled` + adjacent text—do not shrink button or remove min-height.

Toggle buttons: prefer `aria-pressed` with ghost or secondary—not accent gold for toggles.

---

## Examples

1. **Valv PIN gate** — ghost cancel + accent confirm.
2. **SheetFooter** — paired secondary + accent for save flows.
3. **NavigationDrawer lock** — `nav-drawer__lock-btn` custom row—not btn-pill; panic affordance.
4. **Hub module cards** — inline ghost for tertiary navigation.
5. **Widget actions** — `ui-cta-gold btn-pill--accent` alias for hosting CTAs.
6. **ButtonLink** — router navigation with same visual classes as Button.

**Variant selection guide:**

| User intent | Variant | Notes |
|-------------|---------|-------|
| Confirm / submit | accent | Max one per view |
| Continue / secondary confirm | secondary | Glass gold border |
| Cancel / dismiss | ghost | No translateY press |
| Saved / complete | success | WORM confirmations |
| Delete / irreversible | danger | design-system only |

**CSS token aliases for accent gold:**

| Token | Role |
|-------|------|
| `--cta-gold-text` | Label color on gradient |
| `--cta-gold-border` | Hairline edge |
| `--cta-gold-light` | Gradient top stop |
| `--cta-gold` | Gradient mid |
| `--cta-gold-deep` | Gradient bottom |
| `--cta-gold-lip` | 3px lip shadow |
| `--cta-gold-glow` | Outer gold bloom |

---

## Accessibility

- Native `<button type="button">` default; submit only in forms.
- Visible focus ring on all variants—never `outline-none` without replacement.
- Disabled buttons: use `disabled` attribute, not just styled divs.
- Icon-only: `aria-label` in Swedish; min 44px hit area via `--icon` size.
- Accent gold maintains AA with dark `--cta-gold-text` on gradient.
- Do not convey state by color alone—pair with text or aria-pressed.

---

## Animations

| Property | Duration | Easing |
|----------|----------|--------|
| transform (accent active) | 0.18s | cubic-bezier(0.34, 1.2, 0.64, 1) spring |
| box-shadow | 0.18s | ease |
| background | 0.18s | ease |
| ghost/secondary transform | 0.16s | ease |

No scale bounce on hover—premium UI uses shadow and color shifts.

Reduced motion: keep active translate optional; preserve instant color change for feedback.

---

## Code Examples

```tsx
// design-system/Button.tsx
export function Button({ variant = 'accent', size = 'md', ...rest }: ButtonProps) {
  return (
    <button type="button" className={buttonClassName(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

// index.css — accent press
.btn-pill--accent:active:not(:disabled) {
  transform: translateY(2px);
}

// Sheet footer pattern
<SheetFooter>
  <Button variant="ghost" onClick={onClose}>Avbryt</Button>
  <Button variant="accent" onClick={onSave}>Spara</Button>
</SheetFooter>
```

Legacy alias map in Button.tsx: `primaryGold` → `accent`, `continue` → `secondary`.

---

## Do

- Import `Button` from design-system in new code.
- Use `accent` for single primary CTA per surface.
- Use `ghost` for cancel/back.
- Keep uppercase tracking consistent—do not override with sentence case in modules.
- Reuse `buttonClassName()` for custom elements needing button skin.

---

## Don't

- Add new `btn-pill--*` classes in `src/modules/**` (forbidden in self-review).
- Stack multiple accent gold buttons in one footer.
- Use raw `<button className="btn-pill--accent">` in new features—use `Button`.
- Hardcode hex gold (#d4af37) in TSX—use CSS variables.
- Shrink touch targets below 44px for primary actions.
- Use accent variant for destructive delete—use danger variant.

---

## Future Improvements

- Consolidate `btn-pill--primary` legacy into secondary/ghost decision tree.
- Storybook / Theme Lab: all variants × states × sm/icon sizes.
- Document danger variant styling alongside success in index.css cross-link.
- Lint rule: flag new btn-pill--* outside index.css and components.css.
- Extract shared CTA gold tokens to `--ds-cta-*` mirror of `--cta-gold-*`.
- Add visual regression snapshots for accent active translateY state.
- Document `ui-cta-gold` hosting alias usage in widget routes.
"""

CHAPTERS["21-Inputs.md"] = header(21, "Inputs", "20-Buttons.md", "22-Sheets.md") + """
## Purpose

This chapter covers **text input surfaces**—design-system fields, glass legacy inputs, and the **Chameleon morph shell** that swaps input delegates in-place without route changes.

Core files:

- `ChameleonInputShell.tsx` + `useChameleonMorph.ts` — mode morph container.
- `Input.tsx` / `TextArea` — token `.ds-input` primitives.
- `input-glass` / `input-glass--pin` — legacy glass fields in index.css.

Chameleon pattern is mandatory for multi-mode input supermodules (dagbok, planering inkast).

---

## Philosophy

**Chameleon principle** (chameleon-ui-modularity.mdc): one shell, many modes—UI morphs (~350 ms fade) instead of new pages/menus.

Users choose *what they want to do*; the interface adapts tools and appearance—not the reverse.

Separation of layers:

| Layer | Responsibility |
|-------|----------------|
| Logic | hooks, services, Firestore, validation |
| Shell | `ChameleonInputShell`, `*InputSuperModule` |
| Skin | tokens, design packs, CSS modules |

Max 4–6 visible modes; additional modes via progressive disclosure (sheet/drawer).

**Morph timeline (milliseconds):**

| Phase | Time | displayed mode | fading |
|-------|------|----------------|--------|
| Start | 0 | old | false |
| Fade out begins | 0 | old | true |
| Swap | 175 | **new** | true |
| Fade in complete | 350 | new | false |

Total perceived transition ≈ 350 ms; delegate unmount is deferred until midpoint to avoid flash of wrong content.

**Logic vs shell boundary:**

- Shell never imports Firestore, callables, or store.
- Delegates receive `displayed` mode + callback props only.
- Validation runs in hook before mode switch when destructive.

---

## Visual Rules

**ChameleonInputShell:**

- Root: `.chameleon-input-shell`
- Viewport: `.chameleon-input-shell__viewport` + `calm-scroll-island`
- Fading: opacity 0, scale 0.98, blur 2px during morph midpoint
- Rest: opacity 100, scale 100, blur 0
- Transition: `var(--ds-ease-premium)` over `morphMs` (350 ms default)

**`.ds-input` (design-system):**

- Full width, `--ds-radius-md`, border `--ds-color-border`
- Background `--ds-color-surface-1`, text `--ds-color-text`
- Padding `--ds-space-2` × `--ds-space-3`, body font sm
- Focus: border accent; focus-visible outline 2px accent mix

**`.input-glass` (legacy prod):**

- rounded-2xl, border-border-strong, bg-surface/80, p-4
- Focus: border-accent/40, no default outline

**`.input-glass--pin` (Valv PIN):**

- Centered mono, wide tracking, gold accent border
- Inset shadow + gold focus glow—premium secure entry

Forbidden: hårdkodade hex i feature modules; new routes per micro input mode; silo-colored glow lines on shell.

---

## Sizing

| Element | Size |
|---------|------|
| ds-input min height | implicit from padding + line-height (~40px) |
| TextArea min-height | `var(--ds-space-20)` with resize-y |
| PIN input | py-3.5, text-lg, tracking 0.42em |
| Touch target | entire field + label tap area ≥ 44px height |
| Chameleon viewport | inherits parent; no fixed height on shell |
| Morph duration | `CHAMELEON_MORPH_MS = 350` |

Mode toolbar chips: follow btn-pill sm or hub chip patterns—documented in hub chapters.

---

## Spacing

- Shell: no extra padding on root—delegate owns inner spacing.
- Viewport uses `calm-scroll-island` for hub-consistent scroll gutters.
- Label + field: `space-y-1.5` in pin-gate and form patterns.
- SuperModule header to shell: hub-specific; keep 16–24px rhythm with `--ds-space-4`.
- Inkast / dagbok: mode switcher above shell with `gap-2` chip row.

Do not nest multiple Chameleon shells—one morph container per supermodule.

---

## States

| State | Behavior |
|-------|----------|
| mode change requested | `useChameleonMorph` detects value change |
| fading true | viewport opacity 0, scale 0.98, blur 2px |
| midpoint (175 ms) | `displayed` mode swaps to new delegate |
| fading false | viewport restores full opacity |
| input focus | ds-input border accent; glass pin gold glow |
| disabled | standard opacity + pointer-events on inputs |
| error | pair field with `alert-banner--danger`; aria-describedby |

Morph is **opacity-first**—shell does not slide horizontally (reduces vestibular load).

Same displayed mode during fade—children render `displayed` not live `mode` prop.

---

## Examples

1. **DagbokInputSuperModule** — ChameleonInputShell wrapping journal delegates.
2. **Planering inkast** — `/planering/input?inputMode=inkast` mode query drives shell.
3. **Valv PIN gate** — `input-glass--pin` + pin-gate layout.
4. **Reflektion textarea** — `reflektion-textarea` extended glass in index.css.
5. **Design-system form** — plain `Input` + `TextArea` in settings sheets.
6. **Theme Lab** — experiment morph timings via forked hook (sandbox only).

**Supermodule checklist for new input features:**

1. Define mode union type (max 4–6 visible).
2. Implement one delegate component per mode.
3. Wrap with `ChameleonInputShell`—pass `displayed` to delegate.
4. Keep Firestore in hook layer (`use*Submit`, `*Service`).
5. Style with `ds-input` or approved glass class—no hex in delegate.
6. Test morph with keyboard-only mode switch.

**PIN field anatomy (`input-glass--pin`):**

| Layer | Effect |
|-------|--------|
| Border | 2px gold rgba mix |
| Background | warm dark gradient 175deg |
| Inset shadow | depth + subtle top highlight |
| Focus | brighter border + 16px gold outer glow |
| Typography | mono, centered, wide tracking |

---

## Accessibility

- Labels: visible `<label>` or `aria-label` on all inputs—PIN uses aria-labelledby from lead copy.
- Morph: announce mode change via live region in supermodule if content role changes substantially.
- Focus: retain focus management on mode switch—move focus to first field of new delegate when appropriate.
- PIN: `inputMode="numeric"` / pattern where applicable; mask display in UI only.
- TextArea: allow browser resize-y unless layout breaks—prefer min-height token.
- Color contrast on ds-input text vs surface-1: AA minimum.

Do not trap keyboard inside shell unless modal sheet open above.

---

## Animations

**Morph timeline (`useChameleonMorph`):**

1. `fading=true` — 350 ms fade out (half of total perceived morph)
2. Swap `displayed` at 175 ms
3. `fading=false` — 350 ms fade in

Easing: `--ds-ease-premium` on viewport transition-all.

Blur 2px during fade—subtle depth cue; disable blur in reduced-motion (opacity only).

No route transition animations tied to mode change—URL may update without full page nav.

---

## Code Examples

```tsx
// ChameleonInputShell.tsx
export function ChameleonInputShell<T>({ mode, children, className }: Props<T>) {
  const { displayed, fading, morphMs } = useChameleonMorph(mode);
  return (
    <div className={clsx('chameleon-input-shell', className)}>
      <div
        className={clsx(
          'chameleon-input-shell__viewport calm-scroll-island transition-all ease-in-out',
          fading ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0',
        )}
        style={{ transitionDuration: `${morphMs}ms`, transitionTimingFunction: 'var(--ds-ease-premium)' }}
      >
        {children(displayed)}
      </div>
    </div>
  );
}

// Delegate pattern
<ChameleonInputShell mode={inputMode}>
  {(displayed) => <InkastDelegate mode={displayed} />}
</ChameleonInputShell>

// design-system Input
<Input type="text" placeholder="Rubrik" aria-label="Rubrik" />
```

Hook export: `CHAMELEON_MORPH_MS = 350` from `useChameleonMorph.ts`.

---

## Do

- Use ChameleonInputShell for multi-mode input supermodules.
- Keep Firestore/callable logic in hooks—delegates receive props only.
- Use `ds-input` for new forms; glass variants only where legacy parity needed.
- Limit visible modes to 4–6 with progressive disclosure beyond.
- Test morph with reduced-motion preference.

---

## Don't

- Create new top-level routes per input micro-mode.
- Put business logic inside ChameleonInputShell.
- Hardcode `#d4af37` in feature input styling.
- Remove Chameleon shell without PMIR + Pontus OK.
- Animate horizontal slides between modes (violates calm spec).
- Cross-wire silo RAG inside input delegates.

---

## Future Improvements

- Extract morph live-region announcer hook for screen readers.
- Theme Lab control for morph ms (accessibility testing).
- Migrate `input-glass` call sites to ds-input + glass token extension.
- Document each supermodule mode matrix in module specs.
- Lint: block hex colors in `*InputSuperModule*` and delegates.
- Unified error state component pairing with ds-input.
- Specimen page in Theme Lab for all glass vs ds-input combinations.
- Measure morph CPU cost on G85 with blur enabled vs opacity-only fallback.
"""

CHAPTERS["22-Sheets.md"] = header(22, "Sheets", "21-Inputs.md", "28-Accessibility.md") + """
## Purpose

This chapter defines **overlay panels**—bottom sheets, centered dialogs, and the **NavigationDrawer** slide-in menu.

Primary implementation: `Sheet.tsx` in design-system (portal, glass panel, a11y). NavigationDrawer is the app-scale lateral sheet for global module navigation—locked core component.

Sheets carry secondary tasks; they must not replace hub shells for primary zone content.

---

## Philosophy

Overlays should feel like **glass layers floating above scenic depth**—not full page replacements.

Two families:

| Family | Component | Motion | Use |
|--------|-----------|--------|-----|
| Modal sheet | `Sheet` | bottom → center on sm+ | Forms, confirmations, editors |
| Nav drawer | `NavigationDrawer` | slide from left | Global module menu, Valv block |

Both use backdrop blur, token surfaces, Escape dismiss, body scroll lock.

Sheets respect progressive disclosure—one decision at a time for ADHD-safe flows (ai-cognitive-companion).

**Z-index and layering:**

| Layer | Class | Notes |
|-------|-------|-------|
| Backdrop | `.ds-overlay` | `--ds-z-modal` |
| Panel | `.ds-sheet-panel` | focus target on open |
| Drawer backdrop | `.nav-drawer__backdrop` | separate stack |
| Drawer panel | `.nav-drawer` | slides over content |

Only one primary overlay should capture focus at a time. Opening Sheet while drawer open is unsupported—close drawer first.

**NavigationDrawer lifecycle:**

1. Header menu sets `isMenuOpen` true in store.
2. Body class `nav-drawer-open` applied.
3. User navigates → effect closes drawer on route change.
4. Valv lock → `endVaultSession({ closeDrawer: true })` + navigate home.

---

## Visual Rules

**Sheet overlay:**

- `.ds-overlay` fixed inset, z-index `--ds-z-modal`
- Background: bg color 60% mix + blur sm
- Variant `--sheet`: align flex-end mobile; center on sm+
- Variant `--center`: always centered (modal)

**Sheet panel:**

- `.ds-sheet-panel` + `.ds-card` + `glow-bottom-gold`
- max-width 28rem default; glass blur xl; shadow xl
- `--tall`: max-w-2xl (42rem), 85vh, rounded top on mobile

**NavigationDrawer:**

- `.nav-drawer--obsidian-depth` scenic background layer
- `.nav-drawer__backdrop` dim + click dismiss
- Header: LivskompassMark + LIVSKOMPASSEN title + diamond ornament
- Rows: `.nav-drawer__row` flat list with icon, label, chevron
- Valv block: section title + lock panic button when vault open

Animation: `nav-drawer-in` 0.26s ease-out on drawer enter.

---

## Sizing

| Element | Dimension |
|---------|-----------|
| Default sheet max-width | 28rem |
| Tall sheet max-width | 42rem |
| Tall sheet max-height | 85vh |
| Overlay padding | `--ds-space-4` |
| Sheet panel padding | `--ds-space-5` |
| Drawer width | CSS nav-drawer (full mobile width ~ min(100vw, 22rem)) |
| Header title | display font lg |
| Row icon | h-4 w-4 |
| Close button | h-5 w-5 icon in 44px target |
| Swipe close threshold | 56px horizontal delta |

Tall sheets: use `SheetBody` flex-1 overflow-y-auto for scrollable editor content.

---

## Spacing

- Sheet header to body: `mt-[var(--ds-space-4)]` when header visible.
- SheetFooter: `mt-[var(--ds-space-5)]`, flex-wrap, gap `--ds-space-2`.
- Drawer header padding via nav-drawer CSS; calm-scroll region for list.
- Recent visits grid: chips with gap before Vardag section.
- Valv lock button: separated block below Valv rows with hint copy.

Hide header (`hideHeader`): supply `ariaLabel`; optional headerAction only.

---

## States

**Sheet:**

| Prop | Effect |
|------|--------|
| open false | render null |
| open true | portal mount, focus panel, lock scroll |
| placement sheet | bottom mobile / centered desktop |
| placement center | always centered |
| size tall | editor layout, rounded top mobile |
| hideHeader | aria-label on dialog |

**NavigationDrawer:**

| State | Behavior |
|-------|----------|
| closed | null render |
| open | body class `nav-drawer-open`, Escape closes |
| route change | auto-close on pathname/search/hash change |
| vault unlocked | Valv section + lock panic visible |
| swipe left | close if delta > 56px |
| recent visits | chips excluding current path |

Backdrop mousedown on Sheet overlay closes when target === currentTarget.

---

## Examples

1. **ResurserOverlay** — sheet or overlay pattern from dock Resurser button.
2. **Settings sheet** — default size, title + SheetFooter buttons.
3. **Project editor** — `size="tall"` + SheetBody scroll.
4. **NavigationDrawer** — menu from header; DrawerModeToggle for Valv shell.
5. **PIN modal** — centered placement, hideHeader optional.
6. **Drawer recent chips** — quick revisit without full scroll.

NavigationDrawer is **PROTECTED CORE**—do not remove UI elements without architectural review.

**Drawer vs Sheet decision matrix:**

| Need | Use |
|------|-----|
| Global module list | NavigationDrawer |
| Contextual form / confirm | Sheet |
| Full-width editor | Sheet `size="tall"` |
| Resource grid from dock | ResurserOverlay (overlay family) |
| Valv panic lock | NavigationDrawer lock row |

**NavigationDrawer row data:**

- Vardag rows: `DRAWER_VARDAG_ITEMS` from `drawerNav.ts`
- Valv rows: `DRAWER_VALV_ITEMS` when vault session open
- Recent: `useDrawerRecentNav()` chips, excludes current path
- Active detection: `isVardagDrawerRowActive`, `isDrawerLinkActive`

**Sheet prop reference:**

| Prop | Default | Purpose |
|------|---------|---------|
| portal | true | Mount to body |
| placement | sheet | Bottom mobile / center desktop |
| size | default | 28rem; tall for editors |
| lockScroll | true | Body overflow hidden |
| hideHeader | false | Requires ariaLabel if true |

---

## Accessibility

**Sheet:**

- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` from title id; `aria-describedby` when description prop set
- hideHeader: `aria-label` required
- Escape key dismiss; focus moves to panel on open (`tabIndex={-1}`)
- lockScroll prevents background scroll

**NavigationDrawer:**

- `role="dialog"`, `aria-label` Swedish menu / Valv variant
- Backdrop button `aria-label="Stäng meny"`
- Close X `aria-label="Stäng"`
- Lock button explains panic action in visible hint text
- Row buttons: full row clickable; active state via `--active` class

Focus trap: drawer rows sequential; return focus to menu button on close (parent responsibility).

---

## Animations

| Surface | Animation |
|---------|-----------|
| Sheet overlay | `ds-overlay-in` via premium-polish.css |
| Sheet panel | inherits overlay enter |
| Nav drawer | `nav-drawer-in` 0.26s ease-out |
| Backdrop | opacity fade (CSS) |

No slide-up spring on sheet panel beyond overlay enter—calm motion only.

Reduced motion: shorten or remove translate on drawer; keep instant opacity.

Route-change drawer close is instant—no exit animation required (prevents flash on navigate).

---

## Code Examples

```tsx
// Sheet.tsx
<Sheet
  open={open}
  onClose={() => setOpen(false)}
  title="Spara ändringar?"
  description="Dina ändringar sparas lokalt tills du synkar."
  placement="sheet"
>
  <SheetBody>{children}</SheetBody>
  <SheetFooter>
    <Button variant="ghost" onClick={onClose}>Avbryt</Button>
    <Button variant="accent" onClick={onConfirm}>Spara</Button>
  </SheetFooter>
</Sheet>

// NavigationDrawer — portal pattern
return createPortal(
  <>
    <button type="button" className="nav-drawer__backdrop" aria-label="Stäng meny" onClick={onClose} />
    <aside className="nav-drawer nav-drawer--obsidian-depth" role="dialog" aria-modal="true">
      {/* header, DrawerModeToggle, rows */}
    </aside>
  </>,
  document.body,
);
```

Tall editor:

```tsx
<Sheet open={open} onClose={onClose} size="tall" title="Redigera projekt">
  <SheetBody className="px-[var(--ds-space-5)]">{editor}</SheetBody>
</Sheet>
```

---

## Do

- Portal sheets to `document.body` default.
- Use SheetFooter for button pairs; accent + ghost hierarchy.
- Close drawer on navigation automatically (already in NavigationDrawer).
- Provide Swedish aria labels on all dismiss targets.
- Use `size="tall"` for editors exceeding default panel height.

---

## Don't

- Stack multiple modal sheets without z-index plan.
- Put primary hub content only inside sheets—hubs use HubPageShell.
- Modify NavigationDrawer structure without locked UX approval.
- Remove swipe-to-close or Escape handlers.
- Use sheets for full-zone navigation—use 3-zone routes instead.
- Leave body overflow hidden after sheet unmount (Sheet cleanup restores).

---

## Future Improvements

- Unified overlay z-index scale doc linking Sheet, drawer, ResurserOverlay.
- Focus return hook shared between Sheet and NavigationDrawer.
- Exit animation for drawer matching enter (optional, reduced-motion off).
- Storybook: sheet placements × tall × hideHeader matrix.
- Migrate legacy bespoke modals to Sheet component.
- Document ResurserOverlay relationship in navigation spec appendix.
- Smoke test: Escape closes open sheet in e2e harness.
- Audit z-index stacking when Sheet opens above NavigationDrawer.
- Extract shared `useOverlayFocusReturn` for menu button focus restoration.
"""

REQUIRED_SECTIONS = [
    "Purpose", "Philosophy", "Visual Rules", "Sizing", "Spacing", "States",
    "Examples", "Accessibility", "Animations", "Code Examples", "Do", "Don't", "Future Improvements",
]

def validate(name: str, content: str) -> None:
    lines = content.splitlines()
    n = len(lines)
    if not (250 <= n <= 350):
        raise ValueError(f"{name}: expected 250-350 lines, got {n}")
    for sec in REQUIRED_SECTIONS:
        if f"## {sec}" not in content:
            raise ValueError(f"{name}: missing section ## {sec}")

def main() -> None:
    for filename, content in CHAPTERS.items():
        path = BASE / filename
        if path.exists():
            print(f"SKIP (exists): {filename}")
            continue
        validate(filename, content)
        path.write_text(content, encoding="utf-8")
        print(f"WROTE {filename} ({len(content.splitlines())} lines)")

if __name__ == "__main__":
    main()
