# Kunskap — Content Seed (kuraterad fakta)

**Datum:** 2026-05-25 · **Batch:** 2026-05-29 (47 KEEP FACT + df-001–006)  
**Kurator:** `.cursor/agents/specialist-kunskap-seed.md`  
**Syfte:** Godkänd **FACT**-grund före ingest till `kampspar` / `kb_docs` — **inte** terapi, lek eller personlig Vit-reflektion.

**Register:** [`docs/INNEHALL-REGISTER.md`](../../INNEHALL-REGISTER.md) · **RAG:** `knowledgeVaultQuery` · **Silo:** Kunskap only.

---

## Så använder du seed-banken

| Steg | Vem | Vad |
|------|-----|-----|
| 1 | Du / Cursor | `kör kunskap seed` + tema |
| 2 | `specialist-kunskap-seed` | KEEP → append här |
| 3 | Du | Granska · kör `node scripts/seed_kampspar_profile.mjs` eller manuell ingest |
| 4 | Prod | RAG med **citation JSON** — LLM skapar inte nya FACT |

**`source_tier`:** `verified_reference` · `psychoeducation_general` · `product_copy` · `user_provided_opt_in` (sistnämnda kräver explicit märkning).

---

## Fakta-poster (KEEP)

| id | content_class | text_sv (kort) | citation_hint | tier |
|----|---------------|----------------|---------------|------|
| kunskap-fact-001 … 020 | FACT | Se batchar nedan | Se yaml nedan | P1/P2 |
| kunskap-fact-df-001 … 006 | FACT | Drogfrihet hub | § Drogfrihet | P1/P2 |
| kunskap-fact-021 … 047 | FACT | Content autorun våg 1–5 | § batchar nedan | P1/P2 |
| kunskap-fact-048 … 057 | FACT | Våg 8 extension 2026-06-20 | § batch nedan | P1/P2/product_copy |

---

## Batch 2026-05-27

**Kurator:** `specialist-kunskap-seed` · **Silo:** Kunskap (`kampspar` / `kb_docs`) · **Ingest:** manuell granskning → `seed_kampspar_profile.mjs` *(export TBD)*.

```yaml
id: kunskap-fact-001
status: KEEP
content_class: FACT
title: "Exekutiva funktioner och vardagsplanering vid ADHD"
content: "Exekutiva funktioner styr planering, prioritering, tidsuppfattning och att växla mellan uppgifter. Vid ADHD är dessa processer ofta mer belastade, vilket kan ge tidsblindhet och svårighet att starta eller avsluta aktiviteter. Extern struktur — kalender, påminnelser, synliga listor — avlastar arbetsminnet utan att ersätta medicinsk eller psykologisk behandling."
category: adhd_vardag
entryType: fakta
tags: [adhd, exekutiv_funktion, planering, tidsblindhet]
source_tier: P2
citation_hint: "NICE NG87 ADHD adults; psychoeducation executive function"
why: "Referens för Kompis/RAG — inte terapi eller personlig profil"
```

```yaml
id: kunskap-fact-002
status: KEEP
content_class: FACT
title: "Ett mikrosteg i taget — kognitiv avlastning"
content: "När en uppgift känns överväldigande minskar starttröskeln om den delas i ett enda konkret nästa steg som tar under cirka fem minuter. Det handlar om att sänka kravet på beslut i förväg, inte om att ignorera helheten. Metoden används i arbetsterapi och ADHD-självhjälp som komplement till medicin och behandling."
category: adhd_vardag
entryType: fakta
tags: [adhd, mikrosteg, paralys, kognitiv_avlastning]
source_tier: P2
citation_hint: "ADHD coaching / behavioral activation (general)"
why: "Fakta om metod — prod använder Paralys-Brytaren separat; ej frågekort"
```

```yaml
id: kunskap-fact-003
status: KEEP
content_class: FACT
title: "Parallellt föräldraskap — neutral definition"
content: "Parallellt föräldraskap innebär att två föräldrar har separata hushåll och egna rutiner kring barnen, med samordning kring barnets behov snarare än gemensam vardag. Det är vanligt efter separation och kräver tydliga överenskommelser om schema, hälsa och skola. Målet är förutsägbarhet för barnet, inte att föräldrarna ska tycka lika om allt."
category: medforaldraskap
entryType: fakta
tags: [medforaldraskap, separation, barn, samordning]
source_tier: P2
citation_hint: "Föräldrabalken 6 kap.; familjerätt — översikt"
why: "Referensfakta utan konflikt- eller BIFF-coaching"
```

```yaml
id: kunskap-fact-004
status: KEEP
content_class: FACT
title: "Gränser i medföräldraskommunikation"
content: "En gräns i medföräldraskap är en tydlig regel för *hur* ni kommunicerar (kanal, ämne, svarstid), inte en dom över den andres person. Exempel: endast skriftligt om känsloladdade ämnen eskalerar, eller att barnfrågor hålls separata från ekonomiska tvister. Gränser syftar till att skydda barnets stabilitet och förälderns återhämtning — de ersätter inte domstolsbeslut eller familjerättslig rådgivning."
category: medforaldraskap
entryType: fakta
tags: [granser, medforaldraskap, kommunikation]
source_tier: P2
citation_hint: "Coparenting communication boundaries (psychoeducation)"
why: "Fakta om gränstyp — ROUTE_VALV om sms-analys eller bevis"
```

```yaml
id: kunskap-fact-005
status: KEEP
content_class: FACT
title: "BIFF — vad förkortningen betyder"
content: "BIFF står för Brief (kort), Informative (informativ), Friendly (vänlig) och Firm (fast) — en kommunikationsstruktur för korta, sakliga svar utan onödig förklaring eller försvar. Metoden används ofta i medföräldraskap och konflikttröghet för att minska eskalering. Det är en formuleringsteknik, inte en juridisk strategi eller garanti för att motparten ändrar beteende."
category: kommunikation_metod
entryType: fakta
tags: [biff, grey_rock, kommunikation, medforaldraskap]
source_tier: P1
citation_hint: "Livskompassen produktterminologi; BIFF/Grey Rock psychoeducation"
why: "Faktadefinition — konkret svar på sms → Speglar/Hamn, ej Kunskap-coach"
```

```yaml
id: kunskap-fact-006
status: KEEP
content_class: FACT
title: "Grey Rock — neutral kommunikationsprincip"
content: "Grey Rock (grå sten) beskriver att hålla svar korta, sakliga och utan känslomässig detalj när en motpart söker konflikt eller reaktion. Syftet är att minska bränsle till eskalering, inte att förneka barnets eller egna behov i viktiga frågor. Principen skiljs från tystnad eller blockering: logistik kring barn ska fortfarande kunna hanteras tydligt och dokumenteras vid behov i rätt silo (bevis), inte som terapi här."
category: kommunikation_metod
entryType: fakta
tags: [grey_rock, eskalering, medforaldraskap]
source_tier: P1
citation_hint: "Livskompassen produktterminologi; high-conflict communication literature"
why: "Fakta — inte coaching-copy eller Valv-ingest"
```

```yaml
id: kunskap-fact-007
status: KEEP
content_class: FACT
title: "Neuroinkludering — sensorisk belastning hos barn"
content: "Barn med neuropsykiatrisk funktionsnedsättning kan uppleva ljud, ljus, beröring eller övergångar som mer intensiva. Sensorisk överbelastning kan visa sig som utbrott, tillbakadragenhet eller fysisk rastlöshet — inte alltid som \"illvilja\". Anpassningar (förutsägbarhet, pauser, val av miljö) är vanliga i skola och hem enligt barnets behov."
category: barn_neuro
entryType: fakta
tags: [barn, npf, sensorik, neuroinkludering]
source_tier: P2
citation_hint: "WHO neurodevelopmental; skolinspektionen NPF-anpassning (översikt)"
why: "Referens för föräldrar — ej lek-bank eller barnlogg-bevis"
```

```yaml
id: kunskap-fact-008
status: KEEP
content_class: FACT
title: "Stödjande språk kring barns svårigheter"
content: "Att beskriva beteende som information (\"hen blev överväldigad när…\") skiljer sig från att märka barnet som problemet (\"hen är jobbig\"). Neutral dokumentation i skola och vård fokuserar på vad som hände, miljö och stöd som provats. Det underlättar samverkan mellan hem, skola och insatser utan att blanda in vuxenkonflikt i barnets journal."
category: barn_neuro
entryType: fakta
tags: [barn, dokumentation, skola, neutral_logg]
source_tier: P2
citation_hint: "BBIC-inspirerad neutral logg; föräldrastöd NPF"
why: "Fakta — Barnfokus-frågor är PLAY/REFLECTION i annan bank"
```

```yaml
id: kunskap-fact-009
status: KEEP
content_class: FACT
title: "Vardagsekonomi — fakturor och betalningsflöde"
content: "En enkel ordning är: inkommande räkning → förfallodatum i kalender → betalning samma dag eller via autogiro. Att samla abonnemang och fasta kostnader i en lista minskar risken för förseningsavgifter vid ADHD-relaterad tidsblindhet. Detta är administrativ struktur, inte skuldrådgivning eller investeringsråd."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, faktura, autogiro, vardag]
source_tier: P1
citation_hint: "Livskompassen Planering/ekonomi produktcopy; Konsumentverket betalningar"
why: "Fakta för vardags-ADHD — ej terapi eller skuldcoaching"
```

```yaml
id: kunskap-fact-010
status: KEEP
content_class: FACT
title: "Juridik 10% — vad som oftast är logistik"
content: "I medföräldraskap handlar en stor del av praktiska frågor om schema, hämtning/lämning, skolinfo, läkarbesök och kostnadsfördelning enligt avtal eller dom. Föräldrabalken reglerar vårdnad, boende och umgänge; exakta villkor beror på beslut, medgivanden eller domstol. Appen ger inte juridisk rådgivning — vid tvist eller ändring av beslut ska familjerättsjurist eller myndighet kontaktas."
category: juridik_logistik
entryType: fakta
tags: [juridik, foraldrabalken, logistik, medforaldraskap]
source_tier: P2
citation_hint: "Föräldrabalken 6 kap. (SFS översikt); ej rådgivning"
why: "Neutral fakta — ROUTE_VALV vid konkret tvist/bevis"
```

---

## Batch 2026-05-27 — Drogfrihet (FACT)

**Kurator:** `specialist-kunskap-seed` · **Hub UI:** statisk lista (ingen live RAG i `/drogfrihet`).

```yaml
id: kunskap-fact-df-001
status: KEEP
content_class: FACT
title: "Beroende som sjukdom — översikt"
content: "Beroende kan involvera förlust av kontroll över intag trots skada, och påverkar hjärnans belöningssystem. Det klassas som en sjukdom i internationell klassificering. Behandling kan inkludera samtal, medicin och strukturerat stöd — individuellt."
category: beroende
entryType: fakta
tags: [beroende, sjukdom, 1177]
source_tier: P2
citation_hint: "1177.se beroende; ICD-11 substance use disorders (översikt)"
why: "Referensfakta — ej terapi eller personlig profil"
```

```yaml
id: kunskap-fact-df-002
status: KEEP
content_class: FACT
title: "SAMT — kort"
content: "Samtalsterapi med motivationsstöd hjälper många att utforska ambivalens kring förändring utan press. Etablerat stöd inom beroendevård."
category: beroende
entryType: fakta
tags: [samt, motivationsstod, beroende]
source_tier: P2
citation_hint: "Socialstyrelsen beroende; MI (översikt)"
why: "Neutral metodfakta"
```

```yaml
id: kunskap-fact-df-003
status: KEEP
content_class: FACT
title: "Självhjälpsgrupper — neutralt"
content: "Självhjälpsgrupper bygger på delat erfarenhetsutbyte och anonymitet. Frivilliga; kompletterar ofta professionell vård."
category: beroende
entryType: fakta
tags: [sjalvhjalp, grupp]
source_tier: P2
citation_hint: "Anonyma Nykterister (översikt)"
why: "Info utan rekrytering"
```

```yaml
id: kunskap-fact-df-004
status: KEEP
content_class: FACT
title: "Akut hjälp"
content: "Vid akut fara: 113. Råd om vård: 1177. Psykiatrisk akutmottagning vid akut psykisk kris."
category: beroende
entryType: fakta
tags: [113, 1177, akut]
source_tier: P1
citation_hint: "1177; SOS Alarm 113"
why: "Akut säkerhet — produktcopy"
```

```yaml
id: kunskap-fact-df-005
status: KEEP
content_class: FACT
title: "Regional beroendevård"
content: "Regioner erbjuder öppenvård och ibland sluten vård för beroende. Remiss via vårdcentral eller beroendemottagning."
category: beroende
entryType: fakta
tags: [region, oppenvard]
source_tier: P2
citation_hint: "1177; regionala vårdprogram"
why: "Navigering till vård"
```

```yaml
id: kunskap-fact-df-006
status: KEEP
content_class: FACT
title: "ADHD och beroende"
content: "ADHD och substansbruk kan förekomma samtidigt. Struktur, medicin vid ADHD enligt läkare, och beroendebehandling kan behövas parallellt."
category: beroende
entryType: fakta
tags: [adhd, comorbiditet, beroende]
source_tier: P2
citation_hint: "NICE; ADHD comorbidity (översikt)"
why: "Samtidighet — ej diagnos i app"
```

**Kanon i kod:** `src/modules/drogfrihet/constants/kunskapFacts.ts`

---

## Batch 2026-05-29 (IA Valv — konflikt & medföräldraskap)

**Kurator:** `specialist-kunskap-seed` · **Silo:** Kunskap only · **Ej** BIFF-coaching (→ Hamn/Valv).

```yaml
id: kunskap-fact-011
status: KEEP
content_class: FACT
title: "Grey Rock — neutral kommunikation vid konflikt"
content: "Grey Rock innebär korta, sakliga svar utan känslomässigt bränsle: bekräfta mottagande, svara på logistik, undvik att försvara eller förklara (JADE). Metoden används för att minska manipulation och eskalation i högkonfliktssituationer, inte som straff mot barnet."
category: medforaldraskap
entryType: fakta
tags: [grey_rock, kommunikation, konflikt, medforaldraskap]
source_tier: psychoeducation_general
citation_hint: "BIFF/Grey Rock — produktcopy Safe Harbor; ej terapi"
why: "FACT-referens i Kunskapsbank — Speglar/Hamn ger coaching"
```

```yaml
id: kunskap-fact-012
status: KEEP
content_class: FACT
title: "BIFF — Brief, Informative, Friendly, Firm"
content: "BIFF är en struktur för skriftlig kommunikation: kort (Brief), faktabaserad (Informative), artig utan överdriven värme (Friendly), och tydlig gräns (Firm). Syftet är förutsägbarhet och dokumentation, inte att vinna argument."
category: medforaldraskap
entryType: fakta
tags: [biff, kommunikation, granser]
source_tier: psychoeducation_general
citation_hint: "Bill Eddy BIFF — översikt"
why: "Referensfakta; prod-svar via analyzeMessage i Hamn"
```

```yaml
id: kunskap-fact-013
status: KEEP
content_class: FACT
title: "Append-only bevislogg — varför tidsstämpel"
content: "En bevislogg med append-only och server-tidsstämpel gör det svårare att senare påstå att händelser aldrig dokumenterats. Det ersätter inte juridisk rådgivning men stödjer kronologi vid familjerätt eller myndighetskontakt."
category: juridik_overview
entryType: fakta
tags: [bevis, worm, valv, kronologi]
source_tier: product_copy
citation_hint: "Verklighetsvalvet-SPEC; WORM reality_vault"
why: "Förklarar Valv utan auto-promotion från dagbok"
```

```yaml
id: kunskap-fact-014
status: KEEP
content_class: FACT
title: "Gaslighting — informationsförvrängning (översikt)"
content: "Gaslighting beskriver när någon systematiskt ifrågasätter din upplevelse av händelser för att skapa osäkerhet. Neutral dokumentation av datum, citat och bilagor kan motverka minnesglapp — utan att diagnostisera motparten i appen."
category: medforaldraskap
entryType: fakta
tags: [gaslighting, bevis, psykoeducation]
source_tier: psychoeducation_general
citation_hint: "APA psychoeducation — översikt; ej diagnos"
why: "FACT i Kunskap; Speglar/Valv för personlig bearbetning"
```

```yaml
id: kunskap-fact-015
status: KEEP
content_class: FACT
title: "Parallellt föräldraskap — barnets förutsägbarhet"
content: "Barn i separerade familjer mår ofta bättre av förutsägbara scheman, tydliga överlämningar och att föräldrar håller vuxenkonflikt borta från barnets öron. Samordning kring skola och hälsa prioriteras framför att föräldrarna ska vara överens om allt."
category: medforaldraskap
entryType: fakta
tags: [barn, medforaldraskap, schema]
source_tier: P2
citation_hint: "Föräldrabalken 6 kap. — översikt"
why: "Kompletterar kunskap-fact-003 utan duplicera hela texten"
```

---

## Batch 2026-05-29 (Google AI Pro Deep Research — ADHD vardag)

**Kurator:** `specialist-kunskap-seed` · **Källa:** Google AI Pro plan Steg B · **Silo:** Kunskap only.

```yaml
id: kunskap-fact-016
status: KEEP
content_class: FACT
title: "Tidsblindhet och extern tidsankare"
content: "Tidsblindhet vid ADHD innebär svårighet att uppskatta hur lång tid som gått eller återstår. Synliga klockor, timers och schemablock i kalender fungerar som externa ankare som avlastar arbetsminnet — de ersätter inte behandling men minskar risken att missa överlämningar eller deadlines."
category: adhd_vardag
entryType: fakta
tags: [adhd, tidsblindhet, planering, extern_struktur]
source_tier: P2
citation_hint: "NICE NG87 ADHD adults; psychoeducation time management"
why: "RAG-referens för planering/Kompis — ej personlig terapi"
```

```yaml
id: kunskap-fact-017
status: KEEP
content_class: FACT
title: "Uppgiftsinitiering — starttröskel"
content: "Svårighet att starta uppgifter (task initiation) är vanlig vid exekutiv dysfunktion. Att bryta ned till ett fysiskt första steg under 30 sekunder — öppna dokument, ställa fram ett glas vatten — sänker starttröskeln utan att kräva att hela uppgiften planeras klart."
category: adhd_vardag
entryType: fakta
tags: [adhd, exekutiv_funktion, mikrosteg, paralys]
source_tier: P2
citation_hint: "Russell Barkley executive function overview; ADHD psychoeducation"
why: "Kopplar till Paralys-Brytaren utan att blanda silor"
```

```yaml
id: kunskap-fact-018
status: KEEP
content_class: FACT
title: "Arbetsminne och listor utanför huvudet"
content: "När arbetsminnet är belastat ökar glömska av vardagliga åtaganden. Externa listor, inkorgar och påminnelser minskar kognitiv last eftersom hjärnan slipper hålla allt aktivt. Principen gäller planering — inte som krav på perfekt produktivitet."
category: adhd_vardag
entryType: fakta
tags: [adhd, arbetsminne, kognitiv_avlastning, planering]
source_tier: psychoeducation_general
citation_hint: "Cognitive offloading — ADHD psychoeducation general"
why: "Stöd för Planering-widget och Kompis — FACT not REFLECTION"
```

