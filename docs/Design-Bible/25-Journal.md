# Chapter 25 — Journal

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Authority:** Design Authority Decision (DAD) v1.0 — APPROVED  
> **Previous chapter:** [24-Lists.md](./24-Lists.md)  
> **Next chapter:** [26-Planning.md](./26-Planning.md)

---

## Purpose

This chapter defines **Dagbok (journal) UI** in the Hjärtat zone — the primary reflection surface at `/hjartat?tab=reflektion`.

Coverage:

- **`DagbokInputSuperModule`** — Chameleon router for all input modes
- **WORM journal UI** — append-only, clear lock signals, opt-in weaving
- **Tyst läge (silent mode)** — dissociation/paralysis — minimal choices
- **`/hjartat` reflektion** — Superhub integration

**Locked UX:** Hjärtat routing and tyst/burn modes require explicit approval to remove.

Primary file: `src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx`.

---

## Philosophy

| Principle | Journal expression |
|-----------|-------------------|
| One mode at a time | Chameleon morph — not five separate pages |
| WORM respect | Journal entries append-only; weave to Kunskap opt-in only |
| Silent = safety | No confirm dialogs, no weave banners in tyst mode |
| Capacity-aware | Low capacity → default `tyst` |
| Zero Footprint | Burn mode — vent without permanent save (designed flow) |

Journal is **process and feeling**. Valv (`reality_vault`) is **evidence WORM** with confirm sheet — do not mix patterns.

---

## Visual Rules

### DagbokInputSuperModule architecture

```
DagbokInputSuperModule
├── BentoCard (hjartat-tab-panel)
├── Header (valv-forensic-* typography)
├── DagbokInputModePicker
├── ChameleonInputShell
│   └── DagbokInputModeDelegate
│       ├── reflektion → DagbokReflektionDelegate
│       ├── quick_mirror → DagbokQuickMirrorDelegate
│       ├── arkiv → DagbokArkivDelegate
│       ├── burn → DagbokBurnDelegate
│       └── tyst → DagbokTystDelegate
└── calm-scroll-island (delegate viewport)
```

**Rule:** No direct Firestore in SuperModule — delegates + hooks only.

### Header typography

```tsx
<p className="valv-forensic-eyebrow">Hjärtat</p>
<h2 className="valv-forensic-title">{activeMeta.label}</h2>
<p className="valv-forensic-lead">{activeMeta.description}</p>
```

**Tyst mode:** hide lead + `DagbokRememberCard` — minimize text.

### BentoCard wrapper

```tsx
<BentoCard
  glow="gold"
  depth
  noHover
  bare
  className={`hjartat-tab-panel ...${isTystMode ? ' dagbok-hub--tyst' : ''}`}
/>
```

Class `dagbok-hub--tyst` activates reduced density in `dagbok-tyst-lage.css`.

### WORM UI signals

| Element | Function |
|---------|----------|
| `DagbokRememberCard` | Reminds what is saved / memory list |
| `SavedStep` | Calm post-save confirmation — no gamification |
| No edit on saved entries | WORM in UX |

### Speglar secondary CTA

```tsx
<Link to="/hjartat?tab=speglar" className="ds-btn ds-btn--secondary text-xs">
  Känslospegeln
</Link>
```

Conflict/gaslighting → Speglar (Zero Footprint), not journal coach.

### Tyst delegate UX contract (Fas 23E)

- One screen, minimal choices
- Mood (MOOD_CATALOG) + optional **three words**
- Save **without** confirm/weave UI (`handleTystSave` in `useJournalFlow`)
- Burn as vent — `onSwitchToBurn` → `DagbokBurnDelegate`
- `data-write-target="none"` on burn view

---

## Sizing

| Element | Spec |
|---------|------|
| BentoCard | Full tab panel width |
| Mode picker buttons | Min 44px touch height in tyst |
| Delegate viewport | `calm-scroll-island` flex child |
| Mood chips | Large targets in tyst CSS |
| Three-words input | Constrained width, short field |
| ExecutiveReflektionHero quote | `line-clamp-3` on home |
| Chameleon morph duration | ~350ms fade |

---

## Spacing

| Area | Rule |
|------|------|
| Tab panel padding | BentoCard bare + hjartat-tab-panel |
| Header stack | forensic eyebrow → title → lead |
| Mode picker | `gap-2` between mode buttons |
| Delegate body | `space-y-4` inside island |
| Tyst mode margins | Reduced via `dagbok-tyst-lage.css` |
| SavedStep | `mt-6` separation from form |
| Remember card | Hidden in tyst — normal `mb-4` otherwise |

---

## States

### Input modes (`dagbokInputModes.ts`)

| Mode | ID | Capacity |
|------|-----|----------|
| Reflektion | `reflektion` | Normal |
| Snabb spegel | `quick_mirror` | Normal/low |
| Arkiv | `arkiv` | Normal (hidden at low) |
| Bränn | `burn` | Vent |
| Tyst | `tyst` | Default at low capacity |

URL: `?inputMode=` · capacity: `?capacity=` / `?tyst=`

