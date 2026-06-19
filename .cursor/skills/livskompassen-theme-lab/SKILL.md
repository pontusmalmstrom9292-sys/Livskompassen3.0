---
name: livskompassen-theme-lab
description: Theme Lab workflow for Livskompassen — I-stone variants, icons, dock/menu/compass. Preview at /dev/theme-lab. Use when editing theme packs, chrome icons, or Obsidian Calm tokens in sandbox.
---

# Livskompassen Theme Lab Skill

Use when Pontus or agents work on **visual variants** without breaking locked UX.

## When to use

- New I-stone / theme pack drafts
- Icon decisions (drawer, dock, hero orbit)
- Theme Lab page improvements
- Comparing Obsidian Calm tokens before prod approval

## When NOT to use

- Backend, Firestore, callables, `firestore.rules` → use `livskompassen-deploy` or zone builders
- Locked UX changes (Barnfokus, Valv tabs) without PMIR
- Prod `DEFAULT_THEME_ID` changes without Pontus OK

## Preview URLs

| URL | Purpose |
|-----|---------|
| `/dev/theme-lab` | Compare drafts + mini-previews |
| `/dev/themes` | Simple skin picker |
| `/dev/design-freeport` | Tactile sandbox (`--fp-*`) |
| `/` | Hem hero + scenic bg |

## Canonical files

| File | Role |
|------|------|
| `src/modules/core/theme/themeLabVariants.ts` | Draft packs only |
| `src/modules/core/theme/themeRegistry.ts` | Approved prod themes |
| `src/modules/core/pages/ThemeLabPage.tsx` | Lab UI |
| `docs/design/theme-lab/VARIANTS.md` | Decision log |
| `docs/design/theme-lab/ICON-DECISIONS.md` | Chrome icons |
| `docs/design/THEME-LAB.md` | Human workflow |

## Rules (MUST)

- Tokens: `var(--surface)`, `text-accent`, `border-border` — no hex in `features/`
- Do not change `DEFAULT_THEME_ID` or `moduleThemeMap` until approved
- Locked icons D1/M2/WH1/WH2 — run `npm run smoke:locked-icons` when touched
- After changes: `npm run build` must PASS

## MCP (optional)

- **Figma MCP** in `.cursor/mcp.json` — capture routes via `scripts/figma-batch-open.mjs`
- **Playwright MCP** — browser verify `/dev/theme-lab` and locked UX public gates

## Smoke

```bash
npm run build
npm run smoke:locked-icons   # if icons touched
npm run smoke:design-modules
npm run test:e2e:locked-ux   # browser render gate (optional)
```

## Agent delegate

For full autonomous variant work, delegate to `.cursor/agents/specialist-theme-lab.md`.
