# Forskningsrapport: Livskompassen v2 – Evidens, Neuroinkludering och Slutfasregler

## Systemarkitektonisk och Klinisk Konvergens: En Översikt
Utvecklingen och slutfasen av Livskompassen v2 – ett privat "Life OS" byggt på React och Firebase – representerar ett paradigmskifte i hur mjukvara kan stödja individer med neuropsykiatriska funktionsnedsättningar (NPF) som befinner sig i medföräldraskap med högkonflikt. Det fundamentala uppdraget för denna forskningssyntes är att fastställa en strikt evidensbaserad informationsarkitektur som opererar i gränslandet mellan kognitivt stöd och juridisk bevishantering, utan att någon gång korsa gränsen till olicensierad terapi eller amatörmässig psykiatrisk diagnostisering.

Den underliggande systemarkitekturen i Livskompassen v2 bygger på en rigid separation av data för att skydda korskontaminering, vilket i produktionsmiljö upprätthålls genom tre RAG-silos (Retrieval-Augmented Generation) och en utvecklingszon. Denna Zero-Knowledge-inspirerade separation är inte enbart en teknisk detalj, utan en klinisk och juridisk nödvändighet. Genom att kategorisera innehåll i FACT, REFLECTION, PLAY och EVIDENCE, säkerställs att AI-modeller (exempelvis mabraCoach och Livs-Arkivarien) inte använder barnens loggar (`children_logs`) för att hallucinera fram psykologiska insikter, eller blandar bevis från högkonfliktsdynamik (`reality_vault`) med KBT-baserade reflektioner. Cross-RAG mellan dessa silor är absolut förbjudet för att bevara dataintegriteten och användarens psykologiska säkerhet.

Denna rapport utvärderar systemets design och innehåll genom fem parallella forskningsdomäner (SA-1 till SA-5). Varje domän bryter ned etablerad praxis från medicinska riktlinjer, myndighetsföreskrifter och psykologisk forskning, översätter dessa till deterministiska systemkrav och identifierar existerande innehållsluckor.

---

## SA-1: Vardagen och MåBra – Ångesthantering, Kognitiv Kapacitet och RSD
Den dagliga hanteringen av kognitiv kapacitet hos individer med ADHD kompliceras ofta av överlappande symtom på generaliserat ångestsyndrom (GAD) och Rejection Sensitive Dysphoria (RSD). Systemets "MåBra"-zon är designad för att erbjuda lågaffektivt stöd genom KBT-light och Acceptance and Commitment Therapy (ACT), men måste utformas med extrem försiktighet för att inte ersätta professionell vård.

### Icke-faciliterad Självhjälp vid GAD
Enligt National Institute for Health and Care Excellence (NICE) utgör icke-faciliterad självhjälp, baserad på principer från kognitiv beteendeterapi (KBT), en rekommenderad första linjens lågintensiva intervention för individer med kända eller misstänkta symtom på GAD. NICE-riktlinjerna poängterar vikten av sådant material som har en läsbarhetsnivå som är anpassad för individen. För Livskompassen v2 innebär detta att all text i `vit_entries` och interaktioner med `mabraCoach` måste vara korta, avgränsade och lexikalt okomplicerade för att minimera kognitiv belastning. Detta legitimerar systemets nuvarande ansats att erbjuda strukturerade reflektionskort istället för att öppna, ostrukturerade AI-chattar som riskerar att leda till ältande (grusin). Farmakologiska kombinationsbehandlingar och mer komplexa psykologiska interventioner skall enligt evidensen förbehållas specialistpsykiatrisk vård, vilket innebär att systemet deterministiskt måste avstå från att ge några medicinska råd överhuvudtaget.

```yaml
id: "research-sa1-001"
content_class: FACT
target_zone: kunskap
target_module: "Kunskapsbank (PIN)"
route: "/vardagen?tab=mabra"
category: "gad_angest"
source_tier: P1
source_url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3230126/"
source_title: "NICE Guidelines: Further treatment of diagnosed generalised anxiety disorder"
claim_sv: "Icke-faciliterad självhjälp baserad på KBT-principer är en rekommenderad första linjens intervention vid generaliserat ångestsyndrom."
why: "Detta validerar arkitekturen för MåBra-hubben och bekräftar att appen kan erbjuda KBT-light utan att fungera som en hälso- och sjukvårdsprodukt som kräver terapeutisk facilitering."
existing_overlap: "kunskap-fact-gad_angest"
recommendation: KEEP
rule_impact: "MåBra-coachen får ej erbjuda komplexa psykologiska analyser, utan skall strikt fungera som en parafraserande motor för pre-skrivna KEEP-kort (`vit_entries`)."
```

