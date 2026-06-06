# AGENT-04 — Vardagen: Launcher + Tools (Design Audit)

**Agent:** Design-audit Agent 4 (Vardagen — launcher + tools)  
**Datum:** 2026-06-07  
**Git:** `main` (dirty worktree — bl.a. `CaptureSuperModule.tsx`, `ReviewQueuePipelinePanel.tsx`, `InkastDirectPanel.tsx`, `ProjektHubPage.tsx`)  
**Mode:** READ-ONLY  
**Scope:** `/vardagen`, `/mabra`, `/planering`, `/projekt`, `/arbetsliv`, Hem adaptiv, Capture/Inkast  
**Kanon:** [`PLANERING-PROJEKT-HYBRID.md`](../PLANERING-PROJEKT-HYBRID.md), [`WIDGET-BAR-SPEC.md`](../WIDGET-BAR-SPEC.md), [`PLANERING-P3-KANBAN-SPEC.md`](../planering/PLANERING-P3-KANBAN-SPEC.md), [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)

---

## 1. Metadata & Scope

### Syfte

Vardagen-zonen är **Liv och göra** — daglig struktur, återhämtning och verktyg utan Valv-PIN. Audit kartlägger hur launcher, adaptiv hem, Göra (planering/projekt), MåBra, arbetsliv och Inkast hänger ihop visuellt och navigationsmässigt under Obsidian Calm 2.0.

### Primära entry points

| Entry | Route | Rotkomponent | Auth |
|-------|-------|--------------|------|
| Hem (adaptiv) | `/` | `HomePage.tsx` | Valfri (widgets/capture kräver inlogg) |
| Liv och göra (launcher) | `/vardagen` | `LivLauncherPage.tsx` | Ja |
| MåBra | `/mabra` | `MabraPage.tsx` | Ja |
| Göra — Handling | `/planering?tab=handling` | `PlaneringPage` → `GoraSuperModule` → **`PlanningKanbanBoard`** | Ja |
| Göra — Projekt | `/projekt` | `ProjektHubPage.tsx` | Ja |
| Arbetsliv | `/arbetsliv` | `ArbetslivHubPage.tsx` | Ja |
| Legacy | `/liv`, `/kompasser`, `/ekonomi`, `/stampla` | Redirect → kanon | — |

### Nyckelfiler (verifierade)

| Fil | Roll |
|-----|------|
| `src/modules/shell/LivLauncherPage.tsx` | Launcher-hub med inline kompass/ekonomi |
| `src/modules/shell/LivLauncherGrid.tsx` | 6 kort + glow-mapping |
| `src/modules/shell/livLauncherRoutes.ts` | Extern navigation vs inline tabs |
| `src/modules/core/pages/HomePage.tsx` | Adaptiv hem + widgets + capture |
| `src/modules/core/home/HomeAdaptiveCompass.tsx` | Dygnsfas-kompass (Hem + Vardagen inline) |
| `src/modules/features/admin/planning/components/PlaneringPage.tsx` | Göra-shell, modulväljare, VerktygDrawer |
| `src/modules/features/admin/planning/components/GoraSuperModule.tsx` | Canonical router → P3 Kanban |
| `src/modules/features/admin/planning/components/PlanningKanbanBoard.tsx` | **Låst P3** — 3 kolumner + kognitivt skydd |
| `src/modules/features/dailyLife/wellbeing/mabra/components/MabraPage.tsx` | Symptom-hub, Vit, verktyg, modulväljare |
| `src/modules/capture/CaptureSuperModule.tsx` | G10 router (hem/planering/kompass/valv) |
| `src/modules/capture/ReviewQueuePipelinePanel.tsx` | Hem-granskningskö (lokal + molnet) |
| `src/modules/core/navigation/GoraHubTabBar.tsx` | Handling · Projekt · Inkorg |
| `src/modules/core/navigation/hubContextBar.ts` | 4 kontextknappar på vardagen-rutter |
| `src/modules/core/layout/FloatingDock.tsx` | Dock: Vardag · Familjen · Dagbok · **Handling** |

### Utanför scope

- Valv PIN-flöden (ekonomi lön/frånvaro redirect dit)
- Familjen / Barnporten
- Kunskap-RAG (U6 — endast bakom Valv)
- Android widgets (se `WIDGET-BAR-SPEC.md` separat)

