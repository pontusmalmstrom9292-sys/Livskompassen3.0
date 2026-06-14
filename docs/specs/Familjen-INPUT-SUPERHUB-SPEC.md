# Familjen — Universal Input Superhub (SPEC)

**Datum:** 2026-06-14  
**Status:** **Godkänd för implementation (Fas 7A→E)** — teknikledare (Pontus) 2026-06-14  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) § Fas 6 (zon 2) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §1, §7, §7b · [`Barnen-SPEC.md`](./modules/Barnen-SPEC.md)  
**Analys:** [`docs/evaluations/Familjen-INPUT-SUPERHUB-EVAL.md`](../evaluations/Familjen-INPUT-SUPERHUB-EVAL.md)  
**Referensmönster:** [`Mabra-INPUT-SUPERHUB-SPEC.md`](./modules/Mabra-INPUT-SUPERHUB-SPEC.md) · [`2026-06-06-supermodule-master-plan.md`](../evaluations/2026-06-06-supermodule-master-plan.md)

---

## 1. Syfte

Ersätta **spridda inmatningsformulär** i Familjen-zonen med en polymorf **Universal Input Hub** — `FamiljenInputSuperModule` — där vuxen byter **läge** (barnfokus, stund, fysiologi, livslogg, vardagsstruktur, inkast) **utan sidbyte**.

Familjen förblir **trygg hamn** (Grey Rock, neutral barnlogg, inga streaks). Superhubben är **inmatnings- och spar-yta** för Barnen-silon (`children_logs`), inte ersättning för read-only verktyg (balans, RAG-chatt, tillsammans) eller separata zoner (Hamn, Drogfrihet, Barnporten PWA).

---

## 2. Scope och avgränsning

### In scope

- Router-komponent + lägesväxlare (UI)
- Sex input-lägen med **tunna delegate-paneler** → befintliga komponenter
- Enhetlig entry: `/familjen/input` och/eller `?inputMode=` på reflektion-flik
- Metadata på sparade objekt där schema tillåter: `channel: 'familjen'`, `category`, `bankId?`, `action`
- Färgburkar: indigo zon (`glow-bottom-blue`, `calm-card`)
- `CaptureSuperModule` variant **`familjen`** (Fas 7D)

### Out of scope (v1 Superhub)

- Ny Firestore-samling
- Cross-RAG till Kunskap eller Valv
- Auto-promote till `reality_vault`
- Ersätta hela `FamiljenPage` (tillsammans, barnporten, hamn, drogfrihet-flikar)
- Barnporten barn-PWA (`/barnporten`) — separat `authorRole: child`
- Backend-ändring av `childrenLogsQuery` prompts
- Återinförande av legacy PIN-gate i shell (dokumenterat som framtida produktbeslut)

### Skild från (oförändrat)

| Zon / flik | Roll |
|------------|------|
| Trygg Hamn (`?tab=hamn`) | BIFF/Grey Rock — **ej** `children_logs` |
| Drogfrihet | MåBra-silo — **ej** barnlogg |
| Barnporten inkorg (`?tab=barnporten`) | Read + HITL — locked §7b |
| Valv bevis | WORM evidens — endast HITL efter explicit klick |
| Kunskap | FACT-silo — **ingen** auto-ingest från Familjen-input |

---

## 3. Gränssnitt och typer

Alla typer definieras i **`familjenInputModes.ts`**. Routern och delegates importerar endast därifrån — inga strängliteraler utspridda.

### 3.1 Mode union

```typescript
/** Canonical input modes — FamiljenInputSuperModule (Fas 7). */
export type FamiljenInputMode =
  | 'barnfokus'
  | 'livslogg_stund'
  | 'fysiologi'
  | 'livslogg_observation'
  | 'vardagsstruktur'
  | 'inkast';
```

### 3.2 Mode metadata