### Neurobiologin bakom Rejection Sensitive Dysforia (RSD)
Rejection Sensitive Dysphoria är en av de mest förlamande, men minsta formellt dokumenterade, aspekterna av ADHD i vuxen ålder. Trots att RSD saknar en officiell DSM-5-diagnoskod, rapporterar upp till 70 % av vuxna med ADHD en extrem, ibland outhärdlig, emotionell smärta i samband med verklig eller upplevd avvisning, kritik eller misslyckande. Forskning indikerar att denna intensiva emotionella respons inte är ett uttryck för ett underliggande förstämningssyndrom, utan härrör från neurologiska skillnader i hur ADHD-hjärnan reglerar avvisningsrelaterade stimuli.

Smärtan är ofta så överväldigande att den kan leda till explosiv vrede eller djupa skamspiraler, vilket imiterar stämningsrubbningar. I en högkonfliktsituation med en ex-partner är risken för RSD-triggande kommunikation maximal. Att systemet kan erbjuda omedelbar reframing genom att identifiera en reaktion som just RSD – och därmed externisera den från användarens självbild – är fundamentalt. Användaren måste förstå att smärtan är neurologiskt betingad och övergående, inte ett bevis på att motpartens attacker är sanna.

```yaml
id: "research-sa1-002"
content_class: REFLECTION
target_zone: mabra
target_module: "MåBra (vit_entries)"
route: "/hjartat?tab=mabra"
category: "adhd_vardag"
source_tier: P2
source_url: "https://my.clevelandclinic.org/health/diseases/24099-rejection-sensitive-dysphoria-rsd"
source_title: "Rejection Sensitive Dysphoria (RSD) - Cleveland Clinic"
claim_sv: "RSD innebär en intensiv fysiologisk och emotionell smärta utlöst av upplevd kritik, kopplat till avvikelser i hjärnans känsloreglering vid ADHD."
why: "Att erbjuda psykoedukation kring RSD neutraliserar skammen kring överreaktioner, vilket är vitalt när användaren tar emot fientliga SMS från en medförälder."
existing_overlap: "Ingen specifik faktapacke existerar i Kunskap-bank, endast ytlig omnämning i MåBra."
recommendation: NEW
rule_impact: "Skapa nya `vit_entries` för RSD-reframing. Systemet måste flagga för RSD när användaren uttrycker oproportionerlig hopplöshet efter ett specifikt meddelande."
```

### Fysiologisk Grounding genom Vagusstimulering
Vid akut kognitiv överbelastning eller emotionell dysreglering är kognitiva interventioner (som KBT) ofta ineffektiva eftersom den prefrontala cortexen är nedsatt. Fysiologiska interventioner ("bottom-up" snarare än "top-down") erbjuder en direkt väg till autonom reglering. Flertalet studier bekräftar att långsam andning (Slow-Paced Breathing, SPB) aktiverar det parasympatiska nervsystemet via vagusnerven, vilket ökar hjärtfrekvensvariationen (HRV) och leder till omedelbar stressreduktion.

Forskningen är slående specifik gällande parametrar för optimal vagusstimulering: en andningsfrekvens på cirka 6 andetag per minut (0,1 Hz), särskilt med en inandnings- till utandningsförhållande på 1:1 eller en marginellt förlängd utandning, maximerar den fysiologiska effekten och sänker LF/HF-ration (vilket indikerar parasympatisk aktivitet). En fem minuter lång session med djup, långsam andning har visat sig effektivt reducera ångest och öka vagal ton, särskilt hos individer med hög initial distress. Livskompassens andningsmodul kan därmed inte tillåtas vara en abstrakt eller estetisk funktion; den måste vara en deterministisk medicinteknisk timer låst till exakt 6 andetag per minut för att vara evidensbaserad.

