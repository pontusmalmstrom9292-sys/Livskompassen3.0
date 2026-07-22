# valv_chatt — module plan

## Overview

Valv-Chat — forensisk fråga/svar mot `reality_vault` (WORM). **Skild från** `/kunskap` KnowledgeVaultChat.

**Ingång:** flik *Sök* i upplåst Verklighetsvalvet (`/valvet?vaultTab=sok`)

Canonical: `.context/modules/evidence/vaultChat.md` · Spec: `docs/specs/modules/Valv-Chat-SPEC.md`

## Files

| Path | Role |
|------|------|
| `components/ValvChatPanel.tsx` | Fråga, laddning, svar, källor |
| `api/valvChatService.ts` | Callable wrapper |
| `hooks/useValvChatSession.ts` | Ephemeral state + cleanup |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| ValvChatPanel (Sök-flik) | Forensik only | Ja | **done** |
| `valvChatQuery` + citations | Sannings-Analytikern | Ja | **done** |
| Session Zero Footprint | RAM only | Ja | **done** |
| Exkl. vävaren_metadata | Tills godkännande | Ja | **done** |
| Klickbara citations | Kladd | Nej | **planned** |
| Sanningens Ankare pin | §I.3 fas 2 | Nej | **planned** |
| Bro Speglar → processa | | Nej | **planned** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Security notes

- Kräver AuthGate + valv unlocked
- Inga chattloggar i Firestore
- Citations måste peka på verkliga `reality_vault` docIds
