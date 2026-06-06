# AGENT-05 — Familjen · Barnporten · Widgets · Trygg Hamn/BIFF

**Audit:** Design-audit Agent 5 (read-only)  
**Datum:** 2026-06-07  
**Repo:** `/Users/Livskompassen/StudioProjects/Livskompassen3.0`  
**Scope:** `/familjen` (alla flikar), Barnporten PWA (`/barnporten`), widget deep links (`/widget/familjen`, `/widget/hamn`, `/widget/barnporten`), Trygg Hamn/BIFF (`?tab=hamn`, legacy `/hamn`)  
**Kanon:** Obsidian Calm 2.0 · `.cursor/rules/design-calm.mdc` · `docs/design/COLOR-POLICY.md`  
**Låst UX:** `.context/locked-ux-features.md` §1 (Barnfokus), §7–7b (Barnporten + HITL)

---

## 1. Inventering

### 1.1 Routes och navigation

| Route | Syfte | Primär komponent | Fil |
|-------|--------|------------------|-----|
| `/familjen` | Zon 3 — Familjehubben | `FamiljenPage` | `src/modules/core/pages/FamiljenPage.tsx` |
| `/familjen?tab=reflektion` | Dagens Barnfokus | `BarnfokusSuperModule` → `FamiljenReflektionTab` | `src/modules/features/family/children/components/familjen/BarnfokusSuperModule.tsx`, `FamiljenReflektionTab.tsx` |
| `/familjen?tab=livslogg` | Livslogg / stunder per barn | `BarnfokusSuperModule` → `FamiljenLivsloggTab` | `FamiljenLivsloggTab.tsx` |
| `/familjen?tab=tillsammans` | Familjeöversikt, veckodiagram | `FamiljenTillsammansTab` | `FamiljenTillsammansTab.tsx` |
| `/familjen?tab=barnporten` | Förälder: QR, inkorg, orkester | `BarnportenQrPanel`, `BarnportenInboxPanel`, `BarnportenOrkesterPanel` | `FamiljenPage.tsx` L125–133 |
| `/familjen?tab=hamn` | Trygg Hamn / BIFF (inbäddad) | `SafeHarborPage` → `TryggHamnHub` | `src/modules/features/family/safeHarbor/components/SafeHarborPage.tsx` |
| `/familjen?tab=drogfrihet` | Drogfrihet (inbäddad) | `DrogfrihetHubPage` | `FamiljenPage.tsx` L138 |
| `/hamn` | Legacy redirect | `RedirectHamnToFamiljen` | `src/modules/core/routing/AppRoutes.tsx` L152–157, L272 |
| `/barnporten` | Barn-PWA hub | `BarnportenPage` | `src/modules/features/onboarding/barnporten/components/BarnportenPage.tsx` |
| `/widget/familjen` | WH5 snabb rad | `WidgetFamiljenPage` | `src/modules/features/widgets/pages/WidgetFamiljenPage.tsx` |
| `/widget/hamn` | WH4 deep link → Hamn-flik | `WidgetHamnPage` (Navigate) | `src/modules/features/widgets/pages/WidgetHamnPage.tsx` |
| `/widget/barnporten` | CB snabb sändning + variantväljare | `WidgetBarnportenPage` | `src/modules/features/widgets/pages/WidgetBarnportenPage.tsx` |
| `/widget/barnporten?quick=1` | Fokus textarea (manifest shortcut) | samma | `public/barnporten-manifest.webmanifest` L26–27 |

**Tab-register (kod):** `src/modules/features/family/children/constants/familjenTabs.ts` — sex flikar: `reflektion`, `livslogg`, `tillsammans`, `barnporten`, `hamn`, `drogfrihet`.

**Legacy redirects (FamiljenPage):** `?tab=kunskap` och `?tab=monster` → Valv (`vaultRedirectSearch`) — `FamiljenPage.tsx` L43–46, L71–72.

**Nav-kanon:** `src/modules/core/navigation/navTruth.ts` L127–176 (Familjen + underflikar).

---

### 1.2 Shell och delad state

| Komponent / hook | Roll | Fil |
|------------------|------|-----|
| `HubPageShell` | Zon-header, `lockViewport`, footer | `src/modules/core/layout/HubPageShell.tsx` (via import) |
| `HubDropdownNav` | Flikväljare, `glowColor="blue"` | `FamiljenPage.tsx` L101–107 |
| `CognitiveLoadStrip` | Kognitiv sköld-banner | `FamiljenPage.tsx` L95–98 |
| `useFamiljenShell` | Barn, loggar, balans, optimistic barnfokus | `src/modules/features/family/children/hooks/useFamiljenShell.ts` |
| `FamiljenChildPicker` | Barn-chips (livslogg + barnporten) | `src/modules/features/family/children/components/familjen/FamiljenChildPicker.tsx` |
| `MaterialPackShortcuts` | Life OS material-länkar | `FamiljenPage.tsx` L141 |
| `ParentReminderFooter` | Låst footer reflektion | `src/modules/features/family/children/components/ParentReminderFooter.tsx` |

