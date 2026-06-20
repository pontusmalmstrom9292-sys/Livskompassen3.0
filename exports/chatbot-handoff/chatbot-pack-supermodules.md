This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/evaluations/2026-06-16-supermodule-ui-masterplan.md, docs/evaluations/2026-06-15-valv-supermodule-spec.md, docs/specs/modules/VALVET_SUPERMODULE_PLAN.md, src/modules/core/ui/SupermoduleModeSelect.tsx, src/modules/**/*InputSuperModule*.tsx, src/modules/**/*SuperModule*.tsx, src/modules/**/supermodule/**, src/modules/**/inputModes.ts, src/modules/**/*InputModes.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

## File: docs/evaluations/2026-06-15-valv-supermodule-spec.md
````markdown
# Valv — SuperModule SPEC (Fas 1A–1E)

**Datum:** 2026-06-15  
**Status:** Godkänd — Cursor implementation  
**Kanon:** [`VALVET_SUPERMODULE_PLAN.md`](../specs/modules/VALVET_SUPERMODULE_PLAN.md)

---

## Wireframes (text)

### Lägesväljare (alltid synlig)

```
┌─────────────────────────────────────────────────────────┐
│ SANNINGSARKIV · [aktivt läge]                         │
│ [Inkast][Granska][Analysera][Kunskap]  [Mer… ▼]         │
├─────────────────────────────────────────────────────────┤
│ (innehåll per läge)                                     │
└─────────────────────────────────────────────────────────┘
```

### Samla (`spara`)

```
[ Dropzone — VaultInkastCompact ]
[ Väntar granskning (N) ]  → öppnar granska
[ details: Manuell post → VaultEntryForm ]
Sub-tabs: [ Arkiv ] [ Sök i arkiv ]
  → VaultLogList / Valv-Chat
```

### Granska

```
InboxReviewQueue (HITL) — full bredd, tillbaka → Inkast
```

### Analysera (locked)

```
Sub-tabs: [ Mönster ] [ Orkester ]
VaultMonsterPanel | VaultOrkesterPanel
```

### Kunskap (locked)

```
Sub-tabs: [ Kunskapsbank ] [ Aktörskarta ]
```

### Mer → vit / rapporter / forensik

- **vit:** `ValvVitZone`
- **rapporter:** Dossier
- **mer:** `ValvForensikZone` — 1 flik + «Visa fler»

---

## URL-kontrakt

| Intent | URL |
|--------|-----|
| Inkast + arkiv | `/valvet?valvMode=spara` |
| Granskningskö | `/valvet?valvMode=granska` |
| Mönster | `/valvet?valvMode=analysera&vaultTab=monster` |
| Orkester | `/valvet?valvMode=analysera&vaultTab=orkester` |
| Kunskapsbank | `/valvet?valvMode=kunskap&vaultTab=kunskapsbank` |
| Hamn analys | `/valvet?valvMode=mer&vaultTab=hamn_analys` |
| Legacy inbox | → `valvMode=granska` |

**Regel:** `vaultTab`-byte skriver `valvMode` via `resolveValvInputModeFromVaultTab`.

---

## Faser

### Fas 1A — URL-synk (MUST först)
`ValvetRoutePage`, `VaultPage`, `valvInputModes`, `valvNavCopy` (`sok` label)

### Fas 1B — Inkast-konsolidering
`ValvInputSuperModule` tier picker, `VaultSamlaHub` fold, deprecated inbox-zon

### Fas 1C — Forensik polish
`ValvForensikZone`, `ValvSuperModule` fallback, `ValvZoneModulValjare` + forensik

### Fas 1D — Nav & copy
`navTruth` `valv_granska`, `tabRegistry`, smoke asserts

### Fas 1E — Export
`vault/index.ts` exportera `parseValvInputMode`, `ValvInputMode`, `buildValvSearchParams`

---

## Manuell checklista

1. `/valvet?valvMode=granska` → InboxReviewQueue, inte Hamn
2. Granskningskö från Samla → samma kö, URL uppdateras
3. Drawer Mönster → `VaultMonsterPanel`
4. `/valvet?valvMode=mer&vaultTab=speglar_fordjupat` → rätt panel
5. Legacy `?vaultTab=sok` → Valv-Chat, inte inkorg
6. `smoke:locked-ux` PASS

---

## Locked (MUST NOT)

`VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`, `vaultPatternScan.ts`
````

## File: docs/evaluations/2026-06-16-supermodule-ui-masterplan.md
````markdown
# Supermodule + UI Masterplan — Körfält B

**Datum:** 2026-06-16 · **Status:** B1 LOCK · Våg 2 Nav micro **klar** 2026-06-16  
**Kanon:** [`2026-06-15-fas19-masterplan-v2.md`](./2026-06-15-fas19-masterplan-v2.md) (backend/Fas 19–24 — peka dit, duplicera ej) · [`UI-WAVE-ROADMAP.md`](../external-ai/UI-WAVE-ROADMAP.md) · [`LIFE-OS-BUILD-STATE.md`](../external-ai/LIFE-OS-BUILD-STATE.md)

---

## Vision

Livskompassen är ett neuroanpassat Life OS — avancerat under huven (WORM, tre silos, ADK, kapacitetsdata) men **ett steg i taget** i gränssnittet via InputSuperModule-mönstret och Obsidian Calm 2.0. Fyren styr dagsform och kapacitet i bakgrunden; den är inte en femte «plats». Målbild: fyra zoner (Hjärtat, Familjen, Vardagen, Valvet) plus tyst Fyren — kortaste vägen från överbelastning till nästa mikrosteg.

---

## Redan DONE (rör ej)

| Område | Referens |
|--------|----------|
| Fas 13–24 baseline (WORM, smoke, deploy) | [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md) |
| 6 supermodule-routers (jun 2026) | [`2026-06-06-supermodule-master-plan.md`](../archive/evaluations-fas20-2026-06/2026-06-06-supermodule-master-plan.md) — Capture, Speglar, ValvSuper, DagbokSuper, PlaneringSuper, BarnfokusSuper |
| Körfält A LOCK (CP-1–CP-7) | [`LIFE-OS-BUILD-STATE.md`](../external-ai/LIFE-OS-BUILD-STATE.md) |
| Nav Våg A F1/F2/F4/F5 | [`2026-06-15-arkitektur-nav-analys.md`](./2026-06-15-arkitektur-nav-analys.md) |
| B2/B3/B4 wave-1 polish | [`2026-06-15-hjartat-ui-spec.md`](./2026-06-15-hjartat-ui-spec.md) · familj/vardagen-specs |
| Valv B1 kod (Fas 1A–1E) | `ValvInputSuperModule`, `valvInputModes`, export i `vault/index.ts`, `ValvZoneModulValjare` inkl. forensik |

---

## Konflikter — lösta beslut (chatt vs repo)

| Konflikt | Vision (chatt) | Repo-sanning | **Beslut** |
|----------|----------------|--------------|------------|
| Hem `/` vs Hjärtat | `/` = Hjärtat | `HomePage` + CaptureSuperModule kvar på `/` | **DEFER** — PMIR (widgets, inkast). Efter B1 LOCK |
| Planering i dock | Ej toppnivå-identitet | Handling-slot → `/planering?tab=handling` | **KEEP** — P3 lock + snabb Kanban. Mental modell: Vardagen-verktyg |
| Launcher Handling | Bort | Våg A F1 done | **DONE** — rör ej |
| Dock «Dagbok» vs Hjärtat | Hjärtat | Label via `navTruth` «dagbok» | **Våg 2** — copy-fix only |
| B2–B4 mockups | Full redesign | Wave-1 polish i prod | **DONE** wave-1; ChatBox mockups parallellt, ej prod utan CHECKPOINT |
| Supermoduler jun vs B1 | 5 done | `ValvInputSuperModule` = nytt UX-lager | **Båda** — router done 2026-06-06; B1 = navigation/lägesväljare |
| Fyren plats vs motor | Bakgrund | Dock-handle + widget-genvägar | **DELVIS** — Våg A F4; full motor **DEFER** (Våg C) |
| Körfält A | — | LOCK | **MUST NOT** ny backend/WORM/rules utan PMIR |

---

## WIP / nästa 3 vågor

| Våg | Scope | Gate |
|-----|-------|------|
| **1 — B1 LOCK** | Manuell checklista §7 i [`2026-06-15-valv-supermodule-spec.md`](./2026-06-15-valv-supermodule-spec.md) + smoke + `snapshot_locked_module.sh valv` | CHECKPOINT PASS |
| **2 — Nav micro** | F3: Familjen tab+inputMode dedupe · F2: dock-label «Hjärtat» · F4 rest: neutral Valv-copy i FyrenWidgetBar publikt | Frontend only |
| **3 — Nav Våg B** | H1 `/ekonomi`→Vardagen · H2 MåBra-ingång · H3 `/arkiv` · H4 drogfrihet launcher | **DONE** 2026-06-16 — [`2026-06-16-nav-vag3-pmir.md`](./2026-06-16-nav-vag3-pmir.md) |

**Defer:** Hem→Hjärtat redirect · global Fyren kapacitetsgrind (Våg C) · M3.0-C · Upload unified steg 2 (`InkastDirectPanel`).

---

## Per zon — SuperModule + nästa steg

| Zon | SuperModule(s) | Status | Nästa steg |
|-----|----------------|--------|------------|
| **Valv** | `ValvInputSuperModule` → `ValvSuperModule` | **LOCK** (B1 2026-06-16) | Våg 2 endast med explicit OK + snapshot |
| **Hjärtat** | `DagbokInputSuperModule`, `SpeglarSuperModule` | B2 + **Våg 2 F2** done | — |
| **Familjen** | `FamiljenInputSuperModule`, `BarnfokusSuperModule` | B3 + **Våg 2 F3** done | Våg 3 efter PMIR |
| **Vardagen** | Mabra/Ekonomi/Planering/Arbetsliv InputSuperModules | B4 done | Våg 3 H1–H2 efter PMIR |
| **Hem `/`** | `CaptureSuperModule` | Legacy | DEFER merge → Hjärtat |
| **Fyren** | Widget + dock-handle | **Våg 2 F4** done | Våg C defer |