```yaml
id: kunskap-fact-019
status: KEEP
content_class: FACT
title: "Övergångar mellan aktiviteter"
content: "Att byta från en aktivitet till en annan (transition) kostar ofta mer kognitiv energi vid ADHD. Förutsägbara rutiner kring överlämning, måltid och kväll kan minska friktion — särskilt för barn i parallellt föräldraskap där scheman skiljer sig mellan hem."
category: adhd_vardag
entryType: fakta
tags: [adhd, overgang, rutin, barn, medforaldraskap]
source_tier: P2
citation_hint: "NICE NG87; transition supports ADHD children/adults overview"
why: "Kopplar Familjen/planering utan barn-EVIDENCE i samma post"
```

```yaml
id: kunskap-fact-020
status: KEEP
content_class: FACT
title: "Sömn och exekutiv funktion — översikt"
content: "Bristande sömn försämrar ofta exekutiva funktioner som impulskontroll och planering. Regelbunden sömnhygien och fasta läggtider är allmänna hälsoåtgärder — inte en garanti för symtomfrihet vid ADHD, men relevant för vardagsplanering och energihantering."
category: adhd_vardag
entryType: fakta
tags: [adhd, somn, exekutiv_funktion, vardag]
source_tier: psychoeducation_general
citation_hint: "Sleep hygiene psychoeducation; ADHD comorbidity sleep overview"
why: "Dagbok-taggar Sömn — FACT till Kunskap, ej MåBra-coach runtime"
```

---

## Batch 2026-05-29 (Google AI Pro autorun — repo)

**Kurator:** `specialist-kunskap-seed` · **Källa:** repo-pack + U6-granskning · **Silo:** Kunskap only · **Ej** webb (NotebookLM/Flow hoppades över).

```yaml
id: kunskap-fact-021
status: KEEP
content_class: FACT
title: "RSD — rejection sensitive dysphoria (översikt)"
content: "Rejection Sensitive Dysphoria (RSD) beskriver intensiv känslomässig smärta vid upplevd kritik eller avvisning — vanligt vid ADHD men inte en separat diagnos i ICD. Psychoeducation fokuserar på att skilja faktisk feedback från tolkning, paus före svar, och extern struktur för att minska impulsiva reaktioner. Det ersätter inte terapi eller medicin."
category: adhd_vardag
entryType: fakta
tags: [adhd, rsd, emotion, kommunikation]
source_tier: psychoeducation_general
citation_hint: "ADHD RSD psychoeducation (general); ej ICD-11 separat diagnos"
why: "Referens för Kompis/RAG — Speglar för personlig bearbetning"
```

```yaml
id: kunskap-fact-022
status: KEEP
content_class: FACT
title: "Zero Footprint — sessionsminne"
content: "Zero Footprint innebär att känslig sessionsdata (synapser, speglingsstate, tillfälliga cache) rensas vid utloggning, blur eller panic — så att privat bearbetning inte lämnar spår i en delad enhet. Permanent minne (journal, Valv, barnloggar) följer WORM-regler separat och kräver explicit spar."
category: produkt_sakerhet
entryType: fakta
tags: [zero_footprint, kill_switch, session, sacred]
source_tier: product_copy
citation_hint: "Livskompassen security.md; U4 Grunder"
why: "Faktaförklaring av Sacred Feature — ej runtime-kod"
```

```yaml
id: kunskap-fact-023
status: KEEP
content_class: FACT
title: "Tre kunskapssilor — varför inte sök överallt"
content: "Livskompassen delar minne i tre silor: Kunskap (referensfakta), Valv (bevis och kronologi), Barnen (barnloggar). De blandas inte i samma RAG-sökning eftersom fakta, bevis och barnobservation har olika tillförlitlighet och juridisk tyngd. Utvecklingszonen Vit (MåBra) exporteras inte till Kunskap-RAG."
category: produkt_arkitektur
entryType: fakta
tags: [silo, u1, rag, kunskap, valv]
source_tier: product_copy
citation_hint: "INNEHALL-REGISTER.md; arkiv-minne.md U1"
why: "Användarförklaring utan cross-RAG — dirigent ROUTE vid osäkerhet"
```

```yaml
id: kunskap-fact-024
status: KEEP
content_class: FACT
title: "Delat förälderschema — extern synlighet"
content: "I parallellt föräldraskap minskar missförstånd om hämtning och lämning om schemat ligger synligt i kalender båda kan se, med påminnelser före överlämning. Neutral formulering i inbjudningar ('Hämtning tis 16:00 enligt schema') minskar eskalering jämfört med sms i affekt."
category: medforaldraskap
entryType: fakta
tags: [schema, kalender, medforaldraskap, logistik]
source_tier: P2
citation_hint: "Coparenting scheduling psychoeducation; Planering-widget produktcopy"
why: "Logistik-FACT — konkret sms → Hamn, bevis → Valv"
```

```yaml
id: kunskap-fact-025
status: KEEP
content_class: FACT
title: "Dagbok taggar — struktur utan diagnos"
content: "Taggar i dagbok (t.ex. Sömn, Konflikt, Barn) grupperar poster för senare sökning utan att automatiskt klassificera dig eller motparten. De ersätter inte Valv-bevis eller medicinsk journal. Speglingscoach kan läsa taggade poster med opt-in — inte som sanning om tredje part."
category: dagbok_produkt
entryType: fakta
tags: [dagbok, taggar, journal, spegling]
source_tier: product_copy
citation_hint: "dagbok-vertex-plan.md Fas 1; journalQuickMirror"
why: "Stöd Dagbok v2 Snabb — FACT not REFLECTION"
```

---

## Batch 2026-05-29 — Våg 1 ADHD (026–028)

```yaml
id: kunskap-fact-026
status: KEEP
content_class: FACT
title: "ADHD-medicin — informationsroll, inte råd"
content: "Medicin vid ADHD ordineras av läkare och följs upp individuellt. Appen ger inte dos- eller preparatråd. Extern struktur och behandling kan samverka — medicin ersätter inte planering eller psykosocialt stöd."
category: adhd_vardag
entryType: fakta
tags: [adhd, medicin, disclaimer]
source_tier: P2
citation_hint: "NICE NG87 ADHD adults — treatment overview"
why: "Disclaimer-FACT — ej medicinsk rådgivning"
```

```yaml
id: kunskap-fact-027
status: KEEP
content_class: FACT
title: "ADHD och ångest — ofta samtidigt"
content: "ADHD och generaliserat ångestsyndrom förekommer ofta samtidigt. Hypervigilans och exekutiv belastning kan förstärka varandra. Behandling och stöd planeras separat per diagnos — inte som en enda förklaring till allt."
category: adhd_vardag
entryType: fakta
tags: [adhd, gad, komorbiditet]
source_tier: P2
citation_hint: "NICE comorbidity ADHD anxiety overview"
why: "Komorbiditet — FACT not personlig diagnos i app"
```

```yaml
id: kunskap-fact-028
status: KEEP
content_class: FACT
title: "Arbetsminne — varför listor hjälper"
content: "Arbetsminnet håller begränsat antal aktiva uppgifter. Vid ADHD minskar kapaciteten ofta under stress. Att skriva ned, dela upp och använda påminnelser avlastar — det är strategi, inte lathet."
category: adhd_vardag
entryType: fakta
tags: [adhd, arbetsminne, kognitiv_avlastning]
source_tier: psychoeducation_general
citation_hint: "Barkley working memory ADHD overview"
why: "Kompletterar 018 — kurs ADHD"
```

---

## Batch 2026-05-29 — Våg 2 GAD / ångest (029–035)

```yaml
id: kunskap-fact-029
status: KEEP
content_class: FACT
title: "Generaliserat ångestsyndrom — översikt"
content: "GAD innebär ihållande oro som är svår att styra, ofta med spänning, trötthet och sömnproblem. Diagnos ställs av vård — appen ger psychoeducation, inte bedömning av dig eller andra."
category: gad_angest
entryType: fakta
tags: [gad, angest, psychoeducation]
source_tier: P2
citation_hint: "ICD-11 generalised anxiety disorder overview"
why: "Referens-FACT — ej terapi"
```

```yaml
id: kunskap-fact-030
status: KEEP
content_class: FACT
title: "Hypervigilans — kropp i beredskap"
content: "Hypervigilans är ett tillstånd där nervsystemet skannar hot — ofta efter lång stress. Det kan ge trötthet, startledighet och svårighet att varva ned. Det är en fysiologisk reaktion, inte ett karaktärsfel."
category: gad_angest
entryType: fakta
tags: [hypervigilans, stress, nervsystem]
source_tier: psychoeducation_general
citation_hint: "Trauma-informed psychoeducation — hypervigilance overview"
why: "FACT för MåBra/grounding — ej ex-analys"
```

```yaml
id: kunskap-fact-031
status: KEEP
content_class: FACT
title: "Ångest i kroppen — interoception"
content: "Ångest märks ofta som hjärtklappning, spänning, illamående eller tryck i bröstet. Att namnge kroppsignal utan att tolka den som fara kan minska eskalering — ett steg i nervsystemsreglering."
category: gad_angest
entryType: fakta
tags: [angest, kropp, interoception]
source_tier: psychoeducation_general
citation_hint: "Interoception anxiety psychoeducation"
why: "Stöd grounding — REFLECTION i MåBra separat"
```

```yaml
id: kunskap-fact-032
status: KEEP
content_class: FACT
title: "Säkerhetsbeteenden — kort förklaring"
content: "Säkerhetsbeteenden (undvik, kontrollera, be om lugn) lindrar ångest kortvarigt men kan upprätthålla oro långsiktigt. Gradvis exponering och behandling sker med vård — appen ger struktur, inte terapiprotocol."
category: gad_angest
entryType: fakta
tags: [angest, undvikande, beteende]
source_tier: P2
citation_hint: "CBT anxiety psychoeducation — safety behaviors overview"
why: "FACT — ej exponeringsterapi i app"
```

```yaml
id: kunskap-fact-033
status: KEEP
content_class: FACT
title: "Andning och vagus — mekanism (kort)"
content: "Långsam utandning kan stimulera parasympatiska responser och sänka puls temporärt. Det är ett fysiologiskt verktyg, inte en garanti för att oron försvinner. Används som paus, inte som prestation."
category: gad_angest
entryType: fakta
tags: [andning, vagus, angest]
source_tier: psychoeducation_general
citation_hint: "Polyvagal / breathing psychoeducation general"
why: "Kopplar MåBra andning — FACT not övningstext"
```

```yaml
id: kunskap-fact-034
status: KEEP
content_class: FACT
title: "Oro vs planering — skillnad"
content: "Planering är konkret: datum, handling, nästa steg. Oro är repetitiv framtidsfantasi utan avslut. Att skriva ett faktiskt nästa steg skiljer ofta planering från maladaptiv oro — utan att förneka risker."
category: gad_angest
entryType: fakta
tags: [oro, planering, gad]
source_tier: product_copy
citation_hint: "Livskompassen Planering; GAD psychoeducation"
why: "Bro till Planering-widget"
```

```yaml
id: kunskap-fact-035
status: KEEP
content_class: FACT
title: "Sömn och ångest — ömsesidig påverkan"
content: "Bristande sömn ökar ofta känslighet för oro; ångest kan försvåra insomning. Sömnhygien är allmän hälsoåtgärd — vid ihållande problem kontaktas vård."
category: gad_angest
entryType: fakta
tags: [somn, angest, gad]
source_tier: psychoeducation_general
citation_hint: "Sleep hygiene + anxiety comorbidity overview"
why: "Kompletterar kunskap-fact-020"
```

---

## Batch 2026-05-29 — Våg 3 Känslor + ACT (036–040)

```yaml
id: kunskap-fact-036
status: KEEP
content_class: FACT
title: "Interoception — känna kroppen"
content: "Interoception är förmågan att känna inre signaler: hunger, puls, spänning. Träning sker genom uppmärksamhet utan omedelbar fix — grund för känsloreglering."
category: kanslor_vagus
entryType: fakta
tags: [interoception, kropp, kanslor]
source_tier: psychoeducation_general
citation_hint: "Interoception psychoeducation general"
why: "FACT — MåBra C-feel kort separat"
```

```yaml
id: kunskap-fact-037
status: KEEP
content_class: FACT
title: "Vagusnerven — förenklad översikt"
content: "Vagusnerven är en del av det parasympatiska systemet som kan påverka puls och lugn. Långsam utandning, nynnande och kall stimulans används som självreglering — inte som medicin."
category: kanslor_vagus
entryType: fakta
tags: [vagus, nervsystem, reglering]
source_tier: psychoeducation_general
citation_hint: "Vagus nerve psychoeducation overview"
why: "Stöd MåBra övningar"
```

```yaml
id: kunskap-fact-038
status: KEEP
content_class: FACT
title: "ACT — acceptans i ett nötskal"
content: "Acceptance and Commitment Therapy (ACT) betonar att acceptera obehagliga tankar/känslor samtidigt som man handlar enligt värderingar. Det är inte resignation — det är att minska kampen mot det som redan finns."
category: personlig_utveckling
entryType: fakta
tags: [act, acceptans, varderingar]
source_tier: psychoeducation_general
citation_hint: "ACT psychoeducation — Hayes overview"
why: "Term-FACT — övningar i MåBra"
```

```yaml
id: kunskap-fact-039
status: KEEP
content_class: FACT
title: "KBT — tanke/känsla/beteende (kort)"
content: "Kognitiv beteendeterapi utgår från att tankar, känslor och beteenden påverkar varandra. Att identifiera automatiska tankar är ett steg — inte samma sak som att 'tänka positivt'."
category: personlig_utveckling
entryType: fakta
tags: [kbt, tankar, beteende]
source_tier: psychoeducation_general
citation_hint: "CBT model psychoeducation"
why: "Stöd reframing-övning"
```

```yaml
id: kunskap-fact-040
status: KEEP
content_class: FACT
title: "Självmedkänsla vs självförstärkning"
content: "Självmedkänsla innebär att behandla sig med samma vänlighet som en närstående i svårighet — utan att ursäkta skada mot andra. Det skiljer sig från narcissistisk självförstärkning eller grandiositet."
category: personlig_utveckling
entryType: fakta
tags: [sjalvmedkansla, identitet]
source_tier: psychoeducation_general
citation_hint: "Neff self-compassion overview"
why: "FACT — C-se kort i MåBra"
```

---

## Batch 2026-05-29 — Våg 4 Föräldraskap (041–042)

```yaml
id: kunskap-fact-041
status: KEEP
content_class: FACT
title: "Trygg bas — förälder som ankare"
content: "Barn mår ofta bättre av en förälder som är förutsägbar och lugn, inte perfekt. 'Trygg bas' betyder att barnet vet att den vuxne kommer tillbaka efter separation — inte att allt alltid är harmoniskt."
category: barn_neuro
entryType: fakta
tags: [barn, trygghet, anknytning]
source_tier: P2
citation_hint: "Attachment psychoeducation — general parenting"
why: "FACT — Barnfokus PLAY separat"
```

```yaml
id: kunskap-fact-042
status: KEEP
content_class: FACT
title: "Barn i konflikt mellan vuxna"
content: "När vuxna konflikterar bär barn ofta dubbelbelastning: lojalitet och osäkerhet. Att hålla vuxenkonflikt borta från barnets öron och dokumentera logistik neutralt stödjer barnets stabilitet."
category: medforaldraskap
entryType: fakta
tags: [barn, konflikt, medforaldraskap]
source_tier: P2
citation_hint: "Coparenting children exposure psychoeducation"
why: "FACT — ej Barnen EVIDENCE auto"
```

---

## Batch 2026-05-29 — Våg 5 Taktiker referens (043–047)

```yaml
id: kunskap-fact-043
status: KEEP
content_class: FACT
title: "DARVO — neutral beskrivning"
content: "DARVO (Deny, Attack, Reverse Victim and Offender) beskriver ett mönster: förneka, angripa, byta offer/angripare-roller. Det är en beteendebeskrivning — inte en diagnos av en person."
category: taktik_referens
entryType: fakta
tags: [darvo, taktik, konflikt]
source_tier: psychoeducation_general
citation_hint: "Freyd DARVO research overview; ej diagnos"
why: "Referens-FACT — Speglar för personlig sms"
```

```yaml
id: kunskap-fact-044
status: KEEP
content_class: FACT
title: "Love bombing — översikt"
content: "Love bombing innebär intensiv uppmärksamhet och smickern tidigt i relation för att skapa beroende. I medföräldraskap kan motsvarande mönster visa sig som plötslig generositet före krav."
category: taktik_referens
entryType: fakta
tags: [love_bombing, taktik]
source_tier: psychoeducation_general
citation_hint: "High-conflict relationship psychoeducation"
why: "Referens — ROUTE Speglar vid sms"
```

```yaml
id: kunskap-fact-045
status: KEEP
content_class: FACT
title: "Triangulering — kort"
content: "Triangulering är när en vuxen drar in barn, familj eller tredje part i vuxenkonflikt för att stärka egen position. Neutral logistik och barnets behov prioriteras framför att 'vinna' narrativ."
category: taktik_referens
entryType: fakta
tags: [triangulering, barn, taktik]
source_tier: psychoeducation_general
citation_hint: "Family systems / high-conflict psychoeducation"
why: "FACT — dokumentera i Valv vid behov"
```

```yaml
id: kunskap-fact-046
status: KEEP
content_class: FACT
title: "Moving goalposts — kort"
content: "Moving goalposts (flyttande mål) innebär att krav eller regler ändras efter att motparten uppfyllt dem, så att inget räcker. Det skapar förvirring — dokumentation med datum motverkar minnesglapp."
category: taktik_referens
entryType: fakta
tags: [moving_goalposts, taktik, bevis]
source_tier: psychoeducation_general
citation_hint: "High-conflict communication literature"
why: "Kopplar Valv kronologi — ej coaching"
```

```yaml
id: kunskap-fact-047
status: KEEP
content_class: FACT
title: "Projektion — informationsbegrepp"
content: "Projektion beskriver när någon tillskriver andra egna impulser eller motiv. I konflikt kan det ge anklagelser utan bevis — neutral logg skiljer påstående från observerbar händelse."
category: taktik_referens
entryType: fakta
tags: [projektion, taktik, bevis]
source_tier: psychoeducation_general
citation_hint: "Psychoeducation — projection as concept"
why: "Referens — Speglar/Valv för personligt"
```

---

## Batch 2026-06-20 — Våg 8 extension (048–057)

**Kurator:** `specialist-kunskap-seed` · **YOLO Spår D** · **Silo:** Kunskap only · **Bank-only** (ingest separat).

