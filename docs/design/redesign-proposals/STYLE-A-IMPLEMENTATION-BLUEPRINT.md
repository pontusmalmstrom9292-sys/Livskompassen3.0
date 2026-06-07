# Style A — Nordic Precision Implementation Blueprint

**Theme pack ID:** `R-A-nordic-precision`  
**Companion spec:** [`STYLE-A-SPEC.md`](./STYLE-A-SPEC.md)  
**Mockups:** [`gallery/style-a/screens.html`](./gallery/style-a/screens.html)  
**Status:** Ready for Theme Lab — **not prod default**  
**Datum:** 2026-06-07

---

## 1. Executive summary

| Phase | Scope | Prod impact |
|-------|-------|-------------|
| **1 — Lab pack** | Register theme + CSS + gallery | None — `/dev/theme-lab` |
| **2 — Chrome merge** | Obsidian panel style, flat cards | Requires `GODKÄND:` + smoke |
| **3 — Icons v6 nordic** | Silver stroke set | Optional; D1/M2 locked |

**Tidsuppskattning:** ~1 nattpass (6–8 h agent)

---

## 2. Theme pack — `src/modules/core/theme/themePackRedesignA.ts`

```typescript
import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const nordicPrecisionVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#0f1419',
  '--bg-dusk': '#131820',
  '--surface': '#131820',
  '--surface-2': '#1a2332',
  '--surface-3': '#243044',
  '--accent': '#38bdf8',
  '--accent-secondary': '#94a3b8',
  '--accent-light': '#cbd5e1',
  '--accent-glow': 'rgba(56, 189, 248, 0.12)',
  '--success': '#10b981',
  '--glass': 'rgba(19, 24, 32, 0.88)',
  '--glass-hero': 'rgba(19, 24, 32, 0.94)',
  '--border': 'rgba(148, 163, 184, 0.18)',
  '--border-strong': 'rgba(56, 189, 248, 0.22)',
  '--compass-disk': '#243044',
  '--nav-active': '#c9a227',
  '--nav-active-glow': 'rgba(201, 162, 39, 0.1)',
} as const;

export const THEME_PACK_REDESIGN_A: ThemePack[] = [
  {
    id: 'R-A-nordic-precision',
    label: 'Nordic Precision',
    description: 'Kirurgisk nordisk — isblå CTA, silver chrome, minimal guld nav.',
    background: 'obsidian',
    preview: '/design/redesign-proposals/gallery/style-a/preview-hero.png',
    designPackId: 'D4',
    cssVars: { ...nordicPrecisionVars },
  },
];
```

---

## 3. File checklist (52 items)

### Phase 1 — Lab only

| # | Action | File |
|---|--------|------|
| 1 | CREATE | `src/modules/core/theme/themePackRedesignA.ts` |
| 2 | EDIT | `src/modules/core/theme/themeRegistry.ts` — import + spread |
| 3 | EDIT | `src/modules/core/theme/themeLabVariants.ts` — group «Redesign (2026)» |
| 4 | CREATE | `src/styles/redesign-a-nordic-precision.css` |
| 5 | EDIT | `src/index.css` — `@import` after obsidian-calm-2 |
| 6 | EDIT | `src/modules/core/pages/ThemeLabPage.tsx` — Redesign A section |
| 7 | EDIT | `src/modules/core/layout/AmbientBackground.tsx` — flat obsidian, no scenic |
| 8 | EDIT | `src/modules/core/layout/headerPanelStyle.ts` — force `obsidian` when theme A |
| 9 | DOCS | `STYLE-A-SPEC.md` ✅ |
| 10 | DOCS | `STYLE-A-IMPLEMENTATION-BLUEPRINT.md` ✅ |
| 11 | DOCS | `gallery/style-a/screens.html` ✅ |
| 12 | EDIT | `docs/design/theme-lab/VARIANTS.md` — row «R-A-nordic-precision — lab» |

### Phase 2 — Post-approval

