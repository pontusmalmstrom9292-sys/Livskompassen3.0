# Modulutvärdering — Functions (backend) — 2026-05-23

**Plats:** `functions/` — Cloud Functions, Agent Cards, DCAP, ADK synapser  
**Region:** `europe-west1` (kanonisk)

---

## Sammanfattning

Backend är **konsoliderad och deployad** — 0 legacy Python. Alla arkiv-GAP G1–G16 **done** i kod. 10 agent cards + 2 executors; prompts i `sharedRules.ts`. Retention skyddar permanent minne (G5). **WAIT:** Genkit V1; `@cursor/sdk` Natt-CI.

---

## Exporterade callables (urval)

| Function | Version | Auth | Silo / roll |
|----------|---------|------|-------------|
| `knowledgeVaultQuery` | v2 | Firebase | Kunskap RAG |
| `valvChatQuery` | v2 | Firebase | Valv RAG |
| `childrenLogsQuery` | v2 | Firebase | Barnen RAG |
| `analyzeMessage` | v1 | Firebase | DCAP + supervisor |
| `generateDossier` | v1 | Firebase | WORM snapshot |
| `speglingsMirror` | v1 | Firebase | Speglings |
| `mabraCoach` | v1 | Firebase | Opt-in coach |
| `weaveJournalEntry` | v1 | Firebase | Vävaren metadata |
| `notifyNewFile` | v1 | Webhook secret | Drive → kb_docs |
| `invalidateSession` | v1 | Firebase | Zero Footprint |
| `ingestWidgetRecording` | v1 | Firebase | Widget → valv WORM |
| `scheduledRetentionJob` | v1 | cron | G5 retention |

**Inbox/entity/cache (G9–G12):** `getEntityProfileRegistry`, `getInboxQueue`, `confirmInboxItem`, `getContextCacheStatus` — alla exporterade.

---

## Agent Cards (10)

| Card | Executor | Prompt källa |
|------|----------|--------------|
| Livs-Arkivarien | ja | `sharedRules.ts` |
| Sannings-Analytikern | ja | shared |
| Gräns-Arkitekten | ja | shared |
| Brusfiltret | routing | shared |
| BIFF-Skölden | routing | shared |
| Paralys-Brytaren | synapse | shared |
| RSD-Kylaren | synapse | shared |
| Uppgifts-Krossaren | — | shared |
| Speglings-Coachen | ja | shared |
| Mönster-Arkivarien | ja | shared |

**Routing:** `kompis-supervisor.ts` → `routeFromDcap` — deterministisk.

---

## Säkerhet

| Krav | Status |
|------|--------|
| Inga LLM auth-beslut | **PASS** |
| Silo i RAG-lib | **PASS** |
| WORM retention allowlist | **PASS** — `retentionJob.ts:17-27` |
| Webhook fail-closed | **PASS** — `notifyNewFile` |
| Prompts ej utanför sharedRules | **PASS** |

---

## ADK / Synapser

| Synapse | Status |
|---------|--------|
| `driveIngestSynapse` | **PASS** — G6, G10 |
| `journalWovenSynapse` | **PASS** — G7 opt-in |
| `dcapAlertSynapse` | **PASS** — U2.5 HITL |
| `paralysBrytarenSynapse` | **PASS** |

---

## GCP-match

| Resurs | Status |
|--------|--------|
| Vector west1 | **PASS** — kod-defaults |
| Secrets GEMINI + NOTIFY | **PASS** |
| Legacy us-central1 | **0 fn** — G4 done |

---

## GAP

| GAP | Status |
|-----|--------|
| V1 Genkit | **WAIT** |
| `@cursor/sdk` | **WAIT** — Natt-CI |
| `@google-cloud/notebooks` | **DEPRECATE** — 0 imports |
| Economy vendor callable | Fas 2 — ej exporterad till UI |

---

## Smoke (backend)

| Script | Resultat (2026-05-22) |
|--------|----------------------|
| `smoke:kunskap` | PASS |
| `smoke:valv` | PASS |
| `smoke:dossier` | PASS |
| `smoke:grans` | PASS |
| `smoke:children` | (kör vid behov) |
| `functions npm run build` | PASS |

---

## Rekommenderat nästa steg

Efter frontend-commit: `cd functions && npm run build` + `firebase deploy --only functions` endast om nya callables tillkommit.

---

## Blocker

Ingen backend-blockerare för MVP.
