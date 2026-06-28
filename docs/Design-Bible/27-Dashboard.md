# Chapter 27 — Dashboard

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [26-Planning.md](./26-Planning.md)  
> **Next chapter:** [28-Accessibility.md](./28-Accessibility.md)

---

## Purpose

This chapter defines the **Executive home dashboard** at `/` — the anchor screen in Livskompassen, not a productivity dashboard.

Coverage:

- **Executive home layout** — Midnight Executive prod UI
- **`exec-snabbstart-hub`** — collapsible compass scene
- **Hero Dagens Reflektion** — primary content module (DAD)
- **Capacity-aware home** — simplified UI at low capacity

Primary files: `HomeHeroKanon.tsx`, `ExecutiveHomeDashboard.tsx`, `executive-chrome.css`.

---

## Philosophy

### DAD visual hierarchy (locked)

From `design-calm.mdc`:

1. Livskompassen (header identity)
2. Ögat (Kompis/vault aura)
3. **Dagens Reflektion**
4. Kompassen
5. Other content

**Mantra:** Exclusive personal compass — not a generic productivity app.

Home reduces choices at low capacity. Dagbok defaults to tyst. Glow and saturation flatten globally via `capacity-low`.

---

## Visual Rules

### HomeHeroKanon — layout router

**File:** `src/modules/core/home/HomeHeroKanon.tsx`

| Theme | Layout |
|-------|--------|
| `ME-midnight-executive` | `ExecutiveMixEHomeDashboard` or `HomeLayoutA` |
| Brushed Brass | `HomeLayoutA variant="brass"` |
| Mockup / design pack | Adaptive compass + greeting |
| Default | `HomeLayoutA variant="calm"` |

Layout mode: `getExecutiveHomeLayoutMode()` → `mix-e` | `extended`  
Event: `HOME_LAYOUT_CHANGED_EVENT`

### ExecutiveHomeDashboard (extended)

```tsx
<ExecutiveHomeStagger className="executive-home-dashboard calm-scroll-island ...">
  <ExecutiveReflektionHero />           {/* Hero — Dagens Reflektion */}
  <executive-home-grid>                 {/* 2×2 bento cards */}
    <ExecutiveFocusCard />
    <ExecutiveLivsloggCard />
    <ExecutiveAnkareCard />
    <ExecutiveDayStepsCard />
  </executive-home-grid>
  <ExecutivePlaneringCard />
  <ExecutiveJournalHistoryRail />
</ExecutiveHomeStagger>
```

### ExecutiveMixEHomeDashboard (mix-e)

Classic home — three blocks:

1. Greeting + streak (`exec-mix-e-greeting`)
2. **HomeExecutiveSnabbstart** (`exec-snabbstart-hub`)
3. **DagensRiktningCard** — compass check-in

### exec-snabbstart-hub

**File:** `HomeExecutiveSnabbstart.tsx` · **CSS:** `executive-chrome.css`

```tsx
<section className="exec-snabbstart-hub exec-snabbstart-hub--open">
  <button className="exec-snabbstart-hub__toggle" aria-expanded>
    Snabbstart
  </button>
  <div className="exec-snabbstart-hub__stage">
    <div className="exec-snabbstart-hub__glow" />
    <ExecutiveDecorCompass size="lg" />
  </div>
  <button className="exec-snabbstart-hub__inkast">Inkast</button>
</section>
```

Satellites: note → `/hjartat?tab=reflektion`, voice → quick mirror route.

**Design:** Compass dominates scene when open — DAD: compass carries dock, not reverse.

### ExecutiveReflektionHero

**DAD primary module** on extended executive home.

```tsx
<section className="exec-reflektion-hero ... min-h-[14.5rem]" aria-label="Dagens reflektion">
  <div className="exec-reflektion-hero__bg" />
  <div className="exec-reflektion-hero__shade" />
  <div className="exec-reflektion-hero__watermark" />
  ...
</section>
```

Content: label `DAGENS REFLEKTION`, today's quote or calm lead, CTA «Skriv nu» → reflektion with `write=true`.

### capacity-low global styling

**File:** `obsidian-calm-2.css`

```css
.capacity-low .glass-card,
.capacity-low .calm-card,
.capacity-low .bento-card {
  background: color-mix(in srgb, var(--surface) 80%, transparent);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.capacity-low .glow-bottom-gold::after { display: none; }
```

Desaturated accent (`filter: saturate(0.65)`), flat cards, grayscale bento icons.

---

## Sizing

| Element | Spec |
|---------|------|
| Executive dashboard max-width | `max-w-2xl` (`.executive-home-dashboard`) |
| Reflektion hero min-height | `min-h-[14.5rem]` |
| Home grid | 2-col bento `sm+` |
| Snabbstart compass | `size="lg"` decorative |
| Planering card task rows | Full width |
| Touch targets | 44px satellites and CTAs |
| Theme scope | `[data-theme='ME-midnight-executive']` |

---

## Spacing

| Area | Rule |
|------|------|
| Stagger items | Sequential vertical rhythm via ExecutiveHomeStagger |
| Home grid gap | `.executive-home-grid` gap tokens |
| Hero internal | Layer stack: bg, shade, watermark, content |
| Snabbstart stage | Grid/scene padding from executive-chrome.css |
| Inkast button | Full width below stage |
| Greeting meta | Streak chip in `exec-mix-e-greeting__eld` |
| Section labels | `exec-home-label` uppercase tracking |

---

## States

### Layout modes

| Mode | Dashboard component |
|------|---------------------|
| extended | ExecutiveHomeDashboard |
| mix-e | ExecutiveMixEHomeDashboard |
| calm/brass | HomeLayoutA variants |

