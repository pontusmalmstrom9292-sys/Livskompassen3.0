# Style A — Nordic Precision

**ID:** `R-A-nordic-precision`  
**Panel style:** `obsidian` (header + dock)  
**Status:** Förslag — Theme Lab only until `GODKÄND:` in `docs/design/theme-lab/VARIANTS.md`  
**Datum:** 2026-06-07  
**Input:** Master audit + AGENT-01–05

---

## 1. Designintent

| Dimension | Beslut |
|-----------|--------|
| **Namn** | Nordic Precision |
| **Känsla** | Kall, kirurgisk, maximal låg visuell arousal |
| **Metafor** | Frostig verkstad — silverlinjer, isblå fokus, guld endast som nålstick |
| **Typografi** | Inter-first; Cinzel endast hub eyebrow (10px caps) |
| **Avvikelse från Obsidian Calm** | Kallare bas, isblå primär CTA, minimal guld, skarpare hörn (`rounded-xl`) |

**Prod-regel:** D1/M2 låsta tills `.context/locked-icons.md` uppdateras.

---

## 2. Färgpalett & tokens

| Token | Hex / värde | Roll |
|-------|-------------|------|
| `--bg` | `#0f1419` | Kall skifferbas |
| `--bg-dusk` | `#131820` | Gradient-botten |
| `--surface` | `#131820` | Flat yta |
| `--surface-2` | `#1a2332` | Kort, drawer |
| `--surface-3` | `#243044` | Hover, aktiv chip |
| `--accent` | `#38bdf8` | Isblå — primär CTA |
| `--accent-secondary` | `#94a3b8` | Silver — sekundär |
| `--accent-light` | `#cbd5e1` | Frost highlights |
| `--accent-glow` | `rgba(56, 189, 248, 0.12)` | Isblå bloom |
| `--nav-active` | `#c9a227` | **Functional lock** — drawer/dock aktiv |
| `--nav-active-glow` | `rgba(201, 162, 39, 0.1)` | Guld aktiv endast nav |
| `--success` | `#10b981` | Bekräftelse |
| `--warning` | `#f59e0b` | Varning |
| `--danger` | `#ef4444` | JADE / risk |
| `--glass` | `rgba(19, 24, 32, 0.88)` | Paneler — **lägre blur** |
| `--border` | `rgba(148, 163, 184, 0.18)` | Silver hairline |
| `--border-strong` | `rgba(56, 189, 248, 0.22)` | Fokusring |
| `--text` | `#f1f5f9` | Primärtext |
| `--text-muted` | `#94a3b8` | Sekundär |
| `--text-dim` | `#64748b` | Hint |

### Spacing & radius

| Token | Värde |
|-------|-------|
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` (`rounded-xl`) |
| `--radius-lg` | `16px` (`rounded-2xl` max) |
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--prism-blur` | `8px` (minimal glass) |

---

## 3. Typografi

| Roll | Klass | Font | Storlek | Tracking |
|------|-------|------|---------|----------|
| Hub eyebrow | `.eyebrow` | Cinzel | 10px | 0.24em |
| Hub title | `.hub-title` | Inter | 20px semibold | normal |
| Section title | `.title-section` | Inter | 14px semibold | 0.02em |
| Body | `.body` | Inter | 14px | normal |
| Caption | `.caption` | Inter | 12px | normal |
| Data / mono | `.mono` | Inter tabular | 11px | 0.05em |

---

## 4. Komponentbibel (18 primitives)

| # | Primitive | Style A |
|---|-----------|---------|
| 1 | Button primary | Isblå fill `#38bdf8`, mörk text `#0f1419`, `rounded-xl`, uppercase 10px |
| 2 | Button secondary | Silver border, transparent, `text-accent-secondary` |
| 3 | Button ghost | `border-border`, muted text |
| 4 | Button success | Emerald outline, sparsam |
| 5 | Card default | `surface-2`, `rounded-xl`, `border-border`, **ingen glow** eller subtil silver bottom |
| 6 | Card hero | Flat `surface`, ingen scenic blur |
| 7 | Card row | Horisontell rad, silver ikon-cirkel 32px |
| 8 | TabBar | Silver inaktiv; **guld** aktiv underline (lock) |
| 9 | DrawerRow | 48px höjd, silver ikon, guld aktiv stripe vänster |
| 10 | DockOrb | Skiffer disk, guld ring center only |
| 11 | Input | `input-glass` → flat `surface-3`, isblå focus ring |
| 12 | Modal | `surface-2`, sharp `rounded-xl` |
| 13 | PinGate | Silver shield, isblå CTA |
| 14 | EmptyState | Silver ikon 40%, isblå ghost CTA |
| 15 | MetricTile | Tabular siffror isblå, label silver |
| 16 | HubHeader | Inter title (ej serif), silver lead |
| 17 | WidgetChip | Silver pill, isblå aktiv dot |
| 18 | Chip filter | Silver border; aktiv isblå fill |