```yaml
id: "research-sa1-003"
content_class: PLAY
target_zone: mabra
target_module: "MåBra Daglig mix"
route: "/hjartat?tab=mabra"
category: "andning"
source_tier: P1
source_url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12341363/"
source_title: "Effects of slow-paced breathing on vagal tone"
claim_sv: "Långsam andning kalibrerad till exakt 6 andetag per minut (0.1 Hz) optimerar stimuleringen av vagusnerven och maximerar hjärtfrekvensvariabiliteten."
why: "Denna precision definierar de tekniska kraven för UI-timern. Det skiljer funktionell fysiologisk grounding från ineffektiva wellness-applikationer."
existing_overlap: "Funktionen finns men saknar hittills strikta Hz-krav."
recommendation: STÄRK
rule_impact: "Andnings-timern i React MÅSTE hårdkodas till en 10-sekunders cykel (5 sek in, 5 sek ut) utan möjlighet för användaren att ställa in ett för snabbt tempo."
```

---

## SA-2: Valv, Hamn och Speglar – Högkonfliktsdynamik och Covert Manipulation
Att utveckla ett system för medföräldraskap i högkonflikt (HCF) med inslag av dold manipulation kräver en informationsarkitektur som står emot juridisk granskning. En felaktig implementering riskerar att förse motparten med ammunition eller att systemet framstår som ett verktyg för alienation.

### DARVO och Försvaret mot Covert Manipulation
Högkonfliktpersonligheter och individer med dolda narcissistiska drag använder systematiskt manipulativa taktiker för att upprätthålla en yttre fasad och kontrollera narrativet. Den framstående forskaren Jennifer Freyd har konceptualiserat en av de vanligaste mekanismerna: DARVO (Deny, Attack, and Reverse Victim and Offender). När en förövare konfronteras, nekar de till beteendet, attackerar personen som konfronterar, och intar själva offerrollen. Denna taktik är utformad för att förstöra offrets trovärdighet, skapa förvirring och framkalla "institutional betrayal", där domstolar och socialtjänst misstror det sanna offret.

Evidensen visar dock att när individer och institutioner i förväg utbildas om DARVO, reduceras taktikens förmåga att orsaka mental skada och påverka utomstående avsevärt. I Livskompassens "Speglar"-zon måste systemet kunna känna igen mönstret i motpartens kommunikation. Det är dock en ovillkorlig regel att systemet – i enlighet med `domän-covert-narcissism.mdc` – aldrig får diagnostisera motparten. Systemet skall objektivt identifiera och förklara DARVO som ett beteendemönster, inte som en personlighetsstörning. Denna kliniska stringens skyddar användarens integritet vid en potentiell vårdnadstvist, där diagnostiserande språk snabbt avfärdas av familjerätter.

```yaml
id: "research-sa2-001"
content_class: FACT
target_zone: kunskap
target_module: "Kunskapsbank (PIN)"
route: "/hjartat?tab=speglar"
category: "covert_taktik"
source_tier: P1
source_url: "https://www.tandfonline.com/doi/full/10.1080/10926771.2020.1774695"
source_title: "DARVO effectively reinforces the distrust of victims' narratives"
claim_sv: "DARVO är en väldokumenterad beteendestrategi som systematiskt omvänder skuld och ifrågasätter offrets trovärdighet, vilket neutraliseras genom förkunskap."
why: "Utbildning om DARVO validerar användarens verklighetsuppfattning utan att använda patologiserande diagnostik mot ex-partnern."
existing_overlap: "kunskap-fact-043 (innehåller DARVO, men kräver starkare anknytning till försvarsstrategi)."
recommendation: KEEP
rule_impact: "Prompten i Speglar måste identifiera DARVO i inklistrade SMS och returnera en neutral beteendeanalys, förbjuden att nämna ordet 'narcissist'."
```

### Parallellt Föräldraskap och BIFF-metoden
När samarbete inte är möjligt på grund av en högkonfliktsdynamik, är traditionella råd om "samarbetssamtal" (som ofta rekommenderas av Socialstyrelsen) ibland kontraproduktiva och kan utsätta den skyddande föräldern för fortsatt psykologiskt våld. Myndigheten för familjerätt och föräldraskapsstöd (MFoF) betonar vikten av barnets säkerhet framför till varje pris tvingat samarbete. Konceptet parallellt föräldraskap blir därför nödvändigt, där föräldrarna engagerar sig i barnets liv med minimal eller obefintlig interaktion med varandra.

