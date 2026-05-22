# Modul — valv_chatt

**Route:** Inbäddad i Bevis (Dagbok tab) | **Callable:** `valvChatQuery` | **Collection:** `reality_vault` only

## PASS

- `valvChatService.ts` → `valvChatQuery` med citations JSON
- `useValvChatSession` Zero Footprint session
- G1 deploy **done**; smoke:valv PASS
- Silo isolerad från `knowledgeVaultQuery`

## GAP

- README "ej deployad" — **föråldrat**
- Kräver vault unlock (client) — samma gate-GAP som valv

## Sacred / säkerhet

Endast Valv-silo. **PASS** i backend RAG.

## Rekommenderat

Uppdatera `src/modules/valv_chatt/README.md` deploy-status.
