# Ekonomi-SPEC

Källa: blueprint + Kladd 2026-05-21 + Firestore-integration 2026-05-23.

**ADR:** [`docs/decisions/ADR-ekonomi-firestore-not-sheets.md`](../../decisions/ADR-ekonomi-firestore-not-sheets.md)

## 1. Syfte och användarbehov

Kognitiv avlastning för vardagsekonomi och arbetstid: veckopeng, matlåda, stämpelklocka, uppskattad veckolön — **inga grafer**, inga prestationsmått. Skild från forensik (Valv) och livsminne (Kunskap).

## 2. Route och ingång

- **Primär:** `/vardagen?tab=ekonomi` (Vardagen-kluster)
- **Redirect:** `/ekonomi` → Vardagen ekonomi
- **Full stämpelvy:** `/stampla`
- **Utökad lön/ledger:** Valv → Lön (PIN) — `VaultEconomyPanel`

## 3. UX-flöde (Progressive Disclosure)

1. Saldo (summa `transactions`)
2. Tid och lön — stämpla in/ut, dagens/veckans timmar, uppskattad lön
3. Snabbknappar: veckopeng, matlåda, vinst-knapp
4. Sparmål (`budget_savings`)
5. Profil: veckobudget, matlåda, timlön, flexmål, månadslön
6. Transaktionslista (WORM)

## 4. Visuell design (Obsidian Calm)

- `SaldoHero`, `MetricTile`, `BentoCard`, `EmptyState`, `TimelineEntry`
- Inga count-up, streaks, grafer
- Se [`docs/specs/design-master.md`](../design-master.md) §10

## 5. Datamodell (Firestore)

| Collection | WORM | Beskrivning |
|------------|------|-------------|
| `transactions` | Ja | Veckopeng, matlåda, vinst, övrigt |
| `economy_profiles/{uid}` | Nej | Profil per användare |
| `time_entries` | Nej | Stämpelklocka — in/ut, kategori, rast, `hoursWorked` |
| `economy_ledger` | Nej | Utgift/inkomst (Valv + framtida Vardagen) |
| `economy_fixed_bills` | Nej | Fasta räkningar |
| `budget_savings` | Nej | Sparmål |

Timberäkning: `computeHoursWorked` i [`src/modules/core/utils/timeMath.ts`](../../../src/modules/core/utils/timeMath.ts).

Affärsregler Fas 1 (stämpel/flex, port PontusArbetsapp): [`src/modules/ekonomi/rules/payTimeRules.ts`](../../../src/modules/ekonomi/rules/payTimeRules.ts), konstanter [`livsmedel2026.ts`](../../../src/modules/ekonomi/rules/livsmedel2026.ts). Golden fixtures: [`__fixtures__/sheet-golden.json`](../../../src/modules/ekonomi/rules/__fixtures__/sheet-golden.json).

| Regel | Implementation |
|-------|----------------|
| Auto-rast 30 min om pass > 5 h och rast tom | `resolveBreakMinutesOnClockOut` vid utstämpling / manuellt pass |
| Jämn ISO-vecka 30 h / ojämn 50 h | `getWeekFlexTarget` |
| Flex kvar | veckomål − summa **Arbete**-timmar (frånvaro räknas inte) |
| Dagflex | `computeDayFlexDelta` per rad (Arbete vs 8 h dagmål) |

Affärsregler Fas 2 (lön/skatt, port PontusArbetsapp):

| Regel | Implementation |
|-------|----------------|
| `BASE_SALARY` 36 470, `PBB` 59 200, tim/dagsavdrag | [`livsmedel2026.ts`](../../../src/modules/ekonomi/rules/livsmedel2026.ts) |
| Tabell 32 kolumn 1 | [`taxTable32.ts`](../../../src/modules/ekonomi/rules/taxTable32.ts) + fixture SKV 2026 |
| VAB / sjuk / karens | [`payAbsenceRules.ts`](../../../src/modules/ekonomi/rules/payAbsenceRules.ts) |
| Lönespec | [`generatePayslipCore.ts`](../../../src/modules/ekonomi/rules/generatePayslipCore.ts) |
| WORM snapshot | Cloud Function `generatePayslip` → `payslip_snapshots` |
| Cron 16:e 08:00 | `scheduledGeneratePayslip` i [`functions/src/index.ts`](../../../functions/src/index.ts) |

