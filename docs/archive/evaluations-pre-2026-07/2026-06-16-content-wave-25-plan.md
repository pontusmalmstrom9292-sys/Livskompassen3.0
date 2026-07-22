# Content våg 25 — plan (Innehåll Dirigent) — 2026-06-16

**Status:** **ingest PASS** 2026-06-16 — [`2026-06-16-fas16-wave25-ingest.md`](./2026-06-16-fas16-wave25-ingest.md)  
**Dirigent:** `specialist-innehall-dirigent` · **Kurator:** `specialist-kunskap-seed`

---

## Tema

**Soc/skola + neutral myndighetsdialog (FACT)** — fördjupar våg 21–24 utan Valv-UI, aligned med domän ~80% covert HCF.

| content_class | Silo | Route |
|---------------|------|-------|
| FACT | Kunskap | `kampspar` via seed manifest |
| — | Hamn/Valv bro | Ex-konflikt → **inte** auto-FACT i coach |

**Dirigent-klassning:** Godkänd. Våg 24 täckte juridisk process/vårdnad generellt (`ep-006`, `jur-005`–`007`); lucka kvar för **operativ** soc/skola/BUP-dialog och **barnets ord vs vuxen tolkning**. Ingen overlap med `cn-015` (kort BBIC-pekare) — våg 25 är fördjupning per forum.

---

## Föreslagna FACT-id (KEEP — kurator fyllt text)

| id | topic | source_tier | category |
|----|-------|-------------|----------|
| soc-001 | Socialtjänst handläggning — utredningssteg och rättigheter | P2 | myndighet_soc |
| skol-001 | Skolrapport och kartläggning utan vuxenkonflikt | P2 | skola_myndighet |
| bup-001 | BUP — neutral remiss och föräldrasamtal | P2 | barn_hcf |
| bh-014 | Barns berättelse vs vuxen tolkning | P2 | barn_hcf |
| ep-007 | Myndighetsunderlag — citat och tolkning separerade | P2 | epistemik_produkt |
| jur-008 | Sekretess och informationsdelning soc/skola | P2 | juridik_overview |

**MUST NOT:** Etikettera motpart · diagnos i WORM · BIFF-coaching i Kunskap RAG · fjärde silo · cross-RAG.

---

## Kurator-delegering

| Uppgift | Agent | Output |
|---------|-------|--------|
| 25.1 FACT bank | `specialist-kunskap-seed` | `docs/specs/modules/Kunskap-CONTENT-SEED.md` |
| 25.2 Register | dirigent | `CONTENT-WAVES.md`, `INNEHALL-REGISTER.md` |

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

Uppdatera [`CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) rad våg 25 → **done** efter ingest PASS.
