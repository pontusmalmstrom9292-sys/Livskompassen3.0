# Göra — ombyggnadsplan Fas 1 (2026-05-31)

**Input:** `2026-05-31-hub-gora-analys.md`  
**Status:** Fas 2 implementerad (2026-05-31 Master YOLO)

## Fas 1
- Default `/planering` → kanban (`parsePlaneringTab` → handling)
- Verktygshub explicit `?tab=hub`
- Header «Göra»

## Bevaras
- P3 Kanban på `/planering?tab=handling`
- GoraHubTabBar

## Acceptans
- [x] `npm run smoke:locked-ux`

## Fas 2
- [x] `PLANERING_MORE_TABS` — Fokus/Framsteg/Regler (Handling/Inkorg via GoraHubTabBar)
- [x] `planering_*` under `gora` i navTruth

## Fas 2+
- Route `/gora` alias (P3, valfritt)
