# Backend djupanalys — 2026-06-15

**Metod:** 5 parallella read-only underagenter (Functions, Firestore/WORM, ADK/Orkester, RAG/silor, Säkerhet/deploy).  
**Syfte:** Kartlägga live backend, flagga luckor, prioritera säkra nästa steg.  
**Projekt:** `gen-lang-client-0481875058` · **Region:** `europe-west1`

---

## Executive summary

| Lager | Status |
|-------|--------|
| **Cloud Functions** | 49 exporterade, alla live, Node 20 |
| **Firestore** | 55+ collections, WORM på Sacred-silos |
| **Storage** | 5 uid-scopade WORM-paths + dossier (admin-only write) |
| **ADK/Orkester** | 2 runtime-executors, 4 synapse-triggers, 3 isolerade RAG-silor |
| **Vector Search** | Kunskap (`kampspar`) endast — ~173 vektorer (GCP inventory 2026-06-11) |
| **Secrets** | `GEMINI_API_KEY`, `NOTIFY_WEBHOOK_SECRET` |

**Starkt:** WORM på bevisvägar, tre silos i user-facing RAG, DCAP före LLM, G10 inkast med HITL, rate limits på LLM-callables.

**Åtgärd krävs:** Firestore rules-luckor (`inbox_rules`, `daily_intentions`), App Check enforce, vault JWT vs session TTL-mismatch, 6 callables utan full guard, `generateWeeklyInsights` utan vault-gate, `user_overwhelm` synapse-stub, stale GCP-inventory.

---

## 1. Cloud Functions (49)

**Entry:** `functions/src/index.ts` — re-export only.  
**Region:** `europe-west1` via `GCP_REGION` i `config.ts`.

### Per domän

| Domän | Antal | Viktigaste |
|-------|-------|------------|
| Valv | 10 | `valvChatQuery`, `generateDossier`, `unlockVault`, WebAuthn, mönsterscan |
| Kunskap | 6 | `knowledgeVaultQuery`, `ingestKampsparEntry`, `generateEmbedding` |
| Inkast | 5 | `submitInkastLite`, `confirmInboxItem`, `previewInboxClassification` |
| ADK/Agenter | 18 | `analyzeMessage`, `notifyNewFile`, `weaveJournalEntry`, `mabraCoach` |
| Barnen | 2 | `childrenLogsQuery`, Barnporten pairing |
| Ekonomi/Plan | 4 | `calculateSmartAllocation`, `generatePayslip`, `parseVoiceCommand` |
| Triggers | 2 | `onVaultCreatePatternScan`, `mabraEconomySync` |

### Guard-mönster

- **Standard:** `guardSensitiveCallableV2` → auth + App Check (vid enforce) + rate limit (`callableGuards.ts`, `rateLimit.ts`)
- **Valv:** + `assertVaultSession` (1h server-token, `vaultSessionGate.ts`)
- **Utan full guard:** `invalidateSession`, `createBarnportenPairing`, `claimBarnportenPairing`, `generatePayslip`, `analyzeProjectImage`, `getAgentRegistry`

### API-generation

- **v2 `onCall`:** majoriteten
- **v1 kvar:** `ingestKampsparEntry`, `ingestKnowledgeDocument`, schedulers, `notifyNewFile` (HTTP webhook)

### Secrets & env

| Secret / env | Användning |
|--------------|------------|
| `GEMINI_API_KEY` | LLM-callables via `defineSecret` |
| `NOTIFY_WEBHOOK_SECRET` | `notifyNewFile` — fail-closed i prod om saknas |
| `APP_CHECK_ENFORCE` | `'true'` aktiverar App Check på guarded callables |
| `VECTOR_SEARCH_*` | ANN index/endpoint/deployed id |
| `VAULT_WEBAUTHN_ORIGINS` / `RP_IDS` | WebAuthn allowlist |
| `RETENTION_DAYS` | GDPR retention (default 90) |

### Noterad lucka

- `generateWeeklyInsights` läser `reality_vault` **utan** `assertVaultSession` (till skillnad från `generateWeeklySummary`, `generateCompassInsight`)

---

## 2. Firestore — datamodell & WORM

**Kanon:** `firestore.rules`, `src/modules/core/types/firestore.ts`, `functions/src/lib/wormPayload.ts`

### Sacred / permanent minne

| Collection | Silo | Client update/delete | Gate |
|------------|------|---------------------|------|
| `reality_vault` | Valv | Nej | Vault unlock + verified email |
| `children_logs` | Barnen | Nej | Verified email |
| `journal` | Hjärtat | Nej | Verified email |
| `kampspar` + `kb_docs` | Kunskap | Nej | Owner |
| `dossier_snapshots` | Valv | Nej | Admin SDK only |
| `evolution_ledger` | Core | Nej | Append-only lag |

### Admin-only (callable-skrivna)

`entity_profiles`, `system_synapses`, `inbox_queue`, `weaver_pending`, `pattern_scan_metadata`, `dcap_alerts`, `payslip_snapshots`, `insight_summaries`, `context_cache_registry`, `_rate_limits`, `allocation_proposals`, `user_economy_status`, `user_capability_state`

### Kända luckor (rules ↔ kod)

| Problem | Allvar |
|---------|--------|
| `inbox_rules` — client CRUD men saknas i rules | 🔴 |
| `daily_intentions` — client använder, saknas i rules | 🔴 |
| `FIRESTORE_COLLECTIONS` ofullständig vs live rules | 🟡 |
| `reflection_entries` — rules finns, ingen `src/`-wire än | 🟡 |
| `archival_analysis` — konstant only, ingen live kod | 🟡 |
| Data Connect = boilerplate (Movie/Review), ej prod | Info |

**13 composite indexes** — silo-tidslinjer, inbox, weaver, pattern sidecar.

