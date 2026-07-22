# Fas 16b — Våg 24 Kunskap ingest — 2026-06-15

**Status:** **PASS**  
**Kurator:** `specialist-kunskap-seed` · **Dirigent:** `specialist-innehall-dirigent`  
**Plan:** [`2026-06-15-content-wave-24-plan.md`](./2026-06-15-content-wave-24-plan.md)

---

## Tema

Juridisk process & vårdnad (FACT) — neutral dokumentation utan diagnos-etiketter, aligned med domän ~80% covert HCF.

| Silo | Route | Bryter U1? |
|------|-------|------------|
| Kunskap | `kampspar` via `Kunskap-CONTENT-SEED.json` | Nej |

**MUST NOT verifierat:** ingen BIFF-coaching i Kunskap · ingen etikett på motpart · ingen fjärde RAG-silo · inga `firestore.rules`-ändringar.

---

## Bank KEEP (6 poster)

| bankId | title | tier | category |
|--------|-------|------|----------|
| kunskap-fact-jur-005 | LVU — dokumentationskrav (neutral översikt) | P2 | juridik_overview |
| kunskap-fact-jur-006 | Vårdnad — bevisbar logistik vs känsloargument | P2 | juridik_overview |
| kunskap-fact-jur-007 | Familjerätt — parallellt föräldraskap i praktiken | P2 | juridik_overview |
| kunskap-fact-ep-006 | Myndighetskontakt — saklig ton och datum | P2 | epistemik_produkt |
| kunskap-fact-cn-022 | Dokumentation utan JADE — metod, inte personangrepp | P1 | covert_taktik |
| kunskap-fact-bh-013 | Barnets behov vid konflikt — observerbart beteende | P2 | barn_hcf |

Manifest: `docs/specs/modules/Kunskap-CONTENT-SEED.json` — **105** poster totalt.

---

## Ingest

```bash
npm run seed:kunskap-facts   # --skip-existing (inbyggt)
```

| Resultat | Antal |
|----------|-------|
| ok (nya) | 6 |
| skip (befintliga) | 99 |
| fail | 0 |

**Owner uid:** `TtrK8VEvBgZufJIDwHLyv2YdJMb2` (Admin SDK seed-konto)

| bankId | docId | embeddingDim |
|--------|-------|--------------|
| kunskap-fact-jur-005 | `aLZSA9euXW2dvjb7CJpH` | 768 |
| kunskap-fact-ep-006 | `Fb5NH5TMfc2CLhnDF0Fm` | 768 |
| kunskap-fact-jur-006 | `MJBTqDTzMabv7PMJZBaT` | 768 |
| kunskap-fact-jur-007 | `sKETCiTd2CNkSsjZoUYm` | 768 |
| kunskap-fact-bh-013 | `DFozZtaO30Vh6NSMIwaL` | 768 |
| kunskap-fact-cn-022 | `45FwTKu06pKuG5uf4eIv` | 768 |

---

## Smoke

| Kommando | Resultat |
|----------|----------|
| `npm run smoke:innehall` | **PASS** |
| `npm run smoke:content-waves` | **PASS** |
| `npm run smoke:kunskap` | **PASS** — `ingestKampsparEntry` + `knowledgeVaultQuery` citation match |

---

## Register-uppdateringar

| Fil | Ändring |
|-----|---------|
| `docs/content/CONTENT-WAVES.md` | våg 24 → **done** ingest klar |
| `docs/INNEHALL-REGISTER.md` | våg 24 ingest-tabell + bankstatus |
| `docs/specs/modules/Kunskap-CONTENT-SEED.md` | batch våg 24 → ingest PASS |
| `docs/evaluations/2026-06-15-content-wave-24-plan.md` | status → ingest PASS |

---

## Säkerhet (oförändrat)

- WORM: endast append via `ingestKampsparEntry` — inga update/delete på bevis-collections
- Tre silos: Kunskap only — ingen cross-RAG
- Prompts: ej rörda (`sharedRules.ts` oförändrad)
- Locked UX: ej rörd (ingen Valv/Familjen-kod)

---

## Nästa steg (ej denna session)

- Fas 16.2: MåBra JOY våg 17 prod-wire — **DEFER** (PMIR)
- Fas 16.3: Barnen PLAY harmonisering — bank redan done våg 18/20
