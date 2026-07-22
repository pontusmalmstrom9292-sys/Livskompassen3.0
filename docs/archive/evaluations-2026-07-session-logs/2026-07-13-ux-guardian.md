# UX Guardian — Executive Midnight / Locked UX-integritet

**Datum:** 2026-07-13  
**Plattform:** Cursor (Agent, read-only audit)  
**Agent:** specialist-ux-guardian  
**Status:** **GO** — statisk Locked UX-integritet intakt; inga P0/P1-brott  
**Scope:** Executive Midnight (DAD v1.0), Locked UX per zon, design-modules, chrome/dock

---

## 1. Executive summary

Båda obligatoriska smoke-kedjorna passerade utan fel. Alla låsta flöden som smoke-testerna vaktar — Barnfokus, Valv Pansaret (Mönster/Orkester/Kunskapsbank/Aktörskarta), drawer Vardag+Valv, Planering P3 Kanban, Fyren/widget, Barnporten HITL, Bästa Design chrome — finns kvar i källkod och matchar `.context/locked-ux-features.md`.

**Slutsats:** Ingen merge-blockerande regress hittad. Rekommendation: **GO** för fortsatt utveckling/merge ur Locked UX-perspektiv, med P2-uppföljning för visuell regression (dev-server screenshot) och dokumentationsstädning.

---

## 2. Smoke-resultat (körd 2026-07-13)

| Kommando | Resultat | Anteckning |
|----------|----------|------------|
| `npm run smoke:locked-ux` | **PASS** | Inkl. `smoke:obsidian-depth`, `smoke:basta-dock-lock`, `smoke:chrome-header`, `smoke:auth-login` |
| `npm run smoke:design-modules` | **PASS** | Inkl. `smoke:chrome-header`, `smoke:executive-home-visual` (statisk del) |

### Under-smoke (locked-ux)

- `smoke:obsidian-depth` — låst 3D-skala, theme pack, kanonbilder
- `smoke:basta-dock-lock` — crown header (Resurser vänster), dock v2, hem v2-paritet
- `smoke:chrome-header` — SOS i main, executive premium header + dock (C2)
- `smoke:auth-login` — AUTH-G1 Google web login låst

### Under-smoke (design-modules)

- Modulväljare rollout (Hem/MåBra/Ekonomi/Valv/Projekt)
- Adaptiv Hemkompass + material pack
- Module help (?-widget) registry
- Shared module shell (`ModuleShell`, `hub-view-lock--fit`)
- Fas 19.3 zone hub tokens (inga `#050b14` i zon-CSS)
- Fas 22 hex→tokens P0 + Fas 24 hex→tokens P2 (Barnporten, Dossier, VitHub)

### Delvis verifierat

| Check | Resultat |
|-------|----------|
| `smoke:executive-home-visual` Playwright-screenshot | **SKIP** — dev server ej tillgänglig på `http://127.0.0.1:5174` |
| `e2e/locked-ux-public.spec.ts` | **Ej körd** — kräver `npm run dev` + Playwright |
| Pontus visuell OK per zon | **Ej verifierad** — utanför statisk audit |

---

## 3. Findings per zon

Prioritet:

- **P0** — Låst UX borttagen/dold; säkerhets- eller routing-brott; smoke FAIL
- **P1** — Betydande avvikelse från DAD/Locked UX; risk för användarregression
- **P2** — Teknisk skuld, dokumentationsdrift, ofullständig verifiering

---

### Hjärtat (`/hjartat`, Dagbok, Speglar)

| ID | Prio | Finding | Evidens | Rekommendation |
|----|------|---------|---------|----------------|
| HJ-01 | — | **Inga P0/P1.** Dagbok + Speglar superhub intakt. | `DagbokPage.tsx`: `ModuleShell`, `lockViewport`, `fitViewport`, `SpeglarSuperModule`, `DagbokInputSuperModule`; `smoke:design-modules` PASS | — |
| HJ-02 | P2 | Forensic-läsning delegerad korrekt till `SpeglarSuperModule` + `DagbokSuperModule` (ingen direkt legacy-import). | `VaultForensicPanel.tsx` assertions i smoke | Behåll mönstret vid refaktor |
| HJ-03 | P2 | Module help (`dagbok`, `speglar`) wired i UI. | `moduleHelpRegistry.ts`, `SpeglingsSystem.tsx`, `DagbokRememberCard.tsx` | — |
| HJ-04 | P2 | E2E: `/hjartat?tab=bevis` → `/valvet` (ej publik bevis-flik) ej körd live. | `e2e/locked-ux-public.spec.ts` | Kör E2E vid nästa predeploy med dev-server |

**Zon-tokens:** `hjartat.css` använder `var(--zone-gradient-hjartat)` — Fas 19.3 compliant.

---

### Vardagen (`/vardagen`, MåBra, Planering, Ekonomi, Arbetsliv)

