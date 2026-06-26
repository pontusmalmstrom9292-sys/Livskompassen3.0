# Livskompassen 3.0 – Framtida Roadmaps & Funktioner

Detta dokument utgör den samlade framtidsvisionen för Livskompassen. Här finns de 5 högst prioriterade, "mest lovande" funktionerna definierade i detalj (Etapp 3), följt av en katalog på 50 genererade framtidsidéer som respekterar systemets arkitektur (Valvet, WORM, tre silos, zero footprint).

---

## Del 1: De 5 Mest Lovande Framtidsfunktionerna (Etapp 3)

Dessa fem funktioner utgör basen för **Etapp 3: Valvets Evidens & Systemintelligens**. De balanserar maximalt användarvärde vid kris med strikt efterlevnad av WORM och Layered Defense.

### 1. Valvet: Forensisk Tidslinje (Forensic Timeline View)
**1. Syfte:** Visualisera WORM-bevis (`reality_vault`) längs en kronologisk och oföränderlig tidslinje för att tydliggöra mönster över tid.  
**2. Problem den löser:** Bevis är ofta spridda över lång tid. Gaslighting och covert narcissism bygger på att förvränga tidslinjer ("så där var det inte alls"). En tidslinje ger objektiv trygghet.  
**3. Scope:** Endast läsvy inuti Verklighetsvalvet. Renderar existerande `reality_vault`-dokument med färgkodning för händelsetyp.  
**4. UX flow:** Lås upp Valv via Fyren → Flik: "Tidslinje" → Scrollbar vertikal tidslinje. Bevis är låsta (WORM-ikon synlig).  
**5. Risker:** Kan vara mentalt triggande (RSD-risk) att se allt på en gång. UX måste tillåta filtrering.

### 2. Barnporten: Sammanfattad BBIC-Dossier (Barns Behov I Centrum)
**1. Syfte:** Aggregera Barnens livsloggar till ett objektivt, utskrivbart underlag anpassat för externa instanser (socialtjänst, skola).  
**2. Problem den löser:** Att manuellt sammanställa WORM-loggar inför möten dränerar exekutiv funktion och riskerar att bli emotionellt färgat.  
**3. Scope:** Utöka existerande Dossier-Generator (`generateDossier`) att stödja `reportType: 'bbic'` strikt isolerad till Barnen-silon.  
**4. Security/privacy impact:** Hög arkitektonisk känslighet. Datan får under inga omständigheter blandas med `reality_vault`.  
**5. Risker:** LLM-hallucinationer (Vertex AI hittar på samband). Kräver strikt deterministisk "fact-extraction"-prompt och HITL (Human In The Loop) godkännande.

### 3. Kompis: B.I.F.F.-simulatorn (Safe Harbor)
**1. Syfte:** Proaktiv övningsyta för att hantera manipulerande kommunikation via "Grey Rock"-metoden.  
**2. Problem den löser:** Inkommande aggressiva meddelanden skapar adrenalinpåslag. Att veta *hur* man ska svara kräver en trygg träningsmiljö.  
**3. Scope:** Ett nytt läge i Safe Harbor där användaren klistrar in en "attack" och får tre konkreta B.I.F.F.-förslag (Brief, Informative, Friendly, Firm).  
**4. UX flow:** Klistra in text i Safe Harbor → Tryck "BIFF-sköld" → Få 3 kalla, korta, neutrala svar → Kopiera det bästa.  
**5. Non-goals:** Ingen autosvar-integration med SMS/Mail. Inga spår sparas till databasen.

### 4. MåBra / Core: Akutankare (Panic Landing)
**1. Syfte:** Omedelbar, zero-friction kognitiv nollställning vid extrem stress, trauma-trigger eller RSD-panik.  
**2. Problem den löser:** När panik uppstår räcker inte exekutiv funktion till för att navigera menyer.  
**3. Scope:** En global, mycket diskret "SOS"-napp (ex. ankarsymbol i Floating Dock) som låser gränssnittet och tvingar fram grounding (4-7-8 andning).  
**4. Security/privacy impact:** Hög integritet (Plausible Deniability). Det syns inte i någon historik att Ankaret använts.