```typescript
export type FamiljenInputModeMeta = {
  id: FamiljenInputMode;
  label: string;
  description: string;
  /** Primär växlare vs "Mer…" */
  tier: 'primary' | 'more';
  /** Skriver till children_logs direkt (false = HITL/review only) */
  writesChildrenLogs: boolean;
  /** Erbjuder post-save Valv HITL (SaveAsEvidencePrompt) */
  offersVaultHitl: boolean;
  /** content_class enligt U6 */
  contentClass: 'PLAY' | 'EVIDENCE' | null;
};

export const FAMILJEN_INPUT_MODES: FamiljenInputModeMeta[] = [ /* se tabell §3.3 */ ];

export const FAMILJEN_INPUT_MODES_PRIMARY: FamiljenInputModeMeta[];
export const FAMILJEN_INPUT_MODES_MORE: FamiljenInputModeMeta[];

export const DEFAULT_FAMILJEN_INPUT_MODE: FamiljenInputMode = 'barnfokus';

export function isFamiljenInputMode(value: string | null | undefined): value is FamiljenInputMode;
export function parseFamiljenInputMode(value: string | null | undefined): FamiljenInputMode;
export function getFamiljenInputModeMeta(mode: FamiljenInputMode): FamiljenInputModeMeta;
```

### 3.3 Exakta lägesdefinitioner (6 st)

| Mode ID | Label (UI) | Description | tier | writesChildrenLogs | offersVaultHitl | contentClass |
|---------|------------|-------------|------|--------------------|-----------------|--------------|
| `barnfokus` | Barnfokus | Dagens fråga — roligt, knas, lära känna | primary | **true** | **false** | `PLAY` |
| `livslogg_stund` | Ny stund | Positiv stund med barnet | primary | **true** | **false** | `EVIDENCE` |
| `fysiologi` | Fysiologi | Sömn, ångest, aptit 1–5 | primary | **true** | **false** | `EVIDENCE` |
| `livslogg_observation` | Livslogg | Neutral observation + valfri påverkan | primary | **true** | **true** | `EVIDENCE` |
| `vardagsstruktur` | Vardagsstruktur | Rutin / husregler i praktiken | primary | **true** | **false** | `EVIDENCE` |
| `inkast` | Inkast | Granska innan spar till rätt silo | more | **false**¹ | **false**² | null |

¹ Skriver indirekt via G10 efter användaren godkänner i review-kö — **inte** direkt från routern.  
² Valfri Valv-bro via `InkastBarnenValvBridge` **efter** persist — aldrig auto.

### 3.4 Per-läge save-kontrakt (Firestore payload)

Alla direkta writes går via **`useFamiljenShell`** handlers → **`saveChildrenLog()`**. Routern/delegates får **aldrig** anropa Firestore direkt.

#### `barnfokus`

```typescript
// Handler: shell.handleSaveBarnfokus(observation, question)
{
  childAlias: ChildAlias;
  observation: string;          // `[${question.kind}] ${text}`
  action: 'livslogg';
  category: 'barnfokus';
  bankId?: string;              // BP-PLAY-* från BARNFOKUS_QUESTIONS
  channel: 'familjen';          // sätts i saveChildrenLog wrapper (Fas 7B)
}
```

**Locked UX:** Optimistic rad i `barnfokusMemory` före server-id (§1 locked-ux).

#### `livslogg_stund`

```typescript
// Handler: shell.handleSaveObservation
// Delegate: ChildSubLogPanel variant="stund"
{
  childAlias: ChildAlias;
  observation: string;
  action: 'livslogg';
  category: LivsloggCategory;   // default positivt; ankare via resolveStundCategory
  childrenImpact?: string;
  channel: 'familjen';
}
```

#### `fysiologi`

```typescript
// Handler: shell.handleSavePhysio
{
  childAlias: ChildAlias;
  action: 'fysiologi';
  signals: { somn: 1|2|3|4|5; angest: 1|2|3|4|5; aptit: 1|2|3|4|5 };
  observation: '';              // tom sträng tillåten
  channel: 'familjen';
}
```

#### `livslogg_observation`

```typescript
// Handler: shell.handleSaveObservation
// Delegate: ChildSubLogPanel variant="livslogg"
{
  childAlias: ChildAlias;
  observation: string;
  action: 'livslogg';
  category: LivsloggCategory;   // vardag | skola | tredjepart | halsa | overlamning
  childrenImpact?: string;
  channel: 'familjen';
}
```

**Post-save HITL:** `SaveAsEvidencePrompt` med `childrenLogId` — **aldrig** auto.

#### `vardagsstruktur`

