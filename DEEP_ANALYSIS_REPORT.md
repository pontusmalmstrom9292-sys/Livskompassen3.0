# DEEP_ANALYSIS_REPORT — Livskompassen v2

**Datum:** 2026-06-07  
**Git HEAD:** `85b90eff` — *feat(smoke): update smoke results and enhance review queue components*  
**Metod:** Zon-för-zon syntes + kodverifiering (grep/read). Bygger på befintliga audits — kopierar inte tabeller ordagrant.  
**Källor:** [`src/modules/README.md`](src/modules/README.md), [`navTruth.ts`](src/modules/core/navigation/navTruth.ts), [`2026-06-07-design-redesign-master-audit.md`](docs/evaluations/2026-06-07-design-redesign-master-audit.md), [`Arkiv-GAP-REGISTER.md`](docs/specs/modules/Arkiv-GAP-REGISTER.md), [`SYSTEMKONTROLL.md`](docs/SYSTEMKONTROLL.md)

---

## 1. Övergripande arkitektur och modulstruktur

### 1.1 Vad projektet är

Livskompassen v2 är en **Life OS**-PWA: React + Vite frontend, Firebase backend (Firestore, Cloud Functions, Hosting), med ett **3-zonsystem** för kognitiv avlastning:

| Zon | Kanonisk route | Innehåll |
|-----|----------------|----------|
| **Hjärtat** | `/hjartat` | Dagbok (`?tab=reflektion`), Speglar (`?tab=speglar`) |
| **Valvet** | `/valvet` | PIN/WebAuthn-silo — bevis, mönster, orkester, dossier, kunskapsbank, aktörskarta |
| **Vardagen** | `/vardagen` | Kompasser, MåBra, planering, arbetsliv, ekonomi, drogfrihet |
| **Familjen** | `/familjen` | Barnfokus, livslogg, tillsammans, barnporten, trygg hamn |

Legacy-redirects behålls medvetet: `/dagbok` → Hjärtat eller Valvet; `/liv` → `/vardagen`; `/valv` → `/valvet`.

### 1.2 Mappstruktur (features-first)

```
src/modules/
├── core/          (~202 filer) — shell, routing, auth, navigation, theme, en Zustand-store
├── shared/        (~26 filer)  — BentoCard, Button, hooks, utils
├── shell/         — LivLauncherPage (Vardagen-launcher)
├── capture/ + inkast/ — Smart Inkast, review queue
└── features/
    ├── lifeJournal/   — diary, mirror, evidence (vault, kompis, vaultChat)
    ├── dailyLife/     — kompasser, mabra, ekonomi, arbetsliv, drogfrihet
    ├── family/        — barnen, safeHarbor (BIFF)
    ├── admin/         — planering, projekt, stämpel
    ├── widgets/       — Fyren WH1–WH4
    └── onboarding/    — Barnporten PWA
```

**Totalt:** ~667 TypeScript-filer under `src/modules/`. Backend: ~68 filer under `functions/src/`.

### 1.3 Routing och laddning

- **Router:** [`AppRoutes.tsx`](src/modules/core/routing/AppRoutes.tsx) — `React.lazy()` för zon-sidor (Hjärtat, Valvet, Familjen, MåBra, Planering, Projekt, Barnporten m.fl.).
- **Eager:** `MainLayout`, `HomePage` — alltid i initial bundle (förväntat för shell).
- **Nav-sanning:** [`navTruth.ts`](src/modules/core/navigation/navTruth.ts) — `NAV_TRUTH[]` med drawer-sektioner `vardag` | `valv`, vault PIN-flaggor, legacy paths.
- **Säkerhetsrouting:** `?tab=bevis` blockeras på Hjärtat och skickas till `/valvet` — plausible deniability.

### 1.4 Backend och silos (U1)

Cloud Functions exporterar ~32 callables, uppdelade i [`functions/src/callables/`](functions/src/callables/):

| Fil | Exempel |
|-----|---------|
| `knowledge.ts` | `knowledgeVaultQuery`, `childrenLogsQuery`, ingest |
| `valv.ts` | `valvChatQuery`, `generateDossier`, `issueVaultSession`, EntityProfile |
| `agents.ts` | `analyzeMessage`, `speglingsMirror`, `mabraCoach`, Barnporten pairing |
| `inbox.ts` | Inkast-kö, klassificering |

