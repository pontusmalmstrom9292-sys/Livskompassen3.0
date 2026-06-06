# Supermodule Master Plan — syntes av 5 analyser

**Datum:** 2026-06-06  
**Bas:** main @ ddaf98d2 · Block A+B klart · hosting deployad  
**Kanon:** [`2026-06-06-cursor-native-autorun.md`](./2026-06-06-cursor-native-autorun.md) · [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md)

---

## Mönster (etablerat)

| SuperModule | Variant-router | Status |
|-------------|----------------|--------|
| `CaptureSuperModule` | hem-capture · hem-inkast · valv-compact · planering · kompass | **Fas 1–3 done** |
| `SpeglarSuperModule` | dagbok · forensic | **Fas 2 done** |
| `ValvSuperModule` | samla · analysera · kunskap · exportera · forensik | **Fas 1 done** |
| `DagbokSuperModule` | reflektion · forensic-readonly | **Fas 1 done** |

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
| `VaultPage.tsx` | Gate + chrome (TabBar) + shared logs state |

**Oförändrat (locked UX):** `VaultMonsterPanel`, `VaultOrkesterPanel`, `VaultKunskapsbankPanel`, `VaultAktorskartaPanel`, `InboxReviewQueue` i `VaultSamlaHub`.

**Fas 2 (DEFER):** `VaultOverviewPanel` · flytta sub-TabBar in i zoner · `?samlaView` URL-sync.

---

### 2. DagbokSuperModule — **DONE 2026-06-06**

**Problem:** `JournalArchive` duplicerades mellan Dagbok reflektion och Valv forensic (`dagbok_arkiv`).

| Fil | Roll |
|-----|------|
| `DagbokSuperModule.tsx` | `reflektion` · `forensic-readonly` |
| `JournalArchiveReadonly.tsx` | Canonical readonly-lista |
| `DagbokPage` (feature) | Arkiv-läge → `JournalArchiveReadonly` |
| `VaultForensicPanel` | `dagbok_arkiv` → `DagbokSuperModule` |

**Kvar:** `#2d` bilaga → `journal_memories/` (manuell smoke).

**Smoke:** `smoke:locked-ux` + `smoke:vault-worm` — PASS

---

### 3. PlaneringSuperModule — **DEFER (låg risk)**

**Mål:** Aktivera `CaptureSuperModule variant="planering"` i PlaneringHub (variant finns redan).

**Scope:** Byt inline capture → `CaptureSuperModule`; behåll `InboxReviewQueueLink` (ej duplikat kö).

**Kanon:** [`2026-06-06-upload-unified-cursor-plan.md`](./2026-06-06-upload-unified-cursor-plan.md) Fas 2.

---

### 4. LivsloggSuper → BarnfokusSuper — **DEFER (lägst PMIR-risk)**

**Mål:** Familjen `?tab=reflektion` + `?tab=livslogg` under en router; Barnfokus som sub-variant.

**Oförändrat:** `BarnfokusFraganPanel`, `BARNFOKUS_QUESTIONS`, optimistic save.

**Kanon:** K2 familj-svar · `.context/locked-ux-features.md`

---

### 5. CaptureSuper v2 — **DEFER (backend-touch)**

**Mål:** En review-kö, G10-routing via `driveIngestSynapse`.

**Scope:** Konsolidera `ReviewQueuePanel` (Hem) + `InboxReviewQueue` (Valv) till en pipeline-UX — **ingen fjärde silo**.

**Risk:** Callable/synapse-ändring — deploy functions krävs.

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
| DagbokSuper (plan) | locked-ux + vault-worm |
| PlaneringSuper (plan) | design-modules + rollout static |
| BarnfokusSuper (plan) | locked-ux + `smoke:children` |

---

## Kvar för dig (manuellt)

| Punkt | Var |
|-------|-----|
| **#2d bilaga** | Dagbok → Reflektera → fil &lt;5 MB → `journal_memories/` |
| Valfritt visuellt | Hem en Skriv-yta; Speglar Fortsätt-knapp i ACT |

---

## Nästa steg (1)

**PlaneringSuperModule** — aktivera `CaptureSuperModule variant="planering"` i PlaneringHub.
