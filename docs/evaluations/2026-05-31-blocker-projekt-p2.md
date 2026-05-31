# Master YOLO blocker — projekt-p2

**Datum:** 2026-05-31  
**Våg:** `projekt-p2`  
**Status:** **DONE** (PMIR godkänd 2026-06-01)

## Orsak

Fas 2 öppet kräver `project_rules` i Firestore + `firestore.rules` — PMIR-stopp i Master YOLO.

P2 kärna (bild, widget, lokala regler) är **done** i repo.

## Leverans

- `firestore.rules` → `match /project_rules/{docId}`
- `src/modules/admin/projects/api/projectRulesApi.ts`
- `ProjektReglerPage` + migration från localStorage

## Nästa steg

`firebase deploy --only firestore:rules` · manuell test `/projekt/regler`