---

### 1.3 Reflektion (`?tab=reflektion`) — **låst Barnfokus**

| Komponent | Syfte | Fil |
|-----------|--------|-----|
| `ChildProfileCards` | Barnväljare (Kasper/Arvid) | `src/modules/features/family/children/components/ChildProfileCards.tsx` |
| **`BarnfokusFraganPanel`** | **Låst frågekort** | `src/modules/features/family/children/components/BarnfokusFraganPanel.tsx` |
| `BARNFOKUS_QUESTIONS` / `barnfokusQuestionForToday` | Frågepool | `src/modules/features/family/children/constants.ts` L51+ |
| `BarnfokusReglerCard` | Regler/lekbank | `src/modules/features/family/children/components/familjen/BarnfokusReglerCard.tsx` |
| `KanslotempletParentCard` | Känslotempel förälder | `src/modules/features/family/children/components/familjen/KanslotempletParentCard.tsx` |
| `PositivaMinnesankare` | Positiva stunder | `src/modules/features/family/children/components/PositivaMinnesankare.tsx` |
| `BalansMatare` | 7-dagars mående | `src/modules/features/family/children/components/BalansMatare.tsx` |
| `ChildrenLogsChat` | RAG-fråga mot barnloggar | `src/modules/features/family/children/components/ChildrenLogsChat.tsx` |

**Legacy mount:** `BarnensPage.tsx` monterar fortfarande `BarnfokusFraganPanel` (smoke/compat).

---

### 1.4 Livslogg (`?tab=livslogg`)

| Komponent | Syfte | Fil |
|-----------|--------|-----|
| `FamiljenLivsloggTab` | Ankare + sub-tabs | `FamiljenLivsloggTab.tsx` |
| `ChildMomentTabs` | Stunder / Om / Favoriter | `ChildMomentTabs.tsx` |
| `ChildMomentStunderPanel` | Tidslinje, filter, Ny stund, HITL till Valv | `ChildMomentStunderPanel.tsx` |
| `ChildMomentOmPanel` | Barnprofil metadata | `ChildMomentOmPanel.tsx` |
| `ChildMomentFavoriterPanel` | Favoritstunder | `ChildMomentFavoriterPanel.tsx` |
| `ChildSubLogPanel` | Formulär ny stund | `src/modules/features/family/children/components/ChildSubLogPanel.tsx` |
| `SaveAsEvidencePrompt` | Manuell Valv-promotion (livslogg) | `SaveAsEvidencePrompt.tsx` |

---

### 1.5 Tillsammans (`?tab=tillsammans`)

| Komponent | Fil |
|-----------|-----|
| `FamiljenFeatureCard` ×3 | `FamiljenFeatureCard.tsx` |
| Dagens ankare + veckodiagram | `FamiljenTillsammansTab.tsx` |

---

### 1.6 Barnporten — förälder (`?tab=barnporten`) + barn PWA

| Vy | Komponent | Fil |
|----|-----------|-----|
| QR koppling | `BarnportenQrPanel` | `BarnportenQrPanel.tsx` |
| **Inkorg → Valv (HITL)** | **`BarnportenInboxPanel`** | `BarnportenInboxPanel.tsx` |
| Agent-register (read-only) | `BarnportenOrkesterPanel` | `BarnportenOrkesterPanel.tsx` |
| Barn hub 2×2 | `BarnportenPage` | `BarnportenPage.tsx` |
| Barn-widget CB1–CB4 | `BarnportenWidget` | `BarnportenWidget.tsx` |
| Widget actions | `useBarnportenWidgetActions` | `useBarnportenWidgetActions.ts` |
| Variant storage | `barnportenWidgetVariant.ts` | default **`cb2`** (PMIR 2026-06-06) |
| Agents registry | `BARNPORTEN_AGENTS` | `barnportenAgents.ts` |
| Save pipeline | `saveBarnportenLog` | `saveBarnportenLog.ts` |
| PWA manifest | `barnporten-manifest.webmanifest` | `public/barnporten-manifest.webmanifest` |
| Route guards | `isBarnportenChildRoute`, manifest scope | `barnportenRoutes.ts` |

