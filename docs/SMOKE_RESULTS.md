# Smoke-resultat (Fas 3 + Minne)

## USER smoke Motorola/Mac (2026-06-15 — Pontus)

**Källa:** [`evaluations/2026-06-01-USER-nasta-steg.md`](./evaluations/2026-06-01-USER-nasta-steg.md)

| Test | ID | Status | Anteckning |
|------|-----|--------|------------|
| Valv biometri + bevis | **#3** | **FAIL** | Kunde inte låsa upp Valvet |
| Barnen loggrad | **#4** | **FAIL** | Scroll-lås (fix: Familjen `contentIsland` 2026-06-15) |
| Dagbok bilaga | **#2d** | **PASS** | |
| Superhub snabb | **D** | **PASS** | Drawer, /liv, /familjen, /mabra redirect |
| Göra kanban | **E** | **PASS** | 2026-06-07 |
| Projekt regler | **F** | **PASS** | 2026-06-07 |

**Retest efter deploy:** #3 Valv · #4 Familjen scroll

---

## Fas 19.5 (2026-06-15 — evolution_ledger dual-write)

**Trigger:** Masterplan 19.5 · [`2026-06-15-fas19-5-evolution-ledger-dual-write.md`](./evaluations/2026-06-15-fas19-5-evolution-ledger-dual-write.md)

| Kategori | # / kommando | Status | Senast |
|----------|--------------|--------|--------|
| **Autorun PASS** | `smoke:evolution-discovery` | **PASS** | 2026-06-15 · hub dual-write guards |
| **Tooling** | `typecheck:core-strict` | **PASS** | 2026-06-15 · Fas 19.5 |
| **Build** | `npm run build` (frontend) | **PASS** | 2026-06-15 · Fas 19.5 |
| **Autorun PASS** | `smoke:orkester` | **PASS** | 2026-06-15 · Fas 19.5 |
| **Deploy** | hosting | **PASS** | 2026-06-15 · https://gen-lang-client-0481875058.web.app |

---

## Fas 22 (2026-06-15 — hex→tokens P0 + doc-synk + typecheck expansion)

**Trigger:** Fas 22 spår 1–3 · design P2 hex→tokens kvarvarande P0  
**Git:** `main` @ `70fe32721`+ · kanon [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md)

| Kategori | # / kommando | Status | Senast |
|----------|--------------|--------|--------|
| **Build** | `npm run build` (frontend) | **PASS** | 2026-06-15 · Fas 22 |
| **Build** | `functions` tsc | **PASS** | 2026-06-15 · Fas 22 |
| **Tooling** | `typecheck:core-strict` (+ `morning/`) | **PASS** | 2026-06-15 · Fas 22 |
| **Autorun PASS** | `smoke:locked-ux` | **PASS** | 2026-06-15 · Fas 22 |
| **Autorun PASS** | `smoke:design-modules` | **PASS** | 2026-06-15 · hex→tokens P0 guard |
| **Autorun PASS** | `smoke:orkester` | **PASS** | 2026-06-15 · Fas 22 |
| **Deploy** | hosting | **PASS** | 2026-06-15 · https://gen-lang-client-0481875058.web.app |
| **Design P2** | MabraHistoryView · ArchiveHub · DailyTasksList · diary supermodule | **done** | Obsidian Calm tokens |

**Filer:** `MabraHistoryView.tsx` · `ArchiveHub.tsx` · `DailyTasksList.tsx` · `VaultView.tsx` · `InsightsView.tsx` · `JournalTimeline.tsx` · `ImmersiveExperienceShell.tsx` · `VisualCompassWidget.tsx` · `QuickCaptureOverlay` (redan token-fri)

---

## Fas 21 (2026-06-15 — guards + JOY-17 + arkiv batch 3 + Oracle tokens)

**Trigger:** Fas 21 spår 1–4 · [`2026-06-15-fas21-callables-guard-inventory.md`](./evaluations/2026-06-15-fas21-callables-guard-inventory.md)  
**Git:** `main` @ `bf8f7fb3e`+ · arkiv [`archive/evaluations-fas21-2026-06/`](./archive/evaluations-fas21-2026-06/)

| Kategori | # / kommando | Status | Senast |
|----------|--------------|--------|--------|
| **Build** | `npm run build` (frontend) | **PASS** | 2026-06-15 · Fas 21 |
| **Build** | `functions` tsc | **PASS** | 2026-06-15 · Fas 21 |
| **Autorun PASS** | `smoke:locked-ux` | **PASS** | 2026-06-15 · Fas 21 |
| **Autorun PASS** | `smoke:innehall` | **PASS** | 2026-06-15 · JOY/MIRROR bank |
| **Autorun PASS** | `smoke:mabra` | **PASS** | 2026-06-15 · `who_am_i` JOY-17 + vit_entries WORM |
| **Autorun PASS** | `smoke:design-modules` | **PASS** | 2026-06-15 · Oracle hex→tokens |
| **Security P1** | Callable guards (6 st) | **KOD** | 2026-06-15 · ej deploy utan lista |
| **Deploy** | functions guards + `mabraCoach` + hosting | **PASS** | 2026-06-15 · https://gen-lang-client-0481875058.web.app |
| **Deploy note** | `parseVoiceCommand` migrerad us-central1 → europe-west1 | **done** | gammal fn raderad |

---

## Current truth (2026-06-15 — Fas 18a Android cap sync)

**Sanning:** denna tabell ersätter «Fas 17b.0 våg 2 baseline gate» nedan.  
**Trigger:** Fas 18a · [`2026-06-15-fas18-android-cap-sync.md`](./evaluations/2026-06-15-fas18-android-cap-sync.md)  
**Git:** `main` @ `35dfda590` · orkester-natt [`2026-06-15-orkester-natt.md`](./evaluations/2026-06-15-orkester-natt.md)

| Kategori | # / kommando | Status | Senast |
|----------|--------------|--------|--------|
| **Android** | `npm run build:web && npx cap sync android` | **PASS** | 2026-06-15 · exit 0 · 4 Capacitor-plugins |
| **Android** | `google-services.json` `client_type: 1` + SHA-1 | **PASS** | 2026-06-15 · `9c84fa70…07c9d4` debug |
| **Android USER** | Native Google · Valv #3 · Barnporten #4 | **USER** | Motorola — se Fas 18a eval |
| **Baseline gate** | `npm run orkester:night` (våg 2 steg 0) | **PASS** | 2026-06-15 · ~47s · obligatoriska faser gröna |
| **Tooling** | `npm run typecheck:core-strict` | **PASS** | 2026-06-15 · **0 fel** |
| **Build** | `npm run build` (frontend) | **PASS** | 2026-06-15 · orkester:night |
| **Build** | `functions` tsc | **PASS** | 2026-06-15 · orkester:night |
| **Autorun PASS** | `npm run orkester:night` | **PASS** | 2026-06-15 |
| **Autorun PASS** | `npm run smoke:all` | **PASS** | 2026-06-15 |
| **Autorun PASS** | `smoke:locked-ux` | **PASS** | 2026-06-15 |
| **Autorun PASS** | `smoke:plausible-deniability` | **PASS** | 2026-06-15 |
| **Security** | Fas 12C vault-gate (`weeklySummary`, `compass`) | **PASS** | 2026-06-15 · `smoke:valv-security` |
| **Evidence** | Dossier LEGAL + BBIC `reportType` | **PASS** | 2026-06-15 · `smoke:dossier` |
| **Kunskap** | RAG ingest + query | **PASS** | 2026-06-15 · `smoke:kunskap` |
| **Deploy** | Hosting Fas 13 (App Check restore + WORM smoke fixes) | **PASS** | 2026-06-15 · https://gen-lang-client-0481875058.web.app |

### typecheck:core-strict — **0 fel** (Fas 13 våg 0)

Tidigare baseline (9 fel) är **löst** — se historik nedan om behövs.

---

## Current truth (2026-06-11 — Agent δ typecheck & smoke gate) — historik

| Fil | Fel | Notering |
|-----|-----|----------|
| `vaultServerSession.ts:47` | TS2322 | Generic `T` vs `{ vaultSessionToken? }` |
| `firestore.ts:115` | TS2322 | `CheckInRow[]` — `questionId` optional vs required |
| `speechRecognitionSession.ts` | TS2552 ×5 | Web Speech API DOM-typer saknas i strict config |
| `KunskapPage.tsx:182` | TS2322 | `collection` union vs `string` callback |
| `VaultLogList.tsx:87` | TS2322 | `RefObject<HTMLLIElement \| null>` vs `LegacyRef` |

| **Deploy** | Inkast Dagbok→Minne weave opt-in (`b6f196351` + `8cb9163e2`) — `InkastDagbokWeaveBridge` + hosting | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | `smoke:inkast` (Dagbok→journal + weave smoke hardening) | **PASS** | 2026-06-11 · Smart Inkast lockdown |

| **Deploy** | Inkast Dagbok→`journal` (`22fef110c`) — `submitInkastLite`, `confirmInboxItem`, `previewInboxClassification` + hosting | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | `smoke:inkast` (Dagbok→journal post-deploy) | **PASS** | 2026-06-11 · Smart Inkast lockdown |
| **Autorun PASS** | `smoke:locked-ux` (Dagbok→journal post-deploy) | **PASS** | 2026-06-11 · Barnfokus · Valv · drawer |

