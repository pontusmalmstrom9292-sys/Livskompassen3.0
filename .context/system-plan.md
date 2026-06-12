# Livskompassen v2 - System Plan (Canonical)

Denna fil ar aktiv systemplan. Root-filen `system_plan.md` ar endast en pekare.

**När det känns rörigt:** färdiga analysprompter och Sacred-register → [`docs/SYSTEMKONTROLL.md`](../docs/SYSTEMKONTROLL.md). **Git / grenar:** [`docs/GIT-LATHUND.md`](../docs/GIT-LATHUND.md) · [`docs/BRANCH-KARTA.md`](../docs/BRANCH-KARTA.md).

## Fas 1 (Cleanup): Sanering & Mappstruktur
- [x] Git-branch `cleanup-phase-1` - saker arbetskopia
- [x] `.context/` systemlagar (arkitektur, sakerhet, databas, design)
- [x] `.gitignore` - secrets, `dist/`, `functions/lib/`, genererad kod
- [x] Borttaget fran git: `vertex-sa.json`, `server/.env`, `spejaren.js`, `server.js`, build-artefakter
- [x] Frontend merge fran `livskompassen-v2` (`main.tsx`, layout, Kompis)
- [x] Rensat: tomma placeholders, trasig `agentEngine.ts`, session-artefakter -> `docs/archive/`
- [x] Agent Cards: 8 produktroller + deterministisk `routeFromDcap` -> executor
- [x] Sakerhet: auth pa `knowledgeVaultQuery`, webhook-secret pa `notifyNewFile`
- [x] Enhetligt `GCP_PROJECT_ID` via `functions/src/config.ts`
- [x] HOME-klonens unika `src`-integration (firebase, store, vault-chat)
- [x] Vault-sidor portade till `src/modules/` (verklighetsvalvet, kompasser, safe_harbor, ekonomi)
- [x] Aktiv backend konsoliderad till `functions/` (legacy `server/` arkiverad)
- [x] Redundanta projektkartor raderade (v2, PROD, drive-download, cursor-workspace, HOME-klon)

## Fas 2 (Moduler): App-shell + aktivering
- [x] BrowserRouter + routes (`/`, `/kompasser`, `/valv`, `/hamn`, `/ekonomi`, `/dagbok`, `/kunskap`, `/barnen`)
- [x] FloatingDock navigation med aktiv route + long-press Shield (3 sek)
- [x] AuthProvider (Firebase Anonymous) + AuthGate pa kansliga moduler
- [x] Zero Footprint: vault unlock reset vid visibilitychange + timeout + `invalidateSession` callable
- [x] Kunskapsvalv: `/kunskap` + Tidshjulet + auth-felhantering
- [x] Kompasser: morgon/dag/kvall-floden + Firestore checkins
- [x] Safe Harbor: BIFF-formular via `analyzeMessage` callable
- [x] Verklighetsvalvet: long-press gate, PIN (lokal/env), VaultLog WORM
- [x] Dagbok: DagbokPage + journal-persistens
- [x] Barnens livsloggar: `/barnen`, PIN, Firestore `children_logs`
- [x] Telefon-MVP: `vite --host` i dev-script + `manifest.webmanifest` (lägg till på hemskärm)
- [x] Firestore rules: checkins, journal, reality_vault, children_logs

## Kladd-konsolidering (2026-05-21)

