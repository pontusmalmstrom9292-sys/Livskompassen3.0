# Style B — Ember Sanctuary Implementation Blueprint

**Theme pack ID:** `R-B-ember-sanctuary`  
**Companion spec:** [`STYLE-B-SPEC.md`](./STYLE-B-SPEC.md)  
**Mockups:** [`gallery/style-b/screens.html`](./gallery/style-b/screens.html)  
**Status:** Ready for Theme Lab — **not prod default**  
**Datum:** 2026-06-07

---

## 1. Executive summary

Style B aligns with existing **CHROME-EMBER-KANON** and extends warm gold/copper/amber to full-app cards, launcher, and zone content.

| Phase | Scope | Prod impact |
|-------|-------|-------------|
| **1 — Lab pack** | Register `R-B-ember-sanctuary` | None |
| **2 — Full reskin** | Ember panel + copper secondary + `rounded-2xl` | After `GODKÄND:` |
| **3 — Icons v6 ember** | Copper-filled chrome set | Optional |

**Tidsuppskattning:** ~1 nattpass (6–8 h agent)

---

## 2. Theme pack — `src/modules/core/theme/themePackRedesignB.ts`

```typescript
import type { ThemePack } from './types';
import { THEME_SHARED_VARS } from './themeShared';

const emberSanctuaryVars = {
  ...THEME_SHARED_VARS,
  '--bg': '#1a1410',
  '--bg-dusk': '#151008',
  '--surface': '#221c16',
  '--surface-2': '#2a2218',
  '--surface-3': '#332a1f',
  '--accent': '#d4af37',
  '--accent-secondary': '#b87333',
  '--accent-light': '#e8d48a',
  '--accent-ember': '#f59e0b',
  '--accent-glow': 'rgba(212, 175, 55, 0.28)',
  '--accent-ember-glow': 'rgba(245, 158, 11, 0.18)',
  '--success': '#10b981',
  '--glass': 'rgba(34, 28, 22, 0.85)',
  '--glass-hero': 'rgba(26, 20, 16, 0.92)',
  '--border': 'rgba(212, 175, 55, 0.14)',
  '--border-strong': 'rgba(184, 115, 51, 0.28)',
  '--compass-disk': '#2a2218',
  '--nav-active': '#d4af37',
  '--nav-active-glow': 'rgba(212, 175, 55, 0.15)',
} as const;

export const THEME_PACK_REDESIGN_B: ThemePack[] = [
  {
    id: 'R-B-ember-sanctuary',
    label: 'Ember Sanctuary',
    description: 'Varm kvällshamn — guld, koppar, amber glow. Redesign Style B.',
    background: 'ember',
    preview: '/design/redesign-proposals/gallery/style-b/preview-hero.png',
    designPackId: 'D1',
    cssVars: { ...emberSanctuaryVars },
  },
];
```

---

## 3. File checklist (54 items)

### Phase 1 — Lab

| # | Action | File |
|---|--------|------|
| 1 | CREATE | `src/modules/core/theme/themePackRedesignB.ts` |
| 2 | EDIT | `themeRegistry.ts` |
| 3 | EDIT | `themeLabVariants.ts` |
| 4 | CREATE | `src/styles/redesign-b-ember-sanctuary.css` |
| 5 | EDIT | `index.css` — import + align ember panel vars |
| 6 | EDIT | `ThemeLabPage.tsx` |
| 7 | EDIT | `AmbientBackground.tsx` — warm ember blobs, optional scenic |
| 8 | EDIT | `applyTheme.ts` — `data-panel-style=ember` |
| 9–11 | DOCS | SPEC ✅, blueprint ✅, screens.html ✅ |
| 12 | EDIT | `VARIANTS.md` — lab row |

### Phase 2 — Post-approval