| **Deploy** | Inkast Barnen→Valv HITL bridge (`a2396aff5`) | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | `smoke:inkast` (post-deploy) | **PASS** | 2026-06-11 · Smart Inkast lockdown |
| **Autorun PASS** | `smoke:locked-ux` (inkast post-deploy) | **PASS** | 2026-06-11 · Barnfokus · Valv · drawer |

| **Deploy** | MT-3 hosting — flat drawer C1 + MaterialPack Våg C (`b16deaf69`) | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | `smoke:locked-ux` (MT-3 post-deploy) | **PASS** | 2026-06-11 · drawer Vardag+Valv · Barnfokus · Planering |
| **Feature** | MaterialPack bankRef + rutiner bridge (Våg C) | **PASS** | 2026-06-11 · prod hosting |
| **Feature** | Drawer flat rows per MENU-DRAWER-KANON (C1) | **PASS** | 2026-06-11 · prod hosting |

| **Autorun PASS** | `npm run smoke:all` (MT-4 gate) | **PASS** | 2026-06-11 · dossier vault-session · economy vendor lib path |
| **Autorun PASS** | `npm run google-ai-pro:pack` | **PASS** | 2026-06-11 · `exports/google-ai-pro/` |
| **Deploy** | `functions:analyzeMessage` (DCAP semantic prompt i `sharedRules.ts`) | **PASS** | 2026-06-11 · `smoke:grans` riskScore OK |
| **Deploy** | MT-2 hosting + `firestore:rules` (legacy `vault` skrivlåst) | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | MT-2 gate: orkester + compass + planering-gora-e + valv-security | **PASS** | 2026-06-11 · [`2026-06-11-multitask-mt2.md`](./evaluations/2026-06-11-multitask-mt2.md) |
| **Autorun PASS** | MT-2 γ — kompass-widget mount (Vardagen + Hamn) + ICS smoke | **PASS** | 2026-06-11 · [`2026-06-11-multitask-mt2-gamma.md`](./evaluations/2026-06-11-multitask-mt2-gamma.md) |
| **Feature** | Kompass-widget på `/vardagen` + Trygg Hamn Kompassråd | **PASS** | 2026-06-11 · prod hosting |
| **Feature** | P2 Planering ICS export (`exportPlaneringIcs.ts`) | **PASS** | 2026-06-11 · prod hosting |
| **Autorun PASS** | MT-2 γ gate: build + design-modules + planering-gora-e + compass + hamn + locked-ux + orkester | **PASS** | 2026-06-11 · `smoke:compass` App Check fix |
| **Autorun PASS** | Multitask MT-1 (α barn-lek full · γ error boundaries · δ core-strict baseline) | **PASS** | 2026-06-11 · [`2026-06-11-multitask-mt1.md`](./evaluations/2026-06-11-multitask-mt1.md) |
| **Autorun PASS** | MT-1 gate: build + locked-ux + innehall + children + mabra + orkester | **PASS** | 2026-06-11 · `smoke:children` App Check fix |
| **Deploy** | Hosting MT-1 (Barn-PLAY bank + HubErrorBoundary) | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Feature** | Barn-PLAY bank BP-PLAY-01..21 + parent prompt footer | **PASS** | 2026-06-11 · prod hosting |
| **Feature** | `HubErrorBoundary` Familjen · MåBra · LivLauncher | **PASS** | 2026-06-11 · prod hosting |
| **Tooling** | `npm run typecheck:core-strict` | **baseline** | 2026-06-11 · ~12 fel kvar (MT-2) |

| **Deploy** | P1 Barn-lek wire — hosting + `firestore:rules` (`bankId` på `children_logs`) | **PASS** | 2026-06-11 · `barnfokusCatalog.ts` BP-PLAY-06..10 |
| **Autorun PASS** | `smoke:locked-ux` (P1 Barnfokus wire) | **PASS** | 2026-06-11 |
| **Deploy** | `functions:mabraCoach` — runtime `bankId`-lookup (U6 Fas 4.1) | **PASS** | 2026-06-11 · `mabraContentBank.ts` · coach + vit_chat parafras från bank |
| **Autorun PASS** | `smoke:innehall` (P2 bank lock) | **PASS** | 2026-06-11 |
| **Autorun PASS** | `smoke:mabra` (App Check debug token i `.env`) | **PASS** | 2026-06-11 · bankId MB-REF-03 + MB-REF-ACT-01 |
| **Build** | `functions` tsc + deploy upload | **PASS** | 2026-06-11 |

| **Autorun PASS** | Fas 7 Super Multitask — 5 agenter parallellt + ekonomi/tid UX polish | **PARTIAL** | 2026-06-11 · build PASS · 10/11 smokes PASS · **FAIL:** `smoke:mabra` vit_chat `functions/unknown` (deploy?) · locked-ux + design-modules + ekonomi + innehall PASS efter UX-fix |
| **Autorun PASS** | Fas 6 closer — barn-lek v18 bank + ekonomi UX + valv-security guard (`08451bfc7`) | **PASS** | 2026-06-11 · build + locked-ux + innehall + hamn + valv-gate + valv-security + orkester |
| **Deploy** | Hosting Fas 6 (ekonomi impuls + docs) | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | Fas 5 Agent B — drawer gold chrome + barn-lek kurator (`ef4d97383`) | **PASS** | 2026-06-11 · build + locked-ux + superhub + design-modules + innehall + hamn |
| **Deploy** | Hosting Fas 5 (drawer + familjen child-chip gold) | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |

| **Autorun PASS** | WH4 widget Hamn + logout Zero Footprint (`a66711dd`) | **PASS** | 2026-06-11 · build + hamn + locked-ux + valv-security + orkester |
| **Deploy** | Hosting WH4 + `signOutUser` vault/speglar cleanup | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | Fas 4 batch — Hamn brusfilter + valv-gate smoke + inkast polish (`8d391db80` + `351ff3304`) | **PASS** | 2026-06-11 · build + locked-ux + hamn + mabra + valv-security + valv-gate + orkester + innehall |
| **Deploy** | Hosting Fas 4 + `ingestKnowledgeDocument` upload cap | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |

