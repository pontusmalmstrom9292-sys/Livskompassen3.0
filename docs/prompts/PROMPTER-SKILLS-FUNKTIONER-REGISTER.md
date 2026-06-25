# Livskompassen — Master-register: Prompter, Skills & Funktioner

**Version:** 2026-06-25 · **Plattform:** Cursor  
**Underhåll:** Efter ändring i `sharedRules.ts` → `npm run prompts:sync` → `npm run smoke:prompts`

---

## Analys & förbättringar (2026-06-25)

### Vad som var fel
1. **Dubletter** — `BARA-LYSSNA-LAGET` och `BIFF-SKOLDEN` var föråldrade varianter av Speglar/Gräns-Arkitekten.
2. **Drift** — `PARALYS-BRYTAREN-PROMPT.md` beskrev fält som inte finns i runtime.
3. **Luckor** — 22 runtime-prompter saknade spegel-filer i `docs/prompts/`.
4. **Arkivskräp** — `PROMTMASTARE/` (19 filer) refererades inte av kod.
5. **Skills-split** — `.cursor/skills/` vs `.agents/skills/` utan tydlig karta.
6. **Ingen sync** — `smoke:prompts` validerade inte speglar mot `sharedRules.ts`.

### Vad som fixats
- `npm run prompts:sync` — auto-genererar 23 spegel-filer från `sharedRules.ts`
- `smoke:prompts` — failar om speglar är ur synk
- Borttagna dubletter, `PROMTMASTARE` → `docs/archive/prompts/`
- Uppdaterat `agent-gap-scout.mdc`, `projectGuard.mdc`, `SAKER-AI-PROMPTS.json`
- Skills pekar nu på kanoniska agenter + detta register

### Kvar att bevaka
| Gap | Rekommendation |
|-----|----------------|
| `livskompassen-ekonomi` skill saknas | Skapa vid nästa ekonomi-våg |
| `livskompassen-voice` skill saknas | Skapa vid röst-våg |
| `krav-analytiker` agent saknas | Skapa `.cursor/agents/krav-analytiker.md` |
| `REALITY_CHECKER` / `ADHD_COACH` | Legacy i `expertPrompts.ts` — dokumentera som deprecated |
| Brusfiltret dual path | `processBrusfilter` → `BRUSFILTER`; `agent_brusfiltret` lookup → `GRANS_ARKITEKTEN` |

---

## 1. Tre lager

| Lager | Var | Deploy? |
|-------|-----|---------|
| **Runtime** | `functions/src/sharedRules.ts` | Ja |
| **Speglar** | `docs/prompts/*-PROMPT.md` | Nej (auto-sync) |
| **Governance** | `prompts/*.json`, `docs/prompts/*.json` | Nej |
| **Utveckling** | `.cursor/agents/`, skills | Nej |

---

## 2. Runtime-prompter (23 speglar)

Kör `npm run prompts:sync` efter PMIR-ändring i `sharedRules.ts`.

| Spegel-fil | Konstant | Zon |
|------------|----------|-----|
| `SANNINGS-ANALYTIKERN-PROMPT.md` | `SANNING_ANALYTIKERN_SYSTEM_PROMPT` | Valv |
| `SPEGLINGSCOACHEN-PROMPT.md` | `SPEGLINGS_COACHEN_SYSTEM_PROMPT` | Speglar |
| `MONSTER-ARKIVARIEN-PROMPT.md` | `MONSTER_ARKIVARIEN_SYSTEM_PROMPT` | Valv |
| `MONSTER-ARKIVARIEN-BARNEN-PROMPT.md` | `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` | Familjen |
| `BRUSFILTRET-PROMPT.md` | `BRUSFILTER_SYSTEM_INSTRUCTION` | Hamn/Inkast |
| `GRANS-ARKITEKTEN-PROMPT.md` | `GRANS_ARKITEKTEN_SYSTEM_PROMPT` | Hamn |
| `BIFF-REWRITE-DRAFT-PROMPT.md` | `BIFF_REWRITE_DRAFT_SYSTEM_PROMPT` | Hamn |
| `UPPGIFTS-KROSSAREN-PROMPT.md` | `UPPGIFTS_KROSSAREN_SYSTEM_PROMPT` | Vardagen |
| `PARALYS-BRYTAREN-PROMPT.md` | `PARALYS_BRYTAREN_SYSTEM_PROMPT` | Vardagen |
| `RSD-KYLAREN-PROMPT.md` | `RSD_KYLAREN_SYSTEM_PROMPT` | Personligt |
| `INKORG-SORTERARE-PROMPT.md` | `INKORG_SORTERARE_SYSTEM_PROMPT` | Inkast G10 |
| `VAVAREN-PROMPT.md` | `VÄVAREN_SYSTEM_PROMPT` | Dagbok |
| `LIVS-ARKIVARIEN-PROMPT.md` | `LIVS_ARKIVARIEN_SYSTEM_PROMPT` | Kunskap |
| `KOMPIS-PROMPT.md` | `KOMPIS_SYSTEM_PROMPT` | Hem |
| `DAGBOK-SNABB-COACH-PROMPT.md` | `DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT` | Dagbok |
| `MABRA-COACH-PROMPT.md` | `MABRA_COACHEN_SYSTEM_PROMPT` | MåBra |
| `VIT-CHAT-COACH-PROMPT.md` | `VIT_CHAT_COACH_SYSTEM_PROMPT` | MåBra Vit |
| `KBT-TRANSFORMATOR-PROMPT.md` | `KBT_TRANSFORMATOR_SYSTEM_PROMPT` | MåBra |
| `DCAP-SEMANTIC-PROMPT.md` | `DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT` | DCAP |
| `VOICE-TO-VAULT-PROMPT.md` | `VOICE_TO_VAULT_SYSTEM_PROMPT` | Widget |
| `VOICE-COMMAND-PROMPT.md` | `VOICE_COMMAND_SYSTEM_PROMPT` | Röst |
| `KOMPASSRAD-PROMPT.md` | `KOMPASSRAD_SYSTEM_PROMPT` | Hem |
| `JOURNAL-SILENT-REFLECTION-PROMPT.md` | `JOURNAL_SILENT_REFLECTION_PROMPT` | Dagbok tyst |

