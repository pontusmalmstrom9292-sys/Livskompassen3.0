# Fördjupad Systemteknisk Analys av LIVSKOMPASSEN-KANON

Denna fördjupning expanderar systemarkitekturen för Livskompassen-Kanon genom att integrera och detaljera de kliniska, kommunala, civilrättsliga samt hushållsekonomiska kravprofilerna mot bakgrund av gällande svensk lagstiftning och internationella skyddsstandarder.

## 1. Det kliniska och psykiatriska stödsystemet (1177-standard & neurodiversitet)

Att hantera en vardag under svår stress, till exempel vid högkonfliktuella separationer, ställer extrema krav på användare med neuropsykiatriska funktionsnedsättningar (NPF) såsom adhd. Enligt kliniska riktlinjer från 1177 har adhd ingenting med intelligens att göra, utan handlar om en annorlunda kognitiv funktionsuppsättning som påverkar exekutiv kontroll, uppmärksamhetsreglering och stresskänslighet.

Stödsystemet för vuxna med adhd är dock kraftigt fragmenterat i Sverige; 1177 betonar uttryckligen att resurser och insatser varierar avsevärt beroende på vilken region och kommun användaren är folkbokförd i ("Det kan vara olika vilket stöd man kan få i olika regioner och kommuner"). Vuxna som erhållit en adhd-diagnos hänvisas i regel till den specialiserade vuxenpsykiatriska mottagningen i sin respektive region för farmakologisk och psykoterapeutisk behandling.

Denna regionala och kommunala diskrepans ställer hårda krav på Livskompassens kunskapsbank (`kb_docs`). KunskapsRAG-motorn måste via `knowledgeVaultQuery` tillhandahålla lokalt verifierade vårdkedjor baserat på användarens specifika postnummer. För Västra Götalandsregionen (VGR) och Partille kommun innebär detta att systemet måste kartläggas till lokala primärvårdsnoder, såsom Medipart Partille Vårdcentral och BVC på Gamla Kronvägen eller Närhälsan Partille vårdcentral vid Kyrktorget, vilka utgör de fysiska första-linjen-portalerna för medicinsk bedömning och vidare remittering till vuxenpsykiatrin.

För att motverka den kognitiva utmattning och uppgiftsförlamning (executive dysfunction) som ofta eskalerar vid adhd under pågående vårdnadstvister, exekverar systemets händelsestyrda `paralysBrytarenSynapse`. När systemet detekterar stagnation i planeringsgränssnittet P3, förbigår det alla belöningsstrukturer och genererar enskild, isolerad mikrohantering baserad på 1177:s kliniska rekommendationer för struktur och vanor (exempelvis guider för sömnhygien, stressreducering och tidsblockering). Detta görs helt utan att inducera prestationsångest via streaks eller XP.

## 2. Forensisk loggning och digital säkerhet (NHS & SafeLives-standard)

Användare som lever under systematiskt ekonomiskt, psykologiskt eller tvångsmässigt kontrollerande våld (coercive control) är extremt sårbara för digital övervakning. Brittiska National Health Service (NHS) och SafeLives dokumenterar hur förövare utnyttjar digitala verktyg och internetplattformar för att övervaka, spåra och kontrollera sina offer.

### Proxy-åtkomst och digital infiltration
NHS England varnar specifikt för riskerna med att förövare tilltvingar sig åtkomst till offrets eller barnens digitala patientjournaler via proxy-tjänster eller genom att tvinga offret att logga in och visa känsliga medicinska uppgifter rörande exempelvis skyddade boenden, anmälningar eller psykiatriskt stöd. NHS-riktlinjerna slår fast att klinisk personal skyndsamt måste kunna dölja (redact) känslig information i patientvyn, utan att för den sakens skull radera uppgifterna ur den underliggande journalen, om det finns minsta misstanke om att patienten utsätts för tvångsmässig kontroll.

