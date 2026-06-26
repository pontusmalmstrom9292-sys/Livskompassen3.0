Här är en kritisk och pragmatisk produktstrategisk definition av vad Livskompassen 3.0 **aldrig** bör bli, helt utgående från repoets arkitektur, säkerhetsprinciper (Layered Defense, WORM, tre silor) och domänkontext (covert narcissism/HCF).

### 1 & 2. Tjugo (20) Anti-mål och varför de är kritiska

#### Arkitektur & Dataintegritet
1. **Cross-Silo RAG (Blanda bevis, barn och allmän kunskap)**
   * **Varför:** Bryter direkt mot "Tre silor"-principen (`.context/arkiv-minne.md`). Om en agent (`knowledgeVaultQuery`) kan läsa från `reality_vault` och `children_logs` samtidigt, riskerar LLM att hallucinera kausala samband mellan motpartens beteende och barnens mående. Detta urholkar bevisvärdet totalt.
2. **Redigerbara WORM-poster (Update/Delete på bevis)**
   * **Varför:** Förstör "Sanningens Sköld". Om `reality_vault` eller `children_logs` kan redigeras via UI i efterhand, kan bevisen avfärdas som efterkonstruktioner av myndigheter. *(Markering: Att bygga detta skulle kräva en fatal uppluckring av `firestore.rules` - högsta säkerhetsrisk).*
3. **Tidsbaserad gallring av permanent minne (Retention på WORM)**
   * **Varför:** Livskompassen är ett permanent arkiv. Om `scheduledRetentionJob` tillåts radera WORM-data efter t.ex. 2 år, sviker systemet användarens behov av historisk spårbarhet i vårdnadstvister.
4. **Mjuk radering (Soft-delete) för "Rensa enheten"**
   * **Varför:** Device Clear är den yttersta nödutgången. Att bara sätta en flagga `deleted: true` i databasen lämnar data kvar. Arkitekturen kräver kryptografisk shredding via CMEK och radering av IndexedDB (Draft Layer) för att garantera skydd vid fysisk tvångsåtkomst.
5. **Decentraliserad inmatning (Spaghetti-formulär)**
   * **Varför:** Fas 6-11 etablerade "Universal Input Hubs" (Supermoduler). Att börja bygga nya, spridda formulär utanför dessa hubbar leder till att data hamnar utanför säkerhetskontrollerna (DCAP) och ökar den kognitiva belastningen.

#### Produktton & Plausible Deniability
6. **Wellness/Mindfulness-estetik (Naturteman, pasteller, lotusblommor)**
   * **Varför:** Livskompassen v2 ska framstå som ett tråkigt, standardiserat Life OS/anteckningsverktyg (Plausible Deniability). En tydlig "terapi-design" gör appen till en måltavla vid snokande och kan användas emot användaren ("du är instabil").
7. **Diagnossättning i klartext inuti bevisvalvet**
   * **Varför:** Att låta backend-AI tagga WORM-poster automatiskt med "Narcissism", "Gaslighting" eller "Borderline" förstör bevisen. Mot myndigheter är etiketter värdelösa; det enda som räknas är *beteende + datum*. AI formaterar, men diagnostiserar inte bevisen.
8. **Gamification av bevisinsamling (Streaks, poäng, badges)**
   * **Varför:** Att belöna användaren för att logga konflikter är groteskt i HCF-kontext (High Conflict). Systemet ska minska fokus på traumat, inte skapa ett dopaminberoende kring det.
9. **Sociala funktioner eller "Dela"-knappar**
   * **Varför:** Detta är ett isolerat, ensamt valv. Nätverkande, export till okända appar, eller community-funktioner ökar attackytan exponentiellt och bryter nollavtrycks-modellen.
10. **Push-notiser med traumapåminnelser ("För ett år sedan...")**
    * **Varför:** Förstör principen om "kognitiv avlastning" (cognitive offloading). Användaren måste aktivt *välja* att gå in i Valvet. Valvet får aldrig oväntat tränga sig på i Vardagen.

#### AI & Logik (Skydd mot manipulation)
11. **Rådgivande AI i Speglings-Systemet ("Fix-it" mode)**
    * **Varför:** Speglings-coachen har en explicit roll: validera utan att fixa. Att separera känsla från bevis. Om AI börjar ge problemlösningsråd till en person i affekt (vilket `mabraCoachGuard` blockerar), ökar den kognitiva dissonansen.
12. **Ofiltrerad AI-analys av motpartens texter (Avstängd DCAP)**
    * **Varför:** Motpartens mail (Inkast) måste passera DCAP (Digital Conversation Analysis Pipeline) och Gräns-Arkitekten. Annars riskerar systemet "indirekt prompt injection" där manipulativ text från motparten (gaslighting) lurar LLM:en att ta motpartens parti.
13. **Auto-promovering från Barnlogg till Valv/Bevis**
    * **Varför:** Barnens data (`children_logs`) får aldrig automatiserat göras till verktyg i konflikten. Att flytta data från Familjen till Valvet kräver explicit "Human-in-the-Loop" (HITL) för att skydda barnet.
14. **En global "Chatta med all din data"-funktion**
    * **Varför:** Söker man efter matrecept i "Vardagen" ska inte ångestfyllda bevis från 2024 (eller dossier_snapshots) dyka upp som kontext. Sök och kontext *måste* vara zon-separerad.
