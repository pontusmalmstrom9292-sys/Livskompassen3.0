# GCP Kostnadsvakt — Livskompassen

**Syfte:** Så att dyra molntjänster varken aktiveras av misstag i konsolen eller läggs in i kod av AI-agenter.

**Projekt:** `gen-lang-client-0481875058`  
**Manifest (maskinläsbart):** [`infra/gcp/cost-guard/manifest.json`](../../infra/gcp/cost-guard/manifest.json)  
**Cursor-regel:** [`.cursor/rules/cost-guard.mdc`](../../.cursor/rules/cost-guard.mdc)

---

## Tre skyddslager

| Lager | Vad | Kommando |
|-------|-----|----------|
| **1. Kod & CI** | Blockerar Vertex SDK, BigQuery, minInstances, för högt minne | `npm run smoke:cost-guard` |
| **2. GCP live** | Jämför aktiverade API:er mot allowlist | `npm run gcp:audit-apis` |
| **3. Fakturering** | Budget + avvikelse-larm i Console | `npm run gcp:setup-cost-alerts` |

Lagret 1 körs automatiskt i `smoke:predeploy` (YOLO-gate).

---

## Tillåtna tjänster (kort)

Firebase Hosting, Firestore, Cloud Functions (Gen2), Cloud Storage, Secret Manager, Google AI (Gemini API via nyckel), Auth, App Check, Logging/Monitoring.

**Inte tillåtna utan PMIR:** BigQuery, Cloud SQL, Spanner, Dataproc, Composer, Redis, AlloyDB, Compute Engine, GKE, Vertex Agent Engine, always-on instanser.

---

## Setup — ett steg i taget

### Steg 1: Verifiera kodskydd (lokal)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run smoke:cost-guard
```

### Steg 2: Kostnadsavvikelser (Console)

1. [Avvikelser](https://console.cloud.google.com/billing/anomalies) — välj projekt `gen-lang-client-0481875058`
2. **Hantera avvikelser** → trösklar: **25 SEK** kostnadspåverkan, **30 %** avvikelse
3. E-post: **Daglig sammanfattning** till Billing Admin

### Steg 3: Månadsbudget (Console)

1. [Budgetar](https://console.cloud.google.com/billing/budgets)
2. Skapa **100 SEK/månad** scoped till projektet
3. Larm vid **50 %, 80 %, 95 %, 100 %**

Valfritt automatiskt (kräver billing account ID):

```bash
export GCP_BILLING_ACCOUNT_ID=XXXXXX-XXXXXX-XXXXXX
npm run gcp:setup-cost-alerts -- --apply
```

Billing account ID hittas: `gcloud billing accounts list`

### Steg 4: Veckovis API-granskning

```bash
npm run gcp:audit-apis -- --write-report
```

Om blockerade API:er är aktiva → stäng av under **APIs & Services → Enabled APIs**.

---

## AI-kostnad i appen

- **Modell-router:** `functions/src/lib/modelRouter.ts` — Flash default, Pro endast för valv/dossier m.m.
- **Spårning:** `functions/src/lib/costTracker.ts` → `ai_cost_log` + Cloud Logging
- **Dagstak (valfritt env):** `AI_DAILY_COST_CAP_USD=3`, `AI_DAILY_USER_COST_CAP_USD=0.5`

---

## PMIR — när undantag behövs

1. Beskriv tjänst, beräknad månadskostnad och varför Firebase räcker inte
2. Pontus OK skriftligt
3. Lägg undantag i `infra/gcp/cost-guard/overrides.json`
4. Uppdatera allowlist i `manifest.json`
5. Kör `smoke:cost-guard` + `gcp:audit-apis`

---

## Relaterat

- [Visa och hantera kostnadsavvikelser (Google)](https://cloud.google.com/billing/docs/how-to/manage-anomalies)
- YOLO-gate: [`docs/YOLO-VAKT-GATE.md`](../YOLO-VAKT-GATE.md)
- Vertex-audit: `npm run audit:vertex-agents`
