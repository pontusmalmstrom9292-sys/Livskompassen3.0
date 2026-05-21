# ANALYS — archive walkthrough + legacy-system-plan (historisk Repomix)

**Källa:** [`walkthrough.md`](../walkthrough.md), [`legacy-system-plan.md`](../legacy-system-plan.md)  
**Jämfört mot:** baseline Repomix, GCP inventory, aktiv repo.

---

## Påstår klart men repo/GCP säger delvis/nej

| Påstående | Verklighet 2026-05-21 |
|-----------|----------------------|
| "Vector Search 2.0 live" (walkthrough Fas 2) | 2 index i GCP, **0 endpoints**, kod token-match |
| "Fas 3 slutförd" (DCAP + Retention + Context Cache) | DCAP/speglar delvis; retention path legacy; cache okänd deploy |
| `Gräns-Arkitekten` agent card | **Saknas** i `functions/src/agents/cards/` |
| SystemSynapse Firestore prod | **Blueprint only** |

## Bevaras som vision

- EntityProfile anti-hallucination
- SystemSynapse groundingPoints
- Cloud Run Jobs långtidsanalys (`architecture.md`)
- Smart arkiv självsortering (Kunskap-SPEC §12)

## Action

Använd **inte** walkthrough som deploy-sanning — se [`GCP-INVENTORY-2026-05-21.md`](../GCP-INVENTORY-2026-05-21.md).
