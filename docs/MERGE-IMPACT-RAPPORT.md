# Pre-Merge Impact Report (PMIR) — mall

**Användning:** Agent fyller i **innan** merge eller gren-radering. Användaren godkänner med *"godkänn merge"* eller *"kör stängning"*.

**Datum:** ___________  
**Gren:** ___________ → **`main`**  
**Agent / session:** ___________

---

## Följer med till main

- [ ] Feature / fil / modul (lista kort)
- [ ] Låst UX — `npm run smoke:locked-ux`: **PASS / FAIL**
  - Barnfokus · Valv Mönster/Orkester · Planering · Fyren · Barnporten · sidomeny

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren (lokal + remote) | |
| Commits som **inte** mergas | antal + 1-rad sammanfattning |
| Kod kvar **endast** på grenen | eller "inget unikt" |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, `grunder-kanon.mdc` U1–U5 | PASS / GAP |
| **Design** | `locked-ux-features.md`, `design-language.md`, berörda `docs/design/*-SPEC.md` | PASS / GAP |
| **Säkerhet** | `.context/security.md`, Sacred, `memory-silo.mdc` (vid RAG), `firestore.rules` om berört | PASS / GAP |

---

## Smoke (på `main` efter merge)

| Kommando | Resultat |
|----------|----------|
| `npm run smoke:locked-ux` | PASS / FAIL |
| `npm run smoke:orkester` | PASS / FAIL / skip |
| `npm run build` | PASS / FAIL |

---

## Rekommendation

- [ ] Merge till `main` + push `origin`
- [ ] Merge **utan** gren-radering
- [ ] Cherry-pick specifika commits: ___________
- [ ] **Avbryt** — anledning: ___________

---

## Godkännande

**Användaren:** ☐ godkänn merge · ☐ avbryt  
**Datum:** ___________

---

Se även: [`GIT-LATHUND.md`](./GIT-LATHUND.md) · [`BRANCH-KARTA.md`](./BRANCH-KARTA.md)
