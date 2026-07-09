# Bästa designv2 — paritetsaudit (2026-07-09)

Referens: `docs/bästa designv2/src/app/App.tsx`  
Prod: `ME-basta-design` · `MainLayout` + `HomePage`

## Matchar referensen

| Område | Status |
|--------|--------|
| Hem — hero «Dagens reflektion» + aside reflektionsfråga | OK (`BastaDesignHero`) |
| Hem — Dagens fokus (4 tabs) + livscoach-kort | OK |
| Hem — Dagens ankar | OK (Firestore check-in) |
| Hem — Planering (tabs + dagens uppgifter) | OK (riktiga tasks) |
| Hem — Tidigare anteckningar | OK (journal entries) |
| Header — Livskompassen + ornament centrerat | OK (förstärkt prod) |
| Header — inställningar + konto höger | OK (+ Kompis-öga istället för Bell) |
| Dock — Anteckning · Familj · kompass · Mentil · Inkast | OK |
| Dock — hero-kompass breakout | OK (v2 SVG, större än ref mock) |
| Färger — mörk bakgrund + guld accent | OK (`basta-design.css` tokens) |
| Kort — mörk panel + guld kant | OK (`BastaCard`) |

## Avsiktliga prod-avvikelser (Pontus-beslut)

| Ref v2 | Prod | Varför |
|--------|------|--------|
| Ingen Resurser i header | Resurser vänster (meny + widget) | Snabbåtkomst utan dock-zon |
| Flat dock-bar | Pill-dock med icon-wells + scrim | Bleed-through-fix + premium |
| Bell-ikon höger | Kompis-öga / Valv | Livskompassen-funktion |
| Mock-data | Firestore routes | Riktig app |
| Cinzel/Lora fonts | Cormorant Garamond + Inter | Projekt font-pack |

## Ej i scope för ref-mock (andra routes)

Ekonomi, Resurser full page, Dagbok, Inställningar — finns som egna moduler via navigation, inte som tabs i ref-appens bottom-nav.

## Smoke

`npm run smoke:basta-dock-lock` — header + dock + hem-struktur  
`npm run smoke:executive-home-visual` — hem screenshot (dev server)
