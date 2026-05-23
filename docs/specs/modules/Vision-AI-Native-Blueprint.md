# Vision — AI Native Blueprint + MIND-SAFE (skärmdumpar)

**Datum:** 2026-05-21  
**Status:** Vision-ingest (text från skärmdumpar; **inte** prod-migrering till Genkit)  
**PDF (ej textextrakt):** `~/Desktop/MIND-SAFE_AI_Architecture.pdf`, `~/Desktop/AI_Native_Blueprint.pdf`  
**Jämförelse:** [`MIND-SAFE-vs-Livskompassen-DIFF.md`](./MIND-SAFE-vs-Livskompassen-DIFF.md)  
**Utvärdering:** [`Vision-UTVARDERING-UNDERAGENTER.md`](./Vision-UTVARDERING-UNDERAGENTER.md)  
**Bilder:** [`vision-slides/README.md`](./vision-slides/README.md)

---

## Kanonbeslut (låst för implementation)

| Vision (PDF) | Livskompassen-kanon | Beslut |
|--------------|---------------------|--------|
| Genkit Flow + Dotprompt (`.prompt`) | `functions/src/sharedRules.ts` + callables | **Behåll sharedRules** — Genkit = målbild, inte migrering nu |
| `kbt-coach.prompt` + `bevis-arkiv.prompt` | AgentCards + Sannings-/BIFF-agenter | Mappa till befintliga roller, inte nya prompt-filer |
| En gemensam RAG | Tre silor | **Avvisa** — `arkiv-minne.md` |
| LLM inbyggt minne | WORM + citations | **Avvisa** — `Kunskap-SPEC.md` §5 |

---

## Röda tråden (max 10 punkter)

1. **Absolut isolering** — Bevis (fakta förflutet) ≠ KBT/läkande (trygg framtid) ≠ livsminne/strategi (`kampspar`).
2. **Proaktiv riskdetektering** innan LLM — DCAP + deterministisk routing (`routeFromDcap`), inte LLM som äger åtkomst.
3. **Händelsestyrd autonomi** — uppladdning triggar pipeline utan extra klick (delvis: Drive, valv-upload).
4. **Strukturerad utdata** — JSON-schema (svar med `citations[]`), inte fri prosa som sanning.
5. **RBAC / ägarskap** — `ownerId`, AuthGate, Firestore rules (append-only på WORM).
6. **Kognitiv avlastning** — systemet arbetar i bakgrunden; användaren matar in, systemet sorterar.
7. **Fakta = dokumenterat arkiv** — inte internet, inte modellens träningsminne.
8. **Permanent minne (WORM)** — valv, journal, barn, dossier glöms inte av design.
9. **Zero Footprint** — session/RAM renas; Speglar utan persistent RAG.
10. **Orkestrering deterministisk** — Supervisor + ADK synapser; expandera executors utan att blanda silor.

---

## Orkester idag vs vision

| Aspekt | Vision (PDF / Genkit) | Livskompassen idag (repo) |
|--------|----------------------|---------------------------|
| Orkestrator | Genkit **Flow** | `AdkOrchestrator` + modul-**callables** |
| Prompts | **Dotprompt** `.prompt` (YAML + Handlebars) | **`sharedRules.ts`** (AGENTS.md hard rule) |
| Agenter | Isolerade underagenter per Flow | **10 AgentCards**, **2 executors** (`livs_arkivarien`, `grans_arkitekten`) |
| Tool-loop | Modell pausar → tool → Genkit backend → injicera → JSON | RAG i `kampsparQueryRag.ts`; `analyzeMessage`; ingest callables |
| Routing | Flows + output `action` i schema | `routeFromDcap`, `resolveExecutorId` |
| Synapser | (implicit i flows) | `synapseBus.ts`: all four triggers live (`drive_file_ingested` G10, `journal_woven` G7, `dcap_alert`, `user_overwhelm`) |
| Batch/natt | Cloud Scheduler + långa jobb | `weaveJournalEntry`, `scheduledRetentionJob`; Cloud Run Jobs = vision |
| Dev-test | Genkit Developer UI | `npm run smoke:*`, `functions` build |

**Kod:** `functions/src/adk/orchestrator.ts`, `functions/src/agents/kompis-supervisor.ts`, `functions/src/agents/cards/index.ts`

---

## Slides — per slide (MIND-SAFE + AI Native)

### S01 — Sammanblandning av kontext skapar kognitiv kollaps (MIND-SAFE)

