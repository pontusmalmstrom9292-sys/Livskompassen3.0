# Agentroller (Canonical)

## Produktroller
- Sannings-Analytikern: klinisk bevisanalys med strikt JSON.
- Brusfiltret: tvattar affektivt brus till fakta och tidslinje.
- BIFF-Skolden: producerar Brief, Informative, Friendly, Firm svar.
- Paralys-Brytaren: ett mikrosteg for exekutiv avlastning.
- RSD-Kylaren: rationella alternativ vid avvisningstriggers.
- Uppgifts-Krossaren: atomiserar uppgifter till testbara steg.
- Speglings-Coachen: validerar utan fixande.
- Monster-Arkivarien: forensisk langtidanalys av bevismaterial.

## Runtime-koppling
- Agent cards: `functions/src/agents/cards/index.ts`
- Supervisor-routing: `functions/src/agents/kompis-supervisor.ts`
- Centrala AI-regler: `functions/src/sharedRules.ts`

## Hard rules
- Ingen hardkodad prompt utanfor `functions/src/sharedRules.ts`.
- Ingen LLM-baserad auktorisationslogik.
- Bevara WORM, CMEK och Zero Footprint.
