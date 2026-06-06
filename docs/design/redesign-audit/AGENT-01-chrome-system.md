# AGENT-01 — Chrome & Design System Audit

**Projekt:** Livskompassen v2  
**Datum:** 2026-06-07  
**Agent:** Design-audit Agent 1 (Chrome & Design System)  
**Läge:** READ-ONLY  
**Scope:** Global shell, navigation, tokens, primitives  
**Målfil:** `docs/design/redesign-audit/AGENT-01-chrome-system.md`

---

## 1. Inventering — skärmar och komponenter i scope

### 1.1 CSS & token-källor (kanon)

| Fil | Roll |
|-----|------|
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/index.css` | Huvudstylesheet (~5900 rader): `:root` tokens, header, dock, drawer, fyren-widget, btn-pill, ambient |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/styles/obsidian-calm-2.css` | `calm-card`, `glass-card`, silo-glow, hub-view-lock, liv-launcher |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/styles/design-packs.css` | D1–D5 helapp-chrome: center header, dock-mockup, ui-card, flat drawer |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/tailwind.config.js` | Semantiska färger via CSS-variabler |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/modules/core/ui/tokens.ts` | JS `DESIGN` + `BUTTON_VARIANTS` |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/modules/core/theme/themeRegistry.ts` | Alla theme packs (D, I, J, K, E, mockups) |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/modules/core/theme/themePackDesign.ts` | D1–D5 designpaket |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/modules/core/theme/themeShared.ts` | Delade `--text`, `--warning`, `--danger` |
| `/Users/Livskompassen/StudioProjects/Livskompassen3.0/src/modules/core/theme/applyTheme.ts` | Runtime `data-theme`, `data-design-pack`, CSS-var injection |

### 1.2 Global shell

| Komponent | Sökväg | Monterad i prod |
|-----------|--------|-----------------|
| `App` | `src/App.tsx` | Root: `ThemeProvider` → `AppRoutes` |
| `MainLayout` | `src/modules/core/layout/MainLayout.tsx` | Alla authed routes via routing |
| `AmbientBackground` | `src/modules/core/layout/AmbientBackground.tsx` | Ja — scenic blob-bakgrund |
| `HubPageShell` | `src/modules/core/layout/HubPageShell.tsx` | Hub-sidor (header + optional footer) |
| `FirestoreNetworkChip` | `src/modules/core/components/FirestoreNetworkChip.tsx` | Ja — overlay-chip |

**MainLayout stack (rad 41–99):**

```41:99:src/modules/core/layout/MainLayout.tsx
  return (
    <FyrenWidgetProvider>
    <div className={clsx('app-shell relative min-h-screen text-text font-sans ...')}>
      <AmbientBackground />
      <header className="app-header">...</header>
      <NavigationDrawer ... />
      <FirestoreNetworkChip />
      <main className={clsx('app-main ...')}>{children}</main>
      {!barnportenChildShell ? (
        <>
          <FyrenSmartWidgetBar />
          <FyrenWidgetBar />
          <FloatingDock />
        </>
      ) : null}
    </div>
    </FyrenWidgetProvider>
  );
```

### 1.3 Header & brand

| Komponent | Sökväg |
|-----------|--------|
| `AppHeaderBar` | `src/modules/core/components/AppHeaderBar.tsx` |
| `AppHeaderBrand` | `src/modules/core/components/AppHeaderBrand.tsx` |
| `DesignPackCenterHeader` | `src/modules/core/design/DesignPackCenterHeader.tsx` |
| `LivskompassBrandLockup` | `src/modules/core/ui/LivskompassBrandLockup.tsx` (D1 låst) |
| `LivskompassMark` | `src/modules/core/ui/LivskompassMark.tsx` (D1 låst) |
| `HeaderMenuGlyph` | `src/modules/core/ui/HeaderChromeGlyphs.tsx` |
| `KompisHeaderVaultButton` | `src/modules/core/components/KompisHeaderVaultButton.tsx` |
| `AccountAuthMenu` | `src/modules/core/auth/AccountAuthMenu.tsx` |
| `FyrenHeaderQuickStrip` | `src/modules/core/components/FyrenHeaderQuickStrip.tsx` |
| `resolveHeaderPanelStyle` | `src/modules/core/layout/headerPanelStyle.ts` |

### 1.4 Navigation — drawer & sanning

