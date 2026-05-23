# Ekonomi-modul

Vardagsekonomi + stämpelklocka i Firestore (inte Google Kalkylark).

- **UI:** `components/EconomyPage.tsx`, `TimeAndPayPanel`, `StampClockPanel`, `WorkWeekSummary`
- **Data:** `core/firebase/firestore.ts` (transactions), `timeEconomyFirestore.ts` (tid, ledger, sparmål)
- **Tid:** `utils/workTime.ts` → `core/utils/timeMath.ts`

Spec: [`docs/specs/modules/Ekonomi-SPEC.md`](../../../docs/specs/modules/Ekonomi-SPEC.md)