```yaml
id: kunskap-fact-048
status: KEEP
content_class: FACT
title: "WORM — oföränderlig beviskedja"
content: "WORM (Write Once Read Many) innebär att sparade bevis i Valv och Barnen inte kan redigeras eller raderas av klienten efter skrivning — endast append med server-tidsstämpel. Syftet är trovärdig kronologi vid senare granskning, inte att automatiskt vinna tvist. Kunskap-FACT och WORM-bevis är separata silor; LLM blander dem inte i samma RAG-svar."
category: produkt_sakerhet
entryType: fakta
tags: [worm, valv, bevis, u4]
source_tier: product_copy
citation_hint: "Verklighetsvalvet-SPEC; security.md U4"
why: "Våg 8 extension — produktfakta som kompletterar kunskap-fact-013"
```

```yaml
id: kunskap-fact-049
status: KEEP
content_class: FACT
title: "BRIS 116 111 — barn i akut psykisk kris"
content: "BRIS (Barnens rätt i samhället) erbjuder anonymt stöd via telefon 116 111 och chatt för barn och unga. Föräldrar kan informera barn om numret utan att barnet behöver välja sida i vuxenkonflikt. BRIS ersätter inte BUP, skolkurator eller akut 112 — det är stöd i stunden. Generisk navigering — ej juridisk rådgivning."
category: barn_neuro
entryType: fakta
tags: [bris, barn, kris, stod]
source_tier: P2
citation_hint: "BRIS.se; Barnombudet krisstöd (översikt)"
why: "Våg 8 extension — grundreferens före bh-serien; ej Barnfokus PLAY"
```

```yaml
id: kunskap-fact-050
status: KEEP
content_class: FACT
title: "1177 — vårdvägledning och rätt vårdnivå"
content: "1177 Vårdguiden är den nationella ingången för sjukvårdsrådgivning i Sverige — dygnet runt. Den hjälper till att bedöma om situationen kräver vårdcentral, akutmottagning eller egenvård. Appen ersätter inte 1177 eller 112 vid akut fara. Psykoedukation i Livskompassen är inte medicinsk bedömning."
category: juridik_logistik
entryType: fakta
tags: [1177, vard, navigering, akut]
source_tier: P2
citation_hint: "1177.se; Socialstyrelsen vårdvägledning"
why: "Våg 8 extension — kompletterar kunskap-fact-010 navigering"
```

```yaml
id: kunskap-fact-051
status: KEEP
content_class: FACT
title: "Familjerätt — medling och föräldrarådgivning"
content: "Familjerätten erbjuder medling och föräldrarådgivning kring vårdnad, boende och umgänge — ofta kostnadsfritt eller subventionerat. Syftet är att nå överenskommelser utan dom när möjligt. Medling kräver att båda parter deltar; ensidig kontakt ersätter inte jurist. Livskompassen dokumenterar inte automatiskt till familjerätten — det är användarens val."
category: juridik_logistik
entryType: fakta
tags: [familjeratt, medling, vardnad, logistik]
source_tier: P2
citation_hint: "Domstolsverket familjerätt; Föräldrabalken 6 kap. (översikt)"
why: "Våg 8 extension — fördjupar jur-001/jur-004 utan processdetalj från våg 24"
```

```yaml
id: kunskap-fact-052
status: KEEP
content_class: FACT
title: "Prokrastination och exekutiv funktion"
content: "Prokrastination vid ADHD och GAD handlar ofta om starttröskel, rädsla för misslyckande eller överväldigande — inte om lathet eller bristande vilja. Att dela uppgiften, sänka första steget och acceptera ofullständigt resultat är vanliga strategier i arbetsterapi och ACT-inspirerad självhjälp. Det ersätter inte behandling."
category: adhd_vardag
entryType: fakta
tags: [prokrastination, adhd, exekutiv_funktion, starttroskel]
source_tier: P2
citation_hint: "NICE NG87 ADHD; behavioral activation overview"
why: "Våg 8 extension — kompletterar 002/017 utan duplicera mikrosteg-metod"
```

```yaml
id: kunskap-fact-053
status: KEEP
content_class: FACT
title: "Sensorisk paus — lugnande miljö"
content: "Sensorisk paus innebär att tillfälligt minska intryck: mörkare rum, färre ljud, ingen skärm, enkel rörelse eller tyngd. Vid NPF och utmattning kan kroppen behöva flera minuter innan larmnivån sjunker — paus är inte undvikande av ansvar utan återställning. Anpassningar i skola och hem beskrivs ofta i åtgärdsprogram."
category: barn_neuro
entryType: fakta
tags: [sensorik, paus, npf, aterhamtning]
source_tier: P2
citation_hint: "Skolverket NPF-anpassning; sensory overload psychoeducation"
why: "Våg 8 extension — kompletterar kunskap-fact-007 sensorik"
```

```yaml
id: kunskap-fact-054
status: KEEP
content_class: FACT
title: "Co-regulation — vuxen lugn före barnets lugn"
content: "Co-regulation innebär att ett lugnare vuxet nervsystem hjälper barnet att reglera känslor — genom närhet, lågaffektiv närvaro och förutsägbarhet, inte genom långa förklaringar i akut läge. Det ersätter inte professionellt stöd vid våld eller allvarlig omsorgsskada. I parallellt föräldraskap gäller samma princip i båda hem."
category: barn_neuro
entryType: fakta
tags: [co_regulation, barn, kanslor, foraldraskap]
source_tier: P2
citation_hint: "Circle of Security (översikt); polyvagal psychoeducation"
why: "Våg 8 extension — föräldraskap FACT; Barnfokus-frågor förblir PLAY"
```

```yaml
id: kunskap-fact-055
status: KEEP
content_class: FACT
title: "Långvarig stress — kroppen efter kris"
content: "Efter månader eller år av hög stress kan kroppen fortsätta reagera som om hot kvarstår: trötthet, startle, koncentrationssvårigheter och sömnstörning. Det är vanliga fysiologiska mönster — inte tecken på att man "borde vara över det". Återhämtning tar tid och kräver ofta gradvis minskad belastning, inte bara positivt tänkande."
category: gad_angest
entryType: fakta
tags: [langvarig_stress, aterhamtning, hypervigilans, utmattning]
source_tier: P2
citation_hint: "1177 stress och utmattning; McEwen allostatic load (översikt)"
why: "Våg 8 extension — bro till pu-003/kan-serien utan duplicera"
```

```yaml
id: kunskap-fact-056
status: KEEP
content_class: FACT
title: "Kunskap RAG — citation JSON"
content: "När Kunskapsvalvet svarar via RAG returneras svar med citation JSON som pekar på käll-id i kampspar — LLM skapar inte nya FACT i produktion. Användaren kan granska källan. Om frågan gäller personlig sms-analys eller bevis ska dirigenten peka till Hamn/Valv, inte Kunskap-coach."
category: produkt_arkitektur
entryType: fakta
tags: [rag, citation, kunskap, epistemik]
source_tier: product_copy
citation_hint: "livskompassen-rag-retrieval SKILL; knowledgeVaultQuery"
why: "Våg 8 extension — produktfakta för Kompis; kompletterar kunskap-fact-023"
```

```yaml
id: kunskap-fact-057
status: KEEP
content_class: FACT
title: "DCAP — dataclassificering i Livskompassen"
content: "DCAP (Data Classification and Protection) beskriver hur data klassas efter känslighet och vilken silo den tillhör: Kunskap-FACT, Valv-EVIDENCE, Barnen-EVIDENCE/PLAY, Vit-REFLECTION. Fel klassning ökar risk för att LLM behandlar spekulation som sanning. Ingest till Vector Search sker deterministiskt — inte av coach-runtime."
category: produkt_sakerhet
entryType: fakta
tags: [dcap, klassificering, silo, u3]
source_tier: product_copy
citation_hint: "DCAP.ts; INNEHALL-REGISTER U6"
why: "Våg 8 extension — epistemik-produkt; kompletterar ep-001"
```


## Batch 2026-06-14 — Våg 20 Covert taktik + barn HCF (cn-001–015, bh-001–008)

```yaml
id: kunskap-fact-cn-001
status: KEEP
content_class: FACT
title: "Covert mönster — offerroll utåt"
content: "I vissa högkonfliktfamiljer kan en vuxen framstå som offer inför skola, BVC eller myndigheter samtidigt som beteenden hemma skiljer sig. Dokumentera observerbara händelser med datum — inte personetiketter."
category: covert_taktik
entryType: fakta
tags: [covert, offerroll, bevis]
source_tier: psychoeducation_general
citation_hint: "High-conflict family systems psychoeducation"
why: "Våg 20 — domän covert; Valv/Hamn bro"
```

```yaml
id: kunskap-fact-cn-002
status: KEEP
content_class: FACT
title: "Covert — tyst straff och invalidation"
content: "Tyst straff (kall behandling, tillbakadragenhet, små kränkningar) kan vara svårare att bevisa än öppen konflikt. Neutral logg: vad som sades eller gjordes, när, och barnets reaktion om relevant."
category: covert_taktik
entryType: fakta
tags: [covert, invalidation, bevis]
source_tier: psychoeducation_general
citation_hint: "Covert aggression psychoeducation"
why: "FACT — ej diagnos; Speglar validering"
```

```yaml
id: kunskap-fact-cn-003
status: KEEP
content_class: FACT
title: "Covert — perfekt fasad utåt"
content: "En vuxen kan uppträda förebildslikt i offentliga sammanhang medan hem- eller sms-kommunikation skiljer sig. Tredjeparts observationer (skola, vård) och egna tidsstämplade bevis kompletterar varandra."
category: covert_taktik
entryType: fakta
tags: [covert, fasad, bevis]
source_tier: psychoeducation_general
citation_hint: "Domän-eval 2026-06-01 covert narcissism"
why: "Forensisk neutralitet i Valv"
```

```yaml
id: kunskap-fact-cn-004
status: KEEP
content_class: FACT
title: "Covert — små kränkningar över tid"
content: "Upprepade små kränkningar (förminska, ignorera, flytta mål) skapar kumulativ stress. Mönster över tid är starkare bevis än enstaka sms — använd Valv-kronologi."
category: covert_taktik
entryType: fakta
tags: [covert, kronologi, gaslighting]
source_tier: psychoeducation_general
citation_hint: "High-conflict documentation practice"
why: "Kopplar VaultMonsterPanel"
```

```yaml
id: kunskap-fact-cn-005
status: KEEP
content_class: FACT
title: "Covert vs grandiose — informationsbegrepp"
content: "Covert (dold) dynamik innebär ofta indirekt kontroll och offerposition; grandiose mer öppen dominans. Båda är beteendebeskrivningar — inte diagnoser att använda mot myndigheter eller i WORM-etiketter."
category: covert_taktik
entryType: fakta
tags: [covert, grandiose, metod]
source_tier: psychoeducation_general
citation_hint: "Domän-eval §1 covert vs grandiose"
why: "Projektminne för agenter"
```

```yaml
id: kunskap-fact-cn-006
status: KEEP
content_class: FACT
title: "Gaslighting — barn och vuxen"
content: "Gaslighting innebär att någons upplevelse systematiskt ifrågasätts. Hos barn kan det låta som 'det hände inte' eller 'du överdriver'. Validera barnets känsla utan att tala illa om andra vuxna."
category: covert_taktik
entryType: fakta
tags: [gaslighting, barn, speglar]
source_tier: P2
citation_hint: "Speglar-SPEC; Barnen neutral logg"
why: "ROUTE Speglar vid personlig sms"
```

```yaml
id: kunskap-fact-cn-007
status: KEEP
content_class: FACT
title: "Triangulering via barn"
content: "Triangulering är när barn eller skola dras in i vuxenkonflikt. Barn ska inte bära meddelanden eller välja sida. Logistik 10% mellan föräldrar via affärsmässig kanal (BIFF/Grey Rock)."
category: covert_taktik
entryType: fakta
tags: [triangulering, barn, hamn]
source_tier: psychoeducation_general
citation_hint: "kunskap-fact-045 utökning; Hamn 10/90"
why: "Dedupe taktik + medföräldraskap"
```

```yaml
id: kunskap-fact-cn-008
status: KEEP
content_class: FACT
title: "DARVO i medföräldraskap"
content: "DARVO (förneka, angripa, byta offer/angripare) förekommer i sms och möten. Svara inte i samma register — dokumentera, använd BIFF i Hamn, validera känsla i Speglar."
category: covert_taktik
entryType: fakta
tags: [darvo, hamn, speglar]
source_tier: psychoeducation_general
citation_hint: "kunskap-fact-043; DCAP"
why: "Runtime + Kunskap RAG"
```

```yaml
id: kunskap-fact-cn-009
status: KEEP
content_class: FACT
title: "Grey Rock — 10% logistik"
content: "Grey Rock: korta, neutrala svar utan känslomässigt bränsle. Cirka 10% av kommunikationen är ren logistik (tider, hämtning, skola); 90% känslomässiga beten ignoreras utan JADE."
category: covert_taktik
entryType: fakta
tags: [grey_rock, hamn, logistik]
source_tier: P1
citation_hint: "SafeHarbor-SPEC; kunskap-fact-005/006"
why: "Hamn runtime — referens-FACT"
```

```yaml
id: kunskap-fact-cn-010
status: KEEP
content_class: FACT
title: "BIFF — affärsmässig ton"
content: "BIFF (Brief, Informative, Friendly, Firm): kort, informativt, vänligt men fast svar. Används för ex-sms och mejl — inte för att vinna debatt utan för att avsluta interaktion säkert."
category: covert_taktik
entryType: fakta
tags: [biff, hamn, kommunikation]
source_tier: P1
citation_hint: "SafeHarbor-SPEC"
why: "Hamn callable analyzeMessage"
```

```yaml
id: kunskap-fact-cn-011
status: KEEP
content_class: FACT
title: "Parallel parenting — minimera kontakt"
content: "Parallel parenting innebär separata sfärer med minimal direkt kontakt mellan föräldrar. Samma barnregler kring skola och hälsa där möjligt; kommunikation affärsmässig och skriftlig."
category: covert_taktik
entryType: fakta
tags: [parallel_parenting, medforaldraskap]
source_tier: P2
citation_hint: "High-conflict coparenting literature"
why: "CUR-COPARENT-01 bro"
```

```yaml
id: kunskap-fact-cn-012
status: KEEP
content_class: FACT
title: "Gränser utan JADE"
content: "JADE (Justify, Argue, Defend, Explain) matar ofta konflikt. Sätt gräns med en mening och avsluta. Appen ska stoppa JADE-beten i Hamn — inte uppmuntra förklaringar till ex."
category: covert_taktik
entryType: fakta
tags: [jade, granser, hamn]
source_tier: P1
citation_hint: "livskompassen-governance; Hamn"
why: "DCAP JADE_BAIT"
```

```yaml
id: kunskap-fact-cn-013
status: KEEP
content_class: FACT
title: "Bevis — beteende och datum"
content: "Inför myndigheter och dossier: beskriv vad som hände, när, och vem som observerade. Undvik diagnosetiketter på motparten. WORM-poster i Valv är sanningens ankare."
category: covert_taktik
entryType: fakta
tags: [bevis, valv, dossier]
source_tier: product_copy
citation_hint: "Verklighetsvalvet-SPEC; security.md"
why: "Plausible deniability + forensik"
```

```yaml
id: kunskap-fact-cn-014
status: KEEP
content_class: FACT
title: "Review-kö vid osäker routing"
content: "Trauma-, LVU- eller vårdnadsmaterial med låg klassificeringsconfidence ska till mänsklig review-kö innan WORM — fail-closed. Inkast → granska-läge i Valv."
category: covert_taktik
entryType: fakta
tags: [inkast, review, hitl]
source_tier: product_copy
citation_hint: "inboxClassifier; domän-eval §5"
why: "ValvInputSuperModule granska"
```

```yaml
id: kunskap-fact-cn-015
status: KEEP
content_class: FACT
title: "Soc och skola — fakta före tolkning"
content: "Vid kontakt med soc eller skola: barnets behov, observerbara beteenden och tidslinje — inte etiketter på förälder. BBIC-dimensioner som struktur."
category: covert_taktik
entryType: fakta
tags: [soc, skola, bbic]
source_tier: P2
citation_hint: "Kampspar-BARN-REFERENS; Barnen-SPEC"
why: "Myndighetsneutral ton"
```

```yaml
id: kunskap-fact-bh-001
status: KEEP
content_class: FACT
title: "Barn — lojalitetsfälla"
content: "Lojalitetsfälla: barn känner att de måste välja sida eller dölja kärlek till en förälder. Ge explicit tillstånd att älska båda — ingen fråga som tvingar position."
category: barn_hcf
entryType: fakta
tags: [barn, lojalitet, familjen]
source_tier: P2
citation_hint: "Kampspar-BARN-REFERENS lojalitetsfälla"
why: "Barnfokus UI bro"
```

```yaml
id: kunskap-fact-bh-002
status: KEEP
content_class: FACT
title: "Barn — parentification"
content: "Parentification: barn tar vuxenroller (trösta, medla, sköta syskon). Tecken: 'mogen för sin ålder', minimerar egna behov. Säg explicit: det här är vuxnas jobb, inte ditt."
category: barn_hcf
entryType: fakta
tags: [barn, parentification, barnfokus]
source_tier: P2
citation_hint: "Kampspar-BARN-REFERENS parentification"
why: "Barnen PLAY + Kunskap"
```

```yaml
id: kunskap-fact-bh-003
status: KEEP
content_class: FACT
title: "Barn — emotionell invalidation"
content: "När barns känslor avfärdas ('sluta gråta', 'det var inget') lär de sig dölja affekt. Trygg förälder speglar: 'Jag tror dig' — utan att tala illa om andra vuxna."
category: barn_hcf
entryType: fakta
tags: [barn, invalidation, speglar]
source_tier: P2
citation_hint: "Barn-referens emotionell invalidation"
why: "Familjen Barnfokus"
```

```yaml
id: kunskap-fact-bh-004
status: KEEP
content_class: FACT
title: "Barn — splitting och syskonroller"
content: "Splitting (idealisera/devalvera) kan ge syskonroller som guldkorn och syndabock. Ge varje barn egen relation; undvik jämförelser; logga neutralt per barn."
category: barn_hcf
entryType: fakta
tags: [barn, splitting, syskon]
source_tier: P2
citation_hint: "Barn-referens guldkorn/syndabock"
why: "children_logs separat silo"
```

```yaml
id: kunskap-fact-bh-005
status: KEEP
content_class: FACT
title: "Barn — högkontroll hem: grundbehov"
content: "Vid ihållande vuxenkonflikt skadar barn mest av att utnyttjas som budbärare — inte nödvändigtvis av två hem. Grundbehov: trygghet, förutsägbarhet, lojalitetsfrihet, skola/sömn."
category: barn_hcf
entryType: fakta
tags: [barn, bbic, konflikt]
source_tier: P2
citation_hint: "Barn-referens högkonflikt separation"
why: "Familjen default-flik Barnfokus"
```

