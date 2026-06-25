# Runbook — Pausa & återstarta Vector Search ANN-endpoint

**Syfte:** Spara ~$300/månad genom att un-deploya ANN-indexet när Kunskapsvalvet inte används aktivt. Återaktivera på 5 minuter när du vill söka i kunskap.

**Status (kanon):** [`docs/GCP-INVENTORY-LATEST.md`](../GCP-INVENTORY-LATEST.md)
**Risk:** Pausad endpoint → `knowledgeVaultQuery` faller tillbaka till **token-match** (se `kampsparQueryRag.ts`). Inga datafel. Bara sämre retrieval-kvalitet på kunskapsfrågor tills du återaktiverar.

---

## När pausa?

- Du använder inte Kunskapsvalvet aktivt **och** vill minimera GCP-utgifter.
- Du planerar pause på minst en vecka (annars är pausen inte värd besväret).

**OBS:** Valv (`reality_vault`), Barnen (`children_logs`), Dagbok (`journal`) och Dossier **påverkas inte**. Bara Kunskap-RAG.

---

## Pausa (un-deploy index från endpoint)

På din **Mac** (Cloud Agent kan inte köra detta — saknar gcloud-credentials):

```bash
# 1. Bekräfta du har rätt projekt
gcloud config get-value project
# ska visa: gen-lang-client-0481875058 (eller motsvarande)

# 2. Lista deployed indexes på endpointen
gcloud ai index-endpoints describe 4956462078572363776 \
  --region=europe-west1 \
  --project=gen-lang-client-0481875058 \
  --format="value(deployedIndexes[].id)"
# Förväntat output: livskompassen_kv_deployed_v1

# 3. Un-deploy (= pausa fakturering på endpoint-noden)
gcloud ai index-endpoints undeploy-index 4956462078572363776 \
  --deployed-index-id=livskompassen_kv_deployed_v1 \
  --region=europe-west1 \
  --project=gen-lang-client-0481875058

# 4. Verifiera
gcloud ai index-endpoints describe 4956462078572363776 \
  --region=europe-west1 \
  --project=gen-lang-client-0481875058 \
  --format="value(deployedIndexes)"
# Förväntat output: tomt
```

**Viktigt:** Indexet (`2686894156982255616`) ligger kvar — bara endpointens deployed-noder pausas. Embeddings förblir intakta.

---

## Återaktivera (re-deploy)

Tar ca 30–60 minuter (Vertex bygger nya noder).

```bash
gcloud ai index-endpoints deploy-index 4956462078572363776 \
  --deployed-index-id=livskompassen_kv_deployed_v1 \
  --display-name=livskompassen_kv_deployed_v1 \
  --index=2686894156982255616 \
  --region=europe-west1 \
  --project=gen-lang-client-0481875058 \
  --machine-type=e2-standard-2 \
  --min-replica-count=1 \
  --max-replica-count=1
```

**Verifiera efter deploy:**

```bash
cd ~/StudioProjects/Livskompassen3.0
npm run smoke:kunskap
# förväntat: PASS
```

---

## Verifiera kostnad

```bash
# Kontrollera nuvarande månadskostnad för Vertex AI
gcloud billing accounts list
gcloud billing projects describe gen-lang-client-0481875058
```

Eller i Console: [Billing → Reports → Filter: Vertex AI](https://console.cloud.google.com/billing).

---

## Vad händer i appen om endpoint är pausad?

- `knowledgeVaultQuery`-callable returnerar fortfarande svar (graceful fallback).
- `kampsparQueryRag.ts` använder **token-match-fallback** (lexikal matching mot `kampspar`).
- Träffrelevans blir sämre på semantiska frågor men appen kraschar inte.

**Rekommendation:** Pausa under perioder du inte söker mycket i Kunskap. Aktivera när du vill köra Vävaren-dossier eller söka i FACT-bank.

---

## När du sagt "kör pausa" till AI-agent

Cloud Agent kan **inte** själv köra dessa kommandon (saknar gcloud-auth på VM). Detta måste **du köra på Mac**. Du kan dock köra denna runbook i en lokal Cursor-chat med:

```
@android-kompis kör pausa Vector Search enligt docs/runbooks/VECTOR-SEARCH-PAUSA-OCH-AKTIVERA.md
```

(Eller manuellt — kommandona ovan är copy-paste-klara.)
