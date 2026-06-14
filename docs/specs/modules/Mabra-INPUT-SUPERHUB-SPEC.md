# MåBra — Universal Input Superhub (SPEC)

**Datum:** 2026-06-14  
**Status:** **Godkänd för implementation (Fas 6A→E)** — teknikledare (Pontus) 2026-06-14  
**Kanon:** [`.context/system-plan.md`](../../../.context/system-plan.md) § Fas 6 · [`Mabra-SPEC.md`](./Mabra-SPEC.md) · [`MABRA-PROJEKT-VIT-HUB-SPEC.md`](../../design/MABRA-PROJEKT-VIT-HUB-SPEC.md)  
**Analys:** [`docs/evaluations/2026-06-14-fas6-mabra-superhub-djupanalys.md`](../../evaluations/2026-06-14-fas6-mabra-superhub-djupanalys.md)  
**Supermodule-mönster:** [`2026-06-06-supermodule-master-plan.md`](../../evaluations/2026-06-06-supermodule-master-plan.md) (`CaptureSuperModule`, `DagbokSuperModule`)

---

## 1. Syfte

Ersätta **spridda inmatningsformulär** i MåBra-zonen med en polymorf **Universal Input Hub** — `MabraInputSuperModule` — där användaren byter **läge** (check-in, Vit-kort, känslominne, reflektion, dagbok-bro, inkast) **utan att byta sida**.

MåBra förblir rehabiliteringszon (KBT/ACT, låg affekt, inga streaks). Superhubben är **inmatnings- och spar-yta**, inte ersättning för akutövningar (andning, akut, reframing-flow).

---

## 2. Scope och avgränsning

### In scope

- En router-komponent + lägesväxlare (UI)
- Delegation till **befintliga** paneler (ingen omskrivning av WORM-logik)
- Enhetlig `/mabra`-entry (legacy deprecation plan)
- Metadata på sparade objekt: `zone`, `inputMode`, `projectId?`, `content_class`, `bankId?`
- Färgburkar: smaragd zon (`glow-bottom-green`, `calm-card`)

### Out of scope (v1 Superhub)

- Ny Firestore-samling
- Cross-RAG till Kunskap
- Auto-promote till Valv/bevis
- Ersätta hela `MabraHubView` (övningar, akut, historik)
- Backend-ändring av `mabraCoach` prompts (se `sharedRules.ts` — separat process)

### Skild från (oförändrat)

| Zon | Roll |
|-----|------|
| Speglar | Ex/konflikt — guard redirect |
| Hamn | BIFF/Grey Rock |
| Valv bevis | WORM evidens — endast HITL/inkast |
| Kunskap | FACT-silo — ingen MåBra auto-ingest |

---

## 3. Arkitektur

### 3.1 Komponent

```
src/modules/features/dailyLife/wellbeing/mabra/supermodule/
  MabraInputSuperModule.tsx      # Canonical router
  mabraInputModes.ts             # Mode union + labels + metadata
  index.ts
```

**Mönster:** Identiskt med `CaptureSuperModule` — tunn router, **inga** direkta Firestore-skrivningar i routern.

### 3.2 Input modes (lägen)

| Mode ID | Etikett (UI) | Delegate | Firestore / persistens |
|---------|--------------|----------|------------------------|
| `checkin` | Check-in | `MabraCheckinModal` (inline) eller extraherad panel | `checkins` WORM |
| `vit_card` | Frågekort | `VitCardFlowPanel` | `vit_entries` WORM |
| `vit_chat` | Lär tillsammans | `VitChatFlowPanel` | `vit_entries` WORM |
| `vit_memory` | Känslominne (Vit) | `VitMemoryFlowPanel` | `vit_entries` WORM |
| `emotional_memory` | Känslominnen (WORM) | `EmotionalMemoryComponent` + `EmotionalMemoryListPanel` | `emotional_memory` WORM |
| `reflection_tool` | Reflektion | `MabraReflectionDeckTool` / `MabraFeelingCardsTool` | localStorage → valfri cloud save (Fas 6C) |
| `exercise_note` | Anteckning | Post-exercise save prompt (wrapper) | bridge → dagbok/minne |
| `dagbok_bridge` | Spara till dagbok | `DagbokSuperModule` variant eller deep link | `journal` WORM |
| `inkast` | Inkast | `CaptureSuperModule` variant **`mabra`** (ny) | HITL → routing |

**Projektkontext:** Modes `vit_*` och `emotional_memory` kräver `projectId` (URL: `/mabra/projekt/:projectId?inputMode=…`).

### 3.3 Känslominne — canonical path (D1)

| Projekt | Mode | Collection |
|---------|------|------------|
| `emotional_memory` | `emotional_memory` | `emotional_memory` |
| Övriga (`self_esteem`, `who_am_i`, …) | `vit_memory` | `vit_entries` |

