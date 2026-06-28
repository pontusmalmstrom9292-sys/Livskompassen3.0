# Livskompassen UI Audit

**Role:** Lead UI Architect — pre-keynote review  
**Date:** 2026-06-28  
**Scope:** Full codebase visual, interaction, accessibility, and performance audit  
**Prod theme:** `ME-basta-design` (Executive Midnight / Bästa design)  
**Method:** Static analysis of routes, components, CSS tokens, motion, a11y patterns, e2e smoke  
**Code changes:** None — audit only  

---

## Executive summary

Livskompassen has **world-class intent** locked in DAD v1.0 and a **premium home + chrome** that can genuinely feel Apple-adjacent when `ME-basta-design` is active. The compass-forward dock, scenic hero, Cormorant display type, and glass depth on home are real strengths—not mockups.

However, this is **not yet one product visually**. It is **three products wearing the same repo**:

1. **Prod chrome** — Basta Design header/dock/home (`basta-design.css`, ~1200 lines executive overlap)  
2. **Hub/modern modules** — Obsidian Calm bento shells (Hjärtat, Familjen, Valvet, Planering)  
3. **Legacy stragglers** — Dashboard, Reflection, Oracle, Morning Compass using undefined CSS vars and pre-DAD palettes  

An Apple keynote review would **not ship** until legacy islands are migrated or removed, token authority is singular, and accessibility gaps on the dock (focus, touch targets, keyboard Valv) are closed.

### Overall grades (honest)

| Area | Grade | Notes |
|------|-------|-------|
| Home / chrome (prod) | **A−** | Strong craft; minor touch/focus gaps |
| Zone hubs (bento) | **B+** | Cohesive glass; micro-type abuse |
| Supermodules (Chameleon) | **B** | Good pattern; inconsistent shell polish |
| Legacy routes | **D** | Broken tokens, wrong aesthetic |
| Design token system | **C** | Triple namespace, 12 CSS bundles in prod |
| Accessibility | **C−** | Dock + overlays fail keyboard/focus bar |
| Motion consistency | **B−** | Home good; 19 Framer files without reduced-motion |
| Performance (CSS) | **C** | All theme-lab CSS loaded globally |

### Top 10 blockers before "keynote ready"

| # | Issue | Priority | Effort |
|---|-------|----------|--------|
| 1 | Undefined `--color-obsidian-calm` / `--color-nordic-dusk` on Reflection + Dashboard | P0 | S |
| 2 | Triple token system (`--*`, `--bd-*`, `--color-*`) + prod re-overrides | P0 | L |
| 3 | Exec dock touch targets 40px; Basta header buttons 28px | P0 | S |
| 4 | Long-press Valv has no keyboard alternative | P0 | M |
| 5 | No shared Modal/BottomSheet primitive — 8+ ad-hoc implementations | P1 | L |
| 6 | 12 theme-lab CSS files imported in prod `index.css` | P1 | M |
| 7 | Legacy `/dashboard`, `/reflection`, `/orakel` break Executive Midnight | P1 | M |
| 8 | Dock labels at 6–8px / 0.4rem — illegible, fails spirit of AA | P1 | S |
| 9 | Framer Motion in SOS/MåBra/Zen without `useReducedMotion` | P1 | M |
| 10 | Tailwind hardcoded `obsidian-*` colors bypass theme system | P2 | M |

**Effort key:** S = 1–2 days · M = 3–5 days · L = 1–2 weeks · XL = 2+ weeks  

---

## Systemic findings

### 1. Token authority is fractured

Three parallel namespaces compete at runtime:

- `:root` semantic vars (`--bg`, `--accent`) — labeled "Obsidian Calm" but prod is marine `#07101D`  
- `--bd-*` in `basta-design.css` — Figma export parallel to semantic vars  
- `--color-*` legacy aliases — some **undefined** (`--color-obsidian-calm`, `--color-nordic-dusk`)  

`midnight-gold-tokens.json` is **orphaned**—not referenced—and describes flat black `#050505`, not prod marine.

`--app-dock-clearance` has **three conflicting values** across `index.css`, `design-packs.css`, and `basta-design.css`.

### 2. Naming drift: Obsidian Calm vs Executive Midnight vs Basta Design

| Legacy name | Reality |
|-------------|---------|
| `obsidian-calm-2.css` | Executive Midnight glass/card system |
| e2e `obsidian-calm-tokens.spec.ts` | Tests `ME-basta-design` home |
| `ME-midnight-executive` | Alternate mockup skin, not prod |
| `:root` body font Inter + h1 Outfit | Prod display is **Cormorant Garamond** |

Design Bible says Executive Midnight; code says Basta Design; CSS files say Obsidian Calm.

### 3. CSS bundle bloat

`src/index.css` imports **12 theme/style files** including sandbox `design-freeport.css` (~3700 lines) into every production build. Locked theme (`THEME_LOCKED`) makes most `[data-theme]` blocks dead weight but still parsed.

