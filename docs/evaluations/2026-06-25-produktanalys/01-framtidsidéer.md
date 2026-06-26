# Prompt 1 — 25 framtidsidéer för Livskompassen

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar

---

## Nuläge: produkt, arkitektur och moduler

**Produktidé:** Livskompassen är ett personligt *Life OS* — inte en generisk wellness-app. Kärnan är att stödja vardag, återhämtning och dokumentation under hög psykosocial belastning (särskilt parallellt föräldraskap och konflikt med motpart), med lågaffektiv ton och kognitiv avlastning.

### Tre zoner (routing)

| Zon | Route | Innehåll |
|-----|-------|----------|
| **Hjärtat** | `/hjartat` | Dagbok, Speglar; Valv via drawer + PIN |
| **Vardagen** | `/vardagen` | MåBra, Planering, Ekonomi, Arbetsliv, Kompasser |
| **Familjen** | `/familjen` | Barnfokus, Livslogg, Barnporten, Trygg Hamn (BIFF) |

### Arkitektur (kort)

- **Frontend:** React/Vite, Obsidian Calm 2.0, Chameleon SuperModules (ett skal, många lägen)
- **Backend:** Firebase (Firestore, Functions, Auth, Storage)
- **Orkestrering:** ADK SynapseBus + AgentCards (`driveIngest`, `journal_woven`, `dcap_alert`, `widget_recording_ingested`)
- **DCAP:** Routing och riskklassning i kod *före* LLM (`classifyInboxDocument`, `routeFromDcap`, `analyzeMessage`)
- **Tre RAG-silos (U1):** Kunskap (`kampspar`/`kb_docs`) · Valv (`reality_vault`) · Barnen (`children_logs`) — ingen cross-RAG
- **WORM:** Append-only för bevis, journal, barnloggar, dossier m.m.
- **Zero Footprint:** Rensning vid logout/blur/panic; Speglar/Hamn utan persistent RAG
- **Valv:** Plausible deniability — Kunskapsbank och känslig UI bakom PIN; drawer visar Valv-sektion endast när upplåst

### Befintliga moduler (urval)

Valv (Mönster, Orkester, Dossier, Aktörskarta), Smart Inkast (G10), Dagbok + Vävaren, Speglar, BIFF/Hamn, DCAP, Barnporten (HITL→Valv), Ekonomi (WORM-transaktioner), Planering/Projekt hybrid, MåBra/Vit, Drogfrihet, Arbetsliv, Stämpla, Fyren-widgets, Emotionellt minne, Kunskapsvalvet (Kompis).

---

## 1. Små förbättringar

### 1.1 Zonmedveten Fyren

- **Beskrivning:** Fyren-sökfältet föreslår endast relevanta mål baserat på aktiv zon (t.ex. Hamn i Familjen, Dossier i Valv).
- **Varför:** Minskar valstress; Fyren och zonsystemet finns redan.
- **Modul:** `FyrenWidgetBar`, `appNavigation.ts`
- **Risk:** Låg | **Svårighet:** Låg
- **MVP:** 3–5 förslag per zon, inga nya routes.
- **Skydda:** Inga Valv-länkar i publikt läge; ingen cross-silo-sök.

### 1.2 Optimistic save i Ekonomi mikrosteg

- **Beskrivning:** Direkt visuell bekräftelse vid snabb registrering (samma mönster som Barnfokus).
- **Varför:** ADHD-säker feedback; ekonomimodulen har redan mikrosteg-delegates.
- **Modul:** Ekonomi SuperModule
- **Risk:** Låg | **Svårighet:** Låg
- **MVP:** Optimistic UI + rollback vid Firestore-fel.
- **Skydda:** WORM-transaktioner append-only; ingen client-side `update` på WORM.

### 1.3 Journal snabb-taggar

- **Beskrivning:** Senaste 3–5 taggar/kategorier som chips vid ny dagbokspost.
- **Varför:** Mindre friktion i dagboksflödet; `smoke:journal-2d` visar att kategorier redan finns.
- **Modul:** Dagbok SuperModule
- **Risk:** Låg | **Svårighet:** Låg
- **MVP:** Lokal cache av senaste val, inga nya collections.
- **Skydda:** Journal WORM; inga auto-promotes till Valv.

### 1.4 Valv auto-blur vid app-byte

