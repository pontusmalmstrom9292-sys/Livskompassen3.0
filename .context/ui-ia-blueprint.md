# Livskompassen 3.0 — UI/IA Blueprint för kognitivt avlastad systemarkitektur och säkra datavalv

Det mänskliga kognitiva systemet är begränsat i sin kapacitet att hantera komplexa beslut under stress, mental utmattning och exekutiv dysfunktion. När en individ befinner sig i ett tillstånd av kognitiv överbelastning, innebär varje ytterligare valmöjlighet eller oklar navigationsväg en förhöjd risk för kognitiv frysning, uppskjutande och slutligen uppdragsavbräck. Historiska implementationer av personliga stödsystem har ofta fallit på att de skapar alltför komplicerade gränssnitt med multipla parallella mentala lager (såsom Hem, Planering, Kunskap, Valv och Familj), vilket tvingar användare att utvärdera systemet snarare än att agera.

Livskompassen 3.0 adresserar denna problematik genom en radikal konsolidering av informationsarkitekturen under devisen "Den Trygga Hamnen". Genom att eliminera traditionella dashboards, statistiska vyer och utspridda planeringsverktyg reduceras den kognitiva friktionen till ett absolut minimum. Arkitekturen vilar på kliniskt etablerade principer inom Acceptance and Commitment Therapy (ACT), där systemet fungerar som en kompass och en kognitiv protes. Parallellt med denna gränssnittsförenkling etableras en kompromisslös datastruktur på systemnivå, där känslig terapeutisk information isoleras bakom krypterade personliga valv med Write Once, Read Many (WORM)-lagring för att garantera absolut integritet och motståndskraft mot datamanipulation.

## Kognitiv belastningsteori och det arkitektoniska paradigmskiftet

För att förstå nödvändigheten av övergången till "Den Trygga Hamnen" krävs en matematisk och kognitionspsykologisk analys av hur hjärnan bearbetar gränssnitt. Kognitiv belastningsteori definierar den mentala resursåtgången som summan av tre interagerande krafter:

$$L_{\text{total}} = L_{\text{intrinsic}} + L_{\text{extraneous}} + L_{\text{germane}}$$

Här representerar $L_{\text{intrinsic}}$ den inneboende svårighetsgraden i att hantera en kaotisk vardag. Det primära målet med Livskompassen 3.0 är att reducera den ovidkommande belastningen, $L_{\text{extraneous}}$, som genereras av dåligt utformade gränssnitt, till noll ($L_{\text{extraneous}} \to 0$). Sannolikheten för uppgiftsinitiering ($P_{\text{initiation}}$) vid exekutiv trötthet kan modelleras som en funktion av den kognitiva friktionen ($F$) och användarens aktuella energireserv ($E$):

$$P_{\text{initiation}} = \frac{1}{1 + e^{F - E}}$$

När friktionen $F$ är hög på grund av en splittrad navigationsstruktur krävs en oproportionerligt stor energireserv $E$ för att starta en uppgift. Genom att konsolidera systemet till färre men starkare supermoduler elimineras de mikrobeslut som dränerar användarens energi.

### Gammal struktur vs Ny supermodulstruktur

| Gammal struktur (Hög friktion) | Ny supermodulstruktur (Den Trygga Hamnen) | Kognitiv och funktionell inverkan |
|----------------|----------------|----------------|
| Hem (Statisk dashboard med grafer och aggregerad data). | **Hjärtat** (Det omedelbara nuet, dagsfokus och mikrosteg). | Eliminerar prestationsångest; ersätter analys med fokuserad hantering. |
| Planering (Isolerad planeringsvy med komplexa att-göra-listor). | **Vardagen** (All operativ verklighet inklusive hantering och rutiner). | Integrerar planeringen i den operativa vardagen; döljer teknisk routing. |
| Kunskap (Publikt sökbar och ostrukturerad kunskapsbank). | **Valvet** (Skyddad och krypterad zon, strikt placerad bakom PIN-kod). | Garanterar att känslig information är osynlig för obehöriga och isolerad. |
| Fyren (Aktiv applikationsvy med krav på kontinuerliga självskattningar). | **Fyren som OS** (Ambient, bakomliggande systemstatus utan dashboards). | Tar bort kravet på administration; anpassar systemets tempo dämpat och tyst. |

