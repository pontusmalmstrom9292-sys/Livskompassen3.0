# Barnen — Play Bank

**Datum:** 2026-05-29  
**Kurator:** `specialist-barn-lek` *(plan)*  
**Syfte:** Lekfulla frågor till **Familjen / Barnfokus** — **PLAY**, inte Valv-bevis.

**Register:** [`INNEHALL-REGISTER.md`](../../INNEHALL-REGISTER.md) · **Låst UX:** `BarnfokusFraganPanel` · **Data:** `children_logs` (`category: barnfokus`)

---

## KEEP — Content autorun våg 4

| id | content_class | source_tier | status | lens | text_sv |
|----|---------------|-------------|--------|------|---------|
| BP-PLAY-01 | PLAY | product_copy | KEEP | gladje | Vad var roligast med {ChildAlias} idag — en sak? |
| BP-PLAY-02 | PLAY | product_copy | KEEP | knas | Berätta ett knasigt ögonblick — kort som en gåta. |
| BP-PLAY-03 | PLAY | product_copy | KEEP | lara_kanna | En ny sak du lärde dig om {ChildAlias} denna vecka. |
| BP-PLAY-04 | PLAY | product_copy | KEEP | utveckling | Vad blev {ChildAlias} bättre på — utan betyg? |
| BP-PLAY-05 | PLAY | product_copy | KEEP | valv_safe | En trygg stund hemma — vad hände? |

**MUST NOT:** vuxenkonflikt, diagnos, auto-promote till `reality_vault`.

**Smoke:** `npm run smoke:locked-ux` · `npm run smoke:content-waves`
