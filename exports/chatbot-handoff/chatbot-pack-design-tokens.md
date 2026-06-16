This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: docs/design/COLOR-POLICY.md, docs/design/TYPE-SCALE.md, docs/design/CHROME-POLICY.md, docs/design/CHROME-EMBER-KANON.md, docs/design/theme-lab/VARIANTS.md, docs/external-ai/DESIGN-KEEP-REGISTER.md, src/index.css, tailwind.config.js, src/modules/core/theme/themeRegistry.ts, src/modules/core/theme/typeScale.ts, src/styles/obsidian-calm-2.css
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

## File: docs/design/CHROME-EMBER-KANON.md
```markdown
# Chrome Ember — låst färgkanon (header + dock)

**Beslut:** 2026-05-29 · **Status:** LÅST för prod  
**Godkänd av:** produkt (skärmdump Projekt + Hem — guld på obsidian, header och dock matchar)

Ändra **inte** flat `chrome-strip-surface` (svart glas) på dock/header utan explicit beslut och uppdatering av denna fil + `npm run smoke:design-modules`.

---

## Aktivering

| Env | Värde | Effekt |
|-----|-------|--------|
| `VITE_HEADER_PANEL_STYLE` | **`ember`** (standard om saknas) | `AppHeaderBar` + `DockHubBand` får `data-panel-style="ember"` |

Kod: `src/modules/core/layout/headerPanelStyle.ts` · CSS: `src/index.css` (`.glass-header-bar--kanon[data-panel-style='ember']` + `.dock-hub-band[data-panel-style='ember']`).

---

## Kärnpalett (tokens)

| Token | Värde | Användning |
|-------|-------|------------|
| `--text-gold` | `#d4af37` | Kant, ikoner, accent |
| `--accent-light` | `#e8d48a` | Titlar, banner-text |
| `--bg` / skal | `#0a1614` → obsidian `#020617` gradient | App-bakgrund |
| Guld kant (ember) | `rgba(212, 175, 55, 0.42)` | 2px panelram header + dock-rail |
| Topp-highlight | `#fff3c4` → `#d4af37` @ 50% | `::before` linje på panel |
| Panel-gradient topp | `rgba(42, 34, 22, 0.94)` | Varm brons |
| Panel-gradient botten | `rgba(6, 8, 18, 0.88)` | Kall obsidian |

---

## 3D-knappar (`header-chrome-btn`)

Dock-ikoner och header (meny, konto, Kompis, kompass-mitt) delar samma knappchrome:

- Kant: `color-mix(in srgb, var(--accent) 42%, transparent)` · 1.5px  
- Gradient: `rgba(58, 48, 32)` → `rgba(8, 10, 16)`  
- Inset highlight: `rgba(255, 243, 210, 0.18)`  
- Glyph glow: `drop-shadow` + `rgba(212, 175, 55, 0.32)`

---

## Komponenter (sanning i kod)

| Yta | Klass / komponent |
|-----|-------------------|
| Header panel | `glass-header-bar--kanon` + `data-panel-style` |
| Dock rail | `dock-hub-band__rail` + samma `data-panel-style` |
| Dock hub-pill | `dock-hub-band__banner-text` (ember-gradient) |
| Mitt kompass | `LivskompassMark` (D1) i `header-chrome-btn--logo` |

---

## Får inte (utan ny PMIR)

- Byta dock till platt `rgba(10, 10, 10, 0.55)` medan header är ember 3D  
- Olika `data-panel-style` på header vs dock  
- Indigo/lila global accent (design-language förbud)

---

## Smoke

`npm run smoke:design-modules` — verifierar fil + wiring.  
Visuellt: jämför header och dock på `/` och `/projekt` efter ändring.
```

## File: docs/design/CHROME-POLICY.md
```markdown
# Chrome-policy — dock, widget, sidfötter

**Version:** 2026-05-27 · **Sanning:** `src/modules/core/navigation/navTruth.ts`  
**Ikoner:** låst B1/D1/M2 — [`ICON-STYLE-GUIDE.md`](./ICON-STYLE-GUIDE.md) · chrome-förslag: [`icons-proposals/2026-05-26-v4-round2-dna/`](./icons-proposals/2026-05-26-v4-round2-dna/)

## Lager (botten → topp)

| Lager | Komponent | Var | Policy |
|-------|-----------|-----|--------|
| 1 | **FloatingDock** | `FloatingDock.tsx` | `DockHubBand` (standard) eller `CompassHubOrb` om `VITE_DOCK_ORBIT=true` — se [DOCK-KANON](references/DOCK-KANON.md) |
| 2 | **FyrenSmartWidgetBar** | `FyrenSmartWidgetBar.tsx` | Kanonisk W1–W4; dold på `/widget/*` |
| 3 | **NavigationDrawer** | Portal vänster | Vardag-hubbar; Valv-meny endast efter PIN på Valv-route ([MENU-DRAWER-KANON](references/MENU-DRAWER-KANON.md)) |
| 4 | **Drawer snabbåtgärder (legacy)** | `DrawerQuickActions.tsx`, `DrawerHomeQuickActions.tsx` | **Ej** monterade i drawer ([MENU-DRAWER-KANON](references/MENU-DRAWER-KANON.md)); snabbvägar via Fyren-widget / hub «Mer» |
| 5 | **Modul-footer** | `HubPageShell.footerSlot` | Valfri diskret rad — inte tredje fast bar |

## Modul-footer (P1)

| Hub | Footer |
|-----|--------|
| Familjen | `ParentReminderFooter` på fliken Reflektion (`footerSlot`) |
| MåBra, Planering | Ingen modul-footer i P1 |

## Ej i P1

- `FyrenWidgetBar` (legacy, ej monterad)
- `PlaneringSubNav` (galleri-spec — flikar via `TabBar` idag)

## Scroll-padding

`MainLayout` `main` använder `pb-24` så innehåll inte döljs under dock + widget.

## App-header + dock — panelstilar (3D)

`AppHeaderBar` och `DockHubBand` delar `data-panel-style` via `resolveHeaderPanelStyle()` (`headerPanelStyle.ts`).

| Värde | Känsla |
|-------|--------|
| **`ember`** | **Prod-kanon** — varm guld/brons (standard om env saknas) |
| `obsidian` | Kall slate, silver highlight |
| `aurora` | Teal + indigo glöd |

`.env`: `VITE_HEADER_PANEL_STYLE=ember` (rekommenderat) · `obsidian` · `aurora`

**Låsta ember-färger (2026-05-29):** [`CHROME-EMBER-KANON.md`](./CHROME-EMBER-KANON.md) — exakta gradient/kant/glow; header och dock ska alltid matcha.

## Hub «Mer» (duplicering)

Snabbval (anteckning, inspelning, inköpslista, …) **får inte** ligga i sidomenyn — se [MENU-DRAWER-KANON](references/MENU-DRAWER-KANON.md). De nås via **Fyren-widget**, hub «Mer» eller `DockHubBand` genvägar — **inte** som extra rad ovanför dock. `FyrenSmartWidgetBar` renderar inget UI (undviker dubbel rad med samma knappar).
```

## File: docs/design/COLOR-POLICY.md
```markdown
# Färgpolicy — inga blå/turkosa accenter (globalt)

**Datum:** 2026-05-23 · uppdaterad **2026-05-25** (Theme Pack I + J hub-auto)  
**Beslut:** Avveckla indigo, cyan, teal, electric blue i **kärn-UI** (Valv, Widget, BIFF, dock).

## Ersättning

| Tidigare | Ny riktning |
|----------|-------------|
| `--accent-secondary: #818cf8` (indigo) | Guld `#d4af37` eller varm amber `#f59e0b` |
| Cyber Emerald `#2dd4bf` som primär | Endast **success**-state sparsamt, eller varm grön `#6b8f71` |
| Tema C / E aurora blå-grön | **Theme Pack I** + F/G/H mockups |

## Aktiva teman — runtime (Theme Pack I)

| ID | Namn | Användning |
|----|------|------------|
| **I-stone** | Architect Stone | Hem, Valv, Widget expanded, Planering |
| **I-alchemical** | Alchemical Gold | Kompass, Rutiner, Budget |
| **I-skymning** | Nordic Skymning | MåBra, KBT, Familjen (**modul-scoped mint**) |
| **I-hamn** | Trygg Hamn | Hamn |
| **I-glass** | Dual Glass | Widget peek |

**Registry:** `src/modules/core/theme/themeRegistry.ts` · **Preview:** `/dev/themes`

### Theme Pack J — auto per hub (2026-05-25)

När **Auto-modul** är på i Inställningar sätter `moduleThemeMap.ts` hub-tema (lavendel MåBra, amber Planering, varm Familjen, …). Se [`themes/J-PACK-EIGHT-HUBS.md`](themes/J-PACK-EIGHT-HUBS.md).

| Route | J-tema | Accent (primär) |
|-------|--------|-----------------|
| `/mabra` | `J-mabra-lavendel` | Lavendel + guld — **inte** mint |
| `/planering` | `J-planering-fyren` | Amber / guld |
| `/familjen` | `J-familjen-varm` | Rose-gold / varm |

**Sidomeny:** aktiv rad alltid **guld** — oberoende av hub-tema.

### Legacy — I-skymning mint (referens)

**I-skymning** mint `#4fd1c5` finns kvar i registry för lab/preview — **inte** prod-default för `/mabra` när J-pack auto är aktivt.

## Legacy mockups (referens)

| ID | Namn | Användning |
|----|------|------------|
| **F** | Guld Pansar | Valv-typografi, juridisk känsla |
| **G** | Varm Hamn | Barnfokus mockups |
| **H** | Grafit Grey Rock | BIFF, minimal kontrast |

