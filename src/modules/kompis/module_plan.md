# kompis — module plan

## Overview

User-facing AI navigator: visual identity (avatar, tidshjul), Knowledge Vault chat UI, and callable wrapper to `knowledgeVaultQuery` Cloud Function.

## Files

| Path | Role |
|------|------|
| `components/KompisAvatar.tsx` | Animated agent avatar (states, sizes) |
| `components/Tidshjulet.tsx` | Time wheel visualization (Kampspår) |
| `components/KnowledgeVaultChat.tsx` | Chat form → AI response |
| `api/knowledgeVaultService.ts` | `httpsCallable` to `knowledgeVaultQuery` |
| `types/kompis.ts` | Kompis state, Kampspår, SubSynaptic data |

## Status

| Area | Status |
|------|--------|
| KompisAvatar | **works** — shown in MainLayout |
| KnowledgeVaultChat | **partial** — UI works; needs auth + deployed function |
| Tidshjulet | **missing** — component exists, not routed |
| Supervisor / DCAP routing | **backend** — `functions/src/agents/kompis-supervisor.ts` |

## Dependencies

- `core/firebase/init`
- Backend: `knowledgeVaultQuery`, KompisSupervisor, Agent Cards

## Next steps

1. Route Tidshjulet into home or dedicated Kampspår view.
2. Bind avatar state to store (`kompisAuraActive`, analyzing, etc.).
3. Replace Knowledge Vault stub with full Kompis chat + BIFF handoff.
4. Require Firebase Auth before callable invocations.

## Security notes

- `knowledgeVaultQuery` is auth-protected server-side — client must sign in.
- No prompts or secrets in frontend; system prompt lives in `functions/src/sharedRules.ts`.
