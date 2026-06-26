# Promtmästare — KOMPASSER (De 3 Kompasserna) · Fas 1 · Inventering & förbättring

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/locked-ux-features.md
@.cursor/rules/livskompassen-core.mdc
@docs/specs/modules/De-3-Kompasserna-SPEC.md
@docs/SMOKE_CHECKLIST.md

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav, inte option
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg — max ett steg i taget (Paralys-Brytaren-princip gäller även för agenten)
- **Inga JADE** — direkt, saklig, bestämd ton
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Sacred Features, Locked UX, prod deploy

### 2. WORM: `checkins` — CREATE ja, UPDATE/DELETE nej. `saveCheckIn` → WORM create.

### 3. Tre silor: Kompasser skriver till `checkins` (WORM). Crazymaking-broar → Valv/Speglar/MåBra/Barnen — ALDRIG auto-write till `reality_vault`.

### 4. DCAP: `breakDownResponse` är rådgivande — styr aldrig silo eller WORM.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts` (Paralys-Brytaren-prompt).

### 6. Zero Footprint: Draft Layer för kompass-utkast. Missad morgon — ingen skuld, ingen alert.

### 7. Sacred Features: Morgonkompassen är Sacred — FÅR EJ försvagas eller tas bort.

### 8. Locked UX (KRITISK):
- **Morgonkompassen** — intention + Sanningens Ankare (Silo 1 MVP) — LÅST
- **Paralys-Brytaren** — ett mikrosteg i taget — LÅST
- Notiser: in-app FIRST, lokal push max 2–3/dag — LÅST
- Crazymaking → **bro only** (ej auto-write till Valv) — LÅST
- Smoke: `npm run smoke:locked-ux` (om compass-spec finns)

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad. Osäkerhet → "Ej tillräckligt data."

### 11. Domänlins: ADHD + GAD — kapacitetsstyrd dygnsrytm, inga skuld-indikatorer. Morgon = intention (ej prestation). Kväll = KASAM (ej summering). Paralys = ett steg (ej to-do lista).

### 12. Design: `/vardagen?tab=kompasser` — ett element i taget. Tids-default (morgon/dag/kväll) vid öppning. Inga röda siffror.

### 13. Secrets: Committa aldrig `.env`, SA-JSON, tokens.

### 14. Validate:
```bash
cd functions && npm run build
npm run typecheck:core-strict
npm run smoke:predeploy
```

---

## Ämnets kontext

**Modul:** De 3 Kompasserna (Morgonkompassen = Sacred Feature)  
**Kanonisk kod:** `src/modules/features/dailyLife/wellbeing/compasses/`  
**Route:** `/vardagen?tab=kompasser` (legacy `/kompasser` → `/vardagen`)  
**Aktuell fas:** Fas 1 — INVENTERING & förbättring  
**Fas-syfte:** Verifiera MVP-tillstånd för alla tre kompasser, identifiera GAP mot Sanningens Ankare + push-notiser

### Vad som är klart (DONE):
- [x] `saveCheckIn` callable — WORM create till `checkins`
- [x] `breakDownResponse` — Paralys-Brytaren backend
- [x] Paralys-Brytaren UI — ett steg + "Ge mig 3 till" + Klar
- [x] KASAM UI (kväll) — 3 steg
- [x] Morgon/Dag/Kväll-flikar med fri navigering
- [x] Tids-default vid öppning (`getDefaultCompassByTime`)
- [x] Crazymaking-broar (Speglar, Valv, MåBra, Barnen)

### Vad som ska verifieras / GAP:
- [ ] Sanningens Ankare (Silo 1) — implementerat eller bara planerat?
- [ ] Notiser: in-app FIRST — finns lokal push-logik? Max 2–3/dag?
- [ ] `checkins` WORM i `firestore.rules` — `update, delete: if false`?
- [ ] Missad morgon — visas skuld-text nånstans? (ska inte finnas)
- [ ] Paralys manuell — kräver aktiv trigger av användaren (ej auto-parade)?
- [ ] Planering-integration — visas dagens tasks i Morgonkompassen?
- [ ] Smoke-test för kompasser (`npm run smoke:compass`)?

### Nyckelfiler:
- `src/modules/features/dailyLife/wellbeing/compasses/` — allt
- `functions/src/callables/saveCheckIn.ts` (el. liknande) — callable
- `functions/src/callables/breakDownResponse.ts` — Paralys-Brytaren callable
- `functions/src/sharedRules.ts` — Paralys-Brytaren-prompt
- `firestore.rules` — `checkins` WORM-regler
- `docs/specs/modules/De-3-Kompasserna-SPEC.md` — spec
- `.context/modules/kompasser.md` — modul-kontext

---

## Fas 1-uppdrag

**Läge: INVENTERING + verifiering av ADHD-principer**

### Steg (i ordning):
1. Läs `docs/specs/modules/De-3-Kompasserna-SPEC.md` — stäm av mot kod
2. Verifiera `checkins` WORM i `firestore.rules`
3. Kontrollera Paralys-Brytaren — ett steg i taget? Manuell trigger? Inga auto-listor?
4. Kontrollera att Crazymaking-broar ALDRIG auto-skriver till `reality_vault`
5. Identifiera om Sanningens Ankare (Morgon Silo 1) är implementerat
6. Presentera 2–3 förbättringar + REKOMMENDATION

---

## Leveransformat

```markdown
## Fas 1 Inventering — Kompasser

### Kompass-status (DONE / PARTIAL / MISSING)
| Kompass | Funktion | Status | GAP |
|---------|----------|--------|-----|
| Morgon | Intention + Sanningens Ankare | ... | ... |
| Dag | Pulskompass + Paralys-Brytaren | ... | ... |
| Kväll | KASAM 3 steg | ... | ... |

### WORM-verifiering (checkins)
- no update/delete: OK / PROBLEM

### ADHD-principer
- Ingen skuld-text vid missad morgon: OK / PROBLEM
- Paralys manuell trigger: OK / PROBLEM
- Notiser max 2–3/dag: OK / GAP

### Crazymaking-broar
- Ingen auto-write till reality_vault: OK / GAP

### Förbättringar (prioriterade)
1. [Förbättring] → Alt A / Alt B → **REKOMMENDATION**

### Smoke-resultat
- [ ] `cd functions && npm run build` → PASS/FAIL
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: ta bort Morgonkompassen (Sacred Feature)
- ALDRIG: auto-write till `reality_vault` från Crazymaking (bro only)
- ALDRIG: skuld-text, skuld-räknare eller "missad"-varning
- ALDRIG: Paralys-Brytaren visar fler än ett steg utan att användaren begär det
- ALDRIG: push-notiser mer än 2–3/dag
- ALDRIG: merge utan PMIR + Pontus OK