| ID | Prio | Finding | Evidens | Rekommendation |
|----|------|---------|---------|----------------|
| VD-01 | — | **Inga P0/P1.** LivLauncher + Planering hybrid låsta. | `LivLauncherPage.tsx` (`@locked MOD-VARD-LAUNCH`); `PlanningKanbanBoard` + status `todo/waiting/done`; `VardagenShellPage` raderad | — |
| VD-02 | P2 | `LivLauncherPage` saknar `ModuleHelpFromRegistry` (övriga superhubbar har det). | Jämförelse: `MabraInputSuperModule`, `EkonomiInputSuperModule` har help; shell har inte | Lägg till `hub_vardagen` i registry + shell (ej akut) |
| VD-03 | P2 | Token-namn `--bg-teal-deep` i `theme-tokens-core.css` är legacy (värde `#050505`, inte teal). | `theme-tokens-core.css` | Byt namn i separat token-våg (PMIR ej krävs) |
| VD-04 | P2 | `EconomyTidPanel` borttagen från overview (smoke kräver det). | `smoke_design_modules.mjs` mustNotInclude | Bekräftat avsiktligt — dokumentera i ekonomi-spec om ej redan |
| VD-05 | P2 | Drogfrihet embedded i Familjen (inte egen route) — korrekt per design-modules. | `FamiljenPage.tsx`, `RedirectDrogfrihetToFamiljen` | — |

**Zon-tokens:** `planering.css`, `mabra.css`, `vardagen.css` (shell) använder zone gradients — inga hårdkodade `#050b14` i `src/modules/**`.

**Module help:** `mabra`, `ekonomi`, `arbetsliv`, `hub_mabra`, `planering` i registry.

---

### Familjen (`/familjen`, Barnfokus, Barnporten, Trygg Hamn)

| ID | Prio | Finding | Evidens | Rekommendation |
|----|------|---------|---------|----------------|
| FM-01 | — | **Inga P0/P1.** Barnfokus + HITL-bro intakta. | `FamiljenBarnfokusDelegate.tsx`: `BARNFOKUS_QUESTIONS`, `Spara till`, `Minneslista`, `glow="green"`; `BarnportenInboxPanel` + `SaveAsEvidencePrompt` | — |
| FM-02 | P2 | `barnportenAgents.ts` ligger under `features/onboarding/barnporten/` — vissa äldre docs pekar på `modules/barnporten/`. | Smoke + kod vs `.context/locked-ux-features.md` §7 | Uppdatera doc-pekare (ingen funktionspåverkan) |
| FM-03 | P2 | Barnporten hex→tokens Fas 24 klar (CSS-variabler `--barnporten-*`). | `barnporten.css`, `smoke:design-modules` Fas 24 block | — |
| FM-04 | P2 | `FamiljenPage`: `lockViewport` + `fitViewport` + ingen nested `calm-scroll-island` — ADHD-säker scroll enligt smoke. | `smoke_locked_ux.mjs` assertions | Behåll vid layout-ändringar |
| FM-05 | P2 | E2E: Barnfokus ej exponerat utan login ej körd live. | `e2e/locked-ux-public.spec.ts` | Kör vid predeploy |

**Zon-tokens:** `familjen.css` → `var(--zone-gradient-familjen)`.

**Embedded hubs:** Hamn, Drogfrihet, Barnporten i `FamiljenPage` HubDropdownNav — locked UX smoke PASS.

---

### Valv (`/valvet`, Pansaret, Kunskapsbank, Aktörskarta)

| ID | Prio | Finding | Evidens | Rekommendation |
|----|------|---------|---------|----------------|
| VL-01 | — | **Inga P0/P1.** Zonarkitektur + låsta paneler intakta. | `ValvSuperModule` zoner; `ValvAnalyseraZone` → `VaultMonsterPanel` + `VaultOrkesterPanel`; `ValvKunskapZone` → Kunskapsbank + Aktörskarta + Kanon docs | — |
| VL-02 | P2 | `VaultPage` delegerar TabBar till zoner (inte monolit) — Fas 2 SuperModule-mönster hålls. | Negativa assertions i båda smoke-skript | — |
| VL-03 | P2 | Legacy `/kunskap` redirectar till `vaultTab=kunskapsbank` (PIN bakom Valv) — korrekt plausible deniability. | `AppRoutes.tsx` `RedirectToValvet` | — |
| VL-04 | P2 | Module help: `valv`, `valv_monster`, `valv_orkester` wired. | `ValvInputSuperModule`, paneler | — |
| VL-05 | P2 | E2E: Mönster-flik ej synlig utan login ej körd live. | `e2e/locked-ux-public.spec.ts` | Kör vid predeploy |

**Zon-tokens:** `valv.css` → `var(--zone-gradient-valv)`.

**Backend-paritet:** `addEntityProfile`, `vaultSessionGate`, WebAuthn callables exporterade i `functions/src/index.ts` — smoke PASS.