| Komponent | Sökväg |
|-----------|--------|
| `NavigationDrawer` | `src/modules/core/layout/NavigationDrawer.tsx` |
| `DrawerHubAccordion` | `src/modules/core/layout/DrawerHubAccordion.tsx` |
| `DrawerModeToggle` | `src/modules/core/layout/DrawerModeToggle.tsx` |
| `drawerFromNavTruth` | `src/modules/core/layout/drawerFromNavTruth.ts` |
| `drawerNav` / `DRAWER_VALV_ITEMS` | `src/modules/core/navigation/drawerNav.ts` |
| `navTruth.ts` | `src/modules/core/navigation/navTruth.ts` |
| `hubContextIcons.tsx` | `src/modules/core/navigation/hubContextIcons.tsx` |
| `DrawerL2Icon` | `src/modules/core/ui/drawerL2Icons/DrawerL2Icon.tsx` |
| `ChromeV4Icon` / `ChromeV5Icon` | `src/modules/core/ui/chromeIcons/` |
| `HubDropdownNav` | `src/modules/core/ui/HubDropdownNav.tsx` |
| `HubTabBar` / `TabBar` | `src/modules/core/ui/HubTabBar.tsx`, `TabBar.tsx` |
| `GoraHubTabBar` | `src/modules/core/navigation/GoraHubTabBar.tsx` |
| Legacy (ej monterad) | `DrawerQuickActions.tsx`, `DrawerHomeQuickActions.tsx` |

### 1.5 Dock & widget-lager

| Komponent | Sökväg | Status |
|-----------|--------|--------|
| **`FloatingDock`** | `src/modules/core/layout/FloatingDock.tsx` | **Aktiv prod-dock** |
| `FyrenDockHandle` | `src/modules/core/components/FyrenWidgetBar.tsx` (export) | Aktiv — "Fyren"-flik ovan dock |
| **`FyrenWidgetBar`** | `src/modules/core/components/FyrenWidgetBar.tsx` | Aktiv — 4×2 snabbval-grid |
| **`FyrenSmartWidgetBar`** | `src/modules/core/components/FyrenSmartWidgetBar.tsx` | **Stub — returnerar `null`** |
| `fyrenWidgetContext` | `src/modules/core/components/fyrenWidgetContext.tsx` | State för Fyren expand |
| `DockNavButton` | `src/modules/core/layout/DockNavButton.tsx` | Dock-zonknappar |
| `FyrenProgressRing` | `src/modules/core/ui/FyrenProgressRing.tsx` | Long-press Valv-ring |
| `DockHubBand` | `src/modules/core/layout/DockHubBand.tsx` | **Ej importerad i MainLayout** |
| `CompassHubOrb` | `src/modules/core/layout/CompassHubOrb.tsx` | **Ej importerad** (`VITE_DOCK_ORBIT` nämns i docs, ej i kod) |
| `dockHubChrome.ts` | `src/modules/core/layout/dockHubChrome.ts` | Sidolänkar för DockHubBand |
| `dockNavIcons.tsx` | `src/modules/core/layout/dockNavIcons.tsx` | Ikoner för DockHubBand |

### 1.6 Designpaket (experiment)

| Fil | Roll |
|-----|------|
| `designPackMeta.ts` | D1–D5 chrome-profil (header/dock/card/drawer) |
| `useDesignPack.ts` | Hook — aktiveras vid `D[1-5]-*` themeId |
| `DesignPackCenterHeader.tsx` | Ersätter kanon-header när `chrome.header === 'center-ornament'` |

### 1.7 Primitives (delade UI-byggblock)

| Primitive | Kanonisk implementation | Alias / re-export |
|-----------|-------------------------|-------------------|
| **Button** | `src/modules/shared/ui/Button.tsx` | Endast via `shared/ui/index.ts` — **nästan ingen konsument import** |
| **BentoCard** | `src/modules/shared/ui/BentoCard.tsx` | `src/modules/core/ui/BentoCard.tsx` (re-export), `Card.tsx` (alias) |
| **UiCard** | `src/modules/core/ui/UiCard.tsx` | Växlar `ui-card` vs `glass-card` per designpaket |
| **CSS-kort** | `calm-card` / `glass-card` (obsidian-calm-2.css) | `glass-hero`, `ui-card` (design-packs.css) |
| **Knapp-CSS** | `.btn-pill--*` i index.css | Används direkt i ~150+ filer |
| **AlertBanner, Input, Modal** | `src/modules/shared/ui/` | Hub/form primitives |
| **typeScale** | `src/modules/core/ui/typeScale.ts` | Hub rubrik-hierarki |
| **CognitiveLoadStrip** | `src/modules/core/ui/CognitiveLoadStrip.tsx` | Låst UX-stöd |
| **HubChromeIconTile** | `src/modules/core/ui/HubChromeIconTile.tsx` | Dock/header tile |

### 1.8 Dokumentation (kanonreferenser)

| Dokument | Sökväg |
|----------|--------|
| COLOR-POLICY | `docs/design/COLOR-POLICY.md` |
| MENU-DRAWER-KANON | `docs/design/references/MENU-DRAWER-KANON.md` |
| DOCK-KANON | `docs/design/references/DOCK-KANON.md` |
| CHROME-POLICY | `docs/design/CHROME-POLICY.md` |
| CHROME-EMBER-KANON | `docs/design/CHROME-EMBER-KANON.md` |
| WIDGET-BAR-SPEC | `docs/design/WIDGET-BAR-SPEC.md` |
| DESIGN-PACK-5 | `docs/design/themes/DESIGN-PACK-5.md` |
| design-calm.mdc | `.cursor/rules/design-calm.mdc` |

### 1.9 Skärmar som påverkas av chrome (routing)