---

### 1.7 Trygg Hamn / BIFF (`?tab=hamn`)

| Komponent | Roll | Fil |
|-----------|------|-----|
| `SafeHarborPage` | Wrapper, Zero Footprint kommentar | `SafeHarborPage.tsx` |
| `TryggHamnHub` | Sub-tabs (standalone) / embedded BIFF-only | `TryggHamnHub.tsx` |
| `HamnModuleStack` | Kompassråd + BIFF accordion | `HamnModuleStack.tsx` |
| `BiffPublicPanel` | Inmatning, JADE-detektor, Grey Rock | `BiffPublicPanel.tsx` |
| **`BiffTriagePanel`** | Logistik vs beten triage | `BiffTriagePanel.tsx` |
| `HamnForensicPanel` | Valv-zon full analys | `BiffPublicPanel.tsx` L302+ |
| Copy | `HAMN_*_LEAD` | `src/modules/features/family/safeHarbor/hamnCopy.ts` |
| Backend | `analyzeBiffMessage` | `src/modules/features/family/safeHarbor/api/biffService.ts` |

**Valv-koppling:** `vaultDrawerPath('hamn_analys')` — `TryggHamnHub.tsx` L59–60.

**Flyttade från Familjen:** `FamiljenMonsterTab`, `FamiljenKunskapHubTab` → Valv (`VaultForensicPanel`, `VaultKunskapsbankPanel`).

---

### 1.8 Widget-routing

| Fil | Innehåll |
|-----|----------|
| `src/modules/features/widgets/routing/WidgetRoutes.tsx` | WH1–WH6 + `familjen`, `hamn`, `barnporten` |
| `WidgetShell` | Gemensam widget-layout | `src/modules/features/widgets/layout/WidgetShell.tsx` |

**Spec:** `docs/design/HOMESCREEN-WIDGETS-SPEC.md` (WH4, WH5), `docs/design/BARNPORTEN-SPEC.md` (CB1–CB4).

---

### 1.9 Spec-dokument (design lock)

| Dokument | Status vs kod |
|----------|----------------|
| `docs/design/FAMILJEN-HUB-SPEC.md` | **Drift:** listar 5 flikar inkl. Mönster/Kunskap — kod har 6 flikar + Valv-redirect |
| `docs/design/FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md` | Matchar låst Barnfokus |
| `docs/design/BARNPORTEN-SPEC.md` | Kanon för PWA, CB, HITL |
| `docs/specs/modules/SafeHarbor-SPEC.md` | Route `/hamn` → nu Familjen-flik |
| `docs/design/themes/J-PACK-EIGHT-HUBS.md` | §4 Familjen, §5 Hamn, §7 Barnporten |

---

## 2. Nuvarande stil

### 2.1 Familjen hub (`FamiljenPage`)

- **Shell:** `HubPageShell` med eyebrow/title/lead Obsidian Calm — `FamiljenPage.tsx` L87–92.
- **Fliknav:** `HubDropdownNav` med `glowColor="blue"` (indigo silo enligt `design-calm.mdc`).
- **Viewport:** `lockViewport` + `CognitiveLoadStrip` — hub-view-lock mönster.
- **Saknas i JSX:** `.familjen-hub`, `.familjen-hub__aurora` definierade i `src/index.css` L4546–4638 men **ej applicerade** på `FamiljenPage` — CSS-debt / oanvända aurora-klasser.

### 2.2 Barnfokus (låst panel)

- **Kort:** `BentoCard` utan `glow` prop — `BarnfokusFraganPanel.tsx` L52–56 → renderar `calm-card` utan `glow-bottom-blue`.
- **Wrapper:** `.familjen-barnfokus-wrap` med guld→smaragd gradient pseudo — `FamiljenReflektionTab.tsx` L42–48, `index.css` L4601–4617.
- **Typografi:** Kind-chip `text-[0.65rem] uppercase tracking-wider text-accent`; frågetext `text-sm text-accent`.
- **Knapp (låst copy):** `btn-pill--accent` — **Spara till {alias}s logg** — L81–88.
- **Minneslista:** `TimelineEntry` + `EmptyState` — L92–110.

### 2.3 Livslogg

- **Ankare:** `.familjen-anchor-card` guld gradient — `FamiljenLivsloggTab.tsx` L32–40.
- **Sub-tabs:** `chip--active` / `chip--idle` — `ChildMomentTabs.tsx` L31–33.
- **Listor:** `glass-card` (legacy alias), inte konsekvent `calm-card` — `ChildMomentStunderPanel.tsx` L105.
- **Barn-chips (livslogg/barnporten):** `.familjen-child-chip--active` använder **emerald** (`border-emerald-400/45`) — `index.css` L4592–4594; avviker från Familjen silo **indigo** (`glow-bottom-blue`).

