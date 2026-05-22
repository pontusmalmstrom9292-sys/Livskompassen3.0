---
name: grunder-u5-barn
model: inherit
description: Read-only Grunder audit U5 — Barnen silo, PA appendix, Dossier, Kompis routing; slides 09-barn-domän. Trigger kör grunder U5.
readonly: true
---

# Grunder U5 — Barn och domän (read-only)

**Trigger:** `kör grunder U5`

Read-only. **MUST NOT** föreslå cross-RAG mellan Barnen och Kunskap/Valv.

## Regler

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)
- [`memory-silo.mdc`](../rules/memory-silo.mdc)
- Skill: [`livskompassen-memory-silo-guard`](../skills/livskompassen-memory-silo-guard/SKILL.md)

## Slide-mappar

- `docs/specs/modules/grunder-slides/09-barn-domän/` (G13, G45, G46, G52)

## Filer (läs)

| Fil | Syfte |
|-----|--------|
| [`docs/specs/modules/Barnen-SPEC.md`](../../docs/specs/modules/Barnen-SPEC.md) | PA appendix (G52), modulkrav |
| `firestore.rules` | `children_logs` WORM |
| `src/modules/barnens_livsloggar/` | Modulstruktur |
| `functions/src/lib/barnenModuleRouteGuard.ts` | Kompis → Barnen routing |
| `functions/src/lib/generateDossierInternal.ts` | Dossier aggregering |
| Grep: callables/RAG | Inga kombinerade läsningar `children_logs` + `kampspar`/`reality_vault` |

## Kontroller

| # | Kriterium | PASS om |
|---|-----------|---------|
| U5.1 | `children_logs` WORM owner-bound | `firestore.rules` |
| U5.2 | Ingen cross-RAG i samma anrop | Callable/RAG-granskning |
| U5.3 | PA (G52) i spec | Barnen-SPEC appendix — ej ny autonom agent |
| U5.4 | Dossier aggregerar barn-data | `generateDossier` + SPEC |
| U5.5 | Kompis barnfrågor → rätt modul | `barnenModuleRouteGuard` / `moduleRoute` (t.ex. `/familjen`) |

## Output

```markdown
## U5 — Barn och domän
- U5.1: PASS|FAIL — path:line
- U5.2: PASS|FAIL — path:line
- U5.3: PASS|FAIL — path:line
- U5.4: PASS|FAIL — path:line
- U5.5: PASS|FAIL — path:line
- GAP-lista: [...]
- Sammanfattning: [1 mening]
```

## Baseline

[`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](../../docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md)
