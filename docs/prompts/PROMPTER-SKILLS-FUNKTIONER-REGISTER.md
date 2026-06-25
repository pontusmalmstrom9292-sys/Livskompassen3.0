# Livskompassen — Register: Prompter, Skills & Funktioner

**Plattform:** Cursor (Auto) · **Datum:** 2026-06-25  
**Syfte:** Samlad karta över AI-prompter, Cloud Functions, ADK-synapser, Cursor-agenter och skills.

> **Kanonisk runtime-källa:** `functions/src/sharedRules.ts`  
> Ändra aldrig runtime-prompter utan PMIR + `npm run smoke:prompts`.

---

## 1. Tre lager

| Lager | Var | Deploy? |
|-------|-----|---------|
| **Runtime** | `functions/src/sharedRules.ts` | Ja |
| **Governance** | `docs/prompts/*.json` | Nej |
| **Utveckling** | `.cursor/agents/`, `.cursor/skills/`, `.agents/skills/` | Nej |

**Befintliga prompt-dokument (fulltext kopior):**  
`docs/prompts/SANNINGS-ANALYTIKERN-PROMPT.md` · `SPEGLINGSCOACHEN-PROMPT.md` · `MONSTER-ARKIVARIEN-PROMPT.md` · `BRUSFILTRET-PROMPT.md` · `BIFF-SKOLDEN-PROMPT.md` · `UPPGIFTS-KROSSAREN-PROMPT.md` · `PARALYS-BRYTAREN-PROMPT.md` · `RSD-KYLAREN-PROMPT.md` · `BARA-LYSSNA-LAGET-PROMPT.md`

---

## 2. Runtime-systemprompter (`sharedRules.ts`)

### Domänlins (prepended)

`DOMAIN_COVERT_HCF_LENS` (rad 2–6) — används av Vävaren, DCAP, Gräns-Arkitekten, BIFF, Inkorg, Kompassråd, Voice-to-Vault.

### Hjärtat · Dagbok · Speglar

| Konstant | Callable | Output |
|----------|----------|--------|
| `VÄVAREN_SYSTEM_PROMPT` | `weaveJournalEntry` | JSON: känslor, aktörer, hotnivå |
| `DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT` | `journalQuickMirror` | JSON: mirrorLine, microStep, suggestMode |
| `SPEGLINGS_COACHEN_SYSTEM_PROMPT` | `speglingsMirror` | JSON: mirrorLine (max 3 meningar) |
| `JOURNAL_SILENT_REFLECTION_PROMPT` | `journalSilentReflection` | JSON: prompt (ephemeral) |

### Valv · Hamn · Bevis

| Konstant | Agent-ID | Callable |
|----------|----------|----------|
| `SANNING_ANALYTIKERN_SYSTEM_PROMPT` | agent_sannings_analytikern | `valvChatQuery`, `compareVaultEvidence` |
| `MONSTER_ARKIVARIEN_SYSTEM_PROMPT` | agent_monster_arkivarien | `generateWeeklyInsights`, mönster i Valv |
| `PATTERN_ASSIST_SYSTEM` | — | `assistPatternMetadata` |
| `BRUSFILTER_SYSTEM_INSTRUCTION` | agent_brusfiltret | `processBrusfilter` |
| `GRANS_ARKITEKTEN_SYSTEM_PROMPT` | agent_grans_arkitekten | `analyzeMessage` (Hamn) |
| `BIFF_REWRITE_DRAFT_SYSTEM_PROMPT` | agent_biff_skolden | `biffRewriteDraft` |
| `DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT` | — | `DCAP.ts` lager 2 |
| `REALITY_CHECKER_SYSTEM_PROMPT` | reality_checker | expertPrompts (legacy) |
| `OCR_PROMPT` | — | `analyzeProjectImage` |

**DCAP-routing** (`routeFromDcap` i `agents/cards/index.ts`):

- risk ≥ 70 → Gräns-Arkitekten · Grey Rock
- risk 50–69 → Gräns-Arkitekten · analys
- risk 30–49 → Speglings-Coachen
- risk 0–29 → Livs-Arkivarien · RAG

### Inkast · Röst

