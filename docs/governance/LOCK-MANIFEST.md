# LOCK-MANIFEST — Copy-paste för alla agenter

**Version:** 1.17 · **Senast:** 2026-07-14 (YOLO v41 B41-build)  
**Register:** `.context/module-lock-register.json` · **Locked UX:** `.context/locked-ux-features.md`

---

## PMIR-STOPP (vänta explicit Pontus OK)

| Resurs | Varför |
|--------|--------|
| `firestore.rules` | WORM, silos, auth |
| `storage.rules` | Upload, journal_memories |
| `functions/src/sharedRules.ts` | Runtime-prompter |
| `src/modules/core/routing/AppRoutes.tsx` | MOD-CORE-NAV |
| `NavigationDrawer.tsx` struktur | MOD-CORE-NAV |
| Barnporten kanon-UI | MOD-FAM-BPORT |
| Sacred Features borttagning | Verklighetsvalvet, Zero Footprint, … |
| Mass-radering | Dataförlust |
| Live Kunskap-ingest (`--apply`) | Prod data |
| Deploy rules/functions | Prod säkerhet |
| Hosting deploy | Endast efter separat **"OK deploy"** |

---

## 22 modul-ID (MOD-XXX)

| ID | Zon | Status |
|----|-----|--------|
| MOD-CORE-NAV | Core | locked |
| MOD-CORE-CHROME | Core | locked |
| MOD-HJ-DAGBOK | Hjärtat | locked |
| MOD-HJ-INPUT | Hjärtat | locked |
| MOD-HJ-SPEGLAR | Hjärtat | locked |
| MOD-VALV-HUB | Valv | locked |
| MOD-VALV-INKAST | Valv | locked |
| MOD-VALV-ORKESTER | Valv | locked |
| MOD-VARD-LAUNCH | Vardagen | locked |
| MOD-VARD-MABRA | Vardagen | locked |
| MOD-VARD-PLAN | Vardagen | locked |
| MOD-VARD-EKO | Vardagen | locked |
| MOD-VARD-ARB | Vardagen | locked |
| MOD-FAM-HUB | Familjen | locked |
| MOD-FAM-BARN | Familjen | locked |
| MOD-FAM-HAMN | Familjen | locked |
| MOD-FAM-BPORT | Familjen | locked |
| MOD-FAM-DROG | Familjen | locked |
| MOD-BACK-SYN | Backend | locked |
| MOD-BACK-DCAP | Backend | locked |
| MOD-BACK-WORM | Backend | locked |
| MOD-WIDGET | Cross | locked |

---


## § entryFiles-register (P115 sync)

Speglar `.context/module-lock-register.json` — verifiera med `npm run smoke:module-lock`.

| ID | entryFiles |
|----|------------|
| MOD-CORE-NAV | `AppRoutes.tsx` |
| MOD-CORE-CHROME | `FloatingDock.tsx` |
| MOD-HJ-DAGBOK | `DagbokPage.tsx` |
| MOD-HJ-INPUT | `DagbokInputSuperModule.tsx` |
| MOD-HJ-SPEGLAR | `SpeglarSuperModule.tsx` |
| MOD-VALV-HUB | `VaultPage.tsx` |
| MOD-VALV-INKAST | `InkastDirectPanel.tsx` |
| MOD-VALV-ORKESTER | `VaultOrkesterPanel.tsx` |
| MOD-VARD-LAUNCH | `LivLauncherPage.tsx` |
| MOD-VARD-MABRA | `MabraHubView.tsx` |
| MOD-VARD-PLAN | `PlaneringPage.tsx` |
| MOD-VARD-EKO | `EkonomiInputSuperModule.tsx` |
| MOD-VARD-ARB | `ArbetslivHubPage.tsx` |
| MOD-FAM-HUB | `FamiljenPage.tsx` |
| MOD-FAM-BARN | `FamiljenBarnfokusDelegate.tsx` |
| MOD-FAM-HAMN | `BiffPublicPanel.tsx` |
| MOD-FAM-BPORT | `barnportenRollout.ts` |
| MOD-FAM-DROG | `DrogfrihetHubPage.tsx` |
| MOD-BACK-SYN | `synapseBus.ts` |
| MOD-BACK-DCAP | `dcapEscalation.ts` |
| MOD-BACK-WORM | `wormHashChain.ts` |
| MOD-WIDGET | `FyrenShortcutMicIcon.tsx`, `WidgetRecordPage.tsx`, `WidgetModulerPage.tsx` |

