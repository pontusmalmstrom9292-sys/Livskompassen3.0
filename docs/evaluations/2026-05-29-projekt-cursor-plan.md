# Projekt — genomförbarhetsplan (Cursor, utan Vertex)

**Datum:** 2026-05-29  
**Metod:** Direkt läsning av repo + design-lock  
**Kanon:** [`docs/design/PROJEKT-SPEC.md`](../design/PROJEKT-SPEC.md) · [`docs/design/PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md)  
**Kod:** `src/modules/admin/projects/` · `src/modules/projekt/`  
**Mall:** [`MALL-cursor-plan.md`](./MALL-cursor-plan.md)

---

## Slutsats

**Projekt P1 + P2 är i stort sett live** — hub, picker, lista/anteckning/bild/uppgift, Storage bilder, `/projekt/regler`, widget-sheet.

**Nästa steg är Life OS-kopplingar (Fas 3)** — MaterialPack-editor, rutiner → kanban — **inte** ombyggnad av P1/P2.

---

## REASONS (kort)

| | |
|---|---|
| **Requirements** | Flex projekt; P3 Kanban stays på `/planering` |
| **Entities** | `projects`, `project_blocks`, `planning_tasks`; lokala regler |
| **Approach** | Utöka kopplingar; flytta inte kanban hit |
| **Structure** | `/projekt`, `/projekt/ny`, `/projekt/:id`, `/projekt/regler` |
| **Operations** | CRUD blocks; bild → `project_media/` |
| **Norms** | Hybrid lock; widget v2 |
| **Safeguards** | P3 Kanban oförändrad; `storage.rules` vid nya paths |

---

## Vad som redan fungerar (verifierat i kod)

| Krav | Kod |
|------|-----|
| Hub + ny picker | `ProjektHubPage`, `ProjektNyPage` |
| Bild-block + Storage | `ProjektDetailPage`, `uploadProjectImage` |
| Regler-vy | `ProjektReglerPage` → `/projekt/regler` |
| Widget sheet | `ProjektPickerSheet`, `FyrenSmartWidgetBar` |
| Uppgift → kanban | task block → `planning_tasks` |

---

## Gap-analys (P2 vs kod)

| PROJEKT-SPEC P2 | Kod idag | Gap |
|-----------------|----------|-----|
| Bild-uppladdning | Ja | **Ingen** |
| `/projekt/regler` | Ja (lokal persistens) | Firestore `project_rules` = **Fas 3** |
| Widget → `/projekt/ny` | Ja | **Ingen** |
| MaterialPack-editor | Read-only `materialPacks.ts` | **Fas 3** |
| Mejl/röst-block | Ej P1/P2 | **Backlog** |
| Delade projekt | Nej | **Backlog** |

---

## Bevaras (MUST NOT regress)

- P3 Kanban på `/planering?tab=handling` (locked UX)
- Projekt som flex “mapp” — ersätter inte kanban
- `project_media/` WORM i `storage.rules`

---

## Rekommenderade faser

### Fas 3 — Life OS kopplingar (ingen rules om lokalt)

- MaterialPack redigerbar per `LifeHubPreset` (minst en hub)
- Rutin → skapa `planning_tasks` (delvis: `RoutinesPanel` på Planering)
- `project_rules` i Firestore + koppling `planning_email_rules` — **kräver PMIR**

### Fas 4 — Block-typer utökade

- Mejl/röst-block enligt PROJEKT-SPEC
- OCR på bild (defer)

---

## Acceptans (vid `kör Projekt Fas 3`)

- [ ] MaterialPack kan redigeras (minst en hub)
- [ ] `npm run smoke:locked-ux` PASS
- [ ] `module_plan.md` uppdaterad

---

## Nästa steg

Svara **`kör Projekt Fas 3`** för MaterialPack + kopplingar, eller **`kör kopplingar C`** enligt Life OS-plan.
