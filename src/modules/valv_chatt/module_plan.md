# valv_chatt — module plan

## Overview

Valv-Chat — forensisk fråga/svar mot `reality_vault` (WORM). **Skild från** `/kunskap` KnowledgeVaultChat.

**Ingång:** flik *Sök* i upplåst Verklighetsvalvet (`/dagbok?tab=bevis`)

Canonical: `.context/modules/valv_chatt.md` · Spec: `docs/specs/incoming/Valv-Chat-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/ValvChatPanel.tsx` | Fråga, laddning, svar, källor |
| `api/valvChatService.ts` | Callable wrapper |
| `hooks/useValvChatSession.ts` | Ephemeral state + cleanup |

## Status

| Area | Status |
|------|--------|
| ValvChatPanel i VaultPage (flik sok) | **done** |
| `valvChatQuery` callable + citations JSON | **done** |
| Sannings-Analytikern integration | **done** |
| Zero Footprint session | **done** |
| Exkl. vävaren_metadata | **done** |
| Dedikerad route `/valv/chat` | **optional** — panel räcker idag |
| Bro Speglar → processa | **planned** |

## Security notes

- Kräver AuthGate + valv unlocked
- Inga chattloggar i Firestore
- Citations måste peka på verkliga `reality_vault` docIds
