# Innehållsregister — fakta, lek och utveckling (1 sida)

**Version:** 2026-05-25 · **Status:** **LÅST** med Grunder **U6** (`.cursor/rules/grunder-kanon.mdc`, `.cursor/rules/innehall-register.mdc`).

**Syfte:** Hålla isär **fakta**, **reflektion/lek** och **bevis** så LLM inte blir sanning. Ingen fjärde RAG-silo — **Utvecklingszon (Vit)** utan cross-RAG. **Smoke:** `npm run smoke:innehall`.

**Dirigent:** `.cursor/agents/specialist-innehall-dirigent.md` · **Kanon silos:** [`.context/arkiv-minne.md`](../.context/arkiv-minne.md) · **Röda tråden:** [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md)

---

## Tre RAG-silor + en utvecklingszon

| Zon | `content_class` | Data (Firestore) | RAG / callable | Kurator-agent |
|-----|-----------------|------------------|----------------|---------------|
| **Kunskap** | `FACT` | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | `specialist-kunskap-seed` |
| **Valv** | `EVIDENCE` | `reality_vault` | `valvChatQuery` | *(ingen content-kurator — bevis via ingest/HITL)* |
| **Barnen** | `EVIDENCE` + `PLAY` | `children_logs` | `childrenLogsQuery` | `specialist-barn-lek` *(planerad)* |
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
| Kunskap seed | [`specs/modules/Kunskap-CONTENT-SEED.md`](./specs/modules/Kunskap-CONTENT-SEED.md) | **skelett** | Manuell/`seed_kampspar_profile.mjs` |
| Barnen lek | [`specs/modules/Barnen-PLAY-BANK.md`](./specs/modules/Barnen-PLAY-BANK.md) | **planerad** | Barnfokus-pool, ej Valv-promote |

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

## Nästa steg (implementation)

1. P1 `vit_hub` / `vit_entries` från MåBra-bank  
2. Första `KEEP` i Kunskap-CONTENT-SEED → `seed_kampspar_profile.mjs`  
3. Harmonisera Vit-hub copy: ingen skuld-streak (se Mabra-SPEC)

**Utskrift:** lägg vid [`SKOGSPAKET-LATHUND.md`](./SKOGSPAKET-LATHUND.md) om du jobbar på distans.