```typescript
// Handler: shell.handleSaveObservation (via BarnfokusReglerCard)
{
  childAlias: ChildAlias;
  observation: string;          // prefix: `[Vardagsstruktur · Rutintest] …`
  action: 'livslogg';
  category: 'vardagsstruktur';
  channel: 'familjen';
}
```

**Obs:** Regellistan i `BarnfokusReglerCard` förblir **local React state** — endast observations-textarea persistens.

#### `inkast`

```typescript
// Ingen direkt saveChildrenLog från delegate.
// CaptureSuperModule variant="familjen" → submitCaptureDraft / submitInkastLite
// sourceModule: 'familjen_inkast'
// Backend DCAP → ev. persistChildrenLogFromInbox → children_logs
// UI: ReviewQueuePipelinePanel + valfri InkastBarnenValvBridge efter persist
```

### 3.5 Router props

```typescript
import type { FamiljenShell } from '../hooks/useFamiljenShell';

export type FamiljenInputSuperModuleProps = {
  /** Obligatorisk — all state och writes från parent (FamiljenPage). */
  shell: FamiljenShell;
  /** Override URL-parsing (t.ex. Storybook). */
  initialMode?: FamiljenInputMode;
  /** Callback efter lyckat spar (valfritt — t.ex. scroll till minneslista). */
  onSaved?: (mode: FamiljenInputMode, logId?: string) => void;
};
```

### 3.6 Delegate props (gemensamt mönster)

```typescript
export type FamiljenDelegateBaseProps = {
  shell: FamiljenShell;
  onSaved?: (logId?: string) => void;
};
```

Varje delegate implementerar `FamiljenDelegateBaseProps` och **endast** anropar shell-handlers.

---

## 4. Komponentarkitektur

### 4.1 Filstruktur

```
src/modules/features/family/children/supermodule/
  FamiljenInputSuperModule.tsx       # Canonical router — inga Firestore-anrop
  familjenInputModes.ts              # Typer, metadata, parse helpers
  delegates/
    FamiljenBarnfokusDelegate.tsx
    FamiljenLivsloggStundDelegate.tsx
    FamiljenFysiologiDelegate.tsx
    FamiljenLivsloggObservationDelegate.tsx
    FamiljenVardagsstrukturDelegate.tsx
    FamiljenInkastDelegate.tsx
  index.ts
```

**Mönster:** Identiskt med `MabraInputSuperModule` — tunn router, writes endast i shell/delegates via befintliga helpers.

### 4.2 `FamiljenInputSuperModule.tsx`

| Ansvar | Detalj |
|--------|--------|
| Lägesväxlare | Primär rad (max 5) + "Mer…" för `inkast` |
| URL-sync | `inputMode` query param |
| Barnkontext | Renderar **inte** picker — parent (`FamiljenPage`) visar `FamiljenChildPicker` ovanför hub |
| Delegate switch | `switch (activeMode)` → en delegate i taget |
| Container | `calm-card glow-bottom-blue` (§8) |
| Förbjudet | `saveChildrenLog`, `saveVaultLog`, `collection()`, direkta callable-anrop |

**Pseudostruktur:**

```tsx
export function FamiljenInputSuperModule({ shell, onSaved }: FamiljenInputSuperModuleProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeMode = parseFamiljenInputMode(searchParams.get('inputMode'));

  const setActiveMode = (mode: FamiljenInputMode) => { /* replace URL, ej reload */ };

  return (
    <section className="calm-card glow-bottom-blue …" aria-label="Familjen inmatningshub">
      <ModeSwitcher primary={FAMILJEN_INPUT_MODES_PRIMARY} more={FAMILJEN_INPUT_MODES_MORE} … />
      {activeMode === 'barnfokus' && <FamiljenBarnfokusDelegate shell={shell} onSaved={…} />}
      {/* … övriga lägen … */}
    </section>
  );
}
```

### 4.3 Delegate-paneler (6 st)

