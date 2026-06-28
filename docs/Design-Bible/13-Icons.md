# Chapter 13 — Icons

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [12-Animation-System.md](./12-Animation-System.md)  
> **Next chapter:** [14-Illustrations.md](./14-Illustrations.md)


---

## Purpose

This chapter defines the **single icon language** for Livskompassen under Executive Midnight. Icons support navigation and affordances without competing with the compass, logotype, or hero content.

Every icon in production must belong to one of three approved families: **Lucide** (general UI), **DrawerL2Icon** (hub and zone identity), or **custom SVG** (compass only). Mixing families or stroke weights breaks the premium, calm aesthetic established in Chapters 01–03.

---

## Philosophy

Icons are **supporting actors**, not brand marks.

The compass (`/design/kompass-dock-rose.svg`) is the only iconographic hero. Hub zones use bespoke Drawer L2 SVGs so Familjen, Hjärtat, and Vardagen feel distinct without importing emoji or multi-style clip art.

Lucide provides optical consistency for inline actions—close, chevron, pen, inbox—at a restrained stroke that reads on dark glass without shouting. The design mantra from Chapter 01 applies: if an icon draws more attention than *LIVSKOMPASSEN* or the Eye, it is too loud.

---

## Visual Rules

| Context | Family | Rule |
|---------|--------|------|
| General UI (buttons, lists, banners) | Lucide React | `strokeWidth={1.5}` always |
| Hub / drawer L2 navigation | `DrawerL2Icon` | SVG from `/icons/drawer-l2/drawer-{hubId}.svg` |
| Dock, home hero, brand anchor | Custom SVG compass | Never Lucide, never Material Symbols |
| Header chrome glyphs | `HeaderMenuGlyph` etc. | Match Lucide optical weight |

**Stroke:** 1.5px is canonical for Lucide. Default Lucide (2) is too heavy on midnight glass; 1 is too faint at small sizes on G85.

**Color:** Icons inherit `text-accent`, `text-text`, or `text-text-dim` via Tailwind—never hardcoded hex in feature modules.

**Hub IDs:** `DrawerL2HubId` covers `hem`, `dagbok`, `vardagen`, `mabra`, `familjen`, `planering`, `arbetsliv`, `hamn`, `projekt`, `drogfrihet`, `installningar`, `inspelning`, `anteckning`.

---

## Sizing

| Surface | Lucide class | DrawerL2 | Notes |
|---------|--------------|----------|-------|
| Header action glyph | `h-[1.15rem] w-[1.15rem]` | — | design-packs.css |
| Dock nav (Lucide slots) | `h-5 w-5` | `exec-dock-bar__glyph--l2` | PenLine, Inbox use Lucide |
| Drawer row / hub card | `h-4 w-4` to `h-6 w-6` | match container | ObsidianForgeLab pattern |
| CognitiveLoadStrip | `h-3.5 w-3.5` | — | Supporting only |
| Banner dismiss | `h-4 w-4` | — | SystemErrorBanner |

Minimum touch target for icon **buttons** remains 44×44px (Chapter 28)—glyph size does not shrink the hit area.

---

## Spacing

Icons sit inside padded chrome, never flush to card edges:

- Header chrome buttons: `2.75rem` circle with centered glyph (design-packs.css).
- List rows: `gap-2` to `gap-3` between icon and label.
- Bento card headers: icon slot in `CardHeader` with token gap from title.

Do not add extra margin around `DrawerL2Icon`—`shrink-0 object-contain` handles optical alignment.

---

## States

| State | Lucide | DrawerL2 | Compass |
|-------|--------|----------|---------|
| Default | `currentColor` from parent | Full opacity SVG | Metallic asset |
| Hover (button) | Parent `translateY(-1px)` | Same | N/A in header |
| Active | Parent `scale(0.98)` | Same | Dock press glow |
| Disabled | `opacity-40` + `pointer-events-none` | Same | — |
| Focus | Visible ring on **button**, not glyph | — | — |

`DrawerL2Icon` sets `aria-hidden` and `alt=""` when decorative beside visible text.

---

## Examples

**Production patterns**

1. **FloatingDock** — Lucide `PenLine`, `Inbox`, `LayoutGrid` at `strokeWidth={1.5}`; `DrawerL2Icon hubId="familjen"` for zone identity.
2. **drawerNav.ts** — `createDrawerL2Icon('vardagen')` factory for nav config compatibility with Lucide icon slots.
3. **ExecutiveFocusCard** — `<Target strokeWidth={1.5} className="h-4 w-4 text-accent" />`.
4. **SystemErrorBanner** — `<X className="h-4 w-4" />` dismiss (stroke inherits 1.5 when set on parent pattern).

**Anti-pattern:** Using `Compass` from Lucide anywhere in prod chrome.

---

## Accessibility

- Decorative icons: `aria-hidden="true"` when adjacent text names the action.
- Icon-only buttons: Swedish `aria-label` (e.g. `Stäng felmeddelande`, `Öppna meny`).
- Do not rely on icon color alone for status—pair with text (capacity banners, errors).
- `DrawerL2Icon` is decorative when hub name is visible in the same row.

---

## Animations

Icons themselves do not animate independently except:

- Capacity pulse dot (`animate-pulse`) beside banner label—not the Lucide glyph.
- Dock/hover lifts move the **button** container, not the SVG path.

Respect `prefers-reduced-motion` (Chapter 12): disable pulse and hover translate when reduced motion is requested.

---

## Code Examples

```tsx
// Lucide — canonical stroke
import { PenLine } from 'lucide-react';
<PenLine className="h-5 w-5 text-accent" strokeWidth={1.5} />

// Hub identity — never substitute Lucide
import { DrawerL2Icon } from '@/core/ui/drawerL2Icons/DrawerL2Icon';
<DrawerL2Icon hubId="hjartat" className="h-6 w-6" />

// Nav factory (drawerNav.ts pattern)
import { createDrawerL2Icon } from '@/core/ui/drawerL2Icons/DrawerL2Icon';
const vardagenIcon = createDrawerL2Icon('vardagen');
```

Asset path: `public/icons/drawer-l2/drawer-{hubId}.svg`.

---

## Do

- Use Lucide with `strokeWidth={1.5}` for all general UI icons.
- Use `DrawerL2Icon` for hub/zone identity in drawer, dock side slots, and hub pickers.
- Use custom SVG only for the compass (`ExecutiveDecorCompass`, Chapter 19).
- Inherit color from design tokens (`text-accent`, `text-text-dim`).
- Keep icon buttons at 44px minimum touch target.

---

## Don't

- Mix Material Icons, Heroicons, or emoji with Lucide in production modules.
- Use Lucide compass or map-pin as brand substitute for `kompass-dock-rose.svg`.
- Hardcode icon colors with hex in `src/modules/features/**`.
- Scale hub SVGs below readable size on G85 (< 16px effective).
- Add animated spinning icons except explicit loading states (`Loader2` with label).

---

## Future Improvements

- Central `Icon` primitive wrapping Lucide defaults (`strokeWidth={1.5}`, size presets).
- Figma Code Connect map for `DrawerL2Icon` hub set (partial: `CognitiveLoadStrip.figma.tsx`).
- Audit remaining Lucide usages missing explicit `strokeWidth={1.5}`.
- Document hub SVG authoring spec (grid, stroke, gold accent rules) alongside Theme Lab.
