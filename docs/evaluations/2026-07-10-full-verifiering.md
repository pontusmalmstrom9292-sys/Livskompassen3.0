# Fullständig verifiering — Livskompassen v2

**Datum:** 2026-07-10  
**Plattform:** Cursor Agent-läge  
**Metod:** Smoke-gates i ordning + doc↔kod-grep med fil:rad-citat. Inga påståenden utan bevis.

---

## 1. Executive summary

| Gate | Status |
|------|--------|
| **Build + statisk predeploy** | **GO** — `npm run smoke:predeploy:build` exit 0 (2026-07-10) |
| **Live smoke (molnet)** | **NO-GO** — `smoke:children` PERMISSION_DENIED (saknar `SEED_FIREBASE_*` i `.env`) |
| **GCP kostnadsvakt (live)** | **NO-GO** — 2 blockerade API:er fortfarande aktiva i GCP |
| **Functions deploy (senaste)** | **GO** — `claimBarnportenPairing` + `analyzeProjectImage` deploy OK i run `29112611903` |

### Sammanfattning

Kod, bygg och alla statiska smoke-gates är **gröna** efter fix av e2e-infrastruktur (port-konflikt mot lokal dev-server). **Prod-release NO-GO** tills: (1) live `smoke:children` med verifierad seed-användare, (2) stäng `cloudscheduler` + `compute` i GCP Console (eller PMIR om avsiktligt), (3) synka governance-docs (PROJECT_STATE fortfarande Phase 0).

**Fixar i denna session (kod):**
- `scripts/smoke_e2e_locked_ux.mjs` — tvingar `CI=1` så Playwright startar egen server med `VITE_REQUIRE_EMAIL_AUTH=true`
- `playwright.config.ts` — e2e-port `5174` (undviker krock med dev på `:5173`)

---

## 2. Smoke-matris

### Fas A — Bygg & statisk gate

| Script | Resultat | Bevis |
|--------|----------|-------|
| `smoke:predeploy:build` | **PASS** | functions `tsc` + `vite build` + hela `smoke:predeploy` kedja, exit 0 |
| `smoke:governance` | **PASS** | `[smoke:governance] PASS (20 files, 10 copilot phrases)` |
| `smoke:cost-guard` | **PASS** | `[smoke:cost-guard] PASS — inga dyra tjänster i kod` |
| `smoke:module-lock` | **PASS** | `22 modules (22 locked)` |

### Fas B — 3-zonsystem (statisk + e2e)

| Script | Resultat | Bevis |
|--------|----------|-------|
| `smoke:locked-ux` | **PASS** | Barnfokus, Valv Mönster/Orkester, drawer, Planering, Barnporten |
| `smoke:e2e-locked-ux` | **PASS** (efter fix) | 10/10 Playwright-tester, inkl. Familjen/Valvet login wall |
| Zon-rutter (statisk) | **PASS** | `navTruth.ts` legacy → redirect i `AppRoutes.tsx` (se §3) |

**E2e-första körning FAIL (före fix):** Playwright återanvände dev-server på `:5173` utan `VITE_REQUIRE_EMAIL_AUTH` → anonym auth → Barnfokus exponerat.

### Fas C — Backend & säkerhet

| Script | Resultat | Bevis |
|--------|----------|-------|
| `smoke:orkester` | **PASS** | SynapseBus handlers, journal_woven, dcap_alert, U6 |
| `smoke:manifest` | **PASS** | WORM sample alignment OK, cross-RAG stoppad |
| `smoke:valv-security` | **PASS** | Session lifecycle hardening |
| `smoke:plausible-deniability` | **PASS** | Fyren silos, bevis-routing, dossier gate |
| `smoke:dcap-routing` | **PASS** | 4 band + executor kedja |
| `smoke:innehall` | **PASS** | Register, banks, U6, mabraCoach lock |

### Fas D — Live (kräver `.env`)

