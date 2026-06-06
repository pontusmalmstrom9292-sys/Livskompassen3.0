# AGENT-03 — Valvet, Evidence & Kompis (Design Audit)

**Agent:** Design-audit Agent 3  
**Datum:** 2026-06-07  
**Repo:** `/Users/Livskompassen/StudioProjects/Livskompassen3.0`  
**Scope:** `/valvet` (alla `vaultTab`), `/kompis`, PIN/Fyren-gate, Pansaret (Mönster + Orkester)  
**Mode:** READ-ONLY — ingen kodändring  
**Kanon:** [`docs/design/VALV-HUBB-SPEC.md`](../../VALV-HUBB-SPEC.md) · [`.context/locked-ux-features.md`](../../../.context/locked-ux-features.md) §2

---

## 1. Inventering

### 1.1 Routes & entry points

| Route | Komponent | Fil | Roll |
|-------|-----------|-----|------|
| `/valvet?vaultTab=…` | `ValvetRoutePage` | `src/modules/core/pages/ValvetRoutePage.tsx` | Primär Valv-silo; `HubPageShell` + `VaultPage` |
| `/kompis` | `KompisHubPage` | `src/modules/features/lifeJournal/evidence/kompis/components/KompisHubPage.tsx` | Publik navigatör — **ingen RAG/chatt** |
| `/dagbok?tab=bevis&…` | redirect | `src/modules/core/routing/AppRoutes.tsx` L89–111 | Legacy → `/valvet?vaultTab=…` |
| `/valv`, `/kunskap`, `/dossier` | redirect | `AppRoutes.tsx` L290–293 | → `/valvet` med rätt `vaultTab` |
| `/dossier` (full vy) | `DossierPage` | `src/modules/features/lifeJournal/evidence/vault/dossier/components/DossierPage.tsx` | Embedded i zon Exportera + redirect |

**Gate-ingångar (säkerhet, inte routes):**

| Mekanism | Fil | Beteende |
|----------|-----|----------|
| Fyren 3s-håll (header Kompis-öga) | `src/modules/core/components/KompisHeaderVaultButton.tsx` | `openValvViaFyren` → WebAuthn |
| Fyren gate callable | `src/modules/core/auth/valvFyrenGate.ts` | `authenticateVaultGate` → `setVaultGate()` → `issueVaultServerSession` → `navigate(/valvet)` |
| Låst kort-gate | `src/modules/core/components/VaultLockedGate.tsx` | Visas i `VaultPage` när `!hasVaultGate()` |
| Session 1h | `src/modules/core/auth/sessionService.ts` L9–10 | `VAULT_SESSION_IDLE_MS`; `sessionStorage` gate |
| Zero Footprint stäng | `src/modules/core/security/vaultSessionLifecycle.ts` | `endVaultSession` vid Stäng i `VaultPage` L209–217 |

### 1.2 `vaultTab` → zon → panel (fullständig karta)

Källa: `src/modules/features/lifeJournal/evidence/vault/utils/vaultTabs.ts`

| Zon (`ValvZone`) | `vaultTab` ID | Etikett (UI) | Router | Primär panel |
|----------------|---------------|--------------|--------|--------------|
| **samla** | `logga` | Arkiv | `ValvSamlaZone` | `VaultSamlaHub`, `VaultLogList`, `VaultEntryForm` |
| **samla** | `sok` | Granska inkommande | `ValvSamlaZone` | `ValvChatPanel` (Valv-Chat silo) |
| **analysera** | `monster` | Mönster | `ValvAnalyseraZone` | `PansaretHeader` + **`VaultMonsterPanel`** 🔒 |
| **analysera** | `orkester` | Meddelanden eller SMS-analys | `ValvAnalyseraZone` | `OrkesterAgentTrio` + **`VaultOrkesterPanel`** 🔒 |
| **kunskap** | `kunskapsbank` | Kunskapsbank | `ValvKunskapZone` | **`VaultKunskapsbankPanel`** 🔒 |
| **kunskap** | `aktorskarta` | Personer i ärendet | `ValvKunskapZone` | `VaultAktorskartaPanel` (G9) |
| **vit** | `mitt_vit` | Mitt Vit | `ValvVitZone` | `VaultVitHubPanel`, `VitDevelopmentPanel` |
| **exportera** | `dossier` | Dossier | `ValvExporteraZone` | `DossierPage` (embedded) |
| **forensik** | `hamn_analys`, `speglar_fordjupat`, `dagbok_arkiv`, `familjen_monster`, `arbetsliv_franvaro`, `arbetsliv_lon` | 6 flikar | `ValvForensikZone` | `VaultForensicPanel` |

