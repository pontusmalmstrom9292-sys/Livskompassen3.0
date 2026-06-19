# Livskompassen — Avskalad Repomix: Kärnkod + Systemplan

**Genererad pack:** `exports/repomix/karnkod-systemplan.md`  
**Kör om:** `npm run repomix:karnkod-systemplan`

---

## Vad denna fil innehåller

Detta är **inte** hela repot. Det är ett avskalat handoff-paket för extern AI eller arkitektgranskning:

| Lager | Innehåll | Varför |
|-------|----------|--------|
| **Backend (100 % kärna)** | Hela `functions/src/**` | Callables, ADK, RAG, DCAP, ingest, WORM-logik |
| **Säkerhetsregler** | `firestore.rules`, `storage.rules`, `sharedRules.ts` | Deterministisk auth — LLM får inte besluta |
| **Systemplan (hela)** | `.context/system-plan.md`, `docs/SYSTEM_PLAN_v2.md`, Fas 19 masterplan | Fas 1–23 checkbox-historik + aktiv körplan |
| **Minnesarkitektur** | `.context/arkiv-minne.md`, GAP-register, INFINITE_EVOLUTION | Tre silos, WORM, självlärande ingest |
| **Frontend (minimal)** | Auth, Firebase init, typer, evolution store | Kontext för klient↔server — **ingen** full UI |

**Uteslutet medvetet:** design-galleri, fullständiga sidkomponenter, smoke-scripts, `.npm-cache`, Android-native, test-fixtures.

---

## Varför självlärande + säkerhet är kärnan (inte polish)

Livskompassen är ett **Life OS för högkonflikt, neuroinklusion och bevisarkivering**. Pontus behov:

1. **Bevis får aldrig försvinna** — sms, mönster, barnobservationer, journal → WORM (`reality_vault`, `children_logs`, `journal`).
2. **Systemet ska bli smartare över tid** — nya filer, dagbok, Drive → klassificeras och hamnar i **rätt silo** utan manuell copy-paste.
3. **Säkerhet före bekvämlighet** — LLM får aldrig blanda bevis med faktabank eller barnlogg (cross-RAG = juridiskt och psykologiskt farligt).
4. **Zero Footprint** — speglar, session, synapse-state rensas vid logout/panic (motpart får inte läsa RAM).

Utan (2) blir appen en statisk journal. Utan (3)–(4) blir den ett läckage. **Självlärande måste byggas innanför silo-gränserna.**

---

## Självlärande system — i detalj

### Begrepp

| Term | Betydelse i Livskompassen |
|------|---------------------------|
| **Självlärande** | Automatisk ingest + routing: nya källor → DCAP/klassificering i **kod** → rätt collection + vector (Kunskap) eller WORM (Valv/Barnen) |
| **Minnes-Arkitekten** | Cursor-agent + backend-pipeline som väver händelser utan cross-RAG |
| **Synaps (ADK)** | Händelse på `SynapseBus` — kopplar modul → minne deterministiskt |
| **Tre silos (U1)** | Kunskap (`kampspar`/`kb_docs`) · Valv (`reality_vault`) · Barnen (`children_logs`) |
| **DCAP (U2)** | Riskklassning **före** LLM — `routeFromDcap`, `resolveExecutorId` |
| **WORM (U3)** | Append-only — inga `update`/`delete` på bevis |
| **Evolution Engine** | `evolution_hub` + `evolution_ledger` — kapacitetsstyrd UI, barn-ålderssegment, ekonomi-gating |

### Live synapser (backend)

| Trigger | Handler | Effekt |
|---------|---------|--------|
| `drive_file_ingested` | `driveIngestSynapse` | Drive/Inkast → G10-klassificering → kb_docs **eller** reality_vault **eller** children_logs **eller** inbox_queue (HITL) |
| `journal_woven` | `journalWovenSynapse` | Opt-in dagbok → `kampspar` + vector (Kunskap-silo) |
| `dcap_alert` | `dcapAlertSynapse` | Risk ≥70 → `dcap_alerts` WORM + HITL |
| `user_overwhelm` | `paralysBrytarenSynapse` | Ett mikrosteg (kognitiv avlastning) |

Kedja: `notifyNewFile` / `submitInkastLite` → `emitSynapse` → synapse handler → Firestore + (ev.) Vertex vector.

