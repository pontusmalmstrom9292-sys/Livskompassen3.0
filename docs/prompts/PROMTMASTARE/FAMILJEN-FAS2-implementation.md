# Promtmästare — FAMILJEN & HAMN · Fas 2 · Implementation

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/domän-covert-narcissism.md
@.context/locked-ux-features.md
@.context/design-language.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/hamn-written-default.mdc
@.cursor/rules/barn-observation-epistemik.mdc
@.cursor/rules/synapser-adk.mdc
@docs/specs/modules/SafeHarbor-SPEC.md
@docs/specs/modules/Barnen-SPEC.md
@functions/src/sharedRules.ts

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg, inga JADE
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Locked UX, prod deploy

### 2. WORM — ABSOLUT
`children_logs` CREATE only. Hamn: **ephemeral** — ALDRIG auto-WORM utan opt-in.

### 3. Tre silor: `children_logs` ≠ `reality_vault` ≠ `kampspar`. Aldrig cross-RAG.

### 4. DCAP: `GRANS_ARKITEKTEN_SYSTEM_PROMPT` + `hamnTaktikWire.ts` (deterministisk).
LLM producerar BIFF-utkast. Pontus väljer.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts`.

### 6. Zero Footprint: Hamn ephemeral. `invalidateSession` rensar.

### 7. Sacred Features: Device Clear rensar Hamn + Barnen.

### 8. Locked UX (KRITISK):
- **Barnfokus / Middagsfrågan** — BEVARAS EXAKT
- **Barnporten HITL** — `SaveAsEvidencePrompt` BEVARAS, ingen auto-promote
- Smoke: `npm run smoke:locked-ux`

### 9. Git: PMIR + Pontus OK.

### 10. Hallucinationsprotokoll: Fil:rad.

### 11. Domänlins: BIFF + Grey Rock. Barn = skydd utan lojalitetspress. Beteende + datum.

### 12. Design: Tema I-hamn. Lugn, trygg estetik. Inga diagnosetiketter i UI.

### 13. Secrets: Aldrig `.env`, SA-JSON.

### 14. Validate:
```bash
cd functions && npm run build
npm run smoke:locked-ux
npm run smoke:predeploy
npm run typecheck:core-strict
```

---

## Ämnets kontext

**Modul:** Familjen + Hamn — implementation av GAP från Fas 1  
**Aktuell fas:** Fas 2 av 2 — IMPLEMENTATION  
**Fas-syfte:** Åtgärda GAP identifierade i Fas 1, förbättra BIFF-flödet och barnlogg-UX

### Prioriterade förbättringar (baserat på Fas 1):
- [ ] Hamn BIFF-flöde: tydligare "Spara till Valv" vs "Kasta" UI
- [ ] Barnfokus: förbättra roteringslogik + kategorivisning
- [ ] Barnlogg-UI: enklare inmatning (mikrosteg, inte formulär)
- [ ] Taktik-signal visning: visa identifierad taktik diskret i Hamn (utan att alarma)
- [ ] Epistemisk guard: visa feedback om `theoryWithoutEvidence: true`
- [ ] `childrenLogsQuery` — finns fullständig UI för sökning i barnloggar?

### Nyckelfiler:
- `src/modules/support/` — Hamn frontend
- `src/modules/` — FamiljenPage
- `functions/src/triggers/hamnTaktikWire.ts`
- `functions/src/sharedRules.ts` — BIFF-prompter
- `.cursor/rules/hamn-written-default.mdc` — Hamn-regler
- `.cursor/rules/barn-observation-epistemik.mdc` — barnlogg-regler

---

## Fas 2-uppdrag

**Läge: IMPLEMENTATION — `src/modules/support/`, `src/modules/` (Familjen), `functions/src/`**

### Steg (i ordning):
1. Förbättra Hamn BIFF-UI: tydlig "Spara till Valv (WORM)" + "Kasta (ephemeral)" — aldrig auto
2. Förtydliga taktik-signal-visning: diskret badge, inte alarmistisk
3. Förbättra Barnfokus-rotationslogik om GAP hittades i Fas 1
4. Förenkla barnlogg-inmatning: tre fält max (barn, observation, datum)
5. Lägg till `theoryWithoutEvidence`-feedback: "⚠️ Tolkning saknar direkt stöd i texten"
6. Kör `cd functions && npm run build`
7. Kör `npm run smoke:locked-ux` — PASS FÖR merge

---

## Leveransformat

```markdown
## Fas 2 Implementation — Familjen & Hamn

### Implementerade förändringar
- [x] Hamn BIFF-UI: "Spara" / "Kasta" — fil: `src/modules/support/HamnPage.tsx`
- [x] ...

### Barnfokus (Locked UX — bevarat)
- Befintlig rotationslogik: orörd / förbättrad
- Smoke: `npm run smoke:locked-ux` → PASS

### Tester
- [ ] `cd functions && npm run build` → PASS/FAIL
- [ ] `npm run smoke:locked-ux` → PASS/FAIL
- [ ] `npm run smoke:predeploy` → PASS/FAIL

### Återstående (Pontus OK krävs)
- [ ] ...
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: auto-WORM Hamn-analys
- ALDRIG: ändra `FamiljenBarnfokusDelegate` eller `BARNFOKUS_QUESTIONS` (Locked UX)
- ALDRIG: ta bort `SaveAsEvidencePrompt` (Barnporten HITL)
- ALDRIG: blanda `children_logs` med `reality_vault` i RAG
- ALDRIG: visa diagnosetiketter i UI ("narcissist", "PD")
- ALDRIG: skriva ny BIFF-prompt utanför `sharedRules.ts`
- ALDRIG: merge utan `npm run smoke:locked-ux` PASS + Pontus OK