**Tre kunskapssilos (aldrig cross-RAG):** Kunskap (`kampspar`/`kb_docs`), Valv (`reality_vault`), Barnen (`children_logs`). GAP G1–G16 är **done** enligt [`Arkiv-GAP-REGISTER.md`](docs/specs/modules/Arkiv-GAP-REGISTER.md). V1 (Genkit) medvetet **wait**.

### 1.5 Tillståndshantering

- **En global Zustand-store** ([`core/store/index.ts`](src/modules/core/store/index.ts)): auth, drawer-state, vault unlock-flagga, kompass-filter, Zero Footprint `resetState()`.
- **Domänstate:** custom hooks (`usePlanningTasks`, `useStampClock`, `useJournalFlow`) + Firestore listeners.
- **Session:** `localStorage`/`sessionStorage` för modulväljare, tema, speglar-session, barnporten device ID.

**Styrka:** Tydlig separation shell vs features. **Risk:** All UI-state i en store kan växa — överväg domän-specifika stores endast om det blir svårt att följa.

---

## 2. Kodkvalitet och TypeScript-optimering

### 2.1 TypeScript — överlag starkt

- **`any` i aktiv `src/`:** 1 träff — endast [`secureExport.test.ts`](src/modules/shared/utils/secureExport.test.ts).
- **`eslint`:** `@typescript-eslint/no-explicit-any` är avstängd — teamet skriver strikt ändå.
- **Callable-svar:** `result.data as ValvChatResponse` — vanligt mönster vid Firebase httpsCallable; typer definierade per API-fil.

### 2.2 API-lager — konsekvent

Varje feature har `api/` eller `hooks/` som kapslar Firestore/callables:

- Stämpel → [`timeEconomyFirestore.ts`](src/modules/core/firebase/timeEconomyFirestore.ts) (direkt Firestore)
- Valv-chat → [`valvChatService.ts`](src/modules/features/lifeJournal/evidence/vaultChat/api/valvChatService.ts) + `withVaultSessionPayload`
- Kunskap → [`knowledgeVaultService.ts`](src/modules/features/lifeJournal/evidence/kompis/api/knowledgeVaultService.ts) (auth, ingen vault-session-token)

### 2.3 Backend-underhållbarhet

- **`functions/src/index.ts`** är re-export only — implementation i `callables/` (underhållbart, samma deploy-namn).
- **Agent-prompter** centraliserade i `functions/src/sharedRules.ts` (regel: inga hårdkodade prompts i agentfiler).

### 2.4 Teknisk skuld att adressera

| Problem | Bevis | Varför det spelar roll |
|---------|-------|------------------------|
| **Dubbla BentoCard-sökvägar** | `@/shared/ui/BentoCard` + `@/core/ui/BentoCard` (re-export) | Förvirrande imports; risk för divergerande props |
| **`Button.tsx` sällan använd** | ~140+ filer använder `btn-pill--*` CSS direkt | Design tokens i `tokens.ts` driftar från verklig användning |
| **Legacy export-shims** | `src/pages/VardagenPage.tsx`, `core/pages/VardagenPage.tsx` | Onödig indirection efter features-first-migrering |
| **`DockHubBand.tsx`** | Finns kvar; oklart om aktiv i prod-layout | Död kod ökar kognitiv last för utvecklare |

### 2.5 Prestanda (kodperspektiv)

- **Vite `manualChunks`:** endast `vendor-firebase` + `vendor-motion` — lucide m.m. följer route-chunks.
- **`index.css`:** ~6 076 rader monolit — ingen CSS code-splitting; initial payload risk.
- **Positivt:** Lazy routes minskar JS per navigation.

---

## 3. UI/UX, design och navigering (låg-arousal)

### 3.1 Obsidian Calm — vad som fungerar

- **Dämpad palett:** `#020617`–`#050b14` bas, guld `#d4af37`, semantiska Tailwind-klasser (`bg-surface-2`, `text-accent`).
- **Typografi:** `font-display-serif` (Cinzel) för zonrubriker — formell, låg arousal.
- **Säkerhets-UX:** Vault via Fyren 3s hold + WebAuthn; Zero Footprint vid logout/blur.
- **Hub-view-lock + calm-scroll-island:** förhindrar hela sidans scroll — bra för ADHD.