| Route / skärm | Primär komponent | Chrome-beroende |
|---------------|------------------|-----------------|
| Hem `/` | `src/modules/core/pages/HomePage.tsx` | Header, dock, Fyren, scenic bg |
| Hub-sidor (`/vardagen`, `/familjen`, `/dagbok`, …) | Respektive `*Page.tsx` + `HubPageShell` | Samma shell |
| `/kompis` | `KompisHubPage.tsx` | Header + UiCard |
| `/widget/*` | `src/modules/features/widgets/pages/*` | **Ingen** dock/widget (MainLayout undantag delvis) |
| Barnporten child | `barnportenRoutes` | Dock/widget dold (`barnportenChildShell`) |
| `/dev/theme-lab` | `ThemeLabPage.tsx` | Theme/design pack preview |
| Auth-gate | `AuthGate.tsx` | Ingen MainLayout |

---

## 2. Nuvarande stil — tokens, klasser, avvikelser från kanon

### 2.1 Token-lager (tre parallella sanningar)

**A) `:root` fallback (Obsidian Calm — `.cursorrules`)**

```14:46:src/index.css
:root {
  --bg-teal-deep: #020617;
  --bg-dusk: #050b14;
  --surface: #050b14;
  --surface-2: #09111e;
  --surface-3: #111b2d;
  --accent: var(--text-gold);        /* #d4af37 */
  --accent-secondary: #6366f1;     /* INDIGO — trots COLOR-POLICY */
  --accent-ai: #818cf8;
  --border-strong: rgba(99, 102, 241, 0.22);
  --success: #10b981;
  ...
}
```

**B) Runtime theme (`applyTheme` + `themeRegistry.ts`)**

- Default theme ID: **`D1-hamn-kompass`** (`themeRegistry.ts:372`)
- Sätter `html[data-theme]`, `html[data-design-pack]`, och inline CSS-vars
- D1–D5 aktiverar `design-packs.css` via `data-design-pack`

**C) JS tokens (`tokens.ts`)**

```1:26:src/modules/core/ui/tokens.ts
const stone = getTheme(DEFAULT_THEME_ID).cssVars;  // = D1-hamn-kompass, EJ I-stone
export const DESIGN = {
  bg: stone['--bg'] ?? '#0a0a0a',
  accentSecondary: stone['--accent-secondary'] ?? '#f59e0b',
  ...
}
```

**Avvikelse:** Kommentaren i `tokens.ts:1` säger "I-stone default" men `DEFAULT_THEME_ID` är `D1-hamn-kompass`. Fallback-hex i `DESIGN` matchar I-stone/black-stone, inte D1 teal (`#0a1614`).

### 2.2 Tailwind-semantik

`tailwind.config.js:16–40` mappar `bg-surface`, `text-accent`, `border-border` till CSS-vars via `color-mix` — **korrekt mönster** när komponenter använder semantiska klasser.

**Avvikelse:** Kommentarer i config refererar fortfarande indigo (`#6366f1`) och `indigo-glow` shadow (`tailwind.config.js:54`).

### 2.3 Header — prod-kanon vs designpaket

| Läge | Villkor | DOM |
|------|---------|-----|
| **Kanon (default I/E/D ej aktivt som center)** | `useDesignPack().active === false` ELLER `chrome.header !== 'center-ornament'` | `glass-header-bar--kanon` + `data-panel-style` |
| **Designpaket** | Theme `D1`–`D5` | `DesignPackCenterHeader` — döljer `.glass-header-bar--kanon` via CSS |

Panelstilar (`headerPanelStyle.ts:1–11`):

| Stil | Env | CSS |
|------|-----|-----|
| **ember** (prod default) | `VITE_HEADER_PANEL_STYLE=ember` | `index.css:1901–1938` |
| obsidian | `obsidian` | `index.css:1940–1975` |
| aurora | `aurora` | `index.css:1977+` |

Dock delar samma `data-panel-style` via `FloatingDock.tsx:99`.

### 2.4 Kort-arkitektur

| Klass | Källa | Hörnradie | Kanon |
|-------|-------|-----------|-------|
| `calm-card` / `glass-card` | obsidian-calm-2.css:8–34 | **`rounded-3xl`** | design-calm.mdc kräver 3xl |
| `BentoCard` | shared/ui/BentoCard.tsx:36 | Ärver calm-card | Korrekt |
| `glass-hero` | obsidian-calm-2.css:61 | rounded-3xl | Hero-variant |
| `ui-card` | design-packs.css:235 | `--ui-card-radius` (1.25rem) | Designpaket only |
| `.cursorrules` | Obsidian Calm | **`rounded-xl` / `rounded-2xl`** | **Konflikt med design-calm.mdc** |

Silo-glow (`obsidian-calm-2.css:84–148`):

- `glow-bottom-gold`: guld `rgba(212,175,55,…)` — OK
- `glow-bottom-blue`: **`rgb(99 102 241)`** — indigo, strider mot COLOR-POLICY
- `glow-bottom-green`: **`rgb(16 185 129)`** — emerald, policy säger sparsam success-only

