# Valv-Chat

**Route:** `/valvet?vaultTab=sok` (efter PIN) · **Legacy:** `/dagbok?tab=bevis&vaultTab=sok` · **AuthGate:** ja · **Valv unlock:** ja · **Ej i dock**  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm)  
**Spec:** [`docs/specs/modules/Valv-Chat-SPEC.md`](../../docs/specs/modules/Valv-Chat-SPEC.md)

## Syfte

Forensiskt sökverktyg **inuti Verklighetsvalvet** — frågor mot WORM `reality_vault` med källhänvisningar. Zero Footprint: ingen sparad chatt.

## Skillnad mot Kunskap

| | **Valv-Chat** | **Kunskapsvalvet** |
|---|---------------|---------------------|
| Route | `/valvet?vaultTab=sok` | `/valvet?vaultTab=kunskapsbank` |
| Data | `reality_vault` | `kampspar` + `kb_docs` |
| Callable | `valvChatQuery` | `knowledgeVaultQuery` |
| Agent | Sannings-Analytikern | Livs-Arkivarien / Mönster-Arkivarien |

## UI (idag)

- `ValvChatPanel` i `VaultPage` (Sök-flik / zone *Spara & sök*)
- `useValvChatSession` — nollställ när `active=false` eller unmount

## Backend

- `fetchVaultEvidenceForQuery` (token-match, exkl. `vävaren_metadata`)
- JSON `{ answer, citations[] }` — citations **ej klickbara** än

## Status

| Klart | Planerat |
|-------|----------|
| valvChatQuery, ValvChatPanel, session reset | Klickbara citations |

Kod: `src/modules/features/lifeJournal/evidence/vaultChat/` · Förälder: [`verklighetsvalvet.md`](verklighetsvalvet.md)
