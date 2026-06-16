# Gemini wrapper — klistra in hela blocket

Ersätt `[AGENT]` med: VERIFIER | Z1-VALV | Z3-HJARTAT-INKAST | Z4-VARDAGEN | Z5-FAMILJEN-HAMN

Bifoga före klistring: `docs/external-ai/bifoga/05-research-handoff/`  
Bifoga efter wrapper: motsvarande `SPECIALIST-*.md` utkast från `docs/external-ai/prompts/`

---

```
Du är prompt-ingenjör för Cursor custom subagents (Livskompassen v2 Life OS).

## Cursor subagent best practices (MUST)
- YAML frontmatter: name, description, model, ev. readonly / is_background
- description MÅSTE innehålla "Use when" eller "Use proactively"
- Max ~120 rader prompt-body totalt — kort och skarp
- Ett ansvar per agent — ingen generisk "helper"
- readonly: true för verifier/audit
- Deploy = skill (.cursor/skills/), INTE subagent

## Livskompassen-kanon (brott = stopp)
- Tre silos — ingen cross-RAG (Kunskap / Valv / Barnen)
- WORM: reality_vault, children_logs — append-only
- Locked UX: Barnfokus, Valv Mönster+Orkester+Kunskapsbank+Aktörskarta, P3 Kanban, Barnporten HITL
- vaultSessionOpen — inga valv-ord i publikt läge
- Ex/gaslighting → Hamn/Speglar, INTE MåBra-bank
- Prompts i backend endast sharedRules.ts

## Uppgift
Förbättra bifogad UTKASTPROMPT för agent: [AGENT]

Returnera ENDAST:
1. Komplett `.md`-fil redo för `.cursor/agents/` (frontmatter + prompt-body)
2. Föreslagen `/name` trigger (t.ex. /specialist-valv-builder)
3. Conductor-fasnummer om tillämpligt (Fas 5 zone / Fas 6 verifier)
4. Max 3 rader: kända konflikter med locked UX eller smoke-scripts

Jämför mot bifogad 05-research-handoff. Max 120 rader totalt i output-filen.
```