### 2.5 Drawer — implementation vs MENU-DRAWER-KANON

| Kanon (MENU-DRAWER-KANON.md) | Nuvarande kod | Avvikelse |
|-------------------------------|---------------|-----------|
| Header: `LIVSKOMPASSEN` serif + ornament | `NavigationDrawer.tsx:117–120` — "MENY" + liten mark | **Etikett & layout** |
| Stäng: guld `×` uppe **vänster** | `NavigationDrawer.tsx:122–128` — `×` uppe **höger** | Position |
| Aktiv rad: guld streck | Accordion + `bg-accent/10` | Delvis OK |
| Flat guld rader (mockup) | Endast vid `data-design-pack` + `.nav-drawer--design-flat` | **Ej kopplat till NavigationDrawer className** |
| Sub-rader indigo/teal | `DrawerHubAccordion.tsx:23–27` — `indigo-500`, `emerald-500` | **COLOR-POLICY-brott** |
| Hub glow blue för familj/dagbok | `drawerFromNavTruth.ts:32–34` | Blå silo-färg i drawer |

Drawer använder `nav-drawer--calm-2` (`NavigationDrawer.tsx:108`) — accordion-hubbar, inte flat mockup.

### 2.6 Dock — implementation vs DOCK-KANON

| Kanon | Nuvarande | Avvikelse |
|-------|-----------|-----------|
| 3 zoner: Familjen · Kompass · Dagbok | **4 zoner** + Fyren-handle (`FloatingDock.tsx:24–64`) | Extra "Handling/Planering" |
| Ingen synlig mitt-text | Kompass OK; **"Fyren"-label synlig** på handle | Extra chrome |
| Ingen båge | `floating-dock__arc { display: none }` (`index.css:1090–1092`) | **OK** |
| `dock-mockup` (D1–D5) | CSS finns (`design-packs.css:157`) men **ingen TSX renderar `.dock-mockup`** | Design pack dock ej wired |

Long-press 3s → Valv: implementerat (`FloatingDock.tsx:82–88`).

### 2.7 Widget-lager

| Spec | Kod |
|------|-----|
| W1–W4 kant-prick / diskret | `FyrenSmartWidgetBar.tsx:7–11` — **returnerar null** |
| Fyren expand grid | `FyrenWidgetBar.tsx` — 8 actions, 4-col grid, ej W1-prick |
| CHROME-POLICY: SmartWidget kanonisk | Policy vs MainLayout monterar **både** stub + legacy FyrenWidgetBar |

### 2.8 Knapp-hierarki

- **Kanonical CSS:** `.btn-pill--accent|secondary|success|ghost` (`index.css:4418–4440`)
- **`Button.tsx`:** Tunn wrapper — **0 direkta imports** i app-kod (allt använder raw klasser)
- **`btn-pill--secondary`:** använder `accent-secondary` → indigo i `:root`

---

## 3. Smärtpunkter

### 3.1 Inconsistency (hög prioritet)

1. **Tre token-sanningar** — `:root` (indigo/teal), `themeRegistry` (D1 default), `tokens.ts` (fel kommentar + I-stone fallbacks).
2. **COLOR-POLICY vs design-calm.mdc vs kod** — policy förbjuder indigo globalt; `.cursorrules` och `design-calm.mdc` tillåter/kräver indigo silo-glow; drawer accordion använder `indigo-500`.
3. **CHROME-POLICY vs MainLayout** — policy säger `FyrenWidgetBar` legacy ej monterad; `MainLayout.tsx:93–95` monterar den + tom `FyrenSmartWidgetBar`.
4. **Design pack halv-wire** — header byts (`AppHeaderBar.tsx:20–27`); dock-mockup CSS finns men `FloatingDock` ignorerar `designPackMeta.dock`.
5. **Drawer kanon-bild vs kod** — header/stäng-position, "MENY" vs "LIVSKOMPASSEN".
6. **Död dock-kod** — `DockHubBand`, `CompassHubOrb` underhålls men används inte i prod shell.
7. **Hörnradie-split** — `.cursorrules` säger `rounded-xl/2xl`; `design-calm.mdc` + `calm-card` säger `rounded-3xl`.
8. **DEFAULT_THEME = D1** — hel prod chrome kan vara design-lab skin medan docs pekar på I-stone/E-skymning-prod.

### 3.2 Hardcoded färger — räkning (scope-filer)

| Fil | `#hex` | `rgb`/`rgba` | Totalt literals |
|-----|--------|--------------|-----------------|
| `src/index.css` | **103** | **101** | **204** |
| `src/styles/obsidian-calm-2.css` | 0 | **14** | **14** |
| `src/styles/design-packs.css` | **6** | **13** | **19** |
| `src/modules/core/ui/tokens.ts` | **14** (fallbacks) | **3** | **17** |
| `src/modules/core/layout/**` (tsx) | 0 | 0 | 0 |
| `src/modules/core/components/**` (tsx) | 0 | 0 | 0 |
| `tailwind.config.js` | 0 (kommentarer) | 1 (`indigo-glow`) | 1 |

