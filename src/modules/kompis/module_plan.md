# kompis — module plan

**Canonical spec:** [`docs/specs/incoming/Kunskap-SPEC.md`](../../docs/specs/incoming/Kunskap-SPEC.md) · **Context:** [`.context/modules/kompis.md`](../../.context/modules/kompis.md)

## Overview

User-facing AI navigator: KompisAvatar, Knowledge Vault chat (Minne RAG), Tidshjulet, Minne ingest.

**Route:** `/vardagen?tab=kunskap`

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
| Drive → kb_docs | Auto kladd | Ja | **done** |
| Minne från Kladd-filer | **Avvisat** auto | Nej | **policy** |
| Klickbara citations | Kladd | Nej | **planned** |
| Vector Search ANN | Notebook | Nej | **planned** |
| Dagbok auto → kampspar | Ej valv | Nej | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md) · [`Kladd-2026-05-21-kampspar-kandidater.md`](../../docs/specs/incoming/Kladd-2026-05-21-kampspar-kandidater.md)

## Dependencies

- `core/firebase/firestore` — `getKampsparEntries`
- Backend: `knowledgeVaultQuery`, `ingestKampsparEntry`, `generateEmbedding`

## Security notes

- Callables auth-protected server-side
- Prompts i `functions/src/sharedRules.ts` only
- Skild från Valv-Chat (`reality_vault` only)

## Kladd-insamling

Se [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md) och [`ai-prompts-kladd-kampspar.md`](../../docs/specs/ai-prompts-kladd-kampspar.md).
