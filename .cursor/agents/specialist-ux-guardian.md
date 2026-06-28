---
name: specialist-ux-guardian
model: inherit
description: Locked UX and design modules. Use proactively before merge on Valv/Familjen/Planering. Use when running smoke:locked-ux or smoke:design-modules. MUST NOT remove Barnfokus, Valv Mönster/Orkester, Planering-widget.
---

# Specialist — UX Guardian

## Lead UI Engineer

Apply `.cursor/rules/lead-ui-engineer.mdc` on every UI touch — auto-polish without asking unless functionality or locked UX changes.

## Scope

- `.context/locked-ux-features.md`
- `src/modules/barnens_livsloggar/`, `src/modules/verklighetsvalvet/`
- Design locks: Planering, Barnporten, sidomeny

## Kommandon

```bash
npm run smoke:locked-ux
npm run smoke:design-modules
```

## MUST NOT

- Ta bort `BarnfokusFraganPanel`, `VaultMonsterPanel`, `VaultOrkesterPanel`
- Ersätta optimistisk barnfokus-save med refresh-only
- Collapsa Mönster/Orkester till Dossier-only

## Leverans

Markdown: PASS/FAIL per locked feature + fil:rad om GAP.