| Delegate | Wrappar | Befintlig komponent | Write-väg |
|----------|---------|---------------------|-----------|
| **`FamiljenBarnfokusDelegate`** | Barnfokus + minneslista | `BarnfokusFraganPanel` | `handleSaveBarnfokus` |
| **`FamiljenLivsloggStundDelegate`** | Ny stund | `ChildSubLogPanel` `variant="stund"` | `handleSaveObservation` |
| **`FamiljenFysiologiDelegate`** | Skala + spara | `PhysiologicalControls` + save-knapp | `handleSavePhysio` |
| **`FamiljenLivsloggObservationDelegate`** | Forensisk observation | `ChildSubLogPanel` `variant="livslogg"` | `handleSaveObservation` + `SaveAsEvidencePrompt` |
| **`FamiljenVardagsstrukturDelegate`** | Rutinobservation | `BarnfokusReglerCard` (observations-UI) | `handleSaveObservation` |
| **`FamiljenInkastDelegate`** | Inkast review | `CaptureSuperModule` `variant="familjen"` | G10 pipeline (HITL) |

#### `FamiljenBarnfokusDelegate`

- Props: `childAlias`, `memoryRows` från `shell.barnfokusMemory`, `onSave` → `shell.handleSaveBarnfokus`
- **MUST:** Behåll knappcopy **Spara till {barn}s logg**, **Annan fråga**, optimistic lista (locked §1)
- **MUST NOT:** Ändra `BARNFOKUS_QUESTIONS` eller `barnfokusQuestionForToday`

#### `FamiljenLivsloggStundDelegate`

- Monterar `ChildSubLogPanel` med `variant="stund"`, `userId={shell.user.uid}`
- `onSave` → `shell.handleSaveObservation`
- **Ingen** `SaveAsEvidencePrompt` i v1 (stund = trygg hamn, inte default bevis)

#### `FamiljenFysiologiDelegate`

- Monterar `PhysiologicalControls` med `shell.signals` / `shell.setSignals`
- Spara-knapp anropar `shell.handleSavePhysio`; visar `shell.loading` / `shell.error`
- **Ingen** BalansMatare i delegate (read-only — stannar i reflektion/om-vy utanför hub v1)

#### `FamiljenLivsloggObservationDelegate`

- Monterar `ChildSubLogPanel` `variant="livslogg"`
- Efter spar: befintlig `SaveAsEvidencePrompt` i panelen — **oförändrad**
- `buildVaultPayloadFromChildLog` + `sourceRef: children_logs/{id}` — **oförändrad**

#### `FamiljenVardagsstrukturDelegate`

- Monterar endast observations-delen av `BarnfokusReglerCard` (`onSaveLog` → `handleSaveObservation`)
- Regellista förblir lokal state i delegate/wrapped card

#### `FamiljenInkastDelegate`

- Monterar `CaptureSuperModule variant="familjen"` (ny variant — Fas 7D)
- `sourceModule: 'familjen_inkast'` i `CaptureSuperModule.SOURCE_MODULE`
- `ReviewQueuePipelinePanel` summary under compose (samma mönster som `mabra`)
- **MUST NOT:** Auto-anropa `saveVaultLog` eller `saveChildrenLog` utan review

### 4.4 Mount i `FamiljenPage`

**Fas 7A (skelett):**

```tsx
// FamiljenPage — reflektion-flik ( eller dedikerad /familjen/input route Fas 7B )
{activeTab === 'reflektion' && (
  <>
    <FamiljenChildPicker … />
    <FamiljenInputSuperModule shell={shell} />
    {/* Read-only kvar under hub: BalansMatare, ChildrenLogsChat — Fas 7C flytt-plan */}
  </>
)}
```

**Fas 7C:** Avveckla duplicerad mount av `BarnfokusFraganPanel` / `ChildSubLogPanel` utanför hub i reflektion/livslogg.

---

## 5. Tillståndshantering och routing

### 5.1 URL och entry

| Entry | Fas | Beteende |
|-------|-----|----------|
| `/familjen?tab=reflektion` | 7A | Default `inputMode=barnfokus` (implicit) |
| `/familjen?tab=reflektion&inputMode=fysiologi` | 7B | Deep link till läge |
| `/familjen/input?inputMode=…` | 7B | Dedikerad route (paritet med `/mabra/input`) |
| `/widget/familjen` | 7E | Deep-link → `?inputMode=livslogg_stund` (valfritt) |

**Query-param:** `inputMode` — endast värden i `FamiljenInputMode`. Okänt värde → `DEFAULT_FAMILJEN_INPUT_MODE`.

