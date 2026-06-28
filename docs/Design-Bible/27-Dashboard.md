# Chapter 27 — Dashboard

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [26-Planning.md](./26-Planning.md)  
> **Next chapter:** [28-Accessibility.md](./28-Accessibility.md)


---

## Purpose

This chapter specifies the **executive home dashboard** at `/` when Executive Midnight theme is active — layout modes, greeting hero, snabbstart Chameleon, dagens riktning, and DAD visual hierarchy.

Home is **not a productivity dashboard**. It is a personal compass anchor: identity → Eye → reflection → kompass → modules.

| Component | Role |
|-----------|------|
| `HomeHeroKanon` | theme branch router |
| `ExecutiveMixEHomeDashboard` | mix-e layout |
| `HomeLayoutA` | extended executive grid |
| `ChameleonLive` | snabbstart supermodule |
| `DagensRiktningCard` | daily direction collapsible |
| `MainLayout` | scenic home chrome |

Reference: `design-calm.mdc` HOME SCREEN (LÅST) section.
---

## Philosophy

DAD home hierarchy:

1. Livskompassen header crown (Chapter 17)
2. Ögat primary action
3. Dagens Reflektion / greeting hero
4. Kompass — signature, larger than dock icons
5. Secondary modules (snabbstart, riktning, memory)

**Layout modes** (`getExecutiveHomeLayoutMode`):

| Mode | UI | Feel |
|------|-----|------|
| extended | HomeLayoutA executive | full grid + compass stage |
| mix-e | ExecutiveMixEHomeDashboard | classic vertical stagger |

Preference persists locally; `HOME_LAYOUT_CHANGED_EVENT` syncs React state.

Home must **refine, not redesign** (premium-ui.mdc) — polish within locked structure.
---

## Visual Rules

| Region | Classes | Notes |
|--------|---------|-------|
| Root | `home-hero-kanon home-hero-kanon--executive` | wrapper |
| mix-E | `executive-home-dashboard executive-home-dashboard--mix-e max-w-2xl space-y-4 pb-4` | centered |
| Greeting | `exec-mix-e-greeting`, `HomeGreeting variant="executive"` | hero |
| Streak | `HomeStreakChip` in `exec-mix-e-greeting__eld` | subtle |
| Snabbstart | `HomeExecutiveSnabbstart` | Chameleon entry |
| Riktning | `DagensRiktningCard` | collapsible |
| Stagger | `ExecutiveHomeStagger` + items | entrance |
| Chameleon exec | `chameleon-shell__chameleon--executive` | zone + modes |
| Zone nav | `chameleon-shell__zone-nav--exec` | 3 zones |
| Mode pill on | `chameleon-shell__exec-mode-pill--on` | gold active |
| Layout A greeting | `home-greeting-module border-[2px] border-accent/30 rounded-[14px]` | BentoCard |

Scenic `/`: `MainLayout` slim header when design pack active.

Hidden SOS: Shield button top-right — Pansar manual trigger, low opacity.
### HomeGreeting variants

| Variant | Use |
|---------|-----|
| default | calm / layout A |
| executive | mix-E + executive chrome |
| mockupCopy | design pack labs |

Executive variant tightens eyebrow treatment and pairs with `hideEyebrow` when design pack active on scenic home.

### HomeExecutiveSnabbstart

Entry point to `ChameleonLive` on executive home — must default sensible zone/mode from `chameleonBridge.getDefaultTarget`.

### scenic home chrome

When `location.pathname === '/'` and design pack active, `MainLayout` enables slim header — dashboard content gains vertical space; do not add compensating margin unless overlap occurs.
---

## Sizing

| Element | Spec |
|---------|------|
| mix-E max width | max-w-2xl centered mx-auto |
| Section gap | space-y-4 |
| Greeting radius | 14px (tighter than 3xl calm-card) |
| Chameleon card | full column width |
| Compass stage | dominates — never dock-icon size |
| Delegate viewport | calm-scroll-island inside exec shell |
| Quick modules stack | one ElongatedModule expanded at a time |

320px: mix-E column full bleed with page padding from app shell.
---

## Spacing

- ExecutiveHomeStagger orchestrates vertical rhythm — avoid duplicate space-y on children.
- mix-E pb-4 clears floating dock + Fyren widget bar.
- HomeActionHub legacy path: space-y-4 between head, kompassrad, strip, quick modules.
- home-module-stack: elongated accordion modules below compass.
- exec-mix-e-greeting: relative positioning for streak chip overlay.

Dock clearance mandatory — content never hidden under glass dock.
---

## States

| State | Behaviour |
|-------|-----------|
| executive theme | Midnight executive branch in HomeHeroKanon |
| mix-e vs extended | local preference |
| Low capacity | may simplify modules; Chameleon remains |
| Riktning open | collapsible expanded inline |
| Zone switch | Chameleon morph 350ms |
| Check-in saved | onCheckInSaved propagates refresh |
| Design pack | greeting hides eyebrow; slim header |
| Brass theme | separate branch — not executive classes |

Non-executive themes use Layout A calm or mockup scenic — never mix exec CSS.
### Theme branch matrix

| Theme | Home component |
|-------|----------------|
| Midnight executive | HomeHeroKanon → mix-E or Layout A executive |
| Brushed brass | HomeLayoutA brass |
| Mockup / design pack | scenic stack + adaptive compass |
| Default calm | HomeLayoutA calm |

