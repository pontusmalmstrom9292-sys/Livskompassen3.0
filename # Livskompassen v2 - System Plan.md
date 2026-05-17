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
* **Verklighetsvalvet (The Vault) & Sacred Features:** Dold kärna ("Zero Footprint") för juridiskt bevisvärde (WORM-protokoll). Nås endast via 3 sekunders långtryck på "Fyren"-ikonen + PIN.
* **Agent-Ekosystem (De 8 Rollerna):** Sannings-Analytikern (Valvet), Brusfiltret (Kognitiv Tolk), BIFF-Skölden, Paralys-Brytaren, RSD-Kylaren, Uppgifts-Krossaren, Speglings-Coachen (ACT), och Mönster-Arkivarien (Forensiker).
* **Strategier mot Narcissistiskt Våld:** Stöd för "Sandbox-föräldraskap" och "VIVIR-verktyget" inbyggt i systemets arkitektur.

## 3. Utvecklingsregler och Riktlinjer
För att bibehålla kontroll, kvalitet och en övergripande systemförståelse gäller följande:
1. **Automatiserad Skalning & Zero Regression (Automations-First):** Istället för långsamma, manuella steg ska vi prioritera automatiserad systemanalys och bakgrundsbyggen. Agenter ska dock alltid utföra en intern riskanalys ("Pre-flight Check") autonomt för att säkerställa att ingen "Sacred Feature" degraderas.
2. **Kvalitet och Typsäkerhet:** All kod ska vara strikt typsäker (TypeScript), modulär och lättläst.
3. **Strikt Visuell Estetik:** Applikationens design vilar exklusivt på "Obsidian Calm" (mörka gradienter `#020617` till `#0f172a`) och "Nordic Dusk". Använd Glassmorphism, mjuka former (`rounded-[2rem]`, `rounded-5xl`), och typsnitten **Outfit** (rubriker) samt **Inter** (brödtext). Designen får innehålla kalla accenter (turkos/indigo), men **alla naturteman är strikt förbjudna**. Högsta prioritet är kognitiv avlastning och stressfrihet.
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
* [ ] **Steg 4.1:** Definiera solida TypeScript-modeller baserat på Vertex AI RAG-scheman: `EntityProfile` (Faktabank för noll hallucinationer) och `SystemSynapse` (AI:ns långtidsminne).
* [ ] **Steg 4.2:** Etablera en centraliserad state management lösning (t.ex. React Context eller Zustand) för att hålla livsdatan levande.
* [ ] **Steg 4.3:** Bygg in mock-funktioner där Kompis kan hämta data från state och agera proaktivt/empatiskt baserat på vad som händer i användarens "Tidshjul".

### Fas 5: Systemintegration, Automation och Polering
* **Mål:** Slutföra on-boarding och säkerställa att hela applikationen är en sammanhängande upplevelse.
* [ ] **Steg 5.1:** Skapa on-boarding flödet / "Biometriska Låsningen" för att bygga en personaliserad känsla vid första inloggning.
* [ ] **Steg 5.2:** Integrera Prediktiv Problemlösning (mockad logik som triggar notiser och förslag i UI när data mönster tyder på stress eller svårigheter).
* [ ] **Steg 5.3:** Utför slutgiltig optimering, animationspolering, och förberedelser inför framtida backend-integration.

### Fas 6: Verklighetsvalvet (Master Plan & Säkerhetskärna)
* **Mål:** Implementera plattformens oförstörbara, dolda beviskärna enligt WORM-protokollet och Zero-Footprint-design.
* [ ] **Steg 6.1:** Dold Åtkomst & Panik-Stängning. Implementera 3-sekunders-triggern på den osynliga "Fyren"-ikonen samt `useShakeToKill` (15 m/s²) för att direkt rensa session och minne.
* [ ] **Steg 6.2:** Kognitiv Kontrast. Skapa Arkivets tvåkolumns-layout ("Svart på vitt"): Vänster (Röd - manipulation/lögner) mot Höger (Blå/Kall - objektiv sanning/bevis).
* [x] **Steg 6.3:** WORM & Firestore-regler. Implementera strikt `VaultLog`-schema och kryptografisk oföränderlighet (`allow update, delete: if false`).
* [x] **Steg 6.4:** AI-Orkestrering & Extraktion. Sätt upp strukturerade JSON-scheman (deterministiska filter) för neutral analys med exportmöjlighet av BBIC-rapporter.

## 5. Backend & Databassäkerhet
Följande regler är heliga (Sacred Features) och utgör grunden för databasens (Firestore) integritet. Inga AI-genererade kodförslag får någonsin bryta mot dessa:
*   **Single Source of Truth (Datamodell):** Filen `firebase-blueprint.json` i rotkatalogen dikterar alla datamodeller. När TypeScript-interfaces, frontend-formulär eller backend-anrop byggs, måste de matcha denna JSON-struktur till 100%. Inga fält får hittas på, och 'required'-fälten är absoluta.
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

## 6. Vertex AI Agent-Ekosystem & Prompt-Arkitektur
För att garantera neuroinkludering, kognitiv avlastning och objektiv säkerhet används följande specialiserade AI-agenter. Deras output är deterministisk och integreras strikt med plattformens "Obsidian Calm"-estetik.
*   **1. Sannings-Analytikern:** Krossar lögner via VIVIR (Gaslighting, Projektion, Hoovering, Tripping) och BBIC. Returnerar strikt JSON. Noll empati, noll tolkning.
*   **2. Brusfiltret (Kognitiva Tolken):** Tvättar meddelanden från passiv-aggressivitet. Output: Kärnan, Bruset att släppa, Mikrosteg.
*   **3. BIFF-Skölden (Grey Rock):** Konverterar känslomässiga utkast till korta, tråkiga (Brief, Informative, Friendly, Firm) meddelanden.
*   **4. Paralys-Brytaren:** För Executive Dysfunction. Kräver fysisk grundning (vagusnerv-reset) och ger exakt ett (1) mikrosteg. Noll pepp, noll listor.
*   **5. RSD-Kylaren:** Rationaliserar ångestskapande meddelanden genom 3 logiska reframings (t.ex. "lågt blodsocker").
*   **6. Uppgifts-Krossaren:** Slår sönder uppgifter till atomer. Steg 1 får kräva max 30 sekunder och noll beslut.
*   **7. Speglings-Coachen (ACT-Terapeut):** Validerande, aldrig fixande. Max 2-4 meningar för att undvika "bandwidth tax".
*   **8. Mönster-Arkivarien (Forensiker):** Analyserar Arkivet på makronivå över år. Söker systematik i övergrepp och strukturerar bevis för juridiskt bruk (Markdown).

## 7. RAG-Scheman & Datastruktur (Faktabanken)
Dessa TypeScript-scheman bygger grunden för Vertex AI Data Store (Unstructured/Structured JSONL).
*   **VaultLog (Händelse & Arkivpost):** Oföränderlig post för bevis (id, userId, category, action, truth, childrenImpact, evidenceUrl, biffUsed, isLocked, createdAt).
*   **EntityProfile (Målpersoner & Aktörer):** Förhindrar hallucinationer genom att i förväg definiera roller (`MOTPART`, `BARN`, `ANVÄNDARE`). Ex: `KASPER`, `ARVID`, `PAPPAN`, `MOTPARTEN`.
*   **SystemSynapse:** AI:ns långtidsminne (id, userId, title, category, analysis, groundingPoints, hallucinationRisk, lastScannedAt, createdAt).
