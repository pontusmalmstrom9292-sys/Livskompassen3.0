# Moln & krediter — lathund (1 sida)

**Version:** 2026-05-24 · Projekt: `gen-lang-client-0481875058` (Livskompassen)

**Relaterat:** [`GIT-LATHUND.md`](./GIT-LATHUND.md) · [`WORKFLOW_AND_AI_CREDITS.md`](./WORKFLOW_AND_AI_CREDITS.md) · [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) · [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md)

**Cursor begränsad ~25 dagar:** använd **gratis** lokalt + **GCP** för AI i prod — spara Cursor för korta agent-uppdrag.

---

## Var bor sanningen?

| Vad | Var |
|-----|-----|
| Live moln (functions, vector, secrets) | [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) |
| **Fas 19 kredit-audit** | [`evaluations/2026-06-15-fas19-credits-audit.md`](./evaluations/2026-06-15-fas19-credits-audit.md) |
| Kreditstrategi (~12 000 kr + test) | [`WORKFLOW_AND_AI_CREDITS.md`](./WORKFLOW_AND_AI_CREDITS.md) |
| Firebase MCP-konfig | [`.cursor/mcp.json`](../.cursor/mcp.json) |
| Fas & prioritering | [`.context/system-plan.md`](../.context/system-plan.md) |
| Nästa kodbit (GAP) | [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) |
| Nattpass utan LLM | `npm run orkester:night` → [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) |

---

## Ordlista (kort)

| Term | Betyder | Du använder det när… |
|------|---------|----------------------|
| **IDE** | Cursor (VS Code-fork) | Du redigerar React/Functions |
| **Agent-läge** | Cursor-chat med terminal + MCP | Du säger *"kör molncheck"* — **sparsamt** under limit |
| **MCP** | Model Context Protocol — verktyg agenten anropar | Firebase deploy/loggar utan Console-klick |
| **Firebase MCP** | `npx firebase-tools mcp` | Backend-status, deploy, regler |
| **ADC** | `gcloud auth application-default login` | Lokala skript ska använda **GCP-krediter** |
| **GCP-krediter** | Billing på Google Cloud (~12 000 kr + ev. test) | **Deployade** Functions + Gemini/Vertex + Vector |
| **Spark (gratis)** | Firebase free tier | `npm run dev`, måttlig Auth/Firestore i dev |
| **ADK** | `AdkOrchestrator`, `SynapseBus`, executors i `functions/src/adk/` | Händelser mellan moduler (Drive→kb_docs) — **inte** Firestore `/synapses` blueprint |
| **Orkester** | Nattpass / specialister | `orkester:night` (**gratis**) eller *"kör orkester"* i chat (**Cursor**) |
| **PMIR** | Pre-Merge Impact Report | Före merge — se [`GIT-LATHUND.md`](./GIT-LATHUND.md) |
| **Smoke** | Automatiska kontroller | `smoke:locked-ux`, `smoke:orkester` — **gratis** lokalt |
| **Silos U1** | Kunskap / Valv / Barnen — aldrig cross-RAG | All RAG/query-ändring |

---

## Tre plånböcker

| Plånbok | Vad | När det kostar |
|---------|-----|----------------|
| **Gratis** | `npm run dev`, `npm run build`, alla `smoke:*`, `orkester:night` | Aldrig (bara din tid) |
| **GCP** | Deployade AI-functions, Vector ANN, hög Firestore/Storage | När du **använder appen mot prod** eller tunga molnjobb |
| **Cursor** | Chat, Composer, långa agent-loopar | **Nu begränsat** — korta uppdrag |

---

## Rutin (när / hur ofta / vem)