### 5. Planering: Kognitiv Kapacitetsmätare (Energy Budgeting)
**1. Syfte:** Förhindra utbrändhet genom att dynamiskt dölja "tunga" uppgifter på dagar med låg mental energi.  
**2. Problem den löser:** Traditionella To-Do-listor tar inte hänsyn till PTSD-utmattning.  
**3. Scope:** Vid Morgonkompassen anges dagens energinivå. `Super-Planering Input` filtrerar därefter automatiskt bort uppgifter taggade som energikrävande.  
**4. UX flow:** Check-in: "Batterinivå idag?" (Låg/Mellan/Hög). Om Låg visas endast mikrosteg och rutiner.  
**5. Risker:** Viktiga deadlines kan missas om de döljs för effektivt. Lösning: En diskret "Overdrive/Ignorera filter"-knapp krävs.

---

## Del 2: Katalog med 50 Framtidsidéer

En bruttolista över möjliga vägval framåt. Markeringar för **[Säkerhetsrisk]** indikerar funktioner som potentiellt kan bryta mot grundprinciper (WORM/silos) och som därför kräver extrem försiktighet vid implementering.

### 10 Små Förbättringar (Kodnära & Pragmatiska)
1. **Valv-timeout Visualisering:** En subtil progressbar som visar när Zero Footprint-timeouten låser Valvet.
2. **"Tyst Läge" (Darkest Mode):** Maximal ljussänkning och noll animationer för Dagboken.
3. **Plausible Deniability "Dummy" Sök:** Returnerar ofarlig wellness-fakta om ingen WORM-sökning ger träff.
4. **Färgburk-migration för Legacy Views:** Säkra att äldre vyer inte läcker UI-tokens; tvinga Obsidian Calm globalt.
5. **Dölj Saldo-inmatning (Obfuscation):** Maskera summor omedelbart efter inmatning.
6. **Offline-kö för MåBra-sessioner:** Spara andningssessioner lokalt om nätverk saknas.
7. **Barn-logg Snabb-tagg "Normal":** 1-klicksknapp för att logga att dagen är normal, för att etablera en baslinje.
8. **Planering "Skjut upp utan skuld":** Knappar för att flytta uppgifter till nästa dag utan "försenad"-varningar.
9. **Spegel-komprimering i UI:** Dölj äldre AI-speglingar bakom en dragspelsmeny för mindre brus.
10. **Arbetsliv "Gå Hem" Invalidate:** Explicit knapp som flushar sessionen vid hemgång.

### 10 Modulfördjupningar
11. **Valvet Forensisk Tidslinjevy:** Rendera `reality_vault` som en strikt kronologisk advokat-akt.
12. **Familjen Barn-mönster Analysator:** Lokal A2A-analys av måendetrender över tid, sparas ej.
13. **[Säkerhetsrisk] Hjärtat Trauma-silo:** Isolera de värsta minnena till en samling där Kompis (AI) är bortkopplad helt.
14. **MåBra Fysisk Sensor-sync:** Koppla puls till andningsövningar som bevis, och släng sedan rådatan.
15. **Ekonomi/Hjärtat Kors-Referensvy:** Visuell tidslinje-jämförelse mellan transaktioner och journal (inga databaser blandas).
16. **Planering Energi-korrelation:** Koppla uppgifter till förväntad "energiåtgång" och matcha mot dagsformen.
17. **Arbetsliv "Smyg-reflektion" (Stealth UI):** UI toggle som får Dagboken att se ut som ett Excel-ark.
18. **Kunskapsvalv "Context Decay":** Äldre sök-kontext fasas ut ur minnet lokalt för att Kompis ska hålla sig relevant.
19. **Speglings-Systemet "Grå-sten" Läge:** Tvingar Kompis att enbart prata kort, informativt, utan empati (BIFF) för att undvika fawning.
20. **[Säkerhetsrisk] Valvet Decoy-PIN-kod:** Mata in `1111` och hamna i ett fejk-valv med recept och standardtexter. Ultimata Plausible Deniability, men farligt att koda.

