# Research — MASTER syntes (Deep Research)

**Datum:** 2026-06-16 · **Källor:** SA-1..SA-5 (Cursor baseline) · **Status:** Klar för kuratering våg 27

---

## Executive summary (15 rader max)

1. **Lucka GAD:** worry time saknas som Kunskap-FACT trots våg 2 GAD — hög prioritet.  
2. **Lucka ADHD:** body doubling + veckobudget ekonomi — kompletterar fact-009.  
3. **Lucka HCF:** parallel parenting AFCC + skriftlig-default + parenting coordinator.  
4. **Lucka barn:** lojalitet 10–14 (bh-015) + teen PLAY i Barnporten.  
5. **Lucka regler:** capacity-ui-gate och research-content-gate saknas som cursor rules.  
6. **OVERLAP stark:** BIFF/Grey Rock, cn-016–021, cop-001–005, MB-REF-GAD — KEEP, ingest inte duplicera.  
7. **REJECT bekräftat:** streak, 5-tab, diagnos-etiketter, cross-RAG.  
8. **Hamn wire:** `written_only_escalation` ny deterministisk signal.  
9. **Evolution:** Nivå 1 = veckosaldo + mikrosteg; Kanban Nivå 2+.  
10. **Top 5 regler:** research-gate, capacity-ui, no-diagnosis-labels, barn-epistemik, slutfas-stop-list.

**Våg 27 (15 poster):** 6 FACT Kunskap, 4 REFLECTION MåBra, 3 PLAY Barnen, 2 regler-eval.

---

## Prioriterad våg 27-plan

| # | Forslag id | content_class | Bank-id (efter kuratering) | SA |
|---|------------|---------------|----------------------------|-----|
| 1 | worry time | FACT | kunskap-fact-gad-036 | SA-1 |
| 2 | body doubling | FACT | kunskap-fact-adhd-029 | SA-1 |
| 3 | 24h impuls | FACT | kunskap-fact-eko-001 | SA-1/3 |
| 4 | tre buckets | FACT | kunskap-fact-eko-002 | SA-3 |
| 5 | digital envelope | FACT | kunskap-fact-eko-003 | SA-3 |
| 6 | veckobudget | FACT | kunskap-fact-eko-004 | SA-3 |
| 7 | parallel parenting AFCC | FACT | kunskap-fact-cop-006 | SA-2 |
| 8 | skriftlig default | FACT | kunskap-fact-cop-007 | SA-2 |
| 9 | parenting coordinator | FACT | kunskap-fact-jur-009 | SA-2 |
| 10 | lojalitet BRIS | FACT | kunskap-fact-bh-015 | SA-4 |
| 11 | budbärare | FACT | kunskap-fact-bh-016 | SA-4 |
| 12 | MB-REF-GAD-07 | REFLECTION | MåBra | SA-1 |
| 13 | MB-REF-ADHD-05 | REFLECTION | MåBra | SA-1 |
| 14 | BP-PLAY-25..27 | PLAY | Barnen | SA-4 |
| 15 | capacity-ui-gate | rules | eval + .mdc | SA-5 |

---

## Regel-förslag (sammanfattning)

Se [`research-2026-06-16-sa5-regler.md`](./research-2026-06-16-sa5-regler.md) § 8 regel-förslag.  
Full eval: [`docs/evaluations/2026-06-16-research-slutfas.md`](../../evaluations/2026-06-16-research-slutfas.md).

---

## Källista (urval)

1. https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/  
2. https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/  
3. https://health.clevelandclinic.org/body-doubling-for-adhd  
4. https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf  
5. https://www.bris.se/for-vuxna/stod-och-rad/  
6. https://www.addrc.org/your-adhd-friendly-budget-how-to-set-it-up-and-make-it-stick/  
7. https://unburden.money/blog/adhd-friendly-budget  
8. https://digitaldashboardhub.com/adhd-budget-system-no-willpower/

---

## Nästa steg (Cursor)

1. `specialist-innehall-dirigent` — klassa NEW-rader  
2. Append `status: CANDIDATE` i content-banker  
3. Pontus godkänner → `KEEP` → `npm run seed:kunskap-facts`  
4. `npm run smoke:innehall`

Jämför alla fynd mot bifogad modul-register och innehållsregister. Markera OVERLAP vs GAP. Prioritera det som stärker slutfasen utan att bryta locked UX.
