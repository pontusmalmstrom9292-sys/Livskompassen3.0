# valv_chatt — module plan

## Overview

Valv-Chat — forensisk fråga/svar mot `reality_vault` (WORM). **Skild från** `/kunskap` KnowledgeVaultChat.

Route planerad: `/valv/chat` (ingång endast från upplåst `/valv`)

Canonical: `.context/modules/valv_chatt.md` · Spec: `docs/specs/incoming/Valv-Chat-SPEC.md`

**Ingen kodmapp än** — implementera under `src/modules/valv_chatt/` eller som underkomponent av `verklighetsvalvet/` vid "kör".

## Befintliga byggstenar (andra moduler)

| Resurs | Plats | Användning för Valv-Chat |
|--------|-------|--------------------------|
| `getVaultLogs(uid)` | `core/firebase/firestore.ts` | Läsa WORM-bevis |
| `matchVaultEvidence` | `speglings_system/utils/` | Token-match + vävaren-filter (referens) |
| Valv unlock | `VaultPage`, `hasVaultGate`, store | Gate före chat |
| Sannings-Analytikern | `functions/.../cards/` | Agent card — ej wired |

## Inte att blanda ihop

| | Valv-Chat | Kunskap |
|---|-----------|---------|
| Route | `/valv/chat` | `/kunskap` |
| UI | **saknas** | `KnowledgeVaultChat.tsx` |
| Callable | **planerad** | `knowledgeVaultQuery` |
| Data | `reality_vault` | Kampspår / generisk prompt |

## Status

| Area | Status |
|------|--------|
| Route `/valv/chat` | **planned** |
| "Sök i Valvet"-knapp i VaultPage | **planned** |
| Chat UI (fråga/svar/källor) | **planned** |
| `valvChatQuery` callable + citations JSON | **planned** |
| Sannings-Analytikern integration | **planned** |
| Zero Footprint session | **planned** |
| Exkl. vävaren_metadata | **planned** (match Speglar) |
| Bro Speglar → processa | **planned** |

## Planerade filer (vid implementation)

| Path | Role |
|------|------|
| `components/ValvChatPage.tsx` | Fråga, laddning, svar, källor |
| `api/valvChatService.ts` | Callable wrapper |
| `hooks/useValvChatSession.ts` | Ephemeral state + cleanup |

## Security notes

- Kräver AuthGate + `isVaultUnlocked` / `hasVaultGate`
- Inga chattloggar i Firestore
- Citations måste peka på verkliga `reality_vault` docIds — LLM får inte auktoritet utan bevis

## Nästa fas (implementera när användaren säger kör)

1. Backend: `valvChatQuery` med vault-scoped context + `{ answer, citations }`  
2. Frontend route + VaultPage-knapp  
3. Zero Footprint unmount  
4. Dokumentera i `kompis/module_plan.md` att Kunskap ≠ Valv-Chat  
