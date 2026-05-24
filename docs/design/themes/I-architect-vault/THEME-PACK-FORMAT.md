# Theme Pack Format

**Syfte:** Ett nytt coolt tema = en post i `themeRegistry.ts` + valfritt CSS-block. Inga komponentändringar.

## ThemePack-objekt

```typescript
{
  id: 'I-stone',           // data-theme på html
  label: 'Architect Stone',
  description: '...',
  background: 'texture-stone',  // data-theme-bg — styr ambient-bg
  cssVars: {
    '--bg': '#0a0a0a',
    '--accent': '#d4af37',
    // ... se types.ts
  },
}
```

## Launch-skins (I-serien)

| ID | Modul | Bakgrund |
|----|-------|----------|
| I-stone | Hem, Valv, Widget expanded | texture-stone |
| I-alchemical | Kompass, Rutiner, Budget | texture-marble |
| I-skymning | MåBra, Familjen | aurora |
| I-hamn | Hamn | nautical |
| I-glass | Widget peek | texture-stone |

## Runtime

- `src/modules/core/theme/themeRegistry.ts` — alla packs
- `applyTheme(id)` — sätter CSS-variabler + `data-theme` / `data-theme-bg`
- `moduleThemeMap.ts` — route → default skin (auto-läge)
- `/dev/themes` — live preview

## Nytt tema (3 steg)

1. Lägg pack i `THEME_REGISTRY`
2. (Valfritt) Lägg route i `MODULE_THEME_MAP`
3. Testa på `/dev/themes`