**Kompass:** Behålls i alla (guld-emblem).

## Arkiverade (referens only)

Tema A–E i `docs/design/themes/` — använd **inte** blå accenter i Valv/Widget globalt.
```

## File: docs/design/TYPE-SCALE.md
```markdown
# Typografi-skala (runtime)

**Version:** 2026-05-25 · **Kod:** `src/modules/core/ui/typeScale.ts`

## Roller

| Token | Storlek | Font | Användning |
|-------|---------|------|------------|
| `eyebrow` | 10px, caps | Inter | Zonnamn (MåBra, Planering, …) |
| `titleHub` | xl, light | Outfit | Hub-rubrik |
| `leadHub` | sm | Inter | En mening under rubrik |
| `titleSection` | sm semibold | Outfit | Bento / sektionsrubrik |
| `body` | sm | Inter | Brödtext |
| `label` | xs caps | Inter | Kanban, mikrolabels |

## Hub-sidor

Använd `HubPageShell` eller `hubHeaderClasses()` — **inte** ad hoc `text-xl` / `text-xs` på samma element som `home-page__*`.

## Legacy

`design-master.md` §3 beskriver font-val; denna fil är **runtime-sanning** för storlekar.
```

## File: docs/external-ai/DESIGN-KEEP-REGISTER.md
```markdown
# DESIGN-KEEP-REGISTER — vad som är aktivt

Filer i `docs/design/` som **används nu** — rör ej vid städning.

## Specs & policy (KEEP)

- `docs/design/COLOR-POLICY.md`
- `docs/design/CHROME-POLICY.md`
- `docs/design/CHROME-EMBER-KANON.md`
- `docs/design/TYPE-SCALE.md`
- `docs/design/ICON-STYLE-GUIDE.md`
- `docs/design/KOMPASS-MODUL-SPEC.md`
- `docs/design/PLANERING-PROJEKT-HYBRID.md`
- `docs/design/PLANERINGSSIDA-SPEC.md`
- `docs/design/WIDGET-BAR-SPEC.md`
- `docs/design/BARNPORTEN-SPEC.md`
- `docs/design/VALV-HUBB-SPEC.md`
- `docs/design/FAMILJEN-HUB-SPEC.md`
- `docs/design/ANDROID-WIDGETS-SPEC.md`
- `docs/design/HOMESCREEN-WIDGETS-SPEC.md`
- `docs/design/MABRA-PROJEKT-VIT-HUB-SPEC.md`
- `docs/design/planering/PLANERING-P3-KANBAN-SPEC.md`

## References / kanon (KEEP)

- `docs/design/references/MENU-DRAWER-KANON.md`
- `docs/design/references/DOCK-KANON.md`
- `docs/design/references/VALV-ICON-KANON.md`
- `docs/design/references/KOMPASS-TRE-TIDPUNKTER.md`

## Galleri — låst widget (KEEP)

- `docs/design/galleri/widget/v2/` — W1–W4 (locked UX hybrid)
- `docs/design/galleri/barnporten/` — barnporten-infografik
- `docs/design/galleri/README.md`

## Tema — aktivt (KEEP)

- `src/styles/obsidian-calm-2.css` (kod — inte i design-mappen)
- `docs/design/themes/phone-icon-variants/PREVIEW.md`
- `docs/design/theme-lab/` (om aktiv Theme Lab-session)

## Ikoner låsta (KEEP — kod)

- `.context/locked-icons.md` — D1, M2, WH1, WH2

## ARKIV-KANDIDATER (zon för zon)

| Mapp | Antal (ca) | Destinationsförslag |
|------|------------|---------------------|
| `docs/design/icons-proposals/` | 200+ SVG | `docs/archive/design-2026-06/icons-proposals/` |
| `docs/design/redesign-proposals/` | STYLE A/B/C | `docs/archive/design-2026-06/redesign-proposals/` |
| `docs/design/themes/` (ej aktiv) | A-sacred, B-elevated, E-aurora, kognitiv-skold | `docs/archive/design-2026-06/themes/` |
| `docs/design/compact/` | gamla modul-mockups | `docs/archive/design-2026-06/compact/` |

**Regel:** Flytta, radera inte — förrän Pontus godkänt HYGIENE-LOG-rad.
```

## File: tailwind.config.js
```javascript
function cssVar(name)
```

## File: src/modules/core/theme/themeRegistry.ts
```typescript
import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';
import { THEME_PACK_DESIGN } from './themePackDesign';
import { THEME_PACK_E_PROD } from './themePackE';
import { THEME_PACK_MOCKUP } from './themePackMockup';
import { THEME_PACK_K } from './themePackK';
import { THEME_PACK_REDESIGN_A } from './themePackRedesignA';
import { THEME_PACK_OBSIDIAN_DEPTH } from './themePackObsidianDepth';
import { THEME_PACK_REMIX_E_HAMN } from './themePackRemix';
⋮----
export function resolveThemeId(id: string): string
⋮----
export function getTheme(id: string): ThemePack
```

## File: docs/design/theme-lab/VARIANTS.md
```markdown
# Theme Lab — variantbeslut

**Uppdaterad:** 2026-06-15 (R-E-hamn-remix prod default)

| ID | Label | Status | Test / beslut |
|----|-------|--------|----------------|
| `R-E-hamn-remix` | E + Hamn remix | **GODKÄND prod** | **default 2026-06-15** — Tema E guld + D1 chrome (mix-E) |
| `D1-hamn-kompass` | Design Hamn & kompass | **experiment** | Hamn orbit + ref-hamn |
| `D2-familjen-kort` | Design Familjen | **experiment** | Radkort + ref-familjen.png |
| `D3-minnes-timeline` | Design Minnes | **experiment** | Tidslinje + guld CTA |
| `D4-flat-deluxe` | Design flat deluxe | **arkiv** | föregående prod default 2026-06-07 |
| `D4-flat-luxe` | *(alias)* | arkiv | → `D4-flat-deluxe` |
| `D5-aurora-glas` | Design aurora | **experiment** | Glas + aurora |
| `M1-mockup-meny` | Mockup sidomeny | **experiment** | äldre tokens |
| `M2-mockup-hamn` | Mockup Hem/Hamn | **experiment** | **default 2026-06-01** — kompass på hem |
| `M3-mockup-familjen` | Mockup Familjen | **experiment** | Varm kortlista |
| `M4-mockup-kompis` | Mockup Kompis | **experiment** | Aurora glas |
| `E-skymning-prod` | Nordic Skymning (E) | arkiv | Föregående prod-försök |
| `I-stone` | Architect Stone | legacy | Lab / manuellt val |
| `I-stone-draft-photo` | Stone — tydligare foto | utkast | `/dev/theme-lab` → ljusare `--glass` |
| `I-stone-draft-glow` | Stone — starkare guld glow | utkast | Starkare `--accent-glow`, kanter |
| `I-stone-draft-twilight` | Stone — skymning | utkast | Kallare `--bg`, mjukare guld, kväll |
| `I-stone-draft-bronze` | Stone — brons | utkast | Varm brons/roséguld accent |
| `I-stone-draft-matte` | Stone — matt | utkast | Plattare glas, svag glow (låg last) |
| `R-A-nordic-precision` | Nordic Precision (Style A) | **arkiv rollback** | föregående prod default 2026-06-11 |
| `OD-obsidian-depth` | Obsidian Depth (3D) | **LÅST** | **2026-06-14** — glass bento, taktil 3D, guld endast · `/dev/obsidian-depth` |
| `OD-forge-lab` | Obsidian Forge (syntes) | **utvärdering** | **2026-06-14** — hero+bento+chrome · `/dev/obsidian-forge` · väntar godkännande |

**Jämför:** http://localhost:5173/dev/theme-lab → Utkast (agent) → Förhandsgranska → **Använd i appen** → testa `/` (Hem).

## Theme Pack J (hub + widget, 2026-05-25)

| ID | Label | Status | Hubb |
|----|-------|--------|------|
| `J-fyren-hem` | Fyren Hem | **utkast** | Hem, WH3 |
| `J-valv-pansar` | Valv Pansar | **utkast** | Valv, WH1 |
| `J-planering-fyren` | Planering Fyren | **godkänd** | Planering, Projekt — **GODKÄND** (2026-05-29) |
| `J-familjen-varm` | Familjen Varm | **utkast** | Familjen, WH5 |
| `J-hamn-greyrock` | Hamn Grey Rock | **utkast** | Hamn, WH4 |
| `J-mabra-lavendel` | MåBra Lavendel | **utkast** | MåBra |
| `J-barnporten-ljus` | Barnporten Ljus | **utkast** | Barnporten (plan) |
| `J-vardagen-orbit` | Vardagen Orbit | **utkast** | Vardagen-flikar, WH2 |

Spec: [`../themes/J-PACK-EIGHT-HUBS.md`](../themes/J-PACK-EIGHT-HUBS.md)

## Theme Pack K (nya varianter, 2026-05-28)

**Kod:** `themePackK.ts` → spread i `themeRegistry.ts` · sektion i `/dev/theme-lab` · alla 8 i `/dev/themes`.  
**Verifiering:** `npm run build` PASS · `npm run smoke:locked-ux` PASS (2026-05-29).  
**Auto per hub:** oförändrat Pack J (`moduleThemeMap.ts`).