### 2.4 Tillsammans

- `FamiljenFeatureCard` → `UiCard` + design pack hook — varmare mockup E-stil.
- Veckodiagram: inline `style={{ height }}` på `.familjen-week-bar` — `FamiljenTillsammansTab.tsx` L76–79.

### 2.5 Barnporten PWA

- **Egen visuell silo:** varm skymning, hårdkodad gradient `from-[#1a1410] to-[#0a1614]` — `BarnportenPage.tsx` L62 (2 hex, medveten barn-PWA separation).
- **Kort:** `elongated-module` 2×2 grid — **inte** `calm-card`.
- **Interaktion:** `window.prompt()` för Prata/Humör/Privat/Allvarligt — L97–145 (funktionell P1, design-skuld).
- **Widget CSS:** `.barnporten-widget--cb1|cb2|cb3` — `index.css` L4016–4104; amber/guld, skild från Fyren W1.

### 2.6 Trygg Hamn (embedded i Familjen)

- **Embedded mode:** ingen `TabBar`; två intro-`calm-card` (gold + blue) + `HamnModuleStack` — `TryggHamnHub.tsx` L64–80.
- **BIFF stack:** `ElongatedModule` `tone="gold"` — `HamnModuleStack.tsx` L44–54.
- **Triage:** `elongated-module--gold` — `BiffTriagePanel.tsx` L34.
- **JADE UI:** `border-danger/20 bg-danger/5` — `BiffPublicPanel.tsx` L211.

### 2.7 Widgets

- **WH5 Familjen:** minimal `WidgetShell` + `input-glass`, `elongated-module--gold` success — `WidgetFamiljenPage.tsx`.
- **WH4 Hamn:** ren redirect, ingen widget-UI — `WidgetHamnPage.tsx`.
- **Barnporten widget page:** variantväljare CB1–CB4 + live `BarnportenWidget` overlay — `WidgetBarnportenPage.tsx` L87–116.

### 2.8 Token-/klass-sammanfattning

| Område | Primära klasser | Glow/silo |
|--------|-----------------|-----------|
| Familjen hub | `HubPageShell`, `HubDropdownNav` blue | Indigo (nav) |
| Barnfokus | `BentoCard`, `familjen-barnfokus-wrap` | Ingen `glow-bottom-blue` på kort |
| Livslogg | `glass-card`, `chip--*` | Blandat legacy |
| Hamn embedded | `calm-card glow-bottom-gold/blue` | Delvis OC2 |
| Barnporten | `elongated-module`, amber borders | Varm barn (J-barnporten-ljus plan) |
| CB widget | `barnporten-widget__*` | Amber fixed overlay z-56 |

**Hardcoded hex i scope (räknat):** 4 explicita i TSX (`BarnportenPage`, `BarnportenQrPanel` ×2); dussintals i `index.css` barnporten-widget block.

---

## 3. Smärtpunkter

### 3.1 Spec ↔ kod drift

1. **`FAMILJEN-HUB-SPEC.md`** pekar på gammal sökväg `barnens_livsloggar/.../FamiljenPage.tsx` och flikar `monster|kunskap` som hub-flikar — kod har flyttat till Valv + `familjenTabs.ts` (6 flikar).
2. **`SafeHarbor-SPEC.md`** route `/hamn` — kod redirectar till `/familjen?tab=hamn`.
3. **BARNPORTEN-SPEC** rekommenderar **CB1** default; kod default **`cb2`** efter PMIR (`barnportenWidgetVariant.ts` L4).

### 3.2 Obsidian Calm 2.0 inkonsistens

1. `.familjen-hub` aurora-CSS **oanvänd** på huvudsidan.
2. **`BentoCard` utan `glow="blue"`** på Barnfokus trots Familjen = indigo silo.
3. **Tre kortsystem:** `calm-card`, `glass-card`, `elongated-module` blandas inom samma zon.
4. **Barn-chips emerald** vs **nav indigo** — visuell split.
5. **Hamn embedded:** första kort `glow-bottom-gold`, andra `glow-bottom-blue` — korrekt semantiskt oklart (Hamn = indigo enligt design-calm §5).

### 3.3 Barnporten UX-skuld (P1 vs kanon)