**Tab vs läge:** `tab` styr FamiljenPage shell (reflektion, livslogg, …). `inputMode` styr **endast** Superhub-läge. Vid byte av `tab` away from input-hub: **behåll** `inputMode` i URL (restore vid återkomst).

### 5.2 Shell-state (`useFamiljenShell`)

| State | Ägs av | Superhub-användning |
|-------|--------|---------------------|
| `activeChild` | shell | Alla delegates läser samma barn |
| `signals` | shell | Endast `FamiljenFysiologiDelegate` |
| `logs`, `barnfokusMemory` | shell | Barnfokus delegate minneslista |
| `loading`, `error` | shell | Delad feedback |
| `evidenceForLogId` | shell | Timeline HITL utanför hub (oförändrat) |

**Shell skapas en gång i `FamiljenPage`** — skickas som prop. Superhub anropar **inte** `useFamiljenShell()` internt (undvik dubbel subscription).

### 5.3 Lägesbyte utan dataläckage

| Händelse | Åtgärd |
|----------|--------|
| Byte `inputMode` (URL) | Unmount föregående delegate → `ChildSubLogPanel` cleanup (befintlig `useEffect`) |
| Byte `activeChild` | Shell reset: `signals`, `error`, `evidenceForLogId` (befintlig `useEffect` rad 44–48) |
| Delegate unmount | Textarea-state i delegate/local panel — **renas** (ChildSubLogPanel redan implementerat) |
| Logout / `invalidateSession` | Global store clear — inga hub-specifika caches |
| Lyckat spar | Valfri `onSaved(mode, logId)` — **ingen** auto-byte av läge |

**Förbjudet:**

- Persistens av halvfylld observation i `localStorage` / `sessionStorage` för `children_logs`-lägen
- Dela textarea-state mellan lägen
- Behålla `observation` i URL eller Zustand efter spar

### 5.4 Auth-gate

- `FamiljenPage` kräver `shell.user` — hub renderas inte för anonym
- Delegates kastar **Ej inloggad** om `handleSave*` anropas utan user (befintligt beteende)

---

## 6. Säkerhetsimplementering

### 6.1 WORM (append-only)

| Steg | Var | Implementation |
|------|-----|----------------|
| 1 | Client write | **Endast** `saveChildrenLog()` → `guardedAddDoc()` |
| 2 | Payload | `assertWormPayload(payload, 'children_logs')` före write |
| 3 | Rules | `firestore.rules`: `allow create`; `update, delete: false` |
| 4 | Router | `FamiljenInputSuperModule` + delegates — **inga** `updateDoc` / `deleteDoc` |
| 5 | Valv | Separat `saveVaultLog()` — endast via HITL, egen WORM-samling |

**Superhub får inte:** införa redigering av befintliga `children_logs`-rader, soft-delete, eller `updatedAt`-fält.

### 6.2 Tre silos (U1) — endast Barnen write

| Silo | Superhub | Teknisk enforcement |
|------|----------|---------------------|
| **Barnen** | ✅ Enda write-target | Alla `handleSave*` → `saveChildrenLog` → collection `children_logs` |
| Kunskap | ❌ | Ingen `ingestKampsparEntry`, ingen `knowledgeVaultQuery` i delegates |
| Valv | ❌ direkt | Endast `SaveAsEvidencePrompt` → `saveVaultLog` efter explicit klick |

**Read-only RAG:** `ChildrenLogsChat` stannar **utanför** routern; anropar endast `childrenLogsQuery` callable. Superhub-lägen får **inte** mounta Kunskap- eller Valv-chatt.

**Inkast DCAP:** Backend `routeFromDcap` / `inboxClassifier` — Familjen-variant sätter `sourceModule: 'familjen_inkast'`. Vid Barnen-target: `persistChildrenLogFromInbox` — **inte** `reality_vault` utan review.

**Ex/konflikt-guard:** Ingen ny guard i routern v1 — befintlig policy: **inte** spara vuxenkonflikt i barnlogg; användare dirigeras till Hamn/Speglar via produktcopy (ej auto-klassificering i hub).

### 6.3 Offline-block