```yaml
id: kunskap-fact-bh-006
status: KEEP
content_class: FACT
title: "Barn — NPF i konflikt"
content: "Barn med ADHD/autism har ofta lägre tolerans för oförutsägbarhet. Dubbelbelastning: neurologisk sårbarhet plus lojalitetsstress. Rutiner vid överlämning och decompression efter skola."
category: barn_hcf
entryType: fakta
tags: [barn, npf, adhd]
source_tier: P2
citation_hint: "Barn-referens NPF högkonflikt"
why: "Evolution Barnporten bracket"
```

```yaml
id: kunskap-fact-bh-007
status: KEEP
content_class: FACT
title: "Barn — skydd utan att tala illa om mor"
content: "Validera barnets känsla; håll vuxenlogik borta; dokumentera neutralt; använd BIFF/Grey Rock i vuxenkontakt. Barn ska inte höra detaljer om rättsprocess."
category: barn_hcf
entryType: fakta
tags: [barn, strategi, hamn]
source_tier: P2
citation_hint: "Barn-referens strategi skydda barn"
why: "Locked UX Barnfokus"
```

```yaml
id: kunskap-fact-bh-008
status: KEEP
content_class: FACT
title: "Barn — professionellt stöd"
content: "Involvera BVC, skolkurator eller BUP vid ihållande sömn-/matproblem, rädsla eller regression. Förbered neutral tidslinje — fokus barnets behov, inte etiketter på förälder."
category: barn_hcf
entryType: fakta
tags: [barn, stod, bbic]
source_tier: P2
citation_hint: "Barn-referens professionellt stöd"
why: "HITL Barnporten → Valv"
```

## Batch 2026-06-14 — Våg 21 Covert HCF fördjupning (cn-016–020)

Referens-FACT i `kampspar` — **inte** användarens teorier eller WORM-bevis (`reality_vault` = EVIDENCE).

```yaml
id: kunskap-fact-cn-016
status: KEEP
content_class: FACT
title: "Hoovering — återkontakt efter gräns"
content: "Hoovering beskriver återkontakt efter tystnad, blockering eller tydlig gräns — via nostalgi, krisbudskap, gåvor eller 'barnens skull'. Syftet är ofta att återöppna kontakt och återställa dynamiken, inte nödvändigtvis försoning. I medföräldraskap: håll logistik kort (BIFF/Grey Rock); dokumentera datum och kanal i Valv om du sparar bevis — här är begreppet referens, inte din specifika händelse."
category: covert_taktik
entryType: fakta
tags: [covert, hoovering, granser, hamn]
source_tier: psychoeducation_general
citation_hint: "High-conflict post-separation psychoeducation; intermittent contact patterns (HCR literature)"
why: "Våg 21 lucka — skiljer Kunskap-FACT från Valv-EVIDENCE"
```

```yaml
id: kunskap-fact-cn-017
status: KEEP
content_class: FACT
title: "Smear campaign — systematiskt narrativ"
content: "Smear campaign (förtalskampanj) innebär spridning av negativ bild om en person till tredje parter — familj, vänner, skola eller myndigheter — ofta före eskalering. Mönstret syftar till att underminera motpartens trovärdighet. Psychoeducation: beskriv vem som fick vilket budskap och när (observerbart) i Valv — inte etiketter som 'hon försöker förstöra mig' i Kunskap-RAG."
category: covert_taktik
entryType: fakta
tags: [covert, smear_campaign, bevis, valv]
source_tier: psychoeducation_general
citation_hint: "Bill Eddy high-conflict personality patterns; reputational aggression in family systems"
why: "Våg 21 — forensisk neutralitet; kopplar dossier utan diagnos"
```

```yaml
id: kunskap-fact-cn-018
status: KEEP
content_class: FACT
title: "Flying monkeys — tredjepartsnätverk"
content: "Flying monkeys (tredjepartsbudbärare) är vuxna som medvetet eller omedvetet för vidare budskap, samlar information eller utövar social press i någons ställe. Skiljer sig från triangulering via barn (cn-007): här är nätverk av vuxna. Neutral respons: en kanal förälder–förälder, inga meddelanden via mellanhänder; logga vem som kontaktade dig och vad som sades om det blir bevis."
category: covert_taktik
entryType: fakta
tags: [covert, flying_monkeys, triangulering, hamn]
source_tier: psychoeducation_general
citation_hint: "Family systems triangulation; high-conflict third-party recruitment psychoeducation"
why: "Kompletterar 045 utan barn-triangulering-duplicat"
```

```yaml
id: kunskap-fact-cn-019
status: KEEP
content_class: FACT
title: "Trauma bonding — intermittent förstärkning"
content: "Traumatisk binding (trauma bonding) beskriver stark attachment trots skada, ofta via intermittent förstärkning: växling mellan värme/godkännande och tillbakadragenhet eller straff. Djupare cykel än love bombing (044): samma relation över tid, inte bara tidig intensitet. I medföräldraskap kan mönstret visa sig som plötslig vänlighet före krav eller efter konflikt — igenkänning är referens; dina sms är EVIDENCE i Valv."
category: covert_taktik
entryType: fakta
tags: [covert, trauma_bonding, love_bombing, speglar]
source_tier: psychoeducation_general
citation_hint: "Dutton & Painter (1981) traumatic bonding; intermittent reinforcement psychoeducation"
why: "Våg 21 fördjupning — 044 översikt, här cykeln"
```

```yaml
id: kunskap-fact-cn-020
status: KEEP
content_class: FACT
title: "Maternal-image fasad — offentlig vs privat"
content: "Maternal-image fasad (idealiserad mor-bild) beskriver när en vuxen framstår som omsorgsfull och förebildslikt i skola, BVC eller sociala sammanhang medan privat kommunikation eller hemmiljö skiljer sig — observerbart, inte moralisk dom. Generell 'perfekt fasad' (cn-003) är bredare; här fokus på kulturellt värderad föräldrarroll utåt. Dokumentera diskrepans med datum och neutrala tredjepartsobservationer i Valv; använd inte 'dålig mor' eller diagnos i dossier."
category: covert_taktik
entryType: fakta
tags: [covert, maternal_fasad, bevis, skola]
source_tier: psychoeducation_general
citation_hint: "High-conflict family systems; covert parenting presentation vs private behavior (HCF psychoeducation)"
why: "Våg 21 lucka — specificerar cn-003 för mor-bild"
```

---

## Batch 2026-06-14 — Juridik & myndighet (våg 21)

**Kurator:** `specialist-kunskap-seed` · **Lucka:** [`.context/domän-covert-narcissism.md`](../../.context/domän-covert-narcissism.md) § Juridisk weaponization, vårdnad, LVU · **Silo:** Kunskap only · **Ingest:** mänsklig granskning.

```yaml
id: kunskap-fact-jur-001
status: KEEP
content_class: FACT
title: "Parallellt föräldraskap — svensk praxis och begrepp"
content: "Efter separation har många familjer två hushåll med separata vardagsrutiner och begränsad direkt kontakt mellan föräldrarna — ofta kallat parallellt föräldraskap. I svensk familjerätt skiljs vårdnad (ansvar för barnets uppfostran), boende (var barnet bor) och umgänge (kontakt med förälder barnet inte bor hos). Gemensam vårdnad är vanligt om inget annat beslutats genom överenskommelse eller dom. Parallellt föräldraskap är ett samordningsmönster, inte en juridisk term, och ersätter inte skriftliga avtal, medling eller domstolsbeslut. Livskompassen ger information — inte juridisk rådgivning."
category: juridik_overview
entryType: fakta
tags: [parallellt_foraldraskap, vardnad, boende, umganget, medforaldraskap, sverige]
source_tier: P2
citation_hint: "Föräldrabalken 6 kap. (SFS översikt); Socialstyrelsen BBIC — begrepp; ej rådgivning"
why: "Svensk kontext för våg 21 — kompletterar kunskap-fact-003/015/cn-011 utan BIFF-coaching"
```

```yaml
id: kunskap-fact-jur-002
status: KEEP
content_class: FACT
title: "Dokumentation vid föräldrakonflikt — BBIC-inspirerad struktur"
content: "När underlag kan delas med skola, vård eller socialtjänst minskar missförstånd om information organiseras kring barnet — inte kring vuxnas karaktär. BBIC (barns behov i centrum) strukturerar kring barnets hälsa, utveckling, skolgång, sociala relationer och trygghet. Ett neutralt inlägg beskriver: datum och tid, observerbar händelse, vem som var närvarande, hur barnet reagerade, och vilket stöd barnet behövde. Undvik diagnoser på vuxna, värderande etiketter och slutsatser om avsikt. Detta är dokumentationspraxis som information — inte vägledning för ett visst ärende eller domstolsstrategi."
category: juridik_overview
entryType: fakta
tags: [dokumentation, bbic, barnets_behov, tvist, neutral_logg]
source_tier: P2
citation_hint: "Socialstyrelsen BBIC-handbok (översikt); kunskap-fact-cn-013/015 kompletterar"
why: "Fördjupar cn-015 med BBIC-struktur — ROUTE_VALV vid konkret dossier/bevis"
```

```yaml
id: kunskap-fact-jur-003
status: KEEP
content_class: FACT
title: "Socialtjänst och LVU — processöversikt (information)"
content: "Socialtjänsten utreder om ett barn kan behöva skydd eller stöd när det finns oro kring hemmiljön. En utredning inleds ofta med informationsinsamling (föräldrar, barn, skola); frivilliga insatser prövas i många fall först. LVU (Lag om vård av unga) är ramlag som kan ge stöd till vård utanför hemmet när frivilliga åtgärder inte räcker och barnets bästa kräver det; beslut fattas av förvaltningsrätten — inte av föräldrarna. Föräldrar har i regel rätt att få information om processen och yttra sig. Denna översikt beskriver institutionella steg i allmänhet — den är inte juridisk rådgivning och förutsäger inte utfall i enskilda ärenden."
category: juridik_overview
entryType: fakta
tags: [soc, lvu, socialtjanst, forvaltningsratt, process]
source_tier: P2
citation_hint: "LVU (1990:52) översikt; Socialstyrelsen handläggning barn — ej rådgivning"
why: "Täcker våg 21-lucka LVU/soc — skiljd från cn-014 (produkt review-kö)"
```

```yaml
id: kunskap-fact-jur-004
status: KEEP
content_class: FACT
title: "Juridik som logistik — 10% sakinnehåll, 90% affekt"
content: "I högkonflikt medföräldraskap blandas ofta två lager i samma meddelande: logistik (domstolsdatum, svarsfrister, hämtning, skolmöten, formella kallelser från myndighet) och känslomässiga beten (anklagelser, skuld, hot formulerade som juridiska varningar, krav på omedelbar affektiv reaktion). Att särskilja logistik från bete är en administrativ sortering — inte garanti för juridiskt utfall. Logistik har oftast datum, konkret handling eller närvaro, och namngiven myndighet eller forum; beten saknar ofta tydlig frist, uppmanar till förklaring (JADE) eller eskalerar utan formellt processsteg. Juridisk weaponization beskriver när juridiskt språk främst används för att pressa eller destabilisera snarare än slutföra ett processsteg. Livskompassen ger inte råd om ditt ärende — vid bindande frågor kontakta kvalificerad jurist eller berörd myndighet."
category: juridik_overview
entryType: fakta
tags: [juridik, logistik, weaponization, 10_90, medforaldraskap]
source_tier: P2
citation_hint: "High-conflict coparenting literature (översikt); kunskap-fact-010/cn-009 kompletterar"
why: "Våg 21 juridisk weaponization — informational, ej Hamn-svar eller etikett på motpart"
```

---

## Batch 2026-06-14 — Epistemik & kognitiva guardrails (ep-001–005)

**Syfte:** Skilj teori från bevis när ~80% inkast är HCF — LLM ankra till FACT, varna vid drift.

```yaml
id: kunskap-fact-ep-001
status: KEEP
content_class: FACT
title: "EVIDENCE, FACT och REFLECTION — tre olika sanningstyper"
content: "I Livskompassen är EVIDENCE det du själv sparat (sms, möten, barnobservation) i WORM-silor — kronologi, inte automatisk sanning. FACT är kuraterad referens i Kunskapsbanken som RAG citerar. REFLECTION är frågekort i Vit — exporteras inte till Kunskap-RAG. En teori om motpartens mönster hör hemma som EVIDENCE i Valv; den blir inte FACT förrän den är verifierad referens i kampspar."
category: epistemik_produkt
entryType: fakta
tags: [evidence, fact, reflection, u6, guardrail]
source_tier: product_copy
citation_hint: "INNEHALL-REGISTER U6; SANNING_ANALYTIKERN"
why: "Kärngrind — teorier ≠ RAG-sanning"
```

```yaml
id: kunskap-fact-ep-002
status: KEEP
content_class: FACT
title: "Bekräftelsebias och mönstersökning under stress"
content: "Vid hypervigilans och ADHD/GAD söker hjärnan mönster snabbare — ibland samband som inte finns (apopheni). Bekräftelsebias: man minns det som passar bilden. Det är kognitiv mekanism, inte tecken på att upplevelsen är fel. Skilj 'jag tror att…' från '2026-03-12 skrev hen…' (observerbar Valv-post)."
category: epistemik_produkt
entryType: fakta
tags: [bekraftelsebias, hypervigilans, guardrail]
source_tier: psychoeducation_general
citation_hint: "Confirmation bias; trauma hypervigilance psychoeducation"
why: "Drift-varning utan att invalidiera upplevelse"
```

```yaml
id: kunskap-fact-ep-003
status: KEEP
content_class: FACT
title: "Forensisk neutral logg — observation skild från tolkning"
content: "Tre lager: (1) observation — vad, vem, datum; (2) kontext — plats, närvarande; (3) tolkning — hypotes (märk explicit). Dossier/myndighet: lager 1–2. Sannings-Analytikern citerar endast WORM med docId — utan citation: inget sanning-påstående."
category: epistemik_produkt
entryType: fakta
tags: [forensik, observation, tolkning, valv]
source_tier: product_copy
citation_hint: "Verklighetsvalvet-SPEC; cn-013 komplement"
why: "Observation/tolkning-split"
```

```yaml
id: kunskap-fact-ep-004
status: KEEP
content_class: FACT
title: "När Speglar, Valv eller Kunskap"
content: "Speglar: validera känsla, Zero Footprint. Valv: WORM-bevis och tidslinje. Kunskap: metod/referens — inte sms-coaching. Hamn: BIFF på konkret meddelande. Vid tvivel → Granska, fail-closed."
category: epistemik_produkt
entryType: fakta
tags: [speglar, valv, kunskap, routing]
source_tier: product_copy
citation_hint: "domän-covert-narcissism modul-mappning"
why: "Produkt-routing FACT"
```

```yaml
id: kunskap-fact-ep-005
status: KEEP
content_class: FACT
title: "Kognitiv avlastning — extern WORM"
content: "Hypervigilans håller arbetsminnet aktivt. Extern WORM med server-tidsstämpel minskar behovet att hålla kronologi i huvudet — samma princip som listor vid ADHD, för bevis. Ersätter inte terapi; frigör kapacitet för nuet."
category: epistemik_produkt
entryType: fakta
tags: [kognitiv_avlastning, worm, hypervigilans]
source_tier: psychoeducation_general
citation_hint: "Cognitive offloading; Verklighetsvalvet WORM"
why: "Produktankare för Valv"
```

---

## Batch 2026-06-14 — Barn HCF fördjupning (bh-009–012)

```yaml
id: kunskap-fact-bh-009
status: KEEP
content_class: FACT
title: "Barn — föräldraalienation som beteendemönster"
content: "Föräldraalienation beskriver barnets reaktion när kontakt med en förälder systematiskt undermineras — inte diagnos på vuxen. Tecken: avvisande kontakt utan egen rädsla; vuxen-fraser; skuld när kontakt glädjer. Dokumentera datum och barnets ord — aldrig etiketter på mor/far."
category: barn_hcf
entryType: fakta
tags: [barn, alienation, beteende]
source_tier: P2
citation_hint: "Barnen-SPEC G52; Kampspar-BARN-REFERENS"
why: "Wave 21 — PA som barnsignal"
```

```yaml
id: kunskap-fact-bh-010
status: KEEP
content_class: FACT
title: "Barn — lojalitetsbind (mekanism)"
content: "Lojalitetsbind: anknytningsbehov krockar med krav att ta ställning. Tecken: skuld efter rolig tid hos andra föräldern; hemligheter; överdriven lojalitet. Skydd: tillstånd att älska båda; inga positionerande frågor."
category: barn_hcf
entryType: fakta
tags: [barn, lojalitet, anknytning]
source_tier: P2
citation_hint: "Kampspar-BARN-REFERENS lojalitetsfälla"
why: "Fördjupar bh-001"
```

```yaml
id: kunskap-fact-bh-011
status: KEEP
content_class: FACT
title: "Barn — NPF-stress i högkonflikt"
content: "NPF-barn har lägre stresströskel. I vårdnadskonflikt: neurologi plus lojalitetsstress. Skola visar stress före hemmet. Stöd: schema, förvarning vid byte, decompression, IUP i båda hem där möjligt."
category: barn_hcf
entryType: fakta
tags: [barn, npf, stress, skola]
source_tier: P2
citation_hint: "Kampspar-BARN-REFERENS NPF"
why: "Wave 21 NPF-stresscascade"
```

```yaml
id: kunskap-fact-bh-012
status: KEEP
content_class: FACT
title: "Barn — stödvägar Sverige"
content: "Ingångar: BVC, skolhälsovård, skolkurator, BUP via remiss, familjerådgivning, BRIS 116 111. Vid skyddsoro: socialtjänst skyddsbedömning. Neutral tidslinje — barnets behov, inte etiketter. Generisk vägledning, ej juridisk rådgivning."
category: barn_hcf
entryType: fakta
tags: [barn, stod, sverige]
source_tier: P2
citation_hint: "1177.se; Kampspar-BARN-REFERENS"
why: "Utökad stödkarta"
```

---

## Batch 2026-06-14 — Valv forensik & epistemik (vf-001–004)

```yaml
id: kunskap-fact-vf-001
status: KEEP
content_class: FACT
title: "Valv WORM vs journal och teori"
content: "reality_vault är forensisk append-only bevis. journal är reflektion och hypotes — inte bevis mot myndigheter. Teorier ('hon gör alltid…') hör i dagbok tills de bryts ned till observerbara händelser med datum i Valv."
category: valv_forensik
entryType: fakta
tags: [valv, worm, journal, teori]
source_tier: product_copy
citation_hint: "Verklighetsvalvet-SPEC; arkiv-minne"
why: "Teori→bevis-läckage prevention"
```

```yaml
id: kunskap-fact-vf-002
status: KEEP
content_class: FACT
title: "Mönster över tid vs enstaka händelse"
content: "En sms-rad kan trigga DCAP — signal, inte domslut. Mönster kräver upprepning med datum i WORM. Tolka aldrig en händelse som bevisat mönster utan tidslinje."
category: valv_forensik
entryType: fakta
tags: [monster, dcap, tidslinje]
source_tier: product_copy
citation_hint: "DCAP.ts; MONSTER_ARKIVARIEN"
why: "En incident ≠ mönster"
```

