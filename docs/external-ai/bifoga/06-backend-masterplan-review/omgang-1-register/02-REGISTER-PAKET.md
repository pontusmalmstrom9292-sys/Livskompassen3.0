# Register-paket (Prompt G)

---

# LIFE-OS-BUILD-STATE

_Källa: `docs/external-ai/LIFE-OS-BUILD-STATE.md`_

# LIFE-OS-BUILD-STATE (levande sanning)

Uppdateras vid varje CHECKPOINT. Register vinner över minne.

**Senast uppdaterad:** 2026-06-16 (Backend masterplan FREEZE)

| Komponent | Nyckelfiler | Status | Smoke | CHECKPOINT |
|-----------|-------------|--------|-------|------------|
| Security core (WORM + vault + guards) | `firestore.rules`, `unlockVault.ts`, `callableGuards.ts` | **LOCK** | tier1 + valv-gate 2026-06-16 | **CP-1** |
| Locked UX §11–17 | `.context/locked-ux-features.md` | **LOCK** | locked-ux PASS 2026-06-16 | **CP-1** |
| G10 Inkast backend | `inboxClassifier.ts`, `submitInkastLite.ts`, `inkastStorageOnFinalize.ts` | **LOCK** | inkast + inbox + inkast-upload 2026-06-16 | **CP-3** |
| G10 Inkast UI (CapturePanel + filer) | `CapturePanel.tsx`, `CaptureSuperModule.tsx` | **LOCK** | inkast PASS 2026-06-16 | **CP-4** |
| Upload unified (Valv DirectPanel) | `InkastDirectPanel.tsx`, `VaultInkastCompact.tsx` | **LOCK** | inkast-upload + valv-compact 2026-06-16 | **CP-4b** |
| SynapseBus (4 triggers) | `synapseBus.ts`, synapse handlers | **LOCK** | synapse-triggers + orkester 2026-06-16 | **CP-5** |
| ADK Manifest runtime | `adk/manifest.ts`, `registry.ts`, `orchestrator.ts` | **LOCK** | manifest + orkester 2026-06-16 | **CP-5b** |
| Valv chat E2E | `valvChatAgent.ts`, `valvChatQuery` | **LOCK** | valv-chat-e2e 2026-06-16 | **CP-8** |
| App Check (kod) | `appCheck.ts`, `callableGuards.ts` | **LOCK** | tier1 2026-06-16 | **CP-6** |
| Valv modul | `evidence/vault/` | **LOCK** | B1 + valv-mode 2026-06-16 | **B1** |
| CI deploy | `.github/workflows/firebase-hosting-main.yml` | **LOCK** | smoke:tier1 + functions deploy | **CP-9** |
| MåBra 19.2–19.5 / wave-2 / M3.0-C | — | **DEFER** | — | efter FREEZE |
| AI-assistent UI | — | **DEFER** | — | — |

## Statusförklaring

- **LOCK** — smoke PASS, får inte refaktoreras utan explicit OK + snapshot
- **FREEZE** — backend-kärnan låst; endast bugfix + content ingest efter KEEP
- **DEFER** — medvetet senarelagt

## Nästa steg (Pontus)

1. **Använd:** Ladda skärmdump via Valv → Inkast → granska WORM → ställ fråga i Valv-chat
2. **Extern review:** Kör Prompt G (Gemini + Opus) med bifogade register
3. **Inget nytt:** Wave-2 polish, M3.0-C, AI-assistent UI förblir DEFER

---

# MODUL-FUNKTIONS-REGISTER

_Källa: `docs/MODUL-FUNKTIONS-REGISTER.md`_

# Modul- & funktionsregister — Livskompassen v2

