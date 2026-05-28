# valv_chatt

> Forensiskt sökverktyg inuti Verklighetsvalvet — frågor mot WORM `reality_vault`.

## Syfte

Sök med källhänvisningar (Sannings-Analytikern). Zero Footprint: ingen sparad chatt. **Skild från Kunskapsvalvet** (`kampspar` + `kb_docs`).

## Route och ingång

| | |
|---|---|
| **Route** | flik **Sök** i `/dagbok?tab=bevis` (efter PIN) |
| **AuthGate** | ja |
| **Valv unlock** | ja |
| **Dock** | ej i dock |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/ValvChatPanel.tsx` | Fråga, svar, källor |
| `api/valvChatService.ts` | `valvChatQuery` wrapper |
| `hooks/useValvChatSession.ts` | Ephemeral state + cleanup |

**Förälder-UI:** `verklighetsvalvet/components/VaultPage.tsx`

## Data

- **Läser:** `reality_vault` (exkl. `vävaren_metadata`)
- **Skriver:** inget

**Callable:** `valvChatQuery` → JSON `{ answer, citations[] }`

## Beror på

- `core` — auth
- `verklighetsvalvet` — inbäddad i VaultPage Sök-flik

## Kopplingar

| | Valv-Chat | Kunskap |
|---|-----------|---------|
| Data | `reality_vault` | `kampspar` + `kb_docs` |
| Callable | `valvChatQuery` | `knowledgeVaultQuery` |
| Route | Bevis → Sök | `/vardagen?tab=kunskap` |

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | läser `reality_vault` only |
| **RAG / chatt** | Ja — `valvChatQuery`, Sannings-Analytikern (**ej deployad**) |
| **PDF / samlad export** | — (→ Dossier) |
| **Planerat** | — |

**MUST NOT:** barnfrågor eller `kampspar` här.

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/evidence/vaultChat.md)
- [Valv-Chat-SPEC](../../../docs/specs/modules/Valv-Chat-SPEC.md)
- [verklighetsvalvet README](../evidence/vault/README.md)
