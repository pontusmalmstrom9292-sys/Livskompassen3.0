# Livskompassen v2 - System Plan

## 1. Projektets Status
* **Teknisk Stack:** React, TypeScript, Vite, Tailwind CSS, Google Cloud Functions (Node 20).
* **Repository:** Detta är det slutgiltiga, konsoliderade monorepot. Inga andra kodbaser ska beaktas.
* **Arkitektur & Nuvarande Komponenter:**
  * Grundläggande app-struktur är uppsatt.
  * Relevanta layoutkomponenter existerar (`MainLayout.tsx`, `FloatingDock.tsx`, `SubSynapticBackground.tsx`).
  * Kärnkomponenter för "Kompis"-agenten är skapade som utkast (`KompisAvatar.tsx`, `Tidshjulet.tsx`).
  * Avancerad dokumentation och konceptdefinition finns i `docs/Kompis.md`.
  * **[NY]** Molnarkitekturen är driftsatt med `@google/genai` (Gemini 1.5 Pro) och en automatisk Google Drive-pipeline.

## 2. Projektets Vision och Nyckelkoncept
* **Livskompassen:** Applikation för personlig utveckling och tillväxt.
* **Kompis:** AI-driven designagent, personlig navigatör, och empatisk coach.
* **Minne:** Dokumentation av användarens utmaningar, milstolpar och framsteg.
* **Tidshjulet:** Interaktiv, flerlagrad kompassnål och tidslinje.
* **Sub-Synaptiska Nätverket:** Avancerat (neuralt) nätverk för att koppla livsdata (rutiner, budget, karriär) för prediktiv automation och insikter.
* **Unik Signatur/Biometrisk Låsning:** Mekanism som knyter Kompis till en specifik användares data och interaktionsmönster.
* **Lagen om Autonomi:** Användaren har total makt över sitt system (Sluta förklara, sätt gränsen, bygg skyddet). Appen stöder "Cognitive Offloading" för neuroinkludering (ADHD, trauma, RSD).
* **De Tre Kompasserna:** Systemet navigerar över dygnet via Morgonkompassen (Intention), Dagskompassen/Pulskompassen (Nödbroms) och Kvällskompassen (KASAM).
* **Verklighetsvalvet (The Vault) & Sacred Features:** Dold kärna ("Zero Footprint") för juridiskt bevisvärde (WORM-protokoll). Nås endast via 3 sekunders långtryck på "Fyren"-ikonen + PIN.
* **Agent-Ekosystem (De 8 Rollerna):** Sannings-Analytikern (Valvet), Brusfiltret (Kognitiv Tolk), BIFF-Skölden, Paralys-Brytaren, RSD-Kylaren, Uppgifts-Krossaren, Speglings-Coachen (ACT), och Mönster-Arkivarien (Forensiker).
* **Strategier mot Narcissistiskt Våld:** Stöd för "Sandbox-föräldraskap" och "VIVIR-verktyget" inbyggt i systemets arkitektur.

## 3. Utvecklingsregler och Riktlinjer (Oförstörbara Systemlagar)
För att bibehålla kontroll, kvalitet och en övergripande systemförståelse gäller följande:
1. **Automatiserad Skalning & Zero Regression:** Agenter ska alltid utföra en intern riskanalys ("Pre-flight Check") autonomt för att säkerställa att ingen "Sacred Feature" degraderas.
2. **Kvalitet och Typsäkerhet:** All kod ska vara strikt typsäker (TypeScript), modulär och lättläst.
3. **Strikt Visuell Estetik:** Applikationens design vilar exklusivt på "Obsidian Calm" (`#020617` till `#0f172a`) och "Nordic Dusk". **Alla naturteman är strikt förbjudna**. Högsta prioritet är kognitiv avlastning.
4. **Validering:** Efter varje delsteg ska applikationen testas visuellt och funktionellt.
5. **Extrem Säkerhetsarkitektur (Layered Defense):** Lager 1 (Data) via least privilege. Lager 2 (Nätverk) via Firebase App Check och Zero Footprint (RAM-sanering). Bevis förseglas via server-side tidsstämplar (Immutable Snapshots).
6. **Progressive Disclosure:** Visa endast det absolut nödvändigaste.
7. **[HELIG REGEL] Den Centrala AI-Hjärnan (`sharedRules.ts`):** * Ingen AI-agent, kodgenerator eller utvecklare får **någonsin** hårdkoda AI-instruktioner direkt inuti funktioner eller agenter (`vertexAgent.ts`, `documentAgent.ts`).
   * ALLA prompts, systeminstruktioner och tonalitetsregler MÅSTE importeras från `LIVSKOMPASSEN_SYSTEM_CONFIG` i `functions/src/sharedRules.ts`. Detta är systemets enda källa till sanning.