---

## 2. Route & IA Map

### Zonmodell (3-zonsystem — Vardagen-del)

```mermaid
flowchart TB
  subgraph hem [Hem /]
    HH[HomeHeroKanon + HomeAdaptiveCompass]
    HW[HomeWidgetRenderer WH1–WH5]
    CAP[CaptureSuperModule hem-capture]
    RQ[ReviewQueuePipelinePanel]
    PIN[PlaneringHomePinCard]
    ADP[AdaptiveMemoryCards]
  end

  subgraph launcher [/vardagen]
    LG[LivLauncherGrid 6 kort]
    KOM[DashboardPage → HomeAdaptiveCompass]
    EKO[EconomyOverviewPanel]
  end

  subgraph external [Egna routes]
    MB[/mabra]
    PL[/planering + GoraHubTabBar]
    PJ[/projekt]
    AR[/arbetsliv]
  end

  hem -->|dock/meny| launcher
  LG -->|inline| KOM
  LG -->|inline| EKO
  LG -->|navigate| MB
  LG -->|navigate| PL
  LG -->|navigate| PJ
  LG -->|navigate| AR
  PL --> PJ
  PJ -->|task block| PL
```

### Launcher-kort → destination

| Kort ID | Label | Beteende | Glow |
|---------|-------|----------|------|
| `kompasser` | Dygns-Kompassen | Inline under grid (default) | gold |
| `ekonomi` | Ekonomi & Mål | Inline `?tab=ekonomi` | gold |
| `mabra` | MåBra | → `/mabra` | green |
| `handling` | Handling | → `/planering?tab=handling` | gold |
| `projekt` | Projekt | → `/projekt` | gold |
| `arbetsliv` | Arbetsliv & stämpel | → `/arbetsliv` | gold |

Källa: `LivLauncherGrid.tsx` + `livLauncherRoutes.ts`.

### Göra — två lager (låst hybrid)

| Lager | Route | Innehåll | Får inte slås ihop |
|-------|-------|----------|-------------------|
| **Handling (fast)** | `/planering?tab=handling` | P3 Kanban `todo \| waiting \| done` | Ja — `PLANERING-PROJEKT-HYBRID.md` |
| **Projekt (flex)** | `/projekt`, `/admin/projects/:id` | list/note/image/task blocks | Uppgift → `planning_tasks` → Kanban |
| **Inkorg** | `/planering?tab=inkorg` | Mejl/kalender + capture | ≠ `inkop` (snabb inköpslista) |

### Navigationslager (4 parallella system)

1. **Drawer** (`navTruth.ts`) — «Liv och göra» + barn: kompasser, MåBra, handling, arbetsliv, ekonomi  
2. **Hub context bar** (`hubContextBar.ts`) — 4 knappar: Kompasser · MåBra · Handling · Ekonomi (aktiv på `/vardagen`, `/mabra`, `/planering`, `/arbetsliv`)  
3. **GoraHubTabBar** — Handling · Projekt · Inkorg (planering + projekt)  
4. **FloatingDock** — separat «Handling»-ikon → `/planering?tab=handling` (matchar även `/projekt`)

### Legacy & drift

| Legacy | Redirect | Status |
|--------|----------|--------|
| `/liv?tab=*` | `livLauncherRoutes.resolveLivLegacyTabRedirect` | ✅ |
| `/kompasser` | `/vardagen` | ✅ |
| `/ekonomi` | `/vardagen?tab=ekonomi` | ✅ |
| `/stampla` | `/arbetsliv?tab=stampla` | ✅ |
| `?tab=kunskap` på vardagen | Valv kunskapsbank | ✅ locked-ux |
| **`VardagenPage` (compasses/)** | Gammal TabBar+BentoCard | ⚠️ **Död export** — route använder `LivLauncherPage` |
| **`gora_*` i drawerNav/tabRegistry** | Ikoner kvar | ⚠️ **Drift** — `navTruth` har inte längre `gora`-entries |

---

## 3. User Journeys

### Journey A — Morgon: Hem → Kompass → adaptiv uppföljning

