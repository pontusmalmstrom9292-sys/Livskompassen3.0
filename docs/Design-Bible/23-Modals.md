# Chapter 23 — Modals

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [22-Sheets.md](./22-Sheets.md)  
> **Next chapter:** [24-Lists.md](./24-Lists.md)

---

## Purpose

This chapter defines **modal and confirmation surfaces** in Executive Midnight — centered dialogs, confirm sheets, inline WORM gates, and crisis-safe overlays. Modals must offload cognition (**one decision at a time**) without feeling like generic SaaS alerts.

Coverage:

- **`Modal`** and **`Sheet`** primitives from `@/design-system`
- **`MabraCheckinModal`** — reference pattern for content-rich modals
- **Confirm dialogs** — WORM, inbox preview, HITL approval
- **Crisis-safe modals** — low-affect copy, no guilt, clear exits

Primary files: `src/design-system/components/Modal.tsx`, `Sheet.tsx`, `src/components/mabra/MabraCheckinModal.tsx`.

---

## Philosophy

| Principle | Executive Midnight expression |
|-----------|-------------------------------|
| Calm | Dark glass surface, gold accents sparingly, no blinking animation |
| Clarity | Primary action bottom-right; secondary «Avbryt» always visible |
| Safety | WORM and crisis require explicit confirm — never auto-submit |
| Progressive disclosure | `variant="inline"` when overlay is unnecessary (Superhub) |
| Zero Footprint | Crisis and SOS flows do not auto-save sensitive text |

Modals should feel like a **private moment inside the app**, not a system error.

Use `Modal` for focused cards, `Sheet placement="center"` for confirm-with-preview, and inline regions (`WormSaveConfirmSheet`) for WORM — never stack nested modals.

---

## Visual Rules

### Design-system Modal

Centered dialog with portal, Escape dismiss, scroll lock, and focus trap.

| Part | Class / token | Role |
|------|---------------|------|
| Backdrop | `ds-overlay`, `ds-overlay--center` | Dim + blur |
| Panel | `ds-modal-panel`, `ds-card` | Glass card body |
| Accent | `glow-bottom-gold` | Executive gold under-glow |
| Custom card | `panelClassName` override | MabraCheckinModal transparent wrapper |

Required behaviors:

- `role="dialog"` + `aria-modal="true"`
- Escape closes (disabled when `busy`)
- Backdrop mousedown closes
- `lockScroll` default `true`

### Design-system Sheet (confirm variant)

Bottom sheet on mobile; centered panel on `sm+`. Use for **confirm with preview** — more content than a simple alert.

Placements: `sheet` (default) · `center` (confirm/preview)  
Sizes: `default` · `tall` (editors, max 85vh)

### Inline WORM confirm

**File:** `src/modules/core/security/WormSaveConfirmSheet.tsx`

- `role="region"` + `aria-label="Bekräfta oföränderligt bevis"`
- Shield icon + short WORM copy
- Primary: «Ja — lås som bevis» · Secondary: «Avbryt»
- Used in `VaultEntryForm` before `reality_vault` write

### MabraCheckinModal structure

1. Gradient top band (modal only) — subtle pulse, accent → accent-ai
2. Title — `font-display-serif text-lg text-accent`
3. Sliders — Mood (accent) + Energy (accent-ai), 1–10, mono badge
4. Optional textarea — placeholder without guilt language
5. Speglar guard — inline status region, not modal-in-modal
6. Footer — Avbryt (modal only) + Spara (accent CTA)

Surface tokens:

```tsx
className="relative w-full overflow-hidden calm-card border border-border/30 bg-surface-2/95"
// modal: max-w-md rounded-3xl p-6 shadow-accent-glow-lg
// inline: rounded-2xl p-4 sm:p-5
```

### Crisis-safe visual language

**AkutLanding** (`AkutLanding.tsx`): low-affect full-screen panel — not screaming red modal.

