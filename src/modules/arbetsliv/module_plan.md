# Arbetsliv — modulhub

**Route:** `/arbetsliv` · **Redirect:** `/stampla` → `?tab=stampla`

| Flik | Innehåll | PIN |
|------|----------|-----|
| Stämpel | `StampClockPage` | Nej |
| Tid & flex | `EconomyTidPanel` | Nej |
| Frånvaro | `VaultEconomyPanel` (sjuk, VAB, manuella pass) | Ja (`arbetsliv_forensic`) |
| Lön & spec | Periodsammanfattning + `generatePayslip` | Ja |
| Logg | `EconomyLogPanel` (ledger) | Nej |

**Zon:** `arbetsliv_forensic` — samma PIN som Valv, separat session.

**Backend:** `functions` `generatePayslip`, `payslip_snapshots` (WORM), `time_entries`.
