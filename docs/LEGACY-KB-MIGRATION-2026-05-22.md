# Legacy KB — migrering FAS4 steg 4

**Datum:** 2026-05-22  
**Projekt:** `gen-lang-client-0481875058`  
**Scope:** Endast Kunskap-silo (`kb_docs`, `kampspar`). **MUST NOT** `reality_vault`.  
**Buckets:** Ej raderade (steg 5).

---

## Inventering

| Källa | Resultat |
|-------|----------|
| Discovery Engine `dataStores` (global) | **0** data stores |
| `gs://knowledge-base-bucket-*` | `initial-index.json` (placeholder, null id, zero embedding) + `webhook-staging/.../g=.zip` (Python **funktionskällkod**, ej användardata) |
| `gs://knowledge-base-docs-*` | **Tom** |
| Firestore `kb_docs` | **1** post — redan kanonisk (`irQNlDTYgcr15DFIuA3w`, `source: drive`, G6) |
| `knowledge-base-webhook` loggar | Inga indexerade användardokument hittade |

**Slutsats:** Det finns **inga legacy KB-dokument** att batch-migrera. Kanonisk Kunskap-stack (`notifyNewFile` → `kb_docs` + `ingestKampsparEntry` → `kampspar` + Vector west1) är redan sanning.

---

## Utfört

1. Live GCP-inventering (GCS + Discovery Engine + Firestore).
2. Manifest [`docs/specs/modules/LEGACY-KB-MIGRATION-MANIFEST.json`](specs/modules/LEGACY-KB-MIGRATION-MANIFEST.json) — tom lista + metadata.
3. Script [`scripts/migrate_legacy_kb.mjs`](../scripts/migrate_legacy_kb.mjs) — för framtida export (om data dyker upp).
4. `npm run smoke:kunskap` — **PASS** (se [`SMOKE_RESULTS.md`](SMOKE_RESULTS.md)).

---

## Nästa

**`OK steg 5`** — avveckla `knowledge-base-webhook` (ingen bucket-radering utan explicit OK i steg 5-runbook).
