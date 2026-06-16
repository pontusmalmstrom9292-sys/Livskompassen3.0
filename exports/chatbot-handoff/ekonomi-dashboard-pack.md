This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/specs/Ekonomi-INPUT-SUPERHUB-SPEC.md, src/modules/features/dailyLife/wellbeing/economy/supermodule/EkonomiInputSuperModule.tsx, src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx, .context/design-language.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

## File: .context/design-language.md
````markdown
# Visuell Estetik och Designspråk

**Canonical:** [`docs/specs/design-master.md`](../docs/specs/design-master.md)  
**Aktivt tema:** **Theme Pack I** (default) + **Pack J** (auto per hub) — [`THEME-I-SPEC.md`](../docs/design/themes/I-architect-vault/THEME-I-SPEC.md) · [`J-PACK-EIGHT-HUBS.md`](../docs/design/themes/J-PACK-EIGHT-HUBS.md)

## Theme Pack I (prod 2026-05-24)

| ID | Modul |
|----|-------|
| I-stone | Hem, Valv, Widget expanded |
| I-alchemical | Kompass, Rutiner, Budget |
| I-skymning | MåBra, KBT, Familjen |
| I-hamn | Hamn |
| I-glass | Widget peek |

**Runtime:** `src/modules/core/theme/themeRegistry.ts` · **Preview:** `/dev/themes`  
**Default:** `E-skymning-prod` · **Auto per route:** `moduleThemeMap.ts` (hel-E)

## Estetik (Tema E prod — `E-skymning-prod`)

- Bakgrund: skog-teal `#0a1614`, skymning `#12151f`, kompass-skiva `#0d3b3b`, guld `#d4af37`
- Typografi: **Cinzel** (hub-rubriker via `font-display-serif`), **Outfit** (övriga rubriker), **Inter** (bröd)
- Dock: klassisk triad (`VITE_DOCK_MODE=classic` default) — [`DOCK-KANON.md`](../docs/design/references/DOCK-KANON.md)
- Skala: [`TYPE-SCALE.md`](../docs/design/TYPE-SCALE.md) · `HubPageShell`
- Smart widget: `FyrenSmartWidgetBar` — hidden / peek / expanded
- Progressive disclosure — ett steg i taget
- **Förbjudet globalt:** indigo/lila text-accent, natur-tapeter

## Ikoner (Premium Helros)

- **Låst:** D1 kompass · M2 Kompis — [`.context/locked-icons.md`](locked-icons.md) · app-ikon upplåst (P1–P5)
- **Stilguide:** [`docs/design/ICON-STYLE-GUIDE.md`](../docs/design/ICON-STYLE-GUIDE.md)
- **Övriga chrome:** `docs/design/icons-proposals/2026-05-26-v4-round2-dna/` · hub v5 `2026-05-29-gold-hub-v5/`

## Centrala Element

- **LivskompassHero:** guld kompass-hub på Hem
- **FyrenSmartWidgetBar:** klocka, Fokus·Struktur·Närvaro, WORM-routes
- **Sub-Synaptisk Bakgrund:** `AmbientBackground` + `data-theme-bg`

## Tailwind / CSS

- Tokens: `themeRegistry.ts` → `applyTheme()` → `:root` + `html[data-theme]`
- Glass: guld border 2px, accent-glow på widget-ikoner
- Chrome (dock/widget/meny): [CHROME-POLICY.md](../docs/design/CHROME-POLICY.md) · **låst ember:** [CHROME-EMBER-KANON.md](../docs/design/CHROME-EMBER-KANON.md) · nav: `navTruth.ts`
- Hub-färger (J-pack): se [COLOR-POLICY.md](../docs/design/COLOR-POLICY.md)
````

## File: docs/specs/Ekonomi-INPUT-SUPERHUB-SPEC.md
````markdown
# Ekonomi — Universal Input Superhub (SPEC)

**Datum:** 2026-06-14  
**Status:** **Godkänd för implementation (Fas 8A→E)** — teknikledare (Pontus) 2026-06-14  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) § Fas 6 (zon 3: Super-Ekonomi Input) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §3, §8 · [`Ekonomi-SPEC.md`](./modules/Ekonomi-SPEC.md) · [`docs/architecture/INFINITE_EVOLUTION.md`](../architecture/INFINITE_EVOLUTION.md)  
**Analys:** [`docs/evaluations/Ekonomi-INPUT-SUPERHUB-EVAL.md`](../evaluations/Ekonomi-INPUT-SUPERHUB-EVAL.md)  
**Referensmönster:** [`Mabra-INPUT-SUPERHUB-SPEC.md`](./modules/Mabra-INPUT-SUPERHUB-SPEC.md) · [`Familjen-INPUT-SUPERHUB-SPEC.md`](./Familjen-INPUT-SUPERHUB-SPEC.md)

