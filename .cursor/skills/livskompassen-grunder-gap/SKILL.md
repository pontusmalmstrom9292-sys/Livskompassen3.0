---
name: livskompassen-grunder-gap
description: Pre-merge GAP check — Arkiv-GAP-REGISTER, Grunder U1–U5 result, blocks vision-only work. Use before large PRs touching agents, RAG, or security.
---

# Grunder GAP skill

## When to use

- Large PR: agents, RAG, Firestore rules, synapses, Barnen, Dossier
- User says `kör [GAP]` for runtime work from Grunder
- After implementing a feature claimed from slides

## Read (in order)

1. [`docs/specs/modules/Arkiv-GAP-REGISTER.md`](../../../docs/specs/modules/Arkiv-GAP-REGISTER.md)
2. [`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](../../../docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md)
3. [`docs/specs/modules/grunder-slides/INVENTAR.md`](../../../docs/specs/modules/grunder-slides/INVENTAR.md) — for slide status
4. `.context/system-plan.md` — active phase

## Block merge if

- Cross-silo RAG introduced (`memory-silo.mdc` red flags)
- New prompts outside `sharedRules.ts`
- Implements **avvisat** G05/G42 or **vision-only** Genkit without explicit approval
- Weakens Sacred Features (see `.context/security.md`)

## Open Grunder-adjacent work (examples)

- Arkiv G8–G14 (per latest evaluation footer)
- External HITL notification (U2.5 fas 2) if not in code
- Genkit migration — **do not start** unless product decision

## Output format

```markdown
## GAP-check
- Blockers: [...]
- New GAPs to register: [...]
- Safe to merge: yes|no
```

## Related

- Skill: `livskompassen-grunder-kanon`, `livskompassen-anti-hallucination`
- Agent: `livskompassen-kanon-vakt` (U10)
