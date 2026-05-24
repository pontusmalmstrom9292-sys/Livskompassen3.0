# Modul- & funktionsregister — Livskompassen v2

**Syfte:** En sammanställd sanning — modul, route, backend, spec, smoke.  
**Uppdaterad:** 2026-05-24 (Del B)  
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

| Modul | Route(s) | Nyckelfunktioner | Spec | Smoke |
|-------|----------|------------------|------|-------|
| **core** | `/`, `/dev/themes`, `/widget/*` | App-shell, Theme Pack I, FyrenSmartWidgetBar, drawer, Zero Footprint | `Core-SPEC.md` | `smoke:locked-ux`, `smoke:design-modules` |
| **kompasser** | `/vardagen`, `/kompasser` → redirect | Morgon/dag/kväll, checkins | `De-3-Kompasserna-SPEC.md` | `smoke:compass` |
| **kompis** | `/vardagen?tab=kunskap` | Kunskapsvalv, Tidshjul, RAG | `Kunskap-SPEC.md` | `smoke:kunskap`, `smoke:tidshjul` |
| **ekonomi** | `/ekonomi` → vardagen | Ekonomi-flik | `Ekonomi-SPEC.md` | manuell #18 |
| **dagbok** | `/dagbok` | Hjärtat-hub, journal | `Dagbok-SPEC.md` | — |
| **verklighetsvalvet** | `/dagbok?tab=bevis`, `/valv` | WORM bevis, **Mönster**, **Orkester**, PIN/Shield | `Verklighetsvalvet-SPEC.md` | `smoke:locked-ux`, `smoke:valv` |
| **valv_chatt** | Bevis → Sök | Valv-Chat (egen silo) | `Valv-Chat-SPEC.md` | `smoke:valv` |
| **speglings_system** | `/dagbok?tab=speglar` | Speglar, Zero Footprint session | — | `smoke:speglar` |
| **safe_harbor** | `/hamn` | BIFF, Grey Rock, `analyzeMessage` | `SafeHarbor-SPEC.md` | — |
| **barnens_livsloggar** | `/familjen` | **Barnfokus** (glädje, kunskap, knas, **lara_kanna**, …), livslogg | `Barnen-SPEC.md`, `FAMILJEN-BARNFOKUS-FRAGOR-SPEC.md` | `smoke:locked-ux`, `smoke:children` |
| **barnporten** | (PWA plan `/barnporten`) | `barnportenAgents.ts`, HITL promote — **delvis** | `BARNPORTEN-SPEC.md` | `smoke:locked-ux` (agents) |
| **mabra** | `/mabra` | KBT Transformator, reglering | `Mabra-SPEC.md` | `smoke:mabra` |
| **planering** | `/planering` | P3 Kanban, `planning_tasks` | `PLANERING-P3-KANBAN-SPEC.md`, hybrid | `smoke:locked-ux` |
| **projekt** | `/projekt` | Flexibla projekt (handling på `/planering`) | `PROJEKT-SPEC.md` | hybrid-spec |
| **dossier** | `/dossier` | Dossier-Generator, snapshots | `Dossier-SPEC.md` | `smoke:dossier` |
| **widgets** | `/widget/*` | WH1 tyst inspelning, `ingestWidgetRecording` | `WIDGET-BAR-SPEC.md` | `smoke:locked-ux` |

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
| `weaveJournalEntry` / `journalWovenToKampspar` | Dagbok → minne (opt-in) |
| `speglingsMirror` | Speglar |
| `mabraCoach` | MåBra |
| `invalidateSession` | Zero Footprint |
| `getInboxQueue` / `confirmInboxItem` | Självsorterande inkorg (G10) |
| `getEntityProfileRegistry` | Entiteter (G9) |

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

**Öppet (produkt):** manuell smoke checklist; opt-in minne-ingest; Barnporten full PWA-route.

---

## Parked (git — ej på main)

| Branch | Innehåll |
|--------|----------|
| `feat/mabra-fragekort` | Frågekort — produktbeslut |
| `feat/*` inkorg | Se [`BRANCH-KARTA.md`](./BRANCH-KARTA.md) |