🔒 = låst UX — får inte tas bort ([`.context/locked-ux-features.md`](../../../.context/locked-ux-features.md) §2).

**Zon-router:** `src/modules/features/lifeJournal/evidence/vault/components/ValvSuperModule.tsx`  
**Sid-router:** `src/modules/features/lifeJournal/evidence/vault/components/VaultPage.tsx`

### 1.3 Skärmkomponenter per scope

#### A. Valv shell (`VaultPage.tsx`)

| Komponent | Sökväg | Funktion |
|-----------|--------|----------|
| `VaultPage` / `VaultPageInner` | `vault/components/VaultPage.tsx` | Gate, logg-state, zon-TabBar, barn till `ValvSuperModule` |
| `VaultValvBreadcrumb` | `vault/components/VaultValvBreadcrumb.tsx` | `Valv · zon · underflik` |
| `ValvZoneModulValjare` | `vault/components/ValvZoneModulValjare.tsx` | Första PIN-session — zonväljare (5 zoner, **ej** forensik) |
| `VaultErrorBoundary` | `vault/components/VaultErrorBoundary.tsx` | Felisolering |
| `WeaverPendingVaultBanner` | `vault/components/WeaverPendingVaultBanner.tsx` | HITL vävare → arkiv |
| `VaultPatternHandoff` | `vault/components/VaultPatternHandoff.tsx` | Handoff till Mönster |

#### B. Pansaret — Analysera-zon 🔒

| Komponent | Sökväg |
|-----------|--------|
| `ValvAnalyseraZone` | `vault/components/zones/ValvAnalyseraZone.tsx` |
| `PansaretHeader` (D16) | `vault/components/PansaretHeader.tsx` |
| **`VaultMonsterPanel`** | `vault/components/VaultMonsterPanel.tsx` |
| **`VaultOrkesterPanel`** | `vault/components/VaultOrkesterPanel.tsx` |
| `OrkesterAgentTrio` (D17) | `vault/components/OrkesterAgentTrio.tsx` |
| `vaultPatternScan` | `vault/utils/vaultPatternScan.ts` |
| `PRODUCT_AGENTS` | `vault/constants/productAgents.ts` |

#### C. Kunskap-zon 🔒

| Komponent | Sökväg |
|-----------|--------|
| `ValvKunskapZone` | `vault/components/zones/ValvKunskapZone.tsx` |
| **`VaultKunskapsbankPanel`** | `knowledge/components/VaultKunskapsbankPanel.tsx` |
| `KunskapsbankHeader` | `vault/components/KunskapsbankHeader.tsx` |
| `VaultAktorskartaPanel` | `knowledge/components/VaultAktorskartaPanel.tsx` |
| `KunskapPage` (embedded) | `kompis/components/KunskapPage.tsx` |
| `KnowledgeVaultChat` | `kompis/components/KnowledgeVaultChat.tsx` |
| `AutonomousArchivePanel` | `kompis/components/AutonomousArchivePanel.tsx` |
| `Tidshjulet`, `KampsparIngestForm` | `kompis/components/Tidshjulet.tsx`, `KampsparIngestForm.tsx` |
| `FamiljenKunskapHubTab` | `features/family/children/components/familjen/FamiljenKunskapHubTab.tsx` |

#### D. Samla — bevis & Valv-Chat

| Komponent | Sökväg |
|-----------|--------|
| `ValvSamlaZone` | `vault/components/zones/ValvSamlaZone.tsx` |
| `VaultSamlaHub` | `vault/components/VaultSamlaHub.tsx` |
| `VaultEntryForm` | `vault/components/VaultEntryForm.tsx` |
| `VaultLogList` | `vault/components/VaultLogList.tsx` |
| `ValvChatPanel` | `vaultChat/components/ValvChatPanel.tsx` |
| `useValvChatSession` | `vaultChat/hooks/useValvChatSession.ts` |

#### E. Kompis (publik)

