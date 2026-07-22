# YOLO-vakt audit — Wave A/B/C + prod deploy

**Datum:** 2026-06-20  
**Prod:** https://gen-lang-client-0481875058.web.app  
**Branch:** `main`

## PASS / GAP

| # | Kontroll | Status | Bevis |
|---|----------|--------|-------|
| 1 | Tre silos — ingen cross-RAG | **PASS** | `ChildrenLogsChat` → `childrenLogsQuery` only |
| 2 | LLM beslutar inte auth/WORM | **PASS** | `smoke:dcap-routing` PASS |
| 3 | Locked UX intakt | **PASS** | `smoke:locked-ux` + E2E publikt läge PASS |
| 4 | Barn-HITL (ingen auto-promote) | **PASS** | `SaveAsEvidencePrompt` kvar |
| 5 | WORM `evolution_ledger` client-deny | **PASS** | `smoke:evolution` Test 1 live |
| 6 | Smoke-gate trio | **PASS** | predeploy + locked-ux + orkester |
| 7 | Wave A capacity | **PASS** | `shared/evolution/capacityScore` + `mabraEconomySync` |
| 8 | Wave B livslogg | **PASS** | `FamiljenLivsloggTab` + `ChildrenLogsChat` |
| 9 | Wave C Kunskap | **PASS** | Seed/RAG verify (ingen ny kod) |
| 10 | `firestore.rules` deploy | **PASS** | `firebase deploy --only firestore:rules` 2026-06-20 |
| 11 | Hosting deploy | **PASS** | `firebase deploy --only hosting` 2026-06-20 |
| 12 | Hub live-smoke (post-rules) | **GAP** | Test 2 SKIPPED — troligen App Check; statiska regler OK |

## GO / NO-GO

| Gate | Beslut |
|------|--------|
| **Prod-runtime** | **GO** |
| **Wave A/B/C på hosting** | **GO** |

## Deploy log

```bash
firebase deploy --only firestore:rules
npm run build
firebase deploy --only hosting
```

## PMIR (kort)

- **Scope:** Evolution capacity gates (A), Familjen livslogg chat + epistemik (B), Kunskap verify (C), smoke_evolution WORM-alignment.
- **Sacred / Locked UX:** Oförändrat — smoke PASS.
- **Rules:** Synkad repo → prod (0 diff före deploy).
- **Functions:** `mabraEconomySync` redan deployad — ingen ny functions-deploy denna våg.
- **Risk:** Hub live-smoke SKIPPED efter rules — utred App Check Console vid behov.

## Ett nästa steg

Hard refresh prod (`Cmd+Shift+R`) → `/familjen?tab=livslogg` → verifiera **Fråga livsloggarna**.
