> **LOCKED UX §23 / MOD-WIDGET** — Companion Widget OS får inte tas bort. Unlock kräver `docs/evaluations/*-unlock-MOD-WIDGET.md` (`approved: yes`) + Pontus OK. Smoke: `npm run smoke:companion-widgets`.

Perfekt. Då börjar vi på riktigt.

Det här blir Kapitel 1 i Livskompassen Companion Widget Bible. Jag skriver det som om det vore ett dokument för ett professionellt produktteam hos Apple, Google eller Notion. Det här är inte bara idéer – det är regler som resten av systemet ska följa.


---

LIVSKOMPASSEN COMPANION WIDGET BIBLE

Version 1.0

Kapitel 1 – Vision & Filosofi


---

1.0 Syfte

Companion Widget System är inte ett tillägg till Livskompassen.

Det är en naturlig förlängning av Livskompassen.

Användaren ska kunna leva sitt liv utan att behöva öppna appen varje gång något händer.

Widgetarna ska göra Livskompassen närvarande under dagen på ett lugnt, intelligent och icke-störande sätt.

Målet är inte att visa information.

Målet är att minska mental belastning.


---

1.1 Vision

Livskompassen ska bli världens mest genomtänkta Companion OS för Android.

Widgetarna ska fungera som ett externt arbetsminne.

De ska hjälpa användaren att:

komma ihåg

fånga tankar

strukturera dagen

skapa trygghet

minska stress

dokumentera livet

hålla fokus


utan att skapa mer brus.


---

1.2 Designfilosofi

Varje widget ska följa dessa principer.

Regel 1

En widget får aldrig kännas överbelastad.

Hellre:

tre perfekta funktioner

än

tolv medelmåttiga.


---

Regel 2

Information ska vara tydlig inom en sekund.

Användaren ska aldrig behöva tänka:

"Hur fungerar den här?"


---

Regel 3

En widget ska alltid kännas levande.

Den ska uppdateras.

Andas.

Reagera.

Men aldrig störa.


---

Regel 4

Widgeten ska vara en del av Livskompassen.

Inte en separat produkt.


---

Regel 5

Allt ska kunna göras med en hand.


---

Regel 6

Ingen interaktion ska kräva onödiga steg.

Exempel.

Fel:

Widget

↓

Öppna app

↓

Öppna modul

↓

Tryck spela in

Rätt:

Widget

↓

Spela in.

Klart.


---

1.3 Designmål

Varje widget ska uppnå:

Extrem tydlighet

Premiumkänsla

Låg kognitiv belastning

Snabb interaktion

Minimal batteriförbrukning

Omedelbar respons

Samma visuella identitet som appen



---

1.4 Kognitiva principer

Livskompassen bygger på idén att hjärnan inte ska användas som lagringsplats.

Widgetarna ska därför fungera som:

ett externt arbetsminne

ett externt anteckningsblock

ett externt beslutsstöd


Användaren ska kunna "tömma huvudet" med ett enda tryck.


---

1.5 Companion OS

Widgetarna ska tillsammans bilda ett eget operativsystem ovanpå Android.

Det innebär att de:

kommunicerar med varandra

delar design

delar animationer

delar cache

delar AI

delar datamodell


De är inte fristående widgets.

De är moduler i ett gemensamt system.


---

1.6 Kärnvärden

Varje widget ska kunna beskrivas med fem ord:

Trygghet

Enkelhet

Sanning

Fokus

Närvaro


Om en funktion inte stärker minst ett av dessa värden ska den omprövas.


---

1.7 Den gyllene regeln

Varje interaktion ska kunna besvaras med frågan:

"Hjälper detta användaren att tänka mindre?"

Om svaret är nej ska lösningen förenklas.


---

1.8 Premiumkänsla

Widgetarna ska ge samma känsla som en premiumprodukt.

Material

Mörkt safirglas

Djup mattyta

Borstad metall

Guldaccenter

Diskreta ljusreflektioner


Rörelse

Lugna animationer

Inga ryckiga rörelser

Haptik vid viktiga handlingar

Mjuka övergångar


Typografi

Tydliga rubriker

Hög kontrast

God läsbarhet

Luft mellan element



---

1.9 Widgethierarki

Alla widgets delas in i fyra nivåer.

Nivå 1 – Capture

Fånga information.

Exempel:

Röst

Text

