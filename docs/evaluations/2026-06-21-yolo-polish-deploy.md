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
| `npm run figma:code-connect:parse` | **PASS** (4 mappings) |
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

---

## SKIP / öppet (ej blocker)

| Item | Varför |
|------|--------|
| **G17 Zero Footprint blur** | Ingen `visibilitychange` i `src/modules/core/` — idle (1 h) + logout täcks; blur-lås vid tab-byte **open** — se [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md) G17 |
| Figma Code Connect **publish** | Starter View seat — kräver Org Dev seat |
| Kunskap våg 8 ingest | Content bank partial (53 FACT) — separat content-pass |
| Android native Google | USER-test på Motorola G85 |
| `integration-night.launchd.err` | Committa inte |

---

## Deploy (PMIR)

**Tillåtet:** `firebase deploy --only hosting`  
**Ej tillåtet utan PMIR:** rules, functions, App Check Enforce

**Efter deploy — manuell smoke:**
1. Google-inloggning (redirect/popup)
2. `/valvet` — PIN → Mönster, Orkester, Kunskapsbank synliga
3. `/familjen?tab=reflektion` — Barnfokus spara (optimistisk feedback)
4. `/familjen?tab=barnporten` — HITL, **Granska i Valv** endast efter bekräftelse
5. `/familjen?tab=hamn` — BIFF-wizard, ingen auto-spar till Valv
6. Hard refresh `Cmd+Shift+R`

---

## Deploy-logg

| Tid | Kommando | Resultat |
|-----|----------|----------|
| 2026-06-21 session 3 | `npm run build` + `smoke:locked-ux` + `smoke:orkester` + `smoke:predeploy:build` | **PASS** |
| 2026-06-21 session 3 | `cd functions && npm run build` | **PASS** |
| 2026-06-21 session 3 | `firebase deploy --only hosting` | **PASS** — https://gen-lang-client-0481875058.web.app (287 filer) |
