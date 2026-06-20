# YOLO Audit — ingest våg 2 plan

**Datum:** 2026-06-19  
**Branch:** `main` (read-only)  
**Agent:** yolo-vakt

---

## Blockerande planerings-GAP

**2a har två oförenliga definitioner:**

| Dokument | 2a betyder | Deploy-yta |
|----------|------------|------------|
| `ingest-vag-2-masterplan.md` §2a | `inbox_queue` får `origin`, `queueReason`, `sourceModule` | `functions` |
| `minnes-ingest-vag-2-scope.md` §2 | Widget `storagePath` + WORM `sourceRef` — ingen `inbox_queue`-ändring | `hosting` (+ frontend) |

**2b har arkitekturkonflikt:**

| Dokument | 2b betyder |
|----------|------------|
| Masterplan + Minnes | Utöka `ingestWidgetRecording` → `classifyInboxDocument` → `routeInboxToWorm` |
| `synapser-ingest-vag-2-design.md` | **Alternativ C:** `widget_recording_ingested` synapse + commit-handler |

---

## PASS/GAP — våg 2a

| # | Kontroll | Status | Bevis |
|---|----------|--------|-------|
| 1 | Tre silos — ingen cross-RAG | PASS | Metadata/`sourceRef` endast |
| 2 | LLM beslutar inte auth/WORM | PASS | 2a rör inte routing |
| 3 | Prompts endast `sharedRules.ts` | PASS | Minnes §2: ingen prompt-ändring |
| 4 | Locked UX (WH1/WH2) | PASS | Backend/frontend-minimal |
| 5 | WORM `sourceRef` utan rules-ändring | PASS | `firestore.rules:88-90`, `wormPayload.ts:16` |
| 6 | `inbox_queue` client-write blockerad | PASS | `firestore.rules:1102-1105` |
| 7 | `inbox_queue` provenance-fält | GAP | `InboxQueueDoc` saknar fält: `inboxPersist.ts:10-30` |
| 8 | Widget `sourceRef` idag | GAP | `widgetVaultRecording.ts` skickar ej `sourceRef` |
| 9 | Plan-scope enhetlig | GAP | Masterplan ≠ Minnes 2a |
| 10 | G1 PMIR / Pontus OK | GAP | Masterplan väntar explicit OK |

---

## PASS/GAP — våg 2b

| # | Kontroll | Status | Bevis |
|---|----------|--------|-------|
| 1 | Tre silos — ingen cross-RAG | GAP | Masterplan tillåter `kunskap`; Synapse-design MUST NOT widget→`kb_docs` |
| 2 | DCAP före LLM | PASS | `inboxClassifier.ts:292-293`, `routeInboxToWorm` kö-gates |
| 3 | Bevis → `reality_vault` | PASS | `inboxPersist.ts:329-339` |
| 4 | Kunskap gate | PASS | `isKunskapFactApproved`: `inboxPersist.ts:413-425` |
| 5 | Widget → delad pipeline | GAP | Callable analys only: `agents.ts:644-666` |
| 6 | Generisk provenance | GAP | `driveInboxSourceRef()` only: `wormPayload.ts:56-58` |
| 7 | Widget-heuristik | GAP | Ingen `widget_recording`-gren: `inboxClassifier.ts:74-277` |
| 8 | Vault-session wired | GAP | `hasVaultSession` krävs: `inboxPersist.ts:305-326` |
| 9 | Heuristisk ordering (HCF) | GAP | `gaslighting`→kunskap före covert HCF: `inboxClassifier.ts:212-274` |
| 10 | Arkitekturbeslut | GAP | Callable-monolit ≠ Synapse C |
| 11 | `smoke:widget-ingest` | GAP | Ej i `package.json` |
| 12 | G1 PMIR | GAP | Krävs före 2b |

---

## GO / NO-GO

| Delvåg | Beslut | Skäl |
|--------|--------|------|
| **2a** | **CONDITIONAL GO** | Låg risk efter Pontus väljer **en** canonical 2a-definition |
| **2b** | **NO-GO** | PMIR, arkitekturbeslut, provenance-genericering, heuristic-fix, smoke-gate |

**Rekommenderad 2a:** Minnes `sourceRef-only` (minsta yta, förbereder 2b).

---

## Nästa steg (ett)

Pontus: välj **2a-A** (`sourceRef-only`) eller **2a-B** (`inbox_queue`-provenance) och säg **"godkänn 2a"** på vald variant.