Bild

Länk



---

Nivå 2 – Action

Utför en handling.

Exempel:

Kryssa uppgift

Starta dagbok

Logga barnaktivitet

Markera dagens ankare



---

Nivå 3 – Insight

Visa relevant information.

Exempel:

Dagsform

Fokus

Energi

Kompass

Fyrstatus



---

Nivå 4 – Adaptive

AI avgör automatiskt vad som ska visas baserat på:

Tid på dagen

Kalender

Dagsform

Tidigare användning

Prioriteringar



---

1.10 Framgångskriterier

Companion Widget System är framgångsrikt när:

De flesta vardagliga handlingarna kan utföras från hemskärmen.

Widgetarna känns som en naturlig del av Livskompassen.

De minskar behovet av att öppna appen.

De bidrar till lägre kognitiv belastning.

De är snabba, tillförlitliga och konsekventa.

De upplevs som en premiumupplevelse på Android.



---

Nästa kapitel

Kapitel 2 – UX Laws & Cognitive Design blir grunden för alla beslut i widgetsystemet. Där definierar vi de lagar som varje widget, knapp, animation och interaktion måste följa för att skapa en konsekvent, neuroanpassad och premium upplevelse. Det kapitlet blir styrande för all framtida design och utveckling av Companion Widget System.


LIVSKOMPASSEN COMPANION WIDGET BIBLE

Kapitel 2 – UX Laws & Cognitive Design

Version: 1.0
Status: Foundation Document


---

2.0 Syfte

Detta kapitel definierar de lagar som ALLA widgets måste följa.

Detta är inte rekommendationer.

Detta är absoluta regler.

Om en widget bryter mot en av dessa regler ska den omarbetas.


---

UX LAW 01

En sekunds-regeln

Användaren ska förstå:

vad widgeten gör

vad som är viktigast

var man ska trycka


inom en sekund.

Om det tar längre tid är designen fel.


---

UX LAW 02

Ett tryck ska räcka

Den vanligaste handlingen ska alltid kunna utföras med ett enda tryck.

Exempel

❌ Fel

Widget

↓

Öppna app

↓

Öppna modul

↓

Ny anteckning

↓

Spara


---

✅ Rätt

Widget

↓

Skriv

↓

Spara

Klart.


---

UX LAW 03

Visa bara det viktigaste

Widgetar är inte små appar.

De ska bara visa information som hjälper användaren just nu.

Inte allt.


---

UX LAW 04

Handling före information

En widget ska hjälpa användaren göra något.

Inte bara läsa något.

Prioritet:

1 Handling

2 Status

3 Information


---

UX LAW 05

Stora tryckytor

Alla primära knappar ska kunna användas med en tumme.

Minimum:

56 dp

Premium:

64–72 dp


---

UX LAW 06

Noll frustration

Det ska aldrig finnas:

små ikoner

svårtolkade symboler

dolda menyer

otydliga gester



---

UX LAW 07

Tyst design

Widgeten ska aldrig skrika.

Den ska kännas lugn.

Färger används endast för:

prioritet

status

varningar

framgång


Inte dekoration.


---

UX LAW 08

Rörelse har ett syfte

Animationer ska:

visa förändring

eller

bekräfta handling.

Inte imponera.


---

UX LAW 09

Direkt feedback

Varje tryck ska ge omedelbar återkoppling:

Haptik

Visuell förändring

Bekräftelse

Synkstatus


Användaren ska aldrig undra om något hände.


---

UX LAW 10

Offline först

Widgetarna ska fungera även utan internet.

Alla handlingar sparas lokalt.

Synk sker automatiskt när uppkoppling finns.


---

UX LAW 11

Ingen informationsstress

Visa aldrig:

tio siffror

långa listor

stora tabeller

komplex statistik


Visa istället:

nästa steg

dagens fokus

senaste aktivitet



---

UX LAW 12

Kontext före navigation

Widgeten ska förstå sammanhanget.

Exempel

07:00

↓

Visa dagens plan.

20:30

↓

Visa dagbok.

Barnvecka

↓

Visa familjen.


---

UX LAW 13

Progression ska kännas

När något blir klart ska användaren känna det.

Exempel:

✓ Haptik

✓ Checkmark

✓ Kort animation

✓ Diskret ljud (valbart)


---

UX LAW 14

Premiumkänsla