- [x] Notebook #1–#7 → [`docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md`](docs/archive/kladd/Kladd-2026-05-21-PERSONAL-MASTER.md)
- [x] Minne-kandidater → [`docs/archive/kladd/Kladd-2026-05-21-kampspar-kandidater.md`](docs/archive/kladd/Kladd-2026-05-21-kampspar-kandidater.md)
- [x] Gap-tabeller i alla `.context/modules/*.md` + `src/modules/*/module_plan.md` (ingen kod)
- [x] Back-merge Kladd → `[MODUL]-SPEC.md` (§8, §12–13, Kladd-synk)
- [x] Nya SPEC: [`Ekonomi-SPEC.md`](docs/specs/modules/Ekonomi-SPEC.md), [`Core-SPEC.md`](docs/specs/modules/Core-SPEC.md)
- [x] [`docs/specs/p2-flode.md`](docs/specs/p2-flode.md) synkad mot kod
- [x] Grunder Fas A — [`docs/specs/modules/grunder-slides/`](docs/specs/modules/grunder-slides/) + [`INVENTAR.md`](docs/specs/modules/grunder-slides/INVENTAR.md)
- [x] Grunder U1–U5 + Fas C — [`docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md)
- [ ] Manuell ingest av minne-poster (opt-in trauma-policy)
- [ ] Implementation per modul när användaren säger *kör [modul]*
- [x] **Del B (2026-05-24):** [`docs/MODUL-FUNKTIONS-REGISTER.md`](../docs/MODUL-FUNKTIONS-REGISTER.md) + doc-drift-synk — `/planering` live på `main`

## Aktuell status
- [x] Design-tokens och fargpalett
- [x] Bas-layout med Sub-Synaptic Background
- [x] KompisAvatar
- [x] Bento Grid dashboard
- [x] Floating Dock (routing)
- [x] Interaktivt Tidshjul (bas-UI pa `/kunskap`)
- [x] Mobil-dashboard (`--host`)
- [x] Verklighetsvalv UI (long-press + PIN + VaultLog)

## Fas 3 (Firebase-synk)
- [x] Firestore rules + indexes deployade
- [x] Functions deployade; `notifyNewFile` deployad (G6 E2E **done** 2026-05-22)
- [x] Firebase Hosting: https://gen-lang-client-0481875058.web.app
- [x] Dokumentation: `docs/FIREBASE_SYNC.md`
- [ ] Manuell smoke i app (#3 Valv, #4 Barnen, #2d bilaga) — sanning: [`docs/SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md) **Current truth**
- [x] `NOTIFY_WEBHOOK_SECRET` + Drive E2E → `kb_docs` (G6 **done** 2026-05-22)

## Drive wire-up (Apps Script → notifyNewFile)
- [x] Kod redo: Script Properties i `sorter.gs`, webhook-secret fail-closed, `docs/DRIVE_AUTOMATION.md`
- [x] G6 Drive E2E — `kb_docs` PASS 2026-05-22 ([`GCP-FAS4-RUNBOOK.md`](docs/GCP-FAS4-RUNBOOK.md) steg 2)