**Chrome CSS-total (index + styles):** **109 hex + 128 rgb/rgba = 237 hårdkodade färgliteral** (exkl. avsiktliga hex i `themeRegistry.ts` / `themePackDesign.ts`, ~80+ per registry).

**TSX i core shell:** Inga inline hex — bra separation; avvikelser sitter i Tailwind utility (`indigo-500`, `emerald-500` i `DrawerHubAccordion.tsx`).

### 3.3 Duplicate primitives

#### BentoCard / Card

| Sökväg | Typ |
|--------|-----|
| `src/modules/shared/ui/BentoCard.tsx` | **Kanonisk implementation** |
| `src/modules/core/ui/BentoCard.tsx` | Re-export: `export { BentoCard } from '@/shared/ui/BentoCard'` |
| `src/modules/shared/ui/Card.tsx` | Alias: `export { BentoCard as Card }` |
| `src/modules/core/ui/UiCard.tsx` | Parallell kort-yta (`ui-card` / `glass-card`) |

**Konsumenter:** ~75 filer importerar `BentoCard`; 2 filer använder `UiCard` direkt.

#### Button

| Sökväg | Typ |
|--------|-----|
| `src/modules/shared/ui/Button.tsx` | **Enda Button-komponenten** |
| `src/modules/core/ui/tokens.ts` | `BUTTON_VARIANTS` — klassnamn-map |
| `src/index.css` | `.btn-pill--*` — faktisk styling |

**Konsumenter:** ~150+ filer använder `btn-pill--*` direkt; **Button-komponenten har 0 app-imports** (endast `shared/ui/index.ts` export).

#### Kort-CSS overlap

`calm-card` ≡ `glass-card` (obsidian-calm-2.css:30–34 legacy alias) — medveten duplicering.

---

## 4. Ikon / knapp / meny — tabell

| Element | Current (fil:rad) | Problem | Suggestion category |
|---------|------------------|---------|---------------------|
| Meny-knapp header | `header-chrome-btn--round` + `HeaderMenuGlyph` (`AppHeaderBar.tsx:36–44`) | OK ember 3D; design pack byter till mindre glyph (`DesignPackCenterHeader.tsx:27`) | **Unify glyph size** across kanon/design pack |
| Brand lockup | `LivskompassBrandLockup` (`AppHeaderBrand.tsx:17`) | D1 låst — korrekt | **No change (locked D1)** |
| Design pack titel | Cinzel caps center (`design-packs.css:99–106`) | Ersätter brand helt | **Brand policy** — when to show lockup vs route title |
| Konto / Kompis actions | `AccountAuthMenu` + `KompisHeaderVaultButton` (`MainLayout.tsx:58–66`) | Kompis i header — OK | **Keep** |
| Drawer header | "MENY" + mark (`NavigationDrawer.tsx:117–120`) | Avviker MENU-DRAWER-KANON | **Align to kanon PNG** |
| Drawer stäng | `X` höger (`NavigationDrawer.tsx:122–128`) | Kanon: guld × vänster | **Layout fix** |
| Drawer hub accordion | `DrawerHubAccordion.tsx` + indigo sub-glow | COLOR-POLICY | **Tokenize silo glow → gold-only variants** |
| Drawer Valv-rader | Flat buttons guld (`NavigationDrawer.tsx:173–188`) | OK | **Keep pattern** |
| Valv panik-lås | danger styling (`NavigationDrawer.tsx:192–207`) | Korrekt semantik | **Keep** |
| DrawerModeToggle | "Vardag" solo (`DrawerModeToggle.tsx:7–20`) | Matchar locked UX | **Keep** |
| Dock vänster | Liv + Familj (`FloatingDock.tsx:101–115`) | 4 zoners dock, inte 3 | **DOCK-KANON review** |
| Dock center | `LivskompassMark` + 3s Valv (`FloatingDock.tsx:118–138`) | OK per DOCK-KANON | **Keep** |
| Dock höger | Dagbok + Handling (`FloatingDock.tsx:141–156`) | Extra zon | **Consolidate or document** |
| Fyren handle | Synlig "Fyren" label (`FyrenWidgetBar.tsx:161`) | Extra text ovan dock | **Progressive disclosure** |
| Fyren widget strip | 4×2 grid (`FyrenWidgetBar.tsx:17–36`, `index.css:3923+`) | Ej W1 kant-prick; policy konflikt | **Implement W1 OR deprecate legacy bar** |
| FyrenSmartWidgetBar | `return null` (`FyrenSmartWidgetBar.tsx:11`) | Spec says kanonisk | **Wire W1–W4 or update policy** |
| Dock ikoner | `DrawerL2Icon` calm variant (`FloatingDock.tsx:107–108`) | Lucide L2 — OK | **Keep** |
| Panel style ember | `data-panel-style=ember` (`index.css:1901+`) | Låst CHROME-EMBER-KANON | **Reference implementation** |
| Panel style aurora | teal/indigo glow (`index.css:1977+`) | Strider COLOR-POLICY globalt | **Lab-only label** |
| btn-pill primary | `.btn-pill--accent` | OK guld | **Keep** |
| btn-pill secondary | `.btn-pill--secondary` → indigo (`index.css:4434–4436`) | Policy | **Remap to amber/gold dim** |
| BentoCard | `calm-card` + optional glow | blue/green glow indigo/emerald | **Silo glow palette audit** |
| UiCard | design pack row/timeline | Bara 2 hub-konsumenter | **Promote or merge with BentoCard** |
| Button component | unused wrapper | Dead abstraction | **Adopt in new code OR remove** |
| Chrome v4 icons | `ChromeV4Icon.tsx` | D1-skiva + glyph — ICON-STYLE-GUIDE | **Expand to drawer/dock** |
| Ambient scenic | `home-hero-scenic.png` (`index.css:174–183`) | Hardcoded path | **Theme-pack `--design-bg-image`** |

