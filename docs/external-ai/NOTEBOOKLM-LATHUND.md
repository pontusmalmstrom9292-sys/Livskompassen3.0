# NotebookLM — lathund (Livskompassen kärna)

**Syfte:** Research, motsägelser, strategi — **inte** prod-kod. Prod byggs i Cursor.

---

## 1. Regenerera pack

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run notebooklm:pack:all
```

Detta kör: `chatbot:pack:handoff` → `sync:system` → `notebooklm:sync`.

**Output:** `exports/google-ai-pro/notebooklm/` (~25 filer)

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

Ställ dessa fyra frågor (förväntade svar i [`leveranser/2026-06-16-notebooklm-baseline-compare.md`](./leveranser/2026-06-16-notebooklm-baseline-compare.md)):

| # | Fråga | Förväntat svar (kort) |
|---|-------|------------------------|
| 1 | Vad är LOCK enligt LIFE-OS-BUILD-STATE? | WORM/Valv B1, locked UX, Inkast G10, SynapseBus, App Check |
| 2 | Nästa kodvåg efter Våg 3 Nav? | Fas 19.3 tokens · Upload steg 2 · supermodule wave-2b |
| 3 | Är cross-RAG tillåtet? | **NEJ** — tre silos (U1) |
| 4 | Var finns Barnfokus? | `FamiljenInputSuperModule` / `FamiljenBarnfokusDelegate` på `/familjen?tab=reflektion` |

| Resultat | Åtgärd |
|----------|--------|
| 4/4 rätt | Kärna räcker — använd NotebookLM för research |
| 1–3 fel | Uppdatera `scripts/sync_notebooklm.mjs` → CHECKPOINT i Cursor |
| Behöver zon-djup | Senare: separata notebooks (Valv/Familjen) — inte nu |

---

## 5. När ska du uppdatera?

- Efter CHECKPOINT som ändrar BUILD-STATE eller register
- Efter ny eval i `docs/evaluations/`
- Innan strategisession med Gemini (valfritt)

**Inte** efter varje liten kodändring — Cursor har live repo.

---

## 6. Relaterat

| Verktyg | När |
|---------|-----|
| **Cursor** | Prod-kod, smoke, deploy |
| **ChatBox** | SPEC, PMIR, wireframes — [`CHATBOX-LATHUND.md`](./CHATBOX-LATHUND.md) |
| **Gemini Tech Lead** | [`docs/google-ai-pro/GEMINI-TECH-LEAD.md`](../google-ai-pro/GEMINI-TECH-LEAD.md) |

Kanon-index: [`docs/DOC-INDEX.md`](../DOC-INDEX.md)
