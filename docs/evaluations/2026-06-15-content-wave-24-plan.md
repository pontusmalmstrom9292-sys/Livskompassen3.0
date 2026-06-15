# Content våg 24 — plan (Innehåll Dirigent) — 2026-06-15

**Status:** PLAN — bank KEEP, ingest efter PMIR  
**Dirigent:** `specialist-innehall-dirigent` · **Kurator:** `specialist-kunskap-seed`

---

## Tema

**Juridisk process & vårdnad (FACT)** — stöd för dokumentation utan diagnos-etiketter, aligned med domän ~80% covert HCF.

| content_class | Silo | Route |
|---------------|------|-------|
| FACT | Kunskap | `kampspar` via seed manifest |
| — | Hamn/Valv bro | Ex-konflikt → **inte** auto-FACT i coach |

---

## Föreslagna FACT-id (KEEP — kurator fyller text)

| id | topic | source_tier |
|----|-------|-------------|
| jur-005 | LVU — dokumentationskrav (neutral) | reference |
| jur-006 | Vårdnad — bevisbar logistik vs känsloargument | reference |
| jur-007 | Familjerätt — parallellt föräldraskap (fakta) | reference |
| ep-006 | Myndighetskontakt — saklig ton, datum | reference |
| cn-022 | Dokumentation utan JADE (metod, inte personangrepp) | method |
| bh-013 | Barnets behov vid konflikt — observerbart beteende | reference |

**MUST NOT:** Etikettera motpart · diagnos i WORM · BIFF-coaching i Kunskap RAG.

---

## Kurator-delegering

| Uppgift | Agent | Output |
|---------|-------|--------|
| 16.1 FACT bank | `specialist-kunskap-seed` | `docs/specs/modules/Kunskap-CONTENT-SEED.md` |
| 16.2 JOY prod-wire | `specialist-mabra-curator` | PMIR före `mabraHubRegistry` wire |
| 16.3 Barnen PLAY | `specialist-barn-lek` | `BARNFOKUS_QUESTIONS` harmonisering only |

---

## Ingest & smoke (efter seed)

```bash
npm run seed:kunskap-facts   # manifest wave-24 när bank klar
npm run smoke:innehall
npm run smoke:content-waves
npm run smoke:kunskap
```

---

## Register-uppdatering

Uppdatera [`CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) rad våg 24 → **plan** tills ingest PASS.