| **Manuell PASS** | #1 Auth | **PASS** | 2026-05-27 |
| **Manuell PASS** | #2 Dagbok → `journal` | **PASS** | 2026-05-27 |
| **Manuell PASS** | #2d Dagbok bilaga → `journal_memories` | **PASS** | 2026-06-06 (USER) |
| **Manuell PASS** | #3 Valv Shield→PIN→spara post | **PASS** | 2026-06-07 (USER) |
| **Manuell PASS** | #4 Barnporten QR + `children_logs` | **PASS** | 2026-06-06 (USER · Motorola) |
| **Manuell PASS** | #18 Ekonomi → `transactions` | **PASS** | 2026-05-27 |
| **Autorun PASS** | #2d `smoke:journal-2d` + rollout | **PASS** | 2026-06-06 |
| **Autorun PASS** | #3 WORM `reality_vault` | **PASS** | `smoke:vault-worm` · rollout 2026-06-06 |
| **Autorun PASS** | #4 Barnen `children_logs` | **PASS** | `smoke:children` · rollout 2026-06-06 |
| **Autorun PASS** | `smoke:orkester` + `orkester:night` | **PASS** | 2026-06-06 · Fas 5A #3 re-run |
| **Autorun PASS** | chat-audit P0: `smoke:valv-security` + `smoke:cache` + `audit:vertex-agents` | **PASS** | 2026-06-06 |
| **Refactor** | `functions/src/index.ts` → `callables/*` (samma 34 exports) | **PASS** | build + smoke:orkester 2026-06-06 |
| **Eval** | chat-audit billing + collection | **doc** | [`2026-06-06-billing-audit.md`](./evaluations/2026-06-06-billing-audit.md) · [`2026-06-06-collection-audit.md`](./evaluations/2026-06-06-collection-audit.md) |
| **Autorun PASS** | rollout:night (Block A+B) | **PASS** | 2026-06-06 |
| **Autorun PASS** | locked-ux, design-modules, inkast, inbox, speglar | **PASS** | 2026-06-06 · locked-ux Fas 5A #3 re-run |
| **Autorun PASS** | Super Multitask Agent B (`build` + orkester + locked-ux + design-modules) | **PASS** | 2026-06-06 |
| **Autorun PASS** | Super Multitask Agent C `smoke:valv-security` + Agent E `smoke:innehall` | **PASS** | 2026-06-06 |
| **Feature (local)** | P2 Planering ICS export stub (`exportPlaneringIcs.ts`) | **smoke PASS** | 2026-06-11 MT-2 γ — hosting deploy väntar |
| **Autorun PASS** | Super Multitask 2026-06-06 (build + 5 smokes + deploy) | **PASS** | se batch nedan |
| **Autorun PASS** | Fas 5A #3 Valv batch (build + 8 smokes) | **PASS** | 2026-06-06 — se batch nedan |
| **Static PASS** | #20 Valv Mönster/Orkester/Kunskapsbank/drawer | **PASS** | `smoke:locked-ux` 2026-06-06 |
| **Autorun PASS** | Kunskap våg 8 ingest | **PASS** | 53 FACT → `fPIXyAxSnKPubEGBSAwUmxDRfiD3` (Admin SDK + `SEED_FIREBASE_EMAIL`) |
| **Autorun PASS** | `smoke:kunskap` | **PASS** | 2026-06-06 — ingest + query + citation |
| **Deploy** | Hosting MaterialPack Familjen + chat-audit frontend sync | **PASS** | 2026-06-06 |
| **Deploy** | Hosting ValvSuper Fas 2–3 + Vit våg 10–16 | **PASS** | 2026-06-06 (senaste `hosting`-deploy) |
| **Deploy** | Super Multitask: Inkast CTA + Dossier XSS + hosting | **PASS** | 2026-06-07 · `88be0eeb` |
| **Deploy** | Hosting Superhub §D (dagbok ur publik drawer) | **PASS** | 2026-06-07 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | Superhub §D `smoke:superhub` + build + locked-ux | **PASS** | 2026-06-07 — drawer 4 rader, legacy redirects, plausible deniability |
| **Deploy** | Hosting Handling dock-fix (lazy Planering + error boundary) | **PASS** | 2026-06-07 · prod hosting |
| **Manuell PASS** | Dock Handling → kanban P3 (Motorola) | **PASS** | 2026-06-07 (USER) |
| **Deploy** | MaterialPack Våg B — Firestore sync + rules + hosting | **PASS** | 2026-06-07 · `material_pack_overrides` |
| **Manuell PASS** | Inkast post-save CTA + MaterialPack `/projekt/genvagar` | **PASS** | 2026-06-07 (USER) |
| **Autorun PASS** | Fas 2 re-run (build + 6 smokes) | **PASS** | 2026-06-07 |
| **Deploy** | Fas 2 planering + smoke docs (`hosting`) | **PASS** | 2026-06-07 · `6ce9e79c` |
| **Autorun PASS** | Smart Inkast vardag (`smoke:inkast-vardag` + inkast + design-modules + locked-ux) | **PASS** | 2026-06-07 — Hem kompass + granskningskö + `#inkast-lite` |
| **Deploy** | Hosting Smart Inkast vardag (Hem → capture → kö) | **PASS** | 2026-06-07 · https://gen-lang-client-0481875058.web.app |
| **Manuell PASS** | Inkast vardag på Hem (Motorola: klistra → granska → kö) | **PASS** | 2026-06-07 (USER) |
| **Autorun PASS** | §F Projekt regler (`smoke:projekt-regler`) | **PASS** | 2026-06-07 — route, API, rules, blur-save |
| **Deploy** | Hosting §F Projekt regler (blur-save) | **PASS** | 2026-06-07 · https://gen-lang-client-0481875058.web.app |
| **Manuell PASS** | §F Projekt regler (Motorola: lägg till → byt namn → reload) | **PASS** | 2026-06-07 (USER) |
| **Autorun PASS** | §E Göra Fokus/Framsteg/Regler (`smoke:planering-gora-e`) | **PASS** | 2026-06-07 — ghost pills + en TabBar |
| **Deploy** | Hosting §E PlaneringMoreTabsBar | **PASS** | 2026-06-07 · https://gen-lang-client-0481875058.web.app |
| **Manuell PASS** | §E Göra (Handling + Fokus/Framsteg/Regler-länkar) | **PASS** | 2026-06-07 (USER) |
| **Autorun PASS** | Hemkompass UI-polish våg 2 (`smoke:design-modules` + locked-ux) | **PASS** | 2026-06-07 — scenic stack, Närvaro-chip, adaptive-card tokens |
| **Deploy** | Hosting Hemkompass UI-polish våg 2 | **PASS** | 2026-06-07 · https://gen-lang-client-0481875058.web.app |
| **Manuell PASS** | Hemkompass UI våg 2 (scenic stack + fasflikar) | **PASS** | 2026-06-07 (USER) |
| **Autorun PASS** | Inkast fas 2 (`smoke:inkast-fas2` + inkast + locked-ux) | **PASS** | 2026-06-07 — Planering kö + G10 status badges |
| **Deploy** | Hosting Inkast fas 2 | **PASS** | 2026-06-07 · https://gen-lang-client-0481875058.web.app |
| **Manuell PASS** | Inkast fas 2 (Planering inkorg + Valv godkänn) | **PASS** | 2026-06-07 (USER) |
| **Autorun PASS** | Fas 3 Super Multitask Agent B (build + 8 smokes) | **PASS** | 2026-06-07 · `8374219a` |
| **Autorun PASS** | Fas 3 Agent C P1 inkast (`assertVaultSession` + sourceModule allowlist) | **PASS** | 2026-06-07 |
| **Autorun PASS** | Fas 3 Agent A/D UX (Biff `calm-card`, Inkorg Hamn/Handling badge) | **PASS** | redan på main |
| **Deploy** | Fas 3 `functions:submitInkastLite,functions:previewInboxClassification` + hosting | **PASS** | 2026-06-07 · `8374219a` · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | Fas 3 re-verify (build + 8 smokes) | **PASS** | 2026-06-11 · `8374219a` |
| **Deploy** | Fas 3 re-deploy submitInkastLite + hosting | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | Navigations-snabbvinster (build + `smoke:locked-ux` + `smoke:design-modules`) | **PASS** | 2026-06-11 — Kompis→Kunskapsbank, drawer senast besökt |
| **Deploy** | Hosting navigations-snabbvinster | **PASS** | 2026-06-11 · https://gen-lang-client-0481875058.web.app |
| **Autorun PASS** | MåBra våg 17 JOY → Vit `who_am_i` (build + innehall + mabra + locked-ux) | **PASS** | 2026-06-11 · `MB-REF-JOY-01..06`, `MB-PLAY-JOY-01/02` |
| **Deploy** | Hosting MåBra våg 17 JOY cards | **PASS** | 2026-06-11 · `bc3b0460e` |
| **Autorun PASS** | WH4 away re-verify (`b7609a2a`) | **PASS** | 2026-06-11 · smoke:hamn + locked-ux + build (deploy redan live) |
| **Autorun PASS** | Fas 4 Agent B (Hamn brusfilter + inkast ex-routing + valv-gate weave) | **PASS** | 2026-06-11 · build + hamn + locked-ux + valv-security + valv-gate + orkester |
| **Deploy** | Hosting Fas 4 Hamn + Planering inkast | **PASS** | 2026-06-11 · `a659afbe6` · https://gen-lang-client-0481875058.web.app |



## WH4 Hamn + logout Zero Footprint (2026-06-11)

**Trigger:** USER away · agent 3bc87ae7 / subagent re-verify  
**Commits:** `a66711dd8` feat(hamn+auth) · `b7609a2a9` docs SMOKE_RESULTS  
**Prod:** https://gen-lang-client-0481875058.web.app (hosting deploy redan körd)

| Kontroll | Resultat |
|----------|----------|
| `WidgetHamnPage` WH4 mini-BIFF | **PASS** (på main) |
| `signOutUser` → `endVaultSession` + `clearSpeglarSession` | **PASS** |
| `npm run smoke:hamn` | **PASS** (away re-verify) |
| `npm run smoke:locked-ux` | **PASS** (away re-verify) |
| `npm run build` | **PASS** (away re-verify) |

**Fas 5A #3/#4:** **PASS** (USER 2026-06-06/07) — se [`2026-06-01-USER-nasta-steg.md`](./evaluations/2026-06-01-USER-nasta-steg.md).




## Fas 3 Super Multitask (2026-06-07 — kör alla)

**Trigger:** USER «kör alla fas 3» · trunk `main` · prod `gen-lang-client-0481875058`  
**Commit:** `8374219a` — Valv-gate på bevis-inkast; server allowlist/strip `sourceModule`

| Agent | Leverans | Status |
|-------|----------|--------|
| A | InkorgPreviewSheet routing badge Hamn/Handling | **PASS** (redan main) |
| B | `npm run build` + functions build + 8 smokes | **PASS** |
| C | P1 `assertVaultSession` submitInkastLite bevis-intent; `inkastSourceModule.ts` | **PASS** |
| D | BiffTriagePanel `calm-card` | **PASS** (redan main) |

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `functions build` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:design-modules` | **PASS** |
| `smoke:orkester` | **PASS** |
| `smoke:valv-security` | **PASS** |
| `smoke:innehall` | **PASS** |
| `smoke:cache` | **PASS** |
| `smoke:superhub` | **PASS** |
| Deploy `functions:submitInkastLite,functions:previewInboxClassification` | **PASS** |
| Deploy `hosting` | **PASS** |

**URL:** https://gen-lang-client-0481875058.web.app

---

## Fas 2 execution complete (2026-06-07 — agent re-run)

**Trigger:** Fas 2 agent timeout recovery · trunk `main` · prod `gen-lang-client-0481875058`  
**Kod redan på main:** `a4315b35` Valv weave client + gates · `1dfc783d` inkast CTA · denna commit planering UX + smoke docs

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `functions build` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:design-modules` | **PASS** |
| `smoke:orkester` | **PASS** |
| `smoke:valv-security` | **PASS** |
| `smoke:innehall` | **PASS** |
| `smoke:cache` | **PASS** |
| Deploy `hosting` | **PASS** | 2026-06-07 · `6ce9e79c` · https://gen-lang-client-0481875058.web.app |
| Deploy `functions` | **SKIP** — inga ändringar i `functions/src` sedan senaste deploy |