Varje widget ska upplevas som ett premiumobjekt.

Material

Mörkt safirglas

Djup mattyta

Borstad metall

Guldaccenter


Ljus

Mjuka reflektioner

Inga starka neonfärger


Djup

Flera skugglager

Subtila höjdskillnader

Tydliga kort



---

UX LAW 15

Allt ska vara konsekvent

Alla widgets använder:

samma knappar

samma animationer

samma hörnradie

samma ikoner

samma typografi

samma färger



---

Cognitive Design

Regel 1

Hjärnan ska inte komma ihåg.

Widgeten ska göra det.


---

Regel 2

Visa nästa steg.

Inte hela planen.


---

Regel 3

Minska val.

Tre val är nästan alltid bättre än tio.


---

Regel 4

Visa bara relevant information.

Inte all information.


---

Regel 5

Använd igenkänning.

Inte minne.


---

Mental Load Framework

Varje widget ska minska minst en av dessa belastningar:

Minnesbelastning

Exempel

Snabbanteckning.


---

Beslutsbelastning

Exempel

Dagens viktigaste uppgift.


---

Planeringsbelastning

Exempel

Dagens ankare.


---

Känslomässig belastning

Exempel

Trygg Hamn.


---

Informationsbelastning

Exempel

Sammanfattningar istället för listor.


---

Widget Personality

Widgetarna ska kännas:

Lugna

Pålitliga

Vänliga

Premium

Intelligenta


De ska aldrig upplevas som:

Stressande

Skrikiga

Röriga

Komplicerade

Påträngande



---

Companion Intelligence

Widgetarna ska lära sig användarens mönster över tid.

Exempel:

Vilka widgetar används mest?

Vilken tid används de?

Vilka funktioner används oftast?

Vilka moduler öppnas efter varandra?


Denna information ska användas för att förbättra upplevelsen, inte för att skapa onödiga avbrott.


---

Definition of Success

En widget är lyckad när:

Den förstås på under en sekund.

Den vanligaste handlingen kräver högst ett tryck.

Den minskar användarens mentala belastning.

Den känns som en naturlig del av Livskompassen.

Den upplevs som snabb, trygg och konsekvent.



---



LIVSKOMPASSEN COMPANION WIDGET BIBLE
Kapitel 3 – Widget Framework
Version: 1.0
Status: Foundation Document
3.0 Syfte
Detta kapitel definierar den tekniska arkitekturen och komponentsystemet för Companion Widget System.
Det säkerställer att alla widgets delar samma motor, samma cache, samma interaktionslager och samma visuella språk.
Genom att bygga på ett gemensamt ramverk eliminerar vi dubblerad kod, garanterar noll fördröjning i gränssnittet och upprätthåller en konsekvent premiumkänsla i hela systemet.
3.1 Mappstruktur & Arkitektur
Alla widgets ska byggas inom följande strikt modulariserade struktur i kodbasen:
src/
└── widgets/
    ├── core/
    │   ├── WidgetFramework.ts
    │   ├── WidgetActions.ts
    │   ├── WidgetRouter.ts
    │   ├── WidgetTheme.ts
    │   ├── WidgetAnimations.ts
    │   ├── WidgetSync.ts
    │   ├── WidgetCache.ts
    │   └── WidgetPermissions.ts
    └── components/
        ├── WidgetCard.tsx
        ├── WidgetHeader.tsx
        ├── WidgetButton.tsx
        ├── WidgetGlass.tsx
        ├── WidgetProgress.tsx
        └── WidgetQuickAction.tsx

3.2 Core Modules (Kärntjänster)
Varje core-fil har ett entydigt ansvarsområde. Ingen logik får blandas mellan modulerna.
WidgetFramework.ts
 * Systemets övergripande motor.
 * Hanterar livscykel, registrering av nya widgets och kommunikation med huvudappen.
WidgetActions.ts
 * Det centrala händelseskiktet.
 * Tolkar användarens gester (Kort tryck, Långtryck, Dubbeltryck, Svep) och omvandlar dem till standardiserade handlingar.
WidgetRouter.ts
 * Dirigerar handlingar till rätt destination.
 * Avgör om en handling ska utföras helt i bakgrunden, öppna ett litet overlay eller slussas vidare till en specifik modul i appen.
