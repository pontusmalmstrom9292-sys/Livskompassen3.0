# Prompt 5 — Hamn / BIFF / Konfliktstöd nästa nivå

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Konfliktkommunikation · trauma-informed UX · produktstrateg · säkerhetsarkitekt

---

## Nuläge (kort)

**Route:** `/familjen?tab=hamn` — `TryggHamnHub` med sub-tabs (Översikt, BIFF, Speglar, Barn).

**Kärnkomponenter:**
- `BiffPublicPanel` — publikt läge: 3-stegs wizard (meddelande → brusfilter → mål), realtime **JADE-detektor** (`jadeDetector.ts`), **taktik-signaler** (`hamnTaktikWire.ts`), `useHamnBiffWizard` → `analyzeMessage` (module `safe_harbor`)
- `HamnForensicPanel` — Valv `hamn_analys`: samma wizard + **Spara som bevis** + autosort via `submitCaptureDraft` (`sourceModule: hamn_biff`)
- `BiffTriagePanel` — logistik vs beten, maskerade beten, DCAP risk, `TheoryWithoutEvidenceBadge`
- **Brusfilter:** copy + länk Speglar; backend `processBrusfilter` i Capture/Inkast
- **BIFF rewrite:** `biffRewriteDraft` + `BiffRewriteButton`
- **DCAP:** regex + semantisk lager; `Gräns-Arkitekten` via analyzeMessage
- **Zero Footprint:** "Klar — rensa"; inget auto-skick; ephemeral svar
- **Valv-väg:** `HandoffBox`, `shouldShowValvHandoff`, inkast heuristik `hamn_biff` → `reality_vault`
- **Kanon:** skrift före telefon (`written_only_escalation`), ingen diagnos på motpart, Hamn ≠ Kunskap-coaching

---

## 15 förbättringsidéer

### 1. Enhetlig 3-stegs wizard i publikt + Valv

**Beskrivning:** Synka steg 1–3 (meddelande / brusfilter / mål) mellan `BiffPublicPanel` och `HamnForensicPanel` — idag delvis divergerande UX.

**Varför:** Samma mental modell oavsett zon; minskar kognitiv omställning.

**Risker:** Medel — Valv-steg får inte kännas tyngre i publikt läge.

**Beroenden:** Befintlig step-state i båda paneler.

**MVP:** Delad `HamnWizardSteps`-komponent + samma copy från `hamnCopy.ts`.

---

### 2. "Svara skriftligt"-snabbmall vid telefon-eskalering

**Beskrivning:** När `written_only_escalation` triggas → one-tap Grey Rock-mall med datum/logistik.

**Varför:** `hamn-written-default.mdc` + cop-007; högfrekvent HCF-scenario.

**Risker:** Låg — statisk mall, ingen LLM.

**Beroenden:** `detectHamnTaktikSignal`, befintlig `handleCleanToGreyRock`.

**MVP:** En knapp + 2 mallvarianter (bekräftelse / schema).

---

### 3. Logistik-extrahering före AI (deterministisk)

**Beskrivning:** Regex/heuristik plockar datum, tid, barnnamn, plats → chips före `analyzeMessage`.

**Varför:** 10/90-separation i UI utan att vänta på LLM; trauma-informed (fakta först).

**Risker:** Låg — false positives ok med manuell redigering.

**Beroenden:** Ny liten util (Hamn-sidecar); ingen WORM.

**MVP:** Chips under textarea efter paste.

---

### 4. Spara bevis-paket (inkommande + utkast svar)

**Beskrivning:** Ett WORM-paket: original sms + föreslaget Grey Rock + triage-snapshot (metadata sidecar).

**Varför:** Forensiskt värde; idag sparas ofta bara `truth: message`.

**Risker:** Medel — sidecar får inte mutera WORM-kropp; PMIR om schema.

**Beroenden:** `saveVaultLog`, ev. `pattern_scan_metadata`-liknande sidecar.

**MVP:** Valv forensic: spara tvåfält `truth` + `draftReply` i en post (append-only keys PMIR).

---

### 5. Brusfilter inbäddat (inte bara collapsible)

**Beskrivning:** Steg 2 "kärnfråga" kopplas till `processBrusfilter` callable för isolated logistics.

**Varför:** Brusfilter finns i backend men Hamn använder mest manuell textarea.

**Risker:** Medel — LLM i brusfilter; måste vara ephemeral + tone guard.

**Beroenden:** `processBrusfilter`, `CapturePanel`-mönster.

**MVP:** "Föreslå kärnfråga" knapp i steg 2 — användaren redigerar.

---

### 6. Speglar ↔ Hamn handoff (state)

**Beskrivning:** Efter Speglar "Svart på vitt" → Hamn med `initialMessage` + känsla (redan delvis).

**Varför:** Naturlig pipeline emotionell validering → BIFF-svar.

**Risker:** Låg — Zero Footprint på state.