### Säkerhetslager (deterministiskt)

```
Användarinmatning
    → DCAP / inboxClassifier (kod)
    → routeFromDcap → executor / silo
    → callableGuards (App Check + rate limit)
    → firestore.rules (WORM keys().hasOnly)
    → AdkOrchestrator + manifest (silo-isolation)
    → gatekeeperSanitize (PII bort)
    → Zero Footprint (clearSynapseState vid logout)
```

**LLM roll:** parafras, sammanfattning, BIFF-utkast — **aldrig** auth, silo-val eller WORM-beslut.

### Innehållsklass (U6)

| Klass | Zon | Kurator | RAG? |
|-------|-----|---------|------|
| FACT | Kunskap | specialist-kunskap-seed | Ja (`kampspar`) |
| REFLECTION / PLAY | MåBra (Vit) | specialist-mabra-curator | Nej |
| EVIDENCE | Valv / Barnen | ingest | WORM, separat query |

Prod-coach **MUST** parafrasera godkänd bank med `bankId` — ingen hallucinerad fakta.

---

## Viktigaste filer (snabbnavigering)

### Backend entry & regler

| Fil | Roll |
|-----|------|
| `functions/src/index.ts` | Alla callables + triggers export |
| `functions/src/sharedRules.ts` | **Enda** prompt-kanon för agenter |
| `functions/src/agents/DCAP.ts` | Risk + routing före LLM |
| `functions/src/agents/cards/index.ts` | AgentCards → executor mapping |
| `firestore.rules` | WORM, userId, verified email |

### ADK & synapser

| Fil | Roll |
|-----|------|
| `functions/src/adk/orchestrator.ts` | A2A dispatch, PII-gatekeeper |
| `functions/src/adk/synapses/synapseBus.ts` | emitSynapse, trigger registry |
| `functions/src/adk/synapses/driveIngestSynapse.ts` | Multi-silo Drive/Inkast ingest (G10) |
| `functions/src/adk/manifest.ts` | Backend silo-isolation asserts |

### RAG (tre separata queries)

| Fil | Silo |
|-----|------|
| `functions/src/lib/kampsparQueryRag.ts` | Kunskap |
| `functions/src/lib/vaultRag.ts` | Valv-bevis |
| `functions/src/lib/childrenLogsQueryRag.ts` | Barnen |

### Ingest & inkast

| Fil | Roll |
|-----|------|
| `functions/src/lib/submitInkastLite.ts` | Smart Inkast entry |
| `functions/src/lib/inboxClassifier.ts` | Dokumentklassificering |
| `functions/src/lib/analyzeUploadForKnowledge.ts` | Kunskap-kandidat |
| `functions/src/triggers/inkastStorageOnFinalize.ts` | Storage → pipeline |

### Systemplan & status

| Fil | Roll |
|-----|------|
| `.context/system-plan.md` | Fas 1–5 detalj + permanent minne |
| `docs/SYSTEM_PLAN_v2.md` | Fas 9–23 aktiv styrning |
| `docs/evaluations/2026-06-15-fas19-masterplan-v2.md` | **Enda körplan** Fas 19+ |
| `docs/specs/modules/Arkiv-GAP-REGISTER.md` | G1–G16 done/open (sanning) |
| `docs/MODUL-FUNKTIONS-REGISTER.md` | Modul ↔ route ↔ callable |

---

## Läsordning för extern AI

1. Denna preamble  
2. `.context/arkiv-minne.md` + `.context/security.md`  
3. `docs/SYSTEM_PLAN_v2.md` (status) + Fas 19 masterplan (nästa steg)  
4. `functions/src/index.ts` → ADK → synapser → RAG-lib  
5. `firestore.rules` (WORM-validering)

**Regel:** Jämför alltid påståenden mot `Arkiv-GAP-REGISTER.md` och levande kod — docs kan ligga efter.

---

## Relaterade packs (djupdyk per zon)

| npm script | Fokus |
|------------|-------|
| `npm run gpt-handoff:pack:01` | Arkitektur + routing |
| `npm run gpt-handoff:pack:02` | Valv + WORM |
| `npm run chatbot:pack:security` | Synapser + säkerhet (litet) |
| `npm run gemini:pack` | Modulvis (kompass, valv, inkast …) |
