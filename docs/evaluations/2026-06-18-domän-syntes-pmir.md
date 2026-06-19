# Domän-syntes PMIR — 5 specialister (2026-06-18)

**Status:** Research klar · Fas 23 domän påbörjad

## P0
- DARVO kunskapFactId → cn-008 — DONE
- MB-REF-REST-01..03 — DONE
- Kunskap våg 31 seed — bank DONE, ingest efter Pontus
- App Check Console — Pontus manuellt

## 5 Pontus-beslut
1. Godkänn våg 31 ingest (`seed:kunskap-facts`)?
2. Parent fysio Alt A (`checkins` + `parent_physio`)?
3. App Check Enforce i Console?
4. Hamn wizard 22.4 hosting-deploy?
5. SKIP 22.3 nutrition rules tills PMIR?

## Smoke
npm run smoke:domän-specialister && npm run smoke:innehall && npm run build

---

## Godkännande (Pontus)

**Status:** GODKÄND 2026-06-18  
**Ingest:** `npm run seed:kunskap-facts` — 12 nya poster OK  
**SKIP:** 22.3 (nutrition rules) tills separat PMIR  
**Nästa:** hosting + functions:mabraCoach deploy