---

## 1. Syfte

Ersätta **spridda inmatningsformulär** i Ekonomi-zonen med en polymorf **Universal Input Hub** — `EkonomiInputSuperModule` — där användaren byter **läge** (saldo, mikrosteg, kuvert, spar, impuls, matprep, inkast) **utan sidbyte**, med **kapacitetsstyrd progressive disclosure** enligt Infinite Evolution.

Ekonomi förblir **lugn vardagsmodul** (inga grafer, streaks, LLM-coach). Superhubben är **inmatnings- och spar-yta** för vardagsekonomi (`transactions` + mutable stöd), inte ersättning för Arbetsliv (stämpel, ledger-logg), Valv (lön/frånvaro) eller Kunskap (FACT-seed).

---

## 2. Scope och avgränsning

### In scope

- Router-komponent + **kapacitetsmedveten** lägesväxlare
- Åtta input-lägen med **tunna delegate-paneler** → befintliga komponenter
- Canonical entry: `/vardagen?tab=ekonomi&inputMode=…`
- Shadow rollout: `?superhub=true` (Fas 8A–8D)
- `capacityResolver.ts` — **en** canonical kapacitetsadapter
- Metadata på sparade objekt där schema tillåter: `zone`, `inputMode`, `channel`
- Färgburkar: guld zon (`glow-bottom-gold`, `calm-card`)
- `CaptureSuperModule` variant **`ekonomi`** (Fas 8D)

### Out of scope (v1 Superhub)

- Ny Firestore-samling
- Cross-RAG / LLM-coach i ekonomi-zonen (U6 — [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md))
- Auto-promote till `reality_vault` eller Dossier
- **`economy_ledger`** — all skrivning förblir på **Arbetsliv** (`EconomyLogPanel`)
- **`time_entries`** / stämpel — **Arbetsliv** (`/arbetsliv`)
- Ersätta `/ekonomi/avancerad` aggregate dashboard (behålls parallellt)
- Backend-ändring av `mabraEconomySync` utom dokumenterad sync till `user_capability_state` (Fas 8D)

### Skild från (oförändrat)

| Zon | Roll |
|-----|------|
| **Arbetsliv** (`/arbetsliv`) | Stämpel, tid, `economy_ledger`, fasta räkningar — locked UX §8 |
| **Valv** | Frånvaro, lönespec forensik — PIN |
| **Kunskap** | `kunskap-fact-009` (`ekonomi_vardag`) — seed only, **ingen** live-ingest från hub |
| **Planering** | Kanban/inkorg — separat Superhub (Fas 9+) |

---

## 3. Kärnarkitektur

### 3.1 Komponentträd

```
src/modules/features/dailyLife/wellbeing/economy/supermodule/
  EkonomiInputSuperModule.tsx       # Canonical router — NO Firestore
  ekonomiInputModes.ts              # Mode union, labels, capacity tier, metadata
  capacityResolver.ts               # Canonical kapacitetsadapter (§4)
  index.ts
  delegates/
    EkonomiSaldoDelegate.tsx        # Fas 8A
    EkonomiMikrostegDelegate.tsx    # Fas 8B
    EkonomiProfilDelegate.tsx       # Fas 8B
    EkonomiMatprepDelegate.tsx      # Fas 8C
    EkonomiKuvertDelegate.tsx       # Fas 8C
    EkonomiSparDelegate.tsx         # Fas 8C
    EkonomiImpulsDelegate.tsx       # Fas 8D
    EkonomiInkastDelegate.tsx       # Fas 8D
    EkonomiArbetslivBroDelegate.tsx # Fas 8D — navigation only (ersätter tid-tab)
```

**Arkitekturregler (oförändrade från Fas 6/7):**

| Regel | Krav |
|-------|------|
| Tunn router | `EkonomiInputSuperModule` delegerar — **inga** `addDoc` / `updateDoc` / `deleteDoc` |
| Writes | Endast via befintliga helpers: `saveEconomyTransaction`, `economyFirestore`, `EconomyGateway` |
| Container | `calm-card glow-bottom-gold overflow-hidden rounded-2xl` |
| Mode union | Alla mode-strängar definieras **endast** i `ekonomiInputModes.ts` |

### 3.2 `EkonomiInputSuperModule` — routeransvar

