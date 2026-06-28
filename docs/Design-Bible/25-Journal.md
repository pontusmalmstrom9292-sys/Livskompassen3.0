# Chapter 25 — Journal

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [24-Lists.md](./24-Lists.md)  
> **Next chapter:** [26-Planning.md](./26-Planning.md)


---

## Purpose

This chapter documents **journal and diary input surfaces** — `DagbokInputSuperModule`, Chameleon delegates, WORM write paths, and capacity-aware mode gating.

Journal UI lives in **Hjärtat** (`/hjartat`). It must feel like a private writing desk: gold bento shell, forensic typography, morphing delegates — not a notes-app sidebar or Notion clone.

| Artifact | Path | Role |
|----------|------|------|
| Supermodule router | `DagbokInputSuperModule.tsx` | URL mode + picker |
| Mode registry | `dagbokInputModes.ts` | labels, write targets |
| Morph shell | `ChameleonInputShell` | 350ms delegate swap |
| Home embed | `ChameleonLive` DagbokDelegate | lazy delegates |
| Routes | `DagbokInputRoutes.tsx` | hub wiring |

All journal WORM writes go through delegates — never from the router file.
---

## Philosophy

Superdagbok implements **Chameleon UI** (chameleon-ui-modularity.mdc):

- One `BentoCard` shell, many modes via `?inputMode=`.
- User picks *what* to do; UI morphs tools — not separate pages per micro-feature.
- **Low capacity → tyst mode** — dissociation-safe minimal UI (`isLowHomeCapacity`).
- **Zero Footprint burn** — vent without persistence.
- **Speglar bridge** — emotional validation path adjacent, not mixed into WORM ledger voice.

| Mode | Label | writeTarget |
|------|-------|-------------|
| reflektion | Reflektera | journal_worm |
| quick_mirror | Snabb spegling | journal_worm + mirror |
| arkiv | Minneslista | read_only |
| burn | Bränn | none |
| tyst | Tyst läge | journal_worm minimal |

Max 4–6 visible picker modes; hide heavy modes under capacity gate.
---

## Visual Rules

| Region | Classes | Notes |
|--------|---------|-------|
| Shell | `BentoCard glow="gold" depth bare hjartat-tab-panel !p-4 sm:!p-5` | noHover |
| Tyst modifier | `dagbok-hub--tyst` on shell | reduces chrome |
| Eyebrow | `valv-forensic-eyebrow` | "Hjärtat" |
| Title | `valv-forensic-title` | active mode label |
| Lead | `valv-forensic-lead` | mode description; hidden tyst |
| Remember | `DagbokRememberCard` | tips; hidden tyst |
| Picker | `DagbokInputModePicker` | hides arkiv if low capacity |
| Speglar link | `ds-btn ds-btn--secondary text-xs hover:scale-105` | `/hjartat?tab=speglar` |
| Viewport | `ChameleonInputShell max-h-[min(75vh,720px)] overflow-y-auto pr-1` | scroll island |

Executive Chameleon uses `chameleon-shell__exec-*` classes — same delegates, different skin (Chapter 27).
### DagbokInputModePicker

Picker renders mode pills from `DAGBOK_INPUT_MODES` filtered by tier and `hiddenModes`. Active pill matches Planering supermodule language: gold border, surface-3 fill.

### Chameleon executive skin

When embedded in home `ChameleonLive`:

- Zone nav uses `chameleon-shell__zone-btn--exec`
- Mode row uses `chameleon-shell__exec-mode-pill`
- Viewport uses `chameleon-shell__delegate-viewport--exec`

Delegates are identical to hub — skin only differs.

### valv-forensic typography

Journal header reuses Valv forensic stack for zone consistency:

- Eyebrow: small caps feel, muted gold
- Title: mode label, display serif
- Lead: one sentence max — omitted in tyst to reduce cognitive noise
---

## Sizing

| Element | Spec |
|---------|------|
| Shell padding | 16px mobile / 20px sm+ |
| Header gap | gap-3 flex-wrap |
| Picker pills | min 44px touch height |
| Viewport max | 75vh cap 720px |
| Reflektion textarea | multi-step wizard — delegate owned |
| Tyst inputs | ultra-compact — 1–3 fields |
| Speglar btn | text-xs, inline with picker |

Full width within hjartat tab — no side-by-side journal columns on mobile.
---

## Spacing

- Header: `mb-4 flex flex-wrap items-start justify-between gap-3`
- Picker row: `mb-4 flex flex-wrap items-center gap-2` (normal); tyst: `mb-3` only picker
- ChameleonInputShell: delegate owns internal spacing
- Remember card: sits in header right column on wide screens; wraps on narrow
- Mode picker hidden modes: passed via `hiddenModes` prop — layout collapses cleanly

Match Planering supermodule vertical rhythm for cross-zone consistency (Chapter 26).
---

## States

| State | Behaviour |
|-------|-----------|
| reflektion | Full wizard delegate |
| quick_mirror | Short entry + mirror callable |
| arkiv | Read-only list |
| burn | Destroy path, no WORM |
| tyst | Minimal mood/words/burn hatch |
| lowCapacity | Default tyst if no inputMode param |
| capacity URL | `?capacity=` / `?tyst=` override parsing |
| morph | shell fading during mode change |
| saving | delegate-level; toast on success |

URL: `setSearchParams(..., { replace: true })` — no history spam on mode toggle.
### URL parameter reference

