# ChatBox AI — MODEL-PICKER (Livskompassen)

**Plattform:** ChatBox AI · 7-dagars prov · alla modeller tillgängliga · inga hårda kvoter (undvik megatokens per chatt).

## Gemini Custom Gem → verktyg (orkester)

**Huvuddator:** Gemini Gem ([`GEMINI-ORKESTER-MASTER-PROMPT.md`](../gemini/GEMINI-ORKESTER-MASTER-PROMPT.md)) — Pontus godkänner Deep Research, Gemini routar.

| Etikett | Verktyg | När Gem skickar dig hit |
|---------|---------|-------------------------|
| **CHATBOX** | ChatBox AI | SPEC, tung TS, backend-analys, säkerhetsaudit |
| **FLOW** | Google Flow | Multi-step LLM, Brusfilter, Dossier v2 offload |
| **ANDROID** | Android Studio | Native auth, Gradle, cap sync |
| **CURSOR** | Cursor (denna IDE) | Prod-kod, smoke, deploy, LOCK |

**Gate:** Ingen CHATBOX/FLOW/CURSOR-build före godkänd [`MALL-deep-research-modul.md`](../evaluations/MALL-deep-research-modul.md).

| Uppgift | Förstahandsval | Etikett |
|---------|----------------|---------|
| Orkestrering / beslut | Gemini Gem | — |
| Flow pipeline / Brusfilter design | Google Flow | FLOW |
| Callable SPEC efter Flow | GPT-5.5 | CHATBOX |
| Prod implementering | Cursor HEAVY/FAST | CURSOR |
| Android APK | Android Studio | ANDROID |

## Snabbval

| Uppgift | Förstahandsval | Alternativ |
|---------|----------------|------------|
| Säkerhetsaudit / WORM | Claude Opus 4.8 | Gemini 3.1 Pro |
| Tung backend TS | GPT-5.5 | Gemini 3.1 Pro, Copilot |
| Synapse / DCAP resonemang | Grok 4.20 Reasoning | Opus 4.8 |
| React / Superhub UI | Claude Sonnet 4.6 | Gemini 3 Flash |
| PDF/bild/multimodal ingest | Gemini 3.1 Pro | GPT-5.5 |
| GCP/Firebase research | Sonar 2 | — |
| Enfil-debug | Copilot | GPT-5.4 |
| Repo-hygien / design-städ | GPT-5.4 Mini | Opus 4.8 (stor audit) |
| Valv UI SPEC + vision | Opus 4.8 + Sonnet 4.6 | [`PHASE-08-valv-ui.md`](./phases/PHASE-08-valv-ui.md) |
| Hjärtat/Familjen/Vardagen UI | Sonnet 4.6 | [`UI-WAVE-ROADMAP.md`](../design/UI-WAVE-ROADMAP.md) |
| Life OS vision gap (PHASE-09) | Opus 4.8 | `exports/chatbot-handoff/prompts/PHASE-09-life-os-vision.md` |
| Nav Våg 3 PMIR (PHASE-10) | Opus 4.8 | `PHASE-10-nav-wave3-pmir.md` |
| Design tokens (PHASE-11) | Sonnet 4.6 | `PHASE-11-design-tokens.md` |
| Hygiene audit (PHASE-08) | GPT-5.4 Mini | `PHASE-08-hygiene-audit.md` |
| AI Studio design-remix | Gemini 3.1 Pro | [`docs/ai-studio/DESIGN-REMIX-PROMPT.md`](../ai-studio/DESIGN-REMIX-PROMPT.md) |
| Checkpoint-sammanfattning | GPT-5.4 Mini | Sonnet 4.6 |

## Full matris

| Modell | Styrka | Använd till | Använd INTE till |
|--------|--------|-------------|------------------|
| **Claude Opus 4.8** | Djup arkitektur, säkerhet | WORM-audit, UPLOAD-UNIFIED-SPEC, KEEP/MERGE/DELETE | Snabb iteration |
| **GPT-5.5** | Flagship allround | Functions, synapser, Storage triggers | Final firestore.rules utan Cursor |
| **Gemini 3.1 Pro** | Multimodal kod | Upload/PDF/bild-analys | Ersätta Opus på säkerhet |
| **Grok 4.20 Reasoning** | Resonemang | DCAP, classifyInboxDocument, synapse-flöden | React UI |
| **Grok 4.3** | xAI flagship | Backup till 4.20 | Parallell kod på samma fil |
| **Copilot** | Kod/debug | Ett fel, en fil | Arkitektur, silo-routing |
| **Sonnet 4.6** | UI-kod | CapturePanel, Superhub | Backend WORM |
| **Gemini 3 Flash** | Snabb UI | Copy, mindre komponenter | Säkerhetskritisk logik |
| **DeepSeek V4 Pro** | Balans | inboxClassifier heuristik, MIME | Locked UX |
| **Sonar 2** | Sök+fakta | App Check docs, GCP — citera källa | Prod-kod |
| **GPT-5.4 / Mini** | Admin | Checklistor, hygien, handoff | Ny kärnarkitektur |
| **Llama 4** | — | **Hoppa över** för prod | — |

## Parallell regel

- **Max 2 chattar** samtidigt
- **Säkert:** audit + research, SPEC + diagram
- **Aldrig:** backend ∥ frontend upload, två modeller på samma fil

## Fas → modell

| Fas | Modell |
|-----|--------|
| PHASE-01 Security | Opus 4.8 |
| PHASE-02 Upload SPEC | Opus 4.8 |
| PHASE-03 Backend upload | GPT-5.5 eller Gemini 3.1 Pro |
| PHASE-04 Frontend upload | Sonnet 4.6 |
| PHASE-05 Synapse | Grok 4.20 → GPT-5.5 |
| PHASE-06 App Check | Sonar 2 → GPT-5.4 |
| PHASE-07 Final lock | GPT-5.4 Mini |
| PHASE-08 Hygiene audit | GPT-5.4 Mini |
| PHASE-09 Life OS vision | Opus 4.8 |
| PHASE-10 Nav Våg 3 PMIR | Opus 4.8 |
| PHASE-11 Design tokens | Sonnet 4.6 |
| PHASE-12 Supermodule polish | Sonnet 4.6 |
| PHASE-08 Valv UI (B1) | Opus 4.8 → Sonnet 4.6 → Cursor |
| UI-våg B2–B4 | Sonnet 4.6 → Cursor |
