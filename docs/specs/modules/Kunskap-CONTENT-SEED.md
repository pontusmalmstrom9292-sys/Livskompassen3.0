# Kunskap — Content Seed (kuraterad fakta)

**Datum:** 2026-05-25 · **Batch:** 2026-05-27 (10 KEEP FACT)  
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
| kunskap-fact-001 … 010 | FACT | Se batch 2026-05-27 | Se yaml nedan | P1/P2 |

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

## Koppling till befintlig seed

| Manifest | Fil |
|----------|-----|
| Profil | [`Kampspar-PROFIL-SEED.md`](Kampspar-PROFIL-SEED.md) |
| Barn-referens | [`Kampspar-BARN-REFERENS-SEED.md`](Kampspar-BARN-REFERENS-SEED.md) |

Nya KEEP-rader här kan senare exporteras till JSON-manifest — **deterministisk** ingest, ingen LLM i prod som skapar FACT.

**Smoke:** `npm run smoke:kunskap`
