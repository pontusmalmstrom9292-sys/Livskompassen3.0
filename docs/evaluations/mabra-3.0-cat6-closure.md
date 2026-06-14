# MåBra 3.0 — Kategori 6 avslut (Prova nya saker)

**Datum:** 2026-06-14  
**Status:** **KLAR** — P6-A + P6-B levererade och deployade  
**Kanon:** [`MABRA-PARALLEL-MASTER.md`](../specs/modules/MABRA-PARALLEL-MASTER.md) · [`MABRA-3.0-MASTER-SPEC.md`](../specs/modules/MABRA-3.0-MASTER-SPEC.md)

---

## 1. Sammanfattning

Kategori 6 (**Prova nya saker**) är implementerad som isolerad Vit-silo-modul:

- Ny mutable collection `mabra_explore_queue/{uid}` med strikta Firestore-regler (deployad).
- Deterministisk veckogenerering från kuraterad PLAY-pool — **ingen LLM** (Fas 1).
- UI-panel + hub-ingång under `/mabra/verktyg/explore_weekly`.
- **Ingen** Valv-, Kunskap-RAG- eller `children_logs`-koppling.

**Produktionsstatus:** Hosting deployad 2026-06-14 · Firestore rules deployad samma dag.

---

## 2. Artefakter (levererade sökvägar)

| Artefakt | Sökväg |
|----------|--------|
| UI-panel | `src/modules/features/dailyLife/wellbeing/mabra/components/MabraExplorePanel.tsx` |
| Task picker | `src/modules/features/dailyLife/wellbeing/mabra/lib/exploreTaskPicker.ts` |
| Katalog | `src/modules/features/dailyLife/wellbeing/mabra/content/exploreTaskCatalog.ts` |
| Skip-lagring (Zero Footprint) | `src/modules/features/dailyLife/wellbeing/mabra/lib/exploreSkipStorage.ts` |
| Firestore service | `src/modules/features/dailyLife/wellbeing/mabra/api/mabraExploreQueueService.ts` |
| Hub-entry | `src/modules/features/dailyLife/wellbeing/mabra/mabraHubRegistry.ts` (`explore_weekly`) |
| Route | `src/modules/features/dailyLife/wellbeing/mabra/views/MabraToolView.tsx` |
| Collection-konstant | `src/modules/core/types/firestore.ts` → `mabra_explore_queue` |
| Manifest / offline | `masterManifest.ts`, `offlineWritePolicy.ts` |

> **Not:** Planerad sökväg `src/modules/features/mabra/explore/` användes inte — implementation följer befintlig MåBra-trädstruktur under `dailyLife/wellbeing/mabra/`.

---

## 3. Firestore-regler (`mabra_explore_queue`)

**Collection:** `mabra_explore_queue/{uid}`

| Operation | Policy |
|-----------|--------|
| read | `isAuthenticated()` + `request.auth.uid == uid` |
| create | uid-match + `isOwnerCreate()` + `isValidMabraExploreWrite()` |
| update | uid-match + `isOwner()` + `isValidMabraExploreUpdate()` |
| delete | `false` |

**Tillåtna fält (`hasOnly`):**

- `userId`, `ownerId`
- `availableTasks` — lista (max 12 objekt)
- `completedTasks` — lista (max 100 id-strängar, append-only vid update)
- `lastGenerated`, `updatedAt` — timestamp

**Task-objekt i `availableTasks`:**

| Fält | Typ | Validering |
|------|-----|------------|
| `id` | string | `MB-PLAY-*` eller `explore-*` (regex) |
| `titel` | string | 1–120 tecken |
| `kategori` | string | `budget_low` \| `social_safe` \| `solo` \| `energy_low` \| `play` \| `micro` |
| `budgetgrans` | int | 0–3 (ASCII — rules-kompilatorn accepterar inte `ä`) |
| `isSocial` | bool | — |

**Anti-injektion:** Inga fält från `reality_vault`, `children_logs`, RAG eller Valv tillåts i `hasOnly`-listan.

**Deploy:** `firebase deploy --only firestore:rules` — exit 0 (2026-06-14).

---

## 4. Kölogik

### 4.1 Veckogenerering (`exploreTaskPicker.ts`)

- **Veckonyckel:** ISO `YYYY-Www` via `isoWeekKey()`.
- **Pool:** `EXPLORE_TASK_POOL` från `exploreTaskCatalog.ts` (MABRA_EXTENDED_PLAYS + metadata).
- **Filter:** Minst ett av `budget_low`, `social_safe`, `solo`, `energy_low`.
- **Slump:** FNV-1a deterministisk seed per `weekKey|uid|filter|index` — samma vecka ger samma uppgifter.
- **Regenerering:** Om `lastGenerated` tillhör annan vecka → ny `availableTasks`-lista.

