# K2 — Valv (Cursor-granskat svar)

**Datum:** 2026-06-06  
**Bas:** Upload Fas 2 + befintlig `VaultSamlaHub`

## Gap-tabell

| Del | Beslut | Skäl |
|-----|--------|------|
| InboxReviewQueue i VaultSamlaHub | KEEP | Canonical granskningskö |
| InboxReviewQueueLink (Planering/Kunskap) | KEEP | Länk, inte duplikat mount |
| VaultInkastCompact → CaptureSuper | KEEP | Fas 1 done |
| Mönster/Orkester/Kunskapsbank | KEEP | Locked UX |

## Fas 1

- Granskningskö endast i Valv Samla (`samlaView=granska`)
