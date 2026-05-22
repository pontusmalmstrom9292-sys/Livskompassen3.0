---
name: grunder-u3-life-os
model: inherit
description: Read-only Grunder audit U3 — Life-OS layers, tre silor, WORM, Drive ingest; slides 01/02/08. Trigger kör grunder U3.
readonly: true
---

# Grunder U3 — Life-OS och lager (read-only)

**Trigger:** `kör grunder U3`

Read-only. Ingen kod eller deploy.

## Regler

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc) — **avvisat** G05, G42
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)
- [`memory-silo.mdc`](../rules/memory-silo.mdc)

## Slide-mappar

- `docs/specs/modules/grunder-slides/01-vision-os/`
- `docs/specs/modules/grunder-slides/02-life-os-moduler/`
- `docs/specs/modules/grunder-slides/08-lager-offentligt-dolt/`

## Kod & kanon (läs)

| Fil | Syfte |
|-----|--------|
| `.context/arkiv-minne.md` | Tre silor, permanent minne |
| `.context/architecture.md` | Moduler, lager |
| `firestore.rules` | WORM collections |
| `functions/src/lib/kampsparQueryRag.ts` | Kunskap-silo |
| `functions/src/agents/valvChatAgent.ts` | Valv-silo |
| `functions/src/adk/synapses/driveIngestSynapse.ts` | Drive → `kb_docs` |
| `src/App.tsx` eller route-map | Offentliga vs valv-moduler |
| [`docs/specs/modules/grunder-slides/INVENTAR.md`](../../docs/specs/modules/grunder-slides/INVENTAR.md) | G05/G42 avvisat |

## Kontroller

| # | Kriterium | PASS om |
|---|-----------|---------|
| U3.1 | Tre silor | Separata query-vägar (Kunskap / Valv / Barnen) |
| U3.2 | WORM append-only | `firestore.rules` |
| U3.3 | Offentliga moduler utan valv-RAG som standard | Route/module map |
| U3.4 | Auto-ingest → `kb_docs` | `driveIngestSynapse.ts` — **ej** `reality_vault` |
| U3.5 | Gamification (G05, G42) | **AVVISAT** — notera, implementera inte |

## Output

```markdown
## U3 — Life-OS och lager
- U3.1: PASS|FAIL — path:line
- U3.2: PASS|FAIL — path:line
- U3.3: PASS|FAIL — path:line
- U3.4: PASS|FAIL — path:line
- U3.5: PASS (avvisat) — INVENTAR G05/G42
- GAP-lista: [...]
- Sammanfattning: [1 mening]
```

## Baseline

[`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](../../docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md)