| Ansvar | Ägare |
|--------|--------|
| Läsa `inputMode` från URL | Router |
| Anropa `resolveEconomyCapacity()` | Router (via `capacityResolver`) |
| Filtrera **synliga** modes (ej i DOM om låst) | Router |
| Tvinga fallback om URL-mode otillåten | Router → `DEFAULT_EKONOMI_INPUT_MODE` |
| Rendera kapacitetsnotis (låg nivå) | Router — `EconomyCapacityLockedNotice` compact |
| Mounta exakt **en** delegate | Router |
| Lyssna `user_capability_state` | Router (startar `listenToCapacityState`) |
| Lyssna `evolution_hub` | Router (befintlig `useEvolutionSync` / store) |

**Router får inte:** wrappa enskilda delegates i `EconomyAdvancedGate` — gating sker **före** mode-lista.

### 3.3 Delegate-kontrakt (exakt mapping)

| Delegate | Wrappar / använder | Write-target | Fas |
|----------|-------------------|--------------|-----|
| **`EkonomiSaldoDelegate`** | `EconomyQuickBalancePanel` | `transactions` (read + quick add) | 8A |
| **`EkonomiMikrostegDelegate`** | Vinst-knapp + valfri enkel beloppsrad (`useEconomyBudget.quickAdd`) | `transactions` (`vinst`, `ovrigt`) | 8B |
| **`EkonomiProfilDelegate`** | Profil-fält från `EconomyBudgetTab` (veckobudget, matlåda-preset) | `economy_profiles` | 8B |
| **`EkonomiMatprepDelegate`** | `EconomyMealPrepPanel` | meal prep doc, ev. `transactions`, `budget_savings` | 8C |
| **`EkonomiKuvertDelegate`** | `EconomyEnvelopeSection` | `budgets` | 8C |
| **`EkonomiSparDelegate`** | `EconomySavingsPanel` (generell + valfri family-filter) | `budget_savings` | 8C |
| **`EkonomiImpulsDelegate`** | `EconomyImpulsePanel` (med fixad kapacitetströskel — §4.5) | `economy_impulse_queue` | 8D |
| **`EkonomiInkastDelegate`** | `CaptureSuperModule variant="ekonomi"` | HITL → `transactions` eller `economy_impulse_queue` | 8D |
| **`EkonomiArbetslivBroDelegate`** | Länkkort till `/arbetsliv?tab=stampla` + `/arbetsliv?tab=logg` | **Ingen write** | 8D |

**Shell:** Till skillnad från Familjen finns **ingen** `useEkonomiShell` idag. Delegates använder **`useEconomyBudget`** och befintliga panel-hooks direkt. Routern skickar endast `userId` och `capacityContext` som props.

---

## 4. Kapacitetsmatrisen (`capacityResolver`)

### 4.1 Problemet (tre källor idag)

| Källa | Collection / store | Skrivare | Fält |
|-------|-------------------|----------|------|
| **A** | `user_capability_state/{uid}` | Orkester / capacity engine (UI) | `capacityScore`, `economy_advanced` |
| **B** | `user_economy_status/{uid}` | `mabraEconomySync` (Cloud Function) | `economy_advanced` |
| **C** | `evolution_hub/{uid}` | Evolution / manuell flag | `unlockedFeatureFlags[]` → `economy_advanced` |

**Circuit breaker (CB):** 48h MåBra-checkin-snitt `< SAFETY_THRESHOLD` (7.0 på skala 1–10) — samma logik som `useEconomySync` och `mabraEconomySync`.

### 4.2 Canonical resolver — `resolveEconomyCapacity()`

**Fil:** `capacityResolver.ts`  
**Input:** `{ uid, capabilityState, economyStatus, evolutionFlags, checkins48h }`  
**Output:** `EconomyCapacityContext`

```typescript
export type EconomyCapacityLevel = 'critical' | 1 | 2 | 3;

export type EconomyCapacityContext = {
  level: EconomyCapacityLevel;
  /** Normaliserad 0–1 — från user_capability_state.capacityScore */
  capacityScore: number;
  circuitBreakerActive: boolean;
  economyAdvancedUnlocked: boolean;
  /** Modes tillåtna i lägesväxlare — beräknade, ej hårdkodade i UI */
  allowedModes: EkonomiInputMode[];
  isLoading: boolean;
};
```

### 4.3 Upplåsningsregler (löser konflikt A/B/C)

**Steg 1 — Circuit breaker (högsta prioritet):**

