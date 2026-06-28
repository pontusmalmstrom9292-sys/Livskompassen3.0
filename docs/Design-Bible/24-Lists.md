# Chapter 24 — Lists

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [23-Modals.md](./23-Modals.md)  
> **Next chapter:** [25-Journal.md](./25-Journal.md)


---

## Purpose

This chapter specifies **list and row patterns** in Executive Midnight — vertical module stacks, cluster grids, review queues, planning quick lists, and settings rows.

Lists carry navigation density without spreadsheet aesthetics. They are the connective tissue between zones on discovery surfaces and task views inside Supermodules.

| Pattern | CSS / component | Primary use |
|---------|-----------------|-------------|
| Module stack | `.module-list` + `.module-card` | ClusterGrid zone discovery |
| Adaptive grid | `.adaptive-card-grid` | Home memory suggestions |
| Review queue | `.review-queue-status--*` | Inkast / DCAP routing |
| Quick list | `PlaneringQuickListPanel` | Local inköpslista |
| Settings rows | midnight flat groups | Executive preferences |

Reference: `src/modules/core/ui/ClusterGrid.tsx` · `src/index.css` module-card block · `PlaneringQuickListDelegate`.
---

## Philosophy

Lists are **calm scroll islands**, not infinite social feeds.

1. **Single column first** — `flex flex-col gap-3`; two columns only for adaptive cards at `sm+`.
2. **Rows breathe** — card padding p-4, gap-3 between cards; never tight 4px stacks.
3. **Tone without rainbow** — gold/indigo/lavender/emerald via `color-mix` borders at ~28% — not solid fills.
4. **Secondary nav as chips** — child routes as `module-chip` pills; parent card remains one tap target.
5. **Explicit empty states** — `EmptyState` when length zero; explain local vs cloud scope.

Avoid zebra tables, sortable grid headers, and KPI list tiles — Livskompassen is not a SaaS dashboard (DAD).
---

## Visual Rules

**module-list container**

```css
.module-list { flex flex-col gap-3; }
```

**module-card row**

| Part | Class | Visual |
|------|-------|--------|
| Card | `.module-card` | slate glass rgba(15,23,42,0.55), rounded-2xl, p-4 |
| Hover | `.module-card:hover` | bg 0.72, border-white/15 |
| Head | `.module-card__head` | flex, icon + text + chevron |
| Icon | `.module-card__icon` | tone-tinted circle background |
| Title | `.module-card__title` | semibold text |
| Desc | `.module-card__desc` | text-text-muted text-sm |
| Chevron | `.module-card__chevron` | right affordance, aria-hidden |
| Chips | `.module-card__modules` | flex wrap chip row |

**Tone modifiers:** `module-card--gold|indigo|lavender|emerald` tint icon well only — not full card fill.

**adaptive-card:** 0.5px border, tone mix background 6%, hover border accent 32%.

**review-queue-status:** pill uppercase tracking — routed (gold), review (indigo), rejected (danger mix).
### module-chip detail

Chips use `.module-chip` — compact secondary navigation. They must:

- Stop click propagation so the parent `Link` card does not navigate when chip tapped.
- Use short Swedish labels (Dagbok, Speglar, Ekonomi).
- Maintain readable contrast on slate card background.

### review-queue-status mapping

| Modifier | Meaning | Copy example |
|----------|---------|--------------|
| `--routed` | DCAP routed successfully | "Routed" |
| `--review` | Needs human review | "Review" |
| `--rejected` | Rejected / blocked | "Rejected" |

Use in Inkast and Planering inkast delegate surfaces — paired with row title, not alone.

### adaptive-card tones

Home memory cards use tone classes aligned with zone psychology:

- `--gold` — reflection / Valv-adjacent memory
- `--indigo` — boundaries / Hamn
- `--lavender` — AI / MåBra adjacent
- `--emerald` — Vardagen rhythm

Background mix stays ≤8% accent — border carries most tone signal.
---

## Sizing

| Token | Value |
|-------|-------|
| module-list gap | 12px (`gap-3`) |
| module-card radius | `rounded-2xl` (1rem) |
| module-card padding | 16px (`p-4`) |
| Lucide icon | 20px (`h-5 w-5`), stroke 1.75 |
| adaptive grid | 1 col → sm:2 col, gap-3 |
| scroll island max | min(70vh, 640px) planering |
| chip height | ~32px with padding |
| review pill | text-[10px], px-2 py-0.5 |

Minimum 44px touch on chips and checkbox rows in quick lists.
---

## Spacing

- ClusterGrid: outer section uses `module-list` only — parent hub supplies horizontal padding.
- module-card: internal head gap-3; chip row separated by CSS margin on `__modules`.
- adaptive-card-grid: uniform gap-3 — do not mix gap-4 in same grid.
- PlaneringQuickListDelegate: `space-y-3` header block → panel.
- Supermodule lists: wrap in `calm-scroll-island overflow-y-auto pr-1` for scrollbar gutter.
- Executive settings nested lists: `p-1` group wrapper, rows inside midnight card (Chapter 16).

Vertical rhythm matches home `space-y-4` between major sections — lists inside sections use tighter gap-3.
---

## States

| State | module-card | adaptive-card | review-queue | quick list |
|-------|-------------|---------------|--------------|------------|
| Default | glass bg | tone border | — | unchecked rows |
| Hover | brighter bg | accent border | — | row highlight |
| Active link | Next.js route active optional | — | — | — |
| Routed | — | — | gold pill | — |
| Review | — | — | indigo pill | — |
| Rejected | — | — | danger pill | — |
| Empty | — | — | — | EmptyState + CTA |
| Disabled | opacity-50 | same | — | — |

