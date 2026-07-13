# P13 — Hosting deploy (sist)

```
YOLO P13 DEPLOY — hosting only.

Förutsättning: P4–P12 klara, working tree clean.

1. /yolo-vakt → GO
2. npm run smoke:predeploy:build → PASS
3. Fråga Pontus om OK
4. firebase deploy --only hosting
5. Logga i docs/evaluations/2026-07-13-yolo-deploy-hosting.md

PMIR-stopp: INGEN deploy av firestore.rules, storage.rules eller functions.
Jämför mot hela projektets kontext. Arbeta autonomt tills deploy loggad eller NO-GO.
```