**Syfte:** En sammanställd sanning — modul, route, backend, spec, smoke.  
**Uppdaterad:** 2026-06-01 (superhub återvinning + sparmål/lönespec vardag)  
**Regel:** Status **kod** verifieras med grep/smoke; docs kan vara historiska — se [`evaluations/SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md).

---

## Tre silos (minne — U1)

| Silo | Collection | Callable / pipeline | Cross-RAG |
|------|------------|---------------------|-----------|
| **Kunskap** | `kampspar`, `kb_docs` | `knowledgeVaultQuery`, `notifyNewFile` → `driveIngestSynapse` | **Aldrig** Valv/Barnen |
| **Valv** | `reality_vault` | `valvChatQuery`, `analyzeMessage` | **Aldrig** Kunskap/Barnen |
| **Barnen** | `children_logs` | `childrenLogsQuery` | **Aldrig** Kunskap/Valv |

Kanon: [`.context/arkiv-minne.md`](../.context/arkiv-minne.md) · [`grunder-kanon.mdc`](../.cursor/rules/grunder-kanon.mdc)

---

## SynapseBus (sammankopplat minne — händelsestyrt)

| Trigger | Handler | Status | Effekt |
|---------|---------|--------|--------|
| `drive_file_ingested` | `driveIngestSynapse` | **live** | Drive → `kb_docs` (självsortering) |
| `journal_woven` | `journalWovenSynapse` | **live** (opt-in) | `optIn===true` → `kampspar` |
| `dcap_alert` | `dcapAlertSynapse` | **live** | Risk → `dcap_alerts` WORM |
| `user_overwhelm` | `paralysBrytarenSynapse` | **live** | Ett mikrosteg |

Koppling: `notifyNewFile` → `emitSynapse(drive_file_ingested)` — `functions/src/index.ts`

---

## Frontend-moduler

| Modul (mapp) | Kluster | Route(s) | Nyckelfunktioner | Spec | Smoke |
|--------------|---------|----------|------------------|------|-------|
| **core** | övrigt | `/`, `/dev/themes`, `/widget/*` | App-shell, Fyren, drawer (`navTruth`), Zero Footprint | `Core-SPEC.md` | `smoke:locked-ux`, `smoke:design-modules` |
| **wellbeing/compasses** | vardag | `/liv?tab=kompasser`, legacy `/vardagen` → redirect | Morgon/dag/kväll, checkins, `vardagenTab=ekonomi` | `De-3-Kompasserna-SPEC.md` | `smoke:compass` |
| **evidence/kompis** | valv | Valv `kunskapsbank` | Kunskapsvalv, Tidshjul, RAG | `Kunskap-SPEC.md` | `smoke:kunskap`, `smoke:tidshjul` |
| **wellbeing/economy** | vardag | `/liv?tab=kompasser&vardagenTab=ekonomi`, `/ekonomi` → redirect | Veckopeng, matlåda, sparmål (`EconomySavingsPanel`) | `Ekonomi-SPEC.md` | manuell #18 · `smoke:arbetsliv` |
| **diary/diary** | hjärtat | `/dagbok` | Hjärtat-hub, journal | `Dagbok-SPEC.md` | — |
| **evidence/vault** | valv | `/dagbok?tab=bevis`, `/valv` | WORM, Mönster, Orkester, Vävaren HITL, PIN | `Verklighetsvalvet-SPEC.md` | `smoke:locked-ux`, `smoke:valv` |
| **evidence/vaultChat** | valv | Bevis → Sök | Valv-Chat (egen silo) | `Valv-Chat-SPEC.md` | `smoke:valv` |
| **diary/mirror** | hjärtat | `/dagbok?tab=speglar` | Speglar, Zero Footprint | `Speglar-SPEC.md` | `smoke:speglar` |
| **family/safeHarbor** | hamn | `/hamn` | BIFF, Grey Rock, `TryggHamnHub` | `SafeHarbor-SPEC.md` | `smoke:design-modules` |
| **family/children** | familj | `/familjen` | Barnfokus, livslogg | `Barnen-SPEC.md` | `smoke:locked-ux`, `smoke:children` |
| **barnporten** | plan | (PWA `/barnporten`) | HITL promote — delvis | `BARNPORTEN-SPEC.md` | `smoke:locked-ux` |
| **wellbeing/mabra** | vardag | `/liv?tab=mabra`, legacy `/mabra` → redirect | Daglig Mix, KBT, immersive tools | `Mabra-SPEC.md` | `smoke:mabra` |
| **admin/planning** | livsos | `/planering` | P3 Kanban | `PLANERING-P3-KANBAN-SPEC.md` | `smoke:locked-ux` |
| **admin/projects** | livsos | `/projekt` | Projekt + block | `PROJEKT-SPEC.md` | hybrid |
| **evidence/vault/dossier** | valv | `/dossier` | Dossier-Generator | `Dossier-SPEC.md` | `smoke:dossier` |
| **widgets** | övrigt | `/widget/*` | WH1 inspelning | `WIDGET-BAR-SPEC.md` | `smoke:locked-ux` |
| **admin/stampla** | arbetsliv | `/arbetsliv?tab=stampla` | Stämpelklocka | `stampla/module_plan.md` | `smoke:stampla` |
| **arbetsliv** | arbetsliv | `/arbetsliv`, `/liv?tab=arbetsliv&workTab=…` | Tid, logg, lönespec vardag, Valv-länkar | `arbetsliv/module_plan.md` | `smoke:arbetsliv` |
| **drogfrihet** | livsstod | `/drogfrihet` | Idag, stöd, reflektion | `Drogfrihet-SPEC.md` | — |
| **inkast** | hem | `/#inkast-lite` | Smart Inkast Lite (G10 · **låst** 2026-06-06) | [`2026-06-06-inkast-lockdown.md`](./evaluations/2026-06-06-inkast-lockdown.md) | `smoke:inkast` · `smoke:inbox` |

---

## Backend callables (urval)

| Callable | Silo / roll |
|----------|-------------|
| `knowledgeVaultQuery` | Kunskap RAG |
| `valvChatQuery` | Valv RAG |
| `childrenLogsQuery` | Barnen RAG |
| `analyzeMessage` | BIFF / analys (Hamn, Valv Orkester) |
| `notifyNewFile` | Drive webhook → synapse |
| `ingestWidgetRecording` | WH1 → `reality_vault` |
| `generateDossier` | Dossier snapshots |
| `weaveJournalEntry` | Vävaren async → `weaver_pending` (HITL) |
| `approveWeaverMetadata` / `rejectWeaverMetadata` | Vävaren godkänn/avvisa → `reality_vault` metadata |
| `journalWovenToKampspar` | Dagbok → minne (opt-in) |
| `speglingsMirror` | Speglar |
| `mabraCoach` | MåBra |
| `invalidateSession` | Zero Footprint |
| `getInboxQueue` / `confirmInboxItem` | Självsorterande inkorg (G10) |
| `getEntityProfileRegistry` | Entiteter (G9) |
| `addEntityProfile` | Manuell aktör — append-only metadata (G9) |

Full lista: `functions/src/index.ts` · live deploy: [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md)

---

## Sacred Features (oförändrade)

Verklighetsvalvet · Sanningens Sköld · Morgonkompassen · Dossier-Generator · Speglings-Systemet · Zero Footprint · Kill Switch — [`.context/security.md`](../.context/security.md)

---

## Implementation kö

| Register | Syfte |
|----------|--------|
| [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) | G1–G16 **done** (kod) |
| [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) | Live moln |

**Öppet (produkt):** manuell smoke #3, #4, #2d — [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) **Current truth**; opt-in minne-ingest; Barnporten full PWA-route. **Modul-GAP-översikt:** [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md).

---

## Parked (git — ej på main)

| Branch | Innehåll |
|--------|----------|
| `feat/mabra-fragekort` | Frågekort — produktbeslut |
| `feat/*` inkorg | Se [`BRANCH-KARTA.md`](./BRANCH-KARTA.md) |

---

# INNEHALL-REGISTER

_Källa: `docs/INNEHALL-REGISTER.md`_

# Innehållsregister — fakta, lek och utveckling (1 sida)

**Version:** 2026-05-27 · **Status:** **LÅST** med Grunder **U6** (`.cursor/rules/grunder-kanon.mdc`, `.cursor/rules/innehall-register.mdc`).

**Syfte:** Hålla isär **fakta**, **reflektion/lek** och **bevis** så LLM inte blir sanning. Ingen fjärde RAG-silo — **Utvecklingszon (Vit)** utan cross-RAG. **Smoke:** `npm run smoke:innehall`.

**Dirigent:** `.cursor/agents/specialist-innehall-dirigent.md` · **Kanon silos:** [`.context/arkiv-minne.md`](../.context/arkiv-minne.md) · **Röda tråden:** [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md)

---

## Tre RAG-silor + en utvecklingszon

| Zon | `content_class` | Data (Firestore) | RAG / callable | Kurator-agent |
|-----|-----------------|------------------|----------------|---------------|
| **Kunskap** | `FACT` | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | `specialist-kunskap-seed` |
| **Valv** | `EVIDENCE` | `reality_vault` | `valvChatQuery` | *(ingen content-kurator — bevis via ingest/HITL)* |
| **Barnen** | `EVIDENCE` + `PLAY` | `children_logs` | `childrenLogsQuery` | `specialist-barn-lek` **aktiv** |
| **Utveckling (Vit)** | `REFLECTION`, `PLAY` | `mabra_sessions`, `vit_hub` / `vit_entries` *(P1)* | **Ingen** export till Kunskap | `specialist-mabra-curator` |

**MUST NOT:** `FACT` i MåBra-bank utan ingest till Kunskap · `PLAY` i `reality_vault` · auto-ingest Vit → Vector Search · “sök överallt”-UI.

---

## `content_class` — snabbgrind

| Klass | Exempel | LLM i produktion |
|-------|---------|------------------|
| **FACT** | Lagstöd, metod, diagnos-info med tier | RAG + citation JSON |
| **REFLECTION** | Frågekort, självkänsla, KBT light | Parafras KEEP + `bankId` |
| **PLAY** | Microlek ≤2 min, offline | Deterministisk UI, ingen sanning |
| **EVIDENCE** | SMS, möte, observation barn | WORM, dossier — **inte** kurator-lek |

**Skoj + fakta samma dag:** OK i UX · **inte** i samma post utan klass + **inte** i samma RAG-query.

---

## Content-banker (dokument → kod)

| Bank | Fil | Status | Implementation |
|------|-----|--------|----------------|
| MåBra | [`specs/modules/Mabra-CONTENT-BANK.md`](./specs/modules/Mabra-CONTENT-BANK.md) | **aktiv** | P1: `vit_entries` + `bankId` |
| MåBra Daglig mix | [`specs/modules/Mabra-CONTENT-BANK.md`](./specs/modules/Mabra-CONTENT-BANK.md) § Daglig mix | **aktiv** | `dagligMixCatalog.ts` · DM-* · ingen streak/RAG |
| Drogfrihet | [`specs/modules/Mabra-CONTENT-BANK.md`](./specs/modules/Mabra-CONTENT-BANK.md) § Drogfrihet + [`Drogfrihet-SPEC.md`](./specs/modules/Drogfrihet-SPEC.md) | **aktiv** | `drogfrihetCatalog.ts` · DF-REF-* · hub `/drogfrihet` |
| Kunskap seed | [`specs/modules/Kunskap-CONTENT-SEED.md`](./specs/modules/Kunskap-CONTENT-SEED.md) | **aktiv** | 117 FACT manifest · våg 26 ingest **PASS** 2026-06-16 · [`CONTENT-WAVES.md`](./content/CONTENT-WAVES.md) |
| Barnen lek | [`specs/modules/Barnen-PLAY-BANK.md`](./specs/modules/Barnen-PLAY-BANK.md) | **aktiv** | `barnfokusCatalog.ts` BP-PLAY-01..21 · ej Valv-promote |

**Fält per KEEP-post (alla banker):** `id`, `status`, `content_class`, `source_tier`, `text_sv`, `why`.

---

## Dirigent — när du är osäker

| Du säger / har | Dirigent pekar till |
|----------------|---------------------|
| “Kurera frågekort / självkänsla / lek” | `kör mabra curator` |
| “Fakta, artikel, referens till Kunskap” | `kör kunskap seed` |
| “Barnfråga, lek med pojkarna” | `kör barn lek` *(när bank finns)* |
| “SMS, bevis, dossier” | **Hamn / Valv** — ingen innehållskurator |
| “Ex, gaslighting, BIFF” | **Speglar / Hamn** — ROUTE_SPEGLAR |

Trigger: `dirigera innehåll: …` · Agent: `specialist-innehall-dirigent`

---

## Runtime (ändras inte av kuratorer)

| Roll | Var | Läser bank? |
|------|-----|-------------|
| Måbra-coach | `mabraCoach` | Parafras MåBra KEEP |
| KBT-Transformator | `mabraCoach` transformator | Reframing, ej ny fakta |
| Livs-Arkivarien | Kunskap RAG | `kampspar` / `kb_docs` |
| Paralys / Uppgifts | ADK / Planering | Ej content-bank |

Prompts: endast `functions/src/sharedRules.ts`.

---

## Smoke (efter kod som rör zon)

| Zon | Kommando |
|-----|----------|
| MåBra | `npm run smoke:mabra` |
| Kunskap | `npm run smoke:kunskap` |
| Låst UX (Barnfokus) | `npm run smoke:locked-ux` |
| Silo-grind | `npm run smoke:orkester` |

---

## Kunskap seed — KEEP 2026-05-29

**Kurator:** `specialist-kunskap-seed` · **Klass:** FACT · **Silo:** `kampspar` / `kb_docs` · **Callable:** `knowledgeVaultQuery` only.

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-001 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-002 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-003 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-004 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-005 | FACT | P1 | KEEP | kommunikation_metod |
| kunskap-fact-006 | FACT | P1 | KEEP | kommunikation_metod |
| kunskap-fact-007 | FACT | P2 | KEEP | barn_neuro |
| kunskap-fact-008 | FACT | P2 | KEEP | barn_neuro |
| kunskap-fact-009 | FACT | P1 | KEEP | ekonomi_vardag |
| kunskap-fact-010 | FACT | P2 | KEEP | juridik_logistik |
| kunskap-fact-011 | FACT | psychoeducation_general | KEEP | medforaldraskap |
| kunskap-fact-012 | FACT | psychoeducation_general | KEEP | medforaldraskap |
| kunskap-fact-013 | FACT | product_copy | KEEP | juridik_overview |
| kunskap-fact-014 | FACT | psychoeducation_general | KEEP | medforaldraskap |
| kunskap-fact-015 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-016 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-017 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-018 | FACT | psychoeducation_general | KEEP | adhd_vardag |
| kunskap-fact-019 | FACT | P2 | KEEP | adhd_vardag |
| kunskap-fact-020 | FACT | psychoeducation_general | KEEP | adhd_vardag |
| kunskap-fact-021 | FACT | psychoeducation_general | KEEP | adhd_vardag |
| kunskap-fact-022 | FACT | product_copy | KEEP | produkt_sakerhet |
| kunskap-fact-023 | FACT | product_copy | KEEP | produkt_arkitektur |
| kunskap-fact-024 | FACT | P2 | KEEP | medforaldraskap |
| kunskap-fact-025 | FACT | product_copy | KEEP | dagbok_produkt |
| kunskap-fact-df-001 … 006 | FACT | P1/P2 | KEEP | beroende |

**Kanon i bank:** [`specs/modules/Kunskap-CONTENT-SEED.md`](./specs/modules/Kunskap-CONTENT-SEED.md) — batchar 2026-05-27, 2026-05-29, våg 24 (2026-06-15).

### Våg 24 ingest (2026-06-15)

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-jur-005 | FACT | P2 | **ingest** | juridik_overview |
| kunskap-fact-jur-006 | FACT | P2 | **ingest** | juridik_overview |
| kunskap-fact-jur-007 | FACT | P2 | **ingest** | juridik_overview |
| kunskap-fact-ep-006 | FACT | P2 | **ingest** | epistemik_produkt |
| kunskap-fact-cn-022 | FACT | P1 | **ingest** | covert_taktik |
| kunskap-fact-bh-013 | FACT | P2 | **ingest** | barn_hcf |

**MUST NOT:** ingest utan mänsklig granskning · BIFF-svar på konkret sms (→ Speglar/Hamn) · cross-RAG till `reality_vault` / `children_logs`.

### Våg 25 ingest (2026-06-16)

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-soc-001 | FACT | P2 | **ingest** | myndighet_soc |
| kunskap-fact-skol-001 | FACT | P2 | **ingest** | skola_myndighet |
| kunskap-fact-bup-001 | FACT | P2 | **ingest** | barn_hcf |
| kunskap-fact-bh-014 | FACT | P2 | **ingest** | barn_hcf |
| kunskap-fact-ep-007 | FACT | P2 | **ingest** | epistemik_produkt |
| kunskap-fact-jur-008 | FACT | P2 | **ingest** | juridik_overview |

### Våg 26 ingest (2026-06-16)

| id | content_class | source_tier | status | category |
|----|---------------|-------------|--------|----------|
| kunskap-fact-cop-001 | FACT | P2 | **ingest** | medforaldraskap_logistik |
| kunskap-fact-cop-002 | FACT | P2 | **ingest** | medforaldraskap_logistik |
| kunskap-fact-cop-003 | FACT | P2 | **ingest** | medforaldraskap_logistik |
| kunskap-fact-cop-004 | FACT | P2 | **ingest** | medforaldraskap_logistik |
| kunskap-fact-cop-005 | FACT | P1 | **ingest** | kommunikation_metod |
| kunskap-fact-ep-008 | FACT | P2 | **ingest** | epistemik_produkt |

---

## Nästa steg (implementation)

1. ~~P1 `vit_hub` / `vit_entries` från MåBra-bank~~ — **done** våg 9 (2026-06-06)  
2. ~~Exportera `kunskap-fact-001`–`010` till JSON-manifest → `seed_kampspar_profile.mjs`~~ — **done** våg 8  
3. ~~P2 Valv-flik «Mitt Vit» + statistik~~ — **done** våg 10 (2026-06-06)  
4. ~~P3 «Lär tillsammans» chatt via `mabraCoach` + silo-guard~~ — **done** våg 11 (2026-06-06)  
5. ~~PDF-export Mitt Vit / känslominne-UI~~ — **done** våg 12 (2026-06-06)  
6. ~~Minnes-filter / polish i Valv Mitt Vit~~ — **done** våg 13 (2026-06-06)  
7. ~~Harmonisera Vit-hub copy: ingen skuld-streak~~ — **done** våg 14 (2026-06-06)  
8. ~~Vit översikt P4 — senaste 3 + MåBra→Valv bro~~ — **done** våg 15 (2026-06-06)

**Utskrift:** lägg vid [`SKOGSPAKET-LATHUND.md`](./SKOGSPAKET-LATHUND.md) om du jobbar på distans.

---

# gap-matrix-2026-06-16

_Källa: `docs/external-ai/imports/gap-matrix-2026-06-16.md`_

# Gap-matris — GPT Life OS vs Livskompassen3.0

**Datum:** 2026-06-16 · **Källor:** GPT-mockup, `deep-research-ide.md`, PHASE-09 steg 1–3  
**Stack-beslut:** React + Vite + Capacitor KEEP — Flutter/RN REJECT  
**Leveranser:** [`steg1`](../leveranser/2026-06-16-fas-09-gap-steg1.md) · [`steg2`](../leveranser/2026-06-16-fas-09-gap-steg2-wave2-polish.md) · [`steg3`](../leveranser/2026-06-16-fas-09-gap-steg3-leverans.md) · [`vision`](../leveranser/2026-06-16-fas-09-life-os-vision.md)

---

## KEEP (redan rätt — lås)

| Område | Repo |
|--------|------|
| 4 zoner + bakgrunds-Fyren | `navTruth.ts`, supermodule-ui-masterplan |
| InputSuperModule (7 hubs + 6 routers) | `src/modules/**` |
| Obsidian `#020617`–`#050b14` + guld `#d4af37` | `index.css`, COLOR-POLICY |
| Cinzel hub-rubriker (`font-display-serif`) | `typeScale.ts` — inte Cormorant i prod |
| P3 Kanban `/planering?tab=handling` | Locked UX §14 |
| Valv B1 LOCK | `ValvInputSuperModule`, WORM |
| Tre silos, no cross-RAG | grunder-kanon |
| 4-zons dock + Fyren center-handle | `FloatingDock.tsx` |
| Privat single-user, anti-XP | Governance |
| Aktiv flik-linje guld (ej fylld teal-knapp) | MENU-DRAWER-KANON |

---

## Gap per zon (PHASE-09 steg 1)

| Zon | KEEP | DEFER | REJECT |
|-----|------|-------|--------|
| Idé | Silos, AI-prompt backend | AI-assistent UI | — |
| UX-flöde | Barnfokus, P3 Kanban | Daglig linje, UX-diagram | — |
| UI-design | Obsidian Calm, tokens | Wave-2 polish | Teal primär chrome, hårdkodade hex |
| Wireframes | 4-tab nav, modulskärmar | States, hover | 5-tab nav, Hem→Hjärtat utan PMIR |
| Designsystem | Struktur, låsta ikoner | States, mikrocopy | — |
| Navigation | Kompass, max 4 flikar | — | Cross-RAG nav, Hem→Hjärtat merge |
| Sammanfattning | Privat, fokus, anti-XP | — | — |

---

## BUILD (nästa — i ordning)

| # | Vad | Gate | Status 2026-06-16 |
|---|-----|------|-------------------|
| 1 | Nav Våg 3 H1–H4 | PMIR | **Implementerad** — [`nav-vag3-pmir`](../../evaluations/2026-06-16-nav-vag3-pmir.md) |
| 2 | Fas 19.3 hex→tokens | Efter Våg 3 smoke | **Våg 1 klar** — zon-shells + accent-alpha tokens |
| 3 | Fas 19.2 MåBra hybrid-8 | Efter tokens | **Klar** — 8 pelarkort + zon-shell tokens |
| 4 | Upload unified steg 2 | Efter 19.2 | WIP |
| 5 | UI wave-2 polish | Efter tokens — se lista nedan | SPEC klar (steg 2) |
| 6 | Life OS-loop copy/routing | Efter polish | DEFER |

### BUILD #5 — wave-2 polish (DEFER, ej prod än)

**Idé/moduler:** expanders per modul · status-ikonindikatorer · «Endast för mig»-badge  
**UX-flöde:** flödespilar · guld/cream position-highlight · tooltips · «dagens röda tråd»-banner  
**UI:** guldaccent aktiv/notis · dim gray microcopy/disabled  
**Wireframes:** knappstates (pressed/focus) · bildinlägg-ram i dagbok · nav-skugga dark mode  
**Komponenter:** sekundär glow hover · kort-ikonknappar · mikrocopy · guld loading-spinner  
**Navigation:** notis-badge på Mer · utökad touch-yta  
**Sammanfattning:** guld-checklista (utan wow-animation)

**Zon-wireframes (repo):** se [`2026-06-16-fas-09-life-os-vision.md`](../leveranser/2026-06-16-fas-09-life-os-vision.md) § B1–B4.

---

## DEFER

- Hem `/` → Hjärtat merge (egen PMIR)
- AI-assistent UI (väntar `sharedRules.ts` prompt-policy)
- Fyren global kapacitetsmotor (Våg C)
- M3.0-C Fitness/Näring
- Design-arkiv ~400 filer (hygiene våg D, PMIR)
- Detox e2e / Flutter CI
- Kanban flip cards (ny interaktionsmodell — P3 låst)
- Wow-faktor-animationer (ADHD-säkerhet)
- Liten kompassikon vid punktlista (D1 — kräver godkännande)

---

## REJECT

| Förslag | Skäl |
|---------|------|
| Flutter / React Native omskrivning | Stack + Capacitor investerat |
| Teal `#2E6466` / mid-teal som aktiv chrome eller gradient-bakgrund | COLOR-POLICY |
| Ljus/nature-tema | Obsidian Calm lock |
| GPT 5-tab nav (Home\|Plan\|Fyren\|Journal\|More) | Dock+drawer kanon |
| Ta bort Handling-slot / P3 | Locked UX |
| Cross-RAG / auto-promote barn→Valv | U1 + locked UX |
| Streak/XP / gamification-ton | Governance |
| Kompass-rotation vid appstart | D1 `LivskompassMark` låst |
| Hem→Hjärtat merge utan PMIR | Superhub-beslut |

---

## GPT-mockup → repo-mappning

| Mockup | Repo idag | Åtgärd |
|--------|-----------|--------|
| Hem + dagens fokus | `/` Capture + Hjärtat | Polish; merge DEFER |
| Planering 3 kolumner | P3 Kanban | Polish only (ej flip cards) |
| Dagbok | `/hjartat?tab=reflektion` | KEEP |
| Familj | `/familjen` superhub | Wave-2 polish |
| Ekonomi | `/vardagen?tab=ekonomi` | Våg 3 redirect |
| Valvet | `/valvet` B1 LOCK | Visuell förfining only |
| Bottom nav 5 ikoner | Dock 4 + drawer | Mappa intent, ej 1:1 |

---

# security (Layered Defense)

_Källa: `.context/security.md`_

# Säkerhet, Biometri och Integritet

Säkerheten i Livskompassen v2 är rigorös på grund av hanteringen av djupt personlig psykologisk data. **Mock-säkerhet är strängt förbjudet.**

**Relaterat:** [`.context/arkiv-minne.md`](./arkiv-minne.md) · [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md) · [`docs/SMOKE_CHECKLIST.md`](../docs/SMOKE_CHECKLIST.md) · [`docs/specs/modules/Arkiv-GAP-REGISTER.md`](../docs/specs/modules/Arkiv-GAP-REGISTER.md)

---

## Layered Defense (försvar i lager)

| Lager | Mekanism | Kod / regler |
|-------|----------|--------------|
| 1 — Identitet | Firebase Auth + `ownerId`/`userId`; prod: `VITE_REQUIRE_EMAIL_AUTH=true` | `firestore.rules`, `AuthGate`, `requireEmailAuth.ts` |
| 2 — Åtkomst | WORM append-only; inga client-updates på bevis | `firestore.rules` (`update, delete: if false`) |
| 3 — Kryptering | CMEK via Cloud KMS (crypto-shredding) | `scripts/setup_gcp_cmek.sh` |
| 4 — Session | Draft Layer (IndexedDB utkast) + Valv idle timeout + Device Clear | `clearDeviceSession`, `useZeroFootprint` idle |
| 5 — AI-gräns | LLM får aldrig styra auth, ägarskap eller WORM | DCAP, Gräns-Arkitekten, `sharedRules.ts` |
| 6 — Silo | Tre kunskapsytor — **MUST NOT** blanda RAG | Se § Tre silor |
| 7 — Nödutgång | Device Clear (Inställningar) + WebAuthn gate | Fyren, `clearDeviceSession` |

**Regel:** Varje ny feature måste passera minst lager 1, 2, 5 och 6 innan deploy.

---

## Sacred Features — register och verifiering

Dessa funktioner får **inte** försvagas eller mockas. Verifiera via [`docs/SMOKE_CHECKLIST.md`](../docs/SMOKE_CHECKLIST.md) efter varje deploy.

| Sacred Feature | Vad den skyddar | Verifiering |
|----------------|-----------------|-------------|
| **Verklighetsvalvet** | WORM-bevis (`reality_vault`), long-press + PIN/WebAuthn | Smoke #2, #11, #16–17 |
| **Sanningens Sköld** | Evidenslagring utan redigering/radering | WORM rules + `reality_vault` create-only |
| **Morgonkompassen** | Daglig orientering utan överbelastning | `/kompasser` check-in → `checkins` |
| **Dossier-Generator** | Immutable export (`dossier_snapshots`) | `generateDossier` smoke PASS |
| **Speglings-Systemet** | Validering utan fixande; lokal session tills rensning | Smoke #9, #14–15 |
| **Draft Layer** | Utkast i IndexedDB tills sync eller «Rensa enheten» | `src/modules/capture/` |
| **Device Clear** | Frivillig lokal rensning (ersätter Kill Switch) | Inställningar → Rensa enheten |

**Permanent minne:** WORM-collections (`children_logs`, `reality_vault`, `journal`, `dossier_snapshots`) raderas **aldrig** av retention. Se [`.context/arkiv-minne.md`](./arkiv-minne.md).

---

## Tre silor (MUST NOT blandas)

| Silo | Firestore | RAG callable | Agent |
|------|-----------|--------------|-------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | Livs-Arkivarien |
| Valv | `reality_vault` | `valvChatQuery` | Sannings-Analytikern |
| Barnen | `children_logs` | — (Dossier read) | Mönster-Arkivarien (planerad) |

**Blocker:** Cross-silo RAG är ett säkerhetsbrott. Vävaren (`weaveJournalEntry`) taggar metadata — skild från användar-facing chat.

---

## Session, Draft Layer och Device Clear

- **Draft Layer:** Capture-utkast sparas i IndexedDB tills sync eller «Rensa enheten».
- Valv-unlock hålls i session; idle timeout 1 h (`useZeroFootprint`).
- **`invalidateSession`** vid utloggning och Device Clear — rensar server-side Vertex/ADK cache.
- **Kill Switch (skaka) borttagen** 2026-06-01 — ensam-boende; använd Inställningar → Rensa enheten.
- **Förbjudet:** Cross-RAG; etiketter («narcissist») som WORM-fakta utan granskning.

---

## WebAuthn och Fyren

- **WebAuthn Passkeys:** Privat nyckel lämnar aldrig Secure Enclave/TPM.
- **Long-press Fyren (3s):** Gate till Verklighetsvalvet.

---

## WORM och Firestore

Append-only collections (create ja, update/delete nej):

- `reality_vault`, `journal`, `children_logs`, `dossier_snapshots`, `checkins`, `transactions`
- `kampspar` / `kb_docs`: WORM create; separat retention tillåten (ersätter **inte** barn/valv)

**Retention:** `scheduledRetentionJob` (G5 **done**) — allowlist exkluderar permanent minne.

**Källkod:** [`firestore.rules`](../firestore.rules)

**Fas 1.3 (2026-06-11):** WORM-silos kräver `email_verified` för Google/e-post, eller anonym provider (dev). Create validerar `keys().hasOnly([...])` per collection (1.6).

**Fas 1.4–1.5:** App Check + rate limits på LLM-callables — se [`docs/DEPLOY.md`](../docs/DEPLOY.md) § Fas 1.

---

## Callable Functions — auth-krav

| Function | Auth | Silo / anteckning |
|----------|------|-------------------|
| `knowledgeVaultQuery` | Firebase Auth | Kunskap |
| `valvChatQuery` | Firebase Auth | Valv only |
| `analyzeMessage` | Firebase Auth | Safe Harbor / BIFF |
| `generateDossier` | Firebase Auth | Läser WORM, skriver snapshot |
| `speglingsMirror` | Firebase Auth | Zero Footprint session |
| `mabraCoach` | Firebase Auth | Opt-in coach |
| `notifyNewFile` | **Webhook secret** | Drive → `kb_docs`; fail-closed utan secret |
| `issueVaultSession` | Firebase Auth + **WebAuthn (server)** | Valv server-session efter Fyren |
| `beginVaultWebAuthnChallenge` | Firebase Auth | WebAuthn challenge före Valv-session |
| `invalidateSession` | Firebase Auth | Zero Footprint (server cache wipe) |
| `approveWeaverMetadata` / `rejectWeaverMetadata` | Firebase Auth | Vävaren HITL → `reality_vault` metadata |

**Live inventering:** [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md)

---

## Kryptografisk säkerhet via CMEK

- **Cloud KMS:** Customer-Managed Encryption Keys för Firestore och Storage där policy kräver det.
- **Crypto-shredding:** Nyckelrotation/invalidering = omedelbar dataförstöring.
- **Spårbarhet:** Cloud Logging för alla KMS-operationer.

---

## GDPR och AADC (Children's Code)

- **AADC:** High privacy by default. Profilering och geolokalisering avstängt som standard.
- **Transparens:** Användare informeras om hur AI processar data.
- **Lagring:** Interaktionsloggar får inte sparas på obestämd tid (utom WORM permanent minne enligt arkitekturinvariant).
- **Barnen:** `children_logs` — extra strikt ägarskap; ingen cross-silo RAG.

---

## Skydd mot manipulation (DCAP)

Digital Conversation Analysis Pipeline skyddar mot psykologiskt missbruk och projektion.

1. **Explicit (Regex):** Direkta språkliga indikatorer på bristande empati.
2. **Implicit (Domain-adapted BERT):** Kontext över tid (DARVO m.m.).
3. **Åtgärd:** Grey Rock-coachning via Kompis/Safe Harbor.

---

## Indirekt prompt injection ↔ projektion (G10)

- **Paritet:** Samma försvarslager som mot gaslighting/DARVO — indirekt prompt injection (dolda instruktioner i Drive-dokument, SMS, mejl) behandlas som **projektion/manipulation**, inte systeminstruktion.
- **Deterministisk kod:** LLM-output får aldrig styra auth, dataägarskap eller WORM-beslut. DCAP + Gräns-Arkitekten körs före routing; injicerad text saneras till Clean Input.
- **Kanon:** Grunder slide G10 · [`GRANS_ARKITEKTEN_SYSTEM_PROMPT`](../functions/src/sharedRules.ts)

---

## Öppna säkerhets-GAP (spåras)

| ID | Beskrivning | Status |
|----|-------------|--------|
| U5.5 | Kompis → Barnen routing guard | **delvis** — `barnenModuleRouteGuard.ts` i `knowledgeVaultQuery` |
| U2.5 | HITL för känsliga exports | **done** — approveWeaverMetadata hanterar HITL |
| Zero Footprint logout | `signOutUser` utan `invalidateSession` | **done** — `authService.ts` anropar `invalidateServerSession` |
| Valv WebAuthn bypass | `issueVaultSession` utan biometri | **done** — server verifierar via `vaultWebAuthn.ts` |
| Manuell smoke app | #3 Valv, #4 Barnen, #2d | **USER** — se [`SMOKE_RESULTS.md`](../docs/SMOKE_RESULTS.md) |
| App Check på callables | LLM/Valv utan enhetsattest | **done (kod)** — `APP_CHECK_ENFORCE=true` + Console pending |
| Rate limits LLM | DoS på Vertex/Gemini | **done (kod)** — `_rate_limits` + `callableGuards.ts` |
| Anonym auth + WORM | Prod ska kräva e-post | **delvis** — `VITE_REQUIRE_EMAIL_AUTH` + rules `isSensitiveAuth` |
| WORM shadow fields | Extra fält på create | **done** — `keys().hasOnly` i rules |

G7–G16 backend: **done** — [`Arkiv-GAP-REGISTER.md`](../docs/specs/modules/Arkiv-GAP-REGISTER.md)

---

## Pre-deploy checklist (kort)

1. `cd functions && npm run build` — exit 0
2. `npm run build` (frontend) — exit 0
3. Inga prompts utanför `functions/src/sharedRules.ts`
4. Inga secrets i git
5. Kör relevanta rader i [`docs/SMOKE_CHECKLIST.md`](../docs/SMOKE_CHECKLIST.md)
6. Jämför functions-lista mot [`docs/GCP-INVENTORY-LATEST.md`](../docs/GCP-INVENTORY-LATEST.md)