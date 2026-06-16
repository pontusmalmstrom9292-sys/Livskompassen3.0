# Subagent-utkast — Gemini → ChatBox → Cursor (handoff)

**Status:** Utkast redo · **Bygg i Cursor:** väntar på godkänd ChatBox-leverans  
**Datum:** 2026-06-16

---

## Ordning (MUST)

1. **Gemini 3.1 Pro** — förbättra en utkastprompt i taget  
2. **ChatBox** — granska Gemini-svar mot repomix  
3. **Cursor** — först då: skapa `.cursor/agents/*.md` (säg *"bygg godkända subagenter"*)

**Max 2 parallella externa chattar.** En specialist per Gemini-chatt.

---

## Bifoga i Gemini (alla 5)

Mapp: [`docs/external-ai/bifoga/05-research-handoff/`](../bifoga/05-research-handoff/)

- `KANON-PASTE.txt`
- `INNEHALL-REGISTER.md`
- `MODUL-FUNKTIONS-REGISTER.md`
- `domän-covert-narcissism.md`

---

## Steg A — Gemini (per agent)

1. Ny chatt i **Gemini App** · modell **Gemini 3.1 Pro**
2. Bifoga `05-research-handoff/` (ovan)
3. Klistra in [`GEMINI-SPECIALIST-WRAPPER.md`](./GEMINI-SPECIALIST-WRAPPER.md) (ersätt `[AGENT]` och bifoga rätt utkast)
4. Spara svar som:

| Agent | Spara till |
|-------|------------|
| Verifier | `docs/external-ai/imports/gemini-specialist-verifier-draft.md` |
| Z1 Valv | `docs/external-ai/imports/gemini-specialist-valv-builder-draft.md` |
| Z3+6 Hjärtat | `docs/external-ai/imports/gemini-specialist-hjartat-inkast-draft.md` |
| Z4 Vardagen | `docs/external-ai/imports/gemini-specialist-vardagen-builder-draft.md` |
| Z5+2 Familjen | `docs/external-ai/imports/gemini-specialist-familjen-hamn-draft.md` |

---

## Steg B — ChatBox (per agent, efter Gemini)

1. Ny chatt · [`CHATBOT-MASTER-PROMPT.md`](../CHATBOT-MASTER-PROMPT.md)
2. Bifoga repomix-pack (se tabell)
3. Klistra [`CHATBOX-SPECIALIST-WRAPPER.md`](./CHATBOX-SPECIALIST-WRAPPER.md) + Gemini-draft
4. Spara som `docs/external-ai/leveranser/2026-06-16-specialist-<namn>.md`

| Agent | Repomix-pack |
|-------|----------------|
| Verifier | `exports/chatbot-handoff/chatbot-pack-security.md` |
| Z1 Valv | `exports/chatbot-handoff/chatbot-pack-security.md` |
| Z3+6 Hjärtat | `exports/chatbot-handoff/chatbot-pack-supermodules.md` |
| Z4 Vardagen | `exports/chatbot-handoff/ui-design-pack.md` |
| Z5+2 Familjen | `exports/chatbot-handoff/ui-design-pack.md` |

**Modell:** Opus 4.8 (Verifier, Z1) · Sonnet 4.6 (Z3+6, Z4, Z5+2) — se [`MODEL-PICKER.md`](../MODEL-PICKER.md)

---

## Steg C — Tillbaka till Cursor

Klistra i Cursor-chatt:

```
Bygg godkända subagenter från docs/external-ai/leveranser/2026-06-16-specialist-*.md
Skapa .cursor/agents/, uppdatera AGENTS.md och ORKESTER-AUTORUN.md.
Kör INTE om Gemini/ChatBox inte är klara för alla 5.
```

---

## Utkastfiler (input till Gemini)

| Fil | Agent |
|-----|-------|
| [`SPECIALIST-VERIFIER.md`](./SPECIALIST-VERIFIER.md) | V |
| [`SPECIALIST-Z1-VALV-BUILDER.md`](./SPECIALIST-Z1-VALV-BUILDER.md) | Z1 |
| [`SPECIALIST-Z3-HJARTAT-INKAST.md`](./SPECIALIST-Z3-HJARTAT-INKAST.md) | Z3+6 |
| [`SPECIALIST-Z4-VARDAGEN-BUILDER.md`](./SPECIALIST-Z4-VARDAGEN-BUILDER.md) | Z4 |
| [`SPECIALIST-Z5-FAMILJEN-HAMN.md`](./SPECIALIST-Z5-FAMILJEN-HAMN.md) | Z5+2 |

---

## Efter alla 5 godkända (Cursor bygger)

- `.cursor/agents/specialist-verifier.md` + 4 zone-builders
- `.cursor/skills/livskompassen-deploy/SKILL.md` (deploy = skill, inte subagent)
- Uppdaterad `orkester-conductor.md` (Fas 5–6)
- Skärpta descriptions på befintliga 11 agenter
- `npm run smoke:locked-ux` + zon-smoke
