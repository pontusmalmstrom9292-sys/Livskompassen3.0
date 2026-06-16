# Eval — Deep Research slutfas & content våg 27

**Datum:** 2026-06-16 · **Status:** **KEEP godkänd 2026-06-16** · **Ingest:** **PASS** (Kunskap 23 FACT)  
**Källor:** [`research-cursor-2026-06-16-master-syntes.md`](../external-ai/imports/research-cursor-2026-06-16-master-syntes.md) · SA-1..5 Cursor · baseline [`research-2026-06-16-master-syntes.md`](../external-ai/imports/research-2026-06-16-master-syntes.md)

---

## 1. Beslut

| Beslut | Motivering |
|--------|------------|
| **23 FACT KEEP + ingest** | Baseline 11 + 12 Cursor-NEW (gad-037–039, adhd-030, eko-005–008, bh-017–020) |
| **8 MåBra KEEP** | Baseline 3 + 5 Cursor-NEW (MB-REF-GAD-08, MB-REF-ADHD-06/07, MB-PLAY-GAD-03/04) |
| **5 Barnen PLAY KEEP** | Baseline 3 + 2 Cursor-NEW (BP-PLAY-28/29) |
| **Ingest klar** | Pontus **"godkänn våg 27 KEEP"** 2026-06-16 → `export:kunskap-seed` + `seed:kunskap-facts` |
| **2 cursor rules implementerade** | research-content-gate, capacity-ui-gate |
| **6 regler eval only** | Hamn-written (våg 28), barn-epistemik (våg 29), worry-mabra, no-diagnosis, slutfas-stop, weekly-money |

---

## 2. Cursor-fynd (jämfört baseline)

| SA | NEW | OVERLAP/KEEP | DEFER/REJECT |
|----|-----|--------------|--------------|
| SA-1 Psyk | 10 (FACT+REFLECTION+PLAY) | 8 | 1 DEFER (ADDA P3) |
| SA-2 HCF | 3 FACT + 1 wire eval | 15 KEEP | 1 REJECT (diagnos-quiz) |
| SA-3 Ekonomi | 10 FACT + 2 regel-eval | 4 KEEP (kod+seed) | progressive disclosure → regel |
| SA-4 Barn | 5 FACT + 2 PLAY | 6 OVERLAP | epistemik → våg 29 |
| SA-5 Meta | modul-matris, våg 27–30 ordning | 2 regler ✅ | 6 regler deferred |

**Citation-uppgraderingar:** cop-007 → P1 Bris/Socialstyrelsen · gad-036 → RNOH timing · jur-009 → AFCC 2019 beslutsmandat · adhd-029 → ACM-referens via adhd-030.

---

## 3. Content våg 27 — poster

### Kunskap FACT (23 CANDIDATE)

| bankId | category | source_tier | Ny? |
|--------|----------|-------------|-----|
| kunskap-fact-gad-036 | gad_angest | P1 | baseline |
| kunskap-fact-gad-037 | gad_angest | P1 | **NEW** worry tree |
| kunskap-fact-gad-038 | kanslor_vagus | P1 | **NEW** fysiologisk suck |
| kunskap-fact-gad-039 | gad_angest | P1 | **NEW** oro-tid timing |
| kunskap-fact-adhd-029 | adhd_vardag | P2 | baseline |
| kunskap-fact-adhd-030 | adhd_vardag | P2 | **NEW** evidens-disclaimer |
| kunskap-fact-eko-001 | ekonomi_vardag | P2 | baseline |
| kunskap-fact-eko-002 | ekonomi_vardag | P2 | baseline |
| kunskap-fact-eko-003 | ekonomi_vardag | P2 | baseline |
| kunskap-fact-eko-004 | ekonomi_vardag | P2 | baseline |
| kunskap-fact-eko-005 | ekonomi_vardag | P2 | **NEW** impulshink |
| kunskap-fact-eko-006 | ekonomi_vardag | P2 | **NEW** två-konto |
| kunskap-fact-eko-007 | ekonomi_vardag | P2 | **NEW** sparkonto friktion |
| kunskap-fact-eko-008 | ekonomi_vardag | P2 | **NEW** vecko-rollover |
| kunskap-fact-cop-006 | medforaldraskap | P2 | baseline |
| kunskap-fact-cop-007 | medforaldraskap_logistik | P1 | baseline (citation ↑) |
| kunskap-fact-jur-009 | juridik_logistik | P2 | baseline |
| kunskap-fact-bh-015 | barn_hcf | P1 | baseline |
| kunskap-fact-bh-016 | barn_hcf | P1 | baseline |
| kunskap-fact-bh-017 | barn_hcf | P1 | **NEW** skol/fritid |
| kunskap-fact-bh-018 | barn_hcf | P1 | **NEW** Barnombudet |
| kunskap-fact-bh-019 | barn_hcf | P1 | **NEW** tidigt stöd |
| kunskap-fact-bh-020 | barn_hcf | P1 | **NEW** parrelation åt sidan |

