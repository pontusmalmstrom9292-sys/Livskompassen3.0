# Livskompassen — System Plan v2 (Fas 9+)

**Datum:** 2026-06-15 (Fas 23 USER smoke **levererad** · hex P2 nästa)  
**Kanon:** Aktiv styrning Fas 9–19. Historik Fas 1–7 → [`.context/system-plan.md`](../.context/system-plan.md) · **Fas 19:** [`evaluations/2026-06-15-fas19-masterplan-v2.md`](./evaluations/2026-06-15-fas19-masterplan-v2.md)  
**Sanning:** GCP → [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) · GAP → [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) · Smoke → [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md)  
**Audit:** [`evaluations/2026-06-14-fas9-systemanalys.md`](./evaluations/2026-06-14-fas9-systemanalys.md)

---

## Röda tråden (oförändrad)

DCAP före LLM · tre silos (Kunskap / Valv / Barnen) · **U6** innehåll (FACT / REFLECTION / PLAY / EVIDENCE) · WORM på bevis · Zero Footprint · Superhub per zon · inga LLM-beslut om auth eller ägarskap.

**Systemkontroll:** [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md) · **Git:** [`GIT-LATHUND.md`](./GIT-LATHUND.md)

---

## Nuvarande status

### Fas 1–5 — Klart (sammanfattning)

