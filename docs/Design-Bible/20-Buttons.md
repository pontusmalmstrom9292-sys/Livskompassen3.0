# Chapter 20 — Buttons

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [19-Compass.md](./19-Compass.md)  
> **Next chapter:** [21-Inputs.md](./21-Inputs.md)

---

## Purpose

This chapter defines **pill button hierarchy** for Livskompassen — primary gold CTAs, glass secondary actions, quiet ghosts, and semantic success/danger states.

Production standard is the design-system `Button` component (`ds-btn` + `ds-btn--*`), which maps to legacy `btn-pill--*` CSS for visual parity. New module code must **not** introduce raw `btn-pill--*` classes (`smoke:no-new-btn-pill` gate).

---

## Philosophy

### One button language

Livskompassen buttons feel **crafted**, not Bootstrap:

| Quality | Expression |
|---------|------------|
| Premium | Gold gradient accent with inset highlight and lip shadow |
| Calm | Uppercase tracking, small caps sizing — not shouting |
| Glass | Secondary and ghost use blur + translucent navy stacks |
| Hierarchy | One primary gold CTA per surface; ghosts for tertiary |

Buttons are pills (`border-radius: full`) — never rectangular SaaS buttons in hub modules.

### Migration state (Premium UI Polish)

| Layer | Status |
|-------|--------|
| `Button` / `ButtonLink` | Preferred for new code |
| `ds-btn--*` in `components.css` | Token wrapper |
| `btn-pill--*` in `index.css` | Legacy visual source of truth |
| `BUTTON_VARIANTS` in `tokens.ts` | Semantic alias map to `ds-btn--*` |

---

## Visual Rules

### Base pill (`.btn-pill` / `.ds-btn`)

Shared anatomy from `index.css` + `components.css`:

- `inline-flex`, gap, **rounded-full**
- Uppercase, `text-xs`, wide letter-spacing
- Min height `var(--ds-touch-target)` (44 px)
- Disabled: `opacity-50`, no pointer events

### Variant: accent (primary gold)

Classes: `ds-btn--accent` → `@apply btn-pill--accent`

| Property | Spec |
|----------|------|
| Text | `--cta-gold-text` (dark on gold) |
| Fill | Vertical gold gradient light → `--cta-gold` → deep mix |
| Border | `--cta-gold-border` |
| Shadow | Inset highlight + lip + gold glow + ambient |
| Hover | Brighter gradient, expanded glow |
| Active | `translateY(2px)`, compressed shadow |

Alias: `ui-cta-gold.btn-pill--accent` for legacy markup.

Use for **one primary action** — Save to Valv, confirm WORM, main hub CTA.

### Variant: secondary (glass gold edge)

Classes: `ds-btn--secondary` → `btn-pill--secondary`

| Property | Spec |
|----------|------|
| Text | Gold-muted mix |
| Background | Translucent navy gradient |
| Border | Gold 26% mix, 0.5 px |
| Backdrop | `blur(14px)` |
| Hover | Brighter gold text, subtle outer glow |

Use for **continue**, alternate confirm, hub toolbar actions.

### Variant: ghost (quiet glass)

Classes: `ds-btn--ghost` → `btn-pill--ghost`

| Property | Spec |
|----------|------|
| Text | `text-text-muted` → hover `var(--text)` |
| Background | Lighter glass stack, `blur(12px)` |
| Border | Slate 20% mix |
| Hover | Gold-tinted border hint |

Use for **cancel**, back, low-priority toggles, tab-like selectors.

### Variant: success

Classes: `ds-btn--success` → `btn-pill--success`

- Border `success/40`, text `success`, hover `bg-success/10`
- Use for benign confirm — saved, completed, WORM ack

### Variant: danger

Classes: `ds-btn--danger` → `btn-pill--danger`

- Destructive actions — delete draft, revoke (with confirm sheet)

### Deprecated: primary

`btn-pill--primary` — flat gold tint; superseded by accent for CTAs. Do not use in new code.

---

## Sizing

| Size | Class | Spec |
|------|-------|------|
| Default `md` | `.ds-btn` | min-height touch target, `px-5 py-2` equivalent via tokens |
| Small `sm` | `.ds-btn--sm` | min-height 2 rem, smaller padding, `2xs` font |
| Icon | `.ds-btn--icon` | Square touch target, icon-only |

Typography: uppercase, `var(--ds-font-size-xs)` default, wide tracking.

---

## Spacing

| Context | Rule |
|---------|------|
| Button groups | `gap: var(--ds-space-2)` in footers/toolbars |
| Hub toolbar | Inside `module-shell__toolbar--bento` — horizontal scroll calm |
| Sheet footer | `SheetFooter` — flex wrap with `ds-space-2` gap |
| Header aside | Hub headers may host ghost pills — min height preserved |

Never stack more than two full-width accent buttons vertically without spacing `ds-space-3`.

---

## States

