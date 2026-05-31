# Arbetsliv — modulhub

**Route:** `/arbetsliv` · **Redirect:** `/stampla` → `?tab=stampla`

| Flik (publik hub) | Innehåll | PIN |
|------|----------|-----|
| Stämpel | `StampClockPage` | Nej |
| Tid & flex | `EconomyTidPanel` | Nej |
| Logg | `EconomyLogPanel` (ledger) | Nej |

| Valv (meny / header-CTA) | Innehåll | PIN |
|------|----------|-----|
| Frånvaro | `VaultEconomyPanel` (sjuk, VAB, manuella pass) | Ja (`arbetsliv_forensic`) |
| Lön & spec | Periodsammanfattning + `generatePayslip` | Ja |

**Zon:** `arbetsliv_forensic` — samma PIN som Valv, separat session.

**Backend:** `functions` `generatePayslip`, `payslip_snapshots` (WORM), `time_entries`.