| ID | Label | Status | Notering |
|----|-------|--------|----------|
| `K-obsidian-deep` | Obsidian Djup | **utkast** | wired · brons + svart |
| `K-copper-forge` | Koppar Smedja | **utkast** | wired · koppar/marmor |
| `K-sage-calm` | Salvia Lugn | **utkast** | wired · salvia + guld |
| `K-plum-night` | Plommon Natt | **utkast** | wired · plommon/vin |
| `K-slate-balance` | Skiffer Balans | **utkast** | wired · neutral grå |
| `K-honey-dawn` | Honung Gryning | **utkast** | wired · honung/amber |
| `K-ivory-vault` | Elfenben Valv | **utkast** | wired · ljusare arkv |
| `K-ember-focus` | Glöd Fokus | **utkast** | wired · ember + guld |

Spec: [`../themes/K-PACK-EIGHT-VARIANTS.md`](../themes/K-PACK-EIGHT-VARIANTS.md)

## Godkännande

- **GODKÄND: `R-E-hamn-remix`** — helapp default (`DEFAULT_THEME_ID`) 2026-06-15. Tema E guld + D1 designpaket-chrome.
- **ROLLBACK-ref:** `R-A-nordic-precision` — föregående prod default 2026-06-11.
- **LÅST: `OD-obsidian-depth`** — fylligare 3D-skalet (mockup + theme pack). Ej prod-default. Knappar/menyer förfinas separat. Se `OBSIDIAN-DEPTH-SPEC.md`.
- **ROLLBACK-ref:** `D4-flat-deluxe` — prod default 2026-06-07.
- **GODKÄND: `J-planering-fyren`** — Planering + Projekt (`moduleThemeMap.ts`). Valv: `J-valv-pansar`.

| ID | Typ | Status | Prompt / fil |
|----|-----|--------|--------------|
| `F1-dagbok-snabb-wireframe` | Gemini Imagen wireframe | **referens** | Se Cursor-plan Steg F1 — Obsidian Calm `#020617`, guld `#FDE68A`, etiketter Humör/Taggar/Spara känslan |
| `F2-barnporten-flow` | Google Flow 15s | **valfritt** | Mörk navy, abstrakt kompassros, ingen text — onboarding-referens Barnporten |

**Regel:** Godkänn i tabellen ovan innan prod-tema eller ikon ändras. D1/M2 låsta — se `.context/locked-icons.md`.