---

## 4. Executive Midnight / Chrome (tvärzon)

| ID | Prio | Finding | Evidens | Rekommendation |
|----|------|---------|---------|----------------|
| EM-01 | — | **Prod hem = Bästa Design** (`BastaDesignHome` i `HomePage.tsx`). Executive dashboard finns parallellt för theme lab / ME-midnight-executive. | `HomePage.tsx`, `themePackBastaDesign.ts`, `smoke:basta-dock-lock` | Avsiktligt per `BASTA-DESIGN-CHROME-LOCK.md` |
| EM-02 | — | Header panel style default `ember`; dock `data-panel-style={panelStyle}`. | `headerPanelStyle.ts`, `FloatingDock.tsx`, `CHROME-EMBER-KANON.md` | — |
| EM-03 | P2 | `smoke:executive-home-visual` kunde inte ta screenshot — `executive-home-capture-latest.png` saknas/uppdaterades ej. | Smoke-logg 2026-07-13 | Starta `npm run dev` + kör smoke före visuell release |
| EM-04 | P2 | Död CSS: `module-hub-tile--indigo/lavender/emerald` i `coreLayoutChrome.css` (inga TSX-referenser). Palettdrift mot DAD (guld/neutral). | Grep: endast CSS-definitioner | Rensa i token-våg eller dokumentera som Theme Lab-arv |
| EM-05 | P2 | `design-freeport.css` innehåller legacy hex (`#050b14` m.fl.) — isolerat till `/dev/design-freeport`. | `AppRoutes.tsx` dev-route | Acceptabelt sandbox; ej prod |
| EM-06 | — | Drawer aktiv rad använder `--accent` / `--accent-light` (guld) via tokens — inte teal. | `nav-drawer-shell.css`, `NavigationDrawer.tsx` | MENU-DRAWER-KANON compliant |
| EM-07 | — | Inga legacy-shim-imports i produktions-`src/**` (utom tillåtna index-shims). | `smoke_locked_ux.mjs` walkSrc | — |
| EM-08 | — | `useShakeToKill` borttagen; `clearDeviceSession` kvar i Inställningar. | Smoke assertions | — |

---

## 5. Locked UX-register — spot check

| Låst flöde | Register § | Kodstatus | Smoke |
|------------|------------|-----------|-------|
| Barnfokus-frågor | §1 | OK | locked-ux |
| Mönster + Orkester | §2 | OK | locked-ux + design-modules |
| Kunskapsbank bakom PIN | §2 | OK | `/kunskap` → Valv |
| Aktörskarta G9 | §2 | OK | locked-ux |
| Planering P3 Kanban | §3–4 | OK | design-modules |
| Fyren / tyst inspelning | §5 | OK | locked-ux |
| Drawer Vardag + Valv | §6 | OK | locked-ux |
| Barnporten + HITL §7b | §7 | OK | locked-ux |
| Bästa Design dock/header | locked-ux § | OK | basta-dock-lock |
| Diskret näringsintag | §20 | OK | locked-ux |

---

## 6. Verdict

| Gate | Status |
|------|--------|
| Locked UX struktur (statisk) | **GO** |
| Design modules / zone tokens | **GO** |
| Executive Midnight chrome (statisk) | **GO** |
| Visuell regression (screenshot E2E) | **DELVIS** — P2 uppföljning |
| Pontus visuell sign-off | **Ej utförd** i denna audit |

**Sammanfattning per zon:**

| Zon | P0 | P1 | P2 |
|-----|----|----|-----|
| Hjärtat | 0 | 0 | 4 |
| Vardagen | 0 | 0 | 5 |
| Familjen | 0 | 0 | 5 |
| Valv | 0 | 0 | 5 |
| Tvärzon (EM) | 0 | 0 | 3 |

**Inga kodändringar gjorda i denna audit.**

---

## 7. Rekommenderat nästa steg (ett i taget)

1. Starta dev-server (`npm run dev`) och kör `npm run smoke:executive-home-visual` för att fånga `executive-home-capture-latest.png`.
2. Vid predeploy: kör `npx playwright test e2e/locked-ux-public.spec.ts` (publikt läge, login-wall).
3. (Valfritt P2) Lägg `ModuleHelpFromRegistry` på `LivLauncherPage` + registry-nyckel `hub_vardagen`.

---

## 8. Referenser

- `.cursor/rules/locked-ux-features.mdc`
- `.context/locked-ux-features.md`
- `.cursor/rules/design-calm.mdc` (DAD v1.0 Executive Midnight)
- `docs/design/BASTA-DESIGN-CHROME-LOCK.md`
- `docs/design/references/MENU-DRAWER-KANON.md`
- `scripts/smoke_locked_ux.mjs`
- `scripts/smoke_design_modules.mjs`
- `e2e/locked-ux-public.spec.ts`

---

*Read-only audit — specialist-ux-guardian — Cursor Agent 2026-07-13*
