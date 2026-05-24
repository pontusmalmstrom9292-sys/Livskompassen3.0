# Visuell Estetik och Designspråk

**Canonical:** [`docs/specs/design-master.md`](../docs/specs/design-master.md)  
**Aktivt tema:** **E — Nordic Skymning + Guld** ([`THEME-E-SPEC.md`](../docs/design/themes/E-aurora-obsidian-compass/THEME-E-SPEC.md))

## Riktning A–D (Design System v2)

| ID | Namn | Status |
|----|------|--------|
| **E** | Nordic Skymning + Guld | **Prod (2026-05-23)** — tokens i `src/index.css` |
| F | Guld Pansar (Valv) | Referens för bevis/WORM-copy |
| G | Varm hamn | Alternativ mockup |
| H | Grafit Grey Rock | Alternativ mockup |

**Avvecklat som prod-mål:** platt Obsidian Calm utan identitet, lila `#818CF8` som primär accent, regnbågs-glow.

## Estetik (Tema E)

- Bakgrund: skog-teal `#0a1614` → skymning `#12151f`
- Accents: guld `#d4af37`, ember `#f59e0b` (CTA), emerald endast för success
- Typografi: **Outfit** (rubriker), **Inter** (bröd)
- Progressive disclosure — ett steg i taget
- **Förbjudet:** indigo/lila text-accent, turkos glow, natur-tapeter, count-up

## Centrala Element

- **LivskompassHero:** guld kompass-hub på Hem ([`HOME-HERO-KANON.md`](../docs/design/references/HOME-HERO-KANON.md))
- **Kompis Avatar:** pulserande aura (viloläge)
- **Tidshjulet:** flerlagrad tidslinje för Minne
- **Sub-Synaptisk Bakgrund:** bakom innehåll, inte på kontroller

## Tailwind / CSS

- Tokens: `:root` i `src/index.css`, `tailwind.config.js`
- Glass: guld border `rgba(212,175,55,0.25)`, teal glass cards
- Ikonnivåer: L1 hero emboss (max 4), L2 dock guld line, L3 listor 16px

## Modul-specifikt

- **Valv / Pansaret:** guld SERVER-TIDSSTÄMPEL, WORM badges
- **Familjen:** emerald aurora accent (barn), guld barnfokus
- **Speglar:** lågaffektiv indigo **ersatt** — neutral glass + guld CTA
