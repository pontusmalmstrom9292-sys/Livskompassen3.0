# Superdagbok — Universal Input Superhub (SPEC)

**Datum:** 2026-06-14  
**Status:** **W4 skelett (Fas 11A→11C)** — integration W5  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)  
**Analys:** [`docs/archive/evaluations-fas19-2026-06/2026-06-14-superdagbok-superhub-djupanalys.md`](../archive/evaluations-fas19-2026-06/2026-06-14-superdagbok-superhub-djupanalys.md)  
**Referensmönster:** [`Familjen-INPUT-SUPERHUB-SPEC.md`](./Familjen-INPUT-SUPERHUB-SPEC.md) · [`Planering-INPUT-SUPERHUB-SPEC.md`](./Planering-INPUT-SUPERHUB-SPEC.md)

---

## 1. Syfte

Migrera Hjärtat (Superdagbok) från monolitisk `DagbokPage`-navigation till polymorf **`DagbokInputSuperModule`** — byt läge (`reflektion`, `quick_mirror`, `arkiv`) **utan sidbyte**.

Hubben är **inmatnings-yta** för journal WORM — inte ersättning för Speglar (`?tab=speglar`) eller Valv forensic-readonly (`DagbokSuperModule variant="forensic-readonly"`).

---

## 2. Scope

### In scope (W4)

- Router + lägesväxlare (**indigo glow** — `glow-bottom-blue`)
- Tre input-lägen med **tunna delegates** → `useJournalFlow` / befintliga steg-komponenter
- Typer i `dagbokInputModes.ts`
- Skuggrutt-skelett: `DagbokInputRoutes` → `/hjartat/input`
- Smoke: `scripts/smoke_superdagbok_superhub.mjs`

### Out of scope (W4)

- `AppRoutes.tsx` / `HjartatPage.tsx` / `DagbokPage.tsx` wiring (W5)
- `DagbokSuperModule` variant-router (Fas 1 — orörd)
- MåBra `dagbok_bridge` (Fas 6D — orörd)
- Speglar / ACT / VIVIR
- Backend: `weaveJournalEntry`, `journalQuickMirror`, firestore.rules

### MUST NOT

- Firestore-skrivningar i routern
- `update`/`delete` på `journal`
- Cross-RAG till Kunskap/Valv/Barnen från hubben
- Ersätta forensic-readonly i Valv

---

## 3. Gränssnitt

### 3.1 Mode union

```typescript
export type DagbokInputMode = 'reflektion' | 'quick_mirror' | 'arkiv';
```

### 3.2 Mode metadata

```typescript
export type DagbokWriteTarget = 'journal_worm' | 'read_only';

export type DagbokInputModeMeta = {
  id: DagbokInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  writeTarget: DagbokWriteTarget;
  /** Legacy DagbokPage ?mode= paritet */
  legacyDagbokMode: 'reflektera' | 'snabb' | 'arkiv';
  /** Anropar journalQuickMirror efter snabb-spar */
  usesQuickMirror: boolean;
};
```

### 3.3 Lägestabell

| Mode ID | Label | Description | tier | writeTarget | usesQuickMirror |
|---------|-------|-------------|------|-------------|-----------------|
| `reflektion` | Reflektera | Steg-för-steg — humör, text, spara | primary | `journal_worm` | false |
| `quick_mirror` | Snabb spegling | Känsla + valfri rad + spegling | primary | `journal_worm` | **true** |
| `arkiv` | Minneslista | Läs dina sparade tankar | primary | `read_only` | false |

### 3.4 Parser

```typescript
export const DEFAULT_DAGBOK_INPUT_MODE: DagbokInputMode = 'reflektion';

export function parseDagbokInputMode(value: string | null | undefined): DagbokInputMode;
export function isDagbokInputMode(value: string | null | undefined): value is DagbokInputMode;
export function getDagbokInputModeMeta(mode: DagbokInputMode): DagbokInputModeMeta;
export function dagbokLegacyModeToInputMode(mode: string | null | undefined): DagbokInputMode;
```

**URL:** `?inputMode=<mode>` — default mode utelämnas i URL.

---

## 4. Komponentkontrakt

### 4.1 `DagbokInputSuperModule`

```typescript
export type DagbokInputSuperModuleProps = {
  initialMode?: DagbokInputMode;
  onSaved?: (mode: DagbokInputMode) => void;
};
```

- Synkar `inputMode` med `useSearchParams`
- Renderar lägesnav + `DagbokInputModeDelegate`
- `BentoCard glow="blue"` (indigo silo)
- **Inga** imports från Firestore SDK eller `saveJournalEntry`

### 4.2 Delegates

| Delegate | Props | Implementation |
|----------|-------|----------------|
| `DagbokReflektionDelegate` | `{ onSaved? }` | `useJournalFlow` + Mood/Reflection/Confirm/Saved steg |
| `DagbokQuickMirrorDelegate` | `{ onSaved? }` | `useJournalFlow.handleQuickSave` + `JournalQuickMode` |

**Arkiv:** renderas inline i routern via `JournalArchiveReadonly` (read-only — ingen separat delegate-fil i W4).

### 4.3 Routing (W5)

```tsx
// AppRoutes.tsx (W5 — ej W4)
<Route path="/hjartat/*" element={<DagbokInputRoutes />} />
```

Canonical entry: `/hjartat/input?inputMode=reflektion|quick_mirror|arkiv`

---

## 5. Backend-kontrakt (read-only för W4)

| API | Callable / hook | Anropas från |
|-----|-----------------|--------------|
| `saveJournalEntry` | Firestore helper | `useJournalFlow.persistEntry` |
| `weaveJournalEntry` | Callable | `useJournalFlow` (Valv-gated) |
| `journalWovenToKampspar` | Callable | ConfirmStep opt-in |
| `journalQuickMirror` | Callable | `fetchJournalQuickMirror` i quick delegate |
| `getJournalEntries` | Firestore read | Arkiv-läge |

**WORM:** Inga `updatedAt`/`deletedAt` på journal-poster.

---

## 6. Design

| Token | Värde |
|-------|-------|
| Silo | Hjärtat / Dagbok |
| Glow | `glow-bottom-blue` / `BentoCard glow="blue"` |
| Scroll | `calm-scroll-island` på delegate-yta |
| Typografi | `font-display-serif` rubriker, `text-text-dim` hints |

---

## 7. Smoke

```bash
node scripts/smoke_superdagbok_superhub.mjs
```

Verifierar filstruktur, modes, indigo glow, delegate wiring, shadow route, dokumentation.

---

## 8. W4 → W5 checklist

- [ ] Mount `DagbokInputRoutes` under `/hjartat/*`
- [ ] Embed hub på `?tab=reflektion` (ersätt eller wrappa `DagbokPage` mode-nav)
- [ ] Legacy `?mode=snabb` → `inputMode=quick_mirror` redirect
- [ ] `npm run smoke:superdagbok-superhub` i package.json
- [ ] Uppdatera `.context/locked-ux-features.md` efter W5 godkännande
