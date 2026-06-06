# Pre-Merge Impact Report (PMIR) — MaterialPack-editor (Fas D)

**Datum:** 2026-06-06  
**Gren:** `main` (trunk — ingen feature-gren)  
**Agent / session:** Agent 3 — autonom 1h pass (PMIR-STOPP, ingen kod)  
**Scope:** Utökning från **Fas 3 light editor** (localStorage, live) till **full MaterialPack-editor** (Life OS Fas D)

---

## Sammanfattning

**Fas C + Fas 3 light editor + Våg A är live på `main`.** Genvägar redigeras på `/projekt/genvagar`, sparas i `localStorage` per användare, och renderas på **Familjen**, **MåBra** och **Hamn** via `MaterialPackShortcuts` (Våg A landad 2026-06-06, commits `c5116a2d` · `6848398e` · `22a2f056`).

**Fas D / full editor** är **SKIP** sedan Master YOLO `lifeos-d` ([`2026-05-31-blocker-lifeos-d.md`](./2026-05-31-blocker-lifeos-d.md)) — kräver produktbeslut om Firestore-synk, bankRef-picker och rutinkoppling.

**Rekommendation:** Behåll light editor i prod. **Våg B** (Firestore-synk) och **Våg C** (bankRef + rutiner) kräver separat godkännande + rules-deploy. Valfri **Våg A+** (editor-polish utan rules) kan köras efter beslut (1) nedan.

---

## PMIR-STOPP

**Ingen implementation av MaterialPack Fas D-kod utan explicit användargodkännande** (*"godkänn Våg B"*, *"kör MaterialPack Fas D"*, *"godkänn merge"*).

Detta dokument är **endast plan och regelanalys**. Committa inte `firestore.rules`, ny Firestore-collection eller innehålls-picker utan PMIR + smoke PASS.

---

## Nuläge (läst i kod — 2026-06-06)