WidgetTheme.ts
 * Systemets design-tokens.
 * Håller centrala värden för färger (Mörkt safirglas, borstad metall, guldaccenter), typografi, marginaler, skuggor och hörnradie.
WidgetAnimations.ts
 * Standardiserade rörelsemönster.
 * Innehåller alla prestandaoptimerade mikromotioner för tryckrespons, roterande kompasser, "andande" fyrar och mjuk öppning/stängning.
WidgetSync.ts
 * Ansvarar för köhantering och bakgrundssynkronisering.
 * Säkerställer att alla handlingar utförda offline köas säkert och skickas till Firestore så fort nätverk ansluts.
WidgetCache.ts
 * Lokal, blixtsnabb datalagring för hemskärmen.
 * Garanti för 0 ms laddningstid vid rendering. Hämtar alltid data från den lokala cachen först.
WidgetPermissions.ts
 * Diskret hantering av systembehörigheter (mikrofon för röstinspelning, kamera för foto, etc.).
 * Begär endast behörigheter i samband med att funktionen faktiskt anropas.
3.3 Shared Components (Komponentbibliotek)
Alla widgets måste byggas uteslutande med hjälp av dessa återanvändbara UI-komponenter.
WidgetCard.tsx
 * Grundbehållaren för varje widget.
 * Innehåller flerskiktade premiumskuggor, rundade hörn och anpassning för storlekarna XS, Small, Medium och Large.
WidgetHeader.tsx
 * Enhetlig överdel med ikon, rubrik, statusindikator och diskret synk-ikon om systemet är offline.
WidgetButton.tsx
 * Ergonomisk tryckyta.
 * Uppfyller alltid kravet på 56–72 dp i storlek för enhandsanvändning. Inbyggd direktåterkoppling via haptik.
WidgetGlass.tsx
 * Det visuella materialskiktet.
 * Skapar effekten av mörkt safirglas, mattyta och subtila, lugna ljusreflektioner som ger premiumkänsla utan att distrahera.
WidgetProgress.tsx
 * Cirkulära och linjära förloppsindikatorer med mjuk, organisk animering för energi, dagsform och slutförda uppgifter.
WidgetQuickAction.tsx
 * Direktyta för snabbåtgärder i Capture- och Action-widgets (t.ex. starta röstinspelning, ta ett foto eller klicka i ett ankare).
3.4 Dataflöde & Offline-arkitektur
För att garantera omedelbar respons och eliminerad väntetid följer alla widgets samma enkelriktade dataflöde:
[Användarinteraktion]
        │
        ▼
[Widget Action Handler]
        │
        ▼
[Widget Cache (Sparas lokalt: 0ms fördröjning)]
        │
        ├──► [UI Uppdateras direkt med bekräftelse & Haptik]
        │
        ▼
[Widget Sync (Bakgrundskö)]
        │
        ▼
[Firestore / Livskompassen Database]

Regler för dataflödet:
 * UI väntar aldrig på nätverket: Användargränssnittet ska alltid reagera omedelbart som om handlingen redan är genomförd.
 * Kraschsäkerhet: Om telefonen stängs av precis efter en handling ska data finnas kvar i WidgetCache.
3.5 Interaktions- & Haptiklager
Alla widgets ska stödja följande standardiserade gester och ge motsvarande haptiska återkoppling:
 * Kort tryck (Tap):
   * Syfte: Primär handling (kryssa för, spela in, öppna).
   * Haptik: Kort, crisp stöt (Light Impact).
 * Långtryck (Long Press):
   * Syfte: Sekundär funktion / Dold snabbåtgärd (t.ex. diskret inspelning).
   * Haptik: Djupare, tvådelad tryckvåg (Medium/Heavy Feedback).
 * Dubbeltryck (Double Tap):
   * Syfte: Navigera till eller öppna senaste relaterade aktivitet.
   * Haptik: Två snabba mikrostötar.
 * Svep (Swipe):
   * Syfte: Avbryt eller rensa pågående åtgärd.
   * Haptik: Mjuk uttonande vibration.
3.6 Prestanda & Batteriprinciper
 * Noll bakgrundsdränering: Widgetarna får inte köra kontinuerliga bakgrundstjänster som drar batteri. Synk sker via schemalagda OS-händelser eller vid aktiv interaktion.
 * Effektiv rendering: Ingen komponent får re-renderas om inte dess underliggande tillstånd (state) i WidgetCache faktiskt har ändrats.
 * Lättvikts-tillgångar: Alla ikoner ska vara optimerade SVG-vektorer. Inga tunga bildfiler får laddas direkt i widgetytan.
