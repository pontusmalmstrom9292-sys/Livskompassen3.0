# YOLO-vakt — stående deploy-gate

**Kanon:** Obligatorisk read-only audit + automatiserad smoke **före varje prod-deploy**.  
**Agent:** [`.cursor/agents/yolo-vakt.md`](../.cursor/agents/yolo-vakt.md) · **Regel:** [`.cursor/rules/yolo-vakt-gate.mdc`](../.cursor/rules/yolo-vakt-gate.mdc)  
**Modell & YOLO-optimering:** [`docs/CURSOR-YOLO-MODEL-GUIDE.md`](./CURSOR-YOLO-MODEL-GUIDE.md) · [`.cursor/rules/model-routing.mdc`](../.cursor/rules/model-routing.mdc)

## Regel (MUST)

Ingen `firebase deploy` utan:

1. **YOLO GO** (read-only audit, PASS/GAP-tabell)
2. **`npm run smoke:predeploy:build` PASS** (deploy-minimum; snabb loop: `YOLO_SKIP_BUILD=1 npm run smoke:yolo`)
3. **Pontus OK** vid PMIR-stopp (rules, Barnporten kanon-UI, Sacred UX, mass-radering, App Check Enforce)

## Tre lager

| Lager | Vad | Leverans |
|-------|-----|----------|
| **1 Parallell** | specialist-security-auditor, specialist-ux-guardian, specialist-verifier, ev. zon-agenter | Zon-memos PASS/GAP |
| **2 YOLO-vakt** | `/yolo-vakt` syntes | **GO / NO-GO** + ett nästa steg |
| **3 Smoke** | `smoke:predeploy:build` + Tier 2 vid behov | Exit 0 |

## Smoke-tiers

Hierarki: `smoke:yolo` ⊂ `smoke:predeploy` ⊂ `smoke:predeploy:build` ⊂ `smoke:super-yolo`

| Tier | Kommando | När |
|------|----------|-----|
| **A — Snabb** | `YOLO_SKIP_BUILD=1 npm run smoke:yolo` | Iteration, liten UI-diff |
| **B — Static** | `npm run smoke:predeploy` | Efter functions build, utan frontend build |
| **C — Deploy gate** | `npm run smoke:predeploy:build` | **Merge, deploy, YOLO GO** |
| **D — Live** | `npm run smoke:predeploy:live` | Efter deploy (kräver `.env`) |
| **E — Release** | `npm run smoke:super-yolo` | Stor release / sällan |
| **2** | Domän-extra (matris nedan) | Efter diff-scope |
| **3** | `orkester:night` | Nattpass (ingen LLM) |

### `npm run smoke:yolo` (snabb — inte deploy-minimum)

Kör via `scripts/smoke_yolo_gate.mjs` (i ordning):

```bash
npm run build                    # hoppas över om YOLO_SKIP_BUILD=1
cd functions && npm run build && cd ..
npm run smoke:manifest
npm run smoke:chrome-header
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:plausible-deniability
npm run smoke:valv-security
npm run smoke:innehall
npm run smoke:prompts
```

**Snabb körning (dev):** `YOLO_SKIP_BUILD=1 npm run smoke:yolo`

### `npm run smoke:predeploy:build` (deploy-minimum)

```bash
cd functions && npm run build && cd ..
npm run build
npm run smoke:predeploy
```

Ingår bl.a. tier1 (synapse, inkast, weaver-hitl, biff, agents-ui, …), valv-security, dcap-routing, barn-epistemik.

## Tier 2 — domän-extra efter diff

| Diff rör | Kör extra |
|----------|-----------|
| `src/modules/core/layout`, header, chrome | `smoke:chrome-header`, `smoke:locked-ux` |
| `functions/*mabra*` | `smoke:mabra`, `smoke:valv-security`, `smoke:cache` |
| Hamn / BIFF | `smoke:hamn`, `smoke:biff-rewrite`, `smoke:grans` |
| Inkast / capture | `smoke:inkast*`, `smoke:inkast-upload` |
| Valv / WORM | `smoke:vault-worm`, `smoke:valv-gate`, `smoke:valv` |
| Barnen / Familjen | `smoke:children`, `smoke:locked-ux` |
| Auth / Android | `smoke:auth-login`, `smoke:android-platform` |
| Innehåll / bank | `smoke:innehall`, `smoke:domän-specialister` |
| `firestore.rules` | **STOP** — PMIR + Pontus OK + `specialist-verifier` |

## YOLO checklista (12 punkter)

| # | Kontroll | Bevis |
|---|----------|-------|
| 1 | Tre silos — ingen cross-RAG | `smoke:orkester`, `smoke:innehall` |
| 2 | LLM beslutar inte auth/WORM | `routeFromDcap`, `callableGuards` |
| 3 | Prompts endast `sharedRules.ts` | grep `functions/src` |
| 4 | Locked UX | `smoke:locked-ux` |
| 5 | Plausible deniability | `smoke:plausible-deniability` |
| 6 | Zero Footprint | `smoke:valv-security`, `invalidateSession` |
| 7 | Ingest HITL | `smoke:weaver-hitl`, `smoke:synapse-triggers` |
| 8 | WORM `hasOnly` i rules | läs `firestore.rules` |
| 9 | App Check på LLM callables | `smoke:cache`, `smoke:auth-login` |
| 10 | Inga secrets i diff | `git diff` |
| 11 | Superhub / design-moduler | `smoke:design-modules` |
| 12 | Bevis → `reality_vault` | `smoke:inkast-upload`, `smoke:vault-worm` |

## PMIR-stopp (hard NO-GO)

- `firestore.rules` / `storage.rules` utan godkänd PMIR
- Barnporten kanon-UI
- Sacred / Locked UX borttagning
- Mass-radering utan arkiv-först + Pontus OK
- `APP_CHECK_ENFORCE` i Console (Pontus manuellt)
- Fas 22 **22.3** nutrition rules — BLOCKER utan 22.2 PMIR

## Operativ sekvens (varje deploy)

1. `git diff origin/main...HEAD` — klassificera zon
2. Parallellt read-only: security, UX, verifier
3. `/yolo-vakt` → GO/NO-GO
4. Vid GO: `npm run smoke:predeploy:build` + Tier 2-extras
5. Vid ALL PASS: named deploy enligt [`DEPLOY.md`](./DEPLOY.md)
6. Hard refresh + rad i [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md)
7. Spara audit: `docs/evaluations/YYYY-MM-DD-yolo-audit.md`

## Parallella startprompter

Se [`.cursor/agents/yolo-vakt.md`](../.cursor/agents/yolo-vakt.md) och plan YOLO-vakt stående gate.

## Audit-arkiv

Per deploy: `docs/evaluations/YYYY-MM-DD-yolo-audit.md`