ChatBox-leveranser (wireframes): [`docs/external-ai/leveranser/ui-design/`](../external-ai/leveranser/ui-design/) — B1–B4 2026-06-15.

---

## KEEP · DEFER · MUST NOT

**KEEP:** Locked UX §1–17 ([`.context/locked-ux-features.md`](../../.context/locked-ux-features.md)) · P3 Kanban `/planering` · dock Handling-slot · tre silos · `SaveAsEvidencePrompt` HITL · Mönster/Orkester/Kunskapsbank/Aktörskarta · WH1/WH2 ikoner.

**DEFER:** Hem→Hjärtat · Nav H1–H4 utan PMIR · Fyren global kapacitetsmotor · M3.0-C · ChatBox full redesign → prod.

**MUST NOT:** Cross-RAG · auto-promote barn→Valv · backend/callables/rules i Körfält B · ta bort supermodule-delegates · streak/XP · publikt Valv-terminologi i drawer/dock.

---

## Smoke per våg

| Våg | Kommandon |
|-----|-----------|
| **1 B1** | `npm run build` · `smoke:locked-ux` · `smoke:valv` · `smoke:entities` · `smoke:orkester` · `smoke:valv-mode` |
| **2 Nav micro** | `smoke:locked-ux` · `smoke:children` · `npm run build` |
| **3 Nav H** | `smoke:locked-ux` · `smoke:design-modules` · `smoke:mabra` · PMIR-godkänd merge-smoke |

---

## Ett steg att godkänna nu

**Godkänn: Våg 3 PMIR** — routing H1 `/ekonomi`→Vardagen, H2 MåBra-ingång, H3 `/arkiv`, H4 drogfrihet launcher. Skriv PMIR enligt [`MERGE-IMPACT-RAPPORT.md`](../MERGE-IMPACT-RAPPORT.md) **före** kod.

Våg 2 **klar** 2026-06-16 — F2 header «Hjärtat», F3 Familjen kompakt nav på reflektion/livslogg, F4 neutral Kompis-copy publikt. Smoke: locked-ux + children + build PASS.

B1 **klar** — snapshot `~/Livskompassen-snapshots/2026-06-16-valv`.
````

## File: docs/specs/modules/VALVET_SUPERMODULE_PLAN.md
````markdown
# Valvet SuperModule — Fas 1 inventering & implementationsplan

**Datum:** 2026-06-14  
**Status:** Fas 1A–1E implementerad 2026-06-15 (UI-våg B1)  
**Scope:** Frontend-only · `src/modules/features/lifeJournal/evidence/vault/**` (+ route-skal `ValvetRoutePage.tsx`)  
**Kanon:** [`.context/locked-ux-features.md`](../../../.context/locked-ux-features.md) §2 · [`docs/design/VALV-HUBB-SPEC.md`](../../design/VALV-HUBB-SPEC.md)  
**Referensmönster:** [`Mabra-INPUT-SUPERHUB-SPEC.md`](./Mabra-INPUT-SUPERHUB-SPEC.md) · [`Familjen-INPUT-SUPERHUB-SPEC.md`](../Familjen-INPUT-SUPERHUB-SPEC.md)

---

## 1. Sammanfattning

Valvet har idag **14 routable `vaultTab`-IDs**, **6 zoner**, **7 input-lägen** (`valvMode`), plus **6+ drawer-rader** och **sub-TabBar per zon** — kognitiv överbelastning för användaren (ADHD/GAD-profil).

Fas 1 (pågående WIP) introducerar `ValvInputSuperModule` med lägesväxlare (`spara`, `granska`, `analysera`, …) och tar bort den synliga **inbox-zonen**. Inbox-buggen (zon → `hamn_analys`) har **identifierad rotorsak** i den gamla `handleValvZoneChange`-logiken i `VaultPage.tsx`. WIP fixar delar av detta men **lämnar kvar desynk-problem** mellan `valvMode` och `vaultTab`.

Målbild efter full Fas 1:

| Lager | Användaren ser | Routable params |
|-------|----------------|-----------------|
| **Primär** | Ett **Inkast** (dropzone) + lägesväxlare | `?valvMode=spara\|granska\|…` |
| **Sekundär** | Sub-flikar per zon (progressive disclosure) | `?vaultTab=…` (synkas från läge) |
| **Forensik** | Endast aktiv flik + "Visa fler" | `?vaultTab=hamn_analys\|…` bakom `valvMode=mer` |

**Locked UX oförändrat:** `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel` — flik-ID:n `monster`, `orkester`, `kunskapsbank`, `aktorskarta` får **inte** byta namn eller tas bort.

---

## 2. Nuvarande struktur (inventering)

### 2.1 Routable `vaultTab`-IDs (14 st)

Källa: `vaultTabs.ts`

| Grupp | IDs | Antal |
|-------|-----|-------|
| **Samla** | `logga`, `sok` | 2 |
| **Analysera** (locked) | `monster`, `orkester` | 2 |
| **Exportera** | `dossier` | 1 |
| **Kunskap** (locked) | `kunskapsbank`, `aktorskarta` | 2 |
| **Vit** | `mitt_vit` | 1 |
| **Forensik** | `hamn_analys`, `speglar_fordjupat`, `dagbok_arkiv`, `familjen_monster`, `arbetsliv_franvaro`, `arbetsliv_lon` | 6 |
| **Totalt** | | **14** |

Parsing: `parseVaultTab(raw)` → okänd sträng faller tillbaka till `'logga'`.

### 2.2 Zoner (`ValvZone`) — 6 synliga

Källa: `VALV_ZONE_VISIBLE_IDS` i `vaultTabs.ts`

```
samla → analysera → kunskap → vit → exportera → forensik
```

**Borttagen i WIP:** `inbox` (fanns i committed `VALV_ZONE_IDS`).

`resolveValvZone(tab)` mappar `vaultTab` → zon. Ingen `vaultTab` mappas explicit till inbox; kommentar rad 75 erkänner att inbox saknar tab-mapping.

### 2.3 Input-lägen (`ValvInputMode`) — 7 st

Källa: `valvInputModes.ts`

| Mode | Label | Zone | defaultVaultTab |
|------|-------|------|-----------------|
| `spara` | Spara | samla | `logga` |
| `granska` | Granska | samla | `logga` |
| `analysera` | Analysera | analysera | `monster` |
| `kunskap` | Kunskap | kunskap | `kunskapsbank` |
| `vit` | Mitt Vit | vit | `mitt_vit` |
| `rapporter` | Rapporter | exportera | `dossier` |
| `mer` | Mer | forensik | `hamn_analys` |

URL: `/valvet?valvMode=…&vaultTab=…` · legacy `?samlaView=granska` → `granska`.

### 2.4 Routing-kedja

```
/valvet
  └─ ValvetRoutePage.tsx          ← läser searchParams, synkar URL
       └─ VaultPage.tsx           ← gate, zonväljare, state
            └─ ValvInputSuperModule.tsx   ← lägesväxlare (7 knappar)
                 ├─ granska → InboxReviewQueue (inkast/kompis)
                 └─ övriga → ValvSuperModule.tsx   ← variant = zone
                      ├─ samla    → ValvSamlaZone.tsx
                      ├─ analysera → ValvAnalyseraZone.tsx  [locked panels]
                      ├─ kunskap  → ValvKunskapZone.tsx     [locked panels]
                      ├─ vit      → ValvVitZone.tsx
                      ├─ exportera → ValvExporteraZone.tsx
                      └─ forensik → ValvForensikZone.tsx    [progressive disclosure]
```

### 2.5 Import-graf (mandatory files + direkta barn)

#### `VaultPage.tsx`

| Import | Roll |
|--------|------|
| `@/core/navigation/navTruth` | `NAV_PATHS`, stäng → Hjärtat |
| `@/core/store`, `useVaultStore` | Auth, logg-pagination |
| `@/core/auth/sessionService` | `hasVaultGate()` |
| `@/core/security/vaultSessionLifecycle` | Session sync |
| `./VaultValvBreadcrumb` | Brödsmulor (zon + tab) |
| `./VaultErrorBoundary`, `@/core/components/VaultLockedGate` | Gate UI |
| `../supermodule/ValvInputSuperModule` | **Huvud-UI efter WIP** |
| `../supermodule/valvInputModes` | Mode → tab mapping |
| `../supermodule/valvLastModeStorage` | localStorage last mode |
| `../utils/vaultTabs` | `resolveValvZone`, `VaultTab` |
| `./ValvZoneModulValjare` | Första PIN-session picker |

**State:** `vaultTab`, `valvMode`, `highlightLogId`, `showZonePicker`, `sessionSyncError`.

#### `ValvSamlaZone.tsx`

| Import | Roll |
|--------|------|
| `@/core/navigation/tabRegistry` | `getSamlaVaultTabBarItems()` |
| `@/core/ui/TabBar` | Sub-flikar Arkiv / Granska inkommande |
| `@/features/lifeJournal/evidence/vaultChat` | `ValvChatPanel` (tab `sok`) |
| `./VaultSamlaHub` | Inkast + entry form + granska-knapp |
| `./VaultLogList`, `./WeaverPendingVaultBanner` | Arkivlista, G10 banner |

#### `vaultTabs.ts`

| Export | Konsumenter |
|--------|-------------|
| Tab-ID constants | `tabRegistry.ts`, `navTruth.ts`, zoner, smoke |
| `resolveValvZone` | `VaultPage`, `valvInputModes`, breadcrumb |
| `parseVaultTab` | `ValvetRoutePage`, redirects |
| `FORENSIC_*` | `ValvForensikZone`, drawer |

#### `ValvInputSuperModule.tsx` (WIP)

| Import | Roll |
|--------|------|
| `@/modules/inkast/components/InboxReviewQueue` | Granska-läge (HITL) |
| `./ValvSuperModule` | Alla icke-granska lägen |
| `./valvInputModes`, `./valvLastModeStorage` | Mode metadata + persist |

#### `ValvSuperModule.tsx`

