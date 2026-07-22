# Arbetsliv-modulhub — 2026-05-25

## Mål

Hela arbetslivsfunktionen (stämpel, flex, sjuk/VAB, lönespec) som **egen hub** — inte under Valv-flik.

## Leverans

| Del | Route / zon |
|-----|-------------|
| Hub | `/arbetsliv` — flikar Stämpel, Tid, Frånvaro, Lön, Logg |
| Redirect | `/stampla` → `/arbetsliv?tab=stampla` |
| PIN | `arbetsliv_forensic` på Frånvaro + Lön |
| Vardagen | Enkel `EconomyPage` (veckopeng/matlåda) + länk till hub |
| Backend | `generatePayslip`, `scheduledGeneratePayslip`, WORM `payslip_snapshots` |
| Meny | Sidomeny **Arbetsliv** (ersätter Stämpla-rad) |

## Smoke

- `npm run build` — PASS
- `npm run smoke:locked-ux` — PASS
- `npm run smoke:orkester` — PASS (inkl. arbetsliv + payslip rules)

## Deploy

Efter merge: `firebase deploy --only functions:generatePayslip,functions:scheduledGeneratePayslip,firestore:rules`
