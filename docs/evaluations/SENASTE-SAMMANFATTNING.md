# Senaste sammanfattning — systemstatus

**Datum:** 2026-06-06 · **Gren:** `main`  
**Senaste leverans:** Barnporten polish **hosting live** · MaterialPack Våg A (Familjen-hub) · build + smoke **PASS**

---

## Nuläge i en mening

**Barnporten CB2–CB4 + QR PASS (Motorola)** · Fas 5A #4 **PASS** · #3 Valv backend/static **PASS** — **USER UI (Shield→PIN→spara) kvar** · MaterialPack genvägar på Familjen (ej ännu redeployad till hosting efter commit).

---

## Vad som är byggt (bevara)

| Område | Status |
|--------|--------|
| **MaterialPack Våg A** | `MaterialPackShortcuts` på Familjen (`hub="familjen"`) under CognitiveLoadStrip · MåBra + Hamn redan live |
| **Barnporten Våg A** | CB2–CB4 widget-varianter · `BarnportenWidget` variant-fabrik · CB2 default · mockups CB2–CB4 |
| **Barnporten Våg B** | QR enhetskoppling · `createBarnportenPairing` + `claimBarnportenPairing` live · `firestore.rules` deployad · `barnporten_devices` |
| **Barnporten P1** | Hub 2×2 · inkorg HITL §7b · offline-kö · PWA manifest (`useBarnportenWebManifest`) · CB1 fallback · polish: alias + needs_auth + `?pair=` prompt |
| **Functions callables** | `index.ts` split → `callables/{valv,inbox,knowledge,agents,shared}.ts` · exports oförändrade (`032b84f7`) |
| **Adaptiv Hemkompass polish** | `HomeAdaptiveCompass` — ParalysPanel, KasamEvening, KompassradPanel, fasväljare, `home_snabbval` |
| **Modulväljare rollout** | Planering · Ekonomi · Liv previews · Hem Capture · MåBra · Projekt · Valv zon |
| CaptureSuperModule | Fas 1–3 + **v2** — kompass, hem, valv, planering; ReviewQueuePipelinePanel |
| InboxReviewQueue | Canonical i VaultSamlaHub |
| LivSuper Fas 1–3 | Kortgrid · LivBackLink · VardagenShellPage raderad |
| Drogfrihet | Flik i `/familjen` · legacy redirect |
| ValvSuperModule | Fas 1 + **Fas 2** — sub-TabBar i zoner |
| DagbokSuperModule | Fas 1 — reflektion + forensic-readonly |
| K2 domän-svar | speglar · valv · familj · meny · mabra |
| Locked UX + silos | Oförändrat · `smoke:locked-ux` **PASS** · Fas 5A #3 Valv batch **PASS** 2026-06-06 |
| **Android** | `build:web` + `cap sync` **PASS** 2026-06-06 14:28 CEST (2.4s) · Run PASS Motorola 2026-06-06 |

---

## Öppet (kräver dig)

| Punkt | Var |
|-------|-----|
| **Fas 5A #3 Valv** | Agent **PASS** (build + 8 smokes) · **USER UI kvar** — Shield 3 s → PIN → spara post · [`2026-06-01-USER-nasta-steg.md`](./2026-06-01-USER-nasta-steg.md) §A |
| **Fas 5A #4 Barnporten** | **PASS** 2026-06-06 — QR + loggrad · Motorola |
| **#2d bilaga** | **done** — `smoke:journal-2d` + rollout checklist PASS |
| **Kunskap våg 8** | **done** — 53 FACT seedade |
| **Barnporten Våg C (push)** | Defer — FCM/kostnad · PMIR krävs |

---

## Kanon

| Tier | Fil |
|------|-----|
| Barnporten PMIR | [`2026-06-06-pmir-barnporten-cb2plus.md`](./2026-06-06-pmir-barnporten-cb2plus.md) |
| 1h autonom rapport | [`2026-06-06-1h-autonom-rapport.md`](./2026-06-06-1h-autonom-rapport.md) |
| Multitask rapport | [`2026-06-06-multitask-rapport.md`](./2026-06-06-multitask-rapport.md) |
| Modulväljare rollout | [`2026-06-06-modulvaljare-rollout-done.md`](./2026-06-06-modulvaljare-rollout-done.md) |
| Upload plan | [`2026-06-06-upload-unified-cursor-plan.md`](./2026-06-06-upload-unified-cursor-plan.md) |
| Liv launcher | [`2026-06-06-liv-super-cursor-plan.md`](./2026-06-06-liv-super-cursor-plan.md) |
| USER checklist | [`2026-06-01-USER-nasta-steg.md`](./2026-06-01-USER-nasta-steg.md) |
| Locked UX | [`.context/locked-ux-features.md`](../../.context/locked-ux-features.md) §7–7b |
