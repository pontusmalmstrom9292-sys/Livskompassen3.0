# Promtmästare — DOSSIER-GENERATOR · Fas 1 · Inventering & förbättring

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/locked-ux-features.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/memory-silo.mdc
@.cursor/rules/security-firestore.mdc
@docs/specs/modules/Dossier-SPEC.md
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

### 2. WORM:
- `dossier_snapshots` — WORM evigt (parametrar + hash + `includedDocIds` + `createdAt`)
- PDF i Storage — TTL ~24 h + signed URL (inte permanent fil som default)
- Käll-collections läses: `reality_vault`, `children_logs`, opt-in `journal`

### 3. Tre silor: Dossier aggregerar cross-silo READ (reality_vault + children_logs + journal) — detta är det enda godkända undantaget. ALDRIG `kampspar` som primär beviskälla.

### 4. DCAP: LLM (Vävaren) är valfri, märkt AI-sammanfattning. Beviskroppen = ordagrant WORM-fält. LLM styr aldrig urval eller hash.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts` (Vävaren-prompt).

### 6. Zero Footprint: Rensa urval/state vid unmount, "Klar"-knapp och Device Clear. Ingen auto-delning.

### 7. Sacred Features: Dossier-Generator är Sacred — FÅR EJ försvagas eller tas bort.

### 8. Locked UX: Wizard med granskning per post (toggle, default alla på) är låst design.

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: SHA-256 hash verifierar dokumentintegritet. Beviskropp = ordagrant WORM, aldrig LLM-omskrivning.

### 11. Domänlins: Dossier är för ombud/myndighet — Grey Rock, BIFF, objektivt. ALDRIG diagnosetiketter. BBIC-format fas 2.

### 12. Design: Obsidian Calm. Indigo progress vid async-generering (ingen stressanimation). Hash synlig på första + sista PDF-sida.

### 13. Secrets: Committa aldrig `.env`, SA-JSON, tokens.

### 14. Validate:
```bash
cd functions && npm run build
npm run typecheck:core-strict
npm run smoke:predeploy
```

---

## Ämnets kontext

**Modul:** Dossier-Generator (Sacred Feature) — `src/modules/features/lifeJournal/evidence/vault/dossier/`  
**Route:** `/valvet?vaultTab=dossier` (AuthGate + Fyren/PIN)  
**Aktuell fas:** Fas 1 — INVENTERING & verifiering  
**Fas-syfte:** Verifiera att wizard, `generateDossier`, hash + PDF-pipeline fungerar korrekt end-to-end — identifiera GAP mot Dossier-SPEC

### Vad som är klart (DONE):
- [x] Wizard UI
- [x] `generateDossier` callable
- [x] `dossier_snapshots` WORM-regler i `firestore.rules`
- [x] `pdf-lib` PDF-generering
- [x] `exportVaultRecordAsPdf` (per valv-post snabbexport)
- [x] `exportBalansReport`
- [x] AuthGate + Fyren PIN-krav

### Vad som ska verifieras / GAP:
- [ ] Wizard 5 steg: Period → Källor → Granskning → Generera → Leverans — alla implementerade?
- [ ] SHA-256 hash — visas på första + sista PDF-sida + i UI?
- [ ] Async-job (`jobId` + poll) — implementerat för generering > ~10 s?
- [ ] `journal` opt-in med varning — fungerar?
- [ ] `vävaren_metadata` default AV i beviskropp?
- [ ] Valv-bro + Barnen-bro — "Skapa Dossier"-knapp från VaultPage och FamiljenPage?
- [ ] `reportType: LEGAL | BBIC` — BBIC klar eller bara LEGAL?
- [ ] `dossier_snapshots` TTL vs PDF TTL — korrekt implementerat?

### Nyckelfiler:
- `src/modules/features/lifeJournal/evidence/vault/dossier/` — wizard + komponenter
- `functions/src/callables/generateDossier.ts` (el. liknande) — callable
- `functions/src/utils/exportVaultRecord.ts` + `exportBalansReport.ts`
- `firestore.rules` — `dossier_snapshots` WORM-regler
- `functions/src/sharedRules.ts` — Vävaren-prompt (valfri AI)
- `docs/specs/modules/Dossier-SPEC.md` — spec + 13 låsta beslut
- `.context/modules/dossier.md` — modul-kontext

---

## Fas 1-uppdrag

**Läge: INVENTERING + verifiering av 13 låsta beslut**

### Steg (i ordning):
1. Läs `docs/specs/modules/Dossier-SPEC.md` — stäm av alla 13 låsta beslut mot kod
2. Verifiera `dossier_snapshots` WORM i `firestore.rules` — inga update/delete?
3. Kontrollera SHA-256 hash — genereras korrekt och visas i UI + PDF?
4. Verifiera att `vävaren_metadata` är default AV
5. Kontrollera om bro från VaultPage + FamiljenPage finns
6. Identifiera 2–3 kritiska GAP och presentera alternativ + REKOMMENDATION

---

## Leveransformat

```markdown
## Fas 1 Inventering — Dossier-Generator

### Wizard-steg (DONE / PARTIAL / MISSING)
| Steg | Status | GAP |
|------|--------|-----|
| Period | ... | ... |
| Källor | ... | ... |
| Granskning | ... | ... |
| Generera | ... | ... |
| Leverans + hash | ... | ... |

### Låsta beslut (Dossier-SPEC) — stämmer?
| # | Beslut | Status |
|---|--------|--------|
| 1 | pdf-lib backend | ... |
| 2 | dossier_snapshots WORM evigt | ... |
| ... | ... | ... |

### WORM-verifiering
- dossier_snapshots no update/delete: OK / PROBLEM

### Kritiska GAP
1. [GAP] → Alt A / Alt B → **REKOMMENDATION**

### Smoke-resultat
- [ ] `cd functions && npm run build` → PASS/FAIL
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: ta bort eller försvaga Dossier-Generator (Sacred Feature)
- ALDRIG: auto-dela PDF utan explicit nedladdning (Beslut #7)
- ALDRIG: `update` eller `delete` på `dossier_snapshots` (WORM)
- ALDRIG: `kampspar` eller `kb_docs` som primär beviskälla i dossier
- ALDRIG: LLM-omskrivning av beviskroppen (Vävaren = valfri AI-sammanfattning only)
- ALDRIG: ta bort hash-visning (integritetskrav)
- ALDRIG: merge utan PMIR + Pontus OK