**Text (slide):** Att blanda personlig utveckling (KBT) och bevisinsamling i samma AI ger självmotsägelser. Risk 1: Regeldrift. Risk 2: Kontextuell nedsmutsning. Lösning: absolut modulär isolering.

**Komponenter:** DCAP, Silo, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | Tre silor; Hamn/BIFF ≠ Valv-Chat ≠ Kunskap |
| **Saknas** | Explicit "input layer" UI-copy; Familjen-RAG (G8) |
| **Strider** | En chat över allt; `knowledgeVaultQuery` på `reality_vault` |

**Mappning:** Bevisarkiv → `reality_vault` + `valvChatQuery`. KBT-Coach → Måbra, Speglar, Kompasser (ej Dossier-bevis i terapi-ton).

---

### S02 — Principen om absolut isolering: MIND-SAFE

**Text:** Varje agent i hermetiskt tillsluten miljö. Proaktiv riskdetektering filtrerar före LLM. Isolerade arbetsböcker. Flöde: Indata → riskdetektering → Bevisarkiv | KBT-Coach.

**Komponenter:** DCAP, Orkester, WORM

| | Livskompassen |
|---|---------------|
| **Stämmer** | DCAP; separata callables; ADK inte delad PII-state (`hashPayload`) |
| **Saknas** | Extern HITL-notifiering; Gatekeeper-UI överallt |
| **Strider** | Firestore `/synapses` blueprint ≠ ADK synaps (G9) |

---

### S03 — Den övergripande systemarkitekturen (3 lager)

**Text:** Kräver Firebase Blaze. Lager 1: Firebase (Storage, Firestore) — minne. Lager 2: Genkit (Flows, Vector Search) — orkestrering. Lager 3: Gemini Pro & Flash — isolerade personligheter.

**Komponenter:** Firebase, Genkit, RAG, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | Firestore + Functions + Hosting; Vertex Gemini; Vector index i GCP |
| **Saknas** | Genkit som motor; Dotprompt; Blaze dokumenterat i FIREBASE_SYNC |
| **Strider** | Endast Genkit (ingen Functions-väg i vision) |

---

### S04 — Det händelsestyrda ekosystemet

**Text:** Upload ljud/skrmdump → Firebase Storage → Cloud Function → Genkit Flow → rätt underagent → The Vault. Utan extra klick.

**Komponenter:** Firebase, Genkit, Orkester, WORM

| | Livskompassen |
|---|---------------|
| **Stämmer** | `notifyNewFile` → `driveIngestSynapse`; valv `uploadVaultEvidence`; `analyzeDriveFile` |
| **Saknas** | Storage `onFinalize` för alla media; auto "bevis-agent" per fil |
| **Strider** | Allt till en Vault — Drive går till `kb_docs` (korrekt silo) |

---

### S05 — Genkit-Flödet: Logikloopen

**Text:** 1 Indata → 2 RBAC → 3 Vector Search (RAG) → 4 Gemini → 5 JSON Schema → 6 Säker utdata. Dotprompt-regler på Gemini.

**Komponenter:** Genkit, RAG, Firebase, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | Auth på callables; `kampsparQueryRag`; Gemini; JSON-svar (Kunskap, Valv, Dossier) |
| **Saknas** | Genkit Flow; Dotprompt; enhetlig JSON-validator över alla callables |
| **Strider** | Prompts i `sharedRules.ts` inte `.prompt` |

---

### S06 — Varför isolerade Genkit-agenter är nödvändiga

**Text:** Jämförelse Monolitisk ChatGPT vs Genkit Multi-Agent: regelföljsamhet (Dotprompt), RBAC per agent, JSON minimerar hallucination, Flows minskar manuell styrning.

**Komponenter:** Genkit, Orkester, DCAP

| | Livskompassen |
|---|---------------|
| **Stämmer** | AgentCards; RBAC via rules; strikt JSON agenter |
| **Saknas** | Genkit Flows; per-agent Dotprompt-filer |
| **Strider** | — |

---

### S07 — En arkitektur för säkerhet och läkande

**Text:** Kassaskåpet (fakta, förflutet) ↔ Trygga rummet (framtid, människa/pappa). Röda tråden: lyft kognitiv börda, bygg självkänsla, skilj dåtid/framtid.

**Komponenter:** WORM, Silo, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | Valv+Dossier vs Måbra+Speglar+Kompasser; "Den trygga hamnen" i seed |
| **Saknas** | Explicit UX-copy "Kassaskåp" / "Trygga rummet" |
| **Strider** | Ett "smart" minne utan silo |