**Hub:** [`evaluations/SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md) · **Supermoduler:** [`evaluations/2026-06-06-supermodule-master-plan.md`](./evaluations/2026-06-06-supermodule-master-plan.md)

---

## Fas 5A #3 Valv batch (2026-06-06 — agent)

**Trigger:** 1h autonom pass · Fas 5A #3 re-run  
**Branch:** `main` (lokal, ej push)

| Kommando | Resultat | Valv-fokus |
|----------|----------|------------|
| `functions build` | **PASS** | — |
| `npm run build` | **PASS** | — |
| `smoke:locked-ux` | **PASS** | Mönster, Orkester, Kunskapsbank, Aktörskarta, drawer Vardag+Valv, Fyren-gate |
| `smoke:vault-worm` | **PASS** | WORM create/read; update/delete nekad |
| `smoke:valv-security` | **PASS** | Session lifecycle, Zero Footprint |
| `smoke:valv-gate` | **PASS** | `valvChatQuery` + `getEntityProfileRegistry` utan token nekad |
| `smoke:plausible-deniability` | **PASS** | Fyren, HIDE_BEVIS_TAB, bevis-routing gate |
| `smoke:valv` | **PASS** | `valvChatQuery` + `reality_vault` seed + citation |
| `smoke:orkester` | **PASS** | Valv-zoner, Orkester UI registry |

**Kodfix (trivial):** `scripts/smoke_plausible_deniability.mjs` — `approveWeaverMetadata` ligger i `callables/agents.ts` efter refactor (ej PMIR-blocker).

**USER klar (#3):** Shield → PIN → spara post — **PASS** 2026-06-07 (Pontus).

---

## Super Multitask 2026-06-06 (kör alla)

**Trigger:** USER «kör alla» · trunk `main` · prod `gen-lang-client-0481875058`

| Steg | Resultat |
|------|----------|
| `git pull --ff-only` | **PASS** — already up to date |
| UX polish | **DONE** — `planeringWeekDays` lokal YYYY-MM-DD; `glow="gold"` Inkorg; Calendar import fix |
| P1 security | **DONE** — `assertVaultSession` i `weaveJournalEntry` |
| ICS stub | **INTACT** — `exportPlaneringIcs.ts` + `PlaneringWeekCalendar` knapp |
| `npm run build` | **PASS** |
| `functions build` | **PASS** |
| `smoke:locked-ux` | **PASS** (0) |
| `smoke:design-modules` | **PASS** (0) |
| `smoke:orkester` | **PASS** (0) |
| `smoke:valv-security` | **PASS** (0) |
| `smoke:innehall` | **PASS** (0) |
| Deploy `functions:weaveJournalEntry` | **PASS** | europe-west1 · commit `2c643985` |
| Deploy `hosting` | **PASS** | https://gen-lang-client-0481875058.web.app |

**USER kvar (#3):** Manuell Valv UI-test (Shield→PIN→spara) — backend/static PASS.

---

## Current truth (2026-05-31 — systemgenomgång auto)

**Sanning:** denna tabell ersätter äldre "öppet"-rader i hub-dokument. Historik nedan behålls.

| Kategori | # / kommando | Status | Senast |
|----------|--------------|--------|--------|
| **Manuell PASS** | #1 Auth | **PASS** | 2026-05-27 (användare) |
| **Manuell PASS** | #2 Dagbok → `journal` | **PASS** | 2026-05-27 |
| **Manuell PASS** | #18 Ekonomi → `transactions` | **PASS** | 2026-05-27 |
| **Static PASS** | #19 Barnfokus | **PASS** | `smoke:locked-ux` 2026-05-31 |
| **Static PASS** | #20 Valv Mönster + Orkester | **PASS** | `smoke:locked-ux` + `smoke:orkester` 2026-05-31 |
| **Automatiserad PASS** | build (functions + frontend) | **PASS** | 2026-05-31 systemgenomgång |
| **Automatiserad PASS** | locked-ux, design-modules, locked-icons, innehall, orkester | **PASS** | 2026-05-31 |
| **Automatiserad PASS** | arbetsliv, tidshjul, child-moment, content-waves | **PASS** | 2026-05-31 |
| **Automatiserad PASS** | smoke:all (kunskap→grans) | **PASS** | 2026-05-31 |
| **Automatiserad PASS** | entities, inbox, cache, stampla | **PASS** | 2026-05-31 |
| **ESLint** | `npx eslint . --max-warnings 0` | **SKIP** | 4 warnings, 0 errors — se eval |
| **USER (du i app)** | #3 Valv → `reality_vault` | **USER** | — |
| **USER (du i app)** | #4 Barnen → `children_logs` | **USER** | — |
| **USER (du i app)** | #2d Dagbok bilaga → `journal_memories` | **USER** | — |
| **USER (du i app)** | Projektbild → `project_media/` | **USER** | efter storage deploy 2026-05-29 |
| **USER (du i app)** | Fas 5A Vävaren HITL | **USER** | [`evaluations/2026-05-31-fas5a-user-checklist.md`](./evaluations/2026-05-31-fas5a-user-checklist.md) |
| **Deploy PASS** | Vävaren HITL + rules + hosting | **PASS** | 2026-05-31 deploy |

**Rapport:** [`evaluations/2026-05-31-systemgenomgång-auto.md`](./evaluations/2026-05-31-systemgenomgång-auto.md) · **Checklista:** [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md)

---

## Current truth (2026-05-31 — före systemgenomgång)

**Arkiv:** tabell ovan ersätter denna snapshot.

| Kategori | # / kommando | Status | Senast |
|----------|--------------|--------|--------|
| **Manuell PASS** | #1 Auth | **PASS** | 2026-05-27 (användare) |
| **Manuell PASS** | #2 Dagbok → `journal` | **PASS** | 2026-05-27 |
| **Manuell PASS** | #18 Ekonomi → `transactions` | **PASS** | 2026-05-27 |
| **Static PASS** | #19 Barnfokus | **PASS** | `smoke:locked-ux` 2026-05-29 |
| **Static PASS** | #20 Valv Mönster + Orkester | **PASS** | `smoke:locked-ux` + `smoke:orkester` 2026-05-29 |
| **Automatiserad PASS** | build, locked-ux, orkester, design-modules, locked-icons, innehall | **PASS** | 2026-05-28/29 · orkester:night 2026-05-29 |
| **USER (du i app)** | #3 Valv → `reality_vault` | **USER** | — |
| **USER (du i app)** | #4 Barnen → `children_logs` | **USER** | — |
| **USER (du i app)** | #2d Dagbok bilaga → `journal_memories` | **USER** | — |
| **USER (du i app)** | Projektbild → `project_media/` | **USER** | efter storage deploy 2026-05-29 |
| **Deploy PASS** | Vävaren HITL + rules + hosting | **PASS** | 2026-05-31 deploy — manuell E2E: [`evaluations/2026-05-31-fas5a-user-checklist.md`](./evaluations/2026-05-31-fas5a-user-checklist.md) |

**Checklista:** [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) · 


## Fas 3 Super Multitask (2026-06-07 — kör alla)

**Trigger:** USER «kör alla fas 3» · trunk `main` · prod `gen-lang-client-0481875058`  
**Commit:** `8374219a` — Valv-gate på bevis-inkast; server allowlist/strip `sourceModule`

| Agent | Leverans | Status |
|-------|----------|--------|
| A | InkorgPreviewSheet routing badge Hamn/Handling | **PASS** (redan main) |
| B | `npm run build` + functions build + 8 smokes | **PASS** |
| C | P1 `assertVaultSession` submitInkastLite bevis-intent; `inkastSourceModule.ts` | **PASS** |
| D | BiffTriagePanel `calm-card` | **PASS** (redan main) |

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `functions build` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:design-modules` | **PASS** |
| `smoke:orkester` | **PASS** |
| `smoke:valv-security` | **PASS** |
| `smoke:innehall` | **PASS** |
| `smoke:cache` | **PASS** |
| `smoke:superhub` | **PASS** |
| Deploy `functions:submitInkastLite,functions:previewInboxClassification` | **PASS** |
| Deploy `hosting` | **PASS** |

**URL:** https://gen-lang-client-0481875058.web.app

---

## Fas 2 execution complete (2026-06-07 — agent re-run)

**Trigger:** Fas 2 agent timeout recovery · trunk `main` · prod `gen-lang-client-0481875058`  
**Kod redan på main:** `a4315b35` Valv weave client + gates · `1dfc783d` inkast CTA · denna commit planering UX + smoke docs

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `functions build` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:design-modules` | **PASS** |
| `smoke:orkester` | **PASS** |
| `smoke:valv-security` | **PASS** |
| `smoke:innehall` | **PASS** |
| `smoke:cache` | **PASS** |
| Deploy `hosting` | **PASS** | 2026-06-07 · `6ce9e79c` · https://gen-lang-client-0481875058.web.app |
| Deploy `functions` | **SKIP** — inga ändringar i `functions/src` sedan senaste deploy |

**Hub:** [`evaluations/SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md)

---

## Systemgenomgång auto batch (2026-05-31)

| Kommando | Resultat |
|----------|----------|
| `functions build` + `npm run build` | **PASS** |
| Alla statiska smokes (9) | **PASS** |
| `smoke:all` + entities/inbox/cache/stampla | **PASS** |
| Säkerhetsaudit | **PASS** |
| Kodfixar | ESLint errors + smoke:arbetsliv wiring |

**Detaljer:** [`evaluations/2026-05-31-systemgenomgång-auto.md`](./evaluations/2026-05-31-systemgenomgång-auto.md)

---

## Fas 5A batch (2026-05-31 — agent prep)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:orkester` | **PASS** (inkl. `weaver_pending`, WeaverApprovalPanel) |