**Utan spegel (kort/komplement):** `PATTERN_ASSIST_SYSTEM`, `OCR_PROMPT`, `KOMPASS_INSIKT_SYSTEM_PROMPT`, `GRANS_EPISTEMIC_GUARD_RULES`, `REALITY_CHECKER`, `ADHD_COACH` — endast i `sharedRules.ts`.

---

## 3. Cloud Functions (callables)

### Hjärtat · Inkast
`weaveJournalEntry` · `speglingsMirror` · `journalQuickMirror` · `journalSilentReflection` · `previewInboxClassification` · `submitInkastLite` · `processBrusfilter` · `biffRewriteDraft` · `parseVoiceCommand` · `ingestWidgetRecording`

### Valv · Hamn
`analyzeMessage` · `valvChatQuery` · `compareVaultEvidence` · `generateDossier` · `assistPatternMetadata` · `unlockVault` · `resolveDcapAlert`

### Vardagen
`mabraCoach` · `breakDownResponse` · `crushTask` · `generateCompassInsight` · `generateKompassrad` · `generateWeeklyInsights`

### Kunskap · RAG
`knowledgeVaultQuery` · `childrenLogsQuery` · `chatWithKompis`

Full exportlista: `functions/src/index.ts`

---

## 4. ADK SynapseBus

| Trigger | Prompt |
|---------|--------|
| `drive_file_ingested` | INKORG (vid klassificering) |
| `journal_woven` | — |
| `dcap_alert` | — |
| `user_overwhelm` | PARALYS_BRYTAREN |
| `widget_recording_ingested` | VOICE_TO_VAULT |
| `kasam_aggregation` | — |

---

## 5. Cursor-agenter (50)

Katalog: `.cursor/agents/*.md`  
Paste-templates: `docs/prompts/EXPERT-AGENT-DIRECTIVES.json` (8 st)

**Orkestrering:** livskompassen-master-architect · orkester-conductor · yolo-vakt · integration-conductor · parallel-orchestrator

**Zon-byggare:** specialist-valv-builder · specialist-hjartat-inkast-builder · specialist-familjen-hamn-builder · specialist-vardagen-builder · specialist-dagbok · specialist-planering · specialist-ekonomi · specialist-widgets

**Backend:** livskompassen-synapser-adk · minnes-arkitekten · specialist-adk-weaver · specialist-dcap-routing · specialist-firestore-rules · specialist-security-auditor

**Innehåll:** specialist-innehall-dirigent · specialist-kunskap-seed · specialist-mabra-curator · specialist-hcf-domän

**Kvalitet:** specialist-verifier · specialist-smoke-runner · specialist-ux-guardian · specialist-beslutsstod

---

## 6. Skills

### Infrastruktur — `.cursor/skills/`
livskompassen-arkiv-master · livskompassen-deploy · livskompassen-integration-hub · livskompassen-memory-agents · livskompassen-memory-silo-guard · livskompassen-rag-retrieval · livskompassen-synapser-adk · livskompassen-theme-lab · livskompassen-vector-search

### Produkt — `.agents/skills/`
android-kompis · beslutsstod · bild-arkitekten · design-labbet · krav-analytiker · minnes-arkitekten · yolo-vakt

**Konvention:** Agent-fil = kanon. Skill = snabbaktivering med pekare till agent.

---

## 7. Kommandon

```bash
npm run prompts:sync      # Uppdatera speglar från sharedRules.ts
npm run smoke:prompts     # Validera governance + speglar-sync
npm run pipeline:validate # Pipeline Studio FTD
```

---

## 8. Arkiverat

`docs/archive/prompts/PROMTMASTARE/` — historiska sprint-prompter, ej runtime.

---

*Vid avvikelse vinner `functions/src/sharedRules.ts`.*
