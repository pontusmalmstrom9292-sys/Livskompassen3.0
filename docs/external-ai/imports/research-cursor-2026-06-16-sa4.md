# Research — SA-4 Barn i HCF & åldersanpassning (Cursor)

**Datum:** 2026-06-16 · **Agent:** Cursor SA-4 · **Baseline:** [`research-2026-06-16-sa4-barn.md`](./research-2026-06-16-sa4-barn.md) · **Master:** [`research-2026-06-16-master-syntes.md`](./research-2026-06-16-master-syntes.md)

**Källor (P1/P2):** [Bris — Så pratar du skilsmässa med ditt barn](https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/), [Bris — Skilda föräldrar (barn)](https://www.bris.se/for-barn-och-unga/vanliga-amnen/familj/skilda-foraldrar/), [Bris — stöd för vuxna](https://www.bris.se/for-vuxna/stod-och-rad/), [VBU — lojalitetskonflikt](https://vardnad.se/ordlista/lojalitetskonflikt/), [Familjens Jurist — barn i kläm](https://www.familjensjurist.se/nyheter/pressmeddelande/experterna-sa-undviker-du-att-barnen-hamnar-i-klam-vid-skilsmassa/), [Socialstyrelsen — separation små barn (PDF)](https://kunskapsstodforvardgivare.se/download/18.72c4495e17f44b64443237a/1646300927730/kunskapsmaterial-separation-sm%C3%A5-barn.pdf), [Decibel.fi — ungas rättigheter](https://www.decibel.fi/information/relationer/familjeforhallanden/skilsmassor-och-separationer/hur-gar-en-skilsmassa-eller-separation-till/den-ungas-rattigheter/)

**Kanon:** PLAY i Barnen-silo · WORM `children_logs` = beteende + datum · ingen auto-promote till Valv · `BARNFOKUS_QUESTIONS` orörd (wire via `barnfokusCatalog.ts` overlay only).

---

## Executive summary

1. **BRIS P1** bekräftar kärnluckan: lojalitetskonflikt och budbärarroll skadar barn mer än separation i sig — vuxna ska bära konflikten.
2. **bh-015 / bh-016** (CANDIDATE våg 27) fyller pre_teen lojalitet + budbärare utan diagnos-etiketter; överlappar men fördjupar `bh-001`/`bh-005`/`bh-010`.
3. **BP-PLAY-25..27** (CANDIDATE) täcker toddler / early_school / teen — **pre_teen (10–13)** saknar dedikerad PLAY-rad i banken.
4. **Barnporten** har `currentBracket`-gating i kod (`BarnportenPage.tsx`) men bracket-filtrerad PLAY-bank och catalog-wire saknas (våg 29).
5. **KEEP stark:** `bh-001`–`014`, `BP-PLAY-01`–`24`, epistemik `bh-013`/`bh-014`/`ep-007` — ingest inte duplicera.
6. **REJECT:** diagnos/etiketter i PLAY, auto-promote barnlogg → Valv, ändring av `BARNFOKUS_QUESTIONS`.

**NEW count: 10** · **KEEP: 6** · **DEFER: 1** · **REJECT: 1**

---

## Top 5 NEW

| # | id | Bank / wire | Varför NEW |
|---|-----|-------------|------------|
| 1 | research-cursor-sa4-001 | **kunskap-fact-bh-015** | Lojalitetskonflikt 10–14 med kroppsliga stresssignaler — BRIS + VBU; pre_teen segment |
| 2 | research-cursor-sa4-002 | **kunskap-fact-bh-016** | Budbärare/messenger — BRIS P1 + Familjens Jurist; kompletterar `bh-005` utan PA-retorik |
| 3 | research-cursor-sa4-003 | **BP-PLAY-25** | toddler_preschool känsloikoner ≤2 min — evolution_hub + INFINITE_EVOLUTION |
| 4 | research-cursor-sa4-004 | **BP-PLAY-26** | early_school trygg-checklista ≤1 min — skiljer från `BP-PLAY-05` (parent lens) |
| 5 | research-cursor-sa4-005 | **BP-PLAY-27** | teen reflektion “skriv en rad” — Barnporten write, privat valfritt |

---

## Jämförelse bh-* · BP-PLAY-*

| Prefix / id | Täckning idag | SA-4-lucka | Rekommendation |
|-------------|---------------|------------|----------------|
| **bh-001** | Lojalitetsfälla KEEP | BRIS P1 “aldrig barnets fel” | **KEEP** — bh-015 fördjupar ålder 10–14 |
| **bh-002** | Parentification KEEP | Messenger = emotional parentification | **KEEP** — bh-016 är operativ “gör inte så” |
| **bh-005** | Budbärare i högkonflikt KEEP | Skriftlig vuxenkanal | **KEEP** — bh-016 är dedikerad FACT |
| **bh-010** | Lojalitetsbind mekanism KEEP | Tysta tecken (glad men nämner inte andra) | **KEEP** — ev. bh-018 DEFER |
| **bh-012** | BRIS 116 111 KEEP | — | **KEEP** |
| **bh-013** | Barn vid konflikt KEEP | Separation ≠ skada | **KEEP** |
| **bh-014** | Berättelse vs tolkning KEEP | Livslogg epistemik | **KEEP** |
| **bh-015** | CANDIDATE våg 27 | pre_teen FACT | **NEW** — Pontus KEEP → seed |
| **bh-016** | CANDIDATE våg 27 | Messenger FACT | **NEW** — Pontus KEEP → seed |
| **BP-PLAY-01..24** | KEEP wired catalog | Barnfokus pool låst | **KEEP** — ingen ändring i `constants.ts` |
| **BP-PLAY-25** | CANDIDATE toddler | Känsloikoner | **NEW** — catalog overlay |
| **BP-PLAY-26** | CANDIDATE early_school | Trygg 1-min | **NEW** — överlappar lens `valv_safe` men child audience |
| **BP-PLAY-27** | CANDIDATE teen | Skriv till förälder | **NEW** — Barnporten `pre_teen`/`teen` |
| **pre_teen PLAY** | INGEN dedikerad rad | 10–13 bracket tom i bank | **NEW** BP-PLAY-28 (DEFER våg 29) |

**Ålderssegment (evolution_hub):**

| Bracket | Ålder | UX (INFINITE_EVOLUTION) | SA-4 åtgärd |
|---------|-------|-------------------------|-------------|
| `toddler_preschool` | 3–5 | Mood-ikoner, rita känslor | BP-PLAY-25 |
| `early_school` | 6–9 | Text, checklistor | BP-PLAY-26 |
| `pre_teen` | 10–13 | Journaling, röst | bh-015 FACT + BP-PLAY-28 DEFER |
| `teen` | 14+ | Skriv, livs-OS | BP-PLAY-27 |

---

## Fynd (20 YAML)

```yaml
id: research-cursor-sa4-001
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/
source_title: Bris — Så pratar du skilsmässa med ditt barn
claim_sv: "Barn 10–14 i lojalitetskonflikt kan få stress, skuld och kroppsliga symptom (huvudvärk, magont, sömn); de behöver inte välja sida — vuxna ska bära konflikten."
why: "Fyller pre_teen segment; BRIS P1 utan alienation-etikett."
existing_overlap: bh-001, bh-010, bh-013, research-sa4-003
recommendation: NEW
proposed_bankId: kunskap-fact-bh-015
rule_impact: infinite-evolution — pre_teen bracket copy i Barnporten
```

```yaml
id: research-cursor-sa4-002
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/
source_title: Bris — budbärare mellan vuxna
claim_sv: "Låt inte barn framföra budskap mellan föräldrar; hitta vuxen-till-vuxen-kanal (mejl, sms). Budbärarrollen skapar lojalitetsstress."
why: "Operativ FACT för föräldraguide; Hamn sköter BIFF — inte Kunskap-coach."
existing_overlap: bh-005, bh-002, cop-002, cop-007, research-sa4-002
recommendation: NEW
proposed_bankId: kunskap-fact-bh-016
rule_impact: domän-covert-narcissism — barn utanför 90%-brus
```

```yaml
id: research-cursor-sa4-003
content_class: PLAY
target_zone: barnen
target_module: family/children
route: /familjen?tab=reflektion
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris (lek-adaptation toddler)
claim_sv: "Visa tre känsloikoner — peka vilken som passade mest idag. Inget rätt svar."
why: "toddler_preschool 3–5; ≤2 min; ingen textkrav (INFINITE_EVOLUTION)."
existing_overlap: BP-PLAY-01..24, Barnporten humör 1–5
recommendation: NEW
proposed_bankId: BP-PLAY-25
rule_impact: null
```

```yaml
id: research-cursor-sa4-004
content_class: PLAY
target_zone: barnen
target_module: barnporten
route: /barnporten
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris (lek-adaptation early_school)
claim_sv: "En trygg sak idag — rita eller skriv ett ord. Max en minut."
why: "early_school 6–9; valv_safe lens utan vuxenkonflikt."
existing_overlap: BP-PLAY-05 (parent audience), BP-PLAY-21 valv_safe child
recommendation: NEW
proposed_bankId: BP-PLAY-26
rule_impact: WORM children_logs — observation only, ej Valv auto-promote
```

```yaml
id: research-cursor-sa4-005
content_class: PLAY
target_zone: barnen
target_module: barnporten
route: /barnporten
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-barn-och-unga/vanliga-amnen/familj/skilda-foraldrar/
source_title: Bris — Skilda föräldrar (barn)
claim_sv: "Skriv en rad till din förälder — något du vill att hen ska veta. Du behöver inte skicka det."
why: "teen / pre_teen write; Barnporten privat eller parent channel — HITL om allvarligt."
existing_overlap: INGEN teen-segment PLAY i bank
recommendation: NEW
proposed_bankId: BP-PLAY-27
rule_impact: BARNPORTEN-SPEC — visibility parent/private, vault_candidate endast urgent
```

```yaml
id: research-cursor-sa4-006
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-barn-och-unga/vanliga-amnen/familj/skilda-foraldrar/
source_title: Bris — barns perspektiv skilsmässa
claim_sv: "Det är aldrig barnets fel att föräldrar separerar; praktiska beslut (boende, ekonomi) är vuxnas ansvar — barn ska kunna lita på det."
why: "Validerar bh-001/bh-013 utan ny bank-post om KEEP räcker."
existing_overlap: bh-001, bh-013, kunskap-fact-042
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa4-007
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen?tab=livslogg
category: barn_hcf
source_tier: P2
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris — neutral föräldraguide
claim_sv: "Barn har rätt att älska båda föräldrar; att tala illa om den andra inför barnet skadar trygghet — även om kritiken känns sann."
why: "Stärker bh-007; ingen motparts-etikett."
existing_overlap: bh-004, bh-007, research-sa4-006
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa4-008
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen?tab=livslogg
category: barn_hcf
source_tier: P2
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris — livslogg epistemik
claim_sv: "Observation i livslogg: skilj 'barnet sa X' (citat) från 'jag tror att…' (tolkning) — samma lager som Valv ep-007."
why: "SaveAsEvidencePrompt sourceRef; manuellt Valv-val."
existing_overlap: bh-013, bh-014, ep-003, ep-007, research-sa4-008
recommendation: KEEP
rule_impact: WORM — children_logs beteende+datum; ingen auto-promote
```

```yaml
id: research-cursor-sa4-009
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/
source_title: Bris — skol/fritidsaktiviteter
claim_sv: "Dela upp skol- och fritidstillfällen mellan föräldrar när barnet stressas av att bära båda samtidigt — minskar lojalitetspress vid överlämning."
why: "Saknas som egen FACT; praktisk parallel parenting för barn."
existing_overlap: cop-006 (delvis), bh-005
recommendation: NEW
proposed_bankId: kunskap-fact-bh-017
rule_impact: infinite-evolution — early_school + pre_teen rutiner
```

```yaml
id: research-cursor-sa4-010
content_class: PLAY
target_zone: barnen
target_module: barnporten
route: /barnporten
category: barn_hcf
source_tier: product_copy
source_url: https://www.bris.se/for-barn-och-unga/vanliga-amnen/familj/skilda-foraldrar/
source_title: Bris — barns gränssättning (budbärare)
claim_sv: "Öva en mening: 'Jag vill inte vara budbärare — skriv till mamma/pappa själv.' Du behöver inte förmedla."
why: "pre_teen 10–13; autonomi + gräns utan vuxenkonflikt i text."
existing_overlap: bh-016 (FACT), INGEN pre_teen PLAY
recommendation: NEW
proposed_bankId: BP-PLAY-28
rule_impact: DEFER våg 29 — efter BP-PLAY-25..27 KEEP
```

```yaml
id: research-cursor-sa4-011
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P2
source_url: https://vardnad.se/ordlista/lojalitetskonflikt/
source_title: VBU — lojalitetskonflikt
claim_sv: "Lojalitetskonflikt: barn känner skuld när hen trivs hos en förälder; tvingad ställningstagande kan ge att barn skyddar en förälder eller väljer sida."
why: "Svensk terminologi; kompletterar bh-010 mekanism."
existing_overlap: bh-001, bh-010, vardnads-juridik allmänt
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa4-012
content_class: FACT
target_zone: barnporten
target_module: barnporten
route: /barnporten
category: produkt_gap
source_tier: product_copy
source_url: https://github.com/Livskompassen/Livskompassen3.0/blob/main/src/modules/features/onboarding/barnporten/components/BarnportenPage.tsx
source_title: BarnportenPage — currentBracket gating
claim_sv: "Barnporten döljer Prata/Skriv för toddler_preschool och visar Bara för mig endast pre_teen/teen — PLAY-bank filtreras inte ännu per bracket i catalog."
why: "Wire-gap: evolution_hub → barnfokusCatalog bracket filter."
existing_overlap: useEvolutionStore.getChildBracket, BP-PLAY-25..27 CANDIDATE
recommendation: NEW
rule_impact: våg 29 — bracket-filter i catalog + BarnportenLevelTwoStage
```

```yaml
id: research-cursor-sa4-013
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.familjensjurist.se/nyheter/pressmeddelande/experterna-sa-undviker-du-att-barnen-hamnar-i-klam-vid-skilsmassa/
source_title: Familjens Jurist / Mind — skilsmässa
claim_sv: "Långvarig föräldrakonflikt skadar barn mer än separation i sig; låt inte barn vara budbärare — de vill vara lojala mot båda."
why: "P1-stöd för bh-016; inget nytt om bh-005 KEEP räcker."
existing_overlap: bh-005, bh-013, research-sa4-002
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa4-014
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /valvet?vaultTab=kunskapsbank
category: barn_hcf
source_tier: P2
source_url: https://vardnads-juridik.se/lojalitetskonflikter-i-vardnadstvister-nar-barnet-tvingas-valja-sida/
source_title: Vårdnads juridik — tysta tecken lojalitetskonflikt
claim_sv: "Tysta tecken: barn är glada hos båda men nämner aldrig den andra föräldern; överdriven försvar av en förälder — dokumentera beteende+datum, inte diagnos."
why: "Föräldraguide + livslogg; WORM-kompatibel observation."
existing_overlap: bh-010, bh-009 (beteende, ej etikett)
recommendation: NEW
proposed_bankId: kunskap-fact-bh-018
rule_impact: barn-observation-epistemik — citat vs tolkning
```

```yaml
id: research-cursor-sa4-015
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P2
source_url: https://www.decibel.fi/information/relationer/familjeforhallanden/skilsmassor-och-separationer/hur-gar-en-skilsmassa-eller-separation-till/den-ungas-rattigheter/
source_title: FN barnkonvention — ungas rättigheter (Decibel.fi)
claim_sv: "Barn ska inte välja sida eller vara budbärare; föräldrar ska inte hindra kontakt med andra föräldern — barn får älska båda."
why: "Internationell ram; stärker bh-016 utan ny post om merged."
existing_overlap: bh-001, bh-016 CANDIDATE
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa4-016
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen?tab=hamn
category: medforaldraskap
source_tier: P2
source_url: https://kunskapsstodforvardgivare.se/download/18.72c4495e17f44b64443237a/1646300927730/kunskapsmaterial-separation-sm%C3%A5-barn.pdf
source_title: Socialstyrelsen — separation små barn
claim_sv: "Vid stel eller bråkig kontakt: neutral skriftlig kommunikation (särskilt mejl) om barnet — kort, saklig, endast föräldraskap."
why: "BVC-riktlinje; överlappar cop-007 — ingest inte duplicera."
existing_overlap: cop-007, bh-005, cop-002
recommendation: KEEP
rule_impact: hamn-written-default (SA-2)
```

```yaml
id: research-cursor-sa4-017
content_class: PLAY
target_zone: barnen
target_module: family/children
route: /familjen?tab=reflektion
category: barn_hcf
source_tier: product_copy
source_url: https://tinyplay.app/time/10
source_title: TinyPlay — kort lek 3–6 år
claim_sv: "Djur-rörelse 60 sek: björn/groda/krabba — peka vilken som kändes mest som din dag."
why: "Kinestetisk ≤2 min toddler; alternativ till ikoner."
existing_overlap: BP-PLAY-25, INFINITE_EVOLUTION mood-ikoner
recommendation: DEFER
rule_impact: null
```

```yaml
id: research-cursor-sa4-018
content_class: PLAY
target_zone: barnen
target_module: family/children
route: /familjen?tab=reflektion
category: barn_hcf
source_tier: product_copy
source_url: n/a
source_title: REJECT — diagnos i barn-PLAY
claim_sv: "Fråga om 'vilken förälder är narcissist' eller PA-quiz i barn-UI."
why: "Bryter KANON: ingen diagnos-etikett; PLAY = trygghet, inte utredning."
existing_overlap: bh-009 (FACT för vuxen, ej barn-PLAY)
recommendation: REJECT
rule_impact: no-diagnosis-labels — locked
```

```yaml
id: research-cursor-sa4-019
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen?tab=barnporten
category: barn_hcf
source_tier: P2
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris — professionellt stöd
claim_sv: "Barn som behöver prata utanför familjen: BRIS 116 111, skolkurator, BUP via remiss — neutral väg, inte bevis mot förälder."
why: "Redan i bh-012; HITL Barnporten → Valv separat."
existing_overlap: bh-008, bh-012, bup-001
recommendation: KEEP
rule_impact: BARNPORTEN-SPEC — ingen auto-promote
```

```yaml
id: research-cursor-sa4-020
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P2
source_url: https://www.regainlove.com/sv-se/raadgivare/anknytning-psykologi/barn-som-budbarare-undvik
source_title: Regain — barn som budbärare (psykoeducation)
claim_sv: "Barn läser av vuxnas tonfall vid budskap — rollomkastning (barn reglerar vuxnas känslor) ökar stress och lojalitetskonflikt; gäller alla åldrar inkl. tonår."
why: "Fördjupar bh-002/bh-016 mekanism; P2 citation_hint endast."
existing_overlap: bh-002, bh-016 CANDIDATE
recommendation: NEW
proposed_bankId: merge into kunskap-fact-bh-016 content
rule_impact: null
```

---

## Dirigent-routing (våg 27)

| research id | → bankId | status |
|-------------|----------|--------|
| research-cursor-sa4-001 | kunskap-fact-bh-015 | CANDIDATE |
| research-cursor-sa4-002, sa4-020 | kunskap-fact-bh-016 | CANDIDATE (merge content) |
| research-cursor-sa4-003 | BP-PLAY-25 | CANDIDATE |
| research-cursor-sa4-004 | BP-PLAY-26 | CANDIDATE |
| research-cursor-sa4-005 | BP-PLAY-27 | CANDIDATE |
| research-cursor-sa4-009 | kunskap-fact-bh-017 | CANDIDATE våg 29 |
| research-cursor-sa4-010 | BP-PLAY-28 | DEFER våg 29 |
| research-cursor-sa4-014 | kunskap-fact-bh-018 | CANDIDATE våg 29 |

**KEEP (ingen bank-ändring):** sa4-006, 007, 008, 011, 013, 015, 016, 019

**Wire (ej content):** sa4-012 → Barnporten bracket-filter

---

## Nästa steg

1. `specialist-innehall-dirigent` — bekräfta NEW → CANDIDATE
2. Pontus KEEP på bh-015/016 + BP-PLAY-25..27
3. Append catalog i `barnfokusCatalog.ts` (overlay — **inte** `BARNFOKUS_QUESTIONS`)
4. `npm run smoke:innehall` · `npm run smoke:locked-ux`

Jämför alla fynd mot bifogad modul-register och innehållsregister. Markera OVERLAP vs GAP. Prioritera det som stärker slutfasen utan att bryta locked UX.
