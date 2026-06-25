# Promtmästare — MABRA · Fas 1 · Inventering

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/arkiv-minne.md
@.context/innehall-kanon.md
@.cursor/rules/livskompassen-core.mdc
@docs/specs/modules/MABRA-3.0-MASTER-SPEC.md
@docs/specs/modules/Mabra-SPEC.md
@docs/specs/modules/Mabra-CONTENT-BANK.md
@docs/specs/modules/Arkiv-GAP-REGISTER.md
@docs/INNEHALL-REGISTER.md

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg, inga JADE
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Sacred, prod deploy

### 2. WORM — ABSOLUT
`mabra_sessions` (om WORM) — CREATE ja, UPDATE/DELETE nej. Beteende + datum i logs.

### 3. Tre silor — ALDRIG cross-RAG
**MåBra / U6 (Vit):** `mabra_sessions` + planerat `vit_entries` — **INGEN RAG**, **INGEN ingest till `kampspar`**.
MåBra-innehåll via content-banker — INTE via `knowledgeVaultQuery` eller `valvChatQuery`.

### 4. DCAP före LLM
`mabraCoachGuard` live. LLM-coaching i MåBra är stöd, aldrig WORM eller silo-beslut.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts`
MåBra-coach-prompter finns i `sharedRules.ts`.

### 6. Zero Footprint
MåBra-sessioner: Draft Layer för utkast. `invalidateSession` vid logout.

### 7. Sacred Features: Device Clear rensar även MåBra-session-state.

### 8. Locked UX: Valv Pansaret, Barnfokus — PMIR + Pontus OK.

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad. `docs/INNEHALL-REGISTER.md` vinner för innehållsklassificering.

### 11. Domänlins: MåBra är återhämtning/rehab för Pontus — ADHD, GAD, RSD-sensitiv design.
Ingen JADE, ingen skuld. Validering + mikrosteg + en sak i taget.

### 12. Design: Tema I-skymning för MåBra. FÖRBJUDET: indigo/lila, natur-tapeter, skuld-triggande text.

### 13. Secrets: Aldrig `.env`, SA-JSON.

### 14. Validate: `cd functions && npm run build` · `npm run smoke:predeploy`

---

## Ämnets kontext

**Modul:** Vardagen — MåBra (`src/modules/`) — återhämtning, näring, rörelse, sömn, KBT-stöd  
**Aktuell fas:** Fas 1 av 3 — READ-ONLY inventering  
**Fas-syfte:** Kartlägg vad som är byggt i MåBra, identifiera GAP mot MABRA-3.0-MASTER-SPEC och innehållsbanken

### Vad som är klart (DONE):
- [x] `mabraCoachGuard` (DCAP-guard för MåBra-coaching) — live
- [x] `mabra_sessions` Firestore-collection
- [x] MåBra content-bank (`Mabra-CONTENT-BANK.md`) — REFLECTION/PLAY kategorierna
- [x] F8 Super-Ekonomi Input inkluderar MåBra-komponenter (Fas 8E done)
- [x] Innehållsregister (`docs/INNEHALL-REGISTER.md`) — FACT/REFLECTION/PLAY/EVIDENCE klassificering

### Vad som ska inventeras:
- [ ] MåBra-sidan (`/mabra` eller `/vardagen?tab=mabra`) — finns route + UI?
- [ ] MABRA-3.0-MASTER-SPEC §6 design — implementerad?
- [ ] Innehållsbanken (REFLECTION/PLAY) — hur många objekt ingested?
- [ ] MABRA-CAT8-RECOVERY-SPEC — cat8 återhämtnings-flöde byggt?
- [ ] Daglig MåBra-mix (MABRA-DAGLIG-MIX-PROMPT) — live?
- [ ] Sömn/näring/rörelse-tracking — vilka delar finns?
- [ ] KBT-stöd-flöde — implementerat?

### Nyckelfiler:
- `src/modules/` — leta efter MåBra-moduler
- `docs/specs/modules/MABRA-3.0-MASTER-SPEC.md` — master-spec
- `docs/specs/modules/Mabra-CONTENT-BANK.md` — innehållsbank
- `docs/specs/modules/MABRA-CAT8-RECOVERY-SPEC.md` — cat8
- `docs/prompts/MABRA-DAGLIG-MIX-PROMPT.md` — daglig mix-prompt
- `docs/INNEHALL-REGISTER.md` — innehållsklassificering

---

## Fas 1-uppdrag

**Läge: READ-ONLY — ingen kod, ingen deploy**

### Steg (i ordning):
1. Läs `docs/specs/modules/MABRA-3.0-MASTER-SPEC.md` och lista alla planerade funktioner
2. Leta i `src/modules/` efter MåBra-relaterade komponenter — vad finns?
3. Kontrollera att `mabra_sessions` INTE är kopplad till `kampspar`-RAG
4. Räkna innehåll i `Mabra-CONTENT-BANK.md` — REFLECTION/PLAY objekt
5. Identifiera vad som fattas mot §6 design
6. Lista BLOCKERS och PMIR-kandidater
7. Ge Fas 2-rekommendation (2–3 alt + REKOMMENDATION)

---

## Leveransformat

```markdown
## Fas 1 Inventering — MåBra

### Funktioner vs MABRA-3.0-MASTER-SPEC
| Funktion | Status | Notering |
|----------|--------|----------|

### Silo-verifiering (U6)
- mabra_sessions kopplad till kampspar-RAG: ja/nej
- Innehåll levereras via content-banker (ej RAG): ja/nej

### Innehållsbank
- REFLECTION: N objekt
- PLAY: N objekt

### BLOCKERS
1. ...

### Fas 2-rekommendation
- Alt A: ...
- Alt B: ...
- **REKOMMENDATION:** ...
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: skriva kod i denna fas (READ-ONLY)
- ALDRIG: koppla `mabra_sessions` till `kampspar`-RAG (U6-silo-brott)
- ALDRIG: använda `knowledgeVaultQuery` eller `valvChatQuery` för MåBra-innehåll
- ALDRIG: skuld-triggande text eller JADE i MåBra-coaching
- ALDRIG: merge utan PMIR + Pontus OK