Data Connect avvaktar (system-plan).

## 6. Backend och agenter

Ingen LLM i MVP. Framtida sammanfattning endast via Kunskap — **inte** Livs-Coachen här.

Klient-SDK via [`timeEconomyFirestore.ts`](../../../src/modules/core/firebase/timeEconomyFirestore.ts) — ingen Cloud Function krävs för stämpel v1.

## 7. Säkerhet

- PII — strikt `ownerId` / `userId`
- Ingen auto-export till Dossier utan explicit användarval
- Zero Footprint vid unmount (planerat)

## 8. Status idag vs planerat

| Område | Status |
|--------|--------|
| Veckopeng / matlåda / vinst | **done** |
| Firestore `transactions` + rules | **done** |
| Stämpelklocka `time_entries` | **done** |
| EconomyPage + TimeAndPayPanel | **done** |
| `/stampla` veckokalender | **done** |
| Valv ledger / fasta räkningar | **done** (PIN) |
| CSV-import Kalkylark | **script** [`scripts/import-pontus-sheet.mjs`](../../../scripts/import-pontus-sheet.mjs) |
| Flex jämn/ojämn + auto-rast + frånvaro i flex | **done** (Fas 1) |
| `npm run smoke:ekonomi` + `npm test` (payTimeRules) | **done** |
| Sjuk/VAB/karens 365 d, Tabell 32, BASE_SALARY/PBB | **done** (Fas 2) |
| `generatePayslip` + `scheduledGeneratePayslip` (16:e 08:00) | **done** |
| `payslip_snapshots` WORM | **done** |
| Vardagen flikar Tid / Pengar / Logg | **done** (Fas 3) |
| Periodsammanfattning I1–I5-lik | **done** |
| Ledger + fasta i Logg-flik | **done** |
| Valv: endast frånvaro + tidshistorik (PIN) | **done** |
| Livs-Coachen här | **avvisat** |

## 9. Acceptanskriterier

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | Inga grafer/streaks | **done** |
| 2 | SaldoHero + stämpel på Vardagen ekonomi | **done** |
| 3 | Transaktion create (WORM) | **done** |
| 4 | uid-scoped rules alla collections | **done** |
| 5 | Stämpla in/ut utan Kalkylark | **done** |
| 6 | Timlön → uppskattad veckolön | **done** |
| 7 | Auto-rast vid pass > 5 h | **done** |
| 8 | Veckomål 30 h / 50 h (jämn/ojämn ISO-vecka) | **done** |
| 9 | Frånvaro påverkar inte flex-arbetstimmar | **done** |
| 10 | Valv och Vardagen samma flex-källa (`getWeekFlexDetail`) | **done** |
| 11 | `getTaxAmount(36470)` = 7 312 (Tabell 32) | **done** |
| 12 | Karens 365 d / 10-dagars upphävning | **done** |
| 13 | `payslip_snapshots` WORM, klient read-only | **done** |

## 10. Kopplingar

- **Kunskap** — metod — **inte** ekonomidata
- **Dossier** — endast explicit export
- **Kompasser** — separata `checkins`
- **PontusArbetsapp (sandbox)** — referens; inte drift

## 11. Navigation

- Dock Map → `/ekonomi` → Vardagen
- Vardagen flik ekonomi
- `/stampla` från länk i TimeAndPayPanel

## 12. Avvisat

- Google Kalkylark som runtime-databas
- Livs-Coachen / RAG i Ekonomi
- Grafer och gamification
- Gemensam collection med `reality_vault`

---

**Module plan:** [`src/modules/ekonomi/module_plan.md`](../../../src/modules/ekonomi/module_plan.md)  
**Smoke:** [`docs/SMOKE_EKONOMI_TID.md`](../../SMOKE_EKONOMI_TID.md)
