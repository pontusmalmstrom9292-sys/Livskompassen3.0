# Pack 03 — Planering + kognitiv grind

**Senast uppdaterad:** 2026-06-15  
Ladda upp `exports/gpt-handoff/repomix/gpt-pack-03-planering.md` till GPT **efter** pack 01–02.

**Kontext:** Våg A F5 deployad (`picked=1` på dock-Handling). Fas 19.5 planerar `evolution_ledger` dual-write.

---

## Prompt för GPT

Du granskar **Planering** — sannolikt den mest kritiska ADHD-funktionen i Livskompassen.

**Fokus:**

1. **P3 Kanban** — `PlanningKanbanBoard` på `/planering?tab=handling` (todo/waiting/done) — **design lock**
2. **Snabbväg** — dock Handling → `/planering?tab=handling&picked=1` hoppar över `GoraModulValjare` (F5)
3. **Kognitiv grind** — `useCognitiveGuard`, `CognitiveGuardView`, `useCapacityGate`
4. **Evolution hub** — `useEvolutionStore`, `capacity_engine`, `evolution_ledger` (append-only)
5. **Paralys-panel** — mikrosteg vid låg kapacitet (`ParalysPanel`, `ParalysisBreaker`)
6. **Superhub** — `PlaneringInputSuperModule`, inkast-delegates
7. **Projekt hybrid** — Kanban fast på `/planering`; flexibla listor på `/projekt` ([`PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md))

### Verifiera

- [ ] P3 Kanban kvar på `/planering?tab=handling` (ej flyttad till `/projekt`)
- [ ] Handling **inte** i `LivLauncherGrid` (F1) — endast dock + Fyren-genväg
- [ ] Avancerade verktyg låsta vid kapacitetsnivå 1 (ekonomi verifierad — planering?)
- [ ] `evolution_ledger` — ingen retroaktiv ändring i rules
- [ ] Planering ≠ Valv ≠ Kunskap (ingen cross-RAG)
- [ ] `CognitiveLoadStrip` — informativ copy eller faktisk grind?

### Uppgift

1. Kartlägg klickväg: överbelastad användare → första mikrosteg på Kanban.
2. Analysera om kognitiv grind **minskar** överbelastning eller skapar extra friktion.
3. Bedöm om `planning_kanban` feature-flagga faktiskt döljer Kanban vid låg kapacitet (grep i frontend).
4. Föreslå förbättringar för "ett personligt operativsystem" — max 3 åtgärder utan locked UX-risk.
5. Koppla till Fas 19.5 (`evolution_ledger` dual-write) — vad bör loggas vid kapacitetsändring?

**Ge INTE kod.** Beslutsmemo: Godkänn / Ändra X / Defer.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän analysen är komplett.