| Leverans | Status | Kod |
|----------|--------|-----|
| Standardpaket per preset + hub | **done** | `src/modules/core/lifeOs/materialPacks.ts` (`PACK_ROWS`) |
| Lokala overrides (max 12/hub) | **done** | `materialPackApi.ts` → `livskompassen_material_pack_overrides_v1:{uid}` |
| Reaktiv läsning på hubbar | **done** | `useMaterialShortcuts.ts`, event `material-pack-updated` |
| Editor light | **done** | `ProjektMaterialPackPage.tsx` → `/projekt/genvagar` |
| Fördefinierade mål (16 st) | **done** | `materialPackTargets.ts` — inga fria moduler |
| Render Familjen | **done** | `FamiljenPage.tsx` L141 — under hub-stack, ej ovanför Barnfokus |
| Render MåBra | **done** | `MabraPage.tsx` → `profileSlot` |
| Render Hamn | **done** | `TryggHamnHub.tsx` |
| Hosting deploy | **done** | [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md) 2026-06-06 |
| Firestore `material_pack_*` | **saknas** | ingen match i `firestore.rules` |
| `routine_templates` | **delvis** | rules L281–307 + `routineTemplatesApi.ts` — **ej kopplad** till MaterialPack-editor |
| `smoke:life-os-links` | **saknas** | nämnd i [`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md), ej i `package.json` |

**MODUL-GAP:** [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md) markerar MaterialPack Våg A **done**. **Full editor (Fas D)** = öppet i [`.context/system-plan.md`](../../.context/system-plan.md) rad 173.

---

## Gap vs LIFE-OS Fas D

| Spec / kanon | Idag (live) | Full editor gap |
|--------------|-------------|-----------------|
| MaterialPack per hub + preset | Defaults + localStorage override | Firestore-synk mellan enheter (Våg B) |
| REFLECTION/PLAY via bankRef | Fri textfält, dokumentation only | Picker mot `INNEHALL-REGISTER` / Mabra-bank (U6, Våg C) |
| Familjen-hub material | **done** — monterad | — |
| `ModuleLink` deep links | 16 fördefinierade mål | Nya mål kräver kod i `materialPackTargets.ts` |
| Rutiner ↔ genvägar | `RoutinesPanel` + `routine_templates` separat | Dela `RoutineStep` → shortcut (Våg C) |
| Cross-device | Endast localStorage | Android + Mac web delar inte overrides idag |
| Editor UX | CRUD + återställ standard | Ev. drag-ordning, duplicat-varning, förhandsvisning (Våg A+) |
| Preset-täckning | `foralder_trygg` + `rehab_lag` har PACK_ROWS | `minimal` / `vardag_arbete` saknar egna rader |

---

## REASONS

| | |
|---|---|
| **Requirements** | Användaren ska kunna anpassa profil-genvägar (Familjen, MåBra, Hamn) utan att bygga om hela Life OS. ADHD-säkert: max 12 genvägar, tydlig “återställ standard”. Valfritt: synk mellan enheter (Mac ↔ Android). Light editor uppfyller kärnbehovet; Fas D = bekvämlighet + kuraterat innehåll. |
| **Entities** | `MaterialShortcut` (`label`, `target: ModuleLinkTarget`, `bankRef?`); nyckel `LifeHubPresetId:MaterialPackHub`. Våg B: ev. `users/{uid}/preferences/materialPackOverrides` eller top-level `material_pack_overrides/{id}` med `ownerId`. **Ej** WORM — muterbar användardata. |
| **Approach** | **Våg A:** **done** (Familjen-mount). **Våg A+:** polish befintlig editor — minimal diff, ingen rules. **Våg B:** dual-write localStorage + Firestore med migration vid login. **Våg C:** bankRef-picker + rutinlänk — separat PMIR + `smoke:innehall`. |
| **Structure** | Kärna: `src/modules/core/lifeOs/` (`materialPacks`, `materialPackApi`, `MaterialPackShortcuts`, `moduleLink`). UI: `ProjektMaterialPackPage.tsx`. Hubbar: Familjen, MåBra, Hamn. Route oförändrad: `/projekt/genvagar`. |
| **Operations** | CRUD shortcuts lokalt (idag). Våg B: `listenMaterialPackOverrides` + `saveMaterialPackOverride` → Firestore. Deploy: Våg A+ = hosting only; Våg B = `firestore:rules` + ev. ny collection. Zero Footprint: rensa ev. Firestore-cache vid logout (samma mönster som övriga prefs). |
| **Norms** | U6: `bankRef` är dokumentation — **ingen** auto-RAG, inga nya FACT utan kurator. Koppling ≠ RAG ([`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md)). Obsidian Calm UI. Ingen gamification. LLM får inte välja modul-target (routing i kod). |
| **Safeguards** | Max 12 shortcuts (`materialPackApi.ts` L38, L72). `isMaterialShortcut` validering vid load. Locked UX oförändrad (Barnfokus, Valv, P3 Kanban). Inga fria externa URL:er — endast `MATERIAL_TARGET_PRESETS`. |

---

## Följer med till main (redan live — Våg A)

- [x] `MaterialPackShortcuts` monterad på Familjen-hub (`hub="familjen"`) när preset har material
- [x] Light editor `/projekt/genvagar` med localStorage persistens
- [x] Reaktiv uppdatering på MåBra/Hamn/Familjen via `material-pack-updated`
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS** (mål vid Våg A-deploy)
- [x] Hosting deploy MaterialPack Familjen — **PASS** 2026-06-06

### Följer med (Våg A+ — valfri polish, separat beslut)

- [ ] Drag-ordning / duplicat-varning i `ProjektMaterialPackPage`
- [ ] Tydligare länk från `ProjektHubPage` → `/projekt/genvagar` (copy only)
- [ ] Förhandsvisning “så här ser det ut på MåBra/Hamn/Familjen”
- [ ] Copy: “sparad på denna enhet” tills Våg B
- [ ] **Oförändrat:** `PACK_ROWS` standardvärden, localStorage-nyckel, P3 Kanban

### Följer med (Våg B — separat PMIR + rules-OK)

- [ ] Firestore collection för MaterialPack-overrides (schema TBD — t.ex. under `users/{uid}` subcollection eller top-level med `ownerId`)
- [ ] Dual-write: localStorage primary offline, Firestore sync on login
- [ ] **`firestore.rules`** — **PMIR-STOP** (ny `match`-block, ej WORM)
- [ ] `firebase deploy --only firestore:rules`

### Följer med (Våg C — defer)