---

### S08 — Implementering steg 1: Infrastruktur & sekretess

**Text:** 1 Blaze (inga känsliga data till Google AI-träning). 2 IAM minsta privilegium. 3 Separata Storage buckets — juridik/ljud vs KBT-journal.

**Komponenter:** Firebase, WORM

| | Livskompassen |
|---|---------------|
| **Stämmer** | GCP billing; secrets; flera buckets (WORM, embeddings) |
| **Saknas** | Dokumenterad bucket-per-silo policy; App Check |
| **Strider** | — |

---

### S09 — Implementering steg 2: Konstruktion av agenter

**Text:** TypeScript-scheman; `kbt-coach.prompt` + `bevis-arkiv.prompt` (Genkit Dotprompt); test i Genkit Developer UI.

**Komponenter:** Genkit, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | TypeScript; JSON output; lokalt `functions` build + smoke |
| **Saknas** | Dotprompt-filer; Genkit Dev UI |
| **Strider** | Prompts **måste** vara `sharedRules.ts` (kanon) |

---

### S10 — Implementering steg 3: Event-automation & tidlås

**Text:** CF på filuppladdning → bevis-agent; Firestore Append-Only rules; Vector embeddings av KBT-framgångar för RAG vid stress.

**Komponenter:** Firebase, RAG, WORM, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | WORM rules; `ingestKampsparEntry`; retention allowlist (G5) |
| **Saknas** | Universal upload trigger; ANN prod (G2–G3) |
| **Strider** | Auto all journal → kampspar utan opt-in |

---

### S11 — Från datadriven till AI-nativ

**Text:** Inte bara CRUD — strukturera ostrukturerad data, agentiska workflows, hybrid (moln + edge). Agent/LLM i centrum: `process_request` → `fetch_data` → `return_results` → `send_response`; `hybrid_exec`.

**Komponenter:** Orkester, Firebase

| | Livskompassen |
|---|---------------|
| **Stämmer** | Callable-baserad app; RAG; telefon-MVP `--host` |
| **Saknas** | Genkit tool-loop; edge AI på klient |
| **Strider** | Ren 3-tier CRUD-app |

---

### S12 — Den moderna AI-stacken (4 hörn)

**Text:** Edge (Hosting, client AI, Remote Config) ↔ DevEx (CLI, MCP) ↔ Kognition (Genkit: flows, modeller, verktyg) ↔ Minne (Firestore, SQL Connect, Auth, Rules). Alla hörn interconnected.

**Komponenter:** Firebase, Genkit, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | Hosting, Firestore, Auth, rules; Firebase MCP i Cursor |
| **Saknas** | Genkit; MCP i prod-app; Data Connect i bruk |
| **Strider** | — |

---

### S13 — Verktyg & strukturerad output

**Text:** LLM anropar verktyg (t.ex. HämtaKunddata); Genkit kör backend; resultat injiceras; slut-JSON (Zod/schema).

**Komponenter:** Genkit, Orkester, RAG

| | Livskompassen |
|---|---------------|
| **Stämmer** | RAG som "verktyg"; strukturerad JSON från agenter |
| **Saknas** | Explicit Genkit tool definitions; Zod överallt |
| **Strider** | — |

---

### S14 — Dotprompt (.prompt) — separera logik från kod

**Text:** `.prompt` = YAML (model, input/output schema) + Handlebars-mall. Versionshanterad promptfil.

**Komponenter:** Genkit

| | Livskompassen |
|---|---------------|
| **Stämmer** | Separera prompt från UI-kod (idé) |
| **Saknas** | `.prompt`-filer |
| **Strider** | **Kanon:** prompts endast `sharedRules.ts` |

---

### S15 — MCP + IDE-agent (Cursor ↔ MCP ↔ Firebase CLI)

**Text:** Modern AI-stack: DevEx-hörnet kopplar IDE-agent (Cursor) till Firebase via MCP — CLI, schema, deploy och felsökning utan manuell kontextväxling.

**Komponenter:** MCP, Firebase, Orkester (dev)

| | Livskompassen |
|---|---------------|
| **Stämmer** | Firebase-plugin i `.cursor/settings.json`; Firebase MCP tillgänglig i Cursor; `firebase functions:list` / deploy-docs i repo |
| **Saknas** | MCP i prod-appen; enhetlig `mcp.json` dokumenterad för hela teamet |
| **Strider** | Vision antar Genkit Dev UI parallellt — vi använder Cursor Agent + smoke scripts |

