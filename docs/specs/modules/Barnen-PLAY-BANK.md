# Barnen — Play Bank (planerad)

**Datum:** 2026-05-25 (skelett)  
**Kurator:** `specialist-barn-lek` *(agent ej skapad än)*  
**Syfte:** Lekfulla, korta frågor till **Familjen / Barnfokus** — **inte** Valv-bevis, **inte** Kunskap-RAG.

**Register:** [`docs/INNEHALL-REGISTER.md`](../../INNEHALL-REGISTER.md) · **Låst UX:** `BarnfokusFraganPanel` · **Data:** `children_logs` (`category: barnfokus`).

---

## Gränser

| Gör | Gör inte |
|-----|----------|
| `content_class: PLAY` | `EVIDENCE` utan förälder sparar logg |
| Korta barnvänliga frågor | Vuxen KBT, ex, diagnos |
| Rotera pool som `BARNFOKUS_QUESTIONS` | Auto-promote till `reality_vault` |

**Kurator:** skapas när produkt säger ja — tills dess använd `BARNFOKUS_QUESTIONS` i kod.

**Smoke:** `npm run smoke:locked-ux` · `npm run smoke:children`