| State | Behavior |
|-------|----------|
| Default | Variant base styles |
| Hover | Brighten border/background; accent lifts glow |
| Active / pressed | Accent translates Y; ghost/secondary inset shadow |
| Focus-visible | 2 px gold outline, 2 px offset |
| Disabled | 50% opacity, no events |
| Selected (tabs) | Ghost with `aria-selected='true'` — see hub planering tabs |

---

## Examples

### Example A — Design-system Button (preferred)

```tsx
import { Button } from '@/design-system';

<Button variant="accent">Spara</Button>
<Button variant="secondary">Fortsätt</Button>
<Button variant="ghost">Avbryt</Button>
<Button variant="success">Klart</Button>
```

### Example B — Semantic alias (legacy hooks)

```tsx
import { BUTTON_VARIANTS } from '@/core/ui/tokens';

<button className={`ds-btn ${BUTTON_VARIANTS.save}`}>Spara</button>
<button className={`ds-btn ${BUTTON_VARIANTS.continue}`}>Fortsätt</button>
<button className={`ds-btn ${BUTTON_VARIANTS.primaryGold}`}>Bekräfta</button>
<button className={`ds-btn ${BUTTON_VARIANTS.ghost}`}>Stäng</button>
```

### Example C — Anti-pattern (blocked in modules)

```tsx
// FAIL smoke:no-new-btn-pill
<button className="btn-pill btn-pill--accent">Spara</button>
```

---

## Accessibility

| Requirement | Spec |
|-------------|------|
| Touch target | Min 44×44 px (`--ds-touch-target`) |
| Focus | Visible gold outline on all variants |
| Contrast | Accent text dark on gold — AA |
| Disabled | `disabled` attribute + opacity; not color alone |
| Icon buttons | `aria-label` required |
| Link buttons | Use `ButtonLink` for router navigation |

---

## Animations

| Transition | Duration | Easing |
|------------|----------|--------|
| Transform (accent active) | 180 ms | cubic-bezier spring lite |
| Box-shadow / background | 180 ms | ease |
| Ghost/secondary | 160–180 ms | ease |

No bounce, no ripple Material patterns. Respect `prefers-reduced-motion` global overrides in `premium-polish.css`.

---

## Code Examples

### BUTTON_VARIANTS (tokens.ts)

```typescript
// src/modules/core/ui/tokens.ts
export const BUTTON_VARIANTS = {
  continue: 'ds-btn--secondary',
  save: 'ds-btn--success',
  primaryGold: 'ds-btn--accent',
  ghost: 'ds-btn--ghost',
} as const;
```

### Button component mapping

```typescript
// src/design-system/components/Button.tsx
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  accent: 'ds-btn--accent',
  secondary: 'ds-btn--secondary',
  success: 'ds-btn--success',
  ghost: 'ds-btn--ghost',
  danger: 'ds-btn--danger',
};
```

### Legacy CSS bridge

```css
/* src/design-system/styles/components.css */
.ds-btn--accent { @apply btn-pill--accent; }
.ds-btn--secondary { @apply btn-pill--secondary; }
.ds-btn--ghost { @apply btn-pill--ghost; }
.ds-btn--success { @apply btn-pill--success; }
```

### Accent gold stack (index.css excerpt)

```css
.btn-pill--accent {
  color: var(--cta-gold-text, #020617);
  background: linear-gradient(180deg, var(--cta-gold-light) 0%, var(--cta-gold) 48%, var(--cta-gold-deep) 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 20px -4px var(--cta-gold-glow);
}
```

---

## Do

- Import `Button` / `ButtonLink` from `@/design-system` in features
- Use `variant="accent"` for single primary CTA per view
- Use `BUTTON_VARIANTS` when wiring semantic save/continue in legacy shells
- Keep uppercase pill styling — matches Executive Midnight
- Run `npm run smoke:no-new-btn-pill` on PRs touching modules

---

## Don't

- Don't add new `btn-pill--*` strings in `src/modules/**`
- Don't use raw hex gold in TSX — CTA tokens live in CSS
- Don't mix Material filled buttons or Bootstrap classes
- Don't place two accent buttons side by side without hierarchy reason
- Don't shrink below touch target for primary actions
- Don't create per-module button CSS duplicates

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Complete btn-pill migration** | `scripts/migrate_btn_pill_to_ds.mjs` batch remaining modules |
| **Loading state** | Standard `ds-btn--loading` with spinner |
| **Danger parity** | Document danger variant in BUTTON_VARIANTS export |
| **Theme pack CTA overrides** | Nordic/Aurora packs — document allowed deltas |

---

### Related chapters

| Topic | Chapter |
|-------|---------|
| Design tokens | [04-Color-System.md](./04-Color-System.md) |
| Touch targets | [28-Accessibility.md](./28-Accessibility.md) |
| Sheets (footer buttons) | [22-Sheets.md](./22-Sheets.md) |
| Component standards | `.cursor/rules/component-standards.mdc` |
| Smoke gate | `npm run smoke:no-new-btn-pill` |

---

*End of Chapter 20 — Buttons*
