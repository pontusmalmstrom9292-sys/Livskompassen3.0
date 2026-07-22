# PMIR — Ingest våg 1 Kunskap-normalisering

**Datum:** 2026-06-19  
**Scope:** `routeInboxToWorm` — `kunskap` → `kb_docs`

## Beslut

| Alternativ | För | Emot | Rekommendation |
|------------|-----|------|----------------|
| A. G10 kunskap → `kb_docs` | Matchar arkiv-kanon + smoke:inkast live | Befintliga kampspar-poster oförändrade | **Ja** |
| B. Behåll `kampspar` för approved FACT | Vector direkt | Drift mot kanon | Nej |
| C. Dual-write båda | RAG täckning | Dubbel data, silo-risk | Nej |

## Ändringar

- `functions/src/lib/inboxPersist.ts` — approved kunskap → `persistKunskapFromInbox` → `kb_docs`
- `driveIngestSynapse.ts` — kommentar synkad
- `kampspar` kvar via `journal_woven`, `ingestKampsparEntry` callable

## Risk

| Risk | Bedömning |
|------|-----------|
| Tre silos | PASS — inom Kunskap |
| firestore.rules | Ej ändrad |
| Befintlig data | Oförändrad — endast nya ingest |
| RAG | `kb_docs` redan i `kampsparQueryRag` |

## Deploy

```bash
cd functions && npm run build
firebase deploy --only functions:submitInkastLite,functions:notifyNewFile
```

Smoke: `smoke:orkester`, `smoke:synapse-triggers`, `smoke:inkast-upload`
