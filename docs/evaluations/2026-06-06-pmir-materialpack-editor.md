# Pre-Merge Impact Report (PMIR) — MaterialPack-editor (Fas D)

**Datum:** 2026-06-06  
**Gren:** `main` (direkt på trunk — ingen feature-gren än)  
**Agent / session:** AGENT 3 — autonom byggpass 1h (plan only)  
**Scope:** Utökning från **light editor** (localStorage) till **full MaterialPack-editor** (Life OS Fas D)

---

## Sammanfattning

**Fas C + Fas 3 light editor är live på `main`.** Genvägar kan redigeras på `/projekt/genvagar` och sparas i `localStorage` per användare. Standardpaket renderas på MåBra och Hamn via `MaterialPackShortcuts`.

**Fas D / full editor** är **SKIP** sedan Master YOLO `lifeos-d` ([`2026-05-31-blocker-lifeos-d.md`](./2026-05-31-blocker-lifeos-d.md)) — kräver produktbeslut om Firestore-synk vs enbart lokal polish.

Rekommendation: **Våg A** (UI-polish + Familjen-mount, ingen `firestore.rules`) efter ditt OK. **Våg B** (Firestore-synk mellan enheter) och **Våg C** (bankRef-validering + rutinkoppling) kräver separat godkännande.

---

## PMIR-STOPP

**Ingen implementation av MaterialPack-editor-kod utan explicit användargodkännande** (*"godkänn Våg A"*, *"kör MaterialPack Fas D"*, *"godkänn merge"*).

Detta dokument är **endast plan och regelanalys**. Committa inte rules, ny Firestore-collection eller hub-UI utan PMIR + smoke PASS.

---

## Nuläge (läst i kod)

| Leverans | Status | Kod |
|----------|--------|-----|
| Standardpaket per preset + hub | **done** | `materialPacks.ts` (`PACK_ROWS`) |
| Lokala overrides (max 12/hub) | **done** | `materialPackApi.ts` → `livskompassen_material_pack_overrides_v1:{uid}` |
| Reaktiv läsning på hubbar | **done** | `useMaterialShortcuts.ts`, event `material-pack-updated` |
| Editor light | **done** | `ProjektMaterialPackPage.tsx` → `/projekt/genvagar` |
| Fördefinierade mål (16 st) | **done** | `materialPackTargets.ts` — inga fria moduler |
| Render MåBra | **done** | `MabraPage.tsx` → `profileSlot` |
| Render Hamn | **done** | `TryggHamnHub.tsx` |
| Render Familjen | **GAP** | `PACK_ROWS` har `familjen`-hub för `foralder_trygg` — **ej monterad** på Familjen-sida |
| Firestore `material_pack_*` | **saknas** | ingen match i `firestore.rules` |
| `routine_templates` | **delvis** | rules L281–307 + `routineTemplatesApi.ts` — **ej kopplad** till MaterialPack-editor |

**MODUL-GAP:** [`MODUL-GAP-OVERSIKT.md`](../MODUL-GAP-OVERSIKT.md) markerar MaterialPack **done** — avser **Fas 3 light**. **Full editor** = öppet i [`.context/system-plan.md`](../../.context/system-plan.md) rad 173.

---

## Gap vs LIFE-OS Fas D

| Spec / kanon | Idag | Full editor gap |
|--------------|------|-----------------|
| MaterialPack per hub + preset | Defaults + localStorage override | Firestore-synk mellan enheter (valfritt) |
| REFLECTION/PLAY via bankRef | Fri textfält, dokumentation only | Picker mot `INNEHALL-REGISTER` / Mabra-bank (U6) |
| Familjen-hub material | Data finns, UI saknas | Montera `MaterialPackShortcuts` på Familjen |
| `ModuleLink` deep links | 16 fördefinierade mål | Nya mål kräver kod i `materialPackTargets.ts` |
| Rutiner ↔ genvägar | `RoutinesPanel` separat | Ev. dela `RoutineStep` → shortcut (Våg C) |
| Cross-device | Endast localStorage | Android + Mac web delar inte overrides idag |

---

## REASONS

