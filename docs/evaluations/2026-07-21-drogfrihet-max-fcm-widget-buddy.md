# Drogfrihet MAX — FCM + native widget + buddy + banker

**Datum:** 2026-07-21  
**Status:** KOD KLAR · MOD-FAM-DROG + MOD-WIDGET re-locked  
**Smoke:** `smoke:drogfrihet` + `smoke:drogfrihet-content` + `smoke:widgets` PASS

## Levererat
- Innehåll: quotes 240 · frågor 100 · notiser 90
- FCM: `syncDrogfrihetPushPrefs`, `sendDrogfrihetNudge`, `linkDrogfrihetBuddy`, `pingDrogfrihetBuddy` (Admin-collection `drogfrihet_push`, ingen rules-PR)
- Android: FCM service + WorkManager lokal nudge + hemwidget SOS Ankare
- Buddy 1:1: lokal kontakt (tel/SMS) + kod-länk + FCM-ping

## Deploy (kräver Pontus OK)
```bash
firebase deploy --only functions:syncDrogfrihetPushPrefs,functions:sendDrogfrihetNudge,functions:linkDrogfrihetBuddy,functions:pingDrogfrihetBuddy
npm run build:web && npx cap sync android
```