För att hantera den oundvikliga skriftliga kommunikationen är Bill Eddys BIFF-metod (Brief, Informative, Friendly, Firm) det internationella och vetenskapligt erkända standardverktyget. Metoden motverkar den naturliga impulsen att försvara sig (JADE: Justify, Argue, Defend, Explain) när man utsätts för falska anklagelser. Genom att hålla meddelanden korta, enbart koncentrera sig på saklig information, upprätthålla en lågaffektiv vänlig/neutral ton, och sätta en tydlig gräns, eskaleras inte konflikten.

I Livskompassens "Hamn"-modul integreras BIFF deterministiskt. Modulen fungerar som en asynkron buffert mellan inkommande toxicitet och utgående svar. Crucialt är att BIFF-coachningen sker efemärt. Om meddelanden och AI-genererade BIFF-svar inte explicit sparas av användaren genom en Human-in-the-loop (HITL) procedur, raderas de. Detta minimerar risken för att systemet fungerar som en oändlig loop av konfliktältande, vilket är förödande för ADHD-hjärnans dopaminsystem.

```yaml
id: "research-sa2-002"
content_class: EVIDENCE
target_zone: hamn
target_module: "Hamn (BIFF)"
route: "/familjen?tab=hamn"
category: "kommunikation_metod"
source_tier: P1
source_url: "https://www.highconflicttraining.com/store"
source_title: "High Conflict Institute: BIFF Responses"
claim_sv: "BIFF-metoden begränsar fientlighet genom asynkrona meddelanden som är korta, sakliga, neutrala och avslutande, och undviker försvar."
why: "Utgör den exklusiva och enda tillåtna LLM-instruktionen för att generera svarsutkast i applikationen."
existing_overlap: "kunskap-fact-005, kunskap-fact-006"
recommendation: KEEP
rule_impact: "I `hamnTaktikWire.ts` måste BIFF-parametrarna verifieras. Inget utkast får innehålla JADE (Justify, Argue, Defend, Explain)."
```

### Bevishantering via WORM-protokollet
När konflikter eskalerar till verkställighetsmål eller vårdnadstvister blir kvalitén på bevisningen avgörande. En domstol förkastar svepande, känslobaserade anklagelser. Systemets `reality_vault` bygger därför på ett WORM-protokoll (Write-Once, Read-Many) för att säkra beviskedjan. All bevisning måste struktureras enligt formatet: Objektivt Beteende + Datum + Exakt Citat. Det faktum att posterna inte kan redigeras efter att de sparats garanterar dokumentens juridiska validitet och skyddar mot datamanipulation efterhand, en kritisk funktion som åtskiljer Livskompassen från vanliga anteckningsböcker.

| Maktstrategi (Hemlig) | Klinisk Wire-Signal i Hamn | Objektiv WORM-loggningsexempel (Beteende + Citat) |
|-----------------------|----------------------------|---------------------------------------------------|
| Förtalskampanj | `smear_wire` | "2026-06-16: Skickade e-post till lärare. Citat: 'Pappan är farlig och instabil'." |
| Dammsugning | `hoovering_wire` | "2026-05-10: Sms efter 3 v tystnad. Citat: 'Jag saknar vår familj, kan vi ses?'" |
| Juridiskt hot (DARVO) | `juridik_hot` | "2026-06-12: Svarade på fråga om schema. Citat: 'Du pressar mig, jag ringer min advokat'." |

---

## SA-3: Ekonomi, Kognitiv Belastning och Planering
Sektionen "Vardagen" adresserar det kausala sambandet mellan kognitiv funktionsnedsättning, exekutiv dysfunktion och finansiell instabilitet. För individer med ADHD resulterar nedsatt impulskontroll och svårigheter med tidsuppfattning ofta i obetalda räkningar, inkassokrav och en djup "pengaskam".

