# Research — SA-1 Psykisk hälsa & neuro (Cursor)

**Datum:** 2026-06-16 · **Agent:** Cursor (readonly WebSearch + bankjämförelse)  
**Baseline:** [`research-2026-06-16-sa1-psyk-halsa.md`](research-2026-06-16-sa1-psyk-halsa.md)  
**Banker:** [`Kunskap-CONTENT-SEED.md`](../../specs/modules/Kunskap-CONTENT-SEED.md) · [`Mabra-CONTENT-BANK.md`](../../specs/modules/Mabra-CONTENT-BANK.md)  
**Källor:** NHS Every Mind Matters, NHS inform, NHS Wales, SWLSTG NHS, ELFT NHS, Cleveland Clinic, ADDA, ACM 2024, 1177, Psychology Tools

**Regel:** Inga diagnosetiketter i `claim_sv`. Ex/konflikt → Speglar/Hamn (`mabraCoachGuard`).

---

## Top 5 NEW (Cursor — utöver baseline)

| # | id | Varför |
|---|-----|--------|
| 1 | cursor-sa1-003 | **Worry tree** — praktisk vs hypotetisk oro; GAP i `gad_angest` (ingen FACT) |
| 2 | cursor-sa1-006 | **Fysiologisk suck** — NHS-väg till vagus; kompletterar 4-7-8 utan ny metodnamn i UI |
| 3 | cursor-sa1-009 | **RSD + paus före svar** — REFLECTION/psychoeducation; utöver generisk RSD-FACT |
| 4 | cursor-sa1-011 | **Body doubling — evidensprofil** — P2 disclaimer (plausibel, ej bevisad behandling) |
| 5 | cursor-sa1-014 | **Fötter mot golv** — 1177 + NHS grounding; svensk P1 för `kanslor_vagus` PLAY |

---

## Jämförelse mot baseline

| Status | Antal | Betydelse |
|--------|-------|-----------|
| **baseline** | 10 | Bekräftar Gemini SA-1-fynd; bank har redan CANDIDATE-rader |
| **NEW** | 8 | Cursor tillägg utöver baseline — prioritera ingest/kurering |
| **OVERLAP** | 5 | Redan KEEP/CANDIDATE i seed eller MåBra — ingen ny FACT utan PMIR |

---

## Fynd (YAML)

```yaml
id: cursor-sa1-001
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/
source_title: NHS Every Mind Matters — Tackling your worries
claim_sv: "Worry time är en CBT-teknik: schemalägg 10–15 minuter dagligen för hypotetiska orostankar; under dagen skjuter du upp oro till den tiden i stället för att följa varje tanke."
why: "Underhållsstrategi för ihållande oro utöver akut andning — passar kapacitetsstyrning."
existing_overlap: kunskap-fact-gad-036 (CANDIDATE); baseline research-sa1-001
recommendation: baseline
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-002
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.rnoh.nhs.uk/patients-and-visitors/patient-information-guides/patients-guide-postponing-worries
source_title: RNOH NHS — Postponing worries
claim_sv: "Schemalagd oro-tid bör undvikas strax före sänggående; välj en fast tid på dagen och håll sessionen till cirka 15–20 minuter med avslutande aktivitet efteråt."
why: "Timing-nuans saknas i gad-036; minskar risk för sömnförsämring vid oro-rutin."
existing_overlap: kunskap-fact-gad-036 (delvis); kunskap-fact-035 sömn+oro
recommendation: NEW
vs_baseline: NEW
rule_impact: infinite-evolution — Nivå 1 föreslår inte kvälls-oro nära läggdags
```

