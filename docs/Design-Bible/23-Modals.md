# Chapter 23 — Modals

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [22-Inputs.md](./22-Inputs.md)  
> **Next chapter:** [24-Lists.md](./24-Lists.md)


---

## Purpose

This chapter defines **modal and overlay surfaces** in Executive Midnight — centered dialogs, inline superhub panels, and the dual-variant pattern used across MåBra check-in and capture flows.

Modals interrupt focus deliberately. They must feel like crafted glass objects floating above the midnight canvas, never generic browser alerts or flat Material sheets.

| Production context | Component | Overlay? |
|--------------------|-----------|----------|
| MåBra hub check-in | `MabraCheckinModal` | Yes (default) |
| Chameleon / Superhub | Same, `variant="inline"` | No |
| Admin confirm | DS `Modal` + `ModalFooter` | Yes |
| Settings destructive | DS `Modal` | Yes |

Canonical imports: `@/design-system` `Modal` · `src/components/mabra/MabraCheckinModal.tsx`.

Governance: changes affecting home snabbstart require `npm run smoke:locked-ux` and visual Pontus OK per zone policy.
---

## Philosophy

Modals serve **one decision at a time** — progressive disclosure for ADHD-safe UX (ai-cognitive-companion.mdc).

**Three principles:**

1. **Interrupt with dignity** — midnight scrim, gold ridge, serif title; never flash white `#fff` sheets.
2. **Prefer morph over stack** — if Chameleon can embed the same UI inline, do not open a second overlay.
3. **Escape always works** — overlay click, Escape, Avbryt; never trap without explicit save/discard choice.

| Pattern | When to use | Anti-pattern |
|---------|-------------|----------------|
| DS Modal + inner calm-card | Standalone from list/hub | Nested modal on modal |
| Inline card | Superhub delegate | Duplicate form on new route |
| Hub status panel | Speglar guard redirect | Second modal for guard |
| Toast only | Success/failure ack | Modal for "Saved!" |

**Cognitive load:** Opening modal inside morphing shell doubles focus layers — default to inline in `ChameleonLive` delegates.

**Zero Footprint:** Draft vent text must not persist in localStorage unless specced (burn-adjacent flows).
---

## Visual Rules

| Element | Token / class | Executive Midnight rule |
|---------|---------------|-------------------------|
| Overlay | `.ds-overlay.ds-overlay--center` | Scrim + center flex; backdrop dismiss |
| Panel shell | `.ds-modal-panel.ds-card.glow-bottom-gold` | DS radius + gold bottom glow |
| Inner body | `calm-card border border-border/30 bg-surface-2/95` | Mabra inner card |
| Top ridge | `h-1 gradient accent/50 → accent-ai/50 → accent-secondary/50` | Modal only; optional pulse |
| Title | `font-display-serif text-lg text-accent tracking-wide` | Gold serif headline |
| Close | `p-1.5 rounded-lg bg-surface/50 border border-border/10` | Lucide X; 44px hit area |
| Primary CTA | `bg-accent hover:bg-accent-light text-obsidian-bg rounded-xl` | Single gold action |
| Secondary | `border border-border/20 text-text-muted rounded-xl` | Avbryt ghost |
| Mood slider | `accent-accent` on range | Label + mono badge |
| Energy slider | `accent-accent-ai` on range | Distinct AI accent lane |
| Textarea | `bg-surface/60 border-border/20 focus:border-accent/40` | 3 rows default |
| Guard box | `border-accent/25 bg-surface/40 rounded-xl p-3 text-xs` | Speglar redirect |

**hideHeader recipe (Mabra):** `hideHeader` + `panelClassName="max-w-md border-0 bg-transparent p-0 shadow-none backdrop-blur-none"` — inner card supplies chrome.

**Inline recipe:** `rounded-2xl p-4 sm:p-5` — no top ridge, no overlay portal.

**Z-index:** Portal to `document.body` — must render above FloatingDock and FyrenWidgetBar.
---

## Sizing

| Surface | Width | Radius | Notes |
|---------|-------|--------|-------|
| Standard dialog | `max-w-md` (28rem) | `rounded-3xl` inner | MåBra default |
| Wide confirm | `max-w-lg` | same | Multi-paragraph legal |
| Inline superhub | 100% viewport column | `rounded-2xl` | Chameleon delegate |
| Overlay inset | 16px min margin @ 320px | — | G85 safe |
| Slider track | full width × 1.5px | `rounded-lg` | Native thumb |
| Textarea | full width × 3 rows | `rounded-xl` | resize-none |
| Footer buttons | `px-4 py-2` / `px-5 py-2` | `rounded-xl` | ≥44px touch |

Motorola G85: verify modal never touches viewport edges — parent overlay uses flex center with padding.

Icon close: visual 16px icon inside 44px padded button target.
---

## Spacing

**Modal variant (Mabra overlay):**

- Card padding: `p-6`
- Title row → sliders: `mb-6`
- Slider blocks: `space-y-6` outer, `space-y-2` inner
- Slider endpoint labels: `text-[10px] text-text-dim`, `justify-between`
- Footer: `mt-8`, `gap-3`, `justify-end`

**Inline variant:**

- Card padding: `p-4 sm:p-5`
- Title row → content: `mb-4`
- Footer: `mt-6`

**DS Modal with header:**

- Body offset: `mt-[var(--ds-space-4)]`
- Footer via `ModalFooter`: `mt-[var(--ds-space-5)]`, `gap-[var(--ds-space-2)]`

**Guard panel:** content → buttons `mt-3`, button row `gap-2 flex-wrap`

Spacing aligns with Chapter 16 calm-card — modals do not introduce a parallel scale.
---

## States