| Zone case | Zone-komponent | Locked innehåll |
|-----------|----------------|-----------------|
| `samla` | `ValvSamlaZone` | — |
| `analysera` | `ValvAnalyseraZone` | `VaultMonsterPanel`, `VaultOrkesterPanel` |
| `kunskap` | `ValvKunskapZone` | `VaultKunskapsbankPanel`, `VaultAktorskartaPanel` |
| `vit` | `ValvVitZone` | Vit hub |
| `exportera` | `ValvExporteraZone` | `DossierPage` embedded |
| `forensik` | `ValvForensikZone` | `VaultForensicPanel` × 6 |

**Orphan (WIP):** `ValvInboxZone.tsx` — finns kvar men **importeras inte** efter borttaget `case 'inbox'`.

### 2.6 Drawer & externa länkar

| Källa | URL-mönster |
|-------|-------------|
| `navTruth.ts` `DRAWER_VALV_ENTRIES` | 6 zon-rader + leaf-tabs via `vaultDrawerPath(tab)` |
| `inkastService.ts` `VALV_SAMLA_GRANSKA_LINK` | `?vaultTab=logga&valvMode=granska` |
| `VaultOverviewPanel` | `<Link to={vaultDrawerPath('monster\|orkester\|dossier')}>` |
| Barnporten HITL | "Granska i Valv" → `/valvet` (generisk) |

---

## 3. Rotorsak: inbox-zon → `hamn_analys`

### 3.1 Historisk bug (committed kod före WIP)

I **committed** `VaultPage.tsx` fanns zon-TabBar med `getVaultZoneTabBarItems()` som inkluderade **`inbox`** (via `VALV_ZONE_IDS` + `VALV_ZONE_LABELS.inbox: 'Inkorg'` i `valvNavCopy.ts`).

Zon-byte hanterades av:

```typescript
// VaultPage.tsx (committed — borttaget i WIP)
const handleValvZoneChange = (zone: ValvZone) => {
  if (zone === 'samla') setVaultTab('logga');
  else if (zone === 'analysera') setVaultTab('monster');
  else if (zone === 'kunskap') setVaultTab(KUNSKAP_VAULT_TAB);
  else if (zone === 'vit') setVaultTab(VIT_VAULT_TAB);
  else if (zone === 'exportera') setVaultTab('dossier');
  else setVaultTab('hamn_analys');   // ← ALLT som inte matchar ovan, inkl. inbox OCH forensik
};
```

**Kedja när användaren klickade Inkorg:**

1. TabBar `onChange('inbox')` → `handleValvZoneChange('inbox')`
2. Ingen `if (zone === 'inbox')` → **`else` → `setVaultTab('hamn_analys')`**
3. `valvZone = resolveValvZone('hamn_analys')` → **`'forensik'`**
4. `ValvSuperModule variant={valvZone}` → **`forensik`**, tab `hamn_analys`
5. UI visar **Hamn · Analys** — inte inkorg

**Dubbel fel:** Även om `ValvSuperModule` hade `case 'inbox': return <ValvInboxZone />`, nåddes det **aldrig via zon-TabBar** eftersom `variant` sattes från `resolveValvZone(vaultTab)` (redan `forensik`), inte från det klickade zonenamnet.

### 3.2 Kvarvarande relaterade problem (WIP)

| Problem | Var | Effekt |
|---------|-----|--------|
| **`sok` felmärkt** | `valvNavCopy.ts`: `sok: 'Granska inkommande'` | Tab visar `ValvChatPanel` (RAG-sök), inte inkorg |
| **`valvMode`/`vaultTab` desynk** | `ValvetRoutePage` + `VaultPage` | Drawer sätter bara `vaultTab`; `valvMode` default `spara` → fel zon-innehåll |
| **Forensik fallback** | `ValvSuperModule.tsx:80` | I `mer`-läge: icke-forensic `vaultTab` → tvingas `hamn_analys` |
| **Orphan `ValvInboxZone`** | Ej importerad | Död kod; granska sker via `InboxReviewQueue` i SuperModule |
| **`resolveValvZone` inbox-kommentar** | `vaultTabs.ts:75` | Ingen mapping för legacy inbox-navigering |

### 3.3 WIP-fix (delvis)

WIP ersätter zon-TabBar med `ValvInputSuperModule` och mappar granska via:

- `valvMode='granska'` → `InboxReviewQueue` (korrekt inbox-upplevelse)
- `handleZonePickerSelect` → `modeMap` utan inbox (OK)
- Borttaget `case 'inbox'` i `ValvSuperModule` (OK om granska-läge är enda vägen)

**Ej löst i WIP:** URL-synk när användaren kommer via drawer med enbart `vaultTab=monster` men `valvMode` saknas; samt label-förvirring `sok` vs granska.

---

## 4. Föreslagen målarkitektur (Fas 1 färdigställande)

### 4.1 Ett Inkast — tre lager

```
┌─────────────────────────────────────────────────┐
│  ValvInputSuperModule                           │
│  ┌───────────────────────────────────────────┐  │
│  │ Lägesväxlare (max 4 primära + "Mer")      │  │
│  │ [Inkast] [Granska] [Analysera] [Mer…]     │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ Läge = spara (Inkast)                     │  │
│  │  • VaultInkastCompact (CaptureSuperModule)│  │
│  │  • VaultEntryForm (manuell post)          │  │
│  │  • VaultLogList (arkiv)                   │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │ Läge = granska                            │  │
│  │  • InboxReviewQueue (HITL, oförändrad)    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

- **Döp om läget `spara` → `inkast`** i UI (internt ID kan behållas för migration).
- Sub-TabBar i `ValvSamlaZone`: döp `sok` till **"Sök i arkiv"** (eller flytta chat bakom sekundär länk) — **inte** "Granska inkommande".
- **Ta bort** duplicerad inkast-yta: `VaultSamlaHub` + `VaultOverviewPanel` förenklas till en ingress-rad + dropzone.

### 4.2 Progressive disclosure — Forensik (redan påbörjad)

`ValvForensikZone.tsx` visar **endast aktiv flik** + knapp "Visa fler" → expanderar till 6 TabBar-items. **Behåll** detta mönster; applicera samma princip på:

- `ValvAnalyseraZone` — 2 flikar OK som är
- `ValvKunskapZone` — 2 flikar OK (locked)
- Lägesväxlaren — **tier `primary` | `more`** som MåBra/Familjen (4 synliga + resten under "Mer")

### 4.3 URL-kontrakt (efter fix)

| Intent | Canonical URL |
|--------|---------------|
| Inkast + arkiv | `/valvet?valvMode=spara` |
| Granskningskö | `/valvet?valvMode=granska` |
| Mönster (locked) | `/valvet?valvMode=analysera&vaultTab=monster` |
| Orkester (locked) | `/valvet?valvMode=analysera&vaultTab=orkester` |
| Kunskapsbank (locked) | `/valvet?valvMode=kunskap&vaultTab=kunskapsbank` |
| Aktörskarta (locked) | `/valvet?valvMode=kunskap&vaultTab=aktorskarta` |
| Hamn analys | `/valvet?valvMode=mer&vaultTab=hamn_analys` |

**Regel:** Vid `vaultTab`-byte (drawer/sub-TabBar) ska `valvMode` **härledas** via `resolveValvInputModeFromVaultTab(tab)` och skrivas till URL.

---

## 5. Exakta filändringar (implementationsplan)

### Fas 1A — Bugfix & synk (minimal, måste först)

| Fil | Ändring |
|-----|---------|
| `ValvetRoutePage.tsx` | Vid `handleVaultTabChange`: sätt även `valvMode` via `resolveValvInputModeFromVaultTab(next)`. Vid init: om `valvMode` saknas i URL, härled från `vaultTab`. |
| `VaultPage.tsx` | `useEffect` på `[initialVaultTab, initialValvMode]`: om desynk, prioritera `initialValvMode` eller härled mode från tab. Ta bort risk att `setValvMode` skriver om tab felaktigt vid granska. |
| `valvInputModes.ts` | Lägg `granska` i `vaultTabForValvInputMode` guard (returnera alltid `logga`, ignorera forensic currentTab). Ev. lägg `resolveValvInputModeFromVaultTab('sok')` → `'spara'` (chat ≠ granska). |
| `valvNavCopy.ts` | Byt `sok`-label från `'Granska inkommande'` → `'Sök i arkiv'` (eller `'Valv-Chat'`). |
| `vaultTabs.ts` | Ta bort/ uppdatera inbox-kommentar; ev. `parseVaultTab` legacy alias: `'inbox'` → trigga granska (dokumentera i redirect-hjälpare, inte som VaultTab). |

### Fas 1B — Inkast-konsolidering

| Fil | Ändring |
|-----|---------|
| `ValvInputSuperModule.tsx` | Tier-växlare: primära `[inkast/spara, granska, analysera, kunskap]` + dropdown "Mer" (`vit`, `rapporter`, `mer`). |
| `valvInputModes.ts` | Lägg `tier: 'primary' \| 'more'` per mode (som MåBra). Ev. alias `inkast` som display för `spara`. |
| `VaultSamlaHub.tsx` | Förenkla till **en** ingress: dropzone (`VaultInkastCompact`) + kompakt pending-badge → `onOpenGranska`. Flytta `VaultEntryForm` under fold "Manuell post". |
| `ValvSamlaZone.tsx` | Behåll sub-TabBar `logga`/`sok` men med korrigerade labels; `onOpenGranska` oförändrat. |
| `VaultOverviewPanel.tsx` | Minska länkar (Mönster/Orkester/Rapporter) — eller flytta till breadcrumb/drawer endast. |
| `zones/ValvInboxZone.tsx` | **Ta bort** filen eller markera `@deprecated` re-export → `InboxReviewQueue` (ingen separat zon). |

### Fas 1C — Forensik progressive disclosure (polish)

| Fil | Ändring |
|-----|---------|
| `ValvForensikZone.tsx` | Redan implementerat — verifiera att `valvMode=mer` alltid föregår forensic tabs i URL. |
| `ValvSuperModule.tsx` | Forensik-fallback: om `vaultTab` inte är forensic **och** mode är `mer`, använd `def.defaultVaultTab` — **inte** tyst `hamn_analys` om currentTab är samla-tab. |
| `ValvZoneModulValjare.tsx` | Lägg tillbaka `forensik` som valfritt picker-kort (finns i drawer men saknas i `PICKER_ZONES`). |

### Fas 1D — Nav & copy (utan locked ID-ändring)

| Fil | Ändring |
|-----|---------|
| `navTruth.ts` | Drawer `valv_triage` (`sok`): uppdatera label via `valvNavCopy`. Lägg ev. drawer-rad `valv_granska` → `?valvMode=granska`. |
| `tabRegistry.ts` | Synka `getSamlaVaultTabBarItems` labels efter copy-fix. |
| `inkastService.ts` | `VALV_SAMLA_GRANSKA_LINK` — oförändrad (redan korrekt). |
| `scripts/smoke_locked_ux.mjs` | Assert: ingen `inbox` i `VALV_ZONE_VISIBLE_IDS`; assert `valvMode` synk; assert locked panel-strängar oförändrade. |

### Fas 1E — Export & index

| Fil | Ändring |
|-----|---------|
| `vault/index.ts` | Ev. exportera `parseValvInputMode`, `ValvInputMode` för externa länkar. |
| `.context/locked-ux-features.md` | Lägg § Valv SuperModule (efter produkt-OK) — **inte i detta inventeringssteg**. |

---

## 6. Filer som **inte** får ändras (locked panels)

| Fil | Anledning |
|-----|-----------|
| `VaultMonsterPanel.tsx` | Locked UX §2 |
| `VaultOrkesterPanel.tsx` | Locked UX §2 |
| `VaultKunskapsbankPanel.tsx` | Locked UX §2 |
| `VaultAktorskartaPanel.tsx` | Locked UX §2 |
| `vaultPatternScan.ts` | Locked — smoke |
| `functions/src/index.ts` (`addEntityProfile`) | G9 backend |

---

## 7. Verifiering

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:entities
npm run smoke:orkester
```