Only one branch renders — `isMidnightExecutiveTheme` is exclusive with brass.

### Pansar SOS

Shield trigger calls `usePansarStore.activate('manual', 1)` — low opacity but must remain reachable in crisis; do not remove without SOS specialist review.
---

## Examples

**mix-E morning:** Executive greeting → snabbstart Chameleon (default Vardagen) → collapsed Dagens riktning → expand for prompt.

**extended:** HomeLayoutA executive — compass stage visible, kompass dominates lower viewport.

**Chameleon snabbstart:** Zone pills → mode row → inline Mabra check-in or Planering task.

**HomeQuickModules:** ElongatedModule accordion — dagbok, uppgift, quiz, lucka — one open row.

**AdaptiveMemoryCards:** Below hero on some presets — adaptive-card-grid tones.

**HomePage routing:** `ChameleonLive` target from `chameleonBridge` default by zone/time.
### HomePage branch logic

```tsx
// HomePage.tsx selects ChameleonLive vs HomeHeroKanon based on theme + preset
executiveHome && <HomeHeroKanon onCheckInSaved={...} />
```

### Legacy HomeActionHub

Non-executive compass-first path still uses `HomeActionHub` — kompassrad, strip, quick modules. Executive path replaces with mix-E or Layout A — do not merge stacks blindly.

### AdaptiveMemoryCards

Sits below hero on applicable presets — uses adaptive-card-grid (Chapter 24) for suggestion tiles.
---

## Accessibility

- ExecutiveHomeStagger honors `prefers-reduced-motion`.
- Zone nav: visible text labels on pills.
- Chameleon: tablist/tab/aria-selected semantics.
- SOS Shield: keyboard focusable, title attribute.
- Greeting preset: aria-label on profile chip.
- Focus order: header → hero → snabbstart → riktning — not dock before main.
- Collapsible riktning: button aria-expanded state.

Compass decorative SVG: aria-hidden if redundant with text CTA nearby.
### Stagger vs reduced motion

`ExecutiveHomeStagger` must skip translate animations when user prefers reduced motion — content appears immediately, order preserved.

### Multiple check-in paths

Mabra check-in may surface via Chameleon snabbstart and Dagens riktning — ensure toast success messages are not duplicated in screen reader announcements.
---

## Animations

- ExecutiveHomeStagger: sequential section fade/slide on mount.
- Chameleon morph: delegate viewport --morph class 350ms.
- DagensRiktningCard: height transition on collapse — premium ease.
- ElongatedModule: expand/collapse height on quick modules path.
- Compass ambient: subtle — no fast spinner on home idle.

No autoplay video or looping shimmer on hero — calm mandate.
---

## Code Examples

```tsx
import { HomeHeroKanon } from '@/core/home/HomeHeroKanon';
import { ExecutiveMixEHomeDashboard } from '@/core/home/executive/ExecutiveMixEHomeDashboard';
import { ChameleonLive } from '@/core/home/ChameleonLive';
import {
  getExecutiveHomeLayoutMode,
  HOME_LAYOUT_CHANGED_EVENT,
} from '@/core/home/executive/homeLayoutPreference';

// HomePage
<HomeHeroKanon onCheckInSaved={() => refetch()} />

// mix-E branch
<ExecutiveMixEHomeDashboard onCheckInSaved={onCheckInSaved} />

// Snabbstart Chameleon
<ChameleonLive
  target={target}
  onTargetChange={setTarget}
  executiveSkin
  onStatus={setStatusMsg}
/>

// Listen layout preference
useEffect(() => {
  const sync = () => setLayout(getExecutiveHomeLayoutMode());
  window.addEventListener(HOME_LAYOUT_CHANGED_EVENT, sync);
  return () => window.removeEventListener(HOME_LAYOUT_CHANGED_EVENT, sync);
}, []);
```

CSS: `src/styles/executive-chrome.css` · `src/modules/core/home/`.
---

## Do

- Preserve DAD hierarchy — compass never demoted to dock icon size.
- Use ExecutiveMixEHomeDashboard for mix-e preference only.
- Thread onCheckInSaved through hero → riktning → snabbstart.
- Apply executive skin when `isMidnightExecutiveTheme`.
- Keep snabbstart as single Chameleon entry — no duplicate forms.
- Run smoke:locked-ux on home layout changes.
- Maintain dock clearance padding on dashboard root.
---

## Don't

- Redesign home as KPI/metrics dashboard.
- Move kompass into dock as equal-size icon (DAD forbidden).
- Show Kanban/economy advanced on home at Nivå 1.
- Remove Dagens Reflektion/greeting without Pontus OK.
- Mix brass and executive class names in one render.
- Autoplay distracting motion on hero.
- Add fourth home layout mode without PMIR.
---

## Future Improvements

- Settings toggle for mix-e ↔ extended surfaced in executive prefs.
- Auto mix-e minimal when capacity score below threshold.
- Hem v3 unified module-list discovery rail (ClusterGrid tones).
- FyrenWidgetBar action parity with snabbstart targets.
- Visual regression in smoke:design-modules for executive home.
- Compass widget edge integration per specialist-widgets roadmap.
- Document home layout preference in onboarding once stable.
- Executive layout preference exposed in Settings executive tab with plain-language labels.
- Home capacity banner paired with auto Simplified mix-E (Chapter 03 gates).
- Snapshot tests for mix-E vs extended at 320 and 1440 widths.
- Chameleon default target from time-of-day + evolution hub score.
---