1. Användaren öppnar `/` → `HomeHeroKanon` visar hälsning + `HomeAdaptiveCompass` (fas: morgon/dag/kväll via klocka).  
2. Morgonintention sparas (`saveCheckIn`, `questionId: compass_morning`).  
3. `AdaptiveMemoryCards` (`home_adaptive_cards` preset) laddar kort från senaste check-ins.  
4. Valfritt: `CaptureSuperModule variant="hem-capture"` (om preset tillåter och hero-checkin aktiv).  
5. Fyren dock → «Liv och göra» eller kontext «Kompasser».

**Friktion:** Hem och `/vardagen` visar samma kompass-komponent men olika chrome (hero-scenic vs launcher-grid). Användaren kan uppleva dubbel «start».

### Journey B — Vardagsstart: Launcher → inline eller extern

1. Drawer «Liv och göra» → `/vardagen`.  
2. `CognitiveLoadStrip` + `LivLauncherGrid` — ett kort i taget.  
3. **Kompasser** (default): `DashboardPage` → `HomeAdaptiveCompass` i `calm-scroll-island`.  
4. **Ekonomi**: `EconomyOverviewPanel` med modulväljare (budget, neuro-kost, impuls, spar, tid).  
5. **MåBra / Handling / Projekt / Arbetsliv**: fullsid-navigation med `LivBackLink`.

**Friktion:** Externa kort har chevron men inline-kort saknar tydlig «du är kvar här»-indikator utöver `--active` border.

### Journey C — Göra: Kanban P3 (låst)

1. Launcher «Handling» eller dock Handling → `/planering?tab=handling`.  
2. Första besök: `GoraModulValjare` (om `!hasSeenGoraModulValjare()`).  
3. `GoraHubTabBar` + `GoraSuperModule variant="handling"` → **`PlanningKanbanBoard`**.  
4. Kognitivt skydd: vid >N aktiva tasks → Pansarläge (ett fokus + mikrosteg).  
5. «Fler verktyg» → Fokus, Framsteg, Regler, Inköpslista, Hub-layout, Rutiner.

**Måste bevaras:** 3 kolumner Att göra · Väntar · Klart — inte ersätta med lista-only eller projekt-vy.

### Journey D — Projekt → uppgift → Kanban

1. `/projekt` → lista aktiva projekt → `/admin/projects/:id`.  
2. Block `type: task` skapar `planning_tasks`.  
3. Kanban visar alla tasks; `?projectId=` filtrerar (`PlanningKanbanBoard` rad 131–141).  
4. GoraHubTabBar synkar Projekt-flik på både `/projekt` och `/admin/projects/*`.

### Journey E — MåBra: modulväljare → zon → verktyg/övning

1. `/mabra` → ev. `MabraModulValjare` första gången.  
2. Hub: `MabraVitHub` (kategorier: akut, projekt, lekar, …) + `DagligMixPanel` + Vit-projekt.  
3. Deep link: `?project=` → Vit-projektplan.  
4. Verktyg: `MabraToolShell` (reflection deck, micro play, KBT, m.fl.).  
5. `MaterialPackShortcuts hub="mabra"` — Life OS-genvägar.

**Friktion:** Nesten all state är React `step` — svag URL-deep-link utom `?project=`. Lågenergi-läge reducerar hub till 2 tiles (bra) men syns inte i nav.

### Journey F — Inkast: fånga → granska → silo

| Variant | Plats | Flöde |
|---------|-------|-------|
| `hem-capture` | Hem (inlogg) | Modulväljare → `CapturePanel` (preview → confirm) → `ReviewQueuePipelinePanel` |
| `hem-inkast` | Hem (utlogg) | `InkastDirectPanel` → `#inkast-lite` |
| `planering` | Planering inkorg capture | Samma CapturePanel, `sourceModule: planering_inkorg` |
| `valv-compact` | Valv Samla | `InkastDirectPanel tone="valv"` |

Molnet: canonical granskning i **Valv → Samla → granskningskö** (`VALV_SAMLA_GRANSKA_LINK`). Hem visar summary, duplicerar inte full `InboxReviewQueue`.

---

## 4. Screen Inventory & Mockup Wireframes

Obsidian Calm 2.0: `calm-card`, `glow-bottom-*`, `hub-view-lock`, guld aktiv chrome ([`COLOR-POLICY.md`](../COLOR-POLICY.md)).

### 4.1 Vardagen launcher grid

