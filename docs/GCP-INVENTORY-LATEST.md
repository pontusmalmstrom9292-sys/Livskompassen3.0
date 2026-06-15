# GCP / Firebase-inventering — LIVE (senast)

**Datum:** 2026-06-15 (refresh efter backend Våg 2) · tidigare 2026-06-11  
**Projekt:** `gen-lang-client-0481875058` (number `1084026575972`)  
**Metod:** `firebase functions:list`, `gcloud ai indexes list`, `gcloud ai index-endpoints describe`  
**Beslut:** [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md)  
**Ersätter för beslut:** [`docs/archive/GCP-INVENTORY-2026-05-21.md`](archive/GCP-INVENTORY-2026-05-21.md)  
**Backend Våg 2:** [`evaluations/2026-06-15-backend-vag2-hardening.md`](evaluations/2026-06-15-backend-vag2-hardening.md)

---

## Sammanfattning

| Fynd | Status | Gap |
|------|--------|-----|
| `valvChatQuery` deployad (west1) | **done** | G1 |
| Vector endpoint + `livskompassen_kv_deployed_v1` | **done** | G2 **VERIFY PASS** |
| Index west1, **173 vectors** | **done** | G3 **VERIFY PASS** (sync 2026-05-31) |
| `NOTIFY_WEBHOOK_SECRET` | **finns** | G6 **done** — E2E kb_docs 2026-05-22 |
| Vävaren HITL callables | **deployade** | `approveWeaverMetadata`, `rejectWeaverMetadata` |
| Legacy Python (0 fn kvar) | **avvecklad** | G4 **done** — steg 1–5 2026-05-22 |
| Compute Engine VMs | **0** | — |
| `@cursor/sdk` | **saknas** | **WAIT** (Natt-CI) |
| `issueVaultSession` | **deployad** | Valv server-session + WebAuthn (P1) |
| `beginVaultWebAuthnChallenge` | **deployad** | WebAuthn challenge före Valv-session |
| `createBarnportenPairing` / `claimBarnportenPairing` | **deployad** | Barnporten QR |
| `user_widgets` rules | **deployad** | WH1–WH4 widget-sparning |
| Callable guards Våg 2 | **kod klar** | `getAgentRegistry`, Barnporten pairings, `generatePayslip`, `analyzeProjectImage` — se backend-vag2 eval |
| `user_overwhelm` emitter | **kod klar** | `breakDownResponse` → `emitSynapse` |

---

## Deployade Cloud Functions

**Totalt:** 49 functions live (`firebase functions:list` 2026-06-15) · **44 v2** + **5 v1** · **europe-west1** · Node.js 20  
**Källa:** `functions/src/index.ts` (exporter) · verifiera live: `firebase functions:list`

### v1 kvar (5)

| Function | Trigger | Roll |
|----------|---------|------|
| `ingestKampsparEntry` | callable | Kunskap ingest |
| `ingestKnowledgeDocument` | callable | Kunskap ingest |
| `notifyNewFile` | HTTPS webhook | Drive → synapse |
| `scheduledGeneratePayslip` | scheduled | Arbetsliv cron |
| `scheduledRetentionJob` | scheduled | GDPR retention |

### Callable / HTTP (v2 — urval; full lista live)

