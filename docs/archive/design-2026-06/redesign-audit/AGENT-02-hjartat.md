# AGENT-02 — Hjärtat (Dagbok + Speglar) Design Audit

**Agent:** Design-audit Agent 2  
**Datum:** 2026-06-07  
**Scope:** `/hjartat` — `?tab=reflektion` (Dagbok) + `?tab=speglar` (Speglar). **Exkluderar** Valv PIN, forensic panels (`SpeglingsForensicPanel`, VIVIR, EvidenceCompare, Svart på vitt), och `?tab=bevis` (redirectar till `/valvet`).  
**Repo:** `/Users/Livskompassen/StudioProjects/Livskompassen3.0`  
**Kanon:** Obsidian Calm 2.0 · `.cursor/rules/design-calm.mdc` · `docs/design/COLOR-POLICY.md`

---

## 1. Inventering

### 1.1 Routes och navigation

| Route | Komponent | Tab / läge | Auth |
|-------|-----------|------------|------|
| `/hjartat` | `HjartatPage` → `DagbokPage` (core) | default = reflektion | AuthGate |
| `/hjartat?tab=speglar` | `HjartatPage` → `SpeglarSuperModule` | speglar | AuthGate |
| `/dagbok` | `RedirectDagbokLegacy` → `/hjartat` | legacy | AuthGate |
| `/dagbok?tab=bevis` | redirect → `/valvet` | **utanför scope** | — |
| `/speglar` | redirect → `/hjartat?tab=speglar` | legacy | AuthGate |

**Entry points (publikt Hjärtat):**

- **Hub context bar** (`hubContextBar.ts`): Reflektion · Speglar · Familjen · Liv och göra
- **Floating dock:** BookOpen → `/hjartat` (kort klick); 3s long-press → Valv (utanför scope)
- **Drawer:** `navTruth.ts` — `dagbok` parent, `dagbok_reflektion`, `dagbok_speglar` (ej i drawer idag, `inDrawer: false`)
- **Hem:** `HomeDagbokPanel.tsx` — snabb rad, länk till `/hjartat`
- **Broar:** MåBra low-energy (`?from=mabra&energy=low`), SavedStep → Speglar med `journalContext`

### 1.2 Sidträd (fil → roll)

```
src/modules/core/pages/DagbokPage.tsx          # Hub shell: eyebrow/title/lead + supermodule
src/modules/features/lifeJournal/diary/
├── diary/
│   ├── components/
│   │   ├── DagbokSuperModule.tsx              # variant router (reflektion | forensic-readonly)
│   │   ├── DagbokPage.tsx                     # Snabb | Reflektera | Arkiv orchestrator
│   │   ├── DagbokModeNav.tsx                  # Sub-nav tre lägen
│   │   ├── DagbokRememberCard.tsx             # IHÅG Dagbok vs Valv
│   │   ├── JournalQuickMode.tsx               # Snabb check-in
│   │   ├── MoodStep.tsx                       # Humör-grid (Reflektera steg 1)
│   │   ├── ReflectionStep.tsx                 # Skriv: fritt | snabb | tre-ord + röst
│   │   ├── ConfirmStep.tsx                    # Preview före spar
│   │   ├── SavedStep.tsx                      # Klart + bro Speglar
│   │   ├── HandoffBox.tsx                     # Lager 1 → Valv handoff
│   │   ├── JournalArchive.tsx                 # Toolbar + lista + pagination
│   │   ├── JournalArchiveToolbar.tsx          # Sök + humör/kategori-filter
│   │   ├── JournalArchiveReadonly.tsx         # Wrapper (bare i Dagbok)
│   │   ├── JournalEntryCard.tsx               # TimelineEntry per post
│   │   ├── JournalDetailsPanel.tsx            # Kategori + minnesbilaga
│   │   ├── DagbokWizardErrorBoundary.tsx
│   │   └── HjartatPage.tsx                    # Re-export alias → core/pages
│   ├── hooks/useJournalFlow.ts
│   ├── constants/ (moods, journalCategories, journalTags, dagbokReminders, …)
│   └── types/journal.ts
└── mirror/
    ├── components/
    │   ├── SpeglarSuperModule.tsx             # dagbok | forensic router
    │   ├── SpeglingsSystem.tsx                # Publikt: ACT + valv-gated forensic
    │   ├── ActCalibrationView.tsx             # Känsla + Spegla (publikt scope)
    │   ├── VivirStepView.tsx                    # forensic — utanför publikt scope
    │   ├── EvidenceCompareView.tsx              # forensic — utanför publikt scope
    │   ├── SvartPaVittForm.tsx                  # forensic — utanför publikt scope
    │   └── SpeglarEvidencePanel.tsx             # forensic — utanför publikt scope
    └── utils/speglarSessionStorage.ts
```

