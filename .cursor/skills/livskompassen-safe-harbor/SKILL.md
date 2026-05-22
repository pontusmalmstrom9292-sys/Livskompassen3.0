---
name: livskompassen-safe-harbor
description: Safe Harbor / Hamn — BIFF, Grey Rock, 10% logistics vs 90% bait; analyzeMessage. Use for ex sms/email or src/modules/safe_harbor.
---

# Safe Harbor / BIFF skill

## When to use

- User shares message from co-parent / ex
- Editing `src/modules/safe_harbor/`
- Callable `analyzeMessage` in `functions/src/index.ts`

## User-facing output (one turn unless asked for more)

1. **Logistik (10%)** — facts requiring reply or action
2. **Beten (90%)** — max 3: hidden accusations, projection, traps
3. **Förslag svar** — Grey Rock/BIFF, 2–3 sentences, **no JADE**

## Runtime

| Piece | Path |
|-------|------|
| Frontend | `src/modules/safe_harbor/` |
| Backend | `analyzeMessage` callable |
| High risk routing | DCAP → BIFF via `routeFromDcap` (`riskScore >= 70`) |
| HITL | `dcapAlertSynapse` + Safe Harbor `hitlRequired` when applicable |

## MUST

- Brief, Informative, Friendly, **Firm** — business tone
- Separate emotional bait from logistics
- Apply [`grunder-kanon.mdc`](../../rules/grunder-kanon.mdc) — do not promise features from slides only

## MUST NOT

- JADE (justify, argue, defend, over-explain)
- Long multi-option lists (progressive disclosure: one step)
- Use Valv/evidence tone for pure logistics replies

## Related

- Product role: BIFF-Skölden · Gräns-Arkitekten (`sharedRules.ts`)
- Agent: `.cursor/agents/livskompassen-safe-harbor` (U9)
- Grunder audit: `kör grunder U1`, `kör grunder U2`
