# Projekt — starta vad du vill (utökad P4)

**Status:** **Produkt låst** 2026-05-23 — hybrid med fast Handling · se [`PLANERING-PROJEKT-HYBRID.md`](./PLANERING-PROJEKT-HYBRID.md)  
**Route:** `/projekt` (hub) · `/projekt/ny` (välj typ) · `/planering` (kanban + länk hit)  
**Utgår från:** P4 Handlingskö-regler + P3 Kanban — [`planering/PLANERING-P3-KANBAN-SPEC.md`](./planering/PLANERING-P3-KANBAN-SPEC.md)

**Regler-vy (kanon):** [`references/PROJEKT-P4-REGLER-KANON.png`](./references/PROJEKT-P4-REGLER-KANON.png)

---

## Syfte

Inte bara **handling/uppgifter** — ett **projekt** kan vara:

| Typ | Ikon | Innehåll | Data |
|-----|------|----------|------|
| **Lista** | Checklista | Delpunkter, en i taget | `project_blocks` type `list` |
| **Anteckning** | Penna | Fri text, markdown light | `note` |
| **Bild** | Kamera/galleri | Foto + valfri bildtext | Storage + `image` |
| **Uppgift** | Flagga | Deadline → kanban P3 | `task` → `planning_tasks` |
| **Länk / mejl** | Kuvert | Från inkorg eller klistra in | `sourceRef` |
| **Röst** | Mic | Kort memo (ej barn-tyst) | `voice` → Valv eller projekt |

**Exempel:** “Advokat 2026”, “Skolmat lista”, “Renovering kök”, “Bevis samling X”.

---

## Skärmar

### 1. Projekt-hub (`/projekt`)

- Kort per aktivt projekt (titel, typ-ikon, senast ändrad, antal öppna)
- **+ Nytt projekt** (guld FAB som P4-mockup)
- Filter: Aktiva · Pausade · Arkiv

### 2. Välj typ (`/projekt/ny`)

Bottom sheet eller helskärm — **6 rutor** (samma språk som widget):

```
[Lista] [Anteckning] [Bild]
[Uppgift] [Från mejl] [Röst]
```

### 3. Regler & automation (`/projekt/regler`)

Baserat på P4-kanon:

- Filtrerad vy · Kategori · Status
- Lista: *När X → lägg i projekt / skapa uppgift*
- Koppling `planning_email_rules` + nya `project_rules`

### 4. Inne i projekt (`/projekt/:id`)

- Flikar eller vertikal stack av **block**
- Lägg till block (+) — välj typ igen
- Export valfritt → Dossier / Valv (HITL)

---

## Koppling Planering

| Från | Till |
|------|------|
| Kanban P3 kort | Kan tillhöra `projectId` |
| E-post regel | Skapa block eller uppgift i valt projekt |
| **Projekt** | Övergripande “mapp” — inte ersätter kanban |

Nav: Planering-modulen har under-flikar **Kanban · Projekt · Regler · Inkorg**.

---

## Framtida: rutiner och modulkopplingar

**Komihåg (ej P1):** [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](./LIFE-OS-KOPPLINGAR-KOMIHAG.md)

- **RoutineTemplate** — sparade rutiner (steg) som kan skapa `planning_tasks` eller öppna MåBra/Familjen/Kompasser via deep link.
- **LifeHubPreset** — ~4 exempelhubbar som styr extra material på sidor (ADHD: en aktiv hub).
- Projekt-block kan referera `module_links[]`; MåBra “egna projekt” förblir separata från `/projekt` (inte duplicera begrepp).

---

## Widget — genväg

Se [`WIDGET-BAR-SPEC.md`](./WIDGET-BAR-SPEC.md) v2:

- **+** eller **Projekt**-ikon i expanderad widget
- Öppnar samma `/projekt/ny` sheet
- W1 kollapsad oförändrad (diskret inspelning kvar)

---

## Datamodell (plan)

```
projects/{id}
  title, status, createdAt, ownerId

project_blocks/{id}
  projectId, type, content, order, storageRef?

project_rules/{id}   // P4 automation
  matchType, pattern, action, targetProjectId
```

---

## BYGGS vs IDÉ

| P1 | P2 |
|----|-----|
| `/projekt` hub + `/projekt/ny` picker | Delade projekt med ombud |
| Widget → nytt projekt | OCR på bild |
| Lista + anteckning + bild | Video-block |
