# Visuell Estetik och Designspråk

**Canonical:** [`docs/specs/design-master.md`](../docs/specs/design-master.md)  
**Aktivt tema:** **Theme Pack I** (default) + **Pack J** (auto per hub) — [`THEME-I-SPEC.md`](../docs/design/themes/I-architect-vault/THEME-I-SPEC.md) · [`J-PACK-EIGHT-HUBS.md`](../docs/design/themes/J-PACK-EIGHT-HUBS.md)

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
- Typografi: **Outfit** (rubriker), **Inter** (bröd) — skala: [`TYPE-SCALE.md`](../docs/design/TYPE-SCALE.md) · `HubPageShell`
- Smart widget: `FyrenSmartWidgetBar` — hidden / peek / expanded
- Progressive disclosure — ett steg i taget
- **Förbjudet globalt:** indigo/lila text-accent, natur-tapeter

## Ikoner (Premium Helros)

- **Låst:** B1 app · D1 kompass · M3 Kompis — [`.context/locked-icons.md`](locked-icons.md)
- **Stilguide:** [`docs/design/ICON-STYLE-GUIDE.md`](../docs/design/ICON-STYLE-GUIDE.md)
- **Övriga:** förslag i `docs/design/icons-proposals/2026-05-26-remaining/`

## Centrala Element

- **LivskompassHero:** guld kompass-hub på Hem
- **FyrenSmartWidgetBar:** klocka, Fokus·Struktur·Närvaro, WORM-routes
- **Sub-Synaptisk Bakgrund:** `AmbientBackground` + `data-theme-bg`

## Tailwind / CSS

- Tokens: `themeRegistry.ts` → `applyTheme()` → `:root` + `html[data-theme]`
- Glass: guld border 2px, accent-glow på widget-ikoner
- Chrome (dock/widget/meny): [CHROME-POLICY.md](../docs/design/CHROME-POLICY.md) · nav: `navTruth.ts`
- Hub-färger (J-pack): se [COLOR-POLICY.md](../docs/design/COLOR-POLICY.md)
