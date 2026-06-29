# Chapter 20 — Buttons

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [19-Compass.md](./19-Compass.md)  
> **Next chapter:** [21-Inputs.md](./21-Inputs.md)


---


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
