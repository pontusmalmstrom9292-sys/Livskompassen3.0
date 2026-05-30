# Manuell smoke — Sprint v2 (2026-05-29)

**Deploy:** firestore + storage rules **DONE** (prod) · hosting **DONE** 2026-05-30 (IA Våg 3)  
**Agent automatisk (2026-05-30):** build · locked-ux · orkester · kunskap dry-run 53 FACT **PASS**

## Checklista (browser — du verifierar)

| # | Test | Status | Anteckning |
|---|------|--------|------------|
| 1 | Auth | USER | |
| 2, 2b–2d | Dagbok sub-nav, handoff, bilaga | USER | deploy storage |
| 2e | Planering Regler-flik | USER | `planning_email_rules` |
| 3 | Valv PIN → post | USER | |
| 4, 19 | Familjen Barnfokus | USER | |
| 5 | Kompasser check-in | USER | |
| 6 | Hamn BIFF + Speglar-hint vid ex-text | USER | ny Våg 2 hint |
| 7 | Kunskapsbank RAG | USER | |
| 18 | Ekonomi veckopeng | USER | |
| 20 | Valv zoner Mönster/Orkester | USER | |
| 3b | Barnporten → children_logs HITL | USER | |

## Kod levererad denna sprint

- MåBra §5 `MabraSpeglarGuardHint` (coach, KBT, reframing)
- MåBra §3 `MabraVitProjectsPanel` + `?project=`
- IA Våg 2: Hamn Speglar-hint, Valv `HandoffBox` på logga