---

## 5. Referensbilder — `docs/design/galleri/`

### Shell & navigation

| Bild | Sökväg | Användning |
|------|--------|------------|
| Meny drawer kanon | `docs/design/galleri/skarmar/meny-drawer-kanon.png` | Drawer layout lock |
| Meny drawer (alt) | `docs/design/galleri/skarmar/meny-drawer.png` | Jämförelse |
| Hem mix E | `docs/design/galleri/mix-E-final-hem.png` | Hem composition |
| Kompis hub | `docs/design/galleri/skarmar/kompis.png` | Header + hub |
| Familjen | `docs/design/galleri/skarmar/familjen.png` | Hub chrome |
| Valv pansaret | `docs/design/galleri/skarmar/valv-pansaret.png` | Valv drawer context |
| Hamn BIFF | `docs/design/galleri/skarmar/hamn-biff.png` | Hamn hub |
| Kompass locked | `docs/design/KOMPASS-LOCKED-kanon.png` | D1 kompass |

### Widget W1–W4

| ID | Sökväg |
|----|--------|
| W1 discreet | `docs/design/galleri/widget/W1-discreet.png` |
| W1 v2 kompakt projekt | `docs/design/galleri/widget/v2/W1-kompakt-projekt.png` |
| W2 båge | `docs/design/galleri/widget/W2-bage.png` |
| W3 dock | `docs/design/galleri/widget/W3-dock.png` |
| W4 hörn | `docs/design/galleri/widget/W4-horn.png` |
| Alla varianter 1–4 | `docs/design/galleri/fyren-widget-variants-1-4.png` |
| Hybrid 3+4 | `docs/design/galleri/fyren-variant-3-plus-4-hybrid.png` |

### Hero & E2 återställda

| Bild | Sökväg |
|------|--------|
| E2 hero | `docs/design/galleri/e2-aterstallda/E2-00-hero.png` |
| E2 widget discreet | `docs/design/galleri/e2-aterstallda/E2-widget-discreet.png` |
| E2 pansaret | `docs/design/galleri/e2-aterstallda/E2-05-pansaret.png` |
| E2 app icon | `docs/design/galleri/e2-aterstallda/E2-app-icon.png` |

### Ikoner & app

| Bild | Sökväg |
|------|--------|
| Meny loggor sheet | `docs/design/galleri/ikoner/meny-loggor-sheet.png` |
| App icon | `docs/design/galleri/ikoner/app-icon.png` |

### Planering (widget-relaterad kontext)

| Bild | Sökväg |
|------|--------|
| P3 kanban | `docs/design/galleri/planering/P3-kanban.png` |
| Projekt ny picker v2 | `docs/design/galleri/widget/v2/projekt-ny-picker.png` |

### Externa referenser (ej galleri men citerade i kanon)

| Bild | Sökväg |
|------|--------|
| MENU-DRAWER-KANON | `docs/design/references/MENU-DRAWER-KANON.png` |
| DOCK flat valv arch | `docs/design/references/dock-flat-valv-arch.png` |
| E home hero | `docs/design/references/E-home-hero-kanon.png` |
| Design pack mockups | `public/design/mockups/ref-hamn.png`, `ref-familjen.png`, `ref-minnes.png` |

---

## 6. Krav för 3 stilar — functional locks vs visuell frihet

**Definition:** De tre panelstilarna **`ember` | `obsidian` | `aurora`** (`headerPanelStyle.ts:1–11`, `CHROME-POLICY.md:32–44`, `CHROME-EMBER-KANON.md`).

### 6.1 Functional locks (MUST NOT ändras per stil)

