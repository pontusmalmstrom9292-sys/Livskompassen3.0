# Chapter 18 — Dock

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [17-Header.md](./17-Header.md)  
> **Next chapter:** [19-Compass.md](./19-Compass.md)


---


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