### 4. Component primitive gaps

| Expected (premium-ui.mdc) | Status |
|---------------------------|--------|
| GlassPanel | Missing — `calm-card` / `glass-card` classes only |
| Modal | Missing — ad-hoc per feature |
| BottomSheet | Missing — 5+ one-off sheets |
| Button | Partial — `<Button>` exists; hundreds of raw `btn-pill--*` usages |

---

## Screen-by-screen audit

### Global chrome

#### MainLayout (`src/modules/core/layout/MainLayout.tsx`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Correct shell composition: ambient bg, header, main, dock, drawer; barnporten route hides dock; capacity-aware home |
| **Weaknesses** | Theme branching logic complex (executive / basta / mockup / legacy); Fyren bar toggled by skin |
| **Design inconsistencies** | Three header+dock pairs (BastaDesign, Executive, legacy FloatingDock) |
| **Spacing** | `--app-dock-clearance` conflict causes variable bottom padding |
| **Typography** | Inherited from theme; no issue at layout level |
| **Animation** | None at layout level |
| **Accessibility** | No skip link; main landmark implicit only |
| **Performance** | Subscribes to multiple stores; acceptable |
| **Suggestions** | Single chrome adapter; unify dock clearance token |
| **Priority** | P1 |
| **Effort** | M |

#### AppHeaderBar + DesignPackCenterHeader

| Field | Assessment |
|-------|------------|
| **Strengths** | `executive-premium` variant; proper `<header aria-label>`; menu `aria-expanded` |
| **Weaknesses** | BastaDesignHeader lacks header `aria-label`; vault/settings buttons 28px |
| **Design inconsistencies** | Cinzel wordmark vs Cormorant home hero in same session |
| **Spacing** | Scenic header padding differs from hub bento headers |
| **Typography** | Letter-spacing 0.22em on executive home h1 — not replicated in hubs |
| **Animation** | None |
| **Accessibility** | KompisHeaderVaultButton has focus ring; Basta icon buttons do not |
| **Performance** | Light |
| **Suggestions** | Unify header to one component; min 44px all chrome buttons |
| **Priority** | P0 (touch targets) |
| **Effort** | S |

#### FloatingDock + ExecutiveDockBar + BastaDesignDock

| Field | Assessment |
|-------|------------|
| **Strengths** | Compass hero size correct; `nav aria-label`; `aria-current` on active zone; long-press Valv progress ring |
| **Weaknesses** | Exec side buttons 40px; labels 0.4rem (~6.4px); no focus-visible styles |
| **Design inconsistencies** | Extended 6-zone vs mix-E 4-zone layouts; legacy FloatingDock still exists |
| **Spacing** | Compass breaks dock plane correctly on Basta; legacy dock flatter |
| **Typography** | Dock labels unreadably small |
| **Animation** | `exec-compass-pulse` / `bd-compass-pulse` duplicated keyframes |
| **Accessibility** | **P0:** `useLongPress` mouse/touch only — Valv inaccessible via keyboard |
| **Performance** | Dock re-renders on pathname + hold state — acceptable |
| **Suggestions** | 44px targets; keyboard Valv path; focus-visible gold ring; 10px min label size |
| **Priority** | P0 |
| **Effort** | M |

#### ExecutiveDecorCompass / LivskompassMark

| Field | Assessment |
|-------|------------|
| **Strengths** | Custom SVG + textured hero asset; token-based gold gradients on small sizes |
| **Weaknesses** | Two assets (`kompass-dock-rose.svg`, `b1-kanon-ros.svg`) — must stay visually matched |
| **Design inconsistencies** | SVG compass on small sizes vs PNG/SVG texture on hero — intentional but fragile |
| **Spacing** | Hero 5.15rem — correct per DAD |
| **Typography** | N/A |
| **Animation** | Pulse on dock — reduced-motion handled in exec/basta CSS only |
| **Accessibility** | Decorative `aria-hidden` — correct |
| **Performance** | Image assets cached; SVG filters moderate cost |
| **Suggestions** | Single source asset pipeline; document size map in Design Bible Ch.19 |
| **Priority** | P2 |
| **Effort** | S |

#### NavigationDrawer

| Field | Assessment |
|-------|------------|
| **Strengths** | `role="dialog"`, `aria-modal`, Escape closes |
| **Weaknesses** | No focus trap; focus not restored on close |
| **Design inconsistencies** | Drawer styling matches design packs — OK |
| **Spacing** | Adequate touch rows |
| **Typography** | Consistent |
| **Animation** | Slide — no reduced-motion check in JS |
| **Accessibility** | Partial dialog pattern |
| **Suggestions** | Focus trap + return focus to menu button |
| **Priority** | P1 |
| **Effort** | S |

#### ResurserOverlay

