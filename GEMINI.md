# GEMINI.md - Arkitektonisk Kontext & Utvecklingsregler

## 1. Systemets Vision: Livskompassen v2
Livskompassen v2 är ett autonomt, multi-agent ekosystem byggt på Google Cloud Vertex AI Agent Engine. Systemet centreras kring "Kompis", en empatisk AI-navigatör, och ett underliggande nätverk som analyserar livsdata, budgetar och användarens "Kampspår". Applikationen fungerar som ett "Life OS" och ett digitalt fäste för *Lagen om Autonomi*, med inbyggd neuroinkludering för trauma, ADHD och RSD.
Detta repository är det enda, sammanslagna huvudprojektet ('Single Source of Truth'). Alla tidigare redundanta projekt, repos eller testmiljöer är avvecklade.

## 2. Instruktion för Systemplanering & Kontexthantering (SPDD)
Vi använder Structured Prompt-Driven Development (SPDD). Applikationens obestridliga källkod för AI-förståelse ligger i `.context/`-katalogen.
**Innan du genererar någon kod MÅSTE du:**
1.  **Ladda Kontext:** Läs in samtliga filer i `.context/` (`architecture.md`, `database.md`, `security.md`, `design-language.md`).
2.  **Tillståndskontroll:** Läs `system_plan.md` i rotkatalogen för att förstå aktuell fas och steg. Uppdatera denna fil (markera med `[x]`) när ett steg är slutfört. Gå inte vidare innan föregående kritiska säkerhetssteg är klara.
3.  **REASONS Canvas:** Innan kod skapas, presentera en plan enligt: Requirements, Entities, Approach, Structure, Operations, Norms, Safeguards. Invänta godkännande innan du kodar.
4.  **Automations-First:** Utvecklingsflödet drivs av automatiserad analys och bakgrundsbyggen. Som AI förväntas du bygga och refaktorera stora sjok av logik autonomt, snarare än att kräva mikromanagement för varje liten kodrad. Presentera holistiska lösningar.

## 3. Teknisk Stack & Infrastruktur
- Backend: GCP, Vertex AI Agent Engine, Agent2Agent (A2A), Cloud Run Jobs.
- Databas: Cloud Firestore i Datastore-läge med CMEK. WORM-protokoll (Write Once, Read Many) för oföränderliga bevis i Verklighetsvalvet.
- RAG: Vertex AI Vector Search 2.0 (textembedding-gecko) med Context Caching.
- RAG: Vertex AI Vector Search 2.0 (textembedding-gecko) med Context Caching. Data struktureras via strikta RAG-scheman (VaultLog, EntityProfile, SystemSynapse) i JSONL för noll hallucinationer.
- Säkerhet: WebAuthn Passkeys, DCAP (Regex + BERT), Firebase App Check, Shake-to-Kill trigger.
- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand.

## 4. Kritiska Utvecklingsregler
- **Säkerhet först (Layered Defense):** Implementera aldrig "mock-säkerhet". Använd riktiga WebAuthn/CMEK-anrop. PII måste filtreras av Gatekeeper-agenter. Känsligt kryptomaterial får aldrig exponeras i JS-heapen. RAM och lokala cacher ska rensas omedelbart vid utloggning eller panik (Zero Footprint). LLM får aldrig användas för deterministiska logikbeslut.
- **Agent-Roller & Sacred Features:** Systemet drivs av specifika sub-agenter (Livs-Arkivarien, Analys-Agenten, Gräns-Arkitekten, Kod-Agenten, Speglings-Agenten). Kärnfunktioner som "Verklighetsvalvet" och "De Tre Kompasserna" prioriteras.
- **Agent-Roller & Sacred Features:** Kärnfunktioner som "Verklighetsvalvet" prioriteras. AI-ekosystemet är strikt definierat i 8 roller: Sannings-Analytikern (Klinisk bevisföring/JSON), Brusfiltret (Kognitiv avlastning), BIFF-Skölden (Grey Rock), Paralys-Brytaren (Executive Dysfunction), RSD-Kylaren, Uppgifts-Krossaren, Speglings-Coachen, och Mönster-Arkivarien. Varje agent har exakta instruktioner för att förebygga stress, "bandwidth tax" och gaslighting.
- **Kvalitet:** All kod måste vara strikt typad (TypeScript), modulär och inkludera felhantering för nätverksavbrott.
- **GDPR/AADC:** Retentionsscript måste finnas. "High privacy" by default. Omfamna "Immutable Snapshots" via server-side tidsstämplar.
- **Strikt Designspråk:** UI/UX ska ovillkorligen följa temana "Obsidian Calm" (mörka, djupsvarta/grå rymd-toner) och "Nordic Dusk" (kalla, eleganta accenter). Naturteman (träd, skog, vatten, salviagröna toner, "digitala plantor") är **STRIKT FÖRBJUDNA**. Äldre begrepp som "Atmospheric Zen" eller "Eco-Kingdom" måste konverteras till abstrakt, geometrisk/neural rymd-estetik.

## 5. Backend & Databassäkerhet
Denna sektion definierar systemets Data Invariants och försvar mot "Dirty Dozen"-attackvektorerna. Inga AI-genererade kodförslag får någonsin bryta mot dessa regler när databasen (Firestore) byggs.

**Data Invariants:**
- `VaultLog` och `CheckIn` är **oföränderliga (immutable)** när de skapats (Sacred Feature) för att förhindra gaslighting.
- Alla dokument måste tillhöra ett specifikt `userId`. Användare kan endast läsa och skriva sin egen data.
- Verifierad e-post krävs för alla skrivoperationer.
- `NetworkMember` måste ha giltig kategori och importansnivå.
- `SystemSynapse` och `SystemScan` är kritiska och begränsade till ägaren.

**Dirty Dozen (Attackvektorer som måste blockeras):**
- **Spoofing & Leaks:** Identity Spoofing (Create/Update), Cross-User Leak (List/Get), Unauthenticated Write, Bypassing Verification.
- **Injection & Poisoning:** Malicious ID Injection, Shadow Field Injection, Resource Poisoning.
- **Tampering:** Vault Tampering, State Shortcut (efterhandskonstruktion av CheckIn), System Synapse Hijack.
