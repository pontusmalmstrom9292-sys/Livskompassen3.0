# Prompt 9 — Agenter / synapser / AI-rollfördelning

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Multi-agent systems architect

---

## Nuläge (kort)

**Supervisor:** `KompisSupervisor` — DCAP först → `routeFromDcap` → **2 executors** (`livsArkivarien`, `gransArkitekten`) via `AdkOrchestrator`.

**Produktkort (10):** Livs-Arkivarien · Gräns-Arkitekten · Sannings-Analytikern · Brusfiltret · BIFF-Skölden · Paralys-Brytaren · RSD-Kylaren · Uppgifts-Krossaren · Speglings-Coachen · Mönster-Arkivarien — registrerade i `AvailableAgents`, men många mappas till samma executor.

**SynapseBus (6 triggers):** `drive_file_ingested` · `journal_woven` · `dcap_alert` · `user_overwhelm` · `widget_recording_ingested` · `kasam_aggregation`.

**Parallella AI-vägar (ej alltid via orchestrator):**

| Väg | Roll | Skriv? |
|-----|------|--------|
| `classifyInboxDocument` | Klassificering | → inbox_queue / WORM via HITL |
| `valvChatQuery` | Bevis-RAG + svar | read-only |
| `mabraCoach` | Parafras bank | read-only + `mabraCoachGuard` |
| `analyzeDcap` | Safety | synapse → `dcap_alerts` HITL |
| `KompisSupervisor` | Rådgivning/delegation | ephemeral svar |

**Guardrails idag:** `heuristicInboxClassify` före LLM · `gatekeeperSanitize` · `assertCollectionAccess` · `assertBackendSiloIsolation` · `epistemicGuard` · `mabraCoachGuard` · `monitor` structured logs · `adk_traces` (24h TTL).

**Problem:** Produktroller ≠ runtime-executors (magisk hopfällning) · klassificering och coach delar inte samma trace · `routeFromDcap` grov (hög risk → samma agent som låg coaching) · observability splittrad mellan console och `adk_traces`.

---

## 12 konkreta agent-/synapseförbättringar

### 1. Formalisera Inkorg-Sorteraren som read-only agent

| Fält | Innehåll |
|------|----------|
| **Gör** | Endast `heuristicInboxClassify` + LLM JSON → `InboxClassification` |
| **Problem** | Klassificering göms i lib, svår att auditera |
| **Får läsa** | Inkast-text, filnamn, `sourceModule` |
| **Får inte läsa** | `kampspar`, `reality_vault`, `children_logs` |
| **Läge** | **Read-only** · skriv endast via `routeInboxToWorm` efter HITL |

---

### 2. Dela valvChat i Retrieval + Sannings-Analytiker

| Fält | Innehåll |
|------|----------|
| **Gör** | Steg 1: `fetchVaultEvidenceForQuery` · Steg 2: JSON-svar med citations |
| **Problem** | Ett anrop blandar RAG, entity metadata och generering |
| **Får läsa** | `reality_vault`, `entity_profiles` (metadata) |
| **Får inte läsa** | `kampspar`, journal, barnlogg |
| **Läge** | **Read-only** · PIN/session krävs · `theoryWithoutEvidence` flag |

---

### 3. Separata executors för Brusfiltret vs BIFF vs Gräns-analys

| Fält | Innehåll |
|------|----------|
| **Gör** | Tre intents, tre prompts — samma `gransArkitekten` backend men explicit intent i trace |
| **Problem** | All konflikt-hantering ser likadan ut i loggar |
| **Får läsa** | Endast användarens inklistrade text |
| **Får inte läsa** | Vault, Kunskap-RAG |
| **Läge** | **Read-only** · Zero Footprint default i Hamn |

---

### 4. Förfina `routeFromDcap` (4 band istället för 3)

| Fält | Innehåll |
|------|----------|
| **Gör** | 0–29 → retrieval · 30–49 → spegling/coach · 50–69 → gräns-analys · 70+ → ALERT + BIFF |
| **Problem** | Medelrisk får samma BIFF-path som akut |
| **Får läsa** | DCAP-resultat only (deterministisk) |
| **Får inte läsa** | RAG före routing |
| **Läge** | **Read-only routing** · inga writes |

---

### 5. Synapse-spårbarhet: `traceId` i alla callables

| Fält | Innehåll |
|------|----------|
| **Gör** | Returnera `traceId` + `productAgentId` + `executorId` till klient (dev/admin) |
| **Problem** | "Magiska" flöden — Pontus kan inte se vem som svarade |
| **Får läsa** | `adk_traces`, structured logs |
| **Får inte läsa** | Rå journal i trace payload |
| **Läge** | **Read-only observability** · hash av input i stället för text |

---

### 6. Unified HITL-kontrakt för inbox + DCAP

