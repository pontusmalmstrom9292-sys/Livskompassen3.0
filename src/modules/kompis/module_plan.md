# kompis — module plan

**Canonical spec:** [`docs/specs/incoming/Kunskap-SPEC.md`](../../docs/specs/incoming/Kunskap-SPEC.md) · **Context:** [`.context/modules/kompis.md`](../../.context/modules/kompis.md)

## Overview

User-facing AI navigator: KompisAvatar, Knowledge Vault chat (Kampspår RAG), Tidshjulet, Kampspår ingest.

**Route:** `/vardagen?tab=kunskap`

## Files

| Path | Role |
|------|------|
| `components/KompisAvatar.tsx` | Header avatar (analyzing/idle) |
| `components/KunskapPage.tsx` | Tabs: Kunskapsvalv + Tidshjulet |
| `components/Tidshjulet.tsx` | Kampspår-noder från Firestore |
| `components/KampsparIngestForm.tsx` | Lägg till i Kampspår |
| `components/KnowledgeVaultChat.tsx` | Chat + citations |
| `api/knowledgeVaultService.ts` | `knowledgeVaultQuery` |
| `api/kampsparService.ts` | `ingestKampsparEntry` |

## Status

| Area | Status |
|------|--------|
| KompisAvatar | **done** — MainLayout header |
| KnowledgeVaultChat | **done** — RAG + citations (backend deploy krävs) |
| Tidshjulet | **done** — bound to `kampspar` |
| Kampspår ingest | **done** — callable + form |
| Drive → kb_docs | **done** — backend persist i driveIngestSynapse |
| Supervisor / DCAP routing | **backend** — ej i Kunskap-UI |

## Dependencies

- `core/firebase/firestore` — `getKampsparEntries`
- Backend: `knowledgeVaultQuery`, `ingestKampsparEntry`, `generateEmbedding`

## Security notes

- Callables auth-protected server-side
- Prompts i `functions/src/sharedRules.ts` only
- Skild från Valv-Chat (`reality_vault` only)

## Kladd-insamling

Se [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md) och [`ai-prompts-kladd-kampspar.md`](../../docs/specs/ai-prompts-kladd-kampspar.md).
