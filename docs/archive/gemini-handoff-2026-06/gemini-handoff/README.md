# Gemini handoff — leveranser till Cursor

Genereras/uppdateras av Gemini-sessions eller Cursor enligt [`docs/google-ai-pro/PROMPTS.md`](../google-ai-pro/PROMPTS.md).

| Fil | Beskrivning |
|-----|-------------|
| [`K1-compassWidgetCatalog.md`](./K1-compassWidgetCatalog.md) | Widget per Morgon/Dag/Kväll |
| [`K2-home-hero-layouts.md`](./K2-home-hero-layouts.md) | Hem scenic varianter |
| [`V1-valv-zone-wireframe.md`](./V1-valv-zone-wireframe.md) | Valv zoner + handoff (referens) |
| [`V1-gemini-original-2026-05-31.md`](./V1-gemini-original-2026-05-31.md) | **Gemini original** — wireframe, tabeller, gap (ordagrant) |
| [`V1-valv-gemini-svar.md`](./V1-valv-gemini-svar.md) | Cursor integrationslogg (kort) |
| [`V2-PROMPT.md`](./V2-PROMPT.md) | NotebookLM V2 prompt |
| [`V2-valv-gap-notebooklm.md`](./V2-valv-gap-notebooklm.md) | V2 gap baseline (Cursor) — jämför NotebookLM |
| [`valv/`](./valv/) | **Valv → Gemini** — kör `npm run gemini:pack:valv` |
| [`IN1-fact-batch.md`](./IN1-fact-batch.md) | FACT 026–030 status |
| [`M1-drawer-icons/`](./M1-drawer-icons/) | Drawer SVG L2 — **integrerad** i `drawerNav.ts` |
| [`M2-valv-drawer-copy.md`](./M2-valv-drawer-copy.md) | Valv grupp-hints (KEEP) |
| [`K1-upload-konsolidering-PROMPT.md`](./K1-upload-konsolidering-PROMPT.md) | Upload merge — K1 uppdrag |
| [`K1-upload-konsolidering-svar.md`](./K1-upload-konsolidering-svar.md) | K1 SPEC (Cursor-granskat) |
| [`G0-baseline-2026-06-06.md`](./G0-baseline-2026-06-06.md) | NotebookLM/AI Studio baseline |
| [`G3-helhets-qa-2026-06-06.md`](./G3-helhets-qa-2026-06-06.md) | Helhets-QA efter Fas 1 |
| [`V2-DOMAIN-INDEX.md`](./V2-DOMAIN-INDEX.md) | Våg 2 — domän-Gemini (speglar→mabra) |
| [`K2-speglar-svar.md`](./K2-speglar-svar.md) | Speglar — Cursor Fas 1 |
| [`K2-valv-svar.md`](./K2-valv-svar.md) | Valv — granskningskö canonical |
| [`K2-familjehubb-svar.md`](./K2-familjehubb-svar.md) | Familj — referensmodell |
| [`K2-meny-svar.md`](./K2-meny-svar.md) | Meny — Liv launcher + LivBackLink |
| [`K2-mabra-svar.md`](./K2-mabra-svar.md) | MåBra — fullsid + guard |
| [`icons/compass-time/`](./icons/compass-time/) | K1/K2/K3 24×24 |

Repomix-paket (lokal, gitignored): `npm run gemini:pack` → `exports/gemini-handoff/repomix/`.
