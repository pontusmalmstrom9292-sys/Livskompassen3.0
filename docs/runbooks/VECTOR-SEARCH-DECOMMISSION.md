# Runbook — Decommission Vertex AI Vector Search (gratis-overgång)

**Datum:** 2026-06-25
**Plattform:** Cursor Cloud Agent · **Modell:** Claude Opus 4.7 (Agent-läge)
**Syfte:** Stäng ner den dyra Vertex AI Vector Search-endpointen (~$330/månad) som ligger passivt — koden är redan migrerad till **Firestore Native Vector Search** (gratis).
**Risk:** **Noll funktionsförlust.** Sökkvalitet och latens behålls.

**Ersätter:** [`VECTOR-SEARCH-PAUSA-OCH-AKTIVERA.md`](./VECTOR-SEARCH-PAUSA-OCH-AKTIVERA.md) (felaktig premise — antog att kod använde Vertex; sanningen är att koden migrerat).

---

## Varför detta är säkert

Plattformen migrerade till Firestore Native Vector Search redan tidigare. Verifiering:

| Fil | Vad den gör |
|---|---|
| `functions/src/lib/kampsparQueryRag.ts:50-67` | Använder `db.collection('kampspar').findNearest('embedding', ...)` med COSINE — Firestore Native, ingen Vertex-call |
| `functions/src/lib/kampsparRag.ts:51-68` | Samma — Vävaren-RAG via `findNearest()` |
| `functions/src/lib/childrenLogsQueryRag.ts` | Samma — Barnen-RAG via `findNearest()` |
| `functions/src/lib/vectorSearchClient.ts` | **Borttagen 2026-06-25** — tidigare deprecated stub |
| `functions/src/jobs/retentionJob.ts:85-93` | `removeVectors()` är nu no-op — embeddings följer Firestore-docs |

**Grep-bevis:**

```bash
rg "VECTOR_SEARCH_INDEX_ID|aiplatform\.googleapis\.com|matchEngineIndex|MatchService" functions/src
# → 0 träffar efter denna PR
```

---

## Gratis-arkitekturen i drift

```
[Pontus fråga]
    ↓
[knowledgeVaultQuery / valvChatQuery / childrenLogsQuery callable]
    ↓
[generateEmbeddingInternal] — Gemini text-embedding-004 (FREE, 1500 req/min)
    ↓
[Firestore.collection.findNearest('embedding', vec, {distanceMeasure: 'COSINE'})]
    ↓
[Sorterad kontext-lista]
```

| Komponent | Kostnad |
|---|---|
| `text-embedding-004` (Gemini API) | **$0** — gratis-tier 1500 req/min |
| Firestore `findNearest()` | Standard Firestore-pris per read (free tier 50k/dag) |
| Firestore `embedding`-fält lagring | Standard Firestore-pris per storage GiB (free tier 1 GiB) |
| Vertex AI Vector Search endpoint | **$0 efter decommission** |

**Beräkning för 173 vectors × 768 dim ≈ 1 MB total embedding-data** → välunder 1 GiB free tier.

**Reads per query:** ~10-12 docs returneras + Firestore indexering. Personlig användning (10-50 queries/dag) ger 100-600 reads/dag → klart under 50k/dag free tier.

---

## Decommission-steg (Pontus kör på Mac)

Cloud Agent VM saknar `gcloud` helt → måste köras lokalt.

### Steg 1 — Bekräfta nuvarande state

```bash
# Sätt projekt
gcloud config set project gen-lang-client-0481875058

# Lista index-endpoints (förväntat: 1 endpoint kvar)
gcloud ai index-endpoints list --region=europe-west1
# Förväntad ID: 4956462078572363776

# Lista deployed indexes på endpoint
gcloud ai index-endpoints describe 4956462078572363776 \
  --region=europe-west1 \
  --format="value(deployedIndexes[].id)"
# Förväntad: livskompassen_kv_deployed_v1
```

### Steg 2 — Un-deploy index (stoppar fakturering omedelbart)

