# Domän — dold narcissism, barn och bevis (kanon för byggare)

**Version:** 2026-06-14 · **Status:** aktiv röd tråd · **Upload-prior:** ~80% bevis/HCF-covert

**Full analys:** [`docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md`](../docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md)

**Cursor-regel:** [`.cursor/rules/domän-covert-narcissism.mdc`](../.cursor/rules/domän-covert-narcissism.mdc) (alwaysApply)

---

## Kort

Pontus case: medföräldraskap med **högkonflikt**, **covert** (dold) dynamik hos kvinnlig motpart — offerroll, perfekt fasad utåt, gaslighting, DARVO, triangulering, tyst straff/invalidation. Barn ska skyddas utan lojalitetspress. Bevis = **beteende + datum** i Valv — **aldrig** diagnosetiketter i WORM eller mot myndigheter.

**~80% av inkast** förväntas vara bevis, sms/mejl, tidslinjer eller teorier om dessa mönster. Systemet ska anta denna lins när routing är oklar (fail-closed → Granska).

---

## Täckning idag (RAG + bank + Hamn wire)

| Område | Var | Status |
|--------|-----|--------|
| Covert taktik (generellt + HCF) | `cn-001`–`015` | **KEEP + ingest** |
| Barn i HCF (lojalitet, PA, invalidation) | `bh-001`–`008`, barn-referens seed | **KEEP + ingest** |
| DARVO, love bombing, triangulering, projektion | `043`–`047` | **KEEP + ingest** |
| BIFF, Grey Rock, JADE, parallel parenting | `005`–`006`, `cn-009`–`012` | **KEEP + ingest** |
| Profil (Kasper, Arvid, vårdnad, taktiker) | Kampspar-PROFIL-SEED | **ingest** |
| Hoovering, smear, flying monkeys, trauma bonding | `cn-016`–`019` | **KEEP + ingest** (våg 21) |
| Maternal-image fasad | `cn-020` | **KEEP + ingest + Hamn wire** (våg 22) |
| Ekonomisk kontroll | `cn-021` | **KEEP + ingest + Hamn wire** (våg 22) |
| Juridik / LVU / vårdnad (svensk kontext) | `jur-001`–`004`, `ep-001`–`005` | **KEEP + ingest** (våg 21) |
| Runtime DCAP | `DCAP.ts`, `mabraCoachGuard` | **live** |
| Inkast-heuristik | `inboxClassifier.ts` | **live** |
| Hamn taktik-signal (deterministisk) | `hamnTaktikWire.ts` → Taktik-lexikon | **live** (hoover, smear, ekonomisk_kontroll, maternal_fasad, trauma_bonding, juridik_hot) |

---

## Luckor (efter våg 21–22)

Våg **21** och **22** bank + ingest + Hamn-wire **klara** 2026-06-14. Kvarvarande luckor:

| Lucka | Bank/RAG | Hamn wire | Status |
|-------|----------|-----------|--------|
| Hoovering / återkontakt efter gräns | `cn-016` | hoovering | **done** |
| Smear / flying monkeys | `cn-017`, `cn-018` | smear (+ utökade sv-mönster) | **done** |
| Ekonomisk kontroll | `cn-021` | ekonomisk_kontroll | **done** |
| Maternal-image fasad | `cn-020` | maternal_fasad | **done** |
| Juridisk weaponization (vårdnad, LVU) | `jur-001`–`004` | juridik_hot | **done** |
| Trauma bonding (djupare cykel) | `cn-019` | trauma_bonding | **done** |
| Valv Mönster: auto-tag per teknik | — | — | **open** (DCAP → dossier) |

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
