# Chapter 24 — Lists

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [23-Modals.md](./23-Modals.md)  
> **Next chapter:** [25-Journal.md](./25-Journal.md)

---

## Purpose

This chapter defines **list and scroll patterns** in Executive Midnight — how modules, entries, and history are organized without scroll-in-scroll chaos.

Coverage:

- **`module-list`** — vertical module clusters (home, resources)
- **`glass-card` rows** — glass rows in lists and panels
- **`calm-scroll-island`** — single scroll surface per hub view

Primary files: `src/index.css`, `src/styles/obsidian-calm-2.css`, `src/modules/core/ui/ClusterGrid.tsx`.

---

## Philosophy

| Principle | Meaning |
|-----------|---------|
| One scroll | Hub view = one `calm-scroll-island`; avoid nested overflow |
| Glass depth | Rows have subtle border + surface-2 — not flat `<div>` |
| Progressive disclosure | Cluster → chips → detail (ClusterGrid) |
| Touch-first | Min 44px height on clickable rows (G85) |
| Calm density | `gap-3` in module-list; `space-y-2` in entry lists |

Lists carry navigation and history — they must feel **weightless** at low capacity (`capacity-low`).

---

## Visual Rules

### module-list

**File:** `src/index.css`

```css
.module-list {
  @apply flex flex-col gap-3;
}
```

Container for **module clusters** — not WORM logs or Kanban columns.

### ClusterGrid reference

**File:** `src/modules/core/ui/ClusterGrid.tsx`

```tsx
<section className="module-list" aria-label="Moduler och kluster">
  {visibleClusters.map((cluster) => (
    <ModuleCard key={cluster.to} {...cluster} />
  ))}
</section>
```

**ModuleCard** (`module-card`):

- `rounded-2xl border border-white/10 p-4`
- Background: `rgba(15, 23, 42, 0.55)` → hover `0.72`
- Head: icon (40×40) + title + desc + chevron
- Footer: `module-card__modules` with `module-chip` pills

**Module chips:**

```css
.module-chip {
  @apply rounded-full border border-white/10 px-3 py-1 text-xs;
  background: rgba(2, 6, 23, 0.45);
}
.module-chip:hover {
  @apply border-accent/30 text-accent;
  background: rgba(212, 175, 55, 0.08);
}
```

Tone classes (`toneClass[tone]`) add subtle silo color (gold/indigo/lavender/emerald) — sparingly per DAD.

### glass-card rows

**File:** `src/styles/obsidian-calm-2.css`

```css
.glass-card {
  @apply relative overflow-hidden rounded-3xl border border-border/30 bg-surface-2/60 backdrop-blur-xl;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
```

Glow variants: `glow-bottom-gold`, `glow-bottom-blue`, `glow-bottom-green`.

Compact list row (light glass):

```tsx
<li className="rounded-lg border border-border-strong/60 bg-surface-2/40 px-3 py-2 text-sm">
```

Reference: `VitEntryList.tsx` — emotional memory history.

### calm-scroll-island

```css
.calm-scroll-island {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
```

App-shell unifies blur inside lists:

```css
.app-shell .module-list .glass-card,
.app-shell .calm-card {
  background: color-mix(in srgb, var(--surface-2) 60%, transparent);
  backdrop-filter: blur(24px);
}
```

**Rule:** Clickable whole row → `glass-card` or `module-card`. List entry → lighter border row.

### Executive home rows

`exec-planering-task-row`, `exec-home-card` — specialized rows with gold chevron and icon wrap. Same glass logic: border accent/15, hover translateY(-1px) sparingly.

---

## Sizing

| Element | Spec |
|---------|------|
| Module icon | 40×40 px |
| Module card radius | `rounded-2xl` |
| Glass card radius | `rounded-3xl` |
| Compact row radius | `rounded-lg` |
| Chip height | ~32px (`py-1` + text-xs) |
| VitEntryList max-height | `max-h-80` (prop) |
| PlaneringInputSuperModule island | `min(70vh, 640px)` |
| Touch row min-height | 44px (G85) |

---

## Spacing

| Area | Rule |
|------|------|
| module-list gap | `gap-3` (12px) |
| Entry list vertical | `space-y-2` |
| Module card padding | `p-4` |
| Compact row padding | `px-3 py-2` |
| Chip padding | `px-3 py-1` |
| Hub island content | `space-y-4` via HubPageShell |
| Cluster footer chips | `gap-2` flex wrap |

---

## States

### Scroll island

| State | Behavior |
|-------|----------|
| Default | Single vertical scroll; `overscroll-behavior: contain` |
| hub-view-lock--fit | `max-height: none` on island |
| Nested forbidden | No second `overflow-y-auto` inside island |
| Empty list | `text-text-dim` message — never blank void |

