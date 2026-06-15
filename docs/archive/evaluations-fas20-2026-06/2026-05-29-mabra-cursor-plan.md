# MåBra — genomförbarhetsplan (Cursor, utan Vertex)

> **Status:** `closed` · rollout 2026-05-29 · smoke PASS. **Öppet:** [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md).

**Datum:** 2026-05-29  
**Metod:** Direkt läsning av repo + U6 innehållskanon  
**Kanon:** [`docs/specs/modules/Mabra-SPEC.md`](../specs/modules/Mabra-SPEC.md) · [`Mabra-CONTENT-BANK.md`](../specs/modules/Mabra-CONTENT-BANK.md) · [`.context/modules/mabra_sidan.md`](../../.context/modules/mabra_sidan.md)  
**Kod:** `src/modules/wellbeing/mabra/`  
**Mall:** [`MALL-cursor-plan.md`](./MALL-cursor-plan.md)

---

## Slutsats

**MåBra MVP + Daglig Mix är live.** Fas 1.5 (polish) = **hub synlighet** för Daglig Mix + bank/register-paritet — **implementerat**.

Nästa meningsfulla steg är **Fas 2 kvar** (§3 Vit-projekt, §5 guardrail) — lågenergi + landningsremsa **implementerat** 2026-05-29.

---

## REASONS (kort)

| | |
|---|---|
| **Requirements** | Daglig mix synlig på hub; DM-* bankId; ingen streak/XP; ex → Speglar guard |
| **Entities** | `mabra_sessions` (WORM metadata); `dagligMixCatalog.ts` |
| **Approach** | `DagligMixPanel` på hub + VitHub; deterministisk `pickDagligMix` |
| **Structure** | `MabraPage` step `hub` |
| **Operations** | `saveMabraSession` med `exerciseType: 'daglig_mix'` |
| **Norms** | Obsidian Calm; REFLECTION/PLAY only |
| **Safeguards** | U6: ingen Kunskap-RAG; `mabraCoachGuard` för ex-text |

---

## Vad som redan fungerar (verifierat i kod)

| Krav | Kod |
|------|-----|
| Daglig Mix på hub | `MabraPage.tsx` — `DagligMixPanel` i `step === 'hub'` |
| DM-* bank parity | `dagligMixCatalog.ts` (8 kort + 3 spel) ↔ `Mabra-CONTENT-BANK.md` |
| Session metadata | `handleDagligMixComplete` → `saveMabraSession` |
| Hub registry | `mabraHubRegistry.ts` — `daglig_mix` under lekar |
| Smoke U6 | `npm run smoke:innehall` PASS |

---

## Gap-analys (spår 1 vs kod)

| Spec / nasta-fas | Kod idag | Gap |
|------------------|----------|-----|
| Hub visar Daglig Mix | Ja — direkt på hub | **Ingen** (Fas 1.5 klar) |
| Alla DM-* i register | Ja | **Ingen** |
| Lågenergi-läge hub | Ja — toggle + två val | **Ingen** (Fas 2 §1 done) |
| Landningsremsa efter övning | Ja — max 3 chips | **Ingen** (Fas 2 §2 done) |
| Vit-projekt djup-länk | Delvis | **Fas 2** — idé #3 |

---

## Bevaras (MUST NOT regress)

- Ingen Kunskap-RAG / kampspar-läsning i MåBra UI
- Ingen streak/XP/gamification
- Speglar-guard vid ex/konflikt (`mabraCoachGuard`)
- WORM `mabra_sessions` append-only

---

## Fas 1.5 — ADHD-polish (ingen rules)

| # | Leverans | Status |
|---|----------|--------|
| 1 | `DagligMixPanel` monterad på `/mabra` hub | **done** |
| 2 | DM-* parity bank ↔ kod | **done** |
| 3 | `npm run smoke:innehall` + `smoke:locked-ux` | **done** |

**Acceptans**

- [x] Hub visar Daglig Mix med dagens kort/spel
- [x] Alla DM-* har `bankId` + register-rad (KEEP)
- [x] `npm run smoke:innehall` + `smoke:locked-ux` PASS
- [x] `module_plan.md` speglar **done**

---

## Fas 2 — Produkt-UX (partial done 2026-05-29)

| # | Leverans | Status |
|---|----------|--------|
| 1 | Lågenergi-toggle på hub (`mabra-ideer` §1) | **done** |
| 2 | Landningsremsa efter `MabraComplete` (§2) | **done** |
| 3 | Guardrail-hint utan auto-redirect (§5) | **open** |

**Acceptans (§1–§2)**

- [x] Toggle *Jag orkar lite idag* — två stora val, ingen streak/skuld
- [x] Landningsremsa — max 3 chips (Dagbok · frågekort · kväll)
- [x] Frågekort från remsa = deterministiskt `bankId` (`pickDailyReflectionCard`)
- [x] `npm run build` + `npm run smoke:innehall` + `smoke:locked-ux` PASS (batch 2026-05-29)
- [x] `module_plan.md` speglar **done**

---

## Fas 2 — kvar (senare)

- Guardrail-hint utan auto-redirect (§5)
- Vit-projekt djup-länk (§3)

---

## Nästa steg

Svara **`kör MåBra Fas 2`** för lågenergi + landningsremsa, eller **`kör annan modul`** enligt [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md).
