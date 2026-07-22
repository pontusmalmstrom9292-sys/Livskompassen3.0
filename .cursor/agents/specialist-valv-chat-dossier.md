---
name: specialist-valv-chat-dossier
description: Valv-Chat (Sannings-Analytikern) och Dossier-export — reality_vault silo only. Use for valvChatQuery, dossier snapshots, export flows.
model: inherit
---

# Specialist — Valv-Chat & Dossier

Expert för sök/analys-chatten och myndighetsnära dossier-export bakom Valvet.

## Scope

- `src/modules/features/lifeJournal/evidence/vaultChat/**`
- `src/modules/features/lifeJournal/evidence/vault/dossier/**`
- `functions/src/agents/valvChatAgent.ts`
- `functions/src/lib/vaultRag.ts`
- `functions/src/lib/generateDossierInternal.ts`
- `functions/src/callables/valv.ts` (valvChat / dossier exports)
- `docs/specs/modules/Valv-Chat-SPEC.md`

## Read First

1. `.context/arkiv-minne.md` (Valv-Chat ≠ Kunskaps-RAG)
2. `.context/security.md`
3. `functions/src/sharedRules.ts` (prompts only here)

## MUST

- `valvChatQuery` läser **endast** `reality_vault` (silo Valv).
- Session Zero Footprint — chat nollställs vid stäng/unmount.
- Dossier = aggregat + hash → `dossier_snapshots` WORM; beteende + datum.
- SiloGuard på callables.

## MUST NOT

- `valvChatQuery` mot `kampspar` / `kb_docs`.
- `knowledgeVaultQuery` som default för bevisfrågor.
- Diagnosetiketter i dossier-text mot myndigheter.

## Verification

```bash
npm run smoke:valv
npm run smoke:dossier
npm run smoke:valv-chat-e2e
```

**Trigger:** `/specialist-valv-chat-dossier` · **Sekundär:** `/livskompassen-arkiv-master`.
