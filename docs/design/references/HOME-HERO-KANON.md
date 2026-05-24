# Hem-hero — kanonisk layout (Tema E)

**Referensbild:** [`E-home-hero-kanon.png`](./E-home-hero-kanon.png)  
**Kompakt variant (sjö + Kognitiv sköld):** [`LIVSKOMPASSEN-hem-kompakt-ref.png`](./LIVSKOMPASSEN-hem-kompakt-ref.png) · mockups [`../compact/`](../compact/)  
**Princip:** Detaljerade guldikoner **endast** i kompassen — övrigt UI tunna linjeikoner (L2) men **mer detaljerade kortkanter** i kompakt läge.

---

## Skärmens delar (uppifrån)

| Zon | Innehåll | Implementation |
|-----|----------|----------------|
| **Top bar** | Hamburgermeny (guld) · `LIVSKOMPASSEN` serif caps · liten kompass-ros | `MainLayout` header |
| **Hälsning** | `God kväll, {namn} ✦` + tagline guld | `HomeGreeting.tsx` |
| **Din eld** | Liten glass-ruta: flamma + siffra (streak/energi) | `HomeStreakChip.tsx` — **IDÉ** gamification, kan vara dold |
| **Kompass-hub** | Cirkel med geometrisk grid, guld nål, 3–4 **emboss-ikoner** + pill-knappar | `LivskompassHero.tsx` |
| **Pills på kompass** | `rutiner` · **mynt-ikon (utan text «budget»)** · `personlig utveckling` | Navigerar till moduler |
| **Dagens riktning** | Glass-kort + kompass-ikon + citat + chevron | `DagensRiktningCard.tsx` |
| **Pager dots** | 5 prickar (karusell copy) | valfritt |
| **Dock** | Familjen · **kompass utan text** · Valv | Se [`DOCK-KANON.md`](./DOCK-KANON.md) — Hamn nås via menyn/hem-kort, inte som dock-etikett |

---

## Ikonregler (viktigt — “inte för mycket”)

| Nivå | Var | Stil |
|------|-----|------|
| **L1 — Hero** | Endast inside kompass-cirkeln | Mjuk guld “emboss”, max **4** symboler (checkbox, mynt/våg, grodd, bok) — **ingen** fotorealism |
| **L2 — Dock & flikar** | Familjen, Hamn, Valv, Planering | Lucide `stroke-width={1.5}` guld `#d4af37`, **platta** |
| **L3 — Listor/kort** | Inkorg, valv, barn | Enfärg line icon 16px, cream/guld |
| **Förbjudet** | Överallt | 3D-ikoner i varje rad, lila/turkos glow, regnbåge |

---

## Palett (från referens)

| Token | Värde |
|-------|-------|
| Bakgrund | Djup skogs-teal `#0a1614` → skymning `#12151f` (gradient) |
| Kompass-skiva | Mörk teal `#0d3b3b` + subtilt geometriskt grid |
| Guld | `#d4af37` rubriker, `#c9a227` skuggor |
| Bröd | Cream `#f5f0e8` |
| Glass | `rgba(10,22,20,0.75)` + border guld 20% opacity |

---

## Typografi

| Användning | Font |
|------------|------|
| `LIVSKOMPASSEN`, hälsning | **Outfit** eller serif-partner (Cinzel-lik) — guld |
| Bröd, pills | **Inter** medium |
| Valv/Bevis | Monospace endast i Valv-flöden (F-stil) |

---

## Koppling moduler

| Pill / nav | Route |
|------------|-------|
| rutiner | `/vardagen?tab=kompasser` |
| mynt (ekonomi, **ingen text**) | `/vardagen?tab=ekonomi` |
| personlig utveckling | `/mabra` eller framtida “Växa” |
| Familjen | `/familjen` |
| Hamn (centrum) | `/` hem eller hub |
| Valv | Fyren 3s → bevis |
| Dagens riktning | `/vardagen` kompassråd |

---

## Widget & Planering (samma språk)

- Widget-prick: **samma guld** som dock-centrum, ingen extra dekoration.
- Planeringssidan: L1-ikoner **inte** användas — endast L2/L3 (se [`PLANERINGSSIDA-SPEC.md`](../PLANERINGSSIDA-SPEC.md)).