3.7 Definition of Done (För utveckling i Cursor)
En widget-komponent anses inte vara färdig förrän den uppfyller följande:
 * [ ] Är uppbyggd helt med src/widgets/components/.
 * [ ] Svarar på användarinteraktion inom 0 millisekunder (via lokal cache).
 * [ ] Ger haptisk återkoppling vid samtliga gester.
 * [ ] Fungerar felfritt i offlineläge och synkar korrekt när täckning återfås.
 * [ ] Följer färg- och materialreglerna för mörkt safirglas och lugn design.
 * [ ] Har en testad tryckyta på lägst 56 dp för samtliga klickbara element.


LIVSKOMPASSEN COMPANION WIDGET BIBLE
Kapitel 4 – Core Widget Pack & Specifications
Version: 1.0 Status: Foundation Document
4.0 Syfte
Detta kapitel definierar layout, interaktion och syfte för de 10 kärnwidgetarna i Livskompassen Companion OS.
Dessa är inte framtida visioner, utan den exakta specifikationen för Etapp 3 i utvecklingsplanen. Varje widget är designad för att lösa ett specifikt problem med lägsta möjliga kognitiva friktion.
4.1 Standardiserade Storlekar
Alla widgets måste byggas i en eller flera av dessa fördefinierade storlekar:
XS (2x2): En enda, extremt tydlig funktion.
Small (4x2): Titel, status, en primär handling och max två sekundära.
Medium (4x3): Innehåll, senaste aktivitet, progress och flera knappar.
Large (4x4): En premium mini-version av en hel modul.
4.2 Specifikation: Kärnwidgets
Widget 1: 🎙 Quick Capture
Prioritet: ⭐⭐⭐⭐⭐
Syfte: Fånga tankar snabbare än hjärnan hinner glömma dem.
Storlek: Small (4x2)
Interaktioner:
Kort tryck: Startar röstinspelning (direkt haptik).
Långtryck: Dold, ljudlös inspelning i bakgrunden.
Släpp: Sparar direkt till Inkast.
Dubbeltryck: Öppnar senaste inspelningen.
Svep: Avbryter pågående inspelning.
Kognitiv lag: Minnesbelastning eliminerad.
Widget 2: 🧭 Kompassen
Prioritet: ⭐⭐⭐⭐⭐
Syfte: Navet i Companion OS. Systemets vackraste komponent.
Storlek: Large (4x4) / Medium (4x3)
Visuellt: Stor metallkompass med dynamiska ljusreflektioner och premiumskuggor.
Interaktioner:
Kort tryck: Kompassen vrider sig fysiskt (med krispig haptik) och öppnar aktuell/senaste modul.
Långtryck: Fäller ut en dold snabbmeny.
Widget 3: 📝 Snabbanteckning
Syfte: Omedelbar textinmatning utan app-byte.
Storlek: Small (4x2)
Layout: En ren textyta ("Skriv...") med tre diskreta underalternativ: Spara, Röst, Bild.
Beteende: Tangentbordet fälls upp direkt på hemskärmen. Texten skickas direkt till rätt silo.
Widget 4: 📥 Inkast
Syfte: Den universella inkorgen för allt.
Storlek: XS (2x2) eller Small (4x2)
Layout: Fyra symmetriska knappar: Text, Röst, Foto, Länk.
Interaktion: Ett tryck. Åtgärden startar direkt. Klart.
Widget 5: ⚓ Dagens Ankare
Syfte: Minska planeringsbelastning till ett enda mikrosteg.
Storlek: XS (2x2)
Innehåll: Visar ankarsymbol (⚓) och texten "Ett mikrosteg räcker".
Interaktion: Tryck på [ Klar ] genererar en kort framgångsanimation, direkt haptisk bekräftelse och ett subtilt checkmark.
Widget 6: 👦 Barnfokus
Syfte: Fånga de små, viktiga detaljerna i föräldraskapet utan ansträngning.
Storlek: Medium (4x3)
Innehåll: Visar "Dagens fråga" (Exempel: Vad skrattade Kasper åt idag?) samt genväg till senaste logg.
Interaktion: Tryck på [ Svara ] fäller upp ett litet overlay för text/röst, utan att öppna hela appen.
Widget 7: 💙 Fyren
Syfte: Omedelbar insikt i dagsform utan att behöva analysera data.
Storlek: Medium (4x3)
Visuellt: En premium-ring som "andas" långsamt.
Innehåll: Diskret data för Energi, Stress, Kapacitet och Sömn visualiserat som mjuka, överlappande ringar.
Interaktion: Tryck öppnar dagsforms-modulen.
Widget 8: 📋 Dagens Uppgifter
Syfte: Reducera beslutsbelastning. Visa bara nästa steg.
Storlek: Small (4x2) eller Medium (4x3)
Innehåll: Visar maximalt tre kritiska uppgifter med tydliga checkboxar.
Beteende: Kryssar användaren i en ruta uppdateras Firestore direkt (via cachen), uppgiften tonar ut mjukt och nästa glider in.
Widget 9: 📓 Dagbok
Syfte: Sänka tröskeln för reflektion till noll.
Storlek: Small (4x2)
Innehåll: Visar användarens senaste registrerade känsla eller texten "Reflektera i en minut."
Interaktion: En enda knapp: "Skriv".
Widget 10: ❤️ Trygg Hamn
Syfte: Omedelbar emotionell reglering och sänkt allostatisk belastning.
Storlek: Small (4x2) eller Medium (4x3)
Innehåll: En dynamisk men tyst yta som visar lugnande text, dagens affirmation eller ett rekommenderat mikrosteg.
Visuellt: Mjuk, långsam animation (andas-tempo) med djup mattyta.
4.3 Data Routing (Hur informationen färdas)
När en av kärnwidgetarna tar emot data (text, ljud, status) ska flödet hanteras blint av användaren.
Exempel på Data Routing för Widget 1 & 4:
Användaren pratar in ett memo.
WidgetActions.ts registrerar handlingen.
Filen lagras direkt i WidgetCache.
WidgetSync.ts taggar den med type: capture, source: widget_voice.
Så fort nätverk finns laddas filen upp till Livskompassens "Inkast"-silo i Firestore. Appen sorterar därefter upp det (AI eller manuellt).