- **GODKÄND: `J-planering-fyren`** — Planering + Projekt (`moduleThemeMap.ts` rad 19–20). Övriga hubbar oförändrade.
- Nästa val: skriv **GODKÄND: &lt;id&gt;** för global bas eller fler J-hubbar.
```

## File: src/styles/obsidian-calm-2.css
```css
@layer components {
⋮----
.calm-card {
⋮----
.bento-card {
⋮----
.bento-card:not(.module-bento-card--depth):hover {
⋮----
.bento-card:not(.module-bento-card--depth) {
⋮----
.calm-card::before {
⋮----
/* Legacy-alias — samma yta som calm-card */
.glass-card {
⋮----
.glass-card::before {
⋮----
.app-shell .glass-card,
⋮----
/* —— Hub shell: Bento top-bar —— */
.hub-page-shell--obsidian-bento {
⋮----
.hub-page-shell__top-bar--glass {
⋮----
.hub-page-shell__header-aside {
⋮----
.hub-page-shell__header-aside .btn-pill,
⋮----
.hub-page-shell__header--bento {
⋮----
.hub-page-shell__header--bento::before {
⋮----
/* Module toolbar — glass strip for HubDropdownNav / hub pills */
.module-shell__toolbar--bento {
⋮----
.module-shell__toolbar--bento::before {
⋮----
/* Bento icon boxes — silo accent coding */
.bento-icon-box {
⋮----
.bento-icon-box--gold {
⋮----
.bento-icon-box--indigo {
⋮----
.bento-icon-box--emerald {
⋮----
.bento-card.glow-bottom-gold .bento-icon-box:not([class*='--']) {
⋮----
.bento-card.glow-bottom-blue .bento-icon-box:not([class*='--']) {
⋮----
.bento-card.glow-bottom-green .bento-icon-box:not([class*='--']) {
⋮----
.glass-hero {
⋮----
.glass-hero::before {
⋮----
/* —— Silo-botten-glow —— */
.glow-bottom-gold {
⋮----
.glow-bottom-blue {
⋮----
.glow-bottom-green {
⋮----
/* Subtil gradient i kortets nedre kant (under innehåll) */
.calm-card.glow-bottom-gold::after,
⋮----
.calm-card.glow-bottom-blue::after,
⋮----
.calm-card.glow-bottom-green::after,
⋮----
.calm-card > *,
⋮----
/* —— Hub: ingen sid-scroll, island-scroll —— */
.hub-view-lock {
⋮----
.hub-view-lock .hub-page-shell__header,
⋮----
.hub-view-lock .hub-page-shell__body {
⋮----
/* Stricter one-viewport fit — mobile hub modules */
⋮----
.hub-view-lock--fit {
⋮----
.hub-view-lock--fit .module-shell__stack {
⋮----
.hub-view-lock--fit .hub-page-shell__footer {
⋮----
.hub-view-lock--fit .calm-scroll-island {
⋮----
.calm-scroll-island {
⋮----
/* Familjen superhub — flow följer yttre calm-scroll-island (ingen nested scroll) */
.hub-view-lock--fit .familjen-input-hub--flow,
⋮----
/* —— Liv launcher — stora kort (Fas 2) —— */
.liv-launcher-grid {
⋮----
.liv-launcher-card {
⋮----
.liv-launcher-card:hover {
⋮----
.liv-launcher-card--active {
⋮----
.liv-launcher-card__icon {
⋮----
.liv-launcher-card--external .liv-launcher-card__icon {
⋮----
.liv-launcher-card__body {
⋮----
.liv-launcher-card__label {
⋮----
.liv-launcher-card__hint {
⋮----
.liv-launcher-card__preview {
⋮----
.liv-launcher-card__chevron {
⋮----
.liv-launcher-card--external:hover .liv-launcher-card__chevron,
⋮----
/* Style A — Nordic Precision: skarpare hörn, minimal glow */
[data-theme='R-A-nordic-precision'] .calm-card,
⋮----
:root {
⋮----
a.btn-pill--ghost,
⋮----
a.btn-pill--ghost::before,
⋮----
a.btn-pill--ghost:hover:not(:disabled)::before,
⋮----
a.btn-pill--secondary::before,
⋮----
a.btn-pill--secondary:hover:not(:disabled)::before,
⋮----
a.btn-pill--ghost:active:not(:disabled),
⋮----
.supermodule-hub-chrome {
⋮----
.supermodule-hub-chrome .od-depth__eyebrow,
```

## File: src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
⋮----
@layer utilities {
⋮----
.font-display-serif {
⋮----
:root {
⋮----
@layer base {
⋮----
body {
⋮----
h1,
⋮----
.tabular-nums {
⋮----
html[data-theme='E-skymning-prod'] {
⋮----
html[data-theme='I-stone'],
⋮----
html[data-theme='I-stone-draft-twilight'] {
⋮----
html[data-theme='I-stone-draft-bronze'] {
⋮----
html[data-theme='I-alchemical'] {
⋮----
html[data-theme='I-skymning'] {
⋮----
html[data-theme='I-hamn'] {
⋮----
html[data-theme='I-glass'] {
⋮----
.ambient-bg {
⋮----
.ambient-bg__compass-rose {
⋮----
.ambient-bg::before {
⋮----
.ambient-blob {
⋮----
.ambient-blob--gold {
⋮----
.ambient-blob--indigo {
⋮----
.ambient-blob--accent-secondary {
⋮----
html[data-theme-bg='texture-stone'] .ambient-bg:not(.ambient-bg--scenic) {
⋮----
.ambient-bg.ambient-bg--scenic,
⋮----
.app-shell:has(.home-page--scenic) .ambient-bg.ambient-bg--scenic {
⋮----
.ambient-bg--scenic .ambient-blob--gold {
⋮----
.ambient-bg--scenic .ambient-blob--accent-secondary {
⋮----
.app-shell {
⋮----
.theme-lab-strip {
⋮----
.theme-lab-strip__dock {
⋮----
.theme-lab-strip__dock-side,
⋮----
.theme-lab-strip__row {
⋮----
.theme-lab-strip__row-icon {
⋮----
.theme-lab-strip__row-label {
⋮----
.theme-lab-strip__compass {
⋮----
.theme-lab-strip__compass-ring {
⋮----
.theme-lab-strip__compass-mark {
⋮----
.theme-lab-strip__scenic {
⋮----
html[data-theme-bg='texture-marble'] .ambient-bg {
⋮----
html[data-theme-bg='aurora'] .ambient-bg {
⋮----
html[data-theme-bg='nautical'] .ambient-bg {
⋮----
html[data-theme-bg='gradient'] .ambient-bg {
⋮----
html[data-theme-bg='mockup-scenic'] .ambient-bg.ambient-bg--scenic,
⋮----
html[data-theme-bg='mockup-aurora'] .ambient-bg.ambient-bg--scenic {
⋮----
html[data-theme^='M-mockup-'] .ambient-blob--gold {
⋮----
html[data-theme^='M-mockup-'] .glass-card {
⋮----
html[data-theme^='M-mockup-'] .hub-page-shell__title,
⋮----
html[data-theme^='M-mockup-'] .home-greeting--mockup .home-greeting__tagline {
⋮----
html[data-theme^='M-mockup-'] .chip--active {
⋮----
html[data-theme^='M-mockup-'] .btn-pill--accent {
⋮----
html[data-theme^='M-mockup-'] .home-hero-kanon--mockup {
⋮----
html[data-theme^='M-mockup-'] .home-hero-kanon--mockup .home-hero-kanon__header {
⋮----
html[data-theme^='M-mockup-'] .home-hero-kanon--mockup .home-hero-kanon__header .home-greeting--mockup {
⋮----
@apply pb-2;
⋮----
.home-page--mockup-skin .home-hero-kanon__bridge {
⋮----
.home-page--mockup-skin .home-hero-kanon__compass-stage {
⋮----
.livskompass-hero--embedded {
⋮----
.livskompass-hero--embedded .livskompass-hero__shield-label {
⋮----
.livskompass-hero--embedded .livskompass-hero__hint {
⋮----
.livskompass-hero--embedded.livskompass-hero--h1-full {
⋮----
.livskompass-hero--embedded.livskompass-hero--h1-alpha {
⋮----
.livskompass-hero--embedded.livskompass-hero--h1-alpha .livskompass-hero__disk-surface {
⋮----
html[data-theme^='M-mockup-'] .app-main {
⋮----
.ambient-blob--white {
⋮----
.glass-nav {
⋮----
.app-header {
⋮----
.glass-header-bar {
⋮----
.glass-header-bar::before {
⋮----
.app-header__brand {
⋮----
.app-header__logo {
⋮----
.app-header__title {
⋮----
.app-header__actions {
⋮----
.header-glass-btn {
⋮----
.header-glass-btn:hover {
⋮----
.header-glass-btn--active {
⋮----
.header-glass-btn--avatar {
⋮----
.header-glass-btn--avatar:hover {
⋮----
.app-main {
⋮----
.dock-shell--fyren {
⋮----
.dock-shell {
⋮----
.dock-shell .dock-classic {
⋮----
.dock-nav {
⋮----
.dock-nav--hub {
⋮----
.dock-orbit-stage {
⋮----
/* Båge under kompass borttagen 2026-05-23 — se VALV-ICON-KANON / DOCK-KANON */
⋮----
.dock-classic {
⋮----
.dock-classic__side {
⋮----
.dock-classic__side--active {
⋮----
@apply text-accent;
⋮----
.dock-classic__side-icon {
⋮----
.dock-classic__side--active .dock-classic__side-icon {
⋮----
.dock-classic__side-label {
⋮----
.dock-classic__side--active .dock-classic__side-label {
⋮----
.dock-classic__center {
⋮----
.dock-classic__center:hover {
⋮----
/* Dölj eventuell centrum-text — endast kompass (DOCK-KANON) */
.dock-classic__center .dock-classic__side-label,
⋮----
.dock-classic__plate {
⋮----
.dock-classic__center--active .dock-classic__plate {
⋮----
.dock-classic__mark {
⋮----
.dock-classic__center--holding .dock-classic__plate {
⋮----
.dock-classic__context {
⋮----
.dock-classic__context-title {
⋮----
.dock-classic__context-body {
⋮----
.dock-classic__context-close {
⋮----
/* L2 hub-chrome tile (dock band, Mer-panel) */
.hub-chrome-tile {
⋮----
.hub-chrome-tile::before {
⋮----
.hub-chrome-tile--side {
⋮----
@apply rounded-full;
⋮----
.hub-chrome-tile--dock {
⋮----
.hub-chrome-tile--dock-side {
⋮----
.hub-chrome-tile--active {
⋮----
/* Dock hub band — kapselknappar kring kompass */
.dock-hub-band {
⋮----
.dock-hub-band__rail {
⋮----
.dock-hub-band__rail::before {
⋮----
.dock-hub-band__rail::after {
⋮----
.dock-hub-band__pad {
⋮----
.dock-hub-band__context {
⋮----
@apply hidden;
⋮----
.dock-nav-btn {
⋮----
.dock-nav-btn--side {
⋮----
.dock-nav-btn:hover {
⋮----
.dock-nav-btn__icon-shell {
⋮----
@apply overflow-hidden;
⋮----
.dock-nav-btn__chrome-v4 {
⋮----
.dock-nav-btn__icon-shell--side .dock-nav-btn__chrome-v4,
⋮----
.dock-hub-band__rail .hub-chrome-tile--dock,
⋮----
.dock-nav-btn:hover .hub-chrome-tile--dock,
⋮----
.dock-nav-btn:hover .dock-nav-btn__chrome-v4 {
⋮----
.dock-nav-btn--active .dock-nav-btn__chrome-v4 {
⋮----
.dock-nav-btn:active .dock-nav-btn__icon-shell.hub-chrome-tile {
⋮----
.dock-nav-btn__glyph {
⋮----
.dock-nav-btn__label {
⋮----
.dock-nav-btn__label--active,
⋮----
a.dock-nav-btn {
⋮----
.dock-hub-band__center {
⋮----
.dock-hub-band__center-glow {
⋮----
.dock-hub-band__plate {
⋮----
.dock-hub-band__plate::before {
⋮----
.dock-hub-band__center:hover .dock-hub-band__plate {
⋮----
.dock-hub-band__center:active .dock-hub-band__plate {
⋮----
.dock-hub-band__center--active .dock-hub-band__plate,
⋮----
.dock-hub-band__center--holding .dock-hub-band__plate {
⋮----
.dock-hub-band__mark {
⋮----
/* FloatingDock — slimmad kapsel, kompass störst men inte klumpig */
.floating-dock .dock-hub-band__rail {
⋮----
.floating-dock .dock-hub-band__rail--zones {
⋮----
.floating-dock__side-btn {
⋮----
.floating-dock__side-btn.dock-nav-btn {
⋮----
.floating-dock__side-btn .dock-nav-btn__icon-shell--calm {
⋮----
.floating-dock__side-btn:hover .dock-nav-btn__icon-shell--calm {
⋮----
.floating-dock__side-btn.dock-nav-btn--active .dock-nav-btn__icon-shell--calm {
⋮----
.floating-dock__side-btn .dock-nav-btn__drawer-l2 {
⋮----
.floating-dock__side-btn.dock-nav-btn--active .dock-nav-btn__drawer-l2 {
⋮----
.floating-dock__side-btn .dock-nav-btn__label {
⋮----
.floating-dock__center-glow {
⋮----
.floating-dock__plate {
⋮----
.floating-dock__mark {
⋮----
.floating-dock__arc {
⋮----
.fyren-dock-handle {
⋮----
.fyren-dock-handle__lip {
⋮----
.fyren-dock-handle__label {
⋮----
.fyren-dock-handle__chevron {
⋮----
.fyren-dock-handle:hover {
⋮----
.fyren-dock-handle--open {
⋮----
.fyren-dock-handle--open .fyren-dock-handle__chevron {
⋮----
.fyren-dock-handle--holding {
⋮----
.floating-dock .dock-hub-band__center:hover .floating-dock__plate {
⋮----
.floating-dock .dock-hub-band__rail--zones > .dock-hub-band__center:hover {
⋮----
.floating-dock .dock-hub-band__rail--zones > .dock-hub-band__center:active {
⋮----
.floating-dock .dock-hub-band__rail--zones > .dock-hub-band__center--active,
⋮----
.floating-dock .dock-hub-band__center--active .floating-dock__plate,
⋮----
.floating-dock .dock-hub-band__rail::before {
⋮----
.floating-dock .dock-hub-band__rail::after {
⋮----
.hub-preset-sheet__backdrop {
⋮----
.hub-preset-sheet {
⋮----
.hub-preset-sheet__close {
⋮----
body.hub-preset-sheet-open {
⋮----
.dock-hub-backdrop {
⋮----
.dock-hub-fan {
⋮----
.dock-hub-fan--open {
⋮----
.dock-hub-fan--orbit {
⋮----
@apply relative;
⋮----
.dock-orbit-stage__ring {
⋮----
.dock-orbit-stage__spokes {
⋮----
.dock-orbit-stage__spoke {
⋮----
.dock-orbit-stage__spoke--tl {
⋮----
.dock-orbit-stage__spoke--tr {
⋮----
.dock-orbit-stage__spoke--bl {
⋮----
.dock-orbit-stage__spoke--br {
⋮----
.dock-hub-fan--orbit .dock-hub-sat {
⋮----
.dock-hub-fan--orbit .dock-hub-sat__glass {
⋮----
.dock-hub-fan--orbit .dock-hub-sat__halo {
⋮----
.dock-hub-fan--orbit .dock-hub-sat:hover .dock-hub-sat__halo,
⋮----
.dock-hub-fan--orbit .dock-hub-sat__icon {
⋮----
.dock-hub-fan--orbit .dock-hub-sat__label {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--indigo .dock-hub-sat__halo {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--lavender .dock-hub-sat__halo {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--emerald .dock-hub-sat__halo {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--gold .dock-hub-sat__halo {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--indigo.dock-hub-sat--active .dock-hub-sat__glass {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--lavender.dock-hub-sat--active .dock-hub-sat__glass {
⋮----
.dock-hub-fan--orbit .dock-hub-sat--emerald.dock-hub-sat--active .dock-hub-sat__glass {
⋮----
.dock-hub-fan--orbit .dock-hub-sat:hover .dock-hub-sat__glass {
⋮----
.dock-hub-fan .dock-compass-hub {
⋮----
.dock-hub-sat {
⋮----
.dock-hub-sat--visible {
⋮----
@apply opacity-100;
⋮----
.dock-hub-sat--tl {
⋮----
.dock-hub-sat--tr {
⋮----
.dock-hub-sat--bl {
⋮----
.dock-hub-sat--br {
⋮----
.dock-hub-sat__glass {
⋮----
.dock-hub-sat:hover .dock-hub-sat__glass {
⋮----
.dock-hub-sat__icon {
⋮----
.dock-hub-sat__label {
⋮----
.dock-hub-sat--active .dock-hub-sat__glass {
⋮----
.dock-hub-sat--indigo .dock-hub-sat__icon {
⋮----
.dock-hub-sat--lavender .dock-hub-sat__icon {
⋮----
.dock-hub-sat--emerald .dock-hub-sat__icon {
⋮----
.dock-hub-sat--gold .dock-hub-sat__icon {
⋮----
.dock-hub-sat,
⋮----
.dock-compass-hub {
⋮----
.dock-compass-hub:hover {
⋮----
.dock-compass-hub:active {
⋮----
.dock-compass-hub__plate {
⋮----
.dock-hub-fan--orbit .dock-compass-hub__plate {
⋮----
.dock-compass-hub__plate::before {
⋮----
.dock-compass-hub__mark {
⋮----
.dock-compass-hub__overlay {
⋮----
.dock-compass-hub__icon {
⋮----
.dock-compass-hub--heart .dock-compass-hub__mark {
⋮----
.dock-compass-hub--fyren .dock-compass-hub__plate {
⋮----
.dock-compass-hub:hover .dock-compass-hub__plate {
⋮----
.dock-compass-hub--active .dock-compass-hub__plate {
⋮----
.dock-compass-hub--open .dock-compass-hub__plate {
⋮----
.dock-hub-fan--orbit .dock-compass-hub__label {
⋮----
.module-hub-panel {
⋮----
.module-hub-panel__grid {
⋮----
.module-hub-panel__row {
⋮----
.module-hub-tile {
⋮----
.module-hub-tile:hover {
⋮----
.module-hub-tile--active {
⋮----
.module-hub-tile--center {
⋮----
@apply py-4;
⋮----
.module-hub-tile--gold.module-hub-tile--active {
⋮----
.module-hub-tile--indigo.module-hub-tile--active {
⋮----
.module-hub-tile--lavender.module-hub-tile--active {
⋮----
.module-hub-tile--emerald.module-hub-tile--active {
⋮----
.module-hub-tile__icon {
⋮----
.module-hub-tile__label {
⋮----
.module-hub-tile__desc {
⋮----
.module-hub-panel__close {
⋮----
.dock-item {
⋮----
.dock-item:hover {
⋮----
@apply text-text-muted;
⋮----
.dock-item--active {
⋮----
.dock-item__icon-wrap {
⋮----
.dock-item__label {
⋮----
.home-page__hero {
⋮----
.home-action-hub {
⋮----
.home-action-hub__glass {
⋮----
.home-action-hub__head {
⋮----
@apply mb-4;
⋮----
.home-action-hub__scroll {
⋮----
.home-action-hub__scroll::-webkit-scrollbar {
⋮----
.home-action-chip {
⋮----
.home-action-chip:hover {
⋮----
.home-action-chip--active {
⋮----
.home-action-chip--gold.home-action-chip--active {
⋮----
.home-action-chip--emerald.home-action-chip--active {
⋮----
.home-action-chip--indigo.home-action-chip--active {
⋮----
.home-action-chip--lavender.home-action-chip--active {
⋮----
.home-action-chip__label {
⋮----
@apply whitespace-nowrap;
⋮----
.home-action-hub__panel {
⋮----
.home-module-panel__lead {
⋮----
.home-module-panel__question-box {
⋮----
.home-page__eyebrow {
⋮----
.home-page__title {
⋮----
.home-page__lead {
⋮----
.hub-page-shell__header {
⋮----
.hub-page-shell__footer {
⋮----
.app-header__inner {
⋮----
.glass-header-bar--kanon {
⋮----
.glass-header-bar--kanon .glass-header-bar__leading {
⋮----
.glass-header-bar--kanon .app-header__brand--kanon {
⋮----
.livskompass-brand-lockup--inline .livskompass-brand-lockup__mark {
⋮----
.livskompass-brand-lockup--header .livskompass-brand-lockup__mark {
⋮----
.livskompass-brand-lockup__title {
⋮----
.livskompass-brand-lockup__title--inline {
⋮----
/* Header — solid guld (filter + background-clip:text = osynlig text i WebKit) */
.livskompass-brand-lockup--header .livskompass-brand-lockup__title {
⋮----
.livskompass-brand-lockup--header .livskompass-brand-lockup__title--inline {
⋮----
.glass-header-bar--kanon .app-header__page-badge {
⋮----
.livskompass-hero__panel--h1-full {
⋮----
.livskompass-hero__panel--h1-alpha {
⋮----
.livskompass-hero__panel--h1-alpha .livskompass-hero__disk-surface {
⋮----
.dock-nav-btn__chrome-v5 {
⋮----
.glass-header-bar--home-quick {
⋮----
.glass-header-bar__leading {
⋮----
.glass-header-bar--home-quick .app-header__brand--kanon {
⋮----
@apply min-w-0;
⋮----
.glass-header-bar--home-quick .app-header__title--kanon {
⋮----
.glass-header-bar--home-quick .app-header__tagline {
⋮----
.glass-header-bar--kanon[data-panel-style='ember'] {
⋮----
.glass-header-bar--kanon[data-panel-style='ember']::before {
⋮----
.glass-header-bar--kanon[data-panel-style='ember']::after {
⋮----
.glass-header-bar--kanon[data-panel-style='obsidian'] {
⋮----
.glass-header-bar--kanon[data-panel-style='obsidian']::before {
⋮----
.glass-header-bar--kanon[data-panel-style='obsidian']::after {
⋮----
.glass-header-bar--kanon[data-panel-style='aurora'] {
⋮----
.glass-header-bar--kanon[data-panel-style='aurora']::before {
⋮----
.glass-header-bar--kanon[data-panel-style='aurora']::after {
⋮----
/* Dock rail — samma panelstil som header (CHROME-EMBER-KANON) */
.dock-hub-band[data-panel-style='ember'] .dock-hub-band__rail {
⋮----
.dock-hub-band[data-panel-style='obsidian'] .dock-hub-band__rail {
⋮----
.dock-hub-band[data-panel-style='aurora'] .dock-hub-band__rail {
⋮----
.header-chrome-btn {
⋮----
.header-chrome-btn::before {
⋮----
.header-chrome-btn::after {
⋮----
.header-chrome-btn:hover {
⋮----
.header-chrome-btn:active {
⋮----
.header-chrome-btn:focus-visible {
⋮----
.header-chrome-btn--round {
⋮----
.header-chrome-btn--round::before {
⋮----
.header-chrome-btn--logo::after {
⋮----
.header-chrome-btn__glyph {
⋮----
.header-chrome-btn__glyph--success {
⋮----
.header-menu-btn--kanon {
⋮----
.header-menu-btn--kanon.header-chrome-btn--round::before {
⋮----
.app-header__brand--kanon {
⋮----
@apply justify-center;
⋮----
.app-header__brand-link {
⋮----
.app-header__logo--kanon.header-chrome-btn {
⋮----
.app-header__logo-mark {
⋮----
.app-header__brand-text {
⋮----
.app-header__title--kanon {
⋮----
.app-header__page-badge {
⋮----
.app-header__tagline {
⋮----
.app-header__actions--kanon {
⋮----
@apply justify-end;
⋮----
.fyren-header-strip {
⋮----
.fyren-header-strip--in-bar {
⋮----
.fyren-header-strip--in-bar .fyren-header-strip__chip {
⋮----
.fyren-header-strip--in-bar .fyren-header-strip__icon {
⋮----
.fyren-header-strip--in-bar .fyren-header-strip__label {
⋮----
.fyren-header-strip__chip {
⋮----
.fyren-header-strip__chip:hover {
⋮----
.fyren-header-strip__icon {
⋮----
.fyren-header-strip__label {
⋮----
.nav-drawer__backdrop {
⋮----
.nav-drawer {
⋮----
.nav-drawer__scenic {
⋮----
.nav-drawer__scenic::after {
⋮----
.nav-drawer--obsidian-depth .nav-drawer__scenic {
⋮----
.nav-drawer--obsidian-depth .nav-drawer__scenic::after {
⋮----
.nav-drawer__header,
⋮----
.nav-drawer__header {
⋮----
.nav-drawer__close {
⋮----
.nav-drawer__close:hover {
⋮----
.nav-drawer__brand {
⋮----
.nav-drawer__mark {
⋮----
.nav-drawer__title {
⋮----
.nav-drawer__ornament {
⋮----
.nav-drawer__ornament span {
⋮----
.nav-drawer__ornament span:nth-child(2) {
⋮----
.nav-drawer__quick {
⋮----
.nav-drawer__quick-eyebrow {
⋮----
.nav-drawer__quick-grid {
⋮----
.nav-drawer__quick-chip {
⋮----
.nav-drawer__quick-chip:hover {
⋮----
.nav-drawer__quick-chip-icon {
⋮----
.nav-drawer__quick-chip-label {
⋮----
.nav-drawer__mode {
⋮----
.nav-drawer__mode-btn {
⋮----
.nav-drawer__mode-btn--active {
⋮----
.nav-drawer__mode-btn--solo {
⋮----
.nav-drawer--obsidian-depth .nav-drawer__calm-scroll,
⋮----
.nav-drawer__recent {
⋮----
.nav-drawer__recent-title {
⋮----
.nav-drawer__recent-grid {
⋮----
.nav-drawer__recent-chip {
⋮----
.nav-drawer__recent-chip:hover {
⋮----
.nav-drawer__valv-block {
⋮----
.nav-drawer__section-title--valv {
⋮----
.nav-drawer__lock-btn {
⋮----
.nav-drawer__lock-btn:hover {
⋮----
.nav-drawer__lock-icon {
⋮----
.nav-drawer__lock-copy {
⋮----
.nav-drawer__lock-title {
⋮----
.nav-drawer__lock-hint {
⋮----
.drawer-hub__trigger {
⋮----
.drawer-hub__trigger:hover {
⋮----
.drawer-hub__trigger--active {
⋮----
.drawer-hub__trigger-icon {
⋮----
.drawer-hub__trigger--active .drawer-hub__trigger-icon {
⋮----
.drawer-hub__trigger-label {
⋮----
.nav-drawer__sections {
⋮----
.nav-drawer__quick-title {
⋮----
.nav-drawer__quick-btn {
⋮----
.nav-drawer__quick-icon {
⋮----
.nav-drawer__quick-label {
⋮----
.nav-drawer__quick-hint {
⋮----
.nav-drawer__footer {
⋮----
.nav-drawer__account-btn {
⋮----
.nav-drawer__hub-children {
⋮----
.nav-drawer__hub-hint {
⋮----
.nav-drawer__row-wrap--sub {
⋮----
@apply pl-1;
⋮----
.nav-drawer__row--group .nav-drawer__row-label {
⋮----
.nav-drawer__row-expand {
⋮----
.nav-drawer__row-expand:hover {
⋮----
.nav-drawer__section {
⋮----
.nav-drawer__section-title {
⋮----
.nav-drawer__category-title {
⋮----
.nav-drawer__category:first-child .nav-drawer__category-title {
⋮----
@apply pt-2;
⋮----
.nav-drawer__list {
⋮----
.nav-drawer__row--sub {
⋮----
@apply pl-4;
⋮----
.nav-drawer__row--sub .nav-drawer__row-icon {
⋮----
.nav-drawer__row--sub .nav-drawer__row-label {
⋮----
.nav-drawer__row {
⋮----
.nav-drawer__row:hover {
⋮----
.nav-drawer__row--active {
⋮----
.nav-drawer__row--active .nav-drawer__row-label {
⋮----
.nav-drawer__row-icon {
⋮----
.nav-drawer__row-icon .chrome-v4-icon {
⋮----
.nav-drawer__row-icon .drawer-l2-icon {
⋮----
.nav-drawer__row--active .nav-drawer__row-icon {
⋮----
.nav-drawer__row-label {
⋮----
.nav-drawer__row-badge {
⋮----
.nav-drawer__row-chevron {
⋮----
.nav-drawer__row--active .nav-drawer__row-chevron {
⋮----
body.account-auth-open {
⋮----
.account-auth-backdrop {
⋮----
.account-auth-dialog {
⋮----
.app-unlock-gate {
⋮----
.app-unlock-gate__card {
⋮----
body.nav-drawer-open .fyren-smart-bar,
⋮----
.projekt-picker-sheet {
⋮----
.projekt-picker-sheet__backdrop {
⋮----
.projekt-picker-sheet__panel {
⋮----
body.nav-drawer-open .dock-hub-band {
⋮----
.fyren-home-rail {
⋮----
.fyren-home-rail__row {
⋮----
.fyren-home-rail__row:hover {
⋮----
.fyren-home-rail__icon {
⋮----
.fyren-home-rail__label {
⋮----
.home-hero-kanon__bridge {
⋮----
.home-hero-kanon__scenic-stack {
⋮----
.home-hero-kanon__compass-stage {
⋮----
.home-page--scenic .home-hero-kanon {
⋮----
.app-main:has(> .home-page--scenic) {
⋮----
.home-page--scenic .home-hero-kanon__bridge {
⋮----
.home-page--scenic .home-hero-kanon__bridge::before {
⋮----
.home-page--scenic .home-hero-kanon__compass-stage {
⋮----
.home-page--scenic .home-hero-kanon__scenic-stack {
⋮----
.home-page--scenic .home-hero-kanon__scenic-stack::before {
⋮----
.home-page--scenic .home-hero-kanon__intro {
⋮----
/* Obsidian Calm 2.0 — hälsning utan legacy-låda (kompass = calm-card separat) */
.home-page--scenic .home-hero-kanon__header {
⋮----
.home-page--scenic .home-hero-kanon__scenic-stack .calm-card {
⋮----
.home-greeting-module {
⋮----
.home-greeting-module__meta {
⋮----
.home-greeting-module__profile {
⋮----
.home-page--scenic .home-greeting-module {
⋮----
.home-page--scenic .home-greeting-module::before {
⋮----
.home-page--scenic .home-greeting-module .home-greeting {
⋮----
.home-page--scenic .home-greeting-module__meta {
⋮----
.home-page--scenic .home-greeting-module__profile {
⋮----
.home-page--scenic .home-greeting-module .home-streak-chip {
⋮----
.home-page--scenic .home-greeting__eyebrow {
⋮----
.home-page--scenic .home-greeting__title {
⋮----
.home-page--scenic .home-greeting__salutation {
⋮----
.home-page--scenic .home-greeting__name {
⋮----
.home-page--scenic .home-greeting__star {
⋮----
.home-page--scenic .home-greeting__tagline {
⋮----
.home-greeting__eyebrow {
⋮----
.home-greeting__title {
⋮----
.home-greeting__star {
⋮----
.home-greeting__tagline {
⋮----
.home-hero-kanon__intro {
⋮----
.home-streak-chip {
⋮----
.home-streak-chip__icon {
⋮----
.home-page--scenic .home-streak-chip__icon {
⋮----
.home-streak-chip__value {
⋮----
.home-streak-chip__label {
⋮----
.home-adaptive-compass__card--depth {
⋮----
.home-adaptive-compass__card--depth::before {
⋮----
.home-adaptive-compass__card--phase-morgon {
⋮----
.home-adaptive-compass__card--phase-dag {
⋮----
.home-adaptive-compass__card--phase-kvall {
⋮----
.home-adaptive-compass__head--morgon {
⋮----
.home-adaptive-compass__head--dag {
⋮----
.home-adaptive-compass__head--kvall {
⋮----
.home-adaptive-compass__quick-btn {
⋮----
.home-adaptive-compass__quick-btn:hover {
⋮----
.home-adaptive-compass__quick-btn:focus-visible {
⋮----
.home-adaptive-compass__quick-icon {
⋮----
.home-adaptive-compass__quick-label {
⋮----
.home-adaptive-compass__tabs {
⋮----
.home-adaptive-compass__tab {
⋮----
.home-adaptive-compass__tab:hover {
⋮----
.home-adaptive-compass__tab--active {
⋮----
.home-adaptive-compass__inkast {
⋮----
@apply p-5;
⋮----
.home-adaptive-compass__inkast-head {
⋮----
.home-adaptive-compass__inkast--open {
⋮----
.home-adaptive-compass__inkast-toggle {
⋮----
.home-adaptive-compass__inkast-toggle:hover {
⋮----
.home-adaptive-compass__inkast-chevron {
⋮----
.home-adaptive-compass__inkast-chevron--open {
⋮----
@apply rotate-180;
⋮----
/* ── Kompass utvecklings-deck (alla teman) ── */
.home-kompass-discovery__explore {
⋮----
.home-kompass-discovery__explore:hover {
⋮----
.home-kompass-discovery__explore--open {
⋮----
.home-kompass-discovery__explore-chevron {
⋮----
.home-kompass-discovery__explore-chevron--open {
⋮----
.kompass-disc-deck-lead {
⋮----
.kompass-disc-grid {
⋮----
.kompass-disc-card {
⋮----
.kompass-disc-card:hover {
⋮----
.kompass-disc-card-label {
⋮----
.kompass-disc-card-hint {
⋮----
.kompass-disc-card--gold { border-bottom: 2px solid rgba(212, 175, 55, 0.35); }
.kompass-disc-card--amber { border-bottom: 2px solid rgba(180, 140, 60, 0.32); }
.kompass-disc-card--slate { border-bottom: 2px solid rgba(148, 163, 184, 0.28); }
.kompass-disc-card--rose-dim { border-bottom: 2px solid rgba(190, 120, 120, 0.28); }
.kompass-disc-card--sea-dim { border-bottom: 2px solid rgba(80, 140, 130, 0.28); }
.kompass-disc-card--bronze { border-bottom: 2px solid rgba(154, 123, 47, 0.35); }
.kompass-disc-card--mist { border-bottom: 2px solid rgba(130, 150, 170, 0.25); }
.kompass-disc-card--sand { border-bottom: 2px solid rgba(170, 150, 110, 0.28); }
.kompass-disc-card--pearl { border-bottom: 2px solid rgba(200, 190, 170, 0.22); }
.kompass-disc-card--copper { border-bottom: 2px solid rgba(160, 110, 80, 0.28); }
.kompass-disc-card--ash { border-bottom: 2px solid rgba(120, 130, 140, 0.28); }
.kompass-disc-card--moss { border-bottom: 2px solid rgba(90, 130, 100, 0.28); }
⋮----
.kompass-disc-flow {
⋮----
@apply py-1;
⋮----
.kompass-disc-flow-card {
⋮----
@apply mt-1;
⋮----
.kompass-disc-back {
⋮----
.kompass-disc-back:hover {
⋮----
.kompass-disc-flow-kicker {
⋮----
.kompass-disc-flow-title {
⋮----
.kompass-disc-flow-body {
⋮----
.kompass-disc-flow-label {
⋮----
.kompass-disc-flow-actions {
⋮----
.home-page--scenic .home-hero-kanon__scenic-stack .home-adaptive-compass {
⋮----
@apply gap-3;
⋮----
html[data-design-pack] .home-page--scenic .home-hero-kanon__scenic-stack .home-adaptive-compass {
⋮----
@apply gap-2;
⋮----
html[data-design-pack] .home-page--scenic .home-adaptive-compass__advice .elongated-module {
⋮----
html[data-design-pack] .home-page--scenic .home-adaptive-compass__card--depth {
⋮----
@apply rounded-t-none;
⋮----
.home-page--scenic .home-adaptive-compass__core {
⋮----
.home-page--scenic .home-adaptive-compass__advice .elongated-module {
⋮----
.home-page--scenic .home-adaptive-compass__card {
⋮----
.home-page--scenic .home-adaptive-compass__card--depth {
⋮----
.home-adaptive-compass__core {
⋮----
.home-adaptive-compass--hub .home-adaptive-compass__card {
⋮----
.home-adaptive-compass__hub-head {
⋮----
.home-page__section {
⋮----
.home-page__section-head {
⋮----
.livskompass-hero {
⋮----
.livskompass-hero__panel {
⋮----
.livskompass-hero--compact .livskompass-hero__panel {
⋮----
.livskompass-hero__compact-bar {
⋮----
.livskompass-hero__compact-bar:hover {
⋮----
.livskompass-hero__compact-mark {
⋮----
.livskompass-hero__compact-mark-icon {
⋮----
.livskompass-hero__compact-copy {
⋮----
.livskompass-hero__compact-title {
⋮----
.livskompass-hero__compact-lead {
⋮----
.livskompass-hero__compact-chevron {
⋮----
.livskompass-hero[data-k-skold].livskompass-hero--compact .livskompass-hero__compact-mark {
⋮----
html[data-theme^='I-stone'] .livskompass-hero--compact .livskompass-hero__panel {
⋮----
html[data-theme^='I-stone'] .livskompass-hero__panel {
⋮----
.livskompass-hero[data-k-skold] .livskompass-hero__panel {
⋮----
.livskompass-hero[data-k-skold] .livskompass-hero__shield-label,
⋮----
.livskompass-hero[data-k-skold] .livskompass-hero__ring--mid,
⋮----
.livskompass-hero[data-k-skold].livskompass-hero--v2 .livskompass-hero__disk {
⋮----
.livskompass-hero[data-k-skold] .livskompass-hero__orbit-node-ring {
⋮----
.livskompass-hero__shield-label {
⋮----
.livskompass-hero--v2 .livskompass-hero__stage {
⋮----
.livskompass-hero--v2 .livskompass-hero__face {
⋮----
.livskompass-hero__ring--mid {
⋮----
.livskompass-hero__crosshair,
⋮----
.livskompass-hero__cardinals {
⋮----
.livskompass-hero__cardinal {
⋮----
.livskompass-hero--v2 .livskompass-hero__ring,
⋮----
.livskompass-hero__ring--outer {
⋮----
.livskompass-hero--v2 .livskompass-hero__disk,
⋮----
.livskompass-hero__disk::before {
⋮----
.livskompass-hero__disk-surface {
⋮----
.livskompass-hero__disk-rose {
⋮----
.livskompass-hero__disk-orbit-ring {
⋮----
html[data-theme^='I-stone'] .livskompass-hero--v2 .livskompass-hero__disk,
⋮----
.livskompass-hero--kvall.livskompass-hero--elongated .livskompass-hero__disk {
⋮----
.livskompass-hero--soluppgang.livskompass-hero--elongated .livskompass-hero__disk {
⋮----
.livskompass-hero__orbit-wrap {
⋮----
.livskompass-hero__orbit-wrap--inter .livskompass-hero__orbit-node {
⋮----
.livskompass-hero__orbit-wrap--inter .livskompass-hero__orbit-icon {
⋮----
.livskompass-hero__orbit-node {
⋮----
.livskompass-hero__orbit-node::before {
⋮----
.livskompass-hero__orbit-gem {
⋮----
.livskompass-hero__orbit-node-ring {
⋮----
.livskompass-hero__orbit-node--open,
⋮----
.livskompass-hero__orbit-icon {
⋮----
.livskompass-hero__orbit-menu-blurb {
⋮----
.livskompass-hero__orbit-menu {
⋮----
.livskompass-hero__orbit-menu--visible {
⋮----
.livskompass-hero__orbit-menu-label {
⋮----
.livskompass-hero__orbit-menu-go {
⋮----
.livskompass-hero__orbit-menu-go:hover {
⋮----
.livskompass-hero__center {
⋮----
.livskompass-hero__center::before {
⋮----
.livskompass-hero__center-gem {
⋮----
.livskompass-hero__center-halo {
⋮----
.livskompass-hero--embedded.livskompass-hero--v2 .livskompass-hero__stage,
⋮----
.livskompass-hero--embedded .livskompass-hero__orbit-node {
⋮----
.livskompass-hero--embedded .livskompass-hero__orbit-wrap--inter .livskompass-hero__orbit-node {
⋮----
.livskompass-hero--embedded .livskompass-hero__orbit-icon {
⋮----
.livskompass-hero--embedded .livskompass-hero__orbit-wrap--inter .livskompass-hero__orbit-icon {
⋮----
.livskompass-hero--embedded .livskompass-hero__center {
⋮----
.livskompass-hero--embedded .livskompass-hero__mark {
⋮----
html[data-theme^='I-stone'] .livskompass-hero__center {
⋮----
html[data-theme^='I-stone'] .livskompass-hero--embedded .livskompass-hero__center {
⋮----
.livskompass-hero__center:hover {
⋮----
.livskompass-hero__mark {
⋮----
.livskompass-hero__hint {
⋮----
.kompis-avatar {
⋮----
.kompis-avatar__ring {
⋮----
.kompis-avatar--live {
⋮----
.header-glass-btn--kanon.header-chrome-btn {
⋮----
.header-chrome-btn--round.header-chrome-btn {
⋮----
.kompis-avatar--header-chrome {
⋮----
.kompis-avatar--chrome-embed.kompis-avatar--header-chrome {
⋮----
.kompis-avatar--header-chrome .kompis-avatar__ring {
⋮----
.kompis-avatar--header-chrome .kompis-mark,
⋮----
.kompis-avatar--live.kompis-avatar--header-chrome .kompis-mark {
⋮----
.stamp-home-strip {
⋮----
.stamp-home-strip__main {
⋮----
.stamp-home-strip__expand {
⋮----
.stamp-home-strip__hint {
⋮----
.stamp-home-expanded__toolbar {
⋮----
.stamp-home-expanded__hide,
⋮----
.stamp-home-expanded__hide {
⋮----
.stamp-home-expanded__widget-link {
⋮----
.widget-stamp__status {
⋮----
.dagens-riktning {
⋮----
@apply space-y-2;
⋮----
.dagens-riktning-card {
⋮----
.dagens-riktning-card::before {
⋮----
.dagens-riktning-card--open {
⋮----
.dagens-riktning-card__main {
⋮----
.dagens-riktning-card__icon-wrap {
⋮----
.dagens-riktning-card__compass-chip {
⋮----
.dagens-riktning-card__compass-chip--solo {
⋮----
.dagens-riktning-card__compass-chip-img {
⋮----
.dagens-riktning-card__body {
⋮----
.dagens-riktning-card__eyebrow {
⋮----
.dagens-riktning-card__active-dot {
⋮----
.dagens-riktning-card__title {
⋮----
.dagens-riktning-card__quote {
⋮----
.dagens-riktning-card__actions {
⋮----
.dagens-riktning-card__cta {
⋮----
.dagens-riktning-card__cta:hover {
⋮----
.dagens-riktning-card__cta-chevron {
⋮----
.dagens-riktning-card__cta-chevron--open {
⋮----
.dagens-riktning-card__panel {
⋮----
.home-page--scenic .home-hero-kanon__welcome-module .dagens-riktning {
⋮----
@apply space-y-0;
⋮----
.home-page--scenic .home-hero-kanon__welcome-module .dagens-riktning-card {
⋮----
.home-page--scenic .home-hero-kanon__welcome-module .dagens-riktning-card::before {
⋮----
.home-page--scenic .home-hero-kanon__welcome-module .dagens-riktning-card__main {
⋮----
.home-page--scenic .home-hero-kanon__welcome-module .home-greeting {
⋮----
.home-page--scenic .home-hero-kanon__welcome-module .home-greeting::before {
⋮----
.home-hero-kanon__dots {
⋮----
.home-hero-kanon__dot {
⋮----
.home-hero-kanon__dot--active {
⋮----
.home-more {
⋮----
.home-more__summary {
⋮----
.home-more[open] .home-more__summary {
⋮----
.life-hub-picker {
⋮----
.life-hub-picker__eyebrow {
⋮----
.life-hub-picker__lead {
⋮----
.life-hub-picker__grid {
⋮----
.life-hub-picker__card {
⋮----
.life-hub-picker__card:hover {
⋮----
.life-hub-picker__card--active {
⋮----
.life-hub-picker__label {
⋮----
.life-hub-picker__hint {
⋮----
.elongated-module {
⋮----
.elongated-module--expanded {
⋮----
.elongated-module--recommended {
⋮----
.elongated-module--inactive {
⋮----
.elongated-module--inactive:hover {
⋮----
.elongated-module__trigger {
⋮----
.elongated-module__icon {
⋮----
.elongated-module__text {
⋮----
.elongated-module__title-row {
⋮----
.elongated-module__title {
⋮----
.elongated-module__badge {
⋮----
.elongated-module__badge-dot {
⋮----
.elongated-module__time-icon {
⋮----
.elongated-module__lead {
⋮----
.elongated-module__chevron {
⋮----
.elongated-module__chevron--open {
⋮----
.elongated-module__body {
⋮----
.elongated-module--emerald {
⋮----
.elongated-module--emerald .elongated-module__icon {
⋮----
.elongated-module--indigo {
⋮----
.elongated-module--indigo .elongated-module__icon {
⋮----
.elongated-module--lavender {
⋮----
.elongated-module--lavender .elongated-module__icon {
⋮----
.elongated-module--gold.elongated-module--expanded {
⋮----
.home-module-stack {
⋮----
.compass-module-block {
⋮----
.compass-module-block--active {
⋮----
.compass-module-block--active::before {
⋮----
.compass-module-block--active > .elongated-module {
⋮----
.compass-quick-widget-rail {
⋮----
.compass-quick-widget-rail--compact {
⋮----
@apply py-2;
⋮----
.compass-quick-widget-rail--below {
⋮----
.compass-quick-widget-rail--in-module {
⋮----
.compass-quick-widget-rail__label {
⋮----
.compass-quick-widget-rail__scroll {
⋮----
.compass-quick-widget-rail__chip {
⋮----
.compass-quick-widget-rail__chip:hover {
⋮----
.compass-quick-widget-rail--compact .compass-quick-widget-rail__label {
⋮----
.widget-shell {
⋮----
.widget-shell__header {
⋮----
@apply mb-6;
⋮----
.widget-shell__brand {
⋮----
.widget-shell__title {
⋮----
.widget-shell__lead {
⋮----
.widget-record__dot {
⋮----
.fyren-widget-bar {
⋮----
.fyren-widget-bar--open {
⋮----
.fyren-widget-bar__backdrop {
⋮----
.widget-record-discreet-overlay {
⋮----
.fyren-widget-bar__strip {
⋮----
.fyren-widget-bar__strip--closed {
⋮----
.fyren-widget-bar--open .fyren-widget-bar__strip {
⋮----
.fyren-widget-bar__action {
⋮----
.fyren-widget-bar__icon-shell {
⋮----
.fyren-widget-bar__action:hover .fyren-widget-bar__icon-shell {
⋮----
.fyren-widget-bar__drawer-l2 {
⋮----
.fyren-widget-bar__label {
⋮----
.fyren-widget-bar__action:hover .fyren-widget-bar__label {
⋮----
/* Barnporten CB1–CB4 — barn, varmare än Fyren W1 (ej samma klasser) */
⋮----
/* CB2 — hjärta-båge längs nedre kant (surfplatta) */
⋮----
/* CB3 — kompass-mini nere till höger */
⋮----
/* Smart widget bar (Theme I — bottom sheet) */
.fyren-smart-bar {
⋮----
.fyren-smart-bar--hidden {
⋮----
@apply bottom-0;
⋮----
.fyren-smart-bar--peek {
⋮----
.fyren-smart-bar--bar {
⋮----
.fyren-smart-bar--more {
⋮----
.fyren-smart-bar__context-panel {
⋮----
.fyren-smart-bar--glass-skin .fyren-smart-bar__context-panel {
⋮----
.fyren-smart-bar__context-row {
⋮----
.fyren-smart-bar__context-slot {
⋮----
.fyren-smart-bar__context-slot--active {
⋮----
.fyren-smart-bar__context-slot--active .fyren-smart-bar__context-icon {
⋮----
.fyren-smart-bar__context-icon {
⋮----
.fyren-smart-bar__context-label {
⋮----
.fyren-smart-bar__backdrop {
⋮----
.fyren-smart-bar__handle {
⋮----
.fyren-smart-bar__handle-body {
⋮----
.fyren-smart-bar__handle-grip {
⋮----
.fyren-smart-bar__handle-grip-line {
⋮----
.fyren-smart-bar__handle-chevron {
⋮----
.fyren-smart-bar__handle--holding .fyren-smart-bar__handle-body {
⋮----
.fyren-smart-bar__peek-panel {
⋮----
.fyren-smart-bar--glass-skin .fyren-smart-bar__peek-panel {
⋮----
.fyren-smart-bar__compass-btn {
⋮----
.fyren-smart-bar__dual {
⋮----
.fyren-smart-bar__dual-action {
⋮----
.fyren-smart-bar__orbit-icon {
⋮----
.fyren-smart-bar__dual-divider {
⋮----
.fyren-smart-bar__peek-chevron {
⋮----
.fyren-smart-bar__expanded-panel {
⋮----
.fyren-smart-bar__drag-handle {
⋮----
.fyren-smart-bar__context-hint {
⋮----
.fyren-smart-bar__panel-title {
⋮----
.fyren-smart-bar__icon-grid {
⋮----
.fyren-smart-bar__icon-tile {
⋮----
.fyren-smart-bar__icon-btn {
⋮----
.fyren-smart-bar__icon-btn:hover .fyren-smart-bar__icon-tile {
⋮----
.fyren-smart-bar__icon-label {
⋮----
.fyren-smart-bar__footer {
⋮----
.fyren-smart-bar__hide-btn {
⋮----
.module-list {
⋮----
.adaptive-card-grid {
⋮----
.adaptive-card {
⋮----
@apply transition-colors;
⋮----
.adaptive-card:hover {
⋮----
.adaptive-card--gold {
⋮----
.adaptive-card--indigo {
⋮----
.adaptive-card--lavender {
⋮----
.adaptive-card--emerald {
⋮----
.review-queue-status {
⋮----
.review-queue-status--routed {
⋮----
.review-queue-status--review {
⋮----
.review-queue-status--rejected {
⋮----
.module-card {
⋮----
.module-card:hover {
⋮----
.module-card__head {
⋮----
.module-card__icon {
⋮----
.module-card__title {
⋮----
.module-card__desc {
⋮----
.module-card__chevron {
⋮----
@apply text-text-dim;
⋮----
.module-card__modules {
⋮----
.module-chip {
⋮----
.module-chip:hover {
⋮----
.module-card--gold .module-card__icon {
⋮----
.module-card--indigo .module-card__icon {
⋮----
.module-card--lavender .module-card__icon {
⋮----
.module-card--emerald .module-card__icon {
⋮----
.btn-pill {
⋮----
.btn-pill--accent,
⋮----
@apply btn-pill;
⋮----
.btn-pill--accent:hover:not(:disabled),
⋮----
.btn-pill--accent:active:not(:disabled),
⋮----
.btn-pill--ghost {
⋮----
.btn-pill--ghost:hover:not(:disabled) {
⋮----
.btn-pill--ghost:active:not(:disabled) {
⋮----
.btn-pill--ghost:focus-visible {
⋮----
.btn-pill--primary {
⋮----
.btn-pill--secondary {
⋮----
.btn-pill--secondary:hover:not(:disabled) {
⋮----
.btn-pill--secondary:active:not(:disabled) {
⋮----
.btn-pill--secondary:focus-visible {
⋮----
.btn-pill--success {
⋮----
.alert-banner {
⋮----
.alert-banner--info {
⋮----
.alert-banner--warning {
⋮----
.alert-banner--danger {
⋮----
.badge {
⋮----
.badge-worm {
⋮----
.badge-locked {
⋮----
.badge-risk {
⋮----
.badge-ai {
⋮----
.glass-card--ai {
⋮----
.input-glass {
⋮----
.input-glass--pin {
⋮----
.input-glass--pin:focus {
⋮----
.pin-gate {
⋮----
@apply space-y-3;
⋮----
.pin-gate__lead {
⋮----
.pin-gate__field {
⋮----
.pin-gate__label {
⋮----
.pin-gate__submit {
⋮----
.pin-gate__error {
⋮----
.chip {
⋮----
.chip--active {
⋮----
.chip--idle {
⋮----
/* Familjen hub — aurora + guld (mockup E / barnfokus) */
.familjen-hub {
⋮----
.familjen-hub__aurora {
⋮----
.familjen-hub__aurora::before {
⋮----
.familjen-hub__header {
⋮----
.familjen-hub__title {
⋮----
.familjen-hub__tabs {
⋮----
.familjen-hub__tabs::-webkit-scrollbar {
⋮----
.familjen-hub__tabs .flex {
⋮----
.familjen-child-chip {
⋮----
.familjen-child-chip--active {
⋮----
.familjen-child-chip--idle {
⋮----
.familjen-barnfokus-wrap {
⋮----
.familjen-barnfokus-wrap::before {
⋮----
.familjen-barnfokus-wrap > * {
⋮----
.familjen-anchor-card {
⋮----
.familjen-feature-card {
⋮----
.familjen-feature-card:hover {
⋮----
.familjen-feature-card__icon {
⋮----
.familjen-feature-card__body {
⋮----
.familjen-feature-card__title {
⋮----
.familjen-feature-card__desc {
⋮----
.familjen-feature-card__chevron {
⋮----
.familjen-feature-card__bookmark {
⋮----
.kompis-hub-page__avatar {
⋮----
.kompis-hub-page__intro p {
⋮----
@apply leading-relaxed;
⋮----
.kompis-hub-page .glass-card {
⋮----
.familjen-week-bar {
⋮----
.familjen-kunskap-panel {
⋮----
/* Dagbok — lägesnav (Snabb / Reflektera / Arkiv) */
.dagbok-mode-nav {
⋮----
.dagbok-mode-nav__tab {
⋮----
.dagbok-mode-nav__tab:hover {
⋮----
@apply text-text;
⋮----
.dagbok-mode-nav__tab--active {
⋮----
.journal-archive-scroll {
⋮----
.journal-archive-day {
⋮----
/* Dagbok — Lager 1 → Reality Vault handoff (lugn, WCAG AA text) */
.journal-handoff {
⋮----
.journal-handoff__header {
⋮----
.journal-handoff__title {
⋮----
.journal-handoff__body {
⋮----
.journal-handoff__cta {
⋮----
.journal-handoff__cta:hover {
⋮----
.dagbok-remember__toggle:focus-visible {
⋮----
/* Dagbok — reflektion (lekfull, enkelt språk) */
.reflektion-intro {
⋮----
.reflektion-wizard {
⋮----
.reflektion-panel--od-depth {
⋮----
.reflektion-field {
⋮----
.reflektion-field__label {
```
