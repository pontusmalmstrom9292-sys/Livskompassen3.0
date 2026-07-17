# Fas 19 Sprint Autorun — reglerad YOLO (19.1–19.6)

**Syfte:** En våg i taget enligt godkänd [`2026-06-15-fas19-masterplan-v2.md`](./evaluations/2026-06-15-fas19-masterplan-v2.md). Ersätter **inte** historisk Master YOLO — kör **inte** `master:yolo --reset`.

**State:** [`.orkester/fas19-state.json`](../.orkester/fas19-state.json) (lokal, gitignored)  
**Logg:** `docs/evaluations/YYYY-MM-DD-fas19-vag-<id>.md`  
**Slutrapport:** `docs/evaluations/YYYY-MM-DD-fas19-leverans.md`  
**Regel:** [`.cursor/rules/fas19-masterplan-guard.mdc`](../.cursor/rules/fas19-masterplan-guard.mdc)

---

## Begränsning

| Mekanism | Utan dig? |
|----------|-----------|
| `npm run orkester:night` | **Ja** |
| Agent-vågar (YOLO) | **Ja** om Agent-chatt öppen + YOLO |
| Firebase MCP (dev) | **Ja** — deploy-status, loggar, rules **efter** smoke |
| `firebase deploy` | **Ja** om policy tillåter; annars logga blocker |
| App Check Console **Enforce** | **Nej** — manuell Firebase Console |
| PMIR: `firestore.rules` / Sacred | **Nej** — SKIP + blocker.md |

---

## Kanon (@-lista — läs före varje våg)

| Fil | Varför |
|-----|--------|
| [`docs/FAS19-SPRINT-AUTORUN.md`](./FAS19-SPRINT-AUTORUN.md) | Denna fil — scope, smoke, deploy |
| [`docs/evaluations/2026-06-15-fas19-masterplan-v2.md`](./evaluations/2026-06-15-fas19-masterplan-v2.md) | Godkänd vågplan |
| [`.context/security.md`](../.context/security.md) | Sacred, WORM, silos |
| [`.context/locked-ux-features.md`](../.context/locked-ux-features.md) | Låsta flöden |
| [`.cursor/rules/fas19-masterplan-guard.mdc`](../.cursor/rules/fas19-masterplan-guard.mdc) | Gate + PMIR |
| [`.cursor/rules/grunder-kanon.mdc`](../.cursor/rules/grunder-kanon.mdc) | U1–U6 |
| [`docs/DEPLOY.md`](./DEPLOY.md) | Named deploy only |

**Våg 19.1 extra:** [`docs/evaluations/2026-06-15-backend-djupanalys.md`](./evaluations/2026-06-15-backend-djupanalys.md) · [`docs/evaluations/2026-06-15-fas14b-appcheck-enforce.md`](./evaluations/2026-06-15-fas14b-appcheck-enforce.md)

**Våg 19.2 extra:** [`docs/specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md`](./specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md) · M3.0-B hybrid-8 eval

**Våg 19.5 extra:** [`.cursor/rules/infinite-evolution.mdc`](../.cursor/rules/infinite-evolution.mdc) · [`docs/architecture/INFINITE_EVOLUTION.md`](./architecture/INFINITE_EVOLUTION.md)

---

## Säkerhetsblock (MUST i varje superprompt)

```
SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections (reality_vault, children_logs, journal, dossier_snapshots, evolution_ledger)
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout; vault session idle enligt kanon
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules eller storage.rules utan explicit OK från Pontus
- PMIR-stopp: Barnporten kanon-UI, Gmail OAuth, Genkit V1, mass-radering
- Ingen force-push
- Deploy: endast named functions enligt vågtabell — aldrig firebase deploy --only functions utan lista
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän vågen PASS eller blocker dokumenterad.
```

---

## Vågkö

| # | ID | Scope | Plan / källa | Smoke-extra | Deploy |
|---|-----|-------|--------------|-------------|--------|
| 0 | `baseline` | `npm run orkester:night` före första kodvåg | [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) | — | none |
| 1 | `19.1` | Doc-synk · `unlockVault` P0 · App Check guards · LEG-VAULT read-fix | [`backend-djupanalys`](./evaluations/2026-06-15-backend-djupanalys.md) · masterplan §19.1 | `smoke:valv-security`, `smoke:inkast`, `smoke:locked-ux` | `functions:unlockVault` + `hosting` om client |
| 2 | `19.2` | M3.0-B hybrid-8 pelarkort | masterplan §19.2 · MåBra SPEC | `smoke:mabra`, `smoke:design-modules`, `smoke:modulvaljare` | `hosting` |
| 3 | `19.3` | Hex→tokens P0 + typecheck expansion | masterplan §19.3 · COLOR-POLICY | `typecheck:core-strict`, `smoke:design-modules` | `hosting` |
| 4 | `19.4` | JOY-17 prod-wire + mabraCoach bank-synk | masterplan §19.4 · INNEHALL-REGISTER | `smoke:innehall`, `smoke:mabra` | `functions:mabraCoach` + `hosting` om UI |
| 5 | `19.5` | evolution_ledger dual-write | masterplan §19.5 · INFINITE_EVOLUTION | `smoke:evolution-discovery` | named functions enligt kodändring |
| 6 | `19.6` | Arkiv-batch PMIR (docs only — ingen mass-radering utan OK) | masterplan §19.6 · fas19-masterplan-guard | `orkester:night` | none |

### Våg 19.1 — detaljerad scope

