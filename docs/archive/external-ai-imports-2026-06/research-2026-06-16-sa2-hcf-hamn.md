# Research — SA-2 HCF & kommunikation

**Datum:** 2026-06-16 · **Agent:** SA-2 (Cursor baseline)

---

## Top 5 NEW

| # | id | Varför |
|---|-----|--------|
| 1 | research-sa2-001 | Parallel parenting — fördjupning utöver cn-009 |
| 2 | research-sa2-002 | Barn exponering vs konflikt (AFCC/NCBI-linje) |
| 3 | research-sa2-003 | Parenting coordinator — svensk kontext |
| 4 | research-sa2-004 | Skriftlig kommunikation som default (HCF) |
| 5 | research-sa2-005 | Hamn wire: `written_only_escalation` signal |

---

## Fynd (urval — 25+ i full version)

```yaml
id: research-sa2-001
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: medforaldraskap
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf
source_title: AFCC — Parenting Coordination Task Force Report
claim_sv: "Parallel parenting innebär separata hushållsspår med minimal direkt kontakt; målet är förutsägbarhet och att barn hålls utanför vuxeninteraktion — inte gemensam problemlösning."
why: "Förstärker cn-009 med AFCC-kanon."
existing_overlap: kunskap-fact-cn-009, cop-005
recommendation: NEW
rule_impact: domän-covert-narcissism — parallel parenting som default-råd vid HCF
```

```yaml
id: research-sa2-002
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P2
source_url: https://www.arizonalawgroup.com/blog/parallel-parenting-vs-co-parenting-which-approach-is-right-for-high-conflict-situations/
source_title: Arizona Law Group (referens till forskning om barnexponering)
claim_sv: "Forskning pekar på att barns direkta exponering för föräldrakonflikt ofta är mer skadligt än själva uppdelningen av boende; att skydda barn från att bevittna hostility är centralt."
why: "Stödjer bh-013 och Barnfokus utan alienation-retorik."
existing_overlap: bh-013, kunskap-fact-011
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-sa2-003
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet?vaultTab=dossier
category: juridik_logistik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/AFCCGuidelinesforParentingcoordinationnew.pdf
source_title: AFCC Guidelines for Parenting Coordination
claim_sv: "Parenting coordination är en barnfokuserad process där utsedd professionell hjälper högk konflikt-föräldrar implementera vårdnadsplan och lösa tvister utanför domstol — med screening för våld och maktklyftor."
why: "Svensk familjerätt har liknande roller; dossier ska nämna metod neutralt."
existing_overlap: jur-001..008 delvis
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa2-004
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: kommunikation_metod
source_tier: P2
source_url: https://www.mcswainrapplaw.com/blog/parenting-without-contact-the-rise-in-parallel-parenting
source_title: McSwain Rapp Law — Parallel Parenting
claim_sv: "I parallel parenting begränsas kommunikation ofta till skrift (mejl, meddelandeapp) för att minska eskalering — särskilt när muntlig kontakt triggar konflikt."
why: "Motiverar Hamn + Inkast routing för sms."
existing_overlap: kunskap-fact-005 BIFF, cop-002
recommendation: NEW
rule_impact: hamnTaktikWire — överväg written_only_escalation
```

```yaml
id: research-sa2-005
content_class: FACT
target_zone: hamn
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: covert_taktik
source_tier: P2
source_url: https://www.bowditch.com/allinthefamily/2026/02/03/parallel-parenting-in-high-conflict-custody-matters/
source_title: Bowditch — Parallel Parenting in High-Conflict Custody
claim_sv: "Tvingad 'teamwork' mellan fientliga föräldrar kan öka konflikt; parallel parenting prioriterar förutsägbarhet framför samarbete när samarbete inte är möjligt."
why: "Validerar Grey Rock/BIFF utan JADE."
existing_overlap: cn-012, cn-009
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-sa2-006
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet
category: covert_taktik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf
source_title: AFCC — domestic violence screening
claim_sv: "Vid parenting coordination krävs screening för våld inklusive dominerande och intimiderande beteende — standard ADR-process kan vara olämplig vid coercive control."
why: "Säkerhets-P0 — stödjer DCAP före LLM."
existing_overlap: cn-016..021, juridik_hot wire
recommendation: KEEP
rule_impact: security — fail-closed till Granska vid våldssignal
```

```yaml
id: research-sa2-007
content_class: FACT
target_zone: kunskap
target_module: diary/mirror
route: /hjartat?tab=speglar
category: kommunikation_metod
source_tier: P1
source_url: https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/
source_title: NHS wellbeing (referens neutral kommunikation)
claim_sv: "BIFF och Grey Rock är kommunikationsmetoder för korta sakliga svar — de ersätter inte terapi, juridisk rådgivning eller skydd vid akut fara."
why: "Produktgräns — redan i fact-005/006."
existing_overlap: kunskap-fact-005, 006
recommendation: KEEP
rule_impact: null
```

*(A) Redan täckt: DARVO 043–047, hoover cn-016, smear cn-017, ekonomisk kontroll cn-021, maternal fasad cn-020  
(B) Lucka våg 27: parenting coordinator FACT, skriftlig-default FACT  
(C) REJECT: "narcissist test" quiz, etikettera motpart i UI, clickbait "13 tecken")*

---

## Föreslagna Hamn wire-signaler (deterministiska)

| Signal | Mönster (sv) | Åtgärd |
|--------|--------------|--------|
| `written_only_escalation` | "ring mig", "vi måste prata nu", "svara i telefon" efter gräns | Visa Grey Rock-tips |
| `parenting_coordinator_ref` | "kontakta familjerätten", "samföräldrar" | Länk till cop-002 |
