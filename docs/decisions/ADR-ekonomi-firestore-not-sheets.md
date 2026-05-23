# ADR: Ekonomi och stämpelklocka i Firestore (inte Google Kalkylark)

**Status:** Godkänd (2026-05-23)  
**Kontext:** PontusArbetsapp (Apps Script + Kalkylark) gav deploy- och formelfriktion.

## Beslut

- **Drift:** `time_entries`, `economy_profiles`, `transactions`, `economy_ledger`, `economy_fixed_bills`, `budget_savings` i Firestore.
- **UI:** Vardagen → Ekonomi (`EconomyPage` + `TimeAndPayPanel`) och `/stampla` för full vy.
- **Avveckla:** Google Sheets som runtime-databas; sandbox `PontusArbetsapp` endast referens + valfri CSV-import.

## Konsekvenser

- Timmar beräknas i [`src/modules/core/utils/timeMath.ts`](../../src/modules/core/utils/timeMath.ts), inte i arkformler.
- `transactions` förblir WORM; operativ tid i `time_entries` är redigerbar/raderbar.
- Ingen LLM i ekonomimodulen.

## Appendix: Affärsregler Fas 1 (2026-05-23)

Stämpel-/flexlogik från PontusArbetsapp portad till [`src/modules/ekonomi/rules/payTimeRules.ts`](../../src/modules/ekonomi/rules/payTimeRules.ts). Verifiering: `npm test`, golden [`sheet-golden.json`](../../src/modules/ekonomi/rules/__fixtures__/sheet-golden.json), `npm run smoke:ekonomi`.

## Appendix: Lönemotor Fas 2 (2026-05-23)

Sjuk/VAB/karens, Tabell 32, `generatePayslip` / `scheduledGeneratePayslip` (16:e 08:00 Europe/Stockholm), WORM `payslip_snapshots`. Källa regler: [`src/modules/ekonomi/rules/`](../../src/modules/ekonomi/rules/). Functions vendor synkas vid `functions` build via [`scripts/sync-payroll-to-functions.mjs`](../../scripts/sync-payroll-to-functions.mjs). Ingen LLM.

## Referens

- Spec: [`docs/specs/modules/Ekonomi-SPEC.md`](../specs/modules/Ekonomi-SPEC.md)
- Import: [`scripts/import-pontus-sheet.mjs`](../../scripts/import-pontus-sheet.mjs)
