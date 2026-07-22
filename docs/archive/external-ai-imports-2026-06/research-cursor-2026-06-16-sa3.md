# Research — SA-3 Ekonomi & kapacitetsstyrning (Cursor WebSearch)

**Datum:** 2026-06-16 · **Agent:** Cursor SA-3 (WebSearch + kodverifiering)  
**Baseline:** [`research-2026-06-16-sa3-ekonomi.md`](./research-2026-06-16-sa3-ekonomi.md)  
**Seed:** `kunskap-fact-009` (KEEP) · `kunskap-fact-eko-001`–`004` (CANDIDATE)  
**Live kod:** `capacityResolver.ts` · `useEconomyLevel.ts` · `.cursor/rules/capacity-ui-gate.mdc`

---

## Top 5 NEW (Cursor — utöver Gemini-baseline)

| # | id | Varför |
|---|-----|--------|
| 1 | research-cursor-sa3-001 | 24h-regeln kräver **externa stöd** (alarm, checklista) — inte viljestyrka |
| 2 | research-cursor-sa3-002 | **Två-konto-system** (räkningar vs spending) tar bort mental matte |
| 3 | research-cursor-sa3-003 | **Vecko-överskridning** → dra av nästa vecka, ingen skuldspiral |
| 4 | research-cursor-sa3-004 | **Sparkonto annan bank** = 2–3 dagars friktionsbarriär |
| 5 | research-cursor-sa3-005 | **Progressive disclosure** (Miller 7±2) som kapacitets-UI-princip |

---

## Fynd (YAML) — 18 st

```yaml
id: research-cursor-sa3-001
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.theladdermethod.com/blog/24-hour-rule-for-adhd
source_title: The Ladder Method — 24-Hour Rule for ADHD
claim_sv: "24-timmarsregeln fungerar bäst med externa stöd — kalenderlarm, skriven policy och pros/cons-lista — eftersom ADHD påverkar självreglering utan yttre signaler."
why: "Förstärker kunskap-fact-eko-001 med implementeringsdetalj; produkt: impulskö-paus kan erbjuda 'påminn mig imorgon'."
existing_overlap: kunskap-fact-eko-001
recommendation: NEW
rule_impact: Nivå 3 `impuls`-mode — extern cue, inte moraliserande text
```

```yaml
id: research-cursor-sa3-002
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://waypointbudget.com/blog/budgeting-with-adhd
source_title: Waypoint — Budgeting with ADHD
claim_sv: "Två-konto-systemet — ett konto enbart för automatiserade räkningar, ett för daglig spending — ersätter mental matte: om saldot finns i spending-kontot är köpet tillåtet."
why: "Kompletterar kunskap-fact-009 (autogiro) med visuell separation; Nivå 1 kan visa endast 'safe-to-spend'."
existing_overlap: kunskap-fact-009
recommendation: NEW
rule_impact: evolution_hub — Nivå 1 UI visar spending-saldo före total balans
```

```yaml
id: research-cursor-sa3-003
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://unburden.money/blog/adhd-friendly-budget
source_title: Unburden — ADHD-Friendly Budgeting
claim_sv: "Vid veckoöverskridning dras överskottet från nästa veckas spend number — utan skuldspiral eller 'börja om nästa månad'."
why: "Anti-shame copy för veckobudget; matchar RSD-säker ton."
existing_overlap: kunskap-fact-eko-004
recommendation: NEW
rule_impact: null
```

```yaml
id: research-cursor-sa3-004
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/managing-adhd-finances-the-no-budget-system-that-actually-works/
source_title: ADD Resource Center — No-Budget System
claim_sv: "Sparkonto hos annan bank skapar 2–3 dagars överföringsfriktion — tillräckligt för att impulsiva uttag ska avta utan att spärra nödfall."
why: "Friktionsdesign, inte bankintegration i appen."
existing_overlap: INGEN
recommendation: NEW
rule_impact: null
```

```yaml
id: research-cursor-sa3-005
content_class: FACT
target_zone: rules
target_module: core
route: /
category: produkt_arkitektur
source_tier: P2
source_url: https://ixdf.org/literature/topics/progressive-disclosure
source_title: Interaction Design Foundation — Progressive Disclosure
claim_sv: "Finansiella gränssnitt bör följa progressive disclosure: visa 7±2 informationschunkar (Miller) och begrava avancerat bakom ett lager — särskilt vid låg kapacitet."
why: "Teoretisk grund för capacity-ui-gate; fintech UX 2026 bekräftar samma mönster."
existing_overlap: capacity-ui-gate.mdc
recommendation: NEW
rule_impact: .cursor/rules/capacity-ui-gate.mdc — ett jobb per skärm
```

```yaml
id: research-cursor-sa3-006
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://myfinancialfreedomtracker.com/en/content/expense-tracker-for-people-with-adhd
source_title: My Financial Freedom Tracker — ADHD expense tracker
claim_sv: "Veckovis peng-check-in på fast veckodag (ca 10 min) slår månadsgranskning — kadens viktigare än längd för ADHD-arbetsminne."
why: "Förstärker research-sa3-005; koppla till Paralys-Brytaren-kadens."
existing_overlap: kunskap-fact-eko-004
recommendation: NEW
rule_impact: evolution_hub — föreslå söndags-check-in som Nivå 1 mikrosteg
```

