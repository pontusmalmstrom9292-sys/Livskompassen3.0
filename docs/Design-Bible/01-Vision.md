# Chapter 01 — Vision

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** —  
> **Next chapter:** [02-Design-Philosophy.md](./02-Design-Philosophy.md)

---

## Purpose

This chapter defines **what Livskompassen is**, **who it serves**, and **what the interface must achieve at the highest level**. Every downstream decision—color, typography, dock geometry, journal flows—must be defensible against the vision stated here.

If a proposed UI change cannot be mapped to this vision, it does not ship.

The vision is not marketing copy. It is a **design contract** between product, engineering, and AI agents building the interface.

---

## Philosophy

### Livskompassen is not

Livskompassen must never be mistaken for:

- A productivity app with gamified streaks
- A generic dashboard or project-management tool
- A SaaS admin panel with dense data tables
- A social feed or notification engine
- A game, sci-fi HUD, or cyberpunk interface

These categories carry visual and interaction baggage—Material cards, neon accents, badge counts, infinite scroll anxiety—that contradict the product's reason for existing.

### Livskompassen is

> **A neuro-adaptive premium Life OS.**

The application helps a person navigate life under cognitive load: ADHD, anxiety, hypervigilance, recovery from chronic stress, parallel parenting, and the need to hold evidence without drowning in it. The interface is a **personal compass**, not a command center.

Design communicates six values, in order of priority when trade-offs arise:

| Priority | Value | Design manifestation |
|----------|-------|----------------------|
| 1 | **Safety (Trygghet)** | Predictable chrome, no surprise modals, WORM evidence feels stable |
| 2 | **Calm (Lugn)** | Low visual noise, progressive disclosure, muted motion |
| 3 | **Clarity (Tydlighet)** | One primary action per surface, readable hierarchy |
| 4 | **Exclusivity (Exklusivitet)** | Crafted materials—glass, gold, depth—not template UI |
| 5 | **Reflection (Reflektion)** | Journal and hero content given visual weight |
| 6 | **Direction (Riktning)** | Compass as anchor; zones map to life domains |

When two options are equally functional, choose the one that **reduces cognitive load** and **increases felt safety**.

### The design mantra

When uncertain, prefer what feels like:

> *"An exclusive personal compass for life"*

over what feels like:

> *"A standard productivity app."*

This mantra is binding for human designers and AI agents alike.

---

## Visual Rules

### Official visual identity: Executive Midnight

Executive Midnight is the **only approved production theme** unless explicitly superseded by a new DAD. Its core elements:

| Element | Specification |
|---------|---------------|
| Background | Deep marine navy / obsidian black stack (`--bg`, `--surface` layers) |
| Accent | Warm gold (`#d4af37` canonical; theme packs may shift slightly) |
| Material | Glass with backdrop blur, inner highlight, soft border |
| Depth | Layered shadows, ambient blobs, scenic gradients on home |
| Contrast | High legibility on dark surfaces; AA minimum (see Ch. 28) |
| Motion | Slow, eased, no bounce (see Ch. 12) |

### Forbidden aesthetics

Never introduce, even in experiments destined for sandbox:

- Material Design 3 default shapes and ripple patterns as primary language
- Neon, gaming, or cyberpunk palettes
- Flat white cards on gray backgrounds (generic SaaS)
- Saturated rainbow silo colors competing with gold anchor
- Semicircle or arc "compass" icons that read as generic navigation

### Three-zone life architecture

The app organizes life into three zones. Visual design respects this mental model:

```
┌─────────────────────────────────────────────────────────┐
│  HJÄRTAT (/hjartat)     Reflection · Journal · Speglar │
│  VALV (/valvet)         Evidence vault · PIN protected  │
├─────────────────────────────────────────────────────────┤
│  VARDAGEN (/vardagen)   MåBra · Planering · Ekonomi    │
├─────────────────────────────────────────────────────────┤
│  FAMILJEN (/familjen)   Barnfokus · Hamn · Barnporten │
└─────────────────────────────────────────────────────────┘
```

Legacy routes (`/dagbok`, `/mabra`, `/planering`, etc.) redirect—**no new routes outside the three-zone system**.

Zone identity may use **subtle** accent shifts (bento icon boxes) but must not break Executive Midnight cohesion.

### Locked chrome hierarchy

These elements are **product signature** and locked by DAD (detailed in Ch. 17–19):