### Capacity gate

**File:** `src/modules/core/home/homeCapacityGate.ts`

```tsx
const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore);
if (lowCapacity && !inputModeParam) return 'tyst';
```

Hidden `arkiv` in picker when `lowCapacity`.  
`LOW_CAPACITY_MODES`: reflektion, quick_mirror, burn, tyst.

### Journal flow states

| State | Behavior |
|-------|----------|
| Draft | Banner if saved draft exists (tyst copy) |
| Saving | Inline busy — no modal |
| Saved | `SavedStep` confirmation |
| Burn | No write target; vent only |
| Weave opt-in | Explicit user action — `journal_woven` synapse |

### Mode picker in tyst

Hidden modes: reflektion, quick_mirror, arkiv, burn (via hiddenModes) — user sees only allowed modes.

### Routing

- Zone: **Hjärtat** `/hjartat`
- Tab: `?tab=reflektion`
- Direct write: `?tab=reflektion&write=true` (ExecutiveReflektionHero CTA)
- Legacy `/dagbok` redirects — no new routes outside 3-zone system

---

## Examples

### Example A — SuperModule mount on Hjärtat tab

```tsx
<DagbokInputSuperModule
  initialMode={inputModeFromUrl}
  lowCapacity={isLowHomeCapacity(evolutionDoc, capacityScore)}
/>
```

### Example B — Executive home → reflektion

```tsx
// ExecutiveReflektionHero.tsx
navigate('/hjartat?tab=reflektion&write=true')
```

Shows today's entry if present (`line-clamp-3` quote).

### Example C — Tyst save (no confirm)

```tsx
// DagbokTystDelegate — handleTystSave via useJournalFlow
<Button variant="accent" onClick={handleTystSave} disabled={saving}>
  Spara
</Button>
```

### Example D — Chameleon morph between delegates

```tsx
<ChameleonInputShell activeKey={activeMode}>
  <DagbokInputModeDelegate mode={activeMode} {...props} />
</ChameleonInputShell>
```

User experiences **one shell**, many modes (~350ms fade).

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Mode picker | `aria-pressed` on active button |
| Mood selection | Large touch targets in tyst mode |
| SavedStep | Focusable confirmation |
| Burn | Clear «Tillbaka till tyst läge» |
| Tyst textarea | No auto-focus on load (avoid surprise) |
| Forensic headers | Semantic heading hierarchy |
| Remember card | Readable summary of persistence |

---

## Animations

| Surface | Animation | Spec |
|---------|-----------|------|
| ChameleonInputShell | mode morph fade | ~350ms |
| BentoCard glow | gold bottom | static in tyst |
| SavedStep | subtle enter | respects reduced-motion |
| Burn transition | cross-fade delegate | no modal |
| Tyst CSS | no decorative motion | larger targets only |

No streak celebration. No confetti on save.

---

## Code Examples

### Mode metadata

```typescript
// dagbokInputModes.ts — each mode: id, label, description, delegate
export const DAGBOK_INPUT_MODES = [
  { id: 'reflektion', label: 'Reflektion', ... },
  { id: 'tyst', label: 'Tyst läge', ... },
  // ...
];
```

### useJournalFlow hook

Central hook for save/step/reset — no Firestore in SuperModule.

```tsx
const { handleTystSave, handleReflektionSave, step, reset } = useJournalFlow();
```

### Opt-in backend

**File:** `functions/src/adk/synapses/journalWovenSynapse.ts` — requires explicit `optIn`.

### File index

| File | Role |
|------|------|
| `DagbokInputSuperModule.tsx` | Router |
| `dagbokInputModes.ts` | Mode metadata |
| `delegates/DagbokTystDelegate.tsx` | Silent mode |
| `diary/hooks/useJournalFlow.ts` | Save flow |
| `dagbok-tyst-lage.css` | Tyst styling |
| `ExecutiveReflektionHero.tsx` | Home → reflektion |
| `journalWovenSynapse.ts` | Opt-in backend |

---

## Do

- Add new journal modes as delegates + entry in `dagbokInputModes.ts`
- Keep tyst mode without confirm dialogs
- Require opt-in for journal → kampspar weave
- Use `calm-scroll-island` for delegate content
- Default to tyst at low home capacity
- Link conflict content to Speglar, not MåBra coach

---

## Don't

- Write Firestore directly in SuperModule
- Use `WormSaveConfirmSheet` in reflektion (Valv pattern)
- Force full reflektion at low capacity
- Cross-RAG copy from Kunskap into dagbok UI
- Remove tyst/burn without Locked UX approval
- Show weave banners in tyst mode

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Voice input polish** | quick_mirror delegate — Executive Midnight mic UX |
| **Draft sync indicator** | Clearer tyst draft banner without anxiety copy |
| **Journal history rail** | ExecutiveJournalHistoryRail deep link to arkiv mode |
| **Offline queue** | Append-only local queue with WORM merge rules |
| **Weave preview** | Opt-in sheet before kampspar promotion (not auto) |
