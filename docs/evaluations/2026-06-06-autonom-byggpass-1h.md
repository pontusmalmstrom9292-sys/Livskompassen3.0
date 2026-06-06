# Autonom byggpass — 1 timme (2026-06-06)

**Mål:** Maximera leverans utan Pontus vid datorn. Agent kör smoke, docs, deploy. Du fixar ev. app-problem vid återkomst.

**Prod:** https://gen-lang-client-0481875058.web.app  
**Gren:** `main` (lokal hemkompass-polish ej pushad)

---

## Orkestrering (4 roller)

| Roll | Agent | Ansvar | Stop-villkor |
|------|-------|--------|--------------|
| **Dirigent** | Parent (Master Architect) | Plan, scope, PMIR-stopp, slutrapport | `firestore.rules`-ändring, Gmail OAuth, Barnporten kanon-UI |
| **Smoke** | `specialist-smoke-runner` | `orkester:night` → `smoke:rollout` → `smoke:compass` | FAIL efter 2 omkörningar → logga, fortsätt docs/deploy om build OK |
| **Guard** | `specialist-ux-guardian` | `smoke:locked-ux` + `smoke:design-modules` efter kod | FAIL → ingen deploy |
| **Ship** | Parent / shell | `npm run build` + `firebase deploy --only hosting` vid PASS | Deploy **utan** commit (lokal dirty OK) |

**Multitask:** Smoke + Guard kan köras parallellt efter build. Docs skrivs parallellt med smoke.

---

## Våg A — Baseline (0–15 min, ingen kod)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
npm run build
cd functions && npm run build && cd ..
npm run orkester:night
npm run smoke:rollout
npm run smoke:compass
```

**PASS-kriterium:** build + locked-ux + design-modules + orkester + rollout.

---

## Våg B — Hemkompass leverans (klart i kod, denna session)

| Item | Fil | Status |
|------|-----|--------|
| Paralys → `breakDownResponse` | `HomeAdaptiveCompass` + `ParalysPanel embedded` | **done** |
| Kväll KASAM + broar | `KasamEvening embedded` | **done** |
| Kompassråd | `KompassradPanel` | **done** |
| Fasväljare morgon/dag/kväll | `HomeAdaptiveCompass` | **done** |
| Preset snabbval | `home_snabbval` | **done** |
| Eval | `2026-06-06-hemkompass-polish-done.md` | agent |
| Smoke guards | `smoke_design_modules.mjs` | **done** |

---

## Våg C — Ship (15–25 min)

Vid Våg A PASS:

```bash
firebase use gen-lang-client-0481875058
firebase deploy --only hosting
```

**Ej autonomt utan dig:** `git commit` / `git push` (väntar explicit OK).

---

## Våg D — Post-YOLO öppet (25–60 min, valfritt om tid)

Prioritet enligt governance — **endast om smoke grön och scope smalt:**

| # | Spår | Varför | PMIR |
|---|------|--------|------|
| 1 | **Content våg 17** | Kurator-backlog — **ingen kod** | Kör `content:night` + rapport |
| 2 | **Planering kalender P2** | `/planering/kalender` — stor yta | SKIP utan dedikerad plan |
| 3 | **MaterialPack-editor** | Blocker lifeos-d | SKIP |
| 4 | **Barnporten CB2+** | Locked kanon-UI | SKIP |
| 5 | **Ekonomi budget-tab** | Om WIP finns i worktree | Endast om filer redan staged |

**Rekommendation denna timme:** Våg A–C + docs. Våg D = `content:night` only.

---

## PMIR — agent STOPPAR (loggar, fortsätter inte kod)

- `firestore.rules` / Sacred paths
- Fjärde RAG-silo / cross-RAG
- Barnporten kanon tvåkorts-UI
- Gmail / Calendar OAuth
- Commit/push utan explicit «godkänn»
- Full `firebase deploy --only functions`

---

## Vid återkomst (du, 5 min)

1. Hard refresh: Cmd+Shift+R på prod  
2. Hem `/` — testa Morgon/Dag/Kväll + Paralys ett steg  
3. Valfritt: [`2026-06-01-USER-nasta-steg.md`](./2026-06-01-USER-nasta-steg.md) #3/#4  
4. Om något FAIL: skriv till agent — ingen stress, autorun-logg finns  

**Rapportera:** `Hemkompass: PASS/FAIL` — agent uppdaterar `SMOKE_RESULTS.md`.

---

## State & logg

| Fil | Syfte |
|-----|--------|
| `.orkester/autonom-2026-06-06-state.json` | Fas + exit codes |
| Denna fil | Plan |
| `2026-06-06-autonom-byggpass-rapport.md` | Slutrapport (agent skriver efter körning) |

---

## Prompt för ny Cursor-chatt (handoff)

```
Autonom byggpass — fortsätt enligt docs/evaluations/2026-06-06-autonom-byggpass-1h.md.
Läs .orkester/autonom-2026-06-06-state.json. Kör Våg A om ej done, sedan deploy hosting vid PASS.
Ingen commit utan mitt OK. Bevara Locked UX och tre silos.
Jämför mot hela projektets kontext. Arbeta autonomt tills slutrapport eller hard PMIR.
```