```yaml
id: cursor-sa1-003
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/
source_title: NHS — Worry tree
claim_sv: "Worry tree skiljer praktisk oro (du kan agera: vad, hur, när) från hypotetisk oro (utan kontroll); vid hypotetisk oro — skjut upp eller släpp och återfokusera på nuet."
why: "Kompletterar worry time med beslutsträd — GAP i gad_angest 029–035."
existing_overlap: kunskap-fact-034 (oro vs planering, ej worry tree)
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-004
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/
source_title: NHS — Worry tree (reflektion)
claim_sv: "Den här oron — kan du göra något praktiskt om den just nu, eller är den hypotetisk och bättre sparad till din oro-tid?"
why: "Frågekort som operationaliserar worry tree utan terapiprotocol."
existing_overlap: MB-REF-GAD-03 (planrad); MB-REF-GAD-07 (CANDIDATE oro-tid)
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-005
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.psychologytools.com/resource/worry-postponement
source_title: Psychology Tools — Worry postponement
claim_sv: "När oro skjuts upp till schemalagd tid förlorar många tankar sin brådska; tekniken utmanar idén att oro är okontrollerbar."
why: "Mekanism-FACT för RAG — Borkovec stimulus control; stärker gad-036."
existing_overlap: kunskap-fact-gad-036
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-006
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P1
source_url: https://swlstg.nhs.uk/latest-news/world-mental-health-day-2024-nervous-system-hacks-for-workplace-wellbeing-2252
source_title: SWLSTG NHS — Physiological sigh
claim_sv: "Fysiologisk suck: djup inandning genom näsan, ett kort extra andetag, sedan lång långsam utandning — kan sänka arousal diskret utan prestationskrav."
why: "NHS-aligned vagus-verktyg utöver 4-7-8; passar hyperarousal-hub."
existing_overlap: kunskap-fact-037; Mabra G7 (4-7-8); F2 hyperarousal
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-007
content_class: PLAY
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P1
source_url: https://swlstg.nhs.uk/latest-news/world-mental-health-day-2024-nervous-system-hacks-for-workplace-wellbeing-2252
source_title: SWLSTG NHS — Physiological sigh (lek)
claim_sv: "Tre andetag: in genom näsan, kort extra sip, lång utandning. Ingen räkning. Stopp efter tre."
why: "Microlek ≤1 min, offline, ingen streak — Obsidian Calm."
existing_overlap: Mabra G7; MB-PLAY-GAD-01 (5-4-3-1)
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-008
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://health.clevelandclinic.org/body-doubling-for-adhd
source_title: Cleveland Clinic — Body doubling for ADHD
claim_sv: "Body doubling innebär att arbeta bredvid en annan person (fysiskt eller virtuellt) som också arbetar — för start och fokus, som externaliserad struktur, inte samarbete på samma uppgift."
why: "Paralys-Brytaren + planering kan referera metoden utan gamification."
existing_overlap: kunskap-fact-adhd-029 (CANDIDATE); baseline research-sa1-002
recommendation: baseline
vs_baseline: baseline
rule_impact: infinite-evolution — Nivå 2+ kan föreslå body-double-mikrosteg
```

```yaml
id: cursor-sa1-009
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://add.org/rejection-sensitivity/
source_title: ADDA — Rejection sensitivity
claim_sv: "När kroppen reagerar starkt på kritik eller tystnad — vad skulle hända om du pausade 60 sekunder innan du svarar eller agerar?"
why: "RSD-säker paus-reflektion; kopplar till Grey Rock utan ex-analys i MåBra."
existing_overlap: kunskap-fact-014 (RSD FACT); MB-REF-ADHD-02; C-rsd-*
recommendation: NEW
vs_baseline: NEW
rule_impact: mabraCoachGuard — ex-sms → Hamn, inte denna reflektion
```

```yaml
id: cursor-sa1-010
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://my.clevelandclinic.org/health/diseases/24099-rejection-sensitive-dysphoria-rsd
source_title: Cleveland Clinic — RSD overview
claim_sv: "Intensiv smärta vid upplevd kritik eller avvisning är ett känt mönster vid exekutiv belastning — inte en separat medicinsk etikett i ICD; psychoeducation fokuserar på paus, tolkning och stöd."
why: "Förstärker kunskap-fact-014 med P2-källa; inga DSM-etiketter i UI."
existing_overlap: kunskap-fact-014 (KEEP); Mabra F4
recommendation: OVERLAP
vs_baseline: OVERLAP
rule_impact: null
```

