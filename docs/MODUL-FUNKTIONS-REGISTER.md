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
| **inkast** | hem | `/#inkast-lite` | Inkast Lite | — | — |

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