**Delade UI-primitiver:**

| Primitiv | Fil | Användning Hjärtat |
|----------|-----|-------------------|
| `HubPageShell` | `src/modules/core/layout/HubPageShell.tsx` | Zon-header (eyebrow/title/lead) |
| `BentoCard` | `src/modules/shared/ui/BentoCard.tsx` | Yttre kort Dagbok + Speglar |
| `EmptyState` | `src/modules/core/ui/EmptyState.tsx` | Arkiv tom / inga träffar |
| `TimelineEntry` | `src/modules/core/ui/TimelineEntry.tsx` | Arkiv-rader (`glass-card`) |
| `typeScale` / `hubHeaderClasses` | `src/modules/core/ui/typeScale.ts` | Hub typografi |

### 1.3 CSS / design tokens

| Källa | Innehåll |
|-------|----------|
| `src/styles/obsidian-calm-2.css` | `.calm-card`, `.glass-card`, `.glow-bottom-{gold,blue,green}` |
| `src/index.css` (~4690–4945) | `.dagbok-mode-nav*`, `.reflektion-*`, `.journal-archive-*`, `.journal-handoff*` |
| `.cursor/rules/design-calm.mdc` | Silo-glow mapping: Hjärtat/Dagbok → **`glow-bottom-blue`** (indigo) |
| `moduleThemeMap.ts` | `/hjartat` → default theme pack (samma som global) |
| `navTruth.ts` | `dagbok.themeId: 'J-valv-pansar'` (auto-modul) |

### 1.4 Spec / docs (referens)

| Dokument | Status vs kod |
|----------|---------------|
| `docs/specs/modules/Dagbok-SPEC.md` | Delvis föråldrad (`/dagbok` route, Bevis-flik i kluster) |
| `docs/specs/modules/Speglar-SPEC.md` | Route `/dagbok?tab=speglar` → bör vara `/hjartat?tab=speglar` |
| `.context/modules/dagbokshubben.md` | **Uppdaterad** — ingen Bevis-flik på Hjärtat |
| `src/modules/features/lifeJournal/diary/diary/README.md` | **Föråldrad** — nämner fortfarande Bevis i HjartatPage |

---

## 2. Nuvarande stil

### 2.1 Layout och skal

- **Hub shell:** `HubPageShell` utan `lockViewport` — sidan scrollar fritt (`max-w-5xl`, `pb-12`). **Ej** Obsidian Calm 2.0 `hub-view-lock`.
- **Innehåll:** Ett primärt `BentoCard` per flik, `space-y-6` wrapper.
- **Wizard-inre:** `.reflektion-wizard` — `rounded-2xl border border-accent/15 bg-surface/20 p-1` (tunnare än kanon `rounded-3xl` calm-card).

### 2.2 calm-card / glass-card / glow

| Yta | Klass | `glow` prop | Kanon (design-calm) |
|-----|-------|-------------|-------------------|
| Dagbok yttre kort | `calm-card` via `BentoCard` | **saknas** | Borde ha `glow="blue"` |
| Speglar yttre kort | `calm-card` via `BentoCard` | **saknas** | Borde ha `glow="blue"` |
| ACT känsla/spegling | `glass-card p-3` | — | Inline legacy, ej BentoCard |
| Arkiv poster | `glass-card p-3` via `TimelineEntry` | — | Nested glass utan silo-glow |
| `.reflektion-wizard` | Custom border/yt | — | Parallell kortstil |

