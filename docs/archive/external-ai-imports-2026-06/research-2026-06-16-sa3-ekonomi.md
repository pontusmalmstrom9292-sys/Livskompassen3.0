# Research — SA-3 Ekonomi & kapacitetsstyrning

**Datum:** 2026-06-16 · **Agent:** SA-3 (Cursor baseline)

---

## Top 5 NEW

| # | id | Varför |
|---|-----|--------|
| 1 | research-sa3-001 | Tre-buckets / 50-30-20 förenklad |
| 2 | research-sa3-002 | Digital envelope (4–5 kategorier max) |
| 3 | research-sa3-003 | Veckonummer istället för månadsbudget |
| 4 | research-sa3-004 | Impulse fund (dopamin-säker) |
| 5 | research-sa3-005 | evolution_hub Nivå 1 = saldo + ett mikrosteg |

---

## Fynd (YAML)

```yaml
id: research-sa3-001
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=kompasser&vardagenTab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/your-adhd-friendly-budget-how-to-set-it-up-and-make-it-stick/
source_title: ADD Resource Center — ADHD-Friendly Budget
claim_sv: "En förenklad budget med tre hinkar — essentials, discretionary, spar/skuld — kräver mindre kognitiv uppföljning än detaljerad kategorispårning och passar många med exekutiv belastning."
why: "Kompletterar kunskap-fact-009 (fakturor) med struktur."
existing_overlap: kunskap-fact-009
recommendation: NEW
rule_impact: infinite-evolution — economy_advanced låst till Nivå 2+
```

```yaml
id: research-sa3-002
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=kompasser&vardagenTab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://digitaldashboardhub.com/adhd-budget-system-no-willpower/
source_title: DDH — ADHD Budget System
claim_sv: "Digitala kuvert med 4–5 breda kategorier ger visuell knapphet utan kontanthantering; färre kategorier minskar beslutströtthet vid varje köp."
why: "EconomySavingsPanel + envelope UX."
existing_overlap: INGEN
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa3-003
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=kompasser&vardagenTab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://unburden.money/blog/adhd-friendly-budget
source_title: Unburden — ADHD-Friendly Budgeting
claim_sv: "Veckobudget med ett synligt 'spend number' är lättare att hålla i arbetsminnet än månadsbudget för personer med tidsblindhet."
why: "Kapacitetsstyrd ekonomi — Nivå 1 UI."
existing_overlap: INGEN
recommendation: NEW
rule_impact: evolution_hub — visa veckosaldo före månadsvy
```

```yaml
id: research-sa3-004
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=kompasser&vardagenTab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/your-adhd-friendly-budget-how-to-set-it-up-and-make-it-stick/
source_title: ADD Resource Center
claim_sv: "En liten månatlig 'impulshink' med tydligt tak minskar skuld vid spontanköp — när den är slut pausar du, utan total förbudskänsla."
why: "Anti-shame, anti-streak."
existing_overlap: INGEN
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa3-005
content_class: FACT
target_zone: rules
target_module: admin/planning
route: /planering?tab=handling
category: adhd_vardag
source_tier: product_copy
source_url: https://psychiatry-cy.com/managing-finances-with-adhd-and-impulsivity-evidence-based-strategies-that-work/
source_title: Psychiatry CY — ADHD finances
claim_sv: "Korta veckovisa 'money check-ins' (under 10 min) med visuella verktyg presterar bättre än sällsynta långa budgetsessioner för ADHD."
why: "Paralys-Brytaren + ekonomi samma kadens."
existing_overlap: Paralys-Brytaren live
recommendation: NEW
rule_impact: infinite-evolution.mdc — dokumentera veckocheck-in som Nivå 1
```

```yaml
id: research-sa3-006
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=kompasser&vardagenTab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://psychiatry-cy.com/managing-finances-with-adhd-and-impulsivity-evidence-based-strategies-that-work/
source_title: Psychiatry CY
claim_sv: "Automatisering av fasta räkningar och sparande minskar antalet månatliga beslut; manuell granskning kan reserveras för rörliga utgifter."
why: "Gratis tier — autogiro redan i fact-009."
existing_overlap: kunskap-fact-009
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-sa3-007
content_class: FACT
target_zone: rules
target_module: core
route: /
category: produkt_arkitektur
source_tier: P2
source_url: https://digitaldashboardhub.com/adhd-budget-system-no-willpower/
source_title: DDH
claim_sv: "Kapacitetsstyrd UI bör visa ett jobb per skärm och begränsa val vid låg energi — motsatsen till 30+ budgetkategorier."
why: "Gap-matris BUILD #5 DEFER — regel inte polish än."
existing_overlap: gap-matrix wave-2 polish DEFER
recommendation: NEW
rule_impact: .cursor/rules — capacity-ui-gate (förslag i slutfas-eval)
```

---

## Evolution/kapacitetsregler (3 förslag)

1. **Nivå 1:** Endast veckosaldo + impulshink + Paralys ett mikrosteg; dölj Kanban.
2. **Nivå 2:** Tre-buckets + P3 Kanban (feature flag `planning_kanban`).
3. **Nivå 3:** `economy_advanced` — sparmål, kuvert, export.

Logga nivåbyte i `evolution_ledger` (dual-write Fas 19.5).