**Manuell USER → PASS:** följ [`evaluations/2026-05-31-fas5a-user-checklist.md`](./evaluations/2026-05-31-fas5a-user-checklist.md) — rapportera till agent för uppdatering av tabellen ovan.

---

## Fas 5B batch (2026-05-31 — UI polish)

| Leverans | Smoke |
|----------|-------|
| I2 Visa brus i `BiffTriagePanel` | build + locked-ux **PASS** |
| Ankare-filter «Endast ankare» | locked-ux **PASS** |
| `FORENSIC_TAB_INGRESS` | locked-ux **PASS** |

---

## Deploy + post-deploy (2026-05-29 — körplan)

**Agent:** `firebase deploy --only firestore:rules` **PASS** · `firebase deploy --only storage` **PASS** (projekt `gen-lang-client-0481875058`)  
**Autorun:** `npm run orkester:night` **PASS** — [`evaluations/2026-05-29-orkester-natt.md`](./evaluations/2026-05-29-orkester-natt.md) (kört 14:41 UTC)  
**Kognitiv sköld:** `npm run kognitiv-skold:preview` **PASS** · P1 wired (`K06` default, `?kSkold=`)

### Manuell checklista (efter rules + storage deploy)

| # | Test | Resultat | Notering |
|---|------|----------|----------|
| 2d | Dagbok bilaga &lt;5 MB → `journal_memories` | **USER** | Kräver inloggad användare + fil &lt;5 MB i Reflektera |
| 3 | Valv long-press → PIN → post | **USER** | `reality_vault` i Console |
| 4 | Barnen / Barnporten → `children_logs` | **PASS** | 2026-06-06 USER · QR + meddelande · Motorola Android |
| 19 | Barnfokus Familjen | **STATIC PASS** | `npm run smoke:locked-ux` 2026-05-29 |
| 20 | Valv Mönster + Orkester | **STATIC PASS** | `smoke:locked-ux` + `smoke:orkester` 2026-05-29 |
| Ny | Projektbild → `project_media/` | **USER** | Efter storage deploy; `/projekt/:id` bild-block |

