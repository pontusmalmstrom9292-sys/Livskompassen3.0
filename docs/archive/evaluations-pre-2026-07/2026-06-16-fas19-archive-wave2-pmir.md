# PMIR — Evaluations arkiv våg B (fas22)

**Datum:** 2026-06-16  
**Gren:** `main`  
**Agent:** Cursor (Life OS handoff masterplan)

---

## Följer med till main (efter arkiv)

Aktiva evaluations behåller körplan och öppna beslut:

- `2026-06-15-fas19-masterplan-v2.md`
- `2026-06-16-supermodule-ui-masterplan.md`
- `SESSION-INDEX.md`, `SENASTE-SAMMANFATTNING.md`
- Öppna nav/backend/content (ej session-transcripts)

---

## Flyttas till `docs/archive/evaluations-fas22-2026-06/` (21 filer)

| Fil | Anledning |
|-----|-----------|
| `2026-06-15-fas13-vag-0-baseline.md` … `vag-6-user-signoff.md` | Fas 13 **done** |
| `2026-06-15-fas13-leverans.md` | Leverans stängd |
| `2026-06-15-fas14-*` (chat1–5, drawer, oversikt, weekly, leverans) | Fas 14 session-transcripts **done** |
| `2026-06-14-orkester-natt.md`, `2026-06-15-orkester-natt.md` | Ersatta av PASS-rapporter |
| `2026-06-07-hemkompass-ui-polish.md` | DEFER — Hem→Hjärtat ej aktiv |

**Ingen kodreferens** i smoke eller `.cursor/rules` pekar på dessa som runtime-sanning.

---

## Regelanalys

| Lager | Status |
|-------|--------|
| `fas19-masterplan-guard` | PASS — arkiv-först, ingen radering |
| `locked-ux-features` | PASS — ej berörd |
| `planering-kanon-guard` | PASS — körplaner kvar aktiva |

---

## Smoke efter flytt

| Kommando | Förväntat |
|----------|-----------|
| `npm run build` | PASS |
| `npm run smoke:locked-ux` | PASS |

---

## Rekommendation

- [x] Flytta filer (utfört 2026-06-16)
- [ ] Uppdatera `SESSION-INDEX.md` med arkiv-pekare
- [ ] Rad i `HYGIENE-LOG.md`

**Pontus:** godkänn merge vid behov — ingen prod-kod påverkas.