| # | Action | File |
|---|--------|------|
| 13 | EDIT | `redesign-a-nordic-precision.css` — `.panel-card`, `.glow-bottom-silver` |
| 14 | EDIT | `obsidian-calm-2.css` — `[data-theme='R-A-nordic-precision'] .calm-card` overrides |
| 15 | EDIT | `BentoCard.tsx` — `rounded-xl` when theme A |
| 16 | EDIT | `tokens.ts` — `BUTTON_VARIANTS` ice primary |
| 17 | EDIT | `index.css` — `.btn-pill--accent` ice override scoped |
| 18 | EDIT | `NavigationDrawer.tsx` — remove indigo sub-link glow |
| 19 | EDIT | `DrawerHubAccordion.tsx` — silver active only |
| 20 | EDIT | `AppHeaderBar.tsx` — obsidian panel sync |
| 21 | EDIT | `FloatingDock.tsx` — obsidian rail |
| 22 | EDIT | `HubPageShell.tsx` — Inter hub titles when theme A |
| 23 | EDIT | `DagbokPage.tsx` / diary components — ice CTAs |
| 24 | EDIT | `ActCalibrationView.tsx` — ice Spegla button |
| 25 | EDIT | `ValvChatPanel.tsx` — silver chat chrome |
| 26 | EDIT | `VaultMonsterPanel.tsx` — silver bars |
| 27 | EDIT | `KompisHubPage.tsx` — WebAuthn copy fix |
| 28 | EDIT | `LivLauncherGrid.tsx` — row card silver chevrons |
| 29 | EDIT | `PlanningKanbanBoard.tsx` — **columns unchanged** (P3 lock) |
| 30 | EDIT | `MabraPage.tsx` — flat accordion |
| 31 | EDIT | `BarnfokusFraganPanel.tsx` — **copy locked**, silver wrap |
| 32 | EDIT | `BiffPublicPanel.tsx` — silver triage |
| 33 | EDIT | `BarnportenPage.tsx` — optional warm sub-theme |
| 34 | EDIT | `CapturePanel.tsx` — ice confirm |
| 35 | CREATE | `scripts/icons-proposals-v6.mjs` — `--style=nordic` |
| 36 | EDIT | `package.json` — `"icons:proposals-v6"` |
| 37 | EDIT | `moduleThemeMap.ts` — optional global default |
| 38 | EDIT | `applyTheme.ts` — set `data-panel-style=obsidian` |
| 39 | EDIT | `designPackMeta.ts` — R-A metadata |
| 40 | EDIT | `tailwind.config.js` — verify cssVar bridge |
| 41–48 | AUDIT | Replace hardcoded hex in touched modules (grep `#6366f1`, `#818cf8`) |
| 49 | EDIT | `DEFAULT_THEME_ID` in `themeRegistry.ts` — **only after GODKÄND** |
| 50 | EDIT | `VARIANTS.md` — `GODKÄND: R-A-nordic-precision` |
| 51 | SMOKE | Full smoke chain (§5) |
| 52 | DEPLOY | `firebase deploy --only hosting` |

### Must NOT change

- `LivskompassMark.tsx`, `KompisMark.tsx` (without locked-icons update)
- `VaultMonsterPanel` / `VaultOrkesterPanel` logic
- `PlanningKanbanBoard` column structure
- `BARNFOKUS_QUESTIONS`, knappcopy Barnfokus
- `firestore.rules`, RAG silos

---

## 4. CSS block (copy-paste)

```css
[data-theme='R-A-nordic-precision'] {
  color-scheme: dark;
}

[data-theme='R-A-nordic-precision'] .calm-card,
[data-theme='R-A-nordic-precision'] .panel-card {
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface-2) 92%, transparent);
  border: 0.5px solid var(--border);
  backdrop-filter: blur(8px);
}

[data-theme='R-A-nordic-precision'] .btn-pill--accent {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}

[data-theme='R-A-nordic-precision'] .glow-bottom-silver {
  box-shadow: inset 0 -1px 0 rgba(148, 163, 184, 0.35);
}
```

---

## 5. Smoke chain

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:locked-icons
npm run smoke:orkester
```

---

## 6. Deploy (efter godkännande)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase use gen-lang-client-0481875058
firebase deploy --only hosting
```

Design-only — **ingen** functions deploy.

---

## 7. Rollback

1. `DEFAULT_THEME_ID` → previous (`I-stone` or `D1-hamn-kompass`)
2. Remove `GODKÄND` row or mark `ROLLBACK` in `VARIANTS.md`
3. Redeploy hosting
4. Hard refresh (Cmd+Shift+R)

---

## 8. moduleThemeMap strategy

**Lab:** no route mapping — manual Theme Lab pick.

**Prod (post-approval):** single global default:

```typescript
// moduleThemeMap.ts — example
export const MODULE_THEME_MAP: Record<string, string> = {
  '*': 'R-A-nordic-precision',
};
```

Alternative: keep chrome default, apply R-A only to content vars via CSS cascade.

---

## 9. Theme Lab wiring

Add to `ThemeLabPage.tsx` section **Redesign (2026)**:

- Preview button → `applyTheme('R-A-nordic-precision')`
- Link → `gallery/style-a/screens.html`
- Token diff chips: ice blue `--accent`, silver `--border`

---

## 10. Android / PWA

Optional app icon refresh — **not required** for Style A (chrome-only reskin).

If user wants new icon: export from mockup screen 01 → `npm run android:icons:phone -- preview.png`