Inom Livskompassen-Kanon tillämpas denna princip stenhårt genom arkitekturen för Sanningens Sköld och den strikta separationen av datasilor:

- **Ingen automatisk eskalering:** Uppgifter som registreras i de terapeutiska eller vardagliga gränssnitten (t.ex. `mabra_sessions` eller `vit_entries` i utvecklingszonen U6) kan aldrig automatiskt indexeras eller sökas via systemets RAG-funktioner. Detta eliminerar risken för att en förövare, som tvingar till sig en visuell inspektion av applikationen, kan hitta en sammanställd historik över offrets djupaste terapeutiska reflektioner.
- **Kill Switch och Zero Footprint:** Systemet implementerar en omedelbar sessionsterminering (`invalidateSession`) vid minsta indikation på tvång. Om applikationen läggs i bakgrunden eller om skärmen låses, avmonteras känsliga DOM-element i `reality_vault` omedelbart från minnet.

### Hantering av DARVO-taktik
SafeLives och NHS understryker att förövare av tvångsmässig kontroll ofta uppvisar en hög grad av manipulation vid kontakt med myndigheter, socialtjänst och domstolar. En vanlig strategi är DARVO (Deny, Attack, and Reverse Victim and Offender), där förövaren projicerar sina egna destruktiva beteenden på offret, ikläder sig offerrollen inför utredare och aktivt försöker framställa det verkliga offret som instabilt, hysteriskt eller samarbetsovilligt.

För att skydda användarens rättsliga trovärdighet motverkar systemets WORM-protokoll (`reality_vault`) denna taktik genom att tvinga fram en strikt objektiv dokumentationsstandard:
- Systemet tillåter inte att användaren loggar subjektiva tolkningar eller diagnostiska termer (t.ex. att registrera att motparten är "narcissist" eller "psykopat").
- Varje logg måste följa den forensiska formeln: **observerbart beteende + exakt datum + direkt citat**.

Detta genererar ett tidstämplat och kryptografiskt oföränderligt bevismaterial som direkt motbevisar DARVO-projektioner i domstol, då svenska familjerätter (och tingsrätter) helt bortser från lekmannadiagnoser men fäster avgörande vikt vid konkreta, kronologiska händelseförlopp rörande samarbets- och umgängessabotage.

## 3. Det juridisk-administrativa gränssnittet i Sverige (Partille, MFoF & Domstolen)

När samarbetet mellan separerade föräldrar helt brutit samman, tillhandahåller det svenska rättssystemet och kommunerna specifika mekanismer för konfliktlösning. Systemet kartlägger dessa steg noggrant för att undvika att användaren begår formfel som skadar den rättsliga processen.

### Informationssamtal (Obligatoriskt processsteg)
Sedan den 1 mars 2022 kräver svensk lagstiftning att föräldrar som avser att inleda en domstolstvist gällande vårdnad, boende eller umgänge först måste ha deltagit i ett obligatoriskt informationssamtal hos kommunens familjerätt. Syftet är att i ett tidigt skede ge föräldrarna information om processen, belysa hur en domstolstvist påverkar barnet negativt, samt vägleda dem mot mer samförståndsfokuserade alternativ utanför domstol. Att inte ha deltagit i ett sådant samtal utgör ett absolut processhinder för att få saken prövad i tingsrätten.

### Samarbetssamtal och 31-dagarsregeln i Partille
Om föräldrarna är villiga att försöka enas, erbjuder kommunerna samarbetssamtal under sakkunnig ledning av familjerättssekreterare. Syftet är att hjälpa föräldrarna att nå enighet och upprätta funktionella överenskommelser rörande barnets vardag.

