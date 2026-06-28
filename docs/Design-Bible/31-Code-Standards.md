# Kapitel 31 — Kodstandarder (UI)

> **Status:** Kanon · P0 tech debt = hex i features  
> **Mandat:** `lead-ui-engineer.mdc` — auto-polish vid varje komponenttouch  
> **Källor:** `component-standards.mdc` · `premium-ui.mdc` · `chameleon-ui-modularity.mdc` · `design-calm.mdc`

---

## 1. Syfte

Enhetlig, underhållbar UI-kod som matchar Executive Midnight DAD. All visuell data ska flöda genom **tokens** och **återanvändbara primitiver** — inte duplicerad inline-styling.

---

## 2. Tokens only — inga hårdkodade värden

### 2.1 Obligatoriska token-kategorier

| Kategori | Exempel | Källa |
|----------|---------|-------|
| Färger | `bg-surface`, `text-accent`, `border-border` | CSS vars / Tailwind theme |
| Typografi | `font-display`, `text-sm` | `typography.ts`, Tailwind |
| Spacing | `p-4`, `gap-3` | Tailwind scale — inga random `px-[13px]` |
| Radius | `rounded-2xl` | Design system |
| Skuggor | `shadow-*`, custom calm shadows | tokens / executive-chrome |
| Blur / glass | `backdrop-blur-md`, `--glass` | theme packs |
| Animation | Framer presets + `useDsReducedMotion` | motion/ |

### 2.2 Förbjudet i produktion

```tsx
// ❌ P0 tech debt
className="text-[#d4af37] bg-[#0a0a0a]"
style={{ color: '#fff', padding: 17 }}

// ✅ Korrekt
className="text-accent bg-surface"
style={{ color: 'var(--accent)' }}  // endast om Tailwind inte räcker
```

### 2.3 Tillåtna undantag

| Plats | Regel |
|-------|-------|
| `src/modules/sandbox/**` | Fri hex — Design Freeport |
| `/dev/design-freeport*` | Sandbox routes |
| `themeRegistry.ts` | Token-definition (källan för vars) |
| `src/styles/*.css` | Token-deklaration |
| SVG gradients i låst kompass | Handgjord asset — inte feature-UI |

---

## 3. No hex in `features/`

**Kanon (chameleon-ui-modularity):** Hårdkodade hex i `src/modules/features/**` = **P0 tech debt**.

### 3.1 Scope

Gäller:

- `src/modules/features/**/*.tsx`
- `src/modules/features/**/*.ts` (styles, constants med färg)

Gäller **inte** sandbox (se ovan).

### 3.2 Migrering

Vid touch av legacy-fil med hex:

1. Ersätt med semantisk token (`text-accent`, `bg-surface-2/70`).
2. Om token saknas — lägg till i theme shared vars, **inte** lokal hex.
3. Kör `npm run smoke:design-modules`.

### 3.3 Legacy att städa

Kända mönster: `bg-white/5`, `border-white/10`, `bg-amber-900/20` — mappa till `--surface`/`--border` ekvivalenter vid polish-pass.

---

## 4. Chameleon — tre lager

**Kanon:** Logik ≠ design. Ett skal, många lägen.

### 4.1 Lager-tabell

| Lager | Plats | Innehåll | Får inte innehålla |
|-------|-------|---------|-------------------|
| **Logic** | `hooks/`, `store/`, `*Service.ts`, `submit*.ts` | State, Firestore, callables, validering | Hårdkodad hex, stor JSX |
| **Shell** | `*SuperModule.tsx`, `ChameleonInputShell` | Mode-växlare, morph (~350 ms), delegate-routing | Firestore-anrop inline |
| **Skin** | `*.styles.ts`, `designPackMeta`, CSS tokens | Tailwind, färger, glow, spacing | Affärslogik |

### 4.2 Obligatoriskt mönster

```tsx
<ChameleonInputShell mode={mode}>
  {(displayed) => <Delegate mode={displayed} />}
</ChameleonInputShell>
```