| Steg | Var | Beteende |
|------|-----|----------|
| 1 | `offlineWritePolicy.ts` | `children_logs` ∈ `OFFLINE_WRITE_BLOCKED_COLLECTIONS` |
| 2 | `saveChildrenLog` | `assertOfflineWriteAllowed('children_logs')` — kastar `OfflineWriteBlockedError` |
| 3 | UI | Delegates visar **`offlineWriteUserMessage()`** — **ingen** tyst SDK-kö |
| 4 | Barnporten | Separat `barnportenOfflineQueue` — **ej** Superhub; flush via `flushBarnportenOfflineQueue` |

**Implementationskrav (Fas 7B):** Alla save-knappar i delegates ska fånga `OfflineWriteBlockedError` och visa lågaffektivt fel — samma mönster som övriga WORM-ytor.

### 6.4 HITL (Human-in-the-Loop)

| Flöde | Trigger | Implementation |
|-------|---------|----------------|
| Livslogg → Valv | Efter `livslogg_observation` save | `SaveAsEvidencePrompt` — oförändrad |
| Inkast → Barnen | Efter G10 persist | Review queue; valfri `InkastBarnenValvBridge` |
| Barnporten | `?tab=barnporten` | **Utanför** hub — locked §7b orörd |

**MUST:** `sourceRef: children_logs/{id}` på alla Valv-promotioner via `buildVaultPayloadFromChildLog`.

**MUST NOT:** Auto-promote efter `barnfokus`, `livslogg_stund`, `fysiologi`, `vardagsstruktur`, eller inkast utan godkännande.

### 6.5 Zero Footprint

| Mekanism | Krav |
|----------|------|
| Form cleanup | Delegates unmount → rensa textarea (befintligt i `ChildSubLogPanel`) |
| Shell cleanup | `evidenceForLogId` null vid barnbyte/unmount |
| Logout | `invalidateSession` — global |
| Inkast utkast | Draft Layer / IndexedDB — **inte** `children_logs` förrän godkänd |

### 6.6 Innehåll (U6)

| Läge | content_class | bankId |
|------|---------------|--------|
| `barnfokus` | PLAY | `BP-PLAY-*` från `barnfokusCatalog.ts` |
| Övriga write-lägen | EVIDENCE | — |

**MUST NOT:** Auto-promote PLAY-innehåll till Valv. FACT-innehåll i barninput — förbjudet.

---

## 7. UX och styling — Indigo-glöd

Familjen Superhub ska visuellt skiljas från MåBra Fas 6 (smaragd) genom **indigo bottom-glow** enligt [`design-calm.mdc`](../../.cursor/rules/design-calm.mdc) och [`COLOR-POLICY.md`](../design/COLOR-POLICY.md).

### 7.1 Container (hub)

| Klass | Syfte |
|-------|--------|
| `calm-card` | Semi-transparent yta, `backdrop-blur-xl`, `rounded-2xl` |
| **`glow-bottom-blue`** | Indigo bottom-glow — **obligatorisk** på Superhub-container |
| `border border-border/30` | Subtil kant |
| `bg-surface-2/70` | Obsidian Calm yta |

**`glow-bottom-blue` definition (kanon):**

```css
border-b-2 border-indigo-500/70
shadow-[0_4px_20px_-2px_rgba(99,102,241,0.3)]
```

### 7.2 Lägesväxlare

| Element | Klass |
|---------|-------|
| Inaktiv pill | `chip--idle`, `text-text-dim` |
| Aktiv pill | `chip--active`, **`text-accent`** (guld — aktiv chrome enligt COLOR-POLICY) |
| Sektionstitel | `font-display-serif`, `tracking-[0.2em]`, uppercase, `text-text` |
| Beskrivning | `text-xs text-text-muted` |

**Progressive disclosure:** Max **5 primära** lägen synliga; `inkast` under **Mer…** (expand/collapse).

### 7.3 Delegate-innehåll

- Befintliga paneler behåller egna `BentoCard`-glow där applicerbart
- **`BarnfokusFraganPanel`:** behåll `glow="green"` på kortet (PLAY-innehåll) — hub-container förblir indigo
- **`ChildSubLogPanel`:** neutral `border-border` — ingen konkurrerande full-card glow

### 7.4 Förbjudet

- Smaragd `glow-bottom-green` på **hub-container** (reserverad MåBra)
- Streak, XP, count-up
- Turkos som aktiv chrome
- Naturtema

### 7.5 Jämförelse Fas 6 vs Fas 7