### 4.2 Skip-kö (affärsregel max 5)

- **Persistens:** `localStorage` (`exploreSkipStorage.ts`) — Zero Footprint, ej Firestore.
- **Rotation:** `pickCurrentExploreTask()` roterar med `skipCount` (cappat till 5).
- **Vid klarmarkering:** skip-räknare nollställs.

### 4.3 Klarmarkering

- `completedTasks` append-only mot Firestore (prefix bevaras i rules).
- Valfri `mabra_sessions` med `exerciseType: explore_done` + `playBankId`.

### 4.4 Katalog (`exploreTaskCatalog.ts`)

- Mappar `MABRA_EXTENDED_PLAYS` → `ExploreTaskMeta` med kategori, budgetgrans, isSocial.
- `toExploreTaskId()`: `MB-PLAY-*` behålls; övriga bankIds → `explore-{slug}` (rules-säker).

---

## 5. Silo-efterlevnad

| Krav | Status |
|------|--------|
| Ingen `knowledgeVaultQuery` | ✓ |
| Ingen `valvChatQuery` | ✓ |
| Ingen auto-promote till `reality_vault` | ✓ |
| Ingen `children_logs` | ✓ |
| Ingen streak/XP | ✓ |
| Tre silos (U1) | ✓ — endast Vit + mutable profil |

---

## 6. Smoke & byggverifiering (2026-06-14)

### 6.1 `npm run build`

**PASS** — TypeScript + Vite utan fel.

### 6.2 `npm run smoke:mabra`

| Steg | Resultat | Kat 6-relevans |
|------|----------|----------------|
| Anonymous sign-in | OK | — |
| `mabra_sessions` WORM create | OK | Indirekt (`explore_done` stöds i klient) |
| `mabraCoach` guardrail | OK | — |
| `mabraCoach` coach | OK | — |
| `mabraCoach` transformator | OK | — |
| **`vit_hub` ensure** | **FAIL** `PERMISSION_DENIED` | **Ej Kat 6** — kräver `isSensitiveAuth()` (verifierad e-post) |
| `vit_entries` / `vit_chat` | Ej nådd | Ej Kat 6 |

**Slutsats för Kat 6-produktionssäkerhet:**

`vit_hub`-felet **blockerar inte** Kat 6. Orsak: `scripts/smoke_mabra.mjs` använder anonym inloggning; `vit_hub` kräver verifierad e-post enligt `firestore.rules` (`isOwnerCreateSensitive()`). Kat 6 skriver endast till `mabra_explore_queue` med `isAuthenticated()` — **oberoende** av `vit_hub`.

**Kat 6-godkänd delmängd:** Alla steg före `vit_hub` PASS. Bygg PASS. Rules deploy PASS. Hosting deploy PASS.

**Uppföljning (ej Kat 6):** Uppdatera `smoke_mabra.mjs` med verifierad testanvändare eller markera `vit_hub`+ som `SKIP` för anonym smoke — separat ticket.

---

## 7. Acceptanskriterier (§10 MABRA-PARALLEL-MASTER)

| # | Kriterium | Status |
|---|-----------|--------|
| 1 | `mabraCoach` läser inte `reality_vault` | ✓ (oförändrat) |
| 2 | Ingen `knowledgeVaultQuery` från Kat 6 UI | ✓ |
| 6 | Skip-kö stoppar vid 5 | ✓ (localStorage + UI) |
| 7 | Ingen streak/XP | ✓ |
| 8 | `npm run build` | ✓ |

---

## 8. Öppet (ej blockerande för stängning)

| Item | Fas | Notering |
|------|-----|----------|
| `MB-PLAY-EXPLORE-*` dedikerad bank | P0 innehåll | Återanvänder `MABRA_EXTENDED_PLAYS` tills kurator seedar |
| `INNEHALL-REGISTER` EXPLORE-rader | P0 | Planerat prefix |
| `mabraCoach` parafras (Fas 2) | P3 | Valfri — Fas 1 utan LLM |
| `evolution_hub` read för `energy_low` | P2 | Filter finns; kapacitetsread planerad |
| Full `smoke:mabra` exit 0 | Infra | `vit_hub` kräver verified email i smoke |

---

## 9. Nästa spår

**Kategori 5 (Målsättning)** — se rekommendation i avslutande PMIR-dialog: analysera `evolution_hub` + `user_daily_focus` / `morningStore` före wizard-implementation.

---

**Sign-off:** Kat 6 stängd för parallell koordinering. Uppdatera [`MABRA-PARALLEL-MASTER.md`](../specs/modules/MABRA-PARALLEL-MASTER.md) §5 → **KLAR**.