### ADHD-vänlig Ekonomi och Mikrobudgetering
Konsumentverket och Kronofogden understryker att de komplexa konsumentmarknaderna missgynnar individer med ADHD. Svårigheter att bedöma risker vid kreditköp och oförmåga att prioritera långsiktigt sparande är inte moraliska brister, utan resultat av lägre ekonomisk och kognitiv kapacitet. Rådgivning för denna målgrupp rekommenderar att börja med det mest grundläggande: att identifiera och säkerställa betalning av fasta kostnader som hyra och el innan pengar frigörs för annat.

Traditionella hushållsbudgetar, som bygger på att förutsäga en hel månads konsumtion i detalj, kräver för mycket arbetsminne och framkallar ångest. Forskningen pekar mot framgången hos Kuvertmetoden (Envelope Budgeting) och "YNAB"-filosofin. Genom att ge varje tillgänglig krona ett specifikt syfte elimineras osäkerheten. Livskompassens ekonomi-modul under `/vardagen?tab=ekonomi` måste därför spegla denna struktur.

```yaml
id: "research-sa3-001"
content_class: FACT
target_zone: kunskap
target_module: "Vardagen Ekonomi"
route: "/vardagen?tab=ekonomi"
category: "ekonomi_vardag"
source_tier: P1
source_url: "https://www.vardochinsats.se/adhd/behandling-och-stoed/raadgivande-samtal-om-privatekonomi/"
source_title: "Vård och Insats: Rådgivande samtal om privatekonomi vid ADHD"
claim_sv: "Adhd medför lägre ekonomisk kompetens, svårighet att överblicka utgifter och ökad efterfrågan på krediter, vilket snabbt kan leda till kronofogden."
why: "Bekräftar att systemet måste fungera som kognitiv friktion mot impulsköp och prioritera absolut tydlighet kring fasta utgifter."
existing_overlap: "kunskap-fact-009"
recommendation: STÄRK
rule_impact: "Applikationen måste prioritera mikrobudgetering framför historiska grafer och framtidsprojektioner för att undvika överväldigande."
```

### Kapacitetsstyrd UI och "One Screen One Job"
Nielsen Norman Group (NNG) påpekar att osäkerhet ökar den kognitiva belastningen drastiskt. För användare med kognitiva utmaningar är transparens och förutsägbarhet helt avgörande. Komplexa gränssnitt leder till kognitiv paralys. Detta motiverar regeln om "En skärm, ett jobb".

Evolution Gating (`evolution_ledger`) är systemets lösning. Vid "Nivå 1" döljs avancerade funktioner. Planeringsverktyget (P3 Kanban) är medvetet LÅST för att undvika komplexitet och fungera som ett "tömma hjärnan"-fack. Flaggan `economy_advanced` får endast aktiveras när användarens kognitiva kapacitet medger det.

```yaml
id: "research-sa3-002"
content_class: REFLECTION
target_zone: rules
target_module: "UI Designsystem"
route: "/planering?tab=handling"
category: "produkt_arkitektur"
source_tier: P2
source_url: "https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/"
source_title: "Nielsen Norman Group: Reduce Cognitive Load"
claim_sv: "Kognitiv tillgänglighet kräver minimerat visuellt brus, linjär struktur och att gränssnittet inte kräver att användaren lagrar information i arbetsminnet mellan steg."
why: "Motiverar beslutet att frysa P3 Kanban-funktionaliteten och förkasta förslag om mer komplexa planeringsfunktioner."
existing_overlap: "Finns dokumenterat i gap-matrix-2026-06-16.md."
recommendation: KEEP
rule_impact: "Förbjud implementation av sub-tasks, tidslinjer eller flip-cards i Kanban-vyn. Bibehåll den extrema förenklingen."
```

---

## SA-4: Familjen och Barnporten – Skydd i Högkonflikt
Barn som tvingas navigera mellan hushåll präglade av högkonflikt drabbas ofta av allvarlig psykisk påfrestning. De utsätts för emotionell invalidisering och tilldelas roller som "budbärare".

### Lojalitetskonflikter och Verkställighet
Rapporter från Barnombudsmannen och MFoF fastställer att barn i vårdnadstvister regelbundet utsätts för pressande lojalitetskonflikter. Det primära målet för den skyddande föräldern är att eliminera dessa krav och inte förvänta sig att barnet skall leverera information om motparten.
Inom Livskompassen är fliken "Barnfokus" LÅST. Barnets loggar (`children_logs`) måste förbli objektiva, separerade från Valvet, och sakna diagnostiska attribut (som "Parental Alienation"). Loggningen skall endast dokumentera observerbara fakta.