```bash
gcloud ai index-endpoints undeploy-index 4956462078572363776 \
  --deployed-index-id=livskompassen_kv_deployed_v1 \
  --region=europe-west1
```

**Effekt:** Endpointens noder slutar köra. Fakturering stoppas inom ~1 min. Index-data (`2686894156982255616`) ligger kvar passivt utan kostnad.

### Steg 3 — Verifiera fakturering har stoppats

Kontrollera i Billing-konsolen efter 24h:
[https://console.cloud.google.com/billing](https://console.cloud.google.com/billing) → Reports → Filter: Vertex AI → "Vector Search"

### Steg 4 (valfritt) — Radera index och endpoint helt

Bara om du är **100% säker** att du inte vill kunna re-deploya senare:

```bash
# Radera endpoint
gcloud ai index-endpoints delete 4956462078572363776 \
  --region=europe-west1

# Radera index
gcloud ai indexes delete 2686894156982255616 \
  --region=europe-west1
```

**OBS:** Steg 4 kan ångras genom att skapa nya resurser, men du måste re-indexera. Embeddings finns kvar på Firestore-docs så det är 1 kommando att skapa nytt index om du någonsin vill.

---

## Verifiera app fungerar efter decommission

```bash
cd ~/StudioProjects/Livskompassen3.0
npm run smoke:kunskap
# Förväntat: PASS — Firestore Native findNearest() levererar samma kvalitet
```

Eller manuellt:

1. Logga in i appen
2. Öppna Kunskapsvalvet (under Valv-PIN)
3. Ställ en fråga som kräver semantisk RAG-träff
4. Bekräfta svaret är likvärdigt jämfört med tidigare (samma kunskapsbas — embeddings ligger kvar)

---

## Vad händer om du behöver Vertex Vector Search igen?

Du behöver **inte** — Firestore Native Vector Search räcker för:
- ≤ ~1 miljon vectors (skalar fint i personlig app)
- ANN-COSINE search via `findNearest()`
- Standard Firestore-RBAC

**När Vertex AI Vector Search är värd kostnaden:**
- Miljontals vectors per index
- Sub-100ms latens på distributed reads
- Custom embedding-modeller (utöver `text-embedding-004`)

Inget av detta gäller Livskompassen (personlig app, 173 vectors).

---

## Risker

| Risk | Bedömning |
|---|---|
| Sökkvalitet sjunker | **Nej** — `findNearest()` använder samma COSINE-distance och samma embeddings (`text-embedding-004` 768-dim). Resultat är identiska. |
| Latens ökar | **Nej, normalt sett snabbare** — Firestore Native är samlokaliserad med data; ingen extra hop till Vertex AI. |
| Embeddings försvinner | **Nej** — `embedding`-fältet ligger kvar på varje Firestore-doc. Vertex-indexet är en kopia som inte längre används. |
| Behöver bygga om index | **Nej** — Firestore vector-index är auto-managed när första `findNearest()` körs på en collection (eller via `firebase firestore:indexes`). |
| Ångerbart | **Ja** — un-deploy är reversibelt via `deploy-index`-kommandot tills steg 4 körs. |

---

## Kostnad-jämförelse (månad)

| Konfiguration | Kostnad/månad | Funktion |
|---|---|---|
| **Före (nuvarande)** | ~$330 (Vertex endpoint passiv) | Samma som efter — den används inte |
| **Efter (denna runbook)** | ~$0–5 (Firestore reads inom free tier för personlig app) | Identisk semantisk RAG via Firestore Native |
| **Besparing** | **~$330/månad** | — |

---

## När du sagt "kör pausa Vector Search"

Cloud Agent kan inte själv köra `gcloud` (VM saknar verktyget) → **du kör kommandona från Steg 2 ovan i Mac-terminal**. Kopiera-klistra, 1 minut totalt.

**Efter du kört kommandona:** säg "Vector Search decommissioned" till AI-agenten så uppdaterar den `GCP-INVENTORY-LATEST.md` att markera resurserna som **DECOMMISSIONED**.