### Snabbstart chrome

`useExecutiveHomeChrome()` — `snabbstartOpen`, `toggleSnabbstart`. Toggle `aria-expanded`.

### Reflektion hero states

| State | UI |
|-------|-----|
| Entry today | Quote `line-clamp-3` |
| No entry | «Stanna upp. Känn efter.» + calm lead |
| CTA | «Skriv nu» navigates with `write=true` |

### DagensRiktningCard (mix-e)

«Dagens riktning · {flow}» — time-based compass. Expanded: `DashboardPage variant="module"` + `CompassQuickWidgetRail`.

**Difference:** ReflektionHero = journal/memory · RiktningCard = compass/check-in.

### HomeStreakChip

Presence indicator — **not** gamification. Hidden if streak < 1. Label «Närvaro».

### Capacity detection

**File:** `homeCapacityGate.ts`

```tsx
isLowHomeCapacity(evolutionDoc, capacityScore, adaptation?)
```

Triggers: `evolution_hub.pillars.kognitiv.level <= 1`, `capacityScore < CAPACITY_LOW_HOME_THRESHOLD`, `adaptation_prefs.uiDensity === 'paralys'`.

MainLayout applies `capacity-low` class globally.

### MainLayout integration

- `ExecutiveHomeChromeProvider` when executive skin
- `isScenicHome` → slim header on `/`
- `FyrenWidgetProvider` — widget bar global
- SOS: `SosMainTrigger` + hidden Pansar button in HomeHeroKanon

---

## Examples

### Example A — Extended executive home stack

```tsx
<ExecutiveHomeDashboard evolutionDoc={evolutionDoc} tasks={tasks} />
```

### Example B — Reflektion hero with entry

```tsx
<ExecutiveReflektionHero
  todayEntry={entry}
  onWrite={() => navigate('/hjartat?tab=reflektion&write=true')}
/>
```

### Example C — Snabbstart toggle

```tsx
const { snabbstartOpen, toggleSnabbstart } = useExecutiveHomeChrome();
<button
  className="exec-snabbstart-hub__toggle"
  aria-expanded={snabbstartOpen}
  onClick={toggleSnabbstart}
>
  Snabbstart
</button>
```

### Example D — Capacity-low class on shell

```tsx
// MainLayout.tsx
className={clsx(..., isLowCapacity && 'capacity-low')}
```

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Snabbstart toggle | `aria-expanded` |
| Hero | `aria-label="Dagens reflektion"` |
| Planering tabs | `role="tablist"` on ExecutivePlaneringCard |
| capacity-low | Maintain AA contrast despite desaturation |
| Touch | 44px on satellites and CTAs |
| Stagger animation | Respects `prefers-reduced-motion` |
| SOS trigger | Reachable from home header |

---

## Animations

| Surface | Animation | Spec |
|---------|-----------|------|
| ExecutiveHomeStagger | subtle entrance | per-item delay |
| Snabbstart glow | scene glow | disabled in reduced-motion |
| Reflektion hero layers | static scenic | no parallax on low-end |
| capacity-low | no glow pseudo | flatten motion |
| Mix-e greeting | minimal | no bounce |

No points, levels, or celebration confetti on home.

---

## Code Examples

### executive-chrome.css key classes

| Class | Purpose |
|-------|---------|
| `.executive-home-dashboard` | Container max-w-2xl |
| `.executive-home-grid` | 2-col bento sm+ |
| `.exec-reflektion-hero__*` | Hero layers |
| `.exec-snabbstart-hub__*` | Snabbstart scene |
| `.exec-home-card` | Planering/focus cards |
| `.exec-home-label` | Eyebrow uppercase tracking |

### Capacity threshold

**File:** `shared/evolution/capacityScore.ts` — shared constant frontend/backend.

Non-executive home uses `HomeActionHub` and `HomeLayoutA`; design packs may mount `ChameleonLive` or `AdaptiveMemoryCards`.

### File index

| File | Role |
|------|------|
| `HomeHeroKanon.tsx` | Layout router |
| `ExecutiveHomeDashboard.tsx` | Extended dashboard |
| `ExecutiveMixEHomeDashboard.tsx` | Mix-E dashboard |
| `ExecutiveReflektionHero.tsx` | Dagens Reflektion hero |
| `HomeExecutiveSnabbstart.tsx` | exec-snabbstart-hub |
| `DagensRiktningCard.tsx` | Compass check-in |
| `homeCapacityGate.ts` | Capacity logic |
| `MainLayout.tsx` | capacity-low class |
| `executive-chrome.css` | Executive home CSS |
| `obsidian-calm-2.css` | capacity-low tokens |

---

## Do

- Keep Dagens Reflektion as visual hero focus (DAD)
- Use ExecutiveHomeStagger on extended executive home
- Respect `capacity-low` globally on app-shell
- Center compass in snabbstart scene when open
- Route reflektion CTA to `/hjartat?tab=reflektion&write=true`
- Hide streak chip when streak < 1

---

## Don't

- Turn home into Kanban-first dashboard
- Remove exec-reflektion-hero without DAD decision
- Move compass off snabbstart scene center
- Ignore capacity gate for dagbok default mode
- Add gamification (points, levels) on home
- Show aggressive glow under `capacity-low`

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Layout preference UI** | In-app toggle extended ↔ mix-e without dev flags |
| **Hero scenic packs** | Seasonal Executive Midnight backgrounds (DAD review) |
| **Capacity explanation** | Optional one-line why UI simplified (no guilt) |
