# Flow-verktyg — beslut 2026-06-18

**Status:** GODKÄND
**Kanon:** [`2026-06-17-flow-pipeline-karta.md`](./2026-06-17-flow-pipeline-karta.md) · gap-matrix `docs/external-ai/imports/gap-matrix-2026-06-18.md`

## Rakt svar

**Bygg inte Google Flow-verktyg i bulk nu.** P1/P2/P3/P6/P7 är LOCK som Firebase callables + Vertex/Gemini.

| ID | Google Flow-verktyg nu? | Repo |
|----|-------------------------|------|
| P1 Brusfilter | Nej | `processBrusfilter` LOCK |
| P2/P6 Dossier | Nej | `dossierAiForeword` LOCK |
| P3 Mönster-metadata | Nej | `patternMetadataAssist` LOCK |
| P5 Theme mockups | Nej | Design Freeport `/dev/design-freeport` |
| P7 Hamn BIFF | Nej | DEFER — `askGransArkitekten` |
| P4 MåBra capacity | Research valfritt | **Portad** till `mabraCapacityParafras.ts` |

## Huvudspår

1. Chameleon supermoduler i Design Freeport (prod orörd)
2. P4 deterministisk capacity-parafras i `mabraCoach`
3. Flow Tools Builder endast för valfri prompt-validering (≤200 krediter) — se `docs/prompts/P4-MABRA-COACH-FLOW-PROTOTYPE.md`

## PMIR

[`2026-06-18-pmir-b-p4-capacity-coach.md`](./2026-06-18-pmir-b-p4-capacity-coach.md)
