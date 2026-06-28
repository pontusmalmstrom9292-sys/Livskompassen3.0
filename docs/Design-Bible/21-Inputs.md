# Chapter 21 — Inputs

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [20-Buttons.md](./20-Buttons.md)  
> **Next chapter:** [22-Sheets.md](./22-Sheets.md)

---

## Purpose

This chapter defines **input surfaces** in Livskompassen — token-based field styling (`ds-input`) and the **Chameleon SuperModule pattern** for multi-mode capture (journal, inkast, planering) without route sprawl.

Inputs must feel calm, glass-adjacent, and cognitively light. Users choose *what* they want to do; the shell morphs tools in place.

---

## Philosophy

### Chameleon principle

> One shell, many modes — UI morphs (~350 ms fade) instead of new pages/menus.

Three layers per feature (mandatory separation):

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Logic** | `hooks/`, `*Service.ts`, delegates | Firestore, callables, validation |
| **Shell** | `ChameleonInputShell`, `*SuperModule` | Mode switch, morph, delegate routing |
| **Skin** | CSS tokens, `designPackMeta` | Colors, spacing, glow |

Agents must not embed Firestore calls inside large JSX trees with hardcoded hex colors.

### SuperModule pattern

`*InputSuperModule.tsx` files are thin routers:

1. Parse mode from URL or props
2. Render mode picker (max 4–6 visible modes)
3. Wrap delegate in `ChameleonInputShell`
4. Delegate components own form UI — not the supermodule file

Canonical example: `DagbokInputSuperModule.tsx` (Superdagbok Universal Input Hub).

---

## Visual Rules

### Token input (`.ds-input`)

Production primitive in `src/design-system/styles/components.css`:

| Property | Token |
|----------|-------|
| Width | 100% |
| Radius | `var(--ds-radius-md)` |
| Border | `var(--ds-color-border)` |
| Background | `var(--ds-color-surface-1)` |
| Text | `var(--ds-color-text)` |
| Placeholder | `var(--ds-color-text-dim)` |
| Padding | `var(--ds-space-2) var(--ds-space-3)` |
| Font | `var(--ds-font-body)`, `var(--ds-font-size-sm)` |
| Focus border | `var(--ds-color-accent)` |
| Focus ring | 2 px accent mix outline |

No inline hex in feature modules — use `ds-input` class or design-system Input wrapper.

### ChameleonInputShell chrome

Shell classes:

- Outer: `chameleon-input-shell`
- Viewport: `chameleon-input-shell__viewport calm-scroll-island`
- Morph: opacity 0 + `scale-[0.98]` + `blur-[2px]` while fading

Viewport uses `var(--ds-ease-premium)` and `CHAMELEON_MORPH_MS` (350 ms).

### Hub input cards

Delegates typically sit inside:

- `BentoCard` / `calm-card` glass surfaces
- `hub-view-lock` scroll regions
- Mode picker as ghost/secondary pills (see [20-Buttons.md](./20-Buttons.md))

---

## Sizing

| Element | Spec |
|---------|------|
| Input min height | Implicit via padding + `font-size-sm` — target ≥44 px with label |
| Textarea delegates | Full width inside card; calm-scroll for long journal |
| Mode picker chips | `btn-pill--ghost` or `ds-btn--ghost` — touch-friendly |
| Shell viewport | 100% width of parent card column |

Mobile-first (Motorola G85): no hover-only input affordances.

---

## Spacing

| Area | Rule |
|------|------|
| Card padding | `var(--ds-space-5)` on bento/calm cards |
| Label → field | `var(--ds-space-2)` |
| Field → helper | `var(--ds-space-1)` |
| Mode picker → delegate | `var(--ds-space-4)` |
| SuperModule sections | Vertical rhythm via hub shell — avoid nested scroll traps |

Use `calm-scroll-island` on viewport to prevent body scroll bleed during morph.

---

## States

### ds-input states

| State | Style |
|-------|-------|
| Default | Border `--ds-color-border` |
| Hover | Subtle border brighten (premium-polish.css) |
| Focus | Accent border + focus-visible ring |
| Disabled | Reduced opacity via parent |
| Error | Add `aria-invalid` + danger border class at delegate level |

### Chameleon morph states

| Phase | Viewport |
|-------|----------|
| Stable | `opacity-100 scale-100 blur-0` |
| Fading | `opacity-0 scale-[0.98] blur-[2px]` |
| Duration | 350 ms each half-phase via `useChameleonMorph` |

