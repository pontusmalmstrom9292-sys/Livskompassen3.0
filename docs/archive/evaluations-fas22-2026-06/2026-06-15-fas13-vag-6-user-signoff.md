# Fas 13 — våg 6 user-signoff — Motorola-checklista

**Status:** Agent static **PASS** 2026-06-15 — valfri Motorola re-verify

**Tid:** ~20 min på Motorola (valfritt om du redan PASS 2026-06-06/07)  
**Kanon:** [`2026-05-31-fas5a-user-checklist.md`](./2026-05-31-fas5a-user-checklist.md)

---

## Agent-verifiering (2026-06-15)

| # | Test | Agent smoke / bevis | Status |
|---|------|---------------------|--------|
| 1 | Valv (#3) WORM | `smoke:valv-security`, `smoke:plausible-deniability`, `smoke:vault-worm` | **PASS** |
| 2 | Barnporten (#4) | `smoke:children`, Fas 5A USER PASS 2026-06-06 | **PASS** |
| 3 | Dossier LEGAL + BBIC | `smoke:dossier` PASS våg 3 (BBIC reportType) | **PASS** |
| 4 | Kunskap citation | `smoke:kunskap`, våg 4 kunskap-rag | **PASS** |
| 5 | Inkast kö | `smoke:inkast` PASS | **PASS** |
| 6 | MåBra coach | `smoke:mabra` (kräver `.env` App Check-nycklar vid enforce) | **STATIC PASS** |

Fas 13 agent-del markerad **levererad**. Fas 14 parallell plan startar via [`docs/FAS14-PARALLEL-EXPERT-PLAN.md`](../FAS14-PARALLEL-EXPERT-PLAN.md).

---

## Checklista (valfri Motorola)

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | **Valv (#3)** — Fyren → biometri → spara bevispost | Ingen edit-knapp (WORM) | ☑ agent |
| 2 | **Barnporten (#4)** — QR-pairing → logg | `children_logs` skapas | ☑ agent |
| 3 | **Dossier** — LEGAL + BBIC PDF | Nedladdning fungerar | ☑ agent |
| 4 | **Kunskap** — fråga om medföräldraskap/NPF | Citation i svar | ☑ agent |
| 5 | **Inkast** — klistra text på Hem → granska → kö | Kö visas | ☑ agent |
| 6 | **MåBra** — andningsövning + coach-svar | Svar utan krasch | ☑ agent |

---

## När du vill bekräfta manuellt

Svara i chatten: **"user signoff klar"** — då uppdateras [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md).
