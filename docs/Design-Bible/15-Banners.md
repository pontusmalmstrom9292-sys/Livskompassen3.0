# Chapter 15 — Banners

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [14-Illustrations.md](./14-Illustrations.md)  
> **Next chapter:** [16-Cards.md](./16-Cards.md)


---

## Purpose

This chapter defines **horizontal alert and context bands** that communicate system state, cognitive protection, and hub identity without modal interruption.

Banners sit above content, respect safe areas, and auto-dismiss or persist according to severity. They are part of Livskompassen's **defensive UX**—errors visible, capacity respected, hub context clear.

---

## Philosophy

Banners speak in a **low-affect, factual** voice (Chapter 01 safety value). They inform; they do not scold.

Three banner families coexist:

1. **SystemErrorBanner** — global failures (Fyren denied, Valv errors).
2. **Capacity banners** — cognitive load gates (archive shelves, planning complexity).
3. **Hub top bars** — wayfinding inside modules (`HubPageShell`, `ExecutiveHubHeader`).

None of these replace the app header crown (Chapter 17). They serve content zones below it.

---

## Visual Rules

| Type | Component / class | Visual |
|------|-------------------|--------|
| System error | `.system-error-banner` | Fixed, `border-danger/30`, `bg-surface-2/95`, blur |
| Capacity info | inline calm band | `rounded-2xl`, gold bottom border, pulse dot |
| Cognitive strip | `CognitiveLoadStrip` | `border-white/10`, `bg-white/5`, xs text |
| Hub top bar | `.hub-page-shell__top-bar--glass` | Bento glass, accent border mix |
| Executive hub | `.executive-hub-header--scenic` | Scenic gradient band + gold border |

**Hierarchy:** Error > capacity gate > informational strip > hub chrome.

**Tone:** Swedish copy, short sentences, no exclamation spam.

---

## Sizing

| Banner | Width | Height |
|--------|-------|--------|
| SystemErrorBanner | `max-w-lg`, inset-x-4 | auto, py-3 |
| Capacity (archive) | full column | auto, p-4 |
| CognitiveLoadStrip | full row | ~2.5rem with py-2 |
| Hub top bar | flex-1 in header | eyebrow + title + optional lead |

SystemErrorBanner top offset: `calc(4.5rem + env(safe-area-inset-top))` — clears header.

---

## Spacing

- SystemErrorBanner: `px-4 py-3`, flex gap-3 between message and dismiss.
- Capacity banner: `mb-2` on label row; `gap-4` from following content (`ArchiveListView`).
- Hub shell header: `padding 0.875rem 1rem`, `gap-4` to body (`HubPageShell`).
- ModuleShell: `CognitiveLoadStrip` above form with standard section gap.

---

## States

| Banner | Show | Hide |
|--------|------|------|
| SystemErrorBanner | `store.system.error` set | Auto 12s, dismiss button, or `setError(null)` |
| Capacity gate | `capacityScore < threshold` | Score rises or user leaves view |
| CognitiveLoadStrip | Module opt-in | Always static when shown |
| Hub top bar | Hub route mounted | Unmount with page |

Error banner: `role="alert"`. Capacity: informative, not alert unless blocking action.

---

## Examples

1. **MainLayout** mounts `<SystemErrorBanner />` globally.
2. **ArchiveListView** — gold-accent capacity banner when score < 5.0; explains closed shelves.
3. **CognitiveLoadStrip** — ModuleShell, LivLauncherPage, RecoveryRealityCheckForm: *Ett steg i taget*.
4. **HubPageShell** — `hub-page-shell__top-bar--glass` with eyebrow/title/lead typographic scale.
5. **ExecutiveHubHeader** — `executiveHeader` + `scenic` prop for Midnight hub bands.

---

## Accessibility

- SystemErrorBanner: `role="alert"`; dismiss `aria-label="Stäng felmeddelande"`.
- Capacity text must be readable without the pulse dot (dot is `aria-hidden` decorative).
- CognitiveLoadStrip: `role="status"` for non-blocking guidance.
- Hub titles use semantic `<h1>` inside shell header; eyebrow is supporting `<p>`.

---

## Animations

- SystemErrorBanner: fade via mount/unmount (no slide bounce).
- Capacity pulse dot: `animate-pulse` — disable under `prefers-reduced-motion`.
- Hub glass: subtle border/background transitions on depth variant only.

Auto-dismiss 12s on system error (see `SystemErrorBanner.tsx`).

---

## Code Examples

```tsx
// SystemErrorBanner.tsx — global error surface
<div
  className="system-error-banner ... top-[calc(4.5rem+env(safe-area-inset-top,0px))] z-[80]"
  role="alert"
>

// Capacity banner pattern (ArchiveListView)
{capacityScore < 5.0 && (
  <div className="p-4 rounded-2xl bg-surface-2/70 border-b-2 border-accent/40 ...">
    <span className="font-semibold text-accent uppercase tracking-wider">Kognitiv avlastning aktiv</span>
  </div>
)}

// HubPageShell top bar
<div className={clsx('hub-page-shell__top-bar', depth && 'hub-page-shell__top-bar--glass')}>
  <p className={h.eyebrow}>{eyebrow}</p>
  <h1 className={h.title}>{title}</h1>
</div>
```

---

## Do

- Mount SystemErrorBanner once in MainLayout for store-driven errors.
- Explain *why* capacity gates activate (archive, kanban) in plain Swedish.
- Place hub top bars inside HubPageShell—not duplicate AppHeaderBar titles.
- Use token colors (`danger`, `accent`, `surface-2`) for banner surfaces.

---

## Don't

- Stack multiple fixed banners at same z-index without priority rules.
- Use banners for marketing or feature upsell.
- Block entire app with banner when inline strip suffices (CognitiveLoadStrip).
- Hardcode `#d4af37` in banner feature code.
- Replace hub header with a second app-level LIVSKOMPASSEN title.

---

## Future Improvements

- Unified `CapacityBanner` primitive with threshold props and i18n strings.
- Queue system errors if one is already showing (avoid overwrite).
- Hub top bar variant tokens for Valv vs Vardagen silo eyebrow colors (subtle, not neon).
- Smoke test asserting SystemErrorBanner mount + dismiss in `smoke:design-modules`.