I Partille kommun administreras denna tjänst digitalt via kommunens e-tjänstportal, vilket medför en kritisk administrativ risk som systemet måste varna för:
- **31-dagarsregeln:** Samarbetssamtal är helt frivilliga och kräver samtycke från båda föräldrarna. När en ansökan registreras i e-tjänsten måste den signeras elektroniskt med BankID av båda parter.
- **Automatisk gallring:** Om inte den andra föräldern har undertecknat ansökan inom exakt 31 dagar från registreringen, raderas ärendet automatiskt ur Partille kommuns databaser under gällande GDPR- och gallringsregler, och ansökningsprocessen måste startas från början.
- **Kökronologi:** Placering i samtalskön sker strikt utifrån det datum då den fullständiga signerade ansökan kommit in. Systemets planeringsmodul måste därför tidsbevaka denna 31-dagarsfrist och använda diskreta notiser utan att använda stressande gamification-element.

### Sekretessförhållanden i kommunal verksamhet
Det råder en fundamental juridisk skillnad mellan de två vanligaste kommunala samtalsformerna, vilket systemet tydligt måste klargöra i `kb_docs`:
- **Familjerådgivning (Kommunal/Privat):** Fokuserar på att bearbeta samlevnadskonflikt i parförhållandet och familjen. Denna verksamhet lyder under absolut sekretess (sträng sekretess) enligt offentlighets- och sekretesslagen. Det förs inga journaler, registreras inga officiella personuppgifter och deltagarna har lagstadgad rätt att vara helt anonyma. Det enda undantaget från den absoluta sekretessen är den lagstadgade anmälningsplikten vid kännedom eller misstanke om att barn utsätts för allvarliga brott (t.ex. fysisk/psykisk misshandel eller att ha bevittnat våld i hemmet).
- **Samarbetssamtal (Familjerätten):** Fokuserar på föräldrasamarbetet och barnets praktiska situation efter separationen. Dessa samtal journalförs och lyder under vanlig socialtjänstsekretess. Uppgifter som framkommer här kan i vissa fall begäras ut av domstolen i samband med en vårdnadsutredning.

### Godkännande av avtal (Vårdnad, boende, umgänge)
Om föräldrarna når en överenskommelse – antingen via samarbetssamtal eller på egen hand – kan de upprätta ett skriftligt avtal gällande vårdnad, boende eller umgänge. För att ett sådant avtal ska bli juridiskt bindande och kunna verkställas av domstol på samma sätt som en lagakraftvunnen dom, krävs att det skriftligen godkänns av socialnämnden i barnets hemkommun.

Vid sin prövning gör socialnämnden en självständig bedömning av om avtalets innehåll överensstämmer med barnets bästa. Nämnden har även skyldighet att omedelbart sända meddelande om godkända vårdnadsavtal till Skatteverket, Försäkringskassan och CSN (om barnet fyllt 15 år) samma dag som godkännandet sker. Muntliga överenskommelser eller enkla skriftliga dokument som inte godkänts av socialnämnden saknar helt verkställbarhet i svensk rätt.

## 4. Hushållsekonomiska realiteter (Konsumentverket 2026 & LF-standard)

Ekonomiskt våld och ekonomiskt sabotage är mycket vanliga inslag i högkonfliktuella separationer. Förövaren kan hålla inne underhåll, vägra betala gemensamma räkningar eller kräva orimliga summor för barnets löpande kostnader. För att ge användaren ett övervägande skydd mot finansiell manipulation måste systemets `EconomySavingsPanel` baseras på officiella standardkostnader och faktiska levnadskostnadskalkyler.

### Konsumentverkets hushållskalkyler 2026
Konsumentverket beräknar årligen referensvärden för hushållens levnadskostnader. För år 2026 har matkostnaderna generellt minskat med cirka 20 % jämfört med toppnoteringarna under 2025 till följd av stabiliserade livsmedelspriser.
- **Matkostnad för vuxen (2026):** Cirka 2 730 SEK per månad (om all mat lagas hemma).
- **Matkostnad för familj (2 vuxna, 2 barn i åldrarna 5 och 9 år):** Fastställd till 8 440 SEK per månad.
- **Tillägg för specialkost:** 50–250 SEK extra per månad per individ vid dokumenterade medicinska behov.

