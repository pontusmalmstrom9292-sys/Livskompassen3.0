# Planering — genomförbarhetsplan (Cursor, utan Vertex)

**Datum:** 2026-05-29  
**Metod:** Direkt läsning av repo + design-lock (ingen Repomix/Vertex)  
**Kanon:** [`docs/design/PLANERING-PROJEKT-HYBRID.md`](../design/PLANERING-PROJEKT-HYBRID.md) · [`docs/design/PLANERINGSSIDA-SPEC.md`](../design/PLANERINGSSIDA-SPEC.md) · [`docs/design/planering/PLANERING-P3-KANBAN-SPEC.md`](../design/planering/PLANERING-P3-KANBAN-SPEC.md)  
**Kod:** `src/modules/admin/planning/` · Projekt: `src/modules/admin/projects/`, `src/modules/projekt/`

---

## Slutsats

**Planering P1 är i stort sett live** — Kanban (P3), Fokus, Inkorg (klistra in mejl), hub-verktyg, `planning_tasks`, projektfilter och bro till `/projekt` finns.

**Nästa meningsfulla steg är inte “bygg Planering från noll”** utan en **kort Fas 1.5** (ADHD-värde, inga rules): snabbare väg till Handling, deadline i snabb-lägg till, lite mer Fokus/Framsteg.

**Fas 2+** (e-postregler, Gmail, `planning_events`) kräver **ny Firestore-collection + rules-review** — samma typ av stopp som Dagbok Fas 2.

---

## REASONS (kort)

| | |
|---|---|
| **Requirements** | P3 Kanban fast; Projekt flex; ex-brus → Hamn; ett mikrosteg (Fokus) |
| **Entities** | `planning_tasks` (live); `planning_email_rules` / `planning_events` (planerade, ej rules) |
| **Approach** | Förbättra befintlig `admin/planning` — flytta inte till `src/modules/planering/` utan PMIR |
| **Structure** | `PlaneringPage` + tabbar; Kanban oförändrad kärna |
| **Operations** | `createPlanningTask` / `updatePlanningTask` (status, microStep, dueAt, summary) |
| **Norms** | Obsidian Calm, guld; ingen streak/XP |
| **Safeguards** | Locked: Kanban kvar; inte ex-RAG hit; `planning_tasks` delete:false |

---

## Vad som redan fungerar (verifierat i kod)

| Krav (spec/lock) | Kod |
|------------------|-----|
| P3 — Att göra / Väntar / Klart | `PlanningKanbanBoard` + `KANBAN_COLUMNS` |
| `planning_tasks` | `planningTasksApi.ts`, rules `firestore.rules` L137–154 |
| Käll-ikon per kort | `PlanningTaskCard` + `SOURCE_ICONS` |
| + per kolumn, kort-sheet, flytta kolumn | `PlanningKanbanColumn`, `PlanningTaskDetail` |
| Mikrosteg (Paralys) | `microStep` + Fokus-panel |
| Inkorg — klistra in → uppgift | `PlaneringInkorgPanel.handleCreate` |
| Inkorg — kalender förberedelse-UI | `PlaneringInkorgCalendarPanel` (placeholder veckovy) |
| Projektfilter på kanban | `?projectId=` i `PlanningKanbanBoard` |
| Hub «ett steg räcker» | `PlaneringHub`, `PLANERING_TOOLS` |
| Rutiner på Handling | `RoutinesPanel` på `tab=handling` |
| Bro Projekt | Hub-kort → `/projekt`, `/admin/projects/ny` |
| Widget → Planering | `FyrenWidgetBar`, `fyrenHomeQuickActions` |

```137:154:firestore.rules
    match /planning_tasks/{docId} {
      allow read: if isOwner();
      allow create: if isOwnerCreate()
        && request.resource.data.title is string
        ...
      allow update: if isOwner()
        ...
        && request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['status', 'microStep', 'dueAt', 'summary']);
      allow delete: if false;
    }
```

---

## Gap-analys (spec vs kod idag)

| Spec / lock | Kod idag | Gap |
|-------------|----------|-----|
| **P3 Kanban = primär Handling** | `/planering` utan `?tab=` → **hub** (verktygsväljare) | **UX:** dock/nav pekar ofta på `/planering` — extra klick till Handling |
| Snabb-lägg: titel **+ datum** | Quick add: titel only | **Fas 1.5** — valfritt `dueAt` i inline-form |
| Under-nav Framsteg / Reflektion (P3-spec) | Endast Handling · Fokus · Inkorg (+ hub, inkop) | **Fas 1.5** enkel Framsteg; Reflektion → journal (opt-in) senare |
| `planning_email_rules` + Regler-flik | Finns **inte** i `firestore.rules`; ingen Planering-regler-UI | **Fas 2** — rules + PMIR |
| `planning_events` / Google Calendar sync | Kalender = förberedelse + mock vecka | **Fas 3** — OAuth/backend |
| `/planering/kalender` (egen route) | Kalender under `?tab=inkorg&inbox=kalender` | **Valfritt** — redirect eller behåll nuvarande |
| Drag-and-drop kolumner | Flytta via sheet-knappar | **P2 idé** — inte blocker |
| Gmail OAuth | `prepare('gmail')` lokalt | **Fas 3** |
| Paralys-Brytaren agent | Fokus visar mikrosteg | **Fas 4** — länk till Kompis/atom (ej ny silo-RAG) |
| Modulmap `src/modules/planering/` | Kod ligger i `admin/planning` | **Ej flytta** utan beslut — register pekar redan på admin/planning |