- Nya zoner med flera inmatningslägen → `*InputSuperModule` + delegates.
- **Inte** nya toppmenyrader per micro-feature.
- Mode-lista max **4–6** synliga val.

### 4.3 Design bytbar utan logik

- `useDesignPack()`, `themeRegistry` — skin byter, hooks oförändrade.
- Experiment i `/dev/theme-lab` — inte prod-routes per experiment.

---

## 5. component-standards — komponentkrav

**Varje komponent ska uppfylla:**

| Krav | Beskrivning |
|------|-------------|
| **Single responsibility** | En komponent — ett jobb |
| **Reusable** | Parametrar framför copy-paste |
| **Typed** | TypeScript props, inga `any` i prod |
| **Accessible** | WCAG AA, SR, keyboard (kapitel 28) |
| **Responsive** | 320–1440 px, mobil-first G85 |
| **Animated** | Framer Motion + reduced motion |
| **Well documented** | JSDoc på publika komponenter |
| **Token based** | Se §2 |

**Förbjudet:**

- Duplicerad styling
- Duplicerad logik
- Magic numbers
- Inline colors
- Inline spacing utan token/skala

---

## 6. Design system primitiver

**premium-ui:** Använd befintliga — skapa inte parallella.

| Primitiv | Plats (indikativ) |
|----------|-------------------|
| Card / calm-card | design-system, executive |
| Button / ds-btn | `src/design-system/components/` |
| Header / Dock | executive-chrome, DS |
| Input / input-glass | modules/core/ui |
| Modal / BottomSheet | shared UI |
| GlassPanel | DS / executive |
| HubErrorBoundary | core — **obligatorisk** på hubbar |
| EmptyState | core — tomma tillstånd |
| HubPanelSkeleton | loading |

**Regel:** Inspect existing → improve → verify unchanged functionality.

---

## 7. Fil- & importkonventioner

```
src/modules/features/<zon>/<feature>/
  components/       # Presentational
  hooks/            # Logic
  supermodule/      # Shell + delegates
  *.styles.ts       # Skin (optional)
  *Service.ts         # Data layer
```

- Importera DS via `@/design-system/` eller etablerade relativa paths — följ grannfil.
- Inga nya `btn-pill--*` i modules (self-review #4).
- React + TypeScript + Tailwind + Framer Motion + SVG — standard stack.

---

## 8. UI-arbetsflöde (Lead UI Engineer)

1. Läs `design-calm.mdc` (DAD) före visuella beslut.
2. Polish pass automatiskt vid touch — fråga inte om lov för spacing/kontrast/a11y.
3. **Fråga** vid funktionsändring, flödesändring, locked UX.
4. Lämna filen renare än du fann den.
5. Kör smoke vid hub/locked-ändring.

---

## 9. Smoke & verifiering

```bash
npm run smoke:design-modules
npm run smoke:locked-ux
npm run build
```

Self-review tokens-rad: `--ds-*` / design-system — no hardcoded hex in `src/modules/**`.

---

## 10. Anti-mönster

| Anti-mönster | Varför |
|--------------|--------|
| Ny route per micro-feature | Mockup-spridning |
| Lång statisk meny | Chameleon-delegate räcker |
| Firestore i 200-raders JSX | Bryter Logic-lager |
| Hex i feature-komponent | P0 debt, bryter theme packs |
| Parallell Button-komponent | Fragmenterar DS |
| Inline `style={{ background: ... }}` | Odokumenterad, ej theme-bar |

---

## 11. Pekare

| Resurs | Sökväg |
|--------|--------|
| component-standards | `.cursor/rules/component-standards.mdc` |
| Chameleon | `.cursor/rules/chameleon-ui-modularity.mdc` |
| premium-ui | `.cursor/rules/premium-ui.mdc` |
| lead-ui-engineer | `.cursor/rules/lead-ui-engineer.mdc` |
| executive-chrome | `src/styles/executive-chrome.css` |
| obsidian tokens | `src/styles/obsidian-calm-2.css` |
| AI-regler | `32-AI-Rules.md` |

---

*SLUT KAPITEL 31*