```
circuitBreakerActive =
  checkins48h.count > 0 AND checkins48h.averageMoodEnergy < SAFETY_THRESHOLD (7.0)
```

Om `circuitBreakerActive === true`:
- `economyAdvancedUnlocked = false`
- `level = 'critical'`
- `allowedModes = ['saldo']` endast

**Steg 2 — `economyAdvancedUnlocked` (konservativ AND):**

```
economyAdvancedUnlocked =
  NOT circuitBreakerActive
  AND capabilityState.economy_advanced === true
  AND economyStatus.economy_advanced === true
  AND evolutionFlags.includes('economy_advanced')
```

**Rationale:** Alla tre källor måste vara överens för upplåsning. Eliminerar “en flagga true, resten false”. Om `user_economy_status` saknas (doc finns inte) → behandla som `false` (fail-closed).

**Steg 3 — `capacityScore` normalisering:**

- `user_capability_state.capacityScore` **MÅSTE** behandlas som **0–1** (från `calculateCapacityScore`).
- Impuls-köp-block inom delegate: `capacityScore < 0.5` → blockera “Fortfarande ja” (ersätter felaktig tröskel `50`).

**Steg 4 — Nivå → modes:**

| `level` | Villkor | Tillåtna modes |
|---------|---------|----------------|
| **`critical`** | CB aktiv | `saldo` |
| **1** | `!economyAdvancedUnlocked` | `saldo`, `mikrosteg` |
| **2** | `economyAdvancedUnlocked` | Nivå 1 + `profil`, `matprep`, `kuvert`, `spar` |
| **3** | `economyAdvancedUnlocked` AND `capacityScore >= 0.5` | Nivå 2 + `impuls`, `inkast`, `arbetsliv_bro` |

**Default mode per nivå:**

| Nivå | Default `inputMode` |
|------|---------------------|
| critical | `saldo` |
| 1 | `saldo` |
| 2 | `saldo` |
| 3 | `saldo` |

**URL-sanering:** Om `inputMode` ∉ `allowedModes` → `replace` URL till högsta tillåtna mode (fallback `saldo`).

### 4.4 Datakällor i routern (implementation Fas 8A+)

| Signal | Hook / lyssnare | Obligatorisk |
|--------|-----------------|--------------|
| A | `useCapacityGate` → `user_capability_state` | Ja |
| B | `onSnapshot(user_economy_status/{uid})` i resolver eller router | Ja (ny prenumeration) |
| C | `useEvolutionStore.hasFeature('economy_advanced')` | Ja |
| CB | 48h checkins query (återanvänd logik från `useEconomySync`) | Ja |

**Deprecate:** Spridd `alsoUnlocked={hasAdvanced}` i `EconomyOverviewPanel` — ersätts av resolver.

**Fas 8D backend (sync):** `mabraEconomySync` **MÅSTE** spegla `economy_advanced` + `capacityScore` till `user_capability_state/{uid}` (merge) så A och B inte divergerar. `evolution_ledger` append vid permanent upplåsning enligt Infinite Evolution §2.

### 4.5 Kapacitetsmatris — sammanfattningstabell

| Mode ID | Label | Nivå 1 | Nivå 2 | Nivå 3 | critical |
|---------|-------|:------:|:------:|:------:|:--------:|
| `saldo` | Snabbsaldo | ✅ | ✅ | ✅ | ✅ |
| `mikrosteg` | Ett steg | ✅ | ✅ | ✅ | ❌ |
| `profil` | Veckobudget | ❌ | ✅ | ✅ | ❌ |
| `matprep` | Neuro-kost | ❌ | ✅ | ✅ | ❌ |
| `kuvert` | Kuvert | ❌ | ✅ | ✅ | ❌ |
| `spar` | Sparmål | ❌ | ✅ | ✅ | ❌ |
| `impuls` | Impulspaus | ❌ | ❌ | ✅ | ❌ |
| `inkast` | Inkast | ❌ | ❌ | ✅ | ❌ |
| `arbetsliv_bro` | Arbete & logg | ❌ | ❌ | ✅ (nav) | ❌ |

**UX — critical / Nivå 1:**

- Lägesväxlare visar **endast** tillåtna modes — inga disabled-knappar för låsta lägen.
- På `critical`: dölj `mikrosteg` och visa kort copy: *“Kognitiv paus — endast saldo just nu.”*
- På Nivå 1: visa `EconomyCapacityLockedNotice` compact under header (befintlig komponent).

---

## 5. Gränssnitt och typer (`ekonomiInputModes.ts`)

### 5.1 Mode union

