# GCP-konsolidering — beslut (KEEP / MIGRATE / DEPRECATE / WAIT)

**Datum:** 2026-05-22 (live audit U6)  
**Projekt:** `gen-lang-client-0481875058` (number `1084026575972`)  
**Metod:** `firebase functions:list`, `gcloud ai indexes/endpoints`, `gcloud storage du`, `gcloud compute instances list`, `gcloud secrets list`  
**Kanonisk stack:** Node Functions **europe-west1** + Firestore WORM + Vector Search **west1** + [`functions/src/lib/vectorSearchClient.ts`](../functions/src/lib/vectorSearchClient.ts)

**Regel:** Ingen prod-radering utan explicit `OK steg N` från användaren. WORM-collections och Sacred Features orörda.

---

## Sammanfattning

| Kategori | Antal | Åtgärd |
|----------|-------|--------|
| **KEEP** | Node 14 fn, Vector west1, kärnbuckets | Behåll — prod |
| **MIGRATE → DEPRECATE** | Legacy KB stack (Python G4) | Migrera ev. dokument → `kb_docs`/`kampspar`, stäng sedan |
| **DEPRECATE** | north1-index (0 vektorer), tomma agent-buckets, django-secrets | Efter verifiering |
| **VERIFY** | ~~ai-studio (~121 MB), cloud-ai-platform (~69 MB)~~ | **raderade** steg 7 2026-05-22 |
| **WAIT** | `@cursor/sdk`, Data Connect | Ej implementera nu |

**Compute Engine VMs:** **0** — inga idle VMs.

**Legacy KB buckets:** Nästan tomma (`knowledge-base-*` ~10 KB totalt). Huvuddatan sitter troligen i Vertex AI Search / webhook-index, inte GCS.

---

## KEEP (kanonisk Livskompassen)

| Resurs | Region | Bevis / storlek |
|--------|--------|-----------------|
| Node Functions (14 st) | europe-west1 | `firebase functions:list` — matchar repo |
| `knowledgeVaultQuery`, `valvChatQuery` | west1 v2 | G1–G3 **done** |
| Vector index `livskompassen-kv-index` | west1 | ID `2686894156982255616`, **102 vectors** |
| Endpoint `livskompassen-kv-endpoint` | west1 | `livskompassen_kv_deployed_v1`, synkad 2026-05-22 |
| Firestore + Auth + Hosting | — | Aktiv app |
| `GEMINI_API_KEY`, `NOTIFY_WEBHOOK_SECRET` | Secret Manager | Finns |
| `gen-lang-client-0481875058.firebasestorage.app` | us-east1 | ~13 KB — valv-media |
| `livskompassen-knowledge-vault-embeddings` | north1 | 0 B — reserverad |
| `livskompassen-knowledge-vault-worm` | north1 | 0 B — reserverad |
| `livskompassenv2` | EU | 0 B — CMEK bucket |
| `gcf-v2-*` europe-west1 | west1 | System — Cloud Functions Gen2 |
| `gcf-sources-*` europe-west1 | west1 | System |

---

## MIGRATE → DEPRECATE (legacy Knowledge Base + Python G4)

| Resurs | Region | Storlek | Node-motsvarighet | Avvecklingssteg |
|--------|--------|---------|-------------------|-----------------|
| `knowledge-base-webhook` | us-central1 | 3.8 GB RAM fn | `notifyNewFile` → `driveIngestSynapse` → `kb_docs` | **raderad** steg 5 |
| ~~`drive_sync_tool`~~ | us-central1 | — | `notifyNewFile` (Node) | **raderad** steg 3 |
| ~~`biff_generator_tool`~~ | us-central1 | — | `analyzeMessage` (BIFF-Skölden) | **raderad** steg 1 |
| ~~`brusfiltret_tool`~~ | us-central1 | — | `analyzeMessage` (Brusfiltret) | **raderad** steg 1 |
| `knowledge-base-bucket-*` | us-central1 | ~10 KB | Firestore `kb_docs` + Vector west1 | **raderad** legacy pass 2026-05-22 |
| `knowledge-base-docs-*` | us-central1 | 0 B | — | **raderad** legacy pass |
| `gcf-v2-*` us-central1 | us-central1 | ~9 KB | — | **raderad** legacy pass |
| `1084026575972-us-central1-blueprint-config` | us-central1 | ~4 MB | Google Solution blueprint | **raderad** legacy pass |

