# Google AI Pro — NotebookLM baseline (Prompt A1 + A2)

> **Superseded (jun 2026):** Använd [`docs/external-ai/leveranser/2026-06-16-notebooklm-baseline-compare.md`](../external-ai/leveranser/2026-06-16-notebooklm-baseline-compare.md) + `npm run notebooklm:pack:all`. Denna fil behålls som historik (maj 2025).

**Datum:** 2026-05-29  
**Källor:** `repomix-dagbok.txt`, `ai-prompts-moduler-master.md`, `INNEHALL-REGISTER.md`, `arkiv-minne.md`, `dagbok-vertex-plan.md`  
**Pack:** `npm run google-ai-pro:pack` → `exports/google-ai-pro/notebooklm/`

---

## Prompt A1 — systemkontext (svar)

### 1. Tre silor (collection + callable)

| Silo | Collection | Callable |
|------|--------------|----------|
| **Kunskap** | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| **Valv** | `reality_vault` | `valvChatQuery` |
| **Barnen** | `children_logs` | `childrenLogsQuery` |

**Utvecklingszon Vit:** `mabra_sessions`, `vit_*` — **ingen** RAG-export till Kunskap (källa: INNEHALL-REGISTER).

### 2. Sacred Features (MUST NOT remove)

Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier-Generator, Speglings-Systemet, Zero Footprint, Kill Switch (källa: ai-prompts-moduler-master, arkiv-minne).

**Locked UX:** Barnfokus-frågor, Valv Mönster + Orkester, Planering P3 Kanban (källa: locked-ux-features via plan).

### 3. Dagbok v2 Fas 1 (dagbok-vertex-plan)

- Sub-nav: **Snabb / Reflektera / Arkiv**
- Snabb: humör + taggar + valfri rad, spara utan Storage-bilaga
- Utökad `saveJournalEntry`: `tags`, `category` (inga rules-ändringar i Fas 1)
- **Bevaras:** WORM, weave opt-in, MåBra-bro, ingen auto-promotion journal → `reality_vault`

### 4. Tre U1-brott om implementerat fel

1. Valv-Chat eller Kunskap-RAG som läser `reality_vault` + `kampspar` i samma query
2. Auto-ingest Vit/MåBra-reflektion → `kampspar` utan opt-in
3. "Sök överallt"-UI som mergar silor i en callable

### 5. Tre SÄKRA Fas 1-ändringar (utan rules)

1. `DagbokModeNav` + `JournalQuickMode` — **redan i kod**
2. `journalQuickMirror` efter Snabb-spar (Lager 1, ingen Valv-länk)
3. `tags`/`category` på journal create (befintliga rules tillåter owner create)

---

## Prompt A2 — Dagbok gap-tabell

| Vertex-krav | Finns i kod idag | Gap | Fas |
|-------------|------------------|-----|-----|
| Sub-nav Snabb/Reflektera/Arkiv | Ja (`DagbokModeNav`) | — | 1 done |
| Snabb humör + taggar | Ja (`JournalQuickMode`) | — | 1 done |
| Snabb spegling efter spar | Ja (`journalQuickMirror`) | Deploy callable | 1 |
| Reflektera wizard | Ja (Mood/Reflection/Confirm) | — | 1 |
| Arkiv sökbart | Delvis (`JournalArchive`) | Filter/sök Fas 3 | 3 |
| Storage bilaga | Nej i rules | Blocker Fas 2 | 2 |
| HandoffBox | Ja | — | 4 |

**Rekommenderad första kodändring (vid plan-skrivning):** `DagbokModeNav.tsx` — nu **implementerat**. Nästa drift: deploy `journalQuickMirror`.

---

## Användning

1. Ladda upp filer från `exports/google-ai-pro/notebooklm/` till NotebookLM
2. Jämför NotebookLM-svar mot denna baseline
3. Avvikelser → Cursor med skärmdump
