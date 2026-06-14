# Livskompassen — System Plan v2 (Fas 9+)

**Datum:** 2026-06-14  
**Kanon:** Aktiv styrning från Fas 9. Historik Fas 1–7 → [`.context/system-plan.md`](../.context/system-plan.md)  
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

**Current truth:** [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) (2026-06-11)

| Kategori | Status |
|----------|--------|
| `npm run build` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:orkester` | **PASS** |
| Manuell #3 Valv, #4 Barnporten | **PASS** (USER 2026-06-06/07) |
| `typecheck:core-strict` | **baseline** — 9 fel (ej blockerande build) |

**Hosting:** https://gen-lang-client-0481875058.web.app

---

### Modulstatus per zon (kort)

| Zon | Route | Backend | Öppet |
|-----|-------|---------|-------|
| **Hjärtat** | `/hjartat` | journal WORM, Vävaren HITL, speglingsMirror | Superdagbok ej migrerad |
| **Vardagen** | `/vardagen` + externa | kompasser, ekonomi, mabraCoach | Super-Planering/Arbetsliv ej påbörjad |
| **Familjen** | `/familjen` | childrenLogsQuery, analyzeMessage | PDF export partial; push defer |
| **Valv** | `/valvet` | valvChatQuery, generateDossier, EntityProfile | BBIC reportType |
| **Barnporten** | `/barnporten` | pairing callables | Push notifications defer |

**SynapseBus:** Alla 4 handlers **live** (driveIngest, journalWoven, dcapAlert, paralysBrytaren).

Produkt-GAP: [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md)

---

## Kommande moduler (planeras en i taget)

<!-- TOM — fylls när Pontus säger "kör [modul]" -->

| Prioritet | Modul | Fas | Status | Spec |
|-----------|-------|-----|--------|------|
| — | — | — | — | — |

### Superhub-kö (föreslagen ordning — ej godkänd)

1. **Fas 9** — Super-Planering Input (`/planering`)
2. **Fas 10** — Super-Arbetsliv Input (`/arbetsliv`)
3. **Fas 11** — Superdagbok (`/hjartat?tab=reflektion`)

**Regel:** Djupanalys + eval → SPEC → migrering 8A→E → smoke → lås i `locked-ux-features.md`. Se Arkitekturlagar nedan.

### Produkt-backlog (ej superhub)

- Dossier BBIC `reportType`
- Kunskap content våg 8 (53 FACT partial) — [`content/CONTENT-WAVES.md`](./content/CONTENT-WAVES.md)
- Barnporten push (Våg C)
- Genkit migration (V1 — **wait**)

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
| [`.context/locked-ux-features.md`](../.context/locked-ux-features.md) | Låsta produktflöden §1–14 |
| [`INNEHALL-REGISTER.md`](./INNEHALL-REGISTER.md) | U6 content_class routing |
| [`evaluations/2026-06-11-FOEBATTRINGSPLAN-HELAPP.md`](./evaluations/2026-06-11-FOEBATTRINGSPLAN-HELAPP.md) | Master förbättringsplan |
| [`BRANCH-KARTA.md`](./BRANCH-KARTA.md) | Git trunk `main` |