**Beroenden:** Router state, `BiffPublicPanel` `fromSpeglar`.

**MVP:** Tydlig banner + rensa state vid "Klar".

---

### 7. Planering inkorg → Hamn routing (förstärk)

**Beskrivning:** `PlaneringInkorgPanel` visar redan `routeToHamn` — deep link med förifylld text.

**Varför:** Ex-brus i fel silo = kognitiv skada.

**Risker:** Låg.

**Beroenden:** Befintlig paste routing hint.

**MVP:** `?tab=hamn&prefill=…` URL-param (client only, truncated).

---

### 8. HITL-paus vid hög DCAP-risk

**Beskrivning:** När `hitlRequired` → blockera "kopiera svar" tills användaren checkar "Jag har läst triage".

**Varför:** Trauma-informed pause; minskar impuls-svar under hypervigilans.

**Risker:** Medel UX — får inte kännas straff.

**MVP:** En checkbox + mjuk copy "Svara senare är ok".

---

### 9. Mikrosteg-läge (endast inklistra → svar)

**Beskrivning:** Toggle "Jag orkar inte triage" — hoppa över steg 2–3, kort svar direkt.

**Varför:** Låg kognitiv ork / dissociation.

**Risker:** Medel — sämre kvalitet; visa disclaimer.

**Beroenden:** `useHamnBiffWizard.analyze` med kort payload.

**MVP:** En switch i steg 1.

---

### 10. Autosort → review-kö synlighet

**Beskrivning:** Efter `submitCaptureDraft` från Hamn — länk till Inkast review med status.

**Varför:** Användaren ser att bevis hamnat rätt (`hamn_biff` → `bevis`).

**Risker:** Låg.

**Beroenden:** Inkast batch-granskning (prompt 1/2).

**MVP:** Länk "Granska i Inkast" efter autosort.

---

### 11. JADE-detektor utökad + undo

**Beskrivning:** Förbättra `analyzeJadePatterns` med fler svenska mönster; undo efter "Städa till Grey Rock".

**Varför:** Realtime stöd utan AI; redan i publikt panel.

**Risker:** Låg — false positives med manuell undo.

**Beroenden:** `jadeDetector.ts`.

**MVP:** +10 regex, undo-knapp.

---

### 12. Kopiera-svar med SMS-meta

**Beskrivning:** Kopiera Grey Rock + valfri signatur "Hälsningar, [namn]" — ingen auto-send.

**Varför:** Praktisk vardag; appen skickar aldrig sms (säkerhet).

**Risker:** Låg.

**Beroenden:** Clipboard API.

**MVP:** "Kopiera" knapp med toast.

---

### 13. Hamn session timer / Klar-forcerad rensning

**Beskrivning:** Efter 15 min inaktivitet eller "Klar" — wipe textarea + wizard state (Zero Footprint).

**Varför:** Plausible deniability om telefon lämnas.

**Risker:** Medel — förlorad draft; ok för Hamn (ephemeral design).

**Beroenden:** `clearSynapseState`-mönster.

**MVP:** Auto-clear on blur + confirm om text finns.

---

### 14. Taktik-lexikon inline (FACT-länk utan RAG)

**Beskrivning:** `HamnTaktikLexikonBro` → deep link till Valv kunskapsbank med anchor (PIN), inte inline LLM.

**Varför:** Metod vs coaching-separation (hamnCopy).

**Risker:** Låg — ingen cross-RAG.

**Beroenden:** Valv `kunskapsbank`, cn-* seeds.

**MVP:** Länk med `vaultTab=kunskapsbank&fact=cop-007`.

---

### 15. Dubbelspår: logistik-svar vs "inget svar"

**Beskrivning:** Efter triage — två explicita förslag: (A) kort logistik-svar (B) tystnad / vänta.

**Varför:** Grey Rock inkluderar ofta *ingen* respons; minskar skuldkänsla.

**Risker:** Låg.

**Beroenden:** `GransAnalysis.greyRockReply` + statisk "wait"-mall.

**MVP:** Två kort under triage.

---

## 5 UI-idéer (fokus låg arousal / låg ork)

### UI-1. Progress-dots för wizard (1·2·3)

**Beskrivning:** Visuell stegindikator utan procent/streak.  
**Varför:** Orientation utan pressure.  
**Risker:** Låg.  
**Beroenden:** Delad wizard-komponent.  
**MVP:** Tre prickar + aria-label.

---

### UI-2. "Beten maskerade" som default (redan delvis)

**Beskrivning:** Förstärk blur på emotional bait tills "Visa brus" — som `BiffTriagePanel`.  
**Varför:** Minskar re-triggering.  
**Risker:** Låg.  
**Beroenden:** BiffTriagePanel CSS.  
**MVP:** Starkare blur + trigger warning.

---

### UI-3. Paralys-panel (ett fält)