| Konstant | Callable |
|----------|----------|
| `INKORG_SORTERARE_SYSTEM_PROMPT` | `previewInboxClassification`, `submitInkastLite` |
| `VOICE_TO_VAULT_SYSTEM_PROMPT` | `ingestWidgetRecording` |
| `VOICE_COMMAND_SYSTEM_PROMPT` | `parseVoiceCommand` |
| `KOMPASSRAD_SYSTEM_PROMPT` | `generateKompassrad` |
| `KOMPASS_INSIKT_SYSTEM_PROMPT` | `generateCompassInsight` |

### Vardagen · MåBra

| Konstant | Callable |
|----------|----------|
| `MABRA_COACHEN_SYSTEM_PROMPT` | `mabraCoach` |
| `VIT_CHAT_COACH_SYSTEM_PROMPT` | `mabraCoach` (Vit) |
| `MABRA_NUTRITION_COACH_SYSTEM_PROMPT` | `mabraCoach` (nutrition) |
| `MABRA_MOVEMENT_COACH_SYSTEM_PROMPT` | `mabraCoach` (movement) |
| `KBT_TRANSFORMATOR_SYSTEM_PROMPT` | `mabraCoach` (KBT) |
| `PARALYS_BRYTAREN_SYSTEM_PROMPT` | `breakDownResponse`, synapse `user_overwhelm` |
| `UPPGIFTS_KROSSAREN_SYSTEM_PROMPT` | `crushTask` |
| `RSD_KYLAREN_SYSTEM_PROMPT` | `analyzeMessage` (supervisor) |
| `ADHD_COACH_SYSTEM_PROMPT` | expertPrompts |

### Familjen · Kunskap

| Konstant | Callable | Silo |
|----------|----------|------|
| `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` | `childrenLogsQuery` | Barnen |
| `LIVS_ARKIVARIEN_SYSTEM_PROMPT` | `knowledgeVaultQuery` | Kunskap |
| `KOMPIS_SYSTEM_PROMPT` | `chatWithKompis` | Dagbok |

### Agent-uppslagning

`getAgentSystemPrompt(agentId, intent?)` — se `sharedRules.ts` rad 798+.

---

## 3. Cloud Functions (callables)

### Hjärtat · Inkast
`weaveJournalEntry` · `approveWeaverMetadata` · `rejectWeaverMetadata` · `journalWovenToKampspar` · `speglingsMirror` · `journalQuickMirror` · `journalSilentReflection` · `getInboxQueue` · `confirmInboxItem` · `dismissInboxItem` · `previewInboxClassification` · `submitInkastLite` · `reprocessVaultInboxQueue` · `processBrusfilter` · `biffRewriteDraft` · `parseVoiceCommand` · `ingestWidgetRecording`

### Valv · Hamn
`analyzeMessage` · `valvChatQuery` · `compareVaultEvidence` · `generateDossier` · `assistPatternMetadata` · `rescanPatternMetadata` · `unlockVault` · `beginVaultWebAuthnChallenge` · `beginVaultBiometricChallenge` · `issueVaultSession` · `issueVaultSessionViaBiometric` · `getEntityProfileRegistry` · `addEntityProfile` · `resolveDcapAlert` · `invalidateSession`

### Vardagen
`mabraCoach` · `breakDownResponse` · `crushTask` · `generateCompassInsight` · `generateKompassrad` · `generateWeeklyInsights` · `generateWeeklySummary` · `getAdaptationProfile` · `recordAdaptationSignal` · `calculateSmartAllocation` · `generatePayslip`

### Kunskap · RAG
`knowledgeVaultQuery` · `childrenLogsQuery` · `generateEmbedding` · `chatWithKompis` · `getAgentRegistry`

### Familjen · övrigt
`createBarnportenPairing` · `claimBarnportenPairing` · `analyzeProjectImage` · `recordDiscoveryMilestone` · `recordPipelineRun`

### Triggers
`onVaultCreatePatternScan` · `onInkastEvidenceFinalized` · `notifyNewFile` · `scheduledRetentionJob` · `scheduledBarnportenAgeEval` · `scheduledTransactionsAnalysis` · `scheduledGeneratePayslip`

---

## 4. ADK SynapseBus

| Trigger | Handler | Prompt |
|---------|---------|--------|
| drive_file_ingested | driveIngestSynapse | INKORG (vid klassificering) |
| journal_woven | journalWovenSynapse | — |
| dcap_alert | dcapAlertSynapse | — |
| user_overwhelm | paralysBrytarenSynapse | PARALYS_BRYTAREN |
| widget_recording_ingested | widgetRecordingIngestSynapse | VOICE_TO_VAULT |
| kasam_aggregation | kasamAggregationSynapse | — |

