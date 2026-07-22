# Pre-Merge Impact Report (PMIR) — Vardagen B4 Planering polish

**Datum:** 2026-06-19  
**Gren:** `cursor/vardagen-b4-polish-7746`  
**Agent:** specialist-vardagen-builder (B4 progressive disclosure)

---

## Syfte

Progressive disclosure på Planering-hubben (`/planering`, `/vardagen?tab=handling`) — samma mönster som Valv A2.x: primärt innehåll synligt först, sekundärt bakom `CalmCollapsible`.

---

## Följer med till merge

| Fil | Ändring |
|-----|---------|
| `PlaneringHubCollapsible.tsx` | **Ny** — guld-glow wrapper kring `CalmCollapsible` |
| `PlaneringPage.tsx` | B4: P3 Kanban primär på Handling; extras under fold; modulnål på Inköp foldad |
| `VerktygDrawer.tsx` | Bytt custom toggle → `PlaneringHubCollapsible`; rutiner/hub i under-fold |

---

## Låst UX — oförändrat

- P3 Kanban (`PlanningKanbanBoard`) kvar under `GoraSuperModule variant="handling"`
- `GoraHubTabBar`, `PlaneringMoreTabsBar`, `VerktygDrawer`, `PlaneringNextStepSelect` kvar (flyttade under fold endast på Handling)
- Planering hybrid (P3 + Projekt) — ingen ändring
- Fyren widget / `planering-rutiner` hash — öppnar extras-fold + rutiner

---

## Försvinner

Inget. Ingen radering av locked flows.

---

## Regelanalys

| Lager | Status |
|-------|--------|
| Obsidian Calm tokens (`CalmCollapsible`, `glow="gold"`) | PASS |
| `firestore.rules` | Ej rörd |
| Cross-zone | Ej rörd (endast `features/admin/planning`) |
| Infinite Evolution / kapacitetsstyrning | Oförändrad |

---

## Smoke (lokal)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:design-modules` | **PASS** |

---

## Rekommendation

- [x] Merge till `main` efter smoke PASS + Pontus OK
- [ ] Deploy hosting endast om prod-release begärs (`firebase deploy --only hosting`)

---

## Godkännande

**Användaren:** ☐ godkänn merge  
**Datum:** —
