# Google AI Pro — GCP-kredit & billing (Steg E)

**Datum:** 2026-05-29  
**Projekt:** `gen-lang-client-0481875058`  
**Metod:** `gcloud billing projects describe`, `gcloud billing accounts list`

---

## Checklista E1

| Punkt | Resultat |
|-------|----------|
| GCP-projekt aktivt | **Ja** — `gcloud config get-value project` → `gen-lang-client-0481875058` |
| Billing kopplat | **Ja** — `billingAccounts/012C55-D92F23-0A2FD7` ("My Billing Account", open) |
| Google AI Pro ~$10/mån Cloud-kredit | **Ej verifierat i CLI** — kontrollera manuellt: [one.google.com/settings](https://one.google.com/settings) → Google AI Pro → förmåner |
| Vertex-kostnad senaste 30d | **Ej hämtat** — öppna [Cloud Console Billing](https://console.cloud.google.com/billing) → Cost breakdown → filter Vertex AI |

---

## Distinktion (viktig)

| Källa | Användning |
|-------|------------|
| **Google AI Pro** (Google One) | NotebookLM, Gemini-app, AI Studio — byggare |
| **GCP billing** (`012C55-…`) | Prod callables: `journalQuickMirror`, RAG, embeddings |

Pro-abonnemanget **ersätter inte** GCP-fakturering för deployade functions.

---

## ADC på Mac (dev)

```bash
gcloud auth login
gcloud auth application-default login
gcloud config set project gen-lang-client-0481875058
```

Se även [`docs/WORKFLOW_AND_AI_CREDITS.md`](../WORKFLOW_AND_AI_CREDITS.md).

---

## Nästa steg (valfritt)

- I Cloud Console: sätt **budget alert** på Vertex AI (t.ex. 500 SEK/mån)
- Jämför modellkostnad: `gemini-2.5-flash` (nu för Snabb/Speglar) vs `gemini-1.5-pro` (legacy weaver)