### 3.2 Design debt (verifierat + från master audit)

| # | Problem | Varför (neuroinkludering) |
|---|---------|---------------------------|
| 1 | **109+ hårdkodade hex/rgba** i `index.css` / `design-packs.css` | Bryter token-konsistens → oväntade färgbyten stressar hypervigilans |
| 2 | **Tre kortprimitiver** (`calm-card`, `glass-card`, `elongated-module`) | Samma zon ser olika ut → ökad kognitiv kostnad |
| 3 | **Indigo/teal som primär chrome** (t.ex. ValvChatPanel, drawer sub-links) | Bryter COLOR-POLICY (guld = aktiv) — AI-zoner känns “neon” |
| 4 | **4-zon FloatingDock** (Vardagen, Familjen, Dagbok, Planering) vs kanon 3 zoner | Fler val = mer besluts trötthet |
| 5 | **Planering: 4 nav-lager** (TabBar, modulväljare, drawer, dropdown) | Klassisk ADHD-fälla — användaren vet inte var de är |
| 6 | **Silo-glow underutnyttjad** | `BentoCard glow=` finns men används sparsamt (~8 filer); hjälpklasser definierade i `obsidian-calm-2.css` |
| 7 | **`FyrenSmartWidgetBar` stub** | Returnerar `null` men mountas — W1–W4 spec exists, widget-rad saknas |
| 8 | **Humör-UI inkonsistent** | Snabb-läge (select) vs Reflektera (grid) i dagbok |
| 9 | **`DEFAULT_THEME_ID` drift** | Registry default `I-stone` vs prod COLOR-POLICY — risk för dev/prod-skillnad |

**Positiv glow-användning idag:** capture/inkast, planering-kalender, drogfrihet-hub — silo-signaling fungerar där den används.

### 3.3 Navigering — struktur vs upplevelse

- **Drawer:** Vardag + Valv (PIN) enligt [`MENU-DRAWER-KANON.md`](docs/design/references/MENU-DRAWER-KANON.md) — korrekt modell.
- **Dock:** Planering som egen zon (inte bara Vardagen-flik) — produktbeslut men ökar yta.
- **Spec-drift:** vissa docs refererar `/liv`, `/dagbok?tab=bevis` — kod har migrerat till `/hjartat` + `/valvet`.

---

## 4. Modulär separation: dagliga verktyg vs tung data

### 4.1 Arkitekturdiagram

```
Dagliga verktyg                    Tung data / bevis
─────────────────                  ─────────────────
stampla/      ──► Firestore        vault/         ──► reality_vault (WORM)
compasses/    ──► checkins         vaultChat/     ──► valvChatQuery + session token
mabra/        ──► mabraCoach       kompis/        ──► knowledgeVaultQuery (Kunskap-silo)
planning/     ──► planning_tasks   children/      ──► children_logs + childrenLogsQuery
ekonomi/      ──► budget docs      dossier/       ──► generateDossier + WORM snapshots
```

### 4.2 Säkerhetslager

| Lager | Mekanism | Fil |
|-------|----------|-----|
| UI-gate | WebAuthn per zon, 1h idle | [`VaultZoneGate.tsx`](src/modules/core/security/VaultZoneGate.tsx) |
| Server-gate | `withVaultSessionPayload` | [`vaultServerSession.ts`](src/modules/core/auth/vaultServerSession.ts) |
| Silo-guard | Separata callables + RAG-index | `kampsparQueryRag.ts`, `valv.ts` |
| WORM | Firestore rules create-only | `reality_vault`, `children_logs`, `journal` |

**Valv-callables med session-token:** `valvChatQuery`, `generateDossier`, EntityProfile, weaver approve/reject.

**Kunskap-callable utan vault-token:** `knowledgeVaultQuery` — korrekt silo, men UI måste hålla Kunskap bakom Valv-PIN (VaultKunskapsbankPanel).

### 4.3 Bedömning

- **Kodstruktur:** **Bra separation** — dagliga moduler rör inte RAG direkt; evidence ligger under `lifeJournal/evidence/`.
- **Användarupplevelse:** Gränsen **syns inte alltid** — samma chrome (drawer, dock) för lätta och tunga zoner. Förbättring: tydligare visuell “tung zon”-markör (guld vs indigo glow, låst ikonografi) utan att exponera ord som “valv” på publika ytor.