**Observation:** Inga `glow-bottom-*` klasser används någonstans under `lifeJournal/diary/`. Hjärtat saknar den obligatoriska indigo botten-glow som design-calm mappar till Dagbok/Familj/Valv-zonen.

### 2.3 Typografi

| Element | Implementation | Kanon |
|---------|----------------|-------|
| Hub eyebrow | `font-display-serif`-adjacent via `typeScale.eyebrow` — 10px caps, `tracking-[0.24em]`, `text-text-dim` | ✓ |
| Hub title | `font-display-serif text-xl font-light text-accent` | ✓ Cinzel-liknande |
| Hub lead | `text-sm text-text-muted` Inter | ✓ |
| BentoCard title | `font-display text-sm font-semibold text-accent` | **Avvikelse:** `font-display` (Outfit), inte `font-display-serif` |
| Panel lead | `.reflektion-panel__lead` — `text-base font-medium text-text` | Inter, ej serif — korrekt för bröd |
| Panel hint | `.reflektion-panel__hint` — `text-sm text-text-muted` | ✓ |
| ACT label | `text-xs uppercase tracking-widest text-accent` | ✓ |
| Arkiv dag-header | `text-xs uppercase tracking-widest text-text-dim` | ✓ |
| Mode nav tabs | `text-xs font-medium tracking-wide` | ✓ |

### 2.4 Färger och accenter

**Bas:** Obsidian gradient via app shell (`--surface`, `--surface-2`, `--bg`).

**Guld (primär):**
- Aktiv mode-tab: `bg-accent/10 text-accent` + inset bottom gold line
- Aktiva humör-kort: `border-accent/50`, gold box-shadow `rgba(212,175,55,0.16–0.2)`
- Primär CTA: `btn-pill--primary` (gold fill border)
- Spar-bekräftelse: `text-accent`, `text-success`

**Indigo / sekundär (design debt vs COLOR-POLICY):**
- `btn-pill--secondary` → `border-accent-secondary/50 text-accent-secondary` (VIVIR, Spegla-kedja)
- SavedStep Speglar-länk: `text-accent-secondary`
- Mood tone `--indigo` på humör-kort: `#818cf8` border/glow
- AI spegling: `glass-card--ai border-accent-ai/30`, `text-accent-ai`

**Semantiska humör-toner (reflektion-mood-card):**
- `calm` → teal `#2dd4bf` border (**mint/teal** — policy: endast success sparsamt)
- `warm` → amber, `rose` → pink, `indigo` → indigo glow on active
- Per-kort färgade borders — medvetet lekfullt, men bryter mot strikt “guld-only chrome”

**Smaragd:** `btn-pill--success`, SavedStep check — sparsamt ✓

### 2.5 Komponentmönster

**DagbokModeNav:** Segmented control — `rounded-xl border border-border-strong/80 bg-surface/30`, aktiv tab gold inset shadow.

**Humör (Reflektera):** 4×3 grid, emoji + 9px label, tone-klass per humör, shuffle-knapp pill.

**Humör (Snabb):** `<select>` dropdown — **UX-split** mot grid i Reflektera.

**Inputs:** `input-glass` — glass textarea/select, `rounded-xl`.

**Chips:** `reflektion-prompt-chip` / `chip--active` för taggar och arkiv-filter.

**Knappar:** `btn-pill--*` familj — uppercase, `tracking-widest`, `rounded-full`.

---

## 3. Smärtpunkter (design debt)

### 3.1 Obsidian Calm 2.0-gap

