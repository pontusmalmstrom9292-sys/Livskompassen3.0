# UI-våg B1–B4 — modul för modul (Körfält B)

**Status:** Aktiv från 2026-06-15  
**Körfält A:** LOCK (CP-1–CP-6) — rör ej backend/WORM utan PMIR  
**Kanon:** [`UI-DESIGN-HANDOFF.md`](./UI-DESIGN-HANDOFF.md) · [`CHECKPOINT-PROTOCOL.md`](../CHECKPOINT-PROTOCOL.md)

---

## Ordning

| Våg | Modul | Route | ChatBox-leverans | Cursor smoke |
|-----|-------|-------|------------------|--------------|
| **B1** | Valv | `/valvet` | `VALV-VISION` + `VALV-SUPERMODULE-SPEC` | `smoke:locked-ux` · `smoke:valv` · `smoke:entities` · `smoke:orkester` |
| **B2** | Hjärtat | `/hjartat` | `HJARTAT-UI-SPEC` | `smoke:locked-ux` · `npm run build` |
| **B3** | Familjen | `/familjen` | `FAMILJEN-UI-SPEC` | `smoke:locked-ux` |
| **B4** | Vardagen | `/vardagen` + subroutes | `VARDAGEN-UI-SPEC` | `smoke:locked-ux` · `smoke:design-modules` |

**Defer:** Nav Våg B (H1–H4 routing), Våg C Fyren-strategi, MåBra hybrid-8.

---

## Ritual (upprepa per våg)

1. ChatBox: master-prompt + repomix + `PHASE-08` (B1) eller modul-SPEC
2. Spara rå output → `leveranser/ui-design/YYYY-MM-DD-b{N}-{modul}.md`
3. Cursor CHECKPOINT: PASS/REVISE → `docs/evaluations/`
4. Cursor: implementera godkänd del (ett fas-steg i taget)
5. Smoke PASS → uppdatera `LIFE-OS-BUILD-STATE.md`
6. Vid LOCK → `snapshot_locked_module.sh <modul>`

---

## Filägarskap

| Område | ChatBox | Cursor |
|--------|---------|--------|
| `docs/evaluations/*-ui-*.md` | Utkast i leverans | Sanning efter godkännande |
| `src/modules/features/lifeJournal/evidence/vault/**` | SPEC only (B1) | Impl |
| `src/modules/features/lifeJournal/diary/**` | SPEC (B2) | Impl |
| `src/modules/features/family/**` | SPEC (B3) | Impl — **ej** `BARNFOKUS_QUESTIONS` |
| `src/modules/features/dailyLife/**` | SPEC (B4) | Impl — **ej** P3 Kanban-logik |
| `functions/**` | **Nej** | Endast med explicit order |

---

## Repomix

| Modul | Kommando | Fil |
|-------|----------|-----|
| Valv | `npm run repomix:valv-komplett` | `exports/repomix-valv/repomix-valv-komplett-*.md` |
| Övriga | `npm run chatbot:pack:ui-design` | `exports/chatbot-handoff/ui-design-pack.md` |

---

## Locked UX (alla vågar)

- Valv: Mönster, Orkester, Kunskapsbank, Aktörskarta
- Familjen: Barnfokus, `FamiljenInputSuperModule`, `BARNFOKUS_QUESTIONS`
- Planering: P3 Kanban på `/planering`
- Barnporten: HITL → Valv via `SaveAsEvidencePrompt`