LIVSKOMPASSEN COMPANION WIDGET BIBLE
Kapitel 5 – Widget Studio & Smart Capabilities
Version: 1.0
Status: Foundation Document
5.0 Syfte
Detta kapitel definierar hur systemet anpassar sig efter användaren.
Companion OS ska inte vara statiskt. Det ska vara intelligent, kontextmedvetet och djupt personligt, utan att kräva konstant handpåläggning.
Vi delar in detta i två delar: Widget Studio (användarens medvetna kontroll) och Smart Capabilities (systemets proaktiva anpassning).
5.1 Widget Studio
Widget Studio är kontrollrummet för Companion OS. Det är en dedikerad, vacker och lugn miljö inuti Livskompassen-appen där användaren bygger sin hemskärm.
Navigationshierarki:
Inställningar → Widget Studio → Mina Widgets
Anpassningsmöjligheter:
I Widget Studio ska användaren med enkla, visuella reglage kunna skräddarsy varje enskild widget. Processen ska kännas som att konfigurera en urtavla på en premiumklocka.
Användaren kan välja:
 * Storlek: XS, Small, Medium, Large.
 * Modul: Vilken del av Livskompassen widgeten ska spegla (Inkast, Dagbok, Fyr, etc.).
 * Tema & Färg: Materialval (Mörkt safirglas, matt metall) och accentfärger (t.ex. guld för Trygg Hamn, mörkblått för Fyren).
 * Animation: Välja vilken typ av vilande rörelse widgeten ska ha (t.ex. "Andas", "Långsam rotation" eller "Statisk").
 * Information: Exakt vilken data som ska visas (t.ex. dölja stressnivå och bara visa energi).
 * Genvägar: Vilka knappar som ska visas (t.ex. byta ut "Länk" mot "Video" i Inkast-widgeten).
5.2 Konfigurationsfilosofi (Guided Customization)
Användaren får stor frihet, men systemet tillåter aldrig att en widget konfigureras så att den bryter mot UX Laws (Kapitel 2).
 * Systemet tillåter inte fler knappar än vad storleken (XS/Small/Medium) klarar av med bibehållen 56 dp tryckyta.
 * Färgvalen är låsta till Livskompassens kognitivt säkra palett (inga neonfärger eller skrikiga kontraster).
 * Målet är "frihet inom trygga ramar".