| Komponent | Sökväg |
|-----------|--------|
| **`KompisHubPage`** | `kompis/components/KompisHubPage.tsx` |
| `KompisMark` 🔒 (M2) | `kompis/components/KompisMark.tsx` |
| `KompisAvatar` | `kompis/components/KompisAvatar.tsx` |
| `KompisHeaderVaultButton` | `core/components/KompisHeaderVaultButton.tsx` |

#### F. Navigation & copy

| Fil | Roll |
|-----|------|
| `src/modules/core/navigation/tabRegistry.ts` L155–228 | Zon- och underflik-TabBar-items |
| `src/modules/core/copy/valvNavCopy.ts` | Kanon-etiketter, ingress, drawer-hints |
| `src/modules/core/navigation/navTruth.ts` L245–300 | Drawer Valv-rader (`inDrawer: true`) |
| `src/modules/core/copy/evidenceCopy.ts` | `VAULT_UI_NAME = 'Arkiv'` |

#### G. Backend-koppling (designrelevant)

| Callable / API | Fil |
|----------------|-----|
| `valvChatQuery` | `functions/src/callables/valv.ts`, `vaultChat/api/valvChatService.ts` |
| `knowledgeVaultQuery` | `kompis/api/knowledgeVaultService.ts` |
| `analyzeBiffMessage` (Orkester) | `features/family/safeHarbor/api/biffService.ts` |
| `addEntityProfile` (G9) | `kompis/api/entityProfileService.ts` |

### 1.4 Smoke & register

- `npm run smoke:locked-ux` — `VaultMonsterPanel`, `VaultOrkesterPanel`, `kunskapsbank` (`scripts/smoke_locked_ux.mjs`)
- `npm run smoke:entities` — Aktörskarta
- `npm run smoke:valv-chat` — Valv-Chat silo
- `npm run smoke:orkester` — zon/synapser

---

## 2. Nuvarande stil

### 2.1 Design tokens & klasser i bruk

| Lager | Vad som används | Avvikelse från Obsidian Calm 2.0 |
|-------|-----------------|----------------------------------|
| **Kort** | `BentoCard` → `calm-card` (`src/modules/shared/ui/BentoCard.tsx` L36) | **`glow` prop används 0 gånger** i hela `evidence/**` — ingen `glow-bottom-blue` för Valv-silo |
| **Legacy kort** | `glass-card` i Orkester, ValvChat, KnowledgeVaultChat svar | Blandar `calm-card` och `glass-card` i samma zoner |
| **Modulrubriker** | `elongated-module`, `elongated-module--gold` (`PansaretHeader`, `KunskapsbankHeader`) | Egen primitiv utanför `BentoCard`; inte dokumenterad i `design-calm.mdc` |
| **Knappar** | `btn-pill--accent`, `btn-pill--secondary`, `btn-pill--ghost` | Konsekvent |
| **Inputs** | `input-glass` | Konsekvent |
| **TabBar** | `TabBar` `size="compact"` — zon + underflik (2-nivå) | Aktiv state via global TabBar (guld enligt COLOR-POLICY) |
| **Typografi** | `font-display` på korttitlar; `font-display-serif` endast `KompisHubPage` destination-labels | Zonrubriker i `ValvetRoutePage` använder `HubPageShell` eyebrow/title — serif uppercase |
| **Ikoner** | Lucide; `ValvArchIcon`, `KompisMark` (låst M2) | OK |
| **Tema** | `moduleThemeMap.ts` L15–17, 35 — `/valvet` och `/kompis` → `DEFAULT_THEME_ID` (I-stone) | Ingen separat J-valv-pansar runtime trots `themeId: 'J-valv-pansar'` i `navTruth` |

### 2.2 Färg & accent (COLOR-POLICY-brott)

**Policy:** [`docs/design/COLOR-POLICY.md`](../../COLOR-POLICY.md) — inga indigo/cyan som primär chrome i Valv.

**Faktisk kod:**

