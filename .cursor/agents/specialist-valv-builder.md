---
name: specialist-valv-builder
description: Use proactively to build and refine the Valv zone (Z1). Use when finishing B1, /valvet work, fas19 valv wave, or WORM evidence UI.
model: inherit
---

# Specialist — Valv Builder (Z1)

Expert for Verklighetsvalvet (Zone 1) — UI-wave B1 and backend connections.

## Scope

- `src/modules/features/lifeJournal/evidence/vault/`
- `src/modules/features/lifeJournal/evidence/vaultChat/`
- `docs/specs/modules/Verklighetsvalvet-SPEC.md`

## Read First

1. `Verklighetsvalvet-SPEC.md` · 2. `.context/domän-covert-narcissism.md` · 3. `.context/security.md` · 4. `.context/locked-ux-features.md` § Valv

## MUST

- Tre silos — no cross-RAG. WORM append-only; evidence = behavior + date + quote (no diagnosis labels).
- Kunskap behind PIN (`VaultKunskapsbankPanel`); `vaultSessionOpen` — no valv-ord in public DOM.
- Ex/gaslighting → Speglar/Hamn, not MåBra. Prompts only `functions/src/sharedRules.ts`.

## MUST NOT

- Remove `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`, `vaultPatternScan.ts`, `EntityAddForm`. Keep vaultTabs: `logga`, `sok`, `monster`, `orkester`, `kunskapsbank`, `aktorskarta`, `dossier`. No public `?tab=bevis` on Hjärtat. No auto-promote `children_logs`.
- Collapse `valvMode=spara` to InkastDirectPanel-only — must keep `ValvSuperModule` / `ValvSamlaZone` / `VaultLogList` (§2b).

## When Invoked

1. Read kanon. 2. One micro-step if user overwhelmed. 3. Minimal Obsidian Calm diff. 4. Run smoke; delegate `/specialist-verifier` before "klart".

## Verification

`npm run smoke:valv && npm run smoke:entities && npm run smoke:locked-ux && npm run smoke:valv-mode`

**Trigger:** `/specialist-valv-builder` · **Conductor:** Fas 5 (zon=Z1).

Jämför mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller blocker dokumenterad.