| När | Vad | Hur ofta | Du | Agent | Kostnad |
|-----|-----|----------|-----|-------|---------|
| Första gången / token död | `gcloud auth application-default login` | Vid behov | Terminal 2 min | Verifiera | Gratis |
| Varje arbetsdag | `git pull` + `npm run dev` | Dagligen | Ja | — | Gratis |
| Efter backend-ändring | `cd functions && npm run build` | Per ändring | Eller agent | Ja | Gratis |
| Efter Valv/Familjen | `npm run smoke:locked-ux` | Per relevant ändring | Eller agent | Ja | Gratis |
| Efter agents/synapser | `npm run smoke:orkester` | Per ändring | Eller agent | Ja | Gratis |
| Aktiv utvecklingsvecka | `npm run orkester:night` | Max 1×/natt | Terminal | Läsa rapport | Gratis |
| Osäker moln vs docs | *"kör molncheck"* (prompt nedan) | Veckovis / före deploy | — | Ja | Låg Cursor |
| Före deploy prod | `firebase deploy` | Sällan | Godkänn | MCP/CLI | Körning = GCP |
| Testa AI | `/kunskap`, `/valv`, … mot prod | Vid behov | Ja | — | **GCP** |
| Kvarvarande kr | [Cloud Billing](https://console.cloud.google.com/billing) | 1×/månad | 5 min | Guider URL | Gratis att titta |
| Merge | PMIR → ditt OK | Per gren | [`GIT-LATHUND`](./GIT-LATHUND.md) | Ja | Gratis |
| Helhetskaos | SYSTEMKONTROLL A–E | Vid behov | [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md) | En bokstav | Medel Cursor |

---

## Operativa lägen (inte Cursor Pro-planer)

| Läge | Aktivera med | Exempel | Cursor? | GCP? |
|------|--------------|---------|---------|------|
| **Lokal dev** | `npm run dev` | UI utan moln-AI | Nej | Nej |
| **Kvalitet** | `smoke:locked-ux` + `smoke:orkester` | Barnfokus, Mönster/Orkester, ADK | Nej | Nej |
| **Nattpass** | `npm run orkester:night` | Build + smoke + rapport | Nej | Nej |
| **Molncheck** | Prompt nedan | Status, loggar | Lite | Nej |
| **Prod-AI-test** | Deployad app | RAG, BIFF, Valv-chat | Nej | **Ja** |
| **Deploy** | `firebase deploy` / MCP | Ny backend | Lite | Ja vid användning |
| **Conductor** | *"Kör orkester nattpass"* | Specialister | **Hög — undvik nu** | Ev. |
| **Natt-CI SDK** | — | **WAIT** [`NATT-CI.md`](./NATT-CI.md) | — | — |

---

## Parallellt (snabb utveckling)

| OK? | Kombination |
|-----|-------------|
| Ja | `npm run dev` + du kodar |
| Ja | `orkester:night` medan du sover |
| Ja | Agent molncheck + du läser rapport |
| Nej | Lång Composer **och** Conductor samma kväll |
| Nej | Deploy prod **utan** smoke PASS |

---

## Snabb väg till färdig app

1. Dagligen: dev → functions build → `smoke:locked-ux` + `smoke:orkester`.
2. En **GAP** i taget från [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md).
3. Testa AI i **prod** (GCP), inte genom att fråga Cursor om sanning.
4. Deploy **sällan** — bara när smoke PASS och du behöver telefon mot riktig backend.
5. Under Cursor-limit: `orkester:night` + korta agent-prompter istället för mass-Composer.

---

## ADC (engång / när token dör)

```bash
gcloud auth application-default login
gcloud config set project gen-lang-client-0481875058
```

Verifiera: `gcloud auth application-default print-access-token` → ska lyckas utan fel.

---

## Firebase MCP — vad agenten kan

| Område | Verktyg (exempel) | GCP-kostnad? |
|--------|-------------------|--------------|
| Miljö | `firebase_get_environment` | Nej |
| Functions | `functions_list_functions`, `functions_get_logs` | Nej |
| Firestore | query/list (dev försiktigt) | Låg vid skrivning |
| Deploy | `firebase_deploy` | Körning efter deploy = GCP |
| Regler | `firebase_validate_security_rules` | Nej |

MCP kan **inte** visa exakt kron-saldo — använd [Billing Console](https://console.cloud.google.com/billing).

---

## Prompt — Molncheck (Agent-läge)

```
Kör molncheck för Livskompassen — inga kodändringar.
1) firebase_get_environment
2) gcloud auth application-default print-access-token
3) functions_list + functions_get_logs (senaste fel)
4) Jämför med docs/GCP-INVENTORY-LATEST.md — vad är aktivt, vad saknas
5) Ett manuellt steg för mig om något kräver webbläsare
6) Rekommendera EN nästa åtgärd för snabbast väg mot färdig app
Projekt: gen-lang-client-0481875058
```

---

## Prompt — Jobba vidare (minimal Cursor)

```
Hjälp mig jobba vidare mot färdig app med minimal Cursor-användning:
- Kör smoke:locked-ux och smoke:orkester
- Lista öppna GAP från docs/specs/modules/Arkiv-GAP-REGISTER.md (topp 3)
- Föreslå endast ETT GAP att implementera härnäst med minsta diff
- Använd Firebase MCP för loggar om smoke failar
Jämför mot hela projektet. Sluta inte förrän smoke PASS eller tydlig blocker med ett manuellt steg för mig.
```

---

## Gör aldrig

- Bränna Cursor på stora Composer-refactors under limit-perioden
- Deploy utan smoke PASS
- Nya Vertex-index / träning utan behov (dyrt)
- `@cursor/sdk` / Natt-CI — **WAIT** tills GAP och konsolidering säger klart
- Fråga Cursor om auth, WORM eller silo-sanning — läs kod + inventering

---

## Snabb-kontroll (60 sek)

```bash
gcloud config get-value project    # gen-lang-client-0481875058
firebase projects:list | head -8
gcloud auth application-default print-access-token >/dev/null && echo ADC OK || echo ADC — kör login ovan
npm run smoke:locked-ux
```