| Field | Assessment |
|-------|------------|
| **Strengths** | Dialog role; 44px close button |
| **Weaknesses** | No Escape; no focus trap; no initial focus |
| **Design inconsistencies** | Matches overlay pattern |
| **Spacing** | Good row min-height 52px |
| **Typography** | `text-xs text-text-dim` helper — borderline |
| **Animation** | CSS fade |
| **Accessibility** | **P1** incomplete dialog |
| **Performance** | Light |
| **Suggestions** | Match NavigationDrawer a11y pattern |
| **Priority** | P1 |
| **Effort** | S |

#### AmbientBackground

| Field | Assessment |
|-------|------------|
| **Strengths** | Scenic gradient + blobs; theme-aware |
| **Weaknesses** | Inline styles for blob positions (4 instances) |
| **Design inconsistencies** | Scenic only on home; hubs get flat ambient — OK |
| **Spacing** | N/A |
| **Typography** | N/A |
| **Animation** | Blob drift — reduced-motion in exec/basta CSS |
| **Accessibility** | Decorative — OK |
| **Performance** | `filter: blur(80px)` on blobs — GPU cost on G85; `will-change: transform` helps |
| **Suggestions** | Reduce blur radius on low-end Android via media query |
| **Priority** | P2 |
| **Effort** | S |

---

### Home (`/`)

#### BastaDesignHome (prod)

| Field | Assessment |
|-------|------------|
| **Strengths** | **Best screen in the app** — scenic hero, reflection card, stagger motion, Cormorant display, compass dock synergy |
| **Weaknesses** | 18 inline `style={{}}` usages; heavy coupling to `basta-design.css` |
| **Design inconsistencies** | None within prod path |
| **Spacing** | Hero padding and card radius (`1.5rem`) consistent |
| **Typography** | Cormorant + Inter — canonical prod pair |
| **Animation** | `bastaDesignMotion.ts` respects `useReducedMotion` ✓ |
| **Accessibility** | Check-in flows need audit per control |
| **Performance** | Framer stagger on mount — acceptable with reduced-motion off |
| **Suggestions** | Extract inline styles to CSS vars; golden reference for all hubs |
| **Priority** | P2 (polish) |
| **Effort** | M |

#### HomePage (non-basta paths)

| Field | Assessment |
|-------|------------|
| **Strengths** | ChameleonLive integration; capacity-aware modules |
| **Weaknesses** | Multiple skin branches in one page; confusing for maintainers |
| **Design inconsistencies** | Executive vs mockup vs default layout A — three homes |
| **Spacing** | Layout A uses different card radius than Basta |
| **Typography** | Cinzel on executive path vs Cormorant on Basta |
| **Animation** | ExecutiveHomeStagger ✓ reduced motion |
| **Accessibility** | OK at page level |
| **Performance** | Many conditional imports |
| **Suggestions** | Deprecate non-prod home paths or gate behind dev only |
| **Priority** | P1 |
| **Effort** | M |

#### HomeHeroKanon / ChameleonLive / CaptureSuperModule

| Field | Assessment |
|-------|------------|
| **Strengths** | DAD-aligned hero hierarchy; Chameleon morph ~350ms |
| **Weaknesses** | Hero kanon coexists with Basta hero — duplication |
| **Design inconsistencies** | Two "Dagens Reflektion" implementations |
| **Spacing** | Chameleon shell uses `calm-scroll-island` — good |
| **Typography** | Mixed Cinzel/Cormorant labels |
| **Animation** | Chameleon CSS transition — no reduced-motion check in shell |
| **Accessibility** | Supermodule mode select needs aria for active mode |
| **Performance** | ChameleonLive lazy loads delegates — good |
| **Suggestions** | Single hero implementation behind feature flag |
| **Priority** | P1 |
| **Effort** | L |

---

### Hjärtat (`/hjartat`)

#### DagbokPage + ModuleShell + HjartatBentoShell

| Field | Assessment |
|-------|------------|
| **Strengths** | Bento hub chrome; tab model; WORM-aware patterns |
| **Weaknesses** | Hub header differs from Basta home craft level |
| **Design inconsistencies** | `hub-page-shell__header--bento` gradient vs Basta flat marine cards |
| **Spacing** | Module shell padding consistent |
| **Typography** | Section labels at 10px uppercase — too small |
| **Animation** | Minimal |
| **Accessibility** | TabBar has arrow keys ✓ |
| **Performance** | Lazy tab panels — good |
| **Suggestions** | Elevate hub header to Basta glass recipe |
| **Priority** | P2 |
| **Effort** | M |

#### DagbokInputSuperModule + delegates

| Field | Assessment |
|-------|------------|
| **Strengths** | Chameleon pattern; `dagbok-tyst-lage.css` scoped dark mode |
| **Weaknesses** | Tyst-läge uses hardcoded `#030508` (2 hex in CSS file) |
| **Design inconsistencies** | Reflektion delegate uses 10px labels extensively |
| **Spacing** | Delegate cards OK |
| **Typography** | `text-[10px] tracking-[0.2em]` overused |
| **Animation** | Morph shell — no reduced-motion |
| **Accessibility** | Voice input controls need labels audit |
| **Performance** | Acceptable |
| **Suggestions** | Tokenize tyst-läge; bump labels to 11–12px |
| **Priority** | P2 |
| **Effort** | S |

