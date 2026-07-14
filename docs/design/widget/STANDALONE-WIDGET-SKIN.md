# Standalone Widget Skin — Design Authority

**Datum:** 2026-07-14  
**Status:** Godkänd för prod-extraktion (våg 2)  
**Preview:** `/dev/design-freeport` → panel **Widget Standalone**

## Filosofi

Fristående widgets ska kännas som en exklusiv kompakt kompass — inte som en avkortad app. Ingen synlig koppling till header/dock; panik «Dölj nu» istället för «Öppna app».

## Token-mapping (`--widget-*` → prod)

| Token | Värde / källa | Användning |
|-------|---------------|------------|
| `--widget-surface` | `color-mix(in srgb, var(--surface) 55%, transparent)` | Huvudyta |
| `--widget-surface-border` | `var(--border-strong)` | Glas-kant |
| `--widget-accent-glow` | radial gold 8% @ top | Bakgrund |
| `--widget-btn-min-h` | `2.75rem` (44px) | Alla CTA |
| `--widget-btn-radius` | `9999px` (pill) / `1rem` (tile) | Knapp vs tile |
| `--widget-morph-ms` | `350ms` | Chameleon morph |
| `--widget-tile-min-h` | `4.5rem` (72px) | Action tiles |

## Knapp-hierarki

1. **Primär** (`WidgetButton variant="accent"`) — en huvud-CTA per vy
2. **Sekundär** (`variant="secondary"`) — alternativ handling
3. **Ghost** (`variant="ghost"`) — panik, avbryt, «Ny anteckning»
4. **Tile** (`WidgetActionTile`) — grid 3–4 kolumner, icon + label

## Touch & a11y

- Min 44×44px på alla interaktiva element (G85)
- `prefers-reduced-motion`: ingen pulse/morph
- Focus-visible: accent ring 2px

## Prod-filer (våg 2+)

- `src/styles/widget-tokens.css`
- `src/modules/features/widgets/components/WidgetButton.tsx`
- `src/modules/features/widgets/components/WidgetActionTile.tsx`
- `src/modules/features/widgets/layout/WidgetShell.css`