| Function | Version | Silo / roll |
|----------|---------|-------------|
| `addEntityProfile` | v2 | G9 entiteter |
| `analyzeMessage` | v2 | BIFF / Hamn |
| `approveWeaverMetadata` | v2 | Vävaren HITL |
| `childrenLogsQuery` | v2 | Barnen RAG |
| `confirmInboxItem` | v2 | G10 inkorg |
| `dismissInboxItem` | v2 | G10 inkorg |
| `generateWeeklyInsights` | v2 | Veckoinsikter (vault-gated) |
| `generateWeeklySummary` | v2 | Veckosammanfattning |
| `parseVoiceCommand` | v2 | Inkast röst |
| `unlockVault` | v2 | JWT vault claims |
| `analyzeProjectImage` | v2 | Projekt OCR |
| `breakDownResponse` | v2 | Paralys → `user_overwhelm` synapse |
| `calculateSmartAllocation` | v2 | Ekonomi |
| `chatWithKompis` | v2 | Kompis |
| `generateCompassInsight` | v2 | Morgonkompass |
| `issueVaultSessionViaBiometric` | v2 | Native biometric session |
| `mabraEconomySync` | v2 | Firestore trigger |
| `onVaultCreatePatternScan` | v2 | Firestore trigger |
| `rescanPatternMetadata` | v2 | Mönster |
| `writePatternScanMetadataCallable` | v2 | Mönster metadata |
| `generateDossier` | v2 | Dossier export |
| `generateEmbedding` | v2 | Vector |
| `generatePayslip` | v2 | Arbetsliv |
| `getAgentRegistry` | v2 | A2A |
| `getContextCacheStatus` | v2 | G12 cache |
| `getEntityProfileRegistry` | v2 | G9 entiteter |
| `getInboxQueue` | v2 | G10 inkorg |
| `ingestWidgetRecording` | v2 | WH1 → valv |
| `invalidateSession` | v2 | Zero Footprint |
| `beginVaultWebAuthnChallenge` | v2 | WebAuthn challenge (Valv) |
| `createBarnportenPairing` | v2 | Barnporten QR skapa |
| `claimBarnportenPairing` | v2 | Barnporten QR claim |
| `issueVaultSession` | v2 | Valv server-session gate (WebAuthn) |
| `journalQuickMirror` | v2 | Dagbok snabb |
| `journalWovenToKampspar` | v2 | G7 opt-in |
| `knowledgeVaultQuery` | v2 | Kunskap RAG |
| `mabraCoach` | v2 | MåBra |
| `previewInboxClassification` | v2 | G10 inkorg |
| `rejectWeaverMetadata` | v2 | Vävaren HITL |
| `speglingsMirror` | v2 | Speglar |
| `submitInkastLite` | v2 | Inkast |

*Övriga v1 (ej i tabell ovan): `ingestKampsparEntry`, `ingestKnowledgeDocument`, `notifyNewFile`, `scheduledGeneratePayslip`, `scheduledRetentionJob` — se §v1 kvar.*

Full lista live: `firebase functions:list --project gen-lang-client-0481875058`

### Python legacy — **DEPRECATED G4 (avvecklad steg 5)**

| Function | Region | Status |
|----------|--------|--------|
| ~~`knowledge-base-webhook`~~ | us-central1 | **raderad** steg 5 2026-05-22 |
| ~~`drive_sync_tool`~~ | us-central1 | **raderad** steg 3 |
| ~~`biff_generator_tool`~~ | us-central1 | **raderad** steg 1 |
| ~~`brusfiltret_tool`~~ | us-central1 | **raderad** steg 1 |

**Ersatt av:** Node stack (europe-west1). **Smoke steg 5:** `smoke:kunskap` + `smoke:dossier` **PASS** 2026-05-22.

---

## Vertex AI Vector Search

### west1 — **KEEP (kanonisk)**

| Resurs | ID / namn | Status |
|--------|-----------|--------|
| Index | `2686894156982255616` (`livskompassen-kv-index`, STREAM, 768 dim) | aktiv |
| Endpoint | `4956462078572363776` (`livskompassen-kv-endpoint`) | aktiv |
| Deployed index | `livskompassen_kv_deployed_v1` | synkad 2026-05-31T00:19:07Z |
| Vectors count | **173** | live (2026-05-31) |

### north1 — **avvecklad steg 6**

| Resurs | ID | Status |
|--------|-----|--------|
| ~~Index~~ | ~~`9094201410823651328`~~ (`kampspar_index`) | **raderad** 2026-05-22 |
| Endpoints | — | 0 (oförändrat) |