#### SpeglarSuperModule

| Field | Assessment |
|-------|------------|
| **Strengths** | Supermodule consistency |
| **Weaknesses** | Less visual polish than journal delegate |
| **Design inconsistencies** | Mirror cards flat vs calm-card depth |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Minimal |
| **Accessibility** | OK |
| **Performance** | OK |
| **Suggestions** | Apply bento-card hover depth |
| **Priority** | P3 |
| **Effort** | S |

---

### Valvet (`/valvet`)

#### VaultPage + valv.css

| Field | Assessment |
|-------|------------|
| **Strengths** | Strong information scent; mono labels for forensic tone; silo isolation respected |
| **Weaknesses** | Dense UI; many 10px labels |
| **Design inconsistencies** | `valv.css` accent-secondary on labels vs gold-only DAD on home |
| **Spacing** | Tight on mobile — acceptable for power users |
| **Typography** | `font-display-serif` at 10px — paradoxically small for serif |
| **Animation** | Minimal |
| **Accessibility** | PIN flows need focus management audit |
| **Performance** | Heavy vault panels — lazy load zones ✓ |
| **Suggestions** | Valv typographic scale separate from hub (document in Ch.25) |
| **Priority** | P2 |
| **Effort** | M |

#### ValvInputSuperModule

| Field | Assessment |
|-------|------------|
| **Strengths** | Chameleon integration |
| **Weaknesses** | Visual parity with Dagbok input uneven |
| **Design inconsistencies** | Minor |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Chameleon — no reduced-motion |
| **Accessibility** | OK |
| **Performance** | OK |
| **Suggestions** | Shared supermodule header component |
| **Priority** | P3 |
| **Effort** | S |

---

### Vardagen (`/vardagen`)

#### LivLauncherPage

| Field | Assessment |
|-------|------------|
| **Strengths** | Hub launcher pattern; inline BentoCard tabs |
| **Weaknesses** | Visually weaker than home — feels like admin launcher |
| **Design inconsistencies** | Tabs inline vs Planering dropdown nav |
| **Spacing** | OK |
| **Typography** | Hub title OK |
| **Animation** | None |
| **Accessibility** | Tab buttons need aria-selected |
| **Performance** | Light |
| **Suggestions** | Match Basta card styling for module tiles |
| **Priority** | P2 |
| **Effort** | M |

#### PlaneringPage + PlaneringBentoShell

| Field | Assessment |
|-------|------------|
| **Strengths** | HubPageShell; executive header variant; lazy tabs |
| **Weaknesses** | InkorgPreviewSheet ad-hoc modal pattern |
| **Design inconsistencies** | Tool cards vary in depth |
| **Spacing** | OK |
| **Typography** | 10px section headers |
| **Animation** | Sheet slide — no focus trap |
| **Accessibility** | Sheet has role=dialog — partial |
| **Performance** | Lazy routes ✓ |
| **Suggestions** | Shared sheet primitive |
| **Priority** | P2 |
| **Effort** | M |

#### MabraHubView + MabraLayout

| Field | Assessment |
|-------|------------|
| **Strengths** | Dedicated layout; recovery/SOS routes; executive header option |
| **Weaknesses** | Large route tree with varying polish |
| **Design inconsistencies** | MabraBentoShell vs hub shells |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | BreathingExercise Framer — **no reduced-motion** |
| **Accessibility** | SOS overlay animated breathing — vestibular risk |
| **Performance** | Many lazy views ✓ |
| **Suggestions** | Mabra motion guard; unify bento shell |
| **Priority** | P1 (SOS motion) |
| **Effort** | M |

#### ArbetslivInputSuperModule

| Field | Assessment |
|-------|------------|
| **Strengths** | Chameleon pattern |
| **Weaknesses** | Inline `calm-card` without hub shell — feels orphaned |
| **Design inconsistencies** | No HubPageShell wrapper |
| **Spacing** | Cramped on mobile |
| **Typography** | OK |
| **Animation** | Chameleon |
| **Accessibility** | OK |
| **Performance** | OK |
| **Suggestions** | Wrap in HubPageShell for consistency |
| **Priority** | P3 |
| **Effort** | S |

#### MorningCompass (`/morgon`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Functional morning flow |
| **Weaknesses** | Legacy glass inline styling |
| **Design inconsistencies** | **High** — pre-DAD aesthetic |
| **Spacing** | OK |
| **Typography** | Outfit/Inter — not Cormorant |
| **Animation** | Unknown |
| **Accessibility** | Not audited in smoke |
| **Performance** | OK |
| **Suggestions** | Migrate to Basta home patterns or redirect to home |
| **Priority** | P2 |
| **Effort** | M |

