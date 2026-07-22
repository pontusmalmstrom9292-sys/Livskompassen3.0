# Content våg 26 — plan (Innehåll Dirigent) — 2026-06-16

**Status:** **ingest PASS** 2026-06-16 — [`2026-06-16-fas16-wave26-ingest.md`](./2026-06-16-fas16-wave26-ingest.md)  
**Dirigent:** `specialist-innehall-dirigent` · **Kurator:** `specialist-kunskap-seed`

---

## Tema

**Medföräldraskap logistik — 10% neutral kommunikation (FACT)** — operativ vägledning utan Valv-UI, aligned med domän ~80% covert HCF men fokus på ren logistik.

| content_class | Silo | Route |
|---------------|------|-------|
| FACT | Kunskap | `kampspar` via seed manifest |
| — | Hamn/Valv bro | Konkret sms-svar → **Hamn**; bevis → **Valv** |

**Dirigent-klassning:** Godkänd. Våg 6 (`003`–`015`) och våg 24 (`jur-006`) täcker definition och juridisk tyngd; lucka kvar för **operativ** hämtning/lämning, skriftlig schema, överlämningsrutin, akut avvikelse och Grey Rock vid logistikpåminnelser. `ep-008` kompletterar `jur-006` med epistemik-klassning — inte duplicerad juridik_overview-text.

---

## Föreslagna FACT-id (KEEP — kurator fyllt text)

| id | topic | source_tier | category |
|----|-------|-------------|----------|
| cop-001 | Hämtning/lämning — neutral bekräftelse utan JADE | P2 | medforaldraskap_logistik |
| cop-002 | Kalender och schema — skriftlig logistik vs muntliga löften | P2 | medforaldraskap_logistik |
| cop-003 | Överlämning barn — kort rutin utan konflikt | P2 | medforaldraskap_logistik |
| cop-004 | Akut avvikelse — dokumentera datum/tid, inte tolkning | P2 | medforaldraskap_logistik |
| cop-005 | Grey Rock vid logistikpåminnelser (metod, inte person) | P1 | kommunikation_metod |
| ep-008 | Bevisbar logistik vs känsloargument (epistemik) | P2 | epistemik_produkt |

**MUST NOT:** Etikettera motpart · diagnos i WORM · BIFF-coaching i Kunskap RAG · fjärde silo · cross-RAG · Valv-komponenter.

---

## Kurator-delegering

| Uppgift | Agent | Output |
|---------|-------|--------|
| 26.1 FACT bank | `specialist-kunskap-seed` | `docs/specs/modules/Kunskap-CONTENT-SEED.md` |
| 26.2 Register | dirigent | `CONTENT-WAVES.md`, `INNEHALL-REGISTER.md` |

---

## Ingest & smoke (efter seed)

```bash
npm run export:kunskap-seed
npm run seed:kunskap-facts
npm run smoke:innehall
npm run smoke:kunskap
npm run content:night
```

---

## Register-uppdatering

Uppdatera [`CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) rad våg 26 → **done** efter ingest PASS.