**Komponent:** `LivLauncherPage` + `LivLauncherGrid`  
**CSS:** `obsidian-calm-2.css` `.liv-launcher-grid` (1→2→3 kolumner responsive)

```
┌─────────────────────────────────────────────────────────┐
│  LIV OCH GÖRA · Vardagsstart                              │
│  Välj ett kort. Kompass och ekonomi visas här…          │
├─────────────────────────────────────────────────────────┤
│  [ CognitiveLoadStrip — Ett steg i taget ]              │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│ │🌱 Dygns-     │ │💰 Ekonomi    │ │✨ MåBra    › │      │
│ │  Kompassen   │ │  & Mål       │ │ Akut·Mix·…   │      │
│ │ Morgon·Kväll │ │ Budget·Spar  │ │              │      │
│ │ [ACTIVE]     │ │              │ │  external    │      │
│ └──────────────┘ └──────────────┘ └──────────────┘      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│ │☑ Handling  › │ │📁 Projekt  › │ │🕐 Arbetsliv›│      │
│ │ Att·Vänt·Kl │ │ Lista·Anteck │ │ Stämp·Flex   │      │
│ └──────────────┘ └──────────────┘ └──────────────┘      │
├─────────────────────────────────────────────────────────┤
│  calm-scroll-island (inline val):                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │  HomeAdaptiveCompass / EconomyOverviewPanel      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
│ Dock: Vardag · Familjen · Fyren · Dagbok · Handling     │
└─────────────────────────────────────────────────────────┘
```

**Design notes:**  
- Gold glow på kompass/ekonomi/handling/projekt/arbetsliv; green på MåBra — korrekt enligt silo-mapping.  
- Preview-rad i kort (`livLauncherPreviews.tsx`) ger kognitiv förhandsgranskning utan navigation.  
- **Gap vs kanon:** `design-calm.mdc` säger `rounded-3xl` på calm-card; launcher använder `rounded-2xl` i grid — mindre avvikelse.

### 4.2 Kanban P3 (Handling)

**Komponent:** `PlanningKanbanBoard` via `GoraSuperModule`  
**Kanonbild:** `docs/design/references/PLANERING-P3-KANBAN-KANON.png`

```
┌─────────────────────────────────────────────────────────┐
│  GÖRA · Handling          [←] [📅] [⊞ modulväljare]     │
│  Ett verktyg i taget.                                     │
├─────────────────────────────────────────────────────────┤
│  [ Handling ] [ Projekt ] [ Inkorg ]   ← GoraHubTabBar    │
├─────────────────────────────────────────────────────────┤
│  🧠 Kognitivt skydd          Överbelastningsskydd [toggle]│
├─────────────────────────────────────────────────────────┤
│  ← scroll →                                               │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│ │ATT GÖRA │ │ VÄNTAR  │ │ KLART   │                       │
│ │  (n)    │ │  (n)    │ │  (n)    │                       │
│ │ [+]     │ │ [+]     │ │ [+]     │                       │
│ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │                       │
│ │ │task │ │ │ │task │ │ │ │ ✓   │ │                       │
│ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │                       │
│ └─────────┘ └─────────┘ └─────────┘                       │
├─────────────────────────────────────────────────────────┤
│  ▼ Fler verktyg (Fokus · Framsteg · Regler · Inköp…)     │
└─────────────────────────────────────────────────────────┘
```

**Pansarläge (overload):** Ersätter 3 kolumner med ett `BentoCard` — primärt fokus + mikrosteg + «Markera klar» / «Visa hela tavlan ändå».

**Spec-gap:** P3-spec nämner kort-ikoner per `source` (skola, mejl) — implementation i `PlanningKanbanColumn` bör verifieras mot kanonbild (delvis BYGGS P1 i spec).

### 4.3 MåBra hub

**Komponent:** `MabraPage` step=`hub`

```
┌─────────────────────────────────────────────────────────┐
│  MÅBRA · För dig — ett steg i taget        [← Vardagen] │
├─────────────────────────────────────────────────────────┤
│  [ Lågenergi toggle ]              [ Byt ingång ]         │
├─────────────────────────────────────────────────────────┤
│  DagligMixPanel (kort + lek)                            │
│  ▸ Dina kurser (collapsible)                            │
│  Vit-projekt (4 kort: self_esteem, emotional_memory…)   │
├─────────────────────────────────────────────────────────┤
│  Snabbstart [ dropdown ▼ ]                              │
│  ┌─ Akut ─────────────────────────────────────────────┐   │
│  │  [Panik/RSD] [Andning 1min] [Grounding]          │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌─ Projekt (Vit) ──────────────────────────────────┐   │
│  ┌─ Lekar / Verktyg ────────────────────────────────┐   │
│  MaterialPackShortcuts (genvägar)                       │
└─────────────────────────────────────────────────────────┘
```