**Manuell checklista:**

1. `/valvet?valvMode=granska` → `InboxReviewQueue`, **inte** Hamn analys.
2. Klick "Granskningskö" i Samla → samma kö, URL uppdateras.
3. Drawer → Mönster → `valvMode=analysera`, `VaultMonsterPanel` synlig.
4. Drawer → Orkester → `VaultOrkesterPanel` synlig.
5. `/valvet?valvMode=mer&vaultTab=speglar_fordjupat` → rätt forensic panel; "Visa fler" expanderar.
6. Legacy `/valvet?vaultTab=sok` → Valv-Chat, **inte** inkorg.
7. `npm run smoke:locked-ux` PASS.

---

## 8. Risker & avgränsningar

| Risk | Mitigering |
|------|------------|
| Bryta deep links med gammal `inbox`-zon | Redirect `valvMode=granska` i `ValvetRoutePage` |
| Plausible deniability | Inga nya publika ord; Valv fortfarande PIN-gated |
| Cross-RAG (U1) | Ingen ändring av query-callables i Fas 1 |
| Scope creep | **Ingen** backend/Firestore/rules i detta paket |

---

## 9. Nästa steg (ett i taget)

**Steg 1:** Implementera Fas 1A (URL-synk + label-fix) — löser kvarvarande desynk och `sok`/granska-förvirring.

Prompt för Cursor:

```
Implementera Fas 1A i docs/specs/modules/VALVET_SUPERMODULE_PLAN.md: URL-synk valvMode↔vaultTab i ValvetRoutePage och VaultPage, fixa sok-label i valvNavCopy, verifiera granska-läge. Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och npm run smoke:locked-ux passerar.
```

---

*Inventering genomförd 2026-06-14. Rotorsak inbox→hamn_analys dokumenterad i §3.*
````

## File: src/modules/capture/CaptureSuperModule.tsx
````typescript
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { CapturePanel } from './CapturePanel';
import { HemCaptureModulValjare, type HemCaptureChoice } from './components/HemCaptureModulValjare';
import { hasSeenHemCaptureModulValjare } from './utils/hemCaptureModulValjareStorage';
import { useCaptureOfflineFlush } from './hooks/useCaptureOfflineFlush';
import { InkastDirectPanel } from './InkastDirectPanel';
import { ReviewQueuePipelinePanel } from './ReviewQueuePipelinePanel';
⋮----
export type CaptureSuperVariant =
  | 'hem-capture'
  | 'hem-inkast'
  | 'valv-compact'
  | 'planering'
  | 'kompass'
  | 'mabra'
  | 'familjen'
  | 'ekonomi';
⋮----
export type CaptureSuperModuleProps = {
  variant: CaptureSuperVariant;
  onQueued?: () => void;
  onPersistedBevis?: (docId: string) => void;
  compact?: boolean;
  onSaved?: () => void;
};
⋮----
const handleCaptureSaved = () =>
⋮----
const handleCaptureChoice = (choice: HemCaptureChoice) =>
⋮----
queueHintAsButton=
````

## File: src/modules/core/ui/SupermoduleModeSelect.tsx
````typescript
import type { ReactNode } from 'react';
import { useState } from 'react';
import { clsx } from 'clsx';
⋮----
export type SupermoduleModeOption<T extends string = string> = {
  id: T;
  label: string;
  description?: string;
  icon?: ReactNode;
};
⋮----
export type SupermoduleModeGlow = 'gold' | 'blue' | 'green';
⋮----
type Props<T extends string> = {
  modes: SupermoduleModeOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  moreModes?: SupermoduleModeOption<T>[];
  moreLabel?: string;
  moreDescription?: string;
  ariaLabel?: string;
  layout?: 'segmented' | 'wrap';
  glow?: SupermoduleModeGlow;
  className?: string;
};
⋮----
const renderBtn = (mode: SupermoduleModeOption<T>) =>
⋮----
className=
````