| State | Overlay | Body | Primary action |
|-------|---------|------|----------------|
| Closed | unmounted | — | — |
| Open | visible, scroll locked | glass default | enabled |
| Loading | visible | unchanged | disabled, "Sparar…" |
| Guard (Speglar) | visible | status panel | redirect CTAs |
| Inline active | none | in shell | reset after save |
| Error | visible | fields preserved | retry enabled |
| No user | visible/n/a | — | toast login error |

**Speglar guard:** Triggered by `shouldRedirectMabraCoachToSpeglar(notes)` — shows `MABRA_SPEGLAR_GUARD_COPY` with `ButtonLink` to `/hjartat?tab=speglar`.

**Inline post-save:** Reset mood/energy to 5, clear notes — no `onClose` call.

**Scroll lock:** `lockScroll={true}` default; cleanup restores `document.body.style.overflow`.
---

## Examples

**1. MåBra modal from hub**

User opens check-in → overlay fades → calm-card with sliders → Spara → `saveMabraCheckIn` → toast success → modal closes.

**2. Inline on executive home**

`ChameleonLive` target mabra/checkin → `MabraCheckinModal variant="inline"` → save → fields reset, shell stays.

**3. Speglar guard**

User enters ex-conflict phrasing in notes → guard panel → "Gå till Speglar" or stay → no WORM write until resolved path.

**4. DS confirm**

Settings delete → `Modal` with title/description → ModalFooter ghost + accent buttons.

**5. Network failure**

Save throws → toast.error → modal remains open (overlay variant) for retry.

**6. Unauthenticated**

Save without uid → toast.error — no silent fail.
---

## Accessibility

- `role="dialog"`, `aria-modal="true"` on DS panel ref.
- `ariaLabel` required when `hideHeader` — `"Ny MåBra-incheckning"`.
- `aria-labelledby` / `aria-describedby` when DS header title+description used.
- Escape key listener on `window` while open.
- Initial focus: panel or `initialFocusRef` target.
- Scroll lock prevents background drift — announce dialog open to SR via focus move.
- Sliders: `<label>` + visible value badge — not color-only endpoints.
- Guard: `role="status"` on redirect panel.
- Close icon button: needs `aria-label="Stäng"` (audit gap in Mabra — fix in future pass).
- Tab order: sliders → textarea → cancel → save — no focus leak to dock.

Contrast: accent on surface-2/95 meets AA for titles; verify after token changes in Theme Lab.
---

## Animations

| Element | Motion | Reduced motion |
|---------|--------|----------------|
| Overlay | opacity fade, DS duration | instant show |
| Inner card | `shadow-accent-glow-lg transition-all duration-300` | shadow only |
| Top ridge | `animate-pulse` | static gradient |
| Inline embed | none (Chameleon morph owns) | — |
| Primary hover | `hover:shadow-accent-glow` | color only |
| Textarea focus | border/ring transition | no scale |

Chameleon zone morph: 350ms delegate fade — separate from modal open/close.

Do not use Framer spring on modal enter — CSS premium ease maintains calm.
---

## Code Examples

```tsx
import { Modal, Button, ModalFooter } from '@/design-system';
import { MabraCheckinModal } from '@/components/mabra/MabraCheckinModal';

// Standard DS modal
<Modal open={open} onClose={onClose} title="Radera?" description="Kan inte ångras.">
  <ModalFooter>
    <Button variant="ghost" onClick={onClose}>Avbryt</Button>
    <Button variant="accent" onClick={confirm}>Radera</Button>
  </ModalFooter>
</Modal>

// Mabra overlay
<MabraCheckinModal isOpen={open} onClose={() => setOpen(false)} onSaved={refetch} />

// Mabra inline (Chameleon)
<MabraCheckinModal isOpen variant="inline" onClose={() => undefined} onSaved={refetch} />

// Custom panel — hide DS chrome
<Modal
  open={open}
  onClose={onClose}
  hideHeader
  ariaLabel="Bekräfta"
  panelClassName="max-w-md border-0 bg-transparent p-0 shadow-none"
>
  <div className="calm-card p-6">{children}</div>
</Modal>
```

Files: `src/design-system/components/Modal.tsx` · `src/components/mabra/MabraCheckinModal.tsx` · `src/modules/features/dailyLife/wellbeing/mabra/lib/mabraCoachGuard.ts`.
---

## Do

- Import `Modal` from `@/design-system` for all new overlays.
- Use dual variant pattern when UI appears in hub + standalone.
- Pass `ariaLabel` with `hideHeader`.
- Lock scroll on true overlays; release on unmount.
- Use `toast` for async feedback — not second modal.
- Keep primary gold action visually dominant (one per dialog).
- Test 320px + Android keyboard overlap.
- Run smoke:design-modules after modal chrome changes.
---

## Don't

- Stack modals or open modal from modal.
- Use `window.alert`, `window.confirm`, or `prompt`.
- Hardcode `#ffffff` panel backgrounds in features/.
- Remove Escape dismiss without PMIR + a11y review.
- Pulse animate inline superhub cards.
- Put Firestore calls directly in modal JSX — use store/service.
- Neon or saturated outline colors on focus rings.
- Block entire app with modal for non-critical info — use toast/banner.
---

## Future Improvements

- Extract `ExecutiveModalCard` shared shell (Mabra + Valv PIN + Inkast).
- Roving tabindex focus trap for multi-control dialogs.
- Bottom sheet variant for G85 thumb zone (Chapter 30 perf budget).
- Storybook: modal × inline × guard × loading matrix.
- Migrate legacy hub dialogs to DS portal pattern.
- Add explicit `aria-label` on Mabra close control.
- Document z-index token `--ds-z-modal` above dock/Fyren layers.
- Capacity-aware: auto inline when low home capacity detected.
---
