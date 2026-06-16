# Eval — Deep Research slutfas & content våg 27

**Datum:** 2026-06-16 · **Status:** Godkänd för CANDIDATE-bank · **Ingest:** väntar KEEP  
**Källor:** [`research-2026-06-16-master-syntes.md`](../external-ai/imports/research-2026-06-16-master-syntes.md) · SA-1..5 · dirigent-routing

---

## 1. Beslut

| Beslut | Motivering |
|--------|------------|
| **11 FACT CANDIDATE** i Kunskap | Luckor: worry time, body doubling, ekonomi kapacitet, HCF skriftlig, barn lojalitet |
| **3 MåBra CANDIDATE** | REFLECTION/PLAY — ingen cross-RAG |
| **3 Barnen PLAY CANDIDATE** | Ålderssegment toddler → teen |
| **Ingen ingest än** | `status: CANDIDATE` tills Pontus markerar KEEP |
| **2 nya cursor rules** | research-content-gate, capacity-ui-gate (implementerade) |
| **6 regler i eval only** | Hamn-written, barn-epistemik, worry-mabra, no-diagnosis, slutfas-stop, weekly-money |

---

## 2. Content våg 27 — poster

### Kunskap FACT (11)

| bankId | category | source_tier |
|--------|----------|-------------|
| kunskap-fact-gad-036 | gad_angest | P1 |
| kunskap-fact-adhd-029 | adhd_vardag | P2 |
| kunskap-fact-eko-001 | ekonomi_vardag | P2 |
| kunskap-fact-eko-002 | ekonomi_vardag | P2 |
| kunskap-fact-eko-003 | ekonomi_vardag | P2 |
| kunskap-fact-eko-004 | ekonomi_vardag | P2 |
| kunskap-fact-cop-006 | medforaldraskap | P2 |
| kunskap-fact-cop-007 | medforaldraskap_logistik | P2 |
| kunskap-fact-jur-009 | juridik_logistik | P2 |
| kunskap-fact-bh-015 | barn_hcf | P1 |
| kunskap-fact-bh-016 | barn_hcf | P1 |

### MåBra (3)

MB-REF-GAD-07, MB-REF-ADHD-05, MB-PLAY-GAD-02

### Barnen PLAY (3)

BP-PLAY-25 (toddler), BP-PLAY-26 (early_school), BP-PLAY-27 (teen)

**Manifest efter KEEP:** 117 + 11 = **128 FACT** (vid ingest)

---

## 3. Regel-förslag (8)

### Implementerade (`.cursor/rules/`)

1. **`research-content-gate.mdc`** — Research → CANDIDATE → manuell KEEP → ingest  
2. **`capacity-ui-gate.mdc`** — evolution_hub Nivå 1–3 styr ekonomi/planering UI

### Eval / nästa våg (ej .mdc än)

3. **hamn-written-default** — HCF: föreslå skrift före telefon i Hamn  
4. **barn-observation-epistemik** — children_logs citat vs tolkning  
5. **worry-time-mabra-only** — Worry time FACT i Kunskap, övning i MåBra  
6. **no-diagnosis-labels** — (förstärker domän-covert) inga diagnos-etiketter i WORM  
7. **slutfas-stop-list** — streak, 5-tab, cross-RAG, Flutter  
8. **weekly-money-checkin** — veckovis ekonomi som default Nivå 1

---

## 4. Teknik vs content (slutfas-ordning)

| Ordning | Spår | Smoke |
|---------|------|-------|
| 1 | Fas 19.3 hex→tokens | smoke:design-modules |
| 2 | Fas 19.4 JOY-17 mabraCoach | smoke:mabra, smoke:innehall |
| 3 | **Våg 27 KEEP + ingest** | smoke:kunskap, seed:kunskap-facts |
| 4 | Fas 19.5 evolution_ledger | smoke:evolution-discovery |
| 5 | Hamn wire `written_only_escalation` | smoke:design-modules |
| 6 | Fas 19.6 arkiv PMIR | orkester:night |

---

## 5. Stop doing (bekräftat av SA-5)

Streak/XP · teal chrome · cross-RAG · auto-promote barn→Valv · diagnos i dossier · Flutter · Hem→Hjärtat utan PMIR · wow-animationer · 30+ budgetkategorier default · LLM-FACT utan bank

---

## 6. Pontus — ett steg

Granska CANDIDATE i [`Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md) § våg 27. Svara **"godkänn våg 27 KEEP"** för ingest, eller markera enskilda rader REJECT.

---

## 7. Smoke (2026-06-16)

Kör `npm run smoke:innehall` efter bank-append — CANDIDATE ska inte bryta smoke (endast KEEP räknas i prod-wire tills PMIR).