| Fil | Indigo/hårdkodat | Rader (ca) |
|-----|------------------|------------|
| `ValvChatPanel.tsx` | `border-indigo-400/*`, `bg-indigo-500/*`, `text-indigo-300` | L59–68, L114–143 |
| `VaultLogList.tsx` | Vävare-rader `indigo-400/20`, `text-indigo-200` | L90, L104, L116, L124 |
| `VaultLockedGate.tsx` | `text-indigo-500/20` på Shield-ikon | L40 |
| `DossierPage.tsx` | Flera `indigo-500/*` knappar | L398, L457, L475, L597 |
| `VaultKunskapsbankPanel.tsx` | `border-amber-500/30` nätverksfel | L48 |
| `VaultMonsterPanel.tsx` | `bg-accent/70` frekvensbarer | L23 — **guld OK** |
| `PansaretHeader.tsx` | `text-accent`, `elongated-module--gold` | **guld OK** |

**Guld-accenter:** Pansaret-header, breadcrumb, CTA i `KompisHubPage`, frekvensbarer i Mönster — i linje med kanon.

### 2.3 Layout & kognitiv struktur

- **ValvetRoutePage:** `HubPageShell` `lockViewport` + `CognitiveLoadStrip` + `max-w-5xl` (`ValvetRoutePage.tsx` L31–45).
- **VaultPage:** Dubbel navigation — zon-TabBar (6 zoner) + underflik per zon; ingress-text `VALV_ZONE_INGRESS` (`VaultPage.tsx` L300–302).
- **ValvZoneModulValjare:** Progressive disclosure vid första gate; `ExamplePreviewCard` grid (`ValvZoneModulValjare.tsx`).
- **Kunskapsbank:** Vertikal stack — header → `AutonomousArchivePanel` → tom-state → `KunskapPage` (2 flikar) → `FamiljenKunskapHubTab` — **hög vertikal belastning**.

### 2.4 Terminologi-drift (copy vs säkerhet)

| UI-text | Kodsanning |
|---------|------------|
| KompisHubPage: "PIN på nästa skärm" | Gate = **WebAuthn/Fyren**, inte numerisk PIN (`valvFyrenGate.ts`, `VaultLockedGate` UNLOCK_HINT) |
| `VAULT_UI_NAME = 'Arkiv'` | Produkt "Valv" i breadcrumb/drawer men korttitel "Arkiv" |
| Zon `analysera` label **"Mönster"** (`valvNavCopy.ts` L20) | Samma ord som flik `monster` — dubbel semantik |

---

## 3. Smärtpunkter

### 3.1 Design debt (visuell)

1. **Ingen silo-glow** — Valv/Familj ska ha `glow-bottom-blue` enligt `design-calm.mdc` §5; `BentoCard` `glow` prop finns men används aldrig i evidence-modulen.
2. **Indigo som primär AI-chrome** — `ValvChatPanel` och Vävare-markering i `VaultLogList` bryter COLOR-POLICY; risk att Valv känns som "AI-blå" istället för "juridisk guld".
3. **`glass-card` vs `calm-card`** — Orkester agentlista (`VaultOrkesterPanel.tsx` L68), chat-bubblor, Kunskap-svar — inkonsekvent kortspråk.
4. **`elongated-module`** — Pansaret/Kunskapsbank-headers är inte `BentoCard` med `glow="gold"`; svårare att tema-packa.
5. **`rounded-[2rem]` / `rounded-[1.25rem]`** — ValvChat bubblor; kanon säger `rounded-xl`/`rounded-2xl` för modulkort (`.cursorrules` §1.2).
6. **Dossier export-PDF** — vit bakgrund + slate hex i print HTML (`DossierPage.tsx` L280–319) — medvetet för utskrift, men skärmdelar använder indigo.

### 3.2 IA & navigation debt

1. **Spec-drift:** `MENU-DRAWER-KANON.md` L63 säger Valv-rader → `/dagbok?tab=bevis`; kod använder `/valvet?vaultTab=…` (`navTruth.ts` `vaultDrawerPath`).
2. **Verklighetsvalvet-SPEC.md** §2 beskriver inbäddad `VaultPage` i Hjärtat — **ersatt** av fristående `/valvet` (`ValvetRoutePage`).
3. **6 forensik-flikar** i en TabBar — hög kognitiv load; zonväljare utelämnar forensik (`ValvZoneModulValjare` PICKER_ZONES).
4. **Legacy `valv_grp_*`** i `navTruth` (`inDrawer: false`) — dubbel nav-modell (platta drawer-rader + oanvända grupp-headers).
5. **Zon "Mönster" vs flik "Mönster"** — användaren ser "Mönster" två gånger i hierarkin (drawer rad + zon TabBar + flik TabBar).

