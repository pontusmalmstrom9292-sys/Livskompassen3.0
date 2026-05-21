# MIND-SAFE AI Architecture — jämförelse mot Livskompassen v2

**Datum:** 2026-05-21 (uppdaterad efter vision-ingest)  
**Källor:** `~/Desktop/MIND-SAFE_AI_Architecture.pdf`, `~/Desktop/AI_Native_Blueprint.pdf` (bild-PDF, ej textextrakt)  
**Verifierad text:** [`Vision-AI-Native-Blueprint.md`](./Vision-AI-Native-Blueprint.md) (S01–S23, skärmdumpar 2026-05-21)  
**Utvärdering:** [`Vision-UTVARDERING-UNDERAGENTER.md`](./Vision-UTVARDERING-UNDERAGENTER.md) · **Resultat:** [`Vision-UTVARDERING-RESULTAT.md`](./Vision-UTVARDERING-RESULTAT.md)  
**Molnsanning:** [`docs/GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md)  
**Jämfört mot:** [`.context/system-plan.md`](../../../.context/system-plan.md), [`.context/arkiv-minne.md`](../../../.context/arkiv-minne.md), [`docs/specs/incoming/*`](./)

---

## Extraktionsstatus (PDF)

| | |
|---|---|
| **Textlager i PDF** | **Saknas** — bild-slides (~19–21 sidor) |
| **Verifierad källa** | Skärmdumpar → [`Vision-AI-Native-Blueprint.md`](./Vision-AI-Native-Blueprint.md) **S01–S23** |
| **Valfritt** | `MIND-SAFE_AI_Architecture.txt` om OCR/kopiera text |

---

## Snabbmatris

| Kategori | Bedömning |
|----------|-----------|
| **Stämmer brett** | Absolut isolering (S01–S02), tre silor, WORM, DCAP, JSON-svar, Firebase+Functions, AgentCards, kognitiv avlastning (S07), händelsestyrt delvis (S04), MCP/skills dev (S15–S16), komplett ritning grovt (S17), Livs-Arkivarien silo (S20), agent A–D (S23) |
| **Saknas / delvis** | **Genkit Flow**, **Dotprompt**, universal Storage→CF, Genkit Dev UI, MCP i prod, EntityProfile (S22/G9), hash på alla valv-poster (S18), ANN wire prod (G2–G3), G7–G10, full Gatekeeper |
| **Medvetet annorlunda** | Prompts i **`sharedRules.ts`** — inte `.prompt` (S09, S14) — kanon |
| **Strider om vision kräver** | En RAG; LLM-minne; auto trauma→`kampspar`; bevis→`kb_docs`; hårdkodad PIN; LLM äger auth |

---

## Status utvärdering (2026-05-21)

Read-only audit A–D: [`Vision-UTVARDERING-RESULTAT.md`](./Vision-UTVARDERING-RESULTAT.md)

| Underagent | Resultat | Notis |
|------------|----------|-------|
| **A** Silo & WORM | **PASS** (5/5) | Retention WORM via exklusion, ej explicit kommentar |
| **B** Orkester | **PASS** (5/5) | 10 cards, 2 executors, inga `.prompt` |
| **C** Infrastruktur | **PASS** (4/4) | Synkad 2026-05-22 — se [`Vision-UTVARDERING-RESULTAT.md`](./Vision-UTVARDERING-RESULTAT.md) § C |
| **D** Cursor rules | **4/5 PASS** | D4: AGENTS.md saknar skill-tabell |

**Live delta:** `valvChatQuery` deployad; 1 Vector endpoint west1 (se [`GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md)).

---

## S01 bekräftad — Bevisarkiv / KBT-Coach (citat)

Från vision-doc (skärmdump MIND-SAFE):

> *"Sammanblandning av kontext skapar kognitiv kollaps"* — KBT och bevis i samma AI → regeldrift och kontextuell nedsmutsning. *"Lösningen: Absolut modulär isolering."* Flöde: Indata → proaktiv riskdetektering → **Bevisarkiv** | **KBT-Coach**.

| Vision | Livskompassen |
|--------|---------------|
| Bevisarkiv | `reality_vault`, `valvChatQuery`, Verklighetsvalvet, Dossier |
| KBT-Coach | Måbra, Speglar, Kompasser (inte valv-RAG) |
| Riskfilter före LLM | `DCAP.ts`, `routeFromDcap` |
| Tredje låda (livsminne) | `kampspar` + `kb_docs` — utöver PDF:s två lådor, **kanon** |

---

## Avsnitt 1 — Vision: Life OS, Kompis, mind-safe

| PDF (bekräfta) | Stämmer i Livskompassen | Saknas i kod/docs | Strider mot silo/WORM |
|----------------|-------------------------|-------------------|------------------------|
| Life OS / helhet över moduler | Ja — `arkiv-minne.md`, `Arkiv-SPEC.md`, `system-plan.md` modultabell | "Hela arkivet" som **en** RAG — kanon säger **nej** | **Strider** om PDF = en sökmotor över allt |
| Kompis som navigator | Ja — UI, `KompisAvatar`, supervisor | Full Vertex **Agent Engine**-orkester per `architecture.md` | — |
| Neuroinklusion / kognitiv avlastning | Ja — Kompasser, Paralys, Måbra, progressive disclosure | Prediktiv 5h-batch (vision) | — |
| Mind-safe = lågaffekt, ingen JADE | Ja — BIFF, Grey Rock, DCAP, `sharedRules.ts` | — | — |

**Kanon:** [`AGENTS.md`](../../../AGENTS.md), [`.context/architecture.md`](../../../.context/architecture.md)

---

## Avsnitt 2 — Säkerhet: Layered Defense, Zero Footprint, WORM

| PDF (bekräfta) | Stämmer | Saknas | Strider |
|----------------|---------|--------|---------|
| WORM / immutable bevis | Ja — `reality_vault`, `journal`, `children_logs`, Firestore rules | CMEK full prod-sign-off | **Strider** om PDF tillåter redigera/radera valv |
| Zero Footprint | Ja — `invalidateSession`, vault lock, Speglar utan persistent RAG | App Check överallt | — |
| Layered Defense | Ja — `.context/security.md` | Komplett Gatekeeper i alla UI-flöden | — |
| Kill Switch / Shake | Ja — `system-plan` WebAuthn + shake | — | — |
| PIN för valv | Delvis — long-press + PIN lokalt | Repomix `6469` — **förbjudet** i kanon | **Strider** om PDF kräver hårdkodad PIN |

**Kanon:** [`.context/security.md`](../../../.context/security.md), [`Verklighetsvalvet-SPEC.md`](./Verklighetsvalvet-SPEC.md)

---

## Avsnitt 3 — Multi-agent / orkester / subagenter

| PDF (bekräfta) | Stämmer | Saknas | Strider |
|----------------|---------|--------|---------|
| Specialiserade agenter (8 produktroller) | Ja — AgentCards, `AGENTS.md` | Varje roll = egen Cloud Function | — |
| A2A / AgentCards / Supervisor | Ja — `functions/src/agents/cards/`, `kompis-supervisor`, `AdkOrchestrator` | Full A2A-streaming (vision) | — |
| Deterministisk routing | Ja — `routeFromDcap`, `resolveExecutorId` | KompisSupervisor i Kunskap-chat (WAVE4) | **Strider** om LLM väljer dataåtkomst |
| Sub-synaptiskt nätverk | Ja — UI + ADK `SynapseBus` | Firestore `/synapses` ≠ ADK (G9) | **Strider** om CSS "synaps" = datalager |
| Nattlig autonom analys | Planerat — Cloud Run Jobs i `architecture.md` | Prod-implementerat | Kostnad utan policy |

**Runtime idag:** 2 executors (`agent_livs_arkivarien`, `agent_grans_arkitekten`) — flera produktroller delar motor.

**Kanon:** [`.context/agents.md`](../../../.context/agents.md), [`docs/WAVE4_DEFERRED.md`](../../WAVE4_DEFERRED.md)

---

## Avsnitt 4 — Minne, RAG, självbyggande arkiv

| PDF (bekräfta) | Stämmer | Saknas | Strider |
|----------------|---------|--------|---------|
| Användardata + dokumenterad fakta | Ja — tre silor, citations JSON | — | **Strider** om "fakta" = internet/LLM-minne |
| Tre kunskapsytor | Ja — `arkiv-minne.md` MUST NOT cross-RAG | `childrenLogsQuery` (G8) | **Strider** om gemensam RAG |
| Vektor / semantisk sök | Delvis — token-match, ingest, seed 47 | ANN prod G2–G3, `journal_woven` G7 | — |
| Drive auto-ingest | Kod — `notifyNewFile` → `kb_docs` | G6 secret + Apps Script | Auto till `reality_vault` (WAVE4 nej) |
| Självlärande utan granskning | Delvis — synapser | G10 inkorg, G7 journal→kampspar | **Strider** om auto trauma-ingest |
| SuperArchive → allt i kunskap | **Avvisat** i kanon | — | **Strider** (repomix-läge) |

**Kanon:** [`Kunskap-SPEC.md`](./Kunskap-SPEC.md) §5 — LLM inbyggt minne **inte** källa; kritisk data = WORM.

| Silo | Data | Callable |
|------|------|----------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| Valv | `reality_vault` | `valvChatQuery` |
| Barnen | `children_logs` | Dossier (RAG plan G8) |

---

## Avsnitt 5 — Moduler (UI ↔ data)

| Modul | Stämmer (`system-plan`) | Saknas / GAP |
|-------|-------------------------|--------------|
| Verklighetsvalvet | Ja — `/valv`, WORM, upload | G1 `valvChatQuery` deploy |
| Kunskapsvalv / Tidshjul | Ja — `/vardagen?tab=kunskap` | G13 Tidshjul live |
| Hamn / BIFF | Ja — `/hamn`, `analyzeMessage` | — |
| Dagbok + Vävaren | Ja — `journal`, `weaveJournalEntry` | Auto → `kampspar` (nej utan opt-in) |
| Barnen | Ja — `/barnen`, `children_logs` | G8 Familjen-RAG |
| Speglar | Ja — `/speglar`, Zero Footprint | Full DCAP-Genkit (WAVE4) |
| Måbra | Ja — fas 2a–2f | — |
| Dossier | Ja — `generateDossier` | — |
| Kompasser (Morgonkompassen) | Ja — Sacred Feature | — |
| Ekonomi | Ja — Firestore | Data Connect avvaktas |

**Specs:** [`docs/specs/incoming/`](./) per modul.

---

## Avsnitt 6 — Infrastruktur (Firebase / GCP)

| PDF (bekräfta) | Stämmer | Saknas | Strider |
|----------------|---------|--------|---------|
| Firebase + Functions `europe-west1` | Ja | Färsk inventering — se plan grund-låsning | — |
| Vertex / Gemini | Ja | En SDK-yta (dubbel genai-paket) | — |
| Vector Search | Delvis — 2 index; endpoint lokalt/GCP varierar | Prod env + ANN wire G2–G3 | north1 vs west1 |
| Legacy Python RAG `us-central1` | Finns i GCP (4 fn) | Avveckling G4 | **Strider** om PDF = endast Python-stack |
| Data Connect | Example deployat | App = Firestore | — |

**Referens:** [`docs/GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md) (live), [`docs/archive/GCP-INVENTORY-2026-05-21.md`](../../archive/GCP-INVENTORY-2026-05-21.md) (tidigare samma dag), [`Arkiv-GAP-REGISTER.md`](./Arkiv-GAP-REGISTER.md)

---

## Avsnitt 7 — Hur PDF:en ska användas i projektet

| PDF-typ | Rätt lager | Fel lager |
|---------|------------|-----------|
| Arkitekturvision (MIND-SAFE) | Denna diff + `.context/` | Räcker inte som `reality_vault`-bevis |
| Referens (metoder, psykologi) | `kampspar` (manuell ingest) eller Drive → `kb_docs` | `reality_vault` |
| Bevis (sms, brev, myndighet) | `reality_vault` + Storage | Kunskap-RAG |

**Profil-seed (redan kuraterat):** [`Kampspar-PROFIL-SEED.json`](./Kampspar-PROFIL-SEED.json) — 47 poster; `node scripts/seed_kampspar_profile.mjs`

---

## GAP-koppling (prioriterat)

| ID | Vision-tema | Livskompassen-status |
|----|-------------|----------------------|
| G1 | Valv-Chat / Bevisarkiv-sök (S19) | **Deployad** 2026-05-21 — smoke kvar |
| G2–G3 | Vector RAG (S05, S10) | Index/endpoint; ANN wire |
| G4 | En backend-stack | Legacy Python parallell |
| G6 | Drive / Storage-trigger (S04) | Secret + Apps Script |
| G7 | Dagbok → minne (synaps) | `journal_woven` stub |
| G8 | Barn-RAG | Planerat |
| G9 | SystemSynapse ≠ ADK synaps | Blueprint only |
| G10 | Självsorterande inkorg | Kunskap-SPEC §12 |
| G11 | Kampspar schema | Mock isolerad |
| G14 | Gräns-Arkitekten | AgentCard finns |
| **V1** | Genkit Flow orkestrator (S03–S05) | ADK + callables — **ej migrera** |
| **V2** | Dotprompt `.prompt` (S09, S14) | `sharedRules.ts` — **kanon** |
| **V3** | All upload → bevis-agent (S04, S10) | Delvis — spec saknas |
| **S15–S16** | MCP + autonoma dev-skills | Cursor/Firebase plugin — dev only |
| **S17** | Kompletta ritningen | ADK + callables — Genkit = vision |
| **S18** | Kryptografisk kedja | Dossier SHA-256; Apps Script = Drive legacy |
| **S19** | Bevisvärdet | WORM + server timestamp — stämmer |
| **S20** | Livs-Arkivarien | Kunskap-RAG only — stämmer |
| **S21** | Orkestrering → Dossier | Delvis — taggar/export |
| **S22** | Kontext-motorn | G9 EntityProfile saknas |
| **S23** | Agent A–D | Runtime A/B + Cursor C/D |

---

## Nästa uppdatering

1. G6: `NOTIFY_WEBHOOK_SECRET` + Apps Script (se [`docs/DRIVE_AUTOMATION.md`](../../DRIVE_AUTOMATION.md)).
2. G4: legacy Python RAG (us-central1) — avveckla eller isolera.

**Vision-kanon:** [`Vision-AI-Native-Blueprint.md`](./Vision-AI-Native-Blueprint.md) · **Relaterad plan:** Grund SDK Synapser.
