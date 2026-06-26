# Promtmästare — HJÄRTAT · Fas 1 · Inventering

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/architecture.md
@.context/arkiv-minne.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/memory-silo.mdc
@docs/specs/modules/Dagbok-SPEC.md
@docs/specs/modules/Arkiv-GAP-REGISTER.md
@docs/SMOKE_CHECKLIST.md

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
`journal` är WORM — CREATE ja, UPDATE/DELETE nej. Beteende + datum, aldrig diagnosetiketter.

### 3. Tre silor — ALDRIG cross-RAG
Dagboken (`journal`) är Lager 1 WORM. Vävaren taggar metadata → `kampspar` opt-in (G7 done).
`journal_woven` ADK-synaps → `kampspar`. ALDRIG Dagbok-data direkt i `reality_vault`.

### 4. DCAP före LLM
`routeFromDcap` bestämmer om dagboksinlägg ska till `journal` eller `reality_vault`. LLM styr ej.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts`
`VÄVAREN_SYSTEM_PROMPT` finns i `sharedRules.ts`.

### 6. Zero Footprint
Draft Layer (IndexedDB) för dagboksutkast. `invalidateSession` vid logout.

### 7. Sacred Features
Speglings-Systemet · Draft Layer · Device Clear — FÅR EJ FÖRSVAGAS.

### 8. Locked UX: Valv Pansaret, Barnfokus, Drawer — PMIR + Pontus OK.

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad, GAP-register vinner.

### 11. Domänlins: ~80% HCF/covert. BIFF + Grey Rock.

### 12. Design: Obsidian Calm. Tema I-alchemical för Dagbok. Tokens via `themeRegistry.ts`.

### 13. Secrets: Aldrig `.env`, SA-JSON.

### 14. Validate: `cd functions && npm run build` · `npm run smoke:predeploy` · `npm run typecheck:core-strict`

---

## Ämnets kontext

**Modul:** Hjärtat — Dagbok (`src/modules/reflection/`) + Speglings-Systemet (`src/modules/oracle/`)  
**Aktuell fas:** Fas 1 av 2 — READ-ONLY inventering  
**Fas-syfte:** Kartlägg vad som är byggt i Dagbok och Speglings-Systemet, identifiera GAP och blockers

### Vad som är klart (DONE):
- [x] DagbokPage + journal-persistens till `journal` (WORM)
- [x] Vävaren (`weaveJournalEntry`) — taggar känslor, aktörer, hotnivå
- [x] `journal_woven` synaps → `kampspar` opt-in (G7)
- [x] Draft Layer för dagboksutkast (IndexedDB)
- [x] `VÄVAREN_SYSTEM_PROMPT` i `sharedRules.ts`
- [x] Speglings-Coachen — lokal session, ingen persistent RAG

### Vad som ska inventeras:
- [ ] Speglings-Systemet fullständigt? Validering utan fixande?
- [ ] Vävaren — täcker den alla känslokategorier korrekt?
- [ ] `journal` → `kampspar` opt-in flöde — är UX-tydligt för Pontus?
- [ ] Superdagbok (SPEC §3) — planerad men ej byggt?
- [ ] Speglar (reflektionsflöden) — nuläge?
- [ ] Draft Layer → Sync-flöde — fungerar korrekt?

### Nyckelfiler:
- `src/modules/reflection/` — Dagbok frontend
- `src/modules/oracle/` — Speglings-Systemet
- `functions/src/agents/weaverAgent.ts` — Vävaren backend
- `functions/src/sharedRules.ts` — VÄVAREN_SYSTEM_PROMPT
- `docs/specs/modules/Dagbok-SPEC.md` — spec
- `docs/specs/modules/Arkiv-GAP-REGISTER.md` — GAP G7 status

---

## Fas 1-uppdrag

**Läge: READ-ONLY — ingen kod, ingen deploy**

### Steg (i ordning):
1. Läs `docs/specs/modules/Dagbok-SPEC.md` och lista alla planerade funktioner med status
2. Granska `src/modules/reflection/` — vad finns vs spec?
3. Granska `src/modules/oracle/` — Speglings-Systemet fullständigt?
4. Kontrollera `functions/src/agents/weaverAgent.ts` — täcker Vävaren alla taggar i spec?
5. Verifiera att `journal` är WORM (CREATE only) i `firestore.rules`
6. Identifiera: är opt-in flödet `journal` → `kampspar` tydligt för Pontus?
7. Lista BLOCKERS och PMIR-kandidater

---

## Leveransformat

```markdown
## Fas 1 Inventering — Hjärtat

### Dagbok — status mot spec
| Funktion | Status | Notering |
|----------|--------|----------|

### Speglings-Systemet — status
| Komponent | Status | Notering |
|-----------|--------|----------|

### Vävaren — taggtäckning
| Kategori | Täckt | Notering |
|----------|-------|----------|

### BLOCKERS
1. ...

### PMIR-kandidater
1. ...

### Fas 2-rekommendation (2–3 alt + REKOMMENDATION)
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: skriva kod i denna fas (READ-ONLY)
- ALDRIG: blanda `journal` med `reality_vault` i RAG
- ALDRIG: auto-spara Dagbok till `reality_vault` utan explicit opt-in
- ALDRIG: ta bort Speglings-Systemets "validering utan fixande"-princip
- ALDRIG: merge utan PMIR + Pontus OK