---

## Obligatoriska smokes

### Varje merge
```bash
npm run smoke:predeploy:build
```

### Efter kod i locked zon
```bash
npm run smoke:locked-ux && npm run smoke:design-modules && npm run smoke:governance
```

### Module-lock diff
```bash
npm run smoke:module-lock
```

### Governance docs
```bash
npm run smoke:governance
```

### Integration sync (nattpass / extern AI)
```bash
npm run integration:preflight
```

---

## Unlock-procedur (locked modul)

1. **STOPP** om `status: locked` i register
2. Skapa `docs/evaluations/YYYY-MM-DD-unlock-MOD-XXX.md` med `approved: yes` + Pontus OK
3. Sätt modul till `developing` i register
4. Gör ändringen (minimal diff)
5. Kör modulens smoke
6. Re-lock: `node scripts/lock_module.mjs MOD-XXX --smoke <smoke>`

---

## § CI — pre-push och GitHub

| Gate | Var | Vad |
|------|-----|-----|
| **pre-push** | `.husky/pre-push` | `npm run validate:session` (smoke:predeploy + typecheck + e2e tokens) |
| **PR smoke** | `.github/workflows/pr-smoke-gate.yml` | `npm run smoke:predeploy` |
| **main deploy** | `.github/workflows/firebase-hosting-main.yml` | `npm run smoke:predeploy` före hosting |

**Agent:** Kör aldrig `git push --no-verify` utan Pontus OK. Fixa felet först.

---

## Vad agenter ALDRIG får göra

- Ta bort funktion, route eller Sacred Feature
- Refaktorera locked modul utan unlock-doc
- Ändra `firestore.rules` / `storage.rules` / `sharedRules.ts` utan PMIR
- Flytta kompass, dock eller drawer-struktur (DAD låst)
- `seed_kampspar --apply` eller live ingest utan Pontus KEEP
- `firebase deploy` (hosting/rules/functions) utan smoke PASS + YOLO GO + Pontus OK
- Nya npm-dependencies utan godkännande
- "Städa upp" fungerande kod utan smoke-fail som bevis

---

---

## § Auto-lock (YOLO v8)

Efter varje avslutad feature-våg ska agenten låsa berörd modul enligt [AUTO-LOCK-PLAYBOOK.md](./AUTO-LOCK-PLAYBOOK.md).

| Steg | Åtgärd |
|------|--------|
| 1 | Identifiera `MOD-XXX` i `.context/module-lock-register.json` |
| 2 | Additiv `@locked MOD-XXX` i `entryFiles` |
| 3 | Kör modulens smoke |
| 4 | `node scripts/lock_module.mjs MOD-XXX --smoke <smoke>` |
| 5 | Trippel-gate: `smoke:locked-ux` + `smoke:design-modules` + `smoke:governance` |
| 6 | Eval-rad i `docs/evaluations/YYYY-MM-DD-cursor-yolo-v8-log.md` |

**Regel:** `.cursor/rules/auto-lock-on-complete.mdc`  
**Aldrig** ta bort `@locked` eller sänka status utan unlock-doc `approved: yes`.




## § Agent-fortifikation v4 (YOLO v11 P70)

*Fortsätter v3 (v9 P50) — inget tas bort.*

### YOLO v11 orchestrering

```bash
npm run cursor:yolo:v11 -- status
```