5.3 Smart Widgets (Tidsstyrd Kontext)
Smarta widgets ändrar automatiskt sitt innehåll och sin primära funktion baserat på tid på dygnet. Användaren ska inte behöva byta ut widgets manuellt.
Exempel på schemalagd anpassning:
 * 07:00 (Morgon):
   * Fokus: Framåtblick och struktur.
   * Innehåll: Visar "Dagens plan" eller de tre viktigaste uppgifterna.
 * 12:00 (Mitt på dagen):
   * Fokus: Paus och återhämtning.
   * Innehåll: Visar påminnelse om lunch, vatten eller ett mikrosteg för att bryta stress.
 * 18:00 (Kväll):
   * Fokus: Närvaro och övergång.
   * Innehåll: Visar "Familjen", barnfokus-frågor eller stänger ner arbetsrelaterad data.
 * 22:00 (Natt):
   * Fokus: Nedvarvning och avslut.
   * Innehåll: Visar "Dagbok" (reflektera i en minut) eller "Trygg Hamn" med en dämpad visuell profil.
5.4 Widget AI (Tillståndsbaserad Kontext)
Detta är den mest avancerade nivån av Companion OS. Här styr inte bara klockan, utan kontexten och dagsformen. AI analyserar användarens aktuella tillstånd och byter ut widgetens yta för att erbjuda exakt rätt stöd i rätt sekund.
Regler för AI-anpassning:
AI-beslut får aldrig kännas ryckiga, överraskande eller invasiva. Övergångarna sker mjukt när skärmen är släckt eller via lugna, långsamma animationer.
Scenario-exempel:
 * Scenario 1: Hög allostatisk belastning / Stress
   * Trigger: Fyren indikerar hög stress eller hög kognitiv belastning.
   * Åtgärd: Widgeten döljer automatiskt "Dagens uppgifter" och visar istället en andningsövning eller ett lugnande citat från Trygg Hamn.
 * Scenario 2: Informationsöverbelastning
   * Trigger: Många oavslutade uppgifter i listan.
   * Åtgärd: Widgeten filtrerar stenhårt och visar uteslutande en enda sak – det absolut viktigaste nästa steget.
 * Scenario 3: Barnvecka
   * Trigger: Kalendern indikerar att det är användarens vecka med barnen.
   * Åtgärd: Barnfokus-modulen och Familjen får förtur på hemskärmen. Uppgiftswidgeten prioriterar hushållslogistik framför arbetsuppgifter.
 * Scenario 4: Låg energi (Krasch-prevention)
   * Trigger: Dagsformen visar låg energi och dålig sömn.
   * Åtgärd: Kravnivån sänks till botten. Systemet visar enbart Dagens Ankare ("Ett mikrosteg räcker") och pausar alla proaktiva påminnelser.
5.5 Framgångskriterier för AI & Smart Capabilities
Vi vet att kapitel 5 är framgångsrikt implementerat när:
 * Användaren känner att systemet "läser rummet" och aldrig kräver prestation när energin är låg.
 * Hemskärmen känns som en dynamisk spegel av dygnet, utan att upplevas som rörig.
 * Anpassningen i Widget Studio är rolig, kreativ och djupt tillfredsställande, men omöjlig att "göra fel" i.