### 3.3 Kompis-specifik debt

1. **`/kompis` har ingen chatt** — endast destination-lista; användare kan förvänta sig dialog (copy: "jag dirigerar, jag svarar inte här" är korrekt men svag visuell distinktion).
2. **"Dold genväg: håll kompassen i bottenmenyn"** (`KompisHubPage.tsx` L77–78) — gate sitter på **header Kompis-öga** (`KompisHeaderVaultButton`), inte dock-kompass; föråldrad copy.
3. **Tre chatt-ytor** utan tydlig visuell hierarki i audit-scope:
   - Valv-Chat (`sok`) — `reality_vault` silo
   - Kunskapsvalv (`kunskapsbank`) — `kampspar` silo
   - Orkester SMS-analys — `analyzeBiffMessage` (inte persistent chatt)

### 3.4 Locked UX — får inte brytas vid redesign

| Krav | Källa |
|------|-------|
| `VaultMonsterPanel` + `buildVaultFrequencyReport` kvar | `VaultMonsterPanel.tsx` L1, `locked-ux-features.md` §2 |
| `VaultOrkesterPanel` + `vaultTab=orkester` ID oförändrat | `VaultOrkesterPanel.tsx` L1 |
| `VaultKunskapsbankPanel` bakom gate | `VaultKunskapsbankPanel.tsx` L15 |
| `VaultAktorskartaPanel` + G9 | `locked-ux-features.md` |
| Inga publika Kunskap-routes | `AppRoutes.tsx` L292 redirect |
| Deterministisk regex i Mönster — ingen LLM-sanning | `VaultMonsterPanel.tsx` L48, `vaultPatternScan.ts` |
| WORM / HITL / Zero Footprint beteende | Sacred — utanför ren UI-audit men påverkar copy |

---

## 4. Ikon / knapp / meny — tabell

| Element | Nuvarande | Problem | Förslag (kategori) |
|---------|-----------|---------|-------------------|
| Valv drawer-rad "Spara & sök" | `VALV_ZONE_LABELS.samla` → `/valvet?vaultTab=logga` | Spec säger `/dagbok?tab=bevis` | **Docs sync** — uppdatera MENU-DRAWER-KANON |
| Zon TabBar (6 zoner) | `getVaultZoneTabBarItems()` utan ikoner | Tät text på smal skärm | **IA** — ikon per zon eller gruppera Forensik |
| Analysera underflikar | Mönster · Meddelanden eller SMS-analys | Lång etikett "Meddelanden eller SMS-analys" | **Copy** — kort etikett i TabBar, full i ingress |
| Pansaret header | Shield + `elongated-module--gold` | Ej `calm-card`+glow | **Primitive** — `BentoCard glow="gold"` variant |
| Mönster frekvensbarer | `bg-accent/70` på `bg-white/5` | `white/5` hårdkodat | **Token** — `bg-surface-3` |
| Orkester agenttrio | `elongated-module` ×3, guld text | Ingen ikon per agent | **Visual** — agent-avatar glyphs enligt ICON-STYLE-GUIDE |
| Orkester CTA | `btn-pill--accent` "Kör mönstersökning" | OK guld | Behåll |
| Kunskapsbank header | `KunskapsbankHeader compact` + länk Aktörskarta | Två navigationssystem (TabBar + Link) | **IA** — enhetlig underflik only |
| Kunskapsvalv submit | `btn-pill--secondary` | Sekundär för primär handling | **Hierarchy** — `btn-pill--accent` för fråga |
| Valv-Chat assistent-bubbla | Indigo avatar + `glass-card` | COLOR-POLICY | **Token** — guld AI eller dämpad `accent-ai` endast i ikon |
| Valv-Chat källor | `text-success` + grön border | OK för bevis-källor | Behåll |
| Kompis hub CTA | `btn-pill--accent ui-cta-gold` + `ValvArchIcon` | Copy säger "PIN" | **Copy** — "Biometri via Fyren" |
| Kompis destination cards | `UiCard` + guld ring på Kunskapsbank | OK hierarki | Behåll |
| VaultLockedGate | Shield indigo + accent knapp | Indigo på låst skärm | **Token** — `text-accent/20` shield |
| Stäng Valv | `btn-pill--ghost` + X | OK | Behåll |
| Header Kompis-öga | `KompisAvatar` + `FyrenProgressRing` | Copy i hub pekar på fel gest | **Copy sync** |
| Forensik TabBar | 6 textflikar utan ikoner | Överväldigande | **IA** — segmenterad grupp eller accordion |

