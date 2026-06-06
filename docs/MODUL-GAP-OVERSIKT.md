# Modul-GAP — översikt (2026-05-31)

**Syfte:** En sida — vad som är **klart i kod**, vad som är **öppet per modul**, och vad som körs **autonomt** vs **kräver dig**.

**Arkiv (G1–G16):** [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — alla **done**.  
**Modulregister:** [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) · **Cursor-plan mall:** [`evaluations/MALL-cursor-plan.md`](./evaluations/MALL-cursor-plan.md)  
**Plan-register:** [`evaluations/2026-05-26-session-landning.md`](./evaluations/2026-05-26-session-landning.md)  
**PMIR batch:** [`evaluations/2026-05-29-pmir-modul-rollout-batch.md`](./evaluations/2026-05-29-pmir-modul-rollout-batch.md)  
**Master YOLO (hela kön):** [`MASTER-YOLO-AUTORUN.md`](./MASTER-YOLO-AUTORUN.md) · `npm run master:yolo` · state [`.orkester/master-state.json`](../.orkester/master-state.json)

---

## Cursor-planer (2026-05-29) — **`closed`** (plan)

Alla planfiler har `status: closed` överst. **Öppet arbete finns endast i tabellen Modul-GAP nedan** — inte i planerna.

| Modul | Plan | Plan-status | Smoke 2026-05-29 |
|-------|------|-------------|------------------|
| Dagbok | [`dagbok-vertex-plan`](./evaluations/2026-05-29-dagbok-vertex-plan.md) | **closed** | build · orkester · locked-ux **PASS** |
| Planering | [`planering-cursor-plan`](./evaluations/2026-05-29-planering-cursor-plan.md) | **closed** | locked-ux **PASS** |
| MåBra | [`mabra-cursor-plan`](./evaluations/2026-05-29-mabra-cursor-plan.md) | **closed** | build · orkester **PASS** |
| Projekt | [`projekt-cursor-plan`](./evaluations/2026-05-29-projekt-cursor-plan.md) | **closed** | locked-ux **PASS** |
| Kunskap | [`kunskap-cursor-plan`](./evaluations/2026-05-29-kunskap-cursor-plan.md) | **closed** | orkester/innehall **PASS** |
| Barnporten | [`barnporten-cursor-plan`](./evaluations/2026-05-29-barnporten-cursor-plan.md) | **closed** | locked-ux **PASS** |
| Valv Samla | [`valv-samla-cursor-plan`](./evaluations/2026-05-29-valv-samla-cursor-plan.md) | **closed** (delvis kod) | locked-ux **PASS** |
| Valv Privacy | [`valv-privacy-cursor-plan`](./evaluations/2026-05-29-valv-privacy-cursor-plan.md) | **closed** (deferred 2.1) | — |
| Kompass widget | [`kompass-widget-snabbstart-plan`](./evaluations/2026-05-29-kompass-widget-snabbstart-plan.md) | **closed** | K1 integrerad |

---

## Arkiv-GAP (backend / minne)

| ID | Status | Kort |
|----|--------|------|
| G1–G16 | **done** | Valv-RAG, Vector ANN, Drive E2E, journal_woven opt-in, Barnen-RAG, inkorg, Tidshjul, m.m. |
| V1 | **wait** | Genkit-migrering — ej påbörjad |

---

## Modul-GAP (produkt / UI) — öppet

| Modul | Route | Gap / nästa | Kommando / vem |
|-------|-------|-------------|----------------|
| **dagbok** | `/dagbok` | Fas 1–4 **done** · storage deploy **done** | manuell smoke #2d |
| **mabra** | `/mabra` | §5 guardrail + §3 Vit djup-länk + **IA Våg 3 kompakt UI** | **done** 2026-05-30 |
| **planering** | `/planering?tab=handling` | Fas 2 **done** (PLANERING_MORE_TABS, Paralys Fokus) · Master YOLO hub-gora | **done** |
| **projekt** | `/projekt` | MaterialPack **done** · `project_rules` Firestore **done** 2026-06-01 | deploy rules · test `/projekt/regler` |
| **kompis/kunskap** | Valv `kunskapsbank` | Fas 1.5 **done** · Fas 2 seed-bank | `specialist-kunskap-seed` |
| **barnporten** | `/barnporten` | P1 + CB1 **done** · manuell smoke #3 · QR CB2+ | `kör manuell smoke #3` |
| **valv** | `/dagbok?tab=bevis` | Vävaren HITL **done** 2026-05-31 (`weaver_pending`, approve/reject) | [`2026-05-31-pmir-session-rniv`](./evaluations/2026-05-31-pmir-session-rniv.md) |
| **core** | `/` | Manuell smoke #3, #4, #2d kvar · #1–2, #18 **PASS** | Du · [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) **Current truth** |
| **inkast** | Hem `#inkast-lite` | **CaptureSuper Fas 1–3 done** · **InboxReviewQueue canonical Valv** · kompass-variant | [`2026-06-06-upload-unified-cursor-plan.md`](./evaluations/2026-06-06-upload-unified-cursor-plan.md) |
| **liv** | `/vardagen` launcher | **LivSuper Fas 1–3 done** 2026-06-06 — kortgrid · `VardagenShellPage` raderad | [`2026-06-06-liv-super-cursor-plan.md`](./evaluations/2026-06-06-liv-super-cursor-plan.md) |
| **dossier** | `/dossier` | BBIC `reportType` **planned** | Spec §I.4 |
| **ekonomi** | `/liv?tab=kompasser&vardagenTab=ekonomi` | Routing superhub **live** 2026-06-01 · sparmål UI **done** · lönespec vardag **done** | [`LOST-FEATURES-REGISTER.md`](./evaluations/LOST-FEATURES-REGISTER.md) |
| **hamn** | `/hamn` | BIFF via `TryggHamnHub` | `smoke:design-modules` |
| **auth/android** | app | **Verifierad 2026-05** | [`.context/android-capacitor.md`](../.context/android-capacitor.md) |

**Låst UX:** Barnfokus, Valv Mönster/Orkester/Kunskapsbank, Planering P3, ikoner B1/D1/M2 — `npm run smoke:locked-ux` **PASS**.

---

## Autorun (ingen LLM)

```bash
npm run orkester:night
```

---

## Kräver dig

1. **Manuell smoke** — [`2026-05-29-smoke-manuell.md`](./evaluations/2026-05-29-smoke-manuell.md)
2. **Kunskap våg 8 ingest** — efter granskning (`seed_kampspar_profile`)

---

## Ett steg i taget (Fas 5A — 2026-05-31)

| Prioritet | Gör |
|-----------|-----|
| 1 | **Du:** Vävaren HITL i prod — [`evaluations/2026-05-31-fas5a-user-checklist.md`](./evaluations/2026-05-31-fas5a-user-checklist.md) |
| 2 | **Du:** Manuell smoke #3, #4, #2d, projektbild — uppdatera [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) |
| 3 | Agent: `npm run smoke:locked-ux` + `smoke:orkester` (klart vid Fas 5A prep) |
| 4 | Nästa kod: Fas 5B Valv/Hamn polish — **done** på `main` |