## File: src/modules/features/admin/planning/components/GoraSuperModule.tsx
````typescript
import { PlanningKanbanBoard } from './PlanningKanbanBoard';
import { PlaneringFokusPanel } from './PlaneringFokusPanel';
import { PlaneringFramstegPanel } from './PlaneringFramstegPanel';
⋮----
export type GoraSuperVariant = 'handling' | 'fokus' | 'framsteg';
⋮----
export type GoraSuperModuleProps = {
  variant: GoraSuperVariant;
};
⋮----
export function GoraSuperModule(
````

## File: src/modules/features/admin/planning/components/PlaneringSuperModule.tsx
````typescript
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';
⋮----
export type PlaneringSuperVariant = 'inkorg' | 'capture';
⋮----
export type PlaneringSuperModuleProps = {
  variant: PlaneringSuperVariant;
  onSaved?: () => void;
};
⋮----
export function PlaneringSuperModule(
````

## File: src/modules/features/admin/planning/supermodule/delegates/PlaneringInkastDelegate.tsx
````typescript
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { useStore } from '@/core/store';
⋮----
export type PlaneringInkastDelegateProps = {
  onSaved?: () => void;
};
⋮----
export function PlaneringInkastDelegate(
````

## File: src/modules/features/admin/planning/supermodule/delegates/PlaneringQuickListDelegate.tsx
````typescript
import { PlaneringQuickListPanel } from '../../components/PlaneringQuickListPanel';
import { PlaneringNotePinPanel } from '../../components/PlaneringNotePinPanel';
⋮----
export type PlaneringQuickListDelegateProps = {
  listId?: string;
  mode?: 'list' | 'note';
};
⋮----
export function PlaneringQuickListDelegate({
  listId = 'inkop',
  mode = 'list',
}: PlaneringQuickListDelegateProps)
````

## File: src/modules/features/admin/planning/supermodule/delegates/PlaneringTaskQuickDelegate.tsx
````typescript
import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { usePlanningTasks } from '../../hooks/usePlanningTasks';
import type { PlanningTaskStatus } from '../../types';
⋮----
export type PlaneringTaskQuickDelegateProps = {
  onSaved?: () => void;
};
⋮----
const handleSubmit = async (event: FormEvent) =>
````

## File: src/modules/features/admin/planning/supermodule/index.ts
````typescript

````

## File: src/modules/features/admin/planning/supermodule/planeringInputModes.ts
````typescript
export type PlaneringInputMode = 'task_quick' | 'inkast' | 'quick_list';
⋮----
export type PlaneringInputModeMeta = {
  id: PlaneringInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  writesPlanningTasks: boolean;
  writesLocalStorage: boolean;
  hitlCapture: boolean;
};
⋮----
export function isPlaneringInputMode(value: string | null | undefined): value is PlaneringInputMode
⋮----
export function parsePlaneringInputMode(value: string | null | undefined): PlaneringInputMode
⋮----
export function getPlaneringInputModeMeta(mode: PlaneringInputMode): PlaneringInputModeMeta
````

## File: src/modules/features/admin/planning/supermodule/PlaneringInputSuperModule.tsx
````typescript
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  DEFAULT_PLANERING_INPUT_MODE,
  PLANERING_INPUT_MODES_PRIMARY,
  parsePlaneringInputMode,
  type PlaneringInputMode,
} from './planeringInputModes';
import { PlaneringTaskQuickDelegate } from './delegates/PlaneringTaskQuickDelegate';
import { PlaneringInkastDelegate } from './delegates/PlaneringInkastDelegate';
import { PlaneringQuickListDelegate } from './delegates/PlaneringQuickListDelegate';
⋮----
export type PlaneringInputSuperModuleProps = {
  initialMode?: PlaneringInputMode;
  onSaved?: (mode: PlaneringInputMode) => void;
};
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivFlexDelegate.tsx
````typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { getEconomyProfileExtended } from '@/core/firebase/economyFirestore';
import { useWorkStats } from '@/features/dailyLife/arbetsliv/hooks/useWorkStats';
import { WorkWeekSummary } from '@/features/dailyLife/wellbeing/economy/components/WorkWeekSummary';
⋮----
export function ArbetslivFlexDelegate()
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivInkomstDelegate.tsx
````typescript
import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useStore } from '@/core/store';
import {
  addEconomyLedgerEntry,
  getEconomyLedgerEntries,
} from '@/core/firebase/economyFirestore';
import { formatDateLocal } from '@/shared/utils/dateHelpers';
⋮----
type IncomeCategoryId = (typeof INCOME_CATEGORIES)[number]['id'];
⋮----
const save = async () =>
⋮----
onChange=
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivStamplaDelegate.tsx
````typescript
import { StampClockPage } from '@/features/admin/stampla/components/StampClockPage';
⋮----
export function ArbetslivStamplaDelegate()
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivValvBroDelegate.tsx
````typescript
import { Link } from 'react-router-dom';
import { Shield, Wallet } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
⋮----
function formatNextPaydayLabel(reference = new Date()): string
⋮----
export function ArbetslivValvBroDelegate()
⋮----
to=
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts
````typescript
export type ArbetslivInputMode = 'stampla' | 'inkomster' | 'tid';
⋮----
export type ArbetslivWriteTarget = 'time_entries' | 'economy_ledger' | 'read_only';
⋮----
export type ArbetslivInputModeMeta = {
  id: ArbetslivInputMode;
  label: string;
  description: string;
  tier: 'primary';
  writeTarget: ArbetslivWriteTarget;
  legacyTab: ArbetslivInputMode | 'logg';
};
⋮----
export function isArbetslivInputMode(value: string | null | undefined): value is ArbetslivInputMode
⋮----
export function parseArbetslivInputMode(value: string | null | undefined): ArbetslivInputMode
⋮----
export function getArbetslivInputModeMeta(mode: ArbetslivInputMode): ArbetslivInputModeMeta
⋮----
export function arbetslivTabToInputMode(tab: string | null | undefined): ArbetslivInputMode
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx
````typescript
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { ArbetslivFlexDelegate } from './delegates/ArbetslivFlexDelegate';
import { ArbetslivInkomstDelegate } from './delegates/ArbetslivInkomstDelegate';
import { ArbetslivStamplaDelegate } from './delegates/ArbetslivStamplaDelegate';
import { ArbetslivValvBroDelegate } from './delegates/ArbetslivValvBroDelegate';
import {
  ARBETSLIV_INPUT_MODES_PRIMARY,
  DEFAULT_ARBETSLIV_INPUT_MODE,
  parseArbetslivInputMode,
  type ArbetslivInputMode,
} from './arbetslivInputModes';
⋮----
export type ArbetslivInputSuperModuleProps = {
  initialMode?: ArbetslivInputMode;
};
⋮----
function ArbetslivInputModeDelegate(
````

## File: src/modules/features/dailyLife/arbetsliv/supermodule/index.ts
````typescript

````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiInkastDelegate.tsx
````typescript
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
⋮----
export type EkonomiInkastDelegateProps = {
  userId: string;
};
⋮----
export function EkonomiInkastDelegate(
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiLoggDelegate.tsx
````typescript
import { EconomyLogPanel } from '@/features/dailyLife/wellbeing/economy/components/EconomyLogPanel';
⋮----
export type EkonomiLoggDelegateProps = {
  onChanged?: () => void;
};
⋮----
export function EkonomiLoggDelegate(
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiMatprepDelegate.tsx
````typescript
import { Check, CheckCircle2, Loader2, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useEconomyMatprepRead } from '../hooks/useEconomyMatprepRead';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';
⋮----
export type EkonomiMatprepDelegateProps = {
  userId: string;
};
⋮----
function parseAmountSek(raw: string): number | null
⋮----
className=
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiMikrostegDelegate.tsx
````typescript
import { CircleDot } from 'lucide-react';
⋮----
export type EkonomiMikrostegDelegateProps = {
  userId: string;
};
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiProfilDelegate.tsx
````typescript
import { Check, Loader2 } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';
import { useEconomyProfilWrite } from '../hooks/useEconomyProfilWrite';
⋮----
export type EkonomiProfilDelegateProps = {
  userId: string;
};
⋮----
const handleSubmit = async (event: FormEvent<HTMLFormElement>) =>
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiSaldoDelegate.tsx
````typescript
import { Check, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { MetricTile } from '@/core/ui/MetricTile';
import { SaldoHero } from '@/core/ui/SaldoHero';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useEconomySaldoRead } from '../hooks/useEconomySaldoRead';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';
⋮----
export type EkonomiSaldoDelegateProps = {
  userId: string;
};
⋮----
function parseAmountSek(raw: string): number | null
⋮----
export function EkonomiSaldoDelegate(
⋮----
<form onSubmit=
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/hooks/useEconomyImpulsWrite.ts
````typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  deleteEconomyImpulse,
  getEconomyImpulseQueue,
  parkEconomyImpulse,
  resolveEconomyImpulse,
} from '@/core/firebase/economyFirestore';
import {
  isBrowserOffline,
  OfflineWriteBlockedError,
} from '@/core/firebase/offlineWritePolicy';
import type { EconomyImpulseRow } from '@/core/types/firestore';
⋮----
function resolveSaveError(err: unknown): string
⋮----
export function useEconomyImpulsWrite(userId: string | undefined)
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/hooks/useEconomyKuvertWrite.ts
````typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  deleteBudgetEnvelope,
  getBudgetEnvelopes,
  setBudgetEnvelope,
} from '@/core/firebase/economyFirestore';
import {
  isBrowserOffline,
  OfflineWriteBlockedError,
} from '@/core/firebase/offlineWritePolicy';
import type { BudgetEnvelopeRow } from '@/core/types/firestore';
⋮----
function resolveSaveError(err: unknown): string
⋮----
export function useEconomyKuvertWrite(userId: string | undefined)
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/hooks/useEconomyMatprepRead.ts
````typescript
import { useCallback, useEffect, useState } from 'react';
import {
  getEconomyMealPrep,
  setEconomyMealPrep,
} from '@/core/firebase/economyFirestore';
import type { EconomyMealPrepItem } from '@/core/types/firestore';
⋮----
export function useEconomyMatprepRead(userId: string | undefined)
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/hooks/useEconomyProfilWrite.ts
````typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { getEconomyProfile, setEconomyProfile } from '@/core/firebase/firestore';
import {
  isBrowserOffline,
  OfflineWriteBlockedError,
} from '@/core/firebase/offlineWritePolicy';
⋮----
function resolveSaveError(err: unknown): string
⋮----
function parseProfileAmount(raw: string, fallback: number): number
⋮----
export function useEconomyProfilWrite(userId: string | undefined)
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/hooks/useEconomySaldoRead.ts
````typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getEconomyProfile,
  getEconomyTransactions,
} from '@/core/firebase/firestore';
import {
  weeklyBudgetLeft,
  weeklyProgressPercent,
  weeklySpentSek,
} from '@/features/dailyLife/wellbeing/economy/rules/budgetTemplates';
⋮----
export type EconomySaldoTransactionRow = {
  id: string;
  label: string;
  amountSek: number;
  category: string;
  createdAt: string;
};
⋮----
export function useEconomySaldoRead(userId: string | undefined)
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/hooks/useEconomyTransactionWORM.ts
````typescript
import { useCallback, useEffect, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { saveEconomyTransaction } from '@/core/firebase/firestore';
import {
  isBrowserOffline,
  OfflineWriteBlockedError,
} from '@/core/firebase/offlineWritePolicy';
⋮----
export type EconomyTransactionCategory = 'veckopeng' | 'matlada' | 'vinst' | 'ovrigt';
⋮----
export type SaveEconomyTransactionInput = {
  label: string;
  amountSek: number;
  category: EconomyTransactionCategory;
};
⋮----
function resolveSaveError(err: unknown): string
⋮----
export function useEconomyTransactionWORM(
  userId: string | undefined,
  onSaved?: () => void | Promise<void>,
)
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/capacityResolver.ts
````typescript
import type { EkonomiInputMode } from './ekonomiInputModes';
⋮----
export type EconomyCapacityLevel = 'critical' | 1 | 2 | 3;
⋮----
export function getAllowedModesForLevel(level: EconomyCapacityLevel): EkonomiInputMode[]
⋮----
export function pickFallbackMode(allowedModes: EkonomiInputMode[]): EkonomiInputMode
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/ekonomiInputModes.ts
````typescript
import type { EconomyCapacityLevel } from './capacityResolver';
⋮----
export type EkonomiInputMode =
  | 'saldo'
  | 'mikrosteg'
  | 'profil'
  | 'matprep'
  | 'kuvert'
  | 'spar'
  | 'impuls'
  | 'inkast'
  | 'logg';
⋮----
export type EkonomiInputModeMeta = {
  id: EkonomiInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  minCapacityLevel: EconomyCapacityLevel;
  writesTransactions: boolean;
  writesMutable: boolean;
  navigationOnly: boolean;
};
⋮----
export function isEkonomiInputMode(value: string | null | undefined): value is EkonomiInputMode
⋮----
export function parseEkonomiInputMode(value: string | null | undefined): EkonomiInputMode
⋮----
export function getEkonomiInputModeMeta(mode: EkonomiInputMode): EkonomiInputModeMeta
⋮----
export function filterModesByAllowed(
  allowed: EkonomiInputMode[],
):
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/EkonomiInputSuperModule.tsx
````typescript
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EconomyCapacityLockedNotice } from '@/features/economy/components/EconomyCapacityLockedNotice';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import {
  getAllowedModesForLevel,
  pickFallbackMode,
} from './capacityResolver';
import { EkonomiImpulsDelegate } from './delegates/EkonomiImpulsDelegate';
import { EkonomiInkastDelegate } from './delegates/EkonomiInkastDelegate';
import { EkonomiKuvertDelegate } from './delegates/EkonomiKuvertDelegate';
import { EkonomiLoggDelegate } from './delegates/EkonomiLoggDelegate';
import { EkonomiMatprepDelegate } from './delegates/EkonomiMatprepDelegate';
import { EkonomiMikrostegDelegate } from './delegates/EkonomiMikrostegDelegate';
import { EkonomiProfilDelegate } from './delegates/EkonomiProfilDelegate';
import { EkonomiSaldoDelegate } from './delegates/EkonomiSaldoDelegate';
import { EkonomiSparDelegate } from './delegates/EkonomiSparDelegate';
import {
  DEFAULT_EKONOMI_INPUT_MODE,
  filterModesByAllowed,
  getEkonomiInputModeMeta,
  parseEkonomiInputMode,
  type EkonomiInputMode,
} from './ekonomiInputModes';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
⋮----
export type EkonomiInputSuperModuleProps = {
  userId: string;
};
⋮----
function EkonomiModePlaceholder(
⋮----
function EkonomiInputModeDelegate({
  mode,
  userId,
}: {
  mode: EkonomiInputMode;
  userId: string;
})
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/index.ts
````typescript

````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/index.ts
````typescript

````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraDagbokBridgePanel.tsx
````typescript
import { useMabraStore } from '../store/mabraStore';
import { useDiaryStore } from '@/features/lifeJournal/diary/diary/store/diaryStore';
import { DagbokSuperModule } from '@/features/lifeJournal/diary/diary/components/DagbokSuperModule';
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraExerciseNotePanel.tsx
````typescript
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MabraProjectId } from '../constants/mabraProjects';
import { MabraExplicitSavePanel } from './MabraExplicitSavePanel';
import { composeExerciseNoteText, type MabraExplicitSaveSource } from './mabraExplicitSave';
import {
  clearPendingExerciseNote,
  readPendingExerciseNote,
} from './mabraExerciseNoteStorage';
⋮----
type Props = {
  userId: string | undefined;
  vitProjectId: MabraProjectId;
  onSwitchToDagbokBridge?: () => void;
};
⋮----
export function MabraExerciseNotePanel({
  userId,
  vitProjectId,
  onSwitchToDagbokBridge,
}: Props)
⋮----
const handlePersisted = () =>
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/mabraExerciseNoteStorage.ts
````typescript
import type { MabraExerciseType, MabraSymptomHub } from '../types';
⋮----
export type MabraPendingExerciseNote = {
  exerciseType: MabraExerciseType;
  hubSymptom?: MabraSymptomHub;
  answers: Record<string, string>;
  capturedAtIso: string;
};
⋮----
function isPendingExerciseNote(value: unknown): value is MabraPendingExerciseNote
⋮----
export function readPendingExerciseNote(): MabraPendingExerciseNote | null
⋮----
export function writePendingExerciseNote(note: MabraPendingExerciseNote): void
⋮----
export function clearPendingExerciseNote(): void
⋮----
export function hasPendingExerciseNote(): boolean
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/mabraExplicitSave.ts
````typescript
import { REFRAMING_STEPS } from '../constants';
import type { MabraPendingExerciseNote } from './mabraExerciseNoteStorage';
⋮----
export type MabraExplicitSaveSource = {
  bankId: string;
  promptText: string;
  responseText: string;
  lens?: string;
};
⋮----
export function localDateKey(date = new Date()): string
⋮----
export function composeReflectionEntryText(promptText: string, responseText: string): string
⋮----
export function composeExerciseNoteText(note: MabraPendingExerciseNote): string
⋮----
export function toExplicitSaveSource(
  bankId: string,
  promptText: string,
  responseText: string,
  lens?: string,
): MabraExplicitSaveSource | null
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraExplicitSavePanel.tsx
````typescript
import { useState } from 'react';
import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import { useNavigate } from 'react-router-dom';
import { ensureVitHub, saveVitEntry } from '@/core/firebase/vitHubFirestore';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { useDiaryStore } from '@/features/lifeJournal/diary/diary/store/diaryStore';
import { mabraDagbokBridgeUrl } from '../constants';
import type { MabraProjectId } from '../constants/mabraProjects';
import type { MabraSymptomHub } from '../types';
import { localDateKey, type MabraExplicitSaveSource } from './mabraExplicitSave';
⋮----
type Props = {
  source: MabraExplicitSaveSource | null;
  userId: string | undefined;
  vitProjectId: MabraProjectId;
  hubSymptom?: MabraSymptomHub | null;
  onVitSaved?: () => void;
  onDagbokBridged?: () => void;
  onSwitchToDagbokBridge?: () => void;
};
⋮----
const handleSaveToVit = async () =>
⋮----
const handleBridgeToDagbok = () =>
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/mabraInputModes.ts
````typescript
import type { MabraProjectId } from '../constants/mabraProjects';
⋮----
export type MabraInputMode =
  | 'checkin'
  | 'vit_card'
  | 'vit_chat'
  | 'vit_memory'
  | 'emotional_memory'
  | 'reflection_tool'
  | 'exercise_note'
  | 'dagbok_bridge'
  | 'inkast';
⋮----
export type MabraInputModeMeta = {
  id: MabraInputMode;
  label: string;
  description: string;
  requiresProjectId?: boolean;
  defaultProjectId?: MabraProjectId;
};
⋮----
export function isMabraInputMode(value: string | null | undefined): value is MabraInputMode
⋮----
export function parseMabraInputMode(value: string | null | undefined): MabraInputMode
⋮----
export function shouldUseEmotionalMemoryDelegate(
  mode: MabraInputMode,
  projectId: MabraProjectId | undefined,
): boolean
⋮----
export function resolveProjectIdForMode(
  mode: MabraInputMode,
  projectId?: MabraProjectId,
): MabraProjectId | undefined
⋮----
export function getMabraInputModeMeta(mode: MabraInputMode): MabraInputModeMeta
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraInputSuperModule.tsx
````typescript
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { useStore } from '@/core/store';
import { MabraCheckinModal } from '@/components/mabra/MabraCheckinModal';
import { EmotionalMemoryView } from '../components/EmotionalMemoryView';
import { VitCardFlowPanel } from '../components/VitCardFlowPanel';
import { VitChatFlowPanel } from '../components/VitChatFlowPanel';
import { VitMemoryFlowPanel } from '../components/VitMemoryFlowPanel';
import { MABRA_PROJECTS, type MabraProjectId } from '../constants/mabraProjects';
import { MabraDagbokBridgePanel } from './MabraDagbokBridgePanel';
import { MabraExerciseNotePanel } from './MabraExerciseNotePanel';
import { MabraReflectionSuperhubPanel } from './MabraReflectionSuperhubPanel';
import {
  DEFAULT_MABRA_INPUT_MODE,
  MABRA_INPUT_MODES_FAS6D,
  MABRA_INPUT_MODES_MORE,
  MABRA_INPUT_MODES_MORE_ALL,
  MABRA_INPUT_MODES_PRIMARY,
  parseMabraInputMode,
  resolveProjectIdForMode,
  shouldUseEmotionalMemoryDelegate,
  type MabraInputMode,
} from './mabraInputModes';
⋮----
export type MabraInputSuperModuleProps = {
  projectId?: MabraProjectId;
};
⋮----
function parseProjectId(value: string | null): MabraProjectId | undefined
⋮----
onSwitchToDagbokBridge=
⋮----
return <MabraCheckinModal isOpen=
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/MabraReflectionSuperhubPanel.tsx
````typescript
import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DROGFRIHET_CARDS } from '@/features/dailyLife/drogfrihet/content/drogfrihetCatalog';
import { MABRA_REFLECTION_CARDS } from '../content/mabraReflectionCards';
import type { MabraProjectId } from '../constants/mabraProjects';
import { MabraExplicitSavePanel } from './MabraExplicitSavePanel';
import { toExplicitSaveSource } from './mabraExplicitSave';
import {
  clearReflectionDeckAnswer,
  readReflectionDeckAnswers,
  writeReflectionDeckAnswers,
} from './reflectionDeckStorage';
⋮----
type Props = {
  userId: string | undefined;
  vitProjectId: MabraProjectId;
  initialBankId?: string;
  onSwitchToDagbokBridge?: () => void;
};
⋮----
function indexForBankId(bankId: string): number
⋮----
export function MabraReflectionSuperhubPanel({
  userId,
  vitProjectId,
  initialBankId,
  onSwitchToDagbokBridge,
}: Props)
⋮----
const prev = ()
const next = ()
⋮----
onChange=
````

## File: src/modules/features/dailyLife/wellbeing/mabra/supermodule/reflectionDeckStorage.ts
````typescript
export function readReflectionDeckAnswers(): Record<string, string>
⋮----
export function writeReflectionDeckAnswers(answers: Record<string, string>): void
⋮----
export function clearReflectionDeckAnswer(bankId: string): void
````

## File: src/modules/features/diary/components/supermodule/components/ContentWorkspace.tsx
````typescript
import React from 'react';
import type { Entry, JournalEntry, VaultEntry } from '../types';
import { JournalView } from './JournalView';
import { VaultView } from './VaultView';
import { InsightsView } from './InsightsView';
⋮----
interface ContentWorkspaceProps {
  entry: Entry | null;
  activeTab?: 'journal' | 'vault' | 'insights';
  data?: Entry[];
}
⋮----
export const ContentWorkspace: React.FC<ContentWorkspaceProps> = (
````

## File: src/modules/features/diary/components/supermodule/components/InsightsView.tsx
````typescript
import { useState } from 'react';
import type { Entry } from '../types';
⋮----
export const InsightsView = (
⋮----
const handleAnalyze = () =>
⋮----
onClick=
````

## File: src/modules/features/diary/components/supermodule/components/JournalTimeline.tsx
````typescript
import React from 'react';
import type { Entry } from '../types';
⋮----
interface JournalTimelineProps {
  data: Entry[];
  loading: boolean;
  filter: 'journal' | 'vault' | 'insights';
  onSelect: (entry: Entry) => void;
  activeEntryId?: string;
}
````

## File: src/modules/features/diary/components/supermodule/components/JournalView.tsx
````typescript
import type { JournalEntry } from '../types';
````

## File: src/modules/features/diary/components/supermodule/components/SmartToolbar.tsx
````typescript
import React from 'react';
⋮----
interface SmartToolbarProps {
  activeTab: 'journal' | 'vault' | 'insights';
  setActiveTab: (tab: 'journal' | 'vault' | 'insights') => void;
}
⋮----
export const SmartToolbar: React.FC<SmartToolbarProps> = (
````

## File: src/modules/features/diary/components/supermodule/components/VaultView.tsx
````typescript
import type { VaultEntry } from '../types';
````

## File: src/modules/features/diary/components/supermodule/types.ts
````typescript
export type EntryType = 'journal' | 'vault';
⋮----
export interface BaseEntry {
  id: string;
  type: EntryType;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  } | number | string;
  ownerId?: string;
}
⋮----
export interface JournalEntry extends BaseEntry {
  type: 'journal';
  mood?: string;
  action?: string;
  text?: string;
  tags?: string[];
}
⋮----
export interface VaultEntry extends BaseEntry {
  type: 'vault';
  action?: string;
  isAnchor?: boolean;
  isPinned?: boolean;
  pinned?: boolean;
  truth?: string;
  theirVersion?: string;
  shieldBoundary?: string;
  shieldFeeling?: string;
}
⋮----
export type Entry = JournalEntry | VaultEntry;
````

## File: src/modules/features/family/children/supermodule/delegates/familjenDelegateTypes.ts
````typescript
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
⋮----
export type FamiljenDelegateBaseProps = {
  shell: FamiljenShell;
  onSaved?: (logId?: string) => void;
};
````

## File: src/modules/features/family/children/supermodule/delegates/FamiljenFysiologiDelegate.tsx
````typescript
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SIGNAL_LABELS } from '../../constants';
import type { SignalScale } from '../../types';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
⋮----
function SignalRow({
  label,
  value,
  onSelect,
  invertHint,
}: {
  label: string;
  value: SignalScale;
onSelect: (v: SignalScale)
⋮----
export function FamiljenFysiologiDelegate(
⋮----
const handleSave = async () =>
````

## File: src/modules/features/family/children/supermodule/delegates/FamiljenInkastDelegate.tsx
````typescript
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
⋮----
export function FamiljenInkastDelegate(
````

## File: src/modules/features/family/children/supermodule/delegates/FamiljenLivsloggStundDelegate.tsx
````typescript
import { useState, useEffect } from 'react';
import { Plus, Loader2, Check, Heart } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type LivsloggCategory } from '../../constants';
import { STUND_MAX_CHARS, resolveStundCategory } from '../../utils/childMomentHelpers';
⋮----
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
⋮----
const resetForm = () =>
⋮----
const handleSave = async () =>
````

## File: src/modules/features/family/children/supermodule/delegates/FamiljenVardagsstrukturDelegate.tsx
````typescript
import { useState } from 'react';
import { Shield, Plus, Check, Loader2 } from 'lucide-react';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
⋮----
type Rule = {
  id: string;
  text: string;
  category: 'trygghet' | 'granser' | 'rutin';
};
⋮----
const handleAddRule = (e: React.FormEvent) =>
⋮----
const handleSaveObservation = async () =>
⋮----
// Auto-dismiss success message
````

## File: src/modules/features/family/children/supermodule/FamiljenInputModePicker.tsx
````typescript
import { ChevronDown } from 'lucide-react';
import {
  FAMILJEN_INPUT_MODES,
  FAMILJEN_INPUT_MODES_MORE,
  FAMILJEN_INPUT_MODES_PRIMARY,
  getFamiljenInputModeMeta,
  type FamiljenInputMode,
} from './familjenInputModes';
⋮----
export type FamiljenInputModePickerProps = {
  activeMode: FamiljenInputMode;
  onChange: (mode: FamiljenInputMode) => void;
};
````

## File: src/modules/features/family/children/supermodule/familjenInputModes.ts
````typescript
export type FamiljenInputMode =
  | 'barnfokus'
  | 'livslogg_stund'
  | 'fysiologi'
  | 'livslogg_observation'
  | 'vardagsstruktur'
  | 'inkast';
⋮----
export type FamiljenInputModeMeta = {
  id: FamiljenInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  writesChildrenLogs: boolean;
  offersVaultHitl: boolean;
  contentClass: 'PLAY' | 'EVIDENCE' | null;
};
⋮----
export function isFamiljenInputMode(value: string | null | undefined): value is FamiljenInputMode
⋮----
export function parseFamiljenInputMode(value: string | null | undefined): FamiljenInputMode
⋮----
export function getFamiljenInputModeMeta(mode: FamiljenInputMode): FamiljenInputModeMeta
````

## File: src/modules/features/family/children/supermodule/FamiljenInputSuperModule.tsx
````typescript
import { useCallback, useMemo, lazy, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { clsx } from 'clsx';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  DEFAULT_FAMILJEN_INPUT_MODE,
  getFamiljenInputModeMeta,
  parseFamiljenInputMode,
  type FamiljenInputMode,
} from './familjenInputModes';
import { FamiljenInputModePicker } from './FamiljenInputModePicker';
import type { FamiljenShell } from '../hooks/useFamiljenShell';
⋮----
function FamiljenDelegateFallback()
⋮----
export type FamiljenInputSuperModuleProps = {
  shell: FamiljenShell;
  initialMode?: FamiljenInputMode;
  onSaved?: (mode: FamiljenInputMode, logId?: string) => void;
  flowWithIsland?: boolean;
};
⋮----
export function FamiljenInputSuperModule({
  shell,
  initialMode,
  onSaved,
  flowWithIsland = false,
}: FamiljenInputSuperModuleProps)
⋮----
className=
⋮----
type DelegateProps = {
  mode: FamiljenInputMode;
  shell: FamiljenShell;
  onSaved?: (logId?: string) => void;
};
⋮----
function FamiljenInputModeDelegate(
````

## File: src/modules/features/family/children/supermodule/index.ts
````typescript

````

## File: src/modules/features/lifeJournal/diary/diary/components/DagbokSuperModule.tsx
````typescript
import { useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import { getJournalEntries } from '@/core/firebase/firestore';
import { DagbokPage } from './DagbokPage';
import { JournalArchiveReadonly } from './JournalArchiveReadonly';
import type { MabraBridgeHub } from '../constants/mabraBridge';
import type { JournalEntry } from '../types/journal';
⋮----
export type DagbokSuperVariant = 'reflektion' | 'forensic-readonly' | 'mabra-bridge';
⋮----
export type DagbokSuperModuleProps = {
  variant: DagbokSuperVariant;
  mabraBridgeHub?: MabraBridgeHub | null;
};
⋮----
export function DagbokSuperModule(
````

## File: src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokQuickMirrorDelegate.tsx
````typescript
import { useStore } from '@/core/store';
import { JournalQuickMode } from '@/features/lifeJournal/diary/diary/components/JournalQuickMode';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
⋮----
export type DagbokQuickMirrorDelegateProps = {
  onSaved?: () => void;
};
⋮----
export function DagbokQuickMirrorDelegate(
⋮----
const handleSave = async (
    quickText: string,
    options?: { alsoToArkiv?: boolean },
) =>
````

## File: src/modules/features/lifeJournal/diary/supermodule/DagbokInputModePicker.tsx
````typescript
import {
  DAGBOK_INPUT_MODES_PRIMARY,
  getDagbokInputModeMeta,
  type DagbokInputMode,
} from './dagbokInputModes';
⋮----
export type DagbokInputModePickerProps = {
  activeMode: DagbokInputMode;
  onChange: (mode: DagbokInputMode) => void;
  hiddenModes?: DagbokInputMode[];
};
⋮----
export function DagbokInputModePicker({
  activeMode,
  onChange,
  hiddenModes,
}: DagbokInputModePickerProps)
⋮----
export function activeDagbokModeLabel(mode: DagbokInputMode): string
````

## File: src/modules/features/lifeJournal/diary/supermodule/dagbokInputModes.ts
````typescript
export type DagbokInputMode = 'reflektion' | 'quick_mirror' | 'arkiv';
⋮----
export type DagbokWriteTarget = 'journal_worm' | 'read_only';
⋮----
export type DagbokInputModeMeta = {
  id: DagbokInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  writeTarget: DagbokWriteTarget;
  legacyDagbokMode: 'reflektera' | 'snabb' | 'arkiv';
  usesQuickMirror: boolean;
};
⋮----
export function isDagbokInputMode(value: string | null | undefined): value is DagbokInputMode
⋮----
export function parseDagbokInputMode(value: string | null | undefined): DagbokInputMode
⋮----
export function getDagbokInputModeMeta(mode: DagbokInputMode): DagbokInputModeMeta
⋮----
export function dagbokLegacyModeToInputMode(mode: string | null | undefined): DagbokInputMode
````

## File: src/modules/features/lifeJournal/diary/supermodule/DagbokInputSuperModule.tsx
````typescript
import { useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ChameleonInputShell } from '@/core/ui/ChameleonInputShell';
import { useCapacityScore } from '@/core/store/useCapacityGate';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { isLowHomeCapacity } from '@/core/home/homeCapacityGate';
import { DagbokRememberCard } from '@/features/lifeJournal/diary/diary/components/DagbokRememberCard';
import { DagbokQuickMirrorDelegate } from './delegates/DagbokQuickMirrorDelegate';
import {
  DagbokArkivDelegate,
  DagbokReflektionDelegate,
} from './delegates/DagbokReflektionDelegate';
import {
  DEFAULT_DAGBOK_INPUT_MODE,
  getDagbokInputModeMeta,
  parseDagbokInputMode,
  type DagbokInputMode,
} from './dagbokInputModes';
import { DagbokInputModePicker } from './DagbokInputModePicker';
⋮----
export type DagbokInputSuperModuleProps = {
  initialMode?: DagbokInputMode;
  onSaved?: (mode: DagbokInputMode) => void;
};
⋮----
type DelegateProps = {
  mode: DagbokInputMode;
  onSaved?: () => void;
};
⋮----
function DagbokInputModeDelegate(
````

## File: src/modules/features/lifeJournal/diary/supermodule/index.ts
````typescript

````

## File: src/modules/features/lifeJournal/evidence/vault/supermodule/ValvInputModePicker.tsx
````typescript
import { ChevronDown } from 'lucide-react';
import {
  VALV_INPUT_MODES_MORE,
  VALV_INPUT_MODES_PRIMARY,
  valvInputModeDef,
  type ValvInputMode,
} from './valvInputModes';
⋮----
export type ValvInputModePickerProps = {
  activeMode: ValvInputMode;
  onChange: (mode: ValvInputMode) => void;
};
````

## File: src/modules/features/lifeJournal/evidence/vault/supermodule/valvInputModes.ts
````typescript
import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import {
  KUNSKAP_VAULT_TAB,
  LEGACY_INBOX_VAULT_TAB,
  VIT_VAULT_TAB,
  parseVaultTab,
  resolveValvZone,
  type ValvZone,
  type VaultTab,
} from '../utils/vaultTabs';
⋮----
export type ValvInputMode = (typeof VALV_INPUT_MODE_IDS)[number];
⋮----
export type ValvInputModeDef = {
  id: ValvInputMode;
  label: string;
  description: string;
  tier: 'primary' | 'more';
  zone: ValvZone;
  defaultVaultTab: VaultTab;
};
⋮----
export function valvInputModeDef(mode: ValvInputMode): ValvInputModeDef
⋮----
export function parseValvInputMode(raw: string | null): ValvInputMode
⋮----
export function parseValvInputModeFromSearch(
  valvMode: string | null,
  samlaView: string | null,
  vaultTabRaw?: string | null,
): ValvInputMode
⋮----
export function resolveValvInputModeFromVaultTab(tab: VaultTab): ValvInputMode
⋮----
export function valvModeMatchesVaultTab(mode: ValvInputMode, tab: VaultTab): boolean
⋮----
export function vaultTabForValvInputMode(mode: ValvInputMode, currentTab?: VaultTab): VaultTab
⋮----
export function canonicalValvRoute(
  vaultTab: VaultTab,
  valvMode?: ValvInputMode | null,
):
⋮----
export function buildValvSearchParams(
  vaultTab: VaultTab,
  valvMode?: ValvInputMode | null,
): URLSearchParams
````

## File: src/modules/features/lifeJournal/evidence/vault/supermodule/valvLastModeStorage.ts
````typescript
import type { ValvInputMode } from './valvInputModes';
⋮----
export function readValvLastInputMode(): ValvInputMode | null
⋮----
export function writeValvLastInputMode(mode: ValvInputMode): void
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiImpulsDelegate.tsx
````typescript
import { AlertTriangle, Check, Clock, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EKONOMI_IMPULS_LEAD } from '@/modules/features/dailyLife/wellbeing/economy/ekonomiCopy';
import { useEconomyImpulsWrite } from '../hooks/useEconomyImpulsWrite';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';
⋮----
export type EkonomiImpulsDelegateProps = {
  userId: string;
};
⋮----
function parseAmountSek(raw: string): number | null
⋮----
function isImpulseReady(remindAt: string, nowMs: number): boolean
⋮----
setDraft(event.target.value);
clearErrors();
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiKuvertDelegate.tsx
````typescript
import { Check, Loader2, Wallet } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EconomyEnvelopeSection } from '../../components/EconomyEnvelopeSection';
import { useEconomyKuvertWrite } from '../hooks/useEconomyKuvertWrite';
import { useEconomyTransactionWORM } from '../hooks/useEconomyTransactionWORM';
⋮----
export type EkonomiKuvertDelegateProps = {
  userId: string;
};
⋮----
function parseAmountSek(raw: string): number | null
⋮----
function buildKuvertExpenseLabel(envelopeTitle: string, optionalLabel: string): string
````

## File: src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiSparDelegate.tsx
````typescript
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EconomySavingsPanel } from '../../components/EconomySavingsPanel';
⋮----
export type EkonomiSparDelegateProps = {
  userId: string;
};
⋮----
export function EkonomiSparDelegate(
````

## File: src/modules/features/family/children/supermodule/delegates/FamiljenBarnfokusDelegate.tsx
````typescript
import { useState } from 'react';
import { Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import {
  barnfokusQuestionsForBracket,
  BARNFOKUS_KIND_LABELS,
  type BarnfokusQuestion,
  type BarnfokusBracket,
} from '../../constants';
import {
  type EpistemicKind,
} from '../../utils/childObservationEpistemics';
import { barnfokusDisplayText, formatChildLogDate } from '../../utils/logFieldUtils';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
⋮----
function pickQuestion(
  pool: BarnfokusQuestion[],
  seed: number,
  excludeId?: string,
): BarnfokusQuestion
⋮----
function daySeed(childAlias: string): number
⋮----
const handleSave = async () =>
⋮----
const anotherQuestion = () =>
````

## File: src/modules/features/family/children/supermodule/delegates/FamiljenLivsloggObservationDelegate.tsx
````typescript
import { useState, useEffect } from 'react';
import { Plus, Loader2, Check } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type LivsloggCategory } from '../../constants';
import { SaveAsEvidencePrompt } from '../../components/SaveAsEvidencePrompt';
import type { EpistemicKind } from '../../utils/childObservationEpistemics';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';
⋮----
const resetForm = () =>
⋮----
const handleSave = async () =>
````

## File: src/modules/features/lifeJournal/diary/mirror/components/SpeglarSuperModule.tsx
````typescript
import { useStore } from '@/core/store';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { SpeglingsForensicPanel, SpeglingsSystem } from './SpeglingsSystem';
⋮----
export type SpeglarSuperVariant = 'dagbok' | 'forensic';
⋮----
export type SpeglarSuperModuleProps = {
  variant: SpeglarSuperVariant;
  initialFeeling?: string;
};
⋮----
export function SpeglarSuperModule({
  variant,
  initialFeeling = '',
}: SpeglarSuperModuleProps)
````

## File: src/modules/features/lifeJournal/diary/supermodule/delegates/DagbokReflektionDelegate.tsx
````typescript
import { useEffect } from 'react';
import { useStore } from '@/core/store';
import { hasVaultGate } from '@/core/auth/sessionService';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { JournalArchiveReadonly } from '@/features/lifeJournal/diary/diary/components/JournalArchiveReadonly';
import { ConfirmStep } from '@/features/lifeJournal/diary/diary/components/ConfirmStep';
import { DagbokWizardErrorBoundary } from '@/features/lifeJournal/diary/diary/components/DagbokWizardErrorBoundary';
import { MoodStep } from '@/features/lifeJournal/diary/diary/components/MoodStep';
import { ReflectionStep } from '@/features/lifeJournal/diary/diary/components/ReflectionStep';
import { SavedStep } from '@/features/lifeJournal/diary/diary/components/SavedStep';
import { JOURNAL_CATEGORIES } from '@/features/lifeJournal/diary/diary/constants/journalCategories';
import { JOURNAL_STEPS } from '@/features/lifeJournal/diary/diary/constants/moods';
import { useJournalFlow } from '@/features/lifeJournal/diary/diary/hooks/useJournalFlow';
⋮----
export type DagbokReflektionDelegateProps = {
  onSaved?: () => void;
};
⋮----
resetFlow();
⋮----
onContinue=
````

## File: src/modules/features/lifeJournal/evidence/vault/components/ValvSuperModule.tsx
````typescript
import { ValvAnalyseraZone } from './zones/ValvAnalyseraZone';
import { ValvExporteraZone } from './zones/ValvExporteraZone';
import { ValvForensikZone } from './zones/ValvForensikZone';
import { ValvKunskapZone } from './zones/ValvKunskapZone';
import { ValvSamlaZone } from './zones/ValvSamlaZone';
import { ValvVitZone } from './zones/ValvVitZone';
import {
  KUNSKAP_VAULT_TAB,
  type AnalyseraVaultTab,
  type ForensicVaultTab,
  type KunskapVaultTab,
  type SamlaVaultTab,
  type ValvZone,
  type VaultTab,
  isAnalyseraVaultTab,
  isForensicVaultTab,
  isKunskapVaultTab,
  isSamlaVaultTab,
} from '../utils/vaultTabs';
⋮----
export type ValvSuperVariant = ValvZone;
⋮----
export type ValvSuperModuleProps = {
  variant: ValvSuperVariant;
  vaultTab: VaultTab;
  userId: string;
  gateOk: boolean;
  highlightLogId: string | null;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onVaultTabChange: (tab: VaultTab) => void;
  onOpenGranska?: () => void;
  techniqueFilter?: string | null;
  onTechniqueSelect?: (technique: string) => void;
  onClearTechniqueFilter?: () => void;
};
⋮----
export function ValvSuperModule({
  variant,
  vaultTab,
  userId,
  gateOk,
  highlightLogId,
  onBevisConfirmed,
  onCitationClick,
  onVaultTabChange,
  onOpenGranska,
  techniqueFilter,
  onTechniqueSelect,
  onClearTechniqueFilter,
}: ValvSuperModuleProps)
⋮----
const tab: ForensicVaultTab = isForensicVaultTab(vaultTab) ? vaultTab : 'hamn_analys';
````

## File: src/modules/features/lifeJournal/evidence/vault/supermodule/ValvInputSuperModule.tsx
````typescript
import { useCallback } from 'react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
⋮----
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { ValvSuperModule } from '../components/ValvSuperModule';
import { ValvInputModePicker } from './ValvInputModePicker';
import {
  DEFAULT_VALV_INPUT_MODE,
  valvInputModeDef,
  type ValvInputMode,
} from './valvInputModes';
import { writeValvLastInputMode } from './valvLastModeStorage';
import type { VaultTab } from '../utils/vaultTabs';
⋮----
export type ValvInputSuperModuleProps = {
  activeMode: ValvInputMode;
  onModeChange: (mode: ValvInputMode) => void;
  vaultTab: VaultTab;
  userId: string;
  gateOk: boolean;
  highlightLogId: string | null;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onVaultTabChange: (tab: VaultTab) => void;
  techniqueFilter?: string | null;
  onTechniqueSelect?: (technique: string) => void;
  onClearTechniqueFilter?: () => void;
};
⋮----
void onBevisConfirmed(docId);
setMode(DEFAULT_VALV_INPUT_MODE);
⋮----
onBack=
````