Genom denna förenklade modell förhindras kognitiv frysning. Systemet leder användaren från passivt betraktande till omedelbart genomförande.

## Supermodul 1 — Hjärtat
Hjärtat utgör den primära landningsytan och systemets känslomässiga ankare. Syftet är inte att presentera en översikt av projekt eller komplex statistik, utan att ge ett direkt och lugnande svar på frågan: "Vad behöver jag just nu?".

För att undvika avvisningsreaktioner hos användare med förhöjd stresskänslighet eller efterfrågeundvikande (Demand Avoidance) använder Hjärtat ett extremt dämpat, icke-dömande språk och ett minimalt antal gränssnittselement. Gränssnittet föreslår alltid ett enskilt bästa nästa steg (Single Next Best Action), vilket eliminerar den valparalys som uppstår inför en tom skärm eller en oändlig att-göra-lista.

### Gränssnittsregler och kognitiv mekanik
För att bevara Hjärtat som en fredad zon tillämpas rigorösa designbegränsningar:
- **Absolut förbud mot dashboards och statistik:** Inga stapeldiagram, framstegsindikatorer eller historiska jämförelser tillåts. Dessa element inducerar skamcykler hos individer som upplever tillfälliga svackor i sin produktivitet.
- **Det isolerade mikrosteget:** Endast ett (1) nästa steg visas i taget. Knappen [ Gör nu ] är placerad i direkt anslutning till mikrosteget och utlöser en omedelbar handling.
- **Visuell dämpning:** Informationen under "Familjen" och "Vardagen" är strikt begränsad till kontextuella sammanfattningar i stället för detaljerade listor, vilket minskar mängden text som arbetsminnet tvingas bearbeta.

## Supermodul 2 — Familjen
Familjen är utformad för att flytta fokus från logistisk och administrativ stress till faktisk relationell närvaro. Vid kognitiv utmattning reduceras familjerelationer ofta till en serie svårhanterliga logistiska utmaningar, vilket urholkar den känslomässiga tryggheten. Denna supermodul döljer de administrativa processerna och lyfter i stället fram mjuka observationer och relationella fokusområden.

### Tekniska bevarandekrav och arkitektur
För att säkerställa kontinuitet och bibehålla den kliniskt validerade grundstrukturen hålls följande programvarukomponenter helt oförändrade på kodnivå:
- `FamiljenInputSuperModule`: Den underliggande datainsamlingskomponenten som hanterar inmatning av relationella observationer.
- `Barnfokus`: Logikmodulen för att rikta uppmärksamhet mot enskilda barns specifika utvecklingsbehov.
- `BARNFOKUS_QUESTIONS`: Den statiska uppsättningen av strukturerade frågor avsedda att stödja föräldrareflektion.

Genom att behålla dessa komponenter intakta men paketera dem i ett radikalt förenklat gränssnitt tillåts användaren att registrera värdefulla observationer via [ Ny observation ] utan att belastas av det underliggande systemets komplexitet.

## Supermodul 3 — Vardagen
Vardagen utgör applikationens operativa motor. Det är här som den praktiska verkligheten och planeringen bor. En av de vanligaste designmissarna i traditionella stödsystem är att separera "Planering" och "Handling" till olika vyer, vilket skapar en kognitiv klyfta när användaren måste växla kontext för att uppdatera sin status.

I Livskompassen 3.0 är planering inte en egen plats. Planering är helt integrerat i Vardagen under fliken Handling.

### Routing och osynlig arkitektur
För att bibehålla kompatibilitet med befintlig databaslogik och navigationsstrukturer ligger den beprövade P3-routen kvar opåverkad i systemets kärna: `/planering?tab=handling`.
Användaren exponeras dock aldrig för denna routingstruktur eller för begreppet "Planering" som en fristående entitet. Genom att dölja den tekniska sökvägen bakom rena navigationsval kan användaren navigera sin operativa verklighet utan att behöva bygga upp en mental karta av applikationens tekniska uppbyggnad.

## Supermodul 4 — Valvet (PIN & WORM-säkerhet)
Valvet är designat som en absolut skyddad och krypterad zon för användarens mest känsliga information. Detta inkluderar personliga mönster, ACT-relaterade självreflektioner, nätverkskartor och den interna kunskapsbanken. Det är en grundläggande princip i Livskompassen 3.0 att Valvet inte utgör en vardagsyta. Det är en plats för lugn reflektion och långsiktigt sparande, helt avskild från det dagliga bruset.

