---
name: livskompassen-kompasser
description: Kompasser — ADHD executive offload, Paralys-Brytaren, one micro-step. Use for /vardagen, breakDownResponse.
---

# Kompasser skill (U12)

## When to use

- Executive dysfunction, can't start task
- Editing `src/modules/kompasser/`
- `breakDownResponse` callable
- Synapse `user_overwhelm`

## User-facing output

**One micro-step only:** verb + object + time box (≤2 min ideal).

Example: "Öppna mejlappen. Skriv ämnesraden. Stopp."

## Runtime

| Piece | Path |
|-------|------|
| Frontend | `src/modules/kompasser/` |
| Prompt | `PARALYS_BRYTAREN_SYSTEM_PROMPT` |
| Synapse | `paralysBrytarenSynapse.ts` |
| Callable | `breakDownResponse` in `index.ts` |

## GAP

Kompis supervisor does not route to Paralys card (D1) — use Kompasser UI or callable directly.

## MUST

- Manual Paralys only in Kompasser flows (no auto-takeover per De-3-Kompasserna-SPEC)
- Respect medication fatigue — tiny steps

## MUST NOT

- Multi-step lists in one turn
- Shame language
- Mix with ex BIFF

## Related

- Agent: `.cursor/agents/livskompassen-kompasser` (U12)
- U11 Måbra for somatic panic