**Repo defaults:** [`functions/src/lib/vectorSearchClient.ts`](../functions/src/lib/vectorSearchClient.ts)

---

## Cloud Storage (10 buckets efter legacy-städ 2026-05-22)

| Bucket | Storlek (ca) | Beslut |
|--------|--------------|--------|
| `gen-lang-client-0481875058.firebasestorage.app` | 13 KB | **KEEP** |
| `livskompassen-knowledge-vault-embeddings` | 0 | **KEEP** |
| `livskompassen-knowledge-vault-worm` | 0 | **KEEP** |
| `livskompassenv2` | 0 | **KEEP** (CMEK) |
| `gcf-v2-*` europe-west1 | system | **KEEP** |
| `gen-lang-client-0481875058` | 20 KB | **KEEP** |
| `gen-lang-client-0481875058_cloudbuild` | — | **KEEP** (system) |

Legacy buckets raderade steg 6–7 (2026-05-22) — se arkiv [`GCP-INVENTORY-2026-05-21.md`](archive/GCP-INVENTORY-2026-05-21.md).

---

## Compute Engine

**0 instances** — inga VMs att stänga.

---

## Secret Manager (namn endast)

| Secret | Status | Beslut |
|--------|--------|--------|
| `GEMINI_API_KEY` | finns | **KEEP** |
| `NOTIFY_WEBHOOK_SECRET` | finns | **KEEP** |

---

## SDK / npm (repo)

| Paket | Beslut |
|-------|--------|
| `@cursor/sdk` | **WAIT** — Natt-CI, ej installerad |
| `@dataconnect/generated` | **WAIT** |
| `@google-cloud/notebooks` | **DEPRECATE** (0 imports) |

---

## GAP-status

| ID | Status |
|----|--------|
| G1–G3 | **done** |
| G4 | **done** | All legacy Python borta (steg 1–5) |
| G5 | **done** |
| G6 | **done** | E2E kb_docs PASS 2026-05-22 |
| G7 | **done** | `journal_woven` opt-in 2026-05-22 |
| G8 | **done** | `childrenLogsQuery` Familjen-RAG 2026-05-22 |
| G9 | **done** | EntityProfile / SystemSynapse (2026-05-22) |
| G10 | **done** | Självsorterande inkorg (2026-05-22) |
| G11 | **done** | Mock Kampspar UI-only (2026-05-22) |
| G12 | **done** | Context Cache registry (2026-05-22) |
| G13 | **done** | Tidshjulet → kampspar (2026-05-22) |
| G14 | **done** | Gräns-Arkitekten (2026-05-22) |
| G15 | **done** | Injection-parity i `.context/security.md` 2026-05-22 |
| G16 | **done** | RSD-prompt + PA appendix + U5.5 barn routing **done** 2026-05-22 |
| V1 Genkit | **wait** |

Ny backlog utanför G-serien: [`MODUL-GAP-OVERSIKT.md`](MODUL-GAP-OVERSIKT.md)

---

## Nästa steg (underhåll)

1. **Periodisk refresh** — kör kommandon nedan efter större deploy
2. **Manuell smoke i app** — [`SMOKE_RESULTS.md`](SMOKE_RESULTS.md) **Current truth**
3. **`@cursor/sdk`:** **WAIT** — [`docs/NATT-CI.md`](NATT-CI.md)

---

## Uppdateringskommando

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase functions:list --project gen-lang-client-0481875058
gcloud ai indexes list --region=europe-west1 --project=gen-lang-client-0481875058
gcloud ai index-endpoints describe 4956462078572363776 --region=europe-west1 --project=gen-lang-client-0481875058
gcloud storage ls --project=gen-lang-client-0481875058
gcloud compute instances list --project=gen-lang-client-0481875058
gcloud secrets list --project=gen-lang-client-0481875058
```
