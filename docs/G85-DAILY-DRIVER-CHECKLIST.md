# G85 Daily Driver Checklist — Fas 24 P0

**Startad:** 2026-07-18 (day 1) · **Mål:** 7 dagar utan P0-krasch  
**Enhet:** Motorola G85 · Android Studio Run (debug APK)

Logga endast. Kodfixar går via improvement waves / Agent — inte här.

---

## Enhetsgate (gör day 1)

- [ ] Installera/starta via Android Studio Run
- [ ] Öppna Valvet → lås upp
- [ ] App till bakgrund **< 3 sekunder** → tillbaka **utan kickout**
- [ ] App Check: ingen HTTP 400 i logcat vid Valv-anrop

## Daglig användning (dag 1–7)

| Dag | Datum | Anteckning (friktion / OK) |
|-----|-------|----------------------------|
| 1 | 2026-07-18 | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |

## Spot-checks (valfritt men bra)

- [ ] Inkast → granskningskö → confirm till Valv
- [ ] Fyren WH1 / WH2
- [ ] `/vardagen` + `/familjen` scroll utan låst UX-brott
- [ ] Offline: Valv/dagbok-skriv blockeras i flygplansläge

## När P0 är klar

1. Kryssa day 7  
2. Uppdatera `docs/PROJECT_STATE.md` (G85 7d done)  
3. Kör / bekräfta v54 slutgate GO  

**Deploy / App Check Enforce:** endast efter Pontus skriver `OK deploy` / `OK Enforce`.
