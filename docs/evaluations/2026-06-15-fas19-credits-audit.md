# Fas 19 — Kredit- och kostnadsaudit

**Datum:** 2026-06-15  
**Kanon:** [`MOLN-KREDITER-LATHUND.md`](../MOLN-KREDITER-LATHUND.md)

---

## Cursor (~2000 kvar)

| Läge | Kostnad |
|------|---------|
| `npm run dev`, `build`, alla `smoke:*`, `orkester:night` | Gratis |
| Pre-flight / Fas 19 agent (denna våg) | Medvetet investering |
| Efter masterplan | **En våg i taget** — undvik 5 parallella Conductor-kvällar |

---

## GCP (prod-användning)

### Dyrt (LLM + embedding)

| Callable | Silo |
|----------|------|
| `valvChatQuery` | Valv RAG |
| `knowledgeVaultQuery` | Kunskap RAG |
| `mabraCoach` | Vit coach |
| `analyzeMessage` | Hamn BIFF |
| `speglingsMirror` | Speglar |
| `childrenLogsQuery` | Barnen |
| `generateEmbedding` | Vector ingest |
| `generateDossier` | Dossier |

**Skydd:** rate limits (Fas 1.5) · App Check enforce (kod)

### Gratis / billigt i drift

- WORM-spar utan LLM · bank-copy MåBra · statisk Kunskap-FACT i UI
- Deterministisk UI (kompass, daglig mix kort)

### Defer (kostnad)

- Barnporten FCM push · Genkit V1

---

## Rutin

1. Billing Console 1×/månad (5 min)
2. Prod-AI-test sparsamt
3. `orkester:night` för kvalitet utan Cursor
