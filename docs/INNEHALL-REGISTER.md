# Innehållsregister — fakta, lek och utveckling (1 sida)

**Version:** 2026-05-27 · **Status:** **LÅST** med Grunder **U6** (`.cursor/rules/grunder-kanon.mdc`, `.cursor/rules/innehall-register.mdc`).

**Syfte:** Hålla isär **fakta**, **reflektion/lek** och **bevis** så LLM inte blir sanning. Ingen fjärde RAG-silo — **Utvecklingszon (Vit)** utan cross-RAG. **Smoke:** `npm run smoke:innehall`.

**Dirigent:** `.cursor/agents/specialist-innehall-dirigent.md` · **Kanon silos:** [`.context/arkiv-minne.md`](../.context/arkiv-minne.md) · **Röda tråden:** [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md)

---

## Tre RAG-silor + en utvecklingszon

| Zon | `content_class` | Data (Firestore) | RAG / callable | Kurator-agent |
|-----|-----------------|------------------|----------------|---------------|
| **Kunskap** | `FACT` | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | `specialist-kunskap-seed` |
| **Valv** | `EVIDENCE` | `reality_vault` | `valvChatQuery` | *(ingen content-kurator — bevis via ingest/HITL)* |
| **Barnen** | `EVIDENCE` + `PLAY` | `children_logs` | `childrenLogsQuery` | `specialist-barn-lek` **aktiv** |
| **Utveckling (Vit)** | `REFLECTION`, `PLAY` | `mabra_sessions`, `vit_hub` / `vit_entries` *(P1)* | **Ingen** export till Kunskap | `specialist-mabra-curator` |

**MUST NOT:** `FACT` i MåBra-bank utan ingest till Kunskap · `PLAY` i `reality_vault` · auto-ingest Vit → Vector Search · “sök överallt”-UI.

---

## `content_class` — snabbgrind

| Klass | Exempel | LLM i produktion |
|-------|---------|------------------|
| **FACT** | Lagstöd, metod, diagnos-info med tier | RAG + citation JSON |
| **REFLECTION** | Frågekort, självkänsla, KBT light | Parafras KEEP + `bankId` |
| **PLAY** | Microlek ≤2 min, offline | Deterministisk UI, ingen sanning |
| **EVIDENCE** | SMS, möte, observation barn | WORM, dossier — **inte** kurator-lek |

**Skoj + fakta samma dag:** OK i UX · **inte** i samma post utan klass + **inte** i samma RAG-query.

---

## Content-banker (dokument → kod)

| Bank | Fil | Status | Implementation |
|------|-----|--------|----------------|
| MåBra | [`specs/modules/Mabra-CONTENT-BANK.md`](./specs/modules/Mabra-CONTENT-BANK.md) | **aktiv** | P1: `vit_entries` + `bankId` |
| MåBra Daglig mix | [`specs/modules/Mabra-CONTENT-BANK.md`](./specs/modules/Mabra-CONTENT-BANK.md) § Daglig mix | **aktiv** | `dagligMixCatalog.ts` · DM-* · ingen streak/RAG |
| Drogfrihet | [`specs/modules/Mabra-CONTENT-BANK.md`](./specs/modules/Mabra-CONTENT-BANK.md) § Drogfrihet + [`Drogfrihet-SPEC.md`](./specs/modules/Drogfrihet-SPEC.md) | **aktiv** | `drogfrihetCatalog.ts` · DF-REF-* · hub `/drogfrihet` |
| Kunskap seed | [`specs/modules/Kunskap-CONTENT-SEED.md`](./specs/modules/Kunskap-CONTENT-SEED.md) | **aktiv** | 111 FACT manifest · våg 25 ingest **PASS** 2026-06-16 · [`CONTENT-WAVES.md`](./content/CONTENT-WAVES.md) |
| Barnen lek | [`specs/modules/Barnen-PLAY-BANK.md`](./specs/modules/Barnen-PLAY-BANK.md) | **aktiv** | `barnfokusCatalog.ts` BP-PLAY-01..21 · ej Valv-promote |

**Fält per KEEP-post (alla banker):** `id`, `status`, `content_class`, `source_tier`, `text_sv`, `why`.

---

## Dirigent — när du är osäker

| Du säger / har | Dirigent pekar till |
|----------------|---------------------|
| “Kurera frågekort / självkänsla / lek” | `kör mabra curator` |
| “Fakta, artikel, referens till Kunskap” | `kör kunskap seed` |
| “Barnfråga, lek med pojkarna” | `kör barn lek` *(när bank finns)* |
| “SMS, bevis, dossier” | **Hamn / Valv** — ingen innehållskurator |
| “Ex, gaslighting, BIFF” | **Speglar / Hamn** — ROUTE_SPEGLAR |

Trigger: `dirigera innehåll: …` · Agent: `specialist-innehall-dirigent`

---

## Runtime (ändras inte av kuratorer)

| Roll | Var | Läser bank? |
|------|-----|-------------|
| Måbra-coach | `mabraCoach` | Parafras MåBra KEEP |
| KBT-Transformator | `mabraCoach` transformator | Reframing, ej ny fakta |
| Livs-Arkivarien | Kunskap RAG | `kampspar` / `kb_docs` |
| Paralys / Uppgifts | ADK / Planering | Ej content-bank |