```typescript
/** Canonical input modes — EkonomiInputSuperModule (Fas 8). */
export type EkonomiInputMode =
  | 'saldo'
  | 'mikrosteg'
  | 'profil'
  | 'matprep'
  | 'kuvert'
  | 'spar'
  | 'impuls'
  | 'inkast'
  | 'arbetsliv_bro';
```

### 5.2 Mode metadata

```typescript
export type EkonomiInputModeMeta = {
  id: EkonomiInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  minCapacityLevel: EconomyCapacityLevel | 1 | 2 | 3; // minimum level to show
  writesTransactions: boolean;
  writesMutable: boolean;
  navigationOnly: boolean;
};

export const DEFAULT_EKONOMI_INPUT_MODE: EkonomiInputMode = 'saldo';
```

### 5.3 Exakta lägesdefinitioner

| Mode ID | Label | tier | minLevel | writesTransactions | writesMutable | Collection(s) |
|---------|-------|------|----------|-------------------|---------------|---------------|
| `saldo` | Snabbsaldo | primary | critical | **true** | false | `transactions` |
| `mikrosteg` | Ett steg | primary | 1 | **true** | false | `transactions` |
| `profil` | Veckobudget | primary | 2 | false | **true** | `economy_profiles` |
| `matprep` | Neuro-kost | primary | 2 | optional | **true** | meal prep, `budget_savings` |
| `kuvert` | Kuvert | more | 2 | false | **true** | `budgets` |
| `spar` | Sparmål | more | 2 | false | **true** | `budget_savings` |
| `impuls` | Impulspaus | more | 3 | false | **true** | `economy_impulse_queue` |
| `inkast` | Inkast | more | 3 | efter HITL | optional | HITL-routing |
| `arbetsliv_bro` | Arbete & logg | more | 3 | false | false | — (länkar) |

### 5.4 Metadata på sparade objekt

**`transactions` (WORM):**

```typescript
{
  label: string;
  amountSek: number;
  category: 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt';
  // Fas 8B+ valfria fält om rules tillåter keysOnly-utökning:
  zone?: 'ekonomi';
  inputMode?: EkonomiInputMode;
  channel?: 'ekonomi_superhub';
}
```

**Regel:** Nya metadatafält får **endast** läggas till om `firestore.rules` `keys().hasOnly([...])` uppdateras i separat PR — annars håll metadata i befintliga `category` + `label`-prefix.

---

## 6. Data- och säkerhetskontrakt

### 6.1 Absolut WORM — `transactions`

| Steg | Var | Krav |
|------|-----|------|
| 1 | Client write | **Endast** `saveEconomyTransaction()` → `guardedAddDoc()` |
| 2 | Payload | `assertWormPayload(payload, 'transactions')` — **ingen** `updatedAt` / `deletedAt` |
| 3 | Rules | `firestore.rules`: create-only på `transactions` |
| 4 | Superhub | Delegates + router — **inga** `updateDoc` / `deleteDoc` på `transactions` |
| 5 | UI | **Ingen** “radera transaktion”-knapp i Superhub |

**Superhub får inte:** införa redigering, soft-delete eller `economy_ledger` som alternativ write-väg för vardagsflöden.

### 6.2 Förbud — `economy_ledger` och dubbel skrivning

| Förbjudet | Motivering |
|-----------|------------|
| Importera `addEconomyLedgerEntry` i Superhub / delegates | Ledger = **Arbetsliv**-zon |
| Importera `deleteEconomyLedgerEntry` | Bryter WORM-intention |
| Skriva samma händelse till **både** `transactions` och `economy_ledger` | Dubbel sanning |
| Migrera `EconomyLogPanel` till Superhub v1 | Zon-leak; separat Fas/Arbetsliv-spec |
| Auto-sync vardag → ledger | Endast explicit användarval i Arbetsliv (framtida produktbeslut) |

**Arbetsliv (`EconomyLogPanel`):** Delete-drift i legacy **MÅSTE** åtgärdas i separat PR (Arbetsliv), inte i Superhub — men Superhub **MÅSTE NOT** kopiera mönstret.

### 6.3 Mutable collections (tillåtna i Superhub)

| Collection | Operation | Helper |
|------------|-----------|--------|
| `economy_profiles` | merge set | `setEconomyProfile` / `setEconomyProfileExtended` |
| `budgets` | CRUD kuvert | `economyFirestore.setBudgetEnvelope` |
| `budget_savings` | CRUD mål | `economyFirestore.setBudgetSaving` |
| `economy_impulse_queue` | create, status update, delete | `EconomyGateway` / `economyFirestore` |