### Åldersgraderade barnkostnader (Sambla & Länsförsäkringar 2026)
Länsförsäkringars privatekonomiska analys visar att den totala kostnaden för att uppfostra ett barn från födseln till 18-årsdagen uppgår till cirka 1,93 miljoner SEK per barn (vilket motsvarar ungefär 7 000–9 000 SEK per månad). Denna kalkyl inkluderar inte bara direkt mat och kläder, utan även dolda kostnader såsom större bostad, semestrar, fritidsaktiviteter samt inkomstbortfall vid föräldraledighet och deltidsarbete.

Konsumentverkets och Samblas åldersgraderade referensvärden för barnets direkta, individuella kostnader (mat, kläder, hygien, lek/fritid, försäkring och barnutrustning) fördelar sig enligt följande tabell:

| Åldersspann | Genomsnittlig matkostnad | Övriga individuella kostnader | Total månadskostnad |
|-------------|--------------------------|-------------------------------|---------------------|
| 0–11 månader| 1 030 kr                 | 2 920 kr                      | 3 950 kr            |
| 1–3 år      | 1 100 kr                 | 2 730 kr                      | 3 830 kr            |
| 4–6 år      | 1 330 kr                 | 2 000 kr                      | 3 330 kr            |
| 7–10 år     | 1 650 kr                 | 2 090 kr                      | 3 740 kr            |
| 11–14 år    | 2 060 kr                 | 2 070 kr                      | 4 130 kr            |
| 15–17 år    | 2 370 kr                 | 2 390 kr                      | 4 760 kr            |

*Notera: Dessa kalkyler utgår från att barnet äter lunch i skolan/förskolan från 4 års ålder. Barnbidraget (vilket ligger på 1 250 SEK per månad under 2026) samt eventuella flerbarnstillägg är viktiga, standardiserade avdragsposter i dessa kalkyler.*

När en användare dokumenterar finansiella transaktioner, utlägg eller uteblivna underhållsbidrag i `reality_vault`, använder systemet dessa fastställda referensvärden för att automatiskt beräkna och visualisera avvikelser. Detta ger användaren ett juridiskt solitt underlag vid underhållsförhandlingar i domstol eller vid samtal hos socialnämnden.

## 5. Parallellt föräldraskap (AFCC-standard)

I högkonfliktuella fall där föräldrarna har uppenbara svårigheter att kommunicera utan att konflikter uppstår, eller där det föreligger en historik av dolt våld och manipulation, är traditionellt samarbetande föräldraskap (co-parenting) direkt kontraindicerat. Association of Family and Conciliation Courts (AFCC) rekommenderar i dessa fall ett strukturerat parallellt föräldraskap (parallel parenting).

Målet med parallellt föräldraskap är att koppla bort föräldrarna från varandra och minimera direktkontakt, samtidigt som barnet garanteras en trygg och meningsfull relation med båda föräldrarna. Detta sker genom att lägga en digital och fysisk "brandvägg" mellan hushållen.