Kö: `.orkester/cursor-yolo-queue-v11.json` · State: `.orkester/cursor-yolo-state-v11.json` · Master: `docs/cursor-pipeline/yolo-v11/MASTER-SEQUENTIAL.md`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v11-log.md`
### Auto-handoff (YOLO v11+)

När en våg är klar (alla tasks done/skip):

```bash
npm run cursor:yolo:v11 -- handoff   # skriver .cursor/pipeline/yolo-v12/START-PROMPT.md
```

Öppna **ny Agent-chatt**, klistra in prompten. Upprepa tills produktvåg klar (Fas 24 P0 G85 7d).


## § Agent-fortifikation v3 (YOLO v9 P50)

*Fortsätter v2 (v8 P41) — inget tas bort.*

## § Agent-fortifikation v2 (YOLO v8 P41)

### Auto-lock checklista (MUST efter feature-våg)

1. Identifiera `MOD-XXX` i register
2. Additiv `@locked MOD-XXX` i entryFile
3. Kör modul-smoke
4. `node scripts/lock_module.mjs MOD-XXX --smoke <smoke>`
5. Trippel-gate: locked-ux + design-modules + governance
6. Eval-rad i `docs/evaluations/YYYY-MM-DD-cursor-yolo-v8-log.md`

### Vad agenter ALDRIG får göra (utökad v8)

- Hoppa auto-lock efter avslutad feature-våg
- Låsa modul utan smoke PASS
- Ta bort `@locked` utan unlock-doc `approved: yes` (ej `**approved:**` — smoke regex kräver plain `approved: yes`)
- `--skip-smoke` på lock_module utan eval-motivering

### YOLO v8 orchestrering

```bash
npm run cursor:yolo:v8 -- status
```

Kö: `.orkester/cursor-yolo-queue-v8.json` · State: `.orkester/cursor-yolo-state-v8.json`


## Snabbreferens

- YOLO kö v12: `npm run cursor:yolo:v12 -- status` · v11: `npm run cursor:yolo:v11 -- status` · v10: `npm run cursor:yolo:v10 -- status` · v9: `npm run cursor:yolo:v9 -- status` · v8: `npm run cursor:yolo:v8 -- status` · v7: `npm run cursor:yolo:v7 -- status`
- Kanon: `.cursor/index.mdc` · `docs/AI-GOVERNANCE.md`
- Auto-lock: [AUTO-LOCK-PLAYBOOK.md](./AUTO-LOCK-PLAYBOOK.md) · `.cursor/rules/auto-lock-on-complete.mdc`
- Eval-logg v8: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v8-log.md`

## § Agent-fortifikation v5 (YOLO v15 P110)

*Fortsätter v4 (v11 P70) — inget tas bort.*

### YOLO v15 orchestrering

```bash
npm run cursor:yolo:v15 -- status
```

Kö: `.orkester/cursor-yolo-queue-v15.json` · State: `.orkester/cursor-yolo-state-v15.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v15-log.md`

### MOD-WIDGET v3 entryFile (P105)

`WidgetModulerPage.tsx` tillagd som entryFile efter standalone v3 (`/widget/moduler`).

## § Agent-fortifikation v6 (YOLO v16 P120)

*Fortsätter v5 (v15 P110) — inget tas bort.*

### YOLO v16 orchestrering

```bash
npm run cursor:yolo:v16 -- status
```

Kö: `.orkester/cursor-yolo-queue-v16.json` · State: `.orkester/cursor-yolo-state-v16.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v16-log.md`

### MOD-WIDGET v3 hygiene (P115)

- `WidgetModulerPage.tsx` entryFile (route `/widget/moduler`)
- `@locked MOD-WIDGET` på `WidgetModulerBoard.tsx` + `WidgetModulerAddForm.tsx`
- Register `unlockDoc`: `2026-07-14-unlock-MOD-WIDGET-standalone-v3.md`

## § Agent-fortifikation v7 (YOLO v17 P125)

*Fortsätter v6 (v16 P120) — inget tas bort.*

### YOLO v17 orchestrering

```bash
npm run cursor:yolo:v17 -- status
```

Kö: `.orkester/cursor-yolo-queue-v17.json` · State: `.orkester/cursor-yolo-state-v17.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v17-log.md`

### Auto-lock hygiene verify (P125)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (additiv)

### Agent-fortifikation verify (P130)

- `npm run cursor:yolo:v17` + `npm run sdk:yolo:v17` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v17+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v17.md`

## § Agent-fortifikation v8 (YOLO v18 P135)

*Fortsätter v7 (v17 P125) — inget tas bort.*

### YOLO v18 orchestrering

```bash
npm run cursor:yolo:v18 -- status
```

Kö: `.orkester/cursor-yolo-queue-v18.json` · State: `.orkester/cursor-yolo-state-v18.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v18-log.md`

### Auto-lock hygiene verify (P135)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (v16/v17 carry-forward)


### Agent-fortifikation verify (P140)

- `npm run cursor:yolo:v18` + `npm run sdk:yolo:v18` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v18+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v18.md`

## § Agent-fortifikation v9 (YOLO v19 P145)

*Fortsätter v8 (v18 P135) — inget tas bort.*