**`economy_impulse_queue`** är **kö-logik**, inte evidens-WORM — `update`/`delete` tillåtet enligt befintlig gateway.

### 6.4 U1 — tre silos (vardagsekonomi ≠ RAG-silo)

| Silo | Superhub | Enforcement |
|------|----------|-------------|
| Kunskap | ❌ | Ingen `knowledgeVaultQuery`, ingen `ingestKampsparEntry`, ingen FACT-coach UI |
| Valv | ❌ | Ingen `saveVaultLog`, ingen auto-promote från transaktioner |
| Barnen | ❌ | Ingen `saveChildrenLog` |

**INNEHALL-REGISTER:** `kunskap-fact-009` (`ekonomi_vardag`) — **endast** Kunskap-seed; **MUST NOT** renderas som live coach i Superhub.

**Ekonomi-data:** uid-scoped `ownerId` / `userId` på alla writes — **ingen** cross-user read/write.

### 6.5 Offline-kö (SDK persistence)

Enligt `offlineWritePolicy.ts` — **tillåtet att köa offline:**

- `transactions`, `economy_profiles`, `budgets`, `budget_savings`, `economy_impulse_queue`

**Ej tillåtet (blockerat):**

- `reality_vault`, `children_logs`

**Superhub UX vid offline:**

- Visa lågaffektiv banner: *“Sparas när nätet är tillbaka.”* (befintligt mönster från vardagsmoduler)
- **Ingen** tyst fail på save — fånga fel från `assertOfflineWriteAllowed`

### 6.6 Zero Footprint (session / draft)

| Händelse | Åtgärd |
|----------|--------|
| Byte `inputMode` | Unmount delegate → rensa draft-fält (belopp, text, formulär) |
| Delegate unmount | **Ingen** `localStorage` / `sessionStorage` för halvfyllda utgifter |
| Logout / Device Clear | `useCapacityGate.reset()`; inga hub-specifika caches |
| Lyckat spar | Optimistisk flash OK (`savedFlash` i `useEconomyBudget`) — **ingen** auto-byte av läge |
| Shadow mount av | Legacy `ekonomiModulValjareStorage` **orörd** — Superhub skriver inte till den nyckeln |

**Förbjudet:** Persistens av halvfylld impulstext eller kuvert-form mellan sessioner.

### 6.7 HITL — `inkast`

- `CaptureSuperModule variant="ekonomi"` → `sourceModule: 'ekonomi_inkast'`
- DCAP/heuristik före LLM; confidence `< 0.75` → review-kö
- Mål efter godkännande: `saveEconomyTransaction` **eller** `economy_impulse_queue` — **aldrig** `reality_vault` utan separat Valv-HITL
- **MUST NOT:** Auto-promote till bevis

---

## 7. Shadow mount och rollout (Zero Footprint — Fas 7-paritet)

### 7.1 Flaggor

| Query | Beteende |
|-------|----------|
| `/vardagen?tab=ekonomi` | **Legacy default (8A–8D):** `EconomyOverviewPanel` |
| `/vardagen?tab=ekonomi&superhub=true` | **Shadow:** `EkonomiInputSuperModule` |
| `/vardagen?tab=ekonomi&superhub=true&inputMode=saldo` | Shadow + deep link |
| `/vardagen?tab=ekonomi&inputMode=kuvert` | **Efter 8E:** canonical (superhub default) |

**Implementering (Fas 8A):**

```tsx
// LivLauncherPage — tab=ekonomi
const useSuperhub = searchParams.get('superhub') === 'true';

{useSuperhub ? (
  <EkonomiInputSuperModule userId={user.uid} />
) : (
  <EconomyOverviewPanel userId={user.uid} />
)}
```

### 7.2 Rollout-faser

| Fas | Prod-default | Shadow |
|-----|--------------|--------|
| **8A** | Legacy panel | `?superhub=true` — endast `saldo` |
| **8B–8C** | Legacy | Shadow med fler modes |
| **8D** | Legacy | Shadow full + manuell QA |
| **8E** | **Superhub default** | `?superhub=false` valfri fallback en vecka, sedan bort |

### 7.3 Zero Footprint-garantier vid shadow

| Garanti | Detalj |
|---------|--------|
| Ingen påverkan utan flagga | Användare utan `superhub=true` ser identisk legacy UI |
| Ingen delad draft-state | Legacy tabs och Superhub mountas ** aldrig** samtidigt |
| Ingen migration av data | Endast UI-konsolidering; samma Firestore helpers |
| Smoke | `smoke:ekonomi` PASS med **och** utan shadow-flagga |
| Rollback | Ta bort shadow-mount — en rad i `LivLauncherPage` |