```yaml
id: kunskap-fact-vf-003
status: KEEP
content_class: FACT
title: "DCAP-taggar — beteende, inte diagnos"
content: "DCAP returnerar DARVO, GASLIGHTING, JADE_BAIT m.fl. som taggar på text — inte diagnos på person. WORM: 'sms innehöll gaslighting-formulering (datum)' — aldrig 'hon är narcissist'."
category: valv_forensik
entryType: fakta
tags: [dcap, taggar, worm]
source_tier: product_copy
citation_hint: "DCAP.ts; cn-043"
why: "Runtime DCAP → dossier"
```

```yaml
id: kunskap-fact-vf-004
status: KEEP
content_class: FACT
title: "Granska — epistemisk ödmjukhet"
content: "Confidence under 0,55 eller oklar silo → Granska, inte auto-WORM. Hellre extra klick än teori sparad som bevis. Valv-Chat säger 'bevis saknas' istället för att fylla med teori."
category: valv_forensik
entryType: fakta
tags: [granska, review, epistemik]
source_tier: product_copy
citation_hint: "inboxClassifier; cn-014"
why: "HITL + theory-gap"
```

---

**Mall för ny rad:**

```yaml
id: kunskap-fact-001
status: KEEP
content_class: FACT
topic: adhd_executive   # valfri taxonomi
text_sv: "…"
citation_hint: "Bok/källa eller intern spec §"
source_tier: psychoeducation_general
why: "referens för Kompis, ej terapi"
```

---

## REJECT (alltid)

| Innehåll | Varför |
|----------|--------|
| Terapi-dialog, frågekort till dig själv | **ROUTE_MABRA** → MåBra-bank |
| Ex/BIFF/gaslighting | → Hamn/Speglar |
| Barnobservation som bevis | → `children_logs` / Valv |
| Pseudovetenskap, diagnos utan tier | Hallucinationsrisk |
| “Sök i allt minne” | Bryter U1 |

---

## Batch 2026-06-14 — Våg 22 Ekonomisk kontroll (cn-021)

```yaml
id: kunskap-fact-cn-021
status: KEEP
content_class: FACT
title: "Ekonomisk kontroll i medföräldraskap"
content: "Ekonomisk kontroll beskriver när pengar, underhåll, räkningar eller skuldkrav används för att pressa, bestraffa eller styra kommunikation — t.ex. hot om att inte betala avtalad summa om du 'inte samarbetar', krav på kvitton utöver vad som avtalats, eller oväntade extra kostnader som betingelse. Skilj från vanlig logistik (~10 %): faktiska underhållsbelopp med datum och referens till avtal eller dom. Neutral respons: dokumentera belopp, datum och kanal i Valv; håll svar på logistik (BIFF). Livskompassen ger inte ekonomisk eller juridisk rådgivning."
category: covert_taktik
entryType: fakta
tags: [covert, ekonomisk_kontroll, medforaldraskap, hamn]
source_tier: psychoeducation_general
citation_hint: "Financial abuse in coercive control literature; high-conflict coparenting (översikt)"
why: "Våg 22 lucka domän-covert — Hamn wire + Kunskap referens, ej BIFF-coaching"
```

---

## Batch 2026-06-15 — Våg 24 Juridisk process / vårdnad (jur-005–007, ep-006, cn-022, bh-013)

**Kurator:** `specialist-kunskap-seed` · **Plan:** [`2026-06-15-content-wave-24-plan.md`](../../evaluations/2026-06-15-content-wave-24-plan.md) · **Silo:** Kunskap only · **Ingest:** **PASS** 2026-06-15 — [`2026-06-15-fas16-wave24-ingest.md`](../../evaluations/2026-06-15-fas16-wave24-ingest.md).

| bankId | content_class | source_tier | status |
|--------|---------------|-------------|--------|
| kunskap-fact-jur-005 | FACT | P2 | KEEP |
| kunskap-fact-jur-006 | FACT | P2 | KEEP |
| kunskap-fact-jur-007 | FACT | P2 | KEEP |
| kunskap-fact-ep-006 | FACT | P2 | KEEP |
| kunskap-fact-cn-022 | FACT | P1 | KEEP |
| kunskap-fact-bh-013 | FACT | P2 | KEEP |

```yaml
id: kunskap-fact-jur-005
bankId: kunskap-fact-jur-005
status: KEEP
content_class: FACT
title: "LVU — dokumentationskrav (neutral översikt)"
content: "I LVU-relaterade utredningar samlar socialtjänst och domstol information om barnets situation — inte om vuxnas personlighet. Neutral dokumentation fokuserar på observerbara omständigheter: datum och tid, vad som hände, vem som var närvarande, barnets reaktion och vilka stödinsatser som provats. Undvik diagnoser på föräldrar, värderande etiketter och slutsatser om avsikt. Föräldrar har i regel rätt att ta del av utredningsunderlag och yttra sig innan beslut. Att samla underlag är inte samma sak som att bevisa skuld — det är processens informationsbehov. Livskompassen ger inte juridisk rådgivning; vid LVU-frågor kontakta jurist eller berörd handläggare."
category: juridik_overview
entryType: fakta
tags: [lvu, dokumentation, socialtjanst, barnets_behov, neutral_logg]
source_tier: P2
citation_hint: "LVU (1990:52) §§ om utredning; Socialstyrelsen handläggning barn — ej rådgivning"
why: "Våg 24 — fördjupar jur-003 med dokumentationskrav; ROUTE_VALV vid konkret ärende"
```

```yaml
id: kunskap-fact-jur-006
bankId: kunskap-fact-jur-006
status: KEEP
content_class: FACT
title: "Vårdnad — bevisbar logistik vs känsloargument"
content: "I vårdnadsfrågor väger domstolar och utredare ofta tyngre på verifierbar logistik än på känslomässiga påståenden utan underlag. Logistik: schema som följts eller brutits, hämtning/lämning med datum, skolfrånvaro, läkarbesök, kommunikation om barnets behov. Känsloargument: generaliseringar ('hen bryr sig aldrig'), karaktärsdomar, krav på att du ska bevisa lojalitet genom JADE. Neutral dokumentation i Valv eller dossier beskriver händelser med datum — inte vem som 'är' narcissist eller offer. Detta är informationsstruktur, inte garanti för juridiskt utfall. Livskompassen ger inte råd om ditt ärende."
category: juridik_overview
entryType: fakta
tags: [vardnad, logistik, bevis, medforaldraskap, 10_90]
source_tier: P2
citation_hint: "Föräldrabalken 6 kap. (översikt); vårdnadsutredning praxis — ej rådgivning"
why: "Våg 24 — juridisk vårdnad; kompletterar jur-004/cn-009 utan etikett på motpart"
```

```yaml
id: kunskap-fact-jur-007
bankId: kunskap-fact-jur-007
status: KEEP
content_class: FACT
title: "Familjerätt — parallellt föräldraskap i praktiken"
content: "Parallellt föräldraskap innebär att föräldrar samordnar kring barnet med minimal direkt kontakt — ofta via skrift, medlare eller app. I svensk familjerätt regleras vårdnad, boende och umgänge via överenskommelse, familjerättslig medling eller tingsrättsbeslut. Vårdnadsutredning kan beställas vid tvist; utredaren samlar information från hem, skola och barn. Gemensam vårdnad innebär beslutskrav om större frågor — inte nödvändigtvis lika boende. Förutsägbarhet för barnet (schema, överlämning, skolinfo) väger ofta tyngre än föräldrarnas ömsesidiga sympati. Detta är process- och begreppsfakta — inte strategi mot en specifik motpart."
category: juridik_overview
entryType: fakta
tags: [familjeratt, parallellt_foraldraskap, medling, vardnadsutredning, tingsratt]
source_tier: P2
citation_hint: "Föräldrabalken 6 kap.; Domstolsverket familjerätt — översikt; ej rådgivning"
why: "Våg 24 — juridisk praktik; kompletterar jur-001 med process och forum"
```

```yaml
id: kunskap-fact-ep-006
bankId: kunskap-fact-ep-006
status: KEEP
content_class: FACT
title: "Myndighetskontakt — saklig ton och datum"
content: "Kontakt med socialtjänst, skola, BUP eller familjerätt bör vara saklig, datumerad och fokuserad på barnets behov — inte vuxenkonflikt. Ett kort underlag innehåller: datum, vad du begär eller rapporterar, observerbar händelse, vem som informerats. Undvik långa känslomässiga utläggningar, diagnoser på motparten och JADE (förklara/försvara). Be om skriftlig bekräftelse på mottagande vid viktiga ärenden. Myndigheter behandlar ofta parallella föräldraräkenskaper — håll ditt spår neutralt och kronologiskt. Livskompassen ger inte juridisk rådgivning; konkret sms-svar → Hamn, bevis → Valv."
category: epistemik_produkt
entryType: fakta
tags: [myndighet, dokumentation, datum, saklighet, barnets_behov]
source_tier: P2
citation_hint: "BBIC-inspirerad myndighetskommunikation; ep-003 observation/tolkning"
why: "Våg 24 — epistemik för myndighetskontakt; ej BIFF-coaching i Kunskap"
```

```yaml
id: kunskap-fact-cn-022
bankId: kunskap-fact-cn-022
status: KEEP
content_class: FACT
title: "Dokumentation utan JADE — metod, inte personangrepp"
content: "JADE (Justify, Argue, Defend, Explain) matar ofta eskalering i högkonflikt. I neutral dokumentation — Valv, dossier eller myndighetsunderlag — beskriv beteende och datum utan att förklara din moral, motbevisa anklagelser eller försvara din karaktär. Exempel på dokumentationsrad: '2026-03-12 kl. 17:40 — hämtning 45 min sen; barn väntade utan förvarning; sms skickat 17:15.' Undvik: 'hon är manipulativ och alltid sen'. Metoden minskar brus i WORM och dossier — den ersätter inte Hamn/BIFF på konkret sms eller juridisk rådgivning."
category: covert_taktik
entryType: fakta
tags: [jade, dokumentation, neutral_logg, valv, forensik]
source_tier: P1
citation_hint: "JADE/Grey Rock psychoeducation; cn-010/cn-013/vf-003 kompletterar"
why: "Våg 24 — metod-FACT; ROUTE_VALV/Hamn vid konkret meddelande"
```

```yaml
id: kunskap-fact-bh-013
bankId: kunskap-fact-bh-013
status: KEEP
content_class: FACT
title: "Barnets behov vid konflikt — observerbart beteende"
content: "Vid föräldrakonflikt är barnets behov bäst beskrivet som observerbart beteende — inte som bevis mot en vuxen. Tecken att notera neutralt: sömnstörning, magont, skolfrånvaro, regression, rädsla inför överlämning, lojalitetsstress (skuld efter rolig tid hos andra föräldern). Dokumentera datum, barnets egna ord i citat, och vilka rutiner som hjälpte eller saknades. Undvik att barnet ska vittna mot förälder eller höra vuxenprocess. Professionella ingångar: skolkurator, BUP, BRIS 116 111. Generisk vägledning — ej juridisk rådgivning."
category: barn_hcf
entryType: fakta
tags: [barn, konflikt, observerbart, bbic, lojalitet]
source_tier: P2
citation_hint: "BBIC barnets behov; bh-007/bh-011/bh-012 kompletterar"
why: "Våg 24 — barn HCF; Barnfokus-frågor förblir PLAY/REFLECTION i annan bank"
```

---

## Batch 2026-06-16 — Våg 25 Soc/skola + neutral myndighetsdialog (soc-001, skol-001, bup-001, bh-014, ep-007, jur-008)

**Kurator:** `specialist-kunskap-seed` · **Plan:** [`2026-06-16-content-wave-25-plan.md`](../../evaluations/2026-06-16-content-wave-25-plan.md) · **Silo:** Kunskap only · **Ingest:** efter export + seed.

| bankId | content_class | source_tier | status |
|--------|---------------|-------------|--------|
| kunskap-fact-soc-001 | FACT | P2 | KEEP |
| kunskap-fact-skol-001 | FACT | P2 | KEEP |
| kunskap-fact-bup-001 | FACT | P2 | KEEP |
| kunskap-fact-bh-014 | FACT | P2 | KEEP |
| kunskap-fact-ep-007 | FACT | P2 | KEEP |
| kunskap-fact-jur-008 | FACT | P2 | KEEP |

```yaml
id: kunskap-fact-soc-001
bankId: kunskap-fact-soc-001
status: KEEP
content_class: FACT
title: "Socialtjänst handläggning — utredningssteg och rättigheter"
content: "När socialtjänsten utreder barns situation följer handläggningen ofta: anmälan eller oro → kontakt med föräldrar → informationsinsamling (hem, skola, vård) → bedömning av barnets behov → frivilliga insatser eller vidare process enligt lag. Föräldrar har i regel rätt att ta del av underlag som rör dem, yttra sig och få information om processen — exakt omfattning beror på ärendetyp och sekretess. Handläggaren behöver observerbara fakta om barnet (datum, beteende, stöd som provats), inte karaktärsdomar om vuxna. Parallella föräldraräkenskaper är vanliga — håll ditt spår sakligt och kronologiskt. Livskompassen ger inte juridisk rådgivning; vid LVU eller skyddsfrågor kontakta jurist eller berörd handläggare."
category: myndighet_soc
entryType: fakta
tags: [socialtjanst, handlaggning, utredning, barnets_behov, rattigheter]
source_tier: P2
citation_hint: "Socialtjänstlagen (2001:453) översikt; LVU handläggning — ej rådgivning"
why: "Våg 25 — operativ soc-process; fördjupar jur-003/jur-005 utan BIFF-coaching"
```

```yaml
id: kunskap-fact-skol-001
bankId: kunskap-fact-skol-001
status: KEEP
content_class: FACT
title: "Skolrapport och kartläggning — observerbart utan vuxenkonflikt"
content: "Skola och elevhälsa dokumenterar ofta närvaro, prestation, social situation och stödinsatser i kartläggning, åtgärdsprogram eller utredning inför särskilt stöd. Neutral skolrapport fokuserar på observerbart: datum, lektion/miljö, vad barnet gjorde eller sa (citat), vilka anpassningar som provats och effekt. Undvik att skolan används som forum för vuxenkonflikt — föräldrar ska inte behöva försvara sin personlighet i skolunderlag. Vid separerade föräldrar kan båda ha rätt till viss information enligt skollagen och sekretessregler; skolan samordnar ofta med vårdnadshavare enligt beslut. Be om skriftlig sammanfattning efter möten. Livskompassen ger inte juridisk rådgivning; konkret sms-svar → Hamn, bevis → Valv."
category: skola_myndighet
entryType: fakta
tags: [skola, skolrapport, kartlaggning, observerbart, neutral_logg]
source_tier: P2
citation_hint: "Skollagen (2010:800) elevhälsa; Skolverket särskilt stöd — översikt; ej rådgivning"
why: "Våg 25 — skola som myndighetsforum; kompletterar kunskap-fact-008/jur-002"
```

```yaml
id: kunskap-fact-bup-001
bankId: kunskap-fact-bup-001
status: KEEP
content_class: FACT
title: "BUP — neutral remiss och föräldrasamtal"
content: "Barn- och ungdomspsykiatrin (BUP) tar emot remisser från skola, BVC, vårdcentral eller socialtjänst när barn behöver psykiatrisk utredning eller behandling. Remissen beskriver observerbara svårigheter — inte vuxenkonflikt som huvudfråga. I föräldrasamtal kan BUP behöva information från båda vårdnadshavare; håll fokus på barnets funktion, sömn, skolgång och stödbehov. Undvik att barnet ska förklara vuxenprocess eller välja sida. BUP dokumenterar kliniskt — det är inte bevis mot en förälder i vårdnadstvist. Vid akut psykisk kris: 1177 eller 112. Generisk vägledning — ej juridisk rådgivning."
category: barn_hcf
entryType: fakta
tags: [bup, remiss, foraldrasamtal, barn, neutral]
source_tier: P2
citation_hint: "1177.se BUP; Socialstyrelsen barnpsykiatri — översikt"
why: "Våg 25 — BUP som neutral ingång; kompletterar bh-012 utan PA-etiketter"
```

```yaml
id: kunskap-fact-bh-014
bankId: kunskap-fact-bh-014
status: KEEP
content_class: FACT
title: "Barns berättelse vs vuxen tolkning"
content: "Barn uttrycker sig annorlunda än vuxna — kortare meningar, metaforer, tystnad eller kroppsspråk. En vuxen tolkning ('hen menar att…', 'det bevisar att…') är inte samma sak som barnets egna ord. I myndighets- och vårdkontakter ska barnets utsaga dokumenteras i citat där möjligt; vuxen tolkning märks som hypotes, inte fakta. I högkonflikt kan barn anpassa berättelse efter lojalitetsstress — det är beteende att notera neutralt, inte bevis mot en förälder. Undvik att barnet ska vittna, medla eller bekräfta vuxenhypoteser. Professionella bedömer barnets behov — inte vem som 'har rätt' i vuxenstrid."
category: barn_hcf
entryType: fakta
tags: [barn, berattelse, tolkning, lojalitet, observerbart]
source_tier: P2
citation_hint: "BBIC barnets röst; barnintervjuer i utredning — översikt"
why: "Våg 25 — epistemik barn; fördjupar ep-003/bh-013 utan etikett på motpart"
```

```yaml
id: kunskap-fact-ep-007
bankId: kunskap-fact-ep-007
status: KEEP
content_class: FACT
title: "Myndighetsunderlag — citat och tolkning i separata lager"
content: "Ett robust myndighetsunderlag skiljer tre lager: (1) citat — barnets eller vuxens exakta ord med datum; (2) observation — vad en neutral part såg eller hörde; (3) tolkning — din hypotes, tydligt märkt. Skicka lager 1–2 till skola, soc eller BUP; spara lager 3 i journal eller Valv-hypotes — blanda inte dem i samma rad. Exempel observation: '2026-04-03 skolkurator noterade att barnet grät efter telefonsamtal.' Exempel tolkning (separat): 'Jag tror samtalet gällde överlämning.' Kunskap-RAG citerar FACT; WORM citerar docId — utan citation: inget sanning-påstående."
category: epistemik_produkt
entryType: fakta
tags: [myndighet, citat, tolkning, underlag, epistemik]
source_tier: P2
citation_hint: "ep-003 observation/tolkning; vf-001 teori vs bevis"
why: "Våg 25 — operativ epistemik för soc/skola; ej BIFF-coaching"
```

```yaml
id: kunskap-fact-jur-008
bankId: kunskap-fact-jur-008
status: KEEP
content_class: FACT
title: "Sekretess och informationsdelning — soc och skola"
content: "Skola och socialtjänst omfattas av offentlighets- och sekretessregler. Viss information delas mellan myndigheter när barnets bästa kräver samverkan; annan information kräver samtycke eller lagstöd. Föräldrar har ofta rätt till information om sitt barn enligt skollagen och socialtjänstlagen — omfattning beror på vårdnad, ärendetyp och om uppgiften kan skada barnet eller utredningen. Du kan begära att få ta del av underlag som rör dig eller ditt barn enligt gällande regler. Dokumentera datum för begäran och svar. Livskompassen ger inte juridisk rådgivning; vid vägran eller oklarhet kontakta jurist eller myndighetens registratur."
category: juridik_overview
entryType: fakta
tags: [sekretess, skola, socialtjanst, information, samverkan]
source_tier: P2
citation_hint: "Offentlighets- och sekretesslagen (2009:400) översikt; skollagen vårdnadshavare — ej rådgivning"
why: "Våg 25 — juridisk informationsram soc/skola; kompletterar jur-005/ep-006"
```