### YOLO v19 orchestrering

```bash
npm run cursor:yolo:v19 -- status
```

Kö: `.orkester/cursor-yolo-queue-v19.json` · State: `.orkester/cursor-yolo-state-v19.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v19-log.md`

### Auto-lock hygiene verify (P145)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (v16/v17/v18 carry-forward)

### Agent-fortifikation verify (P150)

- `npm run cursor:yolo:v19` + `npm run sdk:yolo:v19` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v19+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v19.md`

## § Agent-fortifikation v10 (YOLO v20 P155)

*Fortsätter v9 (v19 P145) — inget tas bort.*

### YOLO v20 orchestrering

```bash
npm run cursor:yolo:v20 -- status
```

Kö: `.orkester/cursor-yolo-queue-v20.json` · State: `.orkester/cursor-yolo-state-v20.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v20-log.md`

### Auto-lock hygiene verify (P155)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (v16/v17/v18/v19 carry-forward)


### Agent-fortifikation verify (P160)

- `npm run cursor:yolo:v20` + `npm run sdk:yolo:v20` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v20+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v20.md`

## § Agent-fortifikation v11 (YOLO v21 P165)

*Fortsätter v10 (v20 P155) — inget tas bort.*

### YOLO v21 orchestrering

```bash
npm run cursor:yolo:v21 -- status
```

Kö: `.orkester/cursor-yolo-queue-v21.json` · State: `.orkester/cursor-yolo-state-v21.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v21-log.md`

### Auto-lock hygiene verify (P165)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (v16–v20 carry-forward)
### Agent-fortifikation verify (P170)

- `npm run cursor:yolo:v21` + `npm run sdk:yolo:v21` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v21+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v21.md`

## § Agent-fortifikation v12 (YOLO v22 P175)

*Fortsätter v11 (v21 P165) — inget tas bort.*

### YOLO v22 orchestrering

```bash
npm run cursor:yolo:v22 -- status
```

Kö: `.orkester/cursor-yolo-queue-v22.json` · State: `.orkester/cursor-yolo-state-v22.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v22-log.md`

### Auto-lock hygiene verify (P175)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (v16–v21 carry-forward)


### Agent-fortifikation verify (P180)

- `npm run cursor:yolo:v22` + `npm run sdk:yolo:v22` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v22+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v22.md`

## § Agent-fortifikation v13 (YOLO v23 P185)

*Fortsätter v12 (v22 P175) — inget tas bort.*

### YOLO v23 orchestrering

```bash
npm run cursor:yolo:v23 -- status
```

Kö: `.orkester/cursor-yolo-queue-v23.json` · State: `.orkester/cursor-yolo-state-v23.json`

Eval-logg: `docs/evaluations/YYYY-MM-DD-cursor-yolo-v23-log.md`

### Auto-lock hygiene verify (P185)

- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- `smoke:module-lock` PASS
- MOD-WIDGET: 3 entryFiles + `@locked` på Board/AddForm (v16–v22 carry-forward)

### Agent-fortifikation verify (P190)

- `npm run cursor:yolo:v23` + `npm run sdk:yolo:v23` i package.json
- `scripts/cursor_yolo.mjs` → `getYoloConfig` för v23+ (mkFortificationConfig)
- `smoke:governance` + `smoke:mdc` PASS
- Eval: `docs/evaluations/2026-07-14-agent-fortification-v23.md`

## § YOLO v41 GOVERNANCE sync (B41-build)

*Fortsätter v13 (v23 P190) — inget tas bort.*

### Build marathon v41

```bash
CURSOR_YOLO_VERSION=41 node scripts/cursor_yolo.mjs status
```

Kö: `.orkester/cursor-yolo-queue-v41.json` · State: `.orkester/cursor-yolo-state-v41.json`

Eval: `docs/evaluations/2026-07-14-governance-v41.md`

### Governance sync verify (B41-build)

- PROJECT_STATE, TODO, LOCK-MANIFEST synkade mot register
- Register ↔ LOCK-MANIFEST entryFiles-tabell i sync (22 moduler, 24 entryFiles)
- Alla entryFiles på disk med `@locked` / `@locked-ux` / `PROTECTED CORE`
- `smoke:governance` + `smoke:module-lock` + `smoke:mdc` PASS
- Handoff från v40 INTEGRATION GO — ingen produktionskod ändrad