---

## 5. Pipeline Studio

`flow_inkast_classify` · `flow_brusfilter` · `flow_biff_rewrite` · `flow_pattern_assist` · `flow_valv_chat` · `flow_dossier_foreword`

Validering: `npm run pipeline:validate`

---

## 6. Governance-prompter (copy-paste)

Källa: `docs/prompts/SAKER-AI-PROMPTS.json`

**Säkerhetsinstruktion:**
> Svara endast med fakta från projektets verifierade datakällor (kod, docs, WORM, godkänd content-bank). Undvik gissningar — flagga osäkra antaganden. Vid osäkerhet svara: 'Ej tillräckligt data för bedömning.' Följ strikt WORM, tre silos (aldrig cross-RAG), Zero Footprint (Speglar/Hamn), Kill Switch/Device Clear och låsta flöden. Bryt aldrig locked UX eller firestore.rules utan PMIR.

**Expert-direktiv:** `docs/prompts/EXPERT-AGENT-DIRECTIVES.json` — 8 färdiga templates (security-auditor, master-architect, ux-guardian, hcf-domän, yolo-vakt, verifier, smoke-runner, orkester-conductor).

---

## 7. Cursor-agenter (50 st)

`.cursor/agents/` — använd Task med `subagent_type` eller @-mention.

**Orkestrering:** livskompassen-master-architect · orkester-conductor · parallel-orchestrator · yolo-vakt · integration-conductor · gemini-orkester-bridge · copilot-bridge · mcp-guardian · mcp-ops-runner · external-ai-import-gate

**Zon-byggare:** specialist-valv-builder · specialist-hjartat-inkast-builder · specialist-familjen-hamn-builder · specialist-vardagen-builder · specialist-dagbok · specialist-planering · specialist-ekonomi · specialist-widgets · specialist-rost-till-valv · specialist-onboarding · specialist-sos · specialist-drogfrihet · design-labbet · bild-arkitekten · android-kompis

**Backend/minne:** livskompassen-synapser-adk · livskompassen-arkiv-master · minnes-arkitekten · specialist-adk-weaver · specialist-dcap-routing · specialist-firestore-rules · specialist-security-auditor · specialist-grans-arkitekten · specialist-emotionellt-minne · frontend-modul-auditor

**Innehåll:** specialist-innehall-dirigent · specialist-kunskap-seed · specialist-mabra-curator · specialist-barn-lek · specialist-utveckling-kurator · specialist-neuro-psyk-seed · specialist-myndighet-seed · specialist-hcf-domän · specialist-aterhamtning-hälsa

**Kvalitet:** specialist-verifier · specialist-smoke-runner · specialist-ux-guardian · specialist-theme-lab · specialist-beslutsstod · copilot-research-handoff

---

## 8. Cursor Skills

**.cursor/skills/:** livskompassen-synapser-adk · livskompassen-arkiv-master · livskompassen-memory-silo-guard · livskompassen-memory-agents · livskompassen-rag-retrieval · livskompassen-vector-search · livskompassen-deploy · livskompassen-integration-hub · livskompassen-theme-lab

**.agents/skills/:** android-kompis · beslutsstod · bild-arkitekten · design-labbet · krav-analytiker · minnes-arkitekten · yolo-vakt

---

## 9. Zon → agent → callable (snabbreferens)

```
Ex-sms     → analyzeMessage / processBrusfilter / biffRewriteDraft
Validering → speglingsMirror
Bevis      → submitInkastLite / valvChatQuery
Dagbok     → weaveJournalEntry / journalQuickMirror
MåBra      → mabraCoach
ADHD-steg  → breakDownResponse / crushTask
Barn       → childrenLogsQuery
Kunskap    → knowledgeVaultQuery
Röst       → ingestWidgetRecording / parseVoiceCommand
```

---

## 10. Smoke

`npm run smoke:prompts` · `smoke:orkester` · `smoke:locked-ux` · `smoke:predeploy:build` · `pipeline:validate`

---

*Genererat 2026-06-25. Vid avvikelse vinner `functions/src/sharedRules.ts`.*
