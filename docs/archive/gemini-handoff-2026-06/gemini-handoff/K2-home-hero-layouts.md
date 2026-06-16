# K2 — HomeHeroKanon layoutvarianter (390px mobil)

**Status:** **Variant A implementerad** i `DagensRiktningCard` + `CompassQuickWidgetRail`  
**Datum:** 2026-05-30

## Variant A — Widget under kort (KEEP)

```
[ scenic bakgrund + kompass-stage ]
  [ Hälsning + streak-chip ]
  ┌ Dagens riktning ─────────────┐
  │ K1-ikon · titel · råd        │
  │ [ Checka in nu ]             │
  └──────────────────────────────┘
  [ Snabbstart chips ]           ← collapsed
  ── eller inuti panel ──        ← expanded
```

Tailwind-struktur (redan i kod):

- `home-hero-kanon__scenic-stack` — glass över bakgrund
- `dagens-riktning-card` — guld-kant, ej över hela kompass-disc
- `compass-quick-widget-rail--below` — under kort när stängt
- `compass-quick-widget-rail--in-module` — inuti expanderad panel

## Variant B — DEFER (ej vald)

Widget endast efter check-in (progressive disclosure stramare). Risk: fler klick för ADHD-snabbstart.

## Variant C — REJECT

Widget ovanpå scenic kompass-disc — visuellt kaos mot HOME-HERO-KANON.
