# Dirigent — research våg 27 routing

**Datum:** 2026-06-16 · **Agent:** specialist-innehall-dirigent (Cursor)

## NEW → bank (CANDIDATE)

| research id | content_class | Bank | bankId |
|-------------|---------------|------|--------|
| research-sa1-001 | FACT | Kunskap | kunskap-fact-gad-036 |
| research-sa1-002 | FACT | Kunskap | kunskap-fact-adhd-029 |
| research-sa1-003 | FACT | Kunskap | kunskap-fact-eko-001 |
| research-sa3-001 | FACT | Kunskap | kunskap-fact-eko-002 |
| research-sa3-002 | FACT | Kunskap | kunskap-fact-eko-003 |
| research-sa3-003 | FACT | Kunskap | kunskap-fact-eko-004 |
| research-sa2-001 | FACT | Kunskap | kunskap-fact-cop-006 |
| research-sa2-004 | FACT | Kunskap | kunskap-fact-cop-007 |
| research-sa2-003 | FACT | Kunskap | kunskap-fact-jur-009 |
| research-sa4-003 | FACT | Kunskap | kunskap-fact-bh-015 |
| research-sa4-002 | FACT | Kunskap | kunskap-fact-bh-016 |
| research-sa1-004 | REFLECTION | MåBra | MB-REF-GAD-07 |
| research-sa1-009 | REFLECTION | MåBra | MB-REF-ADHD-05 |
| research-sa1-005 | PLAY | MåBra | MB-PLAY-GAD-02 |
| research-sa4-004 | PLAY | Barnen | BP-PLAY-25 |
| research-sa4-005 | PLAY | Barnen | BP-PLAY-26 |
| research-sa4-007 | PLAY | Barnen | BP-PLAY-27 |

## KEEP (ingen bank-ändring)

research-sa1-007, sa1-010, sa2-002, sa2-005, sa2-006, sa2-007, sa3-006, sa4-006, sa4-008

## REJECT / DEFER

- research-sa1-008 body doubling P3 — DEFER (duplicerar sa1-002)
- Diagnos-etiketter, narcissist-quiz — REJECT
- Hamn wire `written_only_escalation` — eval regler, ej content bank

## Ingest-gate

`status: CANDIDATE` → Pontus KEEP → `npm run seed:kunskap-facts` (FACT only)
