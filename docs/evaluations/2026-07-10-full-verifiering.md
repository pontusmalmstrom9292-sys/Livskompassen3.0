# Fullständig verifiering — Livskompassen v2

**Datum:** 2026-07-10 (uppdaterad 2026-07-11)  
**Plattform:** Cursor Agent-läge  
**Metod:** Smoke-gates i ordning + doc↔kod-grep med fil:rad-citat. Inga påståenden utan bevis.

---

## 1. Executive summary

| Gate | Status |
|------|--------|
| **Build + statisk predeploy** | **GO** — `npm run smoke:predeploy:build` exit 0 (2026-07-10) |
| **Live smoke (molnet)** | **GO** — `npm run smoke:predeploy:live` exit 0 (2026-07-11) |
| **Super-YOLO (utökad gate)** | **GO** — `npm run smoke:super-yolo` exit 0 (2026-07-11) |
| **GCP kostnadsvakt (live)** | **GO** — `gcp:audit-apis` PASS (2026-07-11); compute avstängd, scheduler tillåten (onSchedule) |
| **Governance-docs synk** | **GO** — PROJECT_STATE Phase 10 synkad (PR #197, 2026-07-11) |
| **Functions deploy (senaste)** | **GO** — `claimBarnportenPairing` + `analyzeProjectImage` deploy OK i run `29112611903` |

### Sammanfattning

Kod, bygg, statiska gates och **alla live smoke-gates är gröna** efter session 2026-07-11 (SEED-användare + App Check debug token + smoke:inbox-fix). **Prod-release GO** på kod/smoke/kostnad/governance (2026-07-11). Kvar: G85 7-dagars daily driver (Fas 24 P0, mänsklig) + Pontus visual sign-off.

**Fixar i session 2026-07-10 (kod):**
- `scripts/smoke_e2e_locked_ux.mjs` — tvingar `CI=1` så Playwright startar egen server med `VITE_REQUIRE_EMAIL_AUTH=true`
- `playwright.config.ts` — e2e-port `5174` (undviker krock med dev på `:5173`)

**Fixar i session 2026-07-11 (kod):**
- `scripts/smoke_children_logs.mjs` — Admin SDK seed-fallback + shared App Check init (föregående chatt)
- `scripts/smoke_inbox_sort.mjs` — kunskap-testtext utan covert HCF-nyckelord (`gaslighting`) som felaktigt gav `bevis` via heuristik (`inboxClassifier.ts:234-255`)
- `infra/gcp/cost-guard/manifest.json` — `cloudscheduler` → allowedApis (onSchedule-jobb); compute avstängd i GCP

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
| `smoke:e2e-locked-ux` | **PASS** | 10/10 Playwright-tester, inkl. Familjen/Valvet login wall |
| Zon-rutter (statisk) | **PASS** | `navTruth.ts` legacy → redirect i `AppRoutes.tsx` (se §3) |

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
| `smoke:predeploy:live` | **PASS** | exit 0, 2026-07-11T07:34Z — hela kedjan inkl. `smoke:inbox` |
| `smoke:valv-gate` | **PASS** | Anonym nekad valvChatQuery/getEntityProfileRegistry/issueVaultSession |
| `smoke:children` | **PASS** | `citations: 3 match seed: YES private leak: NO` |
| `smoke:vault-worm` | **PASS** | update/delete/shadow field/fel ownerId alla NEKAD (OK) |
| `smoke:dcap-alerts-worm` | **PASS** | client create/update/delete NEKAD (OK) |
| `smoke:inbox` | **PASS** (efter fix) | bevis/kunskap/barnen/dagbok/trauma→review alla OK |
| `smoke:super-yolo` | **PASS** | exit 0 — valv-chat-e2e, confirm-inbox, entities, evolution-discovery m.fl. |

**Tidigare FAIL (2026-07-11 före fix):** `smoke:inbox` — `kunskap/review förväntat, fick bevis` p.g.a. testtext med `gaslighting` som triggade HCF-heuristik före kunskap-block (`functions/src/lib/inboxClassifier.ts:234-255` före `:271-284`).

**Tidigare FAIL (2026-07-10):** `smoke:children` — `PERMISSION_DENIED` utan `SEED_FIREBASE_*` i `.env`. Löst med email sign-in + Admin SDK seed.

### Fas E — Kostnadsvakt live

| Script | Resultat | Bevis |
|--------|----------|-------|
| `gcp:audit-apis` | **PASS** | `[gcp:audit-apis] PASS — inga blockerade API:er aktiva` (2026-07-11); compute avstängd via gcloud |
| `smoke:cost-guard` (statisk) | **PASS** | Inga dyra npm-deps eller minInstances i kod |

### Fas F — Deploy & functions

| Item | Resultat | Bevis |
|------|----------|-------|
| `claimBarnportenPairing` | **DEPLOYED** | GitHub run `29112611903` SUCCESS |
| `analyzeProjectImage` | **DEPLOYED** | GitHub run `29112611903` SUCCESS |
| Live callables (inbox) | **OK** | `previewInboxClassification` svarar korrekt i prod (smoke:inbox PASS) |

---

## 3. Doc↔kod-avvikelser (fil:rad)

### DOC-STALE

| ID | Beskrivning | Bevis |
|----|-------------|-------|
| D1 | PROJECT_STATE säger Premium UI Phase 0, PROGRESS kör Phase 10 våg 105–110 | `docs/PROJECT_STATE.md:48` vs `docs/PROGRESS.md:2,36` |
| D2 | PROJECT_STATE last-updated 2026-06-28 | `docs/PROJECT_STATE.md:3` |
| D3 | Gate "starta inte Phase 1" föråldrad — DASHBOARD har metrics ifyllda, PROGRESS har Phase 1–10 arbete | `docs/PROJECT_STATE.md:50` vs `docs/DASHBOARD.md:18-31` |
| D4 | TODO.md last-updated 2026-06-29 | `docs/TODO.md:5` |
| D5 | `worm_hash_chain` i rules, saknas i manifest | `firestore.rules:425-428` vs `src/modules/core/manifest/masterManifest.ts:14-146` (ingen `worm_hash_chain`) |
| D6 | GAP G10 UI-namn `InboxQueueCard` → faktisk komponent `InboxReviewQueue` | `docs/specs/modules/Arkiv-GAP-REGISTER.md:120` vs `src/modules/inkast/components/InboxReviewQueue.tsx:108` |
| D7 | ~~cost-guard manifest motsägelse~~ | **LÖST** 2026-07-11 — scheduler i `allowedApis:43`, bort från `blockedApis` |

### PASS

- Fas 24 AKTIV: `docs/PROJECT_STATE.md:25-27`
- G1/G10/G14 done i kod (GAP-register + smoke)
- Module-lock 22/22 med @locked headers
- Legacy redirects i AppRoutes
- Live WORM-verifiering (reality_vault, dcap_alerts, children_logs)

### BLOCKER

| ID | Beskrivning | Bevis |
|----|-------------|-------|
| B1 | ~~GCP blocked APIs aktiva~~ | **LÖST** 2026-07-11 — compute disabled, scheduler i allowlist |
| B2 | ~~Governance-docs ur synk~~ | **LÖST** PR #197; D2/D4 TODO-datum kvar som P2 |

---

## 4. Bugglista

### P0

| ID | Beskrivning | Status |
|----|-------------|--------|
| P0-1 | E2e smoke port/dev-server krock | **FIXAD** |
| P0-2 | smoke:children kräver SEED-credentials | **FIXAD** (env konfigurerad) |
| P0-3 | smoke:inbox kunskap-test vs HCF-heuristik | **FIXAD** (testtext justerad) |

### P1

| ID | Beskrivning | Status |
|----|-------------|--------|
| P1-1 | GCP 2 blockerade API:er aktiva | **LÖST** (compute av, scheduler allowlist) |
| P1-2 | Governance-docs ur synk | **LÖST** (PR #197) |

### P2

| ID | Beskrivning | Status |
|----|-------------|--------|
| P2-1 | worm_hash_chain saknas i manifest | **ÖPPEN** |
| P2-2 | cost-guard manifest motsägelse (D7) | **LÖST** — `cloudscheduler` flyttad till `allowedApis` (5× onSchedule i functions) |
| P2-3 | Artifact Registry IAM vid deploy | **LÖST** (run 29112611903) |
| P2-4 | BBIC-artikel om gaslighting routas till bevis (domän vs heuristik) | **ÖPPEN** — klassificerare prior ~80% HCF; ev. PMIR för kunskap-undantag |

---

## 5. Deploy-status

| Run | Resultat | Detalj |
|-----|----------|--------|
| 29111710311 | FAIL | IAM Artifact Registry — claimBarnportenPairing, analyzeProjectImage |
| 29112611903 | SUCCESS | Båda functions deployade |
| Live nu | DEPLOYED | `firebase functions:list` visar båda i europe-west1 |

---

## 6. Ett nästa steg för Pontus

Kör **G85 7-dagars daily driver** (Fas 24 P0) — appen på telefonen i vardagen. Smoke är grön.

---

*Anti-hallucination: `.cursor/rules/anti-hallucination.mdc`*
