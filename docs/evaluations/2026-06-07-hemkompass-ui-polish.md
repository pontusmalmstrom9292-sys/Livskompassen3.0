# Hemkompass UI-polish — våg 2 (2026-06-07)

**Scope:** Obsidian Calm 2.0 visuell sammanhållning på `/` och `/vardagen?tab=kompasser`.

## Levererat (våg 4 — 2026-06-07)

| Område | Ändring |
|--------|---------|
| **Hälsningsmodul** | `home-greeting-module` — profil + närvaro-chip i samma scenic-låda som hälsningen |
| **Undermoduler** | `glow-bottom-gold` på widgets + planerings-pin |
| **Sektioner** | `home-page__section` — enhetlig max-width under hero |
| **Kompasser-hub** | Cinzel header «Mina kompasser» på `/vardagen?tab=kompasser` |

## Levererat (våg 3 — 2026-06-07)

| Område | Ändring |
|--------|---------|
| **Modulstack** | Snabbnav flyttad under fas-kort — hälsning → kompassråd → kort utan avbrott |
| **Silo-glow** | `glow-bottom-gold` på kompasskortet |
| **Scenic glue** | `home-adaptive-compass__core` — gemensamma sidobordrar hälsning ↔ råd ↔ kort |
| **Minneskort rubrik** | Cinzel caps «För dig just nu» |

## Levererat (våg 2)
| Område | Ändring |
|--------|---------|
| **Visuell stack** | Hälsning → Kompassråd → fas-kort sammanfogade på scenic Hem (`home-adaptive-compass__*`) |
| **Snabbnav** | Tunn guldkant, semantiska ytor, fokus-ring |
| **Fasflikar** | Cinzel caps, guld aktiv-state |
| **Smart Inkast** | Gradient-sektion inuti kort, serif-rubrik |
| **Närvaro-chip** | «Din eld» → «Närvaro» (mindre gamification) |
| **Kvällstagline** | Mjuk landning utan eld-metafor |
| **Minneskort** | `adaptive-card--*` med design-tokens |
| **Vardagen** | `home-adaptive-compass--hub` wrapper i `DashboardPage` |

## Filer

- `src/modules/core/home/HomeAdaptiveCompass.tsx`
- `src/index.css` (`.home-adaptive-compass__*`, `.adaptive-card--*`)
- `HomeStreakChip.tsx`, `HomeGreeting.tsx`, `AdaptiveMemoryCards.tsx`
- `KompassradPanel.tsx`, `DashboardPage.tsx`

## Smoke

- `npm run smoke:design-modules` — guards `home-adaptive-compass`
- `npm run smoke:locked-ux` — PASS

## USER (valfritt)

1. Hard refresh Hem — kontrollera att hälsning + kompassråd + kort känns som **en** modul
2. Byt fas Morgon/Dag/Kväll — flikar ska ha guld aktiv
3. `/vardagen?tab=kompasser` — samma komponent, hub-shadow
