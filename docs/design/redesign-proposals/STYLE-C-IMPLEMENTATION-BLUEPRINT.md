# Style C — Aurora Prism Implementation Blueprint

**Theme pack ID:** `R-C-aurora-prism`  
**Companion spec:** [`STYLE-C-SPEC.md`](./STYLE-C-SPEC.md)  
**Mockups:** [`gallery/style-c/screens.html`](./gallery/style-c/screens.html)  
**Status:** Ready for Theme Lab wiring — **not prod default**  
**Datum:** 2026-06-07

---

## 1. Executive summary

This blueprint wires Style C into Livskompassen’s existing theme infrastructure without breaking functional locks. Work splits into **Phase 1 (lab-only)** and **Phase 2 (post-approval prod merge)**.

| Phase | Scope | Prod impact |
|-------|-------|-------------|
| **1 — Lab pack** | Register theme + CSS file + gallery | None — `/dev/theme-lab` only |
| **2 — Chrome merge** | Panel style harmonization, silo glow classes | Requires `GODKÄND:` + smoke |
| **3 — Icon proposals** | v6 aurora stroke set | Optional; D1/M2 locked |

---

## 2. Theme pack registration

### 2.1 New file — `src/modules/core/theme/themePackRedesignC.ts`

```typescript
import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const auroraPrismVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#020617',
  '--bg-dusk': '#050b14',
  '--surface': '#050b14',
  '--surface-2': '#09111e',
  '--surface-3': '#111b2d',
  '--accent': '#2dd4bf',
  '--accent-secondary': '#818cf8',
  '--accent-light': '#99f6e4',
  '--accent-ai': '#818cf8',
  '--accent-glow': 'rgba(45, 212, 191, 0.22)',
  '--accent-violet-glow': 'rgba(129, 140, 248, 0.18)',
  '--success': '#10b981',
  '--glass': 'rgba(5, 11, 20, 0.55)',
  '--glass-hero': 'rgba(5, 11, 20, 0.72)',
  '--border': 'rgba(45, 212, 191, 0.14)',
  '--border-strong': 'rgba(129, 140, 248, 0.28)',
  '--compass-disk': '#0d2838',
  /* Navigation lock — drawer/dock active gold */
  '--nav-active': '#d4af37',
  '--nav-active-glow': 'rgba(212, 175, 55, 0.12)',
  /* Aurora decorative */
  '--aurora-teal': '#2dd4bf',
  '--aurora-violet': '#818cf8',
  '--prism-blur': '20px',
  '--prism-saturate': '140%',
} as const;

export const THEME_PACK_REDESIGN_C: ThemePack[] = [
  {
    id: 'R-C-aurora-prism',
    label: 'Aurora Prism',
    description:
      'Futuristisk glas — norrsken teal + violet, deep void, mono data. Redesign Style C.',
    background: 'aurora',
    preview: '/design/redesign-proposals/gallery/style-c/preview-hero.png',
    designPackId: 'D3', // or D1 after layout decision — see §4.2
    cssVars: { ...auroraPrismVars },
  },
];

export const REDESIGN_C_THEME_IDS = THEME_PACK_REDESIGN_C.map((p) => p.id);
```

### 2.2 Registry merge — `src/modules/core/theme/themeRegistry.ts`

```typescript
import { THEME_PACK_REDESIGN_C } from './themePackRedesignC';

export const THEME_REGISTRY: ThemePack[] = [
  ...THEME_PACK_DESIGN,
  ...THEME_PACK_MOCKUP,
  ...THEME_PACK_REDESIGN_C, // ← add after mockups, before E_PROD
  THEME_PACK_E_PROD,
  // ...
];
```

### 2.3 Theme Lab visibility — `src/modules/core/theme/themeLabVariants.ts`

Add to lab picker group **«Redesign (2026)»**:

```typescript
{
  group: 'Redesign (2026)',
  packs: ['R-C-aurora-prism'],
}
```

Do **not** set `DEFAULT_THEME_ID` to `R-C-aurora-prism` until approval.

### 2.4 Runtime application

Existing `applyTheme()` in `applyTheme.ts` already:

- Sets `data-theme`, `data-theme-bg`, optional `data-design-pack`
- Injects all `cssVars` on `:root`

Verify after Phase 1:

```javascript
document.documentElement.dataset.theme === 'R-C-aurora-prism'
document.documentElement.dataset.themeBg === 'aurora'
getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() === '#2dd4bf'
```

---

## 3. Complete CSS variable checklist

### 3.1 Required vars (theme pack)

