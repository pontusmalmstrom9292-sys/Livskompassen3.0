# Visuell Estetik och Designspråk

**Canonical:** [`docs/specs/design-master.md`](../docs/specs/design-master.md)  
**Aktivt tema:** **Theme Pack I** — [`THEME-I-SPEC.md`](../docs/design/themes/I-architect-vault/THEME-I-SPEC.md)

## Theme Pack I (prod 2026-05-24)

| ID | Modul |
|----|-------|
| I-stone | Hem, Valv, Widget expanded |
| I-alchemical | Kompass, Rutiner, Budget |
| I-skymning | MåBra, KBT, Familjen |
| I-hamn | Hamn |
| I-glass | Widget peek |

**Runtime:** `src/modules/core/theme/themeRegistry.ts` · **Preview:** `/dev/themes`  
**Default:** `I-stone` · **Auto per route:** `moduleThemeMap.ts`

## Estetik (I-stone / guld kärna)

- Bakgrund: obsidian `#0a0a0a`, guld `#d4af37`
- Typografi: **Outfit** (rubriker), **Inter** (bröd)
- Smart widget: `FyrenSmartWidgetBar` — hidden / peek / expanded
- Progressive disclosure — ett steg i taget
- **Förbjudet globalt:** indigo/lila text-accent, natur-tapeter

## Centrala Element

- **LivskompassHero:** guld kompass-hub på Hem
- **FyrenSmartWidgetBar:** klocka, Fokus·Struktur·Närvaro, WORM-routes
- **Sub-Synaptisk Bakgrund:** `AmbientBackground` + `data-theme-bg`

## Tailwind / CSS

- Tokens: `themeRegistry.ts` → `applyTheme()` → `:root` + `html[data-theme]`
- Glass: guld border 2px, accent-glow på widget-ikoner
- Modul-scoped mint (I-skymning): endast MåBra/Familjen — se [COLOR-POLICY.md](../docs/design/COLOR-POLICY.md)