1. **Hero 2×2** implementerad som knappar + `prompt()` — avviker från kanon mockups (`barnporten-hero-hub-kanon.png`) med dedikerade routes `/barnporten/prata` etc. (spec §87–97 — **IDÉ/P2 routes**).
2. **Skriv till pappa:** knapp disabled utan textarea men Prata använder prompt — asymmetrisk UX (`BarnportenPage.tsx` L104–117).
3. **Barn-Orkester:** `<details>` agentlista, ingen `BarnportenKompisPanel` ( nämns i spec, ej hittad i kod ).
4. **Inbox HITL:** struktur finns (`BarnportenInboxPanel`) men knappcopy **Granska i arkiv** vs kanon **Granska i Valv**; Valv-länk `/valvet` inte `/dagbok?tab=bevis` — L114.

### 3.4 BIFF / Hamn

1. **Embedded mode** döljer Hamn sub-tabs (Översikt/Speglar/Barn) — endast BIFF + brusfilter-kort; standalone `/hamn` redirect förlorar full TabBar om användaren aldrig öppnar fristående Hamn.
2. **Brusfilter UI-steg** planerat (SafeHarbor-SPEC §3) — idag länk till Speglar, inte inline triage före BIFF.
3. **`BiffTriagePanel`** visas efter analys — bra; procent värden heuristiska (`logisticsPct`) — L29–30.

### 3.5 Widgets

1. **WH4** är redirect-only — ingen klistra-SMS-minimalvy på widget route (spec antyder kort BIFF).
2. **WH5** sparar `category: 'widget_snabb'` inte `barnfokus` — avviker från J-PACK text "barnfokus-rad".
3. **CB long-press** använder `window.prompt` — lågaffektivt men inte barnvänligt UI.

### 3.6 Låst UX — får inte brytas vid redesign

| Lock | Krav | Kodreferens |
|------|------|-------------|
| Barnfokus | Panel, pool, knappcopy, minneslista, optimistic save | `BarnfokusFraganPanel.tsx`, `useFamiljenShell.ts` L136–149 |
| Barnporten HITL | Inkorg → explicit Valv, `SaveAsEvidencePrompt`, `sourceRef` | `BarnportenInboxPanel.tsx`, `SaveAsEvidencePrompt.tsx` |
| CB ≠ W1 | Separata CSS/klasser | `BarnportenWidget.tsx` L52, `index.css` L4016+ |
| Smoke | `npm run smoke:locked-ux` | `scripts/smoke_locked_ux.mjs` |

---

## 4. Ikon / knapp / meny

| Element | Nuvarande | Problem | Förslag (kategori) |
|---------|-----------|---------|---------------------|
| Familjen flik-dropdown | Lucide: Sparkles, BookHeart, Users, Heart, Anchor, HeartHandshake | Spec legacy namn (Reflektion vs Dagens Barnfokus) | **Copy lock** — behåll labels i `FamiljenPage.tsx` L27–33 |
| Barnfokus spara | `btn-pill--accent` + låst copy | — | **Functional lock** — endast visuell polish |
| Annan fråga | `RefreshCw` ghost text-xs | Låg synlighet | **A11y** — `aria-label`, ev. chip-stil |
| Barn-chips | `.familjen-child-chip` emerald active | Silo-färg fel (emerald ≠ Familjen indigo) | **Token** — `glow-bottom-blue` eller guld active per COLOR-POLICY |
| Livslogg sub-tabs | `chip--active` (guld) | OK för aktiv chrome | **Behåll** |
| Ny stund | `Plus` + guld border pill | `glass-card` lista inconsistency | **Unify** → `calm-card glow-bottom-blue` |
| Barnporten 2×2 | Lucide MessageCircle/Heart/Smile/Lock | Prompt-baserad, inte kanon layout | **P2 screen** — dedikerade routes + stora kort |
| Allvarligt CTA | `btn-pill--secondary` + AlertCircle | Bra hierarki | **Behåll** + tydligare vault_candidate banner |
| Inkorg → Valv | `btn-pill--accent` Flytta till Valv (HITL) | Copy drift "Granska i arkiv" | **Copy fix** mot kanon §7b |
| HITL sköld | Shield + text-xs | Matchar mockup intent | **Visual lock** |
| Hamn BIFF submit | `btn-pill--accent` full width | — | **Functional lock** |
| JADE varning | danger border + Sparkles "Städa till Grey Rock" | Stark — bra för ADHD | **Behåll** |
| Triage Visa brus | Eye/EyeOff ghost pill | Maskerade beten — unikt | **Functional lock** |
| CB1 widget | Star amber, fixed bottom-right | Default cb2 i prod | **Product decision** — `valt barnporten CB1` |
| CB2 widget | Heart arc bottom | Surfplatta-first | **Theme J-barnporten** |
| Widget WH5 spara | `btn-pill--accent` | — | **WH5 minimal** |
| Parent footer | Heart dim | Låst D14 copy | **Emotional lock** — ej ta bort |

