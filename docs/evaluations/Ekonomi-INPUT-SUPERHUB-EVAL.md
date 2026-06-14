# Fas 8 — Ekonomi: djupanalys för Universal Input Superhub

**Datum:** 2026-06-14  
**Status:** **Djupanalys — väntar godkännande** · ingen kod förrän Pontus godkänner SPEC (Fas 8A)  
**Kanon:** [`.context/system-plan.md`](../../.context/system-plan.md) § Fas 6 (zon 3: Super-Ekonomi Input) · [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §3, §8 · [`docs/INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md) · [`docs/architecture/INFINITE_EVOLUTION.md`](../architecture/INFINITE_EVOLUTION.md)  
**Mönster:** [`Mabra-INPUT-SUPERHUB-SPEC.md`](../specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md) · [`Familjen-INPUT-SUPERHUB-EVAL.md`](./Familjen-INPUT-SUPERHUB-EVAL.md) · [`Ekonomi-SPEC.md`](../specs/modules/Ekonomi-SPEC.md)

---

## Slutsats

Ekonomi-zonen har **minst 10 distinkta inmatningsytor** fördelade över **två hubbar** (`EconomyOverviewPanel` på `/vardagen?tab=ekonomi` och `ArbetslivHubPage` på `/arbetsliv?tab=logg|tid|stampla`), plus en **kapacitets-gated** avancerad dashboard (`/ekonomi/avancerad`). Inmatningen är **inte** centraliserad: `EkonomiModulValjare` + horisontell tab-rad ersätter en polymorf lägesväxlare, och kapacitetslogik läser från **tre parallella källor** (`user_capability_state`, `user_economy_status`, `evolution_hub`).

**Rekommendation:** Inför **`EkonomiInputSuperModule`** enligt samma router-delegate-mönster som Fas 6/7. **Kapacitetsdriven UI är obligatorisk från dag ett** — Nivå 1 visar endast mikrosteg/saldo; avancerade lägen (kuvert, sparmål, impulskö) låses bakom samma gate som idag men **styrs av en canonical kapacitets-hook** i hub-routern, inte spridda `EconomyAdvancedGate`-wrappar. **Arbetsliv** (stämpel, tid, forensisk ledger) ska **inte** ingå i Superhub v1 — zonavgränsning enligt `Ekonomi-SPEC.md` och locked UX §8.

---

## REASONS (kort)

| Dimension | Ekonomi Superhub |
|-----------|------------------|
| **Requirements** | En inmatningshub per Ekonomi-pelare; lägesbyte (saldo, utgift, impuls, kuvert, spar, matprep, inkast) utan sidbyte; **kapacitetsstyrd progressive disclosure**; guld glow (`glow-bottom-gold`) |
| **Entities** | `transactions` WORM (vardag); `economy_profiles` mutable; `budgets`, `budget_savings`, `economy_impulse_queue` mutable; `economy_ledger` / `economy_fixed_bills` (Arbetsliv-logg — sekundär); **ingen** tre-silo-write (ej Kunskap/Valv/Barnen) |
| **Approach** | Tunn router (`EkonomiInputSuperModule`) → befintliga paneler; **CapacityGateResolver** i routern; deprecate `EkonomiModulValjare` + tab-rad stegvis |
| **Structure** | `/vardagen?tab=ekonomi&inputMode=…` (canonical); `ekonomiInputModes.ts`; Färgburkar guld |
| **Operations** | Djupanalys (denna fil) → SPEC → migrering Fas 8A→E → `smoke:ekonomi` + `smoke:evolution` + `smoke:locked-ux` → lås i `locked-ux-features.md` |
| **Norms** | Infinite Evolution Nivå 1–3; inga grafer/streaks/LLM; U6: **ingen** FACT/REFLECTION-coach här |
| **Safeguards** | WORM på `transactions`; PII uid-scoped; offline allowlist (SDK-kö tillåten); Zero Footprint på draft-fält; **ingen** auto-export till Valv/Dossier |

---

## 1. Nuvarande tillstånd

### 1.1 Routing och shell

| Route | Komponent | Mönster |
|-------|-----------|---------|
| `/vardagen?tab=ekonomi` | `LivLauncherPage` → `EconomyOverviewPanel` | **Primär** vardagsekonomi |
| `/ekonomi` | redirect | → `/vardagen?tab=ekonomi` |
| `/ekonomi/avancerad` | `EconomyDashboardRoute` → `EconomyDashboard` | **Kapacitets-gated** (`user_capability_state.economy_advanced`) |
| `/arbetsliv?tab=logg` | `ArbetslivHubPage` → `EconomyLogPanel` | Ledger + fasta räkningar (Arbetsliv-zon) |
| `/arbetsliv?tab=tid` | `EconomyTidPanel` | Stämpel + flex (Arbetsliv) |
| `/liv?tab=ekonomi` | redirect | → `/vardagen?tab=ekonomi` |

**Entry-kod:** `src/modules/shell/LivLauncherPage.tsx` monterar `EconomyOverviewPanel` när `tab=ekonomi`.

**Legacy:** `EconomyPage` (`src/modules/features/dailyLife/wellbeing/economy/components/EconomyPage.tsx`) — fullsid wrap av budget + sparmål; kommentar säger *prefer EconomyOverviewPanel on /vardagen*.

### 1.2 Hub-struktur idag (inte Superhub)

**`EconomyOverviewPanel`** (`src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx`):

1. Första besök: **`EkonomiModulValjare`** (localStorage `ekonomiModulValjareStorage`) — väljer *verktyg*, inte *input-läge*.
2. Därefter: horisontell **tab-rad** (`budget` | `kost_prepp` | `impuls` | `spar` | `tid`).
3. Kapacitet filtrerar synliga tabs: `impuls` + `spar` döljs om varken `isEconomyAdvancedUnlocked` (CapacityGate) eller `evolution_hub` flag `economy_advanced`.
4. Länk till `/ekonomi/avancerad` när kapacitet OK.

| Tab ID | Panel | Skriver till | Kapacitets-gate |
|--------|-------|--------------|-----------------|
| `budget` | `EconomyBudgetTab` | `transactions`, `economy_profiles`, `budgets` | Delvis: quick alltid; kuvert/profil/transaktionslista bakom `EconomyAdvancedGate` |
| `kost_prepp` | `EconomyMealPrepPanel` | `economy_meal_prep` (via `economyFirestore`), `transactions`, `budget_savings` | Nej (alltid synlig tab) |
| `impuls` | `EconomyImpulsePanel` | `economy_impulse_queue` | Tab dold + `EconomyAdvancedGate` |
| `spar` | `EconomySavingsPanel` ×2 | `budget_savings` | Tab dold + `EconomyAdvancedGate` |
| `tid` | `EconomyTidPanel` | `time_entries` (stämpel), läser `economy_profiles` | Nej (alltid synlig) — **Arbetsliv-gräns** |

### 1.3 Inmatningskartläggning — Firestore-skrivande ytor

| Komponent | Plats | Input | Collection(s) | WORM / mutable |
|-----------|-------|-------|-----------------|----------------|
| `EconomyQuickBalancePanel` | budget-tab | veckopeng, matlåda knappar | `transactions` | **WORM** append (`saveEconomyTransaction`) |
| `EconomyBudgetTab` | budget-tab | vinst-knapp | `transactions` | **WORM** |
| `EconomyBudgetTab` | budget-tab | veckobudget, matlåda-preset | `economy_profiles` | Mutable merge |
| `EconomyEnvelopeSection` | budget-tab (advanced) | kuvert CRUD, spent | `budgets` | Mutable |
| `useEconomyBudget.quickAdd` | hook | generisk transaktion | `transactions` | **WORM** |
| `EconomyImpulsePanel` | impuls-tab | parkera/resolve impuls | `economy_impulse_queue` | Mutable (status update, delete) |
| `EconomySavingsPanel` | spar-tab | sparmål CRUD | `budget_savings` | Mutable |
| `EconomyMealPrepPanel` | kost-tab | checklista, bonus till sparmål | meal prep doc + `transactions` + `budget_savings` | Mixed |
| `EconomyLogPanel` | `/arbetsliv?tab=logg` | utgift/inkomst rad | `economy_ledger` | **WORM intent** — men `deleteEconomyLedgerEntry` finns (**drift**) |
| `EconomyLogPanel` | arbetsliv | fasta räkningar | `economy_fixed_bills` | Mutable CRUD |
| `TimeAndPayPanel` | tid-tab | stämpel IN/UT | `time_entries` | Append (Arbetsliv) |
| `EconomyDashboard` | `/ekonomi/avancerad` | read + gateway CRUD | ledger, budgets, savings, impulse | Gateway-gated |

**Canonical vardag-write (snabb kassa):** `saveEconomyTransaction()` i `src/modules/core/firebase/firestore.ts` — `assertWormPayload`, `guardedAddDoc`, collection `transactions`.

**Domän-write (avancerat):** `src/modules/core/firebase/economyFirestore.ts` + `EconomyGateway` (`src/modules/features/economy/economy_gateway.ts`).

### 1.4 Dualitet: `transactions` vs `economy_ledger`

| Collection | Användning | Policy (SPEC) | Kod idag |
|------------|------------|---------------|----------|
| `transactions` | Veckopeng, matlåda, vinst — **vardag** | WORM append-only | ✅ ingen delete i UI |
| `economy_ledger` | Detaljerad utgift/inkomst — **Arbetsliv logg** | SPEC: WORM create-only | ⚠️ `deleteEconomyLedgerEntry` i UI |

**Fas 8-beslut (föreslagen):** Superhub v1 konsoliderar **vardagsinmatning** mot `transactions` + mutable stöd (`economy_profiles`, `budgets`, …). `economy_ledger` förblir **Arbetsliv-delegate** — migreras inte till Superhub v1.

### 1.5 Read-only / navigerande (ingen ekonomi-write)

| Komponent | Beteende |
|-----------|----------|
| `SaldoHero` / saldo-progress | Aggregerar `transactions` |
| `WorkWeekSummary` / `EconomyPayslipCard` | Läser tid + profil; lönespec server-side |
| `EconomyCapacitanceWidget` | Visar kapacitet via `useEconomySync` |
| `VaultEconomyPanel` | Valv-länk tillbaka till vardag |
| Kunskap / Kompis | **Ingen** ekonomidata-ingest (U6, Ekonomi-SPEC §6) |

### 1.6 CaptureSuperModule — Ekonomi-relation

**`CaptureSuperModule`** varianter idag: `hem-capture`, `hem-inkast`, `valv-compact`, `planering`, `kompass`, `mabra`, `familjen`.

**Ingen `ekonomi`-variant.** Planering har `planering`-variant för inkorg dual-write. Fas 8D bör etablera **`variant="ekonomi"`** med HITL — routing till `transactions` eller review-kö, **aldrig** auto-Valv.

### 1.7 Legacy och drift (måste adresseras i SPEC)

| Problem | Detalj | Risk |
|---------|--------|------|
| **Trippel kapacitetskälla** | `useCapacityGate` → `user_capability_state`; `useEvolutionStore` → `evolution_hub.unlockedFeatureFlags`; `mabraEconomySync` → `user_economy_status` | Inkonsistent upplåsning; `useEconomySync` används knappt i hub |
| **Skala-bugg (misstänkt)** | `EconomyImpulsePanel`: `STABILITY_THRESHOLD = 50` jämfört med `capacityScore` 0–1 från `useCapacityScore` | `isLowCapacity` nästan alltid true — köp-knapp blockeras felaktigt |
| **Spridd gate** | `EconomyAdvancedGate` wrappar enskilda sektioner, inte hela hubben | Duplicerad lyssnar-logik; svår att enforce Nivå 1 “ett läge” |
| **Tab vs mode** | `EkonomiModulValjare` + tabs ≠ Superhub lägesväxlare | Kognitiv friktion; bryter Fas 6 arkitekturlag |
| **Tid i ekonomi-tab** | `EconomyTidPanel` skriver `time_entries` | Zon-leak (Arbetsliv); ska ut ur Superhub v1 |
| **Ledger delete** | `EconomyLogPanel` raderar WORM-rader | Bryter append-only princip |

---

## 2. Kapacitetsdrivet UI (Infinite Evolution) — analys

### 2.1 Kanon (system-plan + INFINITE_EVOLUTION.md)

| Nivå | Ekonomi (plan) | Indikatorer (backend) |
|------|----------------|------------------------|
| **Nivå 1 — Rehab/Lugn** | Enkel saldoövervakning + snabbknappar (veckopeng/matlåda); **ett mikrosteg** | Låg kapacitet; få MåBra-checkins |
| **Nivå 2 — Aktiv struktur** | Sparmål (`budget_savings`) + kuvert (`budgets`) | Stabil 7-dagars MåBra-trend |
| **Nivå 3 — Optimering** | Impulskö (`economy_impulse_queue`) | `economy_advanced` + circuit breaker OK |

### 2.2 Implementering idag

| Mekanism | Fil | Beteende |
|----------|-----|----------|
| **CapacityGate (UI primär)** | `useCapacityGate.ts` | Lyssnar `user_capability_state/{uid}` → `capacityScore`, `economy_advanced` |
| **EconomyAdvancedGate** | `EconomyAdvancedGate.tsx` | Renderar barn endast om `isEconomyAdvancedUnlocked \|\| alsoUnlocked` |
| **Evolution hub flag** | `useEvolutionStore.hasFeature('economy_advanced')` | Parallell upplåsning i `EconomyOverviewPanel` |
| **Backend sync** | `functions/src/economy/mabraEconomySync.ts` | Vid `mabra_progress` write: beräkna 7d/48h MåBra-snitt → skriver `user_economy_status.economy_advanced`; circuit breaker → `dcap_alerts` |
| **Legacy hook** | `useEconomySync.ts` | Kombinerar `user_economy_status` + 48h circuit breaker + `mabra_progress` coreValues — används i `EconomyCapacitanceWidget` |
| **Impuls köp-block** | `EconomyImpulsePanel` | Blockerar “Fortfarande ja” vid låg kapacitet (tröskel behöver normaliseras) |

### 2.3 Gap mot Fas 8-krav

1. **Ingen central “Paralys-läge”** — Nivå 1 ska tvinga **ett** input-läge (`saldo` / `mikrosteg`), inte bara dölja tabs.
2. **Mode switcher ska vara kapacitetsmedveten** — avancerade modes ska **inte** finnas i DOM (inte bara disabled).
3. **En canonical resolver** — Superhub-routern ska läsa **en** prioritetsordning:
   - `circuitBreakerActive` → force Nivå 1
   - `economy_advanced` (samla källor till en adapter)
   - `capacityScore` för mikro-beslut (t.ex. impulsköp)
4. **evolution_ledger** — flaggändringar ska loggas vid permanent upplåsning (Infinite Evolution §2); idag skriver `mabraEconomySync` bara `user_economy_status`.

### 2.4 Föreslagen kapacitetsmatris (Superhub)

| Kapacitetsband | Synliga modes | UX |
|----------------|---------------|-----|
| **Kritisk / CB aktiv** | Endast `saldo` | SaldoHero + en knapp (veckopeng **eller** matlåda — inte båda samtidigt om overload) |
| **Nivå 1** | `saldo`, `mikrosteg` (vinst) | QuickBalance + vinst-knapp; **ingen** kuvert/spar/impuls |
| **Nivå 2** | + `kuvert`, `spar`, `matprep`, `profil` | Kuvert + sparmål + neuro-kost |
| **Nivå 3** | + `impuls`, `ledger_bro` (länk Arbetsliv), `inkast` | Impulskö + Capture-variant |

---

## 3. Föreslagen arkitektur

### 3.1 Mönster (strikt Fas 6/7-paritet)

```
src/modules/features/dailyLife/wellbeing/economy/supermodule/
  EkonomiInputSuperModule.tsx      # Canonical router + capacity-aware mode switcher
  ekonomiInputModes.ts             # Mode union, labels, capacity tier, metadata
  capacityResolver.ts              # En adapter: CapacityGate + Evolution + circuit breaker
  index.ts
  delegates/
    EkonomiSaldoDelegate.tsx       # EconomyQuickBalancePanel (wrap)
    EkonomiMikrostegDelegate.tsx   # Vinst + valfri enkel belopp
    EkonomiKuvertDelegate.tsx      # EconomyEnvelopeSection
    EkonomiSparDelegate.tsx        # EconomySavingsPanel
    EkonomiImpulsDelegate.tsx      # EconomyImpulsePanel
    EkonomiMatprepDelegate.tsx     # EconomyMealPrepPanel
    EkonomiProfilDelegate.tsx      # Profil-fält från EconomyBudgetTab
    EkonomiInkastDelegate.tsx      # CaptureSuperModule variant="ekonomi" (Fas 8D)
```

**Regler (oförändrade från Fas 6):**

- Routern **MÅSTE NOT** anropa Firestore direkt.
- Delegates använder befintliga hooks/API (`useEconomyBudget`, `EconomyGateway`, `economyFirestore`).
- Container **MÅSTE** ha `calm-card glow-bottom-gold`.

### 3.2 Routing

| Canonical | `/vardagen?tab=ekonomi&inputMode=saldo` |
|-----------|----------------------------------------|
| Default mode | `saldo` (ersätter modulväljare som första vy) |
| Avancerad read-only dashboard | `/ekonomi/avancerad` — **behålls** som aggregate-vy, inte input-hub |
| Legacy | `EkonomiModulValjare` → deprecate efter 8C |

### 3.3 `CaptureSuperModule` variant `ekonomi` (Fas 8D)

- `sourceModule: 'ekonomi_inkast'`
- DCAP/heuristik före LLM; confidence < 0.75 → review
- Mål: append `transactions` eller `economy_impulse_queue` — **aldrig** `reality_vault` utan HITL
- **Ingen** cross-RAG till Kunskap

### 3.4 Skild från (oförändrat / out of scope v1)

| Zon | Roll |
|-----|------|
| **Arbetsliv** (`/arbetsliv`) | Stämpel, tid, `EconomyLogPanel` — locked UX §8 |
| **Valv** | Lön/frånvaro forensik — PIN |
| **Kunskap** | FACT `ekonomi_vardag` — seed only, ingen live-coach här |
| **Planering** | Kanban/inkorg — separat Superhub (Fas 9+) |

---

## 4. Inmatningslägen (föreslagna)

| Mode ID | Etikett (UI) | Delegate | Firestore | Kapacitet |
|---------|--------------|----------|-----------|-----------|
| `saldo` | Snabbsaldo | `EkonomiSaldoDelegate` | `transactions` (read aggregate + quick add) | **Alltid** |
| `mikrosteg` | Ett steg | `EkonomiMikrostegDelegate` | `transactions` (`vinst`, valfri `-belopp`) | **Alltid** |
| `profil` | Veckobudget | `EkonomiProfilDelegate` | `economy_profiles` | Nivå 2+ |
| `matprep` | Neuro-kost | `EkonomiMatprepDelegate` | meal prep + ev. `transactions` | Nivå 2+ ( eller Nivå 1 read-only checklist — produktbeslut) |
| `kuvert` | Kuvert | `EkonomiKuvertDelegate` | `budgets` | Nivå 2+ |
| `spar` | Sparmål | `EkonomiSparDelegate` | `budget_savings` | Nivå 2+ |
| `impuls` | Impulspaus | `EkonomiImpulsDelegate` | `economy_impulse_queue` | Nivå 3+ |
| `inkast` | Inkast | `CaptureSuperModule` **`ekonomi`** | HITL → routing | Nivå 3+ (eller alltid med review-only — produktbeslut) |

**Metadata på sparade objekt (där schema tillåter):**

```ts
{
  zone: 'ekonomi';
  inputMode: EkonomiInputMode;
  channel: 'ekonomi_superhub';
  // transactions: category veckopeng | matlada | vinst | ovrigt (befintlig)
}
```

**Ingen ny collection i v1.**

---

## 5. Kapacitets- och säkerhetsbegränsningar

### 5.1 WORM

| Collection | Superhub-regel |
|------------|----------------|
| `transactions` | Append-only via befintliga helpers; **ingen** delete/update i delegates |
| `economy_ledger` | **Ej** i Superhub v1; fixa delete-drift i Arbetsliv separat |
| `economy_impulse_queue` | Mutable status — OK; dokumentera som kö, inte evidens-WORM |

### 5.2 Tre silos (U1)

- Ekonomidata är **vardagsdata**, inte Kunskap/Valv/Barnen.
- **Får inte:** `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery` från ekonomi-input.
- **Får inte:** auto-promote transaktioner till `reality_vault`.

### 5.3 Zero Footprint

| Princip | Tillämpning |
|---------|-------------|
| Delegate unmount | Rensa draft-fält (belopp, impulstext, kuvert-form) — **ingen** localStorage för halvfyllda utgifter |
| Logout / Device Clear | Kapacitetslyssnare via `useCapacityGate.reset()` (befintligt mönster) |
| Offline | Ekonomi-collections på **allowlist** (`offlineWritePolicy.ts`) — SDK-kö tillåten; visa lågaffektiv “synkas när nät finns” |

### 5.4 HITL

- **`inkast`-läge:** manuellt godkännande innan Firestore-write (samma som MåBra/Familjen).
- **Ingen** automatisk Dossier-export (Ekonomi-SPEC §7).

### 5.5 Innehåll (U6 / INNEHALL-REGISTER)

- Ekonomi UI: **ingen** LLM-coach, inga FACT-kort i prod.
- Register: `kunskap-fact-009` (`ekonomi_vardag`) → Kunskap-seed only — **inte** Superhub.

### 5.6 Locked UX (får inte brytas)

- §3 Planering hybrid — ekonomi-ingång via Vardagen, inte planering-Kanban.
- §8 Arbetsliv hub — stämpel/logg kvar på `/arbetsliv`.
- Fyren quick action → `/vardagen?tab=ekonomi` (befintlig).

---

## 6. Migreringsstrategi (Fas 8A → 8E)

### Fas 8A — Spec + router-skelett (ingen WORM-ändring)

- [ ] Godkänn denna eval + skriv `Ekonomi-INPUT-SUPERHUB-SPEC.md`
- [ ] `EkonomiInputSuperModule` + `ekonomiInputModes.ts` + **endast** `saldo`-delegate
- [ ] Shadow mount: `EconomyOverviewPanel` → router (parallellt)
- [ ] `capacityResolver.ts` — enhetlig gate (minimum: CapacityGate + evolution flag)

### Fas 8B — Mikrosteg + profil

- [ ] `mikrosteg`, `profil` delegates
- [ ] Flytta `EconomyQuickBalancePanel` + vinst under hub
- [ ] Nivå 1 tvingar default `inputMode=saldo`

### Fas 8C — Kuvert + spar + matprep

- [ ] Delegates för Nivå 2 modes
- [ ] Avveckla `EkonomiModulValjare` + duplicerad tab-logik
- [ ] `EconomyBudgetTab` blir read-only composition eller deprecate

### Fas 8D — Impuls + inkast

- [ ] `CaptureSuperModule variant="ekonomi"`
- [ ] Fixa capacity threshold-skala i impuls-delegate
- [ ] Samla backend: verifiera sync `user_economy_status` ↔ `user_capability_state`

### Fas 8E — Lås

- [ ] `npm run smoke:ekonomi` + `smoke:evolution` + `smoke:locked-ux`
- [ ] `.context/locked-ux-features.md` §14
- [ ] `.context/system-plan.md` — Fas 8 **AVSLUTAD**

---

## 7. Acceptanskriterier (Fas 8E)

| # | Kriterium |
|---|-----------|
| 1 | En `EkonomiInputSuperModule` — lägesväxlare utan sidbyte på `/vardagen?tab=ekonomi` |
| 2 | Nivå 1: endast `saldo` + `mikrosteg` synliga; inga kuvert/spar/impuls i DOM |
| 3 | Nivå 3: impuls + inkast tillgängliga när `economy_advanced` + ej circuit breaker |
| 4 | Alla vardags-writes till `transactions` via befintliga WORM-helpers |
| 5 | Ingen ny spridd textarea utanför hub i ekonomi-zonen |
| 6 | `glow-bottom-gold` på hub-container |
| 7 | Arbetsliv stämpel/logg orört (smoke:arbetsliv PASS) |
| 8 | Ingen cross-silo RAG eller auto-Valv från ekonomi-input |

---

## 8. Smoke-mapping

| Verktyg | Autorun |
|---------|---------|
| Ekonomi hub | `npm run smoke:ekonomi` |
| Kapacitet / evolution | `npm run smoke:evolution` |
| Vendor/kanon | `npm run smoke:economy-vendor` |
| Locked UX | `npm run smoke:locked-ux` |
| Design modules | `npm run smoke:design-modules` |

---

## 9. Referenser (kod)

| Område | Sökväg |
|--------|--------|
| Hub shell | `src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx` |
| Quick input | `src/modules/features/economy/components/EconomyQuickBalancePanel.tsx` |
| Budget hook | `src/modules/features/dailyLife/wellbeing/economy/hooks/useEconomyBudget.ts` |
| WORM transactions | `src/modules/core/firebase/firestore.ts` (`saveEconomyTransaction`) |
| Domän Firestore | `src/modules/core/firebase/economyFirestore.ts` |
| Gateway | `src/modules/features/economy/economy_gateway.ts` |
| Capacity UI | `src/modules/core/store/useCapacityGate.ts`, `EconomyAdvancedGate.tsx` |
| Backend sync | `functions/src/economy/mabraEconomySync.ts` |
| Superhub-mönster | `src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraInputSuperModule.tsx` |
| Familjen eval | `docs/evaluations/Familjen-INPUT-SUPERHUB-EVAL.md` |

---

## 10. Öppna produktbeslut (innan SPEC)

1. **`matprep` på Nivå 1?** — Checklist-only utan sparmål-bonus vs helt dold.
2. **`inkast` alltid med review** vs kräver Nivå 3.
3. **Canonical kapacitetsdoc:** skriv `user_capability_state` från `mabraEconomySync` eller enbart frontend-beräkning?
4. **`/ekonomi/avancerad`:** behåll som aggregate dashboard eller fold in i Superhub som read-only läge?

---

**Väntar på godkännande:** Skriv `Ekonomi-INPUT-SUPERHUB-SPEC.md` (Fas 8A) utifrån denna analys — **ingen kod** förrän Pontus säger godkänn.
