# LIFE-OS-CORE-LOCKED (utkast)

Fylls i vid CHECKPOINT-7. Komponenter med **LOCK** får inte refaktoreras utan explicit Pontus-OK + snapshot.

## Locked vid CHECKPOINT-1 (2026-06-15)

| Komponent | Smoke |
|-----------|-------|
| WORM (reality_vault, children_logs, journal, evolution_ledger, dossier_snapshots) | CP-1 |
| Dual vault gate (JWT + vaultSessionGate) | valv-security PASS |
| callableGuards + App Check kod | valv-security PASS |
| SynapseBus 4 triggers + silo-routing | pre-existing |
| routeFromDcap / resolveExecutorId | pre-existing |
| Locked UX §11–17 | locked-ux PASS |

## Pre-locked (före ChatBox-våg)

| Komponent | Sedan | Smoke |
|-----------|-------|-------|
| G10 Inkast | 2026-06-06 | smoke:inkast PASS |
| SynapseBus (4 triggers) | 2026-05-22 | smoke:orkester |
| WORM collections | firestore.rules | smoke:vault-worm |

## Locked under våg (lägg till vid CHECKPOINT)

| Komponent | CHECKPOINT | Datum |
|-----------|------------|-------|
| — | — | — |

## Sacred (aldrig utan PMIR)

- Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier, Speglar, Zero Footprint
- Tre silos — ingen cross-RAG
- Locked UX §11–17 (Barnfokus, Valv Mönster/Orkester, P3 Kanban, Barnporten)