- [ ] `bankRef`-dropdown från godkänd Mabra-bank (`INNEHALL-REGISTER`)
- [ ] Koppling `routine_templates` steg → MaterialPack-genväg
- [ ] Ny `smoke:life-os-links` (nämnd i komihåg, ej i `package.json` idag)
- [ ] Ev. `PACK_ROWS` för `minimal` / `vardag_arbete` — kräver kurator/copy-OK

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren | Ingen — arbete på `main` eller ny `feat/materialpack-fas-d` |
| Commits som inte mergas | N/A (Våg A redan på main) |
| Light-only begränsning | Våg B ersätter inte localStorage — lägger till synk |
| Cross-device förväntan | Utan Våg B: overrides per enhet (medvetet) |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, U1–U5 Grunder | **PASS** — inga nya silor; MaterialPack = UI-routing |
| **U6 innehåll** | `INNEHALL-REGISTER.md`, `innehall-register.mdc` | **PASS** om `bankRef` förblir dokumentation · **GAP** om Våg C auto-länkar FACT utan kurator |
| **Design** | `LIFE-OS-KOPPLINGAR-KOMIHAG.md`, `PROJEKT-SPEC.md`, `locked-ux-features.md` | **PASS** (Våg A) — Familjen-mount utan Barnfokus-regression |
| **Säkerhet** | `.context/security.md`, `firestore.rules` | **PASS** (localStorage only) · **STOP** (Våg B — ny rules) |
| **Silo (U1)** | `materialPacks.ts` L2: “U6: inga nya FACT/RAG” | **PASS** — `resolveModuleLink` routar UI, ingen cross-RAG |
| **WORM (U3)** | `reality_vault`, `children_logs`, `journal` | **PASS** — MaterialPack skriver inte till Sacred collections |
| **Zero Footprint (U4)** | `.context/security.md` | **PASS** (Våg A) · **GAP** (Våg B — cache-rensning vid logout) |

### `firestore.rules` — befintligt (ej MaterialPack)

| Collection | Rad | MaterialPack-relevans |
|------------|-----|------------------------|
| `project_rules` | L248–279 | **Ej berörd** — redan live 2026-06-01 |
| `routine_templates` | L281–307 | **Relaterad** Life OS Fas D — ej samma data som MaterialPack overrides; Våg C kan dela schema-mönster |

**Verifierat:** `grep MaterialPack\|material_pack` i `firestore.rules` → **0 träffar**.

**Våg A / A+:** ingen ändring i `firestore.rules`.  
**Våg B:** ny `match`-block kräver explicit användar-OK + deploy enligt [`deploy-paminnelser.mdc`](../../.cursor/rules/deploy-paminnelser.mdc).

### Sacred / locked — får inte röras

| Feature | Regel |
|---------|-------|
| Barnfokus (`BarnfokusFraganPanel`) | MaterialPack får **länka** till, inte ersätta eller flytta ovanför |
| Valv Mönster/Orkester/Kunskapsbank | Oförändrat |
| P3 Kanban `/planering?tab=handling` | Oförändrat |
| Auto-promote till Valv | Aldrig från MaterialPack |
| Fjärde RAG-silo / cross-read Kunskap ↔ MåBra | Förbjudet (U1) |
| Ikoner D1/M2 | Oförändrat |

---

## Teknisk approach (Fas D — om godkänd)

### Våg A+ (editor polish, ingen rules)

```
ProjektMaterialPackPage
  ← ev. reorder (array move, ingen ny lib)
  ← varning vid duplicerat targetToKey()
  ← behåll max 12 + MATERIAL_TARGET_PRESETS dropdown
  ← copy "sparad på denna enhet"
```

### Våg B (Firestore sync)

```
materialPackApi.ts
  ← dual-write: localStorage + Firestore on save
  ← on login: merge Firestore → localStorage (Firestore wins om nyare)
  ← listenMaterialPackOverrides(uid) för live sync

firestore.rules (NY)
  match /material_pack_overrides/{docId} eller users/{uid}/preferences/...
  ← isOwner(), max 12 shortcuts, validerade fält — ej WORM
```

### Våg C (innehåll + rutiner)

```
ProjektMaterialPackPage
  ← bankRef dropdown från Mabra-CONTENT-BANK (READ only)
routine_templates ↔ MaterialPack
  ← RoutineStep.target kan återanvända ModuleLinkTarget
```

**Delad logik:** behåll `getMaterialShortcuts` → override vinner över default. Ingen ändring i `moduleLink.ts` utan ny PMIR.

---

## Riskbedömning