---

## 5. Ikonstrategi

| Kategori | Style A |
|----------|---------|
| D1/M2 | Låsta — preview: silver stroke variant |
| Drawer L2 | Line 1.5px, silver stroke, 22px |
| Dock | Flat glyphs, isblå hover |
| Widget | Minimal dot indicators |

Script: `npm run icons:proposals-v6 -- --style=nordic`

---

## 6. Motion

| Mönster | Värde |
|---------|-------|
| Default transition | `120ms ease-out` |
| Drawer | `200ms` max |
| Ingen ambient animation | Statisk bakgrund |
| `prefers-reduced-motion` | 0ms |

---

## 7. WCAG AA

| Par | Ratio | Status |
|-----|-------|--------|
| `#f1f5f9` på `#0f1419` | 14:1 | Pass |
| `#94a3b8` på `#0f1419` | 5.9:1 | Pass |
| `#38bdf8` på `#0f1419` (CTA 14px bold) | 7.2:1 | Pass |
| Fokus | 2px `#38bdf8` offset 2px | Pass |

---

## 8. 18 skärmar — nyckeldrag

| # | Skärm | Style A |
|---|--------|---------|
| 1 | Hem | Flat kompass, silver grid, ingen scenic foto |
| 2 | Drawer Vardag | Skiffer panel, guld aktiv rad |
| 3 | Drawer Valv | Silver Valv-rader, guld aktiv |
| 4 | Dock + widget | Obsidian rail, silver chips |
| 5 | Dagbok | Isblå humör-chips, flat wizard |
| 6 | Speglar | Isblå Spegla-CTA (ej indigo) |
| 7 | Valv Logga | Mono timestamps, silver list rows |
| 8 | Valv Mönster | Silver bar chart, minimal glow |
| 9 | Valv Orkester | Grid agent status, silver badges |
| 10 | Kunskapsbank | Isblå sök, silver KB cards |
| 11 | Kompis | Dirigent-lista, silver destinations |
| 12 | Vardagen launcher | Row cards, silver chevrons |
| 13 | Kanban P3 | Tre kolumner **låsta**, isblå kolumn headers |
| 14 | MåBra | Flat accordion, isblå frågekort |
| 15 | Barnfokus | **Låst copy** — silver wrap, isblå textarea focus |
| 16 | Trygg Hamn | BIFF triage, silver/brus mask |
| 17 | Barnporten | Varm undantag: `#1a1410` sub-silo OK |
| 18 | Capture/Inkast | G10 confirm, isblå primary |

**Mockups:** [`gallery/style-a/screens.html`](./gallery/style-a/screens.html)

---

## 9. Nu → Ny (urval)

| Element | Nu | Style A |
|---------|-----|---------|
| Primär CTA | Guld/indigo mix | Isblå enhetlig |
| Kort radius | `rounded-3xl` | `rounded-xl` |
| Hub title | Cinzel light | Inter semibold |
| Bakgrund | Scenic gradient | Flat skiffer |
| Silo glow | Ofta saknas | Silver hairline bottom |
| Drawer sub-link | Indigo glow | Silver only |

---

## 10. Funktionella lås

Oförändrade — se master audit § Funktionella lås.

---

## Källfiler

- [STYLE-A-IMPLEMENTATION-BLUEPRINT.md](./STYLE-A-IMPLEMENTATION-BLUEPRINT.md)
- [2026-06-07-design-redesign-master-audit.md](../../evaluations/2026-06-07-design-redesign-master-audit.md)