- **Beskrivning:** Kortare nedräkning (`VaultCountdown`) när appen lämnas med öppet Valv.
- **Varför:** Zero Footprint i praktiken; komponenten finns redan.
- **Modul:** `VaultCountdown`, `VaultZoneGate`
- **Risk:** Medel (UX) | **Svårighet:** Låg
- **MVP:** Blur + lås efter 30 s i bakgrund.
- **Skydda:** Plausible deniability — inga Valv-spår i publikt chrome efter lås.

### 1.5 Planering P3 swipe på mobil

- **Beskrivning:** Swipe vänster/höger på Kanban-kort (todo ↔ waiting ↔ done).
- **Varför:** G85 touch-first; P3 Kanban är locked UX.
- **Modul:** Planering hub
- **Risk:** Låg | **Svårighet:** Medel
- **MVP:** Tre kolumner, inga nya vyer.
- **Skydda:** Hybrid-spec — P3 fixed på `/planering`.

---

## 2. Medelstora modulutbyggnader

### 2.1 Inkast batch-granskning

- **Beskrivning:** Samlad vy för `inbox_queue` med godkänn/avvisa/routing-override per post.
- **Varför:** G10/DCAP skickar redan osäkra poster till review; `smoke:confirm-inbox` finns.
- **Modul:** Inkast, `inboxPersist.ts`
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Lista + tre actions; trauma/LVU alltid manuell.
- **Skydda:** DCAP före LLM; barnen/Valv kräver explicit HITL.

### 2.2 Dossier ↔ Tidshjul tidslinje

- **Beskrivning:** Visuell tidslinje som kopplar Dossier-händelser till `tidshjul`-data i Valv.
- **Varför:** Beviskedja för myndighet/advokat; båda modulerna finns.
- **Modul:** Dossier, Kompis/tidshjul
- **Risk:** Medel | **Svårighet:** Medel–Hög
- **MVP:** Read-only tidslinje i Dossier-fliken, export som PDF.
- **Skydda:** Endast Valv-silo-RAG; beteende + datum, aldrig diagnos på motpart.

### 2.3 Stämpla → Planering/Arbetsliv

- **Beskrivning:** Stämpelklocka föreslår planeringspost eller arbetsliv-logg vid avslutat pass.
- **Varför:** Kopplar admin (`stampla`) till vardagszonen utan ny modul.
- **Modul:** Stämpla, Planering, Arbetsliv
- **Risk:** Låg | **Svårighet:** Medel
- **MVP:** "Skapa uppgift från pass" — en knapp, användaren bekräftar.
- **Skydda:** Ingen auto-WORM till Valv.

### 2.4 Speglar → Hamn BIFF-handoff

- **Beskrivning:** Efter spegling av inkommande meddelande: ett steg till BIFF/Grey Rock i Trygg Hamn.
- **Varför:** Naturligt flöde Speglar→Hamn; `BiffRewriteButton` och DCAP finns.
- **Modul:** Speglar, Safe Harbor
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Handoff med förifylld text (ephemeral), användaren redigerar och sparar.
- **Skydda:** Zero Footprint — inget persistent RAG i Speglar; Hamn-spar → `reality_vault` via befintlig pipeline.

### 2.5 Emotionellt minne i MåBra-session

- **Beskrivning:** Efter MåBra-session: valfri länk till `vit_entries` (känslominnen) utan att blanda silos.
- **Varför:** Vit-hub och emotional memory finns; stärker återhämtningsspåret.
- **Modul:** MåBra, Emotionellt minne
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Manuell "Spara som känslominne" efter session.
- **Skydda:** Ingen cross-RAG Kunskap↔Vit; `mabraCoach` parafras bank only.

---

## 3. Stora framtida produktspår

### 3.1 Offline-first capture + inkast-kö

- **Beskrivning:** Fånga text/röst lokalt utan nät; synka till Inkast när uppkoppling finns.
- **Varför:** ADHD + dålig täckning; `offlineWritePolicy.ts` och widget-ingest finns som grund.
- **Modul:** Inkast, Fyren widget, Capture
- **Risk:** Hög (data) | **Svårighet:** Hög
- **MVP:** Text-only offline-kö med krypterad lokal lagring + synk-indikator.
- **Skydda:** Zero Footprint — rensa lokal kö vid panic; ingen Valv-data i klartext offline.

### 3.2 Myndighetsexportpaket (Dossier v3)