| Lock | Källa | Krav |
|------|-------|------|
| **D1 LivskompassMark** | `.context/locked-icons.md` | Mitt dock + brand — låst guld stack |
| **M2 KompisMark** | locked-icons | Aldrig LivskompassMark i KompisAvatar |
| **Drawer Vardag/Valv split** | locked-ux-features | Valv-sektion endast när `vaultOpen` |
| **Ingen Valv i publikt drawer** | MENU-DRAWER-KANON | Ingen Valv-växlare utan PIN |
| **Aktiv drawer-rad = guld** | COLOR-POLICY:36 | Oberoende av hub-tema |
| **Dock mitt = Hem, 3s → Valv** | DOCK-KANON | `aria-label` Hem; ingen "Hamn"-text |
| **Header ↔ dock samma panel style** | CHROME-EMBER-KANON:58 | Samma `data-panel-style` |
| **WORM / PIN / Zero Footprint** | security.md | Ej design-scope men påverkar Valv-knapp |
| **3-zon routing** | `.cursorrules` §2 | `/dagbok`, `/vardagen`, `/familjen` |
| **Barnporten: dölj dock** | `MainLayout.tsx:91–97` | Child shell utan dock |
| **FyrenSmartWidgetBar dold på `/widget/*`** | `FyrenSmartWidgetBar.tsx:9` | Deep link isolation |
| **Kill switch inspelning** | WIDGET-BAR-SPEC | Säkerhet > skin |

### 6.2 Visuell frihet (MAY variera per stil)

| Yta | ember | obsidian | aurora |
|-----|-------|----------|--------|
| Panel gradient | Varm brons → obsidian (`index.css:1904–1908`) | Slate silver (`1943–1947`) | Teal/indigo glöd (`1977+`) |
| Panel border | `rgba(212,175,55,0.42)` | `rgba(148,163,184,0.35)` | teal/indigo mix |
| Topp highlight `::before` | Guld linje | Silver linje | Aurora linje |
| Dock rail | Matchar header ember block | Matchar obsidian | Matchar aurora |
| `header-chrome-btn` inset | Varm guld highlight | Kall slate | Aurora tint |
| Ambient blob intensity | Standard gold | Kan minska gold | Kan öka secondary blob |
| `--accent-secondary` runtime | bör förbli amber/guld i prod | slate accent OK | **lab only** för indigo |

### 6.3 Rekommendation för redesign

- **Prod default:** endast **ember** tills COLOR-POLICY och aurora CSS harmoniseras.
- **obsidian:** tillåten som "kall dokumentationsläge" (dossier, export).
- **aurora:** **theme-lab only** — bryter global färgpolicy idag.

### 6.4 Separata "design packs" (D1–D5) — ej samma som 3 panelstilar

D1–D5 byter **layout-family** (center header, flat drawer, ui-card). Functional locks ovan gäller fortfarande; visuellt friare men **dock-mockup måste wire:as** eller tas bort från meta.

---

## 7. Mockup-skärmar att speca — alla 3 panelstilar

För varje stil (`ember`, `obsidian`, `aurora`): producera **7 skärmar** (21 mockups totalt). Format: 390×844 (iPhone), safe-area, Obsidian Calm 2.0.

### 7.1 Gemensamma annoteringar (alla mockups)