---

## Batch 2026-06-16 — Våg 26 Medföräldraskap logistik (cop-001–005, ep-008)

**Kurator:** `specialist-kunskap-seed` · **Plan:** [`2026-06-16-content-wave-26-plan.md`](../../evaluations/2026-06-16-content-wave-26-plan.md) · **Silo:** Kunskap only · **Ingest:** efter export + seed.

| bankId | content_class | source_tier | status |
|--------|---------------|-------------|--------|
| kunskap-fact-cop-001 | FACT | P2 | KEEP |
| kunskap-fact-cop-002 | FACT | P2 | KEEP |
| kunskap-fact-cop-003 | FACT | P2 | KEEP |
| kunskap-fact-cop-004 | FACT | P2 | KEEP |
| kunskap-fact-cop-005 | FACT | P1 | KEEP |
| kunskap-fact-ep-008 | FACT | P2 | KEEP |

```yaml
id: kunskap-fact-cop-001
bankId: kunskap-fact-cop-001
status: KEEP
content_class: FACT
title: "Hämtning och lämning — neutral bekräftelse utan JADE"
content: "Logistik kring hämtning och lämning ska vara kort, datumerad och utan försvar eller moral. En neutral bekräftelse innehåller: tid, plats, barnets namn och att du bekräftar eller meddelar avvikelse — inget mer. Exempel: 'Bekräftar hämtning tis 16:00 vid skolan enligt schema.' Undvik JADE (förklara, argumentera, försvara, rättfärdiga) när motparten försöker dra in känsloladdade sidospår. Om tid ändras: föreslå ny tid skriftligt och vänta på svar innan du agerar. Sen hämtning eller utebliven hämtning dokumenteras i Valv med datum och tid — inte som karaktärsdom. Detta är metod-FACT; konkret sms-svar → Hamn, bevis → Valv."
category: medforaldraskap_logistik
entryType: fakta
tags: [hamtning, lamning, jade, neutral_bekraftelse, logistik]
source_tier: P2
citation_hint: "cn-022 JADE-dokumentation; kunskap-fact-010 juridik 10%; ej BIFF-coaching"
why: "Våg 26 — operativ hämtning/lämning; kompletterar 024/015 utan etikett på motpart"
```

```yaml
id: kunskap-fact-cop-002
bankId: kunskap-fact-cop-002
status: KEEP
content_class: FACT
title: "Kalender och schema — skriftlig logistik vs muntliga löften"
content: "I parallellt föräldraskap väger skriftliga överenskommelser tyngre än muntliga löften i efterhand. Delat förälderschema (kalender, app, mejl) minskar 'jag sa / du sa'-tvister om hämtning, lov, aktiviteter och skollov. Neutral praxis: ändringar föreslås skriftligt med datum; bekräftelse skriftligt innan barn informeras; vid oenighet gäller senast gemensamt dokumenterade schema eller dom tills nytt beslut. Muntliga löften utan bekräftelse är svåra att verifiera — dokumentera dem som observation ('2026-05-10 telefonsamtal — motpart sa hämtning 15:00') om de påverkar barnet. Livskompassen ger inte juridisk rådgivning; tvist om schema → familjerätt eller medling."
category: medforaldraskap_logistik
entryType: fakta
tags: [kalender, schema, skriftlig, munlig, logistik]
source_tier: P2
citation_hint: "kunskap-fact-024 delat schema; Föräldrabalken 6 kap. — översikt; ej rådgivning"
why: "Våg 26 — skriftlig logistik; fördjupar 024 med verifierbarhet utan weaponization"
```

```yaml
id: kunskap-fact-cop-003
bankId: kunskap-fact-cop-003
status: KEEP
content_class: FACT
title: "Överlämning barn — kort rutin utan konflikt"
content: "En barnsäker överlämning håller vuxenkonflikt borta från barnets synfält. Kort rutin: mötesplats enligt schema; hälsa kort till andra föräldern utan debatt; överlämna väska, medicin och skolinfo; barn går direkt med mottagande förälder. Undvik att barnet ska framföra budskap, välja sida eller höra vuxenprocess. Vid spänning: håll samtal till minimum ('Hej, här är ryggsäcken och febernedsättning'), avsluta och gå. Om andra föräldern eskalerar — avbryt inte barnets övergång; dokumentera händelsen efteråt med datum och observerbart beteende i Valv. Rutinen är metod — inte garanti att motparten samarbetar. Generisk vägledning — ej juridisk rådgivning."
category: medforaldraskap_logistik
entryType: fakta
tags: [overlamning, barn, rutin, konflikt, logistik]
source_tier: P2
citation_hint: "kunskap-fact-015 förutsägbarhet; bh-013 barn vid konflikt — översikt"
why: "Våg 26 — operativ överlämning; ROUTE_Hamn vid konkret eskalering i stunden"
```

```yaml
id: kunskap-fact-cop-004
bankId: kunskap-fact-cop-004
status: KEEP
content_class: FACT
title: "Akut avvikelse — dokumentera datum och tid, inte tolkning"
content: "När schema bryts akut — sen hämtning, utebliven hämtning, oväntad person, barn kvar utan förvarning — dokumentera först det observerbara: datum, klockslag, plats, vem var närvarande, barnets tillstånd (kort citat om barnet uttryckte sig). Tolkning ('hen gjorde det med flit', 'hen ville straffa mig') hör hemma i separat hypotesrad eller journal — inte i samma rad som fakta. Skicka kort neutral logistik-sms om barnets omedelbara behov ('Barn väntar vid skolan sedan 16:30 — bekräfta hämtning'). Spara sms, skärmdump eller logg i Valv med server-tidsstämpel vid behov. Akut fara för barn: 112. Detta är epistemik och dokumentationsmetod — inte coaching om hur du ska känna."
category: medforaldraskap_logistik
entryType: fakta
tags: [avvikelse, dokumentation, datum, observerbart, valv]
source_tier: P2
citation_hint: "ep-003 observation/tolkning; cn-022 utan JADE; cop-001 hämtning"
why: "Våg 26 — akut logistikavvikelse; kompletterar cop-001 med WORM-struktur"
```

```yaml
id: kunskap-fact-cop-005
bankId: kunskap-fact-cop-005
status: KEEP
content_class: FACT
title: "Grey Rock vid logistikpåminnelser — metod, inte person"
content: "Grey Rock vid ren logistik innebär korta, sakliga svar på påminnelser om schema, hämtning eller praktiska detaljer — utan att matas in i personangrepp eller skuldbeläggning. Metod: svara på det praktiska ('Bekräftar fre 08:00'), ignorera sidospår ('Du är alltid…'), eskalera inte med motattack. Påminnelser som upprepas trots bekräftelse kan dokumenteras neutralt (datum, innehåll, att du redan bekräftat) — inte som bevis för diagnos. Grey Rock ersätter inte skyldighet att informera om barnets hälsa eller akuta behov; det avser kommunikationsform, inte tystnad om viktiga barnfrågor. Faktadefinition — konkret svar på sms → Hamn, inte Kunskap-coach."
category: kommunikation_metod
entryType: fakta
tags: [grey_rock, logistik, paminnelse, medforaldraskap, metod]
source_tier: P1
citation_hint: "kunskap-fact-006 Grey Rock; cn-009 parallel parenting — kompletterar"
why: "Våg 26 — metod för 10% logistik; skiljer från BIFF/Hamn på konkret meddelande"
```

```yaml
id: kunskap-fact-ep-008
bankId: kunskap-fact-ep-008
status: KEEP
content_class: FACT
title: "Bevisbar logistik vs känsloargument — epistemik i medföräldraskap"
content: "I medföräldraskap kan samma händelse beskrivas som verifierbar logistik eller som känsloargument utan underlag. Logistik (epistemiskt starkare i tvist och dossier): '2026-04-12 hämtning 17:20, 35 min sen enligt sms 16:45.' Känsloargument (svagare utan citat): 'hen respekterar aldrig mig', 'barnet lider alltid hos hen'. Kunskap-RAG skiljer metod-FACT från personlig hypotes; Valv WORM lagrar lager 1–2 (citat, observation) separat från lager 3 (tolkning). jur-006 beskriver juridisk tyngd; denna post beskriver informationsklassning i vardagslogistik. Utan citation eller docId: inget sanning-påstående i prod. Livskompassen ger inte juridisk rådgivning."
category: epistemik_produkt
entryType: fakta
tags: [epistemik, logistik, kansloargument, bevis, medforaldraskap]
source_tier: P2
citation_hint: "jur-006 vårdnad logistik; ep-007 citat/tolkning; vf-001 teori vs bevis"
why: "Våg 26 — epistemik för 10% logistik; kompletterar jur-006 utan overlap i juridik_overview"
```

---

## Våg 27 — Deep Research 2026-06-16 (KEEP — ingest 2026-06-16)

**Källa:** [`research-cursor-2026-06-16-master-syntes.md`](../../external-ai/imports/research-cursor-2026-06-16-master-syntes.md) · **Dirigent:** `specialist-innehall-dirigent` · **Gate:** Pontus KEEP 2026-06-16

```yaml
id: kunskap-fact-gad-036
bankId: kunskap-fact-gad-036
status: KEEP
content_class: FACT
title: "Oro-tid — schemalagd oro (CBT)"
content: "Worry time är en etablerad CBT-metod: 10–15 minuter dagligen för hypotetiska oros tankar. Under dagen skjuter du upp oro till den tiden i stället för att följa varje tanke. Det är självhjälpsmetod — inte ersättning för behandling vid svår ångest."
category: gad_angest
entryType: fakta
tags: [gad, worry_time, cbt, sjalvhjalp]
source_tier: P1
citation_hint: "NHS Every Mind Matters; RNOH NHS Postponing worries (timing)"
why: "SA-1 cursor-sa1-001 — GAP i gad_angest; timing-nuans cursor-sa1-002 i gad-039"
```

```yaml
id: kunskap-fact-adhd-029
bankId: kunskap-fact-adhd-029
status: KEEP
content_class: FACT
title: "Body doubling — externaliserad fokus"
content: "Body doubling innebär att arbeta bredvid en annan person (fysiskt eller virtuellt) som också arbetar — för att underlätta start och fokus. Beskrivs som externaliserad exekutiv funktion, inte samarbete på samma uppgift. Anekdot och viss forskning; inte medicinsk behandling."
category: adhd_vardag
entryType: fakta
tags: [adhd, body_doubling, exekutiv, fokus]
source_tier: P2
citation_hint: "Cleveland Clinic; ADDA; ACM 2024 body doubling study (evidens i adhd-030)"
why: "SA-1 cursor-sa1-008 — body doubling; evidens-disclaimer separat adhd-030"
```

```yaml
id: kunskap-fact-eko-001
bankId: kunskap-fact-eko-001
status: KEEP
content_class: FACT
title: "24-timmarsregel vid impulsköp"
content: "Vid impulsivitet kan en paus på 24 timmar före icke-nödvändiga köp ge begäret tid att avta utan att kräva långvarig viljestyrka. Särskilt relevant vid ADHD och stress — kompletterar autogiro och fakturaflöde, ersätter inte skuldrådgivning."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, impuls, adhd, paus]
source_tier: P2
citation_hint: "Unburden ADHD budget; ADD Resource Center"
why: "SA-1/3 research — bro ekonomi + neuro"
```

```yaml
id: kunskap-fact-eko-002
bankId: kunskap-fact-eko-002
status: KEEP
content_class: FACT
title: "Tre hinkar — förenklad budget"
content: "En förenklad budget med tre hinkar — essentials (boende, mat, fakturor), discretionary (nöje, spontanköp), spar/skuld — kräver mindre kognitiv uppföljning än många detaljkategorier och passar låg kapacitet."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, budget, adhd, tre_hinkar]
source_tier: P2
citation_hint: "ADD Resource Center ADHD-friendly budget"
why: "SA-3 research-sa3-001"
```

```yaml
id: kunskap-fact-eko-003
bankId: kunskap-fact-eko-003
status: KEEP
content_class: FACT
title: "Digitala kuvert — max 4–5 kategorier"
content: "Digitala kuvert med 4–5 breda kategorier ger visuell knapphet utan kontanthantering. Färre kategorier minskar beslutströtthet vid varje köp — viktigare än perfekt kategorisering."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, kuvert, digital, adhd]
source_tier: P2
citation_hint: "Digital Dashboard Hub ADHD budget"
why: "SA-3 research-sa3-002"
```

```yaml
id: kunskap-fact-eko-004
bankId: kunskap-fact-eko-004
status: KEEP
content_class: FACT
title: "Veckobudget — ett synligt spend number"
content: "Veckobudget med ett synligt 'spend number' är lättare att hålla i arbetsminnet än månadsbudget för personer med tidsblindhet. Veckovisa korta check-ins presterar bättre än sällsynta långa budgetsessioner."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, vecka, tidsblindhet, checkin]
source_tier: P2
citation_hint: "Unburden; Psychiatry CY ADHD finances"
why: "SA-3 research-sa3-003/005 — evolution Nivå 1"
```

```yaml
id: kunskap-fact-cop-006
bankId: kunskap-fact-cop-006
status: KEEP
content_class: FACT
title: "Parallel parenting — skriftligt only vid eskalering"
content: "Parallel parenting innebär separata hushållsspår med minimal direkt kontakt mellan föräldrar; målet är förutsägbarhet och att barn hålls utanför vuxeninteraktion. Vid högkonflikt: logistik och känsliga beslut i skrift när muntlig kontakt eskalerar — kopplar till cop-007 och Hamn written_only_escalation. Metod, inte juridisk skyldighet."
category: medforaldraskap
entryType: fakta
tags: [parallel_parenting, skriftlig, hcf, afcc, barn, hamn]
source_tier: P1
citation_hint: "AFCC Parent Coordination; Bris skilsmässa; Socialstyrelsen separation små barn"
why: "SA-2 research-sa2-001 + våg 28 STRENGTHEN skrift-default"
```

```yaml
id: kunskap-fact-cop-007
bankId: kunskap-fact-cop-007
status: KEEP
content_class: FACT
title: "Skriftlig kommunikation som default vid HCF"
content: "I parallel parenting begränsas kommunikation ofta till skrift (mejl, meddelandeapp) för att minska eskalering — särskilt när muntlig kontakt triggar konflikt. Metod, inte juridisk skyldighet."
category: medforaldraskap_logistik
entryType: fakta
tags: [skriftlig, hamn, parallel, eskalering]
source_tier: P2
citation_hint: "Bris skilsmässa P1; Socialstyrelsen separation små barn; cop-002"
why: "SA-2 research-cursor-sa2-004/012 — skrift-default P1 uppgraderad"
```

```yaml
id: kunskap-fact-jur-009
bankId: kunskap-fact-jur-009
status: KEEP
content_class: FACT
title: "Parenting coordination — översikt"
content: "Parenting coordination är en barnfokuserad process där utsedd professionell hjälper högk konflikt-föräldrar implementera vårdnadsplan och lösa tvister utanför domstol — med screening för våld och maktklyftor. Svensk familjerätt har liknande stöd; detta är översikt, inte rådgivning."
category: juridik_logistik
entryType: fakta
tags: [parenting_coordinator, familjeratt, hcf]
source_tier: P2
citation_hint: "AFCC Guidelines 2019; AFCC PC neutral beslutsfattare (research-cursor-sa2-020)"
why: "SA-2 research-cursor-sa2-003/020 — PC vs svensk samarbetssamtal"
```

```yaml
id: kunskap-fact-bh-015
bankId: kunskap-fact-bh-015
status: KEEP
content_class: FACT
title: "Lojalitetskonflikt 10–14 — barns perspektiv"
content: "Barn 10–14 i lojalitetskonflikt kan uppleva stress, skuld och kroppsliga symptom; de behöver inte välja sida för att vara trygga. Vuxna ska ta ansvar för konflikten — barnet ska inte bära budskap mellan föräldrar."
category: barn_hcf
entryType: fakta
tags: [lojalitet, pre_teen, bris, stress]
source_tier: P1
citation_hint: "Bris för vuxna; BVPRO lojalitetskonflikt 10–14"
why: "SA-4 research-sa4-003 — evolution pre_teen"
```

```yaml
id: kunskap-fact-bh-016
bankId: kunskap-fact-bh-016
status: KEEP
content_class: FACT
title: "Barn som budbärare — undvik"
content: "Låt inte barn framföra budskap eller information mellan föräldrar; budbärarrollen skapar lojalitetsstress när barn vill vara lojala mot båda."
category: barn_hcf
entryType: fakta
tags: [budbarare, lojalitet, barn, medforaldraskap]
source_tier: P1
citation_hint: "Bris skilsmässa P1; cursor-sa4-002"
why: "SA-4 cursor-sa4-002 — budbärare BRIS direkt"
```

```yaml
id: kunskap-fact-gad-037
bankId: kunskap-fact-gad-037
status: KEEP
content_class: FACT
title: "Worry tree — praktisk vs hypotetisk oro"
content: "Worry tree skiljer praktisk oro (du kan agera: vad, hur, när) från hypotetisk oro (utan kontroll). Vid hypotetisk oro — skjut upp till oro-tid eller släpp och återfokusera på nuet."
category: gad_angest
entryType: fakta
tags: [gad, worry_tree, cbt, beslut]
source_tier: P1
citation_hint: "NHS Every Mind Matters — Tackling your worries"
why: "SA-1 cursor-sa1-003 — GAP utöver gad-036 worry time"
```

```yaml
id: kunskap-fact-gad-038
bankId: kunskap-fact-gad-038
status: KEEP
content_class: FACT
title: "Fysiologisk suck — vagus utan prestation"
content: "Fysiologisk suck: djup inandning genom näsan, ett kort extra andetag, sedan lång långsam utandning — kan sänka arousal diskret utan prestationskrav. Självhjälp, inte medicinsk behandling."
category: kanslor_vagus
entryType: fakta
tags: [vagus, andning, suck, hyperarousal]
source_tier: P1
citation_hint: "SWLSTG NHS — Physiological sigh 2024"
why: "SA-1 cursor-sa1-006 — kompletterar kunskap-fact-037 utan ny metodnamn i UI"
```

```yaml
id: kunskap-fact-gad-039
bankId: kunskap-fact-gad-039
status: KEEP
content_class: FACT
title: "Oro-tid timing — undvik läggdags"
content: "Schemalagd oro-tid bör undvikas strax före sänggående; välj en fast tid på dagen och håll sessionen till cirka 15–20 minuter med avslutande aktivitet efteråt."
category: gad_angest
entryType: fakta
tags: [gad, worry_time, somn, timing]
source_tier: P1
citation_hint: "RNOH NHS — Postponing worries"
why: "SA-1 cursor-sa1-002 — timing-nuans saknas i gad-036"
```

