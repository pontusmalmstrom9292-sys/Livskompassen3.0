# GCP Billing audit — chat 2026-06-06 vs verklighet

**Datum:** 2026-06-06  
**Projekt:** `gen-lang-client-0481875058` (number `1084026575972`)  
**Syfte:** Ersätta chat-gissningen ($265/mån → $17/mån) med verifierbar sanning.

---

## CLI-status (2026-06-06)

| Kommando | Resultat |
|----------|----------|
| `gcloud billing projects describe gen-lang-client-0481875058` | **Timeout** i Cursor-miljö — kör lokalt efter `gcloud auth login` |
| Senast verifierat billing-konto | **Ja** — [`2026-05-29-google-ai-pro-gcp-credit.md`](./2026-05-29-google-ai-pro-gcp-credit.md): `billingAccounts/012C55-D92F23-0A2FD7` |

---

## Chat-påstående vs fakta

| Chat | Verdict |
|------|---------|
| Vector Search på us-west1, flytta sparar 40% | **Falskt** — kanon **europe-west1**, G2–G3 done |
| 32 functions → megafunctions sparar 25% | **Misvisande** — debitering per invocation, inte antal export-namn |
| $265/mån total | **Ej verifierat** — inga billing-siffror i repo |
| $17/mån efter optimering | **Ej verifierat** — spekulativt |
| Google AI Pro ersätter GCP Vertex | **Falskt** — se distinktion nedan |

---

## Distinktion (måste hållas)

| Källa | Betalar |
|-------|---------|
| **Google AI Pro** (Google One) | NotebookLM, Gemini-app, AI Studio — **inte** prod callables |
| **GCP billing** (`012C55-…`) | `valvChatQuery`, RAG, embeddings, Functions compute |

---

## Top-3 — fyll i från Console (USER)

Öppna: [Cloud Console Billing → Reports](https://console.cloud.google.com/billing) → filter projekt `gen-lang-client-0481875058` → senaste 30 dagar.

| Rank | Tjänst (förväntat) | Belopp (SEK/USD) | Anteckning |
|------|-------------------|------------------|------------|
| 1 | Vertex AI / Gemini API | _USER fyller_ | RAG, coach, inbox-klassificering |
| 2 | Cloud Firestore | _USER fyller_ | Reads/writes; Vector index **173** docs |
| 3 | Cloud Functions | _USER fyller_ | 34 deployade, europe-west1, scale-to-zero |

**Budget alert (rekommenderat):** Vertex AI + Cloud Functions, t.ex. 500 SEK/mån — se [`2026-05-29-google-ai-pro-gcp-credit.md`](./2026-05-29-google-ai-pro-gcp-credit.md).

---

## Redan implementerade kostnadsguardrails (ingen ny kod)

| Guardrail | Status |
|-----------|--------|
| G12 Context Cache registry | **done** — `npm run smoke:cache` PASS 2026-06-06 |
| DCAP + heuristik före LLM (inkast) | **live** — [`inboxClassifier.ts`](../../functions/src/lib/inboxClassifier.ts) |
| RAG-only prompts (tre silos) | **live** — [`sharedRules.ts`](../../functions/src/sharedRules.ts) |
| Vector index europe-west1 | **live** — [`GCP-INVENTORY-LATEST.md`](../GCP-INVENTORY-LATEST.md) |
| Retention G5 (exkl. WORM) | **live** — `scheduledRetentionJob` |

---

## Nästa steg (endast om billing visar drivare)

1. **Vertex högst** → verifiera modellval (`gemini-2.5-flash` vs pro), cache hit-rate via `getContextCacheStatus`
2. **Firestore högst** → Console → Firestore → Usage; lägg index endast för queries med missing-index-fel
3. **Functions högst** → logga invocation count per callable i Cloud Monitoring — **inte** slå ihop functions

**Relaterad audit:** [`2026-06-06-collection-audit.md`](./2026-06-06-collection-audit.md)
