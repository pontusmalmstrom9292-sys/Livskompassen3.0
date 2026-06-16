# K1 — Kompass-widget-katalog (Gemini handoff → Cursor)

**Status:** **Integrerad** i `src/modules/wellbeing/compasses/config/compassWidgetCatalog.ts`  
**Datum:** 2026-05-30

## Widget-tabell

| Tidskompass | Widget | Route | content_class | Silo-regel |
|-------------|--------|-------|---------------|------------|
| **Morgon** | Anteckning | `/widget/anteckning` | none | Lager 1 — ej auto Valv |
| Morgon | Inspelning | `/widget/inspelning?autostart=1` | EVIDENCE | WORM vid explicit spar |
| Morgon | Känslokort | `/mabra` | PLAY | Vit — ingen Kunskap-RAG |
| Morgon | Snabb rad | `/dagbok?mode=snabb` | REFLECTION | weave opt-in separat |
| **Dag** | Frågesport | `/widget/snabbval` | FACT | Kunskap bank |
| Dag | Mikrosteg | `/planering?tab=handling` | none | P3 Kanban |
| Dag | Dagbok | `/dagbok` | REFLECTION | ej auto-promotion Valv |
| Dag | Uppgift | `/planering?tab=fokus` | none | Paralys via planering |
| **Kväll** | KASAM | `/vardagen?tab=kompasser` | REFLECTION | KasamEvening i modul |
| Kväll | Reflektion | `/dagbok?tab=reflektion` | REFLECTION | Journal WORM |
| Kväll | Anteckning | `/widget/anteckning` | none | Lager 1 |
| Kväll | Fokus | `/planering?tab=fokus` | none | länk only |

## Wireframe (CompassModuleStrip)

```
┌─ Morgonkompass ────────────────────────┐
│ ○  Morgonkompass              nu  ⌄   │
├──────────────────────────────────────┤  ← expanded
│  SNABBSTART [Anteckning][Inspelning]…  │
│  [ check-in panel ]                    │
└────────────────────────────────────────┘
```

Collapsed + aktiv tid: kompakt Snabbstart-rad under modulraden.

## CSS-tokens

- Kant: `1.5px solid rgba(212, 175, 55, 0.28)`
- Radius: `14px` (`0.875rem`)
- Klass: `.compass-quick-widget-rail`

## Ikoner K1/K2/K3

Se `docs/gemini-handoff/icons/compass-time/` (24×24 SVG, L2).