15. **AI-styrd auktorisering (LLM som dörrvakt)**
    * **Varför:** Deterministisk kod är lag. LLM-output får *aldrig* användas för att sätta `ownerId`, bypassa WebAuthn, eller utvärdera om en användare har rätt att läsa ett dokument.

#### Funktionalitet & Omfattning (Scope Creep)
16. **Tät integration med publika tredjepartsappar (Notion, Google Calendar)**
    * **Varför:** Att exportera "Inkast"-analyser eller kalenderhändelser baserade på Valvet till externa, okrypterade moln läcker metadata och bryter Zero Footprint-målet.
17. **Prediktiv AI för konflikt ("Spå framtiden")**
    * **Varför:** Funktioner som flaggar "Det är 80% risk att ett utbrott sker imorgon" baserat på cykler. Detta skapar hypervigilans, paranoia och ångest hos användaren. Appen ska vara stabiliserande, inte triggande.
18. **Fullt automatiserad myndighetsrapportering (Zero-click Dossier)**
    * **Varför:** Funktionen `generateDossier` ska formatera enligt BBIC (Barns Behov I Centrum), men den får inte välja posterna själv. Användaren måste alltid vara kuratorn (HITL) för att säkerställa att rapporten är helt faktabaserad och relevant.
19. **Allmän Habit-tracking och kaloriräkning**
    * **Varför:** Urholkar "MåBra"-zonens (Vit) egentliga syfte: känsloreglering och nervsystemsbalans (4-7-8 andning, reframing). Systemet är ingen fitness-app.
20. **Dynamiskt AI-genererade vyer (Hallucinerad UI)**
    * **Varför:** Gränssnittet måste vara absolut deterministiskt (låst i `locked-ux-features.md`). I en akut stressituation (t.ex. när "Fyren" long-pressas) får inte UI:t se annorlunda ut för att AI:n fick för sig att rendera om komponenter.

---

### 3. Farliga produktfällor för just detta system

| Fälla | Varför den är farlig | Konsekvens för Livskompassen |
| :--- | :--- | :--- |
| **"Engagement"-fällan** | Moderna appar byggs för att maximera tid i appen. | Livskompassens mål är det motsatta: användaren ska in, säkra bevis/tömma hjärnan, och gå ur. Tvingad engagement förvärrar PTSD och stress. |
| **"Allt-i-ett AI"-fällan** | Industritrenden är att låta AI läsa *allt* för att ge "bättre kontext". | Om "Sannings-Analytikern" får läsa "Barnens fysiologi" uppstår kors-kontaminering av bevis. RAG-silorna är en brandvägg, inte en begränsning. |
| **"Bypass the Friction"-fällan** | Att ta bort lösenord/biometri för att göra appen snabbare. | Tar man bort WebAuthn-kravet (eller 3-sekunders long-press på Fyren) faller hela Layered Defense mot snokande närstående. |
| **"Echo Chamber"-fällan** | Att bygga AI:n för att alltid hålla med användaren. | Covert narcissism smittar; reaktivt missbruk (reactive abuse) existerar. "Safe Harbor / BIFF"-skölden måste förbli stram och Grey Rock-fokuserad, inte bekräfta hämndbegär. |

---

### 4. "Smarta" features som förstör tonen eller modellen

Det finns många klassiska SaaS/App-features som vid en första anblick verkar användbara, men som är direkt skadliga i detta repo:

* **Veckosummeringar av humör ("Du var ledsen 4 dagar den här veckan!")**
  * *Verkar smart:* Ger användaren insikt i sitt mående.
  * *Verklighet:* Förvärrar dysregulation. Tvingar användaren att återuppleva tunga veckor när de istället behöver fokusera på nästa lilla mikrosteg (Paralys-Brytaren).
* **Auto-kategorisering av "Förövarens taktiker" via RAG**
  * *Verkar smart:* Att AI direkt i UI:t stämplar alla mail från exet med röda taggar ("HOOVERING", "GASLIGHTING").
  * *Verklighet:* Användaren blir en "trauma-detektiv" istället för att använda systemet för att logga ut mentalt. Analysen ska göras tyst i bakgrunden (metadata i `reality_vault`) och enbart plockas fram när `generateDossier` körs inför en förhandling.
* **"Lyssna i bakgrunden"-diktering för bevis**
  * *Verkar smart:* Användaren kan spela in verbala angrepp live.
  * *Verklighet:* Högsta tänkbara säkerhetsrisk. Bryter mot Plausible Deniability, bryter mot lokal lagstiftning (potentiellt olovlig avlyssning), och kräver att mikrofonen är igång vilket gör användaren djupt paranoid. *(Ej verifierat som byggbart i nuvarande repo utan massiva säkerhetskompromisser).*
* **Sömlös inloggning (Session persistence över dagar)**
  * *Verkar smart:* Man slipper logga in och scanna fingeravtryck/ansikte hela tiden.
  * *Verklighet:* `useZeroFootprint` och idle-timeouts existerar av en anledning. Om appen lämnas uppe kan motparten (vid gemensam överlämning etc.) läsa `reality_vault` och se att de dokumenteras.

> [!WARNING]
> **För utvecklare:** Varje försök att införa "dynamisk WORM", "gemensam RAG över silor", eller "mjuk auth-session" är inte bara en produktfråga, det kräver direkta ändringar i `firestore.rules` och agent-routing (`sharedRules.ts`). Dessa ändringar flaggas därmed automatiskt som kritiska säkerhetsrisker i Livskompassen 3.0.