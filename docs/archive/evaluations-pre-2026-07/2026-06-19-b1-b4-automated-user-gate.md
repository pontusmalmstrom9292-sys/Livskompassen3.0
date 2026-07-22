# B1–B4 automated USER-test gate

**Datum:** 2026-06-19  
**Branch:** `main` @ `b63f60795`  
**Körare:** `specialist-smoke-runner` (Cursor agent)  
**Syfte:** Automatiserad motsvarighet till manuell USER-test Block B (B1–B4) + YOLO predeploy-baseline.

---

## Miljö

| Signal | Värde |
|--------|-------|
| OS | linux 6.1.147 |
| Node | via projektrot `npm` |
| `.env` | **Saknas** — nätverks-smokes som kräver Firebase-credentials körs inte |
| Dirty tree | **2 filer modifierade** (ej committade): `functions/src/adk/synapses/driveIngestSynapse.ts`, `functions/src/lib/inboxPersist.ts` — YOLO deploy-gate skulle flagga NO-GO tills städat |

---

## B1–B4 kriterier (Orkester / ADK Block B)

Kanon från orkester-eval (≥8 produktroller, 2 executors, DCAP-routing, inga Dotprompt-filer).

| ID | Kriterium | Automatiserad verifiering | Resultat |
|----|-----------|---------------------------|----------|
| **B1** | ≥8 produktroller i `AvailableAgents` | `smoke:orkester` + kod: 10 cards i `functions/src/agents/cards/index.ts` L244–255 | **PASS** |
| **B2** | Exakt 2 executors i `resolveExecutorId` | `smoke:dcap-routing` + `EXECUTOR_AGENT_IDS` (`livsArkivarien`, `gransArkitekten`) | **PASS** |
| **B3** | `routeFromDcap` anropas från supervisor | `smoke:dcap-routing` + `kompis-supervisor.ts` L53 | **PASS** |
| **B4** | Inga `.prompt`-filer i `functions/` | Glob `**/*.prompt` → 0 träffar; `smoke:prompts` runtime scan | **PASS** |

---

## Smoke-körningar (begärd suite)

| Kommando | Inkluderad i predeploy? | Tid (ca) | Resultat | Notering |
|----------|-------------------------|----------|----------|----------|
| `npm run smoke:predeploy` | — (root) | ~27 s | **PASS** | Tier1 + valv-security + plausible-deniability + locked-icons + barn-epistemik + epistemic-guard + dcap-routing + e2e-locked-ux |
| `npm run smoke:e2e-locked-ux` | Ja (sista steg i predeploy) | ~15 s | **PASS** | Playwright 10/10 (`locked-ux-public`, `obsidian-calm-tokens`) |
| `npm run smoke:design-modules` | Ja (tier1) | <1 s | **PASS** | P1 design modules, modulväljare, Fas 19.3/22/24 tokens |
| `npm run smoke:content-mabra-static` | Nej (static MåBra bank) | <1 s | **PASS** | Begärd “static parts”-motsvarighet |
| `npm run smoke:mabra` (static prefix) | Nej | <1 s | **PASS (static)** | MB-PLAY-54321, bank_parafras, nutrition guards OK |
| `npm run smoke:mabra` (full) | Nej | — | **SKIP** | Avbryts efter static: `Saknar .env` — Firebase/App Check/mabraCoach kräver credentials |

### `smoke:predeploy` — delresultat (tier1 + säkerhet)

Alla delsteg PASS:

- `smoke:locked-ux`, `smoke:design-modules`, `smoke:manifest`, `smoke:orkester`, `smoke:agents-ui`, `smoke:innehall`, `smoke:adaptation`, `smoke:synapse-triggers`, `smoke:inkast-upload`, `smoke:weaver-hitl`, `smoke:biff-rewrite`, `smoke:prompts`
- `smoke:valv-security`, `smoke:plausible-deniability`, `smoke:locked-icons`, `smoke:barn-epistemik`, `smoke:epistemic-guard`, `smoke:dcap-routing`, `smoke:e2e-locked-ux`

---

## Sammanfattning PASS/FAIL

| Gate | Resultat |
|------|----------|
| **B1** AvailableAgents ≥8 | **PASS** |
| **B2** 2 executors | **PASS** |
| **B3** routeFromDcap | **PASS** |
| **B4** inga `.prompt`-filer | **PASS** |
| **smoke:predeploy** (full static CI gate) | **PASS** |
| **smoke:e2e-locked-ux** (separat) | **PASS** |
| **smoke:design-modules** (separat) | **PASS** |
| **smoke:mabra** static | **PASS** |
| **smoke:mabra** network/callable | **SKIP** (saknar `.env`) |
| **Dirty tree** | **WARN** — ej deploy-klar enligt YOLO-vakt |

### Övergripande automated USER-gate

**PASS** — för static + browser E2E motsvarighet på `main` utan kodändringar.

**Ej täckt i denna körning:** live Firebase-smokes (`smoke:predeploy:live`, full `smoke:mabra` backend). Kräver `.env` med `SEED_FIREBASE_*` / App Check debug token.

---

## Rekommenderat nästa steg (manuell / CI med secrets)

```bash
# Med .env på plats:
npm run smoke:mabra
npm run smoke:predeploy:live
```

Ingen kodfix krävs utifrån denna körning.
