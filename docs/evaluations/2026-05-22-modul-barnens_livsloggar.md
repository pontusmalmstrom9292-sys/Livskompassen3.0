# Modul — barnens_livsloggar

**Route:** `/familjen` (redirect `/barnen`) | **Collections:** `children_logs` | **Callable:** `childrenLogsQuery`

## PASS

- WORM `children_logs` rules L39–43
- Kasper/Arvid, Balansmätare, fysiologi, JSON export
- `ChildrenLogsChat` + `childrenLogsService.ts` — silo RAG
- Spara som bevis → `reality_vault` med `sourceRef`
- G8 **done** — smoke:children

## GAP

- Client PIN gate — `BarnensPage.tsx` (samma mönster som valv)
- U5.5 routing guard **done** i backend — verifiera UI-koppling

## Sacred / säkerhet

Permanent minne **PASS**. Silo: **MUST NOT** `valvChatQuery` — **PASS**.

## Rekommenderat

`npm run smoke:children`. Manuell smoke #4.