- Centered `max-w-sm` card: `border-border-strong bg-surface/40`
- Title in `text-accent` — copy from `AKUT_LANDING_COPY`
- Two buttons: `ds-btn--secondary` + `ds-btn--ghost`
- No auto-logging of crisis content

SOS (`SosMainTrigger`): muted palette, clear numbers (113, 1177), always «Stäng» / «Jag mår bättre». No gamification.

---

## Sizing

| Element | Spec |
|---------|------|
| MabraCheckinModal max-width | `max-w-md` (~28rem) |
| AkutLanding card | `max-w-sm` |
| Sheet confirm max-width | `28rem` default · `42rem` tall |
| Sheet tall max-height | `85vh` |
| Touch targets (crisis) | Min 44px height |
| Modal z-index | `var(--ds-z-modal)` |
| Inline WORM region | Full card width inside form |

---

## Spacing

| Area | Rule |
|------|------|
| Modal panel padding | `p-6` (Mabra) · `var(--ds-space-5)` (DS default) |
| Inline variant padding | `p-4 sm:p-5` |
| Slider stack | `space-y-4` between mood/energy |
| Footer actions | `gap-2` flex; primary right on desktop |
| Guard status block | `mt-4` below textarea |
| WORM inline confirm | `space-y-3` icon + copy + buttons |
| Overlay padding | `var(--ds-space-4)` on centered sheets |

---

## States

### Modal

| State | Behavior |
|-------|----------|
| Closed | `open={false}` — null render |
| Open | Focus to panel; body scroll locked |
| Busy | Escape disabled; buttons show spinner |
| hideHeader | Requires `ariaLabel` for accessible name |
| Dismiss | Escape, backdrop click, explicit Avbryt |

### MabraCheckinModal variants

| Variant | Overlay | Use |
|---------|---------|-----|
| `modal` (default) | Yes — `Modal` wrapper | Standalone check-in from MåBra/home |
| `inline` | No — `calm-card` direct | Superhub / ChameleonLive embed |

### Speglar guard (in-modal routing)

When `shouldRedirectMabraCoachToSpeglar(notes)` → status block with `MABRA_SPEGLAR_GUARD_COPY.message`, `ButtonLink` → `/hjartat?tab=speglar`, ghost «Stanna i MåBra». Informative — not blocking.

### Confirm dialog catalog

| Pattern | Component | Context |
|---------|-----------|---------|
| WORM confirm | `WormSaveConfirmSheet` | Valv — reality_vault append-only |
| Inbox preview | `InkorgPreviewSheet` | Planering — paste → Kanban |
| HITL approve | `UnifiedHitlPreview` | Inkast — human in the loop |
| Device clear | `window.confirm` | `ClearDevicePanel` — legacy exception |
| Dossier export | `window.confirm` | `DossierPage` — avoid in new code |

InkorgPreviewSheet: confirm disabled when `routeToHamn` — prevents wrong silo.

### Crisis states

| State | Behavior |
|-------|----------|
| SOS active | `useSOSStore` — header LifeBuoy trigger |
| Akut landing | Full-screen calm card; no auto-save |
| Mabra error | Neutral toast — short copy |

---

## Examples

### Example A — MabraCheckinModal (modal variant)

```tsx
<Modal
  open={isOpen}
  onClose={onClose}
  ariaLabel="Ny MåBra-incheckning"
  hideHeader
  panelClassName="max-w-md border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
>
  <MabraCheckinCard variant="modal" onSave={handleSave} onClose={onClose} />
</Modal>
```

### Example B — InkorgPreviewSheet confirm

```tsx
<Sheet
  open={open}
  onClose={onCancel}
  title="Granska innan spar"
  description="Ett steg i taget — du bekräftar innan Handling uppdateras."
  placement="center"
>
  <dl>{/* preview: title, column, date, routing badge */}</dl>
  <SheetFooter>
    <Button variant="ghost" onClick={onCancel}>Avbryt</Button>
    <Button variant="accent" disabled={routeToHamn} onClick={onConfirm}>
      Skapa uppgift
    </Button>
  </SheetFooter>
</Sheet>
```