| Variable | Value | Verified by |
|----------|-------|-------------|
| `--bg` | `#020617` | shell background |
| `--bg-dusk` | `#050b14` | gradient end |
| `--surface` | `#050b14` | flat panels |
| `--surface-2` | `#09111e` | cards |
| `--surface-3` | `#111b2d` | hover |
| `--accent` | `#2dd4bf` | primary CTA |
| `--accent-secondary` | `#818cf8` | AI secondary |
| `--accent-light` | `#99f6e4` | highlights |
| `--accent-ai` | `#818cf8` | Kompis |
| `--accent-glow` | `rgba(45,212,191,0.22)` | bloom |
| `--accent-violet-glow` | `rgba(129,140,248,0.18)` | bloom |
| `--success` | `#10b981` | confirm |
| `--glass` | `rgba(5,11,20,0.55)` | panels |
| `--glass-hero` | `rgba(5,11,20,0.72)` | hero |
| `--border` | `rgba(45,212,191,0.14)` | hairline |
| `--border-strong` | `rgba(129,140,248,0.28)` | focus |
| `--compass-disk` | `#0d2838` | dock |
| `--text` | `#f8fafc` | shared |
| `--text-muted` | `#94a3b8` | shared |
| `--text-dim` | `#64748b` | shared |
| `--warning` | `#f59e0b` | shared |
| `--danger` | `#ef4444` | shared |
| `--nav-active` | `#d4af37` | drawer/dock lock |
| `--nav-active-glow` | `rgba(212,175,55,0.12)` | active row |

### 3.2 Derived vars (CSS file only — not in pack)

| Variable | Definition |
|----------|------------|
| `--aurora-stroke` | linear-gradient 135deg teal → violet → teal |
| `--aurora-fill` | radial ellipse top aurora wash |
| `--aurora-ambient` | conic ambient layer |
| `--prism-blur` | `20px` |
| `--prism-saturate` | `140%` |

### 3.3 Tailwind bridge — `tailwind.config.js`

Confirm existing semantic colors read CSS vars (no change expected):

```javascript
accent: 'var(--accent)',
'surface-2': 'var(--surface-2)',
// ...
```

Add optional mono stack if missing:

```javascript
fontFamily: {
  mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
}
```

### 3.4 Font loading — `index.html` or `index.css`

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

JetBrains Mono required for Style C data surfaces.

---

## 4. File checklist

### 4.1 Phase 1 — create / edit

| # | Action | File | Notes |
|---|--------|------|-------|
| 1 | **CREATE** | `src/modules/core/theme/themePackRedesignC.ts` | Pack definition |
| 2 | **EDIT** | `src/modules/core/theme/themeRegistry.ts` | Import + spread |
| 3 | **EDIT** | `src/modules/core/theme/themeLabVariants.ts` | Lab group |
| 4 | **CREATE** | `src/styles/redesign-c-aurora-prism.css` | prism-card, glows, aurora bg |
| 5 | **EDIT** | `src/index.css` | `@import` redesign CSS **after** obsidian-calm-2 |
| 6 | **EDIT** | `src/modules/core/layout/AmbientBackground.tsx` | Ensure `aurora` bg variant uses teal/violet blobs |
| 7 | **CREATE** | `public/design/redesign-proposals/gallery/style-c/preview-hero.png` | Optional 390×844 export from screens.html |
| 8 | **DOCS** | `docs/design/redesign-proposals/STYLE-C-SPEC.md` | ✅ Done |
| 9 | **DOCS** | `docs/design/redesign-proposals/STYLE-C-IMPLEMENTATION-BLUEPRINT.md` | ✅ This file |
| 10 | **DOCS** | `docs/design/redesign-proposals/gallery/style-c/screens.html` | ✅ Mockups |
| 11 | **EDIT** | `docs/design/themes/VARIANTS.md` | Add row «R-C-aurora-prism — lab» |

### 4.2 Phase 2 — post-approval (do not run early)

| # | Action | File | Notes |
|---|--------|------|-------|
| 12 | **EDIT** | `src/styles/redesign-c-aurora-prism.css` | Scope `[data-theme='R-C-aurora-prism']` |
| 13 | **EDIT** | `src/styles/obsidian-calm-2.css` | Add `.glow-bottom-teal`, `.glow-bottom-violet`, `.glow-bottom-mint` |
| 14 | **EDIT** | `src/modules/shared/ui/BentoCard.tsx` | Map glow prop → Style C classes when theme active |
| 15 | **EDIT** | `src/index.css` | Panel style `aurora` block audit — align with pack vars |
| 16 | **EDIT** | `src/modules/core/ui/tokens.ts` | Document Style C button tokens (optional) |
| 17 | **EDIT** | `docs/design/COLOR-POLICY.md` | Add § Style C exception or keep lab-only note |
| 18 | **CREATE** | `scripts/icons-proposals-v6.mjs` | Aurora stroke icon batch |
| 19 | **EDIT** | `package.json` | `"icons:proposals-v6": "node scripts/icons-proposals-v6.mjs"` |

