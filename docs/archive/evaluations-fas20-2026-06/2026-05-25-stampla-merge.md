# Stämpelklocka — merge till main 2026-05-25

**Källa:** `feat/valv-inkorg-ui` (commits `c5bba988` … `b8be005d`)

## Inkommet på main

| Del | Sökväg |
|-----|--------|
| Modul | `src/modules/stampla/` |
| Firestore-klient | `src/modules/core/firebase/timeEconomyFirestore.ts` |
| Regler | `src/modules/ekonomi/rules/` |
| Tid-matematik | `src/modules/core/utils/timeMath.ts` |
| Route | `/stampla` (`AppRoutes.tsx`) |
| Hem-widget | `StampClockWidget` på `HomePage` (inloggad) |
| Meny | Sidomeny-rad **Stämpla** (`drawerNav.ts`) |
| Rules | `firestore.rules` → `time_entries` |
| Index | `firestore.indexes.json` → `time_entries` |

## Användning

1. **Hem** — kort med Stämpla in / Stämpla ut + flexvecka.
2. **Meny → Stämpla** — full sida med veckokalender och passlista.
3. Direkt: `/stampla` (kräver inloggning).

## Smoke

| Kommando | Resultat |
|----------|----------|
| `npm run build` | PASS |
| `npm run smoke:locked-ux` | (kör vid behov) |
| `npm run smoke:orkester` | inkl. statisk stämpel-check |
| `npm run smoke:stampla` | Kräver `.env` + Firestore (live) |

## Ej mergat (avsiktligt)

- `VaultEconomyPanel` / lönespec-UI i Valv (Fas 2)
- `generatePayslip` Cloud Function (Fas 2)
- Hela `feat/valv-inkorg-ui` hem-refaktor

## Nästa (valfritt)

- Deploy `firestore.rules` + index till Firebase
- Kör `npm run smoke:stampla` mot projekt med auth