### 4.4 Locked UX (får inte brytas)

Verifierat via projektregler + smoke:

- Barnfokus-frågor, Valv Mönster + Orkester, Planering P3 Kanban, Barnporten HITL → Valv.

---

## 5. Förslag på nya funktioner och verktyg

Kopplat till roadmap ([`.context/system-plan.md`](.context/system-plan.md)) och produktfilosofi (gratis först, kognitiv avlastning):

| Förslag | Mervärde | Komplexitet |
|---------|----------|-------------|
| **Fyren widget bar W1–W4** | Snabb åtkomst utan full navigation | Medel — stub finns, spec klar |
| **Smart Inkast → zon-bro** | Post-save CTA till Dagbok/Valv/Barnen (delvis live) | Låg–medel |
| **Enhetlig humör-UI** | Mindre val i dagbok Snabb vs Reflektera | Låg |
| **CSS token-migration** | Gradvis ersätt hex med vars — stabil Obsidian Calm | Medel (inkrementell) |
| **Bundle/CSS-analys** | `rollup-plugin-visualizer` — datadriven perf | Låg |
| **Adaptiv Hemkompass** | ParalysPanel, KasamEvening — pågår | Pågår |
| **Barnporten push (Våg C)** | Notiser till barn-PWA | Hög kostnad — defer + PMIR |
| **Planering nav-förenkling** | En primär nav + gömd “mer” | Medel — stor UX-vinst |

**Undvik:** Externa OAuth (kalender/Gmail), gamification (streak/XP), fjärde RAG-silo.

---

## 6. Konkreta nästa steg (prioriterad åtgärdslista)

### P0 — Störst effekt, minst risk

1. **Konsolidera kortprimitiv** till `calm-card` + `BentoCard glow` — filer: `obsidian-calm-2.css`, hub-kort i diary/evidence.  
   *Varför:* En visuell grammatik minskar stress vid zonbyte.

2. **Beslut om FyrenSmartWidgetBar** — implementera W1–W4 eller ta bort mount i `MainLayout`.  
   *Varför:* Död komponent skapar falsk förväntan i spec vs prod.

3. **Rensa legacy shims** — `src/pages/VardagenPage.tsx`, oanvänd `DockHubBand` om ej i layout.  
   *Varför:* Färre filer = lägre kognitiv last för dig och agenter.

### P1 — Designkonsistens

4. **Indigo → guld på aktiv chrome** i ValvChatPanel, drawer sub-links (COLOR-POLICY).  
5. **Planering: reducera nav-lager** från 4 till 2 (TabBar + drawer).  
6. **Synka docs** — TAB-REGISTRY, FAMILJEN-HUB-SPEC mot `navTruth.ts` paths.  
7. **Rollout silo-glow** på huvudkort i Hjärtat/Valv/Familjen (`glow="blue"` etc.).

### P2 — Prestanda och polish

8. **CSS chunking / dedup** — bryt `index.css` per zon eller design-pack lazy load.  
9. **Vite bundle visualizer** — mät innan fler manualChunks.  
10. **Enhetlig humör-input** i `JournalQuickMode` vs wizard-steg.

---

## Verifiering (körning)

| Check | Resultat | Tidpunkt |
|-------|----------|----------|
| `npm run build` | *(uppdateras efter körning)* | 2026-06-07 |
| `npm run smoke:locked-ux` | *(uppdateras efter körning)* | 2026-06-07 |

---

## Referenser för djupdykning

- Design master audit: [`docs/evaluations/2026-06-07-design-redesign-master-audit.md`](docs/evaluations/2026-06-07-design-redesign-master-audit.md)
- Per-zon UI: [`docs/design/redesign-audit/`](docs/design/redesign-audit/)
- Systemstatus: [`docs/evaluations/SENASTE-SAMMANFATTNING.md`](docs/evaluations/SENASTE-SAMMANFATTNING.md)
- Smoke-sanning: [`docs/SMOKE_RESULTS.md`](docs/SMOKE_RESULTS.md)
- Modulkarta: [`src/modules/README.md`](src/modules/README.md)

---

*Rapport genererad autonomt enligt DEEP_ANALYSIS-plan. Nästa iteration: fördjupa en enskild zon (t.ex. Planering nav) vid behov.*