**Kod:** `.cursor/settings.json`, `docs/DEPLOY.md`, `AGENTS.md` § Cursor Subagents

---

### S16 — Autonoma agent-skills (npx firebase-tools, mcp.json)

**Text:** Agenten initierar Firebase (`npx firebase-tools`), läser schema/rules, konfigurerar MCP — autonom utvecklingsloop utan att användaren kopierar CLI-kommandon.

**Komponenter:** MCP, Firebase, Orkester (dev)

| | Livskompassen |
|---|---------------|
| **Stämmer** | `.cursor/skills/livskompassen-*`; `firebase-basics` plugin-skill; `npm run smoke:*`; AGENTS.md subagent-typer |
| **Saknas** | Standardiserad `mcp.json` i repo-root; auto `firebase init` i CI |
| **Strider** | Skills gäller **Cursor/dev** — inte slutanvändar-runtime (korrekt enligt kanon) |

**Kod:** `.cursor/skills/`, `.cursor/rules/firebase-workflow.mdc`

---

### S17 — Syntes: den kompletta ritningen

**Text:** Klient (React/Vite) → Auth → Hosting → Genkit/RAG-backend → Security Rules → Firestore → feedback-loop. Alla lager interconnected; auth och rules före minne.

**Komponenter:** Firebase, Genkit, RAG, WORM, Orkester, DCAP

| | Livskompassen |
|---|---------------|
| **Stämmer** | React + Vite + AuthGate; Firebase Hosting; callables `europe-west1`; `firestore.rules`; tre silo-callables; DCAP före LLM |
| **Saknas** | Genkit som central motor; Data Connect i bruk |
| **Strider** | Vision = en Genkit-pipeline; repo = ADK + modul-callables (medvetet) |

**Kod:** `src/App.tsx`, `functions/src/index.ts`, `firestore.rules`, `functions/src/adk/orchestrator.ts`

---

### S18 — Kryptografisk låsningskedja

**Text:** SHA-256 hash-kedja, Firestore rules (`auth.uid`), immutable snapshots. Jämför Apps Script Protection vs Firebase WORM.

**Komponenter:** WORM, Firebase, DCAP

| | Livskompassen |
|---|---------------|
| **Stämmer** | `dossierCanonicalHash.ts` (SHA-256); `stateStore.hashPayload` (synaps, ingen rå PII); `firestore.rules` append-only på WORM; `serverTimestamp()` på bevis |
| **Saknas** | Hash-kedja på **varje** `reality_vault`-post (Dossier har kanonisk hash; inte alla valv-poster) |
| **Strider** | Vision Apps Script Protection = **legacy** för Drive-sortering (`sorter.gs` → webhook); **kanon** = Firestore WORM, inte kalkylark |

**Kod:** `functions/src/lib/dossierCanonicalHash.ts`, `functions/src/adk/stateStore.ts`, `firestore.rules` L24–72, `docs/DRIVE_AUTOMATION.md`

---

### S19 — Bevisvärdet (server timestamp → Valv WORM)

**Text:** Klient skickar in → backend sätter Firebase server timestamp → Valv WORM. Export till PDF tillåten; **aldrig** redigera/radera källpost.

**Komponenter:** WORM, Firebase, Orkester

| | Livskompassen |
|---|---------------|
| **Stämmer** | `reality_vault` create-only + rules `update/delete: false`; `uploadVaultEvidence`; `generateDossier` → `dossier_snapshots` WORM; PDF med hash-rad |
| **Saknas** | Klient-side bevis att server timestamp alltid används (vissa paths använder `FieldValue.serverTimestamp()` i CF) |
| **Strider** | Sannings-Analytikern/valv-RAG på valv — **inte** Livs-Arkivarien (korrekt silo) |

**Kod:** `functions/src/index.ts` (upload, dossier), `functions/src/agents/valvChatAgent.ts`, `firestore.rules`

---

### S20 — Livs-Arkivarien (objektivt systemminne)

**Text:** Objektivt systemminne: historik, triggers, mönster. Barn/BIFF-kontext via **Kunskap-RAG** — aldrig blanda med valv-bevis eller terapi-ton.

**Komponenter:** RAG, Orkester, Silo, WORM