| # | Problem | Var | Prioritet |
|---|---------|-----|-----------|
| D1 | **Ingen silo-glow** på huvudkort | `DagbokPage.tsx`, `SpeglingsSystem.tsx` — `BentoCard` utan `glow="blue"` | Hög |
| D2 | **Ingen hub-view-lock** | `core/pages/DagbokPage.tsx` — `HubPageShell` default scroll | Medel |
| D3 | **Blandade kortprimitiver** | `calm-card` (BentoCard) + `glass-card` (mirror, timeline) + `.reflektion-wizard` | Hög |
| D4 | **rounded-2xl vs rounded-3xl** | `.reflektion-wizard`, `.reflektion-preview` vs kanon calm-card | Medel |
| D5 | **BentoCard title font** | `font-display` semibold vs hub `font-display-serif` | Låg |

### 3.2 COLOR-POLICY / accent-brott

| # | Problem | Var |
|---|---------|-----|
| C1 | Indigo CTA i Speglar/VIVIR-publikt flöde | `ActCalibrationView` → `btn-pill--secondary`; `VivirStepView` Nästa-knapp |
| C2 | `accent-secondary` på Speglar-bro | `SavedStep.tsx` gaslighting-länk |
| C3 | Teal humör-border `--calm` | `.reflektion-mood-card--calm` `#2dd4bf` |
| C4 | AI-indigo highlight | `glass-card--ai` — acceptabelt för AI-yta enligt Speglar-SPEC, men synlig i publikt ACT |

### 3.3 UX / kognitiv belastning

| # | Problem | Detalj |
|---|---------|--------|
| U1 | **Snabb vs Reflektera humör-UI** | Snabb = dropdown; Reflektera = 12-korts grid — samma data, olika interaktion |
| U2 | **DagbokRememberCard alltid synlig** | Tar vertikal plats i alla tre lägen; localStorage default `open: true` |
| U3 | **Arkiv inuti samma BentoCard** | Mode-nav + remember + wizard + arkiv i ett kort — tung vertikal stack |
| U4 | **EmptyState minimalt** | `text-sm text-text-dim` utan illustration, CTA eller länk till Snabb |
| U5 | **Speglar session-rensning** | Liten underline-knapp höger — lätt att missa |
| U6 | **Hub context bar vs in-page mode nav** | Två nav-lager: zon (Reflektion/Speglar) + läge (Snabb/Reflektera/Arkiv) |

### 3.4 Dokumentation / IA-drift

| # | Problem |
|---|---------|
| X1 | `Dagbok-SPEC.md` / `diary/README.md` refererar Bevis-flik i Hjärtat — kod har separerat Valv |
| X2 | `TAB-REGISTRY.md` pekar på `src/modules/diary/` — faktisk path `features/lifeJournal/diary/` |
| X3 | `navTruth` themeId `J-valv-pansar` för dagbok men Hjärtat är emotionell Lager 1, inte juridisk Valv |

### 3.5 Tillgänglighet

- Bra: `aria-live`, `aria-pressed` på filter, sr-only stegindikator i wizard
- Svag: Snabb `<select>` humör — fungerar men sämre touch-target än grid
- EmptyState saknar `role="status"` wrapper

---

## 4. Ikon / knapp / meny — tabell