---

### Familjen (`/familjen`)

#### FamiljenPage + FamiljenBentoShell + familjen.css

| Field | Assessment |
|-------|------------|
| **Strengths** | Locked UX (Barnfokus) preserved; tab model rich |
| **Weaknesses** | `familjen.css` uses `text-text-dim` at 10px |
| **Design inconsistencies** | accent-secondary labels vs gold home |
| **Spacing** | OK |
| **Typography** | 10px uppercase labels |
| **Animation** | Minimal |
| **Accessibility** | Barnfokus routes need child-safe audit |
| **Performance** | Lazy tabs ✓ |
| **Suggestions** | Align section label scale with Design Bible |
| **Priority** | P2 |
| **Effort** | S |

#### BarnportenPage + barnporten.css

| Field | Assessment |
|-------|------------|
| **Strengths** | Separate child shell; dock hidden; own CSS vars |
| **Weaknesses** | 8 hardcoded hex in barnporten.css — intentional theme pack |
| **Design inconsistencies** | **Expected** — child palette differs from adult Executive Midnight |
| **Spacing** | Child UI simplified ✓ |
| **Typography** | Child-appropriate |
| **Animation** | Framer AnimatePresence — no reduced-motion |
| **Accessibility** | Child mode — large targets needed |
| **Performance** | OK |
| **Suggestions** | Document Barnporten as sanctioned sub-brand in Design Bible |
| **Priority** | P2 |
| **Effort** | S |

---

### Legacy / orphan screens

#### DashboardHub (`/dashboard`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Useful widgets conceptually |
| **Weaknesses** | Uses **`var(--color-nordic-dusk)` — undefined**; generic dashboard grid |
| **Design inconsistencies** | **Severe** — wrong palette, wrong layout paradigm, "Dagens Översikt" competes with home |
| **Spacing** | Desktop-first `max-w-6xl` — not mobile G85 first |
| **Typography** | `text-3xl font-bold` — not Cormorant display |
| **Animation** | ParalysisBreaker overlay — Framer without reduced-motion |
| **Accessibility** | Error state red on undefined bg |
| **Performance** | Fetches dashboard store on mount |
| **Suggestions** | **Deprecate or rebuild** as home modules; fix tokens immediately |
| **Priority** | **P0** |
| **Effort** | L |

#### ReflectionPage (`/reflection`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Reflection content valuable |
| **Weaknesses** | **`--color-obsidian-calm` undefined**; `-color-nordic-dusk` bg |
| **Design inconsistencies** | **Severe** — blur orbs, white/10 borders — pre-Obsidian Calm |
| **Spacing** | Desktop padding |
| **Typography** | Generic |
| **Animation** | Framer on WeeklySummary, DailySummaryCard — no reduced-motion |
| **Accessibility** | OK-ish |
| **Performance** | OK |
| **Suggestions** | Migrate to Hjärtat tab or apply Basta tokens |
| **Priority** | **P0** |
| **Effort** | M |

#### OracleDashboard (`/orakel`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Analytics for power users |
| **Weaknesses** | Same undefined `--color-nordic-dusk` |
| **Design inconsistencies** | **Severe** — admin analytics aesthetic |
| **Spacing** | Desktop grid |
| **Typography** | Generic bold headings |
| **Animation** | Minimal |
| **Accessibility** | Charts need audit |
| **Performance** | Data fetch heavy |
| **Suggestions** | Hide behind dev flag or Valv admin zone |
| **Priority** | P1 |
| **Effort** | M |

#### KompisHubPage (`/kompis`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Distinct Kompis identity |
| **Weaknesses** | KompisMark has 16 hardcoded hex values; UiCard not BentoCard |
| **Design inconsistencies** | Moderate — own brand mark OK but shell differs |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Tidshjulet Framer — no reduced-motion |
| **Accessibility** | OK |
| **Performance** | OK |
| **Suggestions** | Tokenize KompisMark SVG gradients |
| **Priority** | P2 |
| **Effort** | S |

---

### Widget shell (`/widget/*`)

#### WidgetShell + widget pages

| Field | Assessment |
|-------|------------|
| **Strengths** | Minimal chrome appropriate for widgets |
| **Weaknesses** | No MainLayout — compass/nav absent (correct) but styling varies per widget |
| **Design inconsistencies** | Moderate between widget pages |
| **Spacing** | Compact — intentional |
| **Typography** | Smaller scale — OK |
| **Animation** | Minimal |
| **Accessibility** | Widget manifest pages need audit |
| **Performance** | Good — isolated bundle |
| **Suggestions** | Widget design tokens subset in Design Bible |
| **Priority** | P3 |
| **Effort** | M |

---

### Settings & project hubs

#### InstallningarPage

