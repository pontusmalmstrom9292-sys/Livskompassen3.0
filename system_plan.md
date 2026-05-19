# LivsKompassen & Verklighetsvalvet - Systemminne & Agent-arkitektur

1. VISION OCH UTVECKLINGSFILOSOFI
Dynamisk Utveckling: LivsKompassen är ett levande "Life OS" som anpassar och skalar upp funktioner i takt med läkning och självinsikt.
Lagen om Autonomi (Den Deterministiska Lagen): Du kan aldrig förändra den externa agentens (förövarens) natur. Men du har total makt över ditt eget systems gränssnitt. Sluta förklara. Sätt gränsen. Bygg skyddet.
Bred Neuroinkludering: Designad för psykisk ohälsa, ADHD, utmattning, impuls-hantering och RSD (Rejection Sensitive Dysphoria) orsakad av långvarig trauma-stress.
Cognitive Offloading (Bento Grid): Struktur och lugn framför färgkoder. "Progressive Disclosure" – visa endast det absolut nödvändigaste för att eliminera beslutsångest och sensorisk överbelastning.

2. EXTREM SÄKERHETSARKITEKTUR (LAYERED DEFENSE)
Säkerheten kring användarens data och systemets integritet får aldrig kompromissas. All kod måste följa dessa försvarslinjer:
Lager 1 (Data): Server-side tidsstämplar & Least Privilege. request.auth.uid ska exakt matcha dokumentets ägare.
Lager 2 (Nätverk & Enhet): Firebase App Check (Hårdvaruattestering) blockerar obehörig trafik. Zero Footprint & RAM-hantering rensar Verklighetsvalvet vid utloggning. Inga lokala spår.
Deterministisk Output: Förlita dig aldrig på LLM:en för logik. Använd strikta Callbacks och deterministiska filter för att blockera oönskade utfall och förhindra data-läckage.
Immutable Snapshots: Bevis låses med en oföränderlig tidsstämpel på servern. Skapar en egen sannings-oberoende databas (dagbok, mejlloggar) oberoende av förövarens version.

3. DE TRE KOMPASSERNA (NAVIGERING ÖVER DYGNET)
Morgonkompassen (Intention & Riktning): Sätter dagens grundstruktur innan bruset från ex-frun tar över. "Sanningens Ankare" – låsta påminnelser om de egna värderingarna.
Dagskompassen / Pulskompassen (Impuls & Intryck): Nödbroms för överbelastning och hantering av akuta konflikter. Bryter "People Pleasing"-loopar via radikal självmedkänsla.
Kvällskompassen (Nedvarvning & KASAM): Vägledd reflektion för att filtrera bort dolda lögner ("crazymaking"). Fokus på barnen Kasper och Arvid för att minimera lojalitetskonflikter och emotionell smitta.

4. AGENT-STRUKTUR & ROLLER
A. Livs-Arkivarien (Djup-Agenten): Hanterar historik och mönster. Det helt objektiva systemminne. Kopplar historiska sår till nutida triggers (ex. varför en ton i ett SMS utlöser en impuls).
B. Analys-Agenten (Säkerhet): Säkerhetsövervakare. Granskar all kod, säkerställer 'Zero Regression'.
C. Gräns-Arkitekten (Kommunikations-Vakt): Specialiserad på BIFF-metoden och Gray Rock. Förvandlar manipulatörers input till deterministisk, neutral data. Förhindrar JADE (Justify, Argue, Defend, Explain).
D. Kod-Agenten (Logik): Säkerställer deterministisk input/output. Alltid strikt gränssättning, aldrig gissande.
E. Speglings-Agenten (Kalibrering): Utmanar användarens verklighetsbild för att hitta objektiva ankare. Hjälper till att separera inre känslor från yttre fakta vid hög stress.

5. [SACRED FEATURES - FÅR ALDRIG DEGRADERAS]
I. Verklighetsvalvet (Vault): Dold kärna (3 sek press + PIN). Inrymmer nu Nätverk, Bank och Terminal för att minimera daglig stress.
II. Sanningens Sköld & Systemets Objektivitet: Systemet agerar som ett objektivt ankare som korskör data mot loggade bevis och ifrågasätter varsamt vid hög affektiv stress.
III. Morgonkompassen & Mikrosteg: Dagens intention och handlingar med kategorisering och anteckningsfält.
IV. Dossier-Generator & Arkiv: Förmågan att generera och arkivera tekniska/arkitektoniska analyser av säkerhet och strategiskt försvar.
V. Speglings-Systemet: Interaktivt quiz för gemensamt lärande mellan användare och system.
VI. Zero Footprint & Kill Switch: Session-sanering och manuell låsning.