| Param | Effect |
|-------|--------|
| `inputMode=reflektion` | default wizard |
| `inputMode=quick_mirror` | snabb spegling |
| `inputMode=arkiv` | read list |
| `inputMode=burn` | vent |
| `inputMode=tyst` | minimal |
| `capacity=` / `tyst=` | forced capacity modes via parser |

Deleting param when mode equals `DEFAULT_DAGBOK_INPUT_MODE` keeps URLs clean.

### Delegate write contracts

Each delegate respects `writeTarget` from metadata — shell never bypasses. Burn and read_only modes must not invoke journal WORM callables.
---

## Examples

**Full hub:** `/hjartat` dagbok tab → supermodule with picker + Speglar + morph delegate.

**Home Chameleon:** Zone Hjärtat → Reflektera/Snabb/Arkiv pills → lazy delegate in exec viewport.

**Tyst under stress:** Low capacity score → auto tyst → arkiv hidden from picker.

**Burn session:** User vents → Zero Footprint — no journal_worm write.

**Quick mirror:** One-line feeling + optional mirror invoke after save.

**Remember card:** Contextual tip changes per `activeMode` metadata.
### Route wiring

`DagbokInputRoutes.tsx` mounts supermodule inside Hjärtat tab shell — not a standalone page route.

### Home lazy delegates

```tsx
const DagbokReflektionDelegate = lazy(() =>
  import('.../DagbokReflektionDelegate').then((m) => ({ default: m.DagbokReflektionDelegate }))
);
```

Suspense fallback: `chameleon-shell__hint` — "Laddar läge…"

### Speglar bridge

Secondary button beside picker — does not change inputMode; navigates to Speglar tab for AI validation path.
---

## Accessibility

- Picker: pressed/selected state exposed to AT via picker component semantics.
- Tyst: minimal copy but save button retains accessible name.
- Speglar link: `title` tooltip for extra context.
- Morph: focus container stable — avoid focus loss on delegate swap.
- Burn: confirm destructive action with readable text — not icon-only.
- Scroll viewport keyboard accessible.

Forensic title uses display serif — ensure size ≥16px effective for headings.
### Capacity and tyst

When auto-switching to tyst, do not move focus unexpectedly — user may still be navigating picker. Prefer subtle mode change announcement via live region (future).

### Burn confirmation

Destructive Zero Footprint actions require confirm control with readable label — not swipe-only on mobile.
---

## Animations

- ChameleonInputShell / useChameleonMorph: ~350ms opacity on delegate viewport.
- Picker active: `transition-colors`, gold border accent/40.
- Speglar bridge: `hover:scale-105` — disable reduced motion.
- No route transition animation — query param replace only.
- BentoCard: noHover on shell — static gold glow.

Do not animate journal text fields with bounce or shake on validation.
---

## Code Examples

```tsx
import { DagbokInputSuperModule } from '@/features/lifeJournal/diary/supermodule/DagbokInputSuperModule';
import { ChameleonInputShell } from '@/core/ui/ChameleonInputShell';
import {
  getDagbokInputModeMeta,
  parseDagbokInputMode,
  DEFAULT_DAGBOK_INPUT_MODE,
} from './dagbokInputModes';

<DagbokInputSuperModule onSaved={(mode) => analytics(mode)} />

<ChameleonInputShell mode={visibleMode} viewportClassName="max-h-[min(75vh,720px)] overflow-y-auto pr-1">
  {(mode) => (
    <DagbokInputModeDelegate
      mode={mode}
      onSaved={handleSave}
      onSwitchMode={setActiveMode}
    />
  )}
</ChameleonInputShell>

const meta = getDagbokInputModeMeta('reflektion');
// meta.writeTarget === 'journal_worm'
```

Delegates: `supermodule/delegates/DagbokReflektionDelegate.tsx` etc.
---

## Do

- Route new dagbok input through supermodule or Chameleon delegates.
- Respect `writeTarget` in mode metadata — WORM only via approved paths.
- Hide arkiv when `lowCapacity` — use picker `hiddenModes`.
- Use valv-forensic typography in Hjärtat headers.
- Lazy-load delegates in home Chameleon (Suspense fallback hint).
- Keep router file free of Firestore imports.
- Link Speglar for emotional validation — not inline therapy copy.
---

## Don't

- Create new `/dagbok/*` routes outside 3-zone `/hjartat`.
- Client-write journal from supermodule router file.
- Force full reflektion wizard when capacity says tyst.
- Cross-RAG journal snippets into Kunskap UI.
- Remove mabraCoachGuard Speglar redirects without review.
- Add 7+ primary picker modes without progressive disclosure.
- Store burn draft text in localStorage.
---

## Future Improvements

- Single morph tab merging journal + Speglar adjacent panel.
- Voice delegate prioritized for tyst mode.
- Storybook matrix: 5 modes × low/high capacity.
- Offline reflektion queue with WORM conflict rules.
- Time-of-day mode suggestion (AM reflektion, PM burn affordance).
- smoke:superdagbok_superhub in CI for delegate regressions.
- Remember card content from curated REFLECTION bank only.
- Wire `DagbokRememberCard` tips to curated REFLECTION bank entries by mode id.
- Journal arkiv virtual scroll with date group headers (forensic style).
- Unified `?inputMode=` deep links from home snabbstart widgets.
- Cross-link Chapter 23 inline modal patterns for any future journal popup flows.
---