```yaml
id: research-cursor-sa3-007
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://digitaldashboardhub.com/adhd-budget-system-no-willpower/
source_title: DDH — ADHD Budget System
claim_sv: "Färre än fem budgetkategorier minskar beslutströtthet per köp; 30+ kategorier (t.ex. YNAB-default) överbelastar dopamin-svag exekutiv funktion."
why: "Kvantitativ grund för kunskap-fact-eko-003 (max 4–5 kuvert)."
existing_overlap: kunskap-fact-eko-003
recommendation: NEW
rule_impact: MUST NOT visa 30+ kategorier (capacity-ui-gate)
```

```yaml
id: research-cursor-sa3-008
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/your-adhd-friendly-budget-how-to-set-it-up-and-make-it-stick/
source_title: ADD Resource Center — ADHD-Friendly Budget
claim_sv: "Ta bort sparade kortnummer i webbläsare och shoppingappar ger tillräcklig friktion för att bryta automatisk köpbeteende."
why: "Miljödesign parallellt med 24h-regeln."
existing_overlap: kunskap-fact-eko-001
recommendation: NEW
rule_impact: null
```

```yaml
id: research-cursor-sa3-009
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.simplypsychology.org/impulsive-spending-adhd.html
source_title: Simply Psychology — Impulsive Spending ADHD
claim_sv: "Fysiska externa påminnelser (t.ex. 'PAUSE'-dekal på kort) fungerar som stoppsignal när intern viljestyrka sviker — Barkley-linje om externaliserad exekutiv funktion."
why: "Låg-kostnad friktion; ej produktkrav men FACT-copy."
existing_overlap: INGEN
recommendation: NEW
rule_impact: null
```

```yaml
id: research-cursor-sa3-010
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://myfinancialfreedomtracker.com/en/content/expense-tracker-for-people-with-adhd
source_title: My Financial Freedom Tracker
claim_sv: "'ADHD-skatt' — glömda abonnemang och förseningsavgifter — koncentreras ofta i 2–3 kategorier; median glömt abonnemang ~17 USD/mån enligt branschdata de citerar."
why: "Motiverar veckocheck-in före avancerad budget."
existing_overlap: kunskap-fact-009
recommendation: NEW
rule_impact: Nivå 2 kan visa abonnemangs-audit som mikrosteg
```

```yaml
id: research-cursor-sa3-011
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/managing-adhd-finances-the-no-budget-system-that-actually-works/
source_title: ADD Resource Center — No-Budget System
claim_sv: "24-timmars väntan på icke-nödvändiga köp kan reducera impulsköp med upp till hälften — när köp läggs på önskelista istället för direkt checkout."
why: "Stödjer eko-001 med outcome-estimat (P2, ej RCT)."
existing_overlap: kunskap-fact-eko-001
recommendation: NEW
rule_impact: null
```

```yaml
id: research-cursor-sa3-012
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://digitaldashboardhub.com/adhd-budget-system-no-willpower/
source_title: DDH — Digital Cash Envelope
claim_sv: "Femte kuvert 'Oh Crap' / oförutsedda behov förhindrar att hela systemet kollapsar vid överraskningsutgift — planerad flex, inte moraliskt undantag."
why: "Utökar eko-003 från 4 till 5 kategorier med buffer-semantik."
existing_overlap: kunskap-fact-eko-003
recommendation: NEW
rule_impact: Nivå 2 kuvert-UI — valfri buffer-post
```

```yaml
id: research-cursor-sa3-013
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://psychiatry-cy.com/managing-finances-with-adhd-and-impulsivity-evidence-based-strategies-that-work/
source_title: Psychiatry CY — ADHD finances
claim_sv: "Alternativ till veckotal: dela månadens discretionary med antal dagar till nästa lön — ett dagligt spend number som är ännu kortare än vecka för extrem tidsblindhet."
why: "Fallback UI om vecka fortfarande känns abstrakt."
existing_overlap: kunskap-fact-eko-004
recommendation: NEW
rule_impact: evolution_hub — valfri toggle dag/vecka vid Nivå 2+
```

```yaml
id: research-cursor-sa3-014
content_class: FACT
target_zone: rules
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: produkt_arkitektur
source_tier: P1
source_url: src/modules/features/economy/hooks/useEconomyLevel.ts
source_title: Livskompassen — useEconomyLevel (live)
claim_sv: "Ekonomi-nivå styrs av tri-gate: user_capability_state + user_economy_status.economy_advanced + evolution_hub.unlockedFeatureFlags; circuit breaker vid låg MåBra-check-in 48h tvingar critical."
why: "Verifierad kod — research måste matcha live, inte bara bloggar."
existing_overlap: infinite-evolution.mdc
recommendation: KEEP
rule_impact: evolution_ledger vid nivåbyte
```

