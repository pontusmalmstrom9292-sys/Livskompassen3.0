# MåBra — genomförbarhetsplan (Cursor, utan Vertex)

**Datum:** 2026-05-29  
**Metod:** Direkt läsning av repo + U6 innehållskanon  
**Kanon:** [`docs/specs/modules/Mabra-SPEC.md`](../specs/modules/Mabra-SPEC.md) · [`Mabra-CONTENT-BANK.md`](../specs/modules/Mabra-CONTENT-BANK.md) · [`.context/modules/mabra_sidan.md`](../../.context/modules/mabra_sidan.md)  
**Kod:** `src/modules/wellbeing/mabra/`  
**Mall:** [`MALL-cursor-plan.md`](./MALL-cursor-plan.md)

---

## Slutsats

**MåBra MVP + Daglig Mix är live.** Fas 1.5 (polish) = **hub synlighet** för Daglig Mix + bank/register-paritet — **implementerat**.

Nästa meningsfulla steg är **Fas 2 (produkt-UX idéer)** från [`2026-05-27-mabra-ideer.md`](./2026-05-27-mabra-ideer.md) — lågenergi-läge, landningsremsa — **inte** blocker för commit.

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
| Lågenergi-läge hub | Nej | **Fas 2** — idé #1 i mabra-ideer |
| Landningsremsa efter övning | Delvis | **Fas 2** — idé #2 |
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

## Fas 2 — Produkt-UX (senare)

- Lågenergi-toggle på hub (`mabra-ideer` §1)
- Landningsremsa efter `MabraComplete` (§2)
- Guardrail-hint utan auto-redirect (§5)

---

## Nästa steg

Svara **`kör MåBra Fas 2`** för lågenergi + landningsremsa, eller **`kör annan modul`** enligt [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md).