| UI-element | Plats | Ikon / stil | Aktiv state | Route / action | Design-not |
|------------|-------|-------------|-------------|----------------|------------|
| Hub context: Reflektion | `hubContextBar` | `book` | Guld aktiv | `/hjartat` | Zon-nav |
| Hub context: Speglar | `hubContextBar` | `brain` | Guld aktiv | `/hjartat?tab=speglar` | Zon-nav |
| Dock: Dagbok | `FloatingDock` | `drawerIcon: dagbok` | Guld när `/hjartat` | `/hjartat` | 3s → Valv |
| Mode: Snabb | `DagbokModeNav` | Text only | Gold inset tab | `setMode('snabb')` | Segmented |
| Mode: Reflektera | `DagbokModeNav` | Text only | Gold inset tab | default mode | Segmented |
| Mode: Arkiv | `DagbokModeNav` | Text only | Gold inset tab | `setMode('arkiv')` | Segmented |
| IHÅG toggle | `DagbokRememberCard` | `Lightbulb` gold | `aria-expanded` | collapse | Border `accent/20` |
| Valv-länk IHÅG | `DagbokRememberCard` | — | `btn-pill--ghost` | `NAV_PATHS.VALVET` | Lager 1→2 |
| Humör-kort | `MoodStep` | Emoji | Tone-colored + gold active | `onMoodChange` | 12 st |
| Slumpa humör | `MoodStep` | `Shuffle` | Pill ghost | random mood | |
| Fortsätt wizard | `MoodStep` | `ChevronRight` | `btn-pill--primary` | → text step | Gold |
| Spara humör only | `MoodStep` | `Loader2` | `btn-pill--ghost` | low-energy | |
| MåBra-bro | `MoodStep` | — | `reflektion-link-mabra` indigo | `/vardagen?tab=mabra` | **Policy** |
| Skriv-tabs | `ReflectionStep` | — | Gold bg tab | fritt/snabb/tre-ord | |
| Röst | `ReflectionStep` | `Mic` / `MicOff` | Toggle | Web Speech | |
| Valv handoff | `HandoffBox` | `Shield` gold | `journal-handoff` card | `/valvet?vaultTab=logga` | Lugn, ej röd |
| Spara snabb | `JournalQuickMode` | `Loader2` | `btn-pill--primary` full width | save | |
| Tag chip | `JournalQuickMode` | Text × | `chip--active` | toggle tag | |
| Arkiv sök | `JournalArchiveToolbar` | `Search` dim | `input-glass` | filter query | |
| Humör filter | `JournalArchiveToolbar` | Emoji+label | `reflektion-prompt-chip--active` | horizontal scroll | |
| Visa fler | `JournalArchive` | — | `btn-pill--ghost` | pagination +5 | |
| Ny post | `SavedStep` | — | `btn-pill--accent` gold | reset wizard | |
| → Speglar | `SavedStep` | — | `btn-pill` **indigo border** | `hjartatTabHref('speglar')` + state | **Policy** |
| ACT rubrik | `ActCalibrationView` | — | Gold caps label | — | |
| Spegla | `ActCalibrationView` | spinner | `btn-pill--secondary` **indigo** | AI/local mirror | |
| Fortsätt VIVIR | `ActCalibrationView` | `ChevronRight` | `btn-pill--accent` | forensic gate | Valv krävs efter |
| Rensa session | `SpeglingsSystem` | — | Underline text-xs dim | clear localStorage | |
| BentoCard header | Both modules | `BookOpen` / `Brain` | `text-accent` icon | — | Lucide 16px |

**Chrome-ikoner (assets):**

- `public/icons/chrome/v5-g*-dagbok.svg` (g1–g5 varianter)
- `public/icons/drawer-l2/drawer-dagbok.svg`
- `docs/design/icons-proposals/2026-05-26-v4-round2-dna/dagbok/` (J1–J10)

Speglar: Lucide `Brain` i kod — **ingen dedikerad drawer-chrome-SVG** i public/icons.

---

## 5. Referensbilder

