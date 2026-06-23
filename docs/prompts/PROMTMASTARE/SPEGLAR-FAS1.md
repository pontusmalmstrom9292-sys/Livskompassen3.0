# Promtmästare — SPEGLAR · Fas 1 · Inventering & förbättring

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/domän-covert-narcissism.md
@.context/locked-ux-features.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/memory-silo.mdc
@docs/specs/modules/Speglar-SPEC.md
@docs/SMOKE_CHECKLIST.md

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg — ett steg i taget
- **Inga JADE** — direkt, saklig, bestämd ton
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Sacred Features, Locked UX, prod deploy

### 2. WORM: Speglar skriver ingen permanent data (Zero Footprint). `reality_vault` läses read-only.

### 3. Tre silor: Speglar läser `reality_vault` via klient `getVaultLogs(uid)` — ALDRIG `kampspar` eller `children_logs`.

### 4. DCAP: LLM (`speglingsMirror`) är rådgivande — styr aldrig silo, WORM eller ägare.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts` (Speglings-Coachen-prompt).

### 6. Zero Footprint: Session rensas vid unmount (`SpeglingsSystem`). Valv-bevis kräver upplåst valv.

### 7. Sacred Features: Speglings-Systemet är Sacred — FÅR EJ försvagas, tas bort eller döpas om.

### 8. Locked UX: ACT + VIVIR + EvidenceCompare + Hamn-bro — dessa fyra steg är låsta flödesdelar.

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad. Osäkerhet → "Ej tillräckligt data." GAP-register vinner.

### 11. Domänlins (HCF/covert): ~80% av Speglar-inmatningar = gaslighting/RSD-triggers. Fail-closed: validera, aldrig diagnos på motpart. BIFF. Grey Rock. ALDRIG JADE.

### 12. Design: Obsidian Calm / Nordic Dusk. Guld `#FDE68A` för insikt, indigo `#818CF8` för CTA, emerald `#2DD4BF` för klar. Förbjudet: naturteman, röda larm-UI som triggar skam.

### 13. Secrets: Committa aldrig `.env`, SA-JSON, tokens.

### 14. Validate:
```bash
cd functions && npm run build
npm run typecheck:core-strict
npm run smoke:predeploy
```

---

## Ämnets kontext

**Modul:** Speglings-Systemet (Sacred Feature) — `src/modules/features/lifeJournal/diary/mirror/`  
**Route:** `/hjartat?tab=speglar` (legacy redirect `/speglar`)  
**Aktuell fas:** Fas 1 — INVENTERING & förbättring  
**Fas-syfte:** Kartlägg aktuellt tillstånd för ACT/VIVIR/EvidenceCompare-flödet, identifiera GAP och ge rekommendation för nästa förbättring

### Vad som är klart (DONE):
- [x] `ActCalibrationView` — känsla + valfri `speglingsMirror` callable
- [x] `VivirStepView` — fem VIVIR-steg (Vem/Inflytande/Viktigt/Intention/Redo)
- [x] `EvidenceCompareView` — token-match mot `reality_vault` (max 5 träffar)
- [x] `mirrorFeeling()` — deterministisk lokal fallback vid AI-fel
- [x] Hamn-bro — länk med `prefilledMessage` till Safe Harbor
- [x] Zero Footprint — state nollställs vid unmount
- [x] Dagbok-bro — `journalContext` (mood + text) förifyllt från `SavedStep`
- [x] Valv-lås — bevis hämtas BARA om valv är upplåst (Fyren + PIN)
- [x] `ClusterGrid`-ingång och Hjärtat-flik

### Vad som ska verifieras / kan förbättras:
- [ ] `speglingsMirror` callable — täcker Speglings-Coachen-prompt alla HCF-taktiker?
- [ ] EvidenceCompare — träffkvalitet för covert-mönster (ej bara ordmatchning)?
- [ ] Auto-korsreferens mot `children_logs` — planerat men EJ klart?
- [ ] Full DCAP-klassning vid Speglar-inmatning?
- [ ] Projektionsdetektor UI — planerat fas 2?
- [ ] Vector Search ANN (vs token-match) — GAP?

### Nyckelfiler:
- `src/modules/features/lifeJournal/diary/mirror/` — komponenter + hooks
- `src/modules/features/lifeJournal/diary/mirror/SpeglingsSystem.tsx` — root-komponent
- `functions/src/callables/speglingsMirror.ts` (el. liknande) — callable
- `functions/src/sharedRules.ts` — Speglings-Coachen-prompt
- `docs/specs/modules/Speglar-SPEC.md` — spec
- `.context/modules/speglingssystemet.md` — modul-kontext

---

## Fas 1-uppdrag

**Läge: INVENTERING + identifiera 2–3 förbättringar**

### Steg (i ordning):
1. Läs `docs/specs/modules/Speglar-SPEC.md` — stäm av DONE/PARTIAL/MISSING mot kod
2. Verifiera att EvidenceCompare ALDRIG läser `kampspar` eller `children_logs` — ONLY `reality_vault`
3. Kontrollera Zero Footprint — rensas state korrekt vid unmount och "Ny kalibrering"?
4. Kontrollera `speglingsMirror` callable — är prompt i `sharedRules.ts` (ej duplicerad)?
5. Identifiera 2–3 förbättringar rankade (enkel fix → komplex)
6. Presentera alternativ + REKOMMENDATION per förbättring

---

## Leveransformat

```markdown
## Fas 1 Inventering — Speglar

### Flödesstatus (DONE / PARTIAL / MISSING)
| Steg | Komponent | Status | GAP |
|------|-----------|--------|-----|
| ACT | ActCalibrationView | ... | ... |
| VIVIR | VivirStepView | ... | ... |
| EvidenceCompare | EvidenceCompareView | ... | ... |
| Hamn-bro | prefilledMessage | ... | ... |

### Silo-verifiering
- reality_vault read-only: OK / PROBLEM
- Ingen cross-silo: OK / PROBLEM

### Zero Footprint
- Unmount-rensning: OK / PROBLEM

### Förbättringar (prioriterade)
1. [Förbättring] → Alt A / Alt B → **REKOMMENDATION**

### Smoke-resultat
- [ ] `cd functions && npm run build` → PASS/FAIL
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: ta bort ACT-, VIVIR- eller EvidenceCompare-steget (Sacred Feature)
- ALDRIG: låta EvidenceCompare läsa `kampspar` eller `children_logs` (silo-brott)
- ALDRIG: spara Speglar-session i Firestore (Zero Footprint)
- ALDRIG: låta LLM avgöra WORM-write eller silo-placering
- ALDRIG: ta bort Hamn-bron (Locked UX-koppling)
- ALDRIG: merge utan PMIR + Pontus OK
- ALDRIG: diagnosetiketter på motpart i WORM eller svar