### 7.4 Auth

- `LivLauncherPage` kräver inloggad användare för ekonomi-flik (befintligt)
- Delegates visar inloggningsprompt om `userId` saknas

---

## 8. Per-delegate beteende (kort)

### `EkonomiSaldoDelegate` (8A)

- Monterar `EconomyQuickBalancePanel` oförändrad
- Alltid tillgänglig
- Writes: `saveEconomyTransaction` via `quickAdd`

### `EkonomiMikrostegDelegate` (8B)

- Vinst-knapp (0 kr) + valfri enkel negativ/postitiv rad
- Max **ett** fält + en spara-knapp (paralys-säker)

### `EkonomiProfilDelegate` (8B)

- Veckobudget + matlåda-preset; `onBlur` → `persistProfile`
- **Read-only** visning på Nivå 1 (mode dolt — N/A)

### `EkonomiMatprepDelegate` (8C)

- `EconomyMealPrepPanel` — checklista + ev. familjebonus
- **MUST NOT** köra sparmål-bonus om Nivå < 2 (mode redan dold)

### `EkonomiKuvertDelegate` / `EkonomiSparDelegate` (8C)

- Befintliga paneler oförändade; gateway via `economyFirestore`

### `EkonomiImpulsDelegate` (8D)

- `EconomyImpulsePanel` — fixa `STABILITY_THRESHOLD` till **0.5** (normaliserad score)
- “Fortfarande ja” disabled när `capacityScore < 0.5`

### `EkonomiInkastDelegate` (8D)

- `CaptureSuperModule variant="ekonomi"`
- `ReviewQueuePipelinePanel` under compose

### `EkonomiArbetslivBroDelegate` (8D)

- Ersätter `EconomyTidPanel` i legacy tab-rad
- Endast `<Link>` till Arbetsliv — **ingen** `time_entries` write

---

## 9. Visuell design

| Element | Klass |
|---------|-------|
| Hub container | `calm-card glow-bottom-gold` |
| Rubrik | `font-display-serif uppercase tracking-[0.2em] text-accent` |
| Aktiv mode-pill | guld `border-accent/20 bg-accent/10` |
| Kapacitetslås | `EconomyCapacityLockedNotice` compact |

**Förbjudet på hub-container:**

- `glow-bottom-blue` (Familjen/Valv)
- `glow-bottom-green` (MåBra)
- Grafer, streaks, count-up

---

## 10. Implementationsfaser

### Fas 8A — Router-skelett + SPEC (denna fil)

- [x] `Ekonomi-INPUT-SUPERHUB-SPEC.md`
- [ ] `ekonomiInputModes.ts` — full typunion
- [ ] `capacityResolver.ts` — regler §4.3
- [ ] `EkonomiInputSuperModule.tsx` — lägesväxlare + **`saldo`** endast
- [ ] `EkonomiSaldoDelegate.tsx`
- [ ] Shadow mount i `LivLauncherPage` (`?superhub=true`)
- [ ] Ingen ändring av Firestore rules
- [ ] Smoke: `npm run build`, `smoke:ekonomi`, `smoke:evolution`

### Fas 8B — Mikrosteg + profil

- [ ] Delegates: `EkonomiMikrostegDelegate`, `EkonomiProfilDelegate`
- [ ] URL-fallback enligt resolver

### Fas 8C — Kuvert + spar + matprep

- [ ] Delegates Nivå 2
- [ ] Avveckla `EkonomiModulValjare` + tab-rad i shadow path
- [ ] Deprecate `EconomyBudgetTab` som fristående ingång

### Fas 8D — Impuls + inkast + backend sync

- [ ] Delegates Nivå 3 + `CaptureSuperModule` variant `ekonomi`
- [ ] `mabraEconomySync` → spegla till `user_capability_state`
- [ ] Smoke: `smoke:inkast`

### Fas 8E — Lås

- [ ] Superhub = default (ta bort shadow-krav)
- [ ] `.context/locked-ux-features.md` §14
- [ ] `.context/system-plan.md` — Fas 8 **AVSLUTAD**
- [ ] PMIR + explicit OK (Pontus)

---

## 11. Acceptanskriterier (Fas 8E)

