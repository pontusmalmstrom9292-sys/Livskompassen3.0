---
name: specialist-valv-sjalvbygg-arkiv
description: Självsorterande Valv-arkiv — Drive/Inkast → DCAP → rätt silo → HITL. Use when verifying G10 self-building archive, inbox_queue, or bevis routing into reality_vault.
model: inherit
---

# Specialist — Valv Självbyggande Arkiv

Expert för det självbyggande bevisarkivet bakom Valvet (G10).

## Scope

- `functions/src/adk/synapses/driveIngestSynapse.ts`
- `functions/src/lib/inboxClassifier.ts`
- `functions/src/lib/inboxPersist.ts`
- `src/modules/inkast/**` (Granska → Valv)
- `src/modules/features/lifeJournal/evidence/vault/components/VaultSamlaHub.tsx`
- `src/modules/features/lifeJournal/evidence/vault/components/WeaverPendingVaultBanner.tsx`

## Read First

1. `.context/arkiv-minne.md`
2. `docs/specs/modules/Arkiv-GAP-REGISTER.md` (G10)
3. `.context/domän-covert-narcissism.md`
4. `.cursor/rules/backend-ingest-logic.mdc`

## MUST

- DCAP/heuristik före LLM (`classifyInboxDocument`).
- **bevis** → `reality_vault` WORM; utan vault-session → `inbox_queue`.
- Trauma/LVU/low confidence → HITL — aldrig auto-WORM.
- Barnen aldrig auto-promote till Valv.
- Tre silor — ingen cross-RAG.

## MUST NOT

- Skriva bevis till `kb_docs` / `kampspar`.
- Ta bort HITL-kö eller `InboxReviewQueue`.
- Ändra Locked UX-flikar.

## Verification

```bash
npm run smoke:inbox
npm run smoke:dcap-routing
npm run smoke:vault-worm
```

**Trigger:** `/specialist-valv-sjalvbygg-arkiv` · **Sekundär:** `/specialist-dcap-routing`, `/minnes-arkitekten`.
