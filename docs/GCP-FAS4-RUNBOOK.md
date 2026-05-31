# GCP FAS 4 — ops-runbook (kräver OK per steg)

**Datum:** 2026-05-22  
**Beslut:** [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md)  
**Projekt:** `gen-lang-client-0481875058`

**Regel:** Kör **ett steg i taget**. Smoke efter varje. **Ingen radering** utan `OK steg N`.

---

## Baseline smoke (före avveckling)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run smoke:valv
npm run smoke:kunskap
npm run smoke:dossier
```

---

## Steg 1 — Avveckla BIFF/Brus Python (låg risk) — **done** 2026-05-22

**Ersatt av:** `analyzeMessage` (Node, europe-west1)

**Utfört:** `biff_generator_tool` + `brusfiltret_tool` raderade. `smoke:valv` **PASS**.

---

## Steg 2 — G6 Drive E2E — **done** 2026-05-22

**Rotorsaker (fixade i kod + deploy):**
1. Google Docs (`application/vnd.google-apps.*`) — `files.export` istället för `alt=media` (403).
2. `notifyNewFile` avbröt pipeline före `await emitSynapse` — synkront flöde nu.
3. `gemini-1.5-pro` 404 i west1 — `gemini-2.5-flash` i `documentAgent.ts`.

**Runtime SA (Viewer på Kunskapsvalvet):** `gen-lang-client-0481875058@appspot.gserviceaccount.com` — redan delad korrekt.

**Bevis:** `kb_docs docId=irQNlDTYgcr15DFIuA3w created=true` · `smoke:kunskap` PASS

---

## Steg 3 — Avveckla drive_sync_tool — **done** 2026-05-22

**Förutsättning:** G6 PASS — undvik dubbel Drive-ingest.

**Utfört:**
```bash
firebase functions:delete drive_sync_tool --project gen-lang-client-0481875058 --force
npm run smoke:kunskap  # PASS
```

---

## Steg 4 — Migrera legacy KB — **done** 2026-05-22

**Scope:** Endast Kunskap-silo (`kb_docs`, `kampspar`). **MUST NOT** `reality_vault`. **Ingen bucket-radering.**

**Inventering:** Discovery Engine **0** data stores; GCS legacy **0** användardokument; Firestore `kb_docs` **1** (redan G6/kanonisk).

**Utfört:**
1. Live inventering — se [`LEGACY-KB-MIGRATION-2026-05-22.md`](LEGACY-KB-MIGRATION-2026-05-22.md)
2. Manifest [`specs/modules/LEGACY-KB-MIGRATION-MANIFEST.json`](specs/modules/LEGACY-KB-MIGRATION-MANIFEST.json) (tom `entries`)
3. `node scripts/migrate_legacy_kb.mjs --inventory-only`
4. `npm run smoke:kunskap` — **PASS**

---

## Steg 5 — Avveckla knowledge-base-webhook — **done** 2026-05-22

**Utfört:**
```bash
firebase functions:delete knowledge-base-webhook --project gen-lang-client-0481875058 --force
npm run smoke:kunskap && npm run smoke:dossier  # PASS
```

**Ej i detta steg:** bucket-radering (`knowledge-base-bucket-*`) — kräver separat OK.

---

## Steg 6 — north1-index + tomma buckets + django-secrets — **done** 2026-05-22

**Verifiering före radering:**
- `kampspar_index` north1 — ID `9094201410823651328`, 0 endpoints
- `gs://ekonomichefen`, `gs://helthcoach`, `gs://media-gen-lang-client-0481875058-0ebe` — **0 B** vardera
- `django_admin_password-0ebe`, `django_settings-0ebe` — legacy, inga aktiva fn

**Utfört:**
```bash
gcloud ai indexes delete 9094201410823651328 --region=europe-north1 --project=gen-lang-client-0481875058 --quiet
gcloud storage rm -r gs://ekonomichefen gs://helthcoach gs://media-gen-lang-client-0481875058-0ebe
gcloud secrets delete django_admin_password-0ebe django_settings-0ebe --project=gen-lang-client-0481875058 --quiet
npm run smoke:valv && npm run smoke:kunskap && npm run smoke:dossier  # PASS
```

**Ej i detta steg:** VERIFY-buckets (`ai-studio`, `cloud-ai-platform`) — kräver `OK steg 7`.

---

## Steg 7 — VERIFY stora buckets — **done** 2026-05-22

| Bucket | Innehåll | Beslut |
|--------|----------|--------|
| `ai-studio-bucket-1084026575972-europe-west2` | 1 objekt — `build_artifacts.tar.gz` (121 MB), AI Studio `livskompassen` v1 | **raderad** — legacy experiment, ej i repo |
| `cloud-ai-platform-365ee315-6b86-4041-b623-5121d5135266` | 58 objekt — Vertex `prompt-data/` (69 MB), apr–maj 2026 | **raderad** — prompt-cache, kanon = `sharedRules.ts` |

**Utfört:**
```bash
gcloud storage rm -r gs://ai-studio-bucket-1084026575972-europe-west2 gs://cloud-ai-platform-365ee315-6b86-4041-b623-5121d5135266
npm run smoke:valv && npm run smoke:kunskap && npm run smoke:dossier  # PASS
```

**FAS 4 avveckling:** steg 1–7 **klart**.

---

## Efter varje steg

Uppdatera [`GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md) och [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md).

**Trigger:** `OK steg N` → agent kör ovan.