1. **Doc-synk:** Uppdatera [`docs/SYSTEM_PLAN_v2.md`](./SYSTEM_PLAN_v2.md) / [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md) om Fas 19-status ändras.
2. **`unlockVault` P0:** JWT/session-alignment (`unlockVault.ts`, `vaultSessionGate.ts`, client `vaultWriteUnlock.ts`); inga nya mock-gates.
3. **App Check guards:** Säkerställ `guardSensitiveCallableV2` på kvarvarande luckor **utan** Console Enforce utan Pontus OK — dokumentera i våg-logg.
4. **LEG-VAULT read-fix:** Legacy `/valv`, `/dagbok` redirects och läsbehörighet enligt [`repo-inventory`](./evaluations/2026-06-15-fas19-repo-inventory.md) — **behåll** LEG-VAULT, fixa läs-desync om smoke FAIL.

**Defer i 19.1:** Full App Check Console Enforce · `firestore.rules`-ändringar · Gmail.

---

## PMIR-stopp (SKIP — logga, fortsätt kön)

- Ändringar i `firestore.rules` / `storage.rules`
- Barnporten kanon-UI (tvåkorts inkorg)
- Gmail OAuth / Google Calendar
- Genkit V1 / Dotprompt-migrering
- Mass-radering utan arkiv-först PMIR + Pontus OK
- Sacred Features / locked UX borttagning

**Vid SKIP:** `docs/evaluations/YYYY-MM-DD-blocker-fas19-<waveId>.md` + uppdatera `fas19-state.json` → `skippedWaves`.

---

## Standard smoke (efter kod per våg)

```bash
npm run build
cd functions && npm run build && cd ..
npm run smoke:locked-ux && npm run smoke:orkester
```

Lägg till **smoke-extra** från vågtabellen.

---

## Start (terminal)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
export FAS19_AUTORUN=1 ORKESTER_AUTORUN=1
npm run fas19:autorun
npm run orkester:night
```

---

## Startprompt (full kö / första gången)

```
FAS 19 SPRINT AUTORUN — reglerad YOLO. Läs docs/FAS19-SPRINT-AUTORUN.md och .orkester/fas19-state.json.
Fortsätt nextWaveId tills status done. Per våg: läs kanon @-lista → implementera ENDAST scope → standard smoke + smoke-extra → vid PASS: skriv docs/evaluations/YYYY-MM-DD-fas19-vag-<id>.md → uppdatera fas19-state.json.
Vid deploy: named functions enligt tabell. PMIR-stopp: SKIP + blocker-fas19-*.md.
Max 3 försök samma våg, sedan logga failure och stoppa.
[SÄKERHETSBLOCK — klistra från docs/FAS19-SPRINT-AUTORUN.md]
```

---

## Per-våg Agent-prompt (mall)

```
FAS 19 SPRINT — våg <waveId>. Läs docs/FAS19-SPRINT-AUTORUN.md och .orkester/fas19-state.json.
Implementera ENDAST scope för våg <waveId> enligt masterplan v2. PMIR-stopp enligt FAS19.
Efter kod: standard smoke + smoke-extra. Vid PASS: uppdatera fas19-state.json och skriv docs/evaluations/YYYY-MM-DD-fas19-vag-<waveId>.md.
Vid deploy: endast named functions enligt tabell.
[SÄKERHETSBLOCK]
```

### Våg 19.1 — färdig prompt (ny chatt, YOLO på)

```
FAS 19 SPRINT — våg 19.1. Läs docs/FAS19-SPRINT-AUTORUN.md (§ Våg 19.1) och .orkester/fas19-state.json.
Implementera ENDAST: doc-synk · unlockVault P0 · App Check guards (kod) · LEG-VAULT read-fix.
Plan: docs/evaluations/2026-06-15-backend-djupanalys.md · docs/evaluations/2026-06-15-fas19-masterplan-v2.md.
Efter kod: npm run build && cd functions && npm run build && cd .. && npm run smoke:locked-ux && npm run smoke:orkester && npm run smoke:valv-security && npm run smoke:inkast.
Vid PASS: skriv docs/evaluations/2026-06-17-fas19-vag-19.1.md och uppdatera .orkester/fas19-state.json.
Deploy vid PASS: firebase deploy --only functions:unlockVault,hosting (endast om kod ändrats).
PMIR: ändra INTE firestore.rules; App Check Console Enforce = dokumentera manuellt steg för Pontus.
SÄKERHET (icke förhandlingsbart):
- WORM · tre silos · Zero Footprint · prompts endast sharedRules.ts · Locked UX · ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän vågen PASS eller blocker dokumenterad.
```

---

## Handoff (ny chatt)

1. Läs `.orkester/fas19-state.json` — `nextWaveId`, `completedWaves`, `failures`, `skippedWaves`
2. Senaste `docs/evaluations/*-fas19-vag-*.md`
3. Relevant `docs/evaluations/*-blocker-fas19-*.md` om SKIP-våg
4. Kör **en** våg — inte om hela kön om `status: done`

---

## Git + deploy (efter PASS)

```bash
git add -A
git commit -m "fas19: <waveId> — <kort varför>"
git pull --ff-only origin main
git push origin main
firebase use gen-lang-client-0481875058
```

Deploy enligt vågtabell. Fråga Pontus: *"Ska jag köra deploy nu?"* om prod påverkas och inte redan godkänt.

---

## Utanför kön (defer)

- Genkit V1 / Flow via MCP i prod
- Gmail / Calendar OAuth
- Barnporten push (BP-PUSH)
- M3.0-C Fitness/Näring
- Master YOLO `--reset`

---

## Relaterat

- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal nattpass + Firebase MCP dev
- [`FAS13-SPRINT-AUTORUN.md`](./FAS13-SPRINT-AUTORUN.md) — mall (done)
- [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md) — historisk kö (done)
- [`.cursor/agents/orkester-conductor.md`](../.cursor/agents/orkester-conductor.md)