```yaml
id: research-cursor-sa3-015
content_class: FACT
target_zone: rules
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: produkt_arkitektur
source_tier: P1
source_url: src/modules/features/dailyLife/wellbeing/economy/supermodule/capacityResolver.ts
source_title: Livskompassen — capacityResolver (live)
claim_sv: "Kapacitetsnivå 1 tillåter modes saldo+mikrosteg; nivå 2 lägger till kuvert/spar/logg; nivå 3 lägger till impuls+inkast — critical endast saldo."
why: "Gap mellan research och UI är litet; impuls medvetet på Nivå 3."
existing_overlap: capacity-ui-gate.mdc
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa3-016
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P1
source_url: docs/specs/modules/Kunskap-CONTENT-SEED.md#kunskap-fact-009
source_title: kunskap-fact-009 — fakturor och betalningsflöde
claim_sv: "Autogiro och samlad fakturalista minskar förseningsavgifter vid ADHD-tidsblindhet — administrativ struktur, inte skuldrådgivning."
why: "KEEP — redan seed; research bekräftar automatisering som bas."
existing_overlap: kunskap-fact-009
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa3-017
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/your-adhd-friendly-budget-how-to-set-it-up-and-make-it-stick/
source_title: ADD Resource Center — Three-Bucket Method
claim_sv: "Tre hinkar (essentials / discretionary / spar-skuld) eller 50-30-20 kräver inget kvittospår — endast periodiska avstämningar mot tre totalsummor."
why: "CANDIDATE eko-002; baseline research-sa3-001."
existing_overlap: kunskap-fact-eko-002
recommendation: KEEP
rule_impact: economy_advanced låst till Nivå 2+
```

```yaml
id: research-cursor-sa3-018
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: ekonomi_vardag
source_tier: P2
source_url: https://www.addrc.org/your-adhd-friendly-budget-how-to-set-it-up-and-make-it-stick/
source_title: ADD Resource Center — Impulse Fund
claim_sv: "Dedikerad impulshink med tydligt månatligt tak — när den är slut pausar du utan total förbudskänsla; hållbarhet över perfektion."
why: "Baseline research-sa3-004; anti-gamification (ingen streak)."
existing_overlap: INGEN (ej eko-id i seed än)
recommendation: NEW
rule_impact: föreslå kunskap-fact-eko-005 CANDIDATE
```

---

## Evolution/kapacitetsregler (3 — kod + research)

### Regel 1 — Circuit breaker → critical

**Villkor:** `mabra_checkin` senaste 48h med genomsnittlig mood/energy < `SAFETY_THRESHOLD` (`useEconomyLevel.resolveCircuitBreaker`).  
**UI:** Endast `saldo`-mode (`capacityResolver` critical). Dölj kuvert, Kanban, impulsparkering.  
**Ledger:** Om nedgradering från Nivå 2+ → logga `capacity_decreased` i `evolution_ledger`.

### Regel 2 — Nivå 1 utan tri-gate

**Villkor:** `economy_advanced` ej upplåst (saknar capability + user_economy_status + evolution_hub-flagga).  
**UI:** Veckosaldo / spend number + ett mikrosteg (veckocheck-in eller faktura enligt fact-009). Modes: `saldo`, `mikrosteg` endast.  
**Research-stöd:** eko-004, research-cursor-sa3-002, research-cursor-sa3-006.

### Regel 3 — Nivå 3 full ekonomi

**Villkor:** Tri-gate PASS **och** `capacityScore >= 0.5`.  
**UI:** Alla modes inkl. `impuls` + `inkast`; `economy_advanced`-paneler (spar/export). Kuvert max 5 inkl. buffer (`research-cursor-sa3-012`).  
**MUST NOT:** Låsa upp före tri-gate; ingen streak-gamification som kapacitetsbelöning.

---

## Dirigent-routing (eko CANDIDATE)

| Seed-id | Research-stöd | Åtgärd |
|---------|---------------|--------|
| kunskap-fact-eko-001 | cursor-001, 008, 011 | KEEP CANDIDATE — ingest efter Pontus |
| kunskap-fact-eko-002 | cursor-017, baseline-001 | KEEP CANDIDATE |
| kunskap-fact-eko-003 | cursor-007, 012 | KEEP CANDIDATE — ev. buffer-copy |
| kunskap-fact-eko-004 | cursor-003, 006, 013 | KEEP CANDIDATE |
| *(ny)* eko-005 impulshink | cursor-018 | CANDIDATE-förslag |

---

## Källor (WebSearch 2026-06-16)

- ADD Resource Center (tre hinkar, no-budget, 24h, impulshink)
- Waypoint (veckobudget, två-konto)
- Unburden (veckotal, overspend-rollover)
- DDH (digitala kuvert, 4–5 kat, Oh Crap)
- Psychiatry CY (veckocheck-in, automation, dagligt tal)
- The Ladder Method (24h + externa stöd)
- Simply Psychology / Barkley (externa påminnelser)
- My Financial Freedom Tracker (veckokadens, ADHD-skatt)
- IxDF / fintech UX (progressive disclosure, Miller/Hick)
- Livskompassen kod: `useEconomyLevel.ts`, `capacityResolver.ts`