- [ ] En `EkonomiInputSuperModule` på `/vardagen?tab=ekonomi`
- [ ] Nivå 1: endast `saldo` + `mikrosteg` i DOM
- [ ] Nivå 3: `impuls` + `inkast` när resolver level === 3
- [ ] Alla vardags-pengar → `transactions` via `saveEconomyTransaction` only
- [ ] **Ingen** Superhub-write till `economy_ledger`
- [ ] Resolver: A/B/C enligt §4.3 — ingen spridd `EconomyAdvancedGate` i hub
- [ ] `glow-bottom-gold` på hub
- [ ] `smoke:ekonomi` + `smoke:evolution` + `smoke:locked-ux` PASS
- [ ] Arbetsliv orört (`smoke:arbetsliv` PASS)
- [ ] Ingen cross-silo RAG / auto-Valv

---

## 12. Referenser (kod idag)

| Fil | Roll |
|-----|------|
| `EconomyOverviewPanel.tsx` | Legacy hub (ersätts 8E) |
| `EconomyQuickBalancePanel.tsx` | Saldo delegate-kärna |
| `useEconomyBudget.ts` | Transaktioner + profil |
| `firestore.ts` | `saveEconomyTransaction` (WORM) |
| `economyFirestore.ts` | Domän mutable + ledger (**ej** Superhub) |
| `economy_gateway.ts` | Avancerad gateway |
| `useCapacityGate.ts` | Kapacitet A |
| `useEconomySync.ts` | Referens CB-logik B |
| `mabraEconomySync.ts` | Backend B |
| `offlineWritePolicy.ts` | Offline allowlist |
| `MabraInputSuperModule.tsx` | Referens-router |
| `FamiljenInputSuperModule.tsx` | Referens-router + modes |

---

## 13. Changelog

| Datum | Händelse |
|-------|----------|
| 2026-06-14 | SPEC godkänd efter [`Ekonomi-INPUT-SUPERHUB-EVAL.md`](../evaluations/Ekonomi-INPUT-SUPERHUB-EVAL.md) |
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/EkonomiInputSuperModule.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EconomyCapacityLockedNotice } from '@/features/economy/components/EconomyCapacityLockedNotice';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import {
  getAllowedModesForLevel,
  pickFallbackMode,
} from './capacityResolver';
import { EkonomiImpulsDelegate } from './delegates/EkonomiImpulsDelegate';
import { EkonomiInkastDelegate } from './delegates/EkonomiInkastDelegate';
import { EkonomiKuvertDelegate } from './delegates/EkonomiKuvertDelegate';
import { EkonomiLoggDelegate } from './delegates/EkonomiLoggDelegate';
import { EkonomiMatprepDelegate } from './delegates/EkonomiMatprepDelegate';
import { EkonomiMikrostegDelegate } from './delegates/EkonomiMikrostegDelegate';
import { EkonomiProfilDelegate } from './delegates/EkonomiProfilDelegate';
import { EkonomiSaldoDelegate } from './delegates/EkonomiSaldoDelegate';
import { EkonomiSparDelegate } from './delegates/EkonomiSparDelegate';
import {
  DEFAULT_EKONOMI_INPUT_MODE,
  filterModesByAllowed,
  getEkonomiInputModeMeta,
  parseEkonomiInputMode,
  type EkonomiInputMode,
} from './ekonomiInputModes';
⋮----
export type EkonomiInputSuperModuleProps = {
  userId: string;
};
⋮----
function EkonomiModePlaceholder(
⋮----
function EkonomiInputModeDelegate({
  mode,
  userId,
}: {
  mode: EkonomiInputMode;
  userId: string;
})
````

## File: src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx
````typescript
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Wallet, Leaf, PiggyBank, ScrollText, PauseCircle, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { EconomyBudgetTab } from './EconomyBudgetTab';
import { EconomyMealPrepPanel } from './EconomyMealPrepPanel';
import { EconomyImpulsePanel } from './EconomyImpulsePanel';
import { EconomySavingsPanel } from './EconomySavingsPanel';
import { EconomyLogPanel } from './EconomyLogPanel';
import {
  EkonomiModulValjare,
  type EkonomiModuleChoice,
} from './EkonomiModulValjare';
import { hasSeenEkonomiModulValjare } from '../utils/ekonomiModulValjareStorage';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import type { EconomyCapacityLevel } from '../supermodule/capacityResolver';
⋮----
function allowedTabIdsForLevel(level: EconomyCapacityLevel): Set<EkonomiModuleChoice>
⋮----
type Props = {
  userId: string;
};
⋮----
export function EconomyOverviewPanel(
⋮----
const openTab = (tab: EkonomiModuleChoice) =>
⋮----
className=
````