| Script | Resultat | Bevis |
|--------|----------|-------|
| `smoke:predeploy:live` | **FAIL** | Avbröts på `smoke:children` |
| `smoke:valv-gate` | **PASS** | Anonym nekad valvChatQuery/getEntityProfileRegistry |
| `smoke:children` | **FAIL** | `PERMISSION_DENIED` vid `children_logs` write |
| `smoke:super-yolo` | **EJ KÖRD** | Kräver `smoke:predeploy:live` PASS först |

**Orsak `smoke:children` FAIL:** Anonym sign-in (`scripts/smoke_children_logs.mjs:90-91`) men `children_logs` kräver `isSensitiveAuth()` (`firestore.rules:19-22,374`). `SEED_FIREBASE_EMAIL`/`PASSWORD` utkommenterade i `.env`.

### Fas E — Kostnadsvakt live

| Script | Resultat | Bevis |
|--------|----------|-------|
| `gcp:audit-apis` | **FAIL** | `blockedEnabled`: `cloudscheduler.googleapis.com`, `compute.googleapis.com` (`docs/evaluations/gcp-api-audit.latest.json:6-7`) |

---

## 3. Doc↔kod-avvikelser (fil:rad)

### DOC-STALE

| ID | Beskrivning | Bevis |
|----|-------------|-------|
| D1 | PROJECT_STATE säger Premium UI Phase 0, PROGRESS Phase 10 | `docs/PROJECT_STATE.md:48` vs `docs/PROGRESS.md:2,36` |
| D2 | PROJECT_STATE last-updated 2026-06-28 | `docs/PROJECT_STATE.md:3` |
| D3 | Gate "starta inte Phase 1" föråldrad | `docs/PROJECT_STATE.md:50` vs `docs/DASHBOARD.md:18-31` |
| D4 | TODO.md last-updated 2026-06-29 | `docs/TODO.md:5` |
| D5 | worm_hash_chain i rules, saknas i manifest | `firestore.rules:425-428` vs `masterManifest.ts:14-146` |
| D6 | GAP G10 UI-namn InboxQueueCard → InboxReviewQueue | GAP-register vs `InboxReviewQueue.tsx:108` |
| D7 | cost-guard blockedApis vs protectedApisNotes | `manifest.json:63,67` vs `:89-91` |

### PASS

- Fas 24 AKTIV: `PROJECT_STATE.md:25-27`
- G1/G10/G14 done i kod (se subagent-verifiering)
- Module-lock 22/22 med @locked headers
- Legacy redirects i AppRoutes

### BLOCKER

Inga — inget GAP "done" utan kod.

---

## 4. Bugglista

### P0

| ID | Beskrivning | Status |
|----|-------------|--------|
| P0-1 | E2e smoke port/dev-server krock | **FIXAD** |
| P0-2 | smoke:children kräver SEED-credentials | **ÖPPEN (env)** |

### P1

| ID | Beskrivning | Status |
|----|-------------|--------|
| P1-1 | GCP 2 blockerade API:er aktiva | **ÖPPEN** |
| P1-2 | Governance-docs ur synk | **ÖPPEN** |

### P2

| ID | Beskrivning | Status |
|----|-------------|--------|
| P2-1 | worm_hash_chain saknas i manifest | **ÖPPEN** |
| P2-2 | cost-guard manifest motsägelse | **ÖPPEN** |
| P2-3 | Artifact Registry IAM vid deploy | **LÖST** (run 29112611903) |

---

## 5. Deploy-status

| Run | Resultat | Detalj |
|-----|----------|--------|
| 29111710311 | FAIL | IAM Artifact Registry — claimBarnportenPairing, analyzeProjectImage |
| 29112611903 | SUCCESS | Båda functions deployade |
| Live nu | DEPLOYED | `firebase functions:list` visar båda i europe-west1 |

---

## 6. Ett nästa steg för Pontus

Avkommentera `SEED_FIREBASE_EMAIL` + `SEED_FIREBASE_PASSWORD` i `.env` och kör:

```bash
npm run smoke:children
```

---

*Anti-hallucination: `.cursor/rules/anti-hallucination.mdc`*
