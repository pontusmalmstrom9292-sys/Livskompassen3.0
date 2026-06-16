# Tema E — Nordic Skymning + Guld (kanon)

**Status:** **Aktiv — primärt visuellt mål**  
**Kanonbild hem:** [`docs/design/references/E-home-hero-kanon.png`](../../references/E-home-hero-kanon.png) · spec [`HOME-HERO-KANON.md`](../../references/HOME-HERO-KANON.md)

**Mix:** Denna referens + Guld Pansar (Valv-text) + Obsidian glass-menyer. **Ingen turkos, ingen lila text.**

---

## Palett

| Token | Värde | Roll |
|-------|-------|------|
| `--bg-teal-deep` | `#0a1614` | Skymning / skog-teal botten |
| `--bg-dusk` | `#12151f` | Top gradient |
| `--compass-disk` | `#0d3b3b` | Kompass-cirkel |
| `--text-gold` | `#d4af37` | Rubriker, loggor, dock aktiv |
| `--text-gold-dim` | `#9a7b2f` | Sekundär guld |
| `--text-body` | `#f5f0e8` | Bröd |
| `--text-dim` | `#a8a29e` | Meta |
| `--accent-ember` | `#f59e0b` | Eld-widget, CTA |
| `--glass` | `rgba(10,22,20,0.75)` | Kort |
| `--glass-border` | `rgba(212,175,55,0.25)` | Guld kant |
| **Förbjudet** | indigo, cyan, teal accent text, purple | — |

---

## Ikoner — “detaljerade men inte för mycket”

Se [`HOME-HERO-KANON.md`](../../references/HOME-HERO-KANON.md):

- **L1:** Endast i kompass-hub (max 4 emboss-symboler).
- **L2:** Dock + flikar = tunna Lucide guld.
- **L3:** Listor = 16px line, ingen 3D.

Planering & widget följer **L2/L3** — aldrig L1.

---

## Komponenter att bygga (hem)

| Komponent | Prioritet |
|-----------|-----------|
| `LivskompassHero` | P1 |
| `HomeGreeting` | P1 |
| `DagensRiktningCard` | P1 |
| `FloatingDock` uppdaterad guld aktiv ring | P1 |
| `HomeStreakChip` (“Din eld”) | P2 / valfri |

---

## Övriga skärmar (samma tema)

| Mockup | Fil (mål) |
|--------|-----------|
| Valv | `05-pansaret-valv.png` — guld SERVER-TIDSSTÄMPEL |
| Widget W1 | `widget-bar-discreet.png` |
| Planering P1 | `planering-P1.png` |
| Appikon | Kompass på teal skymning — samma som hero |

---

## Implementation

1. `valt tema E` → uppdatera `src/index.css` + `tokens.ts`  
2. Bygg `LivskompassHero` enligt kanonbild  
3. Planering `/planering` + widget W1 — samma guld, **inga** emboss-ikoner där