```yaml
id: "research-sa4-001"
content_class: EVIDENCE
target_zone: barnen
target_module: "Barnfokus (Reflektion)"
route: "/familjen?tab=reflektion"
category: "barn_hcf"
source_tier: P1
source_url: "https://wwwallmannabarnh.cdn.triggerfish.cloud/uploads/2015/04/Barnens-r%C3%A4ttigheter-i-v%C3%A5rdnadstvister.pdf"
source_title: "Barnens rättigheter i vårdnadstvister"
claim_sv: "Barn drabbas djupt av lojalitetskonflikter och får inte ansvaret att agera informant eller domare mellan två föräldrar i konflikt."
why: "Detta är grundvalen för varför systemet förbjuder auto-diagnosticering av Parental Alienation och kräver WORM-objektivitet vid barn-loggning."
existing_overlap: "bh-001 till bh-008"
recommendation: KEEP
rule_impact: "Ingen funktion får någonsin 'auto-promota' loggar från `children_logs` till domstolsbevis (`reality_vault`) utan explicit, granskande HITL-godkännande av användaren."
```

### Åldersanpassad Anknytning utan Prestation
Systemets PLAY-moduler måste vara noggrant ålderskalibrerade:
- **3–5 år:** Visuella känslo-kort.
- **6–9 år:** Korta samarbetslekar (≤ 2 min).
- **10–13 år:** Neutrala frågekort.
- **14+ år:** Acceptans för fysiskt tillbakadragande.

```yaml
id: "research-sa4-002"
content_class: PLAY
target_zone: barnen
target_module: "Barnen-PLAY-BANK"
route: "/barnporten"
category: "barn_neuro"
source_tier: P2
source_url: "https://www.barnombudsmannen.se/aktuellt/barnens-ratt-kranks-i-foraldrarnas-tvister/"
source_title: "Barnens rätt kränks i föräldrarnas tvister"
claim_sv: "Åldersadekvat delaktighet kräver verktyg som respekterar barnets mognadsgrad utan att introducera vuxnas terapispråk eller tyngd."
why: "Kräver segmentering via `currentBracket` och motiverar varför PLAY-banken är strikt avgränsad till max 2 minuter per aktivitet."
existing_overlap: "PLAY-banken saknar för närvarande tillräcklig separation för 14+."
recommendation: NEW
rule_impact: "Lägg till uppsättning `BP-PLAY-18..21` specifikt för tonåringar med fokus på autonomi och gränssättning."
```

---

## SA-5: Metaregler, Anti-Overwhelm och Prioritering

### Farorna med Gamification och Streaks
Kommersiella appar bygger engagemang genom streaks och XP. Användaranalyser visar att dessa mekanismer är skadliga på lång sikt för individer med exekutiv dysfunktion. Ett misslyckande framkallar RSD och skuld ("guilt streaks").
Livskompassen skall vara asynkront och fritt från straff. Designbeslutet att permanent REJECT:a XP, streaks och kalendermotivation är vetenskapligt förankrat i skademinimering.

```yaml
id: "research-sa5-001"
content_class: REFLECTION
target_zone: rules
target_module: "Designsystem"
route: "Global"
category: "produkt_arkitektur"
source_tier: P2
source_url: "https://www.reddit.com/r/finch/comments/1f0fuke/does_anyone_find_that_the_self_care_streak_makes/"
source_title: "Does anyone find that the self care streak makes you feel worse? (Finch Community)"
claim_sv: "Konsekvenserna av brutna 'streaks' orsakar skam, minskad självkänsla och slutligen avhopp för användare med ADHD och psykisk ohälsa."
why: "Bekräftar att anti-gamification är ett nödvändigt kliniskt beslut, inte en brist på funktioner."
existing_overlap: "Tidigare REJECT i Gap-matris bekräftas."
recommendation: KEEP
rule_impact: "Förbjud all kod som genererar kalender-kedjor, 'eldikoner' för på varandra följande dagar, eller virtuella straff för inaktivitet."
```