**Design notes:**  
- Smaragd/green glow på zoner — korrekt.  
- `<select>` Snabbstart i `MabraVitHub` — funktionell men lågaffektivt rätt (progressive disclosure).  
- Ingen TabBar — medvetet; drawer visar bara «MåBra».

### 4.4 Kompasser (inline)

**Komponent:** `HomeAdaptiveCompass` (Hem + `/vardagen`)

```
┌─────────────────────────────────────────────────────────┐
│  [ Morgon ] [ Dag ] [ Kväll ]   ← fasväljare             │
├─────────────────────────────────────────────────────────┤
│  Morgon: intention textarea + Spara                       │
│  Dag: ParalysPanel / snabbnav-knappar (preset)           │
│  Kväll: KasamEvening / KompassradPanel                   │
├─────────────────────────────────────────────────────────┤
│  (Hem only) CaptureSuperModule om preset home_inkast     │
└─────────────────────────────────────────────────────────┘
```

**Sacred feature:** Morgonkompass — check-in sparar till Firestore, triggar `AdaptiveMemoryCards` refresh via `onCheckInSaved`.

**Preset-gating:** `materialEnabled(preset, 'home_hero_checkin' | 'home_snabbval' | 'home_inkast')` — samma komponent, olika synlighet per Life OS-profil.

### 4.5 Inkast review (Hem)

**Komponenter:** `CaptureSuperModule` + `ReviewQueuePipelinePanel`

