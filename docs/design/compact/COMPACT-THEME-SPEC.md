# Kompakt Livskompassen — Tema (modul för modul)

**Referens (låst):** [`../references/LIVSKOMPASSEN-hem-kompakt-ref.png`](../references/LIVSKOMPASSEN-hem-kompakt-ref.png)  
**Behåll alltid:** Fotobakgrund (nordisk skymning/sjö) + **Kognitiv sköld**-kompass (L1 emboss).  
**Förbättra:** Kort, menyer, dock — tätare layout, mer gulddetalj (L2), **ingen** turkos/lila.

---

## Telefon (hur det ser ut)

Alla mockups är redan **portrait mobil** (~390×844, iPhone-klass):

| Zon | Telefon |
|-----|---------|
| Safe area | Topp ~47px, botten ~34px (hemindikator) |
| Header + dock | Syns; innehåll scrollar mellan |
| Hamn/Valv-listor | Vertikal scroll; hash-rad kan brytas till 2 rader på små skärmar |
| Kompis | Chat fyller höjden; input fast längst ned |

**Förhandsvisa:** öppna PNG i Cursor eller `compact/index.html` — zooma till 100% på en 390px-bred ruta (DevTools iPhone 14).

---

## Linjer — fylligare guld (din feedback)

Mockups har idag **tunna hårlinjer** (~1px). Vid kodning: **+1 steg tjockare** — samma look, tydligare mot foto-bakgrund.

| Token | CSS (mål) | Användning |
|-------|-----------|------------|
| `--border-gold` | `2px solid rgba(212,175,55,0.45)` | Kort, bubblor, input |
| `--border-gold-strong` | `2.5px solid rgba(212,175,55,0.65)` | Aktiv flik, WORM-banner |
| `--border-gold-subtle` | `1.5px solid rgba(212,175,55,0.30)` | Listavgränsare Valv |
| `--radius-card` | `12px` | Alla glass-kort |

Tailwind-exempel: `border-2 border-[rgba(212,175,55,0.45)]` — **inte** `border` (1px) ensam.

---

## Layout-principer (kompakt)

| Token | Värde |
|-------|--------|
| Kort-padding | `12px` (var 16–20) |
| Kort-gap | `8px` |
| Kompass-bredd | ~42% skärm |
| Kort-kolumn | ~52% skärm, 2 kolumner där det får plats |
| Glass | `rgba(8,12,18,0.72)` + **`--border-gold`** (2px) |
| Rubrik | Cinzel/serif guld caps |
| Bröd | Inter 13px cream |

---

## Hem (modul 00)

| Zon | Innehåll |
|-----|----------|
| Bakgrund | **Oförändrad** foto |
| Vänster | Kompass + `rutiner` · `budget` · `personlig utveckling` |
| Höger kort | Din eld · BIFF Triage · Emotional noise · Dagens riktning · Dold logistik · Fakta inte fluff |
| Dock | Familjen · **kompass (ingen text)** · Valv — se [`DOCK-KANON.md`](../references/DOCK-KANON.md) |

Mockup: [`modules/00-hem-kompakt.png`](./modules/00-hem-kompakt.png)

---

## Modulmockups

| ID | Modul | Fil |
|----|-------|-----|
| 00 | Hem hub | `00-hem-kompakt.png` |
| 01 | Hamn / Trygg hamn | **`01-hamn-hub-kanon.png`** (låst) |
| 02 | Kompis | **`02-kompis-kanon.png`** (låst) |
| 03 | Valv Pansaret | **`03-valv-pansaret-kanon.png`** (låst) |
| 04 | Familjen | `04-familjen.png` |
| 05 | Planering P1 | **`05-planering-kanon.png`** (låst) |
| 06 | MåBra Transformatorn | **`06-mabra-kanon.png`** (låst) |
| 07 | Barnporten | **`07-barnporten-kanon.png`** (låst, 2×2 kort) |
| 08 | **Sidomeny (LÅST)** | `08-meny-drawer-kanon.png` → se [`MENU-DRAWER-KANON.md`](../references/MENU-DRAWER-KANON.md) |

**Galleri:** [`index.html`](./index.html)

---

## Implementation (senare)

- `HomePage` → tvåkolumns grid enligt mockup 00
- `HomeHeroCompass` → L1 kompass oförändrad silhuett
- Nya kortkomponenter: `HomeEldChip`, `HomeBiffCard`, `HomeDoldLogistikCard` (låsta metrics)
- Samma bakgrund: CSS `background-image` + mörk overlay 40%