---

## 5. Referensbilder

| Bild | Sökväg | Relevans |
|------|--------|----------|
| Pansaret kanon | `docs/design/compact/modules/03-valv-pansaret-kanon.png` | Zon Analysera, header + flikar |
| Pansaret variant | `docs/design/galleri/skarmar/valv-pansaret.png` | Full skärm |
| Pansaret referens | `docs/design/references/VALV-PANSARET-KANON.png` | Designreferens |
| Tema F — Guld Pansar | `docs/design/themes/F-guld-pansar/05-pansaret-valv.png` | **Primär redesign-riktning Valv** |
| Tema H — Grey Rock | `docs/design/themes/H-grafit-greyrock/05-pansaret-valv.png` | Orkester/BIFF-ton |
| Tema A Sacred | `docs/design/themes/A-sacred-compass/05-pansaret-valv.png` | Serif + guld |
| E2 återställd | `docs/design/galleri/e2-aterstallda/E2-05-pansaret.png` | Historisk målbild |
| Valv-ikon kanon | `docs/design/references/VALV-ICON-KANON.md` | Chrome-ikoner (ej B1) |
| Drawer kanon | `docs/design/references/MENU-DRAWER-KANON.md` + `.png` | Valv-sektion när `vaultOpen` |
| Barnporten → Valv bro | `docs/design/barnporten/mockups/barnporten-inkorg-valv-kanon.png` | HITL-bevis (adjacent scope) |

**Spec-dokument:**

- `docs/design/VALV-HUBB-SPEC.md` — zon ↔ `vaultTab` IA våg 1
- `docs/specs/modules/Verklighetsvalvet-SPEC.md` — Sacred/WORM (delvis föråldrad route)
- `docs/specs/modules/Valv-Chat-SPEC.md` — Valv-Chat silo
- `src/modules/features/lifeJournal/evidence/kompis/README.md` — Kunskap vs Valv-Chat

---

## 6. Krav för 3 stilar

Redesign får variera **ytan** men inte **låsta flöden**. Tre referensstilar från COLOR-POLICY + tema-mockups:

### Stil F — Guld Pansar (rekommenderad Valv-default)

| Dimension | Krav |
|-----------|------|
| **Får ändras** | Header-gradient, serif-titlar, guld botten-glow på alla Valv-kort, frekvensbar-stil, Orkester agent-kort |
| **Måste behållas** | Zon-TabBar + underflikar; `monster`/`orkester` flik-ID; deterministisk Mönster utan LLM; PansaretHeader semantik |
| **Färger** | `#d4af37` accent; inga indigo-primärer i Valv-Chat — ersätt med guld/dämpad amber |
| **Typografi** | `font-display-serif` på "Det Digitala Pansaret" och zonrubriker |

### Stil H — Grafit Grey Rock (Orkester / forensik accent)

| Dimension | Krav |
|-----------|------|
| **Får ändras** | Orkester SMS-panel, DCAP-resultat, känslomässigt bete-listor — lägre kontrast, grafit ytor |
| **Måste behållas** | `analyzeBiffMessage` flöde; textarea + explicit "Kör mönstersökning"; inga auto-spar till WORM |
| **Färger** | Neutral `text-text-muted`; guld endast på riskpoäng och dirigerad agent |
| **Ton** | BIFF/Grey Rock — affärsmässig, ingen alarmfärg |

### Stil I-stone / Architect (shell + Kompis hub)

| Dimension | Krav |
|-----------|------|
| **Får ändras** | `HubPageShell` på `/valvet`, `KompisHubPage` destination-grid, `UiCard` spacing |
| **Måste behållas** | Kompis som **dirigent** utan RAG på `/kompis`; `KompisMark` (M2 låst); Fyren 3s gate |
| **Färger** | Stone-ytor `bg-surface-2`; guld active chrome |
| **Kompis** | Avatar + en primär Valv-CTA; destination-lista oförändrad i scope |

### Funktionella lås (alla stilar)