6. STRATEGIER MOT NARCISSISTISKT VÅLD
Sandbox-föräldraskap: Du kan inte samarbeta med ett osäkert system. Bygg en isolerad miljö för barnen. Parallella världar utan gemensam yta.
VIVIR-verktyget: (Vem, Inflytande, Viktigt, Intention, Redo). Ger en intern kognitiv struktur i mötet med narcissisten.
Återhämtningsprotokoll: Vagusnerv-stimulering (4-7-8 andning, dykreflex, humming) tvingar systemet ur "Kamp/Flykt".

## Fas 1 (Cleanup): Sanering & Mappstruktur
- [x] Git-branch `cleanup-phase-1` — säker arbetskopia
- [x] `.context/` systemlagar (arkitektur, säkerhet, databas, design)
- [x] `.gitignore` — secrets, `dist/`, `functions/lib/`, genererad kod
- [x] Borttaget från git: `vertex-sa.json`, `server/.env`, `spejaren.js`, `server.js`, build-artefakter
- [x] Frontend merge från `livskompassen-v2` (`main.tsx`, layout, Kompis)
- [x] Rensat: tomma placeholders, trasig `agentEngine.ts`, session-artefakter → `docs/archive/`
- [x] Agent Cards: 8 produktroller + deterministisk `routeFromDcap` → executor
- [x] Säkerhet: auth på `knowledgeVaultQuery`, webhook-secret på `notifyNewFile`
- [x] Enhetligt `GCP_PROJECT_ID` via `functions/src/config.ts`

## 7. AKTUELL STATUS & PROGRESS
- [x] Design-tokens & Färgpalett (Guld/Blå)
- [x] Bas-layout med Sub-Synaptic Background (Canvas)
- [x] KompisAvatar (Aura & Stjärna)
- [x] Bento Grid Layout för Dashboard
- [x] Moderniserad Floating Dock
- [ ] Interaktivt Tidshjul (TimeWheel)
- [x] Mobil-Dashboard (Bento Grid)
- [ ] Verklighetsvalvets UI
- [x] Fas 1 (Steg 1.1 & 1.2): Grundläggande Infrastruktur (CMEK-skript) & Säkerhet (WebAuthn/Passkeys UI+Hooks)
- [x] Fas 2 (Steg 2.1 & 2.2): Agent Engine & RAG (Vector Search, A2A Orkestrering, Kompis Supervisor)
- [x] Fas 3 (Steg 3.1 & 3.2): Analys & Proaktivt Skydd (DCAP Hybrid Pipeline, GDPR Retention Job, Context Caching)

## 8. KOMMANDE FAS: Fas 4 - Fördjupad Integration & Verklighetsvalvet
*   **Mål:** Aktivera den dolda kärnan för bevisföring och personlig integritet.
*   [ ] **Steg 4.1: Verklighetsvalvets UI (The Vault):** Implementera den dolda access-logiken (3 sekunder långtryck + biometrisk prompt) och det krypterade gränssnittet.
*   [ ] **Steg 4.2: Kampspår-loggning:** Skapa gränssnitt för att ladda upp skärmdumpar, mejl och anteckningar som automatiskt tidsstämplas och vektoriseras via RAG.
*   [ ] **Steg 4.3: BIFF-generator:** Integrera Gräns-Arkitekten i ett chatt-gränssnitt som hjälper användaren att skriva om affektiva svar till neutrala, faktabaserade meddelanden.

## 9. TEKNISK SKULD & OPTIMERING
*   [ ] **Prestanda:** Optimera `SubSynapticBackground` för att minska CPU-last på mobila enheter.
*   [ ] **Offline-stöd:** Implementera Service Workers för att tillåta läsning av "Sanningens Ankare" även utan täckning.
*   [ ] **Testtäckning:** Lägg till integrationstester för A2A-flödet mellan Kompis och Gräns-Arkitekten.
