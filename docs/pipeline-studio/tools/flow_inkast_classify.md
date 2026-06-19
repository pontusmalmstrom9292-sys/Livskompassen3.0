# flow_inkast_classify — G10 Inkast auto-routing

**Tool ID:** `flow_inkast_classify`  
**Callable:** `previewInboxClassification` (preview) / `submitInkastLite` (full ingest)  
**Schema:** `functions/src/schemas/inkastClassify.ts` — `validateInkastClassifyResponse`  
**Smoke:** `npm run smoke:inbox` · `npm run smoke:orkester`

---

## Ingest path (silo-safe, DCAP-first)

```
Inkast (text / file / Drive)
        │
        ▼
extractAnalysisFromBuffer / transcribeInkastAudio
        │
        ▼
buildInboxClassifyBlob          ← prepends [sourceModule:…] prefix
        │
        ▼
┌───────────────────────────────────────────────────┐
│ 1. heuristicInboxClassify (DCAP-before-LLM, U2)  │
│    Deterministic keyword + sourceModule rules.    │
│    Returns classification or null.                │
└───────────────────────────────────────────────────┘
        │ null
        ▼
┌───────────────────────────────────────────────────┐
│ 2. classifyInboxDocument — Gemini 2.5 Flash LLM  │
│    Prompt: INKORG_SORTERARE_SYSTEM_PROMPT         │
│    (sharedRules.ts — only location for prompts)  │
│    Returns InboxClassification JSON.              │
└───────────────────────────────────────────────────┘
        │
        ▼
applyInkastConfidenceGate
  confidence < 0.75  →  routing = 'review'
        │
        ▼
routeInboxToWorm
```

---

## Routing table (InboxRouting)

| routing    | Destination collection | Auto-persist? | HITL gate                        |
|------------|------------------------|---------------|----------------------------------|
| `kunskap`  | `kb_docs`              | Yes           | isVerified + confidence ≥ 0.75   |
| `bevis`    | `reality_vault`        | Yes           | hasVaultSession + isVerified     |
| `barnen`   | `children_logs`        | **Never auto**| Always inbox_queue; allowBarnenAutoPersist=false in Drive synapse |
| `dagbok`   | `journal`              | Yes           | isVerified                       |
| `planning` | `planning_tasks`       | Yes           | isVerified                       |
| `review`   | `inbox_queue`          | No            | Awaits user HITL                 |

**MUST NOT:** `bevis` → `kb_docs`. `barnen` → auto-promote to `reality_vault`. Cross-silo RAG.

---

## HITL escalation rules

- `traumaSensitive === true` AND `optInTrauma !== true` → always `inbox_queue`.
- `routing === 'review'` → always `inbox_queue`.
- `routing === 'bevis'` AND `!hasVaultSession` → `inbox_queue` (pending Vault unlock).
- sensitive routing (`bevis | barnen | dagbok`) AND `!isVerified` → `inbox_queue`.
- Drive synapse: `barnen` always `inbox_queue` (`allowBarnenAutoPersist: false`).

---

## Heuristic rules (DCAP layer — no LLM cost)

Priority order — first match wins:

1. LVU / vårdnadstvist / akut kris / självskada → `review` (traumaSensitive)
2. sourceModule: `hamn` / `hamn_biff` → `bevis`
3. sourceModule: `valv_samla` → `bevis`
4. sourceModule: `planering_inkorg` → `planning`
5. sourceModule: `hem_capture` / `hem_smart_inkast` → `dagbok`
6. sourceModule: `mabra_inkast` → `dagbok`
7. sourceModule: `familjen` / `barnen` / `barnfokus` → `barnen`
8. SMS/mejl + motpart/isabelle/soc → `bevis`
9. barnfokus / barnens livslogg → `barnen`
10. BBIC/metod/artikel/handbok + no SMS → `kunskap`
11. Kasper/Arvid + sömn/skola/beteende → `barnen`
12. DARVO/gaslight/covert + no hem/mabra/planering prefix → `bevis` (domain prior ~80%)
13. *LLM fallback*

---

## Nodes (flow_inkast_classify.json)

```
trigger:inkast_upload
  → heuristic:heuristicInboxClassify
  → llm:classifyInboxDocument        (only if heuristic returns null)
  → route:silo                       (applyInkastConfidenceGate + routeInboxToWorm)
  → hitl:inbox_queue                 (trauma / low confidence / barnen / pending auth)
```

---

## Silo invariants (U1 — MUST NOT violate)

- `knowledgeVaultQuery` reads `kampspar` + `kb_docs` only.
- `valvChatQuery` reads `reality_vault` only.
- `childrenLogsQuery` reads `children_logs` only.
- No shared vector namespace across silos.

---

## Prompt alignment (fixed 2026-06-19)

`INKORG_SORTERARE_SYSTEM_PROMPT` routing enum uses `planning` (English, matching `InboxRouting` type).  
Previous mismatch (`planering`) caused LLM-classified planning items to fall back to `review`.  
`parseClassificationJson` now normalises `planering` → `planning` for robustness.

---

## Validate script

```bash
npm run smoke:inbox     # previewInboxClassification + getInboxQueue live smoke
npm run smoke:orkester  # static wiring + functions build
cd functions && npm run build
```
