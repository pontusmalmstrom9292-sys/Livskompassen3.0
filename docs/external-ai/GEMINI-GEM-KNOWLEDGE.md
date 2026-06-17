# Livskompassen 3.0 — Gemini Gem Knowledge File

Ladda upp detta dokument (och Tier 1-filerna nedan) som **Knowledge Files** i din Custom Gem.

**Alla filer i en mapp:** [`gemini-kunskap/`](./gemini-kunskap/) — kör `npm run gemini:sync:kunskap` före upload.  
**System Instructions:** [`00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt`](./gemini-kunskap/00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt) (samma mapp, men klistras under Instructions — inte Knowledge).

---

## Knowledge Tier 1 — obligatorisk kärna (i `gemini-kunskap/`)

Efter `npm run gemini:sync:kunskap` — markera **01–08** och ladda upp till Gem Knowledge:

| Fil i `gemini-kunskap/` | Roll |
|-------------------------|------|
| `01-LIFE-OS-BUILD-STATE.md` | LOCK / FREEZE / DEFER |
| `02-SECURITY-LOCK-MANIFEST.md` | WORM, vault, guards |
| `03-SYNAPSE-LOCK-SPEC.md` | Synapser, HITL |
| `04-LIFE-OS-CORE-LOCKED.md` | Skyddade moduler |
| `05-locked-ux-features-CURRENT.md` | UX-låsning |
| `06-fas19-masterplan-v2.md` | Fas 19+ körplan |
| `07-DOC-INDEX.md` | Navigering |
| `08-GEMINI-GEM-KNOWLEDGE.md` | Denna fil |

## Knowledge Tier 2 — register och domän (vid behov)

Mapp: `gemini-kunskap/tier-2-valfritt/` (09–13)

| Fil | Roll |
|-----|------|
| `09-security.md` | Sacred, Zero Footprint, CMEK |
| `10-doman-covert-narcissism.md` | ~80% HCF-routing |
| `11-Arkiv-GAP-REGISTER.md` | GAP done/open |
| `12-INNEHALL-REGISTER.md` | U6 content_class |
| `13-GCP-INVENTORY-LATEST.md` | Deploy/secrets |

## Knowledge Tier 3 — repomix per zon (rotera)

Mapp: `gemini-kunskap/tier-3-repomix/` (efter `npm run gemini:pack`)

| Pack | Fil |
|------|-----|
| Inkast | `gemini-pack-inkast.md` |
| Valv | `gemini-pack-valv.md` |
| Familjen | `gemini-pack-familjehubb.md` |
| MåBra | `gemini-pack-mabra.md` |

---

## 1. Vision & syfte

**Livskompassen 3.0 (Den Trygga Hamnen)** är ett privat Life OS och kognitiv protes. Målet är minimal ovidkommande kognitiv belastning och maximal sannolikhet för ett mikrosteg i taget (Single Next Best Action).

Användarprofil: ADHD, GAD, hypervigilans, kognitiv trötthet. Kommunikation: lågaffektiv, klinisk, inget JADE.

## 2. Zoner och supermoduler

| Zon | Route | Innehåll |
|-----|-------|----------|
| Hjärtat | `/hjartat` | Dagbok, Speglar, Smart Inkast |
| Vardagen | `/vardagen` | Kompasser, MåBra, Planering, Arbetsliv, Ekonomi, Drogfrihet |
| Familjen | `/familjen` | Barnfokus, Livslogg, Tillsammans, Barnporten, Trygg Hamn |
| Valv | `/valvet` | PIN/WebAuthn — bevis, Mönster, Orkester, Kunskapsbank, Aktörskarta |

**Fyren:** Ambient OS i sidhuvud — kapacitetsstyrd känslighet (låg/medel/hög).

Valv-länkar exponeras endast när `vaultSessionOpen` (plausible deniability).

## 3. Data & säkerhetslagar

### Tre silos (U1 — aldrig cross-RAG)

| Silo | Collections | Callable |
|------|-------------|----------|
| Kunskap | kampspar, kb_docs | knowledgeVaultQuery |
| Valv | reality_vault | valvChatQuery, analyzeMessage |
| Barnen | children_logs | childrenLogsQuery |

### WORM (append-only)

`reality_vault`, `children_logs`, `journal`, `dcap_alerts`, `dossier_snapshots`, `evolution_ledger`

Aldrig update/delete från klient. Evidence till Valv: alltid manuellt val (`SaveAsEvidencePrompt`), aldrig auto-promote.

### Backend FREEZE (2026-06-16)

Kärnan i `functions/` är låst. Endast bugfix + content ingest efter KEEP. Nya AI-tunga verktyg → **Google Flow / Vertex AI**, inte nya monolitiska Cloud Functions.

## 4. Google Flow — strategi

**Använd Flow för:** Dossier-Generator, Brusfiltret, tunga flerstegs-RAG, framtida agent-pipelines.

**Leverans per verktyg:**

1. Syfte + exakt silo
2. Nodgraf: `trigger → DCAP → silo-callable → svar`
3. System/user prompt per nod
4. JSON input/output-schema
5. Kostnadsnotering
6. Tunn Firebase callable som brygga till React-frontend

**MUST NOT:** WORM-skrivning utan DCAP + auth + HITL; cross-RAG mellan silos.

### Exempel: Dossier-Generator (utkast)

```
[Callable: dossierRequest]
    → [DCAP: riskklassning]
    → [Flow: samla reality_vault snippets — Valv-silo only]
    → [LLM: strukturera tidslinje — sharedRules-ton]
    → [WORM: dossier_snapshots append]
    → [Return: snapshotId till frontend]
```

Kostnad: batcha Vertex-anrop; cache embeddings; kör on-demand, inte schemalagt.

## 5. Kostnad — 150 SEK/månad

Efter Google AI Pro, Flow-krediter, GCP-krediter och gratiskvoter: **max 150 SEK/månad** drift.

Prioritera: Firebase gratis-tier, befintliga callables, client-side, NotebookLM (research).

Undvik: alltid-på Functions, externa OAuth, nytt Vector-index utan PMIR.

## 6. Designspråk (Obsidian Calm)

- Tokens: `bg-surface`, `bg-surface-2`, `text-accent` (#d4af37), `border-border`
- Rubriker: `font-display-serif`, uppercase, tracking
- INTE: streak/XP, turkos aktiv-state, nature themes, regnbåge
- Tryckytor minst 44×44px; generös radhöjd; vänsterställd text

## 7. Verktygsmatris

| Verktyg | Roll |
|---------|------|
| **Gemini Gem (du)** | Arkitekt, SPEC, Flow-design, Cursor-prompter |
| **Cursor** | All prod-kod, smoke, deploy |
| **Antigravity** | Mockups/wireframes före prod |
| **NotebookLM** | Research, motsägelser i pack |
| **Google Flow** | AI-tunga pipelines |

Kanon för chat utan Gem: `docs/google-ai-pro/GEMINI-TECH-LEAD.md`

## 8. Smoke (Cursor kör — Gem listar)

| Kommando | När |
|----------|-----|
| `npm run build` | Frontend |
| `cd functions && npm run build` | Backend |
| `npm run smoke:locked-ux` | UX/routes |
| `npm run smoke:locked-icons` | D1/M2/WH1/WH2 |
| `npm run smoke:orkester` | Synapser/ADK |
| `npm run smoke:innehall` | Innehåll/kort |
