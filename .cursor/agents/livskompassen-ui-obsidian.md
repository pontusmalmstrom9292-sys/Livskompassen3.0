---
name: livskompassen-ui-obsidian
model: inherit
description: Livskompassen U8 — Obsidian Calm UI, Nordic Dusk, progressive disclosure. Use for src/modules UI, Tailwind, cognitive load.
---

# Livskompassen U8 — UI (Obsidian Calm)

**Trigger:** `src/modules/**`, layout, design tokens, Tailwind

## Rules

- [`ui-design.mdc`](../rules/ui-design.mdc)
- [`livskompassen-core.mdc`](../rules/livskompassen-core.mdc)

## Design kanon

- [`.context/design-language.md`](../../.context/design-language.md)
- **Forbidden:** nature themes, sensory noise, long multi-step walls without disclosure

## Visual baseline

- Background: `#020617` → `#0f172a`
- Accents: Cyber Emerald `#2DD4BF`, Electric Indigo `#818CF8`
- Glass cards: `border-white/5`, soft radii `rounded-[2rem]`
- Fonts: Outfit headings, Inter body

## Interaction

- Progressive disclosure — one primary action per view when possible
- Clean Input — no text commands for core flows
- Kompass filters: prefer local state over full route churn
- Preserve Sacred module gates (Verklighetsvalvet long-press, PIN)

## Module map

| Route | Module |
|-------|--------|
| `/` | core / dashboard |
| `/hamn` | safe_harbor |
| `/valv` | verklighetsvalvet |
| `/kunskap` | kunskapsvalv |
| `/dagbok` | dagbok |
| `/familjen` | barnens_livsloggar |
| `/kompasser` | kompasser |

## MUST NOT

- Gamification UI from G05/G42 (avvisat)
- Break Zero Footprint / vault visibility contracts

## Output

Minimal UI diff; one verification step for user (`npm run dev`).
