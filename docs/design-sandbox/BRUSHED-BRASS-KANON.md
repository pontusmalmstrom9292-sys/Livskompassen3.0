# Brushed Brass Neumorf v2 — kanon (VINNARE)

**ID:** `SB-brushed-brass-neu` · **Beslut:** 2026-06-18

## Referensbilder (inlagda)

| Fil | Innehåll |
|-----|----------|
| `references/life-os-board-ref.png` | LIFE OS — färger, typografi, komponenter |
| `references/kanon-life-os-ref.png` | Kanon — skärmar, Fyren, Valv, drawer |

## Tokens (v2 — merged ref)

| Token | Värde | Källa |
|-------|--------|--------|
| `--bg` | `#051220` | LIFE OS deep blue |
| `--surface` | `#121b2e` | Midnight card |
| `--accent` | `#d4af37` | Guld / Fyren |
| `--accent-secondary` | `#2ec4b6` | Teal primär-CTA |
| `--danger` | `#e94c4c` | Lås Valv |
| Rubriker | Cormorant Garamond | Ref |
| Bröd | Inter | Ref |

## Mockup (statisk)

`mockups/01-brushed-brass-neu.html` — inkl. 5-dock (Hem·Planera·Fyren·Dagbok·Mer), Hem LIFE OS, Ekonomi, Valv hub.

## Kod

- `src/modules/core/theme/themePackBrushedBrass.ts`
- `src/styles/brushed-brass-neu.css`
- `DEFAULT_THEME_ID = SB-brushed-brass-neu`

## Nästa våg (ej kodat än)

- [ ] FloatingDock → 5 ikoner (Fyren centrum)
- [ ] HomePage → Dagens fokus + Snabbstart-layout
- [ ] Valv hub-kort (4 rader med färg-ikon)

