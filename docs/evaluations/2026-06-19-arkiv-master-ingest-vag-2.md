# Arkiv Master — ingest våg 2 silo-impact

**Datum:** 2026-06-19  
**Agent:** livskompassen-arkiv-master (read-only)

---

## Silo-impact

| Delvåg | Kunskap | Valv | Barnen | Cross-RAG-risk |
|--------|---------|------|--------|----------------|
| 2a sourceRef-only | — | `sourceRef` på WORM | — | Ingen |
| 2a inbox_queue provenance | — | — | — | Ingen (metadata) |
| 2b widget DCAP | `kb_docs` om routing=kunskap + bank-gate | `reality_vault` default | `children_logs` vid barnsignal | **Medel** om heuristik fel |

---

## Blocker: heuristisk ordering

`heuristicInboxClassify()` matchar generisk kunskap **före** covert/HCF-bevis:

```212:225:functions/src/lib/inboxClassifier.ts
  if (
    /\b(bbic|metod|artikel|tips|handbok|gaslighting)\b/.test(blob) &&
    !/\b(sms|mejl|whatsapp)\b/.test(blob)
  ) {
    return { routing: 'kunskap', ... };
  }
```

Covert HCF kommer **efter** (rad 253–274). Text som *"teori om gaslighting från ex"* kan felroutas till `kb_docs` i stället för `reality_vault`.

**MUST fix före 2b:** flytta covert/HCF-heuristik före generisk kunskap-keywords.

---

## PASS/GAP

| Check | Status | Bevis |
|-------|--------|-------|
| Tre silos bevarade i design | PASS | Ingen merge av RAG |
| WORM append-only | PASS | `routeInboxToWorm` skapar only |
| Bevis → `reality_vault` i kod | PASS | `inboxPersist.ts:329-339` |
| Kunskap → `kb_docs` (våg 1) | PASS | `inboxPersist.ts:427-439` |
| `kampspar` endast opt-in | PASS | `journal_woven` / `ingestKampsparEntry` |
| Widget idag bypassar DCAP | GAP | Direkt `saveVaultLog` |
| `drive:`-prefix på icke-Drive | GAP | `wormPayload.ts:56-58` |
| HCF ordering risk | GAP | `inboxClassifier.ts:212-274` |
| Dossier ≠ Kunskap RAG | PASS | Separata callables |

---

## Rankade säkra nästa steg

1. **2a-A:** `buildInboxSourceRef(kind, id)` + widget `storagePath`→`sourceRef` (ingen rules, ingen silo-risk)
2. **Heuristic-fix:** covert/HCF före kunskap-keywords (prerequisite för 2b)
3. **2b:** Callable-pipeline med widget default `bevis`, ingen auto-kunskap (Synapse C kan vänta till våg 3)

---

## Rekommendation

**GO** för 2a-A. **NO-GO** för 2b tills heuristic-fix + generisk `sourceRef` i `routeInboxToWorm` är på plats.
