# Supermodule Master Plan — syntes av 5 analyser

**Datum:** 2026-06-06  
**Bas:** main @ c5348b56 · supermoduler + CaptureSuper v2 + ValvSuper Fas 2 · hosting: CaptureSuper v2 deployad (ValvSuper Fas 2 **ej** deployad än)  
**Kanon:** [`2026-06-06-cursor-native-autorun.md`](./2026-06-06-cursor-native-autorun.md) · [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md)

---

## Mönster (etablerat)

| SuperModule | Variant-router | Status |
|-------------|----------------|--------|
| `CaptureSuperModule` | hem-capture · hem-inkast · valv-compact · planering · kompass | **Fas 1–3 + v2 done** |
| `SpeglarSuperModule` | dagbok · forensic | **Fas 2 done** |
| `ValvSuperModule` | samla · analysera · kunskap · exportera · forensik | **Fas 1 + Fas 2 done** |
| `DagbokSuperModule` | reflektion · forensic-readonly | **Fas 1 done** |
| `PlaneringSuperModule` | inkorg · capture | **Fas 1 done** |
| `BarnfokusSuperModule` | reflektion · livslogg | **Fas 1 done** |

**Regel:** Tunn router → canonical delegate. Konsumenter importerar aldrig zonspecifika paneler direkt (smoke-guard).

---

## Prioriterad ordning (5 analyser)

### 1. ValvSuper Fas 1 — **DONE 2026-06-06**

**Mål:** Bryt `VaultPage` i zon-routers; behåll locked Mönster/Orkester/Kunskap.

| Fil | Roll |
|-----|------|
| `ValvSuperModule.tsx` | 5-zons variant-router |
| `zones/ValvSamlaZone.tsx` | Arkiv + granska + ValvChat |
| `zones/ValvAnalyseraZone.tsx` | PansaretHeader + Mönster + Orkester |
| `zones/ValvKunskapZone.tsx` | Kunskapsbank + Aktörskarta |
| `zones/ValvExporteraZone.tsx` | Dossier embedded |
| `VaultPage.tsx` | Gate + zon-TabBar + shared logs state (sub-TabBar i zoner, Fas 2) |

**Oförändrat (locked UX):** `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`, `InboxReviewQueue` i `VaultSamlaHub`.

**Fas 2 (DONE 2026-06-06):** Sub-TabBar flyttad in i zoner · `?samlaView` rensas vid tab/zone-byte · `ValvForensikZone`.

---

### 2. DagbokSuperModule — **DONE 2026-06-06**

**Problem:** `JournalArchive` duplicerades mellan Dagbok reflektion och Valv forensic (`dagbok_arkiv`).

| Fil | Roll |
|-----|------|
| `DagbokSuperModule.tsx` | `reflektion` · `forensic-readonly` |
| `JournalArchiveReadonly.tsx` | Canonical readonly-lista |
| `DagbokPage` (feature) | Arkiv-läge → `JournalArchiveReadonly` |
| `VaultForensicPanel` | `dagbok_arkiv` → `DagbokSuperModule` |

**Kvar:** `#2d` bilaga — **USER PASS** 2026-06-06 (uppdatera [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)).

**Smoke:** `smoke:locked-ux` + `smoke:vault-worm` — PASS

---

### 3. PlaneringSuperModule — **DONE 2026-06-06**

| Fil | Roll |
|-----|------|
| `PlaneringSuperModule.tsx` | `inkorg` · `capture` |
| `PlaneringPage` | `?tab=inkorg` → `variant="inkorg"` |
| `PlaneringInkorgPanel` | Översikt → `variant="capture"` + `InboxReviewQueueLink` |

**Smoke:** rollout static guards — PASS

---

### 4. BarnfokusSuperModule — **DONE 2026-06-06**

| Fil | Roll |
|-----|------|
| `BarnfokusSuperModule.tsx` | `reflektion` · `livslogg` |
| `FamiljenPage` | Delegerar båda flikar till supermodulen |

**Oförändrat:** `BarnfokusFraganPanel`, `BARNFOKUS_QUESTIONS`, optimistic save, `ParentReminderFooter`.

**Smoke:** `smoke:locked-ux` + `smoke:children` — PASS

---

### 5. CaptureSuper v2 — **DONE 2026-06-06**

**Mål:** En review-kö-pipeline — G10-routing via `driveIngestSynapse` (oförändrad backend).

**Scope:** Konsolidera `ReviewQueuePanel` (Hem) + `InboxReviewQueue` (Valv) till enhetlig UX — **ingen fjärde silo**.

| Fil | Roll |
|-----|------|
| `ReviewQueuePipelinePanel.tsx` | Hem-summary: lokalt utkast + molnet-preview + länk till Valv |
| `reviewQueuePipeline.ts` | Delade etiketter/sortering med `InboxReviewQueue` |
| `CaptureSuperModule.tsx` | `hem-capture` mountar pipeline-panel |
| `VaultSamlaHub.tsx` | Canonical `InboxReviewQueue` (HITL) — oförändrad |

**Risk:** Ingen callable/synapse-ändring — ingen functions-deploy.

---

## REASONS (master)

| | |
|---|---|
| Requirements | Fem supermoduler; minska duplikat; behåll tre silos + locked UX |
| Entities | VaultPage, DagbokPage, PlaneringHub, FamiljenPage, CapturePanel |
| Approach | Tunn variant-router per domän; smoke-guards mot direktimport |
| Structure | `*SuperModule.tsx` + `zones/` under respektive feature-mapp |
| Operations | `npm run smoke:design-modules` · `smoke:locked-ux` · `smoke:rollout` |
| Norms | Obsidian Calm · Zero Footprint · ingen cross-RAG |
| Safeguards | PMIR före DagbokSuper; WORM orörd; Mönster/Orkester orörda |

---

## Smoke-mapping

| SuperModule | Autorun |
|-------------|---------|
| CaptureSuper | `smoke:inkast` · `smoke:inbox` · design-modules |
| SpeglarSuper | `smoke:speglar` · design-modules |
| ValvSuper | design-modules · `smoke:locked-ux` · `smoke:vault-worm` |
| DagbokSuper | locked-ux + vault-worm |
| PlaneringSuper | design-modules + rollout static |
| BarnfokusSuper | locked-ux + `smoke:children` |

---

## Kvar för dig (manuellt)

| Punkt | Var |
|-------|-----|
| **Kunskap våg 8 omkörning** | `SEED_FIREBASE_EMAIL/PASSWORD` i `.env` → [`CONTENT-WAVES.md`](../content/CONTENT-WAVES.md) våg 8 |
| **Hosting deploy** | ValvSuper Fas 2 (commit `c5348b56`) — `firebase deploy --only hosting` |
| **#3 / #4 USER (valfritt)** | Autorun PASS — dubbelkolla i app om du vill · [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md) |
| Valfritt visuellt | Speglar ACT «Fortsätt till VIVIR»-knapp |

---

## Nästa steg (1)

**Kunskap våg 8 omkörning** — seed till din riktiga Firebase-användare (se `CONTENT-WAVES.md` våg 8).
