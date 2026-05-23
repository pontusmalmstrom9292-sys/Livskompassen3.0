# Ekonomi

**Route:** `/vardagen?tab=ekonomi` (redirect från `/ekonomi`) · **Dock:** Map

Kognitiv avlastning: veckopeng, matlåda, stämpelklocka, lön — **inga grafer**.

## Status (2026-05-23, Fas 0–3)

| Klart |
|-------|
| Stämpelklocka + flex (Fas 1) |
| Lön/skatt/lönespec (Fas 2) |
| **Vardagen:** flikar **Tid · Pengar · Logg** (Fas 3) |
| Periodsammanfattning, lönespec-kort, ledger/fasta i Logg |
| Valv (PIN): frånvaro + tidshistorik |

## Firestore

| Collection | Syfte |
|------------|--------|
| `transactions` | WORM — veckopeng, matlåda |
| `time_entries` | Stämpelklocka |
| `economy_ledger` | Utgift/inkomst-logg |
| `economy_fixed_bills` | Fasta räkningar |
| `payslip_snapshots` | WORM lönespec |
| `economy_profiles/{uid}` | Profil |

**Spec:** [`docs/specs/modules/Ekonomi-SPEC.md`](../../docs/specs/modules/Ekonomi-SPEC.md)