- Visa `data-panel-style` i filnamn: `{stil}-{skärm}.png`
- Header + dock **identisk panelstil** (CHROME-EMBER-KANON)
- Aktiv navigation alltid **guld** (#d4af37), inte teal/indigo
- D1 kompass-mark i dock center (låst)
- Bakgrund: scenic `home-hero-scenic.png` + overlay (samma som prod)

---

### 7.2 Skärm A — Home (`/`)

| Stil | Spec |
|------|------|
| **Alla** | `AppHeaderBar` kanon: meny vänster, brand + page badge, konto + Kompis höger |
| **ember** | Varm 3D panel, guld top highlight, `LivskompassBrandLockup` synlig |
| **obsidian** | Slate panel, silver highlight, samma layout |
| **aurora** | Teal/indigo panel glow — märk "LAB" watermark |
| **Innehåll** | `HomePage` — CaptureSuperModule överst, adaptiva kort, scenic bg |
| **Referens** | `docs/design/galleri/mix-E-final-hem.png`, `e2-aterstallda/E2-00-hero.png` |

---

### 7.3 Skärm B — Drawer open

| Stil | Spec |
|------|------|
| **Alla** | 68vw drawer, scenic blur overlay (`index.css:2288–2317`) |
| **Sektion** | "VARDAG" + hub accordions; **ingen** Valv om ej unlocked |
| **ember** | Accordion active: `bg-accent/10`, guld border |
| **obsidian** | Drawer panel kallare; active state **fortfarande guld** |
| **aurora** | Backdrop kan ha svag aurora blob — rader guld |
| **Avvikelse att besluta** | Mockup kanon vs kod: "LIVSKOMPASSEN" center + × vänster |
| **Referens** | `docs/design/galleri/skarmar/meny-drawer-kanon.png` |

**Extra mockup (Valv unlocked):** Vardag + Valv sektion + "Lås Valvet nu" (`NavigationDrawer.tsx:161–208`).

---

### 7.4 Skärm C — Dock (collapsed)

| Stil | Spec |
|------|------|
| **Alla** | `FloatingDock` 4-zon layout + `FyrenDockHandle` ovan |
| **Center** | Endast `LivskompassMark` — **ingen** synlig "Hamn" |
| **ember** | `dock-hub-band[data-panel-style=ember]` — låst ember rail |
| **obsidian/aurora** | Matchande rail — verify side buttons same chrome-btn 3D |
| **Labels** | Liv och göra · Familjen · Dagbok · Handling (document 4-zone decision) |
| **Referens** | `docs/design/references/DOCK-KANON.md`, `dock-flat-valv-arch.png` |

---

### 7.5 Skärm D — Widget (W1–W4) — en mockup per variant

| Variant | Activation UI | Mockup innehåll |
|---------|---------------|-----------------|
| **W1** | 3px guld prick höger kant, collapsed | Expanderad: tunn strip — se `W1-discreet.png`, `v2/W1-kompakt-projekt.png` |
| **W2** | Långtryck nedre båge 1s | `W2-bage.png` |
| **W3** | Håll dock-kompass 1s | `W3-dock.png` |
| **W4** | Trippeltryck 12×12px hörn | `W4-horn.png` |

**Per panelstil:** samma W1–W4 beteende; endast strip/border färg följer ember/obsidian/aurora.

**Actions (minimum):** + Projekt, tyst inspelning (diskret), lista, anteckning — per WIDGET-BAR-SPEC.

**Nuvarande gap:** Kod visar Fyren 4×2 grid — mockups ska visa **target W1** + markera delta mot `FyrenWidgetBar.tsx`.

---

### 7.6 Skärm E — Header with brand (isolated)

| Stil | Spec |
|------|------|
| **Layout** | Close crop: full header width, max-w-2xl |
| **ember** | Exakt CHROME-EMBER-KANON gradient + 2px guld kant |
| **obsidian** | Silver kant, kall gradient |
| **aurora** | Aurora kant + glow |
| **Brand** | `LivskompassBrandLockup layout="header"` — serif caps, guld |
| **States** | Default Hem · sub-route badge ("Planering") · menu `aria-expanded=true` |
| **Referens** | `docs/design/galleri/ikoner/meny-loggor-sheet.png` |

---

### 7.7 Leveranschecklista (design team)

```
docs/design/redesign-audit/mockups/
  ember-home.png
  ember-drawer.png
  ember-drawer-valv.png
  ember-dock.png
  ember-widget-W1.png … W4.png
  ember-header-brand.png
  obsidian-*.png (samma set)
  aurora-*.png (samma set + LAB watermark)
```

**Acceptanskriterier:**

1. Side-by-side header/dock — panelstil matchar inom samma skärm.
2. Guld active states identiska across stilar (COLOR-POLICY).
3. Inga indigo primary accents i prod ember set.
4. D1 mark pixel-stable (smoke:locked-icons).
5. W1 mockup skiljer sig från nuvarande Fyren 4×2 grid.

---

## Bilaga A — Prioriterad åtgärdsmatris (implementationsvägledning)

| P | Åtgärd | Filer |
|---|--------|-------|
| P0 | Besluta prod theme: D1 vs I-stone/E-prod | `themeRegistry.ts`, `applyDefaultTheme` |
| P0 | Wire W1 ELLER uppdatera CHROME-POLICY + ta bort dubbel widget | `FyrenSmartWidgetBar`, `MainLayout`, `FyrenWidgetBar` |
| P1 | Drawer header align kanon PNG | `NavigationDrawer.tsx`, `index.css` nav-drawer |
| P1 | Ersätt indigo drawer sub-glow med guld-dim | `DrawerHubAccordion.tsx`, `drawerFromNavTruth.ts` |
| P1 | `btn-pill--secondary` → amber, inte indigo | `index.css:4434` |
| P2 | Wire design pack dock OR remove dock-mockup CSS | `FloatingDock`, `designPackMeta.ts` |
| P2 | Adopt `Button` component OR document btn-pill as primitive | `Button.tsx` |
| P3 | Remove/archive `DockHubBand`, `CompassHubOrb` if unused | layout/ |
| P3 | Harmonize `rounded-3xl` vs `.cursorrules` rounded-xl | obsidian-calm-2.css vs rules |

---

## Bilaga B — Nyckelkodreferenser (quick index)

| Topic | Reference |
|-------|-----------|
| Shell mount order | `MainLayout.tsx:41–99` |
| Header branch | `AppHeaderBar.tsx:16–50` |
| Panel styles | `headerPanelStyle.ts:6–11`, `index.css:1900–2010` |
| Drawer structure | `NavigationDrawer.tsx:107–230` |
| Dock zones | `FloatingDock.tsx:24–159` |
| Smart widget stub | `FyrenSmartWidgetBar.tsx:7–11` |
| Theme apply | `applyTheme.ts:30–48` |
| Default theme | `themeRegistry.ts:372` |
| Calm card | `obsidian-calm-2.css:8–34` |
| BentoCard | `shared/ui/BentoCard.tsx:24–57` |
| Design pack header | `DesignPackCenterHeader.tsx:13–44` |

---

*Slut på AGENT-01 rapport. Spara som `docs/design/redesign-audit/AGENT-01-chrome-system.md`. Ask mode — ingen fil skrevs av agenten; kopiera markdown manuellt eller växla till Agent mode för persist.*

