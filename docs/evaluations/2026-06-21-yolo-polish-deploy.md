# YOLO polish + deploy-gate — 2026-06-21

**Plattform:** Cursor Agent (YOLO-vakt)  
**Scope:** Baseline smoke, Figma Code Connect repo, auth UX, Valvet shell, **Familjen deploy-gate** (`src/modules/features/family`)  
**Status:** **DEPLOYED** (hosting-only) — smoke + deploy PASS 2026-06-21 (session 3)

---

## Smoke

| Gate | Resultat |
|------|----------|
| `npm run smoke:predeploy:build` | **PASS** (2026-06-21 session 2 — functions + vite build + tier1 + e2e) |
| `npm run typecheck:core-strict` | **PASS** |
| `npm run smoke:barn-epistemik` | **PASS** — våg 29 epistemik + bracket catalog |
| `npm run smoke:hamn` | **PASS** — Trygg Hamn BIFF wiring |
| `npm run smoke:locked-ux` | **PASS** — Barnfokus, Barnporten HITL, drawer Vardag+Valv |
| `npm run smoke:design-modules` | **PASS** |
| `npm run figma:code-connect:parse` | **PASS** (10 mappings — +HubDropdownNav, +CognitiveLoadStrip) |
| YOLO-vakt Familjen audit | **GO** (hosting-only) |

### Familjen silo-check (read-only)

| Check | Status | Bevis |
|-------|--------|-------|
| Tre silos — `childrenLogsQuery` only | **PASS** | `childrenLogsService.ts:18` |
| Barnporten HITL — ingen auto-promote | **PASS** | `SaveAsEvidencePrompt` + `WormSaveConfirmSheet` |
| Barnfokus locked delegate | **PASS** | `FamiljenBarnfokusDelegate.tsx` + smoke |
| Hamn deterministisk wire | **PASS** | `hamnTaktikWire.ts` — ingen cross-RAG |

---

## Levererat på main (committat)

| Område | Ändring |
|--------|---------|
| **Figma L0 + Code Connect** | `scripts/figma-l0-atoms/`, `src/figma/connect/*.figma.tsx`, `figma.config.json`, npm scripts |
| **Auth UX** | Redirect-timeout 8s, AuthProvider watchdog 12s, tydligare felmeddelanden |
| **Valvet shell** | `ValvetRoutePage` — HubErrorBoundary, ModuleShell desktop lock, canonical URL sync |
| **Obsidian Calm** | `obsidian-calm-2.css` — valvet-route tokens |
| **index.html** | Laddar-splash under auth-init |
| **Smoke** | `smoke_locked_ux.mjs` — Valvet route guard utökad |
| **G17 blur** | `useZeroFootprint.ts` — visibilitychange/pagehide → endVaultSession |
| **Cursor regel** | `.cursor/rules/yolo-polish-eval.mdc` |
| **Figma CC** | `HubDropdownNav`, `CognitiveLoadStrip` mappings |

---

## SKIP / öppet (ej blocker)

| Item | Varför |
|------|--------|
| **G17 Zero Footprint blur** | **done** — `useZeroFootprint` visibilitychange/pagehide · PMIR [`2026-06-21-pmir-g17-blur.md`](2026-06-21-pmir-g17-blur.md) |
| Figma Code Connect **publish** | Starter View seat — kräver Org Dev seat · parse **PASS** (10 mappings) |
| Kunskap våg 8 ingest | **done** — `seed:kunskap-facts` 10 nya + 189 skip (session 4) |
| Android native Google | `build:web` + `cap sync` + `smoke:android-platform` **PASS** — USER login Motorola G85 |
| `integration-night.launchd.err` | Committa inte |

---

## Deploy (PMIR)

**Tillåtet:** `firebase deploy --only hosting`  
**Ej tillåtet utan PMIR:** rules, functions, App Check Enforce

**Efter deploy — manuell smoke:**

| # | Kontroll | Static gate (agent) | USER (Pontus) |
|---|----------|---------------------|---------------|
| 1 | Google-inloggning (redirect/popup, 8s/12s) | `smoke:auth-login` **PASS** | **Krävs** — live redirect/popup |
| 2 | `/valvet` — PIN → Mönster, Orkester, Kunskapsbank | `smoke:locked-ux` **PASS** | **Krävs** — Fyren + PIN i prod |
| 3 | `/familjen?tab=reflektion` — Barnfokus optimistisk spar | `smoke:locked-ux` **PASS** | **Krävs** — Firestore-spar |
| 4 | `/familjen?tab=barnporten` — HITL, Granska i Valv | `smoke:locked-ux` **PASS** | **Krävs** — bekräftelseflöde |
| 5 | `/familjen?tab=hamn` — BIFF, ingen auto-Valv | `smoke:hamn` **PASS** | **Krävs** — wizard i prod |
| 6 | Hard refresh `Cmd+Shift+R` | Hosting 200 OK | **Krävs** — cache-bust |

**Agent post-plan (2026-06-21 session 4):** `smoke:locked-ux`, `smoke:hamn`, `smoke:barn-epistemik`, `smoke:auth-login` — **PASS**. Live hosting HTTP 200.

---

## Deploy-logg

| Tid | Kommando | Resultat |
|-----|----------|----------|
| 2026-06-21 session 3 | `npm run build` + `smoke:locked-ux` + `smoke:orkester` + `smoke:predeploy:build` | **PASS** |
| 2026-06-21 session 3 | `cd functions && npm run build` | **PASS** |
| 2026-06-21 session 3 | `firebase deploy --only hosting` | **PASS** — https://gen-lang-client-0481875058.web.app (287 filer) |
