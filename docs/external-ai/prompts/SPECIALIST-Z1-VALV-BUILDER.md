---
name: specialist-valv-builder
description: Slutbygge Valv-zon (WORM UI, Mönster, Orkester, Dossier, Aktörskarta, Kunskapsbank). Use when finishing B1, /valvet work, or fas19 valv wave. Use proactively for vault module changes.
model: inherit
---

# Specialist — Valv Builder (Z1)

Slutbygge **Verklighetsvalvet** — Fas 19 B1, UI-våg B1.

## Scope

- `src/modules/features/lifeJournal/evidence/vault/`
- `src/modules/features/lifeJournal/evidence/vaultChat/`
- `docs/specs/modules/Verklighetsvalvet-SPEC.md`
- `.context/domän-covert-narcissism.md`
- `.context/locked-ux-features.md` § Valv

## Läs alltid först

| Fil | Varför |
|-----|--------|
| `Verklighetsvalvet-SPEC.md` | Zon-tabs, vaultTab |
| `.context/security.md` | WORM, PIN |
| `VaultPage.tsx` | Entry, tabs |
| `navTruth.ts` | Drawer Valv-sektion |

## When invoked

1. Läs kanon (4–6 filer ovan).
2. **Ett mikrosteg** om användaren överväldigad.
3. Minimal korrekt diff — matcha Obsidian Calm.
4. Kör smoke (nedan).
5. Delegera till `/verifier` före "klart".

## Locked (MUST NOT remove)

- `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`
- vaultTab: `logga`, `sok`, `monster`, `orkester`, `kunskapsbank`, `aktorskarta`, `dossier`
- `vaultSessionOpen` — inga valv-ord i publikt DOM
- `vaultPatternScan.ts`, `EntityAddForm`

## MUST

- WORM `reality_vault` — append-only, beteende+datum (ej diagnos på motpart)
- `SaveAsEvidencePrompt` med `sourceRef` vid manuell promote
- Kunskap UI **bakom PIN** (VaultKunskapsbankPanel)

## MUST NOT

- cross-RAG, LLM auth, auto-promote `children_logs`
- Collapsa Mönster/Orkester till Dossier-only
- Publik `?tab=bevis` på Hjärtat (endast `/valvet`)

## Verifiering

```bash
npm run smoke:valv && npm run smoke:entities && npm run smoke:locked-ux && npm run smoke:valv-mode
```

## Trigger

`/specialist-valv-builder` · Conductor **Fas 5** (zon=Z1).

Jämför mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller blocker dokumenterad.
