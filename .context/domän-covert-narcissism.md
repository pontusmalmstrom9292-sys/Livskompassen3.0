# Domän — dold narcissism, barn och bevis (kanon för byggare)

**Version:** 2026-06-14 · **Status:** aktiv röd tråd · **Upload-prior:** ~80% bevis/HCF-covert

**Full analys:** [`docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md`](../docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md)

**Cursor-regel:** [`.cursor/rules/domän-covert-narcissism.mdc`](../.cursor/rules/domän-covert-narcissism.mdc) (alwaysApply)

---

## Kort

Pontus case: medföräldraskap med **högkonflikt**, **covert** (dold) dynamik hos kvinnlig motpart — offerroll, perfekt fasad utåt, gaslighting, DARVO, triangulering, tyst straff/invalidation. Barn ska skyddas utan lojalitetspress. Bevis = **beteende + datum** i Valv — **aldrig** diagnosetiketter i WORM eller mot myndigheter.

**~80% av inkast** förväntas vara bevis, sms/mejl, tidslinjer eller teorier om dessa mönster. Systemet ska anta denna lins när routing är oklar (fail-closed → Granska).

---

## Täckning idag (RAG + bank)

| Område | Var | Status |
|--------|-----|--------|
| Covert taktik (generellt + HCF) | `cn-001`–`015` | **KEEP + ingest** |
| Barn i HCF (lojalitet, PA, invalidation) | `bh-001`–`008`, barn-referens seed | **KEEP + ingest** |
| DARVO, love bombing, triangulering, projektion | `043`–`047` | **KEEP + ingest** |
| BIFF, Grey Rock, JADE, parallel parenting | `005`–`006`, `cn-009`–`012` | **KEEP + ingest** |
| Profil (Kasper, Arvid, vårdnad, taktiker) | Kampspar-PROFIL-SEED | **ingest** |
| Runtime DCAP | `DCAP.ts`, `mabraCoachGuard` | **live** |
| Inkast-heuristik | `inboxClassifier.ts` | **live** |

---

## Luckor (våg 21 — planerad)

Inte fullständig «handbok» än. Saknas eller är tunt:

- Hoovering / återkontakt efter gräns
- Smear campaign / flying monkeys (systematiskt)
- Ekonomisk kontroll och logistik som vapen
- Juridisk weaponization (vårdnad, LVU-process) — svensk kontext
- «Perfekt mor»-fasad specifikt (maternal image vs hem)
- Trauma bonding / cykel love-bomb → straff (djupare än 043–044)
- Valv Mönster: auto-tag-bibliotek per teknik (DCAP → dossier)

Kurator: `specialist-kunskap-seed` · Dirigent vid osäkerhet.

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

## MUST NOT

- Cross-RAG mellan silor (U1)
- «Narcissist» i WORM, prod-coaching eller soc-skrivelser
- PA-autodiagnos i Barnen
- Auto-promote barnlogg → Valv
- BIFF-coaching i Kunskap RAG (→ Hamn)

---

## Smoke

`npm run smoke:innehall` · `npm run smoke:hamn` · `npm run smoke:locked-ux`
