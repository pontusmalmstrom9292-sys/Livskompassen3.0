---
name: grunder-u2-systemforsvar
model: inherit
description: Read-only Grunder audit U2 — circuit breaker, Kill Switch, Zero Footprint, dcap_alert/HITL vs slides 06-systemforsvar. Trigger kör grunder U2.
readonly: true
---

# Grunder U2 — Systemförsvar (read-only)

**Trigger:** `kör grunder U2`

Read-only. Ingen kod, deploy, eller secrets.

## Regler

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)
- [`security-firestore.mdc`](../rules/security-firestore.mdc) vid WORM/session

## Slide-mappar

- `docs/specs/modules/grunder-slides/06-systemforsvar/` (G30, G32, G38, G47)

**Vision-only slide G38 (kontinuerligt lärande)** ≠ full prod HITL — skilj slide från runtime.

## Kodfiler (läs)

| Fil | Syfte |
|-----|--------|
| `functions/src/agents/DCAP.ts` | Risknivåer |
| `functions/src/agents/cards/index.ts` | `routeFromDcap` |
| `functions/src/agents/kompis-supervisor.ts` | DCAP → synapse / routing |
| `functions/src/adk/synapses/dcapAlertSynapse.ts` | HITL WORM `dcap_alerts` |
| `functions/src/adk/synapses/synapseBus.ts` | `dcap_alert` handler |
| `functions/src/index.ts` | `invalidateSession` callable |
| Frontend Zero Footprint / Kill Switch | t.ex. `useZeroFootprint`, shake handler |
| `src/modules/safe_harbor/` | `hitlRequired` / HITL-notis om relevant |

## Kontroller

| # | Kriterium | PASS om |
|---|-----------|---------|
| U2.1 | Akut risk bypassar vanlig coaching | ALERT → BIFF intent i `routeFromDcap` |
| U2.2 | Inga LLM auth/ägarskap-beslut | Ingen prompt som bestämmer åtkomst |
| U2.3 | `dcap_alert` live (ej bara stub) | `dcapAlertSynapse.ts` + `synapseBus` `dcap_alert` |
| U2.4 | Kill Switch + session clear | `invalidateSession` + Zero Footprint-regler |
| U2.5 | Human fallback (fas 1) | WORM `dcap_alerts` + Safe Harbor HITL-notis; notera **GAP** om extern notifiering saknas |

## Output

```markdown
## U2 — Systemförsvar
- U2.1: PASS|FAIL — path:line
- U2.2: PASS|FAIL — path:line
- U2.3: PASS|FAIL — path:line
- U2.4: PASS|FAIL — path:line
- U2.5: PASS|FAIL|DELVIS — path:line + GAP om fas 2 saknas
- GAP-lista: [...]
- Sammanfattning: [1 mening]
```

## Baseline

[`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](../../docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md)
