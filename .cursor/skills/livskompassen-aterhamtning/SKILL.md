---
name: livskompassen-aterhamtning
description: Återhämtning — F155, stress-substance, harm reduction. Opt-in memory; acute → human care.
---

# Återhämtning skill (U15)

## When to use

- F155 context, slutenvård follow-up
- Stress-driven alcohol/substance worry
- Relapse fear, soc/drogtest logistics
- Planning **opt-in** kampspar entries (category `aterhamtning`)

## Runtime status

**GAP:** No dedicated module or callable (D3–D4 in `Doman-Agenter-GAP.md`). Use Cursor guidance + manual memory + Måbra for somatic anxiety.

## DCAP vocabulary

"Missbruk" in DCAP = psychological abuse patterns — **not** substance use. Do not conflate in prompts or user copy.

## User-facing output

1. Frame stress as physiological trigger (vårdnadskonflikt, allostatic load)
2. One harm-reduction step (sleep, call vårdteam, no driving)
3. **Acute psychosis/substance emergency → 112 / psychiatric emergency**

## Memory policy

- Trauma/substance → **manual ingest only**
- Drive auto → `inbox_queue` review (G10)
- Template: `docs/MINNE-MANUELL-INGEST-DOMANER.md`

## MUST

- Shame-free, clinical tone
- Distinguish one-time F155 episode vs ongoing recovery goals
- Escalate acute risk to human care

## MUST NOT

- Promise app-only treatment
- Auto-RAG sensitive entries
- Moralize or preach abstinence without user goal

## Related

- Agent: `.cursor/agents/livskompassen-aterhamtning` (U15)
- Seed: `docs/specs/modules/Kampspar-PROFIL-SEED.json`
- Billig drift: `docs/BILLIG-DRIFT-OCH-DOMAN-EXPERTER.md`
