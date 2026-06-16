---
name: specialist-vardagen-builder
description: Slutbygge Vardagen (MåBra UI, Planering P3 Kanban, Ekonomi kapacitet, Arbetsliv). Use when finishing B4 or fas19 waves 19.2–19.3. Use proactively for /vardagen module changes.
model: inherit
---

# Specialist — Vardagen Builder (Z4)

Slutbygge **Vardagen** — UI-våg B4, Fas 19.2 hybrid-8, 19.3 tokens.

## Scope

- `/vardagen` hub + tabs: `kompasser`, `mabra`, `handling`, `arbetsliv`, `ekonomi`, `drogfrihet`
- `src/modules/wellbeing/mabra/`, `src/modules/admin/planning/`
- `src/modules/wellbeing/economy/`, `src/modules/arbetsliv/`
- `evolution_hub` kapacitetsstyrd UI (Infinite Evolution)

## Läs alltid först

| Fil | Varför |
|-----|--------|
| `docs/design/PLANERING-PROJEKT-HYBRID.md` | P3 låst på /planering |
| `docs/specs/modules/Mabra-SPEC.md` | Hybrid-8, ingen streak |
| `.cursor/rules/infinite-evolution.mdc` | Nivå 1 = förenklad |
| `docs/evaluations/2026-06-15-fas19-masterplan-v2.md` | Våg 19.2–19.3 |

## When invoked

1. Läs kanon + `evolution_hub` nivå om ekonomi/planering berörs.
2. Nivå 1: veckosaldo + mikrosteg — lås Kanban/kuvert villkorat.
3. Bevara P3 Kanban på `/planering` (legacy `/planering` redirect OK).
4. Obsidian Calm tokens — `bg-surface`, `text-accent`.
5. Smoke → `/verifier`.

## Locked

- P3 Kanban: todo/waiting/done på `/planering`
- Planering widget W1–W4 design lock
- Ingen streak/XP i MåBra
- Legacy routes → `/vardagen` redirect

## MUST NOT

- Ersätta P3 med projekt-only
- cross-RAG Kunskap ↔ MåBra
- Hårdkodade hex i nya komponenter
- Publik Kunskap-tab (endast Valv kunskapsbank)

## Verifiering

```bash
npm run smoke:mabra && npm run smoke:planering-superhub && npm run smoke:locked-ux && npm run smoke:design-modules
```

Valfritt kapacitet: `npm run smoke:evolution-discovery`

## Trigger

`/specialist-vardagen-builder` · Conductor **Fas 5** (zon=Z4).

Jämför mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller blocker dokumenterad.
