---
name: livskompassen-grunder-kanon
description: Grunder G01–G52 status via INVENTAR — runtime vs vision-only vs avvisat. Use when slides, Grunder, or “är X implementerat?” from blueprint.
---

# Grunder kanon skill

## When to use

- User asks about a Grunder slide (G01–G52)
- Comparing blueprint to Livskompassen runtime
- Before proposing features from `docs/specs/modules/grunder-slides/`

## Read first

| File | Purpose |
|------|---------|
| [`docs/specs/modules/grunder-slides/INVENTAR.md`](../../docs/specs/modules/grunder-slides/INVENTAR.md) | Per-slide status |
| [`.cursor/rules/grunder-kanon.mdc`](../../rules/grunder-kanon.mdc) | Three truth layers |
| [`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](../../../docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md) | U1–U5 baseline |

## Three layers (MUST classify)

1. **Runtime** — `.context/`, `firestore.rules`, `functions/src/`
2. **Spec/GAP** — `docs/specs/modules/*-SPEC.md`, `Arkiv-GAP-REGISTER.md`
3. **Slides** — PNG/PDF in `grunder-slides/` — **not** proof of prod

## Never implement without `kör [GAP]`

| G | Topic |
|---|--------|
| G05, G42 | **Avvisat** — gamification / circular flow |
| G01, G28, G29, G33 | **Vision-only** — Dotprompt / Genkit |

## INVENTAR counts (Fas A)

- implementerat: 2 · delvis: 18 · vision-only: 30 · avvisat: 2

## Revisions

Trigger readonly agents: `kör grunder U1` … `U5` in `.cursor/agents/`.
