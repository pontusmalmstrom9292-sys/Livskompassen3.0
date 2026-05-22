# Inkorg — UI/UX-analys från Desktop RTF

**Datum:** 2026-05-22  
**Källa:** `exempel på moduler design .rtf` (Desktop)  
**Status:** Inkorg — ej låst; jämför med [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)

**Not:** ModuleHubPanel 2×2 + Lucide-ikoner — närmast aktiv repo Variant C.

Sammanfattning av förändringarna i designrapporten:
	1.	Ikonografin är nu hårt specad med exakta Lucide-ikoner (Anchor, Heart, Compass, Sparkles, Users, Shield) som matchar dina kluster.
	2.	De nya funktionerna (JADE-varnaren under inmatningstexten och BIFF-triagen i Hamnen) har lagts till som L3-specifikationer under strikta regler för progressive disclosure (de visas bara när de faktiskt behövs).
	3.	P0-backloggen är strikt begränsad till 5 kritiska punkter för att minimera din kognitiva belastning.

Livskompassen v2 — UI/UX-analys (Navigation, Ikonografi & Menyer)

Datum: 2026-05-22
Kontext: Neuroinkluderande design för ADHD, GAD och RSD under hög allostatisk belastning.
Estetisk bas: Obsidian Calm / Nordic Dusk (mörk, dämpad, deterministisk).

Översikt över Navigationsarkitekturen (L1 → L2 → L3)

För att eliminera kognitiv friktion och förhindra desorientering vilar systemet på tre strikta hierarkiska nivåer. Ingen dubbel-navigation eller motstridiga TabBars tillåts.

L1: Livsområde (Modulhub via botten-dock, max 5 vyer)
  └── L2: Kluster-flik (Segmented TabBar under header, t.ex. ?tab=reflektion)
        └── L3: Modul-läge (Lokal state för specifik interaktion, t.ex. logga/sök)


Variant A: Det Deterministiska Flödet (Nuvarande bas, optimerad)

Denna variant renodlar och finjusterar den implementerade Variant C-navigationen från 2026-05-22. Fokus ligger på maximal förutsägbarhet, eliminering av oväntade animationer och tydliga taktila gränser.

1. Wireframe-beskrivning (Mobil 390×844)

• Header (Fast top): Dämpat guld-tonat / märke till vänster. Till höger: Minimalistisk batteri-liknande indikator för kognitiv belastning (Klar sikt / Safe Mode). Inga dropdown-menyer.

• Innehållsyta (Scrollbar, dämpad):

	• Överst: Ett (1) kontextuellt kort baserat på tid på dygnet (Morgon/Dag/Kväll) utan krav på prestation.

	• Mitten: ModuleHubPanel (2×2 grid av Bento-kort):

		• Topp-vänster: Hamnen (Anchor - /hamn) med texten "Den trygga hamnen".

		• Topp-höger: Familjen (Users - /familjen) med texten "Neutral loggning för Kasper & Arvid".

		• Botten-vänster: Vardagen (Compass - /vardagen) med texten "Daglig rytm och stress".

		• Botten-höger: Måbra-sidan (Sparkles - /mabra) med texten "Kravlöst självbygge".