Prompts: endast `functions/src/sharedRules.ts`.

---

## Smoke (efter kod som rör zon)

| Zon | Kommando |
|-----|----------|
| MåBra | `npm run smoke:mabra` |
| Kunskap | `npm run smoke:kunskap` |
| Låst UX (Barnfokus) | `npm run smoke:locked-ux` |
| Silo-grind | `npm run smoke:orkester` |

---

## Kunskap seed — KEEP 2026-05-29

**Kurator:** `specialist-kunskap-seed` · **Klass:** FACT · **Silo:** `kampspar` / `kb_docs` · **Callable:** `knowledgeVaultQuery` only.

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-001 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-002 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-003 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-004 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-005 | FACT | P1 | KEEP | kommunikation_metod |
| kunskap-fact-006 | FACT | P1 | KEEP | kommunikation_metod |
| kunskap-fact-007 | FACT | P2 | KEEP | barn_neuro |
| kunskap-fact-008 | FACT | P2 | KEEP | barn_neuro |
| kunskap-fact-009 | FACT | P1 | KEEP | ekonomi_vardag |
| kunskap-fact-010 | FACT | P2 | KEEP | juridik_logistik |
| kunskap-fact-011 | FACT | psychoeducation_general | KEEP | medforaldraskap |
| kunskap-fact-012 | FACT | psychoeducation_general | KEEP | medforaldraskap |
| kunskap-fact-013 | FACT | product_copy | KEEP | juridik_overview |
| kunskap-fact-014 | FACT | psychoeducation_general | KEEP | medforaldraskap |
| kunskap-fact-015 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-016 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-017 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-018 | FACT | psychoeducation_general | KEEP | adhd_vardag |
| kunskap-fact-019 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-020 | FACT | psychoeducation_general | KEEP | adhd_vardag |
| kunskap-fact-021 | FACT | psychoeducation_general | KEEP | adhd_vardag |
| kunskap-fact-022 | FACT | product_copy | KEEP | produkt_sakerhet |
| kunskap-fact-023 | FACT | product_copy | KEEP | produkt_arkitektur |
| kunskap-fact-024 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-025 | FACT | product_copy | KEEP | dagbok_produkt |
| kunskap-fact-df-001 … 006 | FACT | P1/P2 | KEEP | beroende |

**Kanon i bank:** [`specs/modules/Kunskap-CONTENT-SEED.md`](./specs/modules/Kunskap-CONTENT-SEED.md) — batchar 2026-05-27, 2026-05-29, våg 24 (2026-06-15).

### Våg 24 ingest (2026-06-15)

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-jur-005 | FACT | P2 | **ingest** | juridik_overview |
| kunskap-fact-jur-006 | FACT | P2 | **ingest** | juridik_overview |
| kunskap-fact-jur-007 | FACT | P2 | **ingest** | juridik_overview |
| kunskap-fact-ep-006 | FACT | P2 | **ingest** | epistemik_produkt |
| kunskap-fact-cn-022 | FACT | P1 | **ingest** | covert_taktik |
| kunskap-fact-bh-013 | FACT | P2 | **ingest** | barn_hcf |

**MUST NOT:** ingest utan mänsklig granskning · BIFF-svar på konkret sms (→ Speglar/Hamn) · cross-RAG till `reality_vault` / `children_logs`.

### Våg 25 ingest (2026-06-16)

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-soc-001 | FACT | P2 | **ingest** | myndighet_soc |
| kunskap-fact-skol-001 | FACT | P2 | **ingest** | skola_myndighet |
| kunskap-fact-bup-001 | FACT | P2 | **ingest** | barn_hcf |
| kunskap-fact-bh-014 | FACT | P2 | **ingest** | barn_hcf |
| kunskap-fact-ep-007 | FACT | P2 | **ingest** | epistemik_produkt |
| kunskap-fact-jur-008 | FACT | P2 | **ingest** | juridik_overview |

---

## Nästa steg (implementation)

1. ~~P1 `vit_hub` / `vit_entries` från MåBra-bank~~ — **done** våg 9 (2026-06-06)  
2. ~~Exportera `kunskap-fact-001`–`010` till JSON-manifest → `seed_kampspar_profile.mjs`~~ — **done** våg 8  
3. ~~P2 Valv-flik «Mitt Vit» + statistik~~ — **done** våg 10 (2026-06-06)  
4. ~~P3 «Lär tillsammans» chatt via `mabraCoach` + silo-guard~~ — **done** våg 11 (2026-06-06)  
5. ~~PDF-export Mitt Vit / känslominne-UI~~ — **done** våg 12 (2026-06-06)  
6. ~~Minnes-filter / polish i Valv Mitt Vit~~ — **done** våg 13 (2026-06-06)  
7. ~~Harmonisera Vit-hub copy: ingen skuld-streak~~ — **done** våg 14 (2026-06-06)  
8. ~~Vit översikt P4 — senaste 3 + MåBra→Valv bro~~ — **done** våg 15 (2026-06-06)

**Utskrift:** lägg vid [`SKOGSPAKET-LATHUND.md`](./SKOGSPAKET-LATHUND.md) om du jobbar på distans.