| Field | Assessment |
|-------|------------|
| **Strengths** | ExecutiveSettingsList for exec theme; tab model |
| **Weaknesses** | Settings rows vary in density |
| **Design inconsistencies** | Low |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Row hover |
| **Accessibility** | Toggle controls need audit |
| **Performance** | OK |
| **Suggestions** | Apply Basta settings row styling universally |
| **Priority** | P3 |
| **Effort** | S |

#### ProjektHubPage / ProjektDetailPage

| Field | Assessment |
|-------|------------|
| **Strengths** | HubPageShell on list; picker sheets |
| **Weaknesses** | Detail page lacks HubPageShell — visual drop |
| **Design inconsistencies** | List vs detail chrome |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Sheets ad-hoc |
| **Accessibility** | Partial |
| **Performance** | Lazy ✓ |
| **Suggestions** | HubPageShell on detail |
| **Priority** | P3 |
| **Effort** | S |

---

## Shared component library audit

### Tier A — Production primitives (keep, polish)

#### BentoCard (`src/modules/shared/ui/BentoCard.tsx`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Token-based; glow variants; calm-card foundation |
| **Weaknesses** | Duplicated with `.glass-card` alias |
| **Design inconsistencies** | `.calm-card-midnight` flat variant differs |
| **Spacing** | `rounded-3xl` vs Basta `1.5rem` radius |
| **Typography** | N/A |
| **Animation** | Hover lift on bento-card — OK |
| **Accessibility** | OK as container |
| **Performance** | backdrop-blur cost |
| **Suggestions** | Unify radius token; document in Ch.16 |
| **Priority** | P2 |
| **Effort** | S |

#### Button + btn-pill system

| Field | Assessment |
|-------|------------|
| **Strengths** | Clear hierarchy: accent, secondary, success, ghost |
| **Weaknesses** | `<Button>` wrapper underused; variants scattered in CSS |
| **Design inconsistencies** | Some modules use raw Tailwind buttons |
| **Spacing** | Pill padding consistent |
| **Typography** | btn-pill text-xs in places — small |
| **Animation** | active:scale on some cards |
| **Accessibility** | Focus styles in CSS — mostly OK |
| **Performance** | OK |
| **Suggestions** | Enforce Button component in features |
| **Priority** | P2 |
| **Effort** | M |

#### Input (`src/modules/shared/ui/Input.tsx`)

| Field | Assessment |
|-------|------------|
| **Strengths** | Token borders and focus ring |
| **Weaknesses** | Not used everywhere — native inputs styled ad-hoc |
| **Design inconsistencies** | Moderate |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Focus transition |
| **Accessibility** | focus:border-accent — needs focus-visible |
| **Performance** | OK |
| **Suggestions** | Input primitive adoption sweep |
| **Priority** | P2 |
| **Effort** | M |

#### ChameleonInputShell

| Field | Assessment |
|-------|------------|
| **Strengths** | Core product pattern; morph 350ms; calm-scroll-island |
| **Weaknesses** | Only inline style is transitionDuration |
| **Design inconsistencies** | Low |
| **Spacing** | Good |
| **Typography** | N/A |
| **Animation** | **No reduced-motion** |
| **Accessibility** | Mode change should announce to screen readers |
| **Performance** | Good |
| **Suggestions** | `aria-live="polite"` on mode switch |
| **Priority** | P1 |
| **Effort** | S |

#### HubPageShell / ModuleShell

| Field | Assessment |
|-------|------------|
| **Strengths** | Consistent hub chrome across modules |
| **Weaknesses** | Bento header gradient differs from Basta home |
| **Design inconsistencies** | Moderate |
| **Spacing** | hub-view-lock + calm-scroll-island ✓ |
| **Typography** | Hub titles OK |
| **Animation** | None |
| **Accessibility** | OK |
| **Performance** | OK |
| **Suggestions** | Second-pass polish to match Basta |
| **Priority** | P2 |
| **Effort** | M |

#### TabBar / HubDropdownNav

| Field | Assessment |
|-------|------------|
| **Strengths** | TabBar arrow keys ✓ |
| **Weaknesses** | HubDropdownNav lacks same keyboard richness |
| **Design inconsistencies** | Two tab patterns |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Dropdown — OK |
| **Accessibility** | TabBar good; dropdown partial |
| **Performance** | OK |
| **Suggestions** | Unify on one tab primitive |
| **Priority** | P2 |
| **Effort** | M |

#### EmptyState / HubPanelSkeleton / AlertBanner / Toast

| Field | Assessment |
|-------|------------|
| **Strengths** | Token-based; consistent tone |
| **Weaknesses** | Toast uses Tailwind animate-in — not reduced-motion aware |
| **Design inconsistencies** | Low |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | Toast slide |
| **Accessibility** | Toasts need aria-live |
| **Performance** | OK |
| **Suggestions** | Toast region `role="status"` |
| **Priority** | P2 |
| **Effort** | S |

### Tier B — Overlays (need shared primitive)

#### ZenModeOverlay / InactivityBlurOverlay