• Botten-dock (Floating, fast): En svävande, djupt mörk obsidian-docka (#05080E) med 5 ikoner:

	• [Anchor (Hamnen)] [Compass (Vardagen)] [Heart (Hjärtat - Centrum, stor guldring)] [Sparkles (Måbra)] [Shield (Valvet)]

	• Fyren-feedback: Long-press (3 sekunder) på Heart ger en kort, distinkt haptisk vibration och avslöjar fliken bevis i Hjärtats L2-TabBar med en dämpad guldlinje runt fliken.

2. Informationsarkitektur



3. Tap-räkning (Kognitiv kostnad)

• A. Spara dagbok: 2 taps (Hjärtat L1 [1] → Klicka i textruta → Skriv → Spara [2]).

• B. Öppna Bevis via Fyren: 1 lång tryckning (Hjärtat L1 long-press 3s [1]).

• C. BIFF i Hamn: 2 taps (Hamnen L1 [1] → Klistra in text → Svara [2]).

4. Tillgänglighet & Avvisade element

• Tillgänglighet: aria-selected tillämpas strikt på aktiva flikar i botten-dockan. Kontrastförhållandet för text på #05080E är minst 7:1 (uppfyller WCAG AAA). Fokusmarkering sker med en dämpad guldram (#FDE68A) vid tangentbordsnavigation.

• Avvisat: Svepgester för att växla mellan L1-livsområden.

	• Varför: Svepgester orsakar oavsiktliga sidbyten vid rullning av långa loggar, vilket ökar arousal-nivån och triggar stress hos en ADHD-hjärna med motorisk rastlöshet.

Variant B: Den Radiala Fokuskompassen (Orbit-fokus)

Denna variant lyfter fram "The Orbit Menu" som det primära navet. Hela appen navigeras utifrån en central, taktil kompassros på hem-skärmen. Detta minskar det visuella bruset genom att endast visa en sak i taget.

1. Wireframe-beskrivning (Mobil 390×844)

• Header (Fast top): Fast text: "Fokusera Kompassen". Inga ikoner eller knappar.

• Innehållsyta (Fast, icke-scrollbar):

	• En stor, dämpat glödande cirkulär kompass (#0A1121) i mitten av skärmen (diameter 280px).

	• I mitten av cirkeln: En konstant låst status ("NU").

	• Runt cirkelns kant finns 4 sfäriska noder: Hamnen (Anchor, Norr), Vardagen (Compass, Söder), Måbra (Sparkles, Väst), Familjen (Users, Öst).

	• Genom att rotera (snurra) eller klicka på en nod skiftar mittencirkeln färg och visar det valda områdets mest akuta mätvärde.

• Botten-dock (Smal): Endast två fasta knappar: [Compass (Hem)] och [Heart (Hjärtat/Fyren)].

	• Fyren-feedback: Long-press på Hjärtat lyser upp hela den yttre kompassringen i ett dämpat violett ljus och låser upp en femte, tidigare osynlig central nod på hjulet: Verklighetsvalvet (Shield).

2. Informationsarkitektur



3. Tap-räkning (Kognitiv kostnad)

• A. Spara dagbok: 2 taps (Hjärtat L1 [1] → Skriv → Spara [2]).

• B. Öppna Bevis via Fyren: 2 steg (Long-press Hjärtat [1] → Klicka på den nya noden "Valvet" på hjulet [2]).

• C. BIFF i Hamn: 2 taps (Klicka på Hamnen-noden på hjulet [1] → Klistra in text → Svara [2]).

4. Tillgänglighet & Avvisade element

• Tillgänglighet: Alla kompassnoder har en minsta klickyta på 48×48px för att säkerställa enkel interaktion även vid darrande fingrar under ångestpåslag. Aktiv nod indikeras med aria-selected="true".

• Avvisat: Automatisk rotering av hjulet baserat på gyroskop eller tidsinställning.

	• Varför: Ofrivilliga rörelser på skärmen bryter mot principen om deterministisk feedback och kan förvärra fysiologisk yrsel eller kognitiv trötthet.

Variant C: Den Kontextuella Strömmen (Linjärt flöde)

Denna variant skrotar den traditionella dashboarden. Hem-skärmen är en linjär ström av kontextuella kort ordnade efter allostatisk belastning och biologisk rytm. Det är ett system som aktivt guidar dig steg-för-steg.

1. Wireframe-beskrivning (Mobil 390×844)

• Header (Fast top): Visar endast nuvarande KASAM-huvudfokus ("Hanterbarhet").

• Innehållsyta (Vertikal ström):

	• Kort 1 (Alltid överst): Akut-triggern. En stor, mjukt pulserande knapp: "Känner du stress just nu? Tryck här för 2 minuters andning".

	• Kort 2: Dagens fokus. En ren och avskalad inmatningsyta för det nuvarande livsområdet (t.ex. "Familjen: Hur mår Kasper?").

	• Kort 3: Sista bekräftelsen. En enkel sammanfattning av det senaste sparade WORM-beviset för att ge en omedelbar trygghetskänsla mot gaslighting.

• Botten-dock: Ingen fast docka. Istället används en minimal tillbakaknapp och en global "Spegla"-knapp (BookOpen) i guld som öppnar en tillfällig bottenmeny (Bottom Sheet) för akut Grey Rock-analys.

2. Informationsarkitektur



3. Tap-räkning (Kognitiv kostnad)

• A. Spara dagbok: 3 taps (Klicka global knapp [1] → Välj Reflektion [2] → Skriv → Spara [3]).

• B. Öppna Bevis via Fyren: 2 steg (Long-press global knapp 3s [1] → Välj Bevis [2]).

• C. BIFF i Hamn: 3 taps (Öppna global knapp [1] → Välj Spegling [2] → Kör analys [3]).

4. Tillgänglighet & Avvisade element

• Tillgänglighet: Stark visuell hierarki med stor kontrast mellan korten och bakgrunden. Inga dolda gester krävs för basfunktioner.

• Avvisat: Bottom Sheets som kan stängas genom att svepa nedåt.

	• Varför: Det är mycket vanligt att man råkar stänga en påbörjad textinmatning av misstag vid svepning, vilket leder till förlorad data. Detta är katastrofalt för en stressad ADHD-hjärna och kan trigga ett kraftigt RSD-påslag.

Jämförelse och Utvärdering



Ikonografi (Strikt specifikation)



Nya Funktioner & Menyer (Progressive Disclosure)

För att bevara "Zero Footprint" och förhindra kognitivt överväldigande introduceras inga globala sidomenyer eller komplexa inställningspaneler. Istället integreras funktionerna kontextuellt i L3-lägen:

1. JADE-realtidsvarnare (L3 - Inuti textfälten under Speglar/Loggning)

• Placering: Ligger dold under inmatningsfälten i reflektion och speglar.

• Mekanism: Söker av textsträngen i realtid efter mönster som indikerar att användaren förklarar eller försvarar sig (t.ex. "eftersom", "förlåt", "för att", "du måste förstå").

• Visuell output: Om mönster hittas, tonar en mjuk guldsköld (#FDE68A) upp i nederkant med texten: “JADE-risk upptäckt. Stryk allt som förklarar varför.” Ersätter äldre, statiska instruktioner.

2. BIFF-triage & Textrensning (L3 - Inuti Hamnen /hamn)

• Placering: Ersätter den statiska supportsidan i Hamnen när ett meddelande klistras in.

• Mekanism: Delar upp inkommande meddelanden i en ren, tvådelad tabell:

    1. Logistik (10%): Faktiska tider, platser, datum (behålls).

    2. Känslomässiga beten (90%): Projektioner, anklagelser och hot (maskeras automatiskt till grå, oläsbar text).

• Visuell output: Genererar tre färdiga, stensäkra BIFF-svar med en-klickskopiering till urklipp.

Rekommenderad Variant: Variant A (Det Deterministiska Flödet)

Motivering

Variant A är den absolut bäst lämpade navigationsstrukturen för ditt nuvarande tillstånd. Den minimerar överraskningsmoment och oväntade gränssnittsförändringar, vilket är avgörande när ditt nervsystem befinner sig i hypervigilans.

Genom att använda en fast botten-docka med tydligt separerade L1-områden vet din hjärna alltid exakt var den befinner sig. Långtrycket på Hjärtat (Fyren) ger en diskret och helt privat åtkomst till ditt skyddade Verklighetsvalv, utan att dra till sig uppmärksamhet från omgivningen eller skapa visuell oreda på skärmen.

Prioriterad Backlog (Implementeringsplan)

P0: Absoluta måsten (Säkerhet & Nervsystem) — Max 5 poster

1. Fyren-låset (3s long-press på Hjärtat): Säkra att den dolda bevis-fliken under Hjärtat endast kan låsas upp genom ett medvetet, tre sekunder långt tryck med haptisk vibration.

2. Permanent tidsstämplat WORM-bevis: Säkerställ att sparade bevis tidsstämplas och låses permanent i databasen så att de inte kan redigeras eller raderas under stress.

3. JADE-realtidsvarnare (L3): Integrera den automatiska analysen som varnar med en dämpad guldsköld när användaren skriver ord som bjuder in till försvar ("eftersom", "förlåt", "för att").

4. BIFF Triage-motor (L3): Implementera mönsterigenkänning för att automatiskt sortera ut ren logistik (10 %) och maskera destruktiva känslomässiga beten (90 %).

5. Akuta Vagus-andningen (Safe Mode): Bygg klart den taktila andningscoachen (4-4-5 takt) som dämpar fysiologisk ångest och RSD-påslag vid högt allostatiskt tryck.

P1: Viktiga funktioner (Stabilitet & Struktur)

• Korsreferens-motor (Sökfunktion): Koppla ihop sökfältet i Hamnen så att du direkt kan söka efter nyckelord i dina sparade bevis och hälsohistorik för en snabb verklighetskontroll.

• Zero-Pressure Balansmätare: Ersätt alla felmeddelanden och tomma, grå mätare med mjuka, validerande texter som uppmuntrar utan att skapa stress.

P2: Optimering (Estetik & Finish)

• Dämpad bakgrundsglöd (Obsidian Glow): Finjustera de djupt blå och violetta skuggorna bakom glas-korten för att skapa en visuell känsla av lugn och rymd.

• Dossier-exportör: Skapa en enkel funktion för att exportera dina tidsstämplade och låsta WORM-bevis till ett rent, formellt PDF/JSON-dokument (för eventuell juridisk användning).