---

## 5. Referensbilder

### Familjen / Barnfokus / Livslogg

| Fil | Innehåll |
|-----|----------|
| `docs/design/references/FAMILIEN-PAGE-KANON.png` | Hub kanon (Barnfokus + barnprofiler) |
| `docs/design/galleri/skarmar/familjen.png` | Skärm galleri |
| `docs/design/compact/modules/04-familjen.png` | Kompakt hem/familj mockup (eld, barnkort, middagsfråga, minnesankare) |
| `docs/design/FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md` | Flödesdiagram + kategorier |
| `public/design/mockups/ref-familjen.png` | Ref mockup |

### Barnporten

| Fil | Innehåll |
|-----|----------|
| `docs/design/references/BARNPORTEN-HUB-KANON.png` | 2×2 hero kanon |
| `docs/design/barnporten/mockups/barnporten-hero-hub-kanon.png` | Hero alternativ |
| `docs/design/barnporten/mockups/barnporten-inkorg-valv-kanon.png` | **Låst HITL** tvåkorts-layout |
| `docs/design/barnporten/mockups/barnporten-widget-CB1.png` | Stjärn-prick widget |
| `docs/design/barnporten/mockups/barnporten-skriv-till-pappa.png` | Meddelande-skärm |
| `docs/design/barnporten/mockups/barnporten-orkester.png` | Trygg-Kompisen |
| `docs/design/barnporten/mockups/barnporten-app-icon.png` | PWA-ikon |
| `docs/design/barnporten/infographic.html` | Systemflöde |
| `docs/design/compact/modules/07-barnporten-kanon.png` | Kompakt modul |

### Trygg Hamn / BIFF

| Fil | Innehåll |
|-----|----------|
| `docs/design/references/HAMN-HUB-KANON.png` | Hamn hub kanon |
| `docs/specs/modules/SafeHarbor-SPEC.md` | BIFF-flöde, Zero Footprint |

### Widgets

| Fil | Innehåll |
|-----|----------|
| `docs/design/references/homescreen-widgets.png` | WH1–WH5 översikt |
| `docs/design/HOMESCREEN-WIDGETS-SPEC.md` | WH4 Hamn, WH5 Familjen |
| `docs/design/WIDGET-BAR-SPEC.md` | W1 vs CB separation |

### Ikoner (chrome)

| Fil | ID |
|-----|-----|
| `public/icons/chrome/v5-g*-familjen.svg` | Hub-ikon varianter |
| `public/icons/shortcuts/wh-familjen.svg` | WH genväg |

---

## 6. Krav för 3 stilar

Redesign ska respektera **tre visuella linjer** (J-PACK + Obsidian Calm 2.0 baseline). Funktionella lås gäller alla stilar.

### Stil A — Obsidian Calm 2.0 (nuvarande prod-baseline)

| Aspekt | Krav |
|--------|------|
| **Bas** | `#020617`–`#050b14`, `hub-view-lock`, `calm-scroll-island` |
| **Familjen silo** | `glow-bottom-blue` på centrala kort; guld endast aktiv chrome |
| **Typografi** | `font-display-serif` hub rubriker; `font-sans` bröd |
| **Functional locks** | Barnfokus panel oförändrad; HITL inkorg; CB≠W1; P3 Kanban N/A här |
| **Visual freedom** | Applicera `.familjen-hub` aurora; unified `calm-card`; ta bort `glass-card` i livslogg |
| **Förbjudet** | Turquoise aktiv tabs; streak/XP; nature gradients |

### Stil B — `J-familjen-varm` + `J-barnporten-ljus` (varm familj / barn)

| Token (J-PACK) | Familjen `--bg #1a1410`, Barnporten `--bg #1e1814`, `--accent #e8c547` |
| **Familjen** | Espresso/rose-gold; barnfokus-wrap behåller guld→varm gradient |
| **Barnporten** | 2×2 stora kort, cream text `#faf6f0`, mjuk nautical texture |
| **CB1** | Stjärn-prick enligt mockup — default om produkt säger `valt barnporten CB1` |
| **Functional locks** | Samma sparflöden; barn ser aldrig BIFF/Valv |
| **Visual freedom** | Ersätt `prompt()` med full-screen sheets; varm amber widget CSS redan nära |

### Stil C — `J-hamn-greyrock` (Trygg Hamn / BIFF)

