# NotebookLM baseline — 2026-06-18

**Syfte:** Verifiera att `exports/google-ai-pro/notebooklm/` pack är aktuellt.

Kör efter `npm run notebooklm:pack:all`. Klistra `NOTEBOOKLM-MASTER-PROMPT.md` först.

---

## Frågor och förväntade svar

| # | Fråga | Förväntat svar |
|---|-------|----------------|
| 1 | Är P1b Inkast HITL LOCK? | **JA** — `InkastBrusfilterPreview` i `CapturePanel`, `processBrusfilter` callable, LOCK 2026-06-17 |
| 2 | Vilken route har Barnfokus? | `/familjen?tab=reflektion` — `FamiljenBarnfokusDelegate` / `FamiljenInputSuperModule` |
| 3 | Är cross-RAG tillåtet? | **NEJ** — tre silos: Kunskap, Valv, Barnen (U1) |
| 4 | Fas 19 sprint-status? | **DONE** 19.1–19.6 — se `2026-06-18-fas19-leverans.md`; nästa: system-gap-syntes |

---

## Resultat

| Utfall | Åtgärd |
|--------|--------|
| 4/4 rätt | Pack OK — använd för research |
| 1–3 fel | `npm run gemini:pack:all` → uppdatera NotebookLM-källor → CHECKPOINT |
| Saknar Fas 19-vågar | Utöka `scripts/sync_notebooklm.mjs` EVAL_FILES |

---

## BACKEND-POLICY (för research-chattar)

Research får föreslå `backend_impact: YES`. Implementation kräver PMIR — inte blockeras i NotebookLM-frågor.