**Regel:** UI-etikett “Känslominne” mappas deterministiskt enligt tabell — **ingen** ny tredje silo.

### 3.4 URL och state

```
/mabra/input                          # hub default (checkin eller senast valt läge)
/mabra/input?inputMode=emotional_memory
/mabra/projekt/emotional_memory?inputMode=emotional_memory
```

- `inputMode` synkas med Zustand `mabraStore` (valfritt) för återbesök
- Deep links från `MabraComplete` ska kunna öppna `dagbok_bridge` eller `exercise_note`

### 3.5 Legacy `/mabra` unification (Fas 6A)

| Nu | Mål |
|----|-----|
| Exakt `/mabra` → `MabraHub.tsx` | Redirect eller embed `MabraHubView` + Superhub-sektion |
| `/mabra/*` → module shell | Behåll; Superhub monteras i projekt-vy och dedikerad `/mabra/input` |

**MUST NOT** bryta locked övningar (`/mabra/akut`, `/mabra/ovning/*`).

---

## 4. Visuell design

| Token | Användning |
|-------|-------------|
| `calm-card` + `glow-bottom-green` | Superhub-container |
| `bg-surface-2`, `border-border` | Lägesväxlare |
| `text-accent` | Aktivt läge |
| `font-display-serif` + `tracking-[0.2em]` | Rubrik |
| Smaragd glow | MåBra/återhämtning per [`COLOR-POLICY.md`](../../design/COLOR-POLICY.md) |

**Lägesväxlare:** Horisontell pill-rad eller vertikal lista — **max 5 synliga**; övriga under “Mer…” (progressive disclosure).

**Förbjudet:** streak, XP, natur-tema, turkos aktiv chrome.

---

## 5. Säkerhet och data

| Regel | Implementation |
|-------|----------------|
| WORM | Endast `create` via befintliga firestore helpers |
| Verified email | `emotional_memory` — gate i `EmotionalMemoryComponent` |
| U6 | `content_class` REFLECTION/PLAY; `bankId` parafras i coach |
| Speglar guard | Oförändrad i coach/chat/reframing delegates |
| Offline | Följ `offlineWritePolicy.ts` allowlist |
| Inkast | **HITL** — `CaptureSuperModule` review queue, ingen auto-WORM |
| Zero Footprint | RAM-lägen rensas; ingen persistent cache av coach-svar utan explicit save |

---

## 6. Implementationsfaser

### Fas 6A — Router-skelett ( första kod-PR )

- [ ] `MabraInputSuperModule.tsx` + `mabraInputModes.ts`
- [ ] Route `/mabra/input` i `MabraRoutes.tsx`
- [ ] Lägesväxlare UI (3 lägen: `checkin`, `emotional_memory`, `vit_card`)
- [ ] Ingen ny Firestore-logik
- [ ] Smoke: `npm run build`, `smoke:mabra`, `smoke:emotional-memory`

### Fas 6B — Vit + minneslista

- [ ] Alla `vit_*` modes i router
- [ ] `EmotionalMemoryListPanel` alltid under `emotional_memory`
- [ ] Valv Vit read: dokumentera dual-read eller utöka panel ( separat eval )

### Fas 6C — Reflection + RAM → save

- [ ] Reflection deck: “Spara till Vit” / “Spara till dagbok”
- [ ] Post-exercise save prompt efter reframing

### Fas 6D — Inkast + dagbok bridge

- [ ] `CaptureSuperModule` variant `mabra`
- [ ] Enhetlig dagbok-bro från hub

### Fas 6E — Lås

- [ ] `.context/locked-ux-features.md` post
- [ ] PMIR + smoke:locked-ux
- [ ] **Låst** — ingen AI-ändring utan åsidosättande tillstånd (Pontus)

---

## 7. Acceptanskriterier (Fas 6E)

- [ ] Ett läge i taget synligt; byte utan full sidreload
- [ ] Inga nya spridda textarea utanför Superhub (MåBra-zon)
- [ ] `npm run smoke:mabra` + `smoke:emotional-memory` + `smoke:locked-ux` PASS
- [ ] Verified email gate fungerar för känslominne
- [ ] Legacy `/mabra` deprecation dokumenterad eller redirect klar

---

## 8. Referenser (kod idag)

| Fil | Roll |
|-----|------|
| `emotional-memory/EmotionalMemoryComponent.tsx` | WORM minne |
| `emotional-memory/EmotionalMemoryListPanel.tsx` | Lista |
| `mabra/components/Vit*FlowPanel.tsx` | Vit flows |
| `mabra/components/EmotionalMemoryView.tsx` | MåBra wrapper |
| `capture/CaptureSuperModule.tsx` | Inkast-mönster |
| `mabra/routing/MabraRoutes.tsx` | Routes |

---

## 9. Changelog

| Datum | Händelse |
|-------|----------|
| 2026-06-14 | SPEC godkänd efter djupanalys |
