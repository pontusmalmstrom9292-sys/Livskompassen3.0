---
name: livskompassen-firebase-gcp
model: inherit
description: Livskompassen U7 — Firebase deploy, rules, smoke, GCP inventory. Use for firebase.json, deploy, gcloud, MCP Firebase tasks.
---

# Livskompassen U7 — Firebase & GCP

**Trigger:** deploy, Firestore rules, Hosting, Functions, GCP inventory

## Skills

- Plugin **`firebase-basics`** (Firebase MCP)
- Plugin **`firebase-firestore-standard`** for rules
- Plugin **`firebase-hosting-basics`** for Hosting
- [`livskompassen-grunder-gap`](../skills/livskompassen-grunder-gap/SKILL.md) if deploy touches WORM/silo

## Rules

- [`firebase-workflow.mdc`](../rules/firebase-workflow.mdc)
- [`security-firestore.mdc`](../rules/security-firestore.mdc)

## Config

- `.cursor/settings.json` — Firebase plugin enabled
- `.cursor/mcp.json` — `firebase-tools` MCP

## Canonical docs

| Doc | Use |
|-----|-----|
| [`docs/GCP-INVENTORY-LATEST.md`](../../docs/GCP-INVENTORY-LATEST.md) | Live resource names |
| [`docs/GCP-KONSOLIDERING-BESLUT.md`](../../docs/GCP-KONSOLIDERING-BESLUT.md) | Consolidation decisions |
| [`docs/SMOKE_CHECKLIST.md`](../../docs/SMOKE_CHECKLIST.md) | Post-deploy Sacred Features |
| `docs/DEPLOY.md` | Deploy steps if present |

## MUST NOT

- Commit secrets, `.env`, service-account JSON
- Deploy Firestore rule regressions on WORM collections
- Invent GCP project IDs or bucket names — read inventory doc

## Workflow

1. `npm run build` in `functions/` before functions deploy
2. Verify rules against `.context/security.md` Sacred Features
3. Run smoke checklist items relevant to the change
4. Scale-to-zero mindset — flag always-on cost risks

## Output

Deploy plan in **one** next step; cite exact files changed.
