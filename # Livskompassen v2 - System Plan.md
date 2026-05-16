# Livskompassen v2 - System Plan

## 1. Projektets Status
* **Teknisk Stack:** React, TypeScript, Vite, Tailwind CSS.
* **Repository:** Detta är det slutgiltiga, konsoliderade monorepot. Inga andra kodbaser ska beaktas.
* **Arkitektur & Nuvarande Komponenter:**
  * Grundläggande app-struktur är uppsatt.
  * Relevanta layoutkomponenter existerar (`MainLayout.tsx`, `FloatingDock.tsx`, `SubSynapticBackground.tsx`).
  * Kärnkomponenter för "Kompis"-agenten är skapade som utkast (`KompisAvatar.tsx`, `Tidshjulet.tsx`).
  * Avancerad dokumentation och konceptdefinition finns i `docs/Kompis.md`.

## 2. Projektets Vision och Nyckelkoncept
* **Livskompassen:** Applikation för personlig utveckling och tillväxt.
* **Kompis:** AI-driven designagent, personlig navigatör, och empatisk coach.
* **Kampspår:** Dokumentation av användarens utmaningar, milstolpar och framsteg.
* **Tidshjulet:** Interaktiv, flerlagrad kompassnål och tidslinje.
* **Sub-Synaptiska Nätverket:** Avancerat (neuralt) nätverk för att koppla livsdata (rutiner, budget, karriär) för prediktiv automation och insikter.
* **Unik Signatur/Biometrisk Låsning:** Mekanism som knyter Kompis till en specifik användares data och interaktionsmönster.
* **Lagen om Autonomi:** Användaren har total makt över sitt system (Sluta förklara, sätt gränsen, bygg skyddet). Appen stöder "Cognitive Offloading" för neuroinkludering (ADHD, trauma, RSD).
* **De Tre Kompasserna:** Systemet navigerar över dygnet via Morgonkompassen (Intention), Dagskompassen/Pulskompassen (Nödbroms) och Kvällskompassen (KASAM).
* **Verklighetsvalvet (The Vault) & Sacred Features:** Dold kärna ("Zero Footprint") för juridiskt bevisvärde (WORM-protokoll).
* **Agent-Ekosystem:** Roller inkluderar Livs-Arkivarien (Djupminne), Analys-Agenten (Säkerhet), Gräns-Arkitekten (BIFF/Gray Rock), Kod-Agenten (Deterministisk Logik), och Speglings-Agenten (Kalibrering).
* **Strategier mot Narcissistiskt Våld:** Stöd för "Sandbox-föräldraskap" och "VIVIR-verktyget" inbyggt i systemets arkitektur.

## 3. Utvecklingsregler och Riktlinjer
För att bibehålla kontroll, kvalitet och en övergripande systemförståelse gäller följande:
1. **Automatiserad Skalning (Automations-First):** Istället för långsamma, manuella och iterativa steg ska vi prioritera automatiserad systemanalys och bakgrundsbyggen. AI-agenter ges mandat att bygga kompletta flöden och utföra tunga arkitektoniska refaktoreringar via shell-kommandon och verktyg för att accelerera utvecklingen.
2. **Kvalitet och Typsäkerhet:** All kod ska vara strikt typsäker (TypeScript), modulär och lättläst.
3. **Strikt Visuell Estetik:** Applikationens design vilar exklusivt på "Obsidian Calm" (djupt, minimalistiskt mörker) och "Nordic Dusk" (kalla, sofistikerade kontraster). Designen får innehålla abstrakta, neurala eller geometriska former, men **alla former av naturteman är strikt förbjudna**. Även Kompis-avataren ska designas strikt i "Nordic Dusk"-stil.
4. **Validering:** Efter varje delsteg ska applikationen testas visuellt och funktionellt. Inga nya steg påbörjas innan det föregående steget är stabilt och integrerat med övriga systemet.
5. **Extrem Säkerhetsarkitektur (Layered Defense):** Lager 1 (Data) via least privilege. Lager 2 (Nätverk/Enhet) via Firebase App Check och Zero Footprint (RAM-sanering). Bevis förseglas via server-side tidsstämplar (Immutable Snapshots).
6. **Progressive Disclosure:** Visa endast det absolut nödvändigaste ("Cognitive Offloading") för att eliminera kognitiv överbelastning och beslutsångest.

## 4. Steg-för-steg Utvecklingsplan

Denna plan är designad för att vara inkrementell. Vi fokuserar på en fas, och dess tillhörande steg, i taget.

### Fas 1: Grundläggande Struktur & UI Förfining
* **Mål:** Etablera en solid, estetiskt tilltalande grund för hela plattformen.
* [ ] **Steg 1.1:** Analysera och förfina `MainLayout` för att säkerställa att sidans övergripande routing, navigation och rymd hanteras korrekt på alla enhetstyper.
* [ ] **Steg 1.2:** Finjustera `SubSynapticBackground` så att den visuellt motsvarar kraven (neuralt nätverk, gyllene trådar) med god prestanda.
* [ ] **Steg 1.3:** Integrera och justera `FloatingDock` för den centrala navigeringen (ex. Hem, Tidshjulet, Profil, Inställningar).

