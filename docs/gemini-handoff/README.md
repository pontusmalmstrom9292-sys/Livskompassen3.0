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
| [`G0-session-gap-analysis.md`](./G0-session-gap-analysis.md) | Gemini gap vs kod |
| [`icons/compass-time/`](./icons/compass-time/) | K1/K2/K3 24×24 |

Repomix-paket (lokal, gitignored): `npm run gemini:pack` → `exports/gemini-handoff/repomix/`.