### AFCC:s kärnprinciper för parallellt föräldraskap
- **Begränsad, skriftlig kommunikation:** All direkt muntlig kontakt (telefon eller öga-mot-öga) är strikt förbjuden utom vid akuta medicinska nödsituationer. All kommunikation sker skriftligen via dedikerade appar eller mail, och ska strikt begränsas till barnrelaterad logistik.
- **BIFF-standarden:** Alla skriftliga meddelanden måste hållas korta, informativa, sakliga och fasta (Brief, Informative, Friendly, Firm). Föräldrar uppmanas att tillämpa en "24–48 timmars regel" för icke-akuta svar för att dämpa känslomässig eskalering.
- **Suveräna hushåll:** Föräldrarna måste acceptera att de inte kan kontrollera eller diktera reglerna i det andra hushållet. Bedtider, kostval och skärmtid regleras självständigt av respektive förälder under deras umgängestid, förutsatt att miljön är fysiskt och psykiskt säker.
- **Separering av publika aktiviteter:** Föräldrar deltar inte gemensamt i skolavslutningar, sportevenemang eller utvecklingssamtal. Istället alterneras närvaron (t.ex. en förälder går på höstterminens samtal och den andra på vårens), eller så hålls strikt fysiskt avstånd vid gemensamma publika händelser med förskjutna ankomst- och avgångstider.
- **Neutrala överlämningar:** Överlämningar sker via skola/förskola eller på neutrala, publika platser (t.ex. bibliotek eller parkeringsplatser) där social kontroll minskar risken för fientliga utbrott.

### Särskiljning från föräldraalienation
AFCC betonar en avgörande distinktion:
- **Parallellt föräldraskap** innebär att en förälder fattar självständiga beslut inom ramen för sin lagliga umgängestid och därefter informerar motparten i enlighet med gällande avtal.
- **Föräldraalienation** innebär ett aktivt, manipulativt agerande i syfte att medvetet förstöra barnets relation till den andra föräldern, till exempel genom att undanhålla information eller smutskasta motparten inför barnet.

### Systemisk integration av parallella mallar
Livskompassen integrerar dessa principer direkt i planeringsverktygen. Systemet tillhandahåller färdiga, strukturerade avtal för parallella umgängen (där hänsyn tas till exakta klockslag, neutrala platser och staggered-scheman), samt en inbyggd BIFF-analysator (`analyzeMessage`) som automatiskt skannar utkast till motparten och raderar känslomässiga utsvävningar eller anklagelser innan de skickas.

## Matematik för siloisolering (entropi och läckageminskning)

För att matematiskt påvisa nödvändigheten av total fysisk och logisk isolering mellan datasilorna Kunskap ($X_K$), Ventil ($X_V$) och Barnen ($X_B$), definierar vi sannolikheten för korskontaminering ($P_c$) över $n$ oberoende sökoperationer (synapser):

$P_c = 1 - \prod_{i=1}^{n} (1 - p_i)$

Där $p_i$ representerar sannolikheten för dataläckage vid en enskild RAG-exekvering i synaps $i$. Genom att implementera strikta käll-isolerade IAM-roller och container-begränsade anropare (`knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery`), tvingar systemet läckagesannolikheten för tvärgående operationer till ett absolut nollvärde ($p_i = 0$), vilket medför en total containment-säkerhet:

$P_c = 1 - \prod_{i=1}^{n} (1 - 0) = 0$

Vidare genererar sammanblandning av olika dataklasser (såsom subjektiva emotionella reflektioner $X_R$ och objektiva rättsliga bevis $X_E$) en ökning av den sammanlagda informationsentropin ($H(X)$) inom sökningen, vilket dramatiskt ökar risken för att LLM-motorer hallucinerar i produktion. Den totala entropin för ett kombinerat söksystem uttrycks som:

$H(X) = - \sum_{i=1}^{m} p(x_i) \log_2 p(x_i)$

Där $p(x_i)$ representerar sannolikheten för förekomsten av token $x_i$ i det hämtade kontextfönstret. Genom att separera dataklasserna i ortogonala och isolerade databassamlingar, begränsas sökrummet till homogena dokumenttyper. Detta minimerar antalet brusande och motstridiga tokens, vilket håller den exekverade entropin på en minimal nivå och säkrar extremt precisa, kontext-relevanta och admissibility-säkrade modellsvar:

$H(X_{isolerad}) \ll H(X_{kombinerad})$

Detta matematiska ramverk understryker varför Livskompassen konsekvent avvisar alla former av sammanlagda eller "allomfattande" sökfunktioner i gränssnittet.
