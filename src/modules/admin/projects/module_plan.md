# Projekt — modulplan

**Hybrid (låst):** [`docs/design/PLANERING-PROJEKT-HYBRID.md`](../../docs/design/PLANERING-PROJEKT-HYBRID.md)  
**Spec:** [`docs/design/PROJEKT-SPEC.md`](../../docs/design/PROJEKT-SPEC.md)  
**Widget:** [`docs/design/galleri/widget/v2/W1-kompakt-projekt.png`](../../docs/design/galleri/widget/v2/W1-kompakt-projekt.png)

## P1 — done

- [x] `/projekt` hub · `/projekt/ny` picker (lista, anteckning, bild, uppgift)
- [x] `projects` + `project_blocks`
- [x] Uppgift-block → `planning_tasks` → **Handling kanban** (fast)

## P2 — done (2026-05-29)

- [x] Bild — Storage `project_media/{uid}/{projectId}/` + `imageUrl` på block
- [x] `/projekt/regler` — lokala automation-regler (länk till inkorg)
- [x] Widget — `FyrenSmartWidgetBar` + `ProjektPickerSheet` på planering/projekt

## Fas 3 — Life OS kopplingar (2026-05-29)

- [x] MaterialPack-editor light — `/projekt/genvagar` (localStorage per användare)
- [x] `getMaterialShortcuts` + overrides via `materialPackApi.ts`
- [ ] Rutin → `planning_tasks` (delvis: `RoutinesPanel` på Planering)
- [ ] `project_rules` Firestore — **kräver PMIR**

## Kopplingar (backlog)

- Se [`docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../../docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) — rutiner, modullänkar, exempelhubbar (`kör kopplingar` / `kör life hub MVP`).
