# Pontus — kör Gemini + ChatBox (subagenter)

**Ett steg i taget.** Börja med **Verifier** (V), sedan Z1 → Z3+6 → Z5+2 → Z4.

Full handoff: [`SPECIALIST-SUBAGENTS-HANDOFF.md`](./SPECIALIST-SUBAGENTS-HANDOFF.md)

---

## Steg 1 — Verifier i Gemini (nu)

1. Öppna **Gemini App** · modell **Gemini 3.1 Pro**
2. Bifoga mappen:  
   `docs/external-ai/bifoga/05-research-handoff/`
3. Klistra in [`GEMINI-SPECIALIST-WRAPPER.md`](./GEMINI-SPECIALIST-WRAPPER.md)  
   — ersätt `[AGENT]` med **VERIFIER**
4. Bifoga/klistra innehållet från [`SPECIALIST-VERIFIER.md`](./SPECIALIST-VERIFIER.md)
5. Spara Geminis svar som:  
   `docs/external-ai/imports/gemini-specialist-verifier-draft.md`

---

## Steg 2 — Verifier i ChatBox (efter Gemini)

1. Ny chatt · klistra [`CHATBOT-MASTER-PROMPT.md`](../CHATBOT-MASTER-PROMPT.md)
2. Bifoga `exports/chatbot-handoff/chatbot-pack-security.md`
3. Klistra [`CHATBOX-SPECIALIST-WRAPPER.md`](./CHATBOX-SPECIALIST-WRAPPER.md)  
   — ersätt `[AGENT_NAMN]` med **specialist-verifier**  
   — klistra Gemini-draft under GEMINI DRAFT
4. Modell: **Opus 4.8**
5. Spara som:  
   `docs/external-ai/leveranser/2026-06-16-specialist-verifier.md`

---

## Steg 3 — Upprepa för Z1, Z3+6, Z5+2, Z4

| # | Utkast | Gemini [AGENT] | ChatBox pack | Modell ChatBox |
|---|--------|----------------|--------------|----------------|
| 1 | SPECIALIST-VERIFIER | VERIFIER | security | Opus 4.8 |
| 2 | SPECIALIST-Z1-VALV-BUILDER | Z1-VALV | security | Opus 4.8 |
| 3 | SPECIALIST-Z3-HJARTAT-INKAST | Z3-HJARTAT-INKAST | supermodules | Sonnet 4.6 |
| 4 | SPECIALIST-Z5-FAMILJEN-HAMN | Z5-FAMILJEN-HAMN | ui-design-pack | Sonnet 4.6 |
| 5 | SPECIALIST-Z4-VARDAGEN-BUILDER | Z4-VARDAGEN | ui-design-pack | Sonnet 4.6 |

---

## Steg 4 — Tillbaka till Cursor

När alla 5 leveranser finns i `docs/external-ai/leveranser/2026-06-16-specialist-*.md`:

```
Bygg godkända subagenter från leveranserna.
Skapa .cursor/agents/, deploy-skill, uppdatera Conductor + AGENTS.md.
```

**Inget byggs i Cursor förrän du kört Gemini + ChatBox.**