1. **Header** — Crown of the app; identity + Eye (Ögat), not a toolbar  
2. **Home hero** — "Dagens Reflektion" as primary content module  
3. **Compass** — Center of dock; larger than all nav icons; never demoted  
4. **Dock** — Exists to carry the compass; glass, thin, quiet  

Visual gaze order on home:

```
LIVSKOMPASSEN → Ögat → Dagens Reflektion → Kompassen → övrigt innehåll
```

---

## Sizing

Vision-level sizing establishes **scale philosophy**; pixel tokens live in Ch. 04–08.

| Concept | Rule |
|---------|------|
| **Compass dominance** | Compass diameter ≥ 2× adjacent dock icon hit area |
| **Touch targets** | Minimum 44×44 pt for all interactive chrome (Motorola G85 baseline) |
| **Readable comfort** | Body text never below 14px equivalent; prefer 16px for long reading (journal) |
| **Density modes** | Low-capacity users see reduced home density (capacity gate); never remove compass |
| **Safe areas** | All fixed chrome respects `env(safe-area-inset-*)` |

Production compass sizes (reference — full spec in Ch. 19):

| Context | Size token | Approx. dimension |
|---------|------------|-------------------|
| Dock hero | `ExecutiveDecorCompass size="hero"` | 5.15 rem (~82 px) |
| Dock inline | `size="dock"` | 2.65 rem (~42 px) |
| Header decor | `size="md"` – `size="lg"` | 48–64 px |
| Inline mark | `size="sm"` | 32 px |

The compass **breaks out** of the dock capsule vertically—it is not contained to the same band height as side icons.

---

## Spacing

At vision level, spacing serves **cognitive quiet**:

| Principle | Application |
|-----------|-------------|
| **Breathing room** | Hero and journal surfaces use generous vertical rhythm |
| **Chrome clearance** | Scrollable content clears dock via `--app-dock-clearance` |
| **Max open levels** | Hubs expose max ~3 visual levels simultaneously (progressive disclosure) |
| **Island scrolling** | Hub content uses calm scroll islands; background stays fixed |

Default dock clearance token:

```css
--app-dock-clearance: calc(8.5rem + env(safe-area-inset-bottom, 0px) + 1.5rem);
```

Content must never sit under the floating dock or Fyren widget bar.

---

## States

Vision defines **emotional states** the UI must support—not component states (those belong in component chapters).

| User state | UI response |
|------------|-------------|
| **Grounded** | Full home layout, snabbstart available, gentle motion |
| **Low capacity** | Reduced modules on home, same chrome locks, no guilt copy |
| **Crisis / SOS** | SOS trigger always reachable; visual calm preserved (no flashing) |
| **Child mode (Barnporten)** | Simplified shell; adult chrome hidden per route |
| **Vault locked** | Plausible deniability; no vault leakage in header labels |
| **Offline / degraded** | Firestore network chip; no blocking full-screen errors for transient state |

The interface never punishes absence—no red badge shame for missed streaks on home.

---

## Examples

### Example A — Executive home (canonical)

**Route:** `/` with Midnight Executive theme  
**Files:** `MainLayout.tsx`, `executive-chrome.css`, `ExecutiveDockBar.tsx`

What a reviewer should see:

- Scenic or obsidian ambient background with soft gold blob
- Header: LIVSKOMPASSEN wordmark, executive premium variant with Eye center action
- Hero card: "Dagens Reflektion" with Cinzel label styling, glass card, gold border mix
- Dock: six-zone extended or four-zone mix-E; **compass centered and elevated**
- Fyren widget bar above dock when enabled

### Example B — Hub page (Hjärtat)

**Route:** `/hjartat`  
**Pattern:** `hub-page-shell--obsidian-bento`

- Bento glass header strip with module title
- Toolbar pills inside `module-shell__toolbar--bento`
- Cards use `calm-card` / `bento-card` with top highlight line

### Example C — What we reject

A Notion-like flat sidebar + white content column + hamburger-only mobile nav. This fails vision checks: no compass anchor, SaaS density, breaks Executive Midnight.

---

## Accessibility

Vision-level accessibility commitments:

