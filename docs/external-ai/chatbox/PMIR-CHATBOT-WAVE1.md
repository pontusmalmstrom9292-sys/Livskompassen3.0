# PMIR — ChatBox våg 1 (utkast)

Kort Pre-Merge Impact Report enligt [`docs/MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md).  
**Ingen merge krävs** för docs-only CP-7 — utkast om Pontus senare cherry-pickar från annan branch.

## Följer med (behåll)

- G10 Inkast backend + CapturePanel UI (CP-3/4)
- Synapse idempotens journal/dcap (CP-5)
- App Check kod + Console Enforce (CP-6)
- Kanon-docs: SECURITY-LOCK, SYNAPSE-LOCK, UPLOAD-UNIFIED, DEPLOY-WAVE, APPCHECK-GUIDE, LIFE-OS-CORE-LOCKED
- ChatBox bifoga-struktur + `npm run chatbot:sync:bifoga`

## Försvinner / ändras inte

- `firestore.rules` — **ej ändrat** i våg 1
- Locked UX-komponenter — **oförändrade**
- MåBra 19.2–19.5 — **DEFER**, ingen kod

## Regelanalys

| Regel | Status |
|-------|--------|
| Tre silos U1 | PASS |
| WORM | PASS |
| Locked UX §11–17 | PASS — smoke:locked-ux |
| Fas 19 gate | Ingen mass-städ körd |
| git-main-trunk | Utveckling på `main` |

## Smoke (2026-06-15 CP-7)

- `smoke:orkester` PASS
- `smoke:locked-ux` PASS

## Pontus beslut

- [ ] Godkänn CP-7 FINAL som dokumenterad
- [ ] Kör snapshots: inkast, synapser
- [ ] Godkänn HYGIENE-LOG archive-flytt (valfritt, senare)
