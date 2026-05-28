# kompis — module plan

**Canonical spec:** [`docs/specs/modules/Kunskap-SPEC.md`](../../docs/specs/modules/Kunskap-SPEC.md) · **Context:** [`.context/modules/evidence/kompis.md`](../../.context/modules/evidence/kompis.md)

## Overview

User-facing AI navigator: KompisAvatar, Knowledge Vault chat (Minne RAG), Tidshjulet, Minne ingest.

**Route:** Valv PIN → `/dagbok?tab=bevis&vaultTab=kunskapsbank` (legacy `/kunskap` och `?tab=kunskap` redirect hit)

## Files

| Path | Role |
|------|------|
| `components/KompisAvatar.tsx` | Header avatar (analyzing/idle) |
| `components/KunskapPage.tsx` | Tabs: Kunskapsvalv + Tidshjulet |
| `components/Tidshjulet.tsx` | Minne-noder från Firestore |
| `components/KampsparIngestForm.tsx` | Lägg till i Minne |
| `components/KnowledgeVaultChat.tsx` | Chat + citations |
| `api/knowledgeVaultService.ts` | `knowledgeVaultQuery` |
| `api/kampsparService.ts` | `ingestKampsparEntry` |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| Kunskapsvalv RAG | Metod, ej forensik | Ja | **done** |
| Tidshjulet + ingest | Opt-in trauma | Ja | **done** |
| Drive G10 multi-silo | Auto klassificering | Ja | **done** — `kb_docs` \| `reality_vault` \| `children_logs` \| `inbox_queue` |
| Minne från Kladd-filer | **Avvisat** auto | Nej | **policy** |
| Klickbara citations | Kladd | Ja | **done** — `KnowledgeCitationList`, Tidshjul-highlight |
| Vector Search ANN | G2/G3 | Ja | **done** — se [`Arkiv-GAP-REGISTER.md`](../../docs/specs/modules/Arkiv-GAP-REGISTER.md) |
| Dagbok auto → kampspar | Ej valv; journal_woven opt-in | Delvis | **policy** — Vävaren→`reality_vault`; opt-in→`kampspar` (G7) |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md) · [`Kladd-2026-05-21-kampspar-kandidater.md`](../../docs/archive/kladd/Kladd-2026-05-21-kampspar-kandidater.md)

## Dependencies

- `core/firebase/firestore` — `getKampsparEntries`
- Backend: `knowledgeVaultQuery`, `ingestKampsparEntry`, `generateEmbedding`

## Security notes

- Callables auth-protected server-side
- Prompts i `functions/src/sharedRules.ts` only
- Skild från Valv-Chat (`reality_vault` only)

## Kladd-insamling

Se [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md) och [`ai-prompts-kladd-kampspar.md`](../../docs/specs/ai-prompts-kladd-kampspar.md).
