# Planering — OAuth Gmail/Kalender (P3, valfri)

**Status:** Ej påbörjad. Kräver explicit produktbeslut och governance.

## Varför separat

- GCP-kostnad och OAuth-träsk (mot governance «gratis först»)
- P0–P2 täcker **klistra in mejl** + manuell kalender i Inkorg

## Förutsättningar om aktiverad

1. Read-only Gmail + Calendar scope
2. Callable eller batch — ingen LLM i routing
3. `planning_email_rules` execution server-side
4. Zero Footprint — tokens rensas vid logout

## Smoke före merge

`npm run smoke:locked-ux` · inga nya silos · ex-brus → Hamn oförändrat