---

## 3. ADK & Orkestrering

### Synapse-triggers (`synapseBus.ts`)

| Trigger | Status | Emitter |
|---------|--------|---------|
| `drive_file_ingested` | Live | `notifyNewFile` |
| `journal_woven` | Live | `journalWovenToKampspar` (optIn) |
| `dcap_alert` | Live | KompisSupervisor + `mabraEconomySync` |
| `user_overwhelm` | Stub | Handler finns, ingen emitter |

### Runtime-executors (2)

| Executor | Product cards |
|----------|---------------|
| `agent_grans_arkitekten` | BIFF, Brusfilter, Sannings-Analytikern, DCAP ≥30 |
| `agent_livs_arkivarien` | Mönster, Paralys, Uppgifts, RSD, Speglar |

### DCAP (U2)

```
risk ≥ 70  → ALERT    → Gräns + dcap_alert synapse
risk ≥ 30  → COACHING → Gräns + analyzeCommunication
risk < 30  → NONE     → Livs-Arkivarien + searchKampspar
```

Hamn (`module: safe_harbor`) tvingar Gräns oavsett DCAP.

### Wired vs stub

- **Live:** KompisSupervisor, silo RAG-trio, MåBra/Speglar via `vertexAgent`, drive ingest → Mönster
- **Stub/partial:** `user_overwhelm` synapse, RSD-Kylaren (card only), `adk/manifest.ts` inert

---

## 4. Tre RAG-silor (U1)

| Silo | Callable | Collections | Vector |
|------|----------|-------------|--------|
| Kunskap | `knowledgeVaultQuery` | `kampspar`, `kb_docs` | ANN på `kampspar` |
| Valv | `valvChatQuery` | `reality_vault` | Token-match only |
| Barnen | `childrenLogsQuery` | `children_logs` | Token-match only |

**Medvetna cross-reads (ej user RAG):** Vävaren metadata, Dossier export, weekly/compass summaries.

**Risker:**

- Ingen `assertSiloIsolation` i `functions/` (endast frontend `manifestGuards.ts`)
- `analyzeMessage` `ragContext` client-supplied
- Weaver läser journal + vault + kampspar (vault-gated, HITL)

---

## 5. Säkerhet & deploy

### Valv — två lager

| Lager | TTL | Syfte |
|-------|-----|-------|
| Server session (`vaultSessionToken`) | 1 h | Callables |
| JWT claims (`vaultUnlocked`) | 15 min | Direkt Firestore vault |

### WebAuthn

- Web: `@simplewebauthn/server` ✅
- Native: `issueVaultSessionViaBiometric` — litar på OS biometric ⚠️

### Zero Footprint

- `invalidateSession` → supervisor + vault session + Vertex cache
- Kill Switch borttagen 2026-06-01 → Device Clear

### CMEK

- `scripts/setup_gcp_cmek.sh` — ej runtime-verifierat
- `gs://livskompassenv2` CMEK-designation, 0 B

### Prioriterade säkerhetsluckor

1. App Check fail-open tills Console + `APP_CHECK_ENFORCE=true`
2. CMEK partial
3. Native biometric svagare än WebAuthn
4. JWT 15 min vs session 1 h mismatch
5. 6 callables utan `guardSensitiveCallableV2`
6. `generateWeeklyInsights` utan vault session-gate

---

## 6. Inkast-pipeline (G10)

```
notifyNewFile → drive_file_ingested
  → documentAgent → inboxClassifier → routeInboxToWorm
      bevis     → reality_vault (kö om ej vault session)
      barnen    → children_logs
      dagbok    → journal
      kunskap   → kb_docs
      planning  → planning_tasks
      trauma/LVU utan optIn → inbox_queue (HITL)
```

---

## 7. Åtgärdslista (prioriterad, säker ordning)

| # | Åtgärd | Risk om fel | Smoke efter |
|---|--------|-------------|-------------|
| 1 | Firestore rules: `inbox_rules` + `daily_intentions` | Låg (read-only audit först) | `npm run build`, manuell CRUD-test |
| 2 | `generateWeeklyInsights` — vault session-gate | Medel | `smoke:locked-ux` |
| 3 | `guardSensitiveCallableV2` på 6 callables (utom `invalidateSession` medvetet) | Medel | `smoke:orkester`, `smoke:auth-login` |
| 4 | Dokumentera eller synka JWT 15 min vs session 1 h | Låg (beslut) | `smoke:valv-security` |
| 5 | `user_overwhelm` — emittera eller ta bort stub | Låg | `smoke:orkester` |
| 6 | Uppdatera `docs/GCP-INVENTORY-LATEST.md` | Ingen kod | — |
| 7 | App Check Console + `APP_CHECK_ENFORCE` | Hög (prod) | `smoke:locked-ux`, manuell login |
| 8 | CMEK smoke + prod sign-off | Hög (infra) | Separat PMIR |

**MUST NOT utan PMIR + Pontus OK:** `firestore.rules` Sacred-ändringar utöver luckfix, mass-deploy, CMEK prod.

---

## 8. Verifiering

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions && npm run build
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0 && npm run build
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:valv-security
```

Deploy endast efter smoke PASS och explicit OK.

---

## Referenser

- `functions/src/index.ts`
- `firestore.rules`, `storage.rules`
- `functions/src/adk/synapses/synapseBus.ts`
- `functions/src/lib/kampsparQueryRag.ts`, `vaultRag.ts`, `childrenLogsQueryRag.ts`
- `docs/GCP-INVENTORY-LATEST.md`
- `docs/evaluations/2026-06-15-fas21-callables-guard-inventory.md`
- Fas 19 gate: `docs/evaluations/2026-06-15-fas19-masterplan-v2.md`