| Fält | Innehåll |
|------|----------|
| **Gör** | `inbox_queue` + `dcap_alerts` → samma UI-modell: preview · confirm · dismiss |
| **Problem** | Två HITL-system med olika mentala modeller |
| **Får läsa** | Klassificerings-preview, riskScore |
| **Får inte läsa** | Auto-skriv till Valv utan confirm |
| **Läge** | **HITL write-capable** endast efter mänskligt godkännande |

---

### 7. `journal_woven` — dubbel bekräftelse i UI + synapse

| Fält | Innehåll |
|------|----------|
| **Gör** | UI toggle + server `optIn === true` + duplicate guard |
| **Problem** | Risk att dagbok läcker till Kunskap utan avsikt |
| **Får läsa** | Enskild journalpost (opt-in) |
| **Får inte läsa** | Hela kampspar · andra silos |
| **Läge** | **Write-capable** · **HITL** · WORM `kampspar` append |

---

### 8. MåBra-coach som bank-only executor

| Fält | Innehåll |
|------|----------|
| **Gör** | `fetchBankParafrasCoach` — deterministisk bankId, parafras LLM |
| **Problem** | Risk att coach blir generell terapeut eller hämtar Kunskap |
| **Får läsa** | `Mabra-CONTENT-BANK` (REFLECTION/PLAY) |
| **Får inte läsa** | `kampspar`, `reality_vault`, ex-SMS context |
| **Läge** | **Read-only svar** · redirect via `mabraCoachGuard` |

---

### 9. Widget ingest-synapse: explicit pipeline-steg i logg

| Fält | Innehåll |
|------|----------|
| **Gör** | `widget_recording_ingested`: commit → analyze → route (DCAP) → WORM |
| **Problem** | WH1 svår att felsöka vid fel silo |
| **Får läsa** | Transcript/metadata för ägaren |
| **Får inte läsa** | `kb_docs` · auto barnlogg |
| **Läge** | **Write-capable** → `reality_vault` · etikgrind i UI |

---

### 10. Paralys-Brytaren som ren mikrosteg-agent (ingen RAG)

| Fält | Innehåll |
|------|----------|
| **Gör** | `user_overwhelm` synapse · `applyParalysBreak` · max 1 steg |
| **Problem** | Orchestrator kan lägga paralys ovanpå tungt RAG-svar |
| **Får läsa** | Användarens korta text · ev. `rutiner` |
| **Får inte läsa** | Valv, barn, Kunskap cross-RAG |
| **Läge** | **Read-only svar** · optional `microSteps` i response |

---

### 11. Mönster-Arkivarien → batch-only (ingen realtid-chat)

| Fält | Innehåll |
|------|----------|
| **Gör** | Veckojobb / manuell trigger · `rescanPatternMetadata` |
| **Problem** | Pattern analysis i live-chat ökar latens och hallucination |
| **Får läsa** | `kampspar`, `user_insights`, `user_daily_focus`, ingest-metadata |
| **Får inte läsa** | `children_logs` utan separat barn-pipeline |
| **Läge** | **Read-only analys** · writes endast `user_insights` med HITL preview |

---

### 12. Zero Footprint: `clearSynapseState` på logout/panic/vault lock

| Fält | Innehåll |
|------|----------|
| **Gör** | Callable + frontend hook → `adkOrchestrator.clearContext(uid)` |
| **Problem** | Traces kan ligga kvar 24h med mutations metadata |
| **Får läsa** | contextId |
| **Får inte läsa** | — |
| **Läge** | **Write-capable** (delete trace) · obligatorisk på session end |

---

## 5 nya agentroller (värdefulla)

### N1. Sammanfattnings-Agenten

| Fält | Innehåll |
|------|----------|
| **Gör** | Kort neutral sammanfattning av *en* post — inga råd |
| **Problem** | Summarization blandas med coaching i Kompis |
| **Får läsa** | En dokumentpost (journal/vault/inbox preview) |
| **Får inte läsa** | Cross-silo RAG · andra användares data |
| **Läge** | **Read-only** · ingen WORM-write |

---

### N2. Safety-Review-Agenten (post-draft)

| Fält | Innehåll |
|------|----------|
| **Gör** | Granskar utkast (BIFF-svar, dossier-text) för JADE/leakage före användaren skickar |
| **Problem** | Användaren skickar affektiva svar i affekt |
| **Får läsa** | Utkast-text only |
| **Får inte läsa** | Vault history för "bevis" i samma turn |
| **Läge** | **Read-only** · Hamn/Speglar · HITL — användaren skickar själv |

---

### N3. Kunskap-Retrieval-Agenten

| Fält | Innehåll |
|------|----------|
| **Gör** | `knowledgeVaultQuery` / kampspar RAG — returnerar chunks + scores, ingen fri text |
| **Problem** | Retrieval + generation i samma modell ökar hallucination |
| **Får läsa** | `kampspar`, `kb_docs` (Kunskap-silo) |
| **Får inte läsa** | `reality_vault`, `children_logs` |
| **Läge** | **Read-only** · bakom Valv PIN för kb_docs |

