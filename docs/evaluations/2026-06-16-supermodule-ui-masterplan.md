# Supermodule + UI Masterplan — Körfält B

**Datum:** 2026-06-16 · **Status:** Godkänd syntes (read-only planering → detta dokument)  
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
| **3 — Nav Våg B** | H1 `/ekonomi`→Vardagen · H2 MåBra-ingång · H3 `/arkiv` · H4 drogfrihet launcher | **PMIR** före kod |

**Defer:** Hem→Hjärtat redirect · global Fyren kapacitetsgrind (Våg C) · M3.0-C · Upload unified steg 2 (`InkastDirectPanel`).

---

## Per zon — SuperModule + nästa steg

| Zon | SuperModule(s) | Status | Nästa steg |
|-----|----------------|--------|------------|
| **Valv** | `ValvInputSuperModule` → `ValvSuperModule` | **WIP** | CHECKPOINT B1 — manuell §7 + smoke |
| **Hjärtat** | `DagbokInputSuperModule`, `SpeglarSuperModule` | B2 done | Ingen prod-kod; ev. ChatBox mockups parallellt |
| **Familjen** | `FamiljenInputSuperModule`, `BarnfokusSuperModule` | B3 done | Våg 2 F3: göm redundant `HubDropdownNav` |
| **Vardagen** | Mabra/Ekonomi/Planering/Arbetsliv InputSuperModules | B4 done | Våg 3 H1–H2 efter PMIR |
| **Hem `/`** | `CaptureSuperModule` | Legacy | DEFER merge → Hjärtat |
| **Fyren** | Widget + dock-handle | Delvis bakgrund | Våg 2: neutral publik Valv-copy |

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
| **1 B1** | `npm run build` · `smoke:locked-ux` · `smoke:valv` · `smoke:entities` · `smoke:orkester` · `smoke:valv-mode-sync` |
| **2 Nav micro** | `smoke:locked-ux` · `smoke:children` · `npm run build` |
| **3 Nav H** | `smoke:locked-ux` · `smoke:design-modules` · `smoke:mabra` · PMIR-godkänd merge-smoke |

---

## Ett steg att godkänna nu

**Godkänn: B1 Valv CHECKPOINT**

1. Kör manuell checklista (6 punkter) i [`2026-06-15-valv-supermodule-spec.md`](./2026-06-15-valv-supermodule-spec.md).
2. Kör smoke-raden för våg 1 ovan.
3. Vid PASS: `./scripts/snapshot_locked_module.sh valv` och uppdatera Valv → **LOCK** i [`LIFE-OS-BUILD-STATE.md`](../external-ai/LIFE-OS-BUILD-STATE.md).

B1 är enda zonen **WIP** i Körfält B. Kod för Fas 1A–1E finns redan; våg 2–3 startar inte förrän Valv är låst.