| | MåBra (Fas 6) | Familjen (Fas 7) |
|---|---------------|------------------|
| Hub glow | `glow-bottom-green` | **`glow-bottom-blue`** |
| Silo | Vit / utveckling | Barnen |
| Collection | `vit_entries`, `emotional_memory`, … | **`children_logs`** |
| Default läge | `checkin` | **`barnfokus`** |

---

## 8. Implementationsfaser

### Fas 7A — Router-skelett ( första kod-PR )

- [ ] `familjenInputModes.ts` — full typunion + metadata
- [ ] `FamiljenInputSuperModule.tsx` — lägesväxlare + **ett** läge (`barnfokus`)
- [ ] `FamiljenBarnfokusDelegate.tsx`
- [ ] Mount i `FamiljenPage` (reflektion) **eller** route `/familjen/input`
- [ ] Ingen ny Firestore-logik; ingen `CaptureSuperModule`-ändring än
- [ ] Smoke: `npm run build`, `smoke:locked-ux`, `smoke:children`

### Fas 7B — Stund + fysiologi

- [ ] Delegates: `FamiljenLivsloggStundDelegate`, `FamiljenFysiologiDelegate`
- [ ] Lägen i router: `livslogg_stund`, `fysiologi`
- [ ] `FamiljenChildPicker` synlig ovanför hub för alla write-lägen
- [ ] Offline-felhantering i save-knappar

### Fas 7C — Livslogg observation + vardagsstruktur

- [ ] Delegates: `FamiljenLivsloggObservationDelegate`, `FamiljenVardagsstrukturDelegate`
- [ ] HITL oförändrad via `SaveAsEvidencePrompt`
- [ ] Avveckla duplicerad panel-mount i `FamiljenReflektionTab` / `FamiljenLivsloggTab`

### Fas 7D — Inkast

- [ ] `FamiljenInkastDelegate.tsx`
- [ ] `CaptureSuperModule`: variant **`familjen`**, `sourceModule: 'familjen_inkast'`
- [ ] Smoke: `smoke:inkast`, `smoke:children`

### Fas 7E — Lås

- [ ] `.context/locked-ux-features.md` §12
- [ ] `.context/system-plan.md` — Fas 7 **AVSLUTAD**
- [ ] PMIR + explicit OK (Pontus)
- [ ] **Låst** — ingen AI-ändring av kärnlogik utan åsidosättande tillstånd

---

## 9. Acceptanskriterier (Fas 7E)

- [ ] Ett läge i taget synligt; byte utan full sidreload
- [ ] Inga nya spridda textarea utanför Superhub (Familjen write-zon)
- [ ] `npm run smoke:locked-ux` PASS (Barnfokus §1 + Barnporten §7b orörda)
- [ ] `npm run smoke:children` PASS
- [ ] `npm run smoke:innehall` PASS (`bankId` på barnfokus)
- [ ] Manuell: barnfokus optimistic save → server-id
- [ ] Manuell: livslogg_observation → HITL → Valv med `sourceRef`
- [ ] Manuell: offline → tydligt fel för `children_logs`
- [ ] Hub-container: **`glow-bottom-blue`** synlig; skiljd från MåBra smaragd

---

## 10. Referenser (kod idag)

| Fil | Roll |
|-----|------|
| `FamiljenPage.tsx` | Shell mount |
| `useFamiljenShell.ts` | State + write handlers |
| `BarnfokusFraganPanel.tsx` | Locked barnfokus |
| `ChildSubLogPanel.tsx` | Stund / livslogg |
| `PhysiologicalControls.tsx` | Fysio skala |
| `BarnfokusReglerCard.tsx` | Vardagsstruktur |
| `SaveAsEvidencePrompt.tsx` | HITL Valv |
| `CaptureSuperModule.tsx` | Inkast-mönster (+ `familjen` Fas 7D) |
| `MabraInputSuperModule.tsx` | Referens-router |
| `firestore.ts` | `saveChildrenLog` |
| `offlineWritePolicy.ts` | Offline block |

---

## 11. Changelog

| Datum | Händelse |
|-------|----------|
| 2026-06-14 | SPEC godkänd efter [`Familjen-INPUT-SUPERHUB-EVAL.md`](../evaluations/Familjen-INPUT-SUPERHUB-EVAL.md) |
