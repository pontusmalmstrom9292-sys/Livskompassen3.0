# Fas 16b — Våg 25 Kunskap ingest — 2026-06-16

**Status:** **PASS**  
**Kurator:** `specialist-kunskap-seed` · **Dirigent:** `specialist-innehall-dirigent`  
**Plan:** [`2026-06-16-content-wave-25-plan.md`](./2026-06-16-content-wave-25-plan.md)

---

## Tema

Soc/skola + neutral myndighetsdialog (FACT) — operativ vägledning utan diagnos-etiketter, aligned med domän ~80% covert HCF.

| Silo | Route | Bryter U1? |
|------|-------|------------|
| Kunskap | `kampspar` via `Kunskap-CONTENT-SEED.json` | Nej |

**MUST NOT verifierat:** ingen BIFF-coaching i Kunskap · ingen etikett på motpart · ingen fjärde RAG-silo · inga `firestore.rules`-ändringar.

---

## Bank KEEP (6 poster)

| bankId | title | tier | category |
|--------|-------|------|----------|
| kunskap-fact-soc-001 | Socialtjänst handläggning — utredningssteg och rättigheter | P2 | myndighet_soc |
| kunskap-fact-skol-001 | Skolrapport och kartläggning — observerbart utan vuxenkonflikt | P2 | skola_myndighet |
| kunskap-fact-bup-001 | BUP — neutral remiss och föräldrasamtal | P2 | barn_hcf |
| kunskap-fact-bh-014 | Barns berättelse vs vuxen tolkning | P2 | barn_hcf |
| kunskap-fact-ep-007 | Myndighetsunderlag — citat och tolkning i separata lager | P2 | epistemik_produkt |
| kunskap-fact-jur-008 | Sekretess och informationsdelning — soc och skola | P2 | juridik_overview |

Manifest: `docs/specs/modules/Kunskap-CONTENT-SEED.json` — **111** poster totalt.

---

## Ingest

```bash
npm run export:kunskap-seed
npm run seed:kunskap-facts   # --skip-existing (inbyggt)
```

| Resultat | Antal |
|----------|-------|
| ok (nya) | 6 |
| skip (befintliga) | 105 |
| fail | 0 |

**Owner uid:** `TtrK8VEvBgZufJIDwHLyv2YdJMb2` (Admin SDK seed-konto)

| bankId | docId | embeddingDim |
|--------|-------|--------------|
| kunskap-fact-bup-001 | `Fznw5oQACtHMPlAKWptq` | 768 |
| kunskap-fact-skol-001 | `w10UwNteyzT9wZTKFcHx` | 768 |
| kunskap-fact-soc-001 | `b63eSCYpOLchg2f5EbeP` | 768 |
| kunskap-fact-ep-007 | `XcDLNpLg59HBVCqcJAHp` | 768 |
| kunskap-fact-jur-008 | `ZT1lQO3kpREaieiDYLGJ` | 768 |
| kunskap-fact-bh-014 | `wZWjo5LJx6YXBku8lgJN` | 768 |

---

## Smoke

| Kommando | Status |
|----------|--------|
| `npm run smoke:innehall` | PASS |
| `npm run smoke:kunskap` | PASS |
| `npm run content:night` | PASS |

---

## Register

- [`CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) våg 25 → **done**
- [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md) våg 25-sektion tillagd
