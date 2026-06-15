# Fas 5C — Inkorg produktbeslut (2026-05-31)

**Källor:** `archive/inkorg-*` taggar · [`2026-05-31-inkorg-cherry-pick-log.md`](./2026-05-31-inkorg-cherry-pick-log.md)

---

## Beslut (kanon)

| ID | Beslut | Motivering |
|----|--------|------------|
| **I1** MåBra frågekort | **DEFER** | `KbtTransformatorPanel` + verktyg live; U6 kräver bank/PMIR före nya REFLECTION-kort |
| **I3** Barnen `LivsloggQuestionCard` | **DEFER** | Locked `BarnfokusFraganPanel` — risk dublett i Familjen |
| **I2** Visa brus | **PORT** 2026-05-31 | `BiffTriagePanel` + CSS |
| **I4** Chattbubblor | **PORT** 2026-05-31 | `vaultChat` |
| **I5** Hub-tile CSS | **REJECT** | Designbeslut |

---

## När du vill port I1 eller I3

1. Skriv PMIR enligt [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md)
2. `git show archive/inkorg-mabra:src/modules/mabra/...` (eller `archive/inkorg-barnen`)
3. Port till `wellbeing/mabra/` respektive `family/children/`
4. `npm run smoke:locked-ux` · `smoke:innehall` om innehåll

**Dirigent:** `specialist-innehall-dirigent` före nytt FACT/REFLECTION i prod.