**Beskrivning:** Fullscreen minimal: textarea + "Hjälp mig svara" — döljer sub-tabs.  
**Varför:** `lowCapacity` paritet från Dagbok/Planering.  
**Risker:** Medel — göm inte SOS.  
**Beroenden:** `isLowHomeCapacity`.  
**MVP:** Query `?hamn=minimal`.

---

### UI-4. Färgkodning risk utan alarm

**Beskrivning:** DCAP risk som muted gold/indigo — aldrig blinkande röd banner.  
**Varför:** Obsidian Calm; hypervigilans.  
**Risker:** Låg.  
**Beroenden:** `riskTone` i BiffTriagePanel.  
**MVP:** Justera tokens till muted.

---

### UI-5. Post-action "Andas / Klart" skärm

**Beskrivning:** Efter kopiera/spara — en skärm "Du behöver inte svara nu" + stäng.  
**Varför:** Trauma-informed closure.  
**Risker:** Låg — ingen wellness-klysch.  
**Beroenden:** Wizard reset.  
**MVP:** Modal light efter copy.

---

## 5 AI/agent-idéer

### AI-1. Wire `analyzeBiffMessageInVault` till forensic panel

**Beskrivning:** Valv Hamn använder `module: valv_orkester` + vault session — idag samma hook som publikt.  
**Varför:** `biffService.ts` har redan separat callable path.  
**Risker:** Medel — fel gate blockar legitima users.  
**Beroenden:** `withVaultSessionPayload`, `vaultSessionGate`.  
**MVP:** Switch i `HamnForensicPanel` only.

---

### AI-2. Ephemeral BIFF — inget spar utan explicit

**Beskrivning:** Dokumentera/enforce: analyzeMessage svar lagras inte server-side för Hamn (only client).  
**Varför:** Zero Footprint policy.  
**Risker:** Låg om redan sant — verifiera logs.  
**Beroenden:** Backend audit.  
**MVP:** Smoke assertion i `smoke:hamn`.

---

### AI-3. DCAP alert feedback loop i Hamn

**Beskrivning:** När alert skapas → "Stämmer risknivån?" ja/nej → `dcapAlertReview`.  
**Varför:** `dcapEscalation.ts` feedback hook finns.  
**Risker:** Medel — optional, inte blocking.  
**Beroenden:** `dcap_alert` WORM.  
**MVP:** Två knappar efter hög risk.

---

### AI-4. BiffRewrite integrerad i Hamn steg 1

**Beskrivning:** "Städa mitt utkast" via `biffRewriteDraft` på *ditt* svar (inte bara Dagbok-knapp).  
**Varför:** `BiffRewriteButton` finns; Hamn har egen JADE-bar — kompletterande.  
**Risker:** Medel — toneCheck `still_emotional`.  
**Beroenden:** `biffRewriteDraft` callable, PMIR prompts.  
**MVP:** Knapp under textarea i publikt läge.

---

### AI-5. Gräns-Arkitekten kort coachingNote guard

**Beskrivning:** Trunkera/dölj `coachingNote` om >2 meningar eller `too_fixing` tone.  
**Varför:** Undvik terapeut-ton i Hamn.  
**Risker:** Låg.  
**Beroenden:** `sharedRules.ts` (PMIR) eller client guard.  
**MVP:** Client truncate + "Visa mer" collapsible.

---

## 5 saker att absolut inte bygga

| # | Undvik | Varför |
|---|--------|--------|
| N1 | **Auto-skicka sms/e-post till motpart** | Säkerhets- och relationsrisk; bryter Zero Footprint-manual control |
| N2 | **Diagnos/etiketter på motpart i UI** ("narcissist") | Domän-kanon; juridiskt och etiskt gift |
| N3 | **Hamn-coaching via Kunskap RAG** | Silo-brott; metod ska vara FACT-länk, inte blended chat |
| N4 | **Gamification (poäng för Grey Rock, streaks)** | Skuldpress; fel arousal |
| N5 | **Persistent chat-historik med motpart tråd** | Övervaknings-/feed-känsla; motpart-dialog ska vara ephemeral per session |

---

## Prioriterad MVP-våg (rekommendation)

| Våg | Leverans |
|-----|----------|
| **1** | Kopiera-svar, skrift-mall, JADE undo, UI progress dots, mikrosteg-läge |
| **2** | Brusfilter callable i steg 2, bevis-paket, HITL-paus, Valv analyze wire |
| **3** | Logistik-chips, DCAP feedback, autosort→inkast länk, session auto-clear |

---

## Invariants

- Hamn = ephemeral BIFF + triage; Valv = WORM bevis (explicit)
- DCAP/heuristik före LLM för routing (`inboxClassifier` hamn → bevis)
- Ingen JADE i förslag; skrift default vid telefon-eskalering
- Speglar för validering; Hamn för svar; MåBra guard redirect
- `smoke:hamn` + `smoke:biff-rewrite` + locked UX Trygg Hamn
- PMIR vid `sharedRules.ts` / analyzeMessage prompt-ändringar