### 4.3 Files that MUST NOT change without approval

| File | Reason |
|------|--------|
| `LivskompassMark.tsx` | D1 locked |
| `KompisMark.tsx` | M2 locked |
| `.context/locked-icons.md` | Icon governance |
| `.context/locked-ux-features.md` | UX locks |
| `firestore.rules` | Out of scope |
| `navTruth.ts` structure | 3-zone lock |

### 4.4 Design pack coupling

| Option | `designPackId` | Tradeoff |
|--------|----------------|----------|
| **A (recommended lab)** | `D3` | Flat drawer + center header — matches mockups |
| **B** | `D1` | Gold stack header — may clash with teal content |
| **C** | none | Content-only reskin; chrome stays ember |

Record decision in `VARIANTS.md` when user picks.

---

## 5. CSS implementation — `redesign-c-aurora-prism.css`

### 5.1 Scope wrapper

```css
[data-theme='R-C-aurora-prism'] {
  /* optional overrides if pack vars insufficient */
  color-scheme: dark;
}
```

### 5.2 Core classes to implement

| Class | Replaces | Priority |
|-------|----------|----------|
| `.prism-card` | `.calm-card` / `.glass-card` | P0 |
| `.prism-hero` | `.glass-hero` | P0 |
| `.input-prism` | `.input-glass` | P0 |
| `.glow-bottom-teal` | `.glow-bottom-gold` (Style C zones) | P1 |
| `.glow-bottom-violet` | `.glow-bottom-blue` | P1 |
| `.glow-bottom-mint` | `.glow-bottom-green` | P1 |
| `.btn-pill--accent` override | teal gradient | P1 |
| `.aurora-ambient-layer` | scenic photo | P0 |

### 5.3 Panel style sync

When theme `R-C-aurora-prism` active, set header/dock panel style:

```typescript
// ThemeProvider or applyTheme follow-up
if (themeId === 'R-C-aurora-prism') {
  document.documentElement.dataset.panelStyle = 'aurora';
}
```

Aligns with `headerPanelStyle.ts` values: `ember | obsidian | aurora`.

Existing aurora panel CSS lives in `index.css` ~L1977+. Audit for hardcoded hex; replace with `var(--accent)` / `var(--accent-secondary)`.

### 5.4 AmbientBackground

For `background: 'aurora'`:

```tsx
// Pseudocode — teal + violet blobs, no scenic PNG by default
<div className="aurora-blob aurora-blob--teal" />
<div className="aurora-blob aurora-blob--violet" />
```

Keep blob animation static or ≤ 0.2 opacity pulse @ 0.1 Hz; respect `prefers-reduced-motion`.

---

## 6. Component wiring map

| Primitive | Primary file(s) | Style C change |
|-----------|-----------------|----------------|
| Buttons | `index.css` `.btn-pill--*` | Teal primary scoped to theme |
| BentoCard | `BentoCard.tsx` | `prism-card` class when theme |
| TabBar | `TabBar.tsx`, `HubTabBar.tsx` | Gold selected (no change) |
| Drawer | `NavigationDrawer.tsx` | Gold active (no change) |
| Dock | `FloatingDock.tsx` | aurora panel + D1 disk vars |
| Input | form components | `input-prism` class swap |
| Modal | `Modal.tsx` | prism-card wrapper |
| PinGate | `PinGate.tsx`, `VaultLockedGate.tsx` | Teal shield; copy fix separate |
| Valv panels | `VaultMonsterPanel.tsx`, etc. | Silo violet glow |
| Kompis | `KompisHubPage.tsx`, chat panels | Violet bubbles |

Use theme hook pattern:

```typescript
import { useThemeId } from '@/modules/core/theme/ThemeProvider';

const isAuroraPrism = themeId === 'R-C-aurora-prism';
const cardClass = isAuroraPrism ? 'prism-card' : 'calm-card';
```

Prefer CSS `[data-theme='R-C-aurora-prism'] .calm-card { … }` over scattered TS if possible.