Planning quick list persists in localStorage — empty state copy must say device-local scope.
---

## Examples

**ClusterGrid:** Theme Lab / discovery — Hjärtat (gold), Hamnen (indigo), Familjen (lavender), Vardagen (emerald), Måbra (lavender) with child chips (Dagbok, Speglar, Ekonomi…).

**Planering inköpslista:** Delegate header eyebrow + `PlaneringQuickListPanel` checkboxes — not Firestore until export.

**AdaptiveMemoryCards:** Home suggestions in two-column adaptive grid with tone variants.

**Inkast review queue:** Rows with status pill — user sees routed vs needs review before promote.

**HubLab / ThemeLab:** Pages wrap content in `module-list theme-lab-page` for consistent vertical rhythm.
### Theme Lab module-list

`ThemeLabPage`, `HubLabPage`, and `BrusfiltretSupermoduleLabPage` wrap previews in:

```tsx
<div className="module-list theme-lab-page">
```

This ensures lab previews match production list rhythm — always test list changes here first.

### ExecutiveSettingsList pattern

Settings uses flat midnight rows inside grouped `calm-card-midnight` — functionally a list but visually flatter than module-card. Do not apply module-card hover lift on settings destructive rows.

### Journal arkiv read-only list

`DagbokArkivDelegate` renders chronological entries — use calm-scroll-island, EmptyState when no entries, and avoid pagination controls that look like data tables.
---

## Accessibility

- Section: `aria-label="Moduler och kluster"` on ClusterGrid wrapper.
- Parent module-card is `<Link>` — entire row navigates; chips use `stopPropagation`.
- Chevron decorative: `aria-hidden="true"`.
- Review pills: textual status inside — not color-only.
- Nested scroll: max 2 scroll islands deep; keyboard scroll must work.
- Quick list: native checkbox + `<label>` association.
- List length changes: consider live region for async loads (arkiv/journal lists).

Focus visible on chips and card links — accent outline token.
---

## Animations

- module-card: `transition-colors` on bg/border — no height animation.
- adaptive-card: border-color transition on hover.
- No stagger on module-list length >5 — executive home stagger is separate (Chapter 27).
- review-queue: static pills — no blink.
- Theme Lab: optional entrance fade disabled under `prefers-reduced-motion`.

List reorder (future drag): if added, use transform not layout thrashing.
---

## Code Examples

```tsx
import { ClusterGrid } from '@/core/ui/ClusterGrid';
import { PlaneringQuickListDelegate } from '@/features/admin/planning/supermodule/delegates/PlaneringQuickListDelegate';

// Zone module list
<section className="module-list" aria-label="Moduler och kluster">
  {clusters.map((c) => (
    <Link key={c.to} to={c.to} className={`module-card module-card--${c.tone}`}>
      <div className="module-card__head">...</div>
      <div className="module-card__modules">
        {c.modules.map((m) => (
          <Link key={m.label} to={m.to} className="module-chip" onClick={(e) => e.stopPropagation()}>
            {m.label}
          </Link>
        ))}
      </div>
    </Link>
  ))}
</section>

// Scrollable supermodule list
<div className="calm-scroll-island max-h-[min(70vh,640px)] overflow-y-auto pr-1">
  <PlaneringQuickListDelegate />
</div>
```

CSS: `src/index.css` lines ~5216–5340 · `ClusterGrid.tsx`.
```tsx
// Tone map from ClusterGrid
const toneClass: Record<Cluster['tone'], string> = {
  gold: 'module-card--gold',
  indigo: 'module-card--indigo',
  lavender: 'module-card--lavender',
  emerald: 'module-card--emerald',
};

// Review queue pill
<span className="review-queue-status review-queue-status--review">Granska</span>

// Adaptive home grid
<div className="adaptive-card-grid">
  <article className="adaptive-card adaptive-card--gold p-4">
    <h3 className="text-sm font-medium text-text">Minneskort</h3>
    <p className="mt-1 text-xs text-text-dim">Förslag baserat på senaste dagar.</p>
  </article>
</div>
```

Related smoke: `npm run smoke:design-modules` validates module surfaces on build.
---

## Do

- Wrap vertical card-rows in `.module-list`.
- Apply tone modifiers consistently with zone semantics (gold=Hjärtat/Valv).
- Use `calm-scroll-island` for long delegate lists.
- Show EmptyState with actionable copy when list empty.
- Keep chip labels ≤2 words where possible.
- Document local-only scope in planning list headers.
- Filter Valv/bevis chips when `HIDE_BEVIS_TAB` flag active.
---

## Don't

- Render 30+ budget rows flat (capacity gate).
- Use HTML `<table>` for hub navigation modules.
- Mix gap-3 list with gap-6 children without hierarchy reason.
- Auto-sync quick list to Firestore silently.
- Horizontal swipe carousels for primary hub nav.
- Saturated background fills on module-card — tint icon well only.
- Remove chevron affordance without replacement wayfinding cue.
---

## Future Improvements

- Promote `ModuleCard` to `@/design-system` with typed `tone` prop.
- Virtualize journal arkiv lists >100 entries.
- Unified `ListRow` for settings + inkast + planering.
- Token `--surface-module` for rgba(15,23,42,0.55) bg.
- smoke:design-modules contrast snapshot for module-card on executive bg.
- Drag reorder for planning tasks (Kanban gate required).
- Skeleton rows using `HubPanelSkeleton` pattern.
- Document `module-chip` in design-system with keyboard focus ring parity to `module-card`.
- Add list density token (`comfortable` vs `compact`) for arkiv at user request.
- Inkast queue unified list component shared between Valv and Planering delegates.
- Hem v3 discovery rail reusing ClusterGrid data with executive midnight chrome.
---