```yaml
id: cursor-sa1-011
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://dl.acm.org/doi/10.1145/3689648
source_title: ACM 2024 — Body doubling with neurodivergent participants
claim_sv: "Body doubling har stark community-validering och tidig akademisk kartläggning, men saknar stora RCT — klassas som lågrisk komplement, inte ersättning för evidensbaserad ADHD-behandling."
why: "Evidens-disclaimer för adhd-029 ingest; anti-hallucination P2."
existing_overlap: kunskap-fact-adhd-029
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-012
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://health.clevelandclinic.org/body-doubling-for-adhd
source_title: Cleveland Clinic — Body doubling
claim_sv: "Vilken uppgift skjuter du upp mest — och vem eller vad skulle kunna sitta bredvid dig (utan att prata) i fem minuter?"
why: "Reflektion, inte fakta-RAG."
existing_overlap: MB-REF-ADHD-05 (CANDIDATE); baseline research-sa1-009
recommendation: baseline
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-013
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P1
source_url: https://www.nhsinform.scot/healthy-living/mental-wellbeing/breathing-and-relaxation-exercises/grounding-exercises/
source_title: NHS inform — Grounding exercises
claim_sv: "5-4-3-2-1 grounding: namnge 5 syn, 4 känsel, 3 ljud, 2 doft, 1 smak — flyttar uppmärksamhet från överväldigande tankar till nuet."
why: "P1-källa för befintlig produktcopy F3."
existing_overlap: Mabra F3; MB-PLAY-GAD-01; kunskap-fact-036 interoception
recommendation: OVERLAP
vs_baseline: OVERLAP
rule_impact: null
```

```yaml
id: cursor-sa1-014
content_class: PLAY
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P1
source_url: https://www.1177.se/liv--halsa/stresshantering-och-somn/avslappning-for-hela-kroppen/
source_title: 1177 — Avslappning för hela kroppen
claim_sv: "Sitt stadigt. Känn fötterna mot underlaget i 30 sekunder — bara kontakt, ingen analys."
why: "Svensk P1 micro-grounding; offline, ≤1 min."
existing_overlap: Mabra F3 (variant); NHS inform feet grounding
recommendation: NEW
vs_baseline: NEW
rule_impact: null
```

```yaml
id: cursor-sa1-015
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P1
source_url: https://www.1177.se/liv--halsa/stresshantering-och-somn/avslappning-genom-andning/
source_title: 1177 — Avslappning genom andning
claim_sv: "Vid stress kan utandning ta dubbelt så lång tid som inandning (t.ex. 4 in, 8 ut) — ett fysiologiskt verktyg, inte garanti att oron försvinner."
why: "Svensk P1 för andnings-FACT; stödjer MåBra utan medicinskt anspråk."
existing_overlap: kunskap-fact-032; kunskap-fact-037; Mabra G7
recommendation: OVERLAP
vs_baseline: OVERLAP
rule_impact: null
```

```yaml
id: cursor-sa1-016
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P2
source_url: https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/
source_title: NHS inform — Anxiety self-help guide
claim_sv: "Om oron dyker upp nu — kan du skriva en rad och spara den till din oro-tid, i stället för att lösa allt direkt?"
why: "Frågekort för underhåll, inte akut panik."
existing_overlap: MB-REF-GAD-07 (CANDIDATE); baseline research-sa1-004
recommendation: baseline
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-017
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
existing_overlap: MB-PLAY-GAD-02 (CANDIDATE); baseline research-sa1-005
recommendation: baseline
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-018
content_class: FACT
target_zone: kunskap
target_module: wellbeing/economy
route: /vardagen?tab=ekonomi
category: adhd_vardag
source_tier: P2
source_url: https://unburden.money/blog/adhd-friendly-budget
source_title: Unburden — ADHD-Friendly Budgeting
claim_sv: "Vid impulsivitet kan en 24-timmars paus före icke-nödvändiga köp ge begäret tid att avta utan långvarig viljestyrka."
why: "Bro GAD/ADHD → ekonomi_vardag — samma användarprofil."
existing_overlap: kunskap-fact-eko-001 (CANDIDATE); baseline research-sa1-003
recommendation: baseline
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-019
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.nhsinform.scot/illnesses-and-conditions/mental-health/mental-health-self-help-guides/anxiety-self-help-guide/
source_title: NHS inform — Managing your worry
claim_sv: "Oro är användbar när den påminner om en konkret handling; repetitiv framtidsoro utan avslut gynnas av schemalagd oro-tid snarare än ständig problemlösning."
why: "Epistemik — skiljer handlingsoro från hypotetisk oro."
existing_overlap: kunskap-fact-034; baseline research-sa1-006
recommendation: baseline
vs_baseline: baseline
rule_impact: mabraCoachGuard — ex/konflikt fortfarande Speglar
```

