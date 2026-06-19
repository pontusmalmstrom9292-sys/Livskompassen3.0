# Hem Layout A — Ankare + asymmetriskt rutnät (H1)

**Status:** godkänd av Pontus 2026-06-19 · **behåll parallellt** med C1/C2/C3 i [CHROME-DESIGN-REGISTER.md](./CHROME-DESIGN-REGISTER.md)

**Referensbild (prod-lik):** [hem-layout-a-prod-ref.png](./hem-layout-a-prod-ref.png)

**Sandbox:** [01-home-variants.html](../../design-sandbox/mockups/01-home-variants.html) — **A · Ankare + rutnät ★**

**Prod-kod:** `src/modules/core/home/HomeBrassLayoutA.tsx` · `HomeBrassDaySteps.tsx` · tema `SB-brushed-brass-neu`

---

## 1. Syfte

Hemskärmen ska ge **ett steg i taget**: dagens intention först, sedan små handlingar — utan menymotor eller gamification.

---

## 2. Vertikal stack (top → bottom)

| Lager | Innehåll | Klass / komponent |
|-------|----------|-------------------|
| Intro | Hälsning + veckodag · fas | `home-brass-a__intro`, `HomeGreeting` |
| **Hero** | Dagens ankare | `home-brass-a__hero brass-glass--hero` |
| **Rutnät** | Dagens steg + snabbknappar | `home-brass-a__grid` |
| **Strip** | Senaste · Inkast | `home-brass-a__strip` |
| Feed | Mer för dig / För dig just nu | `PinnedPlaneringModuleSlot`, adaptiv feed |
| Chrome | Fyren + dock (C1–C3) | `MainLayout` — **ej del av denna modul** |

---

## 3. Hero — Dagens ankare

- **Eyebrow:** `DAGENS ANKARE` (`home-brass-a__label`, guld caps)
- **Rubrik:** dynamisk — placeholder *Vad är viktigast idag?* tills användaren skrivit (`font-display-serif`)
- **Lead:** *Inte hela dagen — bara det viktigaste nu.*
- **Inset:** `textarea` i `brass-inset neu-inset`
- **CTA:** `SPARA ANKARE` — teal pill (`btn-pill--accent`), **inte** guld primär

---

## 4. Asymmetriskt rutnät

```
┌─────────────────┬──────────┐
│  DAGENS STEG    │ Anteckn. │
│  (tall, vänster)│──────────│
│  checklist      │   Röst   │
└─────────────────┴──────────┘
```

| Cell | Label | Ikon | Route / beteende |
|------|-------|------|------------------|
| Tall vänster | Dagens steg | checklist-rader | `HomeBrassDaySteps` → Planering |
| Övre höger | Anteckning | `PenLine` teal | `HOME_SUPERHUB_ROUTES.hjartatReflektion` |
| Nedre höger | Röst | `Mic` teal | `HOME_SUPERHUB_ROUTES.hjartatQuickMirror` |

- Rutnät: `grid-template-columns: 1.15fr 0.85fr` · vänster kort `grid-row: span 2`
- Glas: `brass-glass` på alla tre — **snugg**, avrundade hörn, tunn guldkant

---

## 5. Senaste · Inkast

Horisontell strip under rutnätet:

- Ikon ▦ i teal shell
- **Senaste · Inkast** + sub *Tryck för att fånga något nytt*
- Navigerar till planering inkast

---

## 6. Visuellt språk (Obsidian Calm + Brass)

| Element | Token |
|---------|--------|
| Hero/glas | `brass-glass`, `--surface-2` mix |
| Sektionslabels | guld caps, `letter-spacing` bred |
| Mikro-CTA (Anteckning/Röst) | **teal** ikon — skiljer från guld nav |
| Sparankare | teal pill — enda starka action i hero |

CSS-kanon: `src/styles/brushed-brass-neu.css` (`.home-brass-a__*`)

---

## 7. Coexist med övrig chrome

På samma skärm (se referensbild):

- **C1** — stor `LivskompassMark` i mitten av `FloatingDock`
- **C2** — kompass-pebble höger (sidodock, stängd)
- **C3** — Fyren-handtag ovanför dock

**MUST NOT** flytta Anteckning/Röst från H1-rutnätet till enbart sidodock utan explicit beslut.

---

## 8. Smoke / verifiering

- Tema: `SB-brushed-brass-neu` · route `/`
- Visuellt: hero + 3 rutnät + strip + dock med mittkompass
- Kod: `npm run build` · `HomeHeroKanon` renderar `HomeBrassLayoutA` när `brassHome`