### Estetik och Kognitiv Vila
Högkontrasterande ljusa teman skapar visuell stress. Beslutet att låsa paletten till "Obsidian Dark" med dämpad guldaccent reducerar det visuella bruset. 5-tabslayout med dolda undermenyer ligger på den permanenta förbudslistan.

```yaml
id: "research-sa5-002"
content_class: FACT
target_zone: rules
target_module: "Systemarkitektur"
route: "Backend"
category: "produkt_sakerhet"
source_tier: P1
source_url: "uploaded:INNEHALL-REGISTER.md"
source_title: "INNEHALL-REGISTER - Core Directives"
claim_sv: "Den arkitektoniska segregeringen mellan Fakta, Reflektion, och Bevis (WORM) förhindrar LLM-hallucinationer som kan ogiltigförklara dokument i juridiska processer."
why: "Den viktigaste säkerhetsregeln. Bevis måste skyddas från att smittas av terapi-språk, och vice versa."
existing_overlap: "grunder-kanon.mdc"
recommendation: STÄRK
rule_impact: ".cursor/rules/grunder-kanon.mdc måste ha prio 1 och ovillkorligen avbryta all kod-generering som försöker bygga en gemensam sök-funktion (Cross-RAG) för alla firestore-kollektioner."
```

---

## Gap-Analys och Kunskapsinventering
| Område | Befintligt status | Identifierad Lucka (Åtgärd) | Rekommendation |
|--------|-------------------|-----------------------------|----------------|
| **Ångest/GAD** | `gad_angest` etablerad, KBT-light implementerad. | Parametrar för vagus-andning ej låsta i gränssnittet. | **STÄRK:** Hårdkoda 0,1 Hz (6 bpm) i UI. |
| **ADHD/RSD** | Begreppet omnämns i MåBra, saknar kliniskt ramverk. | Saknar psykoedukation kring RSD som neurologisk skillnad. | **NYTT:** Skapa `kunskap-fact-rsd-001` och dedikerade `vit_entries`. |
| **Högkonflikt** | BIFF och Covert taktik existerar. | Gränsen mellan BIFF-rådgivning och motparts-psykoanalys. | **KEEP/STÄRK:** LLM i Hamn får endast tillämpa BIFF; nollanalys. |
| **Ekonomi** | Kapacitetsstyrd ekonomi finns. | "Pengaskam" och prioritet på fasta utgifter saknas. | **NYTT:** Skapa `kunskap-fact-eko-010`. |
| **Barnfokus** | Låst UX, WORM insamling etablerad. | Tonårssegmentet (14+) saknar differentiering rörande integritet. | **NYTT:** Komplett PLAY-Bank `BP-PLAY-18..21`. |

---

## Prioriteringsregler för slutfasen ("Sluta göra"-lista / AVVISA)
Följande funktioner och arkitektoniska val skall definitivt avvisas:
- **Inga Streaks eller XP:** Inga obrutna kedjor eller virtuella bestraffningar.
- **Ingen diagnostisk UX:** Inga funktioner för att diagnostisera motparten.
- **Ingen Sammanslagning av Vyerna (Hem→Hjärtat):** Förkasta alla förslag på att slå ihop startsidan med reflektionssidan utan PMIR.
- **Ingen 5-Tab Navigation:** Navigationsdockan är låst till maximalt fyra ikoner + Fyren.
- **Ingen Auto-Promote:** Det skall förbli tekniskt omöjligt att skicka barndata direkt till Valvet utan manuell HITL.
- **Ingen Visuell Omsorgs-Creep:** Avvisa förslag om ljusa teman eller distraherande motion-design.
- **Ingen Ändring i Stack:** React + Capacitor är låst. React Native/Flutter avvisas omgående.

## Slutsatser
Genom att systematiskt tillämpa evidens – 6 bpm vagusstimulering, identifiering av DARVO, BIFF, kuvertmetoden, och WORM-loggning – omvandlas mjukvara till en skyddande sköld. Avståendet från populära designmönster som gamification är den mest centrala UX-strategin. Planen för slutfasen (Wave 27-30) är nu redo att exekveras inom dessa fastställda ramverk.