```yaml
id: cursor-sa1-020
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: kanslor_vagus
source_tier: P1
source_url: https://roseneath.nhs.wales/files/improving-vagal-tone/
source_title: NHS Wales — Improving vagal tone
claim_sv: "Nynnande, sjungande eller långsam magandning kan stimulera parasympatisk respons — självhjälp, inte medicinsk behandling."
why: "Kompletterar kunskap-fact-037 med NHS Wales P1."
existing_overlap: kunskap-fact-037; Mabra andningsövningar
recommendation: OVERLAP
vs_baseline: OVERLAP
rule_impact: null
```

```yaml
id: cursor-sa1-021
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: gad_angest
source_tier: P1
source_url: https://www.elft.nhs.uk/sites/default/files/2022-05/dealing-with-worry.pdf
source_title: ELFT NHS — Dealing with Worry
claim_sv: "Långsam utandning och schemalagd oro-tid är kompletterande CBT-verktyg; ingen av dem kräver att du 'presterar' rätt andning."
why: "Stödjer befintlig 4-7-8 utan medicinskt anspråk."
existing_overlap: kunskap-fact-032; Mabra F2; baseline research-sa1-007
recommendation: baseline
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-022
content_class: FACT
target_zone: kunskap
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P3
source_url: https://add.org/the-body-double/
source_title: ADDA — The Body Double
claim_sv: "Body doubling bygger delvis på yttre ansvarskänsla: närvaro av en annan som arbetar kan öka sannolikheten att du fullföljer en påbörjad uppgift."
why: "Praktiker-konsensus; märk P3 om ingest som separat post."
existing_overlap: kunskap-fact-adhd-029; baseline research-sa1-008
recommendation: DEFER
vs_baseline: baseline
rule_impact: null
```

```yaml
id: cursor-sa1-023
content_class: REFLECTION
target_zone: mabra
target_module: wellbeing/mabra
route: /vardagen?tab=mabra
category: adhd_vardag
source_tier: P2
source_url: https://my.clevelandclinic.org/health/diseases/24099-rejection-sensitive-dysphoria-rsd
source_title: Cleveland Clinic — RSD
claim_sv: "En neutral reaktion (t.ex. kort svar) — är det säkert avvisning, eller finns andra förklaringar du inte ser än?"
why: "RSD psychoeducation: tolkning vs fakta; inåtvänd, ej analys av motpart."
existing_overlap: MB-REF-ADHD-02; MB-REF-04; kunskap-fact-014
recommendation: NEW
vs_baseline: NEW
rule_impact: mabraCoachGuard
```

---

## Sammanfattning SA-1 (Cursor)

### Bekräftat från baseline (redan CANDIDATE i seed)
- `kunskap-fact-gad-036` worry time · `kunskap-fact-adhd-029` body doubling · `kunskap-fact-eko-001` 24h-regel
- `MB-REF-GAD-07` · `MB-PLAY-GAD-02` · `MB-REF-ADHD-05`

### Luckor kvar (prioritera NEW)
1. **Worry tree** FACT + REFLECTION (`cursor-sa1-003`, `004`)
2. **Oro-tid timing** — undvik läggdags (`cursor-sa1-002`)
3. **Fysiologisk suck** FACT + PLAY (`cursor-sa1-006`, `007`)
4. **RSD paus + neutral tolkning** REFLECTION (`cursor-sa1-009`, `023`)
5. **Body doubling evidens-disclaimer** (`cursor-sa1-011`)
6. **1177 fötter-grounding** PLAY (`cursor-sa1-014`)

### REJECT (oförändrat från baseline)
- DSM/ICD-etiketter i UI · "heala trauma på X veckor" · streak-baserad oro-övning · gamification

### Nästa steg (dirigent)
1. `specialist-innehall-dirigent` → ROUTE NEW FACT till `specialist-kunskap-seed` / `specialist-mabra-curator`
2. Promote CANDIDATE → KEEP efter Pontus-OK
3. `npm run smoke:innehall` efter bank-uppdatering