### 10 Nya Koncept (Större Spår)
21. **[Säkerhetsrisk] Vittnes-silon (Silo 4):** Fjärde databassilon för bevis från tredjepart som inte ens användaren kan röra.
22. **Lokal-first Vektorsök (In-browser RAG):** Kör embeddings i WASM så inget alls skickas till cloud vid sök.
23. **"Vardags-sluss" Dashboard:** Hemsidan är 100% tom förutom ett osynligt inmatningsfält, menyn måste lång-klickas fram.
24. **Synlig Audit-logg (Beviskedjan):** En panel som visar kryptografiska hash-summor av när filer skapades (för advokater).
25. **Ephemera-läge ("Svart Hål"):** UI-text raderas oåterkalleligen efter 60 sekunder. Bra för maximal, trygg ventilering.
26. **Offline Dossier Generator (PDF-lib):** Renderar PDF lokalt istället för på GCF.
27. **"Kognitiv Offload" Tidslinje:** Ett rent visuellt lager som kombinerar Planering + Journal.
28. **Kryptiska Push-notiser:** Reminders maskeras som väder-varningar eller system-updates (Plausible deniability via push).
29. **[Säkerhetsrisk] Verklighets-Ankare (QR-2FA):** Tvingar kameraskanning av en printad QR-lapp för att låsa upp Valvet.
30. **Ljud-dagbok (Lokal Whisper/Web Speech):** Tala in dagboken istället för att skriva. Lokal transkribering.

### 10 AI / Agent-Idéer (DCAP & A2A)
31. **Frontend-baserad Agent-Supervisor:** Klienten väljer AgentCard, inte Backend.
32. **Mönster-Arkivarien (Låst Natt-batch):** AI kör en natt-batch över `journal` och droppar en strikt rapport i Valvet, utan användarinteraktion.
33. **BIFF-skölden som Input-Middleware:** AI "tvättar" motpartens sms innan de loggas för att ta bort "giftiga" formuleringar.
34. **Paralys-Brytaren i Planering:** AgentCard som styckar elefanten till mikrosteg med 1 klick.
35. **RSD-Kylaren via Context Caching:** Blixtsnabb respons (<500ms) för att hantera självkritik, tack vare Vertex Context Caching.
36. **Vävaren "Dödmansgrepp" (HITL):** Om AI tror att en fil = Akut hot, flaggas den för Human Review innan den permanentas i systemet.
37. **[Säkerhetsrisk] Sannings-Analytikern (Kors-referens):** AI läser från `reality_vault` och `journal` samtidigt för att flagga gaslighting (bryter tekniskt silorna).
38. **Agent-Tystnad (Design Pattern):** Systemprompten låter Kompis välja att bara säga "Jag hör dig" när ingen spegling behövs.
39. **"Speglingens Advokat":** Agent som aktivt försvarar användaren och argumenterar *emot* hens självkritiska inlägg.
40. **Context-Aware Clean Input:** PII (t.ex. personnummer) tvättas ur lokalt i klienten innan de skickas till LLM.

### 10 Oväntade men Lovande Idéer (Pushar gränserna)
41. **Face-Down to Kill (Ambient Light/Visibility):** Appen loggar ut tyst om telefonen läggs med skärmen nedåt mot bordet.
42. **[Säkerhetsrisk] Databas "Honeypot":** En falsk samling som larmar riktiga Valvet om den någonsin läses av motparten.
43. **E-bläck Optimerat Tema (Dumbphone Mode):** Tematisering för Onyx Boox / Remarkable. 100% monokrom, 0% dopamin.
44. **"Förstörelse-loggen" (Utsuddad WORM):** Markerade raderade inlägg renderas som svarta censur-block, men behåller texten i databasen för WORM-compliance.
45. **Stigmatiserings-sanitizer (Frontend Censur):** Censurera ord som "BUP" eller "Orosanmälan" i barnloggen när man visar skärmen för lärare.
46. **[Säkerhetsrisk] WebUSB FIDO2 Krav:** Avskaffa lösenord, lås fast systemet via Yubikey-hårdvara.
47. **Sömn-arkitektur (Hard Shutdown):** Appen låser sig själv vid 22:00, "Inga fler beslut idag". Tvingar paus.
48. **Text-äventyrs UI (CLI-läget):** Gränssnitt som en Linux-terminal för 100% kamouflage på arbetsplatsen.
49. **"Anti-planering" Tvångsläge:** En dag i veckan döljs alla ToDo-listor totalt. "Du har inget att bevisa idag".
50. **QR-Dossier (Lokal Streaming):** Dela Valvet via WebRTC P2P där en jurist skannar en QR-kod med paddan och läser filen direkt ur användarens RAM. Inga moln uppblandade.
