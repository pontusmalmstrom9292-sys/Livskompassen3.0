# Premium UI Polish — Design System Plan

**Version:** 1.1 | **Last updated:** 2026-06-28

**Goal:** `src/design-system/` becomes the single styling authority. Legacy CSS remains a thin compat layer until Phase 10.

---

## Design tokens

### Existing (keep)

| Token file | CSS vars | Purpose |
|------------|----------|---------|
| colors.ts | --ds-color-* | Surfaces, accent, border, text |
| typography.ts | --ds-font-*, textStyles | Cormorant, Inter, Cinzel |
| spacing.ts | --ds-space-* | 4px rhythm, --ds-touch-target 44px |
| radius.ts | --ds-radius-* | Cards, buttons, sheets |
| shadow.ts, elevation.ts | --ds-elevation-* | Layered depth |
| blur.ts, glass.ts | --ds-glass-* | Glass panels |
| animation.ts | --ds-duration-*, --ds-ease-* | Motion |

### Add in Phase 1

| Token file | Purpose |
|------------|---------|
| focus.ts | --ds-focus-ring, offset |
| zIndex.ts | --ds-z-modal, dock, drawer |
| motion.ts | Framer preset constants mirroring CSS |

**Bridge rule:** Features use `var(--ds-*)` or TS `tokens.*` — never `#d4af37` or `rgb()` inline.

---

## Components

### Current (14)

Card, GlassPanel, Banner, Button, Input, Modal, Sheet, Badge, Avatar, Icon, Section, Header, Dock, Navigation

### Add (Phase 1 + 5)

| Component | Source | Notes |
|-----------|--------|-------|
| Skeleton | NEW | Replace HubPanelSkeleton patterns |
| Spinner | NEW | Loader2 wrapper, ds-spinner |
| EmptyState | Move from core/ui | Token-based |
| ErrorFallback | NEW | Unified error boundary UI |

### App-layer wrappers (stay in shared/ui)

| Wrapper | Rule |
|---------|------|
| BentoCard | **Primary module card API** — title/icon/description |
| Button | Legacy variant map until btn-pill sunset |

---

## Component decision tree

```
Need a module content card with title?
  → BentoCard (shared/ui)

Need a toolbar / strip without card hover?
  → GlassPanel

Need raw card without header API?
  → Card from design-system (rare in features)

Need theme-lab pack switching?
  → UiCard ONLY on /dev/* routes

Need user action?
  → Button (design-system) — NEVER new btn-pill--

Need section header / alert?
  → Banner variant="section" | "info" | "warning" | "danger"

Need blocking overlay?
  → Modal (center) or Sheet (bottom/mobile)

Need loading?
  → Skeleton | Spinner

Need inline help strip?
  → Banner variant="info" — NOT AlertBanner
```

---

## Naming conventions

| Layer | Convention | Example |
|-------|------------|---------|
| React | PascalCase | Button, ModalFooter |
| CSS class | ds-{component}--{modifier} | ds-btn--accent |
| CSS var | --ds-{category}-{name} | --ds-space-4 |
| TS token key | camelCase | colors.accent |
| Legacy bridge | BUTTON_LEGACY_VARIANT | primaryGold → accent |

---

## Folder structure (target)

```
src/design-system/
├── README.md                 # NEW — import policy
├── index.ts
├── components/
│   ├── index.ts
│   └── [14+ primitives]
├── tokens/
│   ├── index.ts
│   ├── css/variables.css
│   └── [token modules]
├── motion/                   # NEW Phase 1
│   ├── index.ts
│   ├── presets.ts
│   └── useDsReducedMotion.ts
├── styles/
│   ├── components.css
│   └── premium-polish.css
└── utils/cn.ts
```

---

## Animation system

### CSS (canonical for simple interactions)

- Hover lift: --ds-hover-lift (-2px)
- Press: --ds-press-scale (0.985)
- Panel enter: @keyframes ds-panel-in in premium-polish.css
- Reduced motion: variables.css zeroes durations

### Framer (complex stagger / route enter)

```typescript
// design-system/motion/presets.ts — illustrative
export const dsEase = [0.45, 0, 0.55, 1];
export const dsStagger = { staggerChildren: 0.08 };
export const dsFadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };
```

All exports respect useReducedMotion().

**Rule:** ChameleonInputShell MUST use --ds-duration-morph (350ms), not Tailwind duration-300.

---

## Theme system

- Prod locked: ME-basta-design (themeRegistry THEME_LOCKED)
- DS variables alias runtime: `--ds-color-bg: var(--bg)`
- Theme Lab (/dev/theme-lab) does not affect prod when locked
- Design Freeport (/dev/design-freeport) exempt from DAD

---

## Icon rules

- Locked icons: D1, M2, WH1, WH2 — smoke:locked-icons
- DS Icon: DS_ICON_STROKE constant
- Compass: custom SVG only — no icon library for compass rose
- One stroke family across app chrome

---

## Migration strategy

### Phase A — Touch-and-upgrade
Every edited file: DS primitives + tokens; no new legacy classes.

### Phase B — Zone batches
btn-pill migration order: Planering → Inkast → Valv → MåBra → Familjen → Hjärtat → remainder.

### Phase C — CSS extraction
When grep shows zero usage of a legacy class in src/modules → remove from index.css.

### Phase D — Deprecate shared/ui
After btn-pill = 0: direct @/design-system imports; shared/ui re-exports removed (Phase 10).

### Smoke per batch
smoke:design-modules + zone-specific smokes.

---

## Forbidden patterns (agents)

- New btn-pill--* in features
- Hardcoded hex in src/modules/**
- Inline style for colors/spacing (except Chameleon morphMs dynamic)
- shadcn from bästa design/ in prod
- Moving compass / changing dock item order
- UiCard in prod feature modules
- New AlertBanner / ModuleSectionBanner usage

---

## Documentation deliverables (Phase 1)

- [ ] src/design-system/README.md
- [ ] Component props JSDoc on all exported primitives
- [ ] Update figma/connect when BentoCard API changes