| # | Action | File | Notes |
|---|--------|------|-------|
| 13 | EDIT | `redesign-b-ember-sanctuary.css` | `.ember-card`, `.glow-bottom-gold`, `.glow-bottom-copper` |
| 14 | EDIT | `design-packs.css` | Merge D1 + R-B overrides |
| 15 | EDIT | `DesignPackCenterHeader.tsx` | Warm ornament when R-B |
| 16 | EDIT | `BentoCard.tsx` | `glow="gold"` default for Familjen/Hjärtat |
| 17 | EDIT | `UiCard.tsx` | Row/timeline copper accents |
| 18 | EDIT | `tokens.ts` | Copper secondary mapping |
| 19 | EDIT | `NavigationDrawer.tsx` | Gold active rows only |
| 20 | EDIT | `FloatingDock.tsx` | Ember rail (existing CSS audit) |
| 21 | EDIT | `FyrenWidgetBar.tsx` | Amber widget strip |
| 22 | EDIT | `JournalQuickMode.tsx` | Humör grid (not select) |
| 23 | EDIT | `ActCalibrationView.tsx` | Copper Spegla CTA |
| 24 | EDIT | `ValvChatPanel.tsx` | Gold assistant chrome |
| 25 | EDIT | `VaultMonsterPanel.tsx` | Gold frequency bars |
| 26 | EDIT | `VaultOrkesterPanel.tsx` | Copper agent cards |
| 27 | EDIT | `VaultKunskapsbankPanel.tsx` | Gold KB cards |
| 28 | EDIT | `KompisHubPage.tsx` | Warm destination grid |
| 29 | EDIT | `LivLauncherGrid.tsx` | Gold/copper glow per card |
| 30 | EDIT | `PlanningKanbanBoard.tsx` | **P3 columns locked** — ember column chrome only |
| 31 | EDIT | `MabraVitHub.tsx` | Ember zone glow |
| 32 | EDIT | `BarnfokusFraganPanel.tsx` | Warm wrap, locked copy |
| 33 | EDIT | `BiffTriagePanel.tsx` | Copper triage hero |
| 34 | EDIT | `BarnportenPage.tsx` | Align with J-barnporten-ljus |
| 35 | EDIT | `CapturePanel.tsx` | Gold confirm |
| 36 | CREATE | `scripts/icons-proposals-v6.mjs` — `--style=ember` |
| 37 | EDIT | `package.json` |
| 38 | EDIT | `moduleThemeMap.ts` |
| 39 | EDIT | `KompisHubPage.tsx` copy — WebAuthn not PIN |
| 40–48 | AUDIT | Remove indigo primary in evidence + diary |
| 49 | EDIT | `DEFAULT_THEME_ID` — after GODKÄND only |
| 50 | EDIT | `VARIANTS.md` — `GODKÄND: R-B-ember-sanctuary` |
| 51–54 | SMOKE + DEPLOY | See §5–6 |

### Must NOT change

Same locks as Style A blueprint + `CHROME-EMBER-KANON` header structure.

---

## 4. CSS block (copy-paste)

```css
[data-theme='R-B-ember-sanctuary'] {
  color-scheme: dark;
}

[data-theme='R-B-ember-sanctuary'] .calm-card {
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface-2) 75%, transparent);
  border: 0.5px solid var(--border);
  backdrop-filter: blur(12px);
}

[data-theme='R-B-ember-sanctuary'] .glow-bottom-gold {
  box-shadow: inset 0 -2px 0 rgba(212, 175, 55, 0.45);
}

[data-theme='R-B-ember-sanctuary'] .glow-bottom-copper {
  box-shadow: inset 0 -2px 0 rgba(184, 115, 51, 0.4);
}

[data-theme='R-B-ember-sanctuary'] .btn-pill--secondary {
  border-color: var(--accent-secondary);
  color: var(--accent-secondary);
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
npm run smoke:innehall
```

---

## 6. Deploy (efter godkännande)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
firebase use gen-lang-client-0481875058
firebase deploy --only hosting
```

---

## 7. Rollback

1. Restore `DEFAULT_THEME_ID` (e.g. `I-stone`)
2. Mark rollback in `VARIANTS.md`
3. `firebase deploy --only hosting`
4. Cmd+Shift+R

---

## 8. moduleThemeMap

**Recommended prod mapping after approval:**

```typescript
'/': 'R-B-ember-sanctuary',
'/hjartat': 'R-B-ember-sanctuary',
'/vardagen': 'R-B-ember-sanctuary',
'/familjen': 'R-B-ember-sanctuary',
'/valvet': 'R-B-ember-sanctuary',
'/planering': 'J-planering-fyren', // keep hybrid lock OR unify — user decision
```

Document choice in PMIR before merge.

---

## 9. Relation to D1-hamn-kompass

Style B is **conceptual sibling** to `D1-hamn-kompass`. Implementation may:

- **Option A:** Replace D1 vars with R-B pack (single warm theme)
- **Option B:** Keep D1 chrome, R-B content tokens only

Record in `VARIANTS.md` when user picks.

---

## 10. Theme Lab

Section **Redesign (2026) → Ember Sanctuary**:

- Preview + «Använd i appen»
- Side-by-side with D1-hamn-kompass
- Link mockups: `gallery/style-b/screens.html`