| | Livskompassen |
|---|---------------|
| **Stämmer** | `agent_livs_arkivarien` executor; `knowledgeVaultQuery` → `kampspar` + `kb_docs`; `LivsArkivarienCard` + `MonsterArkivarienCard`; Drive → `kb_docs` |
| **Saknas** | Dedikerad barn-RAG (G8); auto journal→kampspar (G7, nej utan opt-in) |
| **Strider** | Vision kan antyda "allt minne" i en agent — **MUST NOT** läsa `reality_vault` i Kunskap-RAG |

**Kod:** `functions/src/agents/cards/index.ts`, `functions/src/lib/kampsparQueryRag.ts`, `functions/src/agents/knowledgeVaultAgent.ts`

---

### S21 — AI-orkestrering: rådata → beslutsunderlag

**Text:** Råbevis → sandboxade agenter → strikt JSON → Dossier/PDF med taggar (#gaslighting, tidslinje) → soc/domstol. Ingen generisk "analytiker utan filter" över all data.

**Komponenter:** Orkester, WORM, RAG, DCAP, Genkit

| | Livskompassen |
|---|---------------|
| **Stämmer** | `generateDossier` + kanonisk hash; Sannings-Analytikern card; `reality_vault` + citations; `weaverAgent` taggar (`weaverTags`); strikt JSON i valv/kunskap-agenter |
| **Saknas** | Färdiga domstol/soc-exportmallar; automatisk tagg-taxonomi (#gaslighting) i prod |
| **Strider** | Vision Genkit sandbox-flow — repo använder callables + `sharedRules.ts` |

**Kod:** `functions/src/lib/generateDossierInternal.ts`, `functions/src/agents/weaverAgent.ts`, `functions/src/agents/cards/index.ts`

---

### S22 — Kontext-motorn / personregister

**Text:** `$context.variables` — fördefinierade roller (barn, ex, tredjepart) injiceras före LLM → noll hallucination på identitet.

**Komponenter:** RAG, Orkester, DCAP

| | Livskompassen |
|---|---------------|
| **Stämmer** | `NetworkMember` i Firestore + rules; aktörskarta i `Kampspar-PROFIL-SEED.json`; Sannings-Analytikern card refererar EntityProfile |
| **Saknas** | **`EntityProfile` runtime-modell (G9)**; formell `$context.variables`-motor; SystemSynapse Firestore ≠ ADK synaps |
| **Strider** | Repomix/blueprint EntityProfile — **planerat**, ej prod |

**Kod:** `firebase-blueprint.json`, `firestore.rules`, `docs/specs/modules/Arkiv-GAP-REGISTER.md` G9

---

### S23 — Agent-struktur A–D

**Text:** **A** Livs-Arkivarien (runtime minne) · **B** Analys/säkerhet · **C** Design/UI · **D** Kod/deterministisk — dev-agenter (Cursor) vs runtime (Cloud Functions).

**Komponenter:** Orkester, MCP, RAG, DCAP

| | Livskompassen |
|---|---------------|
| **Stämmer** | A = `agent_livs_arkivarien`; B = `agent_grans_arkitekten` + Sannings/BIFF/Brus cards; C/D = Cursor rules/skills (ej CF) |
| **Saknas** | Varje produktroll = egen Cloud Function (vision); full A2A streaming |
| **Strider** | Vision kan blanda B/C/D i samma "agent"-lista — repo skiljer **dev** (Cursor) från **runtime** (2 executors) |

**Kod:** `functions/src/agents/cards/index.ts`, `AGENTS.md`, `.cursor/rules/`, `.cursor/skills/`

---

## Vision-agent vs prod-agent (S23 + övriga)

| Vision-roll / slide | Vision-beteende | Prod-agent / runtime | Callable / kod | Silo | Status |
|---------------------|-----------------|----------------------|----------------|------|--------|
| **A — Livs-Arkivarien** (S20, S23) | Objektivt livsminne, mönster | `agent_livs_arkivarien` | `knowledgeVaultQuery`, `ingestKampsparEntry` | Kunskap (`kampspar`, `kb_docs`) | **Stämmer** |
| **Mönster-Arkivarien** (S20) | Forensisk makroanalys | `agent_monster_arkivarien` (card) → livs executor | Drive synaps → `kb_docs` | Kunskap | **Stämmer** |
| **B — Analys/säkerhet** (S23) | Bevis, BIFF, brus | `agent_grans_arkitekten` | `analyzeMessage`, DCAP routing | Hamn / DCAP (ej RAG) | **Stämmer** |
| **Sannings-Analytikern** (S19, S21) | Klinisk bevis-JSON | Card → grans executor | `valvChatQuery`, `generateDossier` | Valv (`reality_vault`) | **Stämmer** |
| **BIFF-Skölden / Brusfiltret** | Grey Rock, fakta | Cards → grans executor | `analyzeMessage` | Hamn | **Stämmer** |
| **KBT-Coach** (S01, S07) | Trygga rummet, läkande | Speglings/Paralys/RSD/Uppgifts cards → livs executor | `speglingsMirror`, `mabraCoach`, Kompasser | Zero Footprint / ej valv-RAG | **Stämmer** |
| **Bevisarkiv-agent** (S04, S19) | Upload → WORM | Ingen separat CF — valv-modul | `uploadVaultEvidence`, `weaveJournalEntry` | Valv | **Delvis** (ej universal Storage-trigger) |
| **Genkit Flow-orkestrator** (S03–S05) | Central Flow | — | `AdkOrchestrator` + `kompis-supervisor` | — | **Vision** (V1, ej migrerat) |
| **C — Design** (S23) | UI/UX Obsidian Calm | — | Cursor `ui-design.mdc` | — | **Dev only** |
| **D — Kod** (S23) | Deterministisk implementation | — | Cursor Agent + rules/skills | — | **Dev only** |
| **IDE MCP-agent** (S15–S16) | Cursor ↔ Firebase MCP | — | `.cursor/settings.json`, plugin skills | — | **Dev only** |
| **Kontext-motorn** (S22) | `$context.variables` | Planerat EntityProfile (G9) | `NetworkMember`, seed | Alla (metadata) | **Saknas** G9 |

**Registrerade cards:** 10 st i `AvailableAgents` — se [`AGENTS.md`](../../../AGENTS.md) produktroller + [`functions/src/agents/cards/index.ts`](../../../functions/src/agents/cards/index.ts).

---

## Komponentmatris (sammanfattning)

| Komponent | Vision | Repo idag | Gap-ID |
|-----------|--------|-----------|--------|
| **RAG / Vector** | Genkit + Vector Search | `kampsparQueryRag.ts`, token-match | G2, G3 |
| **Genkit Flow** | Central orkestrator | ADK + callables | — (medvetet ej migrerat) |
| **Dotprompt** | `.prompt` per agent | `sharedRules.ts` | Policy, inte GAP-kod |
| **Firebase WORM** | Append-Only tidlås | Firestore rules | G5 verifiera prod |
| **Storage-trigger** | All upload → CF | Drive + valv delvis | G6, ny spec |
| **DCAP / risk** | Före LLM | `DCAP.ts`, `routeFromDcap` | `dcap_alert` → WORM `dcap_alerts` (live) |
| **Silo 3** | 2 lådor i bild, 3 i kanon | `arkiv-minne.md` | G8 |
| **MCP** | DevEx-hörn | Cursor Firebase MCP | Dev only |
| **SHA-256 kedja** (S18) | Alla bevis hash-länkade | Dossier + synaps hash | Delvis på valv-poster |
| **EntityProfile** (S22) | `$context.variables` | NetworkMember + seed | G9 |
| **Livs-Arkivarien** (S20) | Kunskap-RAG only | `knowledgeVaultQuery` | **Stämmer** |

---

## Livskompassen-modul ↔ vision

| Vision | Modul / route | Collection |
|--------|---------------|------------|
| Bevisarkiv / Kassaskåp | Verklighetsvalvet, Valv-Chat, Dossier | `reality_vault`, `dossier_snapshots` |
| KBT-Coach / Trygga rummet | Måbra, Speglar, Kompasser | `mabra_sessions`, (Speglar ZF), `checkins` |
| Livsminne / strategi | Kunskapsvalvet | `kampspar`, `kb_docs` |
| Ex-kommunikation | Hamn | `analyzeMessage` (ej RAG) |
| Barn | Barnen | `children_logs` |

---

## Nästa steg (dokumentation, inte kod)

1. Resultat: [`Vision-UTVARDERING-RESULTAT.md`](./Vision-UTVARDERING-RESULTAT.md) (A–D + slutrapport).
2. Molnsanning: [`docs/GCP-INVENTORY-LATEST.md`](../../GCP-INVENTORY-LATEST.md).
3. Cursor-regler: `.cursor/rules/synapser-adk.mdc` + `memory-silo.mdc`.

**Implementation:** `kör [GAP]` — inte Genkit-migrering utan explicit beslut.
