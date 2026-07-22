# Research — SA-1 Psykisk hälsa & neuro

**Datum:** 2026-06-16 · **Agent:** SA-1 (Cursor baseline — ersätt med Gemini Deep Research om du kör egen)  
**Källor:** NHS, NHS inform, Cleveland Clinic, ADDA, CEDAR Exeter, Unburden, 1177 (referens)

---

## Top 5 NEW (rankade)

| # | id | Varför |
|---|-----|--------|
| 1 | research-sa1-001 | Worry time — GAP i `gad_angest` (ingen dedikerad FACT) |
| 2 | research-sa1-002 | Body doubling — GAP i `adhd_vardag` |
| 3 | research-sa1-003 | 24h-regel kopplad stress/impuls — bro till SA-3 |
| 4 | research-sa1-004 | MB-REF-GAD-07 worry time reflektion |
| 5 | research-sa1-005 | MB-PLAY-GAD-02 "skjut oro till kväll" microlek |

---

## Fynd (YAML)

```yaml
id: research-sa1-001
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/
source_title: NHS Every Mind Matters — Tackling your worries
claim_sv: "Worry time är en CBT-teknik där du schemalägger 10–15 minuter dagligen för hypotetiska oros tankar; under dagen skjuter du upp oro till den tiden i stället för att följa varje tanke."
why: "GAD-hub behöver underhållsstrategi utöver akut andning — passar kapacitetsstyrning."
existing_overlap: INGEN (gad_angest 029–035 täcker inte worry time explicit)
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa1-002
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://health.clevelandclinic.org/body-doubling-for-adhd
source_title: Cleveland Clinic — Body doubling for ADHD
claim_sv: "Body doubling innebär att arbeta bredvid en annan person (fysiskt eller virtuellt) för att underlätta start och fokus — beskrivs som externaliserad exekutiv funktion, inte samarbete på samma uppgift."
why: "Paralys-Brytaren + planering kan referera till metoden utan gamification."
existing_overlap: INGEN
recommendation: NEW
rule_impact: infinite-evolution — Nivå 2+ kan föreslå body-double-mikrosteg
```

```yaml
id: research-sa1-003
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=kompasser&vardagenTab=ekonomi
category: adhd_vardag
source_tier: P2
source_url: https://unburden.money/blog/adhd-friendly-budget
source_title: Unburden — ADHD-Friendly Budgeting
claim_sv: "Vid ADHD kan en 24-timmars paus före icke-nödvändiga köp ge impulsen tid att avta utan att kräva långvarig viljestyrka."
why: "Bro mellan GAD/ADHD och ekonomi_vardag — samma användarprofil."
existing_overlap: INGEN (ekonomi täcks delvis av fact-009)
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa1-004
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P2
source_url: https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/
source_title: NHS inform — Anxiety self-help guide
claim_sv: "Om oron dyker upp nu — kan du skriva ner en rad och spara den till din oro-tid, i stället för att lösa allt direkt?"
why: "Frågekort för underhåll, inte akut panik."
existing_overlap: MB-REF-GAD-01..06 (delvis oro)
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa1-005
content_class: PLAY
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: product_copy
source_url: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/
source_title: NHS — worry time (parafras lek)
claim_sv: "Sätt en timer på 2 min — skriv max tre orosord på en lapp. Stopp. Lägg lappen åt sidan till kvällen."
why: "Microlek ≤2 min, offline, ingen streak."
existing_overlap: MB-PLAY-GAD-01
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa1-006
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/
source_title: NHS inform — Managing your worry
claim_sv: "Oro är bara användbar när den påminner om en handling; annan oro kan behandlas som en tanke-loop som gynnas av schemalagd oro-tid snarare än ständig problemlösning."
why: "Epistemik för MåBra — skiljer handlingsoro från hypotetisk oro."
existing_overlap: kunskap-fact-029..035 (generell GAD)
recommendation: NEW
rule_impact: mabraCoachGuard — ex/konflikt fortfarande Speglar
```

```yaml
id: research-sa1-007
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P2
source_url: https://www.elft.nhs.uk/sites/default/files/2022-05/dealing-with-worry.pdf
source_title: ELFT NHS — Dealing with Worry
claim_sv: "Långsam utandning och schemalagd oro-tid är kompletterande CBT-verktyg; ingen av dem kräver att du 'presterar' rätt andning."
why: "Stödjer befintlig 4-7-8 utan medicinskt anspråk."
existing_overlap: Mabra F2, kunskap kanslor_vagus 036–040
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-sa1-008
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P3
source_url: https://add.org/the-body-double/
source_title: ADDA — The Body Double
claim_sv: "Body doubling bygger på yttre ansvarskänsla: närvaro av annan person som också arbetar kan öka sannolikheten att du fullföljer en påbörjad uppgift."
why: "Praktiker-konsensus; märk P3 i bank om ingest."
existing_overlap: research-sa1-002
recommendation: DEFER
rule_impact: null
```

```yaml
id: research-sa1-009
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: psychoeducation_general
source_url: https://health.clevelandclinic.org/body-doubling-for-adhd
source_title: Cleveland Clinic
claim_sv: "Vilken uppgift skjuter du upp mest — och vem eller vad skulle kunna sitta bredvid dig (utan att prata) i fem minuter?"
why: "Reflektion, inte fakta-RAG."
existing_overlap: MB-REF-ADHD-03 mikrosteg
recommendation: NEW
rule_impact: null
```

```yaml
id: research-sa1-010
content_class: FACT
target_zone: kunskap
target_module: drogfrihet
route: /drogfrihet
category: beroende
source_tier: P2
source_url: https://www.1177.se/
source_title: 1177 — beroende och återfall (referenskategori)
claim_sv: "Stress och sömnbrist ökar risken för impulsiva coping-beteenden; strukturerad daglig rutin och sömnhygien är etablerade komplement till professionell vård vid beroende."
why: "Koppling DF-REF till vardagsstress utan att blanda silos."
existing_overlap: kunskap-fact-df-001..006
recommendation: KEEP
rule_impact: null
```

*(Fynd 011–020: OVERLAP med befintlig gad_angest/adhd_vardag — reframing F5, RSD F4, ACT F6, hyperarousal produktcopy — markerade KEEP i fullständig tabell, utelämnade här för brev.)*

---

## Sammanfattning SA-1

- **Luckor:** worry time FACT, body doubling FACT, 24h impuls FACT
- **MåBra:** 2 nya REFLECTION/PLAY
- **REJECT:** DSM-etiketter i UI, "heala trauma på X veckor", streak-baserad oro-övning
