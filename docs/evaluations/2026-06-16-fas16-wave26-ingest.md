# Fas 16b — Våg 26 Kunskap ingest — 2026-06-16

**Status:** **PASS**  
**Kurator:** `specialist-kunskap-seed` · **Dirigent:** `specialist-innehall-dirigent`  
**Plan:** [`2026-06-16-content-wave-26-plan.md`](./2026-06-16-content-wave-26-plan.md)

---

## Tema

Medföräldraskap logistik — 10% neutral kommunikation (FACT) — operativ vägledning utan diagnos-etiketter, aligned med domän ~80% covert HCF.

| Silo | Route | Bryter U1? |
|------|-------|------------|
| Kunskap | `kampspar` via `Kunskap-CONTENT-SEED.json` | Nej |

**MUST NOT verifierat:** ingen BIFF-coaching i Kunskap · ingen etikett på motpart · ingen fjärde RAG-silo · inga `firestore.rules`-ändringar · inga Valv-komponenter rörda.

---

## Bank KEEP (6 poster)

| bankId | title | tier | category |
|--------|-------|------|----------|
| kunskap-fact-cop-001 | Hämtning och lämning — neutral bekräftelse utan JADE | P2 | medforaldraskap_logistik |
| kunskap-fact-cop-002 | Kalender och schema — skriftlig logistik vs muntliga löften | P2 | medforaldraskap_logistik |
| kunskap-fact-cop-003 | Överlämning barn — kort rutin utan konflikt | P2 | medforaldraskap_logistik |
| kunskap-fact-cop-004 | Akut avvikelse — dokumentera datum och tid, inte tolkning | P2 | medforaldraskap_logistik |
| kunskap-fact-cop-005 | Grey Rock vid logistikpåminnelser — metod, inte person | P1 | kommunikation_metod |
| kunskap-fact-ep-008 | Bevisbar logistik vs känsloargument — epistemik i medföräldraskap | P2 | epistemik_produkt |

Manifest: `docs/specs/modules/Kunskap-CONTENT-SEED.json` — **117** poster totalt.

---

## Ingest

```bash
npm run export:kunskap-seed
npm run seed:kunskap-facts   # --skip-existing (inbyggt)
```

| Resultat | Antal |
|----------|-------|
| ok (nya) | 6 |
| skip (befintliga) | 111 |
| fail | 0 |

**Owner uid:** `TtrK8VEvBgZufJIDwHLyv2YdJMb2` (Admin SDK seed-konto)

| bankId | docId | embeddingDim |
|--------|-------|--------------|
| kunskap-fact-cop-001 | `E7XNpNq2Js3zpryW7aSd` | 768 |
| kunskap-fact-cop-002 | `3MPuHammOAohxYTF279x` | 768 |
| kunskap-fact-cop-003 | `swl3f4xpAowcfoWOFwKn` | 768 |
| kunskap-fact-cop-004 | `8Deinvu04zu42TvIXihV` | 768 |
| kunskap-fact-cop-005 | `yAeulu8sEegDkwnmPLak` | 768 |
| kunskap-fact-ep-008 | `bZgU0rIZWpUhG60m4Ss7` | 768 |

---

## Smoke

| Kommando | Status |
|----------|--------|
| `npm run smoke:innehall` | PASS |
| `npm run smoke:kunskap` | PASS |
| `npm run content:night` | PASS |

---

## Register

- [`CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) våg 26 → **done**
- [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md) våg 26-sektion tillagd
