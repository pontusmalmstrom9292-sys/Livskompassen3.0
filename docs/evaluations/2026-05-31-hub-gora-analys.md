# Hub-analys: Göra (Planering · Projekt · GoraHubTabBar)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `/planering`, `/projekt`, Göra-hub konsolidering

---

## Syfte & route

**Göra** är konsoliderad planerings-hub: **Handling** (Kanban P3), **Projekt** (flexibla planer), **Inkorg** (e-post/kalender). Drawer-label “Göra” pekar på `/planering?tab=handling` (`navTruth.ts` 192–255).

| Entry | Route | Komponent |
|-------|-------|-----------|
| Göra (drawer) | `/planering?tab=handling` | `PlaneringPage` |
| Projekt | `/projekt`, `/admin/projects/:id` | `ProjektHubPage`, `ProjektDetailPage` |
| Planering hub | `/planering` (tab=hub) | `PlaneringHub` verktygsväljare |
| Undertabbar | `handling`, `fokus`, `framsteg`, `inkorg`, `regler`, `inkop` | `planeringHubConfig` |

Kors-tab-bar: `GoraHubTabBar.tsx` — **Handling | Projekt | Inkorg** över både Planering och Projekt sidor.

---

## Användarresa ×3

### 1. Kanban Handling (locked P3)
Göra → **Handling** → `PlanningKanbanBoard` på `/planering?tab=handling`. Måste finnas kvar enligt `PLANERING-PROJEKT-HYBRID.md` (smoke `/planering`).

### 2. Skapa och öppna projekt
GoraHubTabBar → **Projekt** → `/projekt` lista → `/admin/projects/:projectId`. Nya projekt via `/projekt/ny` eller `/admin/projects/ny` (`AppRoutes` 148–181).

### 3. Inkorg och e-postregler
**Inkorg**-flik i GoraHubTabBar → `PlaneringInkorgPanel`; **Regler** endast under Planering-intern TabBar (ej i GoraHubTabBar). Hem-pin via `PlaneringHomePinCard` på `/`.

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| P3 Kanban på /planering | PLANERING hybrid lock | `PlaneringPage` 43–44 | ✅ |
| Göra = Handling+Projekt+Inkorg | MENU-DRAWER 2026-05-31 | `GoraHubTabBar` 7–17 | ✅ |
| Projekt flex (listor, bilder) | Widget v2 W1 | `ProjektHubPage` 15–24 | ✅ |
| Fyren widget planering | WIDGET-BAR-SPEC | smoke FyrenWidgetBar | ✅ |
| planering vs gora id | Legacy alias | `navTruth` både `gora_*` och `planering_*` | ⚠️ dublett |

---

## Kod vs spec — GoraHubTabBar

```19:26:src/modules/core/navigation/GoraHubTabBar.tsx
export function resolveGoraTab(pathname: string, search: string): GoraTab {
  if (pathname.startsWith('/projekt') || pathname.startsWith('/admin/projects')) {
    return 'projekt';
  }
  const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');
  if (tab === 'inkorg') return 'inkorg';
  return 'handling';
}
```

Planering **fokus/framsteg/regler** syns inte i GoraHubTabBar — endast via Planering intern navigation (`PlaneringPage` 76–80 “Alla verktyg”).

---

## Navigationsproblem

1. **Dubbel nav-modell:** GoraHubTabBar (3 flikar) vs Planering interna flikar (hub, fokus, framsteg, regler, inkop) — kognitiv belastning.
2. **`gora` vs `planering` i navTruth** — samma paths, dubbla parentId-träd (rad 192–255).
3. **Projekt path split:** `/projekt` vs `/admin/projects/:id` — GoraHubTabBar hanterar båda men URL-mentalmodell splittrad.
4. **Inkorg vs inkop:** Liknande namn (`inkorg` tab vs `inkop` quick list) — lätt att blanda.

---

## Locked UX

| Feature | Register |
|---------|----------|
| P3 Kanban Handling | `PLANERING-PROJEKT-HYBRID.md` |
| Planeringssida + Fyren widget | `PLANERINGSSIDA-SPEC`, `WIDGET-BAR-SPEC` |
| Widget v2 projekt | galleri W1-kompakt-projekt |
| PlaneringHomePinCard | Hem fäst lista |

---

## Smoke

| Script | Kontroller |
|--------|------------|
| `npm run smoke:locked-ux` | `/planering`, Planering panels |
| `npm run smoke:design-modules` | Planering layout |
| `npm run build` | admin/planning chunk |

---

## Ombyggnadsidéer P1–P3

**P1:** Rensa dublett `planering_*` vs `gora_*` i navTruth (behåll `gora` som drawer-id).  
**P2:** GoraHubTabBar + “Fler verktyg” dropdown för fokus/framsteg/regler.  
**P3:** En route `/gora` som router wrapper (alias) — minskar `/planering`-förvirring.

---

## diff-scope

| Område | Filer |
|--------|-------|
| Göra tab bar | `GoraHubTabBar.tsx` |
| Planering | `PlaneringPage.tsx`, `PlanningKanbanBoard.tsx`, `planeringHubConfig` |
| Projekt | `ProjektHubPage.tsx`, `ProjektDetailPage.tsx`, `ProjektNyPage.tsx` |
| Nav | `navTruth.ts` (gora/planering) |
| Hem pin | `PlaneringHomePinCard.tsx` |
| Docs | `PLANERING-PROJEKT-HYBRID.md` |

**Ej scope:** Valv ekonomi (lön) — Arbetsliv/Valv.