### HubPageShell integration

When `lockViewport={true}` and `contentIsland !== false`:

```tsx
<div className="calm-scroll-island space-y-4">{children}</div>
```

Paired with `hub-view-lock` + `hub-view-lock--fit` for mobile one-viewport.

### capacity-low list reduction

When `app-shell` has `capacity-low`:

```css
.capacity-low .glass-card,
.capacity-low .calm-card,
.capacity-low .bento-card {
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.capacity-low .glow-bottom-gold::after { display: none; }
```

Lists feel **lighter** — fewer glow layers, lower saturation.

Familjen flow hubs use outer island scroll only — document which level scrolls (see `familjen-input-hub--flow` in obsidian-calm-2.css).

### List type catalog

| Type | Pattern | Example |
|------|---------|---------|
| Module clusters | `module-list` + `module-card` | ClusterGrid |
| Adaptive cards | `adaptive-card-grid` | Home memory cards |
| Entry history | island + border rows | VitEntryList |
| Review queue | `review-queue-status--*` badges | Inkast routing |
| Hub tools | `planering-hub__hint` + collapsible | PlaneringHub |

---

## Examples

### Example A — ClusterGrid module list

```tsx
<section className="module-list" aria-label="Moduler och kluster">
  {visibleClusters.map((cluster) => (
    <ModuleCard key={cluster.to} {...cluster} />
  ))}
</section>
```

### Example B — VitEntryList compact rows

```tsx
<div className="calm-scroll-island max-h-80 space-y-2">
  <ul>
    {entries.map((e) => (
      <li key={e.id} className="rounded-lg border border-border-strong/60 bg-surface-2/40 px-3 py-2 text-sm">
        {e.summary}
      </li>
    ))}
  </ul>
</div>
```

### Example C — HubPageShell scroll island

```tsx
<HubPageShell lockViewport fitViewport contentIsland>
  <PlaneringInputSuperModule />
</HubPageShell>
```

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Section label | `aria-label` on `module-list` |
| Semantics | `<ul>` / `<li>` where possible |
| Status badges | Text + color — not color alone |
| Scroll | Keyboard scroll works; no focus trap in lists |
| Empty state | Descriptive message in `text-text-dim` |
| Review queue | `review-queue-status` readable labels |

---

## Animations

| Surface | Animation | Spec |
|---------|-----------|------|
| Module card hover | background opacity | 0.55 → 0.72 |
| Chip hover | border accent/30 | gold tint background |
| exec-home-card hover | translateY(-1px) | sparingly |
| capacity-low | glow hidden | pseudo-elements off |
| Reduced motion | no translate hover | opacity-only if any |

No infinite scroll shimmer. No bounce on list overscroll.

---

## Code Examples

### calm-scroll-island CSS

```css
.calm-scroll-island {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.hub-view-lock--fit .calm-scroll-island {
  max-height: none;
}
```

### module-list usage map

| Location | max-height | Notes |
|----------|------------|-------|
| PlaneringInputSuperModule | `min(70vh, 640px)` | Delegate scroll |
| VitEntryList | `max-h-80` (prop) | History |
| ExecutiveHomeDashboard | inherit hub | Full home scroll |
| Familjen superhub | outer only | No nested scroll |

Key files: `src/index.css`, `obsidian-calm-2.css`, `ClusterGrid.tsx`, `HubPageShell.tsx`, `VitEntryList.tsx`, `PlaneringInputSuperModule.tsx`.

---

## Do

- Wrap hub content in `calm-scroll-island` via HubPageShell
- Use `module-list` for cluster navigation
- Use border + `surface-2/40` for compact entry rows
- Apply `overscroll-behavior: contain` on scroll surfaces
- Document scroll level in Familjen flow layouts
- Respect `capacity-low` flattening on home and hubs

---

## Don't

- Nest `overflow-y-auto` inside nested islands
- Use flat `#fff` list rows in Executive Midnight
- Render endless lists without max-height on mobile
- Mix `module-list` with Kanban columns (see Planning chapter)
- Hide empty lists without explanation copy
- Add glow layers that survive `capacity-low`

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Virtualized history** | Long VitEntryList / journal rails without DOM bloat |
| **Scroll position restore** | Hub tab switch preserves island scroll offset |
| **List skeleton** | `HubPanelSkeleton` variant for module-list loading |
| **Unified row primitive** | `GlassListRow` component for compact + executive rows |
| **Scroll debug overlay** | Dev-only indicator for nested scroll violations |
