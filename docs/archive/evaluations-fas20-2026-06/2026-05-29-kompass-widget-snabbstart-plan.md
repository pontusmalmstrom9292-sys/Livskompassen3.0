# Kompasser — widget under varje kompass (snabbstart + design)

> **Status:** `closed` · K1 integrerad (`compassWidgetCatalog.ts`) · smoke PASS.

**Datum:** 2026-05-29  
**Utlösare:** Hem `DagensRiktningCard` + önskemål om snabbstart och visuell städning.  
**Kanon:** [`docs/design/KOMPASS-MODUL-SPEC.md`](../design/KOMPASS-MODUL-SPEC.md) · [`docs/specs/modules/De-3-Kompasserna-SPEC.md`](../specs/modules/De-3-Kompasserna-SPEC.md) · [`docs/design/references/KOMPASS-TRE-TIDPUNKTER.md`](../design/references/KOMPASS-TRE-TIDPUNKTER.md)

## Nuläge (kod)

| Yta | Vad som finns |
|-----|----------------|
| **Hem scenic** | `HomeHeroKanon` → `DagensRiktningCard` (en aktiv tidskompass + check-in) |
| **Hem alt.** | `HomeActionHub` → `CompassModuleStrip` (3 avlånga) + `HomeQuickModules` (global snabbval under alla) |
| **Hamn** | `HamnModuleStack` — kompassråd + BIFF |
| **Snabbval idag** | Dagbok · Uppgift · Frågesport · Lucka (`HomeQuickModules`) — **inte** kopplat per kompass |

**Gap:** Snabbstart ligger **under hela kompassblocket**, inte **under respektive Morgon / Dag / Kväll**.

---

## Målbild

Varje kompass (Morgon · Dag · Kväll) har **egen widget-rad direkt under** huvudraden (collapsed eller expanded):

```
┌─ Morgonkompass ────────────────────────┐
│ ○  Morgonkompass              ⌄      │
├──────────────────────────────────────┤
│  SNABBSTART (widget, 2×2 eller scroll) │
│  [Frågesport] [Känslomemory] [Kurs] …  │
└──────────────────────────────────────┘
```

Samma mönster för Dag och Kväll. På Hem scenic kan widgeten ligga under `DagensRiktningCard` när expanderad, eller alltid synlig som kompakt rad under kortet.

---

## Widget-innehåll (första våg)

| Widget | Route / modul | Silo / regel |
|--------|----------------|--------------|
| **Frågesport** | `HomeVaultLearningPanel` quiz / Kunskap | Kunskap — ej Valv-auto |
| **Känslomemory** | MåBra känslokort / lek-bank | Vit — `content_class` PLAY/REFLECTION |
| **Snabbkurs** | Kunskap kort läge / kb micro | FACT bank — kurator seed |
| **Inspelning** | Dagbok röst / widget inspelning | Lager 1 journal — WORM |
| **Anteckning** | Dagbok snabb rad / inkast | Lager 1 — ej auto Valv |
| **Paralys** | Dag-kompass only | Manuell start |
| **KASAM-steg** | Kväll only | Befintlig `KasamEvening` |
| **Planering mikrosteg** | `/planering` fokus | P3 kanban — länk |

**Princip:** Widget = **deep link eller mini-panel** — max **en** primär interaktion synlig; resten bakom «Mer».

---

## Design (städning)

| Element | Beslut |
|---------|--------|
| **Ikoner** | K1/K2/K3 appikon per kompass (`/icons/compass-time/`) — redan på `DagensRiktningCard` |
| **Kant** | 2px mjuk guld (`KOMPASS-MODUL-SPEC`) — samma som elongated-module |
| **Widget-rad** | Horisontell scroll eller 2×2 grid; L2 line-ikoner + kort etikett |
| **Hem scenic** | Hälsning under kompass-bakgrund; kort glass; widget **inte** över bakgrundskompass |
| **Ingen** | Streak-gamification, turkos/lila glow, fjärde RAG-silo |

**Referens:** [`docs/design/WIDGET-BAR-SPEC.md`](../design/WIDGET-BAR-SPEC.md) (Fyren) — **separat** från kompass-widget; dela tokens, inte layout.

---

## Implementation (faser)

| Fas | Leverans | Filer (plan) |
|-----|----------|----------------|
| **P0** | Spec + `COMPASS_WIDGET_CATALOG` konstant | `compassWidgetCatalog.ts`, uppdatera denna eval |
| **P1** | Widget under `ElongatedModule` i `CompassModuleStrip` | `CompassModuleStrip.tsx`, `CompassQuickWidgetRail.tsx` |
| **P1b** | Widget under `DagensRiktningCard` (scenic Hem) | `DagensRiktningCard.tsx` |
| **P2** | Visuell redesign 3 moduler + K1/K2/K3 | `ElongatedModule`, `index.css` |
| **P3** | Hamn: samma widget under Kompassråd-modul | `HamnModuleStack.tsx` |
| **P4** | `/vardagen` tab — widget synkad med aktiv flik | `DashboardPage.tsx` |

**Ej i scope:** Auto-promotion till Valv; LLM-genererade nya FACT utan bank (U6).

---

## Acceptance

- [x] Morgon, Dag, Kväll har var sin widget-rad (minst 3 shortcuts vardera, kompass-specifika där relevant).
- [x] Frågesport, anteckning, inspelning nås utan att lämna kompassflödet mer än ett steg.
- [x] `npm run smoke:locked-ux` + `npm run smoke:compass` gröna efter P1.
- [x] Design review mot `KOMPASS-MODUL-SPEC` (2px guld, progressive disclosure).

---

## Kommando (när du vill bygga)

`kör kompass-widget P1` — implementera efter godkänd eval (ingen kod förrän explicit).
