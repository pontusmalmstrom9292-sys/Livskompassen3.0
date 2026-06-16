# NotebookLM baseline — jämförelse 2026-06-16

**Pack:** `npm run google-ai-pro:pack` (körd 2026-06-16)  
**Jämförelse mot:** [`2026-06-15-fas15-wave2-chat0-baseline.md`](../../archive/evaluations-fas22-2026-06/2026-06-15-fas15-wave2-chat0-baseline.md) (arkiverad)

---

## Fyra fasta frågor (upprepa i NotebookLM)

1. Vad är **LOCK** enligt `LIFE-OS-BUILD-STATE.md`?
2. Vilken är **nästa kodvåg** efter Våg 3 Nav?
3. Nämns **cross-RAG** eller fjärde silo någonstans som tillåtet?
4. Var finns **Barnfokus** supermodule och vilken route?

---

## Förväntade svar (repo-sanning 2026-06-16)

| Fråga | Svar |
|-------|------|
| LOCK | WORM/Valv B1, locked UX §1–19, Inkast G10, SynapseBus, App Check, chatbot bifoga |
| Nästa våg | Fas 19.3 tokens · Upload steg 2 · supermodule wave-2b |
| cross-RAG | **NEJ** — tre silos (U1) |
| Barnfokus | `FamiljenInputSuperModule` / `FamiljenBarnfokusDelegate` på `/familjen?tab=reflektion` |

---

## Delta mot V2-baseline

| Område | V2 (jun 15) | Nu (jun 16) |
|--------|-------------|-------------|
| Nav Våg 3 | PMIR väntar | **DONE** H1–H4 |
| Handoff packs | 2 filer | **7** repomix + PHASE-08–12 |
| Design hygiene | kandidat | **~400 filer** arkiverade |
| DOC-INDEX | saknades | **finns** |

---

## Åtgärd

Ladda upp nytt pack till NotebookLM. Om svar avviker från tabellen ovan — kör CHECKPOINT i Cursor, uppdatera inte prod från NotebookLM direkt.
