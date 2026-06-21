# YOLO polish + deploy-gate — 2026-06-21

**Plattform:** Cursor Agent (YOLO)  
**Scope:** Baseline smoke, Figma Code Connect repo, auth UX, Valvet shell, deploy-readiness  
**Status:** **GO** (hosting-only) — väntar Pontus OK

---

## Smoke

| Gate | Resultat |
|------|----------|
| `npm run smoke:predeploy:build` | **PASS** |
| `npm run smoke:design-modules` | **PASS** |
| `npm run figma:code-connect:parse` | **PASS** (4 mappings) |
| YOLO-vakt audit | **GO** (hosting-only) |

---

## Levererat i working tree (ej committat)

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
3. Hard refresh `Cmd+Shift+R`

---

## Nästa steg för Pontus

1. Svara **"commit"** om du vill att agent committar working tree
2. Svara **"deploy"** efter commit för hosting-deploy