| Referens | Sökväg | Relevans Hjärtat |
|----------|--------|------------------|
| Obsidian Calm 2.0 CSS | `src/styles/obsidian-calm-2.css` | calm-card + glow spec |
| Theme I stone widget | `docs/design/themes/I-architect-vault/00-smart-widget-expanded.png` | Hub glass + guld |
| J-valv-pansar | `docs/design/themes/J-PACK-EIGHT-HUBS.md` §2 | Tilldelad dagbok-themeId |
| F-guld-pansar | `docs/design/themes/F-guld-pansar/` | Juridisk tyngd (Valv, ej Lager 1) |
| Dagbok hub icons DNA | `docs/design/icons-proposals/2026-05-26-v4-round2-dna/dagbok/` | J1 helros, J9 sacred, J10 obsidian |
| Gold hub v5 preview | `docs/design/icons-proposals/2026-05-29-gold-hub-v5/preview.html` | dagbok ikon per stil |
| Drawer kanon | `docs/design/references/MENU-DRAWER-KANON.png` | Guld aktiv rad |
| Dock kanon | `docs/design/references/DOCK-KANON.md` | BookOpen triad |
| TYPE-SCALE | `docs/design/TYPE-SCALE.md` | Hub vs section titles |
| COLOR-POLICY | `docs/design/COLOR-POLICY.md` | Ingen indigo chrome |
| Dagbok-SPEC §4 | `docs/specs/modules/Dagbok-SPEC.md` | Token-tabell (delvis legacy färger) |
| Speglar-SPEC §4 | `docs/specs/modules/Speglar-SPEC.md` | AI indigo, gold insight |
| **Saknas** | Ingen `docs/design/**/hjartat*.png` | **Gap:** inga dedikerade Hjärtat mockups i repo |

**Live preview:** `/dev/themes` (Theme Pack I/J) · `/hjartat` · `/hjartat?tab=speglar`

---

## 6. Krav för 3 stilar

Redesign bör valideras mot tre riktningar (ej ömsesidigt exclusiva — en väljs som prod):

### Stil A — **Obsidian Calm 2.0 Kanon** (målbild)

| Krav | Detalj |
|------|--------|
| Huvudkort | `BentoCard` + **`glow="blue"`** (`glow-bottom-blue`) på Dagbok och Speglar |
| Hub lock | `HubPageShell lockViewport` + `calm-scroll-island` för wizard/arkiv |
| Kortgeometri | `rounded-3xl`, `border-border/30`, `bg-surface-2/70`, `backdrop-blur-xl` |
| Typografi | Hub title `font-display-serif`; section Bento title samma eller `titleSection` |
| Accenter | Guld aktiv chrome; indigo **endast** AI-spegling inset, inte primär CTA |
| Wizard inner | Antingen flatten till calm-card child **eller** behåll `.reflektion-wizard` men matcha 3xl + blue glow |
| Humör | Behåll emoji-grid; överväg neutrala borders + gold-only active (ta bort teal/indigo mood glow) |
| Empty state | Calm-card inset med en CTA «Skriv en snabb rad» |

### Stil B — **J-valv-pansar / I-stone** (nuvarande theme mapping)

| Krav | Detalj |
|------|--------|
| Bas | `#080808`–`#0a0a0a`, texture-stone |
| Accent | `#c9a227` / `#d4af37` — tjockare guldrand på yttre kort |
| Känsla | Tyngre, “pansar” — passar **Valv** mer än Lager 1; **risk:** Dagbok känns forensisk |
| Widget | WH1 inspelning association — diskret på Hjärtat |
| Åtgärd | Om Hjärtat behåller J-valv-pansar: mjukare copy/lead, ljusare inner wizard, **inte** samma banner som Valv |

### Stil C — **I-skymning / emotional soft** (alternativ Lager 1)

| Krav | Detalj |
|------|--------|
| Bas | Aurora glass, lättare `bg-surface-2/50` |
| Accent | Guld rubriker; **ingen** mint global — ev. dämpad lavender endast i Speglar AI-panel |
| Typografi | Lättare hub title (`font-light`), mer whitespace i `.reflektion-panel` |
| Humör | Behåll lekfulla tone-borders (emotion-safe) men dämpa saturation 30% |
| Speglar | ACT tvåkolumn → enkolumn stack på mobil; spegling som nested calm-card med blue glow |
| MåBra-bro | Varm amber istället för indigo länk |

**Gemensamma krav (alla stilar):**

- Locked UX orörd: wizard steg, HandoffBox, SavedStep→Speglar bro, plausible deniability copy
- Zero Footprint copy i Speglar behålls
- Inga streak/XP, inga röda larmbanner i Lager 1
- WCAG: behåll `aria-live` på spar/mirror