### Det publika (låsta) läget
När användaren inte är autentiserad avslöjar Valvet inga data, inga dokumenträknare och inga metadata. Detta skyddar mot ofrivilligt informationsläckage om någon annan skulle se skärmen. Sökfunktionen i den publika delen av applikationen har ingen åtkomst till Valvets innehåll; det existerar ingen publik kunskapshub.

### Det autentiserade läget (efter PIN-verifiering)
När användaren har angett sin personliga PIN-kod låses den skyddade zonen upp och presenterar de djupt liggande datasilorna: Valvet • Mönster • Orkester • Kunskapsbank • Aktörskarta. Genom att begränsa antalet skrivytor till tre kärnsilos garanteras dataintegriteten på systemnivå. Denna strikta uppdelning förhindrar dataläckage mellan applikationens olika delar.

## Fyren som kognitivt operativsystem
Fyren har i tidigare versioner av systemet betraktats som en destination – en specifik plats dit användaren förväntats gå för att skatta sin hälsa och kapacitet. I Livskompassen 3.0 avvecklas idén om Fyren som en applikation eller en separat vy. Fyren är i stället omdefinierad till att vara ett kognitivt operativsystem (OS) som tyst övervakar och anpassar gränssnittet i bakgrunden.

### Ambient gränssnittsnärvaro
Fyren manifesterar sig enbart som en minimal, textbaserad statusindikator placerad längst upp i det globala gränssnittets sidhuvud. Beroende på användarens uppmätta eller indikerade kapacitet antar indikatorn ett av tre tillstånd:
- **Låg kapacitet:** 🜂 Lugnt tempo rekommenderas idag – Systemet går in i ett dämpat läge. Hjärtat lyfter fram ännu enklare mikrosteg, färgkontraster mjukas upp och sekundära notifieringar blockeras.
- **Medelkapacitet:** 🜂 Stabil dag – Standardläge.
- **Hög kapacitet:** 🜂 Bra fokusfönster just nu – Systemet tillåter mer komplex planering.

## Informationsarkitektur och det optimala flödesdiagrammet
Den perfekta informationsarkitekturen för "Den Trygga Hamnen" är strikt hierarkisk men kognitivt platt.

```text
Den Trygga Hamnen
├── Hjärtat
│   ├── Familjen
│   ├── Vardagen
│   │   ├── Idag
│   │   ├── Handling
│   │   ├── Kalender
│   │   └── Rutiner
│   └── Valvet
├── Mönster
├── Orkester
├── Kunskapsbank
└── Aktörskarta
```

### Det kritiska användarflödet
Det absolut största UI-felet som denna arkitektur eliminerar är tvekan. Det optimala och kognitivt säkrade flödet är linjärt och omedelbart:
`Öppna Livskompassen → Hjärtat aktiveras → Se nästa lilla mikrosteg → Exekvera [ Gör nu ]`

## Systemteknisk ryggrad: WORM-lagring och dataintegritet
Att skydda användarens mest sårbara data kräver mer än bara ett starkt lösenord eller en PIN-kod. För att förhindra radering (exempelvis vid kognitiv trötthet eller panik) är det krypterade Valvet uppbyggt kring en strikt WORM-lagringsarkitektur (Write Once, Read Many).

- **Vardagen:** Standard Relationsdatabas. Fullständig (CRUD).
- **Familjen:** Krypterad med tidsfördröjd radering. Begränsad.
- **Valvet:** Immutable WORM. Ingen radering/uppdatering. Uppdateringar skapar nya versioner.

**Append-Only loggning:** Den nya versionen skrivs som en ny post. Kryptografisk nyckel härleds från användarens PIN-kod via PBKDF2-hash. Skydd mot ransomware och ofrivillig radering är inbyggt i arkitekturen.

## Sammanfattning och arkitektoniska rekommendationer
1. **Behåll gränssnittet kognitivt platt:** Utvecklingsteamet måste aktivt motstå frestelsen att lägga till nya funktioner, inställningar eller dashboards i Hjärtat. Om det ökar $L_{\text{extraneous}}$ ska det förkastas.
2. **Säkra den strikta PIN-separeringen:** Inga data får laddas i minnet innan PIN är verifierad.
3. **Fullfölj WORM-arkitekturen i databasen.**
