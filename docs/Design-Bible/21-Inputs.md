# Chapter 21 — Inputs

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [20-Buttons.md](./20-Buttons.md)  
> **Next chapter:** [22-Sheets.md](./22-Sheets.md)


---


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