8. **[HELIG REGEL] SDK-Standard & Moln-Isolering:**
   * Hela molnsystemet drivs exklusivt av det officiella SDK:et `@google/genai` (Gemini 1.5 Pro). Gamla Vertex AI-paket är bannlysta.
   * Frontend (`/src`) och Backend (`/functions/src`) är strikt separerade. Filanalys (Drive) körs uteslutande asynkront i bakgrunden via `documentAgent.ts`.

## 4. Steg-för-steg Utvecklingsplan
### Fas 1: Grundläggande Struktur & UI Förfining
* [ ] **Steg 1.1:** Analysera och förfina `MainLayout`.
* [ ] **Steg 1.2:** Finjustera `SubSynapticBackground`.
* [ ] **Steg 1.3:** Integrera och justera `FloatingDock`.

### Fas 2: Den Visuella Agenti-identiteten (Kompis Avatar)
* [ ] **Steg 2.1:** Skapa den grundläggande renderingen av `KompisAvatar.tsx`.
* [ ] **Steg 2.2:** Implementera "viloläge" och "aktivt läge".
* [ ] **Steg 2.3:** Skapa ett gränssnitt för att mata in text/röst.

### Fas 3: Tidshjulet (Kärnfunktionalitet UI)
* [ ] **Steg 3.1:** Implementera formen för `Tidshjulet.tsx`.
* [ ] **Steg 3.2:** Integrera mock-data för "Minne".
* [ ] **Steg 3.3:** Utveckla interaktionslogiken.

### Fas 4: Datastruktur & Sub-Synaptisk Logik
* [ ] **Steg 4.1:** Definiera solida TypeScript-modeller (`EntityProfile`, `SystemSynapse`).
* [ ] **Steg 4.2:** Etablera centraliserad state management.
* [ ] **Steg 4.3:** Bygg in proaktiva AI-triggers baserade på användarens state.

### Fas 5 & 6: Systemintegration & Verklighetsvalvet
* [x] **Steg 6.3:** WORM & Firestore-regler implementerade.
* [x] **Steg 6.4:** AI-Orkestrering via deterministiska scheman och `@google/genai`.
* [x] **Steg 6.5 [NY]:** Automatiserad Drive-Pipeline (`documentAgent.ts`) för asynkron multimodal filanalys.

## 5. Backend & Databassäkerhet
Följande regler är heliga och utgör grunden för databasens (Firestore) integritet:
* **Single Source of Truth:** Filen `firebase-blueprint.json` i rotkatalogen dikterar alla datamodeller. 
* **Data Invariants (Absoluta Sanningar):**
    * **Immutability:** `VaultLog` och `CheckIn` är oföränderliga (WORM).
    * **Ägarskap:** Dokument tillhör ett specifikt `userId`.
* **The "Dirty Dozen" (Attackvektorer vi aktivt blockerar):**
    1. Identity Spoofing, 2. Malicious ID Injection, 3. Shadow Field Injection, 4. Vault Tampering, 5. Bypassing Verification, 6. Cross-User Leaks, 7. State Shortcuts, 8. Resource Poisoning, 9. System Synapse Hijack, 10. Unauthenticated Writes.

## 6. Gen AI Agent-Ekosystem & Prompt-Arkitektur
Agenterna körs i molnet via Gemini 1.5 Pro (Multimodal) och hämtar sina lagar från `sharedRules.ts`. Deras output är deterministisk och integreras strikt med plattformens estetik.
* **1. Sannings-Analytikern:** Krossar lögner via VIVIR. Returnerar strikt JSON. Noll empati.
* **2. Brusfiltret (Kognitiva Tolken):** Tvättar meddelanden från passiv-aggressivitet.
* **3. BIFF-Skölden (Grey Rock):** Konverterar till korta, tråkiga meddelanden (Brief, Informative, Friendly, Firm).
* **4. Paralys-Brytaren:** Kräver fysisk grundning och ger exakt ett (1) mikrosteg. Noll pepp.
* **5. RSD-Kylaren:** Rationaliserar ångestskapande meddelanden.
* **6. Uppgifts-Krossaren:** Slår sönder uppgifter till atomer (Max 30 sekunder).
* **7. Speglings-Coachen (ACT-Terapeut):** Validerande, aldrig fixande. Max 2-4 meningar.
* **8. Mönster-Arkivarien (Forensiker):** Analyserar på makronivå och bearbetar automatiskt inkommande Drive-filer (PDF/Bilder) via pipelinen `documentAgent.ts`.

## 7. RAG-Scheman & Datastruktur (Faktabanken)
* **VaultLog (Händelse & Arkivpost):** Oföränderlig post för bevis.
* **EntityProfile:** Förhindrar hallucinationer genom fördefinierade roller (`MOTPART`, `BARN`).
* **SystemSynapse:** AI:ns långtidsminne (analysis, hallucinationRisk, groundingPoints).