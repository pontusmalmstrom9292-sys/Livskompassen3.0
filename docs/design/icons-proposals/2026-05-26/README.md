# Ikonförslag 2026-05-26

Tre nya ikonfamiljer × tre varianter. **Välj en bokstav per rad** — säg t.ex. *"App A2, kompass C1, Kompis K3"* så byter vi in i kod + PWA.

| Plats | Nu | Komponent |
|-------|-----|-----------|
| Hemskärm / PWA | `public/favicon.svg` (Vite-lila) | manifest |
| Header + dock | `LivskompassMark.tsx` | `AppHeaderBrand`, `DockClassicTriad` |
| Kompis (höger header) | samma mark i `KompisAvatar.tsx` | egen komponent efter val |

**Kanon:** obsidian `#0a0a0a`, guld `#d4af37`, ingen natur, ingen indigo/lila.

**Förhandsvisa:** öppna [`preview.html`](./preview.html) i webbläsaren.

## 1 — Appikon (telefon / install)

| ID | Namn | Känsla |
|----|------|--------|
| **A1** | I-stone | Polerad obsidian-ruta, enkel 4-spetsig ros, diskret glöd |
| **A2** | Pansar | Cirkel med dubbel guldring + norddiamant (Valv/sköld) |
| **A3** | Fyren | Tre guldstrålar — riktning + Fyren-widget utan figur |

## 2 — Kompass (header 48px + dock 40px)

| ID | Namn | Känsla |
|----|------|--------|
| **C1** | Nordsten | En tydlig nordpil, tunn bana — minst visuellt brus |
| **C2** | Oktagon | Arkitektonisk 8-spetsig ros, växlande opacitet |
| **C3** | Lagring | Tre koncentriska bågar + nord — arkiv/riktning |

## 3 — Kompis-avatar (rund 40px header)

| ID | Namn | Känsla |
|----|------|--------|
| **K1** | Öga | Lugn “närvaro” — två bågar + prick (lyssnar) |
| **K2** | Puls | Mjuk sinuskurva — aktiv/analyserar utan robot |
| **K3** | Sköldpunkt | Liten sköld + guldkärna — kognitiv sköld |

## Efter godkännande

1. `LivskompassMark` → vald **C***
2. Ny `KompisMark` → vald **K***
3. `public/favicon.svg` + PNG 192/512 + `manifest` → vald **A***
4. Uppdatera `ICON-DECISIONS.md`