| Commitment | Rationale |
|------------|-----------|
| **WCAG 2.1 AA** | Minimum contrast on text and icons |
| **Reduced motion** | Respect `prefers-reduced-motion`; compass may static |
| **Screen reader landmarks** | Header, nav (dock), main identified |
| **Swedish primary copy** | UI language Swedish; Bible in English for builders |
| **Touch-first** | G85 reference device; no hover-only critical paths |
| **Cognitive accessibility** | One primary action, short labels, no timed dismiss on critical content |

Detailed patterns: [28-Accessibility.md](./28-Accessibility.md).

---

## Animations

Vision-level motion principles (implementation in Ch. 12):

| Rule | Value |
|------|-------|
| Easing | Custom cubic `[0.45, 0, 0.55, 1]` — calm, no bounce |
| Stagger | ~80 ms between home items |
| Duration | ~520 ms for hero reveals |
| Forbidden | Bouncy springs, slot-machine transitions, parallax overload |
| Chameleon morph | ~350 ms fade between input modes |

Motion **supports orientation** (where am I?) never **demands attention** (look at this animation).

---

## Code Examples

### Theme default (I-stone / Architect Stone)

Production default theme pack from `themeRegistry.ts`:

```typescript
{
  id: 'I-stone',
  label: 'Architect Stone',
  cssVars: {
    '--bg': '#0a0a0a',
    '--surface': '#111111',
    '--surface-2': '#1a1a1a',
    '--accent': '#d4af37',
    '--glass': 'rgba(8, 8, 8, 0.72)',
    '--border': 'rgba(212, 175, 55, 0.12)',
  },
}
```

### TypeScript design export

```typescript
// src/modules/core/ui/tokens.ts
export const DESIGN = {
  obsidianDeep: '#020617',
  accent: '#d4af37',
  glass: 'rgba(8, 8, 8, 0.72)',
  border: 'rgba(212, 175, 55, 0.12)',
} as const;
```

### Executive home motion hook

```typescript
// src/modules/core/home/executive/executiveHomeMotion.ts
const EXEC_HOME_EASE = [0.45, 0, 0.55, 1] as const;

export const EXEC_HOME_ITEM_TRANSITION = {
  duration: 0.52,
  ease: EXEC_HOME_EASE,
};
```

### Layout shell classes

```tsx
<div className="app-shell relative min-h-screen text-text font-sans">
  <AmbientBackground />
  <AppHeaderBar headerVariant="executive-premium" />
  <main>{children}</main>
  <FloatingDock />
</div>
```

---

## Do

- Treat the compass as the **product icon** in every layout decision
- Preserve Executive Midnight glass + gold language across all zones
- Use progressive disclosure before adding visible controls
- Design for **Pontus's cognitive profile**: low affect, low clutter, high trust
- Keep sandbox experiments in `/dev/theme-lab` and `src/modules/sandbox/**` until promoted
- Run `npm run smoke:locked-ux` after any chrome change
- Reference this chapter when reviewing PRs that touch Header, Dock, Compass, or Home

---

## Don't

- Don't reposition the compass off-center or inside a hamburger menu
- Don't swap Executive Midnight for light mode, Material, or flat SaaS templates
- Don't add gamification visuals (streak flames, leaderboard cards) to home
- Don't increase header complexity beyond DAD structure
- Don't ship cross-zone visual noise (competing neon silo glows)
- Don't use English for primary user-facing copy without explicit product decision
- Don't bypass PMIR for locked UX changes

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Vision → metrics** | Define measurable KPIs (time-to-orientation, taps-to-journal) tied to vision |
| **Basta Design skin** | Secondary approved skin (`themePackBastaDesign`) needs vision addendum |
| **Theme pack governance** | Document which I-stone variants are production-eligible vs lab-only |
| **Child-facing vision doc** | Separate abbreviated vision for Barnporten copywriters |
| **Motion audit** | Full inventory of non-executive easing curves still in legacy modules |
| **Localized Bible** | Swedish builder summary for non-English stakeholders |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Values and decision framework | [02-Design-Philosophy.md](./02-Design-Philosophy.md) |
| Non-negotiable rules | [03-Core-Principles.md](./03-Core-Principles.md) |
| Color tokens | [04-Color-System.md](./04-Color-System.md) |
| Header spec | [17-Header.md](./17-Header.md) |
| Dock spec | [18-Dock.md](./18-Dock.md) |
| Compass spec | [19-Compass.md](./19-Compass.md) |
| AI agent constraints | [32-AI-Rules.md](./32-AI-Rules.md) |

---

*End of Chapter 01 — Vision*