**Migreringsregel:** Endast till **Kunskap-silo** (`kb_docs`, `kampspar`). **MUST NOT** skriva till `reality_vault`.

---

## DEPRECATE (efter verifiering)

| Resurs | Region | Bevis | Villkor |
|--------|--------|-------|---------|
| `kampspar_index` | europe-north1 | BATCH, **0 endpoints** | **raderad** steg 6 2026-05-22 |
| ~~`ekonomichefen`~~ | — | 0 B | **raderad** steg 6 |
| ~~`helthcoach`~~ | — | 0 B | **raderad** steg 6 |
| ~~`media-gen-lang-client-0481875058-0ebe`~~ | — | 0 B | **raderad** steg 6 |
| ~~`django_admin_password-0ebe`, `django_settings-0ebe`~~ | us-central1 secrets | Gammal django-deploy | **raderade** steg 6 |

---

## VERIFY (avvecklad steg 7)

| Resurs | Innehåll | Status |
|--------|----------|--------|
| ~~`ai-studio-bucket-1084026575972-europe-west2`~~ | AI Studio `build_artifacts.tar.gz` (121 MB) | **raderad** 2026-05-22 |
| ~~`cloud-ai-platform-365ee315-6b86-4041-b623-5121d5135266`~~ | Vertex `prompt-data/` 58 objekt (69 MB) | **raderad** 2026-05-22 |
| `adc-158a9856-7ab2-4504-afd7-7872260e16db` | ej mätt | ADC-relaterad — låg prioritet |

---

## WAIT

| Resurs | Beslut |
|--------|--------|
| `@cursor/sdk` Natt-CI | **WAIT** — dokumentera, implementera inte |
| Firebase Data Connect | **WAIT** — example schema only |
| Genkit / Dotprompt (V1) | **WAIT** — kanon = `sharedRules.ts` |

---

## Avvecklingsordning (FAS 4 — kräver OK per steg)

| Steg | Åtgärd | Smoke efter |
|------|--------|-------------|
| 1 | ~~Avveckla `biff_generator_tool` + `brusfiltret_tool`~~ | **done** — `smoke:valv` PASS 2026-05-22 |
| 2 | **G6** Drive E2E | **done** 2026-05-22 — kb_docs + smoke:kunskap PASS |
| 3 | Avveckla `drive_sync_tool` | **done** 2026-05-22 — `smoke:kunskap` PASS |
| 4 | Migrera legacy KB → `kb_docs`/`kampspar` | **done** 2026-05-22 — 0 poster; inventering + smoke PASS |
| 5 | ~~Avveckla `knowledge-base-webhook`~~ | **done** 2026-05-22 — `smoke:kunskap` + `smoke:dossier` PASS (buckets orörda) |
| 6 | ~~Ta bort north1-index, tomma buckets, django-secrets~~ | **done** 2026-05-22 — smoke valv/kunskap/dossier PASS |
| 7 | ~~VERIFY buckets (ai-studio, cloud-ai-platform) — radera om oanvända~~ | **done** 2026-05-22 — smoke ×3 PASS |

**Trigger:** `OK steg N` → agent kör dokumenterat kommando.

---

## STOPP 4 — FAS 4 klart

**Steg 1–7 klart** (2026-05-22). Legacy KB-buckets **raderade** (parallell pass). Nästa arkiv-GAP: **G8** Familjen-RAG.