- `vaultTab` query-param kontrakt oförändrat
- `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel` finns kvar i DOM-trädet efter gate
- U1 silo-gräns: ingen cross-RAG UI mellan Kunskapsbank och Valv-Chat
- Gate: WebAuthn via Fyren — ingen numerisk PIN i UI-copy
- `npm run smoke:locked-ux` måste passera efter visuell redesign

---

## 7. Mockup-skärmar att speca

Nedan: innehåll, hierarki och visuella krav per skärm — avsedda för Figma/AI Studio enligt tema F (default).

---

### 7.1 Pansaret — header + dubbel TabBar

**Route:** `/valvet?vaultTab=monster` (zon `analysera`)

**Layout (top → bottom):**

1. `HubPageShell` eyebrow "Arkiv" · title "Sanningsarkivet" · `CognitiveLoadStrip`
2. `BentoCard` (låst upplåst):
   - Rad: breadcrumb `Valv · Mönster · Mönster` · knappar `Byt zon` | `Stäng`
   - **Zon-TabBar:** Spara & sök | **Mönster** | Kunskapsbank | Mitt Vit | Rapporter | Djupare
   - Ingress: *"Mönster och meddelanden — över tid, inte i stunden."*
3. **Underflik-TabBar:** **Mönster** | Meddelanden eller SMS-analys
4. **PansaretHeader:** Shield + titel "Det Digitala Pansaret" + undertext (deterministiskt, inte gissning)

**Visuellt (F):**

- Zon-TabBar aktiv: guld underline (ej indigo)
- PansaretHeader: `calm-card glow-bottom-gold` eller `elongated-module--gold` med `backdrop-blur-xl`
- Max en vertikal scroll-ö (`calm-scroll-island`) under header

**Filer:** `ValvetRoutePage.tsx`, `VaultPage.tsx` L270–328, `ValvAnalyseraZone.tsx`, `PansaretHeader.tsx`

---

### 7.2 Mönster (frekvensanalys)

**Route:** `/valvet?vaultTab=monster`

**Innehåll:**

1. **Kort: Frekvensanalys** — sammanfattning (`N poster · M kommunikationsrelaterade`)
2. **Bar chart:** Taktiker (DARVO, GASLIGHTING, …) — `BarRow` horisontella guld-barer
3. **Kort: Poster per månad** — månadsfrekvens
4. **Kort: Kategorier i valvet** — textlista med guld count

**Empty state:** "Inga valvposter ännu. Spara under Arkiv — frekvensen visas här."

**Visuellt:**

- Ersätt `bg-white/5` med `bg-surface-3`
- Inga diagram-bibliotek (budget) — behåll CSS-barer
- `@locked-ux` — panel får inte tas bort

**Filer:** `VaultMonsterPanel.tsx`, `vaultPatternScan.ts`

---

### 7.3 Orkester (Meddelanden / SMS-analys)

**Route:** `/valvet?vaultTab=orkester`

**Innehåll (top → bottom):**

1. **OrkesterAgentTrio** — Brusfiltret · BIFF-Skölden · Sannings-Analytikern
2. **Kort: Assistentroller** — `PRODUCT_AGENTS` lista
3. **Kort: Registrerade dokument** (conditional) — senaste 8 sms/mejl-poster med teknik-tags
4. **Kort: Mönstersökning i SMS-tråd** — textarea 8 rader + CTA "Kör mönstersökning"
5. **Resultat:** Dirigerad av · DCAP riskpoäng · Taktiker · Rena fakta · Känslomässigt bete

**Visuellt (H-influens):**

- Agenttrio: kompakta kort med guld namn, grafit bakgrund
- Resultatsektion: avdelare `border-border` (ej indigo)
- Loading: guld spinner, inte indigo

**Filer:** `VaultOrkesterPanel.tsx`, `OrkesterAgentTrio.tsx`, `productAgents.ts`

---

### 7.4 Kunskapsbank (PIN-zon)

**Route:** `/valvet?vaultTab=kunskapsbank`

**Innehåll:**

1. Header-rad: `KunskapsbankHeader compact` + pill-länk Aktörskarta
2. `AutonomousArchivePanel` — mappträd kampspar/kb_docs
3. (Tom-state) BentoCard "Ditt minne är tomt" + CTA Tidshjulet
4. `KunskapPage` embedded:
   - TabBar: **Kunskapsvalv** | Tidshjulet
   - `KnowledgeVaultChat` + `KampsparIngestForm` / tidshjul-vy
