# Theme Lab — ikonbeslut

**Stilguide:** [`ICON-STYLE-GUIDE.md`](../ICON-STYLE-GUIDE.md)  
**Låst:** [`.context/locked-icons.md`](../../../.context/locked-icons.md) · smoke: `npm run smoke:locked-icons`  
**Väntar val (senaste — v4):** [`icons-proposals/2026-05-26-v4-round2-dna/`](../icons-proposals/2026-05-26-v4-round2-dna/) — rad 1 = v2 **B1/D1/M1** ankare + 9 varianter × chrome. `npm run icons:proposals-v4`  
**v3 (5 stilar):** [`icons-proposals/2026-05-26-v3-chassis/`](../icons-proposals/2026-05-26-v3-chassis/) — `npm run icons:proposals-v3`  
**Äldre enkla:** [`icons-proposals/2026-05-26-remaining/`](../icons-proposals/2026-05-26-remaining/) (3 varianter)

## Låsta (MUST NOT ändra utan produktbeslut)

| ID | Plats | Fil | Status |
|----|-------|-----|--------|
| **B1** Kanon ros | App / favicon / PWA | `public/favicon.svg` | LÅST |
| **D1** Helros | Header, dock, hero, drawer-mark | `LivskompassMark.tsx` | LÅST |
| **M3** Fyrens själ | Kompis-avatar | `KompisMark.tsx` | LÅST |

## Chrome — väntar val (v4: 10 per kategori)

| Plats | Nu | Förslag | Preview |
|-------|-----|---------|---------|
| Meny Familjen + dock v | Users | F1–F10 | v4-round2-dna/familjen |
| Meny Hamn | Anchor | H1–H10 | v4-round2-dna/hamn |
| Meny Valv / PIN | ValvArchIcon | V1–V10 | v4-round2-dna/valv |
| Meny + dock Dagbok | BookOpen | J1–J10 | v4-round2-dna/dagbok |
| Meny Planering | Calendar | P1–P10 | v4-round2-dna/planering |
| Meny MåBra | Sparkles | A1–A10 | v4-round2-dna/mabra |
| Hero rutiner | HeroRutinerIcon | R1–R10 | v4-round2-dna/hero/rutiner |
| Hero ekonomi | HeroEkonomiIcon | E1–E10 | v4-round2-dna/hero/ekonomi |
| Hero utveckling | HeroUtvecklingIcon | U1–U10 | v4-round2-dna/hero/utveckling |
| Hero kunskap | HeroKunskapIcon | Kn1–Kn10 | v4-round2-dna/hero/kunskap |

Stil: D1-skiva (guld, ticks, ringar) + **unik glyph** — inte samma ikon som kompass-mark.

## Övrigt (Lucide OK tills vidare)

| Plats | Nu | Notering |
|-------|-----|----------|
| Meny Hem hub | Compass | Egen “hem”-ikon valfritt — ej samma som D1 |
| Meny Arbetsliv | Clock | P1 Lucide |
| Valv underflikar | BarChart3, Network, … | Följer hub V* när valt |
| Loader / chevron / stäng | Lucide | Tillåtet enligt stilguide |

**Kanon:** [`MENU-DRAWER-KANON.png`](../references/MENU-DRAWER-KANON.png)