| Field | Assessment |
|-------|------------|
| **Strengths** | Framer fade; token classes |
| **Weaknesses** | No `useReducedMotion`; blur 24px heavy |
| **Design inconsistencies** | Low |
| **Spacing** | Fullscreen OK |
| **Typography** | OK |
| **Animation** | Framer springs |
| **Accessibility** | Escape handling needed audit |
| **Performance** | Blur expensive |
| **Suggestions** | Reduced motion + static fallback |
| **Priority** | P1 |
| **Effort** | S |

#### SOSOverlay / BreathingExercise

| Field | Assessment |
|-------|------------|
| **Strengths** | Critical user flows |
| **Weaknesses** | **Animated breathing scale without reduced-motion** — vestibular |
| **Design inconsistencies** | SOS should stay calm — OK |
| **Spacing** | OK |
| **Typography** | OK |
| **Animation** | **P1 a11y risk** |
| **Accessibility** | Must respect prefers-reduced-motion |
| **Performance** | OK |
| **Suggestions** | Static circle fallback |
| **Priority** | **P0** |
| **Effort** | S |

#### Ad-hoc modals/sheets (8 implementations)

Files: `MabraCheckinModal`, `IntakeTriageModal`, `InkorgPreviewSheet`, `MaterialPackEditorSheet`, `HubPresetSheet`, `ProjektPickerSheet`, `ProjektWidgetSheet`, `WormSaveConfirmSheet`

| Field | Assessment |
|-------|------------|
| **Strengths** | Each works independently |
| **Weaknesses** | **No shared focus trap, backdrop, or motion** |
| **Design inconsistencies** | **High** — radius, padding, backdrop opacity vary |
| **Spacing** | Inconsistent |
| **Typography** | Inconsistent |
| **Animation** | Mixed |
| **Accessibility** | **High risk** — partial dialog patterns |
| **Performance** | OK |
| **Suggestions** | Build `Sheet` + `Modal` primitives (Ch.22–23) |
| **Priority** | **P1** |
| **Effort** | **L** |

### Tier C — Brand icons (acceptable hex in SVG)

LivskompassMark, ExecutiveDecorCompass, HeaderChromeGlyphs, drawerL2Icons, widget-icons — hardcoded gold in SVG acceptable for craft; should reference CSS vars where possible.

KompisMark (16 hex in features) — **violation** of features token rule.

---

## CSS & token layer audit

### index.css (~6800 lines)

| Issue | Priority | Effort |
|-------|----------|--------|
| `:root` labeled Obsidian Calm; prod is ME-basta-design | P1 | M |
| body Inter / h1 Outfit vs prod Cormorant | P1 | S |
| 6–10px dock labels | P1 | S |
| Duplicate gold rgba scales | P2 | M |
| Imports 12 theme CSS files | P1 | M |

### basta-design.css

| Issue | Priority | Effort |
|-------|----------|--------|
| Re-declares `--accent` after applyTheme | P2 | S |
| Header buttons 28px | P0 | S |
| Duplicate `@import` Google Fonts | P2 | S |
| `--app-dock-clearance` override | P1 | S |

### obsidian-calm-2.css

| Issue | Priority | Effort |
|-------|----------|--------|
| `.calm-card` ≈ `.glass-card` duplicate | P2 | S |
| `.calm-card-midnight` hardcoded `#0c0c0e` | P2 | S |
| Bento header rgba hardcoded | P2 | M |

### executive-chrome.css

| Issue | Priority | Effort |
|-------|----------|--------|
| Exec dock 40px targets | P0 | S |
| `.exec-dock-bar__label` 0.4rem | P1 | S |
| Duplicated keyframes with basta-design | P2 | S |

### tailwind.config.js

| Issue | Priority | Effort |
|-------|----------|--------|
| Hardcoded obsidian-bg/gold/indigo | P1 | M |
| fontFamily.display = Outfit | P1 | S |
| Stale inline comments | P3 | S |

---

## Animation inventory

| Easing pattern | Where | Consistent? |
|----------------|-------|-------------|
| `[0.45, 0, 0.55, 1]` | executiveHomeMotion, bastaDesignMotion | ✓ Executive standard |
| `cubic-bezier(0.22, 1, 0.36, 1)` | index.css, design-freeport | Legacy |
| `cubic-bezier(0.34, 1.2, 0.64, 1)` | index.css | Overshoot — **forbidden by DAD spirit** |
| `cubic-bezier(0.16, 1, 0.3, 1)` | Chameleon | OK |
| `ease-in-out` | Pulse keyframes | OK for ambient |

**Framer files without reduced-motion (19):** SOSOverlay, BreathingExercise, ZenModeOverlay, InactivityBlurOverlay, ParalysisBreaker, QuickCaptureOverlay, Archive*, Reflection*, Tidshjulet, BarnportenPage, DailyTasksList, BastaDesignApp (sandbox).

---

## Accessibility summary

