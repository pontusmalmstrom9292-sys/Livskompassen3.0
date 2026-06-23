# Promtmästare — FAMILJEN & HAMN · Fas 1 · Inventering

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/architecture.md
@.context/domän-covert-narcissism.md
@.context/locked-ux-features.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/hamn-written-default.mdc
@.cursor/rules/barn-observation-epistemik.mdc
@docs/specs/modules/SafeHarbor-SPEC.md
@docs/specs/modules/Barnen-SPEC.md
@docs/specs/modules/Arkiv-GAP-REGISTER.md

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg, inga JADE
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Sacred, Locked UX, prod deploy

### 2. WORM — ABSOLUT
`children_logs` är WORM — CREATE ja, UPDATE/DELETE nej. Barnens observationer: beteende + datum, ALDRIG diagnosetiketter eller lojalitetspress.
Hamn (BIFF-analys): **ephemeral** — INGEN auto-WORM utan explicit opt-in.

### 3. Tre silor — ALDRIG cross-RAG
Barnen (`children_logs` → `childrenLogsQuery`) är en SEPARAT silo från Valv och Kunskap.
Hamn-analys är ephemeral — rensas vid session-slut. Om Pontus väljer att spara → explicit opt-in → `reality_vault`.

### 4. DCAP före LLM
`GRANS_ARKITEKTEN_SYSTEM_PROMPT` (Gräns-Arkitekten G14) är DCAP lager 2 för Hamn.
`hamnTaktikWire.ts` — deterministisk taktik-signal.
LLM producerar BIFF-utkast — Pontus väljer om och var det sparas.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts`
`GRANS_ARKITEKTEN_SYSTEM_PROMPT` · `BIFF_REWRITE_DRAFT_SYSTEM_PROMPT` · `GRANS_EPISTEMIC_GUARD_RULES`

### 6. Zero Footprint
Hamn: ephemeral session, ingen persistent RAG. `invalidateSession` rensar Hamn-state.

### 7. Sacred Features: Device Clear rensar Hamn + Barnen session-state.

### 8. Locked UX (KRITISK):
- **Barnfokus / Middagsfrågan** — `FamiljenBarnfokusDelegate`, roterande frågor, `/familjen?tab=reflektion`
- **Barnporten HITL** — `SaveAsEvidencePrompt`; **ingen auto-promote** till Valv
- Smoke: `npm run smoke:locked-ux`

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad. GAP-register vinner.

### 11. Domänlins (HCF/covert — OBLIGATORISK):
Hamn = primärt verktyg för ex-sms/mejl. ~80% HCF/covert prior.
BIFF = Brief, Informative, Friendly, Firm. Grey Rock. Ingen JADE.
Barn: skydd utan lojalitetspress. Observationer = beteende + datum. Aldrig "mamma sa X" som WORM.
`GRANS_EPISTEMIC_GUARD_RULES` → `theoryWithoutEvidence: true` om slutsatser ej stöds av text.

### 12. Design: Tema I-hamn. Progressive disclosure. Inga diagnosetiketter i UI.

### 13. Secrets: Aldrig `.env`, SA-JSON.

### 14. Validate: `cd functions && npm run build` · `npm run smoke:locked-ux` · `npm run smoke:predeploy`

---

## Ämnets kontext

**Modul:** Familjen (`/familjen`) + Hamn (`src/modules/support/`) — Safe Harbor BIFF + barnloggar  
**Aktuell fas:** Fas 1 av 2 — READ-ONLY inventering  
**Fas-syfte:** Kartlägg Familjen-sidan och Hamn-modulens tillstånd, verifiera Locked UX och BIFF-pipeline

### Vad som är klart (DONE):
- [x] Safe Harbor BIFF-formulär via `analyzeMessage` callable
- [x] Gräns-Arkitekten (G14) — `processBrusfilter` + BIFF-utkast
- [x] `hamnTaktikWire.ts` — 7 taktiktyper (hoovering, smear, ekonomisk_kontroll, maternal_fasad, trauma_bonding, juridik_hot, written_only_escalation)
- [x] `children_logs` WORM + `childrenLogsQuery` (G8 done)
- [x] Barnfokus-frågor (Locked UX) — `FamiljenBarnfokusDelegate`
- [x] `BARNFOKUS_QUESTIONS` kategorier (roligt, kunskap, knas, lära känna, utveckling, valv-bank)
- [x] Barnporten HITL — `SaveAsEvidencePrompt`
- [x] `GRANS_ARKITEKTEN_SYSTEM_PROMPT` + `GRANS_EPISTEMIC_GUARD_RULES` i `sharedRules.ts`

### Vad som ska inventeras:
- [ ] Familjen-sidan `/familjen` — alla tabs implementerade?
- [ ] Barnfokus-frågor — roterar korrekt per dag/kategori?
- [ ] Hamn UI — BIFF-utkast → tydlig väg att spara eller kasta?
- [ ] Barnporten HITL — `SaveAsEvidencePrompt` visas korrekt?
- [ ] `children_logs` PIN-gate fungerar?
- [ ] Epistemisk guard (`theoryWithoutEvidence`) — triggar korrekt?
- [ ] Kampspar-bevis (barnsäkerhet) — `bh-001`–`bh-008` ingested?

### Nyckelfiler:
- `src/modules/support/` — Hamn/Safe Harbor
- `src/modules/` — FamiljenPage
- `functions/src/triggers/hamnTaktikWire.ts`
- `functions/src/sharedRules.ts` — BIFF-prompter
- `docs/specs/modules/SafeHarbor-SPEC.md` — Hamn spec
- `docs/specs/modules/Barnen-SPEC.md` — barnloggar spec
- `.context/locked-ux-features.md` §1 — Barnfokus locked

---

## Fas 1-uppdrag

**Läge: READ-ONLY — ingen kod, ingen deploy**

### Steg (i ordning):
1. Granska `src/modules/support/` — vad finns i Hamn vs SafeHarbor-SPEC?
2. Verifiera att Barnfokus-frågor (`FamiljenBarnfokusDelegate`) roterar korrekt
3. Kontrollera att Barnporten HITL (`SaveAsEvidencePrompt`) inte auto-promotar till Valv
4. Verifiera `children_logs` WORM i `firestore.rules`
5. Kontrollera att Hamn-analys är ephemeral (ingen auto-WORM)
6. Lista BLOCKERS och PMIR-kandidater
7. Ge Fas 2-rekommendation

---

## Leveransformat

```markdown
## Fas 1 Inventering — Familjen & Hamn

### Familjen-tabs
| Tab | Status | Notering |
|-----|--------|----------|

### Hamn-pipeline
| Steg | Status | Notering |
|------|--------|----------|
| BIFF-formulär | | |
| Gräns-Arkitekten | | |
| Taktik-signal | | |
| Ephemeral (no auto-WORM) | | |
| SaveAsEvidencePrompt | | |

### Barnfokus (Locked UX)
- Roterande frågor: OK/GAP
- Kategoritäckning: OK/GAP

### BLOCKERS
1. ...

### Fas 2-rekommendation
- Alt A / B / C → **REKOMMENDATION**
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: auto-WORM Hamn-analys (ephemeral!)
- ALDRIG: ta bort Barnfokus-frågor eller `FamiljenBarnfokusDelegate` (Locked UX)
- ALDRIG: ta bort `SaveAsEvidencePrompt` (Barnporten HITL — Locked UX)
- ALDRIG: blanda `children_logs` med `reality_vault` i RAG
- ALDRIG: diagnosetiketter på motpart eller barn i WORM
- ALDRIG: skriva BIFF-prompt utanför `sharedRules.ts`
- ALDRIG: merge utan PMIR + Pontus OK
