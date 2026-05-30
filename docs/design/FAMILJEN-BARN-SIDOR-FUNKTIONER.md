# Familjen / barnsidor — funktionsmål (ej visuell design)

**Status:** Plan · implementation P2  
**Referensbild (endast funktion):** [`themes/C-nordic-aurora/03-barnfokus.png`](./themes/C-nordic-aurora/03-barnfokus.png)  
**Visuell kanon:** Obsidian Calm + Nordic Dusk — **inte** glassmorphism/foton från mockupen  
**Låst UX (oförändrat):** [`FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md`](./FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md) · `.context/locked-ux-features.md` §1  
**Barnens egen enhet:** [`BARNPORTEN-SPEC.md`](./BARNPORTEN-SPEC.md) (separat från förälder-Familjen)

---

## Syfte

Bygga upp **barnens sidor** (förälder-vy under `/familjen`) med samma **typer av funktioner** som i referensmockupen — minnen, ankare, veckovy, barnprofil — utan att kopiera C-nordic-aurora-layout, färg eller fotokort.

---

## Tre skärmar i referensen → Livskompassen

### 1. Familje-dashboard («Familjen»)

| Funktion (referens) | Mål i produkten | Nu | Plan |
|---------------------|------------------|-----|------|
| Horisontell **barnväljare** (chips/avatar) | Snabb byta aktivt barn på hubben | Delvis: `ChildProfileCards` (2-kolumns grid på Reflektion) | P2: kompakt picker på alla flikar utom Tillsammans; valfri avatar/initial |
| **Dagens ankare** (citat + favorit) | Ett utvalt positivt minne synligt för familjen | Delvis: senaste barnfokus-svar i `FamiljenTillsammansTab` | P2: explicit `pinnedAnchorLogId` eller `category: ankare` + «välj som dagens ankare» |
| **Familjeöversikt** (staplar M–S) | Veckostatistik över loggade stunder | **Finns:** `FamiljenTillsammansTab` + `familyWeekStats` | P2: räkna `positivt`/`ankare`/barnfokus som «stund» konsekvent |
| Botten-nav (Hem / Stunder / + / …) | App-wide dock — **inte** Familjen-spec | Dock i `navTruth` | Ingen ändring här |

**Kod idag:** `FamiljenTillsammansTab.tsx`, `useFamiljenShell.ts`

---

### 2. Barnprofil («Noah» / per barn)

| Funktion (referens) | Mål i produkten | Nu | Plan |
|---------------------|------------------|-----|------|
| **Profilhuvud** (namn, ålder, egenskaper, redigera foto) | Trygg identitet per barn, ingen ex-data | Delvis: `CHILD_PROFILES` traits i `ChildProfileCards` | P2: `ChildProfilePage` eller dedikerad sektion under Livslogg: ålder/alias redigerbart lokalt |
| **Utvalt citat** (stort kort) | Senaste eller valt ankarcitat | Delvis: `PositivaMinnesankare` (lista, max 5) | P2: ett «featured» ankare överst |
| **Flikar: Stunder · Om {barn} · Favoriter** | Filtrera innehåll utan ny route-stack | **Finns:** `ChildMomentTabs` på Livslogg · `?view=stunder\|om\|favoriter` | P2: favorit-toggle vid spar; profilfoto |
| **Tidslinje «Senaste stunder»** | Ikoner per kategori, datum, hjärta | Delvis: `TimelineEntry` på legacy `BarnensPage` / Livslogg | P2: enhetlig «stund»-rad; kategori-ikon från `LIVSLOGG_CATEGORIES` |
| **Snabb +** (ny stund) | Öppna «Ny stund» utan scroll | Observation sparas via `ChildSubLogPanel` | P2: FAB eller fast knapp → sheet «Ny stund» |

**Kod idag:** `ChildProfileCards.tsx`, `PositivaMinnesankare.tsx`, `BarnensPage.tsx` (legacy embed)

---

### 3. Ny stund (skapa minne)

| Funktion (referens) | Mål i produkten | Nu | Plan |
|---------------------|------------------|-----|------|
| Fritext **«Vad vill du minnas?»** (t.ex. 250 tecken) | Kort observation, ADHD-säker | Finns: livslogg-observation | P2: dedikerad sheet med räknare |
| **Hur kändes det?** (humör-rutnät) | Valfri känslotagg — inte klinisk skala | Delvis: fysiologi i `PhysiologicalControls`; barnfokus separat | P2: `moodTag` på logg (`stolt`, `glad`, `tacksam`, `lugn`, …) — string enum, ej gamification |
| **Lägg till bild** | Valfri bild till stund (Storage + WORM-metadata) | Delvis: bevis-flöde / Valv | P2: barn-silo bild på `children_logs` (ej auto-Valv) |
| **«Spara som ankare»** | Promovera till ankare / dagens ankare | Delvis: kategori `ankare` / `positivt` | P2: toggle sätter `category: ankare` + kan trigga familje-ankare |
| Spara / stäng | Optimistisk lista | **Låst:** barnfokus optimistisk minneslista | Samma mönster för «stund» |

**Data:** `children_logs` (WORM append) · silo Barnen · **ingen** cross-RAG till Kunskap

---

## Koppling till befintliga flikar

| Familjen-flik | Funktioner från roadmap |
|---------------|-------------------------|
| **Reflektion** | Barnfokus-frågor (låst) + minneslista — behåll |
| **Tillsammans** | Dashboard: ankare + veckodiagram — utöka enligt §1 |
| **Livslogg** | Barnprofil + tidslinje + «Ny stund» — huvudplats för §2–3 |
| **Mönster** | Oförändrat (frekvens + Valv-länk) |
| **Kunskapshub** | Oförändrat (silo-queries) |

Route-idé (P2): `/familjen?tab=livslogg&child=Kasper&view=stunder|om|favoriter` — eller in-page tabs utan ny top-level route.

---

## Medvetet **inte** från mockupen

- Glassmorphism, norrsken-bakgrund, stockfoton i cirklar  
- Produktnamn/labels på engelska från referensen («Moments», «Family»)  
- Streak/eld som stress — se [`FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md`](./FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md) «Din eld» (valfri P2, avstängbar)  
- Ex-konflikt, BIFF eller Valv-innehåll i barn-UI  

---

## Implementation (när `kör barn-sidor`)

1. Läs denna fil + låst barnfokus-spec.  
2. Utöka `children_logs`-schema endast med bakåtkompatibla fält (`moodTag?`, `pinnedAt?`, `mediaUrl?`).  
3. Bygg UI i `src/modules/family/children/` — återanvänd `useFamiljenShell`.  
4. Smoke: `npm run smoke:locked-ux` (barnfokus oförändrat).  
5. **Ej deploy** till Valv/rules utan explicit order.

---

## Relaterade filer

| Fil | Roll |
|-----|------|
| [`FAMILJEN-HUB-SPEC.md`](./FAMILJEN-HUB-SPEC.md) | Fem flikar, hub-lock |
| [`FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md`](./FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md) | Låst frågeflöde |
| [`themes/C-nordic-aurora/03-barnfokus.png`](./themes/C-nordic-aurora/03-barnfokus.png) | Funktionsreferens (3 skärmar) |
| `src/modules/family/children/components/familjen/*` | Flik-UI |
| `docs/archive/evaluations-2026-05-23/2026-05-23-modul-familjen.md` | D12–D14 partial |