| | |
|---|---|
| **Requirements** | Användaren ska kunna anpassa profil-genvägar (Familjen, MåBra, Hamn) utan att bygga om hela Life OS. ADHD-säkert: max 12 genvägar, tydlig “återställ standard”. Valfritt: synk mellan enheter. |
| **Entities** | `MaterialShortcut` (`label`, `target: ModuleLinkTarget`, `bankRef?`); nyckel `LifeHubPresetId:MaterialPackHub`; ev. `users/{uid}/preferences/materialPackOverrides` eller `material_pack_overrides/{id}` (Våg B). **Ej** WORM — muterbar användardata. |
| **Approach** | **Våg A:** polish befintlig light editor + montera Familjen — minimal diff, ingen rules. **Våg B:** dual-write localStorage + Firestore med migration vid login. **Våg C:** bankRef-picker + rutinlänk — separat PMIR. |
| **Structure** | Kärna: `src/modules/core/lifeOs/` (`materialPacks`, `materialPackApi`, `MaterialPackShortcuts`). UI: `ProjektMaterialPackPage.tsx`. Hubbar: MåBra, Hamn, (Familjen). Route oförändrad: `/projekt/genvagar`. |
| **Operations** | CRUD shortcuts lokalt (idag). Våg B: `listenMaterialPackOverrides` + `saveMaterialPackOverride` → Firestore. Deploy: Våg A = hosting only; Våg B = `firestore:rules` + ev. ny collection. |
| **Norms** | U6: `bankRef` är dokumentation — **ingen** auto-RAG, inga nya FACT utan kurator. Koppling ≠ RAG ([`LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md)). Obsidian Calm UI. Ingen gamification. |
| **Safeguards** | Max 12 shortcuts (befintlig cap). `isMaterialShortcut` validering vid load. Locked UX oförändrad (Barnfokus, Valv, P3 Kanban). LLM får inte välja modul-target. Zero Footprint: rensa ev. Firestore-cache vid logout (samma mönster som övriga prefs). |

---

## Följer med till main (vid godkänd Våg A)

- [ ] `MaterialPackShortcuts` monterad på Familjen-hub (`hub="familjen"`) när preset har material
- [ ] Ev. drag-ordning / duplicat-varning i `ProjektMaterialPackPage`
- [ ] Tydligare länk från `ProjektHubPage` → `/projekt/genvagar` (copy only)
- [ ] Ev. förhandsvisning “så här ser det ut på MåBra/Hamn/Familjen”
- [ ] **Oförändrat:** `PACK_ROWS` standardvärden, `materialPackApi` localStorage-nyckel, P3 Kanban
- [ ] Låst UX — `npm run smoke:locked-ux`: **PASS** (mål)

### Följer med (Våg B — separat PMIR + rules-OK)

- [ ] Firestore collection för MaterialPack-overrides (schema TBD — t.ex. under `users/{uid}` subcollection eller top-level med `ownerId`)
- [ ] Dual-write: localStorage primary offline, Firestore sync on login
- [ ] **`firestore.rules`** — **PMIR-STOP** (ny match-block, ej WORM)
- [ ] `firebase deploy --only firestore:rules`

### Följer med (Våg C — defer)

- [ ] `bankRef`-dropdown från godkänd Mabra-bank (`INNEHALL-REGISTER`)
- [ ] Koppling `routine_templates` steg → MaterialPack-genväg
- [ ] Ny `smoke:life-os-links` (nämnd i komihåg, ej i `package.json` idag)

---

## Försvinner

| Vad | Detalj |
|-----|--------|
| Gren | Ingen — arbete på `main` eller ny `feat/materialpack-editor` |
| Commits som inte mergas | N/A |
| Light-only begränsning | Våg B ersätter inte localStorage — lägger till synk |
| Familjen utan MaterialPack | Våg A monterar UI; defaults i `PACK_ROWS` behålls |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | `.context/system-plan.md`, U1–U5 Grunder | **PASS** (Våg A) — inga nya silor |
| **U6 innehåll** | `INNEHALL-REGISTER.md`, `innehall-register.mdc` | **PASS** om `bankRef` förblir dokumentation · **GAP** om Våg C auto-länkar FACT utan kurator |
| **Design** | `LIFE-OS-KOPPLINGAR-KOMIHAG.md`, `PROJEKT-SPEC.md`, `locked-ux-features.md` | **GAP** — Familjen-mount saknas; P3 Kanban **får inte** regress |
| **Säkerhet** | `.context/security.md`, `firestore.rules` | **PASS** (Våg A, localStorage only) · **STOP** (Våg B — ny rules) |
| **Silo** | `materialPacks.ts` L2: “U6: inga nya FACT/RAG” | **PASS** — `resolveModuleLink` routar UI, ingen cross-RAG |
| **WORM** | `reality_vault`, `children_logs` | **PASS** — MaterialPack skriver inte till Sacred collections |

### `firestore.rules` — befintligt (ej MaterialPack)

| Collection | Rad | MaterialPack-relevans |
|------------|-----|------------------------|
| `project_rules` | L248–279 | **Ej berörd** — redan live 2026-06-01 |
| `routine_templates` | L281–307 | **Relaterad** Life OS Fas D — ej samma data som MaterialPack overrides |

**Våg A:** ingen ändring i `firestore.rules`.  
**Våg B:** ny `match`-block kräver explicit användar-OK + deploy enligt [`deploy-paminnelser.mdc`](../../.cursor/rules/deploy-paminnelser.mdc).

### Sacred / locked — får inte röras

- Barnfokus (`BarnfokusFraganPanel`) — MaterialPack får **länka** till, inte ersätta
- Valv Mönster/Orkester/Kunskapsbank
- P3 Kanban på `/planering?tab=handling`
- Auto-promote till Valv
- Ny fjärde RAG-silo eller cross-read Kunskap ↔ MåBra

---

## Teknisk approach (Våg A — minimal diff)

```
FamiljenPage (eller motsvarande hub-shell)
  ← MaterialPackShortcuts preset={preset} hub="familjen"
  ← samma mönster som MabraPage profileSlot / TryggHamnHub

ProjektMaterialPackPage (polish)
  ← ev. reorder (array move, ingen ny lib)
  ← varning vid duplicerat targetToKey()
  ← behåll max 12 + MATERIAL_TARGET_PRESETS dropdown
```

**Delad logik:** behåll `getMaterialShortcuts` → override vinner över default. Ingen ändring i `moduleLink.ts` utan ny PMIR.

**Android:** localStorage per enhet — användaren bör informeras (“sparad på denna enhet”) tills Våg B.

---

## Riskbedömning

| Risk | Sannolikhet | Mitigering |
|------|-------------|------------|
| Familjen-mount krockar med Barnfokus-layout | Medel | Placera under befintlig hub-stack, inte ovanför Barnfokus |
| Användare tror genvägar synkas mellan Mac/Android | Hög | Copy tydlig i editor (redan delvis); Våg B för synk |
| Ogiltig `bankRef` tolkas som RAG | Låg | Behåll som dokumentationsfält; Våg C kräver `smoke:innehall` |
| Rules-deploy utan PMIR (Våg B) | Hög | Isolera Våg B; Våg A utan rules |
| Nya fria deep links utan validering | Medel | Behåll `MATERIAL_TARGET_PRESETS` — inga fria URL-fält |
| Över scope → Life OS Fas D helhet | Medel | Denna PMIR = MaterialPack only; rutiner = separat beslut |

---

## Scope boundaries

| In scope | Out of scope |
|----------|--------------|
| `/projekt/genvagar` editor polish | Ny hub-typ utöver familjen/mabra/hamn |
| Montera Familjen MaterialPack | Ersätta Barnfokus eller Middagsfrågan |
| localStorage overrides (befintligt) | LLM-genererade genvägar |
| Våg B: Firestore sync overrides | Ändra `PACK_ROWS` defaults utan kurator/copy-OK |
| `bankRef` som valfritt fält | Auto-ingest till `kampspar` / Vector Search |
| Deep links via `ModuleLinkTarget` | Fria externa URL:er i MaterialPack |

---

## Smoke (efter godkänd implementation)

| Kommando | Våg | Förväntat |
|----------|-----|-----------|
| `npm run build` | A, B, C | PASS |
| `npm run smoke:locked-ux` | A (minst) | PASS — Barnfokus, Valv, Planering P3 oförändrade |
| `npm run smoke:design-modules` | A om Familjen-layout | PASS |
| `npm run smoke:orkester` | alla | PASS |
| `npm run smoke:innehall` | C (bankRef-picker) | PASS |
| Manuell | A | `/projekt/genvagar` → ändra etikett → MåBra/Hamn/Familjen visar uppdatering utan reload |
| Manuell | B | Samma override synkas efter login på second device |
| Android | A, B | `npm run build:web && npx cap sync android` före Studio Run |

---

## Produktbeslut (krävs före kod)

1. **Våg A nu?** (Familjen-mount + editor-polish, ingen Firestore)
2. **Synk mellan enheter (Våg B)?** — ja/nej/defer
3. **bankRef-picker (Våg C)?** — ja/nej/defer
4. **Ska `minimal` / `vardag_arbete` presets få egna PACK_ROWS?** (idag endast `foralder_trygg` + `rehab_lag`)

---

## Rekommendation

- [ ] **Våg A** — Familjen-mount + light editor polish efter beslut (1)
- [ ] **Våg B** — Firestore sync — **vänta** tills explicit rules-OK + schema-beslut
- [ ] **Våg C** — bankRef + rutiner — defer (kurator + `smoke:innehall`)
- [ ] **Merge + push** — endast efter smoke + ditt OK
- [x] **Avbryt full Fas D nu** — light editor räcker för prod; ingen regression risk

---

## Godkännande

**Användaren:** ☐ godkänn Våg A · ☐ godkänn Våg B (rules) · ☐ avbryt  
**Datum:** ___________

---

Se även: [`2026-05-29-projekt-cursor-plan.md`](./2026-05-29-projekt-cursor-plan.md) · [`2026-05-31-blocker-lifeos-d.md`](./2026-05-31-blocker-lifeos-d.md) · [`docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) · [`docs/MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md)
