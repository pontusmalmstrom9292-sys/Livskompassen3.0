# Vertex AI Vector Search — DECOMMISSIONED

Date: 2026-07-18
Pontus OK: explicit — "vi skulle ju ta bort alla kostnader"

## Actions

1. Undeployed `livskompassen_kv_deployed_v1` from endpoint `4956462078572363776` (europe-west1) — **billing stop**
2. Deleted index endpoints: west1 `4956…` + us-central1 `2579…`
3. Deleted indexes: west1 `2686…` + us-central1 `5844…`
4. Disabled `aiplatform.googleapis.com` on project `gen-lang-client-0481875058`

## App impact

**None.** RAG uses Firestore Native `findNearest()` only.

## Verify

```bash
gcloud asset search-all-resources --scope=projects/gen-lang-client-0481875058 \
  --asset-types='aiplatform.googleapis.com/IndexEndpoint,aiplatform.googleapis.com/Index'
# → empty
```

Savings: ~$330/month (Vector Search replicas).

## Lock-in (same day follow-up)

- `aiplatform` → `blockedApis` (removed from allowlist)
- Setup scripts → LOCKED stubs (exit 1)
- `smoke:cost-guard` asserts stubs + no vectorSearchClient + RAG findNearest
- `ingestKampsparEntry` now has `secrets: [geminiApiKey]`
- `firestore.indexes.json` vector fieldOverrides for kampspar/kb_docs (768)
- `kampsparQueryRag` token-fallback if ANN empty/fail
- `scripts/ai/pyproject.toml` — no aiplatform/vertexai deps
- `gcp:audit-apis` PASS — aiplatform not enabled