---

### N4. Barn-EVIDENCE-Klassificeraren

| Fält | Innehåll |
|------|----------|
| **Gör** | Taggar barnobservation: neutral / EVIDENCE-kandidat — föreslår HITL till Valv |
| **Problem** | Barnlogg vs bevis gräns otydlig i auto-flöden |
| **Får läsa** | Enskild `children_logs` post |
| **Får inte läsa** | Auto-promote till Valv · Kunskap |
| **Läge** | **Read-only klassificering** · **HITL** för eventuell evidence-länk |

---

### N5. Synapse-Dispatchern (deterministisk, ingen LLM)

| Fält | Innehåll |
|------|----------|
| **Gör** | Tar `{trigger, payload}` → rätt handler · idempotency · emit metrics |
| **Problem** | Business logic spridd mellan triggers och callables |
| **Får läsa** | Trigger registry · payload schema |
| **Får inte läsa** | LLM · user content beyond validation |
| **Läge** | **Write-capable** endast via registrerade handlers · **HITL** där manifest säger |

---

## 5 dåliga agentroller / flöden (undvik)

| # | Dålig idé | Varför |
|---|-----------|--------|
| **D1** | **Universal-Kompis** med läs till alla silos | Bryter tre silos · omöjlig audit · cross-RAG |
| **D2** | **LLM-router** som väljer agent fritt | Osäker · icke-deterministisk · DCAP-kanon |
| **D3** | **Auto-terapeut** i MåBra med journal+RAG | Konflikt med Speglar · fel ton · skambeläggning |
| **D4** | **Autonom bevis-agent** som skriver Valv utan HITL | WORM-förorening · juridisk risk |
| **D5** | **Barn-agent** som svarar barn direkt (LLM) | Barnporten kräver HITL · säkerhet · LVU-känsligt |

---

## Målarkitektur — AI-lagret

```
┌─────────────────────────────────────────────────────────────┐
│ L0  Policy (ingen LLM)                                      │
│     DCAP · heuristics · mabraCoachGuard · silo manifest     │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ L1  Klassificering (structured JSON, write → queue)         │
│     Inkorg-Sorteraren · Barn-EVIDENCE-tagger                │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ L2  Retrieval (read-only, per silo)                         │
│     Kunskap-RAG · Valv-RAG · Minne-RAG (kampspar)           │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ L3  Generering (read-only svar)                             │
│     BIFF · Brusfiltret · Speglings-Coachen · MåBra parafras │
│     Sammanfattning · Safety-Review                          │
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ L4  HITL + WORM-writers (synapser)                          │
│     drive_ingest · journal_woven · widget_recording · alerts│
└───────────────────────────┬─────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ L5  Pattern / batch (async)                                 │
│     Mönster-Arkivarien · kasam · transactions analysis      │
└─────────────────────────────────────────────────────────────┘

Horisontell: KompisSupervisor = tunn delegator (L0→L3)
Observability: traceId + agentId + intent på varje hop
Zero Footprint: clear context L3 RAM + adk_traces on exit
```

### Rollmatris (önskat tillstånd)

| Rolltyp | Exempel | LLM? | Write? | HITL? |
|---------|---------|------|--------|-------|
| Klassificering | Inkorg-Sorteraren | Ja (JSON) | Queue only | Ja |
| Retrieval | Kunskap/Valv-RAG | Nej/embedding | Nej | — |
| Summarization | Sammanfattnings-Agenten | Ja | Nej | — |
| Rådgivning | BIFF, Speglings-Coachen | Ja | Nej | Användaren skickar |
| Pattern analysis | Mönster-Arkivarien | Ja/batch | Insights | Ja preview |
| Safety | DCAP, Safety-Review | Delvis | Alerts | Ja ≥70 |
| Synapse writer | drive_ingest, journal_woven | Efter L1 | WORM | Ja |

---

## Prioriterad implementationsvåg

| Våg | Leverans |
|-----|----------|
| **1** | #4 routeFromDcap band · #5 traceId · #8 MåBra bank-only audit · #12 clear context |
| **2** | #1 Inkorg agent card · #6 unified HITL · #2 valvChat split · N5 dispatcher |
| **3** | N1 summarizer · N2 safety-review · #11 batch Mönster · N3 retrieval agent |

---

## Koppling till locked UX & kanon

- **DCAP före LLM** — non-negotiable (U2).
- **Tre silos** — inga nya "super-RAG"-agenter (U1).
- **MåBra** — bank parafras only; ex → Speglar (`innehall-register`).
- **Barnporten** — N4 får aldrig bli autonom barn-chat (HITL).
- **Valv** — Sannings-Analytikern read-only; writes via separata synapser.