```
┌─────────────────────────────────────────────────────────┐
│  Smart Inkast / CapturePanel                            │
│  [textarea] → Analysera → Bekräfta silo → Spara         │
├─────────────────────────────────────────────────────────┤
│  Granskningskö · G10                                    │
│  ┌─ Molnet ──────────────────────────────────────────┐  │
│  │  3 poster väntar → Valv Samla granskningskö       │  │
│  │  • fil.pdf · väntar klassificering                │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌─ Lokalt på enheten ─────────────────────────────┐  │
│  │  • utkast → routing label → länk till destination │  │
│  │  • misslyckades (rose border)                     │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**G10-princip:** Molnet granskas canonical i Valv; Hem visar **summary** (`mode="summary"`), inte full `InboxReviewQueue` duplicerad.

---

## 5. Kod vs Spec Matrix

| Aspekt | Spec / Locked | Kod (live) | Match? |
|--------|---------------|------------|--------|
| P3 Kanban 3 kolumner | `PLANERING-PROJEKT-HYBRID`, P3-spec | `KANBAN_COLUMNS` + `GoraSuperModule` → `PlanningKanbanBoard` | ✅ |
| Handling ≠ Projekt | Hybrid doc | `/planering` vs `/projekt`, GoraHubTabBar | ✅ |
| Task från projekt → kanban | Hybrid mermaid | `planning_tasks` + `?projectId` filter | ✅ |
| Widget v2 projekt-picker | `WIDGET-BAR-SPEC`, W1 mockup | `FyrenWidgetBar` + `/projekt/ny` (smoke) | ✅ |
| Fyren → planering kalender | WIDGET-BAR | `/planering` + header kalender-ikon → `/planering/kalender` | ✅ |
| Vardagen 2 inline-flikar | Drawer children | kompasser default, `?tab=ekonomi` | ✅ |
| MåBra fristående | U6, ej i Vardagen-tab | `/mabra` egen route | ✅ |
| Ingen publik Kunskap | locked-ux | legacy kunskap → Valv redirect | ✅ |
| Inkast HITL molnet | G10 lockdown eval | `ReviewQueuePipelinePanel` → Valv Samla link | ✅ |
| PlaneringHomePinCard | locked-ux hybrid | Hem localStorage pin → `/planering?tab=inkop` | ✅ |
| Launcher 6 kort | IA 2026 superhub | `LIV_LAUNCHER_CARDS` (6 st) | ✅ |
| Arbetsliv ≠ Vardagsekonomi | copy + länkar | `ArbetslivHubPage` BentoCard + `/ekonomi` redirect | ✅ |
| **`PlaneringPage` void import** | — | `void PlanningKanbanBoard` rad 81 — dead ref för tree-shake? | ⚠️ |
| **Dubbel `VardagenPage`** | En launcher | compasses/`VardagenPage.tsx` exporteras fortfarande | ❌ drift |
| **`gora_*` drawer icons** | — | `drawerNav.ts` utan motsvarande `navTruth` | ⚠️ drift |
| **P3 kort-ikoner per source** | P3-spec BYGGS | KanbanColumn — ej fullt verifierat | ⚠️ partial |
| **Drag-and-drop kanban** | P3-spec P2 | Knapp/flytt via detail sheet | ⚠️ planerat |
| **HomeStreakChip «Din eld»** | HOME-HERO-KANON «IDÉ gamification» | Visas vid streak ≥1 | ⚠️ policy-gråzon |
| **rounded-3xl calm-card** | design-calm 2.0 | Launcher/ekonomi `rounded-2xl` | ⚠️ minor |

---

## 6. Design Debt & Navigation Friction

### 6.1 Strukturell skuld

| ID | Problem | Impact | Filer |
|----|---------|--------|-------|
| D1 | **Två `VardagenPage`-implementationer** — route = `LivLauncherPage`, wellbeing export = gammal TabBar | Förvirring för utvecklare; risk fel import | `core/pages/VardagenPage.tsx`, `compasses/.../VardagenPage.tsx` |
| D2 | **`gora_*` vs `vardagen_handling` vs `planering_*`** — ikoner/tabRegistry kvar, navTruth förenklad | Drawer/smoke-drift | `drawerNav.ts`, `tabRegistry.ts`, `navTruth.ts` |
| D3 | **Fyra nav-lager** (drawer, hub context, GoraHubTabBar, dock Handling) | Kognitiv belastning — samma «Handling» nås på 3 sätt | Se §2 |
| D4 | **Planering dubbel modellväljare** — `GoraModulValjare`, `PlaneringHub` (15 verktyg), `VerktygDrawer` | Progressive disclosure bra, men överlappande entry points | `PlaneringPage.tsx` |
| D5 | **Projekt URL split** — `/projekt` hub vs `/admin/projects/:id` detail | Mental modell «admin» vs «mitt projekt» | `ProjektHubPage.tsx`, routes |
| D6 | **MåBra URL-state** — `step` i React, weak deep links | Dela länk till specifik övning svårt | `MabraPage.tsx` |
| D7 | **Hem vs `/vardagen` kompass-duplikat** | Samma `HomeAdaptiveCompass`, olika wrapper/scenic | `HomePage`, `LivLauncherPage` |
| D8 | **Inkorg vs inkop** — liknande namn | Användare blandar mejl-inkorg med inköpslista | `planeringHubConfig`, copy i `VerktygDrawer` |
| D9 | **`EconomyOverviewPanel` tab `tid`** — överlappar `/arbetsliv?tab=tid` | Dubbel tid-UI | `EconomyOverviewPanel.tsx`, `ArbetslivHubPage` |
| D10 | **Gamification-gråzon** — `HomeStreakChip` | Bryter mot MåBra «inga streaks»-policy om synlig | `HomeStreakChip.tsx`, `HOME-HERO-KANON.md` |

### 6.2 Visuell skuld (Obsidian Calm 2.0)

| ID | Avvikelse | Rekommendation |
|----|-----------|----------------|
| V1 | Launcher `rounded-2xl` vs regel `rounded-3xl` på centrala kort | Harmonisera till `rounded-2xl` i regel **eller** uppgradera launcher |
| V2 | Kanban horisontell scroll `-mx-1` — mobil OK, desktop kan kännas «app-lik» | Överväg stacked columns under `sm` (P3-spec) |
| V3 | `PlaneringPage` void `PlanningKanbanBoard` — misleading för läsare | Ta bort void eller kommentera «smoke anchor» |
| V4 | Hub context «Handling» ikon `calendar` i `hubContextBar` — borde vara `ListTodo` | Ikon-konsistens med launcher |
| V5 | `AdaptiveMemoryCards` använder indigo/lavender borders — sekundärt OK för kort, inte aktiv chrome | Följ COLOR-POLICY |

### 6.3 Positiva mönster (behåll)

- **SuperModule-routers:** `CaptureSuperModule`, `GoraSuperModule`, `PlaneringSuperModule` — tydlig canonical routing.  
- **Modulväljare-first-run:** `HemCaptureModulValjare`, `MabraModulValjare`, `GoraModulValjare`, `EkonomiModulValjare` — ADHD-säker progressive disclosure.  
- **Kognitivt skydd på Kanban** — Pansarläge alignar med Paralys-Brytaren.  
- **`LivBackLink`** — konsekvent escape från fullsid-moduler till launcher.  
- **Glow-bottom silo-mapping** på launcher-kort — korrekt gold/green.

---

## 7. Locked UX · Smoke · Recommendations

### 7.1 Locked UX (MUST NOT remove without approval)

| Feature | Register | Audit note |
|---------|----------|------------|
| **P3 Kanban Handling** | `PLANERING-PROJEKT-HYBRID.md`, locked-ux § Planering | Live via `GoraSuperModule` — **do not collapse to projekt-only** |
| **Planering + Fyren widget** | `PLANERINGSSIDA-SPEC`, `WIDGET-BAR-SPEC` | Dock + widget bar → planering/valv |
| **Widget v2 kompakt projekt** | `galleri/widget/v2/W1-kompakt-projekt.png` | Do not revert to boring W1-only |
| **PlaneringHomePinCard** | locked-ux | Hem localStorage quick list |
| **Ingen publik Kunskap** | U6 + locked-ux | `/kunskap` → Valv |
| **MåBra innehåll U6** | `Mabra-CONTENT-BANK`, innehåll-register | Inga streaks/XP i prod-bank |
| **Morgonkompass / Sacred** | livskompassen-core | `HomeAdaptiveCompass` morning save |
| **Inkast HITL** | G10, Barnporten §7b pattern | Ej auto-promote till Valv |
| **MaterialPackShortcuts** | Life OS presets | Hub `"mabra"` bl.a. |
| **Barnfokus** | Ej denna audit — ej rör |

### 7.2 Smoke & verification

| Script | Relevans för Agent-04 |
|--------|----------------------|
| `npm run smoke:locked-ux` | `/vardagen`, `/planering`, MåBra hub, Fyren inkast |
| `npm run smoke:design-modules` | Launcher grid CSS, livLauncherRoutes, capture variants |
| `npm run smoke:superhub` | Drawer labels «Liv och göra», route paths |
| `npm run smoke:modulvaljare` | Launcher previews, Mabra/Gora/Ekonomi väljare |
| `npm run smoke:inkast` | Inkast lockdown, tag groups |
| `npm run smoke:mabra` | WORM sessions, coach guard |
| `npm run smoke:innehall` | U6 MåBra routing |
| `npm run smoke:arbetsliv` | Arbetsliv hub paths |
| `npm run build` | Lazy chunks planering/mabra |

### 7.3 Recommendations P1–P3

**P1 — Städa utan UX-risk**

1. **Deprecate/export-rensa** gammal `compasses/VardagenPage.tsx` — endast `LivLauncherPage` som sanning.  
2. **Harmonisera labels:** drawer «Liv och göra» = sidhuvud «Vardagsstart» — lägg subtitel «Liv och göra» i eyebrow (redan där) eller byt title.  
3. **Rensa `gora_*` drift** i `drawerNav`/`tabRegistry` eller återinför `navTruth`-entries — en källa.  
4. **Ta bort `void PlanningKanbanBoard`** eller dokumentera smoke-anchor i kommentar.  
5. **Hub context ikon** Handling: `calendar` → `ListTodo`.

**P2 — Nav-förenkling (behåll P3)**

1. **GoraHubTabBar «Fler verktyg»** synlig etikett på Handling (redan `VerktygDrawer`) — lägg Fokus/Framsteg som ghost pills under tab bar för färre gömda flikar.  
2. **MåBra minimal URL-tabbar:** `?zone=akut|vit|verktyg` mappad till `hubOpenCategory` — delbara länkar utan fjärde silo.  
3. **Ekonomi vs Arbetsliv badge** vid första besök i `EconomyOverviewPanel` / `ArbetslivHubPage`: «Privat kassa» vs «Jobb & lön».  
4. **Hem/Vardagen dedup:** överväg att `/vardagen` default visar launcher **utan** duplicerad full kompass om användaren redan checkat in på Hem samma dag (AdaptiveMemoryCards hint).

**P3 — Strukturell förbättring (kräver PMIR)**

1. **Route alias `/gora` → router** som wrapper för planering+projekt (hybrid doc P3-idé) — minskar «planering»-ordets dominans.  
2. **Enhetlig projekt-path:** `/projekt/:id` istället för `/admin/projects/:id` (redirect legacy).  
3. **P3 kanban kort-ikoner** enligt spec + kanonbild — source badges.  
4. **Drag-and-drop** kolumnflytt (P3-spec P2) med samma 3 kolumner.  
5. **Policybeslut HomeStreakChip:** dölj permanent eller byt till neutral «check-in denna vecka» utan flamma/streak-språk.

### 7.4 diff-scope (för framtida redesign-PR)

| Område | Filer |
|--------|-------|
| Launcher | `LivLauncherPage.tsx`, `LivLauncherGrid.tsx`, `livLauncherRoutes.ts`, `livLauncherPreviews.tsx`, `obsidian-calm-2.css` |
| Hem adaptiv | `HomePage.tsx`, `HomeHeroKanon.tsx`, `HomeAdaptiveCompass.tsx`, `AdaptiveMemoryCards.tsx` |
| Capture/Inkast | `CaptureSuperModule.tsx`, `CapturePanel.tsx`, `ReviewQueuePipelinePanel.tsx`, `InkastDirectPanel.tsx`, `inkastService.ts` |
| Göra | `PlaneringPage.tsx`, `PlanningKanbanBoard.tsx`, `GoraSuperModule.tsx`, `GoraHubTabBar.tsx`, `VerktygDrawer.tsx`, `ProjektHubPage.tsx` |
| MåBra | `MabraPage.tsx`, `MabraVitHub.tsx`, `mabraHubRegistry.ts`, `MabraModulValjare.tsx` |
| Nav | `navTruth.ts`, `hubContextBar.ts`, `FloatingDock.tsx`, `drawerNav.ts` |
| Docs | `PLANERING-PROJEKT-HYBRID.md`, `WIDGET-BAR-SPEC.md`, `PLANERING-P3-KANBAN-SPEC.md` |

---

## Appendix A — Route quick reference

```
/                          HomePage (adaptiv)
/vardagen                  LivLauncherPage [?tab=ekonomi]
/vardagen?tab=ekonomi      EconomyOverviewPanel inline
/mabra                     MabraPage [?project=]
/planering?tab=handling    PlanningKanbanBoard (P3 LOCKED)
/planering?tab=inkorg      PlaneringInkorgPanel
/planering?tab=fokus       PlaneringFokusPanel
/planering?tab=hub         PlaneringHub (15 verktyg)
/planering/kalender        PlaneringKalenderPage (P2)
/projekt                   ProjektHubPage
/projekt/ny                ProjektNyPage
/admin/projects/:id        ProjektDetailPage
/arbetsliv?tab=stampla     StampClockPage
/arbetsliv?tab=tid         EconomyTidPanel
/arbetsliv?tab=logg        EconomyLogPanel
/#inkast-lite              InkastDirectPanel (hem utlogg)
```

## Appendix B — Relaterade evals

- [`docs/evaluations/2026-05-31-hub-vardag-analys.md`](../../evaluations/2026-05-31-hub-vardag-analys.md)  
- [`docs/evaluations/2026-05-31-hub-gora-analys.md`](../../evaluations/2026-05-31-hub-gora-analys.md)  
- [`docs/evaluations/2026-05-31-hub-kompass-analys.md`](../../evaluations/2026-05-31-hub-kompass-analys.md)  
- [`docs/evaluations/2026-06-06-inkast-lockdown.md`](../../evaluations/2026-06-06-inkast-lockdown.md)

---

*Genererad av design-audit Agent 4 — READ-ONLY. Ingen kod ändrad. För implementation: växla till Agent mode och kör PMIR enligt `docs/MERGE-IMPACT-RAPPORT.md`.*

[REDACTED]