| Token | `--bg #1c1c1e`, `--surface #2c2c2e`, guld enda accent |
| **Hamn** | Max läsbarhet, tunn glow; BIFF-triage som hero efter submit |
| **WH4** | Minimal paste → triage → Grey Rock (ev. inline på widget route) |
| **Functional locks** | JADE-detektor, Visa brus maskering, ingen auto-spar till Valv |
| **Visual freedom** | Brusfilter som steg 1 accordion; forensic kvar i Valv |

### Tvärgående (alla stilar)

- **Zero Footprint:** `BiffPublicPanel` Klar rensar state; Hamn unmount — `SafeHarborPage.tsx` L14–17.
- **WORM / HITL:** `SaveAsEvidencePrompt` + `buildVaultPayloadFromChildLog` — aldrig auto från barn privat logg.
- **Smoke gate:** `npm run smoke:locked-ux` + `npm run smoke:design-modules` (D11 Barnfokus).

---

## 7. Mockup-skärmar att speca (alla 3 stilar)

Varje skärm: **layout**, **hierarchy**, **primary CTA**, **glow/silo**, **locked elements** (oföränderliga).

---

### 7.1 Barnfokus — dagens fråga

**Route:** `/familjen?tab=reflektion`  
**Kod:** `BarnfokusFraganPanel.tsx`  
**Referens:** `FAMILIEN-PAGE-KANON.png`, `04-familjen.png` (middagsfråga-sektion)

**Layout (top → bottom):**

1. Barnväljare (`ChildProfileCards`) — två kort eller chips.
2. **Hero kort (låst):**
   - Eyebrow: *Barnfokus — dagens fråga*
   - Kind-chip (gladje/kunskap/knas/…)
   - Frågetext (guld, `text-sm`)
   - Valfri hint (`text-xs text-text-dim`)
   - Textarea 3 rader, placeholder `{alias}s svar…`
   - **Primary:** `Spara till {alias}s logg` (accent pill)
   - Secondary: Annan fråga (RefreshCw)
3. **Minneslista (låst):** rubrik uppercase; `TimelineEntry` rader; empty state copy.

**Obsidian Calm 2.0:** `calm-card glow-bottom-blue` + behåll `.familjen-barnfokus-wrap` gradient.  
**J-familjen-varm:** varmare `--bg`, rose-gold chip borders.  
**Grey Rock N/A** — ej denna skärm.

**Do not remove:** pool rotation, optimistic list, knappcopy, `category: 'barnfokus'`.

---

### 7.2 Livslogg — Stunder / Om / Favoriter

**Route:** `/familjen?tab=livslogg`  
**Kod:** `FamiljenLivsloggTab.tsx`, `ChildMomentStunderPanel.tsx`

**Layout:**

1. `FamiljenChildPicker` (Kasper | Arvid).
2. **Uthållen stund** — `.familjen-anchor-card` med Anchor-ikon + citat.
3. **Sub-tab bar:** Stunder | Om {alias} | Favoriter — pill chips.
4. **Stunder panel:**
   - Filter: Alla | Positiva | Barnfokus | Skola
   - CTA: Ny stund (+)
   - Expand: `ChildSubLogPanel` i BentoCard
   - Lista: datum, kategori-ikon, body, **Spara som bevis** → `SaveAsEvidencePrompt` (HITL)
5. Footer-länk: Öppna arkiv → Valv.

**Design debt att adressera i mockup:** unified `calm-card` list rows; emerald chips → indigo/guld active.

**Referens:** `FAMILIEN-BARN-SIDOR-FUNKTIONER.md`, C-nordic-aurora `03-barnfokus.png` (funktion only, **inte** visuell källa).

---

### 7.3 Hamn / BIFF triage

**Route:** `/familjen?tab=hamn` (embedded)  
**Kod:** `TryggHamnHub.tsx` (embedded), `BiffPublicPanel.tsx`, `BiffTriagePanel.tsx`  
**Referens:** `HAMN-HUB-KANON.png`

**Layout (embedded Familjen):**

1. Intro strip: *Trygg hamn · BIFF* + Grey Rock lead (`calm-card glow-bottom-gold`).
2. Brusfilter strip: Steg 1 + länk Speglar (`calm-card glow-bottom-blue`).
3. **Accordion:** Kompassråd (collapsed default optional).
4. **Accordion expanded:** BIFF · Grey Rock
   - Textarea (JADE red border state)
   - JADE varningspanel (conditional)
   - Submit: *Få Grey Rock-svar*
5. **Post-analys — Triage panel (låst beteende):**
   - Header Shield + *BIFF-triage*
   - 2-kolumn procent: Ren logistik | Känslomässigt bete
   - Logistik facts lista (success tone)
   - Beten lista med **Visa brus / Dölj brus** maskering
   - DCAP risk + HITL varning
6. **Svar-kort:** Föreslaget svar + Kopiera + Klar + Sortera till arkiv.

**J-hamn-greyrock:** grafitt ytor, minimal shadow, triage som visuellt fokus.  
**Standalone variant:** behåll TabBar Översikt | BIFF | Speglar | Barn — `TryggHamnHub.tsx` L84–133.

---

### 7.4 Barnporten hero (barn-PWA)

**Route:** `/barnporten`  
**Kod:** `BarnportenPage.tsx`  
**Referens:** `BARNPORTEN-HUB-KANON.png`, `barnporten-hero-hub-kanon.png`

**Layout:**

1. Header centered: *Barnporten* eyebrow + *Din trygga hamn* (`text-accent-light`).
2. Statusrad: kopplad enhet / QR-instruktion.
3. **2×2 grid (låst innehåll, fri visuell polish):**
   - Prata (MessageCircle)
   - Skriv till pappa (Heart)
   - Humör (Smile)
   - Bara för mig (Lock)
4. Full-width secondary: **Allvarligt / trygg vuxen** (AlertCircle) → `urgent` + vault_candidate.
5. Textarea persistent för Skriv-flöde.
6. Status toast meddelande.

**Mål vs idag:** mockup ska visa **dedikerade sub-skärmar** (ej `window.prompt`); varm gradient `#1a1410` → `#0a1614`; stora touch targets min 44px.

**J-barnporten-ljus:** cream text, mjukare kort shadows, inga juridiska monospace.

---

### 7.5 Barn widget CB1 (Stjärn-prick)

**Routes:** overlay på `/barnporten`, `/widget/barnporten`; CSS `barnporten-widget--cb1`  
**Kod:** `BarnportenWidget.tsx` L123–137, `index.css` L4026–4047  
**Referens:** `barnporten-widget-CB1.png`

**Layout:**

- Fixed bottom-right, `z-index 56`, above safe area (`bottom-[4.5rem]`).
- **Control:** 36×36px circle, amber radial gradient, Star icon 14px.
- **Gest (låst):**
  - Tap → öppna `/barnporten` (eller håll på hub: long-press quick avsig)
  - Long-press 800ms → snabb sändning (`useBarnportenWidgetActions.ts` L48–54)
  - Hold progress via `--barnporten-hold` CSS variable
- **Toast:** ovanför control, amber border, max-width 12rem.

**Prod note:** default variant **`cb2`** — mockup CB1 kräver produktbeslut + `writeBarnportenWidgetVariant('cb1')`.

**WH shortcut:** manifest `url: /widget/barnporten?quick=1` — full-screen quick compose, inte bara prick.

**Skilj från W1:** ingen inspelning, ingen REC, barn måste trycka Spara — `BARNPORTEN-SPEC.md` §76–81.

---

## Bilaga A — Prioriterad design-debt (P0→P2)

| P | Item | Fil(er) |
|---|------|---------|
| P0 | Applicera OC2 `glow-bottom-blue` på Barnfokus BentoCard | `BarnfokusFraganPanel.tsx` |
| P0 | Align inbox copy med HITL kanon | `BarnportenInboxPanel.tsx` L89, L114 |
| P1 | Mount `.familjen-hub` aurora eller ta bort dead CSS | `FamiljenPage.tsx`, `index.css` |
| P1 | Ersätt `glass-card` → `calm-card` i livslogg | `ChildMomentStunderPanel.tsx` |
| P1 | Barnporten hero: prompt → sheets/routes | `BarnportenPage.tsx` |
| P2 | WH4 inline BIFF mini-UI | `WidgetHamnPage.tsx` |
| P2 | CB1 som default om godkänt | `barnportenWidgetVariant.ts` |
| P2 | Uppdatera `FAMILJEN-HUB-SPEC.md` till 6 flikar + Valv-redirect | docs |

---

## Bilaga B — Verifiering

```bash
npm run smoke:locked-ux    # Barnfokus + Barnporten HITL + CB widget
npm run smoke:design-modules  # D11 Barnfokus hero
npm run build              # Typecheck + bundle
```

**Manuell:** Familjen reflektion spar → minneslista; Barnporten inkorg → Flytta till Valv (HITL) → Granska i Valv; Hamn klistra SMS → triage → Kopiera Grey Rock.

---

*Agent 5 audit complete. Save as `docs/design/redesign-audit/AGENT-05-familjen.md`.*

[REDACTED]