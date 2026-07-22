# Kat 5 — P5-C closure (Målsättning ↔ Morgonkompass)

**Datum:** 2026-06-14  
**Status:** PASS (kod + smoke) — manuell Morgonkompass-test rekommenderas före prod  
**Baseline:** [`mabra-cat5-goals-baseline.md`](mabra-cat5-goals-baseline.md)

---

## Levererat

| Steg | Artefakt | Status |
|------|----------|--------|
| P5-A | `goalDetection.ts` + `useGoalDetection` | ✓ |
| P5-B | `MabraGoalPanel` + `goalFocusService` + `usePrimaryGoal` | ✓ |
| R1 | `user_daily_focus` rules (`primaryGoal*`) | ✓ kod |
| C1 | `mabraCoach` mode `goal_assist` (C-goal-01/02) | ✓ |
| P5-C | Slot 1 sync via `confirmPrimaryGoal` | ✓ kod |

---

## Kontrakt (M2)

- `confirmPrimaryGoal` skriver `primaryGoal` till `user_daily_focus` och slot 1 i Morgonkompassen.
- `fetchFocusPoints` läser `primaryGoal` tillbaka (befintlig kanon).
- Legacy `daily_intentions` förblir read-only fallback (M3 — ej rörd).

---

## Manuell checklist (USER)

1. Öppna `/mabra` → Målsättning → bekräfta ett mål.
2. Öppna Morgonkompassen → verifiera att slot 1 visar samma text.
3. Justera mål i MåBra → verifiera att Morgonkompassen uppdateras efter refresh.

---

## Gates

- `npm run build` — kör vid merge
- `npm run smoke:mabra` — Kat 5 steg
- Rules deploy: `firebase deploy --only firestore:rules`
- Callable deploy: `firebase deploy --only functions:mabraCoach`