- **Beskrivning:** Strukturerat exportpaket (PDF + metadata + hash-verifiering) för soc/BUP/advokat.
- **Varför:** Kärnuse case för Valv; `ValvExporteraZone` och `wormHashChain.ts` finns.
- **Modul:** Dossier, Valv export
- **Risk:** Hög (juridik) | **Svårighet:** Hög
- **MVP:** Fast mall + innehållsforteckning + server-tidsstämpel per bilaga.
- **Skydda:** WORM integritet; PMIR för exportformat; inga motpartsdiagnoser.

### 3.3 Barnporten åldersladder

- **Beskrivning:** CB1→CB4 UX som växer med barnets ålder (Barnporten-spec redan låst).
- **Varför:** Långsiktig Familjen-produkt; agent-registry och widget CB1–CB4 finns.
- **Modul:** Barnporten
- **Risk:** Medel | **Svårighet:** Hög
- **MVP:** En åldersprofil per barn → en enklare widget-layout.
- **Skydda:** Barnporten HITL till Valv; aldrig auto-promote barnlogg → Valv.

### 3.4 Android widget-ekosystem

- **Beskrivning:** Full W1–W4 (Förälder) + CB1–CB4 (Barn) som native Capacitor-widgets.
- **Varför:** `android-kompis`-skill, Fyren och Action Dashboard redan designade.
- **Modul:** Widgets, Android/Capacitor
- **Risk:** Medel | **Svårighet:** Hög
- **MVP:** W1 kompakt + tyst inspelning (befintlig ingest-synapse).
- **Skydda:** Widget ≠ Barnporten inspelning; Zero Footprint vid widget-timeout.

### 3.5 Parallel Parenting Kunskap-spår

- **Beskrivning:** Kuraterat FACT-innehåll om logistik, LVU-process, BUP — separat från HCF cn-* seeds.
- **Varför:** `specialist-myndighet-seed` och Kunskapsvalvet passar; FACT-only.
- **Modul:** Kunskap (Valv PIN), kampspar
- **Risk:** Medel (innehåll) | **Svårighet:** Medel
- **MVP:** 10–15 kort i `kb_docs` med dirigent-godkännande.
- **Skydda:** Kunskap-silo only; ingen auto-rådgivning; PMIR för nytt FACT-innehåll.

---

## 4. Säkerhets- och integritetsförstärkningar

### 4.1 WORM hash-kedja granskning

- **Beskrivning:** UI i Valv som visar att WORM-poster inte ändrats (hash-kedja audit).
- **Varför:** `wormHashChain.ts` och `smoke:vault-worm` — bygger förtroende inför export.
- **Modul:** Valv, backend jobs
- **Risk:** Låg | **Svårighet:** Medel
- **MVP:** "Verifiera integritet" för senaste 30 Valv-poster.
- **Skydda:** Read-only; inga client-side hash-ändringar.

### 4.2 Panic mode v2 (RAM-wipe)

- **Beskrivning:** Utökad kill-switch: rensa synapse-state, draft-fält, clipboard-hints, Valv-session.
- **Varför:** `clearSynapseState` finns; plausible deniability kräver snabb exit.
- **Modul:** Core security, SOS
- **Risk:** Medel (UX) | **Svårighet:** Medel
- **MVP:** En SOS-gest → omedelbar blur + navigera till neutral hub.
- **Skydda:** WORM i molnet orörd; endast klient-state.

### 4.3 Valv PIN enhetsbindning

- **Beskrivning:** Valfri koppling av Valv-PIN till enhet/biometri (Android Keystore).
- **Varför:** Stärker Valv utan att synas i publikt läge.
- **Modul:** VaultPage, Android
- **Risk:** Hög (lås ute) | **Svårighet:** Hög
- **MVP:** Biometri som *extra* lager ovanpå PIN, inte ersättning.
- **Skydda:** Recovery-väg via e-post; PMIR för auth-flöde.

### 4.4 App Check + enhetsattestering

- **Beskrivning:** Full `APP_CHECK_ENFORCE` i prod med tydlig dev-bypass.
- **Varför:** Redan i PMIR-listan; `appCheck.ts` finns.
- **Modul:** Core Firebase
- **Risk:** Hög (deploy) | **Svårighet:** Medel
- **MVP:** Enforce på Valv-callables först, resten stegvis.
- **Skydda:** Pontus OK i Console; dev-emulator undantag dokumenterat.

### 4.5 Retention dashboard (mutable data)