---

## 7. Mockup screens

Specifikation för redesign-mockups (Figma/PNG). **Nuvarande implementation** noteras per skärm.

### 7.1 Dagbok — Snabb läge (`JournalQuickMode`)

**Route:** `/hjartat` → mode Snabb (default om ej MåBra-bro)

**Nuvarande struktur (top → bottom):**

1. `HubPageShell`: eyebrow «Hjärtat», title «Dagbok», lead
2. `BentoCard` «Reflektion» + `BookOpen`
3. `DagbokModeNav` — Snabb aktiv (gold)
4. `DagbokRememberCard` (expanded default)
5. Intro: «En snabb check-in…»
6. `.reflektion-wizard` → `.reflektion-panel`:
   - Lead: «Hur känns det just nu?»
   - `<select>` humör (12 options med emoji)
   - Tag `<select>` + active chips
   - Textarea 2 rows optional
   - Optional `HandoffBox` (juridiska nyckelord)
   - Checkbox «Känsligt — sortera även till arkiv»
   - `btn-pill--primary` «Spara tanken»
   - Post-save: check + mirror line card + microStep

**Mockup-krav:**

| Element | Mockup spec |
|---------|-------------|
| Yttre kort | calm-card + **blue bottom glow**, rounded-3xl |
| Humör | **Byt select → 4×3 mini-grid** (samma som Reflektera) eller horisontell emoji-scroll |
| Remember | **Collapsed default** i Snabb; ikon-only expand |
| CTA | En primär gold full-width; disabled state tydlig |
| Mirror feedback | Nested inset card, gold border-subtle, max 2 rader |
| Vertikal | Target ≤ 1 viewport på iPhone utan scroll (hub-view-lock) |

**Design debt att visa i mockup:** dropdown vs grid split; saknad glow.

---

### 7.2 Dagbok — Arkiv toolbar (`JournalArchiveToolbar`)

**Route:** `/hjartat` → mode Arkiv

**Nuvarande struktur:**

1. Samma BentoCard stack som ovan
2. Intro: «Dina sparade tankar — läs bara…»
3. Toolbar:
   - Search input + `Search` icon left
   - «Filtrera på känsla» — horizontal scroll chips (Alla + 12 humör)
   - «Filtrera på kategori» — conditional chips
   - Counter: «Visar X av Y»
4. Lista: dag-headers + `TimelineEntry` cards + «Visa fler»

**Mockup-krav:**

| Element | Mockup spec |
|---------|-------------|
| Toolbar container | Egen nested calm-card **eller** sticky top inom scroll-island |
| Sök | Full width, gold focus ring, placeholder «Sök bland dina tankar…» |
| Humör pills | Single row scroll, **gold active** (redan så); inactive `border-border-strong` |
| Kategori | Döljs om inga entries — visa inte tom sektion |
| Counter | `text-xs text-text-dim` centrerad — behåll |
| Separation | Tydlig divider mellan toolbar och lista |
| Empty filter | EmptyState: «Inga träffar» + ghost «Rensa filter» |

**Design debt:** toolbar i samma kort som wizard-nav; timeline `glass-card` utan glow hierarchy.

---

### 7.3 Speglar — ACT-form (`ActCalibrationView`)

**Route:** `/hjartat?tab=speglar` (publikt scope — ej VIVIR)

**Nuvarande struktur:**

1. Hub: eyebrow «Hjärtat», title «Speglar»
2. `BentoCard` «Speglar» + `Brain`
3. Lead + «Rensa speglar-session» (underline, höger)
4. Label: «ACT — Validera, aldrig fixa» (gold caps)
5. **2-col grid** (md):
   - Vänster `glass-card`: «Känsla nu» textarea + `btn-pill--secondary` «Spegla»
   - Höger `glass-card`: speglingsoutput + `btn-pill--accent` «Fortsätt till VIVIR»
6. Hint text om Valv om ej forensic shown

**Mockup-krav:**

