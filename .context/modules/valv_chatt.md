# Valv-Chat

**Route:** flik **Sök** i `/dagbok?tab=bevis` (efter PIN) · **AuthGate:** ja · **Valv unlock:** ja · **Ej i dock**  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm)  
**Spec:** [`docs/specs/incoming/Valv-Chat-SPEC.md`](../../docs/specs/incoming/Valv-Chat-SPEC.md)

## Syfte

Forensiskt sökverktyg **inuti Verklighetsvalvet** — frågor mot WORM `reality_vault` med källhänvisningar. Zero Footprint: ingen sparad chatt.

## Skillnad mot Kunskap

| | **Valv-Chat** | **Kunskapsvalvet** |
|---|---------------|---------------------|
| Route | Bevis → Sök-flik | `/vardagen?tab=kunskap` |
| Data | `reality_vault` | `kampspar` + `kb_docs` |
| Callable | `valvChatQuery` | `knowledgeVaultQuery` |
| Agent | Sannings-Analytikern | Livs-Arkivarien / Mönster-Arkivarien |

## UI (idag)

- `ValvChatPanel` i `VaultPage` (Sök-flik)
- `useValvChatSession` — nollställ när `active=false` eller unmount

## Backend

- `fetchVaultEvidenceForQuery` (token-match, exkl. `vävaren_metadata`)
- JSON `{ answer, citations[] }` — citations **ej klickbara** än

## Status

| Klart | Planerat |
|-------|----------|
| valvChatQuery, ValvChatPanel, session reset | Klickbara citations, ev. egen route `/valv/chat` |

## Kladd 2026-05-21

- **Roll:** Forensisk sök i `reality_vault` — skild från Kunskap (`kampspar`/`kb_docs`).
- **Gap:** Klickbara citations; Sanningens Ankare som pin-vy (fas 2, förälder Valv).
- **Policy:** Exkluderar `vävaren_metadata` tills godkännande-flöde.

Kod: `src/modules/valv_chatt/` · Förälder: [`verklighetsvalvet.md`](verklighetsvalvet.md) · **Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)
