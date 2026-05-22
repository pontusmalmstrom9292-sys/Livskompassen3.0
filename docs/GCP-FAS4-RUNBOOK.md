# GCP FAS 4 — ops-runbook (kräver OK per steg)

**Datum:** 2026-05-22  
**Beslut:** [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md)  
**Projekt:** `gen-lang-client-0481875058`

**Regel:** Kör **ett steg i taget**. Smoke efter varje. **Ingen radering** utan `OK steg N`.

---

## Baseline smoke (före avveckling)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen2.0
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

## Steg 4 — Migrera legacy KB

**Scope:** Endast Kunskap-silo (`kb_docs`, `kampspar`). **MUST NOT** `reality_vault`.

Legacy buckets är ~10 KB i GCS — huvuddatan kan sitta i Vertex AI Search webhook-index.

1. Inventera `knowledge-base-webhook` loggar / datastore.
2. Exportera dokument → manuell eller batch `ingestKampsparEntry`.
3. `npm run smoke:kunskap` — citation match.

---

## Steg 5 — Avveckla knowledge-base-webhook + legacy buckets

```bash
firebase functions:delete knowledge-base-webhook --project gen-lang-client-0481875058 --force
# Buckets (efter backup/export):
# gcloud storage rm -r gs://knowledge-base-bucket-gen-lang-client-0481875058/**
# gcloud storage rm -r gs://knowledge-base-docs-gen-lang-client-0481875058/**
npm run smoke:kunskap && npm run smoke:dossier
```

---

## Steg 6 — north1-index + tomma buckets + django-secrets

```bash
# north1 index (0 endpoints, 0 vectors):
gcloud ai indexes delete 9094201410823651328 --region=europe-north1 --project=gen-lang-client-0481875058

# Tomma buckets (verifiera du -s 0 först):
# gs://ekonomichefen, gs://helthcoach, gs://media-gen-lang-client-0481875058-0ebe

# Legacy django secrets:
# gcloud secrets delete django_admin_password-0ebe --project=gen-lang-client-0481875058
# gcloud secrets delete django_settings-0ebe --project=gen-lang-client-0481875058
```

---

## Steg 7 — VERIFY stora buckets

| Bucket | Storlek | Åtgärd |
|--------|---------|--------|
| `ai-studio-bucket-*` | ~121 MB | Lista objekt; radera om experiment |
| `cloud-ai-platform-*` | ~69 MB | Lista objekt; radera om oanvänt |

```bash
gcloud storage ls -l gs://ai-studio-bucket-1084026575972-europe-west2/** | head -20
gcloud storage ls -l gs://cloud-ai-platform-365ee315-6b86-4041-b623-5121d5135266/** | head -20
```

---

## Efter varje steg

Uppdatera [`GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md) och [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md).

**Trigger:** `OK steg N` → agent kör ovan.
