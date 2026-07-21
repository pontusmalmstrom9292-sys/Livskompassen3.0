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
- Only files matching these patterns are included: docs/design/COLOR-POLICY.md, docs/design/TYPE-SCALE.md, docs/design/CHROME-POLICY.md, docs/design/CHROME-EMBER-KANON.md, docs/design/theme-lab/VARIANTS.md, docs/external-ai/DESIGN-KEEP-REGISTER.md, src/index.css, tailwind.config.js, src/modules/core/theme/themeRegistry.ts, src/modules/core/theme/typeScale.ts, src/design-system/styles/obsidian-calm-glass.css
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

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

## Redesign Style C — Aurora Prism (2026-06-07)

**Kod:** `themePackRedesignC.ts` → spread i `themeRegistry.ts` · sektion **Redesign (2026)** i `/dev/theme-lab`.  
**Spec:** [`../redesign-proposals/STYLE-C-SPEC.md`](../redesign-proposals/STYLE-C-SPEC.md) · mockups: [`../redesign-proposals/gallery/style-c/screens.html`](../redesign-proposals/gallery/style-c/screens.html)  
**CSS:** `src/styles/redesign-c-aurora-prism.css` (scoped `[data-theme='R-C-aurora-prism']`)  
**Prod default:** oförändrad (`D1-hamn-kompass`) — **INTE GODKÄND**

| ID | Label | Status | Notering |
|----|-------|--------|----------|
| `R-C-aurora-prism` | Aurora Prism | **lab** | Teal/violet glas · D3 designpaket · drawer/dock aktiv = guld (lås) |

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

---

## 2026-06-18 — Design sandbox mockups

**VINNARE: SB-brushed-brass-neu** (mockup 01 — Brushed Brass Neumorf)

- Prod default: `themeRegistry.ts` → `DEFAULT_THEME_ID`
- Spec: `docs/design-sandbox/BRUSHED-BRASS-KANON.md`
- Mockup: `docs/design-sandbox/mockups/01-brushed-brass-neu.html`
```

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

## File: src/modules/core/theme/themeRegistry.ts
```typescript
import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';
import { THEME_PACK_DESIGN } from './themePackDesign';
import { THEME_PACK_E_PROD, THEME_PACK_E_DARKEST } from './themePackE';
import { THEME_PACK_MOCKUP } from './themePackMockup';
import { THEME_PACK_K } from './themePackK';
import { THEME_PACK_REDESIGN_A } from './themePackRedesignA';
import { THEME_PACK_REDESIGN_C } from './themePackRedesignC';
import { THEME_PACK_OBSIDIAN_DEPTH } from './themePackObsidianDepth';
import { THEME_PACK_REMIX_E_HAMN } from './themePackRemix';
import { THEME_BRUSHED_BRASS_NEU } from './themePackBrushedBrass';
import {
  THEME_PACK_MIDNIGHT_EXECUTIVE,
} from './themePackMidnightExecutive';
import { BASTA_DESIGN_THEME_ID, THEME_PACK_BASTA_DESIGN } from './themePackBastaDesign';
⋮----
export function resolveThemeId(id: string): string
⋮----
export function getTheme(id: string): ThemePack
```

## File: src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## File: tailwind.config.js
```javascript
function cssVar(name)
```

## File: src/design-system/styles/obsidian-calm-glass.css
```css
@layer components {
⋮----
.calm-card {
⋮----
.calm-card-midnight {
⋮----
.bento-card {
⋮----
.bento-card:not(.module-bento-card--depth) {
⋮----
.bento-card:not(.module-bento-card--depth):hover {
⋮----
.bento-card:not(.module-bento-card--depth):focus-visible {
⋮----
.calm-card::before {
⋮----
/* Sheen + inner rim (overrides premium-polish ::after — same cascade, fuller depth) */
.calm-card::after,
⋮----
/* Legacy-alias — samma yta som calm-card */
.glass-card {
⋮----
.glass-card::before {
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
.glow-bottom-danger {
⋮----
/* Subtil gradient i kortets nedre kant (under innehåll) */
.calm-card.glow-bottom-gold::after,
⋮----
.calm-card.glow-bottom-blue::after,
⋮----
.calm-card.glow-bottom-green::after,
⋮----
.calm-card.glow-bottom-danger::after,
⋮----
.calm-card > *,
⋮----
/* Style A — Nordic Precision: skarpare hörn, minimal glow */
[data-theme='R-A-nordic-precision'] .calm-card,
⋮----
.capacity-low .calm-card,
⋮----
.capacity-low .glow-bottom-gold,
⋮----
.capacity-low .glow-bottom-gold::after,
```
