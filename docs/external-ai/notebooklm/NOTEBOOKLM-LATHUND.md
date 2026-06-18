# NotebookLM — lathund (Livskompassen kärna)

**Syfte:** Research, motsägelser, strategi, system-gap — **inte** prod-kod. Prod byggs i Cursor efter PMIR.

---

## 1. Regenerera pack

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run notebooklm:pack:all
```

Detta kör: `chatbot:pack:handoff` → `sync:system` → `notebooklm:sync`.

**Output:** `exports/google-ai-pro/notebooklm/` (~40+ filer)

---

## 2. Ladda upp till NotebookLM

1. Öppna [NotebookLM](https://notebooklm.google.com) → notebook **Livskompassen-kärna** (eller skapa ny)
2. **Ta bort** alla gamla källor (maj-2025 design-only pack)
3. Ladda upp **hela** mappen:

```
/Users/Livskompassen/StudioProjects/Livskompassen3.0/exports/google-ai-pro/notebooklm/
```

**Mac:** `Cmd + Shift + G` i Finder → klistra sökväg → markera alla → dra till NotebookLM.

4. Läs `00-LAS-MIG-FORST.md` i pack-mappen för aktuell fillista.

---

## 3. Chattstart

Klistra in hela kodblocket från [`NOTEBOOKLM-MASTER-PROMPT.md`](./NOTEBOOKLM-MASTER-PROMPT.md).

---

## 4. Baseline — verifiera att pack fungerar

Ställ dessa fyra frågor (förväntade svar i [`docs/evaluations/2026-06-18-notebooklm-baseline.md`](../evaluations/2026-06-18-notebooklm-baseline.md)):

| # | Fråga | Förväntat svar (kort) |
|---|-------|------------------------|
| 1 | Är P1b Inkast HITL LOCK? | **JA** — `InkastBrusfilterPreview` / `processBrusfilter` (2026-06-17) |
| 2 | Vilken route har Barnfokus? | `/familjen?tab=reflektion` — `FamiljenBarnfokusDelegate` |
| 3 | Är cross-RAG tillåtet? | **NEJ** — tre silos (U1) |
| 4 | Fas 19 sprint-status? | **DONE** 19.1–19.6 — se `2026-06-18-fas19-leverans.md` |

| Resultat | Åtgärd |
|----------|--------|
| 4/4 rätt | Kärna räcker — använd NotebookLM för research |
| 1–3 fel | `npm run notebooklm:pack:all` → CHECKPOINT i Cursor |
| Behöver zon-djup | Deep Research SA6–SA10 + system-audit |

---

## 5. Deep Research (parallellt)

1. `npm run research:sync:handoff`
2. Bifoga `docs/external-ai/bifoga/05-research-handoff/` filerna **00–09** (10 st) till Gemini Deep Research
3. Kör [`GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md`](../bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md) + SA1–SA10
4. Spara till `docs/external-ai/imports/research-2026-06-18-*.md`
5. Cursor-subagent: [`CURSOR-FLOW-CREDITS-SYNTHESIS.md`](../bifoga/03-prompter/CURSOR-FLOW-CREDITS-SYNTHESIS.md)

---

## 6. När ska du uppdatera?

- Efter CHECKPOINT som ändrar BUILD-STATE eller register
- Efter ny eval i `docs/evaluations/`
- Innan strategisession med Gemini

**Inte** efter varje liten kodändring — Cursor har live repo.

---

## 7. Relaterat

| Verktyg | När |
|---------|-----|
| **Cursor** | Prod-kod, smoke, deploy (efter PMIR) |
| **ChatBox** | SPEC, PMIR, wireframes — [`CHATBOX-LATHUND.md`](../chatbox/CHATBOX-LATHUND.md) |
| **Gemini Gem** | Orkester — [`GEMINI-ORKESTER-MASTER-PROMPT.md`](../gemini/GEMINI-ORKESTER-MASTER-PROMPT.md) |

Kanon-index: [`docs/DOC-INDEX.md`](../DOC-INDEX.md)
