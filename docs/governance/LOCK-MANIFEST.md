# LOCK-MANIFEST — Copy-paste för alla agenter

**Version:** 1.6 · **Senast:** 2026-07-13 (YOLO v12 P81)  
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