- **Beskrivning:** Användaren ser och styr retention för *icke-WORM* data (`retentionJob.ts`).
- **Varför:** GDPR + Zero Footprint; WORM får inte raderas.
- **Modul:** Admin, retention job
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Lista mutable collections + "radera äldre än X månader".
- **Skydda:** WORM collections undantagna; arkiv-först vid mass-radering.

---

## 5. AI/agent-funktioner som passar projektet

### 5.1 DCAP ephemeral BIFF-assistent

- **Beskrivning:** Real-time Grey Rock/BIFF-förslag i Speglar/Hamn — inget sparas förrän användaren väljer.
- **Varför:** DCAP + `analyzeMessage` är kärnprodukt; passar lågaffektiv ton.
- **Modul:** DCAP, Speglar, Hamn
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Ett förslag + "Kopiera" / "Spara till Valv" (explicit).
- **Skydda:** Ephemeral; `sharedRules.ts` PMIR vid prompt-ändring; ingen diagnos på motpart.

### 5.2 Inkast routing-förklaring

- **Beskrivning:** Visa *varför* DCAP/heuristik valde silo (confidence, rationale-fält).
- **Varför:** `InboxClassification.rationale` finns redan; ökar tillit utan ny AI.
- **Modul:** Inkast, `inboxClassifier.ts`
- **Risk:** Låg | **Svårighet:** Låg
- **MVP:** Visa rationale + confidence i review-kön.
- **Skydda:** LLM får inte override heuristik för trauma/LVU.

### 5.3 Mönster-digest (Monster-Arkivarien)

- **Beskrivning:** Veckovis lågaffektiv sammanfattning av detekterade mönster i Valv (opt-in).
- **Varför:** `VaultMonsterPanel`, `dcap_alert`-synapse, `generateWeeklyInsights` — naturlig förlängning.
- **Modul:** Valv Mönster, ADK
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** E-post/push av 3 bullets + länk till Valv (PIN krävs).
- **Skydda:** Valv-silo only; ingen cross-RAG; opt-in.

### 5.4 Vävaren metadata-förslag (HITL)

- **Beskrivning:** Efter dagbok: AI föreslår taggar/kategori — användaren godkänner (`weaverApprovalService`).
- **Varför:** `journal_woven`-synapse och HITL-smoke finns.
- **Modul:** Dagbok, Vävaren
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Förslag visas som chips; sparas först efter godkännande.
- **Skydda:** Journal WORM append-only; ingen auto-promote till Valv.

### 5.5 Barnen-silo fråge-UI med epistemic guard

- **Beskrivning:** Förbättrad `childrenLogsQuery`-chatt med tydlig "observation vs tolkning"-markering.
- **Varför:** `childObservationEpistemics` och `smoke:barn-epistemik` — produktdifferentiering.
- **Modul:** Familjen, children RAG
- **Risk:** Medel | **Svårighet:** Medel
- **MVP:** Citat + epistemic badge per svar.
- **Skydda:** Barnen-silo only; aldrig Valv-innehåll i svar.

---

## Topp 5 mest lovande

| # | Idé | Varför |
|---|-----|--------|
| 1 | **Inkast batch-granskning** | Hög vardagsnytta; infra (G10, review-kö, smoke) finns redan |
| 2 | **DCAP ephemeral BIFF-assistent** | Träffar kärnproblemet (konflikt-kommunikation) utan att bryta Zero Footprint |
| 3 | **Dossier ↔ Tidshjul tidslinje** | Stärker Valv som bevisverktyg — unikt vs wellness-appar |
| 4 | **Offline-first capture** | Konkret ADHD-nytta; bygger på befintlig capture/widget/inkast |
| 5 | **Inkast routing-förklaring** | Liten insats, stor tillit; använder befintlig DCAP-data |

---

## Topp 3 farliga idéer (ser bra ut, skadar troligen produkten)

| # | Idé | Varför farlig |
|---|-----|----------------|
| 1 | **"Sök överallt" / unified assistant** | Bryter U1 tre silos; risk för läckage Valv→publikt och cross-RAG |
| 2 | **Streaks / XP / dagliga utmaningar i MåBra** | Motverkar Obsidian Calm, skapar skuldpress — explicit förbjudet i design-kanon |
| 3 | **Auto-promote barnlogg → Valv** | Bryter Barnporten HITL och WORM-etik; juridiskt och relationellt riskabelt |

**Nära farliga hedersomnämnanden:** AI-terapeut utan content bank; social delning av "framsteg"; diagnos-etiketter på motpart i DCAP/Valv.