Fas 1–3: cleanup, modul-shell, Firebase-synk (Hosting live, Functions west1, Firestore rules). Grunder U1–U5 **PASS** 2026-05-22. Arkiv-GAP G1–G16 **done**. Life OS kopplingar Fas A–C (presets, rutiner, MaterialPack) + Projekt P1 delvis. Locked UX smoke + design-moduler. Manuell smoke minimum (#1, #2, #18, #2d, #3, #4) **PASS** enligt [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md).

Detaljerad checkbox-historik: [`.context/system-plan.md`](../.context/system-plan.md) Fas 1–5.

---

### Fas 6 — MåBra Superhub — AVSLUTAD 2026-06-14

| Del | Status |
|-----|--------|
| **6A** Router-skelett (`MabraInputSuperModule`, `/mabra/input`, lägesväxlare) | **done** |
| **6B** Vit + minneslista (`vit_*`, `EmotionalMemoryListPanel`) | **done** |
| **6C** Reflection + RAM → explicit save (`reflection_tool`, `exercise_note`) | **done** |
| **6D** Inkast + dagbok bridge (`inkast`, `dagbok_bridge`) | **done** |
| **6E** Lås UX/arkitektur | **done** 2026-06-14 |

**Låst:** `.context/locked-ux-features.md` §11  
**Spec:** [`specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md`](./specs/modules/Mabra-INPUT-SUPERHUB-SPEC.md)  
**Eval:** [`evaluations/2026-06-14-fas6-mabra-superhub-djupanalys.md`](./evaluations/2026-06-14-fas6-mabra-superhub-djupanalys.md)

---

### Fas 7 — Familjen Superhub — AVSLUTAD 2026-06-14

| Del | Status |
|-----|--------|
| **7A** Router-skelett (`FamiljenInputSuperModule`, lägesväxlare, `barnfokus`) | **done** |
| **7B** Delegates stund + fysiologi + offline-fel | **done** |
| **7C** Delegates observation + vardagsstruktur; avveckla duplicerad input | **done** |
| **7D** Shadow mount + produktionstest (`?superhub=true`) | **done** |
| **7E** Standardvy + legacy-borttagning + lås UX/arkitektur | **done** 2026-06-14 |

**Låst:** `.context/locked-ux-features.md` §12  
**Spec:** [`specs/Familjen-INPUT-SUPERHUB-SPEC.md`](./specs/Familjen-INPUT-SUPERHUB-SPEC.md)  
**Eval:** [`evaluations/Familjen-INPUT-SUPERHUB-EVAL.md`](./evaluations/Familjen-INPUT-SUPERHUB-EVAL.md)

---

### Fas 8 — Super-Ekonomi Input — AVSLUTAD 2026-06-14

| Del | Status |
|-----|--------|
| **8A** Spec + router-skelett (`EkonomiInputSuperModule`) | **done** |
| **8B** Mikrosteg + profil delegates | **done** |
| **8C** Kuvert + spar + matprep delegates | **done** |
| **8D** Impuls + inkast (`CaptureSuperModule` variant `ekonomi`) | **done** |
| **8E** Shadow→Live på `/vardagen?tab=ekonomi` | **done** 2026-06-14 |

**GAP:** F8 **done** — [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md)  
**Låst:** `.context/locked-ux-features.md` §14  
**Spec:** [`specs/Ekonomi-INPUT-SUPERHUB-SPEC.md`](./specs/Ekonomi-INPUT-SUPERHUB-SPEC.md)  
**Eval:** [`evaluations/Ekonomi-INPUT-SUPERHUB-EVAL.md`](./evaluations/Ekonomi-INPUT-SUPERHUB-EVAL.md)

---

### Fas 9 — Super-Planering Input — AVSLUTAD 2026-06-14

| Del | Status |
|-----|--------|
| **9A** Djupanalys + SPEC | **done** |
| **9B** `PlaneringInputSuperModule` + lägesväxlare | **done** |
| **9C** Delegates: task_quick, inkast, quick_list | **done** |
| **W3** `/planering/input` live + länk från PlaneringPage | **done** 2026-06-14 |

**Låst:** `.context/locked-ux-features.md` §15  
**Spec:** [`specs/Planering-INPUT-SUPERHUB-SPEC.md`](./specs/Planering-INPUT-SUPERHUB-SPEC.md)  
**Eval:** [`evaluations/2026-06-14-planering-superhub-djupanalys.md`](./evaluations/2026-06-14-planering-superhub-djupanalys.md)

---

### Fas 10 — Super-Arbetsliv Input — AVSLUTAD 2026-06-14

| Del | Status |
|-----|--------|
| **10A** Djupanalys + SPEC | **done** |
| **10B** `ArbetslivInputSuperModule` + lägesväxlare | **done** |
| **10C** Delegates: stampla, tid, logg | **done** |
| **W3** `/arbetsliv/input` + legacy redirect | **done** 2026-06-14 |

**Låst:** `.context/locked-ux-features.md` §16  
**Spec:** [`specs/Arbetsliv-INPUT-SUPERHUB-SPEC.md`](./specs/Arbetsliv-INPUT-SUPERHUB-SPEC.md)  
**Eval:** [`evaluations/2026-06-14-arbetsliv-superhub-djupanalys.md`](./evaluations/2026-06-14-arbetsliv-superhub-djupanalys.md)

---

### Fas 11 — Superdagbok (Hjärtat) — AVSLUTAD 2026-06-14

| Del | Status |
|-----|--------|
| **11A** Djupanalys + SPEC | **done** |
| **11B** `DagbokInputSuperModule` + lägesväxlare | **done** |
| **11C** Delegates: reflektion, quick_mirror, arkiv | **done** |
| **W5** `/hjartat/input` + HjartatPage embed | **done** 2026-06-14 |

**Låst:** `.context/locked-ux-features.md` §17  
**Spec:** [`specs/Superdagbok-INPUT-SUPERHUB-SPEC.md`](./specs/Superdagbok-INPUT-SUPERHUB-SPEC.md)  
**Eval:** [`archive/evaluations-fas19-2026-06/2026-06-14-superdagbok-superhub-djupanalys.md`](./archive/evaluations-fas19-2026-06/2026-06-14-superdagbok-superhub-djupanalys.md)

---

### Arkitekturcompliance (2026-06-14 audit)

| Princip | Status | Kritiska GAP |
|---------|--------|--------------|
| **WORM** | PASS (3 medium) | `inboxPersist.ts` schema drift; `VaultService.saveVaultEntry` alternate path; `evolution_ledger` append ej implementerad |
| **Tre silos (U1)** | PASS (fix 2026-06-14) | `chatWithKompis` vault-läsning borttagen; `weeklySummary`/`compass` backlog |
| **Plausible deniability** | GAP (delvis fix) | `RecentIntakeWidget` gated; `/arkiv`, legacy supermodule backlog |
| **Obsidian Calm** | Delvis | 16 feature-filer med hårdkodade hex (Oracle, QuickCapture värst) |
| **3-zonsystem** | Live | Parallella routes: `/dashboard`, `/orakel`, `/mabra` vs launcher |

Full audit: [`evaluations/2026-06-14-fas9-systemanalys.md`](./evaluations/2026-06-14-fas9-systemanalys.md)

---

### Tech debt register (prioriterad)

| Prioritet | Uppgift | Status |
|-----------|---------|--------|
| **P0** | Ta bort `@google-cloud/notebooks`, `@types/react-router-dom`, `@google/generative-ai` | **done** 2026-06-14 |
| **P0** | Fixa ESLint hook-varningar (RoutinesPanel, useDrogfrihetCounter, WidgetRecordPage) | **done** 2026-06-14 |
| **P0** | Rensa `middagsQuestionForToday` + stale README | **done** 2026-06-14 |
| **P1** | Gate `RecentIntakeWidget` + `chatWithKompis` vault-silo | **done** 2026-06-14 |
| **P2** | Konsolidera `/oversikt` vs `/dashboard` | Backlog |
| **P2** | Vite lazy-load Valv/Familjen | Backlog |
| **P2** | Expandera `typecheck:core-strict` till `features/` | Backlog |

Kanon förbättringsplan: [`evaluations/2026-06-11-FOEBATTRINGSPLAN-HELAPP.md`](./evaluations/2026-06-11-FOEBATTRINGSPLAN-HELAPP.md)

---

### Smoke & deploy (senast verifierat)

**Current truth:** [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) · Fas 23 gate **2026-06-15**

| Kategori | Status |
|----------|--------|
| `npm run build` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:orkester` | **PASS** (gate 12A) |
| `smoke:planering-superhub` | **PASS** |
| `smoke:arbetsliv-superhub` | **PASS** |
| `smoke:superdagbok-superhub` | **PASS** |
| Manuell #3 Valv, #4 Barnporten | **PASS** (USER 2026-06-15 · Fas 23) |
| `typecheck:core-strict` | **PASS** (Fas 22) |

**Hosting:** https://gen-lang-client-0481875058.web.app

---

### Modulstatus per zon (kort)

| Zon | Route | Backend | Öppet |
|-----|-------|---------|-------|
| **Hjärtat** | `/hjartat` · `/hjartat/input` | journal WORM, Vävaren HITL, speglingsMirror | — (Superdagbok **done** §17) |
| **Vardagen** | `/vardagen` · `/planering/input` · `/arbetsliv/input` | kompasser, ekonomi, mabraCoach | Hex→tokens P0 (Fas 20) |
| **Familjen** | `/familjen` | childrenLogsQuery, analyzeMessage | Push defer · PDF export partial |
| **Valv** | `/valvet` | valvChatQuery, generateDossier, EntityProfile | Arkiv-batch 19.6 PMIR |
| **Barnporten** | `/barnporten` | pairing callables | Push notifications defer |

**SynapseBus:** Alla 4 handlers **live** (driveIngest, journalWoven, dcapAlert, paralysBrytaren).

Produkt-GAP: [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md)

---

## Kommande moduler (Fas 12+)

**Superhub per zon:** **KLART** (Fas 6–11 · locked-ux §11–§17).

| Prioritet | Modul | Fas | Status | Spec / kanon |
|-----------|-------|-----|--------|--------------|
| **1** | Adaptiv Hemkompass — superhub-broar från Hem | **12B** | **done** 2026-06-14 | `homeSuperhubRoutes.ts` · `HomeSuperhubShortcuts` |
| 2 | Vault-gate P2 (`weeklySummary`, `compass`) | **12C** | **done** 2026-06-15 | [`2026-06-15-fas13-vag-1-security-12c.md`](./evaluations/2026-06-15-fas13-vag-1-security-12c.md) |
| 3 | Dossier BBIC `reportType` | **12D** | **done** 2026-06-15 | [`2026-06-15-fas13-vag-3-evidence-e2e.md`](./evaluations/2026-06-15-fas13-vag-3-evidence-e2e.md) |
| — | Kunskap våg 8 (53 FACT partial) | — | kurator | [`content/CONTENT-WAVES.md`](./content/CONTENT-WAVES.md) |
| — | Barnporten push (Våg C) | — | defer | — |
| — | Genkit migration (V1) | — | **wait** | [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) |

### Produkt-backlog (övrigt)

- Route-konsolidering `/oversikt` vs `/dashboard` (P2)
- Vite chunk-split Valv/Familjen (P2)
- `typecheck:core-strict` utökning (P2)

---

## Fas 13–19 (levererat) · Fas 20 (nästa)

| Fas | Leverans | Status | Kanon |
|-----|----------|--------|-------|
| **13** | Vault-gate 12C · Dossier BBIC 12D · WORM medium | **done** 2026-06-15 | [`2026-06-15-fas13-leverans.md`](./evaluations/2026-06-15-fas13-leverans.md) · våg 0–6 `fas13-vag-*` |
| **14** | Drawer IA · weekly/compass vault-gate · security 14B | **done** 2026-06-15 | [`2026-06-15-fas14-leverans.md`](./evaluations/2026-06-15-fas14-leverans.md) · `fas14-chat*` |
| **15** | Inkast I1–I3 · chat0 baseline · parallel handoff | **done** 2026-06-15 | [`2026-06-15-fas15-inkast-i1-i3.md`](./evaluations/2026-06-15-fas15-inkast-i1-i3.md) · [`fas15-inkast-i2.md`](./evaluations/2026-06-15-fas15-inkast-i2.md) |
| **16** | Kunskap våg 24 ingest · innehåll U6 | **done** 2026-06-15 | [`2026-06-15-fas16-wave24-ingest.md`](./evaluations/2026-06-15-fas16-wave24-ingest.md) |
| **17** | Shared `typecheck:core-strict` expansion | **done** 2026-06-15 | [`2026-06-15-fas17-typecheck-shared.md`](./evaluations/2026-06-15-fas17-typecheck-shared.md) |
| **18** | Android cap sync · App Check enforce (kod) | **done** 2026-06-15 | [`2026-06-15-fas18-android-cap-sync.md`](./evaluations/2026-06-15-fas18-android-cap-sync.md) · [`fas14b-appcheck-enforce.md`](./evaluations/2026-06-15-fas14b-appcheck-enforce.md) |
| **19** | Masterplan-v2 · M3.0-B hybrid-8 · unlockVault P0 · doc-synk 19.1 | **done** 2026-06-15 | [`2026-06-15-fas19-masterplan-v2.md`](./evaluations/2026-06-15-fas19-masterplan-v2.md) · `fas19-*` eval-serie |
| **20** | Doc-synk · arkiv-batch 2 | **done** 2026-06-15 | [`archive/evaluations-fas20-2026-06/`](./archive/evaluations-fas20-2026-06/) |
| **21** | App Check guards · JOY-17 · arkiv-batch 3 · Oracle tokens | **done** 2026-06-15 | [`2026-06-15-fas21-callables-guard-inventory.md`](./evaluations/2026-06-15-fas21-callables-guard-inventory.md) |
| **22** | Hex→tokens P0 · doc-synk · typecheck expansion | **done** 2026-06-15 | [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) Fas 22-rad |
| **23** | USER smoke #3/#4 · Valv biometri (App Check CI) · Familjen scroll | **done** 2026-06-15 | [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) Fas 23-rad |
| **19.5** | `evolution_ledger` dual-write | **done** 2026-06-15 | [`2026-06-15-fas19-5-evolution-ledger-dual-write.md`](./evaluations/2026-06-15-fas19-5-evolution-ledger-dual-write.md) |
| 19.6 | Arkiv-batch PMIR | **done** 2026-06-15 | [`2026-06-15-fas19-archive-pmir.md`](./evaluations/2026-06-15-fas19-archive-pmir.md) · [`archive/evaluations-fas19-6-2026-06/`](./archive/evaluations-fas19-6-2026-06/) |

**Eval-serie Fas 13–19 (aktiv mapp):** [`evaluations/`](./evaluations/) — planerad arkiv: [`archive/evaluations-fas19-2026-06/`](./archive/evaluations-fas19-2026-06/) (efter 19.6 PMIR).

**Fas 20 (levererad):** Tier-1 doc-synk · hex→tokens P0 (delvis) · arkiv-batch 2.

**Fas 21 (levererad 2026-06-15):** App Check guards (6 callables) · JOY-17 prod-wire · arkiv-batch 3 · Oracle hex→tokens · deploy hosting + functions.

**Fas 22 (levererad 2026-06-15):** Hex→tokens P0 · doc-synk · `typecheck:core-strict` (+morning) · hosting deploy.

**Fas 23 (levererad 2026-06-15):** Familjen scroll (23.1) · Valv biometri + App Check CI (23.2) · USER #3/#4 PASS + doc-synk (23.3).

**Nästa våg:** App Check Console (USER) · content våg 31 verify.

---

## Arkitekturlagar (Superhub — obligatoriska)

Källa: [`.context/system-plan.md`](../.context/system-plan.md) § Fas 6 Arkitekturlagar.

1. **Konsolidering:** All inmatning centraliseras till Universal Input Hubs per zon — inga nya spridda formulär.
2. **Kontextmedvetna zoner:** CSS Färgburkar (Obsidian Calm) + metadata (`zone`, `inputMode`, `content_class`, silo-säker routing).
3. **Djupanalys före implementation:** Kartlägg ingångar, WORM/silo-gränser, smoke-kriterier — godkänn plan innan kod.
4. **Strikt låsning:** Efter godkänd leverans — registrera i `locked-ux-features.md`; kärnlogik ändras endast med explicit OK (Pontus) + PMIR.

**Leveransordning per zon:** Djupanalys → SPEC → migrering → smoke → lås.

---

## Referenser

| Dokument | Roll |
|----------|------|
| [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md) | Analysprompter A–E, Sacred register |
| [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) | G1–G16 + F8 done |
| [`.context/locked-ux-features.md`](../.context/locked-ux-features.md) | Låsta produktflöden §1–17 |
| [`INNEHALL-REGISTER.md`](./INNEHALL-REGISTER.md) | U6 content_class routing |
| [`evaluations/2026-06-11-FOEBATTRINGSPLAN-HELAPP.md`](./evaluations/2026-06-11-FOEBATTRINGSPLAN-HELAPP.md) | Master förbättringsplan |
| [`BRANCH-KARTA.md`](./BRANCH-KARTA.md) | Git trunk `main` |
