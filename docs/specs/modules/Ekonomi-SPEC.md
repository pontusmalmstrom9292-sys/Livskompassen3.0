# Ekonomi-SPEC

Källa: blueprint + Kladd 2026-05-21. Konsoliderad till `.context/modules/ekonomi.md`.

**Kladd-master:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) §F, §G.

**Senast synkad mot kod:** 2026-06-01 (superhub + sparmål + lönespec vardag).

## 1. Syfte och användarbehov

Kognitiv avlastning för vardagsekonomi: veckopeng, matlåda, enkel överblick — **inga grafer**, inga prestationsmått. Skild från forensik (Valv) och livsminne (Kunskap).

## 2. Route och ingång

- **Route (vardag):** `/vardagen?tab=ekonomi` — `LivLauncherPage` → `EconomyOverviewPanel` (3 flikar: Budget · Neuro-Kost · Smarta Verktyg)
- **Legacy:** `/ekonomi` och `/liv?tab=ekonomi` → redirect till `/vardagen?tab=ekonomi`
- **Arbetsliv (fasta räkningar, tid, lönespec):** `/arbetsliv?tab=logg|tid|stampla` — fristående hub (ej inbäddad i ekonomi)
- **Ingång:** Drawer → Vardagen → Ekonomi-kort; eller `/ekonomi`

## 3. UX-flöde (Progressive Disclosure)

**Målbild:**

1. Saldo — summa transaktioner (en siffra i `SaldoHero`)
2. Snabbknappar: veckopeng, matlåda
3. Vinst-knapp — mikro-belöning utan skuld (0 kr, kategori `vinst`)
4. Lista transaktioner (`TimelineEntry`)
5. Profil: veckobudget + matlåda-preset (`economy_profiles`)

**Idag:** `EconomyPage` — Firestore live, inga grafer.

## 4. Visuell design (Obsidian Calm)

- `SaldoHero`, `MetricTile`, `BentoCard`, `EmptyState`, `TimelineEntry`
- Inga count-up, streaks, grafer
- Se [`docs/specs/design-master.md`](../design-master.md) §10

## 5. Datamodell (Firestore / Data Connect)

| Collection | Roll | WORM |
|------------|------|------|
| `transactions` | Append-only rader (`label`, `amountSek`, `category`) | Ja (create-only) |
| `economy_profiles` | `weeklyBudgetSek`, `mealBoxPresetSek`, `mealPrepItems` | Nej (uppdaterbar) |
| `budget_savings` | Sparmål (`title`, `targetSek`, `currentSek`, valfri `tag`) | Nej (CRUD via klient) |
| `budgets` | Manuella kuvert per kategori | Nej (CRUD) |
| `economy_impulse_queue` | Impulsparkering 24h | Nej (CRUD) |

**Planerat:** separat semantik för “kvar av budget” vs profil — kuvert i `budgets` live 2026-06-06.

Data Connect avvaktar (system-plan).

**Fas 2 (live 2026-06-01):** `EconomySavingsPanel` + `EconomyPayslipCard` på `/arbetsliv?tab=tid`; `generatePayslip` callable. Vendor-skatt i `functions/src/economy/vendor/` — ej kopplad till UI (defer).

## 6. Backend och agenter

Ingen LLM i MVP. Ingen ekonomi-callable i produktion. Framtida sammanfattning via Kunskap — **inte** Livs-Coachen i denna modul.

## 7. Säkerhet

- PII — strikt `ownerId` / `userId`; Firestore rules uid-scoped
- Ingen auto-export till Dossier utan explicit användarval
- Zero Footprint: lokal state rensas vid unmount (`EconomyPage`)
- `transactions` i retention WORM-allowlist (`retentionJob.ts`)
- Lönespec (Fas 2): server-only; sjuk/VAB-data får inte exponeras i klient

## 8. Status idag vs planerat

| Område | Kod |
|--------|-----|
| UI hub (`EconomyOverviewPanel` 3 flikar) | **done** 2026-06-06 |
| Veckopeng / matlåda | **done** |
| Vinst-knapp | **done** |
| Firestore `transactions` + `economy_profiles` | **done** |
| Sparmål `budget_savings` + impulsparkering + kuvert | **done** 2026-06-06 |
| Neuro-Kost matprepp (Firestore) | **done** 2026-06-06 |
| Lönespec vardag (`EconomyPayslipCard` på tid-flik) | **done** 2026-06-01 |
| Transaktion U/D | **avvisat** (WORM append-only) |
| Livs-Coachen här | **avvisat** |

## 9. Acceptanskriterier

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | Inga grafer/streaks | **done** |
| 2 | SaldoHero synlig | **done** |
| 3 | Transaktion create + lista | **done** (WORM: ingen update/delete) |
| 4 | uid-scoped rules | **done** |

## 10. Kopplingar

- **Kunskap** — metod/livscoach — **inte** ekonomidata
- **Dossier** — endast vid explicit juridisk export (planerat)
- **Kompasser** — separata `checkins`

## 11. Navigation

- `/ekonomi` → Vardagen flik ekonomi
- Dock Map → Vardagen-hub

## 12. Tidigare diskussioner att bevara (vision)

- Ekonomi som **lugn** modul — inte ännu en prestationsyta.
- Veckopeng för barn (Kasper/Arvid) som pedagogisk rutin — inte skuld.
- Vinst-knapp = mikro-belöning efter svår vecka (ADHD-vänligt).

## 13. Avvisade eller alternativa idéer

- **Livs-Coachen / RAG i Ekonomi** — avvisat → Kunskap/Kompis.
- **Grafer och diagram** — avvisat (design-master).
- **Gamification** — avvisat (Kladd §G).
- **Gemensam collection med valv** — avvisat.
- **Lönespec i EconomyPage** — avvisat till Fas 2.

---

**Module plan:** [`src/modules/ekonomi/module_plan.md`](../../../src/modules/ekonomi/module_plan.md)  
**Flöde:** [`docs/specs/p2-flode.md`](../p2-flode.md)  
**Smoke:** [`docs/SMOKE_CHECKLIST.md`](../../SMOKE_CHECKLIST.md) #18