5. `FamiljenKunskapHubTab` — per-barn upload/sök

**Underflik-TabBar (zon):** Kunskapsbank | Personer i ärendet

**Visuellt (F + silo-skillnad):**

- Tydlig banner: "Separat från Pansaret — ingen cross-RAG"
- `glow-bottom-gold` på huvudkort; archive-tree i `surface-2`
- Nätverksfel: amber (behåll) men tokenisera till `accent-warn`

**Filer:** `VaultKunskapsbankPanel.tsx`, `KunskapPage.tsx`, `KnowledgeVaultChat.tsx`, `AutonomousArchivePanel.tsx`

---

### 7.5 Kompis — hub + chatt (två skärmar)

#### 7.5a Kompis hub (`/kompis`) — **ingen chatt**

**Innehåll:**

1. BentoCard: KompisMark avatar + förklaring Valv/biometri
2. Primär CTA: "Öppna Valv · ange biometri" (korrigera copy från "PIN")
3. Sektion "Öppna zoner" — `UiCard` lista (Kunskapsbank primary ring)
4. Footer: Tillbaka till Hem

**Visuellt:** `kompis-hub-page` spacing; guld primary CTA; M2 `KompisMark` oförändrad.

**Fil:** `KompisHubPage.tsx`

#### 7.5b Kunskapsvalv-chatt (bakom gate) — **faktisk Kompis-RAG**

**Route:** `/valvet?vaultTab=kunskapsbank` → flik Kunskapsvalv

**Innehåll:**

- Textarea placeholder "Ställ din fråga mot Minne..."
- Submit (bör vara primär accent i redesign)
- Svar med guld rubrik "Svar"
- `KnowledgeCitationList` — klickbara källor → Tidshjulet
- `setKompisAura(true)` under load — header-avatar pulserar

**Visuellt:** Skillnad mot Valv-Chat: **guld** AI-chrome, inte indigo; en kolumn, inga chat-bubblor (form + svar-block).

**Filer:** `KnowledgeVaultChat.tsx`, `KompisAvatar.tsx` (aura)

#### 7.5c Valv-Chat (referens — `vaultTab=sok`)

**Innehåll:** Chat-tråd med källmodal, forensisk rubrik "Sök i Valvet", Zero Footprint-hint.

**Redesign-krav:** Byt indigo → guld/`accent-ai` sparsamt; behåll grön källa-markering.

**Fil:** `ValvChatPanel.tsx`

---

## Bilaga A — `vaultTab` quick reference

```
logga | sok | monster | orkester | kunskapsbank | aktorskarta | mitt_vit | dossier
hamn_analys | speglar_fordjupat | dagbok_arkiv | familjen_monster | arbetsliv_franvaro | arbetsliv_lon
```

**Pansaret (legacy union):** `logga`, `sok`, `monster`, `orkester`, `dossier` — `vaultTabs.ts` L16–20

---

## Bilaga B — Prioriterad redesign-backlog (Agent 3)

| P | Åtgärd | Risk |
|---|--------|------|
| P1 | Ersätt indigo i `ValvChatPanel` + `VaultLogList` (Vävare) med guld tokens | Låg — ren CSS |
| P1 | Lägg `glow="blue"` eller `gold` på Valv-root `BentoCard`s | Låg |
| P1 | Synka copy: PIN → biometri/Fyren; dock-genväg → header-öga | Låg |
| P2 | Enhetlig `calm-card` — fasa ut `glass-card` i evidence | Medel |
| P2 | Kunskapsbank: collapsible `AutonomousArchivePanel` / Familjen-sektion | Medel IA |
| P2 | Forensik: grupperad navigation (3 kluster) | Medel IA |
| P3 | Uppdatera MENU-DRAWER-KANON + Verklighetsvalvet-SPEC routes | Docs |
| **Förbjudet** | Ta bort Mönster/Orkester-flikar eller döp om `vaultTab=orkester` | Locked UX |

---

## Bilaga C — Verifiering

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:entities
npm run smoke:valv-chat
```

---

*Genererad av design-audit Agent 3 (read-only). Spara som `docs/design/redesign-audit/AGENT-03-valvet-kompis.md`.*