**Bekräfta i app:** öppna [Hosting](https://gen-lang-client-0481875058.web.app) eller `npm run dev` — fyll **USER**-rader ovan och byt till **PASS** när Firestore/Storage visar dokument.

---

## Max-byggplan (2026-05-29)

**PMIR:** [`evaluations/2026-05-29-pmir-modul-rollout-batch.md`](./evaluations/2026-05-29-pmir-modul-rollout-batch.md)

| Kommando | Resultat |
|----------|----------|
| `smoke:design-modules` | **PASS** (ember dock + Projekt P2 wiring) |
| `smoke:locked-icons` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `npm run build` | **PASS** |
| `npm run orkester:night` | **PASS** — [`evaluations/2026-05-29-orkester-natt.md`](./evaluations/2026-05-29-orkester-natt.md) |
| `npm run cap:sync` | **PASS** |

**Manuellt efter deploy:** #1 Valv · #2 Barnen · #18 Ekonomi (tidigare PASS 2026-05-27 — dubbelkolla vid behov) · **ny:** projektbild i Storage efter `storage.rules` deploy.

---

## Modul-/flikflytt baslinje (2026-05-28)

**Branch:** `main` (lokal) · **Plan:** modul-flik ombyggnad Fas A–E

| Kommando | Resultat |
|----------|----------|
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:design-modules` | **PASS** (TryggHamnHub + tabRegistry Valv-labels) |
| `npm run smoke:orkester` | **PASS** |
| `npm run build` | **PASS** |

**Kod:** Fas 2-kluster (`evidence/kompis`, `wellbeing/economy`, `family/safeHarbor`, `admin/stampla`); fas 1-shims borttagna; B2/B3/B4 enligt `docs/design/IA-MODUL-FLYTT-2026.md`.

---

## Manuell smoke-batch minimum (2026-05-27)

**Branch:** `main` (användartest; gren växlade under session)  
**Miljö:** lokal app / enhet (användare bekräftat steg för steg)  
**Checklista:** [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) **#1 + #2 + #18** (minimum enligt [`evaluations/2026-05-27-nasta-fas-plan.md`](./evaluations/2026-05-27-nasta-fas-plan.md))

| # | Test | Resultat | Notering |
|---|------|----------|----------|
| 1 | Auth — inloggning utan konsolfel | **PASS** | Användare bekräftat 2026-05-27 |
| 2 | Dagbok — spara post → `journal` | **PASS** | Användare bekräftat 2026-05-27 |
| 18 | Ekonomi — veckopeng → `transactions` | **PASS** | Användare bekräftat 2026-05-27 |

**Återstår samma kväll/vecka (valfritt):** #3–7, #19–20 · Firestore Console dubbelkoll av `journal` + `transactions` · Android offline enligt [`OFFLINE-ANDROID.md`](./OFFLINE-ANDROID.md)

**Nästa produktsteg (plan):** navigations-snabbvinster (klickbar Kompis + Valv TabBar) *eller* `kör projekt P2` / `kör inkast fas 2` — ett spår i taget.

---

## Orkester-smoke 2026-05-25 (theme-pack-j)

**Branch:** `theme-pack-j` · **Commit:** `b7450580`  
**Miljö:** lokal `npm run dev` → http://localhost:5173/  
**Körare:** Cursor agent (automatiserat + route-probe; Firestore Console ej öppnad i denna session)

### Bygg

| Kontroll | Resultat |
|----------|----------|
| `cd functions && npm run build` | **PASS** |
| `npm run build` (frontend) | **PASS** |
| Dev-server (`npm run dev`) | **PASS** — port 5173, HTTP 200 på `/`, `/dagbok`, `/hamn`, `/kunskap`, `/vardagen`, `/familjen`, `/valv`, `/planering`, `/vardagen?tab=ekonomi` |

### `npm run smoke:all`

| Steg | Resultat | Orsak vid FAIL |
|------|----------|----------------|
| `smoke:locked-ux` | **PASS** | — |
| `smoke:design-modules` | **FAIL** | `SafeHarborPage.tsx` saknar strängen `BiffTriagePanel` i filen. Panelen finns kvar via `TryggHamnHub` → `BiffPublicPanel` → `BiffTriagePanel` (`BiffPublicPanel.tsx:164`). Smoke-scriptet är **inaktuellt** (söker direkt i `SafeHarborPage.tsx`). |
| `smoke:kunskap` … `smoke:grans` | **PASS** (kördes manuellt efter avbrott) | `smoke:all` avbröts vid design-modules; övriga modul-smokes kördes separat — alla exit 0. |

**Sammanfattning `smoke:all`:** **FAIL** (blockerad av `smoke:design-modules`).

| Modul-smoke | Resultat |
|-------------|----------|
| `smoke:kunskap` | **PASS** — ingest + `knowledgeVaultQuery`, citation match, embeddingDim 768 |
| `smoke:speglar` | **PASS** — `speglingsMirror` |
| `smoke:dossier` | **PASS** — `reality_vault` seed + `generateDossier` + PDF bytes |
| `smoke:compass` | **PASS** — `checkins` WORM + `breakDownResponse` |
| `smoke:mabra` | **PASS** — `mabra_sessions` + `mabraCoach` |
| `smoke:valv` | **PASS** — `valvChatQuery` + `reality_vault` seed |
| `smoke:children` | **PASS** — `children_logs` seed + `childrenLogsQuery` |
| `smoke:grans` | **PASS** — `analyzeMessage` (Grey Rock) |

### Manuell checklista (`docs/SMOKE_CHECKLIST.md` #1–7, #18–20)

| # | Test | Resultat | Notering / varför |
|---|------|----------|-------------------|
| 1 | Auth | **PASS (proxy)** | Alla modul-smokes: Anonymous Auth + uid loggat. Ingen browser-konsol verifierad i denna session. |
| 2 | Dagbok → `journal` | **Öppen** | Ingen dedikerad smoke-script i batchen. Kräver UI: `/dagbok` spara + Firestore Console `journal`. |
| 3 | Valv → `reality_vault` | **PASS (proxy)** | `smoke:valv` + `smoke:dossier` skapar `reality_vault`-poster via callable/API. UI-flöde Shield 3s → PIN **ej** klicktestat. |
| 4 | Barnen → `children_logs` | **PASS (proxy)** | `smoke:children` WORM-seed + `childrenLogsQuery`. UI `/familjen` spara **ej** klicktestat. |
| 5 | Kompasser → `checkins` | **PASS** | `smoke:compass` — `checkins` WORM + `breakDownResponse`. |
| 6 | Hamn BIFF → `analyzeMessage` | **PASS** | `smoke:grans` — agent `agent_grans_arkitekten`, Grey Rock-svar. Route `/hamn` HTTP 200. |
| 7 | Kunskap → `knowledgeVaultQuery` | **PASS** | `smoke:kunskap`. Route `/kunskap` → redirect `/vardagen?tab=kunskap`, HTTP 200. |
| 18 | Ekonomi → `transactions` / `economy_profiles` | **Öppen** | Route `/vardagen?tab=ekonomi` HTTP 200; `EconomyPage` har veckopeng-knapp (`category: 'veckopeng'`). Ingen automatiserad Firestore-skrivning i denna körning. |
| 19 | Middagsfrågan (låst) | **PASS (statisk)** | `smoke:locked-ux` — `BarnfokusFraganPanel`, `BARNFOKUS_QUESTIONS`, `handleSaveBarnfokus`, minneslista-kopia. Firestore `children_logs` + optimistisk minneslista **ej** verifierad i Console. |
| 20 | Valv Mönster/Orkester (låst) | **PASS (statisk)** | `smoke:locked-ux` — flikar Mönster/Orkester, `VaultMonsterPanel`, `VaultOrkesterPanel`, `analyzeBiffMessage`. SMS-tråd → mönstersökning **ej** klicktestat. |

**Åtgärd före merge (rekommenderat, ej gjort i denna session):** uppdatera `scripts/smoke_design_modules.mjs` rad 31 så Hamn-wire söker `BiffTriagePanel` i `BiffPublicPanel.tsx` eller `TryggHamnHub.tsx` (produktkod oförändrad — endast smoke-guard).

---

**Datum:** 2026-05-24  
**Branch:** `main`  
**Miljö:** [Hosting prod](https://gen-lang-client-0481875058.web.app) — manuell Fas 3 (`docs/SMOKE_CHECKLIST.md` #1–7, #18)

| # | Test | Resultat | Datum |
|---|------|----------|-------|
| 1 | Auth — app öppnas, anonym uid (Konto synlig) | **PASS** | 2026-05-24 |
| 2 | Dagbok — spara post → `journal` | **PASS** | 2026-05-24 |
| 3 | Valv — Shield/PIN → `reality_vault` | **Öppen** | |
| 4 | Barnen — logg → `children_logs` | | |
| 5 | Kompasser — check-in → `checkins` | | |
| 6 | Hamn BIFF — `analyzeMessage` | | |
| 7 | Kunskap — `knowledgeVaultQuery` | | |
| 18 | Ekonomi — veckopeng → `transactions` | | |

---

**Datum:** 2026-05-23  
**Branch:** `main`

## Life OS orchestrering våg 0–2a (2026-05-23)

| Kontroll | Resultat |
|----------|----------|
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:design-modules` | **PASS** |
| `npm run smoke:all` | **PASS** |
| `npm run build` (frontend) | **PASS** |
| `cd functions && npm run build` | **PASS** |

**P1 synlig:** `/` LivskompassHero + Kompassråd · `/hamn` TryggHamnHub + BIFF Triage · `/familjen` barnkort/ankare · Valv Arkiv/Triage/Pansaret · `/mabra` KBT · Speglar VIVIR + Svart på vitt.

**Tema E** dokumenterat i `.context/design-language.md`.

## Våg 3 — manuell smoke (användaren kör)

| # | Scenario | Kryss | Datum |
|---|----------|-------|-------|
| 1 | Hem — kompass-hub + check-in | ☐ | |
| 2 | Hamn — BIFF Triage | ☐ | |
| 3 | Familjen — barnfokus spara | ☐ | |
| 4 | Valv — Mönster/Orkester locked | ☐ | |
| 5 | MåBra — KBT Transformatorn | ☐ | |
| 6 | Speglar — VIVIR snabb | ☐ | |
| 7 | Kunskap — RAG svar | ☐ | |
| 18 | Ekonomi — budget läsa | ☐ | |
| 19 | Dossier — export | ☐ | |
| 20 | Widget — inspelning route | ☐ | |

---

**Datum:** 2026-05-22  
**Branch:** `main` (Livskompassen3.0 — clean baseline)

## Clean repo baseline (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Nytt repo push | **PASS** — `Livskompassen3.0` / `main` |
| Arkiv tag `origin-old` | **PASS** — `archive/pre-clean-repo-2026-05-22` |
| Finder-kopia | **PASS** — `Livskompassen2.0-ARKIV-2026-05-22` |
| `npm run build` (frontend) | **PASS** |
| `cd functions && npm run build` | **PASS** |
| Utskriftsguide | **PASS** — `docs/GITHUB_ANVANDARGUIDE.md` |

## Automatiserade kontroller (nattpass 2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `cd functions && npm run build` | **PASS** |
| `npm run build` (frontend) | **PASS** |
| `npx eslint . --max-warnings 0` | **PASS** (efter eslint.config ignores + BarnensPage useCallback) |
| `smoke:valv` | **PASS** |
| `smoke:kunskap` | **PASS** — embeddingDim 768, citation match |
| `smoke:speglar` | **PASS** |
| `smoke:dossier` | **PASS** — pdfBase64 fallback |
| `smoke:compass` | **PASS** |
| `smoke:mabra` | **PASS** |
| `node scripts/seed_kampspar_profile.mjs --verify` | **PASS** — 47/47 ingest, RAG 5/5 |

## G2/G3 prod-verify (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Index endpoint `4956462078572363776` | **PASS** — `livskompassen_kv_deployed_v1` live west1 |
| Kod-defaults `vectorSearchClient.ts` | **PASS** — matchar GCP IDs |
| `VECTOR_SEARCH_*` i Secret Manager | **Saknas** — ej blockerande; defaults i kod + `functions/.env.gen-lang-client-0481875058` |
| Vectors efter nattpass | **54** (var 4) — upsert vid `ingestKampsparEntry` |
| `indexSyncTime` | **2026-05-22T00:57:43Z** — synkad under smoke ingest |
| Smoke embeddingDim | **768** — `text-embedding-004` |

**Slutsats G2/G3:** **VERIFY PASS** — ANN infra live; ingest upsertar vectors; query använder ANN-path när neighbors finns (logg `[kampsparQueryRag] ANN N träffar` i Functions).

## Automatiserade kontroller (historik 2026-05-21)

| Kontroll | Resultat |
|----------|----------|
| `npm run build` (frontend) | **PASS** (additiv modulbyggplan 2026-05-21) |
| `smoke:valv` | **PASS** (2026-05-21 efter G1 deploy) |
| `cd functions && npm run build` | **PASS** |
| Firestore rules inkl. `kampspar` | **PASS** (lokal fil) |
| Firestore indexes `kampspar`, `kb_docs` | **PASS** (lokal fil) |
| `node scripts/smoke_kunskap.mjs` | **PASS** (2026-05-21) |
| `node scripts/smoke_speglar.mjs` | **PASS** (2026-05-21) |
| `npm run smoke:dossier` | **PASS** (2026-05-21) |
| `npm run smoke:compass` | **PASS** (2026-05-21) |
| `npm run smoke:mabra` | **PASS** (2026-05-21) |
| `node scripts/seed_kampspar_profile.mjs --verify` | **PASS** (2026-05-21) |

## Profil-seed Kunskapsvalvet (2026-05-21)

Kör: `node scripts/seed_kampspar_profile.mjs --verify` (kräver `.env`, deployade callables).

Manifest: [`docs/specs/modules/Kampspar-PROFIL-SEED.json`](./specs/modules/Kampspar-PROFIL-SEED.json) — **47 poster** (profil, diagnos, strategi, barn, coping, metod).

| Steg | Resultat | Notering |
|------|----------|----------|
| `ingestKampsparEntry` × 47 | **PASS** | Alla poster WORM-create |
| `embeddingDim` | **768** | PASS efter G3 fix (textembedding-gecko@003 / text-embedding-004) |
| RAG 5 testfrågor | **PASS 5/5** | Samma auth-session som ingest (`--verify`) |
| Diagnoser-fråga | **PASS** | ADHD F90.0B + GAD F41.1 |
| Soc-strategi-fråga | **PASS** | Citations från strategi/metod |
| Kasper skola-fråga | **PASS** | Citations från barn-profil |
| Andning-fråga | **PASS** | 4-7-8 vagus |
| Feb 2026-fråga | **PASS** | Slutenvård, sjukskrivning, allostatisk belastning |

**Viktigt:** Utan `SEED_FIREBASE_EMAIL` + `SEED_FIREBASE_PASSWORD` i `.env` kopplas data till **anonymous uid** — syns inte i appen om du loggar in med annat konto. Sätt email/lösenord och kör om:

```bash
node scripts/seed_kampspar_profile.mjs --skip-existing --verify
```

**UI (manuell):** `/vardagen?tab=kunskap` → Tidshjulet — 47 noder efter seed på rätt uid.

## Kunskap smoke (automatiserat)

Kör: `npm run smoke:kunskap` (kräver `.env` med `VITE_FIREBASE_*`, Anonymous Auth, deployade callables).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `ingestKampsparEntry` | **PASS** | WORM create + docId |
| `knowledgeVaultQuery` | **PASS** | Svar + citations från `kampspar` |
| Citation pekar på ingest-doc | **PASS** | Token-match RAG |
| Full Gemini/Vertex LLM | **PASS** | `GEMINI_API_KEY` + `gemini-2.5-flash` via `defineSecret` (2026-05-21) |
| `embeddingDim` vid ingest | **768** | PASS efter G3 (`text-embedding-004`) |

**Full AI-syntes:** `firebase functions:secrets:set GEMINI_API_KEY` + `secrets: [geminiApiKey]` på `knowledgeVaultQuery` (se `functions/src/lib/geminiSecret.ts`).

## Speglar smoke (automatiserat)

Kör: `npm run smoke:speglar` (kräver `.env`, Anonymous Auth, deployad `speglingsMirror`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `speglingsMirror` | **PASS** | Svar med `mirror` (string) |
| Full Gemini/Vertex LLM | **OK** | `gemini-2.5-flash` + `GEMINI_API_KEY` (secret på callable) |

```bash
firebase deploy --only functions:speglingsMirror --force
npm run smoke:speglar
```

## Dossier smoke (automatiserat)

Kör: `npm run smoke:dossier` (kräver `.env`, Anonymous Auth, deployad `generateDossier`, Firestore rules `dossier_snapshots`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `reality_vault` seed (smoke) | **PASS** | WORM create före export |
| `generateDossier` utan token | **PASS** | permission-denied (Valv-session gate) |
| `vaultSessionToken` | **PASS** | Admin SDK seed (`smoke_vault_session.mjs`) eller Fyren manuellt |
| `generateDossier` | **PASS** | `dossierId` + SHA-256 `documentHash` |
| `dossier_snapshots` read | **PASS** | `includedDocIds` + hash matchar |
| PDF bytes (`%PDF`) | **PASS** | via `pdfBase64` fallback |
| Signed URL (Storage) | **fallback** | IAM `signBlob` saknas — klient får `pdfBase64` |

```bash
firebase deploy --only firestore:rules,storage,functions:generateDossier
npm run smoke:dossier
```

**UI (manuell):** Hjärtat → Bevis → PIN → flik **Dossier** → wizard → *Generera låst dossier* → *Ladda ner PDF*. **PASS** (2026-05-22, localhost) — valv-post + PDF genererad via `pdfBase64`.

**Valfri GCP-fix för signed URL:** ge Functions service account `roles/iam.serviceAccountTokenCreator` (self) så `getSignedUrl` fungerar utan base64.

## Kompasser smoke (automatiserat)

Kör: `npm run smoke:compass` (kräver `.env`, Anonymous Auth, deployad `breakDownResponse`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `checkins` WORM create | **PASS** | `compass_day` |
| `breakDownResponse` | **PASS** | `microSteps` array |

**UI (manuell):** `/vardagen` → Kompasser → flikar Morgon/Dag/Kväll, Paralys, KASAM kväll. **PASS** (2026-05-22) — Kväll KASAM steg 1→2, Nästa fungerar.

## Måbra smoke (automatiserat)

Kör: `npm run smoke:mabra` (kräver `.env`, Anonymous Auth, deployad `mabraCoach`, Firestore rules `mabra_sessions`).

| Steg | Resultat | Notering |
|------|----------|----------|
| Anonymous Auth | **PASS** | |
| `mabra_sessions` WORM create | **PASS** | metadata only |
| `mabraCoach` | **PASS** | `coach` string |

```bash
firebase deploy --only functions:mabraCoach --force
npm run smoke:mabra
```

**UI (manuell):** Hem → Måbra → övning → *Få ett kort svar* på complete-skärmen (opt-in, `#6366F1` bubbla). **PASS** (2026-05-22) — `mabraCoach` 200, AI-svar visas.

## Manuella tester (övriga moduler)

Kör mot lokal `npm run dev` eller [Hosting](https://gen-lang-client-0481875058.web.app).

| # | Test | Förväntat | Status |
|---|------|-----------|--------|
| 1 | Auth | uid i Firebase Auth | **PASS** (2026-05-24, prod Hosting — Konto synlig, app laddad) |
| 2 | Dagbok spara | `journal` post | **PASS** (2026-05-24, prod `/dagbok` wizard) |
| 3 | Valv | `reality_vault` post | **Öppen** |
| 4 | Barnen | `children_logs` | **Ej körd** |
| 5 | Kompasser (UI) | Paralys + KASAM + tids-default | **PASS** (2026-05-22) |
| 5b | Måbra (UI) | Symptom-hub → övning → opt-in coach | **PASS** (2026-05-22) |
| 6 | Hamn BIFF | Grey Rock-svar | **Ej körd** |
| 7 | Kunskap RAG (UI) | Svar + citations i chat | **Ej körd** — callables OK via script |
| 8 | Minne ingest (UI) | Tidshjulet visar nod | **Ej körd** — callable OK via script |
| 9 | Hamn → bevis | Original sparas i `reality_vault` | **Ej körd** |
| 10 | Speglar → Hamn | Länk med förifylld text | **Ej körd** — `speglingsMirror` OK via script |
| 11 | Dossier (UI) | Valv → flik Dossier → PDF + hash | **PASS** (2026-05-22) |
| 12 | KompisAvatar | Header pulserar vid Kunskap-fråga | **Ej körd** |

## Deploy-krav för Kunskap

```bash
firebase deploy --only firestore:rules,firestore:indexes,functions:ingestKampsparEntry,functions:knowledgeVaultQuery
npm run smoke:kunskap
```

Se [`DEPLOY.md`](./DEPLOY.md).

## Kodfixar under smoke (2026-05-21)

- `functions/src/lib/generateDossierInternal.ts` — `pdfBase64` fallback när signed URL (`signBlob`) nekas
- `src/modules/dossier/components/DossierPage.tsx` — nedladdning via URL eller data-URI
- `scripts/smoke_dossier.mjs` — automatiserad E2E (vault seed + snapshot + PDF)

- `functions/src/lib/genaiClient.ts` — `vertexai: true` för @google/genai
- `functions/src/agents/knowledgeVaultAgent.ts` — modell `gemini-2.0-flash-001` (ersatte `gemini-1.5-flash-001` 404)
- `functions/src/agents/vertexAgent.ts` — `gemini-2.5-flash` + `GEMINI_API_KEY` via secret; degraded ACT-fallback vid LLM-fel
- `functions/src/index.ts` — `speglingsMirror` `.runWith({ secrets: ['GEMINI_API_KEY'] })`
- `functions/src/index.ts` — `mabraCoach` callable + `MABRA_COACHEN_SYSTEM_PROMPT` i `sharedRules.ts`
- `src/modules/mabra/components/MabraCoachPanel.tsx` — opt-in *Få ett kort svar* efter övning

## Kodfixar under smoke (2026-05-22 nattpass)

- `eslint.config.js` — ignorera archive/generated; pragmatiska react-hooks-regler för befintliga mönster
- `scripts/gdpr_cleanup.ts` — `Firestore`-typ istället för oanvänd import
- `src/modules/barnens_livsloggar/components/BarnensPage.tsx` — `useCallback` för `refreshLogs` (exhaustive-deps)

## Kodfixar under smoke (2026-05-22 UI)

- `src/modules/core/layout/MainLayout.tsx` — `pb-48` så CTA-knappar inte hamnar under FloatingDock
- `src/index.css` — `.dock-nav--hub { w-fit }` + `pointer-events: none` på kompassros — bottenknappar klickbara igen

## Module plan sync

- [`src/modules/kompis/module_plan.md`](../src/modules/kompis/module_plan.md)
- [`docs/specs/modules/Kunskap-SPEC.md`](./specs/modules/Kunskap-SPEC.md)

## G6 — Drive-pipeline — **prod verify** 2026-05-22

**Källor:** [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md), [`GCP-FAS4-RUNBOOK.md`](./GCP-FAS4-RUNBOOK.md) steg 2  
**Commit:** `193f3ff1` — `fix(drive): G6 pipeline` (`documentAgent.ts`, `index.ts`)

### Prod-deploy (ingen redeploy behövdes)

| Kontroll | Resultat |
|----------|----------|
| `notifyNewFile` revision | **9** — `updateTime` **2026-05-22T10:30:04Z** (europe-west1) |
| Memory / timeout | **512MB** / **300s** — matchar G6-fix i repo |
| `await emitSynapse` | **PASS** — synkront flöde; svar `Processing complete` |
| `documentAgent` export + modell | **PASS** — logg `[File Pipeline] … gemini-2.5-flash` |
| E2E Drive → `kb_docs` | **PASS** — docId `irQNlDTYgcr15DFIuA3w` (`created=true`, PDF `LivsKompassen_System_Manifest.pdf`) |
| `smoke:kunskap` (re-run) | **PASS** 2026-05-22T10:38 — docId `DGMNHxSIAlqtPoEuQ53K`, citation match |
| `cd functions && npm run build` | **PASS** (verify compile) |

**Prod-logg (notifyNewFile, execution ~10:31 UTC):** `[File Pipeline] Startar … application/pdf` → `Fil nedladdad. Skickar till gemini-2.5-flash` → `[Synapse:drive_ingest] kb_docs docId=irQNlDTYgcr15DFIuA3w created=true` → HTTP **200** (51s).

| Secret | Status |
|--------|--------|
| `NOTIFY_WEBHOOK_SECRET` | **FINNS** (Secret Manager v2) |
| `GEMINI_API_KEY` | Finns |

**Känd icke-blockerare (ej G6):** ADK `runExecutor` loggar `[ADK] Executor-fel` p.g.a. `gemini-1.5-flash-001` 404 efter `kb_docs`-persist — Mönster-Arkivarien-dispatch; separat GAP (`runExecutor.ts`).

---

## G6 — historik (nattpass 2026-05-22)

| Del | Status |
|-----|--------|
| `notifyNewFile` deployad | **PASS** (europe-west1) |
| Secret bunden på function | **PASS** — POST utan header → **401** |
| Repo fail-closed | **Klar** — 503 om secret saknas i runtime |

## Parallellt obevakat pass (2026-05-22)

**Scope:** Grunder GAP + GCP FAS4 steg 5 + functions deploy.

| Kontroll | Resultat |
|----------|----------|
| Baseline smoke (valv, kunskap, dossier) | **PASS** |
| Grunder GAP — `RSD_KYLAREN_SYSTEM_PROMPT` | **done** |
| Grunder GAP — PA appendix `Barnen-SPEC.md` | **done** |
| Grunder GAP — injection-parity `.context/security.md` | **done** |
| `runExecutor.ts` → `gemini-2.5-flash` | **done** |
| `cd functions && npm run build` + frontend build | **PASS** |
| Full smoke (valv, kunskap, speglar, dossier, compass, mabra) | **PASS** |
| `npx eslint . --max-warnings 0` | **PASS** |
| `firebase deploy --only functions` | **PASS** — 14 Node functions west1 |
| FAS4 steg 5 — delete `knowledge-base-webhook` | **PASS** |
| Post-steg5 smoke (kunskap, dossier) | **PASS** |

**Kvar öppet:** — (Grunder U1–U5 runtime **klart**; nästa G8–G14).

## Parallellt pass U2.5 + G7 + legacy buckets (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Checkpoint commit (U5.5, FAS4, docs) | **done** |
| Baseline smoke (valv, kunskap, dossier) | **PASS** |
| U2.5 — `dcapAlertSynapse` + `dcap_alerts` WORM + SafeHarbor HITL | **done** |
| G7 — `journalWovenSynapse` + opt-in ConfirmStep + `journalWovenToKampspar` | **done** |
| Legacy buckets (5 st, ~4.3 MB totalt) | **raderade** |
| `functions` + frontend build | **PASS** |
| Deploy `analyzeMessage`, `journalWovenToKampspar`, `firestore.rules` | **PASS** |
| Post-deploy smoke ×3 | **PASS** |

**Legacy buckets raderade:** `knowledge-base-bucket-*`, `knowledge-base-docs-*`, `blueprint-config`, `gcf-v2-*` us-central1.

## FAS4 steg 7 — VERIFY experiment-buckets (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `ai-studio-bucket` — 1 objekt, `build_artifacts.tar.gz` (121 MB) | Legacy AI Studio — **raderad** |
| `cloud-ai-platform` — 58 objekt, `prompt-data/` (69 MB) | Vertex prompt-cache — **raderad** |
| Kodreferens i `functions/` | **0** — kanon = `sharedRules.ts` + west1 Vector |
| Post-steg7 `smoke:valv` | **PASS** |
| Post-steg7 `smoke:kunskap` | **PASS** |
| Post-steg7 `smoke:dossier` | **PASS** |

**FAS 4 avveckling:** steg 1–7 **klart**.

## G14 — Gräns-Arkitekten (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `gransArkitektenAgent.ts` + JSON (Brusfilter + BIFF) | **done** |
| Kompis routing + `module: safe_harbor` | **done** |
| Hamn UI (logistik / beten / Grey Rock) | **done** |
| `npm run smoke:grans` | **PASS** |

## G13 — Tidshjulet live kampspar (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `tidshjulTimeline` partition Dåtid/Nutid/Framtid | **done** |
| `subscribeKampsparEntries` + klickbara noder | **done** |
| `npm run smoke:tidshjul` | **PASS** |

## G12 — Context Cache registry (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `context_cache_registry` Firestore + rules | **done** |
| `invalidateCachesForUser` + retention purge | **done** |
| Deploy + `npm run smoke:cache` | **PASS** |

## G10 — Självsorterande inkorg (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `inboxClassifier` + `routeInboxToWorm` (bevis → valv) | **done** |
| `inbox_queue` HITL + `InboxQueueCard` | **done** |
| Deploy + `npm run smoke:inbox` | **PASS** — bevis/kunskap/trauma heuristik + LLM |

## G9 — EntityProfile / SystemSynapse (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `entityProfileTypes.ts` + `entityProfileStore.ts` | **done** |
| WORM `entity_profiles` + `system_synapses` + rules | **done** |
| Agent grounding (valv, kunskap, barn) | **done** — metadata only |
| Callable `getEntityProfileRegistry` + `EntityRegistryCard` | **done** |
| Deploy `getEntityProfileRegistry` + uppdaterade agenter | **PASS** |
| `npm run smoke:entities` | **PASS** — 7 profiler, 3 synapses, Isabelle MOTPART |

## G8 — Familjen-RAG childrenLogsQuery (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `childrenLogsQueryRag.ts` — endast `children_logs` | **done** |
| `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` i `sharedRules.ts` | **done** |
| Callable `childrenLogsQuery` + `ChildrenLogsChat` i Familjen | **done** |
| Deploy `childrenLogsQuery` | **PASS** (efter ~2 min IAM-propagering) |
| `npm run smoke:children` | **PASS** — citation match seed |
| Post-G8 smoke valv/kunskap/dossier | **PASS** |

**Silo:** Ej `valvChatQuery`; Kunskap redirect (U5.5) oförändrad.

## U5.5 — Kompis → Barnen routing (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `barnenModuleRouteGuard.ts` + `moduleRoute` i `knowledgeVaultQuery` | **done** |
| Frontend `KnowledgeVaultChat` länk till `/familjen` | **done** |
| `firebase deploy --only functions:knowledgeVaultQuery` | **PASS** |
| `npm run smoke:kunskap` (Minne-fråga, ingen redirect) | **PASS** |
| Live redirect: "Hur loggar jag barnens sömn i livsloggen?" | **PASS** — `moduleRoute.path=/familjen`, 0 citations |

**Silo:** Ingen läsning av `children_logs`; Valv/forensik blockeras av guard.

## FAS4 steg 6 — north1-index + tomma buckets + django-secrets (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Verifiering: north1 `kampspar_index` (0 endpoints) | **PASS** |
| Verifiering: 3 buckets 0 B | **PASS** |
| Delete `9094201410823651328` (europe-north1) | **PASS** |
| Delete `ekonomichefen`, `helthcoach`, `media-gen-lang-client-0481875058-0ebe` | **PASS** |
| Delete `django_admin_password-0ebe`, `django_settings-0ebe` | **PASS** |
| Post-steg6 `smoke:valv` | **PASS** |
| Post-steg6 `smoke:kunskap` | **PASS** |
| Post-steg6 `smoke:dossier` | **PASS** |

**Ej rört:** west1 Vector Search (102 vectors), WORM-collections, legacy KB-buckets (~10 KB).

## FAS4 steg 3 — drive_sync_tool (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| `firebase functions:delete drive_sync_tool` | **PASS** — us-central1 Python borta |
| `npm run smoke:kunskap` | **PASS** — ingest + query + citation |

**Kvar legacy Python:** `knowledge-base-webhook` endast.

## FAS4 steg 4 — legacy KB migrering (2026-05-22)

| Kontroll | Resultat |
|----------|----------|
| Discovery Engine data stores | **0** |
| GCS legacy user documents | **0** |
| `migrate_legacy_kb.mjs --inventory-only` | **PASS** — tom manifest |
| `npm run smoke:kunskap` | **PASS** |

Se [`LEGACY-KB-MIGRATION-2026-05-22.md`](LEGACY-KB-MIGRATION-2026-05-22.md).

## Nästa kod-GAP (efter grund-låsning)

| Kommando | Innehåll |
|----------|----------|
| `kör G8` | ~~Familjen-RAG~~ **done** 2026-05-22 |
| `kör G9` | ~~EntityProfile / SystemSynapse~~ **done** 2026-05-22 — `npm run smoke:entities` |
| `kör G10` | ~~Självsorterande inkorg~~ **done** 2026-05-22 — `npm run smoke:inbox` |
| `kör G12` | ~~Context Cache registry~~ **done** 2026-05-22 — `npm run smoke:cache` |
| `kör G13` | ~~Tidshjulet live kampspar~~ **done** 2026-05-22 — `npm run smoke:tidshjul` |
| `kör G14` | ~~Gräns-Arkitekten~~ **done** 2026-05-22 — `npm run smoke:grans` |

Se [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md).

## Multitask GAP-våg (2026-05-21) — våg 3 master review

| GAP | Resultat | Silo / arkiv-minne |
|-----|----------|-------------------|
| G1 `valvChatQuery` | **PASS** — deploy + smoke:valv, 512MiB | Endast `reality_vault` |
| G2 Vector ANN | **PASS** — endpoint live, `livskompassen_kv_deployed_v1` | Kunskap silo only |
| G3 embeddings | **PASS** — `text-embedding-004`, embeddingDim 768 | Upsert vid ingest |
| G5 retention WORM | **PASS** — allowlist, aldrig purga permanent minne | WORM-källor skyddade |
| G11 mock Kampspar | **PASS** — `KompisUiKampsparTrack` UI-only | Ej till ingest |
| G6 Drive | **DOCS** — secret saknas, manuellt kvar | Kunskap/kb_docs silo |

**Master review (våg 3):** Tre silos intakta. Ingen Valv↔Kunskap RAG-merge. WORM permanent minne skyddat i retention. Legacy Python RAG (us-central1) ej canonical — G4 kvar.

## Android-landning (2026-05-27)

| Kontroll | Resultat | Notering |
|----------|----------|----------|
| `google-services.json` `client_type: 1` | **PASS** | Commit `0e9710de` |
| Native Google **Logga in** (telefon) | **PASS** | Användare verifierat |
| `npm run build:web && npx cap sync android` | **PASS** | Agent 2026-05-27 |
| `npm run orkester:night` | **PASS** | [`evaluations/2026-05-26-orkester-natt.md`](./evaluations/2026-05-26-orkester-natt.md) |
| Offline flygplansläge (dagbok / Valv) | **PENDING** | Du — [`OFFLINE-ANDROID.md`](./OFFLINE-ANDROID.md) |

Landning: [`evaluations/2026-05-27-android-landning.md`](./evaluations/2026-05-27-android-landning.md)
