# G85 Daily Driver Checklist — Fas 24 P0

**Startad:** 2026-07-18 (day 1) · **Mål:** 7 dagar utan P0-krasch  
**Enhet:** Motorola G85 · Android Studio Run (debug APK)

Logga endast. Kodfixar går via improvement waves / Agent — inte här.

**Agent prep 2026-07-23:** RemoteViews lint-fix (Companion Capture/Note/Tasks) · Recovery SOS ZF · device-ready pack · Minne v61/v62 doc-synk. Status: **device-ready** — Enhetsgate-kryss = Pontus på telefon.

Pack: [`evaluations/2026-07-23-g85-device-ready-pack.md`](./evaluations/2026-07-23-g85-device-ready-pack.md)

---

## Enhetsgate (gör day 1)

- [ ] Installera/starta via Android Studio Run
- [ ] Öppna Valvet → lås upp
- [ ] App till bakgrund **< 3 sekunder** → tillbaka **utan kickout**
- [ ] App Check: ingen HTTP 400 i logcat vid Valv-anrop
- [ ] Capture pin → ett mic-tryck → inspelning (ingen full app-chrome)

## Day N log (dag 1–7)

Kryssa **Enhetsgate** ovan dag 1. Logga sedan en rad per dag — friktion eller OK. Kodfixar går via improvement waves, inte här.

| Dag | Datum | Anteckning (friktion / OK) |
|-----|-------|----------------------------|
| 1 | 2026-07-18 | Startad — manuell Enhetsgate kvar |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | 2026-07-21 | Prep PASS (cap:sync:prod + android smokes YOLO v9) — manuell G85 mikro-check kvar |
| 6 | 2026-07-23 | Agent release-runway PASS (lint RemoteViews + ZF SOS + docs). **Pontus one-pass kvar** |
| 7 | | |

## Spot-checks (valfritt men bra)

- [ ] Inkast → granskningskö → confirm till Valv
- [ ] Fyren WH1 / WH2
- [ ] `/vardagen` + `/familjen` scroll utan låst UX-brott
- [ ] Offline: Valv/dagbok-skriv blockeras i flygplansläge
- [ ] Gold/V4 visual: Dagbok eller Familjen vs mockup (premium, inte ny app)
- [ ] Companion Note/Tasks: in-widget, ingen full chrome

## När P0 är klar

1. Kryssa day 7  
2. Uppdatera `docs/PROJECT_STATE.md` (G85 7d done)  
3. Kör / bekräfta v54 slutgate GO  

**Deploy / App Check Enforce:** endast efter Pontus skriver `OK deploy` / `OK Enforce`.