```yaml
id: kunskap-fact-adhd-030
bankId: kunskap-fact-adhd-030
status: KEEP
content_class: FACT
title: "Body doubling — evidensprofil"
content: "Body doubling har stark community-validering och tidig akademisk kartläggning, men saknar stora RCT — klassas som lågrisk komplement, inte ersättning för evidensbaserad ADHD-behandling."
category: adhd_vardag
entryType: fakta
tags: [adhd, body_doubling, evidens, disclaimer]
source_tier: P2
citation_hint: "ACM 2024 — Body doubling with neurodivergent participants"
why: "SA-1 cursor-sa1-011 — anti-hallucination P2 för adhd-029 ingest"
```

```yaml
id: kunskap-fact-eko-005
bankId: kunskap-fact-eko-005
status: KEEP
content_class: FACT
title: "Impulshink — månatligt tak"
content: "Dedikerad impulshink med tydligt månatligt tak — när den är slut pausar du utan total förbudskänsla. Hållbarhet över perfektion; ingen streak eller poäng."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, impuls, buffer, adhd]
source_tier: P2
citation_hint: "ADD Resource Center — Impulse Fund"
why: "SA-3 research-cursor-sa3-018 — impulshink utöver 24h-regeln"
```

```yaml
id: kunskap-fact-eko-006
bankId: kunskap-fact-eko-006
status: KEEP
content_class: FACT
title: "Två-konto-system — safe-to-spend"
content: "Två-konto-systemet — ett konto enbart för automatiserade räkningar, ett för daglig spending — ersätter mental matte: om saldot finns i spending-kontot är köpet tillåtet."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, konto, adhd, safe_to_spend]
source_tier: P2
citation_hint: "Waypoint — Budgeting with ADHD"
why: "SA-3 research-cursor-sa3-002 — kompletterar kunskap-fact-009 autogiro"
```

```yaml
id: kunskap-fact-eko-007
bankId: kunskap-fact-eko-007
status: KEEP
content_class: FACT
title: "Sparkonto annan bank — friktionsbarriär"
content: "Sparkonto hos annan bank skapar 2–3 dagars överföringsfriktion — tillräckligt för att impulsiva uttag ska avta utan att spärra nödfall."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, spar, friktion, impuls]
source_tier: P2
citation_hint: "ADD Resource Center — No-Budget System"
why: "SA-3 research-cursor-sa3-004 — friktionsdesign, ej bankintegration"
```

```yaml
id: kunskap-fact-eko-008
bankId: kunskap-fact-eko-008
status: KEEP
content_class: FACT
title: "Vecko-överskridning — rollover utan skuld"
content: "Vid veckoöverskridning dras överskottet från nästa veckas spend number — utan skuldspiral eller 'börja om nästa månad'."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, vecka, rollover, anti_shame]
source_tier: P2
citation_hint: "Unburden — ADHD-Friendly Budgeting"
why: "SA-3 research-cursor-sa3-003 — RSD-säker ton; stärker eko-004"
```

```yaml
id: kunskap-fact-bh-017
bankId: kunskap-fact-bh-017
status: KEEP
content_class: FACT
title: "Skol- och fritidsaktiviteter — dela upp"
content: "Många barn upplever stress när båda föräldrar är närvarande vid skol- eller fritidsaktiviteter; föräldrar kan dela upp dessa tillfällen så barnet slipper bära båda samtidigt."
category: barn_hcf
entryType: fakta
tags: [barn, skola, fritid, hcf, logistik]
source_tier: P1
citation_hint: "Bris — Så pratar du skilsmässa med ditt barn"
why: "SA-4 cursor-sa4-009 — praktisk HCF-logistik utan barn i mittpositionen"
```

```yaml
id: kunskap-fact-bh-018
bankId: kunskap-fact-bh-018
status: KEEP
content_class: FACT
title: "Barn ska inte välja sida"
content: "Barn ska aldrig behöva ta ansvar för vuxnas beslut om vårdnad, boende eller umgänge, eller känna sig tvingade att välja sida."
category: barn_hcf
entryType: fakta
tags: [barn, lojalitet, barnombudet, pre_teen]
source_tier: P1
citation_hint: "Barnombudet — Om det blir konflikt"
why: "SA-4 cursor-sa4-010 — P1 myndighetskälla; kompletterar bh-015"
```

```yaml
id: kunskap-fact-bh-019
bankId: kunskap-fact-bh-019
status: KEEP
content_class: FACT
title: "Tidigt föräldrastöd vid separation"
content: "Svåra och långvariga konflikter mellan separerade föräldrar påverkar barnens hälsa negativt på kort och lång sikt; tidigt föräldrastöd förebygger eskalering."
category: barn_hcf
entryType: fakta
tags: [barn, separation, stod, forebyggande]
source_tier: P1
citation_hint: "Myndigheten för familjerätt — separation"
why: "SA-4 cursor-sa4-011 — stärker bh-013 utan alienation-retorik"
```

```yaml
id: kunskap-fact-bh-020
bankId: kunskap-fact-bh-020
status: KEEP
content_class: FACT
title: "Parrelation åt sidan — föräldraskap kvar"
content: "Vid separation behöver föräldrar lägga parrelationen åt sidan och fokusera på föräldraskapet; barnets utveckling, behov och önskemål ska vara i centrum."
category: barn_hcf
entryType: fakta
tags: [barn, separation, foraldraskap, fokus]
source_tier: P1
citation_hint: "mfof — parrelation vs föräldraskap"
why: "SA-4 cursor-sa4-013 — Familjen-lugnande copy utan motpartsanalys"
```

---


---

## Våg 28 — Deep Research 2026-06-18 (KEEP — ingest 2026-06-18)

**Källa:** [`research-2026-06-18-content-master.md`](../../external-ai/imports/research-2026-06-18-content-master.md) · **Dirigent:** `specialist-innehall-dirigent` · **Gate:** Pontus KEEP 2026-06-18

```yaml
id: kunskap-fact-eko-009
bankId: kunskap-fact-eko-009
status: KEEP
content_class: FACT
title: "Existensminimum — hyra, el, mat först"
content: "Vid låg kapacitet eller ekonomisk stress: säkerställ först hyra, el och mat innan diskretionär konsumtion. Existensminimum är inte samma sak som lyxkonsumtion — vid evolution Nivå 1 räcker synlig veckobudget (eko-004) utan månadsdjupbudget."
category: ekonomi_vardag
entryType: fakta
tags: [ekonomi, existensminimum, hyra, mat, niva_1]
source_tier: P1
citation_hint: "Konsumentverket — budget och skuldrådgivning; 1177 — ekonomiskt stöd vid kris"
why: "Våg 28 post 1 — SA-3; ny ID eko-009 (eko-005 = impulshink KEEP v27)"
```

**Post 2:** `kunskap-fact-cop-006` STRENGTHEN — innehåll mergat i befintlig KEEP-rad ovan.

```yaml
id: kunskap-fact-cn-048
bankId: kunskap-fact-cn-048
status: KEEP
content_class: FACT
title: "Hoovering via barn eller medlare"
content: "Hoovering kan ske indirekt: barn som budbärare, föräldramöten utan agenda, eller 'vi måste prata för barnens skull' efter gräns. Håll logistik kort (BIFF/Grey Rock); dokumentera datum och kanal i Valv om du sparar bevis — här är begreppet referens, inte din specifika händelse."
category: covert_taktik
entryType: fakta
tags: [covert, hoovering, barn, medlare, hamn]
source_tier: psychoeducation_general
citation_hint: "HCR intermittent contact; kompletterar cn-016 Hoovering"
why: "Våg 28 post 3 — STRENGTHEN cn-016; indirekt återkontakt"
```


## Koppling till befintlig seed

| Manifest | Fil |
|----------|-----|
| Profil | [`Kampspar-PROFIL-SEED.md`](Kampspar-PROFIL-SEED.md) |
| Barn-referens | [`Kampspar-BARN-REFERENS-SEED.md`](Kampspar-BARN-REFERENS-SEED.md) |

Nya KEEP-rader här kan senare exporteras till JSON-manifest — **deterministisk** ingest, ingen LLM i prod som skapar FACT.

**Smoke:** `npm run smoke:kunskap`

## Våg 31 — myndighet + HCF + neuro (2026-06-18, PMIR godkänd)

```yaml
id: kunskap-fact-jur-010
status: KEEP
content_class: FACT
topic: lvu_process
title: Föräldrarätt i LVU-utredning — information och yttrande
content: "I LVU-utredning har vårdnadshavare rätt till information om utredningen och möjlighet att yttra sig. Partsgenomgång innebär att du får ta del av underlag som ligger till grund för bedömning — omfattning regleras av lag och sekretess. Dokumentera datum för möten, kallelser och vad som sagts. Livskompassen ger inte juridisk rådgivning."
category: juridik_overview
citation_hint: "Socialstyrelsen LVU-handläggning (översikt); jur-003, jur-005"
source_tier: P2
```

```yaml
id: kunskap-fact-jur-011
status: KEEP
content_class: FACT
topic: forvaltningsratt
title: Förvaltningsrätt och domstol — neutral stegöversikt
content: "Tvister om vårdnad eller umgänge kan gå via familjerätt och domstol. Typiska steg: ansökan, svaromål, bevisning, förhandling, dom. Håll kommunikation saklig; spara datum och handlingar. Detta är processöversikt, inte strategiråd. Livskompassen ger inte juridisk rådgivning."
category: juridik_overview
citation_hint: "Domstolsverket familjerätt (översikt); jur-006"
source_tier: P2
```

```yaml
id: kunskap-fact-jur-012
status: KEEP
content_class: FACT
topic: orosanmalan
title: Orosanmälan — vad soc utreder
content: "En orosanmälan innebär att socialtjänsten bedömer om barnet far illa och om insats behövs. Utredning fokuserar på barnets situation — inte på att bevisa förälders skuld. Du kan begära information om ärendet enligt gällande regler. Dokumentera datum och kanal. Livskompassen ger inte juridisk rådgivning."
category: juridik_overview
citation_hint: "Socialstyrelsen orosanmälan; jur-004"
source_tier: P2
```

```yaml
id: kunskap-fact-soc-002
status: KEEP
content_class: FACT
topic: samverkansmote
title: Samverkansmöte soc och skola — förberedelse
content: "Vid samverkansmöte: förbered agenda med datum och observerbara händelser. Skilj citat från tolkning. Ta med en skriftlig punktlista — ett steg i taget. Soc och skola har olika roller; håll tonen affärsmässig. Livskompassen ger inte juridisk rådgivning."
category: myndighet_soc
citation_hint: "BBIC samverkan; soc-001; ep-007"
source_tier: P2
```

```yaml
id: kunskap-fact-bh-021
status: KEEP
content_class: FACT
topic: barn_myndighet
title: Barn i myndighetsutredning — intervju och lojalitet
content: "Barn kan känna lojalitetskonflikt när vuxna är i konflikt. Professionella intervjuar barn separat; förälder ska inte pressa barn att välja sida. Dokumentera barnets egna ord med citat-prefix — aldrig diagnos på motpart."
category: barn_hcf
citation_hint: "bh-001, bh-014; Barnombudet"
source_tier: P1
```

```yaml
id: kunskap-fact-gad-040
status: KEEP
content_class: FACT
topic: panik_gad
title: Panikattack vs GAD — skillnad i varaktighet
content: "Panikattacker är intensiva men ofta kortvariga (minuter). Generaliserad ångest är mer uthållig oro över flera områden. Båda kan samexistera. Kroppen reagerar liknande — andning och markering i tid hjälper att särskilja mönster. Detta är psykoedukation, inte diagnos."
category: gad_angest
citation_hint: "1177 ångest; NICE GAD (översikt)"
source_tier: P1
```

```yaml
id: kunskap-fact-pu-001
status: KEEP
content_class: FACT
topic: act_varderingar
title: ACT värderingar — kompassfråga
content: "I ACT handlar värderingar om riktning i livet, inte prestation. En kompassfråga: vad vill jag stå för i den här situationen — ett litet steg räcker. Värderingar är inte samma sak som mål med deadline."
category: personlig_utveckling
citation_hint: "Hayes ACT (översikt); kunskap-fact-038"
source_tier: P1
```

```yaml
id: kunskap-fact-pu-002
status: KEEP
content_class: FACT
topic: kognitiv_defusion
title: Kognitiv defusion — tanken är inte fakta
content: "Defusion innebär att se tanken som en tanke: jag har tanken att jag misslyckas — inte jag är ett misslyckande. Ett mikrosteg är att säga meningen högt och lägga till: jag märker att jag har den tanken."
category: personlig_utveckling
citation_hint: "ACT defusion (översikt); kunskap-fact-039"
source_tier: P1
```

```yaml
id: kunskap-fact-pu-003
status: KEEP
content_class: FACT
topic: allostatic_load
title: Allostatisk belastning — långvarig stress och utmattning
content: "Allostatisk belastning beskriver hur kroppen anpassar sig under långvarig stress. Trötthet, hypervigilans och kognitiv dimma kan vara fysiologiska svar — inte karaktärsfel. Återhämtning kräver ofta vila och strukturerad paus, inte bara viljestyrka."
category: personlig_utveckling
citation_hint: "McEwen allostatic load (översikt); adhd-027, gad-030"
source_tier: P1
```

```yaml
id: kunskap-fact-cn-049
status: KEEP
content_class: FACT
topic: projektion
title: Projektion — attributera egna känslor till andra
content: "Projektion innebär att en person beskriver dig med egenskaper eller avsikter som passar deras eget känsloläge. Dokumentera beteende och datum — inte diagnos. Vid sms: svara kort på logistik i Hamn."
category: covert_taktik
citation_hint: "kunskap-fact-047; tacticPatternLibrary"
source_tier: P2
```

```yaml
id: kunskap-fact-cn-050
status: KEEP
content_class: FACT
topic: moving_goalposts
title: Moving goalposts — flyttande krav
content: "Moving goalposts: krav eller regler ändras efter att du uppfyllt dem, så du aldrig kan vinna. Dokumentera vad som sagts och när. Svara inte med långa förklaringar — BIFF i Hamn."
category: covert_taktik
citation_hint: "kunskap-fact-046"
source_tier: P2
```

```yaml
id: kunskap-fact-cn-051
status: KEEP
content_class: FACT
topic: tyst_straff
title: Tyst straff — tystnad som kontroll
content: "Tyst straff: kommunikation stängs av som påföljd. Det är ett beteendemönster att dokumentera med datum — inte något du måste rätta till med JADE. Grey Rock på logistik vid behov."
category: covert_taktik
citation_hint: "cn-002; SILENT_TREATMENT"
source_tier: P2
```

## Batch 2026-06-19 — Våg 32 Känslor + människopsykologi (kan-001..020, psy-001..015)

**Kurator:** `specialist-kunskap-seed` · **Silo:** Kunskap only · **Ingest:** `npm run export:kunskap-seed` → `npm run seed:kunskap-facts`

```yaml
id: kunskap-fact-kan-001
status: KEEP
content_class: FACT
title: "Grundkänslor — modell, inte sanning om dig"
content: "Forskare beskriver ofta grundkänslor som universella signaler: glädje, sorg, rädsla, ilska, avsmak och förvåning. Modellen hjälper att namnge upplevelser — den säger inte att du 'borde' känna på ett visst sätt. Känslor är information, inte identitet."
category: kanslor_vagus
entryType: fakta
tags: [kanslor, grundkanslor, emotion]
source_tier: P2
citation_hint: "Ekman basic emotions model (psychoeducation overview); 1177 känslor"
why: "FACT — namngivning utan terapi eller diagnos"
```

```yaml
id: kunskap-fact-kan-002
status: KEEP
content_class: FACT
title: "Sekundära känslor — vad som ofta ligger under"
content: "Sekundära känslor (t.ex. skam, skuld, avund) bygger ofta på grundkänslor plus tolkning. Att fråga 'vad ligger under?' kan avlasta — men det är en reflektionsmetod i MåBra, inte en sanning RAG ska dra om dig utan kontext."
category: kanslor_vagus
entryType: fakta
tags: [kanslor, sekundar, tolkning]
source_tier: psychoeducation_general
citation_hint: "Emotion-focused therapy psychoeducation (Greenberg overview)"
why: "Fakta om känslolager — övningar i Vit/MåBra separat"
```

```yaml
id: kunskap-fact-kan-003
status: KEEP
content_class: FACT
title: "Känslans tre delar — kropp, tanke, handling"
content: "En känsloupplevelse kan delas i: kroppsliga signaler (puls, spänning), tankar/etiketter ('jag är rädd') och impuls till handling (fly, attackera, frysa). KBT och ACT arbetar med alla tre — inte bara 'tänk positivt'."
category: kanslor_vagus
entryType: fakta
tags: [kanslor, kbt, kropp, tanke]
source_tier: P2
citation_hint: "CBT emotion model; Gross process model of emotion (översikt)"
why: "Stöd kunskap-fact-039 — ej personlig coaching här"
```

```yaml
id: kunskap-fact-kan-004
status: KEEP
content_class: FACT
title: "Emotionell granularitet — finare känsloord"
content: "Emotionell granularitet innebär att skilja närliggande känslor (orolig vs rädd vs överväldigad). Forskning kopplar högre granularitet till bättre reglering — inte till att 'alltid må bra'. Att namnge exakt minskar ofta intensiteten lite."
category: kanslor_vagus
entryType: fakta
tags: [kanslor, granularitet, namngivning]
source_tier: P2
citation_hint: "Barrett emotional granularity research (översikt)"
why: "FACT för RAG — C-feel kort i MåBra separat"
```

```yaml
id: kunskap-fact-kan-005
status: KEEP
content_class: FACT
title: "Fönster för tolerans — lugn, aktivering, överväldigande"
content: "Fönster för tolerans (window of tolerance) beskriver när nervsystemet kan tänka och samarbeta (mittzon), kontra hyperaktivering (panik/ilska) eller avstängning (dimma, overksamhet). Det är en modell för självobservation — inte en diagnos."
category: kanslor_vagus
entryType: fakta
tags: [tolerans, nervsystem, trauma_informerad]
source_tier: P2
citation_hint: "Siegel window of tolerance; trauma-informed psychoeducation"
why: "Stöd GAD/trauma-litterat utan terapi"
```

```yaml
id: kunskap-fact-kan-006
status: KEEP
content_class: FACT
title: "Fight, flight, freeze och fawn — stressresponser"
content: "Vid upplevt hot kan kroppen aktivera kamp (fight), flykt (flight), frysning (freeze) eller anpassning för att lugna andra (fawn). Dessa är automatiska överlevnadsstrategier — inte karaktärsfel. Efteråt kan kroppen behöva tid att återgå till lugn."
category: kanslor_vagus
entryType: fakta
tags: [stress, fight_flight, freeze, fawn]
source_tier: P2
citation_hint: "Polyvagal-informed psychoeducation; Walker fawn response (översikt)"
why: "FACT — hypervigilans-kontext utan att diagnostisera användaren"
```

