# ChatBox AI — MODEL-PICKER (Livskompassen)

**Plattform:** ChatBox AI · 7-dagars prov · alla modeller tillgängliga · inga hårda kvoter (undvik megatokens per chatt).

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