### MåBra (8 CANDIDATE)

MB-REF-GAD-07, MB-REF-GAD-08, MB-REF-ADHD-05, MB-REF-ADHD-06, MB-REF-ADHD-07, MB-PLAY-GAD-02, MB-PLAY-GAD-03, MB-PLAY-GAD-04

### Barnen PLAY (5 CANDIDATE)

BP-PLAY-25 (toddler), BP-PLAY-26 (early_school), BP-PLAY-27 (teen), BP-PLAY-28 (pre_teen), BP-PLAY-29 (early_school)

**Manifest efter KEEP:** 117 + 23 = **140 FACT** (ingest PASS 2026-06-16)

---

## 4. Regel-förslag (8)

### Implementerade (`.cursor/rules/`)

1. **`research-content-gate.mdc`** — Research → CANDIDATE → manuell KEEP → ingest  
2. **`capacity-ui-gate.mdc`** — evolution_hub Nivå 1–3 styr ekonomi/planering UI

### Eval / nästa våg (ej .mdc än)

3. **hamn-written-default** — våg 28; kopplar `written_only_escalation` (SA-2)  
4. **barn-observation-epistemik** — våg 29; children_logs citat vs tolkning  
5. **worry-time-mabra-only** — våg 27/28; FACT Kunskap, övning MåBra  
6. **no-diagnosis-labels** — våg 28; förstärker domän-covert  
7. **slutfas-stop-list** — våg 30; streak, 5-tab, cross-RAG, Flutter  
8. **weekly-money-checkin** — våg 28; veckovis ekonomi Nivå 1 default

---

## 5. Teknik vs content (slutfas-ordning)

| Ordning | Spår | Smoke |
|---------|------|-------|
| 1 | Fas 19.3 hex→tokens | smoke:design-modules |
| 2 | Fas 19.4 JOY-17 mabraCoach | smoke:mabra, smoke:innehall |
| 3 | **Våg 27 KEEP + ingest** | smoke:kunskap, seed:kunskap-facts |
| 4 | Fas 19.5 evolution_ledger | smoke:evolution-discovery |
| 5 | Våg 28 Hamn wire + regler 3, 5, 6, 8 | smoke:design-modules |
| 6 | Våg 29 Barnporten + barn-epistemik | smoke:locked-ux, smoke:children |
| 7 | Fas 19.6 arkiv PMIR | orkester:night |

---

## 6. Stop doing (bekräftat av SA-5)

Streak/XP · teal chrome · cross-RAG · auto-promote barn→Valv · diagnos i dossier · Flutter · Hem→Hjärtat utan PMIR · wow-animationer · 30+ budgetkategorier default · LLM-FACT utan bank

---

## 7. Pontus — KEEP (2026-06-16)

Pontus godkände **"godkänn våg 27 KEEP"** — 36 poster promoted (23 Kunskap FACT + 8 MåBra + 5 Barnen PLAY).

---

## 8. Ingest & smoke (2026-06-16)

```bash
npm run export:kunskap-seed
npm run seed:kunskap-facts
npm run smoke:innehall
npm run smoke:mabra
```

| Kommando | Status |
|----------|--------|
| `export:kunskap-seed` | PASS — 140 KEEP → manifest |
| `seed:kunskap-facts` | PASS — ok 23, skip 117, fail 0 |
| `npm run smoke:innehall` | PASS |
| `npm run smoke:mabra` | PASS |

---

## 9. Smoke (2026-06-16 pre-KEEP)

`npm run smoke:innehall` — CANDIDATE ska inte bryta smoke (endast KEEP räknas i prod-wire tills PMIR).
