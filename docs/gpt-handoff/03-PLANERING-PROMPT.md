# Pack 03 — Planering + kognitiv grind

Ladda upp `exports/gpt-handoff/repomix/gpt-pack-03-planering.md` till GPT **efter** pack 01–02.

---

## Prompt för GPT

Du granskar **Planering** — sannolikt den mest kritiska ADHD-funktionen i Livskompassen.

**Fokus:**

1. **P3 Kanban** — `PlanningKanbanBoard` på `/planering` (todo/waiting/done) — design lock
2. **Kognitiv grind** — `useCognitiveGuard`, `CognitiveGuardView`, `useCapacityGate`
3. **Evolution hub** — `useEvolutionStore`, `capacity_engine`, `evolution_ledger` (append-only)
4. **Paralys-panel** — mikrosteg vid låg kapacitet
5. **Superhub** — `PlaneringInputSuperModule`, inkast-delegates

### Verifiera

- [ ] P3 Kanban kvar på `/planering` (ej flyttad till `/projekt`)
- [ ] Avancerade verktyg låsta vid kapacitetsnivå 1
- [ ] `evolution_ledger` — ingen retroaktiv ändring
- [ ] Planering ≠ Valv ≠ Kunskap (ingen cross-RAG)

### Uppgift

Analysera om kognitiv grind faktiskt minskar överbelastning, eller skapar extra friktion. Föreslå förenklingar för "ett personligt operativsystem" snarare än "samling funktioner".

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