Mode change never unmounts the shell — only the delegate child swaps after fade.

### Capacity-gated modes

Example: Dagbok low-capacity hides heavy modes — logic in supermodule, not shell. UI stays visually calm (fewer picker chips).

---

## Examples

### Example A — ChameleonInputShell

```tsx
// src/modules/core/ui/ChameleonInputShell.tsx
<ChameleonInputShell mode={activeMode}>
  {(displayed) => (
    <DagbokInputModeDelegate mode={displayed} onSaved={handleSaved} />
  )}
</ChameleonInputShell>
```

### Example B — Dagbok SuperModule stack

```tsx
// DagbokInputSuperModule.tsx (pattern)
<BentoCard>
  <DagbokInputModePicker mode={activeMode} onChange={setMode} />
  <ChameleonInputShell mode={activeMode}>
    {(displayed) => <DagbokInputModeDelegate mode={displayed} />}
  </ChameleonInputShell>
</BentoCard>
```

Modes: `reflektion`, `quick_mirror`, `arkiv`, `burn`, `tyst` — each a separate delegate file.

### Example C — Plain token input

```tsx
<label className="block text-sm text-text-muted">
  Titel
  <input className="ds-input mt-2" placeholder="Kort rubrik" />
</label>
```

---

## Accessibility

| Requirement | Spec |
|-------------|------|
| Labels | Visible or `aria-label` on all fields |
| Focus order | Mode picker → primary field → actions |
| Morph | Not a route change — announce mode change via live region if needed |
| `prefers-reduced-motion` | Morph may collapse to instant swap |
| Touch | 44 px min on pickers and inputs |
| Error | `aria-invalid` + text description |

---

## Animations

| Animation | Duration | Token |
|-----------|----------|-------|
| Chameleon morph | 350 ms | `CHAMELEON_MORPH_MS`, `--ds-ease-premium` |
| Input focus | fast | `--ds-duration-fast` |
| Mode picker | button transitions | see Ch. 20 |

Forbidden: slide-in full page transitions for mode changes when shell exists.

---

## Code Examples

### useChameleonMorph

```typescript
// src/modules/core/hooks/useChameleonMorph.ts
export const CHAMELEON_MORPH_MS = 350;

export function useChameleonMorph<T>(value: T) {
  // fade out → swap displayed → fade in
  return { displayed, fading, morphMs: CHAMELEON_MORPH_MS };
}
```

### ds-input CSS

```css
.ds-input {
  width: 100%;
  border-radius: var(--ds-radius-md);
  border: 1px solid var(--ds-color-border);
  background: var(--ds-color-surface-1);
  color: var(--ds-color-text);
  padding: var(--ds-space-2) var(--ds-space-3);
}
.ds-input:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ds-color-accent) 45%, transparent);
  outline-offset: 2px;
}
```

### SuperModule delegate switch

```tsx
function DagbokInputModeDelegate({ mode }: { mode: DagbokInputMode }) {
  switch (mode) {
    case 'reflektion': return <DagbokReflektionDelegate />;
    case 'quick_mirror': return <DagbokQuickMirrorDelegate />;
    // …
  }
}
```

---

## Do

- Use `ChameleonInputShell` + `*SuperModule` for new multi-mode input hubs
- Keep Firestore/callable logic in delegates and services
- Style fields with `ds-input` and design tokens
- Limit visible modes to 4–6; progressive disclosure for rest
- Prototype new skins in Theme Lab before prod routes

---

## Don't

- Don't create parallel routes per micro-input mode
- Don't hardcode `#d4af37` or hex in `src/modules/features/**`
- Don't remove morph shell without PMIR — locked Chameleon pattern
- Don't put long static menus where a delegate switch suffices
- Don't mix backend calls inside sandbox styling experiments without flags

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Input component wrapper** | React `Input` primitive mirroring `Button` |
| **Voice input shell** | Röst-till-Valv delegate pattern doc |
| **Validation UX** | Shared error banner under shell viewport |
| **Inkast SuperModule** | Parity doc with Dagbok pattern |

---

### Related chapters

| Topic | Chapter |
|-------|---------|
| Buttons (mode picker) | [20-Buttons.md](./20-Buttons.md) |
| Cards / bento | [16-Cards.md](./16-Cards.md) |
| Chameleon rule | `.cursor/rules/chameleon-ui-modularity.mdc` |
| Color policy | `docs/design/COLOR-POLICY.md` |
| Motion | [12-Motion.md](./12-Motion.md) |

---

*End of Chapter 21 — Inputs*