## Firebase Fas 3 (synk)
- [x] `.firebaserc` rättad; Firestore rules + indexes deployade
- [x] Modul-Functions deployade (`europe-west1`); Hosting live — se `docs/DEPLOY.md`, `docs/FIREBASE_SYNC.md`
- [x] `notifyNewFile` — G6 **done** 2026-05-22 (`kb_docs` E2E)
- [x] Manuell smoke minimum (#1, #2, #18) **PASS** 2026-05-27
- [x] Manuell smoke #2d **PASS** 2026-06-06 (USER)
- [ ] Manuell smoke #3, #4 valfritt USER — autorun PASS 2026-06-06 · [`docs/SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md) **Current truth**

## Data Connect
- Deployat (example-schema); **appmoduler använder Firestore** — DC avvaktas tills ekonomi (se `docs/FIREBASE_SYNC.md`)

## Modulmappning (`.context/modules/`)

| Modul | Route | Kontextfil | Kod |
| --- | --- | --- | --- |
| Verklighetsvalvet | `/valvet` (Fyren + WebAuthn) | `.context/modules/verklighetsvalvet.md` | `src/modules/features/lifeJournal/evidence/vault/` |
| Hjärtat (Dagbok) | `/hjartat` (legacy `/dagbok`) | `.context/modules/dagbokshubben.md` | `src/modules/features/lifeJournal/diary/` |
| Familjen / Barnen | `/familjen` | `.context/modules/barnens_livsloggar.md` | `src/modules/features/family/children/` |
| Speglings-Systemet | `/hjartat?tab=speglar` | `.context/modules/speglingssystemet.md` | `src/modules/features/lifeJournal/diary/mirror/` |
| MåBra | `/mabra` | `.context/modules/mabra_sidan.md` | `src/modules/features/dailyLife/wellbeing/mabra/` |
| Kompis / Kunskap | Valv PIN → `/valvet?vaultTab=kunskapsbank` | `.context/modules/kompis.md` | `src/modules/features/lifeJournal/evidence/kompis/` |

## Permanent minne (låst princip)

**Konsoliderad:** 2026-05-21 — se [`docs/archive/repomix/KONSOLIDERING-2026-05-21.md`](docs/archive/repomix/KONSOLIDERING-2026-05-21.md).

Livskompassen ska **aldrig glömma** användarens WORM-data — ingen tidsgräns, utan arkitekturinvariant.

| Collection | Roll | Glömmer? |
|------------|------|----------|
| `children_logs` | Barnens livslogg + fysiologi | Nej — append-only WORM |
| `reality_vault` | Bevis (Sanningens Sköld) | Nej — append-only WORM |
| `journal` | Dagbok Lager 1 | Nej — append-only WORM |
| `kampspar` / `kb_docs` | Kunskapsvalvet (RAG) | WORM create; separat retention — **ersätter inte** barn/valv |
| `dossier_snapshots` | Bevisad export | WORM snapshot |

**Tre kunskapsytor** (se `arkitektur-beslut.md` §1.5) — blanda aldrig RAG mellan silor.

**Repomix → kanon (legacy):** `vault`→`reality_vault`, `kids_records`→`children_logs`, `diary`→`journal`. Mock `Kampspar`-typ ≠ `KampsparEntry` (G11).

**Idag (live — [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md), audit 2026-05-31):**
- Kunskap RAG — smoke PASS; ANN G2/G3 **VERIFY PASS** (**173 vectors**, west1 defaults)
- `valvChatQuery` — **deployad** (G1 **done**); smoke:valv PASS
- Dossier `generateDossier` — **klart** (smoke PASS)
- `notifyNewFile` — **deployad**; G6 **done** 2026-05-22
- Vävaren HITL — `approveWeaverMetadata` / `rejectWeaverMetadata` **deployade**; `weaver_pending` rules + UI enligt PMIR 2026-05-31
- Legacy Python us-central1 — **0 fn kvar** (FAS4 steg 1–5 **done** 2026-05-22)
- Retention G5 **done**; mock Kampspar G11 **done**

**GAP G1–G14:** **done** (2026-05-22) — [`Arkiv-GAP-REGISTER.md`](docs/specs/modules/Arkiv-GAP-REGISTER.md). Ny backlog utanför G-serien dokumenteras separat.

**Sacred:** Permanent minne + korrekt silo = Zero Footprint + Kill Switch.

## Kommande fas
- [x] WebAuthn gate + Shake-to-Kill (15 m/s²) + Fyren progress
- [x] Vävaren async tagging (Gemini 1.5 Pro → reality_vault) + kampsparRag
- [x] Barnens: Kasper/Arvid, Balansmätare, fysiologi, JSON export
- [x] Barnens *kör barnen* **done** — Spara som bevis + `sourceRef`, tredjepart-filter, Dossier-länk (`/familjen`)
- [x] Speglings-Systemet: ACT + VIVIR + valvjämförelse (`/speglar`)
- [x] `weaveJournalEntry` + hosting deploy (natt-batch — se `docs/NATT-CI.md`, historik: `docs/archive/OVERNIGHT_REPORT.md`)
- [x] Minneloggning (uppladdning, tidsstampel, vektorisering) — **klart:** ingestKnowledgeDocument, ingestKampsparEntry, KunskapsvalvFileIngest, Kunskap RAG; Vector Search ANN VERIFY PASS (G2/G3)
- [x] Kompasser notebook #1–#5 → låst SPEC; MVP *kör kompasser* **done** (AuthGate, tids-default, Paralys, KASAM, broar)
- [x] Dossier notebook #1–#4 → låst SPEC; UI wizard + `generateDossier` backend **done** — deploy `functions:generateDossier` + rules
- [x] Ekonomi kopplad till Firestore (`transactions` WORM + `economy_profiles`)
- [x] Måbra-sidan MVP — hub + 4-7-8 andning + `mabra_sessions` (SPEC **done** 2026-05; se `docs/specs/modules/Mabra-SPEC.md`, `.context/modules/mabra_sidan.md`)
- [x] Måbra fas 2a — reframing self_critical (4 steg + valfri 1-min andning, `exerciseType: reframing`)
- [x] Måbra fas 2b — AkutLanding panic_rsd + panik-andning UX (tid kvar, fas-copy)
- [x] Måbra fas 2c — hub-complete + Dagbok bro `?from=mabra&energy=low`
- [x] Måbra fas 2d — ACT ValuesCompass + `mabra_progress/{uid}`
- [x] Måbra fas 2e — coach callable + opt-in UI + Speglar guardrail
- [x] Måbra fas 2f — Web Speech sv-SE (reframing + coach)

## Life OS orchestrering (2026-05-23)

- [x] Locked UX smoke + P1 design-moduler (D3, D11–D14, D16–D20, D22–D23, D29)
- [x] Tema E tokens + `HomeHeroKanon` / `LivskompassHero` på Hem
- [x] Evaluations A–F + 6 modul-rapporter (`docs/archive/evaluations-2026-05-23/`)
- [x] `npm run smoke:all` + `.context/design-modules-mockup.md`
- [x] Manuell smoke minimum (#1, #2, #18) **PASS** 2026-05-27; #19–20 **STATIC PASS** 2026-05-29
- [x] Manuell smoke #2d **PASS** 2026-06-06 (USER)
- [ ] Manuell smoke #3, #4 valfritt USER — autorun PASS 2026-06-06 · [`docs/SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md) **Current truth**

## Fas 5 — Verifiering + polish (2026-05-31, post git-trunk)

**Kanon:** [`docs/SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md) · checklista [`docs/evaluations/2026-05-31-fas5a-user-checklist.md`](../docs/evaluations/2026-05-31-fas5a-user-checklist.md)

| Del | Status |
|-----|--------|
| **5A** Prod-verifiering (Vävaren HITL, smoke #3/#4/#2d) | Agent prep **PASS** — manuell USER kvar |
| **5B** Valv/Hamn UI (Visa brus, ankare-filter, forensik-ingress) | **done** 2026-05-31 på `main` |
| **5C** Inkorg I1/I3 produktbeslut | **DEFER** — [`docs/evaluations/2026-05-31-fas5c-inkorg-beslut.md`](../docs/evaluations/2026-05-31-fas5c-inkorg-beslut.md) |
| **5D** Projekt P2 / Barnporten / Life OS Fas D | Backlog — [`docs/evaluations/2026-05-31-fas5d-backlog.md`](../docs/evaluations/2026-05-31-fas5d-backlog.md) |

## Life OS kopplingar (backlog — komihåg 2026-05-26)

**Kanon:** [`docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md`](../docs/design/LIFE-OS-KOPPLINGAR-KOMIHAG.md) · Landning: [`docs/evaluations/2026-05-26-session-landning.md`](../docs/evaluations/2026-05-26-session-landning.md)

- [x] **LifeHubPreset (Fas A)** — 4 presets i `src/modules/core/lifeOs/`, Hem-väljare, `materialFlags` per route
- [x] **RoutineTemplate + ModuleLink (Fas B)** — `routineTemplates.ts`, `RoutinesPanel` på `/planering`, deep links
- [x] **MaterialPack (Fas C)** — `materialPacks.ts`, `MaterialPackShortcuts` på Familjen/MåBra/Hamn
- [x] **Projekt P1 (del)** — `projects`, `project_blocks`, `/projekt/:id`, `projectId` på kanban
- [ ] **Projekt P2+ / Fas D** — regler, bild-uppladdning, widget-sheet, full MaterialPack-editor
- [ ] Implementation: `kör kopplingar C` · `kör projekt P1` · se komihåg för fasering