### Example C — WormSaveConfirmSheet (inline)

```tsx
<WormSaveConfirmSheet
  open={showConfirm}
  onConfirm={handleWormSave}
  onCancel={() => setShowConfirm(false)}
  busy={saving}
/>
```

### Example D — Inline Mabra on executive home

```tsx
<MabraCheckinModal variant="inline" onSave={handleSave} />
```

No overlay — card sits inside Superhub panel with same slider UX.

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Dialog name | `ariaLabel` when `hideHeader={true}` |
| Focus | Panel `tabIndex={-1}`; focus on open |
| Sliders | Visual label + numeric value badge |
| Guard region | `role="status"` for dynamic Speglar redirect message |
| Contrast | AA on `text-text-muted` vs `bg-surface-2/95` |
| Crisis | Large touch targets; no color-only warnings |
| Busy state | `aria-busy` on saving buttons where applicable |
| Escape | Always available except explicit `busy` lock |

---

## Animations

| Surface | Animation | Spec |
|---------|-----------|------|
| Modal overlay | `ds-overlay-in` | `var(--ds-duration-normal)`, `--ds-ease-enter` |
| Modal panel | premium-polish entrance | subtle fade/translate |
| Mabra gradient band | subtle pulse | accent → accent-ai; disabled in crisis |
| Reduced motion | `prefers-reduced-motion` | No pulsing gradient on crisis screens |
| Inline Mabra | none on wrapper | Chameleon morph handled by parent |

No bouncy springs. No blinking red on AkutLanding or SOS.

---

## Code Examples

### Modal primitive usage

```tsx
<Modal
  open={isOpen}
  onClose={onClose}
  ariaLabel="Ny MåBra-incheckning"
  hideHeader
  panelClassName="max-w-md border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
>
  {card}
</Modal>
```

### Sheet confirm pattern

```tsx
<Sheet
  open={open}
  onClose={onCancel}
  title="Granska innan spar"
  description="Ett steg i taget — du bekräftar innan Handling uppdateras."
  placement="center"
>
  {/* preview body */}
  <SheetFooter>...</SheetFooter>
</Sheet>
```

### CSS tokens

| Token / class | Usage |
|---------------|-------|
| `ds-overlay`, `ds-overlay--center` | Modal backdrop |
| `ds-overlay--sheet` | Sheet backdrop |
| `ds-modal-panel`, `ds-sheet-panel` | Panel surfaces |
| `glow-bottom-gold` | Executive accent under-edge |
| `calm-card` | Content card inside modal |
| `shadow-accent-glow-lg` | Mabra modal elevation |
| `--ds-space-*` | Modal footer spacing |

### New confirm dialog rules

1. Use `Sheet placement="center"` or `Modal` — **not** `window.confirm`
2. Primary button describes action («Skapa uppgift», «Ja — lås som bevis»)
3. Show consequence in `description` or body — not just «Är du säker?»
4. `busy`/`saving` → spinner + disabled buttons
5. WORM/crisis: secondary «Avbryt» always reachable

---

## Do

- Reuse `Modal` / `Sheet` from `@/design-system`
- Follow MabraCheckinModal for slider + optional note pattern
- Use inline confirm for WORM (`WormSaveConfirmSheet`)
- Crisis-safe: calm copy, clear exit, no auto-save of sensitive text
- Respect Speglar guard routing for conflict/gaslighting content
- Provide `ariaLabel` when header hidden

---

## Don't

- Build custom overlay divs outside the design system
- Use `window.confirm` in new production code
- Route to Speglar via modal without guard copy
- Auto-close modal after WORM save — user must understand lock
- Use neon/red crisis aesthetics
- Stack nested modals
- Force scroll to find Avbryt under stress

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Unified confirm API** | Single `ConfirmSheet` wrapper for Inkorg + WORM + HITL |
| **Focus return** | Explicit focus restore to trigger element on close |
| **Replace legacy confirm** | Migrate `ClearDevicePanel` and `DossierPage` off `window.confirm` |