### Bevaras (MUST NOT regress)

- P3 Kanban tre kolumner på `/planering?tab=handling` (locked UX hybrid)
- `/projekt` separat — listor/block/regler
- `planning_tasks` — delete:false i rules
- Ex-domäner → Hamn (copy i Inkorg, inte auto-route utan regler)
- Widget v2 mockup/flow (W1 kompakt-projekt)

---

## Rekommenderade faser

### Fas 1.5 — ADHD-polish (ingen `firestore.rules`)

**Mål:** Mindre friktion mellan dock och Kanban; tydligare deadlines och överblick.

| # | Leverans | Filer (typ) |
|---|----------|-------------|
| 1 | Dock + `fyrenHomeQuickActions` + `navTruth` primär länk → `/planering?tab=handling` (hub kvar via «Alla verktyg») | `navTruth.ts`, `fyrenHomeQuickActions.ts`, ev. `FyrenWidgetBar` |
| 2 | Quick-add i kolumn: valfritt datum (`type="date"`) → `dueAt` på create | `PlanningKanbanBoard.tsx`, `planningTasksApi` (redan stöd) |
| 3 | **Framsteg**-flik: antal todo/waiting/done + “försenade” om `dueAt` &lt; idag (inga XP) | ny `PlaneringFramstegPanel.tsx`, `planeringHubConfig`, `PlaneringPage` |
| 4 | Fokus: knappar «Markera väntar» / «Klar» + länk «Redigera i Handling» | `PlaneringFokusPanel.tsx`, återanvänd `moveTask` |

**Acceptans**

- [x] Från dock: en tap till Kanban med tre kolumner
- [x] Ny uppgift med deadline syns på kort
- [x] Framsteg visar siffror utan gamification
- [x] Uppdatera `module_plan.md` checkboxar
- [x] `npm run build` + `npm run smoke:locked-ux` PASS

**Insats:** ~1 session, inga backend-functions.

---

### Fas 2 — E-postregler (kräver ditt OK)

- Collection `planning_email_rules` i `firestore.rules`
- UI: enkel lista (matchType, pattern, route) under Planering eller `/projekt/regler` koppling
- Standardregler opt-in (ex → hamn, skola → planering) enligt `PLANERINGSSIDA-SPEC.md`

**Blocker:** explicit godkännande rules-diff + PMIR.

---

### Fas 3 — Inkorg live (Gmail / Calendar)

- OAuth, `planning_messages` eller taggad `inbox_queue`
- Kalender read-only → `planning_events` eller task med `source: calendar`
- Zero Footprint: förhandsvisning RAM, spara Valv explicit

**Blocker:** GCP secrets, functions, kostnad — se `docs/GCP-INVENTORY-LATEST.md`.

---

### Fas 4 — Life OS-kopplingar

- Rutin → skapa task (delvis: `RoutinesPanel` finns)
- Uppgift → ekonomi (länk vid förfallen)
- Paralys-Brytaren via Kompis (befintlig agent, ingen ny prompt i klient)

---

## Vad vi medvetet skippar nu

| Idé | Varför |
|-----|--------|
| Flytta mapp till `src/modules/planering/` | Ingen användarvinst; bryter imports/smoke |
| Vertex + Repomix | Cursor har live sanning |
| P4 Handlingskö som ersättning för Kanban | Bryter design-lock |
| Gmail i Fas 1.5 | Rules + OAuth för stort |

---

## Nästa steg (ett beslut)

Svara **`kör Fas 2`** endast om du uttryckligen godkänner **ny** `firestore.rules` för `planning_email_rules`.

**Status 2026-05-29:** Fas 1.5 implementerad lokalt. PMIR: [`2026-05-29-pmir-dagbok-planering.md`](./2026-05-29-pmir-dagbok-planering.md).

---

## Referenser

- Modulregister: `docs/MODUL-FUNKTIONS-REGISTER.md` — admin/planning = P3 Kanban live
- Nattplan spår 3: `docs/evaluations/2026-05-27-nasta-fas-plan.md` (Projekt P2 parallellt, inte samma som Planering Fas 1.5)
- Locked UX: `.context/locked-ux-features.md` § Planering + hybrid
