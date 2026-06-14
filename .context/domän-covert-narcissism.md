# Domän — dold narcissism, barn och bevis (kanon för byggare)

**Version:** 2026-06-14 · **Status:** aktiv röd tråd

**Full analys:** [`docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md`](../docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md)

---

## Kort

Pontus case: medföräldraskap med högkonflikt, covert mönster (offerroll, gaslighting, DARVO, triangulering). Barn ska skyddas utan lojalitetspress. Bevis = beteende + datum i Valv — **aldrig** diagnosetiketter i WORM eller mot myndigheter.

---

## Modul-mappning

| Behov | Modul | Silo |
|-------|-------|------|
| Ex-sms → svar | Hamn (BIFF) | ephemeral → Valv om sparat |
| Validera gaslighting | Speglar | Zero Footprint |
| Bevis, mönster, dossier | Valv (`ValvInputSuperModule`) | `reality_vault` WORM |
| Barnobservation | Familjen Barnfokus | `children_logs` |
| Metod/fakta | Kunskapsbank (PIN) | `kampspar` RAG |

---

## Kunskap seed (våg 20)

| Prefix | Kategori | Antal |
|--------|----------|-------|
| `kunskap-fact-cn-001`–`015` | `covert_taktik` | 15 |
| `kunskap-fact-bh-001`–`008` | `barn_hcf` | 8 |

Bank: [`docs/specs/modules/Kunskap-CONTENT-SEED.md`](../docs/specs/modules/Kunskap-CONTENT-SEED.md)

---

## MUST NOT

- Cross-RAG mellan silor (U1)
- «Narcissist» i WORM, prod-coaching eller soc-skrivelser
- PA-autodiagnos i Barnen
- Auto-promote barnlogg → Valv
- BIFF-coaching i Kunskap RAG (→ Hamn)

---

## Smoke

`npm run smoke:innehall` · `npm run smoke:hamn` · `npm run smoke:locked-ux`