### Fas 2: Den Visuella Agenti-identiteten (Kompis Avatar)
* **Mål:** Ge Kompis en fysisk form på skärmen som interagerar med användaren.
* [ ] **Steg 2.1:** Skapa den grundläggande renderingen av `KompisAvatar.tsx` (ex. partiklar och flytande geometriska former i guld/blått).
* [ ] **Steg 2.2:** Implementera "viloläge" (en pulserande aura) och "aktivt läge" (definierad struktur som en stjärna eller kompassros).
* [ ] **Steg 2.3:** Skapa ett gränssnitt för att mata in text (eller mock för röst) så att avatar-komponenten kan reagera visuellt på användarinteraktion.

### Fas 3: Tidshjulet (Kärnfunktionalitet UI)
* **Mål:** Bygga det interaktiva gränssnittet för navigering genom tid och "Kampspår".
* [ ] **Steg 3.1:** Implementera den grundläggande visuella formen för `Tidshjulet.tsx` (en roterande klocka eller kompassliknande komponent).
* [ ] **Steg 3.2:** Integrera mock-data för att representera användarens milstolpar ("Kampspår") utplacerade över tiden.
* [ ] **Steg 3.3:** Utveckla interaktionslogiken så att användaren kan navigera genom tidslinjen och se relevant information presenteras.

### Fas 4: Datastruktur & Sub-Synaptisk Logik
* **Mål:** Koppla ihop de visuella elementen med en bakomliggande state och struktur för personlig data.
* [ ] **Steg 4.1:** Definiera solida TypeScript-modeller (interfaces/types) för användarprofiler, Kampspår-händelser, och dagliga rutiner.
* [ ] **Steg 4.2:** Etablera en centraliserad state management lösning (t.ex. React Context eller Zustand) för att hålla livsdatan levande.
* [ ] **Steg 4.3:** Bygg in mock-funktioner där Kompis kan hämta data från state och agera proaktivt/empatiskt baserat på vad som händer i användarens "Tidshjul".

### Fas 5: Systemintegration, Automation och Polering
* **Mål:** Slutföra on-boarding och säkerställa att hela applikationen är en sammanhängande upplevelse.
* [ ] **Steg 5.1:** Skapa on-boarding flödet / "Biometriska Låsningen" för att bygga en personaliserad känsla vid första inloggning.
* [ ] **Steg 5.2:** Integrera Prediktiv Problemlösning (mockad logik som triggar notiser och förslag i UI när data mönster tyder på stress eller svårigheter).
* [ ] **Steg 5.3:** Utför slutgiltig optimering, animationspolering, och förberedelser inför framtida backend-integration.

### Fas 6: Verklighetsvalvet (Master Plan & Säkerhetskärna)
* **Mål:** Implementera plattformens oförstörbara, dolda beviskärna enligt WORM-protokollet och Zero-Footprint-design.
* [ ] **Steg 6.1:** Dold Åtkomst & Panik-Stängning. Implementera 3-sekunders-triggern via osynligt UI samt `useShakeToKill` (15 m/s²) för att direkt rensa session och minne.
* [ ] **Steg 6.2:** Kognitiv Kontrast. Skapa Arkivets tvåkolumns-layout ("Svart på vitt"): Vänster (Röd - manipulation/lögner) mot Höger (Blå/Kall - objektiv sanning/bevis).
* [ ] **Steg 6.3:** WORM & Firestore-regler. Skapa kryptografisk oföränderlighet (`allow update, delete: if false`) kombinerat med `serverTimestamp()`.
* [ ] **Steg 6.4:** AI-Orkestrering & Extraktion. Sätt upp strukturerade JSON-scheman (deterministiska filter) för neutral analys med exportmöjlighet av BBIC-rapporter.

## 5. Backend & Databassäkerhet
Följande regler är heliga (Sacred Features) och utgör grunden för databasens (Firestore) integritet. Inga AI-genererade kodförslag får någonsin bryta mot dessa:
*   **Data Invariants (Absoluta Sanningar):**
    *   **Immutability:** `VaultLog` och `CheckIn` är oföränderliga efter skapandet för att förhindra gaslighting och retrospektiv manipulering.
    *   **Ägarskap & Åtkomst:** Alla dokument måste tillhöra ett specifikt `userId`. Användare kan endast läsa och skriva sin egen data.
    *   **E-postverifiering:** Krävs strikt för alla skrivoperationer.
    *   **Modellintegritet:** `NetworkMember` måste ha en giltig kategori och importansnivå.
    *   **Systemkärnan:** `SystemSynapse` och `SystemScan` är kritiska för systemets integritet och är exklusivt begränsade till ägaren.
*   **The "Dirty Dozen" (Attackvektorer vi aktivt blockerar):**
    1.  Identity Spoofing (Create/Update av annan användares data).
    2.  Malicious ID Injection (Gigantiska dokument-ID:n).
    3.  Shadow Field Injection (t.ex. lägga till `isAdmin: true`).
    4.  Vault Tampering (Försök att ändra i en `VaultLog`).
    5.  Bypassing Verification (Overifierade e-postadresser).
    6.  Cross-User Leaks (List/Get av annans data).
    7.  State Shortcuts (Ändra en `CheckIn` i efterhand).
    8.  Resource Poisoning (Skapa orimligt stora entiteter).
    9.  System Synapse Hijack (Skriva över kernel-data).
    10. Unauthenticated Writes (Skriva utan giltig token).
