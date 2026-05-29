# Content Autorun — våg 8 ingest (checklista)

**Datum:** 2026-05-29  
**Status:** **open** — kräver mänsklig granskning före live ingest

---

## Före ingest

1. Granska alla KEEP i [`Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md) (001–047 + df-*)
2. Granska MåBra-batch i [`Mabra-CONTENT-BANK.md`](../specs/modules/Mabra-CONTENT-BANK.md)
3. Kör export + dry-run:

```bash
npm run export:kunskap-seed
node scripts/seed_kampspar_profile.mjs --manifest=kunskap-facts --dry-run
```

4. Verifiera att **ingen** personlig profil-data blandas in (manifest = endast FACT seed)

---

## Live ingest (efter godkännande)

```bash
node scripts/seed_kampspar_profile.mjs --manifest=kunskap-facts --skip-existing
npm run smoke:kunskap
```

**Deploy:** Endast om functions ändrats — annars ingest via befintlig `ingestKampsparEntry`.

---

## Efter ingest

- Testa RAG i Valv → Kunskapsbank med citation
- `npm run content:night` + `npm run orkester:night`

**MUST NOT:** auto-ingest utan granskning · LLM-genererad FACT · cross-RAG till Valv/Barnen