LIVSKOMPASSEN COMPANION WIDGET BIBLE
Kapitel 6 – Visual Identity & Design Tokens Version: 1.0 Status: Foundation Document
6.0 Syfte
Detta kapitel översätter den filosofiska och kognitiva grunden till exakta visuella regler.
Designen är inte bara estetik – den är ett verktyg för emotionell reglering. Varje pixel, skugga och färgton är utformad för att omedelbart sänka pulsen, signalera trygghet och eliminera visuell stress.
Referensbilderna (1000006784.png och 1000006785.png) utgör den absoluta standarden ("The Gold Standard") för hur gränssnittet ska se ut.
6.1 Färgpalett (The Palette of Calm)
Systemet använder en extremt restriktiv färgpalett anpassad för mörkerläge, för att undvika överstimulering av nervsystemet.
Obsidian / Deep Space Blue: Den primära bakgrundsfärgen. En extremt mörk, rik blåsvart ton. Den känns oändlig, djup och dämpande.
Premium Gold: Den primära accentfärgen för ramar, typografi (rubriker), ikoner och den primära åtgärdsknappen (+). Guldet ska vara dämpat och metalliskt, inte skrikigt gult.
Ethereal Blue: Den aktiva accentfärgen. Används uteslutande för att visa pågående aktivitet eller liv (t.ex. ljudvågor vid inspelning, kapacitetsmätaren, andningslotusen).
Muted Text (Grå/Vit): För all sekundär lästext. Hög läsbarhet, men låg kontrast för att inte trötta ut ögonen.
6.2 Material & Djup (Safirglas-arkitekturen)
Widgetarna ska kännas som fysiska, exklusiva föremål, inte platta digitala rutor.
Glassmorphism (Mörkt Safirglas): Alla widget-kort ska ha en subtil transparens och en frostad bakgrundsoskärpa (background blur).
Guldkant (The Golden Border): Varje huvudkort kantas av en 1px tunn, lysande guldkant. Detta skapar en tydlig, trygg inramning (en "container") för hjärnan.
Inre Skuggor (Inset Shadows): Kritiska interaktionsytor, såsom textinmatningsfältet i Snabba Anteckningar eller bakgrunden för Kapacitet-cirkeln, ska använda inre skuggor. Detta skapar en illusion av att ytan är nedsänkt och "skyddad".
Yttre Glow (Soft Bloom): Istället för hårda, svarta drop-shadows används en mycket mjuk, mörkblå yttre glöd för att separera widgeten från hemskärmen.
6.3 Typografi & Ikonografi
Rubriker (Caps & Tracking): Huvudrubriker (t.ex. "HEMLIG INSPELNING", "DAGENS FOKUS") ska skrivas i versaler med generöst avstånd mellan bokstäverna (tracking). Detta tvingar ögat att sakta ner.
Subtitlar: Enkel, ren sans-serif (t.ex. "Tryck och håll för att spela in").
Ikoner: Alla ikoner (mikrofon, penna, lås, kompass) ska vara konsekventa i sin linjetjocklek och färgsatta i Premium Gold.
3D-Element: Kärnsymboler som Kompassen och Lotusblomman får ha en upphöjd, detaljerad 3D-effekt som drar blicken till sig och fungerar som ett visuellt ankare.
6.4 Specifika Komponentmönster
Utifrån referensdesignen definieras följande strikta komponentlayouter:
Hemlig Inspelning (Quick Capture)
Visuellt centrum: En stor, rundad guldmikrofon nedsänkt i en mörk cirkel.
Aktivitet: En mjuk, eterisk blå ljudvåg (waveform) animeras symmetriskt ut från mitten när inspelning pågår.
Trygghetsindikatorer (Obligatoriska): Längst ner måste tre små, dämpade textblock finnas för att kognitivt försäkra användaren om total integritet:
End-to-end krypterad
Helt privat
Endast du har åtkomst / Syns inte i historik
Snabba Anteckningar (Text Capture)
Layout: Ett stort nedsänkt fält ("Skriv något snabbt...").
Kategorisering (Pills): Under textfältet ska mörka, piller-formade knappar (Tanke, Idé, Påminnelse) finnas för "one-tap"-kategorisering.
Action Bar: En bottenmeny med genvägar till bild (kamera-ikon), röst (mikrofon-ikon) och en solid guldknapp med ett mörkt + för att spara.
Dagens Check-in
Känslo-skala: Fem runda ansikten. De inaktiva är dämpade och nedsänkta. Det valda ansiktet lyser upp i guld och får en subtil upphöjd skugga.
Dagens Fokus / Må Bra / Kapacitet (Insikter)
Centrerad geometri: Dessa widgets bygger på perfekta cirklar i centrum (Kompassen, Lotusblomman, Progress-ringen) för att skapa en känsla av balans och struktur.
Mätare: Horisontella progress bars ska ha rundade hörn, en mörk nedsänkt bakgrund och en ljusblå fyllning.
6.5 Systemets Signatur
Överallt i systemet, oavsett widget, ska budskapet i botten av den andra referensbilden eka i designbesluten:
"✨ DESIGNAD FÖR LUGN, FOKUS OCH TRYGGHET"
Om ett designelement – en färg, en animation, eller en skugga – bryter mot denna signatur, ska det omedelbart tas bort.