```yaml
id: kunskap-fact-kan-007
status: KEEP
content_class: FACT
title: "Polyvagal teori — förenklad översikt"
content: "Polyvagal teori (Porges) beskriver hur autonoma nervsystemet växlar mellan trygg anslutning, mobilisering och avstängning. Det förklarar varför lugn närvaro, rytm och trygg relation kan påverka reglering — utan att ersätta medicinsk vård."
category: kanslor_vagus
entryType: fakta
tags: [polyvagal, nervsystem, reglering]
source_tier: psychoeducation_general
citation_hint: "Porges polyvagal theory (popular science overview)"
why: "Kompletterar kunskap-fact-037 vagus — ej medicinskt råd"
```

```yaml
id: kunskap-fact-kan-008
status: KEEP
content_class: FACT
title: "Amygdala och hot — snabb larmcentral"
content: "Amygdala är en hjärnstruktur som snabbt flaggar potentiella hot. Den kan reagera före medveten analys — vilket ger 'kroppen före hjärnan'-känsla vid ångest eller hypervigilans. Träning och säkerhet kan gradvis kalibrera larmet; det är inte 'svaghet'."
category: neuro_psyk
entryType: fakta
tags: [amygdala, angest, hot, hjarna]
source_tier: P2
citation_hint: "LeDoux fear circuit (översikt); 1177 ångest"
why: "Neuro-fakta för GAD/PTSD-litterat — ej diagnos"
```

```yaml
id: kunskap-fact-kan-009
status: KEEP
content_class: FACT
title: "Rädsla vs ångest — tidsperspektiv"
content: "Rädsla riktas ofta mot ett konkret, nära hot här och nu. Ångest är mer uthållig oro inför hot som känns osäkra eller framtida. Kroppen kan reagera likadant i båda. Att märka skillnaden hjälper ibland — ersätter inte behandling."
category: gad_angest
entryType: fakta
tags: [radsla, angest, gad]
source_tier: P2
citation_hint: "1177 rädsla och ångest; NICE anxiety (översikt)"
why: "Kompletterar gad-040 — psykoedukation"
```

```yaml
id: kunskap-fact-kan-010
status: KEEP
content_class: FACT
title: "Ilska som signal — gräns eller hot"
content: "Ilska signalerar ofta att en gräns är överträdd eller att något viktigt känns hotat. Den kan skydda — eller eskalera om den inte regleras. Ilska är inte samma sak som våld; våld är beteende, ilska är affekt."
category: kanslor_vagus
entryType: fakta
tags: [ilska, granser, affekt]
source_tier: psychoeducation_general
citation_hint: "Anger psychoeducation (general); Gottman anger (översikt)"
why: "FACT — Hamn/BIFF för konkret sms separat"
```

```yaml
id: kunskap-fact-kan-011
status: KEEP
content_class: FACT
title: "Sorg — process, inte brist"
content: "Sorg är en naturlig reaktion på förlust eller förändring. Den kommer i vågor och varierar i tid — det finns inget 'rätt' tempo. Sorg kan samexistera med vardagsfunktion. Vid djup eller långvarig sorg kan professionellt stöd vara lämpligt."
category: kanslor_vagus
entryType: fakta
tags: [sorg, forlust, process]
source_tier: P2
citation_hint: "Kübler-Ross populariserad modell (kritisk översikt); 1177 sorg"
why: "Neutral sorgfakta — ej terapi"
```

```yaml
id: kunskap-fact-kan-012
status: KEEP
content_class: FACT
title: "Skam vs skuld — identitet vs handling"
content: "Skuld: 'jag gjorde något dåligt' — kan motivera reparation. Skam: 'jag är dålig' — drar ofta ned motivation och kopplas till döljande. Att skilja dem är grund i mycket terapi — här som referensfakta, inte personlig bedömning."
category: kanslor_vagus
entryType: fakta
tags: [skam, skuld, affekt]
source_tier: P2
citation_hint: "Brown shame vs guilt (psychoeducation); Tangney research (översikt)"
why: "FACT — självkänsla-övningar i MåBra separat"
```

```yaml
id: kunskap-fact-kan-013
status: KEEP
content_class: FACT
title: "Avund och svartsjuka — olika fokus"
content: "Avund: önskan om det någon annan har. Svartsjuka: rädsla att förlora relation till någon. Båda är vanliga mänskliga känslor — inte tecken på 'dålig karaktär'. Att namnge dem minskar ofta deras makt."
category: kanslor_vagus
entryType: fakta
tags: [avund, svartsjuka, relation]
source_tier: psychoeducation_general
citation_hint: "Parrott envy/jealousy distinction (psychoeducation)"
why: "Referens — ej relationsterapi i Kunskap"
```

```yaml
id: kunskap-fact-kan-014
status: KEEP
content_class: FACT
title: "Avsmak — skydd mot det skadliga"
content: "Avsmak (disgust) hjälper kroppen undvika förorening eller överträdelser av normer. Den kan också riktas mot människor i konflikt — vilket förstärker avstånd. Att märka avsmak som signal, inte sanning om personen, kan minska eskalering."
category: kanslor_vagus
entryType: fakta
tags: [avsmak, disgust, signal]
source_tier: psychoeducation_general
citation_hint: "Rozin disgust psychology (översikt)"
why: "FACT — konflikt utan etikett på motpart"
```

```yaml
id: kunskap-fact-kan-015
status: KEEP
content_class: FACT
title: "Glädje och tillit — ankare i reglering"
content: "Glädje och tillit signalerar ofta trygghet och anslutning. De är inte 'belöning för prestation' — de stödjer återhämtning och lärande. Små moment av glädje (JOY) kan vara återhämtande utan att kräva stor prestation."
category: kanslor_vagus
entryType: fakta
tags: [gladje, tillit, aterhamtning]
source_tier: psychoeducation_general
citation_hint: "Fredrickson broaden-and-build (översikt); MB-REF-JOY bank"
why: "Stöd JOY-bank — FACT separat från övning"
```

```yaml
id: kunskap-fact-kan-016
status: KEEP
content_class: FACT
title: "Känslomässig flooding — när systemet översvämmas"
content: "Emotionell flooding innebär att affekt blir så stark att tanke och kommunikation stängs av tillfälligt. Det är fysiologiskt — inte 'dramatiskt'. Pauser, andning och att skjuta upp svåra samtal kan vara lämpligt tills lugn återkommer."
category: kanslor_vagus
entryType: fakta
tags: [flooding, overvaldigande, reglering]
source_tier: P2
citation_hint: "Gottman flooding; trauma-informed psychoeducation"
why: "Stöd konflikt/medföräldraskap utan JADE-coaching"
```

```yaml
id: kunskap-fact-kan-017
status: KEEP
content_class: FACT
title: "Nedreglering och uppreglering — två riktningar"
content: "Nedreglering: känslor dämpas eller avstängs (kan ge dimma, overksamhet). Uppreglering: känslor förstärks snabbt (panik, ilska). Båda är strategier nervsystemet använt — målet i terapi är ofta flexibilitet, inte konstant lugn."
category: kanslor_vagus
entryType: fakta
tags: [reglering, dimpning, aktivering]
source_tier: psychoeducation_general
citation_hint: "Linehan emotion regulation (DBT overview); Siegel"
why: "FACT — DBT-övningar i MåBra om ROUTE_MABRA"
```

```yaml
id: kunskap-fact-kan-018
status: KEEP
content_class: FACT
title: "Emotionell invalidation — när känslor avfärdas"
content: "Emotionell invalidation är när någons känsla möts med 'det var inget', 'du överdriver' eller tystnad som straff. Det lär ofta att dölja affekt. I föräldraskap kan validering ('jag tror dig') skiljas från att hålla med om allt beteende."
category: kanslor_vagus
entryType: fakta
tags: [validering, invalidation, barn]
source_tier: P2
citation_hint: "Linehan invalidating environment; bh-013 emotionell invalidation"
why: "Kompletterar bh-013 — generell fakta"
```

```yaml
id: kunskap-fact-kan-019
status: KEEP
content_class: FACT
title: "Empati vs sympati — förenklad skillnad"
content: "Empati: förstå eller känna med någons perspektiv. Sympati: medkänsla på distans ('stackars dig'). Empati utan gränser kan leda till utmattning; sympati kan ibland kännas nedlåtande. Båda begrepp används olika i forskning — här som kommunikationsfakta."
category: psykologi_grund
entryType: fakta
tags: [empati, sympati, kommunikation]
source_tier: psychoeducation_general
citation_hint: "Brown empathy vs sympathy; Decety empathy research (översikt)"
why: "FACT — Speglar gör validering runtime"
```

```yaml
id: kunskap-fact-kan-020
status: KEEP
content_class: FACT
title: "Alexitymi — svårt att namnge känslor"
content: "Alexitymi beskriver svårighet att identifiera och beskriva egna känslor. Det förekommer hos vissa vid trauma, autism eller långvarig stress — och är inte 'kall person'. Känsloordlista och kropps-scan kan hjälpa som övning, inte som diagnos här."
category: neuro_psyk
entryType: fakta
tags: [alexitymi, namngivning, interoception]
source_tier: P2
citation_hint: "Bagby alexithymia scale (översikt); interoception link"
why: "Stöd kan-004 — kopplar till interoception 036"
```

```yaml
id: kunskap-fact-psy-001
status: KEEP
content_class: FACT
title: "Big Five — fem breda personlighetsdrag"
content: "Big Five (OCEAN) beskriver fem breda drag: öppenhet, samvetsgrannhet, extraversion, tillmötesgående och neuroticism. De är statistiska dimensioner — inte etiketter som 'bra' eller 'dålig'. Personlighet är relativt stabil men kan påverkas av kontext och ålder."
category: psykologi_grund
entryType: fakta
tags: [personlighet, big_five, ocean]
source_tier: P2
citation_hint: "Costa & McCrae Big Five; 1177 personlighet (översikt)"
why: "Neutral personlighetsfakta — ej diagnos på användare"
```

```yaml
id: kunskap-fact-psy-002
status: KEEP
content_class: FACT
title: "Anknytning — trygg bas som barn"
content: "Anknytningsteori (Bowlby/Ainsworth) beskriver hur barn söker trygghet hos vårdnadshavare. Trygg anknytning innebär att barnet vågar utforska när basen känns säker — inte perfekta föräldrar. Mönster kan påverka vuxna relationer men är inte ödesbestämda."
category: psykologi_grund
entryType: fakta
tags: [anknytning, barn, relation]
source_tier: P2
citation_hint: "Bowlby attachment theory (psychoeducation overview)"
why: "FACT — barn_hcf separat; ej terapi"
```

```yaml
id: kunskap-fact-psy-003
status: KEEP
content_class: FACT
title: "Anknytningsstilar — förenklad översikt"
content: "Forskning beskriver ofta trygg, ängslig, undvikande och desorganiserad anknytning som mönster — inte diagnoser. De beskriver tendenser i närhet/avstånd under stress. Kunskap om mönster kan öka självförståelse utan att etikettera andra."
category: psykologi_grund
entryType: fakta
tags: [anknytning, stilar, relation]
source_tier: P2
citation_hint: "Main attachment styles (översikt); Bartholomew four-category"
why: "Referens — ROUTE_VALV om ex-analys"
```

```yaml
id: kunskap-fact-psy-004
status: KEEP
content_class: FACT
title: "Theory of mind — förstå andras perspektiv"
content: "Theory of mind är förmågan att förstå att andra har egna tankar, avsikter och känslor. Den utvecklas gradvis hos barn och kan vara nedsatt vid vissa tillstånd — utan att betyda 'ond'. I konflikt hjälper ibland att skilja avsikt från beteende."
category: psykologi_grund
entryType: fakta
tags: [theory_of_mind, perspektiv, social]
source_tier: P2
citation_hint: "Premack & Woodruff theory of mind; Baron-Cohen (översikt)"
why: "Social kognition — ej barn-diagnos här"
```

```yaml
id: kunskap-fact-psy-005
status: KEEP
content_class: FACT
title: "Kognitiva bias — hjärnans genvägar"
content: "Kognitiva bias är systematiska avvikelser i hur vi bedömer information — t.ex. att minnas det som bekräftar det vi redan tror. De är universella, inte tecken på dumhet. Att känna igen bias minskar inte alltid den — men kan motivera paus."
category: psykologi_grund
entryType: fakta
tags: [bias, kognition, beslut]
source_tier: P2
citation_hint: "Kahneman Thinking Fast and Slow (översikt); confirmation bias"
why: "Epistemik-stöd — kopplar ep-001"
```

```yaml
id: kunskap-fact-psy-006
status: KEEP
content_class: FACT
title: "Confirmation bias — söka det som bekräftar"
content: "Confirmation bias: vi lägger ofta märke till det som stödjer vår bild och filtrerar bort motstridigt. I konflikt kan två parter ha 'bevis' för motsatta sanningar. Dokumentation med datum och beteende (inte etikett) motverkar minnesfilter."
category: psykologi_grund
entryType: fakta
tags: [confirmation_bias, epistemik, konflikt]
source_tier: P2
citation_hint: "Nickerson confirmation bias review; ep-001 epistemik"
why: "Stöd Valv bevis — ej sms-coaching"
```

```yaml
id: kunskap-fact-psy-007
status: KEEP
content_class: FACT
title: "Halo-effekten — en egenskap färgar hela bilden"
content: "Halo-effekten: en positiv (eller negativ) egenskap hos en person färgar hur vi bedömer allt annat om dem. I myndighets- eller skolkontakter kan fasad utåt påverka bedömning — därför neutral logg med datum."
category: psykologi_grund
entryType: fakta
tags: [halo, bedomning, fasad]
source_tier: P2
citation_hint: "Thorndike halo effect; social perception (översikt)"
why: "Stöd cn-001 fasad — beteende+dokumentation"
```

```yaml
id: kunskap-fact-psy-008
status: KEEP
content_class: FACT
title: "Ingrupp och utgrupp — vi och dom"
content: "Människor kategoriserar snabbt i 'vi' och 'dom', vilket kan öka tillit inåt och misstro utåt. I familjekonflikt kan professionella bara se en sida. Neutral dokumentation fokuserar på observerbart — inte lagtribalism."
category: psykologi_grund
entryType: fakta
tags: [ingrupp, utgrupp, social_psykologi]
source_tier: P2
citation_hint: "Tajfel social identity theory (översikt)"
why: "FACT — myndighet/soc neutral dialog"
```

```yaml
id: kunskap-fact-psy-009
status: KEEP
content_class: FACT
title: "Sociala normer — osynliga regler"
content: "Sociala normer är delade förväntningar på beteende i en grupp. De varierar mellan familjer, kulturer och kontexter. Att bryta en norm kan ge skam eller ilska hos andra — utan att beteendet objektivt är 'fel'."
category: psykologi_grund
entryType: fakta
tags: [normer, social, kultur]
source_tier: psychoeducation_general
citation_hint: "Cialdini social norms (översikt)"
why: "Referens — ej moralpredikan"
```

```yaml
id: kunskap-fact-psy-010
status: KEEP
content_class: FACT
title: "Assertiv kommunikation — förenklad modell"
content: "Assertiv kommunikation: uttryck behov och gräns tydligt utan att attackera eller underkasta sig. Passivt undviker konflikt; aggressivt kränker andras gräns. BIFF och Grey Rock är produkt-specifika varianter för högkonflikt — se kunskap-fact-005/006."
category: psykologi_grund
entryType: fakta
tags: [assertiv, kommunikation, granser]
source_tier: P1
citation_hint: "Alberti & Emmons assertiveness (översikt); BIFF 005"
why: "Fakta — konkret sms → Hamn"
```

```yaml
id: kunskap-fact-psy-011
status: KEEP
content_class: FACT
title: "Aktivt lyssnande — vad det innebär"
content: "Aktivt lyssnande innebär att bekräfta att du hört (parafrasera), ställa öppna frågor och undvika omedelbar lösning eller dom. Det ökar trygghet i samtal — det innebär inte att du håller med om allt som sägs."
category: psykologi_grund
entryType: fakta
tags: [lyssnande, kommunikation, relation]
source_tier: psychoeducation_general
citation_hint: "Rogers reflective listening (översikt); MI psychoeducation"
why: "FACT — Speglar runtime separat"
```

```yaml
id: kunskap-fact-psy-012
status: KEEP
content_class: FACT
title: "Burnout — utmattning som process"
content: "Burnout (utmattningssyndrom) beskriver långvarig arbetsrelaterad stress med trötthet, cynism och minskad effektivitet. Det är erkänt som diagnos i vissa system — inte 'lata'. Återhämtning kräver ofta förändring av belastning, inte bara vilja."
category: neuro_psyk
entryType: fakta
tags: [burnout, utmattning, stress]
source_tier: P2
citation_hint: "WHO ICD-11 burnout; 1177 utmattning"
why: "Stöd pu-003 allostatisk belastning"
```

```yaml
id: kunskap-fact-psy-013
status: KEEP
content_class: FACT
title: "Resiliens — återhämtning efter motgång"
content: "Resiliens är förmågan att återhämta sig efter stress eller trauma — inte att aldrig påverkas. Faktorer: trygga relationer, förutsägbarhet, sömn, mening och små rutiner. Resiliens byggs gradvis; den är inte en personlighetsfråga om 'styrka'."
category: psykologi_grund
entryType: fakta
tags: [resiliens, aterhamtning, stress]
source_tier: P2
citation_hint: "Masten resilience research (översikt); 1177 stress"
why: "FACT — ej toxic positivity"
```

```yaml
id: kunskap-fact-psy-014
status: KEEP
content_class: FACT
title: "Mänskliga grundbehov — översikt"
content: "Forskning beskriver grundläggande behov: trygghet, tillhörighet, autonomi och mening (modeller varierar — Maslow, SDT m.fl.). Obuppfyllda behov ökar stress. Det förklarar inte allt beteende — men kan vägleda prioritering av vila och struktur."
category: psykologi_grund
entryType: fakta
tags: [behov, maslow, sdt, trygghet]
source_tier: psychoeducation_general
citation_hint: "Deci & Ryan self-determination theory; Maslow (kritisk översikt)"
why: "Referens — ej livscoaching"
```

```yaml
id: kunskap-fact-psy-015
status: KEEP
content_class: FACT
title: "Social hjärna — samarbete och konflikt"
content: "Den sociala hjärnan utvecklades för samarbete i grupp — vilket också gör oss känsliga för uteslutning och skam. Social smärta aktiverar överlappande nätverk med fysisk smärta. Det förklarar varför relationella hot kan kännas kroppsligt intensiva."
category: neuro_psyk
entryType: fakta
tags: [social_hjarna, smarta, uteslutning]
source_tier: P2
citation_hint: "Eisenberger social pain; Lieberman social brain (översikt)"
why: "Stöd RSD-litterat utan att diagnostisera"
```