| Element | Mockup spec |
|---------|-------------|
| Yttre kort | calm-card + blue glow |
| Layout mobil | **En kolumn:** känsla → Spegla → spegling → (valfri) fortsätt |
| Spegla-knapp | **Gold primary**, inte indigo secondary |
| AI state | `glass-card--ai` med indigo **endast** i badge «AI», inte knapp |
| Session clear | Ghost pill «Rensa» med `text-text-dim`, inte bare underline |
| Copy block | Max 3 rader intro; Zero Footprint fotnot `text-[10px]` |
| Bridge från Dagbok | Om `journalContext`: subtle gold banner «Från dagbok» ovan textarea |

**Design debt:** indigo CTA; nested glass-card utan BentoCard glow; forensic hint blandas med publikt flöde.

---

### 7.4 Empty state — Arkiv (`EmptyState` i `JournalArchive`)

**Triggers:**

- `entries.length === 0` → «Inga poster ännu.»
- `filtered.length === 0` → «Inga träffar — prova ett annat sökord eller filter.»

**Nuvarande:** Enbart `<p className="text-sm text-text-dim">` — ingen ikon, ingen action.

**Mockup-krav:**

| Variant | Innehåll |
|---------|----------|
| **Tom arkiv** | Ikon: `BookOpen` eller dagbok chrome SVG (muted gold 40%) · Rubrik: «Här blir det lugnt» · Body: «När du sparar en tanke dyker den upp här — inget måste vara perfekt.» · CTA: gold ghost «Skriv en snabb rad» → sätter mode Snabb · Sekundär: «Reflektera istället» |
| **Inga träffar** | Ikon: `Search` · «Inga träffar» · CTA: «Rensa filter» (reset toolbar state) |
| Container | Centrerad inom arkiv scroll-island, `py-12`, max-width `sm` |
| Stil | Ingen illustration med natur/motiv — abstrakt glass circle eller kanon ikon |
| A11y | `role="status"` wrapper, `aria-live="polite"` |

---

## Bilaga A — Snabb checklista redesign

- [ ] `BentoCard glow="blue"` på Dagbok + Speglar
- [ ] `HubPageShell lockViewport` för `/hjartat`
- [ ] Enhetlig humör-picker (grid) i Snabb + Reflektera
- [ ] Ersätt indigo CTAs med gold/ghost i publikt Speglar
- [ ] `DagbokRememberCard` default collapsed i Snabb
- [ ] Rich EmptyState med CTA
- [ ] Uppdatera Dagbok-SPEC + diary README (ingen Bevis-flik)
- [ ] Skapa `docs/design/redesign-audit/hjartat-mockups/` PNG (4 skärmar ovan)

---

## Bilaga B — Filer att röra vid redesign (ej Valv)

| Prioritet | Fil |
|-----------|-----|
| P0 | `src/modules/core/pages/DagbokPage.tsx` |
| P0 | `src/modules/features/lifeJournal/diary/diary/components/DagbokPage.tsx` |
| P0 | `src/modules/features/lifeJournal/diary/mirror/components/SpeglingsSystem.tsx` |
| P0 | `src/modules/features/lifeJournal/diary/mirror/components/ActCalibrationView.tsx` |
| P1 | `src/modules/shared/ui/BentoCard.tsx` (font-display-serif option) |
| P1 | `src/modules/features/lifeJournal/diary/diary/components/JournalQuickMode.tsx` |
| P1 | `src/modules/features/lifeJournal/diary/diary/components/JournalArchive.tsx` |
| P1 | `src/modules/core/ui/EmptyState.tsx` |
| P2 | `src/index.css` (`.reflektion-*`, `.dagbok-mode-nav*`) |
| P2 | `src/modules/features/lifeJournal/diary/diary/components/SavedStep.tsx` |
| P2 | `src/modules/features/lifeJournal/diary/diary/components/DagbokRememberCard.tsx` |

---

*Read-only audit — ingen kod ändrad. För implementation: växla till Agent mode.*

