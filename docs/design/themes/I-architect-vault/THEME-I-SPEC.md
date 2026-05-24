# Tema I — Architect Vault (Theme Pack System)

**Status:** Implementerad i kod (2026-05-24)  
**Registry:** `src/modules/core/theme/themeRegistry.ts`  
**Preview:** `/dev/themes`

## Fem launch-skins

| Skin | Känsla | Mockup-referens |
|------|--------|-----------------|
| **I-stone** | Svart sten, klocka, smart widget | WIDGETEAR_SMART_MEN_STOR |
| **I-alchemical** | Guld marmor, rutiner/budget | Gulddesign_rutiner_budget |
| **I-skymning** | Aurora glass, KBT/MåBra | nordisk_skymning_bra |
| **I-hamn** | Trygg Hamn nautical | SNYGG_HEMSKA_RM |
| **I-glass** | Dual peek — Snabbanteckning + Röst | WIDGET_2 |

## Smart Widget Bar

- **Komponent:** `FyrenSmartWidgetBar.tsx`
- **Tillstånd:** hidden → peek (dual glass) → expanded (klocka + ikonrad)
- **WORM:** Oförändrat — `/widget/inspelning`, `/widget/anteckning`

## Regler

- Valv/Widget: guld only (COLOR-POLICY)
- Skymning mint: endast MåBra/Familjen via modul-mapping
- Locked UX orörd

Se [THEME-PACK-FORMAT.md](./THEME-PACK-FORMAT.md).