| Risk | Sannolikhet | Mitigering |
|------|-------------|------------|
| Familjen-mount krockar med Barnfokus-layout | **Låg** (Våg A live) | Placering under hub-stack bekräftad i `FamiljenPage.tsx` |
| Användare tror genvägar synkas mellan Mac/Android | **Hög** | Copy tydlig i editor; Våg B för synk |
| Ogiltig `bankRef` tolkas som RAG | **Låg** | Behåll som dokumentationsfält; Våg C kräver `smoke:innehall` |
| Rules-deploy utan PMIR (Våg B) | **Hög** | Isolera Våg B; Våg A+ utan rules |
| Nya fria deep links utan validering | **Medel** | Behåll `MATERIAL_TARGET_PRESETS` — inga fria URL-fält |
| Över scope → Life OS Fas D helhet | **Medel** | Denna PMIR = MaterialPack only; rutiner = separat beslut |
| Zero Footprint-läckage (Våg B cache) | **Medel** | Rensa prefs-cache vid logout — samma mönster som `routineTemplatesApi` |

---

## Scope boundaries

| In scope | Out of scope |
|----------|--------------|
| `/projekt/genvagar` editor polish (Våg A+) | Ny hub-typ utöver familjen/mabra/hamn |
| Våg B: Firestore sync overrides | Ersätta Barnfokus eller Middagsfrågan |
| localStorage overrides (befintligt) | LLM-genererade genvägar |
| `bankRef` som valfritt fält (Våg C) | Auto-ingest till `kampspar` / Vector Search |
| Deep links via `ModuleLinkTarget` | Fria externa URL:er i MaterialPack |
| Ev. `PACK_ROWS` för fler presets | Ändra defaults utan kurator/copy-OK |

---

## Smoke (efter godkänd Fas D-implementation)

| Kommando | Våg | Förväntat |
|----------|-----|-----------|
| `npm run build` | A+, B, C | PASS |
| `npm run smoke:locked-ux` | alla | PASS — Barnfokus, Valv, Planering P3 oförändrade |
| `npm run smoke:design-modules` | A+ | PASS |
| `npm run smoke:orkester` | alla | PASS |
| `npm run smoke:innehall` | C (bankRef-picker) | PASS |
| Manuell | A+ | `/projekt/genvagar` → ändra etikett → Familjen/MåBra/Hamn visar uppdatering utan reload |
| Manuell | B | Samma override synkas efter login på second device |
| Android | A+, B | `npm run build:web && npx cap sync android` före Studio Run |

**Baseline (Våg A redan live):** `smoke:locked-ux` + `smoke:orkester` + `build` ska vara PASS på `main` före Fas D-arbete.

---

## Produktbeslut (krävs före Fas D-kod)

1. **Våg A+ nu?** (editor-polish, copy “sparad på enheten” — ingen Firestore)
2. **Synk mellan enheter (Våg B)?** — ja / nej / defer
3. **bankRef-picker (Våg C)?** — ja / nej / defer
4. **Ska `minimal` / `vardag_arbete` presets få egna PACK_ROWS?** (idag endast `foralder_trygg` + `rehab_lag`)
5. **Schema Våg B:** subcollection under `users/{uid}` vs top-level `material_pack_overrides`?

---

## Rekommendation

- [x] **Våg A** — Familjen-mount — **done** 2026-06-06
- [ ] **Våg A+** — editor polish + tydlig enhets-copy — efter beslut (1)
- [ ] **Våg B** — Firestore sync — **vänta** tills explicit rules-OK + schema-beslut (5)
- [ ] **Våg C** — bankRef + rutiner — defer (kurator + `smoke:innehall`)
- [ ] **Merge + push** — endast efter smoke + ditt OK (Fas D-vågor)
- [x] **Avbryt full Fas D nu** — light editor + Våg A räcker för prod

---

## Godkännande

**Användaren:** ☐ godkänn Våg A+ · ☐ godkänn Våg B (rules) · ☐ godkänn Våg C · ☐ avbryt  
**Datum:** ___________

---

Se även: [`2026-05-29-projekt-cursor-plan.md`](./2026-05-29-projekt-cursor-plan.md) · [`2026-05-31-blocker-lifeos-d.md`](./2026-05-31-blocker-lifeos-d.md) · [`docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) · [`docs/MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md) · [`docs/MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md)