---

## 7. Deploy runbook

### 7.1 Local verification (Phase 1)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0

# Frontend compile
npm run build

# Open Theme Lab
npm run dev
# Navigate: http://localhost:5173/dev/theme-lab
# Select: Aurora Prism (R-C-aurora-prism)
# Verify: --accent teal, aurora bg, prism cards on sample modules

# Static mockups
open docs/design/redesign-proposals/gallery/style-c/screens.html
```

### 7.2 Smoke tests (Phase 2 — before hosting deploy)

```bash
npm run smoke:locked-ux
npm run smoke:locked-icons
npm run smoke:design-modules
npm run build
```

Expected: all PASS; no removal of Barnfokus, Valv tabs, Kanban columns.

### 7.3 Production deploy (frontend only)

**Only after user writes `GODKÄND: R-C-aurora-prism` in `VARIANTS.md`.**

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase use gen-lang-client-0481875058
firebase deploy --only hosting
```

Post-deploy:

1. Hard refresh web (`Cmd+Shift+R`)  
2. Theme Lab confirms pack visible  
3. Prod default theme unchanged unless explicitly switched  

**No functions deploy** required for CSS-only theme pack.

### 7.4 Android (if user sets theme on device)

```bash
npm run build:web && npx cap sync android
```

Gradle Sync → Run. Theme override stored in `localStorage` on web; Android WebView same key `livskompassen_theme_override`.

### 7.5 Rollback

| Scenario | Action |
|----------|--------|
| Lab regression | Remove pack from `themeRegistry.ts`; rebuild |
| User theme stuck | Clear `localStorage.livskompassen_theme_override` |
| Prod visual bug | Revert commit; `firebase deploy --only hosting` |
| Default wrongly changed | Reset `DEFAULT_THEME_ID` in `themeRegistry.ts` |

---

## 8. Icon pipeline (Phase 3 optional)

```bash
npm run icons:proposals-v6 -- --style aurora-prism --out docs/design/icons-proposals/2026-06-redesign-c/
```

Outputs 24 chrome SVGs with shared `<linearGradient id="aurora-stroke">`.

**D1/M2:** Do not replace until `.context/locked-icons.md` updated and `npm run smoke:locked-icons` PASS with approval note.

---

## 9. Testing matrix

| Test | Command / action | Pass criteria |
|------|------------------|---------------|
| Build | `npm run build` | Exit 0 |
| Theme inject | DevTools → `:root` vars | Teal accent |
| Drawer active | Open drawer, select row | Gold highlight |
| Valv hidden | Logout vault session | No Valv section |
| Valv visible | Unlock vault | Valv section + gold rows |
| Kanban | `/planering` | 3 columns |
| Barnfokus | `/familjen?tab=reflektion` | Panel + save copy |
| Kompis gate | `/kompis` | WebAuthn hint |
| Reduced motion | OS setting on | No blob animation |
| Locked icons | `npm run smoke:locked-icons` | PASS |

---

## 10. Documentation updates after merge

| Document | Update |
|----------|--------|
| `docs/design/themes/VARIANTS.md` | Status lab → approved |
| `docs/design/themes/THEME-COMPARISON.md` | Add row Style C |
| `docs/evaluations/2026-06-07-design-redesign-master-audit.md` | Link deliverables ✅ |
| `docs/design/redesign-proposals/gallery/index.html` | Add Style C tab (future) |

---

## 11. Implementation order (single agent session)

1. Create `themePackRedesignC.ts` + registry wiring  
2. Create `redesign-c-aurora-prism.css` + import  
3. Verify Theme Lab picker  
4. Scope-test on `/`, `/dagbok`, `/vardagen`, `/familjen`  
5. Run `npm run build` + smokes  
6. Ask user: **«Ska jag köra deploy nu?»** — only if approved  

---

## 12. Related files

- Spec: [`STYLE-C-SPEC.md`](./STYLE-C-SPEC.md)  
- Mockups: [`gallery/style-c/screens.html`](./gallery/style-c/screens.html)  
- Master audit: [`../../evaluations/2026-06-07-design-redesign-master-audit.md`](../../evaluations/2026-06-07-design-redesign-master-audit.md)  
- Theme registry: [`../../../src/modules/core/theme/themeRegistry.ts`](../../../src/modules/core/theme/themeRegistry.ts)  
- Panel policy: [`../CHROME-POLICY.md`](../CHROME-POLICY.md)  
- Color policy: [`../COLOR-POLICY.md`](../COLOR-POLICY.md)  
