# PMIR-B — P4 MåBra Flow-parafras

**Datum:** 2026-06-18 · **Status:** **IMPLEMENTERAD + DEPLOYAD** (smoke:mabra E2E bank_parafras PASS 2026-06-18)  
**Route:** `/vardagen?tab=mabra` · **Callable:** `mabraCoach` (befintlig — utökning)  
**Parallellt med:** [PMIR-C P6 Dossier](./2026-06-18-pmir-c-p6-dossier-timeline.md) · Worker **B**

---

## 1. Executive summary

P4 lägger en **tunn, kreditbesparande parafras-väg** i befintlig `mabraCoach` — bankId P1 (U6), deterministisk eller lätt LLM-parafras. Ingen ny callable, ingen fjärde silo, ingen ny FACT utan bank.

**Baseline (redan live):** `mabraCoach` med `coach` / `goal_assist` / `rsd_error` / `vit_chat`; `mabraCoachGuard` → Speglar; MB-REF-rsd-04 LOCK (V3).

**Delta (denna PMIR):** Nytt läge `bank_parafras` + valfri `parafrasTier` på standard-coach; Vit-flöden (`VitCardFlowPanel`, `VitMemoryFlowPanel`) anropar deterministisk parafras efter spar.

---

## 2. Beslut


| Fält     | Värde                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| Scope    | Utöka `mabraCoach` — **ingen** ny export i `index.ts` om inte nödvändigt                                             |
| Parafras | `parafraseCoachFromBank` som primär väg; LLM endast när `parafrasTier: 'llm'` explicit                               |
| bankId   | Obligatorisk i `bank_parafras`; valideras via `resolveCoachBankId` / `getMabraCoachBankEntry`                        |
| Guard    | `shouldRedirectMabraCoachToSpeglar` **före** alla lägen (inkl. `optionalNote`, `vitMessage`)                         |
| DCAP     | Ingen LLM-routing — guard i kod                                                                                      |
| Rate     | Behåll `mabraCoach` 30/timme; överväg sub-limit 10/timme för `parafrasTier: 'llm' vad betyder detta? vadå 30/timme?` |
| Kredit   | ~400–800 Flow/Vertex om LLM-väg; ~0 för deterministisk                                                               |


---

## 3. Worker B — disjunkt filset


| Fil                                                                                | Roll                                                  |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `functions/src/callables/agents.ts`                                                | `mabraCoach` — lägen `bank_parafras`, `parafrasTier`  |
| `functions/src/lib/mabraContentBank.ts`                                            | `parafraseCoachFromBank`, bank-resolvers              |
| `functions/src/lib/mabraCoachGuard.ts`                                             | **read-only** — verifiera, ändra ej utan säkerhets-OK |
| `functions/src/agents/vertexAgent.ts`                                              | `askMabraCoach` — LLM-väg endast vid `llm` tier       |
| `src/modules/features/dailyLife/wellbeing/mabra/api/mabraCoachService.ts`          | `fetchBankParafrasCoach`                              |
| `src/modules/features/dailyLife/wellbeing/mabra/components/VitCardFlowPanel.tsx`   | Post-spar coach-rad                                   |
| `src/modules/features/dailyLife/wellbeing/mabra/components/VitMemoryFlowPanel.tsx` | Post-spar coach-rad                                   |
| `scripts/smoke_mabra.mjs`                                                          | Guards för `bank_parafras` + bankId i svar            |


**Worker B får INTE röra:** `dossier`*, `generateDossier`*, `valv.ts` (dossier), `firestore.rules`.

---

## 4. API-skiss

```typescript
// Nytt läge på mabraCoach
{
  mode: 'bank_parafras',
  bankId: 'MB-REF-03',           // krävs
  hubSymptom?: MabraCoachHub,    // valfritt kontext
  exerciseType?: MabraCoachExercise,
  optionalNote?: string          // max 500 tecken
}
// → { coach, redirectToSpeglar, bankId }

// Utökning standard coach (mode saknas)
{
  hubSymptom, exerciseType, optionalNote?,
  bankId?,                        // befintligt
  parafrasTier?: 'deterministic' | 'llm'  // default 'llm' (bakåtkompat)
}
```

---

## 5. Regelanalys


| Lager             | Status                                    |
| ----------------- | ----------------------------------------- |
| U1 tre silos      | PASS — ingen cross-RAG                    |
| U6 innehåll       | PASS — endast KEEP-bank, `bankId` i svar  |
| `mabraCoachGuard` | MUST — ex/konflikt → Speglar, inte MåBra  |
| Locked UX MåBra   | PASS — inga streak/XP                     |
| `sharedRules.ts`  | Ändra ej prompts utan separat godkännande |


---

## 6. Smoke

```bash
cd functions && npm run build
npm run smoke:mabra
npm run smoke:innehall
npm run smoke:grans
npm run smoke:locked-ux
```

**Ny guard (smoke_mabra.mjs):** `mode: 'bank_parafras'` i `agents.ts`; `parafraseCoachFromBank` anropas; `MB-REF-rsd-04` bankId låst.

---

## 7. Deploy

```bash
cd functions && npm run build
firebase deploy --only functions:mabraCoach,hosting
```

Kombinerad deploy med P6 tillåten **efter** båda smoke PASS — en `functions` push.

---

## 8. MUST NOT

- Ny FACT/REFLECTION utan `Mabra-CONTENT-BANK` + INNEHALL-REGISTER
- Cross-RAG MåBra → Kunskap eller Valv
- Ex/konflikt-coaching i MåBra (guard ska redirecta)
- Gamification (streak, XP)
- Ändra `firestore.rules` utan explicit Pontus-OK

---

## 9. Rekommendation

- [x] Godkänn PMIR-B för implementation (Worker B)
- [x] Kräv Flow-prototyp i Google Flow före kod (valfritt — deterministisk väg behöver ej Flow)
- [x] Kombinera deploy med PMIR-C

**Efter smoke PASS:** ny rad **P4** LOCK i `LIFE-OS-BUILD-STATE.md`.

---

## 10. Godkännande

**Pontus:** ja☐ godkänn PMIR-B · ☐ justera scope  
**Datum:** ___20260618

