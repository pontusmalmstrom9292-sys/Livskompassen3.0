# Research — SA-4 Barn i HCF & åldersanpassning

**Datum:** 2026-06-16 · **Agent:** SA-4 (Cursor baseline)

---

## Top 5 NEW

| # | id | Varför |
|---|-----|--------|
| 1 | research-sa4-001 | Lojalitetskonflikt — BRIS-linje FACT |
| 2 | research-sa4-002 | Barn ska inte vara budbärare |
| 3 | research-sa4-003 | bh-015 tonår 10–14 lojalitet |
| 4 | research-sa4-004 | BP-PLAY-25 känslokort 3–5 |
| 5 | research-sa4-005 | BP-PLAY-26 checklista 6–9 |

---

## Fynd (YAML)

```yaml
id: research-sa4-001
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris — Stöd och råd för vuxna
claim_sv: "Barn hamnar lätt i lojalitetskonflikt när vuxna bråkar; barnet behöver höra att konflikten är vuxnas ansvar — inte barnets fel."
why: "Kärn-copy för Familjen + Barnfokus guardrail."
existing_overlap: bh-001..008 delvis
recommendation: NEW
rule_impact: locked-ux — ändra inte BARNFOKUS utan PMIR
```

```yaml
id: research-sa4-002
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://via.tt.se/pressmeddelande/3324175/experterna-sa-undviker-du-att-barnen-hamnar-i-klam-vid-skilsmassa
source_title: Familjens Jurist / TT — barn i skilsmässa
claim_sv: "Låt inte barnen framföra budskap mellan föräldrar; de vill ofta vara lojala mot båda och skadas av budbärarrollen."
why: "Kompletterar cop-003 överlämning."
existing_overlap: cop-003, bh-007
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa4-003
content_class: FACT
target_zone: kunskap
target_module: barnporten
route: /barnporten
category: barn_hcf
source_tier: P2
source_url: https://www.bvpro.no/fokusomrade/barnet-ungdommen-opplever-lojalitetskonflikt-mellom-foreldrene-foler-seg-tvunget-til-a-velge-side-ta-parti-med-en-av-foreldrene/
source_title: BVPRO Norge — lojalitetskonflikt 10–14
claim_sv: "Barn 10–14 i lojalitetskonflikt kan utveckla stressymptom (huvudvärk, magont, sömn); de behöver inte välja sida för att vara trygga."
why: "Lucka evolution_hub pre_teen segment."
existing_overlap: bh-009..012
recommendation: NEW
rule_impact: infinite-evolution — pre_teen bracket copy
```

```yaml
id: research-sa4-004
content_class: PLAY
target_zone: barnen
target_module: family/children
route: /familjen?tab=reflektion
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris (lek-adaptation)
claim_sv: "Visa tre känsloikoner — peka vilken som passade mest idag. Inget rätt svar."
why: "toddler_preschool segment, ≤2 min."
existing_overlap: BP-PLAY-01..24
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa4-005
content_class: PLAY
target_zone: barnen
target_module: barnporten
route: /barnporten
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris
claim_sv: "En trygg sak idag — rita eller skriv ett ord. Max en minut."
why: "early_school segment."
existing_overlap: BP-PLAY-05 valv_safe
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa4-006
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen?tab=livslogg
category: barn_hcf
source_tier: P2
source_url: https://www.bris.se/for-vuxna/bris-berattar/min-son-vill-inte-vara-hos-mamman/
source_title: Bris berättar
claim_sv: "Barn har rätt att älska båda föräldrar; att tala illa om den andra föräldern inför barnet skadar barnets trygghet."
why: "Neutral föräldraguide — inte motparts-etikett."
existing_overlap: bh-004
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-sa4-007
content_class: PLAY
target_zone: barnen
target_module: barnporten
route: /barnporten
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris
claim_sv: "Skriv en rad till din förälder — något du vill att hen ska veta. Du behöver inte skicka det."
why: "pre_teen / teen — Barnporten write."
existing_overlap: INGEN (teen segment)
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa4-008
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen?tab=livslogg
category: barn_hcf
source_tier: P2
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris
claim_sv: "Observation i livslogg bör skilja 'barnet sa X' (citat) från 'jag tror att…' (tolkning) — samma epistemik som Valv lager 1–2."
why: "SaveAsEvidencePrompt sourceRef."
existing_overlap: ep-003, bh-013
recommendation: KEEP
rule_impact: WORM — children_logs observation only
```

---

## Åldersluckor (evolution_hub)

| Bracket | Lucka | Åtgärd våg 27 |
|---------|-------|----------------|
| toddler_preschool | Känsloikoner PLAY | BP-PLAY-25 |
| early_school | Trygg-checklista | BP-PLAY-26 |
| pre_teen | Lojalitet FACT | bh-015 |
| teen | Skriv till förälder PLAY | BP-PLAY-27 |

**Locked UX:** BARNFOKUS_QUESTIONS orörd — nya PLAY via bank overlay only.