| Check | Status |
|-------|--------|
| WCAG AA contrast (body text) | Mostly pass |
| Micro text 6–10px | **Fail spirit** |
| Touch targets 44px | **Fail** on exec dock + basta header |
| Focus visible on dock | **Fail** |
| Keyboard Valv unlock | **Fail** |
| Skip link | **Missing** |
| Focus trap on overlays | **Partial** |
| prefers-reduced-motion (JS) | Home only |
| prefers-reduced-motion (CSS) | Exec/basta/home only |
| e2e a11y coverage | **Minimal** (40px menu test only) |

---

## Performance summary

| Issue | Impact | Priority | Effort |
|-------|--------|----------|--------|
| 12 CSS files @import in prod | Parse time, bundle size | P1 | M |
| design-freeport.css 3700 lines in prod | Dead weight | P1 | S |
| backdrop-blur on all cards | GPU on G85 | P2 | M |
| Ambient blob blur 80px | GPU | P2 | S |
| Lazy routes | Good ✓ | — | — |
| Framer on many feature pages | JS cost | P3 | — |

---

## Priority roadmap (recommended)

### Wave 1 — Ship blockers (1 week)

1. Define/fix `--color-nordic-dusk` and `--color-obsidian-calm` OR migrate Dashboard/Reflection/Oracle  
2. Dock + header touch targets to 44px  
3. Keyboard path for Valv (long-press alternative)  
4. SOS/Breathing reduced-motion fallback  
5. Dock label minimum 10px readable  

### Wave 2 — Cohesion (2 weeks)

1. Token consolidation (`--bd-*` → semantic `--*`)  
2. Conditional CSS imports (prod vs dev)  
3. Shared Sheet/Modal primitive  
4. Hub header polish to Basta recipe  
5. Chameleon `aria-live` + reduced-motion  

### Wave 3 — Legacy sunset (2 weeks)

1. Deprecate `/dashboard` or merge into home  
2. Migrate `/reflection` → Hjärtat  
3. Gate `/orakel` behind admin/dev  
4. Tailwind token cleanup  
5. Font authority: Cormorant + Inter in tailwind + :root  

### Wave 4 — Craft (ongoing)

1. Design Bible chapters 04–32 implementation alignment  
2. Component adoption enforcement (Button, Input, BentoCard)  
3. e2e a11y suite (contrast, focus, reduced-motion)  
4. Motion token `--ease-executive`  

---

## Appendix A — Route coverage matrix

| Route | Visual tier | Token compliant | DAD compliant |
|-------|-------------|-----------------|---------------|
| `/` (Basta) | A | Mostly | Yes |
| `/hjartat` | B+ | Yes | Yes |
| `/valvet` | B | Yes | Yes |
| `/vardagen` | B | Yes | Partial |
| `/familjen` | B+ | Yes | Yes |
| `/planering` | B+ | Yes | Yes |
| `/mabra/*` | B | Yes | Partial |
| `/barnporten` | B (child) | Scoped hex | Sub-brand OK |
| `/dashboard` | **F** | **No** | **No** |
| `/reflection` | **F** | **No** | **No** |
| `/orakel` | **F** | **No** | **No** |
| `/widget/*` | B− | Mostly | N/A |
| `/dev/*` | Lab | Varies | N/A |

---

## Appendix B — Hardcoded color violations

| Location | Count | Severity |
|----------|-------|----------|
| `src/modules/features/**` | 26 hex (3 files) | Low — mostly SVG/CSS packs |
| `src/modules/core/ui/**` SVG icons | ~40+ hex | Acceptable in brand SVG |
| `index.css` + theme CSS | Hundreds rgba | Medium — should be tokens |
| `tailwind.config.js` | 3 hardcoded colors | Medium |

---

## Appendix C — Files reviewed (representative)

**Layout:** MainLayout, FloatingDock, ExecutiveDockBar, BastaDesignDock, AppHeaderBar, BastaDesignHeader, NavigationDrawer, HubPageShell, ModuleShell, AmbientBackground  

**Home:** HomePage, BastaDesignHome, HomeHeroKanon, ChameleonLive, ExecutiveHomeStagger  

**Pages:** DagbokPage, FamiljenPage, ValvetRoutePage, LivLauncherPage, PlaneringPage, InstallningarPage, BarnportenPage, DashboardHub, ReflectionPage, OracleDashboard  

**UI primitives:** BentoCard, Button, Input, ChameleonInputShell, TabBar, EmptyState, Toast, ZenModeOverlay, SOSOverlay  

**Styles:** index.css, basta-design.css, obsidian-calm-2.css, executive-chrome.css, design-packs.css, tailwind.config.js, themeRegistry, themePackBastaDesign.ts  

**Tests:** e2e/obsidian-calm-tokens.spec.ts, e2e/locked-ux-public.spec.ts, scripts/smoke_locked_ux.mjs  

---

*End of UI Audit — no code was modified. Next step: Wave 1 fixes with PMIR approval on locked chrome.*
