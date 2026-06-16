# ChatBox wrapper — klistra EFTER CHATBOT-MASTER-PROMPT + repomix

Ersätt `[AGENT_NAMN]` och klistra in hela Gemini-draft under "GEMINI DRAFT" nedan.

---

```
## UPPDRAG: Granska Cursor subagent (read-only)

Agent: [AGENT_NAMN]

### GEMINI DRAFT (klistra in här)
<<<KLISTRA GEMINI-SVAR HÄR>>>

### Din granskning (MUST)
1. Verifiera alla filvägar mot bifogad repomix — flagga EJ VERIFIERAT om saknas
2. Verifiera smoke-scripts i package.json (exakta npm run smoke:* namn)
3. Konflikt med locked-ux-features.md / .context/locked-ux-features.md?
4. Tre silos / WORM / ingen cross-RAG?
5. Description har "Use when" eller "Use proactively"?
6. Prompt ≤120 rader?

### Output-format
Returnera SLUTGILTIG `.cursor/agents/<filnamn>.md` redo att committa.

Lägg till:
- Tabell: smoke-kommandon + förväntat PASS
- /name trigger
- Conductor-fas (5 = zone build, 6 = verifier)
- Eventuella JUSTERA-rader om Gemini missat något

MUST NOT: ändra locked UX, firestore.rules, eller föreslå ny RAG-silo.
```
