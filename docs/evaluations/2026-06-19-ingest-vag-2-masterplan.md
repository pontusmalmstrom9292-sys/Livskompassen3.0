# Ingest våg 2 — Masterplan v2 (fail-closed)

**Datum:** 2026-06-19  
**Status:** Plan klar — väntar Pontus **"godkänn 2a"**  
**Föregångare:** Ingest våg 1 (`kunskap` → `kb_docs`) — deployad

## Mål

Widget + `inbox_queue` med full DCAP-kedja. Zero regression: tre silos, WORM, locked UX.

## Parallella agenter (klara)

| Agent | Eval | Beslut |
|-------|------|--------|
| yolo-vakt | `yolo-audit-ingest-vag-2-plan.md` | 2a CONDITIONAL GO · 2b NO-GO |
| livskompassen-arkiv-master | `arkiv-master-ingest-vag-2.md` | 2a-A GO · heuristic-fix före 2b |
| minnes-arkitekten | `minnes-ingest-vag-2-scope.md` | 2a = sourceRef-only · 2b = callable-pipeline |
| livskompassen-synapser-adk | `synapser-ingest-vag-2-design.md` | Synapse C defer → våg 3 |

## Fail-closed gates

| Gate | Krav |
|------|------|
| G0 | Alla fyra agent-eval lästa |
| G1 | Pontus explicit **"godkänn 2a"** |
| G2 | `functions build` + `smoke:synapse-triggers` + `smoke:inkast-upload` |
| G3 | `smoke:orkester` + `smoke:predeploy` |
| G4 | YOLO GO före deploy |
| **STOP** | `firestore.rules` · Barnporten UI · cross-RAG · auto barn→Valv |

---

## Canonical 2a — **2a-A: sourceRef-only** (rekommenderad)

Pontus väljer detta som default om inget annat anges.

**Scope:** Widget får stabil `storagePath` + WORM `sourceRef`. Ingen `inbox_queue`-ändring.

| Fil | Ändring |
|-----|---------|
| `src/modules/core/firebase/storage.ts` | Returnera `{ storagePath, downloadUrl }` |
| `src/modules/features/widgets/api/widgetVaultRecording.ts` | Bygg `sourceRef`, skicka till `saveVaultLog` |
| `functions/src/lib/wormPayload.ts` | `buildInboxSourceRef(kind, id)` |

**Risk:** Minimal — ~26–44 rader, ingen rules, ingen functions-deploy.  
**Deploy:** `hosting` efter implementation.

### Alternativ 2a-B (senare, ej default)

`inbox_queue` får `origin`, `queueReason`, `sourceModule` i `persistInboxQueueItem`. Kräver functions-deploy. Välj endast om kö-spårbarhet prioriteras före widget-provenance.

---

## 2a-prerequisite — heuristic-fix (före 2b, kan köras i samma PR som 2b)

Flytta covert/HCF-heuristik **före** generisk kunskap-keywords i `inboxClassifier.ts:212-274`.

**Skäl:** Arkiv Master blocker — `gaslighting` i teori-text får inte hamna i `kb_docs`.

---

## 2b — Widget → DCAP (efter 2a-A + heuristic-fix + PMIR)

**Arkitektur (låst):** Utöka befintlig `ingestWidgetRecording` callable — **inte** ny synapse i våg 2. Synapse `widget_recording_ingested` → **våg 3**.

**Kedja:**

```
widget upload → analyze → classifyInboxDocument → routeInboxToWorm
```

**Routingpolicy (widget):**

| Routing | Beteende |
|---------|----------|
| `bevis` | Default — Valv WORM |
| `barnen` | Kasper/Arvid + barnsignal |
| `review`/trauma | `inbox_queue` |
| `kunskap` | **BLOCKERAD** för widget i våg 2 (MUST NOT auto) |

**Prerequisites:**

1. `buildInboxSourceRef()` i `routeInboxToWorm`
2. `vaultSessionToken` wired från frontend
3. Widget-heuristik `sourceModule: widget_recording`
4. Ny smoke: `smoke:widget-ingest`

**Deploy:** `functions:ingestWidgetRecording` + `hosting`

---

## 2c — defer

`kb_docs` → `kampspar` promote. Separat PMIR + content-bank.

---

## Implementeringsordning

```
Pontus "godkänn 2a"
     ↓
2a-A sourceRef-only → smoke → hosting deploy
     ↓ Pontus OK + PMIR 2b
heuristic-fix + 2b widget DCAP → smoke:widget-ingest → deploy
     ↓
YOLO audit → smoke:predeploy
```

## Verifiering

```bash
cd functions && npm run build && cd ..
npm run smoke:synapse-triggers
npm run smoke:inkast-upload
npm run smoke:orkester
npm run smoke:predeploy
```

## Subagenter (skapade)

| Agent | Fil |
|-------|-----|
| livskompassen-arkiv-master | `.cursor/agents/livskompassen-arkiv-master.md` |
| livskompassen-synapser-adk | `.cursor/agents/livskompassen-synapser-adk.md` |
| yolo-vakt | `.cursor/agents/yolo-vakt.md` (befintlig) |
| minnes-arkitekten | `.cursor/agents/minnes-arkitekten.md` (befintlig) |

## Nästa steg (ett)

**Pontus:** Säg **"godkänn 2a-A"** → agent implementerar `sourceRef-only` (~30 rader, hosting-deploy).
