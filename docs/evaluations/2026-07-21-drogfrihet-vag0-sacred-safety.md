# Drogfrihet — Sacred safety invariants (SSI) + content gate

**Datum:** 2026-07-21 · Våg 0 · approved with plan v2

## SSI (får inte brytas utan klinisk PMIR + Pontus OK)

| ID | Invariant |
|----|-----------|
| SSI-01 | Livsfara → **112** (aldrig 113) |
| SSI-02 | Suicidstöd → **90101**; vård → 1177; Droghjälpen 020-91 91 91; Alkoholhjälpen 020-84 44 48 |
| SSI-03 | SOS Zero Footprint default (ingen craving-innehållslog) |
| SSI-04 | Ingen terapeut-AI (diagnos/plan/dos) |
| SSI-05 | App ≠ behandling (disclaimer) |
| SSI-06 | Lapse ≠ relapse + AVE-skyddad copy |
| SSI-07 | Förbjudet: glorifiering, anskaffning, skam, streak-straff |
| SSI-08 | Vit recovery ≠ Valv/Barn; shareWithCoach false |

## Content safety gate (före varje innehållsvåg)

1. Nummer-lint: 0× "Ring 113" / tel:113 som akut  
2. Skam-lint  
3. Trigger-minimering  
4. FACT vs REFLECTION klass  
5. Terapeut-AI-scan  
6. AVE-språk vid reset  
7. Disclaimer pekar SSI-01/02  
8. Sign-off specialist-drogfrihet (+ kunskap-seed för FACT)

FAIL → våg stoppas.